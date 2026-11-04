import React from 'react';
import type { Metadata } from 'next';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { PolicyLayout, type PolicySection } from '../../components/content/PolicyLayout';

export const metadata: Metadata = {
  title: 'Terms of Care & Patient Service Agreement',
  description: 'Conditions of outpatient and inpatient admission, clinical consent, telehealth guidelines, and financial billing agreements.',
};

const SECTIONS: PolicySection[] = [
  {
    id: 'consent',
    title: 'Consent to General Medical and Diagnostic Examination',
    content: (
      <p>
        By booking an appointment or presenting at ProHealth Academic Medical Center, you consent to outpatient, inpatient, or emergency examinations, diagnostic imaging (radiographs, ultrasound, CT, MRI), routine laboratory testing, nursing assessments, and medical treatments prescribed by attending physicians. You maintain the ongoing right to discuss the risks, benefits, and alternatives of any proposed intervention before administration.
      </p>
    ),
  },
  {
    id: 'telehealth',
    title: 'Telehealth & Virtual Video Consultations',
    content: (
      <>
        <p>Telehealth services deliver real-time clinical evaluations via secure, encrypted electronic video links. Patients must understand:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>
            Telehealth does not substitute for emergency medical care. If experiencing chest pain, shortness of breath, or stroke symptoms, call{' '}
            <a href="tel:876256876" className="font-semibold text-alert underline underline-offset-2">876-256-876</a> immediately.
          </li>
          <li>Technical disruptions beyond our control may require rescheduling or converting to an in-person clinical visit.</li>
          <li>Electronic prescriptions for controlled substances are subject to federal DEA and state medical board prescribing regulations.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'conduct',
    title: 'Patient Rights and Code of Conduct',
    content: (
      <p>
        Every patient has the right to considerate, respectful care regardless of race, creed, sex, national origin, sexual orientation, disability, or source of payment. Correspondingly, patients and visitors must treat healthcare providers and fellow patients with civility. Verbal threats, physical violence, or disruptive behavior will result in immediate removal from hospital premises.
      </p>
    ),
  },
  {
    id: 'financial',
    title: 'Financial Responsibility & Assignment of Insurance Benefits',
    content: (
      <p>
        You authorize ProHealth to bill your health insurance carrier directly for medical services rendered. However, you acknowledge personal financial responsibility for all copayments, deductibles, coinsurance, and non-covered services determined by your insurer. Payment of estimated copayments is due at the time of clinical registration.
      </p>
    ),
  },
  {
    id: 'non-discrimination',
    title: 'Section 1557 Non-Discrimination Notice',
    content: (
      <p>
        ProHealth Academic Medical Center complies with applicable Federal civil rights laws and does not discriminate on the basis of race, color, national origin, age, disability, or sex. Free language interpretation services (including ASL) are available upon request for all clinical encounters.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      <PolicyLayout
        breadcrumb="Terms of Care"
        badge="Patient Agreement"
        title="Terms of Clinical Care & Admission Agreement"
        meta="Last Updated: September 13, 2026 | Governing ProHealth Clinical Facilities"
        sections={SECTIONS}
      />

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
