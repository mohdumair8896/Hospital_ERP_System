'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ShieldCheck, CheckCircle2, ArrowRight, HeartPulse, Stethoscope, Sparkles, Building2 } from 'lucide-react';

export default function StatsAndTrust() {
  const awards = [
    {
      title: 'Malcolm Baldrige',
      subtitle: 'National Quality Award',
      desc: 'Recognized as a premier benchmark for healthcare operational performance and clinical safety.',
      icon: Award,
      badge: 'Gold Tier',
      color: 'text-amber-500 bg-amber-50 border-amber-100',
    },
    {
      title: 'HIMSS Davies',
      subtitle: 'Stage 7 Digital Health',
      desc: 'Highest global level for digital EHR integration, closed-loop medication, and paperless clinical workflows.',
      icon: HeartPulse,
      badge: 'Stage 7',
      color: 'text-prohealth-primary bg-prohealth-ice border-blue-100',
    },
    {
      title: 'Healthgrades Best',
      subtitle: "America's 50 Best Hospitals",
      desc: 'Top 1% in the nation for superior clinical outcomes in complex surgeries and critical emergency care.',
      icon: Building2,
      badge: 'Top 1%',
      color: 'text-sky-600 bg-sky-50 border-sky-100',
    },
    {
      title: 'Joint Commission',
      subtitle: 'Gold Seal of Approval',
      desc: 'Accredited for exceeding international standards in patient safety, infection control, and clinical governance.',
      icon: ShieldCheck,
      badge: 'Accredited',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        {/* About ProHealth Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center mb-24">
          {/* Left Visual with Floating "High Quality Professionals" Badge */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl bg-[#EAF2F9] p-4 sm:p-6 overflow-hidden border border-slate-100">
              <div className="bg-white rounded-2xl p-6 sm:p-8 space-y-5 shadow-prohealth">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-prohealth-primary text-white flex items-center justify-center font-bold">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-prohealth-heading">
                      ProHealth Clinical Faculty
                    </h3>
                    <p className="text-xs text-prohealth-muted">Over 45 Years of Compassionate Healing</p>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-prohealth-body leading-relaxed">
                  Our multidisciplinary departments unite board-certified physicians, trauma surgeons, and compassionate nurses. Every patient receives a tailored diagnostic protocol supported by high-definition 3T MRI, hybrid surgery suites, and robotic navigation.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                  <div className="p-3 bg-prohealth-canvas rounded-xl">
                    <p className="text-xl font-extrabold text-prohealth-primary">450+</p>
                    <p className="text-[11px] text-prohealth-muted font-medium">Inpatient Hospital Beds</p>
                  </div>
                  <div className="p-3 bg-prohealth-canvas rounded-xl">
                    <p className="text-xl font-extrabold text-prohealth-primary">18K+</p>
                    <p className="text-[11px] text-prohealth-muted font-medium">Annual Successful Surgeries</p>
                  </div>
                </div>
              </div>

              {/* Floating Circular Badge: "High Quality Professionals" */}
              <div className="absolute -bottom-2 -right-2 sm:bottom-4 sm:right-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-prohealth-lg border border-slate-100 flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-500/30">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-prohealth-heading">High Quality</p>
                  <p className="text-[11px] text-emerald-600 font-bold">Medical Professionals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Text Content */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 bg-prohealth-ice px-3.5 py-1.5 rounded-full text-xs font-extrabold text-prohealth-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ABOUT PROHEALTH</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading leading-tight font-display">
              ProHealth is a Team of Experienced Medical Professionals Dedicated to Providing Top-Quality Healthcare Services.
            </h2>

            <p className="text-sm text-prohealth-body leading-relaxed">
              We understand that seeking medical care can be a vulnerable experience. That is why our healthcare ecosystem is built around empathetic patient communication, transparent treatment plans, and continuous clinical oversight.
            </p>

            {/* Checklist items */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  <strong className="text-slate-900">24/7 Level 1 Emergency Trauma:</strong> Dedicated rapid-triage bays and acute resuscitation protocols.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  <strong className="text-slate-900">Qualified & Board-Certified Specialists:</strong> Fellows from Harvard, Johns Hopkins, and top academic institutions.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-xs font-semibold text-slate-700">
                  <strong className="text-slate-900">Cutting-Edge Robotic Technologies:</strong> da Vinci Xi surgical system and robotic catheterization lab.
                </p>
              </div>
            </div>

            <div className="pt-3">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-prohealth-primary hover:bg-prohealth-primary-hover text-white px-7 py-3 rounded-full text-xs font-bold shadow-md shadow-prohealth-primary/20 transition-all group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* 4 Awards & Accreditation Cards */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-prohealth-primary text-xs font-extrabold uppercase tracking-wider mb-2">
              <Award className="w-3.5 h-3.5" />
              <span>AWARDS & RECOGNITIONS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-prohealth-heading font-display">
              Excellence Benchmarked by Global Healthcare Standards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((a, idx) => {
              const Icon = a.icon;
              return (
                <div
                  key={idx}
                  className="prohealth-card p-6 bg-white hover:-translate-y-1 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${a.color}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {a.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-prohealth-heading mb-1">{a.title}</h3>
                    <p className="text-xs font-bold text-prohealth-primary mb-2">{a.subtitle}</p>
                    <p className="text-xs text-prohealth-body leading-relaxed">{a.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

