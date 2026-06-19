import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Pause, Play, Check, X } from 'lucide-react';
import { focusSession } from '@/data/mockData';

function format(total: number) {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function FocusMode({ onEnd }: { onEnd: () => void }) {
  const total = focusSession.durationMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [running, setRunning] = useState(true);
  const [blocked, setBlocked] = useState(false);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!running || blocked) return;
    const id = setInterval(() => setSecondsLeft((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [running, blocked]);

  useEffect(() => {
    if (secondsLeft === 0) setRunning(false);
  }, [secondsLeft]);

  const progress = 1 - secondsLeft / total;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col bg-bg"
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,var(--color-brand-glow),transparent)]" />

      {/* Top bar */}
      <div className="relative flex items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 text-sm font-medium text-text2">
          <Flame size={16} className="animate-flame text-amber" />
          Focus Mode
        </span>
        <button
          onClick={onEnd}
          className="flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-text2 transition-colors hover:border-border2 hover:text-text"
        >
          <X size={15} /> End Focus
        </button>
      </div>

      {/* Centre stage */}
      <div className="relative flex flex-1 items-center justify-center px-6 pb-16">
        <motion.div
          initial={{ y: 16, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.34, 1.4, 0.6, 1] }}
          className="w-full max-w-xl"
        >
          <p className="text-center text-2xs font-semibold uppercase tracking-wider text-text3">Now focusing on</p>
          <h1 className="mt-2 text-center text-3xl font-bold tracking-tight text-text">{focusSession.taskTitle}</h1>

          <div className="mt-4 rounded-lg border border-border bg-surface/60 p-4 text-center backdrop-blur-sm">
            <p className="text-2xs font-semibold uppercase tracking-wider text-text3">Next action</p>
            <p className="mt-1 text-base font-medium text-text">{focusSession.nextAction}</p>
          </div>

          {/* Timer */}
          <div className="mt-8 text-center">
            <div className="stat-number tnum text-7xl leading-none text-text sm:text-8xl">{format(secondsLeft)}</div>
            <div className="mx-auto mt-5 h-1 max-w-xs overflow-hidden rounded-full bg-surface3">
              <div className="h-full rounded-full bg-gradient-to-r from-brand to-purple transition-all duration-1000" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-7 flex items-center justify-center gap-3">
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-text transition-colors hover:bg-surface2"
            >
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? 'Pause' : 'Resume'}
            </button>
            <button
              onClick={onEnd}
              className="flex items-center gap-2 rounded-md bg-green px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
            >
              <Check size={16} /> Complete
            </button>
          </div>

          {/* Blocked + notes */}
          <div className="mt-8 grid gap-4 sm:grid-cols-[auto_1fr]">
            <div>
              <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wider text-text3">Blocked?</p>
              <div className="inline-flex rounded-md border border-border bg-surface p-0.5">
                <button
                  onClick={() => setBlocked(true)}
                  className={`rounded-sm px-3 py-1 text-sm transition-colors ${blocked ? 'bg-red-bg font-medium text-red' : 'text-text2 hover:text-text'}`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setBlocked(false)}
                  className={`rounded-sm px-3 py-1 text-sm transition-colors ${!blocked ? 'bg-green-bg font-medium text-green' : 'text-text2 hover:text-text'}`}
                >
                  No
                </button>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-2xs font-semibold uppercase tracking-wider text-text3">Notes</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Capture a thought without losing focus…"
                className="h-16 w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text3 focus:border-brand focus:outline-none"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
