import { SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { ActiveWorkBoard } from '@/components/Today/ActiveWorkBoard';

export function TasksView() {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">Work Board</h1>
          <p className="mt-0.5 text-sm text-text2">Everything in flight, by stage.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:text-text">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:text-text">
            <LayoutGrid size={14} /> Board
          </button>
        </div>
      </div>
      <ActiveWorkBoard title="All Tasks" />
    </div>
  );
}
