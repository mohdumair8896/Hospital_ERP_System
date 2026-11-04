import React from 'react';
import type { Metadata } from 'next';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { PolicyLayout, type PolicySection } from '../../components/content/PolicyLayout';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy & Web Tracking Practices',
  description: 'Detailed explanation of strictly necessary session cookies, functional preferences, and our strict prohibition of non-clinical marketing pixels.',
};

const COOKIE_CATEGORIES = [
  {
    title: 'Strictly Necessary Cookies (Always Active)',
    tag: 'Required',
    tagClass: 'text-cyan-800 bg-cyan-50 border-cyan-200',
    body: (
      <>
        Essential for core navigation, authentication sessions, cryptographic trace headers (<code className="text-slate-800">X-Trace-Id</code>), and appointment reservation queues. These cookies cannot be disabled.
      </>
    ),
  },
  {
    title: 'Functional & Preference Cookies',
    tag: 'Optional',
    tagClass: 'text-slate-700 bg-slate-100 border-slate-200',
    body: <>Remember your preferred hospital location, font accessibility preferences, and pre-selected department filters.</>,
  },
  {
    title: 'De-Identified Performance Analytics',
    tag: 'HIPAA-Sanitized',
    tagClass: 'text-slate-700 bg-slate-100 border-slate-200',
    body: (
      <>
        Collect aggregated, non-individually identifiable metrics regarding server response times, load balancer latencies, and 404 dead link counts to optimize clinical infrastructure.
      </>
    ),
  },
];

const SECTIONS: PolicySection[] = [
  {
    id: 'what-are-cookies',
    title: 'What Are Cookies and Local Web Storage?',
    content: (
      <p>
        Cookies are small cryptographic text files placed on your browser or device when visiting web domains. They allow our systems to recognize returning users, preserve patient authentication states, prevent cross-site request forgery (CSRF), and maintain session integrity across our secure healthcare services.
      </p>
    ),
  },
  {
    id: 'categories',
    title: 'Categories of Cookies Deployed on ProHealth Domains',
    content: (
      <div className="space-y-3">
        {COOKIE_CATEGORIES.map((cat) => (
          <div key={cat.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex flex-wrap justify-between items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">{cat.title}</h3>
              <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded border ${cat.tagClass}`}>{cat.tag}</span>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{cat.body}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'managing',
    title: 'Managing Your Cookie Preferences',
    content: (
      <p>
        You can modify your cookie settings at any time by selecting the Cookie Preferences link in our footer, or by adjusting your browser settings to block or notify you about cookies. Note that blocking strictly necessary cookies will impair your ability to log into the patient portal or schedule live appointments.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      <PolicyLayout
        breadcrumb="Cookie Policy"
        badge="Web Tracking Governance"
        title="Cookie Policy & Patient Web Privacy"
        meta="Last Updated: September 13, 2026 | Compliant with HHS OCR Guidance & GDPR"
        intro={
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
            <p className="flex items-center gap-2 font-bold text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" aria-hidden="true" />
              <span>ProHealth Strict Anti-Tracking Guarantee</span>
            </p>
            <p className="text-sm text-emerald-900 leading-relaxed">
              Following U.S. Department of Health and Human Services (HHS) Office for Civil Rights guidelines on online tracking technologies, ProHealth does NOT deploy third-party advertising trackers (such as Meta Pixel or commercial ad re-targeting beacons) on any patient portal, appointment booking, or medical condition pages.
            </p>
          </div>
        }
        sections={SECTIONS}
      />

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
