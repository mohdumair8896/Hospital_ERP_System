'use client';

import React from 'react';
import { Phone, ShieldCheck, Ambulance, Clock } from 'lucide-react';
import AppointmentBookingWizard from './appointment/AppointmentBookingWizard';

export default function AppointmentSection() {
  return (
    <section id="appointments" className="py-24 bg-gradient-to-b from-prohealth-canvas via-white to-prohealth-ice/30">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Context & Emergency Help */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-prohealth-primary text-xs font-bold border border-blue-100">
              <Clock className="w-3.5 h-3.5" />
              <span>Real-Time Clinical Scheduling</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-prohealth-heading font-display leading-tight">
              Book a Consultation with Certified Specialists
            </h2>

            <p className="text-sm text-prohealth-body leading-relaxed">
              Schedule in-person clinic visits or encrypted virtual telehealth appointments. Our scheduling engine coordinates directly with hospital admission queues and physician rotas.
            </p>

            {/* Fast-Track Emergency Box */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-rose-500/20">
                <Ambulance className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Need Immediate Emergency Trauma Care?
                </h4>
                <p className="text-xs text-rose-700">
                  Do not wait for standard OPD slots. Call our 24/7 Level 1 Trauma Dispatch directly.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:911"
                    className="inline-flex items-center gap-1.5 text-xs font-extrabold text-rose-800 hover:text-rose-950 underline"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Emergency Hotline: (800) 911-CARE</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-prohealth-primary" />
                <span className="text-xs font-bold text-slate-700">HIPAA Compliant</span>
              </div>
              <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-700">NABH &amp; JCI Verified</span>
              </div>
            </div>

            {/* Consultation Hours Summary */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
                <Clock className="w-4 h-4 text-prohealth-primary" />
                <span>Outpatient Consultation Hours</span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span>Monday – Friday:</span>
                  <span className="font-semibold text-slate-800">08:00 AM – 08:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday – Sunday:</span>
                  <span className="font-semibold text-slate-800">09:00 AM – 05:00 PM</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-bold pt-1 border-t border-slate-200">
                  <span>Trauma &amp; Emergency:</span>
                  <span>Open 24 Hours / 7 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Unified Interactive Booking Form */}
          <div className="lg:col-span-7">
            <AppointmentBookingWizard variant="embedded" />
          </div>
        </div>
      </div>
    </section>
  );
}
