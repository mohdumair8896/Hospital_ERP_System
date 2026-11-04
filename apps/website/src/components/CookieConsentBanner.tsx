'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

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

  /*
   * Placement: the emergency FAB (bottom-6 right-6, 56px, z-45) and the triage
   * launcher above it own the bottom-right column. On phones the banner stops
   * 5.5rem from the right edge so both stay visible and tappable; from `sm` it
   * sits bottom-left and never grows wider than the space left of that column.
   * z-[44] keeps it under the FAB and under z-50 dialogs.
   */
  return (
    <div
      role="region"
      aria-label="Cookie and Privacy Consent"
      className="fixed bottom-4 left-4 right-[5.5rem] sm:left-6 sm:right-auto sm:w-[min(28rem,calc(100vw-17rem))] z-[44] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 duration-400 ease-out-soft"
    >
      <div className="bg-white border border-prohealth-border text-prohealth-heading p-4 sm:p-5 rounded-2xl shadow-2xl space-y-3 max-h-[calc(100vh-2rem)] overflow-y-auto">
        <div className="flex items-start justify-between gap-3">
          <p className="flex items-center gap-2 text-prohealth-primary font-bold text-sm">
            <Cookie className="w-5 h-5 shrink-0" aria-hidden="true" />
            <span>Privacy &amp; Cookie Preferences</span>
          </p>
          <button
            onClick={handleNecessaryOnly}
            aria-label="Close and accept necessary only"
            className={`text-prohealth-muted hover:text-slate-800 transition-colors p-1 -m-1 rounded-full ${FOCUS_RING}`}
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <p className="text-xs sm:text-sm text-prohealth-body leading-relaxed">
          ProHealth utilizes strictly necessary cookies for session security, cryptographic audit verification, and essential appointment booking. We do not sell your personal data or deploy non-clinical marketing trackers.
        </p>

        <div className="pt-1 flex flex-wrap items-center gap-2">
          <button
            onClick={handleAcceptAll}
            className={`flex-1 min-w-[6.5rem] bg-prohealth-primary hover:bg-prohealth-primary-hover text-white font-bold text-xs sm:text-sm py-2.5 px-3 rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 ${FOCUS_RING}`}
          >
            <Check className="w-4 h-4" aria-hidden="true" />
            Accept All
          </button>
          <button
            onClick={handleNecessaryOnly}
            className={`flex-1 min-w-[6.5rem] bg-prohealth-canvas hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs sm:text-sm font-semibold whitespace-nowrap py-2.5 px-2 sm:px-3 rounded-xl border border-slate-200 transition-colors text-center ${FOCUS_RING}`}
          >
            Necessary Only
          </button>
        </div>

        <div className="text-xs text-prohealth-muted pt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <Link href="/cookie-policy" className={`underline hover:text-prohealth-primary transition-colors rounded ${FOCUS_RING}`}>
            Cookie Policy
          </Link>
          <span aria-hidden="true">•</span>
          <Link href="/privacy-policy" className={`underline hover:text-prohealth-primary transition-colors rounded ${FOCUS_RING}`}>
            HIPAA Privacy Notice
          </Link>
          <span aria-hidden="true">•</span>
          <span className="text-care flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            HIPAA Safe
          </span>
        </div>
      </div>
    </div>
  );
}
