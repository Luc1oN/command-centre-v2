// ════════════════════════════════════════════════════════════
//  Command Centre — Supabase Sync Layer
//  src/lib/supabase.ts
//
//  Talks directly to the Supabase REST endpoint (no SDK needed —
//  keeps the bundle small and matches the current app exactly).
//
//  Storage model: single row, id=1, in table `dashboard`.
//  The entire PersistedState lives in the `data` JSONB column.
//
//  Sync philosophy (carried over from the working HTML app):
//   - On load: read localStorage instantly → render → then fetch remote
//   - Remote wins if it has >= as many tasks (avoids clobbering good data)
//   - On every change: write localStorage now, debounce a remote push 800ms
//   - Offline-safe: failures degrade to localStorage, never throw to UI
// ════════════════════════════════════════════════════════════

import type { PersistedState } from '@/types';
import { emptyState } from '@/types';

// ── Config ──────────────────────────────────────────────────

const SB_URL = 'https://wpqpubbyqvqhcwxmzhwu.supabase.co';
const SB_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwcXB1YmJ5cXZxaGN3eG16aHd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA1NjY3MzEsImV4cCI6MjA5NjE0MjczMX0.ZRQwj4IDNPctaU2zgyDz16MOBjIU4XrRMS5UeBULe8A';

const SB_TABLE = `${SB_URL}/rest/v1/dashboard`;

const HEADERS = {
  apikey: SB_KEY,
  Authorization: `Bearer ${SB_KEY}`,
};

const LOCAL_KEY = 'cmdcentre_data';

// ── Sync status (subscribe from the store / a status badge) ─

export type SyncStatus = 'idle' | 'loading' | 'saving' | 'synced' | 'offline';

type StatusListener = (s: SyncStatus) => void;
const statusListeners = new Set<StatusListener>();

export function onSyncStatus(fn: StatusListener): () => void {
  statusListeners.add(fn);
  return () => statusListeners.delete(fn);
}

function emitStatus(s: SyncStatus) {
  statusListeners.forEach((fn) => fn(s));
}

// ── Normalisation ───────────────────────────────────────────
//  Guarantees every field the app relies on exists, even on data
//  written by older versions of the app. This is where we fix the
//  "orphaned task" class of bugs once, centrally, on load.

export function normalise(raw: Partial<PersistedState> | null | undefined): PersistedState {
  const base = emptyState();
  if (!raw) return base;

  const state: PersistedState = {
    tasks: Array.isArray(raw.tasks) ? raw.tasks : [],
    buckets: Array.isArray(raw.buckets) && raw.buckets.length ? raw.buckets : base.buckets,
    projects: Array.isArray(raw.projects) ? raw.projects : [],
    labels: Array.isArray(raw.labels) && raw.labels.length ? raw.labels : base.labels,
    templates: Array.isArray(raw.templates) ? raw.templates : [],
    notes: Array.isArray(raw.notes) ? raw.notes : [],
    trips: Array.isArray(raw.trips) ? raw.trips : [],
    tennis: Array.isArray(raw.tennis) ? raw.tennis : [],
  };

  const validBucketIds = new Set(state.buckets.map((b) => b.id));
  const doneBucket = state.buckets.find((b) => b.title === 'Done');
  const fallbackBucket = state.buckets[0];

  // Repair every task so it always renders on the board
  state.tasks = state.tasks.map((t) => {
    const fixed = { ...t };

    if (!fixed.cat) fixed.cat = 'work';
    if (!fixed.pri) fixed.pri = 'medium';
    if (!Array.isArray(fixed.checklist)) fixed.checklist = [];
    if (!Array.isArray(fixed.labels)) fixed.labels = [];

    // Orphaned bucketId → reassign to a sensible existing bucket
    if (!fixed.bucketId || !validBucketIds.has(fixed.bucketId)) {
      if (fixed.done && doneBucket) fixed.bucketId = doneBucket.id;
      else fixed.bucketId = fallbackBucket?.id ?? 'todo';
    }
    fixed.status = fixed.bucketId;

    return fixed;
  });

  // Repair projects similarly
  state.projects = state.projects.map((p) => ({
    ...p,
    buckets: Array.isArray(p.buckets) && p.buckets.length ? p.buckets : base.buckets,
    tasks: Array.isArray(p.tasks) ? p.tasks : [],
    labels: Array.isArray(p.labels) && p.labels.length ? p.labels : base.labels,
  }));

  return state;
}

// ── Local storage ───────────────────────────────────────────

export function readLocal(): PersistedState | null {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return null;
    return normalise(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeLocal(state: PersistedState): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // localStorage full or unavailable — ignore, remote is source of truth
  }
}

// ── Remote fetch ────────────────────────────────────────────

export async function fetchRemote(): Promise<PersistedState | null> {
  emitStatus('loading');
  try {
    const res = await fetch(`${SB_TABLE}?select=data&limit=1`, { headers: HEADERS });
    if (!res.ok) throw new Error(String(res.status));
    const rows = await res.json();
    if (rows.length > 0 && rows[0].data) {
      emitStatus('synced');
      return normalise(rows[0].data);
    }
    emitStatus('synced');
    return null;
  } catch {
    emitStatus('offline');
    return null;
  }
}

// ── Remote save (debounced) ─────────────────────────────────

let saveTimer: ReturnType<typeof setTimeout> | null = null;

export async function pushRemote(state: PersistedState): Promise<void> {
  emitStatus('saving');
  try {
    const res = await fetch(SB_TABLE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
        ...HEADERS,
      },
      body: JSON.stringify({ id: 1, data: state }),
    });
    if (!res.ok) throw new Error(String(res.status));
    emitStatus('synced');
  } catch {
    emitStatus('offline');
  }
}

/** Call on every state change. Writes local now, schedules a remote push. */
export function persist(state: PersistedState): void {
  writeLocal(state);
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(() => pushRemote(state), 800);
}

// ── Initial load orchestration ──────────────────────────────
//  Returns the best available state and reports via onLocal so the UI
//  can paint instantly from cache while the network call resolves.

export async function loadInitial(
  onLocal?: (state: PersistedState) => void
): Promise<PersistedState> {
  const local = readLocal();
  if (local && onLocal) onLocal(local);

  const remote = await fetchRemote();

  if (remote) {
    const localCount = local?.tasks.length ?? 0;
    const remoteCount = remote.tasks.length;
    // Remote wins if it has at least as many tasks (don't clobber good data)
    if (remoteCount >= localCount) {
      writeLocal(remote);
      return remote;
    }
    // Local is richer — push it up, keep local
    if (local) {
      pushRemote(local);
      return local;
    }
    return remote;
  }

  // No remote (offline or empty) — fall back to local or empty
  return local ?? emptyState();
}

// ── Recovery: scan all localStorage keys for salvageable data ──
//  Mirrors the "Recover Data" button — useful if a sync ever goes wrong.

export function recoverFromLocal(): { tasks: PersistedState['tasks']; notes: PersistedState['notes'] } {
  const tasks: PersistedState['tasks'] = [];
  const notes: PersistedState['notes'] = [];
  const seenT = new Set<string>();
  const seenN = new Set<string>();

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    try {
      const d = JSON.parse(localStorage.getItem(key) || '');
      if (!d || typeof d !== 'object') continue;
      if (Array.isArray(d.tasks)) {
        d.tasks.forEach((t: PersistedState['tasks'][number]) => {
          if (t?.id && t?.text && !seenT.has(t.id)) {
            tasks.push(t);
            seenT.add(t.id);
          }
        });
      }
      if (Array.isArray(d.notes)) {
        d.notes.forEach((n: PersistedState['notes'][number]) => {
          if (n?.id && !seenN.has(n.id)) {
            notes.push(n);
            seenN.add(n.id);
          }
        });
      }
    } catch {
      // skip non-JSON keys
    }
  }

  return { tasks, notes };
}
