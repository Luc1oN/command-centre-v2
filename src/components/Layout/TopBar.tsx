import { Search, Bell, Plus } from 'lucide-react';
import { primaryNav } from '@/data/mockData';
import type { ScreenId } from '@/data/mockData';

interface TopBarProps {
  current: ScreenId;
  onNavigate: (id: ScreenId) => void;
  onOpenPalette: () => void;
}

// Curated quick-switch tabs shown in the centre of the top bar.
const QUICK_TABS: ScreenId[] = ['today', 'focus', 'projects', 'insights', 'calendar', 'ai'];

export function TopBar({ current, onNavigate, onOpenPalette }: TopBarProps) {
  const tabLabel = (id: ScreenId) => (id === 'today' ? 'Today' : primaryNav.find((n) => n.id === id)?.label ?? id);

  return (
    <header className="flex h-[58px] shrink-0 items-center gap-3 border-b border-border bg-surface/40 px-4 backdrop-blur-sm">
      {/* Search */}
      <button
        onClick={onOpenPalette}
        className="group flex w-full max-w-xs items-center gap-2 rounded-md border border-border bg-surface2/60 px-3 py-1.5 text-left text-sm text-text3 transition-colors hover:border-border2 hover:text-text2"
      >
        <Search size={15} />
        <span className="flex-1">Search anything…</span>
        <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-2xs text-text3">⌘K</kbd>
      </button>

      {/* Centre quick tabs */}
      <nav className="mx-auto hidden items-center gap-0.5 rounded-md border border-border bg-surface2/50 p-0.5 xl:flex">
        {QUICK_TABS.map((id) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={[
              'rounded-sm px-3 py-1 text-sm transition-colors',
              current === id ? 'bg-surface3 font-medium text-text shadow-sm' : 'text-text2 hover:text-text',
            ].join(' ')}
          >
            {tabLabel(id)}
          </button>
        ))}
      </nav>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1.5 xl:ml-0">
        <button
          aria-label="Notifications"
          className="relative grid size-9 place-items-center rounded-md text-text3 transition-colors hover:bg-surface2 hover:text-text"
        >
          <Bell size={17} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand ring-2 ring-surface" />
        </button>
        <button className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-d">
          <Plus size={15} />
          New
        </button>
      </div>
    </header>
  );
}
