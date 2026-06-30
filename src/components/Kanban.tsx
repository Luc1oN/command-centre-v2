import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  pointerWithin,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';
import type { Task, Bucket } from '@/types';
import { KanbanCard } from './KanbanCard';

const PRI_RANK: Record<Task['pri'], number> = { high: 0, medium: 1, low: 2 };

function QuickAdd({ bucketId }: { bucketId: string }) {
  const addTask = useAppStore((s) => s.addTask);
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const v = text.trim();
        if (!v) return;
        addTask({ text: v, bucketId, pri: 'medium' });
        useHud.getState().bump(8);
        useHud.getState().log('add', `Added “${v}”`);
        setText('');
      }}
      className="mb-2 flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5"
    >
      <Plus size={14} className="text-faint" />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task…"
        className="w-full bg-transparent text-sm text-text placeholder:text-faint focus:outline-none"
      />
    </form>
  );
}

function Lane({ bucket, tasks }: { bucket: Bucket; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: bucket.id, data: { bucketId: bucket.id } });
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-faint">
          <span className="size-2 rounded-full" style={{ background: bucket.color }} />
          {bucket.title}
        </span>
        <span className="grid size-5 min-w-5 place-items-center rounded-full bg-card2 text-[10px] font-medium text-dim">
          {tasks.length}
        </span>
      </div>
      <QuickAdd bucketId={bucket.id} />
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto rounded-xl p-1 transition-colors ${
          isOver ? 'bg-[rgba(var(--accent-rgb),0.06)] ring-1 ring-[rgba(var(--accent-rgb),0.3)]' : ''
        }`}
      >
        {tasks.map((t) => (
          <KanbanCard key={t.id} task={t} />
        ))}
        {tasks.length === 0 && <div className="px-2 py-6 text-center text-xs text-faint">Drop here</div>}
      </div>
    </div>
  );
}

export function Kanban() {
  const buckets = useAppStore((s) => s.buckets);
  const tasks = useAppStore((s) => s.tasks);
  const moveTask = useAppStore((s) => s.moveTask);
  const ready = useAppStore((s) => s.ready);
  const [active, setActive] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const onDragStart = (e: DragStartEvent) => setActive((e.active.data.current?.task as Task | undefined) ?? null);
  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);
    const { active: a, over } = e;
    if (!over) return;
    const from = a.data.current?.bucketId as string | undefined;
    const to = String(over.id);
    if (from && from !== to) {
      moveTask(String(a.id), to);
      useHud.getState().bump(5 + Math.random() * 6);
      const title = buckets.find((b) => b.id === to)?.title ?? to;
      useHud.getState().log('move', `Moved to ${title}`);
    }
  };

  const sorted = (bucketId: string) =>
    tasks.filter((t) => t.bucketId === bucketId).sort((a, b) => PRI_RANK[a.pri] - PRI_RANK[b.pri]);

  return (
    <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">Board</span>
        <span className="text-[11px] text-faint">{ready ? 'Tap to edit · drag to move' : 'Loading…'}</span>
      </div>
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex min-h-0 flex-1 gap-4">
          {buckets.map((bucket) => (
            <Lane key={bucket.id} bucket={bucket} tasks={sorted(bucket.id)} />
          ))}
        </div>
        <DragOverlay>{active ? <div className="w-[240px] rotate-2"><KanbanCard task={active} overlay /></div> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
