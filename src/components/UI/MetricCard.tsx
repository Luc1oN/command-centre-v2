import type { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, Eyebrow } from './Card';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  unit?: string;
  sub?: ReactNode;
  delta?: number; // percentage; sign drives colour + arrow
  deltaLabel?: string;
  chart?: ReactNode; // ring / sparkline / bars slot
  className?: string;
}

/** Compact KPI tile — value left, optional chart right, delta below. */
export function MetricCard({ label, value, unit, sub, delta, deltaLabel, chart, className = '' }: MetricCardProps) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card className={`p-4 ${className}`}>
      <Eyebrow>{label}</Eyebrow>
      <div className="mt-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="stat-number tnum text-2xl leading-none text-text">{value}</span>
            {unit && <span className="text-xs font-medium text-text3">{unit}</span>}
          </div>
          {(delta != null || sub) && (
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              {delta != null && (
                <span className={`inline-flex items-center gap-0.5 font-medium ${up ? 'text-green' : 'text-red'}`}>
                  {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                  {Math.abs(delta)}%
                </span>
              )}
              {(deltaLabel || sub) && <span className="text-text3">{deltaLabel ?? sub}</span>}
            </div>
          )}
        </div>
        {chart && <div className="shrink-0">{chart}</div>}
      </div>
    </Card>
  );
}
