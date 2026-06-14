/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  title: string;
  type: 'airtime' | 'bonus' | 'transfer_out' | 'transfer_in' | 'owealth_interest' | 'deposit';
  amount: number;
  status: 'Successful' | 'Failed' | 'Pending';
  date: string; // ISO string or human formatted
  time: string; // HH:MM:SS
  category: string;
  recipientMobile?: string;
  recipientBank?: string;
  recipientAccount?: string;
  recipientName?: string;
  paymentMethod?: string;
  transactionNo: string;
  sessionId?: string;
  notes?: string;
}

export interface Beneficiary {
  id: string;
  name: string;
  accountNo: string;
  bankName: string;
  avatar?: string;
  type: 'OPay' | 'Bank';
  isMerchant?: boolean;
  isBizPayment?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface UserState {
  fullName: string;
  phoneNumber: string;
  balance: number;
  bonusBalance: number;
  showBalance: boolean;
  owealthBalance: number;
  owealthInterestRate: number;
  tierLevel: 1 | 2 | 3;
  biometricsEnabled: boolean;
  pinCode: string;
  opayAccountNumber: string;
}
