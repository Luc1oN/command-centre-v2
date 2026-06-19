import { Plus, Check, Clock, MoreHorizontal, ChevronRight } from 'lucide-react';
import { workBoard } from '@/data/mockData';
import type { BoardCard, BoardColumn } from '@/data/mockData';
import { PriorityChip, PRIORITY_ACCENT, Avatar } from '@/components/UI/Badges';
import { Eyebrow } from '@/components/UI/Card';

function TaskCard({ card }: { card: BoardCard }) {
  return (
    <div className="group relative overflow-hidden rounded-md border border-border bg-surface2/70 p-2.5 transition-colors hover:border-border2 hover:bg-surface2">
      <span className={`absolute inset-y-0 left-0 w-0.5 ${PRIORITY_ACCENT[card.priority]} opacity-70`} />
      <p className={`pl-1.5 text-sm leading-snug ${card.done ? 'text-text2 line-through' : 'text-text'}`}>{card.title}</p>
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

function Column({ column, limit }: { column: BoardColumn; limit?: number }) {
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
      <div className="flex flex-col gap-2">
        {cards.map((c) => (
          <TaskCard key={c.id} card={c} />
        ))}
        {hidden > 0 && <div className="px-1 py-0.5 text-2xs text-text3">+{hidden} more</div>}
        <button className="flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-2 text-2xs font-medium text-text3 transition-colors hover:border-border2 hover:text-text2">
          <Plus size={13} /> Add task
        </button>
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
  return (
    <div className="rounded-lg border border-border bg-surface/60 p-4">
      <div className="mb-4 flex items-center justify-between">
        <Eyebrow>{title}</Eyebrow>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:gap-1.5 transition-all">
            View all tasks <ChevronRight size={13} />
          </button>
          <button className="text-text3 hover:text-text2">
            <MoreHorizontal size={16} />
          </button>
        </div>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-1">
        {columns.map((col) => (
          <Column key={col.id} column={col} limit={limitPerColumn} />
        ))}
      </div>
    </div>
  );
}
