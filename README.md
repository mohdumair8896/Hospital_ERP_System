# 🏥 ProHealth Enterprise Hospital Management Platform & Microservices Mesh

A production-grade, domain-driven microservices healthcare platform featuring:
- **Independent Domain Microservices**: Autonomous services with strict **database-per-service** boundaries (Patient, Appointment, Clinical, Auth, Audit, and API Gateway).
- **Comprehensive Database-Driven Audit Logging Engine**: High-throughput, HIPAA § 164.312(b) & NABH compliant audit system featuring **cryptographic SHA-256 hash chaining** for mathematical tamper-evidence.
- **ProHealth-Inspired Public Web Portal**: Built with Next.js 14, Tailwind CSS, Lucide Icons, featuring an interactive 5-step appointment scheduler, doctor directory, and 24/7 emergency dispatch.
- **Hospital ERP & Clinical Workbench**: Built with React + Vite + TypeScript, featuring a live database audit log explorer, 1-click cryptographic integrity verification, doctor clinical documentation, and outpatient reception queue.
- **Asynchronous Event-Driven Messaging**: Prepared for NATS JetStream pub/sub with resilient embedded event bus fallbacks for local zero-friction execution.

---

## 🏛️ System Architecture

```
                                  INTERNET
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
             hospital.com                     erp.hospital.com
                    │                                 │
                    ▼                                 ▼
             Next.js Website                      React ERP
           (Port 3001 / Public)             (Port 5173 / Operations)
                    │                                 │
                    └────────────────┬────────────────┘
                                     │
                                CDN / WAF
                                     │
                            ┌────────▼────────┐
                            │   API Gateway   │ (Port 4000)
                            └────────┬────────┘
                                     │
           ┌─────────────────────────┼─────────────────────────┐
           │                         │                         │
           ▼                         ▼                         ▼
     Auth Service             Patient Service         Appointment Service
      (Port 4004)               (Port 4001)               (Port 4002)
           │                         │                         │
        auth.db                  patient.db              appointment.db

           ┌──────────────────────────────────────────────────┐
           │                  EVENT BUS                       │
           │           NATS JetStream pub/sub                 │
           └──────────────────────────────────────────────────┘
                       │              │              │
                       ▼              ▼              ▼
                Clinical Service  Audit Service  Notification
                  (Port 4003)     (Port 4005)      (Async)
                       │              │              │
                  clinical.db      audit.db      SMS/Email
```

---

## 🔐 "Everything Logged & Accessed Through Database" Architecture

In healthcare, every interaction with Protected Health Information (ePHI) is subject to strict regulatory compliance (**HIPAA § 164.312(b)**, **GDPR Article 30**, **NABH**, **JCI**).

### 1. Asynchronous Ingestion with Zero Latency Impact
Clinical, appointment, and patient services do not block their transactional database operations waiting for audit disk I/O. Instead:
- Interceptors capture request metadata (Actor ID, Role, Client IP, Resource, Method, Latency, Clinical Reason).
- Events are emitted to the NATS JetStream subject `hospital.audit.logged`.
- A dedicated **Audit Service** ingests the events and writes them into an isolated, append-only `audit_db`.

### 2. Cryptographic Tamper-Evidence (SHA-256 Hash Chain)
Every audit row is mathematically linked to the preceding entry:
$$\text{Record Hash} = \text{SHA256}(\text{id} \parallel \text{seq} \parallel \text{timestamp} \parallel \text{actor} \parallel \text{action} \parallel \text{resource} \parallel \text{prev\_hash})$$

If an unauthorized administrator modifies or deletes a database row, the cryptographic chain breaks immediately.

### 3. Verification & Accounting of Disclosures
- **CLI Verification**: Run `npm run audit:verify` to recalculate hashes from the genesis record to the latest tip.
- **ERP 1-Click Verification**: In the ERP Audit Log Viewer, click **"Verify Cryptographic Chain"** for instant live validation.
- **HIPAA Accounting of Disclosures (§ 164.528)**: Query `GET /api/v1/audit/patient/:id/disclosures` to generate an audit report of every person who has viewed or edited a patient chart.

---

## 💻 Monorepo Workspace Structure

```
d:/Hospital Project/
├── apps/
│   ├── api-gateway/            # Express/Fastify API Gateway (Port 4000)
│   ├── audit-service/          # Persistent audit database & hash verification (Port 4005)
│   ├── auth-service/           # User authentication & role management (Port 4004)
│   ├── patient-service/        # Demographics & MRN assignment (Port 4001)
│   ├── appointment-service/    # Scheduling & doctor slot reservation (Port 4002)
│   ├── clinical-service/       # Encounters, vitals, diagnoses, notes (Port 4003)
│   ├── website/                # ProHealth Next.js 14 Public Portal (Port 3000)
│   └── erp/                    # React + Vite Hospital Operations Portal (Port 5173)
├── packages/
│   ├── contracts/              # Shared DTOs, TypeScript interfaces, event schemas
│   ├── events/                 # NATS JetStream client & resilient in-memory event bus
│   └── audit-client/           # Universal HTTP audit middleware & SHA-256 hasher
├── infrastructure/
│   └── docker/
│       ├── docker-compose.yml  # Multi-service production deployment orchestrator
│       ├── init-databases.sql  # PostgreSQL partitioned schema definition
│       └── Dockerfile.service  # Multi-stage Docker builder
└── scripts/
    ├── start-all.js            # Launches all backend microservices concurrently
    ├── test-e2e.js             # Automated end-to-end testing suite
    └── verify-audit-chain.js   # Standalone CLI cryptographic hash verifier
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v20+ (developed and verified on Node.js v24.15)
- **npm**: v10+

### 1. Install Dependencies & Build Packages
```bash
npm install
npm run build:packages
```

### 2. Start the Backend Microservices Mesh
```bash
npm run dev
# Launches API Gateway (4000), Patient (4001), Appointment (4002),
# Clinical (4003), Auth (4004), and Audit (4005).
```

### 3. Start the Frontends
In separate terminals:
```bash
# Public ProHealth-style Website (Next.js 14)
npm run dev:website
# Available at: http://localhost:3001

# Hospital ERP & Operations Portal (React + Vite)
npm run dev:erp
# Available at: http://localhost:5173
```

### 4. Run End-to-End Automated Verification
```bash
npm run test
```

### 5. Verify Database Cryptographic Integrity (CLI)
```bash
npm run audit:verify
```

---

## 🎨 ProHealth Design System (Public Website)

Inspired by the ProHealth clinical aesthetic:
- **Palette**: Deep Clinical Slate (`#0b1a30`), Vibrant Medical Cyan/Azure (`#0284c7`, `#06b6d4`), Pure Snow Cards (`#ffffff`), Emergency Crimson (`#ef4444`).
- **Typography**: `Plus Jakarta Sans` for clinical headers, `Inter` for accessible body text.
- **Key Modules**:
  - Top Emergency Bar with direct hotline (`123-456-7890`) and ambulance dispatch (`876-256-876`).
  - Hero section with overlapping feature cards.
  - Accreditations strip (Malcolm Baldrige Award, JCI Gold Seal, HIMSS Stage 7).
  - Clinical departments showcase.
  - Doctor directory with credential badges and live slot booking.
  - Interactive 5-step appointment scheduling modal.
  - Verified patient testimonials and health insights blog.
  - Floating 1-tap emergency dial button.

---

## 🛡️ License & Compliance Notice
This software is designed for enterprise healthcare environments adhering to **HIPAA**, **GDPR**, and **NABH** standards. All rights reserved.
