'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Phone,
  Mail,
  MapPin,
  Ambulance,
  Stethoscope,
  ShieldCheck,
  Award,
  ArrowRight,
  ArrowUp,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1F5084] text-slate-200 text-xs pt-16 pb-8 border-t border-[#265d96]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Col 1: Brand & Contact Info (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-white text-prohealth-primary flex items-center justify-center font-bold shadow-md">
                <Stethoscope className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold text-white font-display">
                Pro<span className="text-sky-300">Health</span>
                <span className="text-[10px] text-white font-bold ml-1.5 uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/15 border border-white/20">
                  Hospital
                </span>
              </span>
            </Link>

            <p className="text-xs text-slate-200 leading-relaxed pr-6">
              ProHealth Academic Medical Center is dedicated to providing high-quality, compassionate clinical healthcare services, advanced robotic surgical interventions, and integrated medical education.
            </p>

            <div className="space-y-2.5 text-xs text-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 shrink-0">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-300 block">Telephone Inquiries:</span>
                  <a href="tel:1234567890" className="font-bold hover:text-white transition-colors">
                    123-456-7890
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-300 block">Official Support Email:</span>
                  <a href="mailto:infotech@prohealth.com" className="font-bold hover:text-white transition-colors">
                    infotech@prohealth.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sky-300 shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-300 block">Hospital Campus Address:</span>
                  <span className="font-medium">123 Healthcare Blvd, Suite 400, New York, NY 10016</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-white transition-colors">
                  Departments
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  Doctors Directory
                </Link>
              </li>
              <li>
                <Link href="/timetable" className="hover:text-white transition-colors">
                  Clinic Timetable
                </Link>
              </li>
              <li>
                <Link href="/appointments" className="hover:text-white transition-colors">
                  Book Appointment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Clinical Departments (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Departments</h4>
            <ul className="space-y-2.5 text-xs text-slate-200">
              <li>
                <Link href="/departments/dept_card" className="hover:text-white transition-colors">
                  Cardiology & Heart Center
                </Link>
              </li>
              <li>
                <Link href="/departments/dept_emg" className="hover:text-white transition-colors">
                  Emergency & Level 1 Trauma
                </Link>
              </li>
              <li>
                <Link href="/departments/dept_ped" className="hover:text-white transition-colors">
                  Pediatrics & Neonatology
                </Link>
              </li>
              <li>
                <Link href="/departments/dept_neur" className="hover:text-white transition-colors">
                  Neurology & Neurosurgery
                </Link>
              </li>
              <li>
                <Link href="/departments/dept_gyn" className="hover:text-white transition-colors">
                  Gynecology & Obstetrics
                </Link>
              </li>
              <li>
                <Link href="/departments/dept_orth" className="hover:text-white transition-colors">
                  Orthopedics & Joint Replacement
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Be Our Subscribers</h4>
            <p className="text-xs text-slate-200 leading-relaxed">
              To get the latest updates on medical discoveries, health tips, and clinic timetables, subscribe below.
            </p>

            {subscribed ? (
              <div className="p-3 bg-white/10 rounded-xl border border-white/20 text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-xs font-semibold">Thank you for subscribing to ProHealth!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder:text-slate-300 focus:outline-none focus:bg-white/15 pr-12"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-full bg-white text-prohealth-primary hover:bg-slate-100 flex items-center justify-center transition-colors"
                    aria-label="Submit Newsletter"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            )}

            {/* Social Media Channels */}
            <div className="pt-3">
              <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">Connect With Us</p>
              <div className="flex items-center gap-2 text-white">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-prohealth-primary flex items-center justify-center transition-all">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-prohealth-primary flex items-center justify-center transition-all">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-prohealth-primary flex items-center justify-center transition-all">
                  <Linkedin className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-prohealth-primary flex items-center justify-center transition-all">
                  <Instagram className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 hover:bg-white hover:text-prohealth-primary flex items-center justify-center transition-all">
                  <Youtube className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar & Back-to-Top */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-300 gap-4">
          <p>
            © 2026 ProHealth Academic Medical Center. All rights reserved. JCI Gold Seal Certified (ID: JCI-AMC-2026-9941).
          </p>

          <nav className="flex flex-wrap items-center gap-4 text-slate-200">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy (HIPAA)
            </Link>
            <span>•</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Care
            </Link>
            <span>•</span>
            <Link href="/cookie-policy" className="hover:text-white transition-colors">
              Cookie Policy
            </Link>
            <span>•</span>
            <Link href="/refund-policy" className="hover:text-white transition-colors">
              Billing & Refund Policy
            </Link>
          </nav>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-xs text-sky-200 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-full transition-all"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

