/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronRight, Ticket, Flame, Zap, Award, Coins } from 'lucide-react';
import { Transaction } from '../types.ts';

interface RewardsCenterProps {
  bonusBalance: number;
  onClaimCash: (claimAmt: number, newTx: Transaction) => void;
  onAddNotificationToast: (title: string, msg: string, type: 'success' | 'alert' | 'secure' | 'interest') => void;
}

export default function RewardsCenter({ bonusBalance, onClaimCash, onAddNotificationToast }: RewardsCenterProps) {
  // Simple countdown state for "Hot Deals"
  const [countdown, setCountdown] = useState({ hours: '06', minutes: '39', seconds: '05' });

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let h = parseInt(prev.hours);
        let m = parseInt(prev.minutes);
        let s = parseInt(prev.seconds);

        if (s > 0) {
          s--;
        } else {
          s = 59;
          if (m > 0) {
            m--;
          } else {
            m = 59;
            if (h > 0) {
              h--;
            } else {
              h = 23; 
            }
          }
        }

        return {
          hours: h.toString().padStart(2, '0'),
          minutes: m.toString().padStart(2, '0'),
          seconds: s.toString().padStart(2, '0')
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleUseHotVoucher = (amount: number, voucherName: string) => {
    onAddNotificationToast(
      '🎫 Voucher Activated',
      `You successfully used your ₦${amount} ${voucherName}. Discount applied to your next transaction!`,
      'success'
    );
  };

  const handleRemindMe = () => {
    onAddNotificationToast(
      '🔔 Reminder Set',
      'We will alert you 5 minutes before this Hot Deal starts!',
      'success'
    );
  };

  const handleGoDailyBonus = () => {
    onAddNotificationToast(
      '📱 Airtime Purchase',
      'Redirecting to Airtime purchase screen with up to 6% Cashback!',
      'success'
    );
  };

  return (
    <div className="space-y-4 -mx-5 -mt-5 bg-[#F8F9FA] pb-10 min-h-screen">
      
      {/* 1. Header Minty Background Panel */}
      <div className="bg-[#E5F9F1] px-5 pt-6 pb-6 rounded-b-[32px] shadow-xs">
        {/* Title row */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Rewards</h1>
          <button 
            onClick={() => onAddNotificationToast('ℹ️ Rewards Info', 'Vouchers expire on a rolling 30-day window.', 'alert')} 
            className="w-7 h-7 bg-white/40 hover:bg-white/60 active:scale-95 transition-all rounded-full flex items-center justify-center text-slate-700 cursor-pointer text-sm"
          >
            •••
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          {/* Cashback Card */}
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px] mb-1.5">
              <span>Cashback</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div 
              onClick={() => onAddNotificationToast('💰 Cashback Balance', 'This balance can be spent directly on airtime, data or transferred.', 'success')}
              className="flex items-center gap-1 cursor-pointer group"
            >
              {/* Coin illustration */}
              <div className="w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center text-white text-[11px] font-black border border-amber-350 shadow-xs">
                ₦
              </div>
              <span className="text-lg font-black text-slate-800 tracking-tight group-hover:underline">
                ₦ 53.50
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Voucher Card */}
          <div className="flex flex-col border-l border-slate-200/50 pl-4">
            <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px] mb-1.5">
              <span>Voucher</span>
              <span className="bg-[#E5F9F1] text-[#00B875] text-[10px] font-bold px-1.5 py-0.5 rounded-sm ml-1 border border-[#00B875]/20">
                ₦240
              </span>
            </div>
            <div 
              onClick={() => onAddNotificationToast('ticket info', 'You have 4 active vouchers ready to be redeemed.', 'success')}
              className="flex items-center gap-1 cursor-pointer group"
            >
              <Ticket className="w-6 h-6 text-slate-600 fill-slate-800 transform rotate-12 stroke-[1.5px]" />
              <span className="text-lg font-black text-slate-800 tracking-tight group-hover:underline ml-1">
                4
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Horizontal Scroll/Row of white promo icons */}
      <div className="px-5">
        <div className="grid grid-cols-4 gap-2.5">
          {[
            {
              label: 'Friday Bonus',
              icon: (
                <div className="relative w-11 h-11 bg-teal-50 rounded-2xl flex items-center justify-center p-1 border border-teal-100 shadow-3xs">
                  <div className="bg-[#B9F1DE] w-full h-full rounded-xl flex items-center justify-center flex-col text-[10px] font-black text-[#008F56] relative leading-none">
                    <span className="text-[7px] font-bold uppercase scale-85">Ticket</span>
                    <span>200</span>
                  </div>
                </div>
              )
            },
            {
              label: 'Refer Friends',
              icon: (
                <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center p-1 border border-orange-100 shadow-3xs">
                  <div className="w-full h-full rounded-xl bg-orange-100 flex items-center justify-center text-lg relative font-bold">
                    🥰
                    <span className="absolute -bottom-1 -right-1 text-[8px] bg-red-500 text-white px-1 rounded-full scale-75">10</span>
                  </div>
                </div>
              )
            },
            {
              label: 'Play4Child',
              icon: (
                <div className="w-11 h-11 bg-yellow-50 rounded-2xl flex items-center justify-center p-1 border border-yellow-100 shadow-3xs">
                  <div className="w-full h-full rounded-xl bg-yellow-100/70 flex items-center justify-center text-yellow-500 text-lg">
                    ⭐
                  </div>
                </div>
              )
            },
            {
              label: 'Voucher Pack',
              icon: (
                <div className="w-11 h-11 bg-green-50 rounded-2xl flex items-center justify-center p-1 border border-green-100 shadow-3xs">
                  <div className="w-full h-full rounded-xl bg-[#C1F3DC] flex items-center justify-center text-emerald-700 text-lg font-black text-center">
                    %
                  </div>
                </div>
              )
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-2.5 flex flex-col items-center text-center shadow-3xs border border-slate-100 hover:scale-102 transition-all">
              {item.icon}
              <span className="text-[9px] font-bold text-slate-700 mt-2 tracking-tight leading-none line-clamp-1">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Hot Vouchers section */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-3xs">
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-[12px] font-black text-slate-800 uppercase tracking-wider">Hot Vouchers</span>
            <div className="bg-[#00B875] text-white text-[9px] font-black px-1.5 rounded-sm scale-95 flex items-center justify-center">
              ₦
            </div>
          </div>

          <div className="border-b border-[#00B875]/20 pb-1.5 mb-3">
            <span className="text-xs font-bold text-emerald-700 tracking-wide inline-block border-b-2 border-[#00B875] pb-1">
              Betting
            </span>
          </div>

          {/* Three Voucher Boxes Side-by-Side */}
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { amount: 80, limit: '1,000' },
              { amount: 50, limit: '500' },
              { amount: 100, limit: '2,000' }
            ].map((v, idx) => (
              <div key={idx} className="bg-[#F3FCF8] border border-[#BFF1DE] rounded-xl p-2 text-center flex flex-col justify-between align-middle h-28 relative shadow-3xs">
                <div>
                  <h3 className="text-[#00B875] text-md font-black tracking-tight mt-1">
                    ₦{v.amount}
                  </h3>
                  <p className="text-[8px] font-semibold text-slate-500 leading-3">Betting Voucher</p>
                </div>
                <div>
                  <p className="text-[7.5px] text-slate-400 font-medium font-sans mb-1.5">₦{v.limit} available</p>
                  <button 
                    onClick={() => handleUseHotVoucher(v.amount, 'Betting Voucher')}
                    className="w-full bg-[#1A1A1A] hover:bg-black text-white text-[9px] font-bold py-1.5 rounded-full select-none shadow-xs active:scale-95 cursor-pointer"
                  >
                    Use
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Hot Deals section */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-3xs">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <span className="text-[12px] font-black text-slate-800 uppercase tracking-wider">Hot Deals</span>
              <span className="text-yellow-500 text-xs">⚡</span>
            </div>
            
            <button 
              onClick={() => onAddNotificationToast('Rules', 'Deals flash sale: claim within limited time window. Premium OPay rules apply.', 'alert')}
              className="text-[10px] text-slate-400 font-semibold hover:underline flex items-center"
            >
              Rules &gt;
            </button>
          </div>

          <div className="border-b border-slate-100 pb-1 mb-3">
            <span className="text-xs font-bold text-slate-800 border-b-2 border-[#00B875] pb-1 inline-block">
              Data
            </span>
          </div>

          {/* Time & Countdown Row */}
          <div className="flex justify-between items-center mb-3.5">
            <div className="flex gap-2">
              <span className="bg-[#E5F9F1] text-[#00B875] text-[10.5px] font-bold px-2 py-0.5 rounded-full">
                08:30
              </span>
              <span className="text-slate-400 text-[10.5px] font-bold px-2 py-0.5">
                19:30
              </span>
            </div>

            <div className="flex items-center gap-1 text-[10.5px] font-bold text-slate-700">
              <span className="text-slate-500 font-medium">Start at</span>
              <span className="bg-[#FF4A6B] text-white text-[9.5px] font-mono font-bold px-1 rounded-sm">{countdown.hours}</span>
              <span className="text-[#FF4A6B] font-black text-[9px] -mt-0.5">:</span>
              <span className="bg-[#FF4A6B] text-white text-[9.5px] font-mono font-bold px-1 rounded-sm">{countdown.minutes}</span>
              <span className="text-[#FF4A6B] font-black text-[9px] -mt-0.5">:</span>
              <span className="bg-[#FF4A6B] text-white text-[9.5px] font-mono font-bold px-1 rounded-sm">{countdown.seconds}</span>
            </div>
          </div>

          {/* Core Deal Box */}
          <div className="bg-[#F5FBF9] border border-[#D5F3E7] rounded-2xl p-3 flex justify-between items-center relative overflow-hidden">
            <div className="flex gap-3">
              {/* Airtel Mini Styled Logo */}
              <div className="w-10 h-10 bg-red-600 rounded-full flex flex-col items-center justify-center text-white scale-95 shadow-sm transform -rotate-12 border border-red-550">
                <span className="text-[7.5px] font-black uppercase tracking-tighter leading-none">airtel</span>
                <div className="w-2.5 h-[1.5px] bg-white rounded-full mt-0.5"></div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#FFECEF] text-red-500 text-[7px] font-bold px-1.5 py-0.2 rounded-sm border border-red-100 uppercase tracking-wider scale-95">
                    50% OFF
                  </span>
                  <h4 className="text-[11px] font-extrabold text-slate-800">
                    750MB/7 Days/50%off
                  </h4>
                </div>

                {/* Progress bar */}
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-24 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-[#00B875] h-full" style={{ width: '73%' }}></div>
                  </div>
                  <span className="text-[8px] font-bold text-slate-400">73</span>
                </div>

                {/* Pricing section */}
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-[#00B875] text-[12px] font-black">₦250</span>
                  <span className="text-slate-400 text-[10px] font-semibold line-through font-sans">₦500</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleRemindMe}
              className="bg-[#00B875] hover:bg-[#00a367] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xs cursor-pointer select-none"
            >
              Remind
            </button>
          </div>
        </div>
      </div>

      {/* 5. Daily Bonus section */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-3xs flex justify-between items-center hover:scale-101 transition-all">
          <div className="flex gap-3">
            {/* Glo Green styled vector logo */}
            <div className="w-10 h-10 bg-[#008751] rounded-full flex flex-col items-center justify-center text-white scale-95 shadow-sm relative">
              <span className="text-[9px] font-black lowercase tracking-widest italic font-sans -mt-0.5">glo</span>
              <div className="absolute right-1 bottom-1 w-2.5 h-2.5 border-[1.5px] border-yellow-300 rounded-full"></div>
            </div>

            <div>
              <div className="flex items-center gap-1 bg-[#EEFAF5] border border-[#CFF1E3] px-2 py-0.5 rounded-full inline-block mb-1">
                <span className="text-[#008751] text-[9.5px] font-bold flex items-center gap-1">
                  Glo Airtime <span className="text-yellow-500">🪙</span> <span className="font-black text-[#00B875]">+Up to 6%</span>
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 leading-snug">
                Buy Airtime and get up to 6% Cashback
              </p>
            </div>
          </div>

          <button 
            onClick={handleGoDailyBonus}
            className="bg-[#00B875] hover:bg-[#00a367] text-white text-xs font-black min-w-[56px] py-2 rounded-full inline-block text-center shadow-xs cursor-pointer select-none"
          >
            Go
          </button>
        </div>
      </div>

    </div>
  );
}
