import { Sun, Moon, Sunset, ChevronDown, Sparkles, ChevronRight, Play, Zap } from 'lucide-react';
import { user, todayMetrics } from '@/data/mockData';
import type { ImportantItem } from '@/data/mockData';
import { Card, Eyebrow } from '@/components/UI/Card';
import { MetricCard } from '@/components/UI/MetricCard';
import { RingProgress, Sparkline } from '@/components/UI/Charts';
import { ActiveWorkBoard } from './ActiveWorkBoard';
import { useBoardColumns, useTopPriorities, useTasksDue } from '@/store/adapters';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: Sun };
  if (h < 18) return { text: 'Good afternoon', Icon: Sunset };
  return { text: 'Good evening', Icon: Moon };
}

const IMPACT_DOT: Record<ImportantItem['impact'], string> = {
  high: 'bg-red',
  medium: 'bg-amber',
  low: 'bg-text3',
};

function ImportantRow({ item, onFocus }: { item: ImportantItem; onFocus?: () => void }) {
  return (
    <div className="group flex items-center gap-3 rounded-md px-2 py-2.5 transition-colors hover:bg-surface2">
      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-surface3 text-2xs font-semibold text-text2">
        {item.rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-text">{item.title}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-2xs text-text3">
          <span className={`size-1.5 rounded-full ${IMPACT_DOT[item.impact]}`} />
          <span className="capitalize">{item.impact} impact</span>
          <span className="text-text3">·</span>
          {item.due}
        </p>
      </div>
      {onFocus && item.rank === 1 && (
        <button
          onClick={onFocus}
          className="flex items-center gap-1 rounded-sm border border-border bg-surface px-2 py-1 text-2xs font-medium text-text2 opacity-0 transition-opacity hover:text-text group-hover:opacity-100"
        >
          <Play size={11} /> Focus
        </button>
      )}
    </div>
  );
}

export function TodayView({ onStartFocus }: { onStartFocus?: () => void }) {
  const { text: greet, Icon } = greeting();
  const columns = useBoardColumns();
  const priorities = useTopPriorities(3);
  const tasksDue = useTasksDue();

  return (
    <div className="mx-auto max-w-6xl">
      {/* Greeting header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-text">
            <Icon size={24} className="text-amber" />
            {greet}, {user.firstName}
          </h1>
          <p className="mt-1 text-sm text-text2">Let’s execute what matters today.</p>
        </div>
        <button className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-sm text-text2 transition-colors hover:border-border2 hover:text-text">
          <Sparkles size={15} className="text-brand" />
          AI Chief of Staff
          <ChevronDown size={14} className="text-text3" />
        </button>
      </div>

      {/* Metric row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          label="Focus Score"
          value={todayMetrics.focusScore.value}
          delta={todayMetrics.focusScore.deltaPct}
          deltaLabel="from yesterday"
          chart={<RingProgress value={todayMetrics.focusScore.value} className="text-green" />}
        />
        <MetricCard
          label="Tasks Due"
          value={tasksDue.value}
          sub={
            tasksDue.highPriority > 0 ? (
              <span className="text-red">{tasksDue.highPriority} high priority</span>
            ) : (
              'due today / overdue'
            )
          }
        />
        <MetricCard label="Meetings" value={todayMetrics.meetings.value} sub={todayMetrics.meetings.label} />
        <MetricCard
          label="Focus Time"
          value={todayMetrics.focusTime.hours}
          unit="hrs"
          sub="Today"
          chart={<Sparkline data={todayMetrics.focusTime.spark} className="text-purple" width={80} height={36} />}
        />
        <MetricCard
          label="Energy"
          value={todayMetrics.energy.level}
          sub={`Peak ${todayMetrics.energy.peak}`}
          chart={
            <RingProgress
              value={86}
              className="text-amber"
              label={<Zap size={16} className="text-amber" />}
            />
          }
        />
      </div>

      {/* Work area */}
      <div className="mt-4 grid gap-3 lg:grid-cols-[300px_1fr]">
        {/* Most important work */}
        <Card className="flex flex-col p-4">
          <div className="mb-2 flex items-center justify-between">
            <Eyebrow>Most Important Work</Eyebrow>
          </div>
          <div className="flex flex-col gap-0.5">
            {priorities.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-text3">Nothing urgent right now — you’re clear.</p>
            ) : (
              priorities.map((item) => <ImportantRow key={item.rank} item={item} onFocus={onStartFocus} />)
            )}
          </div>
          <button className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-medium text-brand hover:gap-1.5 transition-all">
            View all my tasks <ChevronRight size={13} />
          </button>
        </Card>

        {/* Board */}
        <ActiveWorkBoard columns={columns} limitPerColumn={6} />
      </div>
    </div>
  );
}
