import { Sun, Moon, Sunset, Bell, ChevronRight, Play } from 'lucide-react';
import { user, todayMetrics, focusSession } from '@/data/mockData';
import type { ImportantItem } from '@/data/mockData';
import { Card, Eyebrow } from '@/components/UI/Card';
import { RingProgress } from '@/components/UI/Charts';
import { useTopPriorities, useTasksDue } from '@/store/adapters';

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return { text: 'Good morning', Icon: Sun };
  if (h < 18) return { text: 'Good afternoon', Icon: Sunset };
  return { text: 'Good evening', Icon: Moon };
}

const IMPACT_DOT: Record<ImportantItem['impact'], string> = { high: 'bg-red', medium: 'bg-amber', low: 'bg-text3' };

function Stat({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <Card className="p-3">
      <Eyebrow>{label}</Eyebrow>
      <p className={`stat-number tnum mt-1 text-lg ${accent ?? 'text-text'}`}>{value}</p>
      {sub && <p className="text-2xs text-text3">{sub}</p>}
    </Card>
  );
}

export function MobileHome({ onStartFocus }: { onStartFocus: () => void }) {
  const { text: greet, Icon } = greeting();
  const priorities = useTopPriorities(3);
  const tasksDue = useTasksDue();

  return (
    <div className="flex flex-col gap-4 p-4 pb-24">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-lg font-bold tracking-tight text-text">
          <Icon size={18} className="text-amber" />
          {greet}, {user.firstName}
        </h1>
        <button className="relative grid size-9 place-items-center rounded-full border border-border bg-surface text-text2">
          <Bell size={16} />
          <span className="absolute right-2 top-2 size-1.5 rounded-full bg-brand" />
        </button>
      </div>

      {/* Focus score */}
      <Card className="flex items-center justify-between p-4">
        <div>
          <Eyebrow>Focus Score</Eyebrow>
          <p className="stat-number tnum mt-1 text-4xl text-text">{todayMetrics.focusScore.value}</p>
          <p className="mt-0.5 text-xs font-medium text-green">+{todayMetrics.focusScore.deltaPct}% from yesterday</p>
        </div>
        <RingProgress value={todayMetrics.focusScore.value} size={76} stroke={6} className="text-green" />
      </Card>

      {/* Today's focus */}
      <button onClick={onStartFocus} className="text-left">
        <Card interactive className="flex items-center justify-between p-4">
          <div className="min-w-0">
            <Eyebrow>Today’s Focus</Eyebrow>
            <p className="mt-1 truncate text-base font-semibold text-text">{focusSession.taskTitle}</p>
            <p className="truncate text-xs text-text3">{focusSession.nextAction}</p>
          </div>
          <ChevronRight size={18} className="shrink-0 text-text3" />
        </Card>
      </button>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Tasks Due" value={String(tasksDue.value)} sub={`${tasksDue.highPriority} high`} accent="text-text" />
        <Stat label="Meetings" value={String(todayMetrics.meetings.value)} sub="Today" />
        <Stat label="Focus Time" value={`${todayMetrics.focusTime.hours}h`} sub="Today" />
      </div>

      {/* Top priorities */}
      <Card className="p-4">
        <Eyebrow>Top Priorities</Eyebrow>
        <div className="mt-2 flex flex-col gap-0.5">
          {priorities.length === 0 && <p className="py-4 text-center text-xs text-text3">Nothing urgent right now.</p>}
          {priorities.map((item) => (
            <div key={item.rank} className="flex items-center gap-3 py-2">
              <span className="grid size-5 place-items-center rounded-full bg-surface3 text-2xs font-semibold text-text2">{item.rank}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{item.title}</p>
                <p className="flex items-center gap-1.5 text-2xs text-text3">
                  <span className={`size-1.5 rounded-full ${IMPACT_DOT[item.impact]}`} />
                  {item.due}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Start focus */}
      <button
        onClick={onStartFocus}
        className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-brand to-purple py-3.5 text-sm font-semibold text-white shadow-lg"
      >
        <Play size={16} /> Start Focus Session
      </button>
    </div>
  );
}
