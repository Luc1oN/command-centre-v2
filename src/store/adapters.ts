// ════════════════════════════════════════════════════════════
//  Adapters — map the real Supabase store (useAppStore) into the
//  shapes the prototype UI components expect. This is the seam
//  between real data and the presentational components, so screens
//  don't need to know where their data comes from.
// ════════════════════════════════════════════════════════════

import { useMemo } from 'react';
import { useAppStore } from './useAppStore';
import type { BoardColumn, ImportantItem } from '@/data/mockData';

const PRI_RANK: Record<'high' | 'medium' | 'low', number> = { high: 0, medium: 1, low: 2 };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

/** "30 Aug" style short date, or undefined if no/invalid date. */
export function shortDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
}

/** Human due label for priority rows. */
export function dueLabel(iso?: string): string {
  if (!iso) return 'No due date';
  const today = todayISO();
  if (iso < today) return 'Overdue';
  if (iso === today) return 'Due today';
  const t = new Date(today + 'T00:00:00');
  t.setDate(t.getDate() + 1);
  if (iso === t.toISOString().slice(0, 10)) return 'Due tomorrow';
  return `Due ${shortDate(iso)}`;
}

/** Real buckets → board columns, real tasks → cards (sorted by priority). */
export function useBoardColumns(): BoardColumn[] {
  const tasks = useAppStore((s) => s.tasks);
  const buckets = useAppStore((s) => s.buckets);
  return useMemo(
    () =>
      buckets.map((b) => ({
        id: b.id,
        title: b.title,
        cards: tasks
          .filter((t) => t.bucketId === b.id)
          .slice()
          .sort((a, c) => PRI_RANK[a.pri] - PRI_RANK[c.pri])
          .map((t) => ({
            id: t.id,
            title: t.text,
            priority: t.pri,
            column: b.id,
            date: shortDate(t.due),
            done: t.done,
          })),
      })),
    [tasks, buckets],
  );
}

/** Top N open tasks by priority then soonest due — the "most important work". */
export function useTopPriorities(n = 3): ImportantItem[] {
  const tasks = useAppStore((s) => s.tasks);
  return useMemo(
    () =>
      tasks
        .filter((t) => !t.done)
        .slice()
        .sort((a, c) => PRI_RANK[a.pri] - PRI_RANK[c.pri] || (a.due || '9999').localeCompare(c.due || '9999'))
        .slice(0, n)
        .map((t, i) => ({ rank: i + 1, title: t.text, impact: t.pri, due: dueLabel(t.due) })),
    [tasks, n],
  );
}

/** Open tasks due today or overdue, with a high-priority sub-count. */
export function useTasksDue(): { value: number; highPriority: number } {
  const tasks = useAppStore((s) => s.tasks);
  return useMemo(() => {
    const today = todayISO();
    const due = tasks.filter((t) => !t.done && t.due && t.due <= today);
    return { value: due.length, highPriority: due.filter((t) => t.pri === 'high').length };
  }, [tasks]);
}

/** Total open (not-done) tasks. */
export function useOpenTaskCount(): number {
  const tasks = useAppStore((s) => s.tasks);
  return useMemo(() => tasks.filter((t) => !t.done).length, [tasks]);
}
