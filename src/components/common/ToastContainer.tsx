import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border transition-all transform translate-y-0 opacity-100 ${
              toast.type === 'error'
                ? 'bg-[#2A1515] border-red-800/60 text-white'
                : toast.type === 'info'
                ? 'bg-[#181E24] border-sky-800/60 text-white'
                : 'bg-[#1C1B19] border-[#D4AF37]/40 text-[#F5F2EB]'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : toast.type === 'info' ? (
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold tracking-wide">{toast.title}</h5>
              {toast.description && (
                <p className="text-[11px] text-[#C4BEB5] mt-0.5 leading-relaxed">{toast.description}</p>
              )}
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8C857B] hover:text-white transition-colors -mr-1 -mt-1 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
