'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
  confirm: (title: string, message: string, onConfirm: () => void | Promise<void>, confirmLabel?: string, cancelLabel?: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

interface ConfirmDialogData {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  confirmLabel: string;
  cancelLabel: string;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogData | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration: number = 5000) => {
      const id = Math.random().toString(36).substring(2, 9);
      const toast: Toast = { id, type, title, message, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (title: string, message?: string) => showToast('success', title, message),
    [showToast]
  );

  const error = useCallback(
    (title: string, message?: string) => showToast('error', title, message),
    [showToast]
  );

  const info = useCallback(
    (title: string, message?: string) => showToast('info', title, message),
    [showToast]
  );

  const warning = useCallback(
    (title: string, message?: string) => showToast('warning', title, message),
    [showToast]
  );

  const confirm = useCallback((title: string, message: string, onConfirm: () => void | Promise<void>, confirmLabel: string = 'Confirm', cancelLabel: string = 'Cancel') => {
    setConfirmDialog({ title, message, onConfirm, confirmLabel, cancelLabel });
  }, []);

  const handleConfirm = async () => {
    if (confirmDialog) {
      await confirmDialog.onConfirm();
      setConfirmDialog(null);
    }
  };

  const handleCancel = () => {
    setConfirmDialog(null);
  };

  return (
    <ToastContext.Provider
      value={{ toasts, showToast, success, error, info, warning, removeToast, confirm }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      {confirmDialog && (
        <ConfirmDialog
          title={confirmDialog.title}
          message={confirmDialog.message}
          onConfirm={handleConfirm}
          onCancel={handleCancel}
          confirmLabel={confirmDialog.confirmLabel}
          cancelLabel={confirmDialog.cancelLabel}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col-reverse gap-3 pointer-events-none max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Individual Toast Item
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const config = {
    success: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-emerald-600">
          <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: 'bg-white',
      border: 'border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconRing: 'ring-2 ring-emerald-50',
      textColor: 'text-slate-900',
      descColor: 'text-slate-600',
      shadow: 'shadow-lg shadow-emerald-500/10',
      accent: 'border-l-2 border-l-emerald-500',
    },
    error: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-red-600">
          <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: 'bg-white',
      border: 'border-red-200',
      iconBg: 'bg-red-100',
      iconRing: 'ring-2 ring-red-50',
      textColor: 'text-slate-900',
      descColor: 'text-slate-600',
      shadow: 'shadow-lg shadow-red-500/10',
      accent: 'border-l-2 border-l-red-500',
    },
    info: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-brand-blue">
          <path d="M10 14V10M10 6H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: 'bg-white',
      border: 'border-blue-200',
      iconBg: 'bg-brand-soft-blue',
      iconRing: 'ring-2 ring-blue-50',
      textColor: 'text-slate-900',
      descColor: 'text-slate-600',
      shadow: 'shadow-lg shadow-blue-500/10',
      accent: 'border-l-2 border-l-brand-blue',
    },
    warning: {
      icon: (
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="text-amber-600">
          <path d="M10 7V11M10 14H10.01M9 2L2.5 15H17.5L11 2H9Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      bg: 'bg-white',
      border: 'border-amber-200',
      iconBg: 'bg-amber-100',
      iconRing: 'ring-2 ring-amber-50',
      textColor: 'text-slate-900',
      descColor: 'text-slate-600',
      shadow: 'shadow-lg shadow-amber-500/10',
      accent: 'border-l-2 border-l-amber-500',
    },
  };

  const style = config[toast.type];

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 p-3 rounded-xl border ${style.bg} ${style.border} ${style.shadow} ${style.accent} backdrop-blur-xl animate-slideIn min-w-[280px] max-w-sm relative overflow-hidden`}
      style={{
        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent pointer-events-none" />
      
      <div className={`relative flex-shrink-0 w-7 h-7 rounded-lg ${style.iconBg} ${style.iconRing} flex items-center justify-center`}>
        {style.icon}
      </div>
      
      <div className="flex-1 min-w-0 relative">
        <p className={`font-semibold text-[13px] ${style.textColor} leading-tight`}>{toast.title}</p>
        {toast.message && (
          <p className={`text-[12px] ${style.descColor} leading-relaxed mt-1`}>{toast.message}</p>
        )}
      </div>
      
      <button
        onClick={() => onRemove(toast.id)}
        className="relative flex-shrink-0 w-6 h-6 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all duration-200 active:scale-95"
        aria-label="Close notification"
      >
        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
          <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Progress bar for auto-dismiss */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-100 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-slate-300 to-slate-400"
            style={{
              animation: `progressBar ${toast.duration}ms linear`,
            }}
          />
        </div>
      )}
    </div>
  );
}

// Confirm Dialog Component
function ConfirmDialog({
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel,
  cancelLabel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmLabel: string;
  cancelLabel: string;
}) {
  return (
    <div 
      className="fixed inset-0 z-[9998] flex items-center justify-center px-4 animate-fadeIn"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] p-8 max-w-md w-full animate-scaleIn relative"
        style={{
          animation: 'scaleIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning icon */}
        <div className="w-14 h-14 rounded-2xl bg-red-100 ring-4 ring-red-50 flex items-center justify-center mb-5">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-red-600">
            <path d="M14 9.33334V14M14 18.6667H14.0117M25.6667 14C25.6667 20.4434 20.4434 25.6667 14 25.6667C7.55672 25.6667 2.33337 20.4434 2.33337 14C2.33337 7.55672 7.55672 2.33334 14 2.33334C20.4434 2.33334 25.6667 7.55672 25.6667 14Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        
        <h3 className="text-2xl font-display font-bold text-brand-dark mb-3 leading-tight">{title}</h3>
        <p className="text-slate-600 text-[15px] leading-relaxed mb-8">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-5 py-3.5 border-2 border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all duration-200 font-semibold text-[15px]"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-5 py-3.5 bg-red-500 text-white rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all duration-200 font-semibold text-[15px] shadow-lg shadow-red-500/25"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}