import type { ReactNode } from 'react';
import { Sparkles, ArrowUpRight, ArrowDownRight, ChevronRight, AlertCircle } from 'lucide-react';
import { intelligence } from '@/data/mockData';
import { Eyebrow } from '@/components/UI/Card';
import { Sparkline, MiniBars, RingProgress } from '@/components/UI/Charts';
import { useUiStore } from '@/store/useUiStore';

function Row({ children }: { children: ReactNode }) {
  return <div className="border-t border-border px-4 py-3.5 first:border-t-0">{children}</div>;
}

export function IntelligenceRail() {
  const navigate = useUiStore((s) => s.navigate);
  const { weeklyCompletion: wc, projectsOnTrack: pt, focusTimeWtd: ft, meetingsTrend: mt, overdueTasks, aiInsight } =
    intelligence;

  return (
    <aside className="hidden w-[300px] shrink-0 overflow-y-auto border-l border-border bg-surface/40 backdrop-blur-sm xl:block">
      <div className="px-4 py-4">
        <Eyebrow>Intelligence</Eyebrow>
      </div>

      <Row>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text2">Weekly completion</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green">
            <ArrowUpRight size={12} />
            {wc.deltaPct}%
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="stat-number tnum text-xl text-text">{wc.value}%</span>
          <MiniBars data={wc.bars} className="text-brand" highlightLast width={120} height={34} />
        </div>
      </Row>

      <Row>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text2">Projects on track</span>
        </div>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="stat-number tnum text-xl text-text">
            {pt.onTrack}
            <span className="text-base text-text3"> / {pt.total}</span>
          </span>
          <RingProgress
            value={pt.pct}
            size={44}
            stroke={4}
            className="text-green"
            label={<span className="tnum text-2xs font-semibold text-text2">{pt.pct}%</span>}
          />
        </div>
      </Row>

      <Row>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text2">Focus time (WTD)</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green">
            <ArrowUpRight size={12} />
            {ft.deltaHours}h
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="stat-number tnum text-xl text-text">
            {ft.hours}
            <span className="text-sm text-text3"> hrs</span>
          </span>
          <Sparkline data={ft.spark} className="text-purple" width={120} height={34} />
        </div>
      </Row>

      <Row>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text2">Meetings (WTD)</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-medium text-green">
            <ArrowDownRight size={12} />
            {Math.abs(mt.deltaPct)}%
          </span>
        </div>
        <div className="mt-2 flex items-end justify-between gap-3">
          <span className="stat-number tnum text-xl text-text">{mt.deltaPct}%</span>
          <MiniBars data={mt.bars} className="text-text3" width={120} height={34} />
        </div>
      </Row>

      <Row>
        <button onClick={() => navigate('tasks')} className="flex w-full items-center justify-between">
          <span className="flex items-center gap-2 text-xs text-text2">
            <AlertCircle size={14} className="text-amber" />
            Overdue tasks
          </span>
          <span className="flex items-center gap-1.5">
            <span className="stat-number tnum text-lg text-amber">{overdueTasks}</span>
            <ChevronRight size={14} className="text-text3" />
          </span>
        </button>
      </Row>

      {/* AI insight */}
      <div className="m-4 rounded-lg border border-brand/30 bg-brand-glow p-3.5">
        <div className="mb-1.5 flex items-center gap-1.5">
          <Sparkles size={14} className="text-brand" />
          <Eyebrow className="text-brand/80">AI Insight</Eyebrow>
        </div>
        <p className="text-xs leading-relaxed text-text2">{aiInsight}</p>
        <button
          onClick={() => navigate('insights')}
          className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-brand transition-all hover:gap-1.5"
        >
          View all insights <ChevronRight size={13} />
        </button>
      </div>
    </aside>
  );
}
