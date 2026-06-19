import { motion } from 'framer-motion';
import { Target, BarChart3, Sparkles, Settings, Sun, Moon, X } from 'lucide-react';
import { personalNav } from '@/data/mockData';
import type { ScreenId } from '@/data/mockData';
import type { LucideIcon } from 'lucide-react';
import { useUiStore } from '@/store/useUiStore';

interface Props {
  onClose: () => void;
  onNavigate: (id: ScreenId) => void;
  onStartFocus: () => void;
}

export function MobileMore({ onClose, onNavigate, onStartFocus }: Props) {
  const theme = useUiStore((s) => s.theme);
  const onToggleTheme = useUiStore((s) => s.toggleTheme);
  const quick: { id: ScreenId; label: string; icon: LucideIcon }[] = [
    { id: 'insights', label: 'Insights', icon: BarChart3 },
    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
  ];

  const Item = ({ icon: Icon, label, onClick }: { icon: LucideIcon; label: string; onClick: () => void }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-left text-sm text-text transition-colors hover:bg-surface2"
    >
      <Icon size={18} className="text-text3" />
      {label}
    </button>
  );

  return (
    <div className="fixed inset-0 z-40 lg:hidden" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 320 }}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-x-0 bottom-0 rounded-t-2xl border-t border-border bg-surface p-3 pb-[calc(env(safe-area-inset-bottom)+1rem)]"
      >
        <div className="mb-2 flex items-center justify-between px-2">
          <span className="text-2xs font-semibold uppercase tracking-wider text-text3">More</span>
          <button onClick={onClose} className="grid size-7 place-items-center rounded-full text-text3 hover:bg-surface2">
            <X size={16} />
          </button>
        </div>

        <Item icon={Target} label="Start Focus Session" onClick={() => { onStartFocus(); onClose(); }} />
        {quick.map((q) => (
          <Item key={q.id} icon={q.icon} label={q.label} onClick={() => { onNavigate(q.id); onClose(); }} />
        ))}

        <div className="my-2 border-t border-border" />

        {personalNav.map((p) => (
          <Item key={p.id} icon={p.icon} label={p.label} onClick={() => { onNavigate(p.id); onClose(); }} />
        ))}

        <div className="my-2 border-t border-border" />
        <Item icon={Settings} label="Settings" onClick={() => { onNavigate('settings'); onClose(); }} />
        <Item icon={theme === 'dark' ? Sun : Moon} label={theme === 'dark' ? 'Light mode' : 'Dark mode'} onClick={onToggleTheme} />
      </motion.div>
    </div>
  );
}
