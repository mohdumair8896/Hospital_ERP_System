import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Receipt, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";

export interface ClinicalInvoice {
  invoice: string;
  patientName: string;
  mrn: string;
  service: string;
  payer: string;
  copayAmount: string;
  totalAmount: string;
  paymentStatus: "Settled" | "Adjudicating" | "Copay Due" | "Under Review";
  serviceDate: string;
}

export const invoices: ClinicalInvoice[] = [
  {
    invoice: "CLM-8941",
    patientName: "James Wilson",
    mrn: "MRN-10492",
    service: "Cardiology Stress Echo & ECG",
    payer: "Blue Cross Blue Shield PPO",
    copayAmount: "$35.00",
    totalAmount: "$1,450.00",
    paymentStatus: "Settled",
    serviceDate: "Today, 08:30 AM",
  },
  {
    invoice: "CLM-8942",
    patientName: "Eleanor Vance",
    mrn: "MRN-10493",
    service: "Emergency Triage & Brain CT",
    payer: "Medicare Part B (Primary)",
    copayAmount: "$0.00",
    totalAmount: "$3,200.00",
    paymentStatus: "Settled",
    serviceDate: "Today, 09:15 AM",
  },
  {
    invoice: "CLM-8943",
    patientName: "Carlos Mendez",
    mrn: "MRN-10494",
    service: "Orthopedic Closed Reduction",
    payer: "Aetna Choice POS II",
    copayAmount: "$75.00",
    totalAmount: "$2,100.00",
    paymentStatus: "Adjudicating",
    serviceDate: "Today, 10:00 AM",
  },
  {
    invoice: "CLM-8944",
    patientName: "Sarah Jenkins",
    mrn: "MRN-10495",
    service: "Comprehensive Metabolic Panel",
    payer: "UnitedHealthcare Choice",
    copayAmount: "$25.00",
    totalAmount: "$480.00",
    paymentStatus: "Settled",
    serviceDate: "Today, 10:45 AM",
  },
  {
    invoice: "CLM-8945",
    patientName: "Robert Chen",
    mrn: "MRN-10496",
    service: "Consultant Neurology & EEG",
    payer: "Cigna Open Access",
    copayAmount: "$50.00",
    totalAmount: "$1,850.00",
    paymentStatus: "Copay Due",
    serviceDate: "Today, 11:30 AM",
  },
  {
    invoice: "CLM-8946",
    patientName: "Maria Santos",
    mrn: "MRN-10497",
    service: "Pediatric Acute Bronchiolitis",
    payer: "Kaiser Senior / Commercial",
    copayAmount: "$20.00",
    totalAmount: "$920.00",
    paymentStatus: "Adjudicating",
    serviceDate: "Today, 01:00 PM",
  },
  {
    invoice: "CLM-8947",
    patientName: "David Miller",
    mrn: "MRN-10498",
    service: "Surgical Observation & Labs",
    payer: "Self-Pay (Sliding Scale Care)",
    copayAmount: "$150.00",
    totalAmount: "$4,850.00",
    paymentStatus: "Under Review",
    serviceDate: "Yesterday, 04:20 PM",
  },
];

export function TableDemo() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/60 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableCaption className="pb-3 text-xs text-slate-500">
            Official Hospital Revenue Cycle &amp; Patient Insurance Adjudication Ledger — All transactions audited under HIPAA Title II.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-slate-50/80 dark:bg-slate-800/60">
              <TableHead className="w-[110px] font-semibold text-slate-900 dark:text-slate-200">Claim ID</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Patient &amp; MRN</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Clinical Service</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Primary Payer</TableHead>
              <TableHead className="font-semibold text-slate-900 dark:text-slate-200">Status</TableHead>
              <TableHead className="text-right font-semibold text-slate-900 dark:text-slate-200">Copay</TableHead>
              <TableHead className="text-right font-semibold text-slate-900 dark:text-slate-200">Total Claim</TableHead>
              <TableHead className="w-[100px] text-center font-semibold text-slate-900 dark:text-slate-200">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.invoice} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                <TableCell className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {inv.invoice}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-sm text-slate-900 dark:text-slate-100">
                    {inv.patientName}
                  </div>
                  <div className="font-mono text-[11px] text-slate-500">
                    {inv.mrn}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
                    {inv.service}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {inv.serviceDate}
                  </div>
                </TableCell>
                <TableCell className="text-xs text-slate-600 dark:text-slate-300">
                  {inv.payer}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.paymentStatus === "Settled"
                        ? "default"
                        : inv.paymentStatus === "Adjudicating"
                        ? "secondary"
                        : inv.paymentStatus === "Copay Due"
                        ? "destructive"
                        : "outline"
                    }
                    className="text-[10px] font-medium px-2 py-0.5 whitespace-nowrap inline-flex items-center gap-1"
                  >
                    {inv.paymentStatus === "Settled" && <CheckCircle2 className="w-2.5 h-2.5" />}
                    {inv.paymentStatus === "Adjudicating" && <Clock className="w-2.5 h-2.5" />}
                    {inv.paymentStatus === "Copay Due" && <AlertCircle className="w-2.5 h-2.5" />}
                    {inv.paymentStatus}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-xs font-mono text-slate-600 dark:text-slate-300">
                  {inv.copayAmount}
                </TableCell>
                <TableCell className="text-right font-mono font-semibold text-sm text-slate-900 dark:text-slate-100">
                  {inv.totalAmount}
                </TableCell>
                <TableCell className="text-center">
                  <button
                    type="button"
                    title="View Superbill Statement"
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 rounded border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <Receipt className="w-3 h-3" />
                    Bill
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-slate-50/90 dark:bg-slate-900/90 font-semibold border-t border-slate-200 dark:border-slate-800">
              <TableCell colSpan={6} className="text-xs text-slate-700 dark:text-slate-200">
                Total Claims Value (7 Encounters Today)
              </TableCell>
              <TableCell className="text-right font-mono text-sm text-slate-900 dark:text-white font-bold">
                $14,850.00
              </TableCell>
              <TableCell />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export default TableDemo;
