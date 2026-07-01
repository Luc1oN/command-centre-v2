// ════════════════════════════════════════════════════════════
//  Command Centre — Global Store (Zustand)
//  src/store/useAppStore.ts
//
//  The single source of truth for the app. Holds the full
//  PersistedState plus UI state, exposes every mutating action,
//  and calls persist() automatically after each data change so
//  Supabase + localStorage stay in sync with zero manual wiring.
//
//  Components read slices with useAppStore(s => s.tasks) etc.
// ════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type {
  PersistedState,
  Task,
  Bucket,
  Project,
  Label,
  Template,
  Note,
  Trip,
  Tournament,
  Mode,
  Theme,
  Page,
  Category,
  RecurRule,
  ChecklistItem,
} from '@/types';
import { emptyState, DEFAULT_BUCKETS } from '@/types';
import { persist, loadInitial } from '@/lib/supabase';

// ── helpers ─────────────────────────────────────────────────

const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

const todayISO = () => new Date().toISOString().slice(0, 10);

function nextDueDate(fromISO: string | undefined, recur: RecurRule): string {
  const d = fromISO ? new Date(fromISO + 'T00:00:00') : new Date();
  switch (recur) {
    case 'daily':
      d.setDate(d.getDate() + 1);
      break;
    case 'weekdays':
      do {
        d.setDate(d.getDate() + 1);
      } while (d.getDay() === 0 || d.getDay() === 6);
      break;
    case 'weekly':
      d.setDate(d.getDate() + 7);
      break;
    case 'monthly':
      d.setMonth(d.getMonth() + 1);
      break;
  }
  return d.toISOString().slice(0, 10);
}

// ── store shape ─────────────────────────────────────────────

interface AppState extends PersistedState {
  // ── UI state (not persisted to Supabase) ──
  mode: Mode;
  theme: Theme;
  currentPage: Page;
  activeProjectId: string | null;
  focusModeActive: boolean;
  ready: boolean;

  // ── lifecycle ──
  init: () => Promise<void>;
  /** Internal: snapshot the persisted slice and sync it */
  _sync: () => void;
  setState2: (patch: Partial<PersistedState>) => void;

  // ── UI actions ──
  setMode: (m: Mode) => void;
  toggleTheme: () => void;
  setPage: (p: Page) => void;
  openProject: (id: string) => void;
  setFocusMode: (on: boolean) => void;

  // ── task actions ──
  addTask: (partial: Partial<Task> & { text: string }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  completeTask: (id: string) => void;
  toggleTask: (id: string) => void;
  moveTask: (id: string, bucketId: string) => void;
  deleteTask: (id: string) => void;
  clearDone: () => void;
  clearBucket: (bucketId: string) => void;

  // ── checklist ──
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;

  // ── bucket actions ──
  addBucket: (title: string) => void;
  renameBucket: (id: string, title: string) => void;
  setBucketColor: (id: string, color: string) => void;
  deleteBucket: (id: string) => void;
  moveBucket: (id: string, dir: -1 | 1) => void;

  // ── label actions ──
  addLabel: (name: string, color: string) => void;
  toggleTaskLabel: (taskId: string, labelId: string) => void;

  // ── template actions ──
  addTemplate: (name: string, checklist: string[]) => void;
  deleteTemplate: (id: string) => void;

  // ── project actions ──
  addProject: (p: Omit<Project, 'id'>) => string;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // ── life data ──
  addTrip: (t: Omit<Trip, 'id' | 'packing'>) => void;
  deleteTrip: (id: string) => void;
  addTournament: (t: Omit<Tournament, 'id'>) => void;
  deleteTournament: (id: string) => void;
  addNote: (n: Omit<Note, 'id'>) => void;
}

// ── store ───────────────────────────────────────────────────

export const useAppStore = create<AppState>((set, get) => ({
  // initial persisted slice
  ...emptyState(),

  // initial UI state
  mode: (localStorage.getItem('dashMode') as Mode) || 'personal',
  theme: localStorage.getItem('cmdDark') === '1' ? 'dark' : 'light',
  currentPage: 'dashboard',
  activeProjectId: null,
  focusModeActive: false,
  ready: false,

  // ── lifecycle ──
  init: async () => {
    const state = await loadInitial((local) => {
      // paint instantly from cache
      set({ ...local, ready: true });
    });
    set({ ...state, ready: true });
  },

  _sync: () => {
    const s = get();
    const slice: PersistedState = {
      tasks: s.tasks,
      buckets: s.buckets,
      projects: s.projects,
      labels: s.labels,
      templates: s.templates,
      notes: s.notes,
      trips: s.trips,
      tennis: s.tennis,
    };
    persist(slice);
  },

  setState2: (patch) => {
    set(patch as Partial<AppState>);
    get()._sync();
  },

  // ── UI actions ──
  setMode: (m) => {
    localStorage.setItem('dashMode', m);
    set({ mode: m });
  },

  toggleTheme: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('cmdDark', next === 'dark' ? '1' : '0');
    document.documentElement.classList.toggle('dark', next === 'dark');
    set({ theme: next });
  },

  setPage: (p) => set({ currentPage: p }),

  openProject: (id) => set({ activeProjectId: id, currentPage: 'project' }),

  setFocusMode: (on) => set({ focusModeActive: on }),

  // ── task actions ──
  addTask: (partial) => {
    const mode = get().mode;
    const task: Task = {
      id: uid(),
      text: partial.text.trim(),
      pri: partial.pri ?? 'medium',
      cat: partial.cat ?? (mode as Category),
      bucketId: partial.bucketId ?? 'todo',
      status: partial.bucketId ?? 'todo',
      done: false,
      checklist: partial.checklist ?? [],
      labels: partial.labels ?? [],
      due: partial.due ?? '',
      description: partial.description ?? '',
      recur: partial.recur ?? '',
      cover: partial.cover ?? '',
      src: partial.src ?? 'Manual',
      notability: partial.notability ?? '',
      at: new Date().toISOString(),
    };
    set((s) => ({ tasks: [...s.tasks, task] }));
    get()._sync();
  },

  updateTask: (id, patch) => {
    set((s) => ({
      tasks: s.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
    get()._sync();
  },

  completeTask: (id) => {
    const s = get();
    const t = s.tasks.find((x) => x.id === id);
    if (!t) return;
    const doneBucket = s.buckets.find((b) => b.title === 'Done');
    const updated: Task = {
      ...t,
      done: true,
      doneAt: new Date().toISOString(),
      bucketId: doneBucket?.id ?? t.bucketId,
      status: doneBucket?.id ?? t.status,
    };
    let tasks = s.tasks.map((x) => (x.id === id ? updated : x));

    // spawn recurring clone
    if (t.recur) {
      const clone: Task = {
        ...t,
        id: uid(),
        done: false,
        doneAt: undefined,
        at: new Date().toISOString(),
        due: nextDueDate(t.due, t.recur),
        recurParentId: t.id,
        checklist: t.checklist.map((c) => ({ ...c, id: uid(), done: false })),
      };
      tasks = [...tasks, clone];
    }
    set({ tasks });
    get()._sync();
  },

  toggleTask: (id) => {
    const s = get();
    const t = s.tasks.find((x) => x.id === id);
    if (!t) return;
    if (!t.done) {
      get().completeTask(id);
    } else {
      const firstBucket = s.buckets[0];
      get().updateTask(id, {
        done: false,
        doneAt: undefined,
        bucketId: firstBucket?.id ?? t.bucketId,
        status: firstBucket?.id ?? t.status,
      });
    }
  },

  moveTask: (id, bucketId) => {
    const s = get();
    const bucket = s.buckets.find((b) => b.id === bucketId);
    const isDone = bucket?.title === 'Done';
    const patch: Partial<Task> = { bucketId, status: bucketId, done: isDone };
    // auto-assign today's date when moved into a "Today" list
    const t = s.tasks.find((x) => x.id === id);
    if (bucket?.title.toLowerCase() === 'today' && t && !t.due) {
      patch.due = todayISO();
    }
    get().updateTask(id, patch);
  },

  deleteTask: (id) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }));
    get()._sync();
  },

  clearDone: () => {
    set((s) => ({ tasks: s.tasks.filter((t) => !t.done) }));
    get()._sync();
  },

  clearBucket: (bucketId) => {
    set((s) => ({ tasks: s.tasks.filter((t) => t.bucketId !== bucketId) }));
    get()._sync();
  },

  // ── checklist ──
  addChecklistItem: (taskId, text) => {
    const item: ChecklistItem = { id: uid(), text: text.trim(), done: false };
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId ? { ...t, checklist: [...t.checklist, item] } : t
      ),
    }));
    get()._sync();
  },

  toggleChecklistItem: (taskId, itemId) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              checklist: t.checklist.map((c) =>
                c.id === itemId ? { ...c, done: !c.done } : c
              ),
            }
          : t
      ),
    }));
    get()._sync();
  },

  deleteChecklistItem: (taskId, itemId) => {
    set((s) => ({
      tasks: s.tasks.map((t) =>
        t.id === taskId
          ? { ...t, checklist: t.checklist.filter((c) => c.id !== itemId) }
          : t
      ),
    }));
    get()._sync();
  },

  // ── bucket actions ──
  addBucket: (title) => {
    const bucket: Bucket = { id: uid(), title: title.trim(), color: '#6b7280' };
    set((s) => ({ buckets: [...s.buckets, bucket] }));
    get()._sync();
  },

  renameBucket: (id, title) => {
    set((s) => ({
      buckets: s.buckets.map((b) => (b.id === id ? { ...b, title } : b)),
    }));
    get()._sync();
  },

  setBucketColor: (id, color) => {
    set((s) => ({
      buckets: s.buckets.map((b) => (b.id === id ? { ...b, color } : b)),
    }));
    get()._sync();
  },

  deleteBucket: (id) => {
    set((s) => {
      const fallback = s.buckets.find((b) => b.id !== id)?.id ?? 'todo';
      return {
        buckets: s.buckets.filter((b) => b.id !== id),
        tasks: s.tasks.map((t) =>
          t.bucketId === id ? { ...t, bucketId: fallback, status: fallback } : t
        ),
      };
    });
    get()._sync();
  },

  moveBucket: (id, dir) => {
    set((s) => {
      const i = s.buckets.findIndex((b) => b.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= s.buckets.length) return {};
      const buckets = [...s.buckets];
      [buckets[i], buckets[j]] = [buckets[j], buckets[i]];
      return { buckets };
    });
    get()._sync();
  },

  // ── label actions ──
  addLabel: (name, color) => {
    const label: Label = { id: uid(), name: name.trim(), color };
    set((s) => ({ labels: [...s.labels, label] }));
    get()._sync();
  },

  toggleTaskLabel: (taskId, labelId) => {
    set((s) => ({
      tasks: s.tasks.map((t) => {
        if (t.id !== taskId) return t;
        const has = t.labels.includes(labelId);
        return {
          ...t,
          labels: has
            ? t.labels.filter((l) => l !== labelId)
            : [...t.labels, labelId],
        };
      }),
    }));
    get()._sync();
  },

  // ── template actions ──
  addTemplate: (name, checklist) => {
    const tpl: Template = { id: uid(), name: name.trim(), checklist };
    set((s) => ({ templates: [...s.templates, tpl] }));
    get()._sync();
  },

  deleteTemplate: (id) => {
    set((s) => ({ templates: s.templates.filter((t) => t.id !== id) }));
    get()._sync();
  },

  // ── project actions ──
  addProject: (p) => {
    const id = uid();
    const project: Project = {
      id,
      ...p,
      buckets: p.buckets?.length ? p.buckets : DEFAULT_BUCKETS.map((b) => ({ ...b, id: uid() })),
      tasks: p.tasks ?? [],
      labels: p.labels ?? [],
    };
    set((s) => ({ projects: [...s.projects, project] }));
    get()._sync();
    return id;
  },

  updateProject: (id, patch) => {
    set((s) => ({
      projects: s.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
    get()._sync();
  },

  deleteProject: (id) => {
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      activeProjectId: s.activeProjectId === id ? null : s.activeProjectId,
      currentPage: s.activeProjectId === id ? 'dashboard' : s.currentPage,
    }));
    get()._sync();
  },

  // ── life data ──
  addTrip: (t) => {
    set((s) => ({ trips: [...s.trips, { id: uid(), ...t, packing: [] }] }));
    get()._sync();
  },

  deleteTrip: (id) => {
    set((s) => ({ trips: s.trips.filter((t) => t.id !== id) }));
    get()._sync();
  },

  addTournament: (t) => {
    set((s) => ({ tennis: [...s.tennis, { id: uid(), ...t }] }));
    get()._sync();
  },

  deleteTournament: (id) => {
    set((s) => ({ tennis: s.tennis.filter((t) => t.id !== id) }));
    get()._sync();
  },

  addNote: (n) => {
    set((s) => ({ notes: [...s.notes, { id: uid(), ...n }] }));
    get()._sync();
  },
}));

// ── selectors (memo-friendly helpers used across components) ──

export const selectActiveTasks = (s: AppState) => s.tasks.filter((t) => !t.done);

export const selectModeTasks = (s: AppState) =>
  s.tasks.filter((t) => (t.cat || 'work') === s.mode);

export const selectActiveProject = (s: AppState) =>
  s.projects.find((p) => p.id === s.activeProjectId) ?? null;
