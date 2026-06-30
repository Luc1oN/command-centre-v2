import { useEffect, useState } from 'react';
import { useHud } from '@/store';

const clamp = (n: number) => Math.max(2, Math.min(100, n));
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function WeeklyChart() {
  const [data, setData] = useState<number[]>([38, 52, 44, 61, 57, 70, useHud.getState().momentum]);

  // Flow chart updates every ~2.2s — today's point tracks live momentum
  useEffect(() => {
    const id = setInterval(() => {
      const m = useHud.getState().momentum;
      setData((prev) => {
        const next = [...prev];
        next[6] = clamp(m);
        for (let i = 0; i < 6; i++) next[i] = clamp(next[i] + (Math.random() - 0.5) * 2);
        return next;
      });
    }, 2200);
    return () => clearInterval(id);
  }, []);

  const w = 280;
  const h = 96;
  const pad = 6;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - (v / 100) * (h - pad * 2);
    return [x, y] as const;
  });
  const line = pts.map((p) => p.join(',')).join(' ');
  const area = `${pad},${h - pad} ${line} ${w - pad},${h - pad}`;
  const today = pts[pts.length - 1];

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">Weekly Focus</span>
        <span className="text-[10px] text-faint">7 days</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: 96 }}>
        <defs>
          <linearGradient id="wk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill="url(#wk)" />
        <polyline points={line} fill="none" stroke="var(--accent)" strokeWidth={1.8} strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={today[0]} cy={today[1]} r={3.5} fill="var(--accent)" style={{ filter: 'drop-shadow(0 0 5px var(--accent))' }} />
      </svg>
      <div className="mt-1.5 flex justify-between px-1 text-[10px] text-faint">
        {DAY_LABELS.map((d, i) => (
          <span key={i} className={i === 6 ? 'font-semibold text-[var(--accent)]' : ''}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
}
