import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import { useHud } from '@/store';

export function BookmarkDock() {
  const mode = useHud((s) => s.bookmarkMode);
  const setMode = useHud((s) => s.setBookmarkMode);
  const work = useHud((s) => s.bookmarksWork);
  const personal = useHud((s) => s.bookmarksPersonal);
  const update = useHud((s) => s.updateBookmark);

  const [editing, setEditing] = useState(false);
  const [sel, setSel] = useState<string | null>(null);

  const list = mode === 'work' ? work : personal;
  const selected = sel ? list.find((b) => b.id === sel) : null;

  const stopEditing = () => {
    setEditing(false);
    setSel(null);
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-faint">Bookmarks</span>
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-md border border-line p-0.5">
            {(['work', 'personal'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  setMode(m);
                  setSel(null);
                }}
                className={`rounded-sm px-2 py-0.5 text-xs font-semibold transition-colors ${
                  mode === m ? 'bg-[var(--accent)] text-bg' : 'text-dim hover:text-text'
                }`}
              >
                {m === 'work' ? 'W' : 'P'}
              </button>
            ))}
          </div>
          <button
            onClick={() => (editing ? stopEditing() : setEditing(true))}
            className={`grid size-7 place-items-center rounded-md border transition-colors ${
              editing ? 'border-[var(--accent)] text-[var(--accent)]' : 'border-line text-dim hover:text-text'
            }`}
            aria-label="Edit bookmarks"
          >
            {editing ? <Check size={14} /> : <Pencil size={13} />}
          </button>
        </div>
      </div>

      {/* Inline editor for the selected bookmark */}
      {editing && selected && (
        <div className="mb-3 space-y-2 rounded-xl border border-[var(--accent)]/40 bg-white/[0.03] p-3">
          <div className="flex gap-2">
            <input
              value={selected.icon}
              onChange={(e) => update(mode, selected.id, { icon: e.target.value })}
              className="w-12 rounded-md border border-line bg-white/[0.03] px-2 py-1.5 text-center text-base focus:border-[var(--accent)] focus:outline-none"
              aria-label="Icon"
            />
            <input
              value={selected.name}
              onChange={(e) => update(mode, selected.id, { name: e.target.value })}
              placeholder="Name"
              className="flex-1 rounded-md border border-line bg-white/[0.03] px-2.5 py-1.5 text-sm focus:border-[var(--accent)] focus:outline-none"
            />
          </div>
          <input
            value={selected.url}
            onChange={(e) => update(mode, selected.id, { url: e.target.value })}
            placeholder="https://…"
            className="w-full rounded-md border border-line bg-white/[0.03] px-2.5 py-1.5 font-mono text-xs focus:border-[var(--accent)] focus:outline-none"
          />
          <button onClick={() => setSel(null)} className="text-xs font-medium text-[var(--accent)]">
            Done editing this one
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 gap-2">
        {list.map((b) => {
          const inner = (
            <>
              <span className="text-lg leading-none">{b.icon}</span>
              <span className="truncate text-sm">{b.name}</span>
            </>
          );
          const cls = `flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors ${
            sel === b.id ? 'border-[var(--accent)] bg-[rgba(var(--accent-rgb),0.08)]' : 'border-line bg-white/[0.02] hover:border-line2'
          }`;
          return editing ? (
            <button key={b.id} onClick={() => setSel(b.id)} className={cls}>
              {inner}
              <Pencil size={11} className="ml-auto text-faint" />
            </button>
          ) : (
            <a key={b.id} href={b.url} target="_blank" rel="noreferrer" className={cls}>
              {inner}
            </a>
          );
        })}
      </div>
      {editing && !selected && <p className="mt-2.5 text-[11px] text-faint">Click a bookmark to edit its name, URL or icon.</p>}
    </div>
  );
}
