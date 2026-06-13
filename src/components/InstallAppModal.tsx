import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function InstallAppModal() {
  const { isInstallPromptAvailable, isInstalled, handleInstallClick, isInstalling } = usePWAInstall();
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('opay_pwa_dismissed') === 'true';
  });

  if (isInstalled || !isInstallPromptAvailable || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('opay_pwa_dismissed', 'true');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none p-4 sm:p-0">
      <div 
        className="w-full sm:max-w-[400px] bg-white rounded-3xl p-5 shadow-2xl border border-gray-100 pointer-events-auto sm:mb-8"
        style={{ animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        <button 
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-[#00B875] rounded-2xl flex items-center justify-center shrink-0 shadow-md">
            <span className="text-white font-black text-2xl">O</span>
          </div>
          <div>
            <h3 className="font-black text-lg text-gray-900 leading-tight">Install OPay App</h3>
            <p className="text-sm text-gray-500 font-medium">Fast, secure, and reliable</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-5 font-medium leading-relaxed">
          Add OPay to your home screen for a full screen experience, offline access, and instant transfers.
        </p>
        
        <div className="flex gap-3">
          <button 
            onClick={handleDismiss}
            className="flex-1 py-3.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors cursor-pointer"
          >
            Not Now
          </button>
          <button 
            onClick={handleInstallClick}
            disabled={isInstalling}
            className="flex-2 py-3.5 px-4 bg-[#00B875] hover:bg-[#00a367] text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 shadow-md shadow-emerald-500/20"
          >
            <Download className="w-5 h-5" />
            {isInstalling ? 'Installing...' : 'Install App'}
          </button>
        </div>
      </div>
    </div>
  );
}
