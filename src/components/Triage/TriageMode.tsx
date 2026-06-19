import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, CalendarDays, Clock, Ban, Check, Trash2, X, PartyPopper } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import { shortDate } from '@/store/adapters';
import { PriorityChip } from '@/components/UI/Badges';

/** Find a bucket by title (case-insensitive), creating it if missing. Returns its id. */
function ensureBucketId(title: string): string | undefined {
  const st = useAppStore.getState();
  let b = st.buckets.find((x) => x.title.toLowerCase() === title.toLowerCase());
  if (!b) {
    st.addBucket(title);
    b = useAppStore.getState().buckets.find((x) => x.title.toLowerCase() === title.toLowerCase());
  }
  return b?.id;
}

export function TriageMode({ onClose }: { onClose: () => void }) {
  const buckets = useAppStore((s) => s.buckets);
  const tasks = useAppStore((s) => s.tasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const completeTask = useAppStore((s) => s.completeTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const showToast = useUiStore((s) => s.showToast);

  const todayBucket = useMemo(() => buckets.find((b) => b.title.toLowerCase() === 'today'), [buckets]);

  // Snapshot the open Today tasks once, so the queue is stable as we process it.
  const [queue] = useState<string[]>(() =>
    todayBucket ? tasks.filter((t) => t.bucketId === todayBucket.id && !t.done).map((t) => t.id) : [],
  );
  const [i, setI] = useState(0);

  const total = queue.length;
  const currentId = queue[i];
  const task = useAppStore((s) => s.tasks.find((t) => t.id === currentId));

  const advance = () => setI((n) => n + 1);

  const send = (run: () => void) => {
    run();
    advance();
  };

  const keep = () => advance();
  const toTomorrow = () => send(() => currentId && moveTask(currentId, ensureBucketId('Tomorrow') ?? ''));
  const toLater = () => send(() => currentId && moveTask(currentId, ensureBucketId('Later') ?? ''));
  const toBlocked = () => send(() => currentId && moveTask(currentId, ensureBucketId('Blocked') ?? ''));
  const toDone = () => send(() => currentId && completeTask(currentId));
  const toDelete = () => {
    if (!task) return;
    const removed = task;
    deleteTask(removed.id);
    advance();
    showToast({
      message: 'Task deleted',
      actionLabel: 'Undo',
      onAction: () => {
        const s = useAppStore.getState();
        s.setState2({ tasks: [...s.tasks, removed] });
      },
    });
  };

  const done = i >= total;

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return onClose();
      if (done) return;
      const k = e.key.toLowerCase();
      if (e.key === 'ArrowRight' || e.key === 'Enter') keep();
      else if (k === 't') toTomorrow();
      else if (k === 'l') toLater();
      else if (k === 'b') toBlocked();
      else if (k === 'd') toDone();
      else if (e.key === 'Backspace' || e.key === 'Delete') toDelete();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, currentId, task]);

  const actions: { label: string; hint: string; icon: LucideIcon; on: () => void; cls: string }[] = [
    { label: 'Keep', hint: '→', icon: Sun, on: keep, cls: 'border-border text-text2 hover:text-text' },
    { label: 'Tomorrow', hint: 'T', icon: CalendarDays, on: toTomorrow, cls: 'border-border text-text2 hover:text-text' },
    { label: 'Later', hint: 'L', icon: Clock, on: toLater, cls: 'border-border text-text2 hover:text-text' },
    { label: 'Blocked', hint: 'B', icon: Ban, on: toBlocked, cls: 'border-amber-bd text-amber hover:bg-amber-bg' },
    { label: 'Done', hint: 'D', icon: Check, on: toDone, cls: 'border-green-bd text-green hover:bg-green-bg' },
    { label: 'Delete', hint: '⌫', icon: Trash2, on: toDelete, cls: 'border-red-bd text-red hover:bg-red-bg' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-bg"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-glow),transparent)]" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 py-5">
        <span className="text-sm font-medium text-text2">
          Triage · <span className="text-text">Today</span>
        </span>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:border-border2 hover:text-text"
        >
          <X size={15} /> Close
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <div className="w-full max-w-xl">
          {/* Progress */}
          {total > 0 && (
            <div className="mb-6">
              <div className="mb-1.5 flex items-center justify-between text-xs text-text3">
                <span>{done ? total : i} of {total} processed</span>
                <span>{total - Math.min(i, total)} left</span>
              </div>
              <div className="h-1 overflow-hidden rounded-full bg-surface3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand to-purple transition-all duration-300"
                  style={{ width: `${total ? (Math.min(i, total) / total) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}

          {done ? (
            <div className="flex flex-col items-center py-10 text-center">
              <span className="grid size-14 place-items-center rounded-xl border border-border bg-surface text-green">
                <PartyPopper size={24} />
              </span>
              <h1 className="mt-4 text-xl font-bold tracking-tight text-text">
                {total === 0 ? 'Nothing to triage' : 'Today is triaged'}
              </h1>
              <p className="mt-1 max-w-xs text-sm text-text3">
                {total === 0 ? 'Your Today bucket is already clear.' : `You processed ${total} task${total === 1 ? '' : 's'}.`}
              </p>
              <button
                onClick={onClose}
                className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-d"
              >
                Done
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={currentId}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.18 }}
              >
                {/* Current task card */}
                <div className="rounded-lg border border-border bg-surface/70 p-6 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2">
                    {task && <PriorityChip priority={task.pri} />}
                    {task?.due && <span className="text-2xs text-text3">{shortDate(task.due)}</span>}
                  </div>
                  <h1 className="text-xl font-semibold leading-snug text-text">{task?.text}</h1>
                  {task?.description && <p className="mt-3 text-sm leading-relaxed text-text2">{task.description}</p>}
                  {task && task.checklist.length > 0 && (
                    <p className="mt-3 text-xs text-text3">
                      {task.checklist.filter((c) => c.done).length}/{task.checklist.length} checklist items
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-5 grid grid-cols-3 gap-2.5">
                  {actions.map((a) => {
                    const Icon = a.icon;
                    return (
                      <button
                        key={a.label}
                        onClick={a.on}
                        className={`flex flex-col items-center gap-1.5 rounded-lg border bg-surface/60 py-3 text-sm font-medium transition-colors ${a.cls}`}
                      >
                        <Icon size={18} />
                        {a.label}
                        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-2xs text-text3">{a.hint}</kbd>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-center text-2xs text-text3">Use the keyboard shortcuts to fly through the pile.</p>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </motion.div>
  );
}
