import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { BoardProvider } from '@/board/BoardContext';
import type { BoardApi } from '@/board/BoardContext';
import { Kanban } from './Kanban';

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
      addChecklistItem,
      toggleChecklistItem,
      deleteChecklistItem,
    }),
    // actions are stable zustand refs; re-build only when data changes
    [buckets, tasks, ready, moveTask, addTask, updateTask, toggleTask, deleteTask, addChecklistItem, toggleChecklistItem, deleteChecklistItem],
  );

  return (
    <BoardProvider value={api}>
      <Kanban title="Board" />
    </BoardProvider>
  );
}
