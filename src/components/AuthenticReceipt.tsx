/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Transaction } from '../types.ts';

interface AuthenticReceiptProps {
  // Optional transaction object for automatic high-fidelity extraction
  transaction?: Partial<Transaction> | Transaction;
  userFullName?: string;
  userAccountNumber?: string;

  // Individual parameters (as overrides or fallback)
  amount?: number;
  dateStr?: string;   // e.g. "Jun 11th, 2026"
  timeStr?: string;   // e.g. "18:03:43"
  statusStr?: string; // default "Successful"
  
  recipientName?: string;
  recipientBank?: string;
  recipientAccount?: string;

  senderName?: string;
  senderBank?: string;
  senderAccount?: string;

  transactionNo?: string;
  sessionId?: string; // If empty and bank is NOT OPay, we auto-generate
  
  backdropBg?: string; // matches inner scallop viewport
  transactionType?: 'airtime' | 'bonus' | 'transfer_out' | 'transfer_in' | 'owealth_interest' | 'deposit';
  transactionTitle?: string;
}

export default function AuthenticReceipt({
  transaction,
  userFullName,
  userAccountNumber,
  amount,
  dateStr,
  timeStr,
  statusStr,
  recipientName,
  recipientBank,
  recipientAccount,
  senderName,
  senderBank,
  senderAccount,
  transactionNo,
  sessionId,
  backdropBg = "#F1F5F9",
  transactionType,
  transactionTitle
}: AuthenticReceiptProps) {

  // 1. Resolve core variables from either transaction or primitive overrides
  const tx = transaction || {};
  const finalAmount = amount !== undefined ? amount : (tx.amount || 0);
  const finalDateStr = dateStr || tx.date || "Jun 11th, 2026";
  const finalTimeStr = timeStr || tx.time || "18:03:43";
  const finalStatusStr = statusStr || tx.status || "Successful";
  const finalTxNo = transactionNo || tx.transactionNo || "260611020100311332774459";
  const finalType = transactionType || tx.type || (finalAmount > 0 ? "transfer_in" : "transfer_out");

  const amountVal = Math.abs(finalAmount);
  const isIncoming = finalAmount > 0 || ['transfer_in', 'bonus', 'owealth_interest', 'deposit'].includes(finalType);

  // Dynamic user name from context (defaulting to the specified full name)
  const activeUserFullName = (userFullName || "KABIR HASSAN MUHAMMAD").toUpperCase();
  const activeUserAccountNumber = userAccountNumber || "912****904";

  // Mask account number for display (e.g., "9123456789" -> "912****6789")
  const maskAccountNumber = (account: string): string => {
    if (!account) return "912****904";
    // If already masked, return as is
    if (account.includes('****')) return account;
    // If only digits, mask middle portion
    if (/^\d+$/.test(account)) {
      if (account.length >= 10) {
        return account.slice(0, 3) + '****' + account.slice(-4);
      }
      return account;
    }
    // Return as is if mixed format
    return account;
  };

  // Clean title prefixes
  const cleanTitle = (rawTitle: string): string => {
    if (!rawTitle) return '';
    let result = rawTitle;
    const prefixes = [
      /^Received from\s+/i,
      /^Transfer from\s+/i,
      /^Transfer to\s+/i,
      /^Payment to\s+/i,
      /^Bonus from\s+/i
    ];
    for (const prefix of prefixes) {
      result = result.replace(prefix, '');
    }
    return result.trim();
  };

  const rawTitle = tx.title || transactionTitle || '';
  const cleanedTitleName = cleanTitle(rawTitle);

  // Resolve recipient & sender details
  let fRecipientName = "";
  let fRecipientBank = "";
  let fRecipientAccount = "";

  let fSenderName = "";
  let fSenderBank = "";
  let fSenderAccount = "";

  if (isIncoming) {
    // Incoming transaction: RECEIVER is the user
    fRecipientName = activeUserFullName;
    fRecipientBank = "OPay";
    fRecipientAccount = activeUserAccountNumber;

    // SENDER is the source
    if (finalType === 'bonus') {
      fSenderName = "OPay Promotional Bonus";
      fSenderBank = "OPay Cashback";
      fSenderAccount = "Rewards Wallet";
    } else if (finalType === 'owealth_interest') {
      fSenderName = "OWealth Daily Payout";
      fSenderBank = "OWealth";
      fSenderAccount = "Investment Savings";
    } else if (finalType === 'deposit') {
      fSenderName = cleanedTitleName || "Card Deposit Top-up";
      fSenderBank = recipientBank || tx.recipientBank || "Access Bank";
      fSenderAccount = recipientAccount || tx.recipientAccount || "•••• •••• •••• 4492";
    } else {
      // transfer_in
      fSenderName = cleanedTitleName || recipientName || "OPay Sender";
      fSenderBank = recipientBank || tx.recipientBank || "OPay";
      fSenderAccount = recipientAccount || tx.recipientAccount || "901****882";
    }
  } else {
    // Outgoing transaction: SENDER is the user
    fSenderName = activeUserFullName;
    fSenderBank = "OPay";
    fSenderAccount = activeUserAccountNumber;

    // RECEIVER is the beneficiary
    if (finalType === 'airtime') {
      fRecipientName = cleanedTitleName || recipientName || "MTN Airtime Top-up";
      fRecipientBank = recipientBank || tx.recipientBank || "MTN Network";
      fRecipientAccount = recipientAccount || tx.recipientAccount || "081****388";
    } else {
      // transfer_out / transfers
      fRecipientName = recipientName || cleanedTitleName || "Beneficiary";
      fRecipientBank = recipientBank || tx.recipientBank || "OPay";
      fRecipientAccount = recipientAccount || tx.recipientAccount || "9012345678";
    }
  }

  // Override directly with explicit overrides if provided
  if (recipientName && !tx.title) fRecipientName = recipientName;
  if (recipientBank && !tx.recipientBank) fRecipientBank = recipientBank;
  if (recipientAccount && !tx.recipientAccount) fRecipientAccount = recipientAccount;
  if (senderName) fSenderName = senderName;
  if (senderBank) fSenderBank = senderBank;
  if (senderAccount) fSenderAccount = senderAccount;

  // Apply masking only to user's account number for display
  if (isIncoming) {
    // User is the recipient - mask recipient account only
    fRecipientAccount = maskAccountNumber(fRecipientAccount);
  } else {
    // User is the sender - mask sender account only
    fSenderAccount = maskAccountNumber(fSenderAccount);
  }

  const isOPayTransfer = fRecipientBank.toLowerCase().includes('opay');

  // Auto generate an authentic session ID if none provided and bank is not OPay
  const finalSessionId = sessionId || (
    isOPayTransfer 
      ? undefined 
      : (finalTxNo ? "1000" + finalTxNo.replace(/\D/g, '') + "5841029312" : "100004260611170358162354773910")
  );

  return (
    <div 
      className="relative bg-white w-full rounded-2xl p-6 md:p-8 select-none shadow-xs border border-slate-100 overflow-hidden flex flex-col pt-9 pb-9"
      style={{ minHeight: '440px' }}
    >
      {/* Top Perforated Serrated Scallop Cutouts (Bite holes) */}
      <div className="absolute top-[-6px] left-0 right-0 flex justify-between px-1 pointer-events-none select-none z-20">
        {Array.from({ length: 26 }).map((_, i) => (
          <div 
            key={`top-perf-${i}`} 
            className="w-3 h-3 rounded-full shrink-0" 
            style={{ backgroundColor: backdropBg }} 
          />
        ))}
      </div>

      {/* Bottom Perforated Serrated Scallop Cutouts (Bite holes) */}
      <div className="absolute bottom-[-6px] left-0 right-0 flex justify-between px-1 pointer-events-none select-none z-20">
        {Array.from({ length: 26 }).map((_, i) => (
          <div 
            key={`bot-perf-${i}`} 
            className="w-3 h-3 rounded-full shrink-0" 
            style={{ backgroundColor: backdropBg }} 
          />
        ))}
      </div>

      {/* High Fidelity Repeating Diagonal OPay Brand Watermark Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none select-none z-0" 
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><g transform='rotate(-22 75 75)' fill='%2300B875'><circle cx='20' cy='75' r='8' stroke='%2300B875' stroke-width='2.5' fill='none'/><rect x='24' y='73' width='6' height='4' fill='white'/><rect x='22' y='73.5' width='6' height='3' fill='%2300B875'/><text x='34' y='82' font-family='system-ui, sans-serif' font-weight='900' font-size='19' letter-spacing='-1'>OPay</text></g></svg>")`,
          backgroundRepeat: 'repeat'
        }} 
      />

      <div className="relative z-10 flex flex-col h-full justify-between">
        {/* Header Block: Logo Left, Title Right */}
        <div className="flex justify-between items-center pb-5 border-b border-slate-100 mb-6">
          {/* Authentic OPay Brand Logo Icon */}
          <div className="flex items-center">
            <svg viewBox="0 0 115 32" className="h-8 select-none pointer-events-none">
              <circle cx="16" cy="16" r="10.5" stroke="#00B875" stroke-width="4.2" fill="none" />
              <rect x="23" y="11.5" width="8" height="9" fill="#FFFFFF" />
              <rect x="20.5" y="13.9" width="8.5" height="4.2" fill="#00B875" rx="1" />
              <text x="35" y="24" fill="#130C52" font-family="'Inter', system-ui, sans-serif" font-weight="900" font-size="25.5px" letter-spacing="-1.2">Pay</text>
            </svg>
          </div>
          
          <span className="text-[14px] font-sans text-slate-700 tracking-tight font-medium">
            Transaction Receipt
          </span>
        </div>

        {/* Core Transaction Highlights: Amount, Status & Time */}
        <div className="flex flex-col items-center text-center mb-6">
          <span className="text-[34px] font-black text-[#00B875] tracking-tight leading-none mb-2 font-sans font-extrabold">
            ₦{amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[18px] font-bold text-slate-900 tracking-tight mb-1 font-sans">
            {finalStatusStr}
          </span>
          <span className="text-[11.5px] font-mono text-slate-400 font-medium">
            {finalDateStr} {finalTimeStr}
          </span>
        </div>

        {/* Divider line already rendered as border bottom or top of rows */}
        <div className="my-1 border-t border-slate-100"></div>

        {/* Receipt Key-Value Rows */}
        <div className="space-y-4 py-4">
          
          {/* Recipient details */}
          <div className="flex justify-between items-start text-xs md:text-sm">
            <span className="text-slate-400 font-medium font-sans">Recipient Details</span>
            <div className="text-right">
              <div className="font-extrabold text-slate-900 uppercase font-sans tracking-tight">
                {fRecipientName}
              </div>
              <div className="text-[11px] text-slate-500 font-bold mt-0.5 uppercase tracking-tight font-sans">
                {fRecipientBank} | {fRecipientAccount}
              </div>
            </div>
          </div>

          {/* Sender details */}
          <div className="flex justify-between items-start text-xs md:text-sm">
            <span className="text-slate-400 font-medium font-sans">Sender Details</span>
            <div className="text-right">
              <div className="font-extrabold text-slate-900 uppercase font-sans tracking-tight">
                {fSenderName}
              </div>
              <div className="text-[11px] text-slate-500 font-bold mt-0.5 uppercase tracking-tight font-sans">
                {fSenderBank} | {fSenderAccount}
              </div>
            </div>
          </div>

          {/* Transaction number */}
          <div className="flex justify-between items-start text-xs md:text-sm">
            <span className="text-slate-400 font-medium font-sans animate-none">Transaction No.</span>
            <span className="text-right font-bold text-slate-700 font-mono text-xs tracking-tight">
              {finalTxNo}
            </span>
          </div>

          {/* Conditional Session ID: Only for Bank transfers */}
          {!isOPayTransfer && finalSessionId && (
            <div className="flex justify-between items-start text-xs md:text-sm">
              <span className="text-slate-400 font-medium font-sans">Session ID</span>
              <span className="text-right font-bold text-slate-700 font-mono text-xs tracking-tight break-all max-w-[190px] leading-tight">
                {finalSessionId}
              </span>
            </div>
          )}

        </div>

        {/* Footer with legal terms & licensed notice text */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col items-center">
          <p className="text-center text-[10.5px] leading-relaxed text-slate-400/90 font-medium font-sans max-w-sm">
            Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments, instant loans, and good annual interest On your savings. OPay is licensed by the Central Bank of Nigeria and insured by the NDIC.
          </p>
        </div>

      </div>
    </div>
  );
}
