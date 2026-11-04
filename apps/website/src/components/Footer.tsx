'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Stethoscope,
  ArrowUp,
  Send,
  Info,
} from 'lucide-react';

/** White ring for the dark footer background. */
const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-prohealth-primary';

const QUICK_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/departments', label: 'Departments' },
  { href: '/doctors', label: 'Doctors Directory' },
  { href: '/timetable', label: 'Clinic Timetable' },
  { href: '/appointments', label: 'Book Appointment' },
  { href: '/contact', label: 'Contact Us' },
];

/** Ids match DEPARTMENTS in data/hospitalData.ts (the static /departments/[id] pages). */
const DEPARTMENT_LINKS = [
  { href: '/departments/dept_card', label: 'Cardiology & Heart Center' },
  { href: '/departments/dept_emrg', label: 'Emergency & Level 1 Trauma' },
  { href: '/departments/dept_peds', label: 'Pediatrics & Neonatology' },
  { href: '/departments/dept_neuro', label: 'Neurology & Neurosurgery' },
  { href: '/departments/dept_obgyn', label: 'Gynecology & Obstetrics' },
  { href: '/departments/dept_ortho', label: 'Orthopedics & Joint Replacement' },
];

const LEGAL_LINKS = [
  { href: '/privacy-policy', label: 'Privacy Policy (HIPAA)' },
  { href: '/terms', label: 'Terms of Care' },
  { href: '/cookie-policy', label: 'Cookie Policy' },
  { href: '/refund-policy', label: 'Billing & Refund Policy' },
];


const linkClass = `rounded hover:text-white transition-colors ${FOCUS_RING}`;

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  // There is no newsletter service yet, so we say so instead of faking a subscription.
  const [notice, setNotice] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) setNotice(true);
  };

  const scrollToTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden bg-prohealth-primary text-slate-200 text-sm pt-16 pb-8 border-t border-[#265d96]">
      {/* Ghost wordmark (C36): decorative, 4% white, cropped by the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 -bottom-[3vw] flex justify-center font-display font-extrabold leading-none tracking-tight text-[18vw] text-white/[0.04] whitespace-nowrap"
      >
        ProHealth
      </div>

      <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Brand & contact */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className={`inline-flex items-center gap-2.5 rounded-xl ${FOCUS_RING}`}>
              <span className="w-10 h-10 rounded-xl bg-white text-prohealth-primary flex items-center justify-center shadow-md">
                <Stethoscope className="w-6 h-6" aria-hidden="true" />
              </span>
              <span className="text-xl font-extrabold text-white font-display">
                Pro<span className="text-sky-300">Health</span>
                <span className="text-xs text-white font-bold ml-1.5 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 border border-white/20">
                  Hospital
                </span>
              </span>
            </Link>

            <p className="text-sm text-slate-200 leading-relaxed lg:pr-6">
              ProHealth Academic Medical Center is dedicated to providing high-quality, compassionate clinical healthcare services, advanced robotic surgical interventions, and integrated medical education.
            </p>

            <ul className="space-y-3 text-sm text-slate-100">
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 shrink-0">
                  <Phone className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="text-xs text-slate-300 block">Telephone Inquiries</span>
                  <a href="tel:1234567890" className={`font-bold ${linkClass}`}>123-456-7890</a>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 shrink-0">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="text-xs text-slate-300 block">Official Support Email</span>
                  <a href="mailto:infotech@prohealth.com" className={`font-bold ${linkClass}`}>infotech@prohealth.com</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="text-xs text-slate-300 block">Hospital Campus Address</span>
                  <span className="font-medium">123 Healthcare Blvd, Suite 400, New York, NY 10016</span>
                </span>
              </li>
            </ul>
          </div>

          <nav aria-labelledby="footer-quick-links" className="lg:col-span-2 space-y-4">
            <h2 id="footer-quick-links" className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h2>
            <ul className="space-y-2.5 text-sm text-slate-200">
              {QUICK_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-departments" className="lg:col-span-3 space-y-4">
            <h2 id="footer-departments" className="text-sm font-bold text-white uppercase tracking-wider">Departments</h2>
            <ul className="space-y-2.5 text-sm text-slate-200">
              {DEPARTMENT_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter & socials */}
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Be Our Subscribers</h2>
            <p className="text-sm text-slate-200 leading-relaxed">
              To get the latest updates on medical discoveries, health tips, and clinic timetables, subscribe below.
            </p>

            {/* Glass newsletter pill (C37) */}
            <form onSubmit={handleSubscribe}>
              <label htmlFor="footer-newsletter" className="sr-only">Email address</label>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 p-1.5 pl-4 transition-colors focus-within:bg-white/15 focus-within:border-white/40">
                <input
                  id="footer-newsletter"
                  type="email"
                  required
                  autoComplete="email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setNotice(false);
                  }}
                  placeholder="Enter your email address"
                  className="min-w-0 flex-1 bg-transparent text-sm text-white placeholder:text-slate-300 focus:outline-none"
                />
                <button
                  type="submit"
                  className={`shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white text-prohealth-primary hover:bg-slate-100 px-4 py-2 text-sm font-bold transition-colors ${FOCUS_RING}`}
                >
                  <Send className="w-3.5 h-3.5" aria-hidden="true" />
                  Subscribe
                </button>
              </div>
            </form>
            <p id="footer-newsletter-status" role="status">
              {notice && (
                <span className="flex items-start gap-2 rounded-xl bg-white/10 border border-white/20 p-3 text-sm text-slate-100">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-sky-300" aria-hidden="true" />
                  <span>
                    Thanks for your interest. Email sign-up isn’t available online yet, so we haven’t saved your address. Meanwhile, see our{' '}
                    <Link href="/blog" className={`font-semibold underline underline-offset-2 ${linkClass}`}>Health Insights</Link>.
                  </span>
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Legal bar & back to top */}
        <div className="pt-8 flex flex-col lg:flex-row justify-between items-center text-xs text-slate-300 gap-4 text-center lg:text-left">
          <p>
            © 2026 ProHealth Academic Medical Center. All rights reserved. JCI Gold Seal Certified (ID: JCI-AMC-2026-9941).
          </p>

          <nav aria-label="Legal" className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-slate-200">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClass}>{l.label}</Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={scrollToTop}
            className={`flex items-center gap-1.5 text-sm text-sky-100 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors ${FOCUS_RING}`}
          >
            <span>Back to Top</span>
            <ArrowUp className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  );
}
