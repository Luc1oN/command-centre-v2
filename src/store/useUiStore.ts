// ════════════════════════════════════════════════════════════
//  UI store — ephemeral interface state (not persisted).
//  Keeps the open card modal + toast at the app root so any
//  component can trigger them without prop threading.
// ════════════════════════════════════════════════════════════

import { create } from 'zustand';

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
}));
