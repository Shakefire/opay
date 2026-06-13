/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Bell, QrCode, HelpCircle, PhoneCall, PlusCircle, ArrowRight, Search, 
  Compass, Gift, TrendingUp, CreditCard, User, Smartphone, PiggyBank, 
  Percent, Grid, ChevronRight, Eye, EyeOff, ChevronLeft, Download, 
  RefreshCw, Copy, Plus, X, Laptop, CheckCircle, ShieldAlert
} from 'lucide-react';

import { Beneficiary, Transaction, UserState, NotificationItem } from './types.ts';
import { INITIAL_BENEFICIARIES, INITIAL_TRANSACTIONS, INITIAL_NOTIFICATIONS } from './data.ts';

// Component imports
import Login from './components/Login.tsx';
import BiometricModal from './components/BiometricModal.tsx';
import TransferDrawer from './components/TransferDrawer.tsx';
import TransactionDetails from './components/TransactionDetails.tsx';
import OWealthManager from './components/OWealthManager.tsx';
import VirtualCard from './components/VirtualCard.tsx';
import RewardsCenter from './components/RewardsCenter.tsx';
import ProfileSettings from './components/ProfileSettings.tsx';
import NotificationToast from './components/NotificationToast.tsx';
import InstallAppButton from './components/InstallAppButton.tsx';
import InstallAppModal from './components/InstallAppModal.tsx';

interface AlertToast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'alert' | 'secure' | 'interest';
}

export default function App() {
  // Authentication & Core State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserState>(() => {
    try {
      const saved = localStorage.getItem('opay_sim_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      }
    } catch (e) {}
    return {
      fullName: 'SHIMESON',
      phoneNumber: '081 2933 3888',
      balance: 17000.81,
      bonusBalance: 53.50,
      showBalance: true,
      owealthBalance: 17000.81,
      owealthInterestRate: 15.0,
      tierLevel: 3,
      biometricsEnabled: true,
      pinCode: '4491',
      opayAccountNumber: '912****904'
    };
  });

  // Persist user details
  useEffect(() => {
    try {
      localStorage.setItem('opay_sim_user', JSON.stringify(user));
    } catch (e) {}
  }, [user]);

  // Data persistence list states
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(INITIAL_BENEFICIARIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS.map(nd => ({ ...nd, read: nd.read ?? false }))
  );

  // Layout states
  const [activeTab, setActiveTab] = useState<'home' | 'rewards' | 'finance' | 'cards' | 'me'>('home');
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);
  const [viewingAllTransactions, setViewingAllTransactions] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  
  // Drawer & Overlay states
  const [transferType, setTransferType] = useState<'OPay' | 'Bank' | null>(null);
  const [addMoneyOpen, setAddMoneyOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [bonusEnvelopeActive, setBonusEnvelopeActive] = useState(true);

  // Toast array state
  const [toasts, setToasts] = useState<AlertToast[]>([]);

  // Transaction screen filters
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Cashback' | 'Airtime' | 'Transfer' | 'Interest'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Successful' | 'Pending' | 'Failed'>('All');
  const [selectedMonthYear, setSelectedMonthYear] = useState<string>('Jun 2026');
  const [isMonthPickerOpen, setIsMonthPickerOpen] = useState(false);

  // Trigger automated interest compounding occasionally for realism
  useEffect(() => {
    if (!isLoggedIn) return;

    // Simulate small automated micro OWealth interest earnings every 40 seconds to showcase "real-time" applet behavior!
    const interval = setInterval(() => {
      const yieldAmt = 0.09;
      const roundedVal = Math.round((user.owealthBalance + yieldAmt) * 100) / 100;
      
      const newTx: Transaction = {
        id: `t_auto_${Date.now()}`,
        title: 'OWealth Interest Earned',
        type: 'owealth_interest',
        amount: yieldAmt,
        status: 'Successful',
        date: 'Jun 12th, 2026',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        category: 'Interest',
        paymentMethod: 'OWealth Interest',
        transactionNo: `260612${Math.floor(Math.random() * 89999 + 10000)}2897`,
        notes: 'Compound hourly payout interest'
      };

      setUser(prev => ({
        ...prev,
        owealthBalance: roundedVal
      }));

      setTransactions(prev => [newTx, ...prev]);

      addToast(
        '📈 OWealth Interest payout',
        `Your active savings vault was credited with +₦${yieldAmt} OWealth interest yield.`,
        'interest'
      );
    }, 45000);

    return () => clearInterval(interval);
  }, [isLoggedIn, user.owealthBalance]);

  // Add toast helper
  const addToast = (title: string, message: string, type: 'success' | 'alert' | 'secure' | 'interest' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Perform a mock transfer transaction success
  const handleTransferExecuted = (newTx: Transaction, amount: number, paymentMethod: 'Balance' | 'OWealth' = 'Balance') => {
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => {
      if (paymentMethod === 'OWealth') {
        return {
          ...prev,
          owealthBalance: Math.round((prev.owealthBalance - amount) * 100) / 100
        };
      } else {
        return {
          ...prev,
          balance: Math.round((prev.balance - amount) * 100) / 100
        };
      }
    });

    // Insert live notification too!
    const newNotif: NotificationItem = {
      id: `n_${Date.now()}`,
      title: 'Transfer Sent',
      body: `You securely sent ₦${amount.toLocaleString()} to ${newTx.title.replace('Transfer to ', '')} using ${paymentMethod === 'OWealth' ? 'OWealth savings' : 'wallet balance'}.`,
      timestamp: `${newTx.date}, ${newTx.time.slice(0, 5)}`,
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Slide-down push toast alert
    addToast(
      '💸 Transfer Sent',
      `Sent ₦${amount.toLocaleString()} securely to ${newTx.title.replace('Transfer to ', '')}.`,
      'success'
    );
  };

  // Deposit funding
  const executeWalletFunding = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(fundAmount);
    if (isNaN(amt) || amt <= 0) return;

    // Cashback payout calculation (typical OPay 0.5% deposit reward match!)
    const cashbackAmt = amt >= 1000 ? Math.round((amt * 0.001) * 100) / 100 : 0.00;

    const newTx: Transaction = {
      id: `t_fund_${Date.now()}`,
      title: 'Topup Wallet via Card',
      type: 'deposit',
      amount: amt,
      status: 'Successful',
      date: 'Jun 12th, 2026',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'Deposit',
      paymentMethod: 'Verve Debit Card',
      transactionNo: `260611${Math.floor(Math.random() * 89999 + 10000)}2897370`,
      notes: 'Added funds from external savings account'
    };

    let rewardTx: Transaction | null = null;
    if (cashbackAmt > 0) {
      rewardTx = {
        id: `t_fund_rew_${Date.now()}`,
        title: 'Instant Deposit Cashback Bonus',
        type: 'bonus',
        amount: cashbackAmt,
        status: 'Successful',
        date: 'Jun 12th, 2026',
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        category: 'Cashback',
        paymentMethod: 'Reward Pool',
        transactionNo: `260611${Math.floor(Math.random() * 89999 + 10000)}2897371`,
        notes: 'Deposit event bonus multiplier'
      };
    }

    setUser(prev => ({
      ...prev,
      balance: Math.round((prev.balance + amt) * 100) / 100,
      bonusBalance: rewardTx ? Math.round((prev.bonusBalance + cashbackAmt) * 100) / 100 : prev.bonusBalance
    }));

    setTransactions(prev => {
      const list = [newTx];
      if (rewardTx) list.push(rewardTx);
      return [...list, ...prev];
    });

    addToast(
      '🏦 Wallet Refunded',
      `Deposited ₦${amt.toLocaleString()} securely from card. Active balance updated.`,
      'secure'
    );

    if (cashbackAmt > 0) {
      setTimeout(() => {
        addToast(
          '🎁 Instant Cashback Match!',
          `You received ₦${cashbackAmt.toFixed(2)} deposit cashback rewards!`,
          'success'
        );
      }, 1200);
    }

    setFundAmount('');
    setAddMoneyOpen(false);
  };

  // Claim surprise Envelope bonus
  const claimSurpriseGift = () => {
    if (!bonusEnvelopeActive) return;
    
    const awardChoices = [15.00, 25.00, 50.00, 100.00];
    const pickedAmt = awardChoices[Math.floor(Math.random() * awardChoices.length)];

    const newTx: Transaction = {
      id: `t_envelope_${Date.now()}`,
      title: 'Weekly Surprise Cashback',
      type: 'bonus',
      amount: pickedAmt,
      status: 'Successful',
      date: 'Jun 12th, 2026',
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      category: 'Cashback',
      paymentMethod: 'Campaign Pool',
      transactionNo: `260511${Math.floor(Math.random() * 89999 + 10000)}2897`,
      notes: 'Weekly promotional client gift box'
    };

    setUser(prev => ({
      ...prev,
      bonusBalance: Math.round((prev.bonusBalance + pickedAmt) * 100) / 100
    }));

    setTransactions(prev => [newTx, ...prev]);
    setBonusEnvelopeActive(false);

    addToast(
      '🎉 Envelope Claimed',
      `You uncovered a surprise envelope yielding ₦${pickedAmt.toFixed(2)} cashback!`,
      'success'
    );
  };

  const getTransactionMonthYear = (tx: Transaction) => {
    const dateStr = tx.date || '';
    let month = 'Jun';
    let year = '2026';
    
    if (dateStr.includes('Jan')) month = 'Jan';
    else if (dateStr.includes('Feb')) month = 'Feb';
    else if (dateStr.includes('Mar')) month = 'Mar';
    else if (dateStr.includes('Apr')) month = 'Apr';
    else if (dateStr.includes('May')) month = 'May';
    else if (dateStr.includes('Jun')) month = 'Jun';
    else if (dateStr.includes('Jul')) month = 'Jul';
    else if (dateStr.includes('Aug')) month = 'Aug';
    else if (dateStr.includes('Sep')) month = 'Sep';
    else if (dateStr.includes('Oct')) month = 'Oct';
    else if (dateStr.includes('Nov')) month = 'Nov';
    else if (dateStr.includes('Dec')) month = 'Dec';

    if (dateStr.includes('2025')) year = '2025';
    else if (dateStr.includes('2024')) year = '2024';
    
    return `${month} ${year}`;
  };

  // Filtered transactions for the explicit history panel
  const filteredTransactions = transactions.filter(t => {
    if (categoryFilter !== 'All') {
      if (categoryFilter === 'Cashback' && t.category !== 'Cashback') return false;
      if (categoryFilter === 'Airtime' && t.category !== 'Airtime') return false;
      if (categoryFilter === 'Transfer' && t.category !== 'Transfer') return false;
      if (categoryFilter === 'Interest' && t.category !== 'Interest') return false;
    }
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (selectedMonthYear !== 'All') {
      if (getTransactionMonthYear(t) !== selectedMonthYear) return false;
    }
    return true;
  });

  const uniqueMonths = Array.from(new Set(transactions.map(getTransactionMonthYear)))
    .sort((a: string, b: string) => {
      const monthsOrder = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const [mA, yA] = a.split(' ');
      const [mB, yB] = b.split(' ');
      if (yA !== yB) return yB.localeCompare(yA); 
      return monthsOrder.indexOf(mB) - monthsOrder.indexOf(mA); 
    });

  // Calculate live inflows and outflows based on the filtered transactions list
  const totalInflow = filteredTransactions
    .filter(t => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = filteredTransactions
    .filter(t => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleClaimRewardCash = (claimAmt: number, newTx: Transaction) => {
    setTransactions(prev => [newTx, ...prev]);
    setUser(prev => ({
      ...prev,
      bonusBalance: Math.round((prev.bonusBalance + claimAmt) * 100) / 100
    }));
  };

  const handleUpdateOWealthBalances = (owealthDelta: number, mainDelta: number, newTx?: Transaction) => {
    setUser(prev => ({
      ...prev,
      owealthBalance: Math.round((prev.owealthBalance + owealthDelta) * 100) / 100,
      balance: Math.round((prev.balance + mainDelta) * 100) / 100
    }));
    if (newTx) {
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const resetAllSandboxData = () => {
    setUser({
      fullName: 'SHIMESON',
      phoneNumber: '081 2933 3888',
      balance: 17000.81,
      bonusBalance: 53.50,
      showBalance: true,
      owealthBalance: 17000.81,
      owealthInterestRate: 15.0,
      tierLevel: 3,
      biometricsEnabled: true,
      pinCode: '4491'
    });
    setTransactions(INITIAL_TRANSACTIONS);
    setBeneficiaries(INITIAL_BENEFICIARIES);
    setNotifications(INITIAL_NOTIFICATIONS.map(nd => ({ ...nd, read: nd.read ?? false })));
    setCategoryFilter('All');
    setStatusFilter('All');
    setBonusEnvelopeActive(true);
    addToast('🔧 Simulator Restored', 'OPay mock platform returned to base credentials.', 'secure');
  };

  // Login handler
  const handleLoginSuccess = (phoneNumber: string) => {
    setUser(prev => ({ ...prev, phoneNumber }));
    setIsLoggedIn(true);
    addToast('🔐 Access Granted', 'Biometric login matched and verified successfully.', 'secure');
  };

  // Helper to render high-fidelity, unique icons for various transaction categories
  const renderTransactionIcon = (type: string, sizeClass = "w-11 h-11 rounded-2xl") => {
    const isSmall = sizeClass.includes('w-9') || sizeClass.includes('w-8');
    const iconSizeClass = isSmall ? "w-[16px] h-[16px]" : "w-[19px] h-[19px]";
    const strokeWidth = isSmall ? "2" : "2.2";
    const bgStyle = `${sizeClass} bg-[#E2F7EE] flex items-center justify-center shrink-0`;
    
    switch (type) {
      case 'bonus':
        return (
          <div className={bgStyle}>
            <svg viewBox="0 0 24 24" className={`${iconSizeClass} fill-none stroke-[#00B875]`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="8" width="18" height="12" rx="2" ry="2" />
              <line x1="12" y1="8" x2="12" y2="20" />
              <path d="M12 8H7.5a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8z" />
              <path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" />
            </svg>
          </div>
        );
      case 'airtime':
        return (
          <div className={bgStyle}>
            <svg viewBox="0 0 24 24" className={`${iconSizeClass} fill-none stroke-[#00B875]`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="2" width="12" height="20" rx="3.5" strokeWidth={strokeWidth} />
              <path d="M9 16h1M9 13.5h2M9 11h3" strokeWidth="1.8" />
            </svg>
          </div>
        );
      case 'owealth_interest':
        return (
          <div className={bgStyle}>
            <svg viewBox="0 0 24 24" className={`${iconSizeClass} fill-none stroke-[#00B875]`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
          </div>
        );
      case 'transfer_out':
        return (
          <div className={`${sizeClass} bg-amber-50 flex items-center justify-center shrink-0`}>
            <svg viewBox="0 0 24 24" className={`${iconSizeClass} fill-none stroke-amber-600`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="10 7 17 7 17 14" />
            </svg>
          </div>
        );
      case 'transfer_in':
        return (
          <div className={bgStyle}>
            <svg viewBox="0 0 24 24" className={`${iconSizeClass} fill-none stroke-[#00B875]`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <line x1="17" y1="7" x2="7" y2="17" />
              <polyline points="14 17 7 17 7 10" />
            </svg>
          </div>
        );
      default:
        return (
          <div className={bgStyle}>
            <svg viewBox="0 0 24 24" className={`${iconSizeClass} fill-none stroke-[#00B875]`} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
        );
    }
  };

  // Render tab-specific modules
  const renderTabContent = () => {
    switch (activeTab) {
      case 'rewards':
        return (
          <RewardsCenter
            bonusBalance={user.bonusBalance}
            onClaimCash={handleClaimRewardCash}
            onAddNotificationToast={addToast}
          />
        );
      case 'finance':
        return (
          <OWealthManager
            owealthBalance={user.owealthBalance}
            mainBalance={user.balance}
            showBalance={user.showBalance}
            onUpdateBalances={handleUpdateOWealthBalances}
            onAddNotificationToast={addToast}
          />
        );
      case 'cards':
        return <VirtualCard userFullName={user.fullName} />;
      case 'me':
        return (
          <ProfileSettings
            userState={user}
            onToggleBiometrics={() => {
              setUser(prev => ({ ...prev, biometricsEnabled: !prev.biometricsEnabled }));
              addToast('🔐 Security Configured', `Biometrics toggled ${!user.biometricsEnabled ? 'ON' : 'OFF'}`, 'secure');
            }}
            onToggleShowBalance={() => {
              setUser(prev => ({ ...prev, showBalance: !prev.showBalance }));
            }}
            onResetData={resetAllSandboxData}
            onUpdateUsername={(newUsername) => {
              setUser(prev => ({ ...prev, fullName: newUsername }));
            }}
            onUpdateAccountNumber={(newAccountNumber) => {
              setUser(prev => ({ ...prev, opayAccountNumber: newAccountNumber }));
              addToast('✅ Account Updated', `Your OPay account number has been updated to ${newAccountNumber}`, 'success');
            }}
          />
        );
      default:
        // 'home' dashboard rendering with precision match to screenshot
        return (
          <div className="space-y-4">
            {/* Balance Card Section - OPay Brand Green (#00B875) */}
            <div 
              className="bg-[#00B875] rounded-[24px] p-4.5 text-white shadow-xs relative overflow-hidden flex flex-col justify-between h-[124px]"
            >
              {/* Top Row: Available Balance text with shield check & Eye on left, Transaction History on right */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 text-white/95">
                  <svg className="w-3.5 h-3.5 stroke-white stroke-[2.5] fill-none" viewBox="0 0 24 24">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <polyline points="9 11 11 13 15 9" />
                  </svg>
                  <span className="text-[11.5px] font-bold tracking-tight">Available Balance</span>
                  <button 
                    onClick={() => setUser(prev => ({ ...prev, showBalance: !prev.showBalance }))}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors cursor-pointer text-white flex items-center"
                  >
                    {user.showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
                <button 
                  onClick={() => setViewingAllTransactions(true)}
                  className="text-[11.5px] font-bold text-white/90 hover:underline flex items-center gap-0.5"
                >
                  <span className="tracking-tight">Transaction History</span>
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5px]" />
                </button>
              </div>

              {/* Middle Row & Bottom Row combined beautifully */}
              <div className="flex justify-between items-end mt-2">
                <div 
                  className="cursor-pointer flex items-center gap-1 group"
                  onClick={() => setViewingAllTransactions(true)}
                >
                  <span className="text-xl font-extrabold pb-0.5">₦</span>
                  <h1 className="text-[25px] font-black tracking-tight group-hover:underline leading-none">
                    {user.showBalance ? user.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '*****'}
                  </h1>
                  <ChevronRight className="w-6 h-6 text-white/90 stroke-[2.5px]" />
                </div>

                <button
                  onClick={() => setAddMoneyOpen(true)}
                  className="flex items-center gap-1 bg-white hover:bg-emerald-50 text-[#00B875] font-extrabold px-4 py-2 rounded-full transition-all text-xs active:scale-95 cursor-pointer select-none shadow-3xs"
                >
                  <Plus className="w-3 h-3 stroke-[4px]" />
                  <span>Add Money</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions Card in single White card matching exactly */}
            <div className="bg-white rounded-[24px] p-5 shadow-3xs border border-gray-100/50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider">Recent Transactions</h3>
                <button 
                  onClick={() => setViewingAllTransactions(true)}
                  className="text-[#00B875] text-xs font-black hover:underline"
                >
                  See All
                </button>
              </div>

              <div className="space-y-3">
                {transactions.slice(0, 2).map((tx) => (
                  <div 
                    key={tx.id}
                    onClick={() => setSelectedTransaction(tx)}
                    className="flex justify-between items-center cursor-pointer hover:bg-slate-50/80 p-2 rounded-2xl transition-all group"
                  >
                    <div className="flex items-center gap-3 font-sans">
                      {/* Unique, high-fidelity categories transaction icon */}
                      {renderTransactionIcon(tx.type)}
                      <div>
                        <h4 className="text-xs font-bold text-[#2D2D2D] group-hover:text-[#00B875] transition-colors line-clamp-1">
                          {tx.title}
                        </h4>
                        <p className="text-[10px] text-[#8C8C8C] mt-0.5 font-medium">
                          {tx.date}, {tx.time}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black font-mono block ${
                        tx.amount > 0 ? 'text-[#00B875]' : 'text-[#2D2D2D]'
                      }`}>
                        {tx.amount > 0 ? '+' : ''}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </span>
                      <span className="text-[8.5px] font-black text-[#00B875] bg-[#E2F7EE] px-1.8 py-0.5 rounded-full uppercase tracking-wider mt-1 inline-block">
                        {tx.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Transfer Actions in single White Card with pale mint bases */}
            <div className="bg-white rounded-[24px] p-5 shadow-3xs border border-gray-100/50">
              <div className="flex justify-between items-center gap-2">
                {[
                  { 
                    label: 'To OPay', 
                    action: () => setTransferType('OPay'), 
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        {/* Chat bubble with white avatar inside */}
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h3l3 3.5 3-3.5h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                        <circle cx="12" cy="8.2" r="2.2" fill="#FFFFFF" />
                        <path d="M7.8 14.5c0-1.5 1.5-2.5 4.2-2.5s4.2 1 4.2 2.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" />
                      </svg>
                    ) 
                  },
                  { 
                    label: 'To Bank', 
                    action: () => setTransferType('Bank'), 
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        <path d="M12 2L2 7v2h20V7L12 2zm-8 8v8h3v-8H4zm6 0v8h3v-8h-3zm6 0v8h3v-8h-3zM2 20v2h20v-2H2z" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Withdraw', 
                    action: () => { setActiveTab('me'); alert('Select a merchant bank card or dial *955# USSD offline to disburse cash safely.'); }, 
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-none" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="5.5" fill="#00B875" stroke="none" />
                        <path d="M8.5 15.5l7-7M11.5 8.5h4v4" stroke="#FFFFFF" strokeWidth="2.5" />
                      </svg>
                    )
                  }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="flex flex-col items-center group cursor-pointer active:scale-95 transition-all text-center flex-1"
                  >
                    <div className="w-12 h-12 bg-[#E2F7EE] rounded-[18px] flex items-center justify-center transition-all group-hover:scale-105 shadow-3xs">
                      {item.icon}
                    </div>
                    <span className="text-[12px] font-extrabold text-[#2D2D2D] mt-2 block tracking-tight leading-none group-hover:text-[#00B875] transition-colors">
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Services Grid in Symmetrical 2x4 with Pale Mint Icon bases */}
            <div className="bg-white rounded-[24px] p-5 shadow-3xs border border-gray-100/50">
              <div className="grid grid-cols-4 gap-y-5 gap-x-2 text-center">
                {[
                  { 
                    label: 'Airtime', 
                    action: () => alert('Airtime purchases instantly rewarded with up to 10% cashbacks!'),
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        <rect x="6" y="2" width="12" height="20" rx="3" />
                        {/* Signal strength cutouts in white inside */}
                        <rect x="9" y="14" width="1.5" height="4" rx="0.5" fill="#FFFFFF" />
                        <rect x="11.5" y="11" width="1.5" height="7" rx="0.5" fill="#FFFFFF" />
                        <rect x="14" y="8" width="1.5" height="10" rx="0.5" fill="#FFFFFF" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Data', 
                    action: () => alert('Select data plans from MTN, Airtel, Glo, & 9Mobile with cash discounts'),
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        <rect x="6" y="2" width="12" height="20" rx="3" />
                        {/* Up arrow in white */}
                        <path d="M10 13V7M8.5 9.5L10 7l1.5 2.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        {/* Down arrow in white */}
                        <path d="M14 11v6M12.5 14.5L14 17l1.5-2.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Betting', 
                    action: () => alert('Fund your sport-bet wallets with zero gateway charges'),
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        {/* Beautiful custom-detailed FIFA World Cup trophy silhouette */}
                        <path d="M12 2a3.5 3.5 0 0 1 3.5 3.5c0 1-.5 2-1.2 2.7l.7 2.3c.5.5.5 1.2.1 1.7L13 15c1 1.3.8 2.8.2 3.5h-2.4c-.6-.7-.8-2.2.2-3.5l-2.1-2.8c-.4-.5-.4-1.2.1-1.7l.7-2.3C8.7 7.5 8.2 6.5 8.2 5.5A3.5 3.5 0 0 1 12 2z" />
                        <rect x="8.5" y="18.5" width="7" height="1.5" rx="0.5" />
                        <rect x="7.5" y="20.5" width="9" height="2" rx="0.5" />
                      </svg>
                    )
                  },
                  { 
                    label: 'TV', 
                    action: () => alert('Pay DSTV, GOTV, and StarTimes TV bills easily'),
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        {/* Antennae */}
                        <path d="M17 2.5L12 6M7 2.5L12 6" stroke="#00B875" strokeWidth="2.2" strokeLinecap="round" />
                        {/* TV Chassis */}
                        <rect x="3" y="6" width="18" height="13" rx="3" />
                        {/* Play triangle inside chassis */}
                        <polygon points="10 10 15 12.5 10 15" fill="#FFFFFF" />
                      </svg>
                    )
                  },
                  { 
                    label: 'SafeBox', 
                    action: () => { setActiveTab('finance'); addToast('💰 SafeBox active', 'Redirected to high-growth financial vault.', 'secure'); },
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        <path d="M4 8a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V8z" />
                        <path d="M4 8c1-1.2 3.5-1.5 8-1.5s7 .3 8 1.5H4z" fill="#009C62" />
                        {/* Center Naira symbol in white */}
                        <circle cx="12" cy="14" r="3.5" fill="#00B875" />
                        <path d="M10 14h4M9.5 15l5-2" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
                      </svg>
                    )
                  },
                  { 
                    label: 'Loan', 
                    action: () => { setActiveTab('finance'); addToast('💸 Loan accounts active', 'Simulated quick loan eligibility checks.', 'alert'); },
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-none stroke-[#00B875] stroke-[2.2]" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="7.5" r="3.5" fill="#00B875" stroke="none" />
                        {/* Coin Naira strike in white */}
                        <path d="M10.5 7.5h3" stroke="#FFFFFF" strokeWidth="1.2" />
                        <path d="M9.8 8.5l4-2" stroke="#FFFFFF" strokeWidth="1.2" />
                        {/* Supporting hands below */}
                        <path d="M5.5 13c1 2.5 3 4 6.5 4s5.5-1.5 6.5-4" strokeWidth="2.2" />
                        <path d="M3.5 11c1 2 2 3 3.5 3.5M20.5 11c-1 2-2 3-3.5 3.5" strokeWidth="1.8" />
                      </svg>
                    )
                  },
                  { 
                    label: 'BizPayment', 
                    action: () => alert('Business point of sale settlement dashboards'),
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        {/* Canopy roof on top */}
                        <path d="M3 10l1.2-5h15.6l1.2 5c-1 1-2.5.5-3 .5s-2-.5-3-.5-2.5.5-3 .5-2-.5-3-.5c-1 0-2.5.5-3 .5s-2-.5-3-.5" />
                        {/* Base store building with a wide rounded arch door */}
                        <path d="M4.5 11v8a1 1 0 0 0 1 1h13a1 1 0 0 0 1-1v-8M9.5 20v-5a1.5 1.5 0 0 1 3 0v5" />
                      </svg>
                    )
                  },
                  { 
                    label: 'More', 
                    action: () => alert('Dozens of partner utilities, electricity tokens, estate bills, and transport vouchers.'),
                    icon: (
                      <svg viewBox="0 0 24 24" className="w-[22px] h-[22px] fill-[#00B875] stroke-none">
                        {/* Graduation cap shape */}
                        <path d="M12 2L4 6l8 4 8-4-8-4z" />
                        <path d="M6 8.5V13c0 1.5 2 2.5 6 2.5s6-1 6-2.5V8.5" />
                        {/* Spark/Bulb */}
                        <circle cx="7" cy="18" r="2.5" />
                        <path d="M7 21h1v1H6v-1z" />
                        {/* Play button */}
                        <rect x="14" y="15" width="6" height="5" rx="1.5" />
                        <polygon points="16.5 16.5 18.5 17.5 16.5 18.5" fill="#FFFFFF" />
                      </svg>
                    )
                  }
                ].map((srv, idx) => (
                  <button
                    key={idx}
                    onClick={srv.action}
                    className="flex flex-col items-center group cursor-pointer relative"
                  >
                    <div className="w-12 h-12 bg-[#E2F7EE] rounded-[16px] flex items-center justify-center transition-all group-hover:scale-105 active:scale-90 border border-transparent shadow-xs">
                      {srv.icon}
                    </div>
                    <span className="text-[11.5px] font-extrabold text-[#2D2D2D]/90 mt-1.8 block group-hover:text-[#00B875] transition-colors line-clamp-1 leading-none">{srv.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Recommendation Banner - "You May Also Like" */}
            <div className="space-y-3 pb-4">
              <h3 className="text-xs font-black text-[#2D2D2D] uppercase tracking-wider pl-1">
                You May Also Like
              </h3>
              
              <div className="bg-[#E2F7EE] rounded-[24px] p-5 border border-emerald-100/30 relative overflow-hidden flex items-center justify-between shadow-3xs">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-xl shadow-2xs">
                    💰
                  </div>
                  <div className="text-left">
                    <h4 className="text-xs font-extrabold text-[#2D2D2D]">SafeBox</h4>
                    <p className="text-[10px] text-[#8C8C8C] mt-0.5 leading-tight font-bold">Deposit & earn massive returns</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setActiveTab('finance'); }}
                  className="bg-[#00B875] hover:bg-[#00a367] text-white text-[11px] font-black py-2.5 px-5.5 rounded-full shadow-xs active:scale-95 cursor-pointer select-none uppercase tracking-wide"
                >
                  Go
                </button>
              </div>
            </div>

            {/* Floating Security Badge/Advisor checkmark in bottom corner inside our tab */}
            <div className="fixed bottom-24 right-5 sm:absolute sm:bottom-24 z-40">
              <button 
                onClick={() => addToast('🛡️ Safety Guarantee', 'Certified live validation under CBN framework guidelines.', 'secure')}
                className="bg-gradient-to-br from-[#00B875] to-[#00a367] text-white w-12 h-12 rounded-full flex flex-col items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white relative"
                title="OPay Customer Support Service"
              >
                <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-none stroke-white stroke-[3.5]" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#FF5A6A] rounded-full ring-2 ring-white"></span>
              </button>
            </div>

          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans flex flex-col justify-center items-center py-0 sm:py-6 relative selection:bg-[#00B875]/20">
      
      {/* Desktop Helper Banner */}
      <div className="hidden md:flex items-center gap-2.5 bg-white border border-gray-150 px-5 py-3 rounded-full shadow-xs max-w-lg mb-4 text-xs font-semibold text-gray-700">
        {/* <span className="w-2.5 h-2.5 bg-[#00B875] rounded-full animate-ping"></span> */}
        
      </div>

      {/* Primary Mobile Container Frame */}
      <div className="w-full sm:max-w-md bg-[#F6F6F6] h-screen sm:h-[90vh] sm:max-h-[920px] sm:min-h-[700px] sm:rounded-[36px] shadow-2xl flex flex-col relative overflow-hidden sm:border-[8px] sm:border-slate-800/90 hover:shadow-emerald-500/5 transition-all">
        
        {/* Dynamic Notch speaker decor on Desktop only */}
        <div className="hidden sm:block absolute top-0 inset-x-0 h-4 bg-slate-800/90 z-50">
          <div className="w-24 h-3.5 bg-black rounded-b-xl mx-auto flex items-center justify-center">
            <div className="w-8 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Content Outer Wrapper */}
        <div className="flex flex-col flex-1 sm:pt-4 overflow-y-auto no-scrollbar">
          {!isLoggedIn ? (
            <Login onLoginSuccess={handleLoginSuccess} userFullName={user.fullName} />
          ) : (
            <div className="flex-1 flex flex-col justify-between">

              {/* Header Navigation Section */}
              {!selectedTransaction && !viewingAllTransactions && (
                <div className={`px-6 py-3 flex items-center justify-between transition-all duration-300 ${
                  activeTab === 'home' 
                    ? 'bg-[#F6F6F6] text-[#2D2D2D] border-none' 
                    : 'bg-white text-gray-900 border-b border-gray-100 shadow-xs'
                }`}>
                  {/* Left greeting panel */}
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      {/* OPay Stylized Double Circular Logo with in-badge */}
                      <div className="w-8 h-8 rounded-full bg-[#E2F7EE] border border-emerald-100 flex items-center justify-center shadow-3xs">
                        <svg viewBox="0 0 100 100" className="w-[18px] h-[18px]">
                          <circle cx="50" cy="50" r="34" stroke="#00B875" strokeWidth="18" fill="none" />
                          <circle cx="50" cy="50" r="14" stroke="#00B875" strokeWidth="6" fill="#FFFFFF" />
                        </svg>
                      </div>
                      <span className="absolute -top-1 -right-1 bg-[#00B875] text-white text-[7.5px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-2xs">
                        2
                      </span>
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-[10px] font-bold text-[#8C8C8C] leading-none">Hi,</span>
                        <h2 className="text-sm font-black text-[#2D2D2D] tracking-tight uppercase leading-none">
                          {user.fullName}
                        </h2>
                      </div>
                    </div>
                  </div>

                  {/* Right Header Controls matching exact icons & red batch circular tag 10 */}
                  <div className="flex items-center gap-3.5">
                    {/* Help headcount icon */}
                    <button 
                      onClick={() => alert('OPay Help Desk: Call +234 1 888 8329 for support.')}
                      className="flex flex-col items-center hover:text-[#00B875] transition-colors relative"
                    >
                      <div className="absolute -top-3 bg-[#FF5A6A] text-white text-[6.5px] font-black px-1 rounded-sm leading-none py-0.5 shadow-3xs uppercase scale-90">
                        Help
                      </div>
                      <svg viewBox="0 0 24 24" className="w-5.5 h-5.5 fill-none stroke-current stroke-[2.2] text-[#2D2D2D]">
                        <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                        <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                      </svg>
                    </button>

                    {/* QR Scan icon */}
                    <button 
                      onClick={() => alert('Launch cellular barcode camera scanner to complete peer payments')}
                      className="hover:text-[#00B875] transition-colors"
                    >
                      <QrCode className="w-5.5 h-5.5 stroke-[2.2] text-[#2D2D2D]" />
                    </button>

                    {/* PWA Install Button */}
                    <InstallAppButton 
                      variant="icon" 
                      onInstallSuccess={() => addToast('📱 App Installed', 'OPay is now installed on your home screen!', 'success')}
                    />

                    {/* Notification bell with red badge 10 */}
                    <button 
                      onClick={() => setShowNotificationDrawer(true)}
                      className="relative hover:text-[#00B875] transition-colors"
                    >
                      <Bell className="w-5.5 h-5.5 stroke-[2.2] text-[#2D2D2D]" />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#FF5A6A] text-[8.5px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse shadow-2xs leading-none">
                        10
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Core Render Screen */}
              <div className="flex-1 overflow-y-auto no-scrollbar">
                {selectedTransaction ? (
                  <TransactionDetails
                    transaction={selectedTransaction}
                    userFullName={user.fullName}
                    userAccountNumber={user.opayAccountNumber}
                    onBack={() => setSelectedTransaction(null)}
                    onShared={() => addToast('📤 Shared Successfully', 'Transaction receipt shared.')}
                  />
                ) : viewingAllTransactions ? (
                  /* Detailed Transaction log screen exactly matching layout */
                  <div className="px-5 py-5 bg-slate-50 min-h-screen pb-24">
                    {/* Header bar */}
                    <div className="flex items-center justify-between mb-5 select-none pt-2">
                      <button 
                        onClick={() => setViewingAllTransactions(false)}
                        className="flex items-center gap-2 text-gray-800 hover:text-gray-950 transition-colors cursor-pointer"
                      >
                        <ChevronLeft className="w-5.5 h-5.5 text-gray-700 stroke-[2.2px]" />
                        <span className="text-[17.5px] font-medium tracking-tight">Transactions</span>
                      </button>
                      
                      <button 
                        onClick={() => alert('Downloading official PDF statement receipt of all transactions.')}
                        className="text-[#00B875] hover:text-[#00a367] text-[15.5px] font-semibold transition-colors cursor-pointer"
                      >
                        Download
                      </button>
                    </div>

                    {/* Filter categories dropdown widgets */}
                    <div className="flex gap-2.5 mb-5">
                      <div className="relative flex-1">
                        <select 
                          value={categoryFilter}
                          onChange={e => setCategoryFilter(e.target.value as any)}
                          className="w-full bg-[#f4f5f7] border border-transparent rounded-[14px] py-2.5 pl-4 pr-8 text-[12.5px] font-bold text-gray-600 appearance-none cursor-pointer focus:outline-none"
                        >
                          <option value="All">All Categories</option>
                          <option value="Transfer">Transfers</option>
                          <option value="Airtime">Airtime purchases</option>
                          <option value="Cashback">Cashbacks received</option>
                          <option value="Interest">Vault Interest</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-gray-500">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>

                      <div className="relative flex-1">
                        <select 
                          value={statusFilter}
                          onChange={e => setStatusFilter(e.target.value as any)}
                          className="w-full bg-[#f4f5f7] border border-transparent rounded-[14px] py-2.5 pl-4 pr-8 text-[12.5px] font-bold text-gray-600 appearance-none cursor-pointer focus:outline-none"
                        >
                          <option value="All">All Status</option>
                          <option value="Successful">Successful</option>
                          <option value="Pending">Pending</option>
                          <option value="Failed">Failed</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-gray-500">
                          <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic flow summary banner */}
                    <div className="bg-white rounded-[18px] p-4.5 shadow-3xs mb-4">
                      {/* Month & Analysis row with floating dropdown */}
                      <div className="flex justify-between items-center mb-3 relative">
                        <div 
                          onClick={() => setIsMonthPickerOpen(!isMonthPickerOpen)}
                          className="flex items-center gap-1 cursor-pointer select-none group"
                        >
                          <span className="text-[17px] font-bold text-gray-900 tracking-tight group-hover:text-[#00B875] transition-colors">
                            {selectedMonthYear === 'All' ? 'All Months' : selectedMonthYear}
                          </span>
                          <svg className={`w-3.5 h-3.5 text-gray-800 group-hover:text-[#00B875] ml-0.5 mt-0.5 fill-current transition-transform duration-200 ${isMonthPickerOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20">
                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                          </svg>
                        </div>
                        
                        <button 
                          onClick={() => alert('Analyzing monthly expenditure habits across certified nodes.')}
                          className="bg-[#00B875] hover:bg-[#00a367] text-white text-[12.5px] font-bold px-4 py-1.5 rounded-full transition-all active:scale-95 cursor-pointer leading-tight"
                        >
                          Analysis
                        </button>

                        {/* Floating Month/Year Selector Dropdown */}
                        {isMonthPickerOpen && (
                          <>
                            {/* Invisible background click interceptor to dismiss */}
                            <div 
                              className="fixed inset-0 z-30" 
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsMonthPickerOpen(false);
                              }}
                            />
                            <div className="absolute top-[32px] left-0 mt-1 bg-white border border-gray-150 rounded-2xl shadow-xl py-2 px-1 z-40 min-w-[140px] animate-fade-in divide-y divide-gray-50">
                              <div className="px-3 py-1.5 text-[9.5px] font-black text-gray-400 uppercase tracking-wider">
                                Select Period
                              </div>
                              <div className="py-1">
                                {uniqueMonths.map(mon => (
                                  <button
                                    key={mon}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedMonthYear(mon);
                                      setIsMonthPickerOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors rounded-lg flex items-center justify-between ${
                                      selectedMonthYear === mon 
                                        ? 'text-[#00B875] bg-[#E2F7EE]' 
                                        : 'text-gray-700 hover:bg-slate-50'
                                    }`}
                                  >
                                    <span>{mon}</span>
                                    {selectedMonthYear === mon && (
                                      <svg className="w-3.5 h-3.5 text-[#00B875] fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                                
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedMonthYear('All');
                                    setIsMonthPickerOpen(false);
                                  }}
                                  className={`w-full text-left px-3 py-2 text-xs font-bold transition-colors rounded-lg flex items-center justify-between mt-1 border-t border-gray-100 pt-1 ${
                                    selectedMonthYear === 'All' 
                                      ? 'text-[#00B875] bg-[#E2F7EE]' 
                                      : 'text-gray-500 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>All Months</span>
                                  {selectedMonthYear === 'All' && (
                                    <svg className="w-3.5 h-3.5 text-[#00B875] fill-none stroke-current stroke-[2.5]" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                  )}
                                </button>
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* In/Out details row */}
                      <div className="flex items-center gap-5 text-[12px] text-gray-400 font-medium">
                        <div>
                          <span>In: </span>
                          <span className="text-gray-800 font-bold font-mono">₦{totalInflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                          <span>Out: </span>
                          <span className="text-gray-800 font-bold font-mono">₦{totalOutflow.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scrollable list elements */}
                    <div className="space-y-3.5">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map(tx => (
                          <div
                            key={tx.id}
                            onClick={() => setSelectedTransaction(tx)}
                            className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-start cursor-pointer hover:border-emerald-250 active:scale-98 transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              {renderTransactionIcon(tx.type, "w-9 h-9 rounded-xl")}

                              <div>
                                <h4 className="text-xs font-extrabold text-gray-800 leading-tight group-hover:text-[#00B875] transition-colors">
                                  {tx.title}
                                </h4>
                                <span className="text-[10px] text-gray-400 font-medium mt-1 font-mono block">
                                  {tx.date} • {tx.time}
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <strong className={`text-xs font-extrabold font-mono ${
                                tx.amount > 0 ? 'text-[#00B875]' : 'text-gray-900'
                              }`}>
                                {tx.amount > 0 ? '+' : ''}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </strong>
                              
                              <span className="text-[8.5px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-sm block mt-1.5 text-center">
                                {tx.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-16 bg-white border border-gray-100 rounded-2xl">
                          <p className="text-xs text-gray-400 font-bold">No transactions found matching active filters</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Standard primary viewport padded nicely, omitting top padding for seamless home screen bleed */
                  <div className={`${
                    activeTab === 'home' ? 'px-6 pt-2 pb-8 bg-[#F6F6F6]' : 'p-5 bg-slate-50'
                  }`}>
                    {renderTabContent()}
                  </div>
                )}
              </div>

              {/* Tab Navigation Menu Footer exactly matching OPay styles */}
              {!selectedTransaction && !viewingAllTransactions && (
                <div className="bg-white border-t border-gray-100 py-3 px-3 flex justify-between items-center shadow-md">
                  {[
                    { id: 'home', label: 'Home', icon: Compass },
                    { id: 'rewards', label: 'Rewards', icon: Gift },
                    { id: 'finance', label: 'Finance', icon: TrendingUp },
                    { id: 'cards', label: 'Cards', icon: CreditCard },
                    { id: 'me', label: 'Me', icon: User }
                  ].map((tab) => {
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id as any);
                        }}
                        className={`flex flex-col items-center flex-1 cursor-pointer transition-all ${
                          isSelected ? 'text-[#00B875] scale-105' : 'text-gray-400 hover:text-gray-600'
                        }`}
                        id={`nav-tab-${tab.id}`}
                      >
                        {tab.id === 'home' ? (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                            isSelected ? 'bg-[#E2F7EE]' : ''
                          }`}>
                            <svg viewBox="0 0 100 100" className="w-[18px] h-[18px]">
                              <circle cx="50" cy="50" r="34" stroke={isSelected ? "#00B875" : "#9CA3AF"} strokeWidth="18" fill="none" />
                              <circle cx="50" cy="50" r="14" stroke={isSelected ? "#00B875" : "#9CA3AF"} strokeWidth="6" fill="#FFFFFF" />
                            </svg>
                          </div>
                        ) : (
                          <tab.icon className={`w-5.5 h-5.5 ${isSelected ? 'stroke-[3px]' : 'stroke-[2px]'}`} />
                        )}
                        <span className="text-[10px] font-bold tracking-tight mt-1 px-1.5 py-0.5 leading-none">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>

        {/* Floating surprise Gift Envelope widget at bottom-right corner for interactive excitement */}
        {isLoggedIn && !selectedTransaction && !viewingAllTransactions && activeTab === 'home' && bonusEnvelopeActive && (
          <div className="absolute right-4 bottom-20 z-30 pointer-events-auto">
            <button
              onClick={claimSurpriseGift}
              className="bg-radial from-amber-400 via-amber-500 to-yellow-500 text-white p-3.5 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all animate-bounce cursor-pointer relative group flex items-center justify-center border-2 border-white"
            >
              <div className="absolute -top-1 -right-1 bg-red-650 bg-red-650 bg-red-600 text-[8px] font-black text-white px-1.5 py-0.5 rounded-full uppercase tracking-wider scale-90">
                Gift
              </div>
              <Gift className="w-6 h-6 animate-pulse" />
            </button>
          </div>
        )}

        {/* Live Notification Drawer panel */}
        {showNotificationDrawer && (
          <div className="absolute inset-0 bg-black/50 z-50 flex justify-end">
            <div className="w-4/5 max-w-[320px] bg-white h-full p-6 flex flex-col justify-between shadow-2xl animate-slide-left">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100 mb-4">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Notification Chest</h3>
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                      setShowNotificationDrawer(false);
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto max-h-[80vh]">
                  {notifications.map(item => (
                    <div 
                      key={item.id} 
                      className={`p-3 rounded-xl border transition-colors ${
                        item.read ? 'border-gray-50 bg-gray-50/50' : 'border-emerald-100 bg-emerald-50/30'
                      }`}
                    >
                      <h4 className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                        <span>{item.title}</span>
                        {!item.read && <span className="w-1.5 h-1.5 bg-[#00B875] rounded-full"></span>}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-1 leading-snug">{item.body}</p>
                      <span className="text-[9px] text-gray-400 mt-2 block font-medium">{item.timestamp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setNotifications([]);
                  alert('Notification center fully cleared.');
                }}
                className="w-full bg-slate-50 border border-gray-100 hover:bg-slate-100 text-gray-500 text-xs font-bold py-2.5 rounded-xl text-center cursor-pointer"
              >
                Clear All Lists
              </button>
            </div>
          </div>
        )}

        {/* Add Money Popup form modal */}
        {addMoneyOpen && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-xs p-6 shadow-2xl animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Fund OPay Balance</span>
                <button onClick={() => setAddMoneyOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={executeWalletFunding} className="space-y-4">
                <p className="text-[10px] text-gray-400 leading-snug font-medium">
                  Refill active wallet funds using registered bank card. Simulated deposits will earn cashbacks!
                </p>

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Enter Deposit Amount (₦)</label>
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={e => setFundAmount(e.target.value)}
                    placeholder="e.g. 5000"
                    autoFocus
                    required
                    className="w-full bg-slate-50 border border-gray-150 rounded-xl py-3 px-4 font-extrabold text-lg text-gray-900 focus:outline-none focus:bg-white focus:border-[#00B875]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#00B875] text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:bg-[#00a367] transition-all cursor-pointer text-xs"
                >
                  Pay Instant Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Instant transfer drawers */}
        <InstallAppModal />

        <TransferDrawer
          isOpen={transferType !== null}
          onClose={() => setTransferType(null)}
          availableBalance={user.balance}
          owealthBalance={user.owealthBalance}
          beneficiaries={beneficiaries}
          transferType={transferType || 'OPay'}
          onTransferSuccess={handleTransferExecuted}
          userFullName={user.fullName}
          userAccountNumber={user.opayAccountNumber}
        />

        {/* Slide down Toast Alert Banner removed to prevent popup distraction as per user request */}

      </div>
    </div>
  );
}
