// ════════════════════════════════════════════════════════════
//  UI store — ephemeral interface state (not persisted).
//  Holds the open card modal, triage flag, toast, theme, and a
//  navigate fn (registered by App) so deep components can route
//  and theme without prop threading.
// ════════════════════════════════════════════════════════════

import { create } from 'zustand';
import type { ScreenId } from '@/data/mockData';

export interface Toast {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface UiState {
  openTaskId: string | null;
  openTask: (id: string) => void;
  closeTask: () => void;

  triageOpen: boolean;
  openTriage: () => void;
  closeTriage: () => void;

  toast: Toast | null;
  showToast: (t: Toast) => void;
  hideToast: () => void;

  theme: 'dark' | 'light';
  toggleTheme: () => void;

  /** Set by App on mount; lets any component route. */
  navigate: (id: ScreenId) => void;
}

export const useUiStore = create<UiState>((set) => ({
  openTaskId: null,
  openTask: (id) => set({ openTaskId: id }),
  closeTask: () => set({ openTaskId: null }),

  triageOpen: false,
  openTriage: () => set({ triageOpen: true }),
  closeTriage: () => set({ triageOpen: false }),

  toast: null,
  showToast: (toast) => set({ toast }),
  hideToast: () => set({ toast: null }),

  theme: 'dark',
  toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

  navigate: () => {},
}));
