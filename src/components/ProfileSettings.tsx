/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Settings, Eye, EyeOff, ShieldAlert, ChevronRight, ClipboardList, 
  Gauge, CreditCard, Store, Users, Shield, Headphones, Gift, Radio, RefreshCw, X
} from 'lucide-react';
import { UserState } from '../types.ts';

interface ProfileSettingsProps {
  userState: UserState;
  onToggleBiometrics: () => void;
  onToggleShowBalance: () => void;
  onResetData: () => void;
  onUpdateUsername: (newName: string) => void;
  onUpdateAccountNumber: (newAccountNumber: string) => void;
}

export default function ProfileSettings({
  userState,
  onToggleBiometrics,
  onToggleShowBalance,
  onResetData,
  onUpdateUsername,
  onUpdateAccountNumber
}: ProfileSettingsProps) {
  const [securityOn, setSecurityOn] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(userState.fullName);
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [tempAccountNumber, setTempAccountNumber] = useState(userState.opayAccountNumber);

  const handleTurnOnSecurity = () => {
    setSecurityOn(true);
    onToggleBiometrics(); // Triggers biometric confirmation as a cool simulation!
  };

  const handleResetSim = () => {
    onResetData();
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempName.trim()) {
      onUpdateUsername(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleSaveAccountNumber = (e: React.FormEvent) => {
    e.preventDefault();
    if (tempAccountNumber.trim()) {
      onUpdateAccountNumber(tempAccountNumber.trim());
      setIsEditingAccount(false);
    }
  };

  return (
    <div className="space-y-4 -mx-5 -mt-5 bg-[#F8F9FA] pb-10 min-h-screen">
      
      {/* 1. Light Mint Green Header Area */}
      <div className="bg-[#E5F9F1] px-5 pt-6 pb-5 rounded-b-[32px] relative overflow-hidden">
        {/* Dynamic circular radar glow in corner */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 bg-[#CCF4E2]/60 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-20 h-20 bg-[#B0EECD]/60 rounded-full flex items-center justify-center">
            <div className="w-12 h-12 bg-[#00B470]/10 rounded-full flex items-center justify-center">
              <Shield className="text-[#00B875] w-5 h-5 fill-current opacity-80" />
            </div>
          </div>
        </div>

        {/* Profile Greeting Row */}
        <div className="flex justify-between items-center mb-5 relative z-10">
          <div className="flex items-center gap-3">
            {/* Custom Cap/Guy User Avatar */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80" 
                alt={`${userState.fullName} Profile`} 
                className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-sm bg-slate-200"
                referrerPolicy="no-referrer"
              />
              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#00B875] border-2 border-white rounded-full"></span>
            </div>

            <div 
              onClick={() => { setTempName(userState.fullName); setIsEditingName(true); }}
              className="cursor-pointer group"
            >
              <div className="flex items-center gap-1.5">
                <h2 className="text-sm font-black text-slate-800 leading-none group-hover:text-[#00B875] transition-colors">Hi, {userState.fullName}</h2>
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#00B875] transition-colors fill-none stroke-current stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  alert('Tier Level Status: You reside at OPay Certified Level 3. Your daily transaction limit is ₦5,000,000.');
                }}
                className="bg-[#D1F3E4] border border-[#A4E6C9] text-[#006E41] text-[10px] font-black px-2 py-0.5 rounded-full mt-1.5 flex items-center gap-1 active:scale-95 transition-all select-none cursor-pointer"
              >
                <span>Upgrade to Tier 3</span>
              </button>
            </div>
          </div>

          <button 
            onClick={() => { setTempName(userState.fullName); setIsEditingName(true); }}
            className="p-1 hover:bg-white/40 active:scale-90 transition-all rounded-full cursor-pointer relative z-10"
            title="Edit Username"
          >
            <Settings className="w-5 h-5 text-slate-800 stroke-[2.2px]" />
          </button>
        </div>

        {/* Balance Section inside the Mint panel */}
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold text-[11px]">
            <span>Total Balance</span>
            <button 
              onClick={onToggleShowBalance} 
              className="p-0.5 hover:bg-white/30 rounded-full transition-colors cursor-pointer text-slate-400"
            >
              {userState.showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
          </div>

          <h3 className="text-2xl font-black text-slate-800 tracking-tight mt-1">
            ₦{userState.showBalance ? userState.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '*****'}
          </h3>

          <p className="text-[10px] text-[#00B875] font-extrabold mt-1">
            Interest Credited Today +₦0.09
          </p>
        </div>
      </div>

      {/* 2. Security warning banner on top */}
      {!securityOn && (
        <div className="px-5">
          <div className="bg-[#00B875] text-white rounded-2xl p-3.5 flex justify-between items-center shadow-xs animate-fade-in border border-emerald-400/20">
            <div className="max-w-[210px]">
              <h4 className="text-[11px] font-black flex items-center gap-1 leading-none mb-1">
                Security Check is not turned on
              </h4>
              <p className="text-[9.5px] text-emerald-50 font-bold leading-snug">
                Make your account more secure with extra safety checks.
              </p>
            </div>

            <button 
              onClick={handleTurnOnSecurity}
              className="bg-white hover:bg-slate-50 text-[#00B875] text-[10px] font-black px-4 py-2 rounded-full shadow-xs cursor-pointer select-none"
            >
              Turn On
            </button>
          </div>
        </div>
      )}

      {/* 3. Group 1: Transaction History, Account Limits, Bank Card */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-3xs space-y-0.5">
          
          <div 
            onClick={() => alert('Opening Transaction History Records...')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <ClipboardList className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Transaction History</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('Account Limits: ₦5,000,000 single transfer limit.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Gauge className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Account Limits</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none">View your transaction limits</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('Linked Bank Accounts & Cards: 1 active Verve virtual debit card.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <CreditCard className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Bank Card/Account</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none">1 linked card/account</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => { setTempAccountNumber(userState.opayAccountNumber); setIsEditingAccount(true); }}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <CreditCard className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">OPay Account Number</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none font-mono">{userState.opayAccountNumber}</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('Pay ME Merchant Integration: generate business QR code.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Store className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Pay ME</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none">Receive payment for your business</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('OJunior Parental Vault: secure kids allowance savings.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Users className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">OJunior</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none font-sans">Create an account for your child/ward</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

        </div>
      </div>

      {/* 4. Group 2: Security Center, Support, Invitation, USSD */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-2.5 border border-slate-100 shadow-3xs space-y-0.5">
          
          <div 
            onClick={() => alert('OPay Security Guard: protect your wallet from SIM swaps & unrecognized devices.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Shield className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Security Center</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none">Protect your funds</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('OPay Customer Centre: Speak with active live agents on 01-8888-329.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Headphones className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Customer Service Center</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('Affiliate share links: get code to earn continuous rewards.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Gift className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">Invitation</span>
                <span className="text-[9.5px] text-slate-400 font-bold leading-none">Invite friends and earn up to ₦5,600 Bonus</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

          <div 
            onClick={() => alert('OPay Offline USSD Code: dial *955# on any linked cell provider.')}
            className="flex justify-between items-center py-2.5 px-2 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E5F9F1] text-[#00B875] flex items-center justify-center">
                <Radio className="w-4.5 h-4.5 stroke-[2px]" />
              </div>
              <div>
                <span className="text-[11.5px] font-bold text-slate-800 block">OPay USSD</span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>

        </div>
      </div>

      {/* 5. Sim controller / reset options */}
      <div className="px-5 mt-2">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-3xs space-y-3">
          <div>
            <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest pb-1.5 border-b border-dashed border-slate-100 mb-1">
              Sandbox Operations
            </h4>
            <p className="text-[9.5px] text-slate-400 leading-normal font-sans">
              Compounded metrics and transaction histories are cached locally. You can roll them back safely.
            </p>
          </div>

          <button 
            onClick={handleResetSim}
            className="w-full flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-[#FF496C] font-black py-3 rounded-xl text-center text-xs transition-colors cursor-pointer border border-red-100 select-none"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Sandbox Database</span>
          </button>
        </div>
      </div>

      {/* 6. Edit Username Modal popup */}
      {isEditingName && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl relative">
            <button 
              onClick={() => setIsEditingName(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Edit Display Name</h3>
            
            <form onSubmit={handleSaveName} className="space-y-4">
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Choose a custom username to represent your OPay identity. This display name is updated universally across all portals.
              </p>
              
              <div>
                <label className="text-[9.5px] font-bold text-gray-400 uppercase block mb-1">Display Name</label>
                <input
                  type="text"
                  maxLength={18}
                  style={{ textTransform: 'uppercase' }}
                  value={tempName}
                  onChange={e => setTempName(e.target.value.toUpperCase())}
                  className="w-full bg-slate-50 border border-gray-150 rounded-xl py-2.5 px-3.5 font-bold text-sm text-gray-950 focus:outline-none focus:bg-white focus:border-[#00B875]"
                  autoFocus
                  required
                />
              </div>
              
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-gray-650 font-bold py-2.5 rounded-xl text-center text-xs cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00B875] hover:bg-[#00a367] text-white font-bold py-2.5 rounded-xl text-center text-xs cursor-pointer select-none shadow-sm"
                >
                  Save Name
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Edit Account Number Modal popup */}
      {isEditingAccount && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-2xl relative">
            <button 
              onClick={() => setIsEditingAccount(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
            >
              <X className="w-4 h-4" />
            </button>
            
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Edit OPay Account</h3>
            
            <form onSubmit={handleSaveAccountNumber} className="space-y-4">
              <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                Set your OPay account number. This will be displayed on all transaction receipts and downloads.
              </p>
              
              <div>
                <label className="text-[9.5px] font-bold text-gray-400 uppercase block mb-1">Account Number</label>
                <input
                  type="text"
                  maxLength={20}
                  value={tempAccountNumber}
                  onChange={e => setTempAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-150 rounded-xl py-2.5 px-3.5 font-mono text-sm text-gray-950 focus:outline-none focus:bg-white focus:border-[#00B875]"
                  autoFocus
                  placeholder="e.g., 912****904"
                  required
                />
                <p className="text-[8.5px] text-gray-400 font-medium mt-1.5">
                  You can use * to mask digits (e.g., 912****904)
                </p>
              </div>
              
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditingAccount(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-gray-650 font-bold py-2.5 rounded-xl text-center text-xs cursor-pointer select-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#00B875] hover:bg-[#00a367] text-white font-bold py-2.5 rounded-xl text-center text-xs cursor-pointer select-none shadow-sm"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
