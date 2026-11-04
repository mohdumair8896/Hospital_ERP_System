'use client';

import React, { useEffect, useId, useRef } from 'react';
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
  Stethoscope,
} from 'lucide-react';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenBooking?: () => void;
}

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/**
 * Slide-out information drawer (modal dialog).
 *
 * Closed: `invisible` + `inert`, so nothing inside can take focus or be read.
 * Open: focus moves to the close button, Tab stays inside, Escape or the
 * backdrop closes it, and focus returns to whatever opened it.
 */
export default function SidebarDrawer({ isOpen, onClose, onOpenBooking }: SidebarDrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

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

  // inert when closed; focus in on open, back to the opener on close.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.toggleAttribute('inert', !isOpen);

    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeRef.current?.focus();
      return;
    }
    const opener = openerRef.current;
    openerRef.current = null;
    const active = document.activeElement;
    // Don't steal focus from something that opened in the same step (e.g. the booking modal).
    if (opener && opener.isConnected && (active === document.body || panel.contains(active))) {
      opener.focus();
    }
  }, [isOpen]);

  // Escape closes; Tab wraps inside the panel.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panelRef.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panelRef.current.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm motion-safe:animate-in motion-safe:fade-in duration-300"
          onClick={onClose}
        />
      )}

      {/* Slide-out Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 transform duration-300 ease-out-soft flex flex-col justify-between overflow-y-auto ${
          // Visibility flips at once on open (so focus can move in) and waits for the slide on close.
          isOpen ? 'translate-x-0 visible transition-transform' : 'translate-x-full invisible transition-[transform,visibility]'
        }`}
      >
        <h2 id={titleId} className="sr-only">
          ProHealth quick information
        </h2>

        {/* Top Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <Link href="/" onClick={onClose} className={`flex items-center gap-3 rounded-xl ${FOCUS_RING}`}>
            <div className="w-10 h-10 rounded-xl bg-prohealth-primary text-white flex items-center justify-center font-bold shadow-md shadow-prohealth-primary/20">
              <Stethoscope className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg font-extrabold text-slate-900 font-display">
                Pro<span className="text-prohealth-secondary">Health</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Academic Medical Center</p>
            </div>
          </Link>

          <button
            ref={closeRef}
            onClick={onClose}
            className={`p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors ${FOCUS_RING}`}
            aria-label="Close information drawer"
          >
            <X className="w-5 h-5" aria-hidden="true" />
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
              <Ambulance className="w-4 h-4 text-red-600 motion-safe:animate-pulse" aria-hidden="true" />
              <span>24/7 Emergency & Level 1 Trauma</span>
            </div>
            <p className="text-xs text-slate-700">Immediate critical response & rapid ambulance dispatch.</p>
            <a
              href="tel:876256876"
              className={`inline-flex items-center gap-2 text-red-700 font-bold text-sm hover:underline rounded ${FOCUS_RING}`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>876-256-876</span>
            </a>
          </div>

          {/* Contact Details Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Quick Contact</h3>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Telephone Inquiries</p>
                <a href="tel:1234567890" className={`text-sm font-bold text-slate-800 hover:text-prohealth-primary rounded ${FOCUS_RING}`}>
                  123-456-7890
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Email Address</p>
                <a href="mailto:infotech@prohealth.com" className={`text-sm font-bold text-slate-800 hover:text-prohealth-primary rounded ${FOCUS_RING}`}>
                  infotech@prohealth.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Campus Location</p>
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
                <p className="text-xs text-slate-500 font-medium">Clinical Working Hours</p>
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
              className={`w-full py-3 px-4 rounded-full bg-prohealth-primary hover:bg-prohealth-primary-hover text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-prohealth-primary/20 transition-colors ${FOCUS_RING}`}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment Online</span>
            </button>

            <Link
              href="/timetable"
              onClick={onClose}
              className={`w-full py-2.5 px-4 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-200 transition-colors ${FOCUS_RING}`}
            >
              <Clock className="w-3.5 h-3.5 text-prohealth-primary" />
              <span>Doctor Timetable &amp; Schedules</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            © 2026 ProHealth Medical Center. JCI Gold Seal Certified.
          </p>
        </div>
      </div>
    </>
  );
}
