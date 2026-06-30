import { useAppStore } from '@/store/useAppStore';

export function BoardDonut() {
  const tasks = useAppStore((s) => s.tasks);
  const buckets = useAppStore((s) => s.buckets);

  const total = tasks.length || 1;
  const donePct = Math.round((tasks.filter((t) => t.done).length / total) * 100);

  const segs = buckets.map((b) => ({
    label: b.title,
    color: b.color,
    v: tasks.filter((t) => t.bucketId === b.id).length,
  }));

  const size = 132;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-faint">Board Breakdown</div>
      <div className="flex items-center gap-4">
        <div className="relative grid shrink-0 place-items-center" style={{ width: size, height: size }}>
          <svg width={size} height={size} className="-rotate-90">
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--track)" strokeWidth={stroke} />
            {segs.map((s, i) => {
              const frac = s.v / total;
              const dash = frac * c;
              const el = (
                <circle
                  key={i}
                  cx={size / 2}
                  cy={size / 2}
                  r={r}
                  fill="none"
                  stroke={s.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${c - dash}`}
                  strokeDashoffset={-acc * c}
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              );
              acc += frac;
              return el;
            })}
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="font-mono tnum text-2xl font-medium leading-none">{donePct}%</span>
            <span className="text-[10px] text-faint">done</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {segs.map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-xs">
              <span className="size-2.5 rounded-sm" style={{ background: s.color }} />
              <span className="text-dim">{s.label}</span>
              <span className="font-mono tnum ml-auto text-text">{s.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
