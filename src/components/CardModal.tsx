import { useEffect, useState } from 'react';
import { X, Trash2, Check, Plus, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';
import type { Priority } from '@/types';

const PRIS: Priority[] = ['high', 'medium', 'low'];
const PRI_ON: Record<Priority, string> = {
  high: 'border-[var(--color-pri-high)] text-[var(--color-pri-high)] bg-[var(--color-pri-high)]/10',
  medium: 'border-[var(--color-pri-med)] text-[var(--color-pri-med)] bg-[var(--color-pri-med)]/10',
  low: 'border-[var(--color-pri-low)] text-[var(--color-pri-low)] bg-[var(--color-pri-low)]/10',
};

function Eyebrow({ children }: { children: string }) {
  return <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-faint">{children}</span>;
}

export function CardModal() {
  const openCardId = useHud((s) => s.openCardId);
  const closeCard = useHud((s) => s.closeCard);

  const task = useAppStore((s) => s.tasks.find((t) => t.id === openCardId));
  const buckets = useAppStore((s) => s.buckets);
  const updateTask = useAppStore((s) => s.updateTask);
  const moveTask = useAppStore((s) => s.moveTask);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const addChecklistItem = useAppStore((s) => s.addChecklistItem);
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const deleteChecklistItem = useAppStore((s) => s.deleteChecklistItem);

  const [checkText, setCheckText] = useState('');

  useEffect(() => {
    if (!openCardId) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCard();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openCardId, closeCard]);

  if (!openCardId || !task) return null;

  const addCheck = () => {
    const v = checkText.trim();
    if (!v) return;
    addChecklistItem(task.id, v);
    setCheckText('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[8vh]" onClick={closeCard}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass relative flex max-h-[84vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-line p-4">
          <button
            onClick={() => toggleTask(task.id)}
            aria-label={task.done ? 'Reopen' : 'Complete'}
            className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
              task.done ? 'border-[var(--color-done)] bg-[var(--color-done)] text-bg' : 'border-line2 text-transparent hover:border-[var(--color-done)]'
            }`}
          >
            <Check size={13} />
          </button>
          <textarea
            value={task.text}
            onChange={(e) => updateTask(task.id, { text: e.target.value })}
            rows={1}
            className={`flex-1 resize-none bg-transparent text-base font-semibold leading-snug focus:outline-none ${
              task.done ? 'text-faint line-through' : 'text-text'
            }`}
          />
          <button onClick={closeCard} className="grid size-7 place-items-center rounded-md text-faint hover:bg-card2 hover:text-text">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Eyebrow>List</Eyebrow>
              <select
                value={task.bucketId}
                onChange={(e) => moveTask(task.id, e.target.value)}
                className="w-full rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm text-text focus:border-[var(--accent)] focus:outline-none"
              >
                {buckets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Eyebrow>Due date</Eyebrow>
              <input
                type="date"
                value={task.due || ''}
                onChange={(e) => updateTask(task.id, { due: e.target.value })}
                className="w-full rounded-lg border border-line bg-card px-2.5 py-1.5 text-sm text-text focus:border-[var(--accent)] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <Eyebrow>Priority</Eyebrow>
            <div className="flex gap-1.5">
              {PRIS.map((p) => (
                <button
                  key={p}
                  onClick={() => updateTask(task.id, { pri: p })}
                  className={`flex-1 rounded-lg border px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                    task.pri === p ? PRI_ON[p] : 'border-line text-dim hover:text-text'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Eyebrow>Notes</Eyebrow>
            <textarea
              value={task.description || ''}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              placeholder="Add detail, context, links…"
              className="h-24 w-full resize-none rounded-lg border border-line bg-card px-3 py-2 text-sm text-text placeholder:text-faint focus:border-[var(--accent)] focus:outline-none"
            />
          </div>

          <div>
            <Eyebrow>Checklist</Eyebrow>
            <div className="flex flex-col gap-1">
              {task.checklist.map((item) => (
                <div key={item.id} className="group flex items-center gap-2.5 rounded-md px-1 py-1">
                  <button
                    onClick={() => toggleChecklistItem(task.id, item.id)}
                    className={`grid size-4 shrink-0 place-items-center rounded border transition-colors ${
                      item.done ? 'border-[var(--color-done)] bg-[var(--color-done)] text-bg' : 'border-line2 text-transparent hover:border-[var(--color-done)]'
                    }`}
                  >
                    <Check size={11} />
                  </button>
                  <span className={`flex-1 text-sm ${item.done ? 'text-faint line-through' : 'text-text'}`}>{item.text}</span>
                  <button
                    onClick={() => deleteChecklistItem(task.id, item.id)}
                    className="text-faint opacity-0 transition-opacity hover:text-[var(--color-pri-high)] group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2.5 px-1">
                <Plus size={14} className="text-faint" />
                <input
                  value={checkText}
                  onChange={(e) => setCheckText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCheck()}
                  placeholder="Add an item, Enter to save"
                  className="flex-1 bg-transparent py-1 text-sm text-text placeholder:text-faint focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-line p-4">
          <button
            onClick={() => toggleTask(task.id)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={task.done ? { border: '1px solid var(--color-line)' } : { background: 'var(--color-done)', color: 'var(--color-bg)' }}
          >
            {task.done ? (
              <>
                <RotateCcw size={15} /> Reopen
              </>
            ) : (
              <>
                <Check size={15} /> Complete
              </>
            )}
          </button>
          <button
            onClick={() => {
              deleteTask(task.id);
              closeCard();
            }}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-pri-high)] transition-colors hover:bg-[var(--color-pri-high)]/10"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}
