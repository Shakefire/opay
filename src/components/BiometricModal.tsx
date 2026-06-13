/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Fingerprint, LucideIcon, ShieldCheck, X } from 'lucide-react';

interface BiometricModalProps {
  isOpen: boolean;
  reason: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BiometricModal({ isOpen, reason, onSuccess, onCancel }: BiometricModalProps) {
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setScanState('idle');
      setProgress(0);
      return;
    }

    // Auto trigger scanning when open
    setScanState('scanning');
  }, [isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (scanState === 'scanning') {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('success');
            setTimeout(() => {
              onSuccess();
            }, 1000);
            return 100;
          }
          return prev + 5;
        });
      }, 80);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [scanState, onSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl overflow-hidden shadow-2xl transform transition-transform duration-300 translate-y-0"
        style={{ animation: 'slide-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-semibold text-gray-800">OPay Biometric Authorization</span>
          </div>
          <button 
            onClick={onCancel}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center text-center">
          <div className="mb-4">
            <div className="text-xs bg-emerald-50 text-emerald-700 font-medium px-3 py-1.5 rounded-full inline-block">
              🔒 Bank-Grade Encryption Verified
            </div>
          </div>
          
          <h3 className="text-base font-semibold text-gray-900 leading-snug px-4">
            {reason}
          </h3>
          
          <p className="text-xs text-gray-400 mt-2 mb-8">
            Touch and hold the sensor below or align with your face
          </p>

          {/* Laser-guided scanner ring */}
          <div className="relative flex items-center justify-center w-36 h-36 mb-8">
            {/* SVG Progress Circular Track */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="64"
                className="stroke-gray-100"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="64"
                className={`transition-all duration-100 ease-out ${
                  scanState === 'success' 
                    ? 'stroke-emerald-500' 
                    : scanState === 'failed' 
                    ? 'stroke-red-500' 
                    : 'stroke-emerald-400'
                }`}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 64}`}
                strokeDashoffset={`${2 * Math.PI * 64 * (1 - progress / 100)}`}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Pulsing Backlight Ripple */}
            <div className={`absolute w-28 h-28 rounded-full flex items-center justify-center transition-all duration-300 ${
              scanState === 'success' 
                ? 'bg-emerald-500/20 scale-105' 
                : 'bg-emerald-500/5 animate-pulse'
              }`}
            >
              <div className={`absolute w-24 h-24 rounded-full border transition-all duration-300 ${
                scanState === 'success' ? 'border-emerald-500/40' : 'border-emerald-500/10'
              }`}></div>
            </div>

            {/* Interactive Sensor Fingerprint */}
            <button
              disabled={scanState === 'success'}
              className={`relative z-10 p-5 rounded-full bg-white transition-all duration-300 shadow-lg ${
                scanState === 'success'
                  ? 'text-emerald-500 border-2 border-emerald-500 scale-95'
                  : 'text-[#00B875] hover:scale-105 active:scale-95'
              }`}
            >
              {scanState === 'success' ? (
                <ShieldCheck className="w-12 h-12" />
              ) : (
                <Fingerprint className={`w-12 h-12 ${scanState === 'scanning' ? 'animate-pulse' : ''}`} />
              )}
            </button>
          </div>

          {/* Status Label */}
          <div className="space-y-1">
            <p className={`text-sm font-bold uppercase tracking-wider ${
              scanState === 'success' 
                ? 'text-emerald-600' 
                : scanState === 'scanning' 
                ? 'text-emerald-500' 
                : 'text-gray-500'
            }`}>
              {scanState === 'success' ? 'Authorized Successfully' : `Scanning... ${progress}%`}
            </p>
            <p className="text-[11px] text-gray-400">
              SECURE BIOMETRIC SERVICE TILE
            </p>
          </div>
        </div>

        {/* Footer info lock banner */}
        <div className="bg-gray-50/80 px-6 py-3 border-t border-gray-100 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
          <span>NDIC Insured & Centrally Encrypted via OPay Secure-Vault</span>
        </div>
      </div>
    </div>
  );
}
