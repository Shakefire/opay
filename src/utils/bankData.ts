/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Bank {
  name: string;
  letter: string;
  logoKey?: string;
  fallbackUrls?: string[];
}

export const NIGERIAN_BANKS_FULL: Bank[] = [
  { name: 'OPay', letter: 'O', logoKey: 'opay', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/opay-digital-services-limited-opay.png'
  ]},
  { name: 'PalmPay', letter: 'P', logoKey: 'palmpay', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/palmpay-limited-palmpay.png'
  ]},
  { name: 'Moniepoint MFB', letter: 'M', logoKey: 'moniepoint', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/moniepoint-microfinance-bank-limited.png'
  ]},
  { name: 'Kuda Bank', letter: 'K', logoKey: 'kuda', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/kuda-bank.png'
  ]},
  { name: 'Access Bank', letter: 'A', logoKey: 'access', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/access-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/access-bank-plc.png'
  ]},
  { name: 'Access Bank (Diamond alternative)', letter: 'A', logoKey: 'access', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/access-bank.png'
  ]},
  { name: 'ALAT by Wema', letter: 'A', logoKey: 'wema', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/wema-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/wema-bank-plc.png'
  ]},
  { name: 'Citibank Nigeria', letter: 'C', logoKey: 'citibank', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/citibank.png'
  ]},
  { name: 'Carbon', letter: 'C', logoKey: 'carbon', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/carbon.png'
  ]},
  { name: 'Coronation Merchant Bank', letter: 'C', logoKey: 'coronation' },
  { name: 'Ecobank Nigeria', letter: 'E', logoKey: 'ecobank', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/ecobank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/ecobank-nigeria.png'
  ]},
  { name: 'Eyowo', letter: 'E', logoKey: 'eyowo' },
  { name: 'Fidelity Bank', letter: 'F', logoKey: 'fidelity', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/fidelity-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/fidelity-bank-plc.png'
  ]},
  { name: 'First Bank of Nigeria', letter: 'F', logoKey: 'firstbank', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/first-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/first-bank-of-nigeria-plc.png'
  ]},
  { name: 'First City Monument Bank (FCMB)', letter: 'F', logoKey: 'fcmb', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/fcmb.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/fcmb.png'
  ]},
  { name: 'FSDH Merchant Bank', letter: 'F', logoKey: 'fsdh' },
  { name: 'Globus Bank', letter: 'G', logoKey: 'globus', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/globus-bank.png'
  ]},
  { name: 'Guaranty Trust Bank (GTB)', letter: 'G', logoKey: 'gtbank', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/gtbank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/guaranty-trust-bank-plc.png'
  ]},
  { name: 'Heritage Bank', letter: 'H', logoKey: 'heritage', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/heritage-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/heritage-bank.png'
  ]},
  { name: 'Hope PSBank', letter: 'H', logoKey: 'hope' },
  { name: 'Jaiz Bank', letter: 'J', logoKey: 'jaiz', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/jaiz-bank.png'
  ]},
  { name: 'Keystone Bank', letter: 'K', logoKey: 'keystone', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/keystone-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/keystone-bank.png'
  ]},
  { name: 'Lotus Bank', letter: 'L', logoKey: 'lotus', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/lotus-bank.png'
  ]},
  { name: 'Mutual Trust MFB', letter: 'M', logoKey: 'mutualtrust' },
  { name: 'Nova Merchant Bank', letter: 'N', logoKey: 'nova' },
  { name: 'Optimus Bank', letter: 'O', logoKey: 'optimus' },
  { name: 'Parallex Bank', letter: 'P', logoKey: 'parallex', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/parallex-bank.png'
  ]},
  { name: 'Parkway ReadyCash', letter: 'P', logoKey: 'parkway' },
  { name: 'Paycom MFB (OPay)', letter: 'P', logoKey: 'opay', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/opay-digital-services-limited-opay.png'
  ]},
  { name: 'Polaris Bank', letter: 'P', logoKey: 'polaris', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/polaris-bank.png'
  ]},
  { name: 'Providus Bank', letter: 'P', logoKey: 'providus', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/providus-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/providus-bank.png'
  ]},
  { name: 'Rubies Bank', letter: 'R', logoKey: 'rubies' },
  { name: 'Safe Haven MFB', letter: 'S', logoKey: 'safehaven' },
  { name: 'Sparkle Bank', letter: 'S', logoKey: 'sparkle' },
  { name: 'Stanbic IBTC Bank', letter: 'S', logoKey: 'stanbic', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/stanbic-ibtc.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/stanbic-ibtc-bank-plc.png'
  ]},
  { name: 'Standard Chartered Bank', letter: 'S', logoKey: 'standard', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/standard-chartered.png'
  ]},
  { name: 'Sterling Bank', letter: 'S', logoKey: 'sterling', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/sterling-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/sterling-bank-plc.png'
  ]},
  { name: 'SunTrust Bank', letter: 'S', logoKey: 'suntrust', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/suntrust-bank.png'
  ]},
  { name: 'Taj Bank', letter: 'T', logoKey: 'taj', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/taj-bank.png'
  ]},
  { name: 'Titan Trust Bank', letter: 'T', logoKey: 'titan', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/titan-trust-bank.png'
  ]},
  { name: 'Union Bank of Nigeria', letter: 'U', logoKey: 'union', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/union-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/union-bank-of-nigeria-plc.png'
  ]},
  { name: 'United Bank for Africa (UBA)', letter: 'U', logoKey: 'uba', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/uba.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/united-bank-for-africa-plc.png'
  ]},
  { name: 'Unity Bank', letter: 'U', logoKey: 'unity', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/unity-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/unity-bank-plc.png'
  ]},
  { name: 'VFD Microfinance Bank', letter: 'V', logoKey: 'vfd', fallbackUrls: [
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/vfd-microfinance-bank.png'
  ]},
  { name: 'Wema Bank', letter: 'W', logoKey: 'wema', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/wema-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/wema-bank-plc.png'
  ]},
  { name: 'Zenith Bank', letter: 'Z', logoKey: 'zenith', fallbackUrls: [
    'https://techbrij.github.io/nigerian-banks/assets/img/zenith-bank.png',
    'https://cdn.jsdelivr.net/gh/matthewofomi/nigerian-bank-logos@master/assets/zenith-bank-plc.png'
  ]},
  { name: 'AAA FINANCE', letter: 'A' },
  { name: 'AACB MFB', letter: 'A' },
  { name: 'AB Microfinance Bank', letter: 'A' },
  { name: 'ABSU MFB', letter: 'A' },
  { name: 'ABU MFB', letter: 'A' },
  { name: 'ABUCOOP MICROFINANCE BANK LIMITED', letter: 'A' },
  { name: 'ADA MFB', letter: 'A' },
  { name: 'ADEYEMI COLLEGE STAFF MFB', letter: 'A' }
].sort((a, b) => a.name.localeCompare(b.name));

export const FREQUENT_BANKS = [
  'OPay',
  'Access Bank',
  'United Bank for Africa (UBA)',
  'First Bank of Nigeria',
  'Guaranty Trust Bank (GTB)',
  'Zenith Bank',
  'Moniepoint MFB',
  'PalmPay',
  'Kuda Bank'
];
