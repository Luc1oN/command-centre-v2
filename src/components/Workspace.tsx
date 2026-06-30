import { LayoutDashboard, FolderKanban, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHud } from '@/store';
import type { HudView } from '@/store';
import { DashboardBoard } from './DashboardBoard';
import { ProjectsView } from './ProjectsView';
import { ProjectBoard } from './ProjectBoard';
import { BrainDump } from './BrainDump';

const TABS: { id: HudView; label: string; icon: LucideIcon }[] = [
  { id: 'dashboard', label: 'Board', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'braindump', label: 'Brain Dump', icon: Sparkles },
];

export function Workspace() {
  const view = useHud((s) => s.view);
  const setView = useHud((s) => s.setView);
  const activeProjectId = useHud((s) => s.activeProjectId);

  return (
    <main className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex w-fit items-center gap-0.5 rounded-xl border border-line bg-card p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = view === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setView(t.id)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
                active ? 'text-bg' : 'text-dim hover:text-text'
              }`}
              style={active ? { background: 'var(--accent)' } : undefined}
            >
              <Icon size={14} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className="flex min-h-0 flex-1">
        {view === 'dashboard' && <DashboardBoard />}
        {view === 'projects' && (activeProjectId ? <ProjectBoard projectId={activeProjectId} /> : <ProjectsView />)}
        {view === 'braindump' && <BrainDump />}
      </div>
    </main>
  );
}
