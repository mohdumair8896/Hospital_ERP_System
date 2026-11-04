/** Sample HL7 v2.5 / FHIR R4 messages for the illustrative pipeline walkthrough (not live traffic). */
export interface PipelineStep {
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

export const PIPELINE_STEPS: PipelineStep[] = [
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
