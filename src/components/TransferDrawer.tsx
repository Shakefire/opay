/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Copy, Search, ShieldCheck, X, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Beneficiary, Transaction } from '../types.ts';
import BiometricModal from './BiometricModal.tsx';
import { NIGERIAN_BANKS_FULL, FREQUENT_BANKS } from '../utils/bankData.ts';
import BankLogoComponent from './BankLogoComponent.tsx';
import ShareReceiptModal from './ShareReceiptModal.tsx';
import AuthenticReceipt from './AuthenticReceipt.tsx';

interface TransferDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  owealthBalance: number;
  beneficiaries: Beneficiary[];
  onTransferSuccess: (newTx: Transaction, amount: number, paymentMethod: 'Balance' | 'OWealth') => void;
  transferType: 'OPay' | 'Bank';
  userFullName?: string;
  userAccountNumber?: string;
}

export function renderBankLogo(bankName: string, sizeClass = 'w-10 h-10') {
  return <BankLogoComponent bankName={bankName} sizeClass={sizeClass} />;
}

export default function TransferDrawer({
  isOpen,
  onClose,
  availableBalance,
  owealthBalance,
  beneficiaries,
  onTransferSuccess,
  transferType,
  userFullName = 'User',
  userAccountNumber = '912****904'
}: TransferDrawerProps) {
  // 1: Select recipient, 2: Enter amount, 3: Checkout Page, 4: PIN Pad, 5: Receipt success
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [amountStr, setAmountStr] = useState('');
  const [notes, setNotes] = useState('');
  const [pin, setPin] = useState('');
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [createdTx, setCreatedTx] = useState<Transaction | null>(null);
  const [error, setError] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Step 1 Custom selection states
  const [activeSubTab, setActiveSubTab] = useState<'recents' | 'newAccount'>('recents');
  const [newAccountNo, setNewAccountNo] = useState('');
  const [newAccountName, setNewAccountName] = useState('');
  const [selectedBank, setSelectedBank] = useState<string>('');
  const [isBankPickerOpen, setIsBankPickerOpen] = useState(false);
  const [bankSearchQuery, setBankSearchQuery] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'Balance' | 'OWealth'>('Balance');
  const [remarkType, setRemarkType] = useState<'Purchase' | 'Personal' | null>(null);

  // Filter beneficiaries by transfer type
  const list = beneficiaries.filter(b => {
    // If Bank tab, show beneficiaries with b.type === 'Bank'.
    // If OPay tab, show beneficiaries with b.type === 'OPay'.
    const matchesType = b.type === transferType;
    const matchesSearch = b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.accountNo.includes(searchQuery);
    return matchesType && matchesSearch;
  });

  if (!isOpen) return null;

  const handleSelectBeneficiary = (b: Beneficiary) => {
    setSelectedBeneficiary(b);
    setError('');
    setStep(2);
  };

  // Create a custom new recipient and switch to Enter Amount page (Step 2)
  const handleProceedNext = () => {
    if (newAccountNo.length !== 10 || isNaN(Number(newAccountNo))) {
      setError('Please input a valid 10-digit account number.');
      return;
    }
    const finalBank = transferType === 'OPay' ? 'OPay' : selectedBank;
    if (!finalBank) {
      setError('Please select a destination bank.');
      return;
    }

    setError('');
    setIsVerifying(true);

    // Simulate high fidelity verified credentials search
    setTimeout(() => {
      setIsVerifying(false);
      // Random Nigerian high-loyalty recipient name if not manually input
      const randomNames = [
        'SAKINA YUSUF',
        'ALPHONSUS DASHEBANG',
        'TUMBA KWAYA ENTERPRISES - TVK',
        'CHINEDU OKAFOR',
        'BABATUNDE ADOWALE',
        'EMEM OKON'
      ];
      const selectedName = newAccountName.trim() || randomNames[Math.floor(Math.random() * randomNames.length)];
      
      const customBeneficiary: Beneficiary = {
        id: `custom_${Date.now()}`,
        name: selectedName.toUpperCase(),
        accountNo: newAccountNo,
        bankName: finalBank,
        type: transferType,
        isMerchant: true
      };
      setSelectedBeneficiary(customBeneficiary);
      setStep(2);
    }, 1200);
  };

  const handleAmountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountStr);
    if (isNaN(val) || val <= 0) return;
    
    // Check if it fits in at least one balance option first
    const maxBalance = Math.max(availableBalance, owealthBalance);
    if (val > maxBalance) {
      setError(`Amount exceeds your total available balances.`);
      return;
    }
    setError('');
    setStep(3); // Checkout page
  };

  const handleKeyPress = (char: string) => {
    if (char === 'back') {
      setPin(prev => prev.slice(0, -1));
    } else if (pin.length < 4) {
      const newPin = pin + char;
      setPin(newPin);
      if (newPin.length === 4) {
        // Automatically trigger biometric confirmation overlay for maximum security
        setTimeout(() => {
          setIsBiometricOpen(true);
        }, 300);
      }
    }
  };

  const handleAuthSuccess = () => {
    setIsBiometricOpen(false);
    
    // Process transfer
    const amt = parseFloat(amountStr);
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const formattedTime = currentDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });

    const txIdStr = Math.floor(Math.random() * 1000000);
    const mockTxNumber = `260611${txIdStr.toString().padStart(6, '0')}289737169019`;

    const isBankTx = transferType === 'Bank' || !selectedBeneficiary?.bankName?.toLowerCase().includes('opay');
    const mockSessionId = isBankTx
      ? `APT${Math.floor(Math.random() * 1e12).toString().padStart(12, '0')}${Date.now().toString().slice(-9)}`
      : undefined;

    const newTx: Transaction = {
      id: `t_${Date.now()}`,
      title: `Transfer to ${selectedBeneficiary?.name}`,
      type: 'transfer_out',
      amount: -amt,
      status: 'Successful',
      date: formattedDate,
      time: formattedTime,
      category: 'Transfer',
      recipientName: selectedBeneficiary?.name,
      recipientAccount: selectedBeneficiary?.accountNo,
      recipientBank: selectedBeneficiary?.bankName || 'OPay',
      paymentMethod: paymentMethod === 'OWealth' ? 'OWealth' : 'Balance',
      transactionNo: mockTxNumber,
      sessionId: mockSessionId,
      notes: notes || (remarkType ? `${remarkType} transfer` : 'OPay instant transfer')
    };

    setCreatedTx(newTx);
    onTransferSuccess(newTx, amt, paymentMethod);
    setStep(5); // Receipt Detail Screen
  };

  const handleCloseAll = () => {
    setStep(1);
    setSelectedBeneficiary(null);
    setAmountStr('');
    setNotes('');
    setPin('');
    setError('');
    setNewAccountNo('');
    setNewAccountName('');
    setSelectedBank('');
    setActiveSubTab('recents');
    setPaymentMethod('Balance');
    setRemarkType(null);
    onClose();
  };

  // Filter full bank list with search input
  const filteredBanks = NIGERIAN_BANKS_FULL.filter(b =>
    b.name.toLowerCase().includes(bankSearchQuery.toLowerCase())
  );

  // Group banks by alphabetical letter heading
  const groupedBanks: Record<string, typeof NIGERIAN_BANKS_FULL> = {};
  filteredBanks.forEach(b => {
    const letter = b.letter;
    if (!groupedBanks[letter]) {
      groupedBanks[letter] = [];
    }
    groupedBanks[letter].push(b);
  });
  const alphabeticalHeaders = Object.keys(groupedBanks).sort();

  return (
    <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs flex justify-center items-end sm:items-center p-0 sm:p-4">
      <div 
        className="w-full sm:max-w-md bg-[#F4F5F8] rounded-t-3xl sm:rounded-3xl max-h-[96vh] overflow-y-auto no-scrollbar shadow-2xl flex flex-col relative"
        style={{ animation: 'slide-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)' }}
      >
        {/* Step 1: Transfer Form with exact fidelity corresponding to Screenshot 1 */}
        {step === 1 && !isBankPickerOpen && (
          <div className="flex flex-col h-full min-h-[580px]">
            {/* Top Fixed Header */}
            <div className="bg-white px-6 py-4 flex justify-between items-center border-b border-gray-100">
              <div className="flex items-center gap-3">
                <button onClick={handleCloseAll} className="p-1 rounded-full text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer">
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="text-[17px] font-black text-gray-900 tracking-tight">
                  {transferType === 'OPay' ? 'Transfer to OPay Wallet' : 'Transfer to Bank Account'}
                </span>
              </div>
              <button 
                type="button" 
                onClick={() => alert('Opening Transaction History...')} 
                className="text-[13px] font-bold text-[#00B875] tracking-tight hover:opacity-80"
              >
                History
              </button>
            </div>

            <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
              {/* Claim promo discount banner (Screenshot 1 top green) */}
              <div className="bg-[#E4FBF1] rounded-2xl p-4 flex items-center justify-between border border-[#B3F2D4]">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎫</div>
                  <div>
                    <h5 className="text-[11.5px] font-black text-gray-900 tracking-tight leading-snug">
                      Claim 15 Discounts with
                    </h5>
                    <p className="text-[15px] font-black text-[#00B875] leading-none mt-0.5">
                      ₦99 <span className="text-[10px] text-gray-500 font-bold">on any Bill</span>
                    </p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => alert('Discount claimed successfully!')} 
                  className="bg-[#00B875] text-white text-xs font-black px-4 py-2 rounded-full cursor-pointer hover:bg-[#00a367] transition-all"
                >
                  Claim
                </button>
              </div>

              {/* Free transfers indicator */}
              <div className="bg-[#F0EBFF] text-[#6236FF] rounded-xl px-4 py-3 flex items-center gap-2 border border-[#E1DAFF]">
                <span className="text-xs">⚡</span>
                <span className="text-xs font-extrabold tracking-tight">
                  Free transfers for the day: <strong className="font-black text-sm">3</strong>
                </span>
              </div>

              {/* Central Box Input Form "Recipient Account" */}
              <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-3xs space-y-4">
                <h4 className="text-[12.5px] font-black text-gray-900 uppercase tracking-wide">
                  Recipient Account
                </h4>

                {/* Account Number Input */}
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={10}
                      value={newAccountNo}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '');
                        setNewAccountNo(val);
                        setError('');
                      }}
                      placeholder="Enter 10 digits Account Number"
                      className="w-full bg-slate-50 border border-slate-150 rounded-xl py-3.5 px-4 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#00B875] transition-all"
                    />
                    {newAccountNo && (
                      <button 
                        type="button" 
                        onClick={() => setNewAccountNo('')} 
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold p-1 hover:text-gray-600 font-sans"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Bank Selector clickable row */}
                {transferType === 'Bank' && (
                  <button
                    type="button"
                    onClick={() => {
                      setBankSearchQuery('');
                      setIsBankPickerOpen(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl py-3.5 px-4 flex justify-between items-center text-left cursor-pointer hover:bg-slate-100/50 transition-colors"
                  >
                    {selectedBank ? (
                      <div className="flex items-center gap-3">
                        {renderBankLogo(selectedBank, 'w-6 h-6')}
                        <span className="text-sm font-extrabold text-gray-900 font-sans">{selectedBank}</span>
                      </div>
                    ) : (
                      <span className="text-sm font-bold text-gray-400 font-sans">Select Bank</span>
                    )}
                    <span className="text-gray-400 font-bold select-none text-xs">➔</span>
                  </button>
                )}

                {/* Optional Receiver Name field */}
                <div>
                  <input
                    type="text"
                    value={newAccountName}
                    onChange={e => {
                      setNewAccountName(e.target.value);
                      setError('');
                    }}
                    placeholder="Recipient Full Name (Optional)"
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl py-3.5 px-4 text-sm font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#00B875] transition-all"
                  />
                  <span className="text-[9.5px] text-gray-400 font-medium block mt-1 px-1">
                    Verifies instantly with Secure OPay bank networks.
                  </span>
                </div>

                {error && (
                  <p className="text-xs font-bold text-red-500 bg-red-50/70 p-2.5 border border-red-100 rounded-xl leading-normal">
                    ⚠️ {error}
                  </p>
                )}

                {/* NEXT Button (Fidelity active or mint-green inactive) */}
                <button
                  type="button"
                  disabled={isVerifying || newAccountNo.length !== 10 || (transferType === 'Bank' && !selectedBank)}
                  onClick={handleProceedNext}
                  className={`w-full font-black py-4 rounded-full shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 text-sm select-none ${
                    newAccountNo.length === 10 && (transferType === 'OPay' || selectedBank)
                      ? 'bg-[#00B875] hover:bg-[#00a367] text-white'
                      : 'bg-[#CBEFE1] text-[#9FD7C0] cursor-not-allowed'
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Verifying account details...</span>
                    </>
                  ) : (
                    <span>Next</span>
                  )}
                </button>
              </div>

              {/* Success Rate Monitor strip */}
              <div className="bg-white rounded-xl p-3.5 flex items-center justify-between border border-emerald-50 cursor-pointer shadow-3xs hover:bg-slate-50 transition-all">
                <div className="flex items-center gap-2.5">
                  <div className="w-7.5 h-7.5 bg-emerald-50 text-[#00B875] rounded-lg flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-none stroke-current stroke-2">
                      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                      <line x1="8" y1="21" x2="16" y2="21" />
                      <line x1="12" y1="17" x2="12" y2="21" />
                    </svg>
                  </div>
                  <span className="text-xs font-extrabold text-slate-800 tracking-tight">
                    Bank Transfer Success Rate Monitor
                  </span>
                </div>
                <span className="text-slate-400 font-bold text-xs">➔</span>
              </div>

              {/* Bottom tabs for Recents / Favourites (Screenshot 1 style) */}
              <div className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-3xs">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-3">
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('recents')}
                      className={`text-sm font-black pb-1.5 border-b-2 transition-all ${
                        activeSubTab === 'recents'
                          ? 'border-[#00B875] text-[#00B875]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Recents
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSubTab('newAccount')} // We can reuse favourites toggle
                      className={`text-sm font-black pb-1.5 border-b-2 transition-all ${
                        activeSubTab === 'newAccount'
                          ? 'border-[#00B875] text-[#00B875]'
                          : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      Favourites
                    </button>
                  </div>
                  <div className="relative">
                    <Search className="w-4.5 h-4.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                  </div>
                </div>

                {/* Recents list filtered by wallet vs bank type */}
                <div className="space-y-1 overflow-y-auto no-scrollbar max-h-[220px]">
                  {list.length > 0 ? (
                    list.map(b => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => handleSelectBeneficiary(b)}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          {renderBankLogo(b.bankName, 'w-10 h-10')}
                          <div>
                            <div className="text-xs font-black text-slate-800 group-hover:text-[#00B875] transition-colors leading-tight uppercase font-sans">
                              {b.name}
                            </div>
                            <div className="text-[10px] text-gray-400 font-bold font-mono tracking-tight mt-0.5 uppercase">
                              {b.accountNo} {b.bankName}
                            </div>
                          </div>
                        </div>

                        {/* Moniepoint mini visual circle indicator as seen in Screen 1 */}
                        {b.bankName.toLowerCase().includes('monie') && (
                          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-black text-[9px] flex items-center justify-center select-none font-sans shrink-0">
                            M
                          </div>
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-xs text-slate-400 font-semibold">
                      No recent contacts saved.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Option Select Bank Sub-Window (Fidelity corresponding to Screenshot 2) */}
        {isBankPickerOpen && (
          <div className="flex flex-col h-full min-h-[580px] bg-white">
            {/* Header style Select Bank */}
            <div className="px-6 py-4 flex items-center border-b border-slate-100">
              <button 
                onClick={() => setIsBankPickerOpen(false)} 
                className="p-1.5 rounded-full text-slate-800 hover:bg-slate-100 transition-colors mr-3 cursor-pointer"
              >
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-lg font-black text-gray-905 tracking-tight font-sans">Select Bank</h2>
            </div>

            {/* Sticky bank name search bar */}
            <div className="p-4 bg-white border-b border-slate-50">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={bankSearchQuery}
                  onChange={e => setBankSearchQuery(e.target.value)}
                  placeholder="Search Bank Name"
                  className="w-full bg-[#f4f5f8] border border-transparent rounded-xl py-3 pl-10 pr-4 text-xs font-extrabold focus:outline-none focus:bg-white focus:border-[#00B875] transition-all"
                />
              </div>
            </div>

            <div className="flex flex-row flex-1 overflow-hidden">
              {/* Core catalog body scroll */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-6">
                
                {/* Frequently Used Bank grid (Screenshot 2 middle) */}
                {!bankSearchQuery && (
                  <div>
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 px-1">
                      Frequently Used Bank
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5">
                      {FREQUENT_BANKS.map(bank => (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => {
                            setSelectedBank(bank);
                            setIsBankPickerOpen(false);
                            setError('');
                          }}
                          className={`p-3 bg-[#F8F9FA] hover:bg-[#E2F7EE] hover:border-[#b1eece] rounded-xl flex flex-col items-center justify-center text-center border transition-all duration-200 cursor-pointer ${
                            selectedBank === bank ? 'border-[#00B875] bg-[#E2F7EE]' : 'border-transparent'
                          }`}
                        >
                          {renderBankLogo(bank, 'w-11 h-11 mb-2')}
                          <span className="text-[10px] font-black leading-tight text-gray-800 line-clamp-1 font-sans">
                            {bank.split('(')[0].trim()}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Letter Index headings */}
                <div className="space-y-4">
                  {alphabeticalHeaders.map(letter => (
                    <div key={letter}>
                      <div className="text-[11px] font-black text-gray-400 uppercase tracking-tight bg-slate-50 py-1.5 px-3 rounded-md mb-2">
                        {letter}
                      </div>
                      
                      <div className="space-y-1">
                        {groupedBanks[letter].map(bank => (
                          <button
                            key={bank.name}
                            type="button"
                            onClick={() => {
                              setSelectedBank(bank.name);
                              setIsBankPickerOpen(false);
                              setError('');
                            }}
                            className={`w-full text-left flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#E2F7EE]/40 transition-colors cursor-pointer group ${
                              selectedBank === bank.name ? 'bg-[#E2F7EE]/50 font-bold' : ''
                            }`}
                          >
                            {renderBankLogo(bank.name, 'w-8 h-8')}
                            <span className="text-xs font-extrabold text-gray-800 group-hover:text-[#00B875] font-sans transition-colors uppercase">
                              {bank.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}

                  {alphabeticalHeaders.length === 0 && (
                    <div className="text-center py-10 text-xs text-gray-400 font-semibold">
                      No matched banks found.
                    </div>
                  )}
                </div>
              </div>

              {/* Alphabet Index sidebar scroll (Screenshot 2 right side index list) */}
              <div className="w-7 shrink-0 bg-slate-50/50 flex flex-col justify-center items-center py-4 space-y-0.5 select-none border-l border-slate-50">
                {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '#'].map(char => (
                  <button
                    key={char}
                    type="button"
                    onClick={() => {
                      // Visual filter or jump search matching query
                      setBankSearchQuery(char === '#' ? '' : char);
                    }}
                    className="text-[9px] font-black text-gray-400 hover:text-[#00B875] leading-none p-1 block w-full text-center transition-all cursor-pointer font-sans"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Enter Amount (Screenshot 3 style) */}
        {step === 2 && selectedBeneficiary && (
          <div className="p-6 flex flex-col min-h-[580px] bg-[#F4F5F8] justify-between">
            <div>
              {/* Header block with back */}
              <div className="flex items-center gap-1 mb-5">
                <button 
                  onClick={() => {
                    setStep(1);
                    setError('');
                  }} 
                  className="p-1.5 rounded-full text-slate-800 hover:bg-slate-200 mr-2 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="text-[16px] font-black text-gray-900 tracking-tight font-sans">
                  Transfer to Bank Account
                </span>
              </div>

              {/* Concentrated Receiver Info Badge block (Screenshot 3 top) */}
              <div className="bg-white p-3 px-4 rounded-2xl flex items-center gap-3 mb-5 border border-slate-150 shadow-3xs">
                {renderBankLogo(selectedBeneficiary.bankName, 'w-11 h-11 shadow-xs')}
                <div>
                  <h4 className="text-[13px] font-black text-gray-900 uppercase font-sans tracking-tight">
                    {selectedBeneficiary.name}
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold font-mono mt-0.5 uppercase tracking-wide">
                    {selectedBeneficiary.accountNo} • {selectedBeneficiary.bankName}
                  </p>
                </div>
              </div>

              {/* Amount Inputs */}
              <form onSubmit={handleAmountSubmit} className="space-y-4">
                <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-3xs">
                  <label className="text-[9.5px] font-black text-gray-400 uppercase tracking-widest block mb-1">
                    Amount
                  </label>
                  
                  <div className="relative border-b border-gray-150 pb-2 flex items-baseline">
                    <span className="text-3xl font-black text-gray-800 mr-1.5 font-sans">₦</span>
                    <input
                      type="number"
                      value={amountStr}
                      onChange={e => {
                        setAmountStr(e.target.value);
                        setError('');
                      }}
                      placeholder="100.00 - 5,000,000.00"
                      autoFocus
                      required
                      className="w-full bg-transparent text-2xl font-black text-gray-850 focus:outline-none placeholder-gray-300 font-sans"
                    />
                  </div>

                  {/* Fast grids 500, 1000, 2000, 5000, 9999, 10000 (Screenshot 3 middle) */}
                  <div className="grid grid-cols-3 gap-2 mt-4 select-none">
                    {[500, 1000, 2000, 5000, 9999, 10000].map(amtVal => (
                      <button
                        key={amtVal}
                        type="button"
                        onClick={() => {
                          setAmountStr(amtVal.toString());
                          setError('');
                        }}
                        className="py-3 bg-slate-50 hover:bg-[#E2F7EE] hover:text-[#00B875] hover:border-[#bdecda] text-slate-700 text-xs font-black rounded-xl transition-all border border-slate-150/40"
                      >
                        ₦{amtVal.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-between items-center mt-3.5 pt-1 border-t border-dashed border-slate-100">
                    <span className="text-[11px] text-gray-400 font-bold leading-none">
                      Wallet: <strong className="text-gray-700 font-extrabold font-mono">₦{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong>
                    </span>
                    <button 
                      type="button"
                      onClick={() => {
                        setAmountStr(availableBalance.toFixed(2));
                        setError('');
                      }}
                      className="text-[10px] font-black text-[#00B875] uppercase hover:underline"
                    >
                      Transfer All
                    </button>
                  </div>
                </div>

                {/* Remark & tags block (Screenshot 3 bottom block) */}
                <div className="bg-white rounded-2xl p-4 border border-slate-150 shadow-3xs space-y-3">
                  <label className="text-[9.5px] font-black text-gray-400 uppercase tracking-widest block">
                    Remark
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="What's this for?(Optional)"
                    className="w-full bg-slate-50 border border-slate-150 rounded-xl py-3 px-4 text-xs font-extrabold focus:outline-none focus:bg-white focus:border-[#00B875] transition-all"
                  />
                  
                  {/* Remark Pills (Screenshot 3 tag pills "Purchase" / "Personal") */}
                  <div className="flex gap-2 font-semibold">
                    <button
                      type="button"
                      onClick={() => {
                        setRemarkType('Purchase');
                        if (!notes) setNotes('Purchase payment');
                      }}
                      className={`px-4.5 py-1.5 rounded-full text-xs font-black border transition-all ${
                        remarkType === 'Purchase'
                          ? 'bg-[#E2F7EE] text-[#00B875] border-[#b1eccd]'
                          : 'bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100'
                      }`}
                    >
                      Purchase
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRemarkType('Personal');
                        if (!notes) setNotes('Personal helper transfer');
                      }}
                      className={`px-4.5 py-1.5 rounded-full text-xs font-black border transition-all ${
                        remarkType === 'Personal'
                          ? 'bg-[#E2F7EE] text-[#00B875] border-[#b1eccd]'
                          : 'bg-slate-50 text-slate-500 border-slate-150 hover:bg-slate-100'
                      }`}
                    >
                      Personal
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs font-bold text-red-500 bg-red-50/75 p-3.5 border border-red-100 rounded-xl leading-normal mt-2">
                    ⚠️ {error}
                  </p>
                )}
              </form>
            </div>

            {/* Bottom Sticky Confirmation button (Screenshot 3 visual button) */}
            <div className="pt-4">
              <button
                type="button"
                disabled={!amountStr || parseFloat(amountStr) <= 0}
                onClick={handleAmountSubmit}
                className={`w-full font-black py-4 rounded-full shadow-md transition-all text-sm uppercase cursor-pointer ${
                  amountStr && parseFloat(amountStr) > 0
                    ? 'bg-[#00B875] hover:bg-[#00a367] text-white active:scale-98'
                    : 'bg-[#CBEFE1] text-[#9FD7C0] cursor-not-allowed'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Checkout Confirm Page */}
        {step === 3 && selectedBeneficiary && (
          <div className="p-6 flex flex-col justify-between min-h-[500px]">
            <div>
              <div className="flex items-center gap-1 mb-5">
                <button onClick={() => setStep(2)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 mr-2">
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="text-base font-bold text-gray-900 select-none font-sans">Confirm Payment</span>
              </div>

              {/* Central display of total money */}
              <div className="text-center py-6 bg-white border border-slate-150 rounded-2xl mb-4 shadow-3xs select-none">
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-400">Total Settlement Balance</p>
                <h2 className="text-3xl font-extrabold text-[#00B875] mt-1 font-sans tracking-tight">
                  ₦{parseFloat(amountStr).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h2>
                <span className="text-[10px] text-[#00B875] bg-[#E2F7EE] font-black px-3.5 py-1 rounded-full mt-2 inline-block">
                  No Extra Session Fees
                </span>
              </div>

              {/* Receipt details */}
              <div className="bg-white border border-slate-150 rounded-2xl p-4.5 space-y-3 shadow-3xs mb-4 select-none">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Receiver name</span>
                  <strong className="text-slate-800 font-black uppercase font-sans">{selectedBeneficiary.name}</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Account Number</span>
                  <strong className="text-slate-800 font-mono tracking-wide">{selectedBeneficiary.accountNo}</strong>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold">Destination Bank</span>
                  <strong className="text-[#00B875] bg-[#E2F7EE] px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-tight">{selectedBeneficiary.bankName}</strong>
                </div>
                {notes && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400 font-bold">Transfer Remarks</span>
                    <span className="text-slate-600 italic font-bold">{notes}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-2.5">
                  <span className="text-slate-500 font-bold">Session Fee</span>
                  <strong className="text-emerald-700 font-black">Free (₦0.00)</strong>
                </div>
              </div>

              {/* Settlement choice */}
              <div className="space-y-2 select-none">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block px-1">
                  Settlement Account / Wallet
                </label>
                
                <div className="grid grid-cols-1 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('Balance');
                      setError('');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'Balance'
                        ? 'border-[#00B875] bg-[#E2F7EE]/10 ring-1 ring-[#00B875]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center ${paymentMethod === 'Balance' ? 'bg-[#00B875]/15' : 'bg-slate-100'}`}>
                        <svg viewBox="0 0 24 24" className={`w-[17px] h-[17px] ${paymentMethod === 'Balance' ? 'fill-[#00B875]' : 'fill-slate-500'}`}>
                          <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11.5px] font-black text-slate-800 font-sans">Wallet Balance</p>
                        <p className="text-[10px] font-black text-slate-400 font-mono mt-0.5">
                          ₦{availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'Balance' ? 'border-[#00B875] bg-[#00B875]' : 'border-slate-300'}`}>
                      {paymentMethod === 'Balance' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod('OWealth');
                      setError('');
                    }}
                    className={`flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      paymentMethod === 'OWealth'
                        ? 'border-[#00B875] bg-[#E2F7EE]/10 ring-1 ring-[#00B875]'
                        : 'border-slate-200 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8.5 h-8.5 rounded-xl flex items-center justify-center ${paymentMethod === 'OWealth' ? 'bg-[#00B875]/15' : 'bg-slate-100'}`}>
                        <svg viewBox="0 0 24 24" className={`w-[17px] h-[17px] ${paymentMethod === 'OWealth' ? 'fill-[#00B875]' : 'fill-slate-500'}`}>
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[11.5px] font-black text-slate-800 font-sans">OWealth Savings</p>
                        <p className="text-[10px] font-black text-slate-400 font-mono mt-0.5">
                          ₦{owealthBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === 'OWealth' ? 'border-[#00B875] bg-[#00B875]' : 'border-slate-300'}`}>
                      {paymentMethod === 'OWealth' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Proceed buttons */}
            <div className="mt-8 space-y-4">
              {parseFloat(amountStr) > (paymentMethod === 'Balance' ? availableBalance : owealthBalance) && (
                <p className="text-[11px] font-bold text-red-500 bg-red-50/70 p-3 border border-red-100 rounded-xl leading-relaxed text-center animate-fade-in">
                  ⚠️ Your chosen account ({paymentMethod === 'Balance' ? 'Wallet' : 'OWealth'}) has insufficient balance to cover ₦{parseFloat(amountStr).toLocaleString()}.
                </p>
              )}

              <button
                type="button"
                disabled={parseFloat(amountStr) > (paymentMethod === 'Balance' ? availableBalance : owealthBalance)}
                onClick={() => setStep(4)}
                className="w-full bg-[#00B875] disabled:bg-slate-150 text-white font-black py-4 rounded-full shadow-lg hover:bg-[#00a367] disabled:text-slate-400 disabled:cursor-not-allowed transition-all cursor-pointer text-xs uppercase font-sans tracking-wide"
              >
                Confirm and Proceed to PIN
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Transaction PIN Pad */}
        {step === 4 && selectedBeneficiary && (
          <div className="p-6 flex flex-col justify-between min-h-[480px]">
            <div>
              <div className="flex items-center gap-1 mb-6">
                <button onClick={() => setStep(3)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer">
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
                <span className="text-base font-bold text-gray-900 font-sans">Payment Security Access</span>
              </div>

              <div className="text-center py-4 select-none">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-sm font-black text-gray-800">Enter Payment PIN</h3>
                <p className="text-xs text-gray-400 mt-1 leading-snug font-medium">
                  Authorize payment of <strong className="text-emerald-600 font-extrabold text-sm font-sans">₦{parseFloat(amountStr).toLocaleString(undefined, { minimumFractionDigits: 2 })}</strong> to {selectedBeneficiary.name}
                </p>
              </div>

              {/* Pin dots */}
              <div className="flex justify-center gap-6 my-6">
                {[...Array(4)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-150 ${
                      pin.length > i ? 'bg-[#00B875] scale-110 shadow-xs shadow-emerald-400' : 'bg-gray-200'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Pad buttons */}
            <div className="grid grid-cols-3 gap-y-3 gap-x-6 px-4">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(char => (
                <button
                  key={char}
                  onClick={() => handleKeyPress(char)}
                  className="flex items-center justify-center py-3.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-lg text-gray-800 transition-colors cursor-pointer active:scale-95 font-sans"
                >
                  {char}
                </button>
              ))}
              <div className="flex items-center justify-center"></div>
              <button
                onClick={() => handleKeyPress('0')}
                className="flex items-center justify-center py-3.5 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-lg text-gray-800 transition-colors cursor-pointer active:scale-95 font-sans"
              >
                0
              </button>
              <button
                onClick={() => handleKeyPress('back')}
                className="flex items-center justify-center py-3.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors cursor-pointer active:scale-95"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* Step 5: High-fidelity Transaction Details matching user's screen structure perfectly! */}
        {step === 5 && createdTx && selectedBeneficiary && (() => {
          const isBank = transferType === 'Bank' || (
            !selectedBeneficiary.bankName?.toLowerCase().includes('opay')
          );
          return (
          <div className="flex flex-col min-h-[580px] bg-[#F4F5F8] justify-between rounded-t-3xl sm:rounded-3xl overflow-hidden">
            
            {/* Top Navigation Bar (Section 1) */}
            <div className="bg-white px-5 py-4 flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <button onClick={handleCloseAll} className="p-1 rounded-full text-slate-800 hover:bg-slate-50 transition-colors cursor-pointer">
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

            {/* Scrollable Container containing Cards */}
            <div className="px-4 py-2 space-y-4 flex-1 overflow-y-auto no-scrollbar flex flex-col">
              
              {/* Card 1: Transaction Summary Card (Section 2) */}
              <div className="relative bg-white rounded-[20px] pb-5 px-5 shadow-3xs border border-gray-100/50 text-center flex flex-col items-center mt-7" style={{ paddingTop: isBank ? '40px' : '36px' }}>
                
                {/* Floating Logo (Section 2 logo) */}
                {(() => {
                  const isBankTransfer = transferType !== 'OPay' && !(selectedBeneficiary?.bankName?.toLowerCase().includes('opay'));
                  if (!isBankTransfer) {
                    return (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center select-none z-20">
                        <svg viewBox="0 0 100 100" className="w-8.5 h-8.5">
                          <circle cx="50" cy="50" r="28" stroke="#00B875" strokeWidth="12.5" fill="none" />
                          <rect x="14" y="45" width="18" height="10" fill="#130C52" rx="2" />
                        </svg>
                      </div>
                    );
                  }
                  // Bank: white ring + blue rounded-square with initial
                  const bankColors: Record<string, { bg: string; text: string }> = {
                    moniepoint: { bg: '#2563EB', text: '#FFFFFF' },
                    'monie point': { bg: '#2563EB', text: '#FFFFFF' },
                    access: { bg: '#000000', text: '#FF5500' },
                    uba: { bg: '#D32F2F', text: '#FFFFFF' },
                    'first bank': { bg: '#0b2545', text: '#EAB308' },
                    firstbank: { bg: '#0b2545', text: '#EAB308' },
                    gtbank: { bg: '#E65100', text: '#FFFFFF' },
                    guaranty: { bg: '#E65100', text: '#FFFFFF' },
                    zenith: { bg: '#FFFFFF', text: '#DC2626' },
                    kuda: { bg: '#400080', text: '#1BE0D0' },
                    palmpay: { bg: '#5E2B97', text: '#FFFFFF' },
                    wema: { bg: '#8A0F54', text: '#FFFFFF' },
                    stanbic: { bg: '#0033A0', text: '#FFFFFF' },
                    sterling: { bg: '#D32F2F', text: '#FFFFFF' },
                    fidelity: { bg: '#022c22', text: '#FFFFFF' },
                    fcmb: { bg: '#4F46E5', text: '#EAB308' },
                  };
                  const bName = (selectedBeneficiary?.bankName || 'Bank').toLowerCase();
                  const match = Object.keys(bankColors).find(k => bName.includes(k));
                  const { bg, text } = match ? bankColors[match] : { bg: '#334155', text: '#FFFFFF' };
                  const initial = (selectedBeneficiary?.bankName || 'B').trim().charAt(0).toUpperCase();
                  return (
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-20 select-none">
                      <div className="w-14 h-14 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-[10px] flex items-center justify-center" style={{ backgroundColor: bg }}>
                          <span className="font-black text-[22px] leading-none" style={{ color: text, fontFamily: 'system-ui, sans-serif' }}>{initial}</span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Transaction Description */}
                <span className="text-[15px] text-gray-950 font-bold font-sans leading-snug px-2 mt-0">
                  Transfer to {selectedBeneficiary.name.toUpperCase()}
                </span>
                
                {/* Amount Display */}
                <span className="text-[34px] font-black text-gray-950 tracking-tight leading-none mt-3 font-sans">
                  ₦{Math.abs(createdTx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>

                {/* Status – plain green text */}
                <span className="text-[#00B875] font-bold text-[14px] font-sans mt-2">Successful</span>

                {/* Bank Transfer: 3-step progress tracker */}
                {isBank && (() => {
                  const months: Record<string, string> = { Jan:'01',Feb:'02',Mar:'03',Apr:'04',May:'05',Jun:'06',Jul:'07',Aug:'08',Sep:'09',Oct:'10',Nov:'11',Dec:'12' };
                  const dm = createdTx.date.match(/^(\w{3})\s+(\d+)/);
                  const pfx = dm ? `${months[dm[1]] || '06'}-${dm[2].padStart(2,'0')}` : '06-11';
                  const steps = [
                    { label: 'Payment\nsuccessful', time: `${pfx} ${createdTx.time}` },
                    { label: 'Processing\nby bank',  time: `${pfx} ${createdTx.time}` },
                    { label: 'Received\nby bank',    time: `${pfx} 14:03:31` },
                  ];
                  return (
                    <>
                      {/* Circles + lines */}
                      <div className="w-full mt-5 flex items-center px-1">
                        {steps.map((_, idx) => (
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

                      {/* Labels + timestamps */}
                      <div className="w-full mt-2 flex">
                        {steps.map((step, idx) => (
                          <div key={idx} className="flex flex-col font-sans" style={{ width: '33.333%', alignItems: idx === 0 ? 'flex-start' : idx === 2 ? 'flex-end' : 'center', textAlign: idx === 0 ? 'left' : idx === 2 ? 'right' : 'center' }}>
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
                  );
                })()}
              </div>

              {/* Card 2: Transaction Details Card (Section 3) */}
              <div className="bg-white rounded-[20px] p-4.5 shadow-3xs border border-gray-100/50">
                <h3 className="text-gray-900 font-bold text-sm mb-3.5 font-sans">Transaction Details</h3>
                
                <div className="space-y-4">
                  {/* Recipient Details */}
                  <div className="flex justify-between items-start text-[13px]">
                    <span className="text-gray-400 font-medium font-sans">Recipient Details</span>
                    <div className="text-right">
                      <div className="font-bold text-gray-950 uppercase font-sans leading-tight">
                        {selectedBeneficiary.name}
                      </div>
                      <div className="text-[10.5px] text-gray-400 font-bold mt-1 uppercase font-sans">
                        {selectedBeneficiary.bankName} | {selectedBeneficiary.accountNo}
                      </div>
                    </div>
                  </div>

                  {/* Transaction No. */}
                  <div className="flex justify-between items-center text-[13px] pt-1">
                    <span className="text-gray-400 font-medium font-sans">Transaction No.</span>
                    <div className="flex items-center gap-1.5 font-sans relative">
                      <span className="font-bold text-gray-950 font-mono text-xs">
                        {createdTx.transactionNo}
                      </span>
                      <button 
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(createdTx.transactionNo);
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
                      onClick={() => alert(`Payment Method: ${paymentMethod === 'OWealth' ? 'OWealth' : 'Wallet'}`)}
                      className="flex items-center gap-0.5 font-bold text-gray-950 font-sans hover:text-[#00B875] transition-colors cursor-pointer"
                    >
                      <span>{paymentMethod === 'OWealth' ? 'OWealth' : 'Wallet'}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Transaction Date */}
                  <div className="flex justify-between items-center text-[13px] pt-1">
                    <span className="text-gray-400 font-medium font-sans">Transaction Date</span>
                    <span className="font-bold text-gray-950 font-sans">
                      {createdTx.date} {createdTx.time}
                    </span>
                  </div>

                  {/* Session ID – bank transfers only */}
                  {isBank && createdTx.sessionId && (
                    <div className="flex justify-between items-center text-[13px] pt-1">
                      <span className="text-gray-400 font-medium font-sans shrink-0 mr-3">Session ID</span>
                      <div className="flex items-center gap-1.5 font-sans relative">
                        <span className="font-bold text-gray-950 font-mono text-xs break-all text-right">
                          {createdTx.sessionId}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(createdTx.sessionId!);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1 cursor-pointer shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>


              {/* Card 3: More Actions Card (Section 4) */}
              <div className="bg-white rounded-[20px] p-4.5 shadow-3xs border border-gray-100/50">
                <h3 className="text-gray-900 font-bold text-sm mb-3.5 font-sans">More Actions</h3>
                
                <div className={isBank ? '' : 'grid grid-cols-2 gap-4'}>
                  {/* Transfer Again */}
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      setAmountStr('');
                      setNotes('');
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

                  {/* View Records – only for OPay transfers */}
                  {!isBank && (
                    <button
                      type="button"
                      onClick={() => {
                        handleCloseAll();
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


              {/* Spacer Area (Section 5) */}
              <div className="flex-1 min-h-[50px] bg-transparent" />

            </div>

            {/* Fixed Bottom Action Area (Section 6) */}
            <div className="px-5 pb-6 pt-2.5 flex gap-4 select-none shrink-0 bg-[#F4F5F8]">
              <button
                type="button"
                onClick={() => alert('Support ticket opened with priority ID #OP260611289')}
                className="flex-1 bg-[#E2F7EE] text-[#00B875] font-bold py-3.5 rounded-full text-center text-sm hover:opacity-90 cursor-pointer transition-all font-sans"
              >
                Report Issue
              </button>
              <button
                type="button"
                onClick={() => setIsShareOpen(true)}
                className="flex-1 bg-[#00B875] text-white font-bold py-3.5 rounded-full text-center text-sm hover:bg-[#00a367] cursor-pointer transition-all shadow-md font-sans"
              >
                Share Receipt
              </button>
            </div>
          </div>
          );
        })()}

      </div>

      {/* Security biometrics approval */}
      <BiometricModal
        isOpen={isBiometricOpen}
        reason={`Authorize payment of ₦${parseFloat(amountStr).toLocaleString(undefined, { minimumFractionDigits: 2 })} to ${selectedBeneficiary?.name}`}
        onSuccess={handleAuthSuccess}
        onCancel={() => {
          setIsBiometricOpen(false);
          setPin('');
        }}
      />

      {isShareOpen && createdTx && selectedBeneficiary && (
        <ShareReceiptModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          userFullName={userFullName}
          userAccountNumber={userAccountNumber}
          transaction={{
            title: createdTx.title,
            type: createdTx.type,
            amount: createdTx.amount,
            recipientName: selectedBeneficiary.name,
            recipientBank: selectedBeneficiary.bankName,
            recipientAccount: selectedBeneficiary.accountNo,
            transactionNo: createdTx.transactionNo,
            date: 'Jun 11, 2026',
            time: createdTx.time,
            status: 'Successful',
            paymentMethod: paymentMethod === 'OWealth' ? 'OWealth' : 'Balance'
          }}
        />
      )}
    </div>
  );
}
