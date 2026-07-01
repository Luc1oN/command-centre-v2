import { useMemo } from 'react';
import { ChevronLeft, Trash2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';
import { BoardProvider, newTask } from '@/board/BoardContext';
import type { BoardApi } from '@/board/BoardContext';
import type { Task } from '@/types';
import { Kanban } from './Kanban';
import { MobileBoard } from './MobileBoard';
import { CardModal } from './CardModal';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/** Project board — maps the board API to one project's nested tasks. */
export function ProjectBoard({ projectId }: { projectId: string }) {
  const project = useAppStore((s) => s.projects.find((p) => p.id === projectId));
  const updateProject = useAppStore((s) => s.updateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const closeProject = useHud((s) => s.closeProject);

  const api = useMemo<BoardApi | null>(() => {
    if (!project) return null;
    const setTasks = (tasks: Task[]) => updateProject(project.id, { tasks });
    const isDone = (bucketId: string) => project.buckets.find((b) => b.id === bucketId)?.title.toLowerCase() === 'done';
    return {
      buckets: project.buckets,
      tasks: project.tasks,
      ready: true,
      moveTask: (id, bucketId) =>
        setTasks(project.tasks.map((t) => (t.id === id ? { ...t, bucketId, status: bucketId, done: isDone(bucketId) } : t))),
      addTask: (partial) => setTasks([newTask(partial), ...project.tasks]),
      updateTask: (id, patch) => setTasks(project.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t))),
      toggleTask: (id) => {
        const t = project.tasks.find((x) => x.id === id);
        if (!t) return;
        const done = !t.done;
        const doneB = project.buckets.find((b) => b.title.toLowerCase() === 'done');
        const target = done ? doneB?.id : project.buckets[0]?.id;
        const bucketId = target ?? t.bucketId;
        setTasks(project.tasks.map((x) => (x.id === id ? { ...x, done, bucketId, status: bucketId } : x)));
      },
      deleteTask: (id) => setTasks(project.tasks.filter((t) => t.id !== id)),
      clearBucket: (bucketId) => setTasks(project.tasks.filter((t) => t.bucketId !== bucketId)),
      addChecklistItem: (taskId, text) =>
        setTasks(project.tasks.map((t) => (t.id === taskId ? { ...t, checklist: [...t.checklist, { id: uid(), text: text.trim(), done: false }] } : t))),
      toggleChecklistItem: (taskId, itemId) =>
        setTasks(
          project.tasks.map((t) =>
            t.id === taskId ? { ...t, checklist: t.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)) } : t,
          ),
        ),
      deleteChecklistItem: (taskId, itemId) =>
        setTasks(project.tasks.map((t) => (t.id === taskId ? { ...t, checklist: t.checklist.filter((c) => c.id !== itemId) } : t))),
    };
  }, [project, updateProject]);

  if (!project || !api) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex items-center justify-between">
        <button
          onClick={closeProject}
          className="flex w-fit items-center gap-1.5 text-sm text-dim transition-colors hover:text-text"
        >
          <ChevronLeft size={15} /> All projects
        </button>
        <button
          onClick={() => {
            if (confirm(`Delete project “${project.name}” and its tasks?`)) {
              deleteProject(project.id);
              closeProject();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-faint transition-colors hover:text-[var(--color-pri-high)]"
        >
          <Trash2 size={13} /> Delete project
        </button>
      </div>
      <BoardProvider value={api}>
        <div className="hidden min-h-0 flex-1 lg:flex">
          <Kanban title={`${project.icon ?? '📋'}  ${project.name}`} />
        </div>
        <div className="flex min-h-0 flex-1 lg:hidden">
          <MobileBoard />
        </div>
        <CardModal />
      </BoardProvider>
    </div>
  );
}
