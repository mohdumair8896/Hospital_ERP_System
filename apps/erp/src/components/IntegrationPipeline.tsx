import React, { useState } from 'react';
import {
  Network,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCode2,
  Server,
  Database,
  Activity,
  ShieldCheck,
  Building2,
  ExternalLink,
  Code2,
  Play
} from 'lucide-react';

interface PipelineStep {
  id: string;
  stepNumber: number;
  title: string;
  hl7Code: string;
  source: string;
  destination: string;
  description: string;
  status: 'COMPLETED' | 'ACTIVE' | 'READY';
  payloadSummary: string;
  hl7Sample: string;
  fhirJson: string;
}

const PIPELINE_STEPS: PipelineStep[] = [
  {
    id: 'step_1_2',
    stepNumber: 1,
    title: 'Consultation Booking on Patient Website',
    hl7Code: 'SIU^S12',
    source: 'Patient Website Portal',
    destination: 'Integration Gateway -> Appointment Service',
    description: 'Patient selects specialist physician, slot, and enters symptom triage notes. Emits SIU^S12 (Notification of New Appointment Booking).',
    status: 'COMPLETED',
    payloadSummary: 'Appointment Booked • Dr. Sarah Patel (Cardiology) • Slot: 10:30 AM',
    hl7Sample: `MSH|^~\\&|PROHEALTH_WEB|PATIENT_PORTAL|GATEWAY_HIS|HOSP_ERP|20260914135500||SIU^S12|MSG009821|P|2.5\nSCH|APT-9401|||||MED_CONSULT|General Cardiology Consult|15|m|^^^20260914103000\nPID|1||PAT-9821^^^PROHEALTH^MR||Hubert^Paulo^^^^||19850412|M\nPV1|1|O|OPD^ROOM302^01|R|||DOC_SARAH^Patel^Sarah^^^^MD`,
    fhirJson: `{
  "resourceType": "Appointment",
  "id": "apt-9401",
  "status": "booked",
  "serviceType": [{ "coding": [{ "code": "cardiology", "display": "Cardiology Consultation" }] }],
  "participant": [
    { "actor": { "reference": "Practitioner/doc_sarah", "display": "Dr. Sarah Patel" }, "status": "accepted" },
    { "actor": { "reference": "Patient/pat_1", "display": "Paulo Hubert" }, "status": "accepted" }
  ]
}`
  },
  {
    id: 'step_3_4',
    stepNumber: 2,
    title: 'Digital Check-in & Outpatient Arrival',
    hl7Code: 'ADT^A04',
    source: 'Reception Desk / Web Check-in',
    destination: 'Patient Service & Clinic Queue',
    description: 'Patient arrives at OPD or checks in digitally on day of visit. Emits ADT^A04 (Register an Outpatient). Vitals captured.',
    status: 'COMPLETED',
    payloadSummary: 'Patient Arrived at OPD Desk • Triage Vitals: BP 124/82, HR 72, SpO2 99%',
    hl7Sample: `MSH|^~\\&|RECEPTION_OPD|PROHEALTH|GATEWAY_HIS|HOSP_ERP|20260914140000||ADT^A04|MSG009822|P|2.5\nEVN|A04|20260914140000\nPID|1||PAT-9821^^^PROHEALTH^MR||Hubert^Paulo^^^^||19850412|M\nPV1|1|O|OPD^DESK01^01||||DOC_SARAH^Patel^Sarah^^^^MD||||||||||||ENC-2026-09-01`,
    fhirJson: `{
  "resourceType": "Encounter",
  "id": "enc-2026-09-01",
  "status": "in-progress",
  "class": { "code": "AMB", "display": "ambulatory" },
  "subject": { "reference": "Patient/pat_1" },
  "participant": [{ "individual": { "reference": "Practitioner/doc_sarah" } }]
}`
  },
  {
    id: 'step_5',
    stepNumber: 3,
    title: 'Clinical Encounter & Inpatient Admission',
    hl7Code: 'ADT^A01',
    source: 'Clinical Workbench (Doctor)',
    destination: 'Hospital ERP / HIS Bed Management',
    description: 'Attending physician evaluates patient, documents primary diagnosis (ICD-10), and admits to Cardiology Inpatient Unit. Emits ADT^A01.',
    status: 'COMPLETED',
    payloadSummary: 'Admitted to Inpatient • Unit: CCU Bed 04 • Diagnosis: I20.0 (Unstable Angina)',
    hl7Sample: `MSH|^~\\&|CLINICAL_EHR|PROHEALTH|GATEWAY_HIS|HOSP_ERP|20260914142000||ADT^A01|MSG009823|P|2.5\nPID|1||PAT-9821^^^PROHEALTH^MR||Hubert^Paulo^^^^||19850412|M\nPV1|1|I|CARD^BED04^02||||DOC_SARAH^Patel^Sarah^^^^MD\nDG1|1|ICD10|I20.0|Unstable angina|20260914142000|A`,
    fhirJson: `{
  "resourceType": "Encounter",
  "id": "enc-inpatient-01",
  "status": "arrived",
  "class": { "code": "IMP", "display": "inpatient encounter" },
  "hospitalization": { "admitSource": { "text": "OPD Escalation" } }
}`
  },
  {
    id: 'step_6',
    stepNumber: 4,
    title: 'CPOE Order to Laboratory (LIS)',
    hl7Code: 'ORM^O01',
    source: 'Clinical Workbench',
    destination: 'Pathology & Laboratory Information System (LIS)',
    description: 'Physician generates computerized physician order entry (CPOE) for High-Sensitivity Troponin I & Lipid Panel. Emits ORM^O01.',
    status: 'COMPLETED',
    payloadSummary: 'Lab Order Dispatched: STAT Cardiac Biomarkers & CBC Differential',
    hl7Sample: `MSH|^~\\&|CPOE_ENGINE|PROHEALTH|LAB_LIS|LIS_ENGINE|20260914142500||ORM^O01|MSG009824|P|2.5\nPID|1||PAT-9821^^^PROHEALTH^MR||Hubert^Paulo^^^^||19850412|M\nORC|NW|ORD-8819|||SC||^^^20260914142500|||DOC_SARAH^Patel^Sarah\nOBR|1|ORD-8819||TROP-I^Cardiac Troponin I STAT^LN|||20260914142500`,
    fhirJson: `{
  "resourceType": "ServiceRequest",
  "id": "ord-8819",
  "status": "active",
  "intent": "order",
  "priority": "stat",
  "code": { "coding": [{ "system": "http://loinc.org", "code": "42757-5", "display": "Troponin I.cardiac [Mass/volume] in Blood" }] },
  "subject": { "reference": "Patient/pat_1" }
}`
  },
  {
    id: 'step_7_8',
    stepNumber: 5,
    title: 'Pathology Results Approval & Clinical Repository',
    hl7Code: 'ORU^R01',
    source: 'LIS Analyzer / Pathologist',
    destination: 'Clinical Repository (CDR) & Audit Ledger',
    description: 'Pathology approves test result: Troponin 0.014 ng/mL (Normal). Emits ORU^R01 (Observation Result Unsolicited) and notifies patient.',
    status: 'COMPLETED',
    payloadSummary: 'Results Approved: Troponin I: 0.014 ng/mL (Reference < 0.034) • Certified',
    hl7Sample: `MSH|^~\\&|LAB_LIS|LIS_ENGINE|CLINICAL_CDR|HOSP_ERP|20260914145000||ORU^R01|MSG009825|P|2.5\nPID|1||PAT-9821^^^PROHEALTH^MR||Hubert^Paulo^^^^||19850412|M\nOBR|1|ORD-8819||TROP-I^Cardiac Troponin I^LN|||20260914144500|||||||||||F\nOBX|1|NM|42757-5^Troponin I^LN||0.014|ng/mL|< 0.034|N|||F|||20260914144800`,
    fhirJson: `{
  "resourceType": "Observation",
  "id": "obs-trop-01",
  "status": "final",
  "code": { "coding": [{ "system": "http://loinc.org", "code": "42757-5", "display": "Troponin I" }] },
  "valueQuantity": { "value": 0.014, "unit": "ng/mL", "system": "http://unitsofmeasure.org" },
  "interpretation": [{ "coding": [{ "code": "N", "display": "Normal" }] }]
}`
  },
  {
    id: 'step_9_12',
    stepNumber: 6,
    title: 'Financial Posting & Ledger Settlement',
    hl7Code: 'DFT^P03',
    source: 'Revenue Cycle Engine (RCM)',
    destination: 'PostgreSQL ACID Financial Ledger',
    description: 'Itemized claim generated, insurance processed, patient copay completed. Emits DFT^P03 (Detailed Financial Transaction) and settles AR ledger.',
    status: 'COMPLETED',
    payloadSummary: 'Account Settled • Ledger ID: LEDGER-94812 • Total $220.00 Paid',
    hl7Sample: `MSH|^~\\&|RCM_BILLING|PROHEALTH|FIN_LEDGER|HOSP_ERP|20260914151000||DFT^P03|MSG009826|P|2.5\nEVN|P03|20260914151000\nPID|1||PAT-9821^^^PROHEALTH^MR||Hubert^Paulo^^^^||19850412|M\nFT1|1|||20260914151000||CG|99214^Office Visit Established Level 4|||1|220.00|||PAID^Credit Card`,
    fhirJson: `{
  "resourceType": "ClaimResponse",
  "id": "claim-resp-94812",
  "status": "active",
  "type": { "coding": [{ "code": "professional" }] },
  "outcome": "complete",
  "total": [{ "category": { "text": "Submitted" }, "amount": { "value": 220.0, "currency": "USD" } }],
  "payment": { "type": { "text": "Settled" }, "amount": { "value": 220.0, "currency": "USD" } }
}`
  }
];

export default function IntegrationPipeline() {
  const [selectedStep, setSelectedStep] = useState<PipelineStep>(PIPELINE_STEPS[0]);
  const [viewFormat, setViewFormat] = useState<'HL7' | 'FHIR'>('HL7');

  return (
    <div className="space-y-6 w-full min-w-0 max-w-full">
      {/* Header Banner */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Healthcare Clinical Integration Pipeline &amp; Interoperability Hub
          </h1>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full">
            HL7 v2.5 / FHIR R4
          </span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-3xl">
          Complete end-to-end integration lifecycle connecting the decoupled Patient Website to the Hospital ERP through the central API Gateway. Illustrates standardized clinical messaging across booking, registration (ADT), CPOE laboratory orders, and financial posting.
        </p>
      </div>

      {/* Interactive Sequence Steps Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {PIPELINE_STEPS.map((step) => {
          const isSelected = selectedStep.id === step.id;
          return (
            <button
              key={step.id}
              onClick={() => setSelectedStep(step)}
              className={`text-left p-4 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-primary bg-primary/5 shadow-sm ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-primary/40 hover:bg-muted/30'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-foreground border">
                    Step {step.stepNumber}: {step.hl7Code}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>
                <h4 className="text-xs font-extrabold text-foreground">{step.title}</h4>
                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {step.description}
                </p>
              </div>

              <div className="border-t pt-2.5 mt-3 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span className="truncate max-w-[140px]">{step.source.split(' ')[0]}</span>
                <ArrowRight className="w-3 h-3 text-primary shrink-0" />
                <span className="truncate max-w-[140px] text-right">{step.destination.split(' ')[0]}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Event Payload & Spec Inspector */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs space-y-4 w-full min-w-0 max-w-full overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded">
                {selectedStep.hl7Code}
              </span>
              <h3 className="text-sm font-extrabold text-foreground">{selectedStep.title}</h3>
            </div>
            <span className="text-[11px] text-muted-foreground mt-0.5 block">
              {selectedStep.source} ➔ {selectedStep.destination}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border">
            <button
              onClick={() => setViewFormat('HL7')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewFormat === 'HL7'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              HL7 v2.5 ER7
            </button>
            <button
              onClick={() => setViewFormat('FHIR')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                viewFormat === 'FHIR'
                  ? 'bg-card text-foreground shadow-xs'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              FHIR R4 JSON
            </button>
          </div>
        </div>

        {/* Payload Box */}
        <div className="relative w-full min-w-0 max-w-full overflow-hidden">
          <pre className="p-4 bg-slate-950 text-slate-100 rounded-xl font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed max-h-80 w-full min-w-0 max-w-full break-all whitespace-pre-wrap sm:whitespace-pre sm:break-normal">
            <code>
              {viewFormat === 'HL7' ? selectedStep.hl7Sample.replace(/\\r|\r/g, '\n') : selectedStep.fhirJson}
            </code>
          </pre>
        </div>

        <div className="bg-muted/40 p-3.5 rounded-xl border text-xs text-muted-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              All message payloads are cryptographically signed with SHA-256 and committed to the immutable hospital compliance audit ledger.
            </span>
          </div>
          <span className="font-mono text-[10px] text-primary font-bold">HIPAA § 164.312(b)</span>
        </div>
      </div>
    </div>
  );
}
