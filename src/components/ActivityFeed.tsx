import { Plus, ArrowRight, MoveRight, Check, Timer } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useHud } from '@/store';
import type { ActivityKind } from '@/store';

const ICON: Record<ActivityKind, { icon: LucideIcon; color: string }> = {
  add: { icon: Plus, color: 'var(--color-todo)' },
  advance: { icon: ArrowRight, color: 'var(--color-prog)' },
  move: { icon: MoveRight, color: 'var(--accent)' },
  complete: { icon: Check, color: 'var(--color-done)' },
  session: { icon: Timer, color: 'var(--accent)' },
};

function since(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
}

export function ActivityFeed() {
  const activity = useHud((s) => s.activity);
  const recent = activity.slice(0, 12);

  return (
    <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl p-4">
      <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-faint">Activity</div>
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {recent.length === 0 && <p className="py-6 text-center text-xs text-faint">No activity yet — make a move.</p>}
        {recent.map((a) => {
          const { icon: Icon, color } = ICON[a.kind];
          return (
            <div key={a.id} className="flex items-start gap-2.5 animate-in">
              <span
                className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md"
                style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}
              >
                <Icon size={12} />
              </span>
              <span className="flex-1 text-xs leading-snug text-dim">{a.text}</span>
              <span className="font-mono text-[10px] text-faint">{since(a.ts)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
