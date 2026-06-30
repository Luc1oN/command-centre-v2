import { Play, Pause, RotateCcw, Brain, Coffee } from 'lucide-react';
import { useHud } from '@/store';

const pad = (n: number) => String(n).padStart(2, '0');

export function Pomodoro() {
  const pMode = useHud((s) => s.pMode);
  const pRunning = useHud((s) => s.pRunning);
  const pSecondsLeft = useHud((s) => s.pSecondsLeft);
  const pFocusMin = useHud((s) => s.pFocusMin);
  const pBreakMin = useHud((s) => s.pBreakMin);
  const sessions = useHud((s) => s.sessions);
  const pStart = useHud((s) => s.pStart);
  const pPause = useHud((s) => s.pPause);
  const pReset = useHud((s) => s.pReset);
  const pToggleMode = useHud((s) => s.pToggleMode);

  const total = (pMode === 'focus' ? pFocusMin : pBreakMin) * 60;
  const progress = total > 0 ? 1 - pSecondsLeft / total : 0;

  const size = 168;
  const stroke = 7;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className="glass flex flex-col items-center rounded-2xl p-5">
      <div className="mb-4 flex w-full items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">Pomodoro</span>
        <button
          onClick={pToggleMode}
          className="flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-dim transition-colors hover:border-line2 hover:text-text"
        >
          {pMode === 'focus' ? <Brain size={13} /> : <Coffee size={13} />}
          {pMode === 'focus' ? 'Focus' : 'Break'}
        </button>
      </div>

      {/* Ring */}
      <div className="relative grid place-items-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.9s linear', filter: 'drop-shadow(0 0 6px rgba(var(--accent-rgb),0.5))' }}
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="font-mono tnum text-4xl font-medium leading-none">
            {pad(Math.floor(pSecondsLeft / 60))}:{pad(pSecondsLeft % 60)}
          </span>
          <span className="mt-1.5 text-[11px] uppercase tracking-wider text-faint">
            {pRunning ? 'Running' : 'Paused'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={() => (pRunning ? pPause() : pStart())}
          className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          {pRunning ? <Pause size={15} /> : <Play size={15} />}
          {pRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={pReset}
          className="grid size-9 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-line2 hover:text-text"
          aria-label="Reset"
        >
          <RotateCcw size={15} />
        </button>
      </div>

      <div className="mt-4 flex w-full items-center justify-between border-t border-line pt-3 text-xs">
        <span className="text-faint">Sessions today</span>
        <span className="font-mono tnum text-sm text-[var(--accent)]">{sessions}</span>
      </div>
    </div>
  );
}
