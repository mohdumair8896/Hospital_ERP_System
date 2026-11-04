'use client';

import React from 'react';
import { Ambulance, Phone, Calendar, ArrowRight, MessageSquare, Bot, Sparkles } from 'lucide-react';
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from "@/components/ui/bubble";
import { BadgeGroup } from "@/components/base/badges/badge-groups";

interface EmergencyBannerProps {
  onOpenBooking?: () => void;
}

export default function EmergencyBanner({ onOpenBooking }: EmergencyBannerProps) {
  return (
    <section aria-labelledby="emergency-banner-title" className="py-16 bg-gradient-to-r from-prohealth-primary via-[#245c97] to-prohealth-primary text-white relative overflow-hidden">
      {/* Background Decorative Circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 relative z-10 space-y-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shrink-0">
              <Ambulance className="w-9 h-9 text-red-300 motion-safe:animate-pulse" aria-hidden="true" />
            </div>
            <div className="space-y-1">
              <div className="flex justify-center lg:justify-start">
                <BadgeGroup addonText="Immediate Care" color="error" theme="light" align="leading" size="md">
                  24/7 Level-1 Trauma &amp; Critical Care
                </BadgeGroup>
              </div>
              <h2 id="emergency-banner-title" className="text-2xl sm:text-3xl font-extrabold text-white font-display pt-1">
                Don’t Hesitate to Contact Us for Immediate Medical Assistance
              </h2>
              <p className="text-sm sm:text-base text-slate-200 max-w-xl">
                Our paramedics and trauma teams are standing by 24 hours a day with rapid ambulance dispatch and acute cardiac resuscitation.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <a
              href="tel:876256876"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 whitespace-nowrap bg-alert hover:bg-alert-strong text-white font-bold px-7 py-3.5 rounded-full shadow-lg shadow-red-950/30 transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-prohealth-primary"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Ambulance: 876-256-876</span>
            </a>

            {onOpenBooking && (
              <button
                onClick={onOpenBooking}
                type="button"
                className="w-full sm:w-auto flex items-center justify-center gap-2 whitespace-nowrap bg-white hover:bg-slate-100 text-prohealth-primary font-bold px-7 py-3.5 rounded-full shadow-md transition-colors text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-prohealth-primary"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span>Book Non-Urgent Visit</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Virtual Triage Chat Preview */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 max-w-3xl mx-auto text-left">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10 text-sm font-semibold text-sky-100">
            <Bot className="w-4 h-4 text-sky-300" aria-hidden="true" />
            <span>AI Emergency Symptom Screener &amp; Clinical Triage Demo</span>
          </div>

          <div className="space-y-3">
            <Bubble align="start" className="bg-white text-slate-800 rounded-xl p-3 text-sm shadow-sm">
              <BubbleContent>
                Hello! I am the ProHealth 24/7 automated emergency triage assistant. Are you experiencing crushing chest pain, shortness of breath, or facial drooping?
              </BubbleContent>
            </Bubble>

            <Bubble align="end" className="bg-prohealth-secondary text-white rounded-xl p-3 text-sm shadow-sm ml-auto">
              <BubbleContent>
                Mild shortness of breath after climbing stairs, no severe chest pressure.
              </BubbleContent>
            </Bubble>

            <Bubble align="start" className="bg-white text-slate-800 rounded-xl p-3 text-sm shadow-sm">
              <BubbleContent>
                Acuity Level 3 (Urgent). Emergency bed reserved at Cardiac Outpatient clinic. An ambulance can be dispatched immediately if symptoms worsen.
              </BubbleContent>
              <BubbleReactions role="img" aria-label="Reaction: acknowledged">
                <span>⚡ Priority Registered</span>
              </BubbleReactions>
            </Bubble>
          </div>
        </div>
      </div>
    </section>
  );
}
