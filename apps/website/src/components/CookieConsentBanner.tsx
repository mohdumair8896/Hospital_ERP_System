'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';

export default function CookieConsentBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const consent = localStorage.getItem('prohealth_cookie_consent');
    if (!consent) {
      // Delay slightly for smooth appearance
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!mounted || !visible) return null;

  const handleAcceptAll = () => {
    localStorage.setItem('prohealth_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: true,
      preferences: true,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem('prohealth_cookie_consent', JSON.stringify({
      necessary: true,
      analytics: false,
      preferences: false,
      timestamp: new Date().toISOString()
    }));
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-white border border-[#E4E7EC] text-[#1D2939] p-5 rounded-2xl shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-[#1F5084] font-bold text-sm">
            <Cookie className="w-5 h-5 text-[#1F5084] shrink-0" />
            <span>Privacy &amp; Cookie Preferences</span>
          </div>
          <button
            onClick={handleNecessaryOnly}
            aria-label="Close and accept necessary only"
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#475467] leading-relaxed">
          ProHealth utilizes strictly necessary cookies for session security, cryptographic audit verification, and essential appointment booking. We do not sell your personal data or deploy non-clinical marketing trackers.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
          <button
            onClick={handleAcceptAll}
            className="w-full sm:w-auto flex-1 bg-[#1F5084] hover:bg-[#164273] text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            Accept All
          </button>
          <button
            onClick={handleNecessaryOnly}
            className="w-full sm:w-auto bg-[#F8FAFC] hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-semibold py-2.5 px-3 rounded-xl border border-slate-200 transition-all text-center"
          >
            Necessary Only
          </button>
        </div>

        <div className="text-[11px] text-slate-400 text-center sm:text-left pt-1 flex items-center justify-between">
          <Link href="/cookie-policy" className="underline hover:text-[#1F5084] transition-colors">
            Cookie Policy
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/privacy-policy" className="underline hover:text-[#1F5084] transition-colors">
            HIPAA Privacy Notice
          </Link>
          <span className="text-slate-300">•</span>
          <span className="text-emerald-600 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            HIPAA Safe
          </span>
        </div>
      </div>
    </div>
  );
}
