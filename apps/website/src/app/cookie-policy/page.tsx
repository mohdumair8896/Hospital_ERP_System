import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { Cookie, ShieldCheck, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy & Web Tracking Practices | ProHealth Hospital',
  description: 'Detailed explanation of strictly necessary session cookies, functional preferences, and our strict prohibition of non-clinical marketing pixels.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="relative py-14 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 relative">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">Cookie Policy</span>
          </nav>
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#1F5084] bg-[#1F5084]/10 px-2.5 py-0.5 rounded border border-[#1F5084]/20">
              Web Tracking Governance
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              Cookie Policy &amp; Patient Web Privacy
            </h1>
            <p className="text-xs text-[#475467]">
              Last Updated: September 13, 2026 | Compliant with HHS OCR Guidance &amp; GDPR
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full space-y-10 text-xs text-slate-700 leading-relaxed">
        {/* Anti-Tracker Pledge */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>ProHealth Strict Anti-Tracking Guarantee</span>
          </div>
          <p className="text-xs text-emerald-900/90 leading-relaxed">
            Following U.S. Department of Health and Human Services (HHS) Office for Civil Rights guidelines on online tracking technologies, ProHealth does NOT deploy third-party advertising trackers (such as Meta Pixel or commercial ad re-targeting beacons) on any patient portal, appointment booking, or medical condition pages.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            1. What Are Cookies and Local Web Storage?
          </h2>
          <p>
            Cookies are small cryptographic text files placed on your browser or device when visiting web domains. They allow our systems to recognize returning users, preserve patient authentication states, prevent cross-site request forgery (CSRF), and maintain session integrity across our secure healthcare services.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 font-display">
            2. Categories of Cookies Deployed on ProHealth Domains
          </h2>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-slate-900 text-xs">Strictly Necessary Cookies (Always Active)</strong>
                <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                  Required
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Essential for core navigation, authentication sessions, cryptographic trace headers (<code className="text-slate-800">X-Trace-Id</code>), and appointment reservation queues. These cookies cannot be disabled.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-slate-900 text-xs">Functional & Preference Cookies</strong>
                <span className="text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Optional
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Remember your preferred hospital location, font accessibility preferences, and pre-selected department filters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex justify-between items-center">
                <strong className="text-slate-900 text-xs">De-Identified Performance Analytics</strong>
                <span className="text-[10px] uppercase font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  HIPAA-Sanitized
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Collect aggregated, non-individually identifiable metrics regarding server response times, load balancer latencies, and 404 dead link counts to optimize clinical infrastructure.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            3. Managing Your Cookie Preferences
          </h2>
          <p>
            You can modify your cookie settings at any time by selecting the Cookie Preferences link in our footer, or by adjusting your browser settings to block or notify you about cookies. Note that blocking strictly necessary cookies will impair your ability to log into the patient portal or schedule live appointments.
          </p>
        </section>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
