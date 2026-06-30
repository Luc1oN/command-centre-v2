import { useDraggable } from '@dnd-kit/core';
import { Calendar } from 'lucide-react';
import type { Task } from '@/types';
import { useHud } from '@/store';

const PRI: Record<Task['pri'], { label: string; cls: string }> = {
  high: { label: 'High', cls: 'text-[var(--color-pri-high)] border-[var(--color-pri-high)]/40 bg-[var(--color-pri-high)]/10' },
  medium: { label: 'Med', cls: 'text-[var(--color-pri-med)] border-[var(--color-pri-med)]/40 bg-[var(--color-pri-med)]/10' },
  low: { label: 'Low', cls: 'text-[var(--color-pri-low)] border-[var(--color-pri-low)]/40 bg-[var(--color-pri-low)]/10' },
};

function dueInfo(iso?: string): { label: string; overdue: boolean } | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return null;
  const today = new Date().toISOString().slice(0, 10);
  return { label: d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), overdue: iso < today };
}

export function KanbanCard({ task, overlay }: { task: Task; overlay?: boolean }) {
  const openCard = useHud((s) => s.openCard);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { bucketId: task.bucketId, task },
  });
  const due = dueInfo(task.due);

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => !overlay && openCard(task.id)}
      className={`group touch-none cursor-grab rounded-xl border border-line bg-card p-3 transition-colors hover:border-line2 active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      } ${overlay ? 'shadow-2xl backdrop-blur-xl' : ''}`}
    >
      <p className={`text-sm leading-snug ${task.done ? 'text-faint line-through' : 'text-text'}`}>{task.text}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRI[task.pri].cls}`}>
          {PRI[task.pri].label}
        </span>
        {due && (
          <span className={`flex items-center gap-1 text-[10px] ${due.overdue ? 'text-[var(--color-pri-high)]' : 'text-faint'}`}>
            <Calendar size={10} />
            {due.label}
          </span>
        )}
        {task.checklist?.length > 0 && (
          <span className="text-[10px] text-faint">
            {task.checklist.filter((c) => c.done).length}/{task.checklist.length}
          </span>
        )}
      </div>
    </div>
  );
}
