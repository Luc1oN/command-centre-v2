import { useState } from 'react';
import { Plus, Check, Clock, ChevronRight } from 'lucide-react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  pointerWithin,
} from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { workBoard } from '@/data/mockData';
import type { BoardCard, BoardColumn } from '@/data/mockData';
import { PriorityChip, PRIORITY_ACCENT, Avatar } from '@/components/UI/Badges';
import { Eyebrow } from '@/components/UI/Card';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';

/** The visual face of a card — shared by static, draggable and overlay renders. */
function CardFace({ card, onToggle }: { card: BoardCard; onToggle?: (id: string) => void }) {
  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-surface2/80 p-2.5">
      <span className={`absolute inset-y-0 left-0 w-0.5 ${PRIORITY_ACCENT[card.priority]} opacity-70`} />
      <div className="flex items-start gap-2 pl-1.5">
        {onToggle && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(card.id);
            }}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label={card.done ? 'Mark not done' : 'Mark done'}
            className={`mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border transition-colors ${
              card.done ? 'border-green bg-green text-white' : 'border-border2 text-transparent hover:border-green'
            }`}
          >
            <Check size={11} />
          </button>
        )}
        <p className={`text-sm leading-snug ${card.done ? 'text-text2 line-through' : 'text-text'}`}>{card.title}</p>
      </div>
      <div className="mt-2.5 flex items-center justify-between pl-1.5">
        {card.done ? (
          <span className="inline-flex items-center gap-1 text-2xs font-medium text-green">
            <Check size={12} /> Completed
          </span>
        ) : (
          <PriorityChip priority={card.priority} />
        )}
        <div className="flex items-center gap-2">
          {card.date && <span className="text-2xs text-text3">{card.date}</span>}
          {card.waitingOn != null && (
            <span className="inline-flex items-center gap-1 text-2xs text-text3">
              <Clock size={11} /> Waiting on {card.waitingOn}
            </span>
          )}
          {card.assignees ? <Avatar initials="JP" index={0} size="sm" /> : null}
        </div>
      </div>
    </div>
  );
}

function DraggableCard({ card, onToggle }: { card: BoardCard; onToggle: (id: string) => void }) {
  const openTask = useUiStore((s) => s.openTask);
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    data: { columnId: card.column, card },
  });
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => openTask(card.id)}
      className={`touch-none cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-40' : ''}`}
    >
      <CardFace card={card} onToggle={onToggle} />
    </div>
  );
}

function AddTask({ columnId, onAdd }: { columnId: string; onAdd: (columnId: string, text: string) => void }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const submit = () => {
    const v = text.trim();
    if (v) onAdd(columnId, v);
    setText('');
  };
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-2 text-2xs font-medium text-text3 transition-colors hover:border-border2 hover:text-text2"
      >
        <Plus size={13} /> Add task
      </button>
    );
  }
  return (
    <input
      autoFocus
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') submit();
        else if (e.key === 'Escape') setOpen(false);
      }}
      onBlur={() => setOpen(false)}
      placeholder="Task title, Enter to add"
      className="rounded-md border border-brand/50 bg-surface px-2.5 py-2 text-sm text-text placeholder:text-text3 focus:outline-none"
    />
  );
}

function Column({
  column,
  limit,
  onToggle,
  onAdd,
}: {
  column: BoardColumn;
  limit?: number;
  onToggle: (id: string) => void;
  onAdd: (columnId: string, text: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const cards = limit ? column.cards.slice(0, limit) : column.cards;
  const hidden = column.cards.length - cards.length;
  return (
    <div className="flex min-w-[220px] flex-1 flex-col">
      <div className="mb-2 flex items-center justify-between px-1">
        <Eyebrow>{column.title}</Eyebrow>
        <span className="grid size-5 min-w-5 place-items-center rounded-full bg-surface3 px-1 text-2xs font-medium text-text3">
          {column.cards.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex min-h-[44px] flex-col gap-2 rounded-md p-0.5 transition-colors ${
          isOver ? 'bg-brand-glow ring-1 ring-brand/40' : ''
        }`}
      >
        {cards.map((c) => (
          <DraggableCard key={c.id} card={c} onToggle={onToggle} />
        ))}
        {hidden > 0 && <div className="px-1 py-0.5 text-2xs text-text3">+{hidden} more</div>}
        <AddTask columnId={column.id} onAdd={onAdd} />
      </div>
    </div>
  );
}

interface BoardProps {
  columns?: BoardColumn[];
  title?: string;
  limitPerColumn?: number;
}

export function ActiveWorkBoard({ columns = workBoard, title = 'Active Work Board', limitPerColumn }: BoardProps) {
  const toggleTask = useAppStore((s) => s.toggleTask);
  const addTask = useAppStore((s) => s.addTask);
  const moveTask = useAppStore((s) => s.moveTask);
  const navigate = useUiStore((s) => s.navigate);
  const [active, setActive] = useState<BoardCard | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const onDragStart = (e: DragStartEvent) => {
    setActive((e.active.data.current?.card as BoardCard | undefined) ?? null);
  };
  const onDragEnd = (e: DragEndEvent) => {
    setActive(null);
    const { active: a, over } = e;
    if (!over) return;
    const from = a.data.current?.columnId as string | undefined;
    const to = String(over.id);
    if (from && from !== to) moveTask(String(a.id), to);
  };

  return (
    <div className="rounded-lg border border-border bg-surface/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <Eyebrow>{title}</Eyebrow>
        <button
          onClick={() => navigate('tasks')}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand transition-all hover:gap-1.5"
        >
          View all tasks <ChevronRight size={13} />
        </button>
      </div>
      <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragStart={onDragStart} onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-1">
          {columns.map((col) => (
            <Column key={col.id} column={col} limit={limitPerColumn} onToggle={toggleTask} onAdd={(c, t) => addTask({ text: t, bucketId: c })} />
          ))}
        </div>
        <DragOverlay>{active ? <div className="w-[240px] rotate-2 cursor-grabbing"><CardFace card={active} /></div> : null}</DragOverlay>
      </DndContext>
    </div>
  );
}
