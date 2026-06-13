/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface InstallAppButtonProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'button' | 'icon';
  onInstallSuccess?: () => void;
}

export default function InstallAppButton({
  className = '',
  showLabel = true,
  variant = 'button',
  onInstallSuccess
}: InstallAppButtonProps) {
  const { isInstallPromptAvailable, isInstalled, handleInstallClick, isInstalling } = usePWAInstall();
  const [showInstallSuccess, setShowInstallSuccess] = useState(false);

  // Listen for installation success event
  useEffect(() => {
    const handleInstallSuccess = () => {
      setShowInstallSuccess(true);
      setTimeout(() => setShowInstallSuccess(false), 3000);
      if (onInstallSuccess) {
        onInstallSuccess();
      }
    };

    window.addEventListener('pwa-installed', handleInstallSuccess as EventListener);

    return () => {
      window.removeEventListener('pwa-installed', handleInstallSuccess as EventListener);
    };
  }, [onInstallSuccess]);

  // Don't render if already installed or prompt not available
  if (isInstalled || !isInstallPromptAvailable) {
    return null;
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className={`p-2 rounded-full hover:bg-emerald-50 text-[#00B875] transition-colors disabled:opacity-50 cursor-pointer ${className}`}
        title="Install App"
        aria-label="Install App"
      >
        <Download className="w-5 h-5 stroke-[2px]" />
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={handleInstallClick}
        disabled={isInstalling}
        className="flex items-center gap-2 bg-[#00B875] hover:bg-[#00a367] text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors disabled:opacity-50 cursor-pointer select-none shadow-sm active:scale-95"
      >
        <Download className="w-4 h-4 stroke-[2px]" />
        {showLabel && (
          <span>{isInstalling ? 'Installing...' : 'Install App'}</span>
        )}
      </button>

      {/* Success Toast */}
      {showInstallSuccess && (
        <div className="fixed bottom-4 right-4 bg-[#00B875] text-white px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300">
          <p className="text-sm font-bold">✓ App installed successfully!</p>
        </div>
      )}
    </div>
  );
}
