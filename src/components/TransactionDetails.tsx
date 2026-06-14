/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Copy } from 'lucide-react';
import { Transaction } from '../types.ts';
import { renderBankLogo } from './TransferDrawer.tsx';
import ShareReceiptModal from './ShareReceiptModal.tsx';

interface TransactionDetailsProps {
  transaction: Transaction;
  userFullName?: string;
  userAccountNumber?: string;
  onBack: () => void;
  onShared?: () => void;
}

export default function TransactionDetails({ transaction, userFullName, userAccountNumber, onBack, onShared }: TransactionDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [copiedSession, setCopiedSession] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const isIncoming = transaction.amount > 0 || ['transfer_in', 'bonus', 'owealth_interest', 'deposit'].includes(transaction.type);
  const partnerName = (transaction.recipientName || transaction.title)
    .replace('Transfer to ', '')
    .replace('Received from ', '')
    .replace('Transfer from ', '')
    .replace('Payment to ', '')
    .replace('Bonus from ', '')
    .trim() || 'OPay User';

  const partnerBank = transaction.recipientBank || 'OPay';
  const partnerAccount = transaction.recipientAccount || '806 411 8223';
  const labelText = isIncoming ? 'Sender Details' : 'Recipient Details';
  const isBank = partnerBank.toLowerCase() !== 'opay' && 
                 !['bonus', 'owealth_interest'].includes(transaction.type) &&
                 transaction.type !== 'airtime';
  const isOPay = !isBank;

  // ── Bank logo color map (matching BankLogoComponent) ────────────────────────
  const getBankLogoStyle = (name: string): { bg: string; text: string } => {
    const n = name.toLowerCase();
    if (n.includes('moniepoint') || n.includes('monie point')) return { bg: '#2563EB', text: '#FFFFFF' };
    if (n.includes('access')) return { bg: '#000000', text: '#FF5500' };
    if (n.includes('uba') || n.includes('united bank')) return { bg: '#D32F2F', text: '#FFFFFF' };
    if (n.includes('first bank') || n.includes('firstbank')) return { bg: '#0b2545', text: '#EAB308' };
    if (n.includes('gtbank') || n.includes('guaranty') || n.includes('gtb')) return { bg: '#E65100', text: '#FFFFFF' };
    if (n.includes('zenith')) return { bg: '#FFFFFF', text: '#DC2626' };
    if (n.includes('kuda')) return { bg: '#400080', text: '#1BE0D0' };
    if (n.includes('palmpay')) return { bg: '#5E2B97', text: '#FFFFFF' };
    if (n.includes('wema')) return { bg: '#8A0F54', text: '#FFFFFF' };
    if (n.includes('stanbic')) return { bg: '#0033A0', text: '#FFFFFF' };
    if (n.includes('sterling')) return { bg: '#D32F2F', text: '#FFFFFF' };
    if (n.includes('fidelity')) return { bg: '#022c22', text: '#FFFFFF' };
    if (n.includes('fcmb')) return { bg: '#4F46E5', text: '#EAB308' };
    return { bg: '#334155', text: '#FFFFFF' };
  };

  // ── Logo renderer ──────────────────────────────────────────────────────────
  const renderFloatingLogo = () => {
    if (isOPay) {
      return (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center select-none z-20">
          <svg viewBox="0 0 100 100" className="w-8.5 h-8.5">
            <circle cx="50" cy="50" r="28" stroke="#00B875" strokeWidth="12.5" fill="none" />
            <rect x="14" y="45" width="18" height="10" fill="#130C52" rx="2" />
          </svg>
        </div>
      );
    }

    // Bank: white ring circle containing blue rounded-square with bank initial
    const { bg, text } = getBankLogoStyle(partnerBank);
    const initial = partnerBank.trim().charAt(0).toUpperCase();
    return (
      <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 select-none">
        {/* outer white ring */}
        <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
          {/* blue rounded-square inner icon */}
          <div
            className="w-10 h-10 rounded-[10px] flex items-center justify-center"
            style={{ backgroundColor: bg }}
          >
            <span className="font-black text-[22px] leading-none" style={{ color: text, fontFamily: 'system-ui, sans-serif' }}>{initial}</span>
          </div>
        </div>
      </div>
    );
  };

  const amountVal = Math.abs(transaction.amount);

  // derive date prefix from transaction date (e.g. 'Jun 11th, 2026' → '06-11')
  const datePfx = (() => {
    const months: Record<string, string> = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
    const m = transaction.date.match(/^(\w{3})\s+(\d+)/);
    if (m) return `${months[m[1]] || '06'}-${m[2].padStart(2,'0')}`;
    return '06-11';
  })();

  // 3-step progress timestamps for bank transfers
  const progressSteps = [
    { label: 'Payment\nsuccessful', time: `${datePfx} ${transaction.time}` },
    { label: 'Processing\nby bank',  time: `${datePfx} ${transaction.time}` },
    { label: 'Received\nby bank',    time: `${datePfx} 14:03:31` },
  ];

  return (
    <div className="flex flex-col h-full bg-[#F4F5F8] justify-between rounded-t-3xl sm:rounded-3xl overflow-hidden">
      
      {/* Top Navigation Bar */}
      <div className="bg-white px-5 py-4 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1 rounded-full text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer">
            <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
          </button>
          <span className="text-[17px] font-bold text-gray-950 tracking-tight font-sans">
            Transaction Details
          </span>
        </div>
        <button 
          type="button" 
          onClick={() => alert('Support ticket requested.')} 
          className="p-1.5 rounded-full text-[#00B875] hover:bg-emerald-50 transition-colors cursor-pointer"
        >
          <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 stroke-current fill-none stroke-[2]">
            <path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
            <path d="M17 10h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" />
            <path d="M7 10H6a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1" />
            <path d="M19 13v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-6" />
          </svg>
        </button>
      </div>

      {/* Scrollable Container */}
      <div className="px-4 py-2 space-y-4 flex-1 overflow-y-auto no-scrollbar flex flex-col">
        
        {/* Card 1: Transaction Summary Card */}
        <div className="relative bg-white rounded-[20px] pb-5 px-5 shadow-3xs border border-gray-100/50 text-center flex flex-col items-center mt-7" style={{ paddingTop: isBank ? '40px' : '36px' }}>
          
          {/* Floating Logo */}
          {renderFloatingLogo()}

          {/* Transaction Description */}
          <span className="text-[15px] text-gray-950 font-bold font-sans leading-snug px-2 mt-0">
            {isIncoming ? 'Transfer from' : 'Transfer to'} {partnerName.toUpperCase()}
          </span>
          
          {/* Amount Display */}
          <span className="text-[34px] font-black text-gray-950 tracking-tight leading-none mt-3 font-sans">
            ₦{amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>

          {/* Transaction Status – plain green text */}
          <span className="text-[#00B875] font-bold text-[14px] font-sans mt-2">Successful</span>

          {/* Bank Transfer: 3-step progress tracker */}
          {isBank && (
            <>
              {/* Row: circles + lines */}
              <div className="w-full mt-5 flex items-center px-1">
                {progressSteps.map((_, idx) => (
                  <React.Fragment key={idx}>
                    <div className="w-7 h-7 rounded-full bg-[#00B875] flex items-center justify-center shrink-0 shadow-sm z-10">
                      <svg className="w-[13px] h-[13px] fill-none stroke-white stroke-[3]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    {idx < 2 && <div className="flex-1 h-[2px] bg-[#00B875]" />}
                  </React.Fragment>
                ))}
              </div>

              {/* Row: labels + timestamps — equal thirds */}
              <div className="w-full mt-2 flex">
                {progressSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col font-sans"
                    style={{
                      width: '33.333%',
                      alignItems: idx === 0 ? 'flex-start' : idx === 2 ? 'flex-end' : 'center',
                      textAlign: idx === 0 ? 'left' : idx === 2 ? 'right' : 'center',
                    }}
                  >
                    <span className="text-[11.5px] text-gray-700 font-semibold leading-[1.3] whitespace-pre-line">{step.label}</span>
                    <span className="text-[10.5px] text-gray-400 font-medium mt-0.5">{step.time}</span>
                  </div>
                ))}
              </div>

              {/* Credit note */}
              <div className="w-full mt-4 bg-[#F4F5F8] rounded-xl px-3.5 py-3">
                <p className="text-[11.5px] text-gray-500 font-sans leading-relaxed text-left">
                  The recipient account is expected to be credited within 5 minutes, subject to notification by the bank.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Card 2: Transaction Details Card */}
        <div className="bg-white rounded-[20px] p-4.5 shadow-3xs border border-gray-100/50">
          <h3 className="text-gray-900 font-bold text-sm mb-3.5 font-sans">Transaction Details</h3>
          
          <div className="space-y-4">
            {/* Recipient/Sender Details */}
            <div className="flex justify-between items-start text-[13px]">
              <span className="text-gray-400 font-medium font-sans shrink-0 mr-3">{labelText}</span>
              <div className="text-right">
                <div className="font-bold text-gray-950 uppercase font-sans leading-tight">
                  {partnerName}
                </div>
                <div className="text-[10.5px] text-gray-400 font-bold mt-1 uppercase font-sans">
                  {partnerBank} | {partnerAccount}
                </div>
              </div>
            </div>

            {/* Transaction No. */}
            <div className="flex justify-between items-center text-[13px] pt-1">
              <span className="text-gray-400 font-medium font-sans shrink-0 mr-3">Transaction No.</span>
              <div className="flex items-center gap-1.5 font-sans relative">
                <span className="font-bold text-gray-950 font-mono text-xs">
                  {transaction.transactionNo}
                </span>
                <button 
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(transaction.transactionNo);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                {copied && (
                  <span className="absolute -top-7 right-0 bg-gray-950 text-white text-[10px] py-1 px-2 rounded-lg shadow-md font-sans font-bold transition-all animate-in fade-in zoom-in duration-200">
                    Copied!
                  </span>
                )}
              </div>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center text-[13px] pt-1">
              <span className="text-gray-400 font-medium font-sans">Payment Method</span>
              <button 
                type="button"
                onClick={() => alert(`Payment Method: ${transaction.paymentMethod || 'Wallet'}`)}
                className="flex items-center gap-0.5 font-bold text-gray-950 font-sans hover:text-[#00B875] transition-colors cursor-pointer"
              >
                <span>{transaction.paymentMethod === 'OWealth Interest' || transaction.paymentMethod === 'OWealth' ? 'OWealth' : 'Wallet'}</span>
                <ChevronRight className="w-4 h-4 text-gray-400 stroke-[2.5]" />
              </button>
            </div>

            {/* Transaction Date */}
            <div className="flex justify-between items-center text-[13px] pt-1">
              <span className="text-gray-400 font-medium font-sans">Transaction Date</span>
              <span className="font-bold text-gray-950 font-sans">
                {transaction.date} {transaction.time}
              </span>
            </div>

            {/* Session ID – only for bank transfers */}
            {isBank && transaction.sessionId && (
              <div className="flex justify-between items-center text-[13px] pt-1">
                <span className="text-gray-400 font-medium font-sans shrink-0 mr-3">Session ID</span>
                <div className="flex items-center gap-1.5 font-sans relative">
                  <span className="font-bold text-gray-950 font-mono text-xs break-all text-right">
                    {transaction.sessionId}
                  </span>
                  <button 
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(transaction.sessionId!);
                      setCopiedSession(true);
                      setTimeout(() => setCopiedSession(false), 2000);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer shrink-0"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {copiedSession && (
                    <span className="absolute -top-7 right-0 bg-gray-950 text-white text-[10px] py-1 px-2 rounded-lg shadow-md font-sans font-bold transition-all animate-in fade-in zoom-in duration-200">
                      Copied!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: More Actions Card */}
        <div className="bg-white rounded-[20px] p-4.5 shadow-3xs border border-gray-100/50">
          <h3 className="text-gray-900 font-bold text-sm mb-3.5 font-sans">More Actions</h3>
          
          <div className={`${isBank ? '' : 'grid grid-cols-2 gap-4'}`}>
            {/* Transfer Again */}
            <button
              type="button"
              onClick={() => {
                alert('Initiating new transfer...');
              }}
              className="flex items-center gap-2 text-[#00B875] hover:opacity-85 transition-opacity text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#E2F7EE] flex items-center justify-center shrink-0">
                <svg className="w-3.5 h-3.5 stroke-[#00B875] fill-none stroke-[2.5]" viewBox="0 0 24 24">
                  <path d="M17 1l4 4-4 4" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" />
                  <path d="M7 23l-4-4 4-4" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" />
                </svg>
              </div>
              <span className="text-[13px] font-bold font-sans">Transfer Again</span>
            </button>

            {/* View Records – only shown for OPay/non-bank */}
            {!isBank && (
              <button
                type="button"
                onClick={() => {
                  onBack();
                  window.dispatchEvent(new CustomEvent('view-transactions-records'));
                }}
                className="flex items-center gap-2 text-[#00B875] hover:opacity-85 transition-opacity text-left cursor-pointer"
              >
                <div className="w-7 h-7 rounded-full bg-[#E2F7EE] flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5 stroke-[#00B875] fill-none stroke-[2.5]" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                </div>
                <span className="text-[13px] font-bold font-sans">View Records</span>
              </button>
            )}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-[50px] bg-transparent" />

      </div>

      {/* Fixed Bottom Action Area */}
      <div className="px-5 pb-6 pt-2.5 flex gap-4 select-none shrink-0 bg-[#F4F5F8]">
        <button
          type="button"
          onClick={() => alert('Support ticket opened with priority ID #OP-' + transaction.id.slice(-6))}
          className="flex-1 bg-[#E2F7EE] text-[#00B875] font-bold py-3.5 rounded-full text-center text-sm hover:opacity-90 cursor-pointer transition-all font-sans"
        >
          Report Issue
        </button>
        <button
          type="button"
          onClick={() => {
            setIsShareOpen(true);
            if (onShared) onShared();
          }}
          className="flex-1 bg-[#00B875] text-white font-bold py-3.5 rounded-full text-center text-sm hover:bg-[#00a367] cursor-pointer transition-all shadow-md font-sans"
        >
          Share Receipt
        </button>
      </div>

      <ShareReceiptModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        userFullName={userFullName}
        userAccountNumber={userAccountNumber}
        transaction={{
          ...transaction,
          recipientName: partnerName
        }} 
      />
    </div>
  );
}
