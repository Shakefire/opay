/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Copy, Mail, MessageSquare, Download, Check, Share2, AlertCircle } from 'lucide-react';
import { Transaction } from '../types.ts';
import AuthenticReceipt from './AuthenticReceipt.tsx';

interface ShareReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  userFullName?: string;
  userAccountNumber?: string;
  transaction: Partial<Transaction> & {
    title: string;
    amount: number;
    recipientName?: string;
    recipientBank?: string;
    recipientAccount?: string;
    transactionNo: string;
    date: string;
    time: string;
    status: string;
    paymentMethod?: string;
  };
}

export default function ShareReceiptModal({ isOpen, onClose, userFullName, userAccountNumber, transaction }: ShareReceiptModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  if (!isOpen) return null;

  // Normalize details
  const recBank = transaction.recipientBank || 'OPay';
  const recName = transaction.recipientName || transaction.title.replace('Transfer to ', '') || 'Beneficiary';
  const recAccount = transaction.recipientAccount || '9012345678';
  const txNo = transaction.transactionNo || 'TX' + Math.floor(Math.random() * 10000000000);
  const dateStr = transaction.date || 'Jun 11, 2026';
  const timeStr = transaction.time || '17:45:12';
  const amountVal = Math.abs(transaction.amount || 0);
  const payMethod = transaction.paymentMethod || 'Balance';
  const statusStr = transaction.status || 'Successful';

  const finalType = transaction.type || (amountVal > 0 ? "transfer_in" : "transfer_out");
  const isIncoming = amountVal > 0 || ['transfer_in', 'bonus', 'owealth_interest', 'deposit'].includes(finalType);
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

  const cleanedTitleName = cleanTitle(transaction.title || '');

  // Resolve recipient & sender details
  let displayRecipientName = "";
  let displayRecipientBank = "";
  let displayRecipientAccount = "";

  let displaySenderName = "";
  let displaySenderBank = "";
  let displaySenderAccount = "";

  if (isIncoming) {
    // Incoming transaction: RECEIVER is the user
    displayRecipientName = activeUserFullName;
    displayRecipientBank = "OPay";
    displayRecipientAccount = activeUserAccountNumber;

    // SENDER is the source
    if (finalType === 'bonus') {
      displaySenderName = "OPay Promotional Bonus";
      displaySenderBank = "OPay Cashback";
      displaySenderAccount = "Rewards Wallet";
    } else if (finalType === 'owealth_interest') {
      displaySenderName = "OWealth Daily Payout";
      displaySenderBank = "OWealth";
      displaySenderAccount = "Investment Savings";
    } else if (finalType === 'deposit') {
      displaySenderName = cleanedTitleName || "Card Deposit Top-up";
      displaySenderBank = recBank;
      displaySenderAccount = recAccount;
    } else {
      // transfer_in
      displaySenderName = cleanedTitleName || recName || "OPay Sender";
      displaySenderBank = recBank;
      displaySenderAccount = recAccount;
    }
  } else {
    // Outgoing transaction: SENDER is the user
    displaySenderName = activeUserFullName;
    displaySenderBank = "OPay";
    displaySenderAccount = activeUserAccountNumber;

    // RECEIVER is the beneficiary
    if (finalType === 'airtime') {
      displayRecipientName = cleanedTitleName || recName || "MTN Airtime Top-up";
      displayRecipientBank = recBank;
      displayRecipientAccount = recAccount;
    } else {
      // transfer_out
      displayRecipientName = recName || cleanedTitleName || "Beneficiary";
      displayRecipientBank = recBank;
      displayRecipientAccount = recAccount;
    }
  }

  // Apply masking only to user's account number for display
  if (isIncoming) {
    // User is the recipient - mask recipient account only
    displayRecipientAccount = maskAccountNumber(displayRecipientAccount);
  } else {
    // User is the sender - mask sender account only
    displaySenderAccount = maskAccountNumber(displaySenderAccount);
  }

  const shareText = `OPay Transaction Receipt:\n` +
    `Status: ${statusStr}\n` +
    `Amount: ₦${amountVal.toLocaleString(undefined, { minimumFractionDigits: 2 })}\n` +
    `Recipient: ${displayRecipientName} (${displayRecipientBank} | ${displayRecipientAccount})\n` +
    `Sender: ${displaySenderName} (${displaySenderBank} | ${displaySenderAccount})\n` +
    `Date: ${dateStr} ${timeStr}\n` +
    `Ref: ${txNo}\n\n` +
    `Powered by OPay Secure Network.`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleShareTelegram = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://t.me/share/url?url=${encodeURIComponent('https://opayweb.com')}&text=${encoded}`, '_blank');
  };

  const handleShareX = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://twitter.com/intent/tweet?text=${encoded}`, '_blank');
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent(`OPay Transaction Receipt - ${txNo}`);
    const body = encodeURIComponent(shareText);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const handleShareSMS = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`sms:?body=${encoded}`);
  };

  // Triggers professional Canvas high-fidelity payment receipt drawing matching screenshots 1 & 2
  const handleDownload = () => {
    setDownloading(true);
    setDownloadSuccess(false);

    setTimeout(() => {
      try {
        const canvas = canvasRef.current;
        if (!canvas) {
          throw new Error('Canvas ref not found');
        }

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        const isOPay = recBank.toLowerCase().includes('opay');
        const sessionVal = isOPay ? undefined : (transaction.transactionNo ? "1000" + transaction.transactionNo.replace(/\D/g, '') + "5841029312" : "100004260611170358162354773910");

        // Set high-res dimensions
        canvas.width = 620;
        canvas.height = isOPay ? 720 : 780;

        const cardX = 30;
        const cardY = 30;
        const cardW = canvas.width - (cardX * 2); // 560
        const cardH = canvas.height - (cardY * 2); // 660 or 720

        // Fill background with elegant soft grey
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw solid White paper sheet
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(cardX, cardY, cardW, cardH);

        // --- DRAW WATERMARK PRECISELY ---
        ctx.save();
        ctx.globalAlpha = 0.035;
        ctx.fillStyle = '#00B875';
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-22 * Math.PI / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);
        
        ctx.font = '900 18px system-ui, -apple-system, sans-serif';
        for (let x = -300; x < canvas.width + 300; x += 140) {
          for (let y = -300; y < canvas.height + 300; y += 120) {
            // Draw circle ring
            ctx.beginPath();
            ctx.arc(x, y - 6, 8, 0, Math.PI * 2);
            ctx.strokeStyle = '#00B875';
            ctx.lineWidth = 2.5;
            ctx.stroke();
            // Draw circle's inner bar
            ctx.fillStyle = '#00B875';
            ctx.fillRect(x + 4, y - 7, 5, 3);
            ctx.fillText('OPay', x + 15, y);
          }
        }
        ctx.restore();

        // --- DRAW TOP & BOTTOM BITE PERFORATIONS ---
        ctx.fillStyle = '#F1F5F9'; // Matches background
        const numCircles = 26;
        for (let i = 0; i < numCircles; i++) {
          const cx = cardX + (cardW / (numCircles - 1)) * i;
          
          // Top bite
          ctx.beginPath();
          ctx.arc(cx, cardY, 6, 0, Math.PI * 2);
          ctx.fill();

          // Bottom bite
          ctx.beginPath();
          ctx.arc(cx, cardY + cardH, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // --- HEADER SECTION (Logo & Title) ---
        // Draw Authentic OPay Brand Logo Icon on Canvas
        const logoX = cardX + 35;
        const logoY = cardY + 50;

        ctx.beginPath();
        ctx.arc(logoX + 16, logoY + 16, 10.5, 0, Math.PI * 2);
        ctx.strokeStyle = '#00B875';
        ctx.lineWidth = 4.2;
        ctx.stroke();

        // White out gap
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(logoX + 16 + 5, logoY + 16 - 5, 8, 10);

        // Green inner bar
        ctx.fillStyle = '#00B875';
        ctx.fillRect(logoX + 16 + 2, logoY + 16 - 2.1, 8.5, 4.2);

        // Brand Text "Pay"
        ctx.fillStyle = '#130C52';
        ctx.font = '900 25.5px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('Pay', logoX + 35, logoY + 24);

        // Transaction Receipt label
        ctx.fillStyle = '#475569';
        ctx.font = '500 15px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText('Transaction Receipt', cardX + cardW - 35, logoY + 23);

        // --- CENTER HIGHLIGHTS ---
        const midX = canvas.width / 2;

        // Divider solid thin line under header
        ctx.strokeStyle = '#E2E8F0';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cardX + 35, cardY + 95);
        ctx.lineTo(cardX + cardW - 35, cardY + 95);
        ctx.stroke();

        // Amount Display (Naira Green)
        ctx.fillStyle = '#00B875';
        ctx.font = '900 34px system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`₦${amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, midX, cardY + 148);

        // Successful string status text
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 18px system-ui, -apple-system, sans-serif';
        ctx.fillText(statusStr, midX, cardY + 178);

        // Date & Time
        ctx.fillStyle = '#94A3B8';
        ctx.font = '500 11.5px monospace';
        ctx.fillText(`${dateStr} ${timeStr}`, midX, cardY + 198);

        // Divider solid thin line
        ctx.strokeStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.moveTo(cardX + 35, cardY + 215);
        ctx.lineTo(cardX + cardW - 35, cardY + 215);
        ctx.stroke();

        // --- GRID DETAILS FIELD ROWS ---
        let runningY = cardY + 250;

        const drawGridRow = (label: string, valLine1: string, valLine2?: string, isMono = false) => {
          ctx.textAlign = 'left';
          ctx.fillStyle = '#94A3B8';
          ctx.font = '500 13px system-ui, -apple-system, sans-serif';
          ctx.fillText(label, cardX + 35, runningY);

          ctx.textAlign = 'right';
          // Label Line 1
          ctx.fillStyle = '#0F172A';
          ctx.font = isMono ? 'bold 11.5px monospace' : '900 13.5px system-ui, -apple-system, sans-serif';
          ctx.fillText(valLine1.toUpperCase(), cardX + cardW - 35, runningY);

          if (valLine2) {
            runningY += 18;
            ctx.fillStyle = '#64748B';
            ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
            ctx.fillText(valLine2.toUpperCase(), cardX + cardW - 35, runningY);
          }

          runningY += 38;
        };

        // Recipient details
        drawGridRow('Recipient Details', displayRecipientName, `${displayRecipientBank} | ${displayRecipientAccount}`);
        
        // Sender details
        drawGridRow('Sender Details', displaySenderName, `${displaySenderBank} | ${displaySenderAccount}`);

        // Transaction number
        drawGridRow('Transaction No.', txNo, undefined, true);

        // Session ID (Only for non-OPay bank transfer)
        if (sessionVal) {
          drawGridRow('Session ID', sessionVal, undefined, true);
        }

        // --- FOOTER SECTION ---
        // Divider solid thin line above footer
        ctx.strokeStyle = '#E2E8F0';
        ctx.beginPath();
        ctx.moveTo(cardX + 35, cardY + cardH - 110);
        ctx.lineTo(cardX + cardW - 35, cardY + cardH - 110);
        ctx.stroke();

        ctx.textAlign = 'center';
        ctx.fillStyle = '#94A3B8';
        ctx.font = '500 10.5px system-ui, -apple-system, sans-serif';
        
        // CBN License wrapped text lines precisely matching screenshots
        const footerLine1 = "Enjoy a better life with OPay. Get free transfers, withdrawals, bill payments,";
        const footerLine2 = "instant loans, and good annual interest On your savings. OPay is licensed by the";
        const footerLine3 = "Central Bank of Nigeria and insured by the NDIC.";

        ctx.fillText(footerLine1, midX, cardY + cardH - 80);
        ctx.fillText(footerLine2, midX, cardY + cardH - 64);
        ctx.fillText(footerLine3, midX, cardY + cardH - 48);

        // --- FILE DOWNLOAD INITIATOR ---
        const link = document.createElement('a');
        link.download = `OPay_Receipt_${txNo}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();

        setDownloading(false);
        setDownloadSuccess(true);
        setTimeout(() => setDownloadSuccess(false), 3000);
      } catch (err) {
        console.error(err);
        alert('Download error occurred: ' + (err as Error).message);
        setDownloading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dim backdrop background */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Share dialog layout */}
      <div className="relative bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col">
        
        {/* Hidden Canvas utility helper for offline physical receipts generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Header container */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#00B875]" />
            <h3 className="font-black text-gray-900 text-base font-sans tracking-tight">Share Receipt</h3>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="p-1 px-1.5 rounded-full text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Modal body options list */}
        <div className="p-6">
          
          {/* Authentic Receipt visual pre-rendering scroll preview */}
          <div className="max-h-[340px] overflow-y-auto mb-6 rounded-2xl bg-[#EAEDF1] p-3.5 border border-slate-200 shadow-inner">
            <AuthenticReceipt
              transaction={transaction}
              userFullName={userFullName}
              userAccountNumber={userAccountNumber}
              backdropBg="#EAEDF1"
            />
          </div>

          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest block mb-4">Share Receipt details via</h4>

          {/* Share Grid platforms list exact targets */}
          <div className="grid grid-cols-4 gap-x-3 gap-y-5 text-center select-none pb-6 border-b border-slate-100">
            {/* WhatsApp */}
            <button 
              type="button"
              onClick={handleShareWhatsApp}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center group-hover:scale-105 transition-all outline-hidden">
                <MessageSquare className="w-5 h-5 fill-[#25D366] stroke-[1]" />
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-1.5 font-sans leading-none">WhatsApp</span>
            </button>

            {/* Telegram */}
            <button 
              type="button"
              onClick={handleShareTelegram}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-[#0088cc]/10 text-[#0088cc] flex items-center justify-center group-hover:scale-105 transition-all outline-hidden">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.19-.04-.27-.02-.12.02-1.96 1.24-5.54 3.65-.52.36-.97.54-1.34.53-.41-.01-1.2-.23-1.79-.42-.72-.24-1.3-.37-1.25-.78.03-.21.32-.43.88-.65 3.44-1.5 5.73-2.49 6.88-2.98 3.28-1.37 3.96-1.61 4.41-1.61.1 0 .32.02.46.14.12.1.15.24.16.34.01.07.02.22.01.27z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-1.5 font-sans leading-none">Telegram</span>
            </button>

            {/* X / Twitter */}
            <button 
              type="button"
              onClick={handleShareX}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-slate-900/10 text-slate-900 flex items-center justify-center group-hover:scale-105 transition-all outline-hidden">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current stroke-none">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-1.5 font-sans leading-none">X</span>
            </button>

            {/* Email */}
            <button 
              type="button"
              onClick={handleShareEmail}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-all outline-hidden">
                <Mail className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-1.5 font-sans leading-none">Email</span>
            </button>

            {/* SMS */}
            <button 
              type="button"
              onClick={handleShareSMS}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-all outline-hidden">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-1.5 font-sans leading-none">SMS</span>
            </button>

            {/* Copy details */}
            <button 
              type="button"
              onClick={handleCopyText}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#00B875] flex items-center justify-center group-hover:scale-105 transition-all outline-hidden relative">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
              <span className="text-[10px] text-slate-600 font-bold block mt-1.5 font-sans leading-none">
                {copied ? 'Copied!' : 'Copy Text'}
              </span>
            </button>
          </div>

          {/* Master Highlight Action: DOWNLOAD RECEIPT IMAGE */}
          <div className="pt-6">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading}
              className={`w-full py-4 rounded-2xl font-black text-center text-sm outline-hidden cursor-pointer transition-all flex items-center justify-center gap-2 shadow-md ${
                downloading 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#00B875] text-white hover:bg-[#00a367]'
              }`}
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating image receipt...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  <span>Download High-Res Receipt</span>
                </>
              )}
            </button>
            <div className="mt-3.5 flex items-center gap-2 justify-center text-[10.5px] text-slate-450 font-bold">
              <Check className="w-4 h-4 text-[#00B875]" />
              <span>Offline generator saves directly as crisp HD photo.</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
