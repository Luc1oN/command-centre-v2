// ════════════════════════════════════════════════════════════
//  Profile store — the user's own details (name / role / email).
//  Persisted to localStorage (the Supabase blob has a fixed task
//  schema with no profile field). Local to this browser for now.
// ════════════════════════════════════════════════════════════

import { create } from 'zustand';

export interface Profile {
  fullName: string;
  role: string;
  email: string;
}

const KEY = 'cmdcentre_profile';
const DEFAULTS: Profile = { fullName: 'Shane Warne', role: 'Strategy Lead', email: '' };

function load(): Profile {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...DEFAULTS, ...(JSON.parse(raw) as Partial<Profile>) };
  } catch {
    /* ignore */
  }
  return DEFAULTS;
}

interface ProfileState extends Profile {
  setProfile: (patch: Partial<Profile>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  ...load(),
  setProfile: (patch) =>
    set((s) => {
      const next: Profile = { fullName: s.fullName, role: s.role, email: s.email, ...patch };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      return next;
    }),
}));

/** "Shane Warne" → "SW"; single word → first two letters. */
export function initialsOf(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function firstNameOf(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || 'there';
}
