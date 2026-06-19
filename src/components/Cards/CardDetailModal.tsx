import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, Check, Plus, RotateCcw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';
import type { Priority } from '@/types';

const PRIS: Priority[] = ['high', 'medium', 'low'];
const PRI_ON: Record<Priority, string> = {
  high: 'border-red-bd bg-red-bg text-red',
  medium: 'border-amber-bd bg-amber-bg text-amber',
  low: 'border-border2 bg-surface3 text-text2',
};

function Label({ children }: { children: ReactNode }) {
  return <span className="mb-1.5 block text-2xs font-semibold uppercase tracking-wider text-text3">{children}</span>;
}

export function CardDetailModal() {
  const openTaskId = useUiStore((s) => s.openTaskId);
  const closeTask = useUiStore((s) => s.closeTask);
  const showToast = useUiStore((s) => s.showToast);

  const task = useAppStore((s) => s.tasks.find((t) => t.id === openTaskId));
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
    if (!openTaskId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeTask();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openTaskId, closeTask]);

  if (!openTaskId || !task) return null;

  const doneCount = task.checklist.filter((c) => c.done).length;

  const handleDelete = () => {
    const removed = task;
    deleteTask(removed.id);
    closeTask();
    showToast({
      message: 'Task deleted',
      actionLabel: 'Undo',
      onAction: () => {
        const s = useAppStore.getState();
        s.setState2({ tasks: [...s.tasks, removed] });
      },
    });
  };

  const addCheck = () => {
    const v = checkText.trim();
    if (!v) return;
    addChecklistItem(task.id, v);
    setCheckText('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[8vh]" onClick={closeTask}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.34, 1.4, 0.6, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex max-h-[84vh] w-full max-w-lg flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
      >
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-border p-4">
          <button
            onClick={() => toggleTask(task.id)}
            aria-label={task.done ? 'Reopen' : 'Mark complete'}
            className={`mt-1 grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
              task.done ? 'border-green bg-green text-white' : 'border-border2 text-transparent hover:border-green'
            }`}
          >
            <Check size={13} />
          </button>
          <textarea
            value={task.text}
            onChange={(e) => updateTask(task.id, { text: e.target.value })}
            rows={1}
            className={`flex-1 resize-none bg-transparent text-base font-semibold leading-snug focus:outline-none ${
              task.done ? 'text-text2 line-through' : 'text-text'
            }`}
          />
          <button onClick={closeTask} className="grid size-7 place-items-center rounded-md text-text3 hover:bg-surface2 hover:text-text">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <select
                value={task.bucketId}
                onChange={(e) => moveTask(task.id, e.target.value)}
                className="w-full rounded-md border border-border bg-surface2 px-2.5 py-1.5 text-sm text-text focus:border-brand focus:outline-none"
              >
                {buckets.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Due date</Label>
              <input
                type="date"
                value={task.due || ''}
                onChange={(e) => updateTask(task.id, { due: e.target.value })}
                className="w-full rounded-md border border-border bg-surface2 px-2.5 py-1.5 text-sm text-text focus:border-brand focus:outline-none"
              />
            </div>
          </div>

          <div>
            <Label>Priority</Label>
            <div className="flex gap-1.5">
              {PRIS.map((p) => (
                <button
                  key={p}
                  onClick={() => updateTask(task.id, { pri: p })}
                  className={`flex-1 rounded-md border px-2 py-1.5 text-xs font-medium capitalize transition-colors ${
                    task.pri === p ? PRI_ON[p] : 'border-border text-text2 hover:text-text'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <textarea
              value={task.description || ''}
              onChange={(e) => updateTask(task.id, { description: e.target.value })}
              placeholder="Add detail, context, links…"
              className="h-24 w-full resize-none rounded-md border border-border bg-surface2 px-3 py-2 text-sm text-text placeholder:text-text3 focus:border-brand focus:outline-none"
            />
          </div>

          <div>
            <Label>
              Checklist {task.checklist.length > 0 && <span className="tnum text-text3">· {doneCount}/{task.checklist.length}</span>}
            </Label>
            <div className="flex flex-col gap-1">
              {task.checklist.map((item) => (
                <div key={item.id} className="group flex items-center gap-2.5 rounded-md px-1 py-1">
                  <button
                    onClick={() => toggleChecklistItem(task.id, item.id)}
                    className={`grid size-4 shrink-0 place-items-center rounded border transition-colors ${
                      item.done ? 'border-green bg-green text-white' : 'border-border2 text-transparent hover:border-green'
                    }`}
                  >
                    <Check size={11} />
                  </button>
                  <span className={`flex-1 text-sm ${item.done ? 'text-text3 line-through' : 'text-text'}`}>{item.text}</span>
                  <button
                    onClick={() => deleteChecklistItem(task.id, item.id)}
                    className="text-text3 opacity-0 transition-opacity hover:text-red group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2.5 px-1">
                <Plus size={14} className="text-text3" />
                <input
                  value={checkText}
                  onChange={(e) => setCheckText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCheck()}
                  placeholder="Add an item, Enter to save"
                  className="flex-1 bg-transparent py-1 text-sm text-text placeholder:text-text3 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border p-4">
          <button
            onClick={() => toggleTask(task.id)}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              task.done ? 'border border-border text-text2 hover:text-text' : 'bg-green text-white hover:opacity-90'
            }`}
          >
            {task.done ? (
              <>
                <RotateCcw size={15} /> Reopen
              </>
            ) : (
              <>
                <Check size={15} /> Mark complete
              </>
            )}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-red transition-colors hover:bg-red-bg"
          >
            <Trash2 size={15} /> Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
