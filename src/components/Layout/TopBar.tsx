import { useState } from 'react';
import { Search, Bell, Plus, AlertCircle, CalendarClock, ChevronRight } from 'lucide-react';
import { primaryNav } from '@/data/mockData';
import type { ScreenId } from '@/data/mockData';
import { useAppStore } from '@/store/useAppStore';
import { useUiStore } from '@/store/useUiStore';

interface TopBarProps {
  current: ScreenId;
  onNavigate: (id: ScreenId) => void;
  onOpenPalette: () => void;
}

// Curated quick-switch tabs shown in the centre of the top bar.
const QUICK_TABS: ScreenId[] = ['today', 'focus', 'projects', 'insights', 'calendar', 'ai'];

function NotificationsBell({ onNavigate }: { onNavigate: (id: ScreenId) => void }) {
  const tasks = useAppStore((s) => s.tasks);
  const [open, setOpen] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const overdue = tasks.filter((t) => !t.done && t.due && t.due < today);
  const dueToday = tasks.filter((t) => !t.done && t.due === today);
  const count = overdue.length + dueToday.length;

  return (
    <div className="relative">
      <button
        aria-label="Notifications"
        onClick={() => setOpen((o) => !o)}
        className="relative grid size-9 place-items-center rounded-md text-text3 transition-colors hover:bg-surface2 hover:text-text"
      >
        <Bell size={17} />
        {count > 0 && <span className="absolute right-2 top-2 size-1.5 rounded-full bg-red ring-2 ring-surface" />}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-72 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
            <div className="border-b border-border px-3 py-2.5 text-2xs font-semibold uppercase tracking-wider text-text3">
              Notifications
            </div>
            {count === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-text3">You’re all caught up ✨</p>
            ) : (
              <div className="p-1.5">
                {overdue.length > 0 && (
                  <button
                    onClick={() => { onNavigate('tasks'); setOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface2"
                  >
                    <AlertCircle size={16} className="text-red" />
                    <span className="flex-1 text-sm text-text">{overdue.length} task{overdue.length === 1 ? '' : 's'} overdue</span>
                    <ChevronRight size={14} className="text-text3" />
                  </button>
                )}
                {dueToday.length > 0 && (
                  <button
                    onClick={() => { onNavigate('tasks'); setOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-surface2"
                  >
                    <CalendarClock size={16} className="text-amber" />
                    <span className="flex-1 text-sm text-text">{dueToday.length} due today</span>
                    <ChevronRight size={14} className="text-text3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export function TopBar({ current, onNavigate, onOpenPalette }: TopBarProps) {
  const openTask = useUiStore((s) => s.openTask);
  const tabLabel = (id: ScreenId) => (id === 'today' ? 'Today' : primaryNav.find((n) => n.id === id)?.label ?? id);

  // Create a fresh task in Today (or the first bucket) and open it for editing.
  const handleNew = () => {
    const st = useAppStore.getState();
    const bucket = st.buckets.find((b) => b.title.toLowerCase() === 'today') ?? st.buckets[0];
    st.addTask({ text: 'New task', bucketId: bucket?.id });
    const created = useAppStore.getState().tasks.at(-1);
    if (created) openTask(created.id);
  };

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
        <NotificationsBell onNavigate={onNavigate} />
        <button
          onClick={handleNew}
          className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-d"
        >
          <Plus size={15} />
          New
        </button>
      </div>
    </header>
  );
}
