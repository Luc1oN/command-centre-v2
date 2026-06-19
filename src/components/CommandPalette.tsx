import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Play, CornerDownLeft } from 'lucide-react';
import { primaryNav, personalNav } from '@/data/mockData';
import type { ScreenId } from '@/data/mockData';
import type { LucideIcon } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  group: string;
  icon: LucideIcon;
  run: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onNavigate: (id: ScreenId) => void;
  onStartFocus: () => void;
}

export function CommandPalette({ open, onClose, onNavigate, onStartFocus }: Props) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const commands = useMemo<Command[]>(() => {
    const go = (id: ScreenId) => () => {
      onNavigate(id);
      onClose();
    };
    return [
      { id: 'focus-start', label: 'Start Focus Session', group: 'Actions', icon: Play, run: () => { onStartFocus(); onClose(); } },
      ...primaryNav.map((n) => ({ id: n.id, label: `Go to ${n.label}`, group: 'Navigate', icon: n.icon, run: go(n.id) })),
      ...personalNav.map((n) => ({ id: n.id, label: `Go to ${n.label}`, group: 'Personal', icon: n.icon, run: go(n.id) })),
    ];
  }, [onNavigate, onClose, onStartFocus]);

  const filtered = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  );

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[active]?.run();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, active, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.16, ease: [0.34, 1.4, 0.6, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
      >
        {/* Input */}
        <div className="flex items-center gap-2.5 border-b border-border px-4">
          <Search size={16} className="text-text3" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search anything…"
            className="flex-1 bg-transparent py-3.5 text-sm text-text placeholder:text-text3 focus:outline-none"
          />
          <kbd className="rounded border border-border bg-surface2 px-1.5 py-0.5 font-mono text-2xs text-text3">Esc</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-1.5">
          {filtered.length === 0 && <p className="px-3 py-6 text-center text-sm text-text3">No results for “{query}”</p>}
          {filtered.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={c.id}
                onMouseEnter={() => setActive(i)}
                onClick={c.run}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  i === active ? 'bg-surface3 text-text' : 'text-text2'
                }`}
              >
                <Icon size={16} className={i === active ? 'text-brand' : 'text-text3'} />
                <span className="flex-1">{c.label}</span>
                <span className="text-2xs text-text3">{c.group}</span>
                {i === active && <CornerDownLeft size={13} className="text-text3" />}
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
