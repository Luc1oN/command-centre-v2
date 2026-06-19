import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function App() {
  const init = useAppStore((s) => s.init);
  const ready = useAppStore((s) => s.ready);
  const tasks = useAppStore((s) => s.tasks);
  const buckets = useAppStore((s) => s.buckets);

  useEffect(() => {
    init();
  }, [init]);

  if (!ready) return <div style={{ padding: 40 }}>Loading…</div>;

  return (
    <div style={{ padding: 40, fontFamily: 'DM Sans, sans-serif' }}>
      <h1>Command Centre — data layer test</h1>
      <p><strong>{tasks.length}</strong> tasks loaded from Supabase</p>
      <p><strong>{buckets.length}</strong> buckets: {buckets.map((b) => b.title).join(', ')}</p>
      <hr />
      <ul>
        {tasks.slice(0, 30).map((t) => (
          <li key={t.id}>
            [{t.cat}] {t.text} — <em>{t.pri}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
