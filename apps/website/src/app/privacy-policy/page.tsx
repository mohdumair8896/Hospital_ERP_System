import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { ShieldCheck, Lock, FileText, ChevronRight, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'HIPAA Notice of Privacy Practices & Data Security | ProHealth Hospital',
  description: 'Our official Notice of Privacy Practices (NPP) outlining how protected health information (ePHI) is encrypted, audited, and safeguarded.',
};

export default function PrivacyPolicyPage() {
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
            <span className="text-[#1F5084] font-semibold">Privacy Policy</span>
          </nav>
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              HIPAA Compliant Notice
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              HIPAA Notice of Privacy Practices
            </h1>
            <p className="text-xs text-[#475467]">
              Effective Date: January 1, 2026 | Last Revised: September 13, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full space-y-10 text-xs text-slate-700 leading-relaxed">
        {/* Highlight Alert */}
        <div className="p-5 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-cyan-950 space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-cyan-900">
            <ShieldCheck className="w-5 h-5 text-cyan-600 shrink-0" />
            <span>Our Privacy Commitment to You</span>
          </div>
          <p className="text-xs text-cyan-900/90 leading-relaxed">
            This Notice describes how medical information about you may be used and disclosed, and how you can get access to this information under the Health Insurance Portability and Accountability Act of 1996 (HIPAA) and applicable state health privacy laws. Please review it carefully.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            1. What is Protected Health Information (PHI)?
          </h2>
          <p>
            Protected Health Information (PHI) encompasses individually identifiable health data created, received, or maintained by ProHealth Academic Medical Center. This includes your medical history, clinical encounters, diagnostic lab reports, radiological imaging, vital signs, prescription records, demographic contact details, and billing records.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            2. Permissible Uses and Disclosures Without Prior Authorization
          </h2>
          <p>
            Federal regulations permit ProHealth to utilize and disclose your PHI for three primary healthcare operational purposes:
          </p>
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
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            3. Your Individual Privacy Rights Under HIPAA
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-xs block">Right to Inspect & Copy</strong>
              <p className="text-[11px] text-slate-500">
                You have the right to inspect and obtain an electronic or paper copy of your medical record within 30 calendar days.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-xs block">Right to Request Amendments</strong>
              <p className="text-[11px] text-slate-500">
                If you believe medical records maintained by ProHealth contain inaccuracies, you may submit a written amendment request.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-xs block">Accounting of Disclosures (§ 164.528)</strong>
              <p className="text-[11px] text-slate-500">
                You may request a list of all non-routine disclosures of your health record. Our system maintains an immutable cryptographic log of every database access.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <strong className="text-slate-900 text-xs block">Right to Confidential Communication</strong>
              <p className="text-[11px] text-slate-500">
                You may request that our staff contact you only at specific phone numbers, confidential mailing addresses, or via the secure ERP portal.
              </p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            4. Cryptographic Security & Zero-Trust Technology Architecture
          </h2>
          <p>
            To prevent unauthorized access, tampering, or data breaches, ProHealth enforces zero-trust electronic record security:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>AES-256 Encryption at Rest:</strong> All database files are encrypted using hardware security modules (HSM).</li>
            <li><strong>TLS 1.3 in Transit:</strong> High-grade transport encryption across all client-to-gateway network sessions.</li>
            <li><strong>Cryptographic SHA-256 Hash Chaining:</strong> All clinical reads and modifications emit append-only tamper-evident audit records.</li>
            <li><strong>Record-Level Security (RLS):</strong> Enforced architectural security boundaries prevent cross-patient record access (IDOR defense).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            5. Contacting the Privacy Officer & Filing Complaints
          </h2>
          <p>
            If you believe your privacy rights have been violated, you may file a formal complaint with our Chief Compliance Officer without fear of retaliation:
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-[11px] space-y-1">
            <div><strong>Hospital Privacy Officer:</strong> Eleanor Campbell, JD, CHC</div>
            <div><strong>Email:</strong> privacy@prohealth.hospital</div>
            <div><strong>Phone:</strong> +1 (555) 019-2839</div>
            <div><strong>Address:</strong> 123 Healthcare Blvd, Compliance Tower Room 410, New York, NY 10016</div>
            <div className="pt-2 text-slate-500">
              You may also file a complaint with the Secretary of the U.S. Department of Health and Human Services (HHS) Office for Civil Rights.
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
