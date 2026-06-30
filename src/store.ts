// ════════════════════════════════════════════════════════════
//  Command Centre HUD — central store (zustand)
//  All state + persistence. localStorage keys per the brief:
//  cc_tasks, cc_completed_sessions, cc_bookmarks_work,
//  cc_bookmarks_personal, cc_momentum, cc_idle_since (+ theme/city).
// ════════════════════════════════════════════════════════════

import { create } from 'zustand';

export type ThemeId = 'aurora' | 'mint' | 'ember' | 'violet';
export type Mode = 'dark' | 'light';
export type LaneId = 'todo' | 'prog' | 'done';
export type Priority = 'high' | 'med' | 'low';
export type BookmarkMode = 'work' | 'personal';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  status: LaneId;
  createdAt: number;
  meta?: string;
}

export type ActivityKind = 'add' | 'advance' | 'move' | 'complete' | 'session';
export interface Activity {
  id: string;
  kind: ActivityKind;
  text: string;
  ts: number;
}

export interface Bookmark {
  id: string;
  name: string;
  url: string;
  icon: string; // emoji
}

export interface City {
  name: string;
  lat: number;
  lon: number;
}

export const CITIES: City[] = [
  { name: 'Cork', lat: 51.9, lon: -8.47 },
  { name: 'Dublin', lat: 53.35, lon: -6.26 },
  { name: 'London', lat: 51.51, lon: -0.13 },
  { name: 'New York', lat: 40.71, lon: -74.01 },
  { name: 'San Francisco', lat: 37.77, lon: -122.42 },
  { name: 'Tokyo', lat: 35.68, lon: 139.69 },
  { name: 'Sydney', lat: -33.87, lon: 151.21 },
];

export const LANES: { id: LaneId; label: string }[] = [
  { id: 'todo', label: 'To Do' },
  { id: 'prog', label: 'In Progress' },
  { id: 'done', label: 'Done' },
];

const IDLE_MS = 45 * 60 * 1000;
const HISTORY = 48;

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (n: number) => Math.max(0, Math.min(100, n));

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw != null) return JSON.parse(raw) as T;
  } catch {
    /* ignore */
  }
  return fallback;
}
function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const SEED_TASKS: Task[] = [
  { id: uid(), title: 'Draft Q3 strategy deck', priority: 'high', status: 'todo', createdAt: Date.now() },
  { id: uid(), title: 'Review supplier proposals', priority: 'med', status: 'todo', createdAt: Date.now() },
  { id: uid(), title: 'Inbox zero', priority: 'low', status: 'todo', createdAt: Date.now() },
  { id: uid(), title: 'Tender evaluation model', priority: 'high', status: 'prog', createdAt: Date.now() },
  { id: uid(), title: 'Stakeholder briefing notes', priority: 'med', status: 'prog', createdAt: Date.now() },
  { id: uid(), title: 'Weekly metrics report', priority: 'med', status: 'done', createdAt: Date.now() },
];

const DEFAULT_WORK: Bookmark[] = [
  { id: uid(), name: 'Gmail', url: 'https://mail.google.com', icon: '📧' },
  { id: uid(), name: 'Slack', url: 'https://slack.com', icon: '💬' },
  { id: uid(), name: 'Claude', url: 'https://claude.ai', icon: '✨' },
  { id: uid(), name: 'Perplexity', url: 'https://perplexity.ai', icon: '🔮' },
  { id: uid(), name: 'Figma', url: 'https://figma.com', icon: '🎨' },
  { id: uid(), name: 'GitHub', url: 'https://github.com', icon: '🐙' },
];
const DEFAULT_PERSONAL: Bookmark[] = [
  { id: uid(), name: 'YouTube', url: 'https://youtube.com', icon: '▶️' },
  { id: uid(), name: 'Spotify', url: 'https://open.spotify.com', icon: '🎵' },
  { id: uid(), name: 'Reddit', url: 'https://reddit.com', icon: '👽' },
  { id: uid(), name: 'Maps', url: 'https://maps.google.com', icon: '🗺️' },
  { id: uid(), name: 'Photos', url: 'https://photos.google.com', icon: '📷' },
  { id: uid(), name: 'Notion', url: 'https://notion.so', icon: '📝' },
];

interface HudState {
  userName: string;
  theme: ThemeId;
  mode: Mode;
  city: City;

  tasks: Task[];
  activity: Activity[];

  momentum: number;
  momentumHistory: number[];
  idleSince: number;
  isIdle: boolean;

  // pomodoro
  pMode: 'focus' | 'break';
  pRunning: boolean;
  pSecondsLeft: number;
  pFocusMin: number;
  pBreakMin: number;
  sessions: number;

  // bookmarks
  bookmarkMode: BookmarkMode;
  bookmarksWork: Bookmark[];
  bookmarksPersonal: Bookmark[];

  // open task card (detail modal) — id refers to a useAppStore task
  openCardId: string | null;
  openCard: (id: string) => void;
  closeCard: () => void;

  // actions
  setTheme: (t: ThemeId) => void;
  toggleMode: () => void;
  setCity: (c: City) => void;

  addTask: (title: string, priority?: Priority) => void;
  advanceTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setTasks: (tasks: Task[]) => void;
  log: (kind: ActivityKind, text: string) => void;
  bump: (amount: number) => void;
  registerInteraction: () => void;

  pStart: () => void;
  pPause: () => void;
  pReset: () => void;
  pToggleMode: () => void;
  setDurations: (focusMin: number, breakMin: number) => void;

  setBookmarkMode: (m: BookmarkMode) => void;
  updateBookmark: (mode: BookmarkMode, id: string, patch: Partial<Bookmark>) => void;

  tick: () => void;
}

export const useHud = create<HudState>((set, get) => ({
  userName: 'Shane',
  theme: load<ThemeId>('cc_theme', 'aurora'),
  mode: load<Mode>('cc_mode', 'dark'),
  city: load<City>('cc_city', CITIES[0]),

  tasks: load<Task[]>('cc_tasks', SEED_TASKS),
  activity: [],

  momentum: clamp(load<number>('cc_momentum', 42)),
  momentumHistory: Array.from({ length: HISTORY }, () => clamp(load<number>('cc_momentum', 42))),
  idleSince: load<number>('cc_idle_since', Date.now()),
  isIdle: false,

  pMode: 'focus',
  pRunning: false,
  pSecondsLeft: 25 * 60,
  pFocusMin: 25,
  pBreakMin: 5,
  sessions: load<number>('cc_completed_sessions', 0),

  bookmarkMode: 'work',
  bookmarksWork: load<Bookmark[]>('cc_bookmarks_work', DEFAULT_WORK),
  bookmarksPersonal: load<Bookmark[]>('cc_bookmarks_personal', DEFAULT_PERSONAL),

  openCardId: null,
  openCard: (id) => set({ openCardId: id }),
  closeCard: () => set({ openCardId: null }),

  setTheme: (t) => {
    document.documentElement.setAttribute('data-theme', t);
    save('cc_theme', t);
    set({ theme: t });
  },

  toggleMode: () => {
    const mode: Mode = get().mode === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-mode', mode);
    save('cc_mode', mode);
    set({ mode });
  },

  setCity: (c) => {
    save('cc_city', c);
    set({ city: c });
  },

  registerInteraction: () => {
    const now = Date.now();
    save('cc_idle_since', now);
    set({ idleSince: now, isIdle: false });
  },

  bump: (amount) => {
    get().registerInteraction();
    const momentum = clamp(get().momentum + amount);
    save('cc_momentum', momentum);
    set({ momentum });
  },

  log: (kind, text) =>
    set((s) => ({ activity: [{ id: uid(), kind, text, ts: Date.now() }, ...s.activity].slice(0, 40) })),

  addTask: (title, priority = 'med') => {
    const t = title.trim();
    if (!t) return;
    const task: Task = { id: uid(), title: t, priority, status: 'todo', createdAt: Date.now() };
    const tasks = [task, ...get().tasks];
    save('cc_tasks', tasks);
    set({ tasks });
    get().log('add', `Added “${t}”`);
    get().bump(8);
  },

  advanceTask: (id) => {
    const order: LaneId[] = ['todo', 'prog', 'done'];
    let movedTitle = '';
    let toDone = false;
    const tasks = get().tasks.map((task) => {
      if (task.id !== id) return task;
      const next = order[(order.indexOf(task.status) + 1) % order.length];
      movedTitle = task.title;
      toDone = next === 'done';
      return { ...task, status: next };
    });
    save('cc_tasks', tasks);
    set({ tasks });
    if (movedTitle) {
      get().log(toDone ? 'complete' : 'advance', `${toDone ? 'Completed' : 'Advanced'} “${movedTitle}”`);
      get().bump(rand(9, 16));
    }
  },

  deleteTask: (id) => {
    const tasks = get().tasks.filter((t) => t.id !== id);
    save('cc_tasks', tasks);
    set({ tasks });
  },

  setTasks: (tasks) => {
    save('cc_tasks', tasks);
    set({ tasks });
  },

  pStart: () => {
    if (get().pRunning) return;
    set({ pRunning: true });
    get().log('session', `${get().pMode === 'focus' ? 'Focus' : 'Break'} session started`);
    get().bump(13);
  },
  pPause: () => set({ pRunning: false }),
  pReset: () => {
    const s = get();
    set({ pRunning: false, pSecondsLeft: (s.pMode === 'focus' ? s.pFocusMin : s.pBreakMin) * 60 });
  },
  pToggleMode: () => {
    const s = get();
    const pMode = s.pMode === 'focus' ? 'break' : 'focus';
    set({ pMode, pRunning: false, pSecondsLeft: (pMode === 'focus' ? s.pFocusMin : s.pBreakMin) * 60 });
  },
  setDurations: (focusMin, breakMin) => {
    const s = get();
    set({
      pFocusMin: focusMin,
      pBreakMin: breakMin,
      pSecondsLeft: s.pRunning ? s.pSecondsLeft : (s.pMode === 'focus' ? focusMin : breakMin) * 60,
    });
  },

  setBookmarkMode: (m) => set({ bookmarkMode: m }),
  updateBookmark: (mode, id, patch) => {
    const key = mode === 'work' ? 'bookmarksWork' : 'bookmarksPersonal';
    const list = get()[key].map((b) => (b.id === id ? { ...b, ...patch } : b));
    save(mode === 'work' ? 'cc_bookmarks_work' : 'cc_bookmarks_personal', list);
    set({ [key]: list } as Pick<HudState, 'bookmarksWork' | 'bookmarksPersonal'>);
  },

  tick: () => {
    const s = get();
    const now = Date.now();

    // Pomodoro countdown
    let { pSecondsLeft, pMode, pRunning, sessions } = s;
    if (pRunning) {
      pSecondsLeft -= 1;
      if (pSecondsLeft <= 0) {
        if (pMode === 'focus') {
          sessions += 1;
          save('cc_completed_sessions', sessions);
          get().log('session', 'Focus session complete · +22');
          get().bump(22);
          pMode = 'break';
          pSecondsLeft = s.pBreakMin * 60;
        } else {
          pMode = 'focus';
          pSecondsLeft = s.pFocusMin * 60;
        }
      }
    }

    // Momentum climb / decay
    let momentum = s.momentum;
    if (pRunning && pMode === 'focus') momentum = clamp(momentum + rand(1.6, 2.8));
    else momentum = clamp(momentum - 0.18);

    const isIdle = now - get().idleSince > IDLE_MS;
    const momentumHistory = [...s.momentumHistory, momentum].slice(-HISTORY);

    save('cc_momentum', momentum);
    set({ pSecondsLeft, pMode, sessions, momentum, momentumHistory, isIdle });
  },
}));

// Apply persisted theme + mode immediately
if (typeof document !== 'undefined') {
  document.documentElement.setAttribute('data-theme', useHud.getState().theme);
  document.documentElement.setAttribute('data-mode', useHud.getState().mode);
}
