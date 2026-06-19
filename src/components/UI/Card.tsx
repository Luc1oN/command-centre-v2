import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

/** Soft glass-like surface with a thin border — the base panel everywhere. */
export function Card({ interactive, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={[
        'rounded-lg border border-border bg-surface/80 backdrop-blur-sm shadow-sm',
        interactive ? 'transition-colors hover:border-border2 hover:bg-surface cursor-pointer' : '',
        className,
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}

/** Tiny uppercase section/eyebrow label. */
export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-2xs font-semibold uppercase tracking-wider text-text3 ${className}`}>
      {children}
    </span>
  );
}
