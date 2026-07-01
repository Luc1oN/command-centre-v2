import { useState } from 'react';
import { Inbox, Layers } from 'lucide-react';
import { useHud } from '@/store';
import { useBoard } from '@/board/BoardContext';

/** Finds the inbox bucket: a "Triage" list if present, else the first list. */
function useInboxBucket() {
  const { buckets } = useBoard();
  return buckets.find((b) => b.title.toLowerCase() === 'triage') ?? buckets[0];
}

/** Quick-capture bar — new tasks land in Triage (inbox) to be sorted later. */
export function CaptureBar() {
  const { addTask, buckets, tasks } = useBoard();
  const openTriage = useHud((s) => s.openTriage);
  const inbox = useInboxBucket();
  const [text, setText] = useState('');

  const triageBucket = buckets.find((b) => b.title.toLowerCase() === 'triage');
  const triageCount = triageBucket ? tasks.filter((t) => t.bucketId === triageBucket.id).length : 0;

  if (!inbox) return null;

  return (
    <div className="flex items-center gap-2">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const v = text.trim();
          if (!v) return;
          addTask({ text: v, bucketId: inbox.id, pri: 'medium' });
          useHud.getState().bump(8);
          useHud.getState().log('add', `Captured “${v}”`);
          setText('');
        }}
        className="flex flex-1 items-center gap-2 rounded-xl border border-line bg-card px-3 py-2.5"
      >
        <Inbox size={16} className="text-[var(--accent)]" />
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`Capture to ${inbox.title}…`}
          className="w-full bg-transparent text-[15px] text-text placeholder:text-faint focus:outline-none"
        />
      </form>
      {triageBucket && triageCount > 0 && (
        <button
          onClick={openTriage}
          className="flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2.5 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          style={{ background: 'var(--accent)' }}
        >
          <Layers size={15} />
          Triage {triageCount}
        </button>
      )}
    </div>
  );
}
