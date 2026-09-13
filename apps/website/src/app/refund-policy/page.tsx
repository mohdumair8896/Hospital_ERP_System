import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { CreditCard, DollarSign, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Billing, Cancellation & Refund Policy | ProHealth Hospital',
  description: 'Policies on appointment deposit refunds, insurance overpayment reimbursements, and medical billing dispute resolution.',
};

export default function RefundPolicyPage() {
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
            <span className="text-[#1F5084] font-semibold">Billing &amp; Refunds</span>
          </nav>
          <div className="space-y-2">
            <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-[#1F5084] bg-[#1F5084]/10 px-2.5 py-0.5 rounded border border-[#1F5084]/20">
              Financial Transparency
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              Medical Billing, Cancellation &amp; Refund Policy
            </h1>
            <p className="text-xs text-[#475467]">
              Governing Patient Financial Services | Last Updated: September 13, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full space-y-10 text-xs text-slate-700 leading-relaxed">
        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            1. Appointment Cancellation & Deposit Reimbursement
          </h2>
          <p>
            ProHealth strives to provide timely access for all patients requiring specialty consultations. If you need to cancel or reschedule an elective clinical appointment or telehealth session:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
              <strong className="text-emerald-950 font-bold block">Notice 24+ Hours in Advance:</strong>
              <p className="text-emerald-900 text-[11px]">
                Eligible for a 100% full refund of any pre-paid consultation deposit or copayment, credited to the original payment method within 3–5 banking business days.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
              <strong className="text-amber-950 font-bold block">Late Cancellation (&lt;24 Hours) or No-Show:</strong>
              <p className="text-amber-900 text-[11px]">
                A nominal administrative fee of $35 may be retained to offset reserved clinical suite preparation, unless excused by emergency medical circumstances.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            2. Insurance Adjudication & Overpayment Refunds
          </h2>
          <p>
            When ProHealth receives payment from your commercial insurance plan or government program (Medicare/Medicaid) that exceeds your actual out-of-pocket financial liability, a credit balance occurs:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li><strong>Automated Reconciliation:</strong> All accounts with active credit balances undergo bi-weekly financial reconciliation.</li>
            <li><strong>Prompt Disbursement:</strong> Verified overpayments are automatically disbursed via ACH or refund check within 14 business days of final claim adjudication.</li>
            <li><strong>Cross-Account Application:</strong> If you have an outstanding balance on another active ProHealth account, credits may be applied before issuing a net refund.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 font-display">
            3. Disputing a Clinical Bill or Service Charge
          </h2>
          <p>
            Patients who have questions regarding a bill, itemized clinical invoice, or insurance denial are encouraged to contact our Patient Financial Advocacy team. We are committed to resolving billing inquiries fairly and transparently under the federal No Surprises Act.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-[11px]">
            <div><strong>Patient Billing Helpline:</strong> +1 (555) 019-2850 (Monday–Friday: 8:00 AM – 5:00 PM EST)</div>
            <div><strong>Billing Inquiries Email:</strong> billing@prohealth.hospital</div>
            <div><strong>Office Location:</strong> Financial Clearance Center, Pavilion C Ground Floor</div>
          </div>
        </section>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
