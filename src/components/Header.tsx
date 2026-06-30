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
    <header className="glass relative z-10 flex items-center justify-between gap-4 rounded-2xl px-5 py-3">
      <div className="flex items-baseline gap-5">
        <div>
          <div className="text-xs text-dim">{greeting(hours)}</div>
          <div className="text-xl font-semibold tracking-tight">{userName}</div>
        </div>
        <div className="font-mono tnum text-3xl font-medium tracking-tight">
          {pad(h12)}:{pad(now.getMinutes())}:<span className="text-[var(--accent)]">{pad(now.getSeconds())}</span>
          <span className="ml-1.5 text-sm text-dim">{ampm}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Weather />
        <div className="h-8 w-px bg-line" />
        <MomentumMeter />
        <div className="h-8 w-px bg-line" />
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
