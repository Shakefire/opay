/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, EyeOff, Settings, ChevronRight, TrendingUp, Compass, Target, 
  Briefcase, Award, Shield, Lock, Wallet, HelpCircle, Coins 
} from 'lucide-react';
import { Transaction } from '../types.ts';

interface OWealthManagerProps {
  owealthBalance: number;
  mainBalance: number;
  showBalance: boolean;
  onUpdateBalances: (owealthDelta: number, mainDelta: number, newTx?: Transaction) => void;
  onAddNotificationToast: (title: string, msg: string, type: 'success' | 'alert' | 'secure' | 'interest') => void;
}

export default function OWealthManager({
  owealthBalance,
  mainBalance,
  showBalance,
  onUpdateBalances,
  onAddNotificationToast
}: OWealthManagerProps) {
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amountInput, setAmountInput] = useState('');
  const [activeTab, setActiveTab] = useState<'savings' | 'loan'>('savings');
  const [error, setError] = useState('');

  // Interactive reward claim
  const [signedUp, setSignedUp] = useState(false);

  const handleDepositAction = () => {
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > mainBalance) {
      setError(`Transfer exceeds your available wallet balance of ₦${mainBalance.toLocaleString()}`);
      return;
    }
    setError('');

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      title: 'Deposit into OWealth Vault',
      type: 'transfer_out',
      amount: -amt,
      status: 'Successful',
      date: 'Jun 13th, 2026',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'Invest',
      paymentMethod: 'Balance',
      transactionNo: `260613${Math.floor(Math.random() * 89999 + 10000)}2897371`,
      notes: 'OWealth savings accumulation'
    };

    onUpdateBalances(amt, -amt, newTx);
    onAddNotificationToast(
      '📈 Deposited to OWealth',
      `Invested ₦${amt.toLocaleString()} securely into OWealth!`,
      'secure'
    );
    setAmountInput('');
    setDepositOpen(false);
  };

  const handleWithdrawAction = () => {
    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) return;
    if (amt > owealthBalance) {
      setError(`Withdrawal amount exceeds your OWealth balance of ₦${owealthBalance.toLocaleString()}`);
      return;
    }
    setError('');

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      title: 'Withdrawal from OWealth',
      type: 'transfer_in',
      amount: amt,
      status: 'Successful',
      date: 'Jun 13th, 2026',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'Withdrawal',
      paymentMethod: 'OWealth',
      transactionNo: `260613${Math.floor(Math.random() * 89999 + 10000)}2897372`,
      notes: 'Transfer to available wallet'
    };

    onUpdateBalances(-amt, amt, newTx);
    onAddNotificationToast(
      '💸 Withdrew to Wallet',
      `Transferred ₦${amt.toLocaleString()} safely back to your OPay wallet account.`,
      'success'
    );
    setAmountInput('');
    setWithdrawOpen(false);
  };

  const handleSignUpReward = () => {
    if (signedUp) return;
    setSignedUp(true);

    const claimAmt = 100.00;
    const newTx: Transaction = {
      id: `t_rew_${Date.now()}`,
      title: 'Target Savings Completion Reward',
      type: 'bonus',
      amount: claimAmt,
      status: 'Successful',
      date: 'Jun 13th, 2026',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'Cashback',
      paymentMethod: 'Reward Pool',
      transactionNo: `260613${Math.floor(Math.random() * 89999 + 10000)}2897`,
      notes: 'Exclusive rewards task bonus'
    };

    onUpdateBalances(0, claimAmt, newTx);
    onAddNotificationToast(
      '🎁 Exclusive Reward Claimed',
      `You successfully signed up and claimed ₦${claimAmt} Cash Reward!`,
      'success'
    );
  };

  return (
    <div className="space-y-4 -mx-5 -mt-5 bg-[#F8F9FA] pb-10 min-h-screen">
      
      {/* 1. Header with Gear settings and tabs */}
      <div className="bg-white px-5 pt-6 pb-2 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Finance</h1>
          <button 
            onClick={() => onAddNotificationToast('⚙️ Finance Settings', 'Automatic daily compounding settings are enabled.', 'secure')}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <Settings className="w-5 h-5 text-slate-700 stroke-[2.2px]" />
          </button>
        </div>

        {/* Savings / Loan tab selector */}
        <div className="flex gap-6 text-sm font-bold text-slate-400">
          <button 
            onClick={() => setActiveTab('savings')}
            className={`pb-2 tracking-wide transition-all border-b-2 cursor-pointer ${
              activeTab === 'savings' ? 'text-slate-800 border-[#00B875] font-black' : 'border-transparent'
            }`}
          >
            Savings
          </button>
          <button 
            onClick={() => {
              setActiveTab('loan');
              onAddNotificationToast('ℹ️ Loan Application', 'Your credit score qualifies you for instant quick loans of up to ₦150,000.', 'alert');
            }}
            className={`pb-2 tracking-wide transition-all border-b-2 cursor-pointer ${
              activeTab === 'loan' ? 'text-slate-800 border-[#00B875] font-black' : 'border-transparent'
            }`}
          >
            Loan
          </button>
        </div>
      </div>

      {/* 2. Total Balance Main Header Card */}
      <div className="px-5 mt-2">
        <div className="bg-[#00B875] text-white rounded-3xl p-5 relative overflow-hidden shadow-sm">
          {/* Wave background decor */}
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-6 -mb-6 pointer-events-none"></div>

          {/* Top row */}
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-1.5 text-emerald-100/90 text-[11px] font-semibold">
              <span>Total Balance</span>
              <HelpCircle className="w-3.5 h-3.5 text-emerald-100/75" />
            </div>

            <button 
              onClick={() => onAddNotificationToast('📈 Interest payout', 'Compounded 15% APY payout calculated daily at 02:45 AM.', 'interest')}
              className="flex items-center gap-0.5 bg-white/20 hover:bg-white/30 text-white font-bold text-[10px] py-1 px-2.5 rounded-full transition-colors"
            >
              <span>Interest Credited Today +₦0.09</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          {/* Amount column */}
          <div className="my-5">
            <h2 className="text-3xl font-black tracking-tight flex items-baseline gap-1">
              <span>₦</span>
              <span>{showBalance ? owealthBalance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '*****'}</span>
            </h2>
          </div>

          {/* Bottom text dropdown simulation */}
          <div className="flex justify-center border-t border-white/10 pt-3">
            <button 
              onClick={() => {
                setDepositOpen(true);
                setWithdrawOpen(false);
              }}
              className="text-[10px] font-extrabold text-emerald-50 hover:text-white flex items-center gap-1 uppercase transition-colors"
            >
              <span>View Assets Breakdown</span>
              <span className="text-[8px]">▼</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Deposit Actions if open */}
      {(depositOpen || withdrawOpen) && (
        <div className="px-5 animate-fade-in">
          <div className="bg-white p-4 rounded-2xl border border-emerald-150 shadow-3xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-50">
              <span className="text-xs font-black text-slate-800 uppercase">
                {depositOpen ? 'Add into OWealth Save' : 'Withdraw from OWealth Save'}
              </span>
              <button 
                onClick={() => {
                  setDepositOpen(false);
                  setWithdrawOpen(false);
                  setError('');
                }} 
                className="text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <p className="text-[10px] text-slate-400 leading-snug">
              {depositOpen 
                ? `Lock funds from your primary OPay wallet to earn high interest multiplier. Max available: ₦${mainBalance.toLocaleString()}`
                : `Transfer from your active high interest savings back to your spendable currency. Total saved: ₦${owealthBalance.toLocaleString()}`
              }
            </p>

            <div className="flex gap-2.5">
              <input 
                type="number"
                value={amountInput}
                onChange={e => {
                  setAmountInput(e.target.value);
                  setError('');
                }}
                placeholder="Amount (₦)"
                className="flex-1 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#00B875] focus:bg-white"
              />
              <button 
                onClick={depositOpen ? handleDepositAction : handleWithdrawAction}
                className="bg-[#00B875] hover:bg-[#00a367] text-white px-4 py-2 rounded-xl text-xs font-black shadow-xs cursor-pointer"
              >
                Confirm
              </button>
            </div>

            {error && (
              <p className="text-[10px] font-bold text-red-500 bg-red-50/70 p-2.5 border border-red-100 rounded-xl leading-normal animate-fade-in">
                ⚠️ {error}
              </p>
            )}
          </div>
        </div>
      )}

      {/* 3. Products Icon Grid (OWealth, Targets, SafeBox, Fixed, Spend & Save) */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-3xs">
          <div className="flex justify-between items-center text-center">
            {[
              { label: 'OWealth', icon: '🍃', color: 'bg-[#EEFAF5] text-[#00B875]', action: () => { setDepositOpen(true); setWithdrawOpen(false); } },
              { label: 'Targets', icon: '🎯', color: 'bg-emerald-50 text-emerald-600', action: () => onAddNotificationToast('🎯 Targets', 'Create specific goals like housing, vacation or education to save.', 'success') },
              { label: 'SafeBox', icon: '🔒', color: 'bg-emerald-50 text-emerald-700', action: () => { setWithdrawOpen(true); setDepositOpen(false); } },
              { label: 'Fixed', icon: '💼', color: 'bg-emerald-50 text-emerald-800', isNew: true, action: () => onAddNotificationToast('💼 Fixed Deposits', 'Set up high yielding locked deposits up to 18% APY.', 'interest') },
              { label: 'Spend & Save', icon: '💰', color: 'bg-emerald-50 text-emerald-900', action: () => onAddNotificationToast('💸 Spend & Save', 'Automatically saves a small percentage whenever you make transactions.', 'success') }
            ].map((p, idx) => (
              <button 
                key={idx} 
                className="flex flex-col items-center flex-1 cursor-pointer group relative"
                onClick={p.action}
              >
                {p.isNew && (
                  <span className="absolute -top-1 right-0 bg-[#FF4A6B] text-white text-[7.5px] font-black px-1.5 py-0.2 rounded-full scale-90 shadow-2xs">
                    New
                  </span>
                )}
                <div className={`w-11 h-11 ${p.color} rounded-2xl flex items-center justify-center text-lg shadow-3xs hover:scale-105 active:scale-90 transition-all border border-slate-100`}>
                  {p.icon}
                </div>
                <span className="text-[9.5px] font-bold text-slate-600 mt-2 tracking-tight leading-none line-clamp-1">{p.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4. "Your Exclusive Rewards!" component card */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-3xs space-y-3.5">
          <div className="flex justify-between items-center text-slate-800">
            <div>
              <h3 className="text-xs font-black text-slate-800 tracking-wide uppercase">Your Exclusive Rewards!</h3>
              <p className="text-[10px] text-slate-400 font-bold leading-none mt-0.5">Complete tasks and earn cash rewards.</p>
            </div>
            
            <button 
              onClick={() => onAddNotificationToast('🎁 Rewards catalog', 'More tasks are added weekly. Check back often!', 'success')}
              className="text-[10px] text-slate-400 font-bold flex items-center hover:underline"
            >
              View All &gt;
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] pb-1 border-b border-dashed border-slate-100">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              Create a Target and Deposit <HelpCircle className="w-3.5 h-3.5 text-slate-400 stroke-[2px]" />
            </span>
            <span className={`text-[10.5px] font-bold ${signedUp ? 'text-emerald-700' : 'text-[#FF4A6B]'}`}>
              {signedUp ? 'Signed up ✓' : 'To be Signed-up'}
            </span>
          </div>

          {/* Cash reward banner item layout */}
          <div className="bg-[#F6FCF9] border border-[#CDF2E2] rounded-xl p-3 flex justify-between items-center text-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">💵</span>
              <span className="text-[11px] font-black text-[#00B875]">Reward: ₦100</span>
            </div>

            <button 
              onClick={handleSignUpReward}
              disabled={signedUp}
              className={`text-[10px] font-black px-4 py-2 rounded-full shadow-xs cursor-pointer select-none transition-all ${
                signedUp 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200' 
                  : 'bg-[#00B875] hover:bg-[#00a367] text-white'
              }`}
            >
              {signedUp ? 'Signed up' : 'Sign-up Now'}
            </button>
          </div>
        </div>
      </div>

      {/* 5. Saving Challenge 2026 Big Banner */}
      <div className="px-5">
        <div className="bg-[#103D2E] text-white rounded-2xl p-5 border border-emerald-900/10 shadow-3xs relative overflow-hidden">
          {/* Naira coins gold elements floating mock graphics */}
          <div className="absolute right-2 top-2 select-none opacity-90 text-center flex flex-col items-center">
            <div className="bg-[#FFF1A8] text-[#9A7D0A] font-black text-xs w-8 h-8 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative animate-bounce leading-none">
              ₦
            </div>
            <div className="bg-gradient-to-r from-amber-400 to-yellow-600 h-2 w-10 mt-1 rounded-sm shadow-xs border border-amber-300"></div>
          </div>

          <div className="max-w-[200px] relative z-10 space-y-1.5">
            <h3 className="text-sm font-black text-[#FFE678] uppercase tracking-wider">Saving Challenge 2026</h3>
            <p className="text-[9.5px] text-emerald-100 font-bold leading-tight">
              Start small daily, finish big in 2026
            </p>
            
            <div className="pt-2">
              <button 
                onClick={() => onAddNotificationToast('🌟 Challenge Activated', 'Start saving ₦200 daily to unlock matching bonus interest payouts!', 'success')}
                className="bg-transparent border-2 border-[#FFE885] hover:bg-[#FFE885] hover:text-[#103D2E] text-[#FFE885] text-[10px] font-black py-1.5 px-4 rounded-full select-none shadow-xs transition-all active:scale-95 cursor-pointer uppercase"
              >
                START SAVING NOW
              </button>
            </div>
          </div>

          {/* Bottom regulatory backing text */}
          <div className="border-t border-white/10 pt-2.5 mt-4.5">
            <p className="text-[8px] text-emerald-250 opacity-75 font-semibold text-center leading-none">
              Licensed by CBN | Insured by the NDIC | Powered by OPay MFB
            </p>
          </div>
        </div>
      </div>

      {/* 6. Savers counts grid layout at bottom */}
      <div className="px-5">
        <div className="grid grid-cols-2 gap-3.5">
          {/* Savers metrics card */}
          <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-2xl p-4 flex flex-col justify-between h-36 border border-slate-100 shadow-3xs relative overflow-hidden">
            <div>
              <p className="text-[#008751] text-xs font-black tracking-tight leading-4">
                10,000,000 Savers Here
              </p>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1 leading-snug">
                Save with OPay and fulfil your dreams with ease
              </p>
            </div>
            
            {/* Simple vector visual for savings */}
            <div className="flex gap-1 items-end pt-2">
              <div className="w-1.5 h-3 bg-emerald-200 rounded-sm"></div>
              <div className="w-1.5 h-5 bg-emerald-300 rounded-sm"></div>
              <div className="w-1.5 h-7 bg-emerald-400 rounded-sm"></div>
              <div className="w-1.5 h-10 bg-[#00B875] rounded-sm relative">
                <span className="absolute -top-3.5 -left-1 text-[8px] animate-pulse">📈</span>
              </div>
            </div>
          </div>

          {/* Right combined stacked rows */}
          <div className="grid grid-rows-2 gap-3.5 h-36">
            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-3xs flex flex-col justify-center">
              <span className="text-[#101828] text-[11px] font-black font-sans leading-tight">SafeBox</span>
              <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug">
                Flexible savings with <span className="text-[#00B875] font-black">15% p.a.</span>
              </p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-3 shadow-3xs flex flex-col justify-center">
              <span className="text-[#101828] text-[11px] font-black font-sans leading-tight">Fixed</span>
              <p className="text-[9.5px] text-slate-400 mt-0.5 leading-snug">
                High yielding locked rates <span className="text-emerald-700 font-black">18% p.a.</span>
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
