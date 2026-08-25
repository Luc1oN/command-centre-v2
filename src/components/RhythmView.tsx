import type { ReactNode } from 'react';
import { Sparkles, Target, CalendarDays, Check, CloudSun, Clock, Plus } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';
import type { FocusItem } from '@/types';
import {
  PRINCIPLE,
  DAYS,
  RITUALS,
  KIND_COLOR,
  isoDate,
  datesThisWeek,
  ritualsForDay,
  dayTheme,
} from '@/data/routine';
import type { Ritual } from '@/data/routine';

const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

const PLACE_CLS: Record<string, string> = {
  WFH: 'text-[var(--color-pri-low)] border-[var(--color-pri-low)]/40',
  Office: 'text-[var(--color-pri-med)] border-[var(--color-pri-med)]/40',
  Weekend: 'text-[var(--color-done)] border-[var(--color-done)]/40',
};

function suggestions(day: number): string[] {
  const rits = ritualsForDay(day);
  const fitness = rits.find((r) => r.kind === 'fitness');
  const proj = rits.find((r) => r.kind === 'project') ?? rits.find((r) => r.kind === 'hobby');
  const weekend = day === 0 || day === 6;
  return [
    weekend ? 'Something for you' : 'A work priority',
    fitness ? fitness.name : weekend ? 'Move / outdoors' : 'Move your body',
    proj ? proj.name : weekend ? 'Rest / explore' : 'Project momentum',
  ];
}

function Section({ icon: Icon, title, children }: { icon: typeof Target; title: string; children: ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={14} className="text-[var(--accent)]" />
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">{title}</span>
      </div>
      {children}
    </div>
  );
}

export function RhythmView() {
  const rhythm = useAppStore((s) => s.rhythm);
  const toggleRitual = useAppStore((s) => s.toggleRitual);
  const setFocus = useAppStore((s) => s.setFocus);

  const now = new Date();
  const today = now.getDay();
  const todayISO = isoDate(now);
  const week = datesThisWeek(now);
  const theme = dayTheme(today);

  const doneToday = (id: string) => (rhythm.log[id] ?? []).includes(todayISO);
  const weekCount = (id: string) => (rhythm.log[id] ?? []).filter((d) => week.includes(d)).length;

  const logRitual = (id: string) => {
    const wasDone = doneToday(id);
    toggleRitual(id, todayISO);
    if (!wasDone) useHud.getState().bump(10);
  };

  const focusItems = rhythm.focus[todayISO] ?? [];
  const sugg = suggestions(today);
  const setSlot = (i: number, patch: Partial<FocusItem>) => {
    const base: FocusItem[] = [0, 1, 2].map((k) => rhythm.focus[todayISO]?.[k] ?? { id: uid(), text: '', done: false });
    base[i] = { ...base[i], ...patch, id: base[i].id || uid() };
    setFocus(todayISO, base);
  };

  return (
    <div className="glass flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto rounded-2xl p-5">
      {/* Principle */}
      <div className="rounded-xl border border-[rgba(var(--accent-rgb),0.3)] bg-[rgba(var(--accent-rgb),0.06)] p-3.5">
        <div className="mb-1 flex items-center gap-1.5">
          <Sparkles size={13} className="text-[var(--accent)]" />
          <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--accent)]">Operating principle</span>
        </div>
        <p className="text-sm font-medium leading-relaxed text-text">{PRINCIPLE}</p>
      </div>

      {/* Today */}
      <Section icon={CalendarDays} title="Today">
        <div className="rounded-xl border border-line bg-card p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-text">{theme.name}</span>
            <span className={`rounded border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${PLACE_CLS[theme.place]}`}>
              {theme.place}
            </span>
            <span className="rounded bg-card2 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-dim">
              {theme.theme}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-dim">{theme.focus}</p>

          {/* 3 meaningful things */}
          <div className="mt-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">3 meaningful things</span>
            <div className="mt-2 flex flex-col gap-1.5">
              {[0, 1, 2].map((i) => {
                const item = focusItems[i];
                const hasText = !!item?.text.trim();
                return (
                  <div key={i} className="flex items-center gap-2.5 rounded-lg border border-line bg-white/[0.01] px-2.5 py-1.5">
                    <button
                      onClick={() => hasText && setSlot(i, { done: !item?.done })}
                      disabled={!hasText}
                      className={`grid size-4 shrink-0 place-items-center rounded-full border transition-colors ${
                        item?.done ? 'border-[var(--color-done)] bg-[var(--color-done)] text-bg' : 'border-line2 text-transparent'
                      } ${hasText ? 'hover:border-[var(--color-done)]' : 'opacity-40'}`}
                    >
                      <Check size={11} />
                    </button>
                    <input
                      value={item?.text ?? ''}
                      onChange={(e) => setSlot(i, { text: e.target.value })}
                      placeholder={sugg[i]}
                      className={`w-full bg-transparent text-sm placeholder:text-faint focus:outline-none ${
                        item?.done ? 'text-faint line-through' : 'text-text'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's rituals */}
          {ritualsForDay(today).length > 0 && (
            <div className="mt-4">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">On the plan today</span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {ritualsForDay(today).map((r) => {
                  const done = doneToday(r.id);
                  return (
                    <button
                      key={r.id}
                      onClick={() => logRitual(r.id)}
                      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-xs transition-colors ${
                        done ? 'border-[var(--color-done)] bg-[var(--color-done)]/10 text-[var(--color-done)]' : 'border-line text-dim hover:text-text'
                      }`}
                    >
                      <span>{r.icon}</span>
                      {r.name}
                      {r.fixed?.day === today && (
                        <span className="flex items-center gap-0.5 text-[10px] text-faint">
                          <Clock size={10} />
                          {r.fixed.time}
                        </span>
                      )}
                      {done && <Check size={12} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Section>

      {/* Weekly targets */}
      <Section icon={Target} title="Weekly targets">
        <div className="flex flex-col gap-2">
          {RITUALS.map((r) => (
            <TargetRow key={r.id} ritual={r} count={weekCount(r.id)} doneToday={doneToday(r.id)} onLog={() => logRitual(r.id)} />
          ))}
        </div>
      </Section>

      {/* The week */}
      <Section icon={CalendarDays} title="The week">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
          {DAYS.map((d) => {
            const isToday = d.day === today;
            const weekend = d.place === 'Weekend';
            return (
              <div
                key={d.day}
                className={`rounded-xl border p-2.5 ${isToday ? 'border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.06)]' : 'border-line bg-card'}`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${isToday ? 'text-[var(--accent)]' : 'text-text'}`}>{d.name.slice(0, 3)}</span>
                  <span className="text-[9px] uppercase text-faint">{d.place}</span>
                </div>
                <div className="mt-0.5 text-[10px] uppercase tracking-wide text-dim">{d.theme}</div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {weekend ? (
                    <span className="text-[10px] text-faint">flexible</span>
                  ) : (
                    ritualsForDay(d.day).map((r) => (
                      <span key={r.id} title={r.name} className="text-sm leading-none">
                        {r.icon}
                      </span>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

function TargetRow({ ritual, count, doneToday, onLog }: { ritual: Ritual; count: number; doneToday: boolean; onLog: () => void }) {
  const pct = Math.min(100, (count / ritual.target) * 100);
  const met = count >= ritual.target;
  return (
    <div className="flex items-center gap-3 rounded-xl border border-line bg-card px-3 py-2.5">
      <span className="text-lg leading-none">{ritual.icon}</span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-sm text-text">{ritual.name}</span>
          {ritual.fixed && (
            <span className="flex items-center gap-0.5 text-[10px] text-faint">
              <Clock size={10} /> Thu {ritual.fixed.time}
            </span>
          )}
          {ritual.weatherDependent && (
            <span className="flex items-center gap-0.5 text-[10px] text-faint" title={ritual.alt}>
              <CloudSun size={11} /> weather
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-card2">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: KIND_COLOR[ritual.kind] }} />
        </div>
        {ritual.note && <p className="mt-1 text-[10px] text-faint">{ritual.note}</p>}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className={`font-mono tnum text-sm ${met ? 'text-[var(--color-done)]' : 'text-dim'}`}>
          {count}/{ritual.target}
        </span>
        <button
          onClick={onLog}
          className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] transition-colors ${
            doneToday ? 'border-[var(--color-done)] text-[var(--color-done)]' : 'border-line text-dim hover:text-text'
          }`}
        >
          {doneToday ? <Check size={11} /> : <Plus size={11} />} today
        </button>
      </div>
    </div>
  );
}
