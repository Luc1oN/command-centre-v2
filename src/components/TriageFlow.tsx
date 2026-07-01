import { useEffect, useMemo, useState } from 'react';
import { X, ArrowRight, Trash2, PartyPopper } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';
import type { Task } from '@/types';

const PRI: Record<Task['pri'], { label: string; cls: string }> = {
  high: { label: 'High', cls: 'text-[var(--color-pri-high)] border-[var(--color-pri-high)]/40 bg-[var(--color-pri-high)]/10' },
  medium: { label: 'Med', cls: 'text-[var(--color-pri-med)] border-[var(--color-pri-med)]/40 bg-[var(--color-pri-med)]/10' },
  low: { label: 'Low', cls: 'text-[var(--color-pri-low)] border-[var(--color-pri-low)]/40 bg-[var(--color-pri-low)]/10' },
};

export function TriageFlow({ onClose }: { onClose: () => void }) {
  const buckets = useAppStore((s) => s.buckets);
  const tasks = useAppStore((s) => s.tasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const deleteTask = useAppStore((s) => s.deleteTask);

  const triage = useMemo(() => buckets.find((b) => b.title.toLowerCase() === 'triage'), [buckets]);
  const targets = useMemo(() => buckets.filter((b) => b.id !== triage?.id), [buckets, triage]);

  // Snapshot the Triage queue when the flow opens
  const [queue] = useState<string[]>(() =>
    triage ? tasks.filter((t) => t.bucketId === triage.id).map((t) => t.id) : [],
  );
  const [i, setI] = useState(0);

  const total = queue.length;
  const currentId = queue[i];
  const task = useAppStore((s) => s.tasks.find((t) => t.id === currentId));
  const advance = () => setI((n) => n + 1);
  const done = i >= total;

  const sendTo = (bucketId: string) => {
    if (currentId) {
      moveTask(currentId, bucketId);
      useHud.getState().bump(6);
    }
    advance();
  };
  const del = () => {
    if (currentId) deleteTask(currentId);
    advance();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (done) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') return advance();
      if (e.key === 'Backspace' || e.key === 'Delete') return del();
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= targets.length) sendTo(targets[n - 1].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, currentId, targets]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg/95 backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-glow,rgba(var(--accent-rgb),0.15)),transparent)]" />

      <div className="relative flex items-center justify-between px-6 py-5">
        <span className="text-sm font-medium text-dim">
          Triage · <span className="text-text">Inbox</span>
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-lg border border-line bg-card px-3 py-1.5 text-sm text-dim transition-colors hover:text-text"
        >
          <X size={15} /> Close
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-xl">
          {total > 0 && (
            <div className="mb-6">
              <div className="mb-1.5 flex items-center justify-between text-xs text-faint">
                <span>{done ? total : i} of {total} sorted</span>
                <span>{total - Math.min(i, total)} left</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-card2">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${total ? (Math.min(i, total) / total) * 100 : 0}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          )}

          {done ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="grid size-14 place-items-center rounded-2xl border border-line bg-card text-[var(--color-done)]">
                <PartyPopper size={24} />
              </span>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-text">
                {total === 0 ? 'Triage is empty' : 'Inbox cleared'}
              </h1>
              <p className="mt-1 text-sm text-faint">
                {total === 0 ? 'Nothing to sort right now.' : `You sorted ${total} task${total === 1 ? '' : 's'}.`}
              </p>
              <button onClick={onClose} className="mt-5 rounded-lg px-4 py-2 text-sm font-medium text-bg" style={{ background: 'var(--accent)' }}>
                Done
              </button>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-line bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  {task && (
                    <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${PRI[task.pri].cls}`}>
                      {PRI[task.pri].label}
                    </span>
                  )}
                </div>
                <h1 className="text-xl font-semibold leading-snug text-text">{task?.text}</h1>
                {task?.description && <p className="mt-3 text-sm leading-relaxed text-dim">{task.description}</p>}
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {targets.map((b, idx) => (
                  <button
                    key={b.id}
                    onClick={() => sendTo(b.id)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-card py-3 text-sm font-medium text-text transition-colors hover:border-line2"
                  >
                    <span className="size-2.5 rounded-full" style={{ background: b.color }} />
                    {b.title}
                    <kbd className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-faint">{idx + 1}</kbd>
                  </button>
                ))}
                <button
                  onClick={advance}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-line bg-card py-3 text-sm font-medium text-dim transition-colors hover:text-text"
                >
                  <ArrowRight size={16} />
                  Skip
                  <kbd className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-faint">→</kbd>
                </button>
                <button
                  onClick={del}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-[var(--color-pri-high)]/40 bg-card py-3 text-sm font-medium text-[var(--color-pri-high)] transition-colors hover:bg-[var(--color-pri-high)]/10"
                >
                  <Trash2 size={16} />
                  Delete
                  <kbd className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-faint">⌫</kbd>
                </button>
              </div>
              <p className="mt-4 text-center text-[11px] text-faint">Use the number keys to fly through your inbox.</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
