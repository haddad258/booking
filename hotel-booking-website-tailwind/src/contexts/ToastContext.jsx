import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((t) => t.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback((message, variant = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    setTimeout(() => remove(id), 4500);
  }, [remove]);

  const success = useCallback((message) => push(message, 'success'), [push]);
  const error = useCallback((messageOrErr) => {
    const message = typeof messageOrErr === 'string'
      ? messageOrErr
      : messageOrErr?.response?.data?.errors?.[0]?.message || messageOrErr?.response?.data?.message || messageOrErr?.message || 'Something went wrong';
    push(message, 'error');
  }, [push]);

  return (
    <ToastContext.Provider value={{ success, error }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={[
              'flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl animate-fade-in-up min-w-[260px]',
              toast.variant === 'success' ? 'bg-brand-700' : 'bg-red-600',
            ].join(' ')}
          >
            {toast.variant === 'success' ? <CheckCircleIcon className="h-5 w-5 shrink-0" /> : <XCircleIcon className="h-5 w-5 shrink-0" />}
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)}><XMarkIcon className="h-4 w-4 opacity-70 hover:opacity-100" /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
}
