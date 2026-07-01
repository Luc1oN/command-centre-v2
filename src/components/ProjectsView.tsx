import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';
import type { Bucket } from '@/types';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const COLORS = ['#2dd4bf', '#a78bfa', '#fb923c', '#4ade80', '#60a5fa', '#f472b6'];
const ICONS = ['📋', '🚀', '🎯', '📊', '💡', '🏗️'];

function defaultBuckets(): Bucket[] {
  return [
    { id: uid(), title: 'To Do', color: '#60a5fa' },
    { id: uid(), title: 'In Progress', color: '#fbbf24' },
    { id: uid(), title: 'Done', color: '#34d399' },
  ];
}

export function ProjectsView() {
  const projects = useAppStore((s) => s.projects);
  const addProject = useAppStore((s) => s.addProject);
  const openProject = useHud((s) => s.openProject);
  const [name, setName] = useState('');

  const create = () => {
    const v = name.trim();
    if (!v) return;
    const i = projects.length;
    const id = addProject({
      name: v,
      desc: '',
      color: COLORS[i % COLORS.length],
      icon: ICONS[i % ICONS.length],
      buckets: defaultBuckets(),
      tasks: [],
      labels: [],
    });
    setName('');
    openProject(id);
  };

  return (
    <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <span className="text-sm font-semibold">Projects</span>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            create();
          }}
          className="flex items-center gap-2 rounded-lg border border-line bg-card px-2.5 py-1.5"
        >
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="New project name…"
            className="w-full bg-transparent text-sm text-text placeholder:text-faint focus:outline-none sm:w-44"
          />
          <button type="submit" className="grid size-6 place-items-center rounded-md text-bg" style={{ background: 'var(--accent)' }}>
            <Plus size={14} />
          </button>
        </form>
      </div>

      {projects.length === 0 ? (
        <div className="grid flex-1 place-items-center text-center">
          <div>
            <p className="text-sm text-dim">No projects yet.</p>
            <p className="mt-1 text-xs text-faint">Name one above to spin up a board with To Do / In Progress / Done.</p>
          </div>
        </div>
      ) : (
        <div className="grid flex-1 auto-rows-min grid-cols-1 gap-3 overflow-y-auto pr-1 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((p) => {
            const total = p.tasks.length || 1;
            const done = p.tasks.filter((t) => t.done).length;
            const pct = Math.round((done / total) * 100);
            return (
              <button
                key={p.id}
                onClick={() => openProject(p.id)}
                className="flex flex-col rounded-xl border border-line bg-card p-4 text-left transition-colors hover:border-line2"
                style={{ boxShadow: `inset 3px 0 0 0 ${p.color}` }}
              >
                <span className="text-2xl leading-none">{p.icon || '📋'}</span>
                <span className="mt-2 truncate text-sm font-semibold text-text">{p.name}</span>
                <span className="mt-0.5 text-[11px] text-faint">
                  {p.tasks.length} task{p.tasks.length === 1 ? '' : 's'}
                </span>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card2">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: p.color }} />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
