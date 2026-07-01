import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { BoardProvider } from '@/board/BoardContext';
import type { BoardApi } from '@/board/BoardContext';
import { Kanban } from './Kanban';
import { MobileBoard } from './MobileBoard';
import { CardModal } from './CardModal';

/** Dashboard board — maps the board API to the top-level Supabase tasks. */
export function DashboardBoard() {
  const buckets = useAppStore((s) => s.buckets);
  const tasks = useAppStore((s) => s.tasks);
  const ready = useAppStore((s) => s.ready);
  const moveTask = useAppStore((s) => s.moveTask);
  const addTask = useAppStore((s) => s.addTask);
  const updateTask = useAppStore((s) => s.updateTask);
  const toggleTask = useAppStore((s) => s.toggleTask);
  const deleteTask = useAppStore((s) => s.deleteTask);
  const clearBucket = useAppStore((s) => s.clearBucket);
  const addChecklistItem = useAppStore((s) => s.addChecklistItem);
  const toggleChecklistItem = useAppStore((s) => s.toggleChecklistItem);
  const deleteChecklistItem = useAppStore((s) => s.deleteChecklistItem);

  const api = useMemo<BoardApi>(
    () => ({
      buckets,
      tasks,
      ready,
      moveTask,
      addTask,
      updateTask,
      toggleTask,
      deleteTask,
      clearBucket,
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
    }),
    // actions are stable zustand refs; re-build only when data changes
    [buckets, tasks, ready, moveTask, addTask, updateTask, toggleTask, deleteTask, clearBucket, addChecklistItem, toggleChecklistItem, deleteChecklistItem],
  );

  return (
    <BoardProvider value={api}>
      {/* Desktop: full kanban. Mobile / iPad portrait: task-focused list. */}
      <div className="hidden min-h-0 flex-1 lg:flex">
        <Kanban title="Board" />
      </div>
      <div className="flex min-h-0 flex-1 lg:hidden">
        <MobileBoard />
      </div>
      <CardModal />
    </BoardProvider>
  );
}
