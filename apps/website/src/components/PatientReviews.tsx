'use client';

import React, { useState } from 'react';
import { Star, Quote, CheckCircle2, User, Sparkles } from 'lucide-react';

export default function PatientReviews() {
  const [activeIdx, setActiveIdx] = useState(0);

  const reviews = [
    {
      name: 'Paulo Hubert',
      location: 'New York, NY',
      treatment: 'Interventional Cardiology',
      headline: 'Exceptional cardiac care that gave me my life back',
      comment:
        'I recently had to visit ProHealth for cardiac evaluation and catheterization. Dr. Sarah Patel and the intensive care nursing team were extraordinarily thorough, compassionate, and attentive. The procedure was explained in calm detail, and my recovery timeline was halved thanks to their robotic guidance protocol.',
      rating: 5,
      recoveryDays: 'Recovered in 14 days',
      avatarInitials: 'PH',
    },
    {
      name: 'Laurence Vendetta',
      location: 'San Francisco, CA',
      treatment: 'Pediatric Care & Allergy Clinic',
      headline: 'Gentle, comforting doctors who truly care for children',
      comment:
        'I brought my 5-year-old son to ProHealth for severe acute allergy and respiratory care. Dr. Michael Chang was fantastic with him, using games and warm communication to calm his anxiety. The pediatric floor is bright, comforting, and sparkling clean. I wouldn’t trust anyone else with my family.',
      rating: 5,
      recoveryDays: 'Same-day stabilization',
      avatarInitials: 'LV',
    },
    {
      name: 'Cassandra Raul',
      location: 'Miami, FL',
      treatment: 'Neurology Consultation & Spine Health',
      headline: 'Flawless digital coordination and world-class neurology',
      comment:
        'From the seamless digital appointment booking to meeting Dr. Elena Rostova, the experience exceeded every standard. My MRI imaging was reviewed within hours, and the non-surgical spinal decompression therapy resolved a 2-year struggle with chronic nerve pain. Truly world-class medicine.',
      rating: 5,
      recoveryDays: 'Back to work in 3 weeks',
      avatarInitials: 'CR',
    },
  ];

  const current = reviews[activeIdx];

  return (
    <section id="reviews" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 text-prohealth-primary text-xs font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>PATIENT TESTIMONIALS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
            Trusted by Thousands of Recovered Patients
          </h2>
          <p className="text-sm sm:text-base text-prohealth-body mt-2">
            Real stories, clinical outcomes, and verified healing experiences from ProHealth Medical Centers.
          </p>
        </div>

        {/* ProHealth Interactive 2-Column Testimonial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Avatar Selector Tabs */}
          <div className="lg:col-span-4 space-y-3">
            {reviews.map((r, idx) => {
              const isActive = activeIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIdx(idx)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-4 border ${
                    isActive
                      ? 'bg-prohealth-ice border-prohealth-secondary/40 shadow-prohealth'
                      : 'bg-white border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors ${
                      isActive
                        ? 'bg-prohealth-primary text-white shadow-md'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {r.avatarInitials}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-sm font-bold text-prohealth-heading flex items-center gap-1">
                      <span>{r.name}</span>
                      {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-prohealth-primary shrink-0" />}
                    </h3>
                    <p className="text-xs text-prohealth-muted truncate">{r.treatment}</p>
                    <p className="text-[11px] text-slate-400">{r.location}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Highlighted Quote Card */}
          <div className="lg:col-span-8">
            <div className="prohealth-card bg-gradient-to-br from-[#F0F6FB] via-white to-white p-8 sm:p-12 border border-slate-200/80 shadow-prohealth-lg relative overflow-hidden">
              <Quote className="absolute top-6 right-6 w-20 h-20 text-prohealth-secondary/10 pointer-events-none" />

              <div className="space-y-5 relative z-10">
                {/* 5 Gold Stars */}
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(current.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-2">5.0 / 5.0 Clinical Review</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-extrabold text-prohealth-heading font-display">
                  &ldquo;{current.headline}&rdquo;
                </h3>

                <p className="text-sm sm:text-base text-prohealth-body leading-relaxed">
                  {current.comment}
                </p>

                <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-prohealth-heading flex items-center gap-1.5">
                      <span>{current.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Verified Patient
                      </span>
                    </h4>
                    <p className="text-xs text-prohealth-muted">
                      {current.location} • {current.treatment}
                    </p>
                  </div>

                  <span className="text-xs font-bold text-prohealth-primary bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                    {current.recoveryDays}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

