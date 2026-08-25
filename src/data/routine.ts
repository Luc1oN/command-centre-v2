// ════════════════════════════════════════════════════════════
//  Weekly operating rhythm — the fixed structure (definition only).
//  User progress (what was done, the daily "3 things") lives in
//  Supabase via PersistedState.rhythm — see types + useAppStore.
//
//  Day numbers use JS getDay(): Sun=0, Mon=1 … Sat=6.
// ════════════════════════════════════════════════════════════

export type RitualKind = 'work' | 'fitness' | 'project' | 'hobby';

export interface Ritual {
  id: string;
  name: string;
  icon: string;
  kind: RitualKind;
  /** Weekly minimum / target count. */
  target: number;
  /** Preferred weekdays (getDay numbers). */
  preferredDays: number[];
  /** Fixed-time commitment, e.g. Tennis Thursday. */
  fixed?: { day: number; time: string };
  /** Can slide across the week / weekend rather than a set day. */
  flexible?: boolean;
  /** Plan around the forecast rather than daily. */
  weatherDependent?: boolean;
  /** Fallback if the primary can't happen (e.g. drone → simulator). */
  alt?: string;
  note?: string;
}

export interface DayTheme {
  day: number;
  name: string;
  place: 'WFH' | 'Office' | 'Weekend';
  theme: string;
  focus: string;
}

export const PRINCIPLE = 'Build through the week. Peak Wednesday. Release Friday. Live at the weekend.';

/** Ordered Monday-first for display. */
export const DAYS: DayTheme[] = [
  { day: 1, name: 'Monday', place: 'WFH', theme: 'Establish', focus: 'Moderate load — work, gym, Practice Pal build.' },
  { day: 2, name: 'Tuesday', place: 'WFH', theme: 'Build', focus: 'Work + Slow Pour (60–90m).' },
  { day: 3, name: 'Wednesday', place: 'Office', theme: 'Peak', focus: 'Highest load — work + commute, gym, Slow Pour (60–90m).' },
  { day: 4, name: 'Thursday', place: 'Office', theme: 'Sustain', focus: 'Work + commute, tennis 20:45–22:00. Keep the evening light.' },
  { day: 5, name: 'Friday', place: 'WFH', theme: 'Release', focus: 'Work + gym. Evening intentionally free.' },
  { day: 6, name: 'Saturday', place: 'Weekend', theme: 'Opportunity', focus: '2nd tennis, Practice Pal court test, drone (weather), day out.' },
  { day: 0, name: 'Sunday', place: 'Weekend', theme: 'Freedom', focus: 'No mandatory gym or work. Rest, walk, hike, explore.' },
];

export const RITUALS: Ritual[] = [
  { id: 'gym', name: 'Gym', icon: '🏋️', kind: 'fitness', target: 3, preferredDays: [1, 3, 5] },
  { id: 'tennis', name: 'Tennis', icon: '🎾', kind: 'fitness', target: 2, preferredDays: [6], fixed: { day: 4, time: '20:45–22:00' } },
  { id: 'slowpour', name: 'Slow Pour', icon: '☕', kind: 'project', target: 2, preferredDays: [2, 3], note: '~2–3h/week' },
  { id: 'pp-build', name: 'Practice Pal · Build', icon: '💻', kind: 'project', target: 1, preferredDays: [1] },
  { id: 'pp-court', name: 'Practice Pal · Court test', icon: '🎾', kind: 'hobby', target: 1, preferredDays: [6], flexible: true, note: 'during a tennis session' },
  { id: 'drone', name: 'Drone', icon: '🚁', kind: 'hobby', target: 1, preferredDays: [6], flexible: true, weatherDependent: true, alt: '≥1h simulator if grounded' },
];

export const KIND_COLOR: Record<RitualKind, string> = {
  work: 'var(--accent)',
  fitness: 'var(--color-done)',
  project: 'var(--color-pri-low)',
  hobby: 'var(--color-pri-med)',
};

// ── Date helpers (local, Monday-start week) ─────────────────

export function isoDate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The seven ISO dates (Mon…Sun) of the week containing `base`. */
export function datesThisWeek(base: Date = new Date()): string[] {
  const diffToMon = (base.getDay() + 6) % 7;
  const mon = new Date(base);
  mon.setDate(base.getDate() - diffToMon);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(mon);
    x.setDate(mon.getDate() + i);
    return isoDate(x);
  });
}

export function ritualsForDay(day: number): Ritual[] {
  return RITUALS.filter((r) => r.preferredDays.includes(day) || r.fixed?.day === day);
}

export function dayTheme(day: number): DayTheme {
  return DAYS.find((d) => d.day === day) ?? DAYS[0];
}
