'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  Phone,
  Mail,
  MapPin,
  Clock,
  Ambulance,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Stethoscope,
} from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

export default function SidebarDrawer({ isOpen, onClose, onOpenBooking }: SidebarDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 transform transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" onClick={onClose} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prohealth-primary text-white flex items-center justify-center font-bold shadow-md shadow-prohealth-primary/20">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 font-display">
                Pro<span className="text-prohealth-secondary">Health</span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Academic Medical Center</p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 flex-1">
          {/* About snippet */}
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900">About ProHealth</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              ProHealth Medical Center is dedicated to providing high-quality, compassionate clinical healthcare services, cutting-edge robotic surgical interventions, and integrated patient care.
            </p>
          </div>

          {/* Emergency Callout Card */}
          <div className="bg-red-50 border border-red-200 p-4 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-red-700 font-bold text-xs uppercase tracking-wide">
              <Ambulance className="w-4 h-4 text-red-600 animate-pulse" />
              <span>24/7 Emergency & Level 1 Trauma</span>
            </div>
            <p className="text-xs text-slate-700">Immediate critical response & rapid ambulance dispatch.</p>
            <a
              href="tel:876256876"
              className="inline-flex items-center gap-2 text-red-600 font-bold text-sm hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>876-256-876</span>
            </a>
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Quick Contact</h4>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Telephone Inquiries</p>
                <a href="tel:1234567890" className="text-xs font-bold text-slate-800 hover:text-prohealth-secondary">
                  123-456-7890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Email Address</p>
                <a href="mailto:infotech@prohealth.com" className="text-xs font-bold text-slate-800 hover:text-prohealth-secondary">
                  infotech@prohealth.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Campus Location</p>
                <p className="text-xs font-bold text-slate-800">
                  123 Healthcare Blvd, Suite 400<br />New York, NY 10016
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Clinical Working Hours</p>
                <p className="text-xs font-semibold text-slate-700">
                  Mon – Fri: 8:00 AM – 8:00 PM<br />
                  Sat – Sun: 9:00 AM – 5:00 PM
                </p>
              </div>
            </div>
          </div>

          {/* Direct CTA Buttons */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenBooking) onOpenBooking();
              }}
              className="w-full py-3 px-4 rounded-full bg-prohealth-primary hover:bg-prohealth-primary-hover text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-prohealth-primary/20 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </button>

            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5 text-prohealth-primary" />
              <span>Hospital Staff & Patient Portal (ERP)</span>
            </a>
          </div>
        </div>

        {/* Footer & Socials */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Follow ProHealth:</span>
            <div className="flex items-center gap-2.5 text-slate-600">
              <a href="#" className="hover:text-prohealth-primary transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="hover:text-prohealth-primary transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="hover:text-prohealth-primary transition-colors"><Linkedin className="w-4 h-4" /></a>
              <a href="#" className="hover:text-prohealth-primary transition-colors"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-prohealth-primary transition-colors"><Youtube className="w-4 h-4" /></a>
            </div>
          </div>
          <p className="text-[11px] text-slate-400 text-center">
            © 2026 ProHealth Medical Center. JCI Gold Seal Certified.
          </p>
        </div>
      </div>
    </>
  );
}
