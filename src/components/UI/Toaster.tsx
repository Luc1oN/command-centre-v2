import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUiStore } from '@/store/useUiStore';

/** Single bottom-centre toast with an optional action (e.g. Undo). */
export function Toaster() {
  const toast = useUiStore((s) => s.toast);
  const hide = useUiStore((s) => s.hideToast);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(hide, 5000);
    return () => clearTimeout(id);
  }, [toast, hide]);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          className="fixed bottom-6 left-1/2 z-[70] flex -translate-x-1/2 items-center gap-4 rounded-lg border border-border bg-surface px-4 py-3 shadow-lg"
        >
          <span className="text-sm text-text">{toast.message}</span>
          {toast.actionLabel && (
            <button
              onClick={() => {
                toast.onAction?.();
                hide();
              }}
              className="text-sm font-semibold text-brand hover:text-brand-d"
            >
              {toast.actionLabel}
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
