import { useState } from 'react';
import { Sparkles, Send, User } from 'lucide-react';
import { aiSuggestions } from '@/data/mockData';
import { Eyebrow } from '@/components/UI/Card';

interface Msg {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

const CANNED =
  'Here’s the picture: 2 high-impact items are due today — the AI Tender Evaluation Pilot and the Digitalisation Strategy Draft. Your focus window (9:00–11:00) is free, so I’d protect it for the scoring model. Everything else can wait until the afternoon.';

export function AIAssistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: 0, role: 'assistant', text: 'Good morning, Shane. I’ve reviewed your day. Ask me anything, or pick a starting point below.' },
  ]);
  const [input, setInput] = useState('');

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((m) => [
      ...m,
      { id: m.length, role: 'user', text: trimmed },
      { id: m.length + 1, role: 'assistant', text: CANNED },
    ]);
    setInput('');
  };

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col">
      <div className="mb-4 flex items-center gap-2.5">
        <span className="grid size-9 place-items-center rounded-md bg-gradient-to-br from-brand to-purple">
          <Sparkles size={17} className="text-white" />
        </span>
        <div>
          <h1 className="text-base font-bold tracking-tight text-text">AI Chief of Staff</h1>
          <p className="text-2xs text-text3">Always on. Context-aware.</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto pb-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <span
              className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-full ${
                m.role === 'user' ? 'bg-surface3 text-text2' : 'bg-gradient-to-br from-brand to-purple text-white'
              }`}
            >
              {m.role === 'user' ? <User size={14} /> : <Sparkles size={14} />}
            </span>
            <div
              className={`max-w-[80%] rounded-lg border px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === 'user' ? 'border-border bg-surface2 text-text' : 'border-brand/25 bg-brand-glow text-text2'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Suggestions */}
      <div className="mb-2">
        <Eyebrow>Try</Eyebrow>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {aiSuggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text2 transition-colors hover:border-border2 hover:text-text"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your Chief of Staff…"
          className="flex-1 bg-transparent text-sm text-text placeholder:text-text3 focus:outline-none"
        />
        <button type="submit" className="grid size-8 place-items-center rounded-md bg-brand text-white transition-colors hover:bg-brand-d">
          <Send size={15} />
        </button>
      </form>
    </div>
  );
}
