import React, { useEffect } from 'react';

export function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-16 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [onClose, toast.duration]);

  const typeConfig = {
    success: {
      border: 'border-brand-safe',
      icon: (
        <svg className="w-5 h-5 text-brand-safe" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    error: {
      border: 'border-brand-fire-alert',
      icon: (
        <svg className="w-5 h-5 text-brand-fire-alert" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    warning: {
      border: 'border-brand-warning',
      icon: (
        <svg className="w-5 h-5 text-brand-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    info: {
      border: 'border-brand-flood',
      icon: (
        <svg className="w-5 h-5 text-brand-flood" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const config = typeConfig[toast.type] || typeConfig.info;

  return (
    <div className={`pointer-events-auto w-full bg-brand-bg-tertiary border-l-4 ${config.border} p-4 rounded-r shadow-xl flex items-start space-x-3 transition-all duration-300 transform translate-x-0 animate-slide-in`}>
      <div className="shrink-0">{config.icon}</div>
      <div className="flex-1">
        <h4 className="text-xs font-semibold text-white uppercase tracking-wider">{toast.title || 'Notification'}</h4>
        <p className="text-xs text-brand-secondary mt-1">{toast.message}</p>
      </div>
      <button onClick={onClose} className="shrink-0 text-brand-muted hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
