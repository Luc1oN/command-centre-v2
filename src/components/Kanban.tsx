import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCorners,
} from '@dnd-kit/core';
import type { DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus } from 'lucide-react';
import { LANES, useHud } from '@/store';
import type { LaneId, Task } from '@/store';
import { KanbanCard } from './KanbanCard';

function QuickAdd() {
  const addTask = useHud((s) => s.addTask);
  const [text, setText] = useState('');
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addTask(text);
        setText('');
      }}
      className="mb-2 flex items-center gap-2 rounded-lg border border-line bg-white/[0.02] px-2.5 py-1.5"
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

function Lane({ id, label, tasks }: { id: LaneId; label: string; tasks: Task[] }) {
  const { setNodeRef, isOver } = useDroppable({ id, data: { lane: id } });
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-3 flex items-center justify-between px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">{label}</span>
        <span className="grid size-5 min-w-5 place-items-center rounded-full bg-white/5 text-[10px] font-medium text-dim">
          {tasks.length}
        </span>
      </div>
      {id === 'todo' && <QuickAdd />}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 overflow-y-auto rounded-xl p-1 transition-colors ${
          isOver ? 'bg-[rgba(var(--accent-rgb),0.06)] ring-1 ring-[rgba(var(--accent-rgb),0.3)]' : ''
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((t) => (
            <KanbanCard key={t.id} task={t} />
          ))}
        </SortableContext>
        {tasks.length === 0 && <div className="px-2 py-6 text-center text-xs text-faint">Drop here</div>}
      </div>
    </div>
  );
}

const rand = (a: number, b: number) => a + Math.random() * (b - a);

export function Kanban() {
  const storeTasks = useHud((s) => s.tasks);
  const setTasks = useHud((s) => s.setTasks);
  const log = useHud((s) => s.log);
  const bump = useHud((s) => s.bump);

  const [items, setItems] = useState<Task[]>(storeTasks);
  const dragging = useRef(false);
  const fromLane = useRef<LaneId | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Keep local mirror in sync with the store except mid-drag
  useEffect(() => {
    if (!dragging.current) setItems(storeTasks);
  }, [storeTasks]);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  const laneOf = (id: string): LaneId | undefined => {
    if (LANES.some((l) => l.id === id)) return id as LaneId;
    return items.find((t) => t.id === id)?.status;
  };

  const onDragStart = (e: DragStartEvent) => {
    dragging.current = true;
    setActiveId(String(e.active.id));
    fromLane.current = items.find((t) => t.id === e.active.id)?.status ?? null;
  };

  const onDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const activeLane = laneOf(String(active.id));
    const overLane = laneOf(String(over.id));
    if (!activeLane || !overLane || activeLane === overLane) return;
    setItems((prev) => prev.map((t) => (t.id === active.id ? { ...t, status: overLane } : t)));
  };

  const onDragEnd = (e: DragEndEvent) => {
    dragging.current = false;
    setActiveId(null);
    const { active, over } = e;
    if (!over) {
      setItems(storeTasks);
      return;
    }
    let next = items;
    const activeIndex = items.findIndex((t) => t.id === active.id);
    const overIndex = items.findIndex((t) => t.id === over.id);
    if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
      next = arrayMove(items, activeIndex, overIndex);
      setItems(next);
    }
    setTasks(next);

    const landed = next.find((t) => t.id === active.id);
    if (landed && fromLane.current && landed.status !== fromLane.current) {
      const label = LANES.find((l) => l.id === landed.status)?.label ?? landed.status;
      log('move', `Moved “${landed.title}” → ${label}`);
    }
    bump(rand(5, 11));
    fromLane.current = null;
  };

  const activeTask = activeId ? items.find((t) => t.id === activeId) : null;

  return (
    <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold">Board</span>
        <span className="text-[11px] text-faint">Tap a card to advance · drag to move</span>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <div className="flex min-h-0 flex-1 gap-4">
          {LANES.map((lane) => (
            <Lane key={lane.id} id={lane.id} label={lane.label} tasks={items.filter((t) => t.status === lane.id)} />
          ))}
        </div>
        <DragOverlay>{activeTask ? <KanbanCard task={activeTask} overlay /> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
