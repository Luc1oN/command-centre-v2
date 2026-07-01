import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useHud } from '@/store';
import { Weather } from './Weather';
import { MomentumMeter } from './MomentumMeter';
import { ThemeSwitcher } from './ThemeSwitcher';

function greeting(h: number) {
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}
const pad = (n: number) => String(n).padStart(2, '0');

export function Header() {
  const userName = useHud((s) => s.userName);
  const mode = useHud((s) => s.mode);
  const toggleMode = useHud((s) => s.toggleMode);
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const h12 = ((hours + 11) % 12) + 1;

  return (
    <header className="glass relative z-10 flex items-center justify-between gap-3 rounded-2xl px-4 py-2.5 sm:px-5 sm:py-3">
      <div className="flex items-baseline gap-3 sm:gap-5">
        <div>
          <div className="text-[11px] text-dim sm:text-xs">{greeting(hours)}</div>
          <div className="text-base font-semibold tracking-tight sm:text-xl">{userName}</div>
        </div>
        <div className="font-mono tnum text-xl font-medium tracking-tight sm:text-3xl">
          {pad(h12)}:{pad(now.getMinutes())}
          <span className="hidden sm:inline">
            :<span className="text-[var(--accent)]">{pad(now.getSeconds())}</span>
          </span>
          <span className="ml-1.5 text-xs text-dim sm:text-sm">{ampm}</span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:block">
          <Weather />
        </div>
        <div className="hidden h-8 w-px bg-line xl:block" />
        <div className="hidden xl:block">
          <MomentumMeter />
        </div>
        <button
          onClick={toggleMode}
          aria-label="Toggle light/dark"
          className="grid size-8 place-items-center rounded-lg border border-line text-dim transition-colors hover:border-line2 hover:text-text"
        >
          {mode === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
        <ThemeSwitcher />
      </div>
    </header>
  );
}
