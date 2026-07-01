import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { Task, Bucket, Priority } from '@/types';

// A board's data + mutators. The dashboard maps these to the top-level
// Supabase tasks; a project board maps them to that project's nested tasks.
export interface BoardApi {
  buckets: Bucket[];
  tasks: Task[];
  ready: boolean;
  moveTask: (id: string, bucketId: string) => void;
  addTask: (partial: Partial<Task> & { text: string }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  clearBucket: (bucketId: string) => void;
  addChecklistItem: (taskId: string, text: string) => void;
  toggleChecklistItem: (taskId: string, itemId: string) => void;
  deleteChecklistItem: (taskId: string, itemId: string) => void;
}

const BoardContext = createContext<BoardApi | null>(null);

export function BoardProvider({ value, children }: { value: BoardApi; children: ReactNode }) {
  return <BoardContext.Provider value={value}>{children}</BoardContext.Provider>;
}

export function useBoard(): BoardApi {
  const ctx = useContext(BoardContext);
  if (!ctx) throw new Error('useBoard must be used inside a BoardProvider');
  return ctx;
}

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** Build a complete Task from a partial (used by project boards). */
export function newTask(partial: Partial<Task> & { text: string }): Task {
  const bucketId = partial.bucketId ?? 'todo';
  const pri: Priority = partial.pri ?? 'medium';
  return {
    id: uid(),
    text: partial.text.trim(),
    pri,
    cat: partial.cat ?? 'work',
    bucketId,
    status: bucketId,
    done: partial.done ?? false,
    at: new Date().toISOString(),
    due: partial.due ?? '',
    description: partial.description ?? '',
    checklist: partial.checklist ?? [],
    labels: partial.labels ?? [],
  };
}
