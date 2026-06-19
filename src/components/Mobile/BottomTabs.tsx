import { Home, ListTodo, FolderKanban, Calendar, MoreHorizontal } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export type MobileTab = 'home' | 'tasks' | 'projects' | 'calendar' | 'more';

const TABS: { id: MobileTab; label: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'tasks', label: 'Tasks', icon: ListTodo },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'more', label: 'More', icon: MoreHorizontal },
];

export function BottomTabs({ current, onChange }: { current: MobileTab; onChange: (t: MobileTab) => void }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex items-stretch border-t border-border bg-surface/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg lg:hidden">
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = current === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-2xs transition-colors ${active ? 'text-brand' : 'text-text3'}`}
          >
            <Icon size={20} className={active ? 'text-brand' : 'text-text3'} />
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
