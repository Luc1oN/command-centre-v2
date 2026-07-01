import { useEffect, useState } from 'react';
import { Plus, Calendar, ChevronRight } from 'lucide-react';
import { useHud } from '@/store';
import { useBoard } from '@/board/BoardContext';
import type { Task } from '@/types';

const PRI: Record<Task['pri'], { label: string; cls: string }> = {
  high: { label: 'High', cls: 'text-[var(--color-pri-high)] border-[var(--color-pri-high)]/40 bg-[var(--color-pri-high)]/10' },
  medium: { label: 'Med', cls: 'text-[var(--color-pri-med)] border-[var(--color-pri-med)]/40 bg-[var(--color-pri-med)]/10' },
  low: { label: 'Low', cls: 'text-[var(--color-pri-low)] border-[var(--color-pri-low)]/40 bg-[var(--color-pri-low)]/10' },
};
const PRI_RANK: Record<Task['pri'], number> = { high: 0, medium: 1, low: 2 };

function dueInfo(iso?: string) {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date().toISOString().slice(0, 10);
  return { label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), overdue: iso < today };
}

function MobileTaskCard({ task }: { task: Task }) {
  const openCard = useHud((s) => s.openCard);
  const due = dueInfo(task.due);
  return (
    <button
      onClick={() => openCard(task.id)}
      className="flex w-full items-center gap-3 rounded-xl border border-line bg-card p-3.5 text-left transition-colors active:bg-card2"
    >
      <div className="min-w-0 flex-1">
        <p className={`text-[15px] leading-snug ${task.done ? 'text-faint line-through' : 'text-text'}`}>{task.text}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${PRI[task.pri].cls}`}>
            {PRI[task.pri].label}
          </span>
          {due && (
            <span className={`flex items-center gap-1 text-[11px] ${due.overdue ? 'text-[var(--color-pri-high)]' : 'text-faint'}`}>
              <Calendar size={11} />
              {due.label}
            </span>
          )}
        </div>
      </div>
      <ChevronRight size={16} className="shrink-0 text-faint" />
    </button>
  );
}

/** Task-focused board for phones / iPad portrait: bucket tabs + list. */
export function MobileBoard() {
  const { buckets, tasks, addTask } = useBoard();
  const [sel, setSel] = useState<string>(buckets[0]?.id ?? '');
  const [text, setText] = useState('');

  useEffect(() => {
    if (buckets.length && !buckets.find((b) => b.id === sel)) setSel(buckets[0].id);
  }, [buckets, sel]);

  const list = tasks.filter((t) => t.bucketId === sel).sort((a, b) => PRI_RANK[a.pri] - PRI_RANK[b.pri]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      {/* Bucket tabs */}
      <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1">
        {buckets.map((b) => {
          const count = tasks.filter((t) => t.bucketId === b.id).length;
          const active = sel === b.id;
          return (
            <button
              key={b.id}
              onClick={() => setSel(b.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                active ? 'border-transparent text-bg' : 'border-line text-dim'
              }`}
              style={active ? { background: 'var(--accent)' } : undefined}
            >
              <span className="size-2 rounded-full" style={{ background: b.color }} />
              {b.title}
              <span className={active ? 'opacity-80' : 'text-faint'}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Quick add */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = text.trim();
          if (!v || !sel) return;
          addTask({ text: v, bucketId: sel, pri: 'medium' });
          useHud.getState().bump(8);
          useHud.getState().log('add', `Added “${v}”`);
          setText('');
        }}
        className="flex items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5"
      >
        <Plus size={16} className="text-faint" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a task…"
          className="w-full bg-transparent text-[15px] text-text placeholder:text-faint focus:outline-none"
        />
      </form>

      {/* Task list */}
      <div className="flex-1 space-y-2 pb-4">
        {list.length === 0 && <p className="py-10 text-center text-sm text-faint">Nothing here yet.</p>}
        {list.map((t) => (
          <MobileTaskCard key={t.id} task={t} />
        ))}
      </div>
    </div>
  );
}
