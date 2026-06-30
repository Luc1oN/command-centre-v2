import { useHud } from '@/store';
import type { ThemeId } from '@/store';

const THEMES: { id: ThemeId; color: string; label: string }[] = [
  { id: 'aurora', color: '#2dd4bf', label: 'Aurora' },
  { id: 'mint', color: '#4ade80', label: 'Mint' },
  { id: 'ember', color: '#fb923c', label: 'Ember' },
  { id: 'violet', color: '#a78bfa', label: 'Violet' },
];

export function ThemeSwitcher() {
  const theme = useHud((s) => s.theme);
  const setTheme = useHud((s) => s.setTheme);

  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-line p-1">
      {THEMES.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          title={t.label}
          aria-label={t.label}
          className={`size-4 rounded-full transition-transform hover:scale-110 ${
            theme === t.id ? 'ring-2 ring-[color:var(--color-text)] ring-offset-2 ring-offset-bg' : ''
          }`}
          style={{ background: t.color }}
        />
      ))}
    </div>
  );
}
