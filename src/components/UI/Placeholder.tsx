import type { LucideIcon } from 'lucide-react';

export function Placeholder({ icon: Icon, title }: { icon: LucideIcon; title: string }) {
  return (
    <div className="grid h-full place-items-center">
      <div className="flex flex-col items-center text-center">
        <span className="grid size-14 place-items-center rounded-xl border border-border bg-surface text-text3">
          <Icon size={24} />
        </span>
        <h2 className="mt-4 text-lg font-semibold text-text">{title}</h2>
        <p className="mt-1 max-w-xs text-sm text-text3">This space is reserved. We’ll build it out as the system grows.</p>
      </div>
    </div>
  );
}
