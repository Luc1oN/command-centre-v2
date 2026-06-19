// ════════════════════════════════════════════════════════════
//  Command Centre — Mock Data (prototype)
//  All static data for the static prototype lives here so screens
//  stay presentational. Swap this layer for the Supabase store
//  (src/store/useAppStore) when wiring real data.
// ════════════════════════════════════════════════════════════

import {
  LayoutDashboard,
  Target,
  ListTodo,
  FolderKanban,
  Calendar as CalendarIcon,
  BarChart3,
  Sparkles,
  HeartPulse,
  Activity,
  Wallet,
  Flag,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

// ── Navigation ──────────────────────────────────────────────

export type ScreenId =
  | 'today'
  | 'focus'
  | 'tasks'
  | 'projects'
  | 'calendar'
  | 'insights'
  | 'ai'
  | 'health'
  | 'tennis'
  | 'finance'
  | 'goals';

export interface NavItem {
  id: ScreenId;
  label: string;
  icon: LucideIcon;
}

export const primaryNav: NavItem[] = [
  { id: 'today', label: 'Command Centre', icon: LayoutDashboard },
  { id: 'focus', label: 'Focus', icon: Target },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  { id: 'insights', label: 'Insights', icon: BarChart3 },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
];

export const personalNav: NavItem[] = [
  { id: 'health', label: 'Health & Fitness', icon: HeartPulse },
  { id: 'tennis', label: 'Tennis', icon: Activity },
  { id: 'finance', label: 'Finance', icon: Wallet },
  { id: 'goals', label: 'Goals', icon: Flag },
];

// ── User ────────────────────────────────────────────────────

export const user = {
  firstName: 'Shane',
  fullName: 'Shane Warne',
  role: 'Strategy Lead',
  initials: 'SW',
};

// ── Shared domain types ─────────────────────────────────────

export type Priority = 'high' | 'medium' | 'low';
export type ColumnId = 'backlog' | 'doing' | 'waiting' | 'done';

// ── Today: headline metrics ─────────────────────────────────

export const todayMetrics = {
  focusScore: { value: 84, deltaPct: 12 },
  tasksDue: { value: 5, highPriority: 2 },
  meetings: { value: 3, label: 'Today' },
  focusTime: { hours: 2.4, spark: [1.2, 1.8, 1.4, 2.1, 1.9, 2.6, 2.4] },
  energy: { level: 'High', peak: '9:00 – 11:00' },
};

// ── Today: Most Important Work ──────────────────────────────

export interface ImportantItem {
  rank: number;
  title: string;
  impact: Priority;
  due: string;
}

export const mostImportantWork: ImportantItem[] = [
  { rank: 1, title: 'AI Tender Evaluation Pilot', impact: 'high', due: 'Due today' },
  { rank: 2, title: 'Digitalisation Strategy Draft', impact: 'high', due: 'Due tomorrow' },
  { rank: 3, title: 'Framework Management Review', impact: 'medium', due: 'Due Fri' },
];

// ── Active Work Board ───────────────────────────────────────

export interface BoardCard {
  id: string;
  title: string;
  priority: Priority;
  // string (not ColumnId) so real Supabase bucket ids fit alongside mock data
  column: string;
  date?: string;
  waitingOn?: number;
  assignees?: number;
  done?: boolean;
}

export interface BoardColumn {
  id: string;
  title: string;
  cards: BoardCard[];
}

export const workBoard: BoardColumn[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    cards: [
      { id: 'c1', title: 'Supplier Data Standardisation Initiative', priority: 'medium', column: 'backlog', date: 'Aug 30' },
      { id: 'c2', title: 'Scenario Planning Workshop Prep', priority: 'low', column: 'backlog', date: 'Sep 2' },
      { id: 'c3', title: 'Tool Rationalisation Business Case', priority: 'medium', column: 'backlog', date: 'Sep 5' },
    ],
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [
      { id: 'c4', title: 'AI Tender Evaluation Pilot', priority: 'high', column: 'doing', date: 'Today', assignees: 1 },
      { id: 'c5', title: 'Digitalisation Strategy Draft', priority: 'high', column: 'doing', date: 'Tomorrow', assignees: 1 },
    ],
  },
  {
    id: 'waiting',
    title: 'Waiting',
    cards: [
      { id: 'c6', title: 'Stakeholder Review: Operating Model', priority: 'medium', column: 'waiting', waitingOn: 2, assignees: 2 },
      { id: 'c7', title: 'Budget Approval FY25 Initiatives', priority: 'high', column: 'waiting', waitingOn: 1, assignees: 1 },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      { id: 'c8', title: 'Q2 Performance Review', priority: 'medium', column: 'done', done: true },
      { id: 'c9', title: 'Savings Opportunity Assessment', priority: 'high', column: 'done', done: true },
    ],
  },
];

// ── Intelligence rail KPIs ──────────────────────────────────

export const intelligence = {
  weeklyCompletion: { value: 80, deltaPct: 8, bars: [9, 12, 7, 14, 11, 6, 13] },
  projectsOnTrack: { onTrack: 7, total: 8, pct: 87 },
  focusTimeWtd: { hours: 11.4, deltaHours: 1.6, spark: [1.6, 2.1, 1.4, 2.8, 1.9, 0.8, 1.2] },
  meetingsTrend: { deltaPct: -12, bars: [6, 5, 7, 4, 6, 3, 5] },
  overdueTasks: 2,
  aiInsight:
    'You have 2 high-impact tasks due today. Focus time is optimal this morning — protect 9:00–11:00 for deep work.',
};

// ── Projects ────────────────────────────────────────────────

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  role: string;
}

export interface ProjectActivity {
  id: string;
  text: string;
  meta: string;
}

export interface ProjectRisk {
  id: string;
  text: string;
  level: Priority;
}

export interface ProjectTaskRow {
  id: string;
  title: string;
  status: ColumnId;
  priority: Priority;
}

export interface ProjectDoc {
  id: string;
  name: string;
  meta: string;
}

export interface Project {
  id: string;
  name: string;
  health: 'On Track' | 'At Risk' | 'Off Track';
  progress: number;
  dueDate: string;
  daysLeft: number;
  owner: TeamMember;
  aiSummary: string;
  activity: ProjectActivity[];
  risks: ProjectRisk[];
  tasks: ProjectTaskRow[];
  documents: ProjectDoc[];
  team: TeamMember[];
}

const owner: TeamMember = { id: 'u1', name: 'Shane Warne', initials: 'SW', role: 'Owner' };

export const featuredProject: Project = {
  id: 'p1',
  name: 'AI Tender Evaluation Pilot',
  health: 'On Track',
  progress: 68,
  dueDate: '24 Aug 2025',
  daysLeft: 32,
  owner,
  aiSummary:
    'The project is on track for delivery. The scoring model is 80% complete. Next step is stakeholder review on 28 May. No critical blockers, though data quality remains the key watch item.',
  activity: [
    { id: 'a1', text: 'Evaluator scoring model updated', meta: 'Today · James P.' },
    { id: 'a2', text: 'Stakeholder review scheduled', meta: 'Yesterday · You' },
    { id: 'a3', text: 'Document uploaded: Evaluation Criteria v2', meta: '2 days ago · Sarah K.' },
  ],
  risks: [
    { id: 'r1', text: 'Data quality concerns may impact model accuracy', level: 'high' },
    { id: 'r2', text: 'Stakeholder feedback pending', level: 'medium' },
  ],
  tasks: [
    { id: 't1', title: 'Complete evaluator scoring model', status: 'doing', priority: 'high' },
    { id: 't2', title: 'Validate weighting methodology', status: 'doing', priority: 'medium' },
    { id: 't3', title: 'Draft stakeholder review pack', status: 'backlog', priority: 'high' },
    { id: 't4', title: 'Confirm evaluation criteria sign-off', status: 'waiting', priority: 'medium' },
    { id: 't5', title: 'Baseline supplier data import', status: 'done', priority: 'medium' },
  ],
  documents: [
    { id: 'd1', name: 'Evaluation Criteria v2.pdf', meta: 'Updated 2 days ago · 1.2 MB' },
    { id: 'd2', name: 'Scoring Model.xlsx', meta: 'Updated today · 480 KB' },
    { id: 'd3', name: 'Tender Brief.docx', meta: 'Updated 1 week ago · 96 KB' },
  ],
  team: [
    owner,
    { id: 'u2', name: 'James Pearson', initials: 'JP', role: 'Analyst' },
    { id: 'u3', name: 'Sarah Keane', initials: 'SK', role: 'Data Lead' },
    { id: 'u4', name: 'Marcus Hale', initials: 'MH', role: 'Procurement' },
  ],
};

export interface ProjectSummary {
  id: string;
  name: string;
  health: Project['health'];
  progress: number;
  dueDate: string;
  team: number;
}

export const projects: ProjectSummary[] = [
  { id: 'p1', name: 'AI Tender Evaluation Pilot', health: 'On Track', progress: 68, dueDate: '24 Aug', team: 4 },
  { id: 'p2', name: 'Digitalisation Strategy', health: 'On Track', progress: 45, dueDate: '12 Sep', team: 6 },
  { id: 'p3', name: 'Supplier Data Standardisation', health: 'At Risk', progress: 30, dueDate: '5 Sep', team: 3 },
  { id: 'p4', name: 'Framework Management Review', health: 'On Track', progress: 72, dueDate: '29 Aug', team: 2 },
  { id: 'p5', name: 'Tool Rationalisation Business Case', health: 'Off Track', progress: 18, dueDate: '20 Sep', team: 3 },
  { id: 'p6', name: 'Budget Approval FY25', health: 'At Risk', progress: 55, dueDate: '1 Sep', team: 5 },
];

// ── Focus session ───────────────────────────────────────────

export const focusSession = {
  taskTitle: 'AI Tender Evaluation Pilot',
  nextAction: 'Complete evaluator scoring model',
  durationMinutes: 25,
};

// ── Calendar ────────────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  startHour: number;
  durationHours: number;
  type: 'meeting' | 'focus' | 'personal';
}

export const calendarEvents: CalendarEvent[] = [
  { id: 'e1', title: 'Deep work — Scoring model', start: '09:00', end: '11:00', startHour: 9, durationHours: 2, type: 'focus' },
  { id: 'e2', title: 'SMT Briefing', start: '11:30', end: '12:00', startHour: 11.5, durationHours: 0.5, type: 'meeting' },
  { id: 'e3', title: 'Lunch', start: '13:00', end: '13:45', startHour: 13, durationHours: 0.75, type: 'personal' },
  { id: 'e4', title: 'Stakeholder Review: Operating Model', start: '14:00', end: '15:00', startHour: 14, durationHours: 1, type: 'meeting' },
  { id: 'e5', title: 'Digitalisation Strategy sync', start: '16:00', end: '16:30', startHour: 16, durationHours: 0.5, type: 'meeting' },
];

// ── Insights extra series ───────────────────────────────────

export const insights = {
  completionTrend: [62, 68, 71, 65, 74, 80, 78, 83, 80],
  hoursByCategory: [
    { label: 'Strategy', value: 14, color: 'brand' },
    { label: 'Delivery', value: 9, color: 'purple' },
    { label: 'Meetings', value: 7, color: 'amber' },
    { label: 'Admin', value: 4, color: 'text3' },
  ],
  headlineKpis: [
    { label: 'Tasks completed', value: '128', delta: '+14%' },
    { label: 'Avg focus / day', value: '2.3h', delta: '+0.4h' },
    { label: 'On-time delivery', value: '92%', delta: '+5%' },
    { label: 'Cycle time', value: '3.1d', delta: '-0.6d' },
  ],
};

// ── AI Assistant suggested prompts ──────────────────────────

export const aiSuggestions: string[] = [
  'What needs my attention today?',
  'Summarise the AI Tender Evaluation Pilot',
  'What changed since yesterday?',
  'Draft a stakeholder update for Digitalisation Strategy',
];
