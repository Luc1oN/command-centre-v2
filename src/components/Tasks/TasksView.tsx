import { SlidersHorizontal, LayoutGrid, Layers } from 'lucide-react';
import { ActiveWorkBoard } from '@/components/Today/ActiveWorkBoard';
import { useBoardColumns } from '@/store/adapters';
import { useUiStore } from '@/store/useUiStore';

export function TasksView() {
  const columns = useBoardColumns();
  const openTriage = useUiStore((s) => s.openTriage);
  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">Work Board</h1>
          <p className="mt-0.5 text-sm text-text2">Everything in flight, by stage.</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={openTriage}
            className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-d"
          >
            <Layers size={14} /> Triage Today
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:text-text">
            <SlidersHorizontal size={14} /> Filter
          </button>
          <button className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:text-text">
            <LayoutGrid size={14} /> Board
          </button>
        </div>
      </div>
      <ActiveWorkBoard columns={columns} title="All Tasks" />
    </div>
  );
}
