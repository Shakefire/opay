/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface UsePWAInstallReturn {
  isInstallPromptAvailable: boolean;
  isInstalled: boolean;
  handleInstallClick: () => Promise<void>;
  isInstalling: boolean;
}

/**
 * Hook to manage PWA install functionality
 * Handles beforeinstallprompt event and installation state
 */
export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallPromptAvailable, setIsInstallPromptAvailable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  // Check localStorage for installation state
  useEffect(() => {
    const hasInstalled = localStorage.getItem('opay_pwa_installed') === 'true';
    setIsInstalled(hasInstalled);
  }, []);

  // Listen for beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      // Prevent the mini-infobar from appearing
      event.preventDefault();
      
      const installPromptEvent = event as BeforeInstallPromptEvent;
      
      // Store the event for later use
      setDeferredPrompt(installPromptEvent);
      setIsInstallPromptAvailable(true);

      console.log('[PWA] Install prompt available');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Listen for appinstalled event
  useEffect(() => {
    const handleAppInstalled = () => {
      console.log('[PWA] App installed');
      setIsInstalled(true);
      setIsInstallPromptAvailable(false);
      setDeferredPrompt(null);
      
      // Persist installation state
      localStorage.setItem('opay_pwa_installed', 'true');
      
      // Show success message
      const event = new CustomEvent('pwa-installed', {
        detail: { message: 'App installed successfully!' }
      });
      window.dispatchEvent(event);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Handle install button click
  const handleInstallClick = useCallback(async () => {
    if (!deferredPrompt) {
      console.warn('[PWA] Install prompt not available');
      return;
    }

    try {
      setIsInstalling(true);

      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for user choice
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('[PWA] User accepted install prompt');
      } else {
        console.log('[PWA] User dismissed install prompt');
      }

      // Clear the deferred prompt
      setDeferredPrompt(null);
      setIsInstallPromptAvailable(false);
    } catch (error) {
      console.error('[PWA] Error during install:', error);
    } finally {
      setIsInstalling(false);
    }
  }, [deferredPrompt]);

  return {
    isInstallPromptAvailable,
    isInstalled,
    handleInstallClick,
    isInstalling
  };
}

/**
 * Alternative: Register service worker manually
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    console.warn('[PWA] Service Worker not supported');
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register('/service-worker.ts', {
      scope: '/'
    });
    console.log('[PWA] Service Worker registered', registration);
    return registration;
  } catch (error) {
    console.error('[PWA] Service Worker registration failed:', error);
    return null;
  }
}

export default usePWAInstall;
