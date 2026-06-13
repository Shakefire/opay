/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, Fingerprint, Lock, Phone, Smartphone } from 'lucide-react';
import BiometricModal from './BiometricModal.tsx';

interface LoginProps {
  onLoginSuccess: (phoneNumber: string) => void;
  userFullName: string;
}

export default function Login({ onLoginSuccess, userFullName }: LoginProps) {
  const [phone, setPhone] = useState('08064118223'); // Preset with Habila Hassan's demo number
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setErrorMessage('Please enter your OPay registered phone number');
      return;
    }
    if (!password || password.length < 4) {
      setErrorMessage('Please enter a valid OPay passcode or password');
      return;
    }
    // Success entry
    onLoginSuccess(phone);
  };

  const handleBiometricSuccess = () => {
    setIsBiometricOpen(false);
    onLoginSuccess('08064118223'); // Logged in as demo user
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between p-6">
      {/* Top Header Decor */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex items-center gap-1">
          {/* Trademark OPay Green Rings logo */}
          <div className="w-8 h-8 rounded-full bg-[#00B875] flex items-center justify-center relative">
            <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-white"></div>
            </div>
          </div>
          <span className="font-extrabold text-xl text-gray-900 tracking-tight">
            OPay<span className="text-[#00B875]">.</span>
          </span>
        </div>
        <span className="text-xs font-semibold px-3 py-1 bg-gray-200/60 text-gray-600 rounded-full">
          v5.8.2 (Secure)
        </span>
      </div>

      {/* Primary Card */}
      <div className="w-full max-w-sm mx-auto my-auto py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {userFullName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sing in to your secure digital wallets & savings accounts
          </p>
        </div>

        {errorMessage && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-6">
            <p className="text-xs font-semibold text-red-700">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4">
          {/* Phone Number Item */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Phone Number / OPay Account
            </label>
            <div className="relative flex items-center">
              <Smartphone className="absolute left-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080 0000 0000"
                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#00B875] transition-colors"
              />
            </div>
          </div>

          {/* Passcode Item */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                6-Digit Security Passcode
              </label>
              <a href="#reset" className="text-xs font-semibold text-[#00B875]">
                Forgot Passcode?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-white border border-gray-200 rounded-xl py-3.5 pl-11 pr-11 text-sm font-medium text-gray-900 focus:outline-none focus:border-[#00B875] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 p-1 text-gray-400 hover:text-gray-500 transition-colors"
                id="toggle-password-visibility"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className="w-full bg-[#00B875] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/10 hover:bg-[#00a367] transition-all duration-200 focus:outline-none cursor-pointer mt-2 text-sm"
            id="btn-signin"
          >
            Sign In Securely
          </button>
        </form>

        {/* Biometrics Shortcut */}
        <div className="flex flex-col items-center mt-8">
          <div className="flex items-center gap-3 w-full my-6">
            <div className="h-[1px] bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or Fast Login</span>
            <div className="h-[1px] bg-gray-200 flex-1"></div>
          </div>

          <button
            onClick={() => setIsBiometricOpen(true)}
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 bg-white hover:border-[#00B875]/30 hover:bg-[#00B875]/5 transition-all w-32 shadow-xs cursor-pointer group"
            id="btn-biometric-trigger"
          >
            <Fingerprint className="w-8 h-8 text-[#00B875] group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-gray-600">Biometrics</span>
          </button>
        </div>
      </div>

      {/* Safety Notice Bottom Banner */}
      <div className="text-center max-w-xs mx-auto mb-2">
        <p className="text-[11px] text-gray-400 leading-relaxed">
          Authorized & Regulated by CBN. Protected by NDIC. All balance metrics are stored securely under local hardware encryption standards.
        </p>
      </div>

      {/* Biometrics Modal Overlay */}
      <BiometricModal
        isOpen={isBiometricOpen}
        reason="Authorize biometric scan to access secure wallets"
        onSuccess={handleBiometricSuccess}
        onCancel={() => setIsBiometricOpen(false)}
      />
    </div>
  );
}
