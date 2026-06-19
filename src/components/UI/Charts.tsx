// Lightweight inline-SVG charts. Colour comes from the `text-*`
// class on the element (stroke/fill use currentColor).

import type { ReactNode } from 'react';

interface RingProps {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  className?: string; // colour, e.g. "text-green"
  label?: ReactNode;
}

export function RingProgress({ value, size = 56, stroke = 5, className = 'text-brand', label }: RingProps) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, Math.max(0, value)) / 100) * c;
  return (
    <div className="relative inline-grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className={className}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-surface3"
          opacity={0.5}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.2,0,0.2,1)' }}
        />
      </svg>
      {label != null && <div className="absolute inset-0 grid place-items-center">{label}</div>}
    </div>
  );
}

interface SparkProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  filled?: boolean;
}

export function Sparkline({ data, width = 96, height = 32, className = 'text-brand', filled = true }: SparkProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((d, i) => {
    const x = i * step;
    const y = height - ((d - min) / span) * (height - 4) - 2;
    return [x, y] as const;
  });
  const line = pts.map(([x, y]) => `${x},${y}`).join(' ');
  const area = `${pts[0][0]},${height} ${line} ${pts[pts.length - 1][0]},${height}`;
  return (
    <svg width={width} height={height} className={className} preserveAspectRatio="none">
      {filled && <polygon points={area} fill="currentColor" opacity={0.12} />}
      <polyline points={line} fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

interface BarsProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  highlightLast?: boolean;
}

export function MiniBars({ data, width = 96, height = 32, className = 'text-brand', highlightLast }: BarsProps) {
  const max = Math.max(...data) || 1;
  const gap = 3;
  const bw = (width - gap * (data.length - 1)) / data.length;
  return (
    <svg width={width} height={height} className={className}>
      {data.map((d, i) => {
        const h = Math.max(2, (d / max) * (height - 2));
        const dim = highlightLast && i !== data.length - 1;
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={height - h}
            width={bw}
            height={h}
            rx={1.5}
            fill="currentColor"
            opacity={dim ? 0.3 : 0.9}
          />
        );
      })}
    </svg>
  );
}
