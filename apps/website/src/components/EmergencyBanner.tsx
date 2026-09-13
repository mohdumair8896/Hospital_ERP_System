'use client';

import React from 'react';
import { Ambulance, Phone, Calendar, ArrowRight } from 'lucide-react';

interface EmergencyBannerProps {
  onOpenBooking?: () => void;
}

export default function EmergencyBanner({ onOpenBooking }: EmergencyBannerProps) {
  return (
    <section className="py-16 bg-gradient-to-r from-[#1F5084] via-[#2B78C6] to-[#1F5084] text-white relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Ambulance className="w-9 h-9 text-red-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-sky-200">
                24/7 LEVEL-1 TRAUMA & CRITICAL CARE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Don’t Hesitate to Contact Us for Immediate Medical Assistance
              </h2>
              <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
                Our paramedics and trauma teams are standing by 24 hours a day with rapid ambulance dispatch and acute cardiac resuscitation.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="tel:876256876"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold px-7 py-3.5 rounded-full shadow-lg shadow-red-900/30 transition-all text-xs active:scale-95"
            >
              <Phone className="w-4 h-4" />
              <span>Ambulance: 876-256-876</span>
            </a>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-prohealth-primary font-extrabold px-7 py-3.5 rounded-full shadow-md transition-all text-xs active:scale-95"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Non-Urgent Visit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
