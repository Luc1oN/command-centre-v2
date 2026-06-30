import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '@/store';
import { useHud } from '@/store';

const PRI: Record<Task['priority'], { label: string; cls: string }> = {
  high: { label: 'High', cls: 'text-[var(--color-pri-high)] border-[var(--color-pri-high)]/40 bg-[var(--color-pri-high)]/10' },
  med: { label: 'Med', cls: 'text-[var(--color-pri-med)] border-[var(--color-pri-med)]/40 bg-[var(--color-pri-med)]/10' },
  low: { label: 'Low', cls: 'text-[var(--color-pri-low)] border-[var(--color-pri-low)]/40 bg-[var(--color-pri-low)]/10' },
};

function ago(ts: number): string {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function KanbanCard({ task, overlay }: { task: Task; overlay?: boolean }) {
  const advanceTask = useHud((s) => s.advanceTask);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { lane: task.status },
  });

  const style = overlay ? undefined : { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => !overlay && advanceTask(task.id)}
      className={`group touch-none cursor-grab rounded-xl border border-line bg-card p-3 transition-colors hover:border-line2 active:cursor-grabbing ${
        isDragging ? 'opacity-40' : ''
      } ${overlay ? 'shadow-2xl backdrop-blur-xl' : ''}`}
    >
      <p className={`text-sm leading-snug ${task.status === 'done' ? 'text-dim line-through' : 'text-text'}`}>{task.title}</p>
      <div className="mt-2.5 flex items-center gap-2">
        <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${PRI[task.priority].cls}`}>
          {PRI[task.priority].label}
        </span>
        <span className="text-[10px] text-faint">{ago(task.createdAt)}</span>
      </div>
    </div>
  );
}
