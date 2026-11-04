'use client';

import React from 'react';
import { Phone, ShieldCheck, Ambulance, Clock } from 'lucide-react';
import { Reveal } from '@/components/motion';
import AppointmentBookingWizard from './appointment/AppointmentBookingWizard';
import AppointmentJourney from './appointment/AppointmentJourney';
import { AMBULANCE_PHONE } from './appointment/wizardModel';

/**
 * Home page booking section: the visit journey (C24) above the embedded
 * booking wizard. Emergency help and the wizard are not wrapped in a reveal,
 * so they show on first paint.
 */
export default function AppointmentSection() {
  return (
    <section
      id="appointments"
      aria-labelledby="appointments-heading"
      className="py-section bg-gradient-to-b from-prohealth-canvas via-white to-prohealth-ice/30"
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 xl:px-20 space-y-12 lg:space-y-16">
        <Reveal className="max-w-3xl space-y-4">
          <p className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 text-sm font-semibold text-primary shadow-soft">
            <Clock className="w-4 h-4" aria-hidden="true" />
            Your visit, step by step
          </p>
          <h2 id="appointments-heading" className="font-display text-display-md text-foreground">
            Book a consultation with certified specialists
          </h2>
          <p className="text-base sm:text-lead text-muted-foreground">
            In-person clinic visits or secure video appointments. Here is what happens from the moment you book to
            your follow-up.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <AppointmentJourney bookHref="#book-online" />
        </Reveal>

        <div id="book-online" className="scroll-mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left column: emergency help and practical info */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="p-5 rounded-card bg-alert-soft border border-alert/20 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-alert text-white flex items-center justify-center shrink-0">
                <Ambulance className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-alert-strong">Need emergency care now?</h3>
                <p className="text-sm text-alert-strong/90">
                  Don&apos;t wait for an outpatient slot. Our Level 1 trauma team is ready 24/7.
                </p>
                <a
                  href={AMBULANCE_PHONE.href}
                  className="inline-flex items-center gap-1.5 pt-1 text-sm font-bold text-alert-strong underline underline-offset-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <Phone className="w-4 h-4" aria-hidden="true" />
                  Call ambulance: {AMBULANCE_PHONE.label}
                </a>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              <li className="p-3 rounded-xl bg-card border border-border shadow-soft flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">HIPAA compliant</span>
              </li>
              <li className="p-3 rounded-xl bg-card border border-border shadow-soft flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-care shrink-0" aria-hidden="true" />
                <span className="text-sm font-semibold text-foreground">NABH &amp; JCI verified</span>
              </li>
            </ul>

            <div className="p-5 rounded-card bg-card border border-border shadow-soft">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground border-b border-border pb-2 mb-3">
                <Clock className="w-4 h-4 text-primary" aria-hidden="true" />
                Outpatient consultation hours
              </h3>
              <dl className="text-sm space-y-1.5">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Monday – Friday</dt>
                  <dd className="font-medium text-foreground tabular-nums">8:00 AM – 8:00 PM</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Saturday – Sunday</dt>
                  <dd className="font-medium text-foreground tabular-nums">9:00 AM – 5:00 PM</dd>
                </div>
                <div className="flex justify-between gap-3 pt-1.5 border-t border-border">
                  <dt className="font-semibold text-care">Trauma &amp; emergency</dt>
                  <dd className="font-semibold text-care">Open 24/7</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Right column: booking wizard */}
          <div className="lg:col-span-7 min-w-0">
            <AppointmentBookingWizard variant="embedded" />
          </div>
        </div>
      </div>
    </section>
  );
}
