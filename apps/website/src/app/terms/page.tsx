import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { FileText, ShieldAlert, ChevronRight, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Care & Patient Service Agreement | ProHealth Hospital',
  description: 'Conditions of outpatient and inpatient admission, clinical consent, telehealth guidelines, and financial billing agreements.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="relative py-14 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 sm:px-8 relative">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">Terms of Care</span>
          </nav>
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#1F5084] bg-[#1F5084]/10 px-2.5 py-0.5 rounded border border-[#1F5084]/20">
              Patient Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              Terms of Clinical Care &amp; Admission Agreement
            </h1>
            <p className="text-xs text-[#475467]">
              Last Updated: September 13, 2026 | Governing ProHealth Clinical Facilities
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full space-y-10 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            1. Consent to General Medical and Diagnostic Examination
          </h2>
          <p>
            By booking an appointment or presenting at ProHealth Academic Medical Center, you consent to outpatient, inpatient, or emergency examinations, diagnostic imaging (radiographs, ultrasound, CT, MRI), routine laboratory testing, nursing assessments, and medical treatments prescribed by attending physicians. You maintain the ongoing right to discuss the risks, benefits, and alternatives of any proposed intervention before administration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            2. Telehealth & Virtual Video Consultations
          </h2>
          <p>
            Telehealth services deliver real-time clinical evaluations via secure, encrypted electronic video links. Patients must understand:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>Telehealth does not substitute for emergency medical care. If experiencing chest pain, shortness of breath, or stroke symptoms, call 876-256-876 immediately.</li>
            <li>Technical disruptions beyond our control may require rescheduling or converting to an in-person clinical visit.</li>
            <li>Electronic prescriptions for controlled substances are subject to federal DEA and state medical board prescribing regulations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            3. Patient Rights and Code of Conduct
          </h2>
          <p>
            Every patient has the right to considerate, respectful care regardless of race, creed, sex, national origin, sexual orientation, disability, or source of payment. Correspondingly, patients and visitors must treat healthcare providers and fellow patients with civility. Verbal threats, physical violence, or disruptive behavior will result in immediate removal from hospital premises.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            4. Financial Responsibility & Assignment of Insurance Benefits
          </h2>
          <p>
            You authorize ProHealth to bill your health insurance carrier directly for medical services rendered. However, you acknowledge personal financial responsibility for all copayments, deductibles, coinsurance, and non-covered services determined by your insurer. Payment of estimated copayments is due at the time of clinical registration.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            5. Section 1557 Non-Discrimination Notice
          </h2>
          <p>
            ProHealth Academic Medical Center complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex. Free language interpretation services (including ASL) are available upon request for all clinical encounters.
          </p>
        </section>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
