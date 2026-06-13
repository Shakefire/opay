/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Zap, Globe, Store, Palette, ShieldCheck } from 'lucide-react';

interface VirtualCardProps {
  userFullName?: string;
}

export default function VirtualCard({ userFullName = 'SHIMESON' }: VirtualCardProps) {
  const [activeTab, setActiveTab] = useState<'virtual' | 'physical'>('virtual');
  const [isApplied, setIsApplied] = useState(false);

  const handleApplyCard = () => {
    setIsApplied(true);
    alert('Congratulations! Your OPay Verve Classic Virtual Card has been approved and linked to your primary account instantly.');
  };

  return (
    <div className="space-y-4 -mx-5 -mt-5 bg-[#F8F9FA] pb-10 min-h-screen">
      
      {/* 1. Header Column */}
      <div className="bg-white px-5 pt-6 pb-2 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cards</h1>
          <button 
            onClick={() => alert('Cards FAQ: Virtual Cards are valid for online transactions with zero annual fees.')}
            className="text-[12.5px] font-black text-[#00B875] hover:underline"
          >
            Q&A
          </button>
        </div>

        {/* Tab navigation bar */}
        <div className="flex gap-6 text-sm font-bold text-slate-400 relative">
          <button 
            onClick={() => setActiveTab('virtual')}
            className={`pb-2 tracking-wide transition-all border-b-2 cursor-pointer ${
              activeTab === 'virtual' ? 'text-slate-800 border-[#00B875] font-black' : 'border-transparent'
            }`}
          >
            Virtual Card
          </button>

          <button 
            onClick={() => {
              setActiveTab('physical');
              alert('Physical ATM Card Delivery: Claim your physical card with CBN-insured backing to perform POS/ATM withdrawals. Delivered to your home in 3-5 days.');
            }}
            className={`pb-2 tracking-wide transition-all border-b-2 cursor-pointer relative ${
              activeTab === 'physical' ? 'text-slate-800 border-[#00B875] font-black' : 'border-transparent'
            }`}
          >
            <span>Physical Card</span>
            {/* Float pink 30% discount badge */}
            <span className="absolute -top-3.5 -right-12 bg-[#FF496C] text-white text-[7.5px] font-black px-1.5 py-0.2 rounded-full scale-90 shadow-2xs">
              30% OFF
            </span>
          </button>
        </div>
      </div>

      {/* 2. Virtual Card Design */}
      <div className="px-5 mt-3 select-none">
        {/* Core OPay Virtual Verve Card */}
        <div className="w-full bg-[#02C887] aspect-[1.58/1] rounded-2xl p-4 text-white shadow-md relative overflow-hidden flex flex-col justify-between border border-emerald-350 transform transition-all hover:scale-101 duration-300">
          {/* Absolute vector concentric circles graphic from screenshots */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-32 border border-white/20 rounded-full flex items-center justify-center pointer-events-none">
            <div className="w-24 h-24 border border-white/25 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 border border-white/30 rounded-full flex items-center justify-center">
                <div className="w-8 h-8 border border-white/40 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Top row */}
          <div className="flex justify-between items-start z-10">
            <span className="font-extrabold text-lg tracking-tighter leading-none">
              OPay<span className="text-[#FFE46E]">.</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">Verve Classic</span>
          </div>

          {/* Mid row / Numbers visual */}
          <div className="my-2 z-10">
            <p className="text-[10px] text-emerald-100 opacity-90 tracking-widest font-mono">
              {isApplied ? '5061 1032 8821 4492' : '•••• •••• •••• 4492'}
            </p>
          </div>

          {/* Bottom row */}
          <div className="flex justify-between items-end z-10">
            <div>
              <p className="text-[8px] text-[#C1FFEB] font-bold uppercase tracking-wider leading-none">Virtual Card</p>
              <span className="text-[11px] font-bold font-sans mt-1 block tracking-wide uppercase">{userFullName}</span>
            </div>

            {/* Verve Logo with solid visual fidelity */}
            <div className="flex items-center gap-0.5 scale-95">
              <div className="w-4 h-4 bg-red-650 bg-red-600 rounded-full flex items-center justify-center leading-none text-[8.5px] font-black text-white border border-red-500 shadow-sm transform -rotate-12">
                V
              </div>
              <span className="text-[10.5px] font-bold tracking-tighter text-[#1C1F2B]">erve</span>
            </div>
          </div>
        </div>

        {/* Small center classification label */}
        <div className="flex justify-center mt-2.5">
          <span className="bg-[#EEFAF5] text-[#006E41] text-[9.5px] font-black px-2.5 py-0.5 rounded-full border border-[#D5F1E5]">
            OPay Verve Classic
          </span>
        </div>
      </div>

      {/* 3. Bullet feature list in white panel matching reference exactly */}
      <div className="px-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-3xs space-y-4">
          
          <div className="flex items-start gap-3 hover:scale-101 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#EBFCEE] text-[#00B875] flex items-center justify-center flex-shrink-0 border border-[#D1F7DC]">
              <Zap className="w-4.5 h-4.5 fill-current stroke-[2.2px]" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-800 leading-none">Instant Access</h4>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1 leading-normal">
                Use it instantly after <span className="text-[#00B875] font-black underline">quick application</span>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 hover:scale-101 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#EBFCEE] text-[#00B875] flex items-center justify-center flex-shrink-0 border border-[#D1F7DC]">
              <Globe className="w-4.5 h-4.5 stroke-[2.2px]" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-800 leading-none">Accepted at 40,000+ Online Merchants</h4>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1 leading-normal">
                Including <span className="text-[#00B875] font-black">GooglePlay, Netflix, Glovo, Shein, Jumia, Konga, Uber Wallet Funding</span>, and more
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 hover:scale-101 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#EBFCEE] text-[#00B875] flex items-center justify-center flex-shrink-0 border border-[#D1F7DC]">
              <Store className="w-4.5 h-4.5 stroke-[2.2px]" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-800 leading-none">Self-managed Transactions</h4>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1 leading-normal">
                <span className="text-[#00B875] font-black">Unique</span> Merchant Control, Unlimited Convenience
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 hover:scale-101 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#EBFCEE] text-[#00B875] flex items-center justify-center flex-shrink-0 border border-[#D1F7DC]">
              <Palette className="w-4.5 h-4.5 stroke-[2.2px]" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-800 leading-none">NO maintenance fee</h4>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1 leading-normal">
                Free & switch your <span className="text-[#00B875] font-black">favorite card design</span> anytime
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 hover:scale-101 transition-all">
            <div className="w-8 h-8 rounded-full bg-[#EBFCEE] text-[#00B875] flex items-center justify-center flex-shrink-0 border border-[#D1F7DC]">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[2.2px]" />
            </div>
            <div>
              <h4 className="text-[11px] font-black text-slate-800 leading-none">Safe & Secure</h4>
              <p className="text-[9.5px] text-slate-500 font-bold mt-1 leading-normal">
                <span className="text-[#00B875] font-black">CBN</span> licensed, <span className="text-[#00B875] font-black">NDIC</span> Insured
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Large Rounded bottom Pill Apply button */}
      <div className="px-5 pt-2">
        <button 
          onClick={handleApplyCard}
          disabled={isApplied}
          className={`w-full text-white font-black py-3.5 rounded-full text-center text-xs transition-all shadow-sm active:scale-98 select-none cursor-pointer uppercase ${
            isApplied 
              ? 'bg-[#12AB73] text-emerald-100 hover:bg-[#00B875]' 
              : 'bg-[#00B875] hover:bg-[#00a367]'
          }`}
        >
          {isApplied ? 'Disburse Wallet' : 'Get It Now'}
        </button>
      </div>

    </div>
  );
}
