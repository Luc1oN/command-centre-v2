import { useEffect, useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';
import { useHud, CITIES } from '@/store';

interface Wx {
  temp: number;
  code: number;
}

// Condensed WMO weather-code map → emoji + label
function describe(code: number): { icon: string; label: string } {
  if (code === 0) return { icon: '☀️', label: 'Clear' };
  if (code <= 2) return { icon: '🌤️', label: 'Partly cloudy' };
  if (code === 3) return { icon: '☁️', label: 'Overcast' };
  if (code <= 48) return { icon: '🌫️', label: 'Fog' };
  if (code <= 67) return { icon: '🌧️', label: 'Rain' };
  if (code <= 77) return { icon: '🌨️', label: 'Snow' };
  if (code <= 82) return { icon: '🌦️', label: 'Showers' };
  if (code <= 99) return { icon: '⛈️', label: 'Storm' };
  return { icon: '🌡️', label: 'Weather' };
}

export function Weather() {
  const city = useHud((s) => s.city);
  const setCity = useHud((s) => s.setCity);
  const [wx, setWx] = useState<Wx | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;
    const fetchWx = () => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code`)
        .then((r) => r.json())
        .then((d) => {
          if (active && d.current) setWx({ temp: Math.round(d.current.temperature_2m), code: d.current.weather_code });
        })
        .catch(() => {});
    };
    fetchWx();
    const id = setInterval(fetchWx, 10 * 60 * 1000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [city]);

  const d = wx ? describe(wx.code) : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-line px-3 py-1.5 text-sm transition-colors hover:border-line2"
      >
        <span className="text-base leading-none">{d?.icon ?? '⛅'}</span>
        <span className="tnum font-mono">{wx ? `${wx.temp}°` : '··°'}</span>
        <span className="flex items-center gap-1 text-dim">
          <MapPin size={12} />
          {city.name}
        </span>
        <ChevronDown size={13} className="text-faint" />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-10 z-50 w-44 overflow-hidden rounded-lg border border-line bg-panel/95 p-1 backdrop-blur-xl">
            {CITIES.map((c) => (
              <button
                key={c.name}
                onClick={() => {
                  setCity(c);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-white/5 ${
                  c.name === city.name ? 'text-[var(--accent)]' : 'text-text'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
