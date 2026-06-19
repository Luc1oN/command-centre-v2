import { Command, Settings, Sun, Moon } from 'lucide-react';
import { primaryNav, personalNav, user } from '@/data/mockData';
import type { ScreenId, NavItem } from '@/data/mockData';

interface SidebarProps {
  current: ScreenId;
  onNavigate: (id: ScreenId) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

function NavButton({ item, active, onClick }: { item: NavItem; active: boolean; onClick: () => void }) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={[
        'group relative flex w-full items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm transition-colors',
        active ? 'bg-surface3 font-medium text-text' : 'text-text2 hover:bg-surface2 hover:text-text',
      ].join(' ')}
    >
      {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" />}
      <Icon size={16} className={active ? 'text-brand' : 'text-text3 group-hover:text-text2'} />
      <span className="truncate">{item.label}</span>
    </button>
  );
}

export function Sidebar({ current, onNavigate, theme, onToggleTheme }: SidebarProps) {
  return (
    <aside className="flex h-full w-[232px] shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-sm">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-4 py-4">
        <div className="grid size-7 place-items-center rounded-md bg-gradient-to-br from-brand to-purple shadow-sm">
          <Command size={15} className="text-white" />
        </div>
        <span className="text-sm font-semibold tracking-tight text-text">Command Centre</span>
      </div>

      {/* User */}
      <button className="mx-3 mb-2 flex items-center gap-2.5 rounded-sm px-1.5 py-1.5 text-left transition-colors hover:bg-surface2">
        <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-purple to-brand text-2xs font-semibold text-white">
          {user.initials}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-medium text-text">{user.fullName}</span>
          <span className="block truncate text-2xs text-text3">{user.role}</span>
        </span>
      </button>

      {/* Primary nav */}
      <nav className="flex flex-col gap-0.5 px-3">
        {primaryNav.map((item) => (
          <NavButton key={item.id} item={item} active={current === item.id} onClick={() => onNavigate(item.id)} />
        ))}
      </nav>

      {/* Personal section */}
      <div className="px-5 pb-1.5 pt-5 text-2xs font-semibold uppercase tracking-wider text-text3">Personal</div>
      <nav className="flex flex-col gap-0.5 px-3">
        {personalNav.map((item) => (
          <NavButton key={item.id} item={item} active={current === item.id} onClick={() => onNavigate(item.id)} />
        ))}
      </nav>

      <div className="flex-1" />

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-3">
        <button className="flex items-center gap-2.5 rounded-sm px-2.5 py-1.5 text-sm text-text2 transition-colors hover:bg-surface2 hover:text-text">
          <Settings size={16} className="text-text3" />
          Settings
        </button>
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="grid size-8 place-items-center rounded-sm text-text3 transition-colors hover:bg-surface2 hover:text-text"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </aside>
  );
}
