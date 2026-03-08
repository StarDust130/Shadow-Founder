"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, CheckCircle2, Info } from "lucide-react";

type ToastType = "error" | "success" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "error") => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2);
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => removeToast(id), 7000);
    },
    [removeToast],
  );

  const iconMap = {
    error: <AlertTriangle size={14} className="text-red-500 shrink-0" />,
    success: <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />,
    info: <Info size={14} className="text-blue-500 shrink-0" />,
  };

  const bgMap = {
    error: "bg-red-50 border-red-200",
    success: "bg-emerald-50 border-emerald-200",
    info: "bg-blue-50 border-blue-200",
  };

  const textMap = {
    error: "text-red-700",
    success: "text-emerald-700",
    info: "text-blue-700",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 80, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 80, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border-2 shadow-lg pointer-events-auto ${bgMap[toast.type]}`}
            >
              <div className="mt-0.5">{iconMap[toast.type]}</div>
              <p className={`text-xs font-bold flex-1 ${textMap[toast.type]}`}>
                {toast.message}
              </p>
              <button
                onClick={() => removeToast(toast.id)}
                className="mt-0.5 w-5 h-5 flex items-center justify-center rounded hover:bg-black/5 transition-colors cursor-pointer shrink-0"
              >
                <X size={12} className="text-[#1A1A1A]/40" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
