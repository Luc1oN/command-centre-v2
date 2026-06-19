import type { Priority } from '@/data/mockData';

const PRIORITY_STYLES: Record<Priority, string> = {
  high: 'text-red bg-red-bg border-red-bd',
  medium: 'text-amber bg-amber-bg border-amber-bd',
  low: 'text-text2 bg-surface3 border-border2',
};

const PRIORITY_LABEL: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export function PriorityChip({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex items-center rounded-xs border px-1.5 py-0.5 text-2xs font-semibold ${PRIORITY_STYLES[priority]}`}>
      {PRIORITY_LABEL[priority]}
    </span>
  );
}

/** Left colour accent bar mapped to priority — gives cards instant scanability. */
export const PRIORITY_ACCENT: Record<Priority, string> = {
  high: 'bg-red',
  medium: 'bg-amber',
  low: 'bg-text3',
};

type Health = 'On Track' | 'At Risk' | 'Off Track';
const HEALTH_STYLES: Record<Health, { dot: string; text: string }> = {
  'On Track': { dot: 'bg-green', text: 'text-green' },
  'At Risk': { dot: 'bg-amber', text: 'text-amber' },
  'Off Track': { dot: 'bg-red', text: 'text-red' },
};

export function HealthBadge({ health }: { health: Health }) {
  const s = HEALTH_STYLES[health];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {health}
    </span>
  );
}

const AVATAR_BG = ['bg-brand', 'bg-purple', 'bg-amber', 'bg-green'];

export function Avatar({ initials, index = 0, size = 'md' }: { initials: string; index?: number; size?: 'sm' | 'md' }) {
  const dim = size === 'sm' ? 'size-5 text-2xs' : 'size-7 text-2xs';
  return (
    <span
      className={`inline-grid place-items-center rounded-full font-semibold text-white ring-2 ring-surface ${AVATAR_BG[index % AVATAR_BG.length]} ${dim}`}
    >
      {initials}
    </span>
  );
}

export function AvatarStack({ people, max = 3 }: { people: { initials: string }[]; max?: number }) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className="flex items-center -space-x-1.5">
      {shown.map((p, i) => (
        <Avatar key={i} initials={p.initials} index={i} size="sm" />
      ))}
      {extra > 0 && (
        <span className="inline-grid size-5 place-items-center rounded-full bg-surface3 text-2xs font-semibold text-text2 ring-2 ring-surface">
          +{extra}
        </span>
      )}
    </div>
  );
}
