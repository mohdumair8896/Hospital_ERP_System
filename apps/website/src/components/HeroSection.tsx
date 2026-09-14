'use client';

import React, { useState } from 'react';
import { Calendar, Ambulance, Clock, CheckCircle2, Play, Users, Stethoscope, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { BadgeGroup } from "@/components/base/badges/badge-groups";
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group";

interface HeroSectionProps {
  onOpenBooking: () => void;
}

export default function HeroSection({ onOpenBooking }: HeroSectionProps) {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section id="home" className="relative bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-white pt-12 pb-20 lg:pt-16 lg:pb-28 overflow-hidden">
        {/* Soft Organic Curved Background Accents */}
        <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-blue-100/50 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-80 h-80 bg-sky-100/40 rounded-full blur-2xl -ml-20 pointer-events-none" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-7 text-center lg:text-left">
              {/* Badge above headline */}
              <div>
                <BadgeGroup addonText="Verified" color="success" theme="light" align="trailing" size="md">
                  All Solutions For Your Health • Level 1 Trauma Care
                </BadgeGroup>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-[76px] font-extrabold tracking-tight text-prohealth-heading leading-[1.08] font-display">
                Your Partner in <br />
                <span className="text-prohealth-primary">Health</span> and{' '}
                <span className="text-prohealth-secondary">Wellness</span>
              </h1>

              {/* Subtext */}
              <p className="text-base sm:text-xl text-prohealth-body max-w-3xl leading-relaxed">
                We are committed to providing you with the best medical care and exceptional healthcare services. Delivering world-class clinical specialty care, robotic surgery, and round-the-clock emergency support.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onOpenBooking}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-prohealth-primary hover:bg-prohealth-primary-hover text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-prohealth-primary/20 hover:shadow-prohealth-primary/30 transition-all text-sm active:scale-95"
                >
                  <Calendar className="w-4 h-4 text-white" />
                  <span>Book an Appointment</span>
                </button>

                {/* Video Play Button CTA */}
                <button
                  onClick={() => setVideoOpen(true)}
                  className="flex items-center gap-3 text-prohealth-heading hover:text-prohealth-primary transition-colors py-2 px-4 rounded-full group"
                >
                  <div className="w-11 h-11 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center text-prohealth-primary group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 fill-prohealth-primary ml-0.5" />
                  </div>
                  <span className="text-sm font-bold">See how we work</span>
                </button>
              </div>

              {/* Trust bullet points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-prohealth-body">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>870+ Specialist Doctors</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-prohealth-body">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Instant Digital Booking</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-prohealth-body">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>24/7 Level 1 Trauma Care</span>
                </div>
              </div>
            </div>

            {/* Hero Right Visual & Floating Social Proof Badges */}
            <div className="lg:col-span-5 relative flex justify-center">
              {/* Organic shape backdrop */}
              <div className="relative w-full max-w-lg">
                <div className="relative rounded-3xl bg-gradient-to-tr from-[#1F5084]/10 via-[#2B78C6]/15 to-sky-100/80 p-8 sm:p-10 overflow-hidden border border-white/60 shadow-prohealth-lg">
                  {/* Decorative Medical Cross Background */}
                  <div className="absolute top-4 right-4 text-prohealth-primary/10">
                    <Stethoscope className="w-36 h-36" />
                  </div>

                  {/* Doctor Showcase Card */}
                  <div className="relative z-10 space-y-5">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-prohealth-primary to-prohealth-secondary text-white flex items-center justify-center shadow-md">
                      <Stethoscope className="w-10 h-10" />
                    </div>

                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-prohealth-secondary">
                        Chief Medical Board
                      </span>
                      <h3 className="text-2xl font-extrabold text-prohealth-heading mt-0.5">
                        Dr. Elena Rostova, MD, PhD
                      </h3>
                      <p className="text-xs sm:text-sm text-prohealth-body mt-1">
                        Senior Neurologist & Academic Director • Johns Hopkins Fellow
                      </p>
                    </div>

                    <div className="p-4 bg-white/95 rounded-2xl border border-slate-100 shadow-sm space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-700">Patient Recovery Rate</span>
                        <span className="font-bold text-emerald-600 text-sm">99.4%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2.5">
                        <div className="bg-emerald-500 h-2.5 rounded-full w-[99.4%]" />
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Accepting New Patients Today</span>
                      </div>
                      <span className="text-slate-400 font-mono font-medium">OPD Room 402</span>
                    </div>
                  </div>
                </div>

                {/* Floating Social Proof Badge 1: 150K+ Patient Recover */}
                <div className="absolute -bottom-6 -left-4 sm:-left-8 bg-white rounded-2xl p-4 shadow-prohealth border border-slate-100 flex items-center gap-3.5 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <p className="text-base font-extrabold text-prohealth-heading">150K+</p>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100" />
                    </div>
                    <p className="text-xs text-prohealth-muted font-medium">Patients Recovered</p>
                  </div>
                </div>

                {/* Floating Social Proof Badge 2: 870+ Doctors */}
                <div className="absolute -top-4 -right-4 sm:-right-6 bg-white rounded-2xl p-4 shadow-prohealth border border-slate-100 flex items-center gap-3.5 animate-in slide-in-from-top-4 duration-500">
                  <div className="w-12 h-12 rounded-full bg-prohealth-ice text-prohealth-primary flex items-center justify-center font-bold">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-base font-extrabold text-prohealth-heading">870+</p>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <p className="text-xs text-prohealth-muted font-medium">Verified Physicians</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3 Quick Feature Cards Strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
            {/* Card 1: Easy Appointment */}
            <div className="prohealth-card p-6 bg-white hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-prohealth-ice text-prohealth-primary flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-prohealth-heading mb-2">Easy Appointment</h3>
              <p className="text-xs text-prohealth-body leading-relaxed mb-4">
                Schedule your medical consultation in under 60 seconds with instant digital confirmation and real-time slot availability.
              </p>
              <button
                onClick={onOpenBooking}
                className="text-xs font-bold text-prohealth-primary hover:text-prohealth-secondary flex items-center gap-1.5 group-hover:gap-2 transition-all"
              >
                <span>Book Online Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: 24/7 Service */}
            <div className="prohealth-card p-6 bg-white hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Ambulance className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-prohealth-heading mb-2">24/7 Emergency Service</h3>
              <p className="text-xs text-prohealth-body leading-relaxed mb-4">
                Round-the-clock level-1 emergency trauma care, acute cardiac interventions, and dedicated ambulance dispatch network.
              </p>
              <a
                href="tel:876256876"
                className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 group-hover:gap-2 transition-all"
              >
                <span>Call Hotline: 876-256-876</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Card 3: Expert Doctors */}
            <div className="prohealth-card p-6 bg-white hover:-translate-y-1 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-prohealth-heading mb-2">Expert Specialists</h3>
              <p className="text-xs text-prohealth-body leading-relaxed mb-4">
                Board-certified physicians, academic clinical researchers, and surgeons trained at world-renowned university hospitals.
              </p>
              <a
                href="#doctors"
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5 group-hover:gap-2 transition-all"
              >
                <span>Browse Doctor Catalog</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal Trigger */}
      {videoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-prohealth-ice text-prohealth-primary flex items-center justify-center">
                  <Play className="w-4 h-4 fill-prohealth-primary" />
                </div>
                <h3 className="text-base font-bold text-prohealth-heading">ProHealth Clinical Excellence Tour</h3>
              </div>
              <button
                onClick={() => setVideoOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-8 text-center space-y-4">
              <div className="w-20 h-20 mx-auto rounded-full bg-prohealth-ice text-prohealth-primary flex items-center justify-center animate-pulse">
                <Stethoscope className="w-10 h-10" />
              </div>
              <div className="max-w-md mx-auto">
                <h4 className="text-lg font-extrabold text-prohealth-heading">Inside ProHealth Medical Center</h4>
                <p className="text-xs text-prohealth-body mt-2 leading-relaxed">
                  Take a virtual walk through our da Vinci robotic surgery suites, hybrid catheterization laboratories, and JCI-accredited intensive care units.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  onClick={() => {
                    setVideoOpen(false);
                    onOpenBooking();
                  }}
                  className="bg-prohealth-primary hover:bg-prohealth-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Book a Consultation
                </button>
                <button
                  onClick={() => setVideoOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-6 py-2.5 rounded-full"
                >
                  Close Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

