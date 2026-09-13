'use client';

import React, { useState } from 'react';
import { Plus, Minus, HelpCircle, ShieldCheck } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I book an in-person or telehealth appointment with a ProHealth specialist?',
      a: 'You can book an appointment directly through our online scheduling portal in under 60 seconds, or by calling our appointments desk at 123-456-7890. Choose your preferred department, specialist physician, date, and convenient time slot. You will receive an immediate SMS and email booking confirmation with check-in instructions.',
    },
    {
      q: 'What health insurance and payment options are accepted at ProHealth?',
      a: 'ProHealth participates with all major national and regional commercial insurance providers, including Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, Medicare Part B, and Medicaid. For uninsured or self-pay patients, transparent fixed-fee consultation pricing and zero-interest clinical installment plans are available.',
    },
    {
      q: 'What should I bring with me to my first outpatient appointment?',
      a: 'Please bring a valid government-issued photo ID (Driver’s License or Passport), your active insurance card, any previous medical records or diagnostic imaging CDs (X-ray, MRI, CT), and a comprehensive list of current prescribed medications and dosages.',
    },
    {
      q: 'How does the Patient Portal (ERP) protect my medical records and test results?',
      a: 'Our Patient Portal employs enterprise zero-trust security and Record-Level Security (RLS). Every access to your Electronic Protected Health Information (ePHI) is logged into an immutable database audit engine secured with SHA-256 cryptographic hash chaining in compliance with HIPAA § 164.312(b).',
    },
    {
      q: 'What is the difference between regular outpatient clinics and the Emergency Department?',
      a: 'Outpatient (OPD) clinics operate Monday through Saturday from 8:00 AM to 8:00 PM for scheduled consultations, preventive screenings, and routine follow-ups. Our Emergency & Trauma Center operates 24/7/365 with Level-1 acute resuscitation suites, cardiologists on standby, and immediate ambulance dispatch.',
    },
    {
      q: 'Can I cancel or reschedule my scheduled consultation?',
      a: 'Yes. Appointments can be rescheduled or cancelled online up to 24 hours prior to your scheduled time slot with zero cancellation fees. For cancellations made within 24 hours of scheduled clinic times, please contact our appointments desk directly.',
    },
  ];

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-24 bg-prohealth-canvas">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 xl:px-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-prohealth-primary text-xs font-extrabold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
            Answers to Help You Navigate Your Care
          </h2>
          <p className="text-sm sm:text-base text-prohealth-body mt-2">
            Find immediate answers regarding scheduling, patient registration, insurance billing, and clinic operations.
          </p>
        </div>

        {/* Accordion Stack */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className={`prohealth-card transition-all overflow-hidden border ${
                  isOpen ? 'bg-white border-prohealth-secondary/40 shadow-prohealth' : 'bg-white border-slate-200/80'
                }`}
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className={`text-sm sm:text-base font-bold ${isOpen ? 'text-prohealth-primary' : 'text-prohealth-heading'}`}>
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                      isOpen ? 'bg-prohealth-primary text-white rotate-180' : 'bg-prohealth-ice text-prohealth-primary'
                    }`}
                  >
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-prohealth-body leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
