import React from 'react';
import type { Metadata } from 'next';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { PolicyLayout, type PolicySection } from '../../components/content/PolicyLayout';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HIPAA Notice of Privacy Practices & Data Security',
  description: 'Our official Notice of Privacy Practices (NPP) outlining how protected health information (ePHI) is encrypted, audited, and safeguarded.',
};

const RIGHTS = [
  {
    title: 'Right to Inspect & Copy',
    body: 'You have the right to inspect and obtain an electronic or paper copy of your medical record within 30 calendar days.',
  },
  {
    title: 'Right to Request Amendments',
    body: 'If you believe medical records maintained by ProHealth contain inaccuracies, you may submit a written amendment request.',
  },
  {
    title: 'Accounting of Disclosures (§ 164.528)',
    body: 'You may request a list of all non-routine disclosures of your health record. Our system maintains an immutable cryptographic log of every database access.',
  },
  {
    title: 'Right to Confidential Communication',
    body: 'You may request that our staff contact you only at specific phone numbers, confidential mailing addresses, or via the secure ERP portal.',
  },
];

const SECTIONS: PolicySection[] = [
  {
    id: 'what-is-phi',
    title: 'What is Protected Health Information (PHI)?',
    content: (
      <p>
        Protected Health Information (PHI) encompasses individually identifiable health data created, received, or maintained by ProHealth Academic Medical Center. This includes your medical history, clinical encounters, diagnostic lab reports, radiological imaging, vital signs, prescription records, demographic contact details, and billing records.
      </p>
    ),
  },
  {
    id: 'permitted-uses',
    title: 'Permissible Uses and Disclosures Without Prior Authorization',
    content: (
      <>
        <p>Federal regulations permit ProHealth to utilize and disclose your PHI for three primary healthcare operational purposes:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Treatment:</strong> Providing, coordinating, or managing your clinical care. For example, our attending cardiologists share consultation notes with our cardiac surgical nursing team.
          </li>
          <li>
            <strong>Payment:</strong> Generating claims and obtaining reimbursement from your commercial insurer, Medicare, Medicaid, or managed care organization.
          </li>
          <li>
            <strong>Healthcare Operations:</strong> Quality assessment, peer-review audits, clinical accreditation surveys, and clinical risk management.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: 'your-rights',
    title: 'Your Individual Privacy Rights Under HIPAA',
    content: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {RIGHTS.map((right) => (
          <div key={right.title} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
            <h3 className="text-sm font-bold text-slate-900">{right.title}</h3>
            <p className="text-sm text-slate-600">{right.body}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'security',
    title: 'Cryptographic Security & Zero-Trust Technology Architecture',
    content: (
      <>
        <p>To prevent unauthorized access, tampering, or data breaches, ProHealth enforces zero-trust electronic record security:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>AES-256 Encryption at Rest:</strong> All database files are encrypted using hardware security modules (HSM).</li>
          <li><strong>TLS 1.3 in Transit:</strong> High-grade transport encryption across all client-to-gateway network sessions.</li>
          <li><strong>Cryptographic SHA-256 Hash Chaining:</strong> All clinical reads and modifications emit append-only tamper-evident audit records.</li>
          <li><strong>Record-Level Security (RLS):</strong> Enforced architectural security boundaries prevent cross-patient record access (IDOR defense).</li>
        </ul>
      </>
    ),
  },
  {
    id: 'complaints',
    title: 'Contacting the Privacy Officer & Filing Complaints',
    content: (
      <>
        <p>If you believe your privacy rights have been violated, you may file a formal complaint with our Chief Compliance Officer without fear of retaliation:</p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm space-y-1">
          <div><strong>Hospital Privacy Officer:</strong> Eleanor Campbell, JD, CHC</div>
          <div><strong>Email:</strong> privacy@prohealth.hospital</div>
          <div><strong>Phone:</strong> +1 (555) 019-2839</div>
          <div><strong>Address:</strong> 123 Healthcare Blvd, Compliance Tower Room 410, New York, NY 10016</div>
          <div className="pt-2 text-slate-600">
            You may also file a complaint with the Secretary of the U.S. Department of Health and Human Services (HHS) Office for Civil Rights.
          </div>
        </div>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      <PolicyLayout
        breadcrumb="Privacy Policy"
        badge="HIPAA Compliant Notice"
        badgeTone="care"
        title="HIPAA Notice of Privacy Practices"
        meta="Effective Date: January 1, 2026 | Last Revised: September 13, 2026"
        intro={
          <div className="p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-cyan-950 space-y-2">
            <p className="flex items-center gap-2 font-bold text-cyan-900">
              <ShieldCheck className="w-5 h-5 text-cyan-700 shrink-0" aria-hidden="true" />
              <span>Our Privacy Commitment to You</span>
            </p>
            <p className="text-sm text-cyan-900 leading-relaxed">
              This Notice describes how medical information about you may be used and disclosed, and how you can get access to this information under the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and applicable state health privacy laws. Please review it carefully.
            </p>
          </div>
        }
        sections={SECTIONS}
      />

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
