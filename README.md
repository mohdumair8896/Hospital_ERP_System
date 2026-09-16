# 🏥 ProHealth Enterprise Hospital Management Platform & Microservices Mesh

An enterprise-grade, domain-driven healthcare operating system and microservices mesh designed for modern hospital networks, multi-specialty medical centers, and outpatient healthcare systems.

The platform bridges public patient access, clinical point-of-care delivery, hospital administrative operations, and cryptographically verifiable HIPAA compliance into a unified, highly resilient digital ecosystem.

---

## 🌟 Executive Overview & Purpose

Modern healthcare facilities struggle with fragmented legacy software: Electronic Health Records (EHR) disconnected from reception desks, appointment scheduling silos that do not talk to clinical rosters, and audit trails vulnerable to unauthorized modification or regulatory non-compliance.

**ProHealth Enterprise** resolves these challenges by decoupling the hospital into autonomous, bounded-context domain services while providing:
1. **Frictionless Public Healthcare Access**: A modern, accessible patient-facing web portal for physician discovery, interactive symptom triage, and self-service appointment scheduling.
2. **Comprehensive Hospital Operations ERP**: A centralized clinical and administrative workstation powering reception intake, queue orchestration, doctor EHR/EMR consultations, and executive decision support.
3. **Mathematically Verifiable Audit Ledger**: A zero-latency, tamper-evident audit logging architecture backed by continuous SHA-256 cryptographic hash chaining to satisfy stringent regulatory mandates (**HIPAA**, **GDPR**, **NABH**, **JCI**).
4. **Database-Per-Service Microservices Mesh**: Independent service lifecycles and dedicated data stores ensuring strict data isolation, zero cross-domain blast radius, and high operational resilience.

---

## 🏛️ System Architecture

The platform is architected around a distributed microservices mesh coordinated through an intelligent API Gateway and an asynchronous event bus.

```
                                  INTERNET
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
             hospital.com                     erp.hospital.com
                    │                                 │
                    ▼                                 ▼
             Next.js 14 Portal                   React 18 ERP
            (Public Patient Web)             (Clinical & Operations)
                    │                                 │
                    └────────────────┬────────────────┘
                                     │
                                 CDN / WAF
                                     │
                            ┌────────▼────────┐
                            │   API Gateway   │
                            └────────┬────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
      Auth Service            Patient Service        Appointment Service
    (Port 4004 / auth.db)  (Port 4001 / patient.db) (Port 4002 / appt.db)
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     │
            ┌────────────────────────┴────────────────────────┐
            │                  EVENT BUS                      │
            │           NATS JetStream Pub/Sub                │
            │       (Resilient In-Memory Fallback)            │
            └────────────────────────┬────────────────────────┘
                                     │
            ┌────────────────────────┼────────────────────────┐
            │                        │                        │
            ▼                        ▼                        ▼
     Clinical Service          Audit Service         Notification Engine
  (Port 4003 / clinical.db)  (Port 4005 / audit.db)     (Async SMS/Email)
```

---

## 🧩 Core Subsystems & Application Portals

### 1. 🌐 Public Patient Portal (`apps/website`)
A patient-first healthcare experience engineered with Next.js 14, React, Tailwind CSS, and Lucide Icons.

* **5-Step Interactive Appointment Booking**: Guides patients through department selection, doctor availability matching, preferred time-slot reservation, personal demographic intake, and instant confirmation.
* **Interactive Symptom Triage**: Real-time triage assistant helping patients identify relevant medical specialties based on self-reported symptoms and urgency level.
* **Doctor & Specialist Directory**: Searchable physician roster with qualifications, clinical specialties, consultation schedules, and verified patient reviews.
* **Clinical Department Showcase**: Dedicated overviews for Cardiology, Neurology, Pediatrics, Orthopedics, Oncology, and Emergency Care.
* **24/7 Emergency Dispatch Bar & Action Button**: Instant telephone hotline access, ambulance dispatch coordinates, and rapid emergency department guidance.
* **Patient Trust & Accreditations**: Prominently highlights hospital credentials (JCI Gold Seal of Approval, Malcolm Baldrige National Quality Award, HIMSS Stage 7).

---

### 2. 🩺 Clinical & Hospital Operations ERP (`apps/erp`)
A mission-critical desktop workstation for administrative, clinical, and compliance staff built with React, Vite, and TypeScript.

* **OPD Reception & Triage Desk**:
  * Outpatient registration and instant Medical Record Number (MRN) generation (`MRN-YYYY-XXXXX`).
  * Live token queue management with status indicators (*Waiting*, *With Doctor*, *Discharged*, *No-Show*).
  * Demographic verification, insurance policy capture, emergency contact records, and baseline allergy intake.
* **Doctor Clinical Workbench (EHR / EMR)**:
  * Comprehensive patient chart view with historical encounter logs and medication records.
  * Real-time vitals entry: Blood Pressure (Systolic/Diastolic), Heart Rate, SpO2, Temperature, Respiratory Rate, and BMI.
  * Clinical notes structured around standard **SOAP** (Subjective, Objective, Assessment, Plan) methodology.
  * Diagnostic coding powered by standard **ICD-10** clinical nomenclature.
  * Electronic prescribing module (e-Rx) with drug formulation, dosage, frequency, duration, and food instructions.
* **Enterprise Audit Log Explorer**:
  * Real-time stream of all system access events and database transactions across the hospital mesh.
  * SHA-256 cryptographic chain visualizer showing hash linkages between consecutive records.
  * 1-Click Cryptographic Ledger Integrity Verifier detecting any unauthorized modification or row tampering.
  * HIPAA § 164.528 Accounting of Disclosures patient query generator.
* **Staff Provisioning Center**:
  * Role-Based Access Control (RBAC) management across 9 clinical and administrative tiers.
  * Clinical credentialing, medical license validation, and department assignment.
  * Account lifecycle operations (onboarding, suspension, role elevation, password policy enforcement).
* **Hospital Analytics & Executive Dashboard**:
  * Real-time Key Performance Indicators (KPIs): active patient count, bed occupancy rates, average outpatient wait times, department utilization rates, and daily revenue run-rates.
  * Clinical efficiency metrics comparing average consultation duration across medical specialties.
* **Service Mesh & Integration Pipeline Monitor**:
  * Live telemetry tracking health, latency, uptime, and circuit-breaker status of all microservices in the cluster.
  * Event bus traffic monitor displaying message ingestion rate and queue lag.

---

## 🔒 Enterprise Security & "Database-Logged" Audit Engine

Every read, write, update, and deletion of electronic Protected Health Information (ePHI) is treated as a compliance event under **HIPAA § 164.312(b)** and **GDPR Article 30**.

### 1. Asynchronous Ingestion with Zero Clinical Latency
Transactional microservices (Patient, Clinical, Appointment) never block operational workflows waiting on audit I/O:
* Domain interceptors capture structured event payloads (Actor ID, Role, Client IP, Target Resource, Operation, Timestamp, Payload Hash).
* Events are dispatched asynchronously via the high-throughput event mesh to `hospital.audit.logged`.
* The dedicated **Audit Service** batches and records entries into an isolated, append-only database store.

### 2. Cryptographic Tamper-Evidence (SHA-256 Hash Chaining)
Audit rows form an unbroken mathematical chain modeled after immutable distributed ledgers:

$$\text{Current Hash} = \text{SHA-256}\Big(\text{id} \parallel \text{sequence} \parallel \text{timestamp} \parallel \text{actorId} \parallel \text{action} \parallel \text{resource} \parallel \text{previousHash}\Big)$$

* **Genesis Anchor**: The first record in the audit database is linked to a deterministic root hash.
* **Immutable Linkage**: Every subsequent log entry cryptographically seals the hash of its direct predecessor.
* **Tamper Detection**: If any actor alters a past diagnosis, deletes an access log, or updates a timestamp directly in the database, every succeeding hash breaks immediately, revealing the exact index of compromise.

### 3. HIPAA § 164.528 Accounting of Disclosures
Patients have the legal right to request an accounting of all disclosures of their health information. The platform provides an on-demand reporting service that collates every clinician, nurse, administrator, or external system that has accessed or modified a given patient's records over any timeframe.

---

## 🛡️ Role-Based Access Control (RBAC) Matrix

The system enforces strict principle-of-least-privilege (PoLP) access controls across all endpoints and UI views:

| Role | Demographics & Intake | Vitals & Clinical Encounters | ICD-10 & Prescribing | System Audit Logs | User Provisioning | Analytics & KPIs |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Super Admin** | Read / Write | — | — | Full Access | Full Access | Full Access |
| **Chief Medical Officer** | Read Only | Read Only | Read Only | View All | Read Only | Full Access |
| **Doctor / Physician** | Read Only | Full Access | Full Access | Self History | — | Department KPIs |
| **Nurse** | Read Only | Record Vitals | Read Only | Self History | — | — |
| **Receptionist / OPD** | Full Access | — | — | Self History | — | Queue Metrics |
| **Pharmacist** | View MRN | — | View Prescriptions | Dispense Logs | — | Pharmacy Inventory |
| **Lab Technician** | View MRN | — | Order Fulfillment | Lab Logs | — | Lab Throughput |
| **Compliance Auditor** | — | — | — | Full Verifier | Read Only | Compliance Reports |
| **Patient** | Self Portal | View Own Records | View Own Rx | View Disclosures | — | — |

---

## ⚡ Distributed Microservices Mesh

The platform is decomposed into discrete, single-responsibility domains:

### `api-gateway`
* Single reverse-proxy entry point for public clients and internal operations.
* Centralized JWT authentication validation, CORS policy enforcement, rate limiting, and request correlation ID injection.

### `auth-service`
* Issues cryptographically signed JSON Web Tokens (JWT) with user claims, role hierarchies, and session identifiers.
* Enforces password complexity, credential hashing with bcrypt/argon2, and session revocation.

### `patient-service`
* Master Patient Index (MPI) and demographic management.
* Medical Record Number (MRN) algorithmic sequence generation.
* Emergency contacts, insurance coverage details, allergies, and patient consent documentation.

### `appointment-service`
* Physician slot availability, scheduling conflict prevention, and calendar management.
* State transitions: `REQUESTED` ➔ `CONFIRMED` ➔ `CHECKED_IN` ➔ `IN_CONSULTATION` ➔ `COMPLETED` / `CANCELLED`.

### `clinical-service`
* Point-of-care clinical management for attending physicians.
* SOAP encounter recording, longitudinal vitals tracking, ICD-10 diagnostic association, and electronic prescriptions.

### `audit-service`
* Append-only ledger storing all system interactions with cryptographic SHA-256 chaining.
* On-demand hash chain verification engine and HIPAA disclosure compliance reporting.

---

## 📦 Shared Monorepo Packages

* **`@hospital/contracts`**: Universal TypeScript interfaces, Data Transfer Objects (DTOs), ICD-10 codes, user role definitions, and domain event schemas shared between frontend apps and backend microservices.
* **`@hospital/events`**: Abstraction layer for event publishing and subscription supporting NATS JetStream with zero-configuration fallback to an in-memory event bus.
* **`@hospital/audit-client`**: Lightweight HTTP and Express/Fastify middleware that intercepts microservice requests, extracts compliance metadata, and fires asynchronous audit events.

---

## 🎨 Visual Identity & Design System

The system implements a purpose-built healthcare design language:

* **Primary Palette**: Deep Clinical Slate (`#0b1a30`), Medical Cyan/Azure (`#0284c7`, `#06b6d4`), Pure Snow Surface (`#ffffff`), Emergency Alert Crimson (`#ef4444`), Muted Neutral Slate (`#64748b`).
* **Typography**: `Plus Jakarta Sans` for clean, authoritative clinical headings and `Inter` for high-legibility tabular data and medical records.
* **Accessibility**: Designed in accordance with **WCAG 2.1 AA** guidelines, ensuring high color contrast ratios, clear focus indicators, screen-reader friendly semantic structures, and keyboard navigation support.

---

## 📜 Regulatory Standards & Governance

The platform architecture is designed to support the regulatory compliance frameworks required of modern healthcare providers:

* **HIPAA (Health Insurance Portability and Accountability Act)**: § 164.312(a) Access Control, § 164.312(b) Audit Controls, § 164.312(c) Data Integrity, and § 164.528 Accounting of Disclosures.
* **GDPR (General Data Protection Regulation)**: Article 25 Data Protection by Design, Article 30 Records of Processing Activities, and Article 32 Security of Processing.
* **NABH (National Accreditation Board for Hospitals & Healthcare Providers)**: Adheres to clinical documentation, patient safety, and information management guidelines.
* **JCI (Joint Commission International)**: Aligned with international standards for patient identification, medical records management, and clinical quality improvement.
