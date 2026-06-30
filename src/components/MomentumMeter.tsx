import { useHud } from '@/store';

export function MomentumMeter() {
  const momentum = useHud((s) => s.momentum);
  const history = useHud((s) => s.momentumHistory);
  const isIdle = useHud((s) => s.isIdle);

  const w = 132;
  const h = 40;
  const pts = history.map((v, i) => {
    const x = (i / (history.length - 1)) * w;
    const y = h - (v / 100) * (h - 5) - 2.5;
    return [x, y] as const;
  });
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = `0,${h} ${line} ${w},${h}`;
  const color = isIdle ? 'var(--color-faint)' : 'var(--accent)';

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-[10px] font-medium uppercase tracking-wider text-faint">
          {isIdle ? 'Idle' : 'Momentum'}
        </div>
        <div className="font-mono tnum text-xl leading-none" style={{ color }}>
          {Math.round(momentum)}
          <span className="text-xs text-faint">/100</span>
        </div>
      </div>
      <svg width={w} height={h} className="shrink-0">
        <polygon points={area} fill={color} opacity={0.12} />
        <polyline points={line} fill="none" stroke={color} strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}
