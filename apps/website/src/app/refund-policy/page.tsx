import React from 'react';
import type { Metadata } from 'next';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { PolicyLayout, type PolicySection } from '../../components/content/PolicyLayout';

export const metadata: Metadata = {
  title: 'Billing, Cancellation & Refund Policy',
  description: 'Policies on appointment deposit refunds, insurance overpayment reimbursements, and medical billing dispute resolution.',
};

const SECTIONS: PolicySection[] = [
  {
    id: 'cancellation',
    title: 'Appointment Cancellation & Deposit Reimbursement',
    content: (
      <>
        <p>
          ProHealth strives to provide timely access for all patients requiring specialty consultations. If you need to cancel or reschedule an elective clinical appointment or telehealth session:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <h3 className="text-sm text-emerald-950 font-bold">Notice 24+ Hours in Advance:</h3>
            <p className="text-sm text-emerald-900">
              Eligible for a 100% full refund of any pre-paid consultation deposit or copayment, credited to the original payment method within 3–5 banking business days.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
            <h3 className="text-sm text-amber-950 font-bold">Late Cancellation (&lt;24 Hours) or No-Show:</h3>
            <p className="text-sm text-amber-900">
              A nominal administrative fee of $35 may be retained to offset reserved clinical suite preparation, unless excused by emergency medical circumstances.
            </p>
          </div>
        </div>
      </>
    ),
  },
  {
    id: 'overpayments',
    title: 'Insurance Adjudication & Overpayment Refunds',
    content: (
      <>
        <p>
          When ProHealth receives payment from your commercial insurance plan or government program (Medicare/Medicaid) that exceeds your actual out-of-pocket financial liability, a credit balance occurs:
        </p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li><strong>Automated Reconciliation:</strong> All accounts with active credit balances undergo bi-weekly financial reconciliation.</li>
          <li><strong>Prompt Disbursement:</strong> Verified overpayments are automatically disbursed via ACH or refund check within 14 business days of final claim adjudication.</li>
          <li><strong>Cross-Account Application:</strong> If you have an outstanding balance on another active ProHealth account, credits may be applied before issuing a net refund.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'disputes',
    title: 'Disputing a Clinical Bill or Service Charge',
    content: (
      <>
        <p>
          Patients who have questions regarding a bill, itemized clinical invoice, or insurance denial are encouraged to contact our Patient Financial Advocacy team. We are committed to resolving billing inquiries fairly and transparently under the federal No Surprises Act.
        </p>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-sm">
          <div><strong>Patient Billing Helpline:</strong> +1 (555) 019-2850 (Monday–Friday: 8:00 AM – 5:00 PM EST)</div>
          <div><strong>Billing Inquiries Email:</strong> billing@prohealth.hospital</div>
          <div><strong>Office Location:</strong> Financial Clearance Center, Pavilion C Ground Floor</div>
        </div>
      </>
    ),
  },
];

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      <PolicyLayout
        breadcrumb="Billing & Refunds"
        badge="Financial Transparency"
        title="Medical Billing, Cancellation & Refund Policy"
        meta="Governing Patient Financial Services | Last Updated: September 13, 2026"
        sections={SECTIONS}
      />

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
