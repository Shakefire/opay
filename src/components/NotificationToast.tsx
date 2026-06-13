/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { Bell, CheckCircle2, ShieldCheck, TrendingUp, X } from 'lucide-react';

interface ToastProps {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'alert' | 'secure' | 'interest';
  onClose: (id: string) => void;
}

export default function NotificationToast({ id, title, message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 4500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />;
      case 'secure':
        return <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />;
      case 'interest':
        return <TrendingUp className="w-5 h-5 text-indigo-500" />;
      default:
        return <Bell className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div
      className="flex items-start gap-3 w-full max-w-sm bg-white border border-gray-100 shadow-xl rounded-xl p-4 transition-all duration-300 transform scale-100 animate-fade-in"
      style={{
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
      }}
    >
      <div className="flex-shrink-0 bg-emerald-50 p-2 rounded-lg mt-0.5">
        {getIcon()}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-gray-900 leading-none">{title}</h4>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{message}</p>
      </div>

      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-50 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
