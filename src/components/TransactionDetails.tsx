/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, FileText, Share2, Shield, X } from 'lucide-react';
import { Transaction } from '../types.ts';
import { renderBankLogo } from './TransferDrawer.tsx';
import ShareReceiptModal from './ShareReceiptModal.tsx';
import AuthenticReceipt from './AuthenticReceipt.tsx';

interface TransactionDetailsProps {
  transaction: Transaction;
  userFullName?: string;
  userAccountNumber?: string;
  onBack: () => void;
  onShared?: () => void;
}

export default function TransactionDetails({ transaction, userFullName, userAccountNumber, onBack, onShared }: TransactionDetailsProps) {
  const [copied, setCopied] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCopyNo = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getLogos = () => {
    switch (transaction.type) {
      case 'airtime':
        return (
          <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
            MTN
          </div>
        );
      case 'bonus':
        return (
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center shadow-md">
            🎁
          </div>
        );
      case 'owealth_interest':
        return (
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg shadow-md">
            %
          </div>
        );
      case 'transfer_out':
      case 'transfer_in':
        return renderBankLogo(transaction.recipientBank || 'OPay', 'w-12 h-12 shadow-md');
      default:
        return renderBankLogo('OPay', 'w-12 h-12 shadow-md');
    }
  };

  const formattedAmount = `${transaction.amount > 0 ? '+' : ''}₦${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="p-6 bg-slate-50 min-h-[90vh]">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 text-gray-700 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-semibold">Transaction Details</span>
        </button>

        <button 
          onClick={() => alert('Customer support requested. Secure ticket ID #OP-' + transaction.id.slice(-6))}
          className="text-[#00B875] p-2 hover:bg-emerald-50 rounded-full transition-colors"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>

      {/* Main Card Receipt - High-fidelity authentic layout matching screenshot 1 & 2 */}
      <div className="mb-6">
        <AuthenticReceipt
          transaction={transaction}
          userFullName={userFullName}
          userAccountNumber={userAccountNumber}
          backdropBg="#F8FAFC" // perfectly matches bg-slate-50 of the details view!
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => alert('Support portal opened. High priority ticket recorded under OPay Secure Network.')}
          className="flex-1 bg-emerald-50 text-[#00B875] hover:bg-emerald-100 font-bold py-3.5 px-4 rounded-xl text-center text-xs transition-colors cursor-pointer"
        >
          Report Issue
        </button>
        <button
          onClick={() => {
            setIsShareOpen(true);
            if (onShared) onShared();
          }}
          className="flex-1 bg-[#00B875] text-white hover:bg-[#00a367] font-bold py-3.5 px-4 rounded-xl text-center text-xs shadow-md transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Receipt</span>
        </button>
      </div>

      <ShareReceiptModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        userFullName={userFullName}
        userAccountNumber={userAccountNumber}
        transaction={{
          ...transaction,
          recipientName: transaction.title.replace('Transfer to ', '').replace('Received from ', '').trim() || transaction.title
        }} 
      />
    </div>
  );
}
