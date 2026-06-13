/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NIGERIAN_BANKS_FULL } from '../utils/bankData.ts';

interface BankLogoComponentProps {
  bankName: string;
  sizeClass?: string;
}

export default function BankLogoComponent({ bankName, sizeClass = 'w-10 h-10' }: BankLogoComponentProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [fallbackIndex, setFallbackIndex] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  // Normalize name to map to the correct logos
  const nameLower = bankName.toLowerCase();

  // Find the bank configuration in our complete list
  const bankConfig = NIGERIAN_BANKS_FULL.find(b => {
    const configName = b.name.toLowerCase();
    return (
      nameLower.includes(configName) || 
      configName.includes(nameLower) ||
      (nameLower.includes('uba') && configName.includes('uba')) ||
      (nameLower.includes('access') && configName.includes('access')) ||
      (nameLower.includes('gtb') && configName.includes('guaranty trust')) ||
      (nameLower.includes('first bank') && configName.includes('first bank')) ||
      (nameLower.includes('moniepoint') && configName.includes('moniepoint')) ||
      (nameLower.includes('wema') && configName.includes('wema'))
    );
  });

  const urls = bankConfig?.fallbackUrls || [];

  useEffect(() => {
    if (urls.length > 0) {
      setImgSrc(urls[0]);
      setFallbackIndex(0);
      setHasFailed(false);
    } else {
      setImgSrc(null);
      setHasFailed(true);
    }
  }, [bankName, urls.length]);

  const handleImageError = () => {
    const nextIdx = fallbackIndex + 1;
    if (nextIdx < urls.length) {
      setFallbackIndex(nextIdx);
      setImgSrc(urls[nextIdx]);
    } else {
      setHasFailed(true);
    }
  };

  // If we have an image link and it hasn't failed, render it beautifully with wrapper and placeholder
  if (imgSrc && !hasFailed) {
    return (
      <div className={`${sizeClass} rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-slate-100 overflow-hidden relative`}>
        <img
          src={imgSrc}
          alt={bankName}
          onError={handleImageError}
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-0.5"
        />
      </div>
    );
  }

  // Beautiful visual design-forward fallback initials with specialized background gradients for matching keys!
  const firstLetter = bankName.charAt(0).toUpperCase();
  let bgClass = "bg-linear-to-tr from-slate-100 to-slate-200 text-slate-700 border-slate-200";
  let letterColor = "text-slate-700";

  if (nameLower.includes('opay')) {
    bgClass = "bg-linear-to-tr from-emerald-500 to-emerald-600 border-emerald-400";
    letterColor = "text-white";
  } else if (nameLower.includes('moniepoint') || nameLower.includes('monie point')) {
    bgClass = "bg-[#0051ff] border-blue-600";
    letterColor = "text-white";
  } else if (nameLower.includes('access')) {
    bgClass = "bg-black border-gray-800";
    letterColor = "text-[#FF5500]";
  } else if (nameLower.includes('uba') || nameLower.includes('united bank')) {
    bgClass = "bg-linear-to-tr from-[#D32F2F] to-[#E53935] border-red-500";
    letterColor = "text-white";
  } else if (nameLower.includes('first bank') || nameLower.includes('firstbank')) {
    bgClass = "bg-linear-to-tr from-[#0b2545] to-[#134074] border-blue-900";
    letterColor = "text-yellow-500";
  } else if (nameLower.includes('gtbank') || nameLower.includes('guaranty trust') || nameLower.includes('gtb')) {
    bgClass = "bg-linear-to-tr from-[#E65100] to-[#FF6D00] border-orange-600";
    letterColor = "text-white";
  } else if (nameLower.includes('zenith')) {
    bgClass = "bg-white border-red-200 shadow-3xs";
    letterColor = "text-red-600 font-serif italic font-black";
  } else if (nameLower.includes('kuda')) {
    bgClass = "bg-linear-to-tr from-[#400080] to-[#5a00b3] border-indigo-900";
    letterColor = "text-[#1BE0D0]";
  } else if (nameLower.includes('palmpay')) {
    bgClass = "bg-linear-to-tr from-[#5E2B97] to-[#7B3FBC] border-purple-900";
    letterColor = "text-white";
  } else if (nameLower.includes('wema')) {
    bgClass = "bg-linear-to-tr from-[#8A0F54] to-[#A31665] border-pink-950";
    letterColor = "text-white";
  } else if (nameLower.includes('stanbic')) {
    bgClass = "bg-[#0033A0] border-blue-900";
    letterColor = "text-white";
  } else if (nameLower.includes('sterling')) {
    bgClass = "bg-linear-to-tr from-[#D32F2F] to-[#E53935] border-red-700";
    letterColor = "text-white";
  } else if (nameLower.includes('fidelity')) {
    bgClass = "bg-linear-to-tr from-[#022c22] to-[#043d30] border-emerald-950";
    letterColor = "text-white";
  } else if (nameLower.includes('fcmb')) {
    bgClass = "bg-linear-to-tr from-purple-800 to-indigo-900 border-indigo-950";
    letterColor = "text-yellow-500";
  } else {
    // Generate an alphabetical background pattern
    if (firstLetter >= 'A' && firstLetter <= 'F') {
      bgClass = "bg-linear-to-tr from-slate-100 to-slate-200 border-slate-300";
      letterColor = "text-slate-700";
    } else if (firstLetter >= 'G' && firstLetter <= 'M') {
      bgClass = "bg-linear-to-tr from-[#E2F7EE] to-[#CBEFE1] border-emerald-200";
      letterColor = "text-[#00B875]";
    } else if (firstLetter >= 'N' && firstLetter <= 'T') {
      bgClass = "bg-linear-to-tr from-indigo-50 to-indigo-100 border-indigo-200";
      letterColor = "text-indigo-700";
    } else {
      bgClass = "bg-linear-to-tr from-amber-50 to-amber-100 border-amber-200";
      letterColor = "text-amber-800";
    }
  }

  return (
    <div className={`${sizeClass} rounded-full ${bgClass} flex items-center justify-center font-black shrink-0 border uppercase text-center select-none shadow-3xs`}>
      <span className={`${letterColor} font-sans`}>{firstLetter}</span>
    </div>
  );
}
