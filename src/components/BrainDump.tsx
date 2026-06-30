import { useState } from 'react';
import { Sparkles, FileText } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useHud } from '@/store';

export function BrainDump() {
  const notes = useAppStore((s) => s.notes);
  const addNote = useAppStore((s) => s.addNote);
  const [text, setText] = useState('');

  const save = () => {
    const v = text.trim();
    if (!v) return;
    const now = new Date();
    addNote({
      title: v.split('\n')[0].slice(0, 60),
      preview: v.slice(0, 160),
      date: now.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      at: now.toISOString(),
      count: 0,
      hasScreenshot: false,
    });
    useHud.getState().bump(8);
    useHud.getState().log('add', 'Brain dump captured');
    setText('');
  };

  return (
    <div className="glass flex min-h-0 flex-1 flex-col rounded-2xl p-5">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={15} className="text-[var(--accent)]" />
        <span className="text-sm font-semibold">Brain Dump</span>
      </div>

      <div className="rounded-xl border border-line bg-card p-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') save();
          }}
          placeholder="Empty your head here — ideas, todos, notes. The first line becomes the title. ⌘+Enter to save."
          className="h-28 w-full resize-none bg-transparent text-sm leading-relaxed text-text placeholder:text-faint focus:outline-none"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={save}
            className="rounded-lg px-4 py-1.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
            style={{ background: 'var(--accent)' }}
          >
            Capture
          </button>
        </div>
      </div>

      <div className="mb-2 mt-5 text-[11px] font-semibold uppercase tracking-wider text-faint">
        Captured · {notes.length}
      </div>
      <div className="flex-1 space-y-2 overflow-y-auto pr-1">
        {notes.length === 0 && <p className="py-6 text-center text-xs text-faint">Nothing captured yet.</p>}
        {notes.map((n) => (
          <div key={n.id} className="rounded-xl border border-line bg-card p-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-card2 text-dim">
                <FileText size={13} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-text">{n.title}</p>
                {n.preview && n.preview !== n.title && <p className="mt-0.5 line-clamp-2 text-xs text-dim">{n.preview}</p>}
                <p className="mt-1 text-[10px] text-faint">{n.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
