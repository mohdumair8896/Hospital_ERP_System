# Hospital ERP Benchmark: How the Leaders Work and What ProHealth Needs

Research date: October 2026. This document summarises two research reports, which include full citations:

- [research/erp-commercial-systems.md](research/erp-commercial-systems.md): Epic, Oracle Health (Cerner), MEDITECH Expanse, athenaOne, Altera Sunrise, eClinicalWorks, NextGen, Indian HIMS (KareXpert, Insta by Practo, MediXcel, Birlamedisoft, Suvarna, Akhil, NIC e-Hospital), ABDM, the IRDAI pre-authorization rules, and SAP / Oracle Fusion / Workday. Built from public documentation, training material, release notes and interoperability specifications.
- [research/erp-open-source-systems.md](research/erp-open-source-systems.md): the source code of OpenMRS (core and FHIR2), Bahmni, OpenEMR, ERPNext Healthcare (Marley), GNU Health and HospitalRun, plus the FHIR R4 specification.

Statements about ProHealth's code come from reading the code, and the security ones were reproduced against the running system (marked **verified**).

---

## 1. How the leading systems operate

### One patient record, many applications
Epic runs about 39 modules (Cadence, Prelude, Grand Central, ASAP, Willow, Beaker, Radiant, OpTime, Resolute, MyChart and others) on **one database**. Oracle Millennium, MEDITECH Expanse and Altera Sunrise use the same model. Departmental modules are workflows and views over shared records, not separate copies. A pharmacist, a nurse and a biller all work on the same chart.

The common data spine:

```
Patient (MRN/MPI, identifiers such as ABHA, allergies, problems, consents)
  └── Encounter / Visit (OPD | IPD | ED | Daycare | Tele; status, location/bed, attending)
        ├── Orders (lab, imaging, medication, procedure; their own lifecycle)
        │     └── Results / Dispenses / Administrations (linked by order id or accession)
        ├── Clinical documents (notes, flowsheets, assessments, care plans)
        └── Charges (posted automatically from orders, results, doses and bed-days via the tariff)
Account (billing container per stay or visit) → Guarantor (who pays) → Coverage → Pre-auth → Claim
```

Epic's public training material confirms the split between the hospital account and the guarantor account. athenahealth opens a placeholder "missing" claim at check-in so that no visit goes unbilled.

**What this means for a microservices system like ours:** patient and encounter must each have one authoritative service. Every other service holds only ids. Every state change emits a durable, versioned event, so that screens such as the patient banner, worklists and bed board can be assembled from those events.

### The 23-module map of a complete hospital ERP
| Group | Modules |
|---|---|
| Front office | Identity and access; Patient administration / MPI (duplicate detection, merge, ABHA); Scheduling and queue (templates, slots, walk-ins and appointments in one queue, tokens) |
| Inpatient | ADT and bed management (bed board, bed requests, transfers, discharge marks the bed dirty and creates a cleaning task); Nursing (flowsheets, care plans, NEWS2, handoff) |
| Clinical | Documentation (templates, smart phrases, sign/amend); Orders/CPOE with order sets; Clinical decision support (drug-drug and drug-allergy checks, NEWS2, sepsis); Emergency (triage, tracking board, medico-legal cases); Perioperative/OT (WHO checklist, anaesthesia record, implant capture) |
| Ancillary | Pharmacy (verification queue, dispensing, barcode eMAR); Laboratory (barcode specimens, analyzer interfaces, critical-value log); Radiology (worklist, PACS, reports); Ancillary services (diet, CSSD, blood bank, ambulance) |
| Revenue | Patient financials (tariff, packages, deposits, interim and final bills, discounts, refunds); Insurance/TPA desk (pre-auth, enhancement, claims, settlement) |
| Engagement | Patient portal and app (OTP/ABHA login, results, bills, telehealth) |
| Back office | Inventory and procurement (indent → PO → GRN → issue, batch and expiry); HR and rostering; Finance/GL export |
| Platform | BI and quality; Interoperability hub (HL7 v2, FHIR, ABDM, DICOM); Audit, privacy and consent; Business continuity (downtime reports) |

### End-to-end workflows (summary)
- **OPD:** book → reminder → register and verify (MPI search, ABHA, coverage) → **check-in creates the encounter and billing account** → triage and vitals → consult → orders and eRx (with CDS) → automatic charges → checkout and payment → claim → close (signed note, ABDM care context) → follow-up.
- **IPD/ADT:** admission request → financial clearance (deposit or TPA pre-auth) → bed assignment from the bed board → nursing admission assessment → admission order set → pharmacist verification → barcode eMAR → NEWS2 monitoring with escalation → transfers → running bill and TPA enhancement → discharge summary → final bill and TPA final approval → discharge (bed marked dirty, then cleaned, then available).
- **ED:** quick registration (unknown patients allowed) → ESI/MTS triage → tracking board (acuity colour, timers, pending results, sepsis flag) → disposition, with medico-legal case fields in India.
- **Lab:** ordered → collected (barcode) → received or rejected → in process (analyzer) → resulted → verified → reported to the ordering doctor's inbox and the portal; critical values are phoned and logged.
- **Pharmacy:** signed order → pharmacist verification → dispense (unit dose or ward stock) → barcode administration → returns and waste; outpatient sales use batch tracking and GST.
- **Billing:** charges are pushed from clinical events, and a "missing charge" worklist catches gaps. Price lists differ by payer and bed class, and packages define inclusions and exclusions. Claims go DRAFT → SCRUB_HOLD → READY → SUBMITTED → QUERY → APPROVED/SETTLED or DENIED → APPEALED (athenahealth's documented model).

### UX patterns that make them effective
1. **A patient sidebar that is always visible** (Epic Storyboard): demographics, allergies, problems and meds stay on screen whatever else is open.
2. **Worklists and an in-basket.** Every task has an owner role, a state and an SLA timer: results, refills, verification, specimen receipt, claim holds.
3. **Role-based home screens** (MEDITECH status boards, Oracle MPages).
4. **A unified queue** for walk-ins and appointments (Altera Sunrise 25.1).
5. **Global fuzzy patient search** (Epic Patient `$match`).
6. **Order sets, favourites, smart phrases and templates.**
7. **Time-columned flowsheets** with NEWS2 computed per column.
8. **ED tracking board and bed board with a cleaning loop.**
9. **Ambient AI documentation as draft only, with human review and source labelling.** Epic AI Charting has been generally available since February 2026, and Oracle launched a nurse agent in September 2026.
10. **Alert hygiene:** severity tiers and mandatory override reasons. Published studies show 49–96% of drug alerts get overridden.

### India-specific requirements
- **NABH Digital Health (HIS/EMR) certification** comes at Basic or Advanced level. Applying requires **three live hospital deployments and a valid ABDM M3 certificate**. NABH lists Suvarna and Akhil (Miracle HIS & EMR) at Advanced.
- **ABDM milestones:**
  - **M1:** ABHA creation and verification, plus Scan & Share.
  - **M2 (Health Information Provider):** discovery, linking care contexts, consent notifications, and encrypted FHIR bundles (OPConsult, Prescription, DiagnosticReport, DischargeSummary).
  - **M3 (Health Information User):** requesting consent and fetching records from other providers.
- **Cashless insurance:** press coverage of the IRDAI 2024 master circular says insurers must decide cashless pre-authorization within **1 hour** and give final discharge approval within **3 hours**. The PM-JAY packages are all-inclusive, and NHCX is the FHIR-based claims exchange.
- **DPDP Act:** the consent-notice obligations apply from May 2027.

---

## 2. Where ProHealth stands

### Strengths
- **Tamper-evident audit log.** A SHA-256 hash chain with integrity verification and HIPAA disclosure accounting. The live ledger holds about 1,400 records and verifies cleanly.
- **Clean domain split.** Auth, patient, appointment, clinical and audit services sit behind one gateway, with shared TypeScript contracts.
- **Patient-facing basics.** The website already has a doctor directory, departments, 5-step booking and symptom triage.

### Problems found in the code (fix before adding modules)
| # | Finding | Evidence |
|---|---|---|
| 1 | Login tokens are unsigned base64 JSON. A hand-made ADMIN token is accepted. The ERP login also creates tokens in the browser when the gateway call fails | **verified** (forged token → 200 on `/api/v1/audit/stats`); `auth-service/src/index.ts`, `api-gateway/src/security.ts`, `erp/src/components/LoginScreen.tsx` |
| 2 | Passwords are stored and compared in plain text | **verified**, `auth-service/src/database.ts:152` |
| 3 | `requireRoles` is never applied. Anonymous users can read the patient list, appointments, and the user list (usernames, emails, roles) | **verified**, anonymous GET → 200 |
| 4 | Services trust `x-user-*` headers for audit attribution, so a client can spoof them when no token is sent | code, `security.ts`, service `index.ts` files |
| 5 | Nothing consumes domain events (only the audit service subscribes, to audit events). The in-memory bus works only within one process, and the NATS client uses core publish (not JetStream), so events aren't stored or replayed | code, `packages/events/src/index.ts` |
| 6 | MRNs are `MRN-2026-` plus a random 5-digit number (the year is hard-coded and collisions become likely), and appointment numbers are `APT-2026-` plus 4 random digits. Consent is always `true` | **verified**, `patient-service/src/database.ts:137-168`, `packages/database/src/index.ts:199` |
| 7 | Encounters are saved directly as `FINALIZED`, with no draft → sign → amend cycle | **verified**, `clinical-service/src/index.ts:113` |
| 8 | Appointments have no slot-capacity or double-booking check, and any status change is allowed | code, `appointment-service/src/index.ts` |

### Gap summary
| Capability | ProHealth today | Priority | Owner (target) |
|---|---|---|---|
| Signed tokens, hashed passwords, default-deny access rules, trusted identity | Unsafe | **P0** | auth-service, gateway |
| Durable events (JetStream, outbox/inbox, idempotent consumers) | Publish-only | **P0** | packages/events, every service |
| MPI quality (sequence MRN, identifiers, duplicate match, merge) | Partial | **P0** | patient-service |
| Consent (purpose, scope, expiry, revocation) | Boolean, always true | **P0** | patient-service |
| Encounter lifecycle (draft, sign, amend with audit diff) | Saved as finalized | **P0** | clinical-service |
| Tariff, accounts, automatic charge capture, bills, payments, GST invoices | None | **P0** for any paying deployment | new billing-service |
| ABDM M1/M2 | None | **P0** for the Indian market | new abdm-service |
| Medication CDS (drug-allergy, DDI, duplicate, dose) | Allergies are only displayed | **P0** once eRx is used clinically | order-service (CDS rules) |
| Scheduling (templates, capacity, transactional booking, unified queue, tokens) | Partial | P1 | appointment-service |
| ADT, bed board, cleaning loop | None | P1 | new adt-service |
| CPOE order lifecycle and order sets | `labOrders: string[]` | P1 | new order-service |
| Lab (specimens, accession, verification, critical values) | None | P1 | new lab-service |
| Pharmacy verification, dispensing, barcode eMAR | None | P1 | new pharmacy-service |
| Nursing flowsheets and NEWS2 escalation | Single vitals snapshot | P1 | clinical-service |
| ED triage and tracking board | Encounter type only | P1 | clinical-service |
| TPA pre-auth and claims (IRDAI SLA timers) | None | P1 | billing / insurance-service |
| Inventory and procurement | None | P1 | new inventory-service |
| Worklists and in-basket | None | P1 | shared task capability |
| Patient portal (OTP/ABHA login, results, bills) | Public site, no login | P1 | apps/website + gateway PATIENT isolation |
| Notifications (SMS/WhatsApp/email) | None | P1 | new notification-service |
| Real analytics from read models | Hardcoded dashboard | P1 | reporting-service |
| Downtime reports and read-only mode | None | P1 | reporting job |
| HL7 v2 / FHIR R4 interfaces, PACS, OT, HR rostering, NHCX, ambient AI | None | P2 | integration-, imaging-, ot-, hr-service |

---

## 3. Target architecture

**New services:** adt, order (with CDS), lab, imaging, pharmacy (with eMAR), inventory, billing (accounts, charges, invoices, pre-auth, claims), hr and ot, plus abdm, notification, integration and reporting. Each new service gets its own Postgres schema and role. They are reached through the gateway at `/api/v1/<service>`, and their events follow our naming style, for example `hospital.admission.admitted`, `hospital.order.created`, `hospital.lab.result_verified`, `hospital.billing.charge_created`.

**Design rules, each traced to a lesson from the open-source systems:**
1. Keep request, fulfilment and charge as three separate records (FHIR ServiceRequest vs Task/Dispense vs ChargeItem; OpenMRS's orderer status vs fulfiller status).
2. Make orders append-only. A revision or discontinuation creates a new linked row (OpenMRS). Copy OpenMRS's duplicate-order rules too, not just the link column.
3. Store explicit status fields with a transition table in each service. Statuses derived at read time lose information: OpenMRS FHIR2 reports every encounter as `UNKNOWN`.
4. Add a transactional outbox and durable consumers with idempotency keys and dead letters. Bahmni and OpenMRS both needed these.
5. Capture charges by push, with a pull safety net. Clinical events create charge items, a cashier view lists anything unbilled, and discharge is blocked until the bill is cleared (Marley).
6. Give each reference catalogue one owning service and publish changes as versioned events. Bahmni's lab sync breaks when test codes drift between systems.
7. Enforce invariants in the database. Use a Postgres exclusion constraint against overlapping bed assignments, a unique slot booking, and unique idempotency keys on stock and charge rows.
8. Never edit performed events. Correct a dispensed, administered, verified or invoiced row with an "entered in error" marker plus a replacement row, or with a credit note.
9. Avoid offline "last writer wins" for orders or medications. HospitalRun's field-level merge can silently overwrite newer clinical data.

The open-source report (section 4) has full table definitions, state machines for about 15 aggregates, endpoints and a FHIR R4 mapping.

---

## 4. Roadmap

| Phase | Scope | Exit criterion |
|---|---|---|
| **0. Make the foundation safe** (≈3–5 weeks) | Signed JWT plus refresh tokens and hashed passwords. Remove the in-browser token creation. A default-deny access matrix. Strip inbound `x-user-*` headers. JetStream with outbox and inbox. Sequence-based MRNs, identifiers and duplicate matching. Encounter sign/amend. A Consent entity | A penetration checklist passes (token forgery, IDOR, header spoofing), and events survive a service restart |
| **1. Revenue-ready OPD + ABDM identity** (≈2–3 months) | Scheduling templates and a unified queue with tokens. Check-in creates the encounter and account. billing-service v1 (tariff, packages, charge capture, bills, UPI/card/cash, GST). order-service and lab-service v1. Notifications. ABDM M1 and M2. Patient banner, worklists, role-based home screens and real analytics. Portal v1 | A full OPD day runs with no mock data: book → token → consult → orders → lab report → bill → ABHA-linked record |
| **2. Inpatient, medication safety, insurance** (≈3–4 months) | adt-service with the bed board and cleaning loop. Nursing flowsheets and NEWS2. Pharmacy with barcode eMAR. CDS on a licensed drug knowledge base. TPA pre-auth and claims with IRDAI SLA timers. Inventory v1. ED tracking board. Discharge summary. Downtime reports. ABDM M3 | One ward runs admission → eMAR → discharge → TPA final approval, and drug-allergy and drug-drug alerts fire on test cases |
| **3. Breadth, interoperability, certification, AI** (≈4–6 months) | HL7 v2 and FHIR R4 interfaces. Radiology with an open-source PACS. OT. NHCX and PM-JAY. HR rostering. A BI warehouse. NABH HIS/EMR application. Draft-only AI (ambient notes, discharge summaries, denial appeals). Telehealth | NABH application submitted; one analyzer and one PACS integrated |

---

## 5. Not verified
Several items rest on secondary sources only:
- KLAS market-share figures (search abstracts only)
- the general-availability date of Oracle's new acute-care EHR
- ABDM milestone boundaries and the current API version (sources disagree)
- the text of the IRDAI circular itself (press coverage only)
- Insta HMS and Birlamedisoft NABH/ABDM status
- which drug knowledge base each EHR uses

Many vendor pages returned HTTP 403, and the ABDM portals are JavaScript apps that returned no readable text. Both full reports log every failed source.
