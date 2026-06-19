import { calendarEvents } from '@/data/mockData';
import type { CalendarEvent } from '@/data/mockData';
import { Card, Eyebrow } from '@/components/UI/Card';

const TYPE_STYLES: Record<CalendarEvent['type'], string> = {
  meeting: 'border-brand/40 bg-brand-glow text-text',
  focus: 'border-purple/40 bg-purple-bg text-text',
  personal: 'border-border bg-surface2 text-text2',
};
const TYPE_DOT: Record<CalendarEvent['type'], string> = {
  meeting: 'bg-brand',
  focus: 'bg-purple',
  personal: 'bg-text3',
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function CalendarView() {
  const today = new Date();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-text">Calendar</h1>
          <p className="mt-0.5 text-sm text-text2">
            {today.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Week strip */}
      <div className="mb-3 grid grid-cols-7 gap-2">
        {DAYS.map((d, i) => {
          const isToday = i === (today.getDay() + 6) % 7;
          return (
            <div
              key={d}
              className={`rounded-md border py-2 text-center ${isToday ? 'border-brand bg-brand-glow' : 'border-border bg-surface'}`}
            >
              <div className="text-2xs text-text3">{d}</div>
              <div className={`tnum text-sm font-semibold ${isToday ? 'text-brand' : 'text-text2'}`}>{17 + i}</div>
            </div>
          );
        })}
      </div>

      {/* Day schedule */}
      <Card className="p-4">
        <Eyebrow>Today’s Schedule</Eyebrow>
        <div className="mt-3 flex flex-col gap-2">
          {calendarEvents.map((e) => (
            <div key={e.id} className={`flex items-center gap-3 rounded-md border px-3 py-2.5 ${TYPE_STYLES[e.type]}`}>
              <span className={`size-2 shrink-0 rounded-full ${TYPE_DOT[e.type]}`} />
              <span className="flex-1 text-sm font-medium">{e.title}</span>
              <span className="tnum text-2xs text-text3">
                {e.start} – {e.end}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
