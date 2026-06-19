// ════════════════════════════════════════════════════════════
//  Command Centre — Core Type Definitions
//  src/types/index.ts
//
//  These types mirror the EXACT shape of data currently stored
//  in Supabase (project wpqpubbyqvqhcwxmzhwu, table `dashboard`,
//  row id=1, JSON blob in column `data`). Building to this contract
//  means your existing 29 tasks, buckets, projects, labels and
//  templates all load straight into the new app with zero migration.
// ════════════════════════════════════════════════════════════

// ── Primitives ──────────────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low';

export type Category = 'work' | 'personal';

export type RecurRule = '' | 'daily' | 'weekdays' | 'weekly' | 'monthly';

export type Mode = 'work' | 'personal';

export type Theme = 'dark' | 'light';

/** Top-level navigable views. Project pages use `project` + activeProjectId. */
export type Page = 'dashboard' | 'tasks' | 'focus' | 'project' | 'more';

/** Source of a task — how it entered the system. */
export type TaskSource = 'Manual' | 'Brain Dump' | 'Check-in' | 'Recurring';

// ── Checklist ───────────────────────────────────────────────

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

// ── Label ───────────────────────────────────────────────────

export interface Label {
  id: string;
  name: string;
  /** Hex colour, e.g. "#f87171" */
  color: string;
}

// ── Bucket (Trello "list" / column) ─────────────────────────

export interface Bucket {
  id: string;
  title: string;
  /** Hex colour for the column dot/accent */
  color: string;
}

// ── Task (the core entity) ──────────────────────────────────

export interface Task {
  id: string;
  text: string;

  pri: Priority;
  cat: Category;

  /** Which bucket/column this card lives in (references Bucket.id) */
  bucketId: string;
  /** Legacy mirror of bucketId — kept in sync for back-compat */
  status: string;

  done: boolean;
  /** ISO timestamp when created */
  at: string;
  /** ISO timestamp when marked done (used for "done this week", recurring) */
  doneAt?: string;

  // Rich card fields
  description?: string;
  /** ISO date string "YYYY-MM-DD", empty string if none */
  due?: string;
  checklist: ChecklistItem[];
  /** Array of Label.id references */
  labels: string[];
  /** Hex colour for the card cover stripe, empty string if none */
  cover?: string;

  // Recurrence
  recur?: RecurRule;
  /** Set on a spawned clone, points back to the task it recurred from */
  recurParentId?: string;

  // Metadata
  src?: TaskSource;
  /** Free-text reference, e.g. Notability page or meeting name */
  notability?: string;
}

// ── Project (isolated board with its own buckets + tasks) ───

export interface Project {
  id: string;
  name: string;
  desc?: string;
  /** Hex colour */
  color: string;
  /** Emoji icon */
  icon: string;
  buckets: Bucket[];
  tasks: Task[];
  labels: Label[];
}

// ── Template (pre-fills a new card) ─────────────────────────

export interface Template {
  id: string;
  name: string;
  /** Plain strings — converted to ChecklistItem[] when applied */
  checklist: string[];
}

// ── Brain Dump note log ─────────────────────────────────────

export interface Note {
  id: string;
  title: string;
  meeting?: string;
  /** First ~140 chars of the transcript, or "📷 Screenshot" */
  preview: string;
  /** Display date, e.g. "14 Jun" */
  date: string;
  /** ISO timestamp */
  at: string;
  /** Number of actions extracted */
  count: number;
  hasScreenshot: boolean;
}

// ── Personal life data ──────────────────────────────────────

export interface Trip {
  id: string;
  dest: string;
  /** ISO date "YYYY-MM-DD" */
  from: string;
  /** ISO date "YYYY-MM-DD", optional */
  to?: string;
  notes?: string;
  packing: PackingItem[];
}

export interface PackingItem {
  id: string;
  text: string;
  done: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  /** ISO date "YYYY-MM-DD" */
  start: string;
  /** ISO date "YYYY-MM-DD", optional */
  end?: string;
  location?: string;
  notes?: string;
}

// ── The complete persisted state (the Supabase JSON blob) ───
//  This is EXACTLY what lives in dashboard.data — read on load,
//  written on every change.

export interface PersistedState {
  tasks: Task[];
  buckets: Bucket[];
  projects: Project[];
  labels: Label[];
  templates: Template[];
  notes: Note[];
  trips: Trip[];
  tennis: Tournament[];
}

// ── Local-only state (localStorage, NOT synced to Supabase) ─

export interface XPState {
  xp: number;
  streak: number;
  lastActive: string | null;
  /** Task IDs pinned in the daily check-in */
  pinnedToday: string[];
  lastCheckinDate?: string;
}

export interface PomodoroMode {
  mode: 'focus' | 'short' | 'long';
}

export interface PomodoroState {
  mode: 'focus' | 'short' | 'long';
  running: boolean;
  secondsLeft: number;
  totalSeconds: number;
  session: number;
  cycles: number;
  durations: { focus: number; short: number; long: number };
  todayPomodoros: number;
  todayFocusMin: number;
  lastReset: string;
}

// ── Gamification level definitions ──────────────────────────

export interface LevelDef {
  min: number;
  title: string;
}

export const LEVELS: LevelDef[] = [
  { min: 0,    title: 'Getting Started' },
  { min: 50,   title: 'Building Momentum' },
  { min: 150,  title: 'Focused' },
  { min: 300,  title: 'In the Zone' },
  { min: 500,  title: 'In Flow' },
  { min: 800,  title: 'Locked In' },
  { min: 1200, title: 'Unstoppable' },
];

// ── Defaults ────────────────────────────────────────────────

export const DEFAULT_BUCKETS: Bucket[] = [
  { id: 'todo',    title: 'To Do',       color: '#6b7280' },
  { id: 'inprog',  title: 'In Progress', color: '#4f8ef7' },
  { id: 'blocked', title: 'Blocked',     color: '#f87171' },
  { id: 'done',    title: 'Done',        color: '#34d399' },
];

export const DEFAULT_LABELS: Label[] = [
  { id: 'l1', name: 'Urgent',    color: '#f87171' },
  { id: 'l2', name: 'Q3',        color: '#fbbf24' },
  { id: 'l3', name: 'Follow-up', color: '#4f8ef7' },
  { id: 'l4', name: 'Review',    color: '#a78bfa' },
];

export const BUILTIN_TEMPLATES: Template[] = [
  { id: 't-meeting', name: 'Meeting Follow-up', checklist: ['Send meeting notes', 'Assign action items', 'Schedule next meeting', 'Update project tracker'] },
  { id: 't-bug',     name: 'Bug Report',        checklist: ['Reproduce the issue', 'Document steps', 'Identify root cause', 'Test fix', 'Deploy & verify'] },
  { id: 't-feature', name: 'Feature Request',   checklist: ['Write requirements', 'Design mockup', 'Implement', 'Write tests', 'Deploy'] },
  { id: 't-weekly',  name: 'Weekly Review',     checklist: ['Review completed tasks', 'Check overdue items', 'Set priorities for next week', 'Update stakeholders'] },
];

export const PROJECT_COLORS = ['#4f8ef7', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#f97316', '#ec4899', '#14b8a6', '#6366f1', '#84cc16'];

export const PROJECT_ICONS = ['📋', '🚀', '🔧', '📊', '🎯', '💡', '🏗️', '📦', '🔬', '🌐', '💼', '🛠️', '📱', '⚙️', '🎨'];

export const COVER_COLORS = ['', '#4f8ef7', '#a78bfa', '#34d399', '#fbbf24', '#f87171', '#f97316', '#ec4899', '#14b8a6'];

export const RECUR_LABELS: Record<Exclude<RecurRule, ''>, string> = {
  daily: 'Daily',
  weekdays: 'Weekdays',
  weekly: 'Weekly',
  monthly: 'Monthly',
};

// ── Empty state factory ─────────────────────────────────────

export function emptyState(): PersistedState {
  return {
    tasks: [],
    buckets: structuredClone(DEFAULT_BUCKETS),
    projects: [],
    labels: structuredClone(DEFAULT_LABELS),
    templates: [],
    notes: [],
    trips: [],
    tennis: [],
  };
}
