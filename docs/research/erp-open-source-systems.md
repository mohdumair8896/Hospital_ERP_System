# ProHealth ERP: Reverse-Engineering Open-Source HIS for Missing Domains

Status: complete (2026-10-24)

Local read-only clones and downloads used (data only, nothing executed): `scratchpad/oss/openmrs-core` (sparse),
`scratchpad/oss/openemr` (database.sql), `scratchpad/oss/openemr-src` (sparse), `scratchpad/oss/marley`, `scratchpad/oss/gnuhealth`
(sparse), `scratchpad/oss/bahmni-core-tree.json`; other repos read through api.github.com / raw.githubusercontent.com / codeberg API.
The only script run was `scratchpad/tools/doctype_summary.cjs` (my own; it JSON-parses Marley doctype files).

Legend: [code] = read in source code; [doc] = read in official docs; [inferred] = my inference, not directly verified.

## 1. Our current data model (ProHealth)

Sources read [code]: `packages/contracts/src/index.ts`, `packages/events/src/index.ts`, `packages/database/src/index.ts`,
`apps/*/src/index.ts`, `apps/*/src/database.ts`, `apps/api-gateway/src/security.ts`, `scripts/neon-init-schema.js`.

**Topology.** `api-gateway` (port 4000, helmet, zod `validateBody`, `http-proxy-middleware` with `pathFilter`) proxies
`/api/v1/auth` -> auth-service :4004, `/api/v1/patients` -> patient :4001, `/api/v1/appointments` -> appointment :4002,
`/api/v1/clinical` -> clinical :4003, `/api/v1/audit` -> audit :4005. Each service class (`PatientDatabase`,
`ClinicalDatabase`, ...) writes to Neon when `DATABASE_URL` is set (shared `packages/database` helpers) and also to a
local `node:sqlite` `DatabaseSync` copy ("Local sqlite insert warning" fallbacks). All services share ONE Neon schema.

**Tables (Neon, `scripts/neon-init-schema.js`).** IDs are `VARCHAR(64)` text keys with prefixes (`pat_1`, `doc_sarah`,
`dept_card`, `usr_admin`); columns are snake_case; human numbers are `MRN-2026-00412`, `APT-2026-8841`, `encounter_number`.
- `departments(id, code UNIQUE, name, description, location, emergency_support, icon)`
- `doctors(id, name, title, specialty, department_id FK->departments, consultation_fee, available_days JSONB, available_slots JSONB, ...)`
  -- schedule is two JSON arrays of weekday names and "09:00 AM" strings; there is no slot table.
- `appointments(id, appointment_number UNIQUE, patient_id, patient_name, patient_phone, patient_email, doctor_id, doctor_name,
  department_id, department_name, slot_date DATE, slot_time VARCHAR, type, status, symptoms, consultation_fee, created_at, updated_at)`
  -- denormalised copies of patient/doctor names; no FK to patients (cross-service).
- `patients(id, mrn UNIQUE, first_name, last_name, date_of_birth, gender, blood_group, phone_number, email, address JSONB,
  emergency_contact JSONB, allergies JSONB, active_medications JSONB, insurance_provider, insurance_policy_number, consent_given)`
  -- allergies/meds/insurance are flat strings on the patient row (no coded allergen, no reaction/severity, single policy).
- `clinical_encounters(id, encounter_number UNIQUE, appointment_id, patient_id, doctor_id, doctor_name, type OPD|IPD|EMERGENCY,
  chief_complaint, vitals JSONB, primary_diagnosis_code (ICD-10), primary_diagnosis_name, secondary_diagnoses JSONB,
  clinical_notes, prescriptions JSONB, lab_orders JSONB, status OPEN|FINALIZED|AMENDED, created_at, finalized_at)`
  -- vitals, prescriptions and lab orders are embedded JSON blobs: no order identity, no order status, no result linkage.
- `users(id, username UNIQUE, password_hash, email, name, role, department_id, doctor_id, patient_id)`
- `audit_records(id, sequence_number UNIQUE, timestamp, trace_id, actor_*, action, resource_type, resource_id, ..., clinical_reason,
  diff_json, prev_record_hash, record_hash)` -- SHA-256 hash chain with genesis row `audit_genesis`.

**Contracts.** `UserRole` = ADMIN, CHIEF_MEDICAL_OFFICER, DOCTOR, NURSE, RECEPTIONIST, PHARMACIST, LAB_TECHNICIAN,
COMPLIANCE_AUDITOR, PATIENT. `AppointmentStatus` = SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW.
`AppointmentType` = OPD_IN_PERSON, TELEHEALTH_VIRTUAL, EMERGENCY_TRAUMA, FOLLOW_UP. `AuditResourceType` already anticipates
`LAB_RESULT` and `BILLING_INVOICE`. `BaseDomainEvent<T>{eventId, eventType, version, occurredAt, sourceService, traceId, actorId?, data}`.

**Events (`packages/events/src/index.ts`).** `EventSubjects`: `hospital.appointment.created`, `hospital.appointment.cancelled`,
`hospital.patient.created`, `hospital.patient.updated`, `hospital.clinical.encounter_created`,
`hospital.clinical.encounter_finalized`, `hospital.audit.logged`. Bus = in-memory `EventEmitter` or core NATS
(`nc.publish`/`nc.subscribe`; plain core NATS in the code, not JetStream consumers, despite the contract comment). Only the
audit-service subscribes. Publishing happens after the DB write with no outbox, so a crash between the two loses the event.

**Permissions.** Gateway `authContextMiddleware` decodes `Authorization: Bearer tok_<base64 JSON UserSession>` and forwards
`x-user-id/x-user-role/x-patient-id/x-doctor-id/x-department-id` headers; `requireRoles(...)` and
`enforceRecordLevelSecurity` (PATIENT may only read own patient/encounters, IDOR checks) are coarse, path-based checks.
NOTE [code]: the token is unsigned base64 (no HMAC/JWT signature), and `authenticate` compares `password_hash = ?` against the
supplied plaintext. Any target design needs signed tokens and a privilege model before adding billing or pharmacy.

**Other observations [code].** Record ids are `<prefix>_<Date.now()>_<random5>` (`apt_`, `enc_`; `evt_apt_<ms>` for events);
business numbers are `APT-2026-<random 4 digits>` / `ENC-2026-<random 4 digits>` / `MRN-2026-<...>` with the year hard-coded
(`apps/appointment-service/src/database.ts:287-289`, `apps/clinical-service/src/database.ts:120-122`) -- about 9,000 values per
year, so collisions against the UNIQUE constraint are likely at hospital volume. `PATCH /api/v1/appointments/:id/status` accepts any
status (no transition check) and booking has no slot-conflict check.

**Gaps confirmed [code].** No tables or services for: ADT/admission/bed, order entities (CPOE), lab specimen/result, radiology,
pharmacy stock/dispense, eMAR, charges/invoices/payments/claims, inventory/procurement, HR/rostering, OT, CDS. Diagnosis is one
ICD-10 code plus a JSON array; there is no concept dictionary, coded observation or units.

## 2. Per-system architecture and data model

### 2.1 OpenMRS core (data model, module system, FHIR2)

Source: sparse shallow clone of `github.com/openmrs/openmrs-core` master @ fa21035 (2026-10-23) under
`scratchpad/oss/openmrs-core`; paths below are relative to `api/src/main/java/org/openmrs/`. FHIR2 module read via
raw.githubusercontent.com `openmrs/openmrs-module-fhir2` master. Master may contain unreleased (3.x) features; flagged where so.

**Entities [code]** (all extend `BaseOpenmrsData`: uuid, creator, dateCreated, changedBy, `voided/voidedBy/voidReason`
soft-delete; metadata extends `BaseOpenmrsMetadata` with `retired`). Integer PK + uuid on every row.
- `Person` (`Person.java`): names (PersonName set), addresses, `PersonAttribute`s (typed EAV via `PersonAttributeType`), gender,
  birthdate, `birthdateEstimated`, `dead`, `deathDate`, `causeOfDeath` (Concept). `Patient` extends Person (shared PK) adding
  `identifiers` (`PatientIdentifier`: identifier, `identifierType`, `location`, `patientProgram`) and `allergyStatus`.
  `PatientIdentifierType` has `format` (regex), `validator` (`patient/impl/LuhnIdentifierValidator.java`, `VerhoeffIdentifierValidator`),
  `locationBehavior`, `uniquenessBehavior` -- one patient has many typed identifiers (MRN, national ID, insurance number).
- `Visit` (`Visit.java`): patient, `visitType`, `indication` (Concept), `location`, `startDatetime`, `stopDatetime`, encounters.
  No status column: a visit is "active" while `stopDatetime` is null. `VisitAttribute`s (EAV) hold extras such as payment/admission flags.
- `Encounter` (`Encounter.java`): `encounterDatetime`, patient, location, form, `encounterType`, visit, and the clinical
  payload: `obs`, `orders`, `diagnoses`, `conditions`, `allergies`. Providers attach through `EncounterProvider(encounter, provider,
  encounterRole)`. `EncounterType` has `viewPrivilege` and `editPrivilege` (per-type access control). No encounter status.
- `Obs` (`Obs.java`): concept, `obsDatetime`, person, encounter, `order`, location, `obsGroup`/`groupMembers` (nested panels),
  typed values `valueCoded/valueNumeric/valueText/valueDatetime/valueDrug/valueComplex`, `accessionNumber`, `previousVersion`
  (edits create a new obs and void the old), `status` PRELIMINARY|FINAL|AMENDED, `interpretation` (NORMAL, ABNORMAL, CRITICALLY_LOW,
  HIGH, RESISTANT, ... mirrors HL7 v2 OBX-8), `referenceRange` (`ObsReferenceRange`).
- Concept dictionary: `Concept` (datatype, `conceptClass`, `set`, names per locale, answers, `conceptSets`, descriptions,
  `conceptMappings`); `ConceptNumeric` adds `hiAbsolute/hiCritical/hiNormal/low*`, `units`, `referenceRanges`;
  `ConceptMap -> ConceptReferenceTerm(conceptSource, code)` maps to SNOMED/LOINC/ICD-10/CIEL. Everything clinical (vitals,
  lab tests, diagnoses, frequencies, routes, dose units, dispense status) is a Concept.
- `Drug`: concept, `dosageForm`, `strength`, min/max daily dose, `ingredients`, `drugReferenceMaps` (RxNorm etc).
- `Order` (`Order.java`, table `orders`): patient, `orderType`, concept, `orderer` (Provider), encounter, `careSetting`
  (OUTPATIENT|INPATIENT), `dateActivated`, `scheduledDate`, `autoExpireDate`, `dateStopped`, `urgency` ROUTINE|STAT|ON_SCHEDULED_DATE,
  `orderNumber` (generator default `ORD-<seq>`, `OrderServiceImpl` line 93/661), `accessionNumber`, `orderReason`,
  `previousOrder`, `action` NEW|REVISE|DISCONTINUE|RENEW, `orderGroup`, `fulfillerStatus` RECEIVED|IN_PROGRESS|EXCEPTION|ON_HOLD|
  DECLINED|COMPLETED, `fulfillerComment`, `commentToFulfiller`.
  - `DrugOrder` (`drug_order`): drug, dose, doseUnits, `frequency` (OrderFrequency), route, `asNeeded`/`asNeededCondition`,
    quantity/quantityUnits, `numRefills`, duration/durationUnits, `dosingType` (Simple vs FreeText dosing instructions classes),
    `dispenseAsWritten`, `drugNonCoded`.
  - `ServiceOrder` (base for `TestOrder` table `test_order`, and `ReferralOrder`): `laterality`, `clinicalHistory`, frequency,
    `numberOfRepeats`, `location` (body site Concept). `OrderType` is hierarchical with `javaClassName` and allowed `conceptClasses`.
  - `OrderFrequency(concept, frequencyPerDay)`: frequency is a Concept plus a numeric per-day multiplier used for quantity maths.
  - `OrderSet` (template: members + operator ALL/ONE/ANY) and `OrderGroup` (an instance of an order set placed together).
- `MedicationDispense` (core since 2.6): patient, encounter, drug, location, `dispenser` (Provider), `drugOrder`, `status` and
  `statusReason` (Concepts, FHIR-valued), quantity, dose, route, frequency, `datePrepared`, `dateHandedOver`, `wasSubstituted`,
  `substitutionType/Reason`. Dispense is a separate record pointing at the order, not a state of the order.
- `Allergy`: patient, `allergen` (`Allergen` = coded or non-coded, `AllergenType` DRUG|FOOD|ENVIRONMENT|OTHER), `severity` (Concept),
  `reactions` (`AllergyReaction`: reaction Concept or non-coded), comments, encounter.
- `Condition`: `condition` (CodedOrFreeText), `clinicalStatus` (ConditionClinicalStatus), `verificationStatus`, `onsetDate`,
  `endDate`, `endReason`, `previousVersion`. `Diagnosis`: encounter, `diagnosis` (CodedOrFreeText), `condition` link, `certainty`
  (CONFIRMED/PROVISIONAL), `rank` (1 = primary). Encounter diagnoses are separate from the longitudinal problem list.
- `Provider`: person, `identifier`, `role`, `speciality`, `providerRole`. A User (login) and a Provider (clinician) are different things.
- `Location`: hierarchical (`parentLocation`, `childLocations`), `tags` (LocationTag e.g. "Login Location", "Admission Location",
  "Visit Location"), address fields, `type`. Beds are NOT core; they come from the bedmanagement module (see Bahmni).
- `Program`/`ProgramWorkflow`/`ProgramWorkflowState(concept, initial, terminal)`; `PatientProgram(patient, program, location,
  dateEnrolled, dateCompleted, outcome)` and `PatientState(patientProgram, state, startDate, endDate, encounter)` -- a generic,
  configurable state machine for care programmes (TB, HIV, ANC).

**Order lifecycle [code] (`api/impl/OrderServiceImpl.java`).** Orders are immutable once saved (`failOnExistingOrder` ->
"Order.cannot.edit.existing"). A change is a NEW row: `REVISE` requires `previousOrder` and stops it at "a moment before" the new
`dateActivated`; `DISCONTINUE` creates a discontinuation order that stops the active one (`stopOrder` sets `dateStopped`;
`CannotStopInactiveOrderException`). Revised orders must keep the same orderable, order type, care setting and class
(`EditedOrderDoesNotMatchPreviousException`). A duplicate check rejects a second active drug order for the same orderable with an
overlapping schedule (`AmbiguousOrderException("Order.cannot.have.more.than.one")`) unless listed as `PARALLEL_ORDERS`.
`Order.isActive(date)` = not voided, not a DISCONTINUE, activated, not stopped, not expired. The fulfiller (lab, pharmacy) only
writes `fulfillerStatus`/`fulfillerComment`/`accessionNumber` via `updateOrderFulfillerStatus` (lines 548-566), so the orderer's
intent and the performer's progress are two separate axes.

**Events and integration [code].** `event/` now has an `outbox_event` table (`event/outbox/OutboxEvent.java`: event_type, payload,
status PENDING|PROCESSING|COMPLETED|FAILED, error_count, completed_listeners) with polling/cleanup tasks
(`event/outbox/tasks/OutboxPollingTaskHandler.java`) and `CDCEvent` (operation, tableName, primaryKey, snapshot) plus
`event/broker/*` -- javadoc says `@since 2.9.0`. Historically events were the separate `openmrs-module-event` (ActiveMQ/JMS) and
Bahmni used atomfeed. `hl7/` is the legacy HL7 v2 inbound queue (`HL7InQueue`, `HL7InError`, `HL7InArchive`,
`HL7InQueueProcessor`): ORU^R01 messages parsed into encounters/obs.

**Module system [code] (`module/`).** A module is an .omod jar with `config.xml` parsed by `ModuleFileParser`; `Module.java`
fields: `moduleId`, `requireOpenmrsVersion`, `requiredModulesMap`, `awareOfModulesMap`, `startBeforeModulesMap`, `advicePoints`
(Spring AOP advice around core services), `extensions` (UI extension points), `privileges` and `globalProperties` it contributes,
Hibernate `mappingFiles`, liquibase/sqldiff (`SqlDiffFileParser`). Each module gets its own `ModuleClassLoader`; `ModuleActivator`
lifecycle (willStart/started/willStop). Modules communicate in-process by calling each other's Spring services and by AOP
advice on core services -- there is no network boundary.

**Permissions [code].** `Role(role, privileges, inheritedRoles, childRoles)`; `Privilege(privilege)` strings such as "Get Patients",
"Add Orders", "Edit Orders", "Add Visits" (`util/PrivilegeConstants.java`). Service methods are annotated (`@Authorized` legacy;
master uses Spring `@PreAuthorize("hasPermission(#order, 'Edit Orders')")`, `@PostFilter`, see `api/OrderService.java` line 133).
`security/DomainObjectAuthorizationRule.java` javadoc: core "has no built-in notion of per-instance access restriction (no
care-setting or organizational unit ACL model)"; modules register rules, combined most-restrictive-wins. Privilege is checked at the
service layer, not at the URL layer.

**FHIR2 module [code].** `api/translators/*` has one translator per resource: Patient, Practitioner, Encounter (Visit and Encounter
both become FHIR Encounter; `EncounterTranslatorImpl` sets `partOf` = the Visit and `status = UNKNOWN` because OpenMRS has no
encounter status), Observation (+ReferenceRange, Interpretation), DiagnosticReport, ServiceRequest (from TestOrder), MedicationRequest,
MedicationDispense, Medication, Condition, Diagnosis, AllergyIntolerance, Location, EpisodeOfCare (from PatientProgram), Group
(Cohort), Immunization, Task, ValueSet. Status is DERIVED, not stored: `MedicationRequestStatusTranslatorImpl` returns COMPLETED if
`fulfillerStatus == COMPLETED`, ACTIVE if `isActive()`, CANCELLED if discontinued or voided, STOPPED if expired;
`ServiceRequestTranslatorImpl.determineServiceRequestStatus` returns REVOKED for DISCONTINUE, COMPLETED after dateStopped/autoExpire,
otherwise ACTIVE; performer comes from a FHIR `Task` whose `basedOn` is the ServiceRequest (Task is how a LIS reports fulfilment).

**Charge capture.** None in core [code: no billing entities]. Billing is delegated (Bahmni -> Odoo; openmrs-module-billing/cashier
are separate modules [doc, not read in code]).

**UX ideas [doc/inferred].** Concept-driven forms (any new vital or lab is dictionary config, not schema change); visit as the
container that groups encounters for a stay; "Visit Location" tag; order basket (draft orders signed together as one encounter).

### 2.2 Bahmni

Sources [code] (read via GitHub API/raw, master branches, 2026-10-24): `Bahmni/bahmni-core`, `Bahmni/openmrs-module-bedmanagement`,
`Bahmni/openmrs-module-appointments`, `Bahmni/bahmni-odoo-modules`, `Bahmni/pacs-integration`, `ICT4H/atomfeed`.
Docs: bahmni.atlassian.net "ATOM Feed Integration in Bahmni" (wiki/spaces/BAH/pages/37945615).

**Composition.** Bahmni = OpenMRS (EMR, ADT, orders, obs, bed mgmt, appointments) + OpenELIS (LIS) + Odoo (billing,
pharmacy stock, purchase, accounting) + dcm4chee (PACS, via `pacs-integration`) + its own AngularJS apps (registration, clinical,
ADT/IPD, orders, appointments). Each product keeps its own database; nothing shares tables. Glue = Atom feeds + REST pull.

**Integration pattern: atomfeed (transactional outbox + pull) [code].** `ICT4H/atomfeed` server tables
(`atomfeed-server/src/main/resources/sql/db_migrations.xml`): `event_records(id, uuid, title, timestamp, uri, object, category,
date_created, tags)`, `event_records_queue` (same columns, written inside the business transaction), `event_records_offset_marker`,
`chunking_history` (feed pagination). Client tables (`atomfeed-client/.../db_migrations.xml`): `markers(feed_uri,
last_read_entry_id, feed_uri_for_last_read_entry)` -- per-consumer cursor; `failed_events(feed_uri, failed_at, error_message,
event_id, event_content, error_hash_code, title, retries, tags)` and `failed_event_retry_log` -- dead-letter with retries.
The event is THIN: e.g. bed module `atom-feed/.../BedAssignmentAdvice.java` publishes `new Event(uuid, "Bed-Assignment", null,
uri, uri, "encounter")` through `AtomFeedSpringTransactionManager` (same DB transaction as the change); consumers GET the `uri`
to fetch current state. ELIS client `OpenElisAccessionEventWorker.process()` builds `openElisUri + event.getContent()` and
`httpClient.get(...)` the accession. Consumers run as scheduled jobs (`OpenElisPatientFeedTask`, `...FailedEventsTask`).

**Lab (OpenELIS) [code].** OpenELIS consumes the OpenMRS patient + encounter feeds (lab orders); OpenMRS consumes the OpenELIS
accession feed. `OpenElisAccession{accessionUuid, labLocationUuid, patientUuid, patientIdentifier, dateTime, accessionNotes,
testDetails}` and `OpenElisTestDetail{testName, testUnitOfMeasurement, testUuid, panelUuid, minNormal, maxNormal, result,
resultUuid, resultType, notes, providerUuid, dateTime, status, abnormal, uploadedFileName}`. `accessionUuid` IS the OpenMRS
order-encounter uuid; `AccessionDiff` adds/discontinues orders when the lab adds/removes tests; results become Obs in a "LAB_RESULT"
encounter of the same visit; in `associateTestResultsToOrder` each matched order (by test or panel concept uuid) gets
`accessionNumber = accessionUuid` and, if unset, `fulfillerStatus = IN_PROGRESS`; tests with status "Canceled" are skipped;
`isReferredOut()` tests get the accession datetime. Test catalogue sync: `testUuid` must equal an OpenMRS Concept uuid ("Concept for lab test ... not
found in openmrs" -> RuntimeException -> failed_events). Reference data (tests, panels, drugs) flows OpenMRS -> ELIS/Odoo.

**Radiology/PACS [code].** `pacs-integration` polls the OpenMRS encounter feed (`atomfeed/jobs/EncounterFeedJob.java`), maps
radiology orders to HL7 v2.5 `ORM^O01` (`services/impl/HL7MessageCreatorImpl.java`; `Constants`: ORC-1 `NW` new / `CA` cancel,
ORC-5 `SC`/`CA`, PID identifier type `MR`) with a custom `ZDS` segment carrying the Study Instance UID (`StudyInstanceUIDGenerator`)
and sends to dcm4chee's modality worklist. It runs an HL7 listener (`psunotification/PSUNotificationHL7Server.java`) for
`OMG^O19` performed-step updates and marks a FHIR `ImagingStudy` available (`ImagingStudyService.updateImagingStudyAsAvailable`).

**Billing and stock (Odoo) [code].** `bahmni_api_feed/models/api_event_worker.py` handles categories `create.customer`,
`create.sale.order`, `create.drug`, `create.radiology.test`, `create.lab.test`, `create.lab.panel`, `create.service.saleable`.
`order_save_service.py` is the charge-capture engine: for each encounter's orders it resolves `order.type` + location to a
`sale.shop`/warehouse through `order.type.shop.map` (fallback: first shop), finds the patient's existing DRAFT `sale.order` for that
shop (accumulating quotation) or creates one (`care_setting` ipd/opd, pricelist from shop), then per order: skip if
`external_order_id` already processed; `voided` or `action == DISCONTINUE` -> unlink the line (only if the sale order is still
draft); `REVISE` (not dispensed) -> delete and recreate line; else create line. Lines carry `external_order_id` (OpenMRS order
uuid), `dispensed`, `lot_id` (batch), `expiry_date` (`bahmni_sale/models/sale_order_line.py`). Quantity UoM is mapped via
`syncable.units.mapping`. `bahmni_sale/models/sale_order.py`: `action_confirm` -> optional `validate_delivery` (stock picking from
the shop location, batch picked by `_find_batch`) -> `_create_invoices` -> `invoice.action_post()`; header fields `discount_type`,
`discount_percentage`, `chargeable_amount`, `round_off_amount`, `prev_outstanding_balance`, `provider_name`, `shop_id`.
So: clinical order = billable intent (draft quotation line); cashier confirmation = invoice; pharmacy dispensing = stock move.

**ADT / IPD [code].** Doctors record a Disposition obs in consultation (`V1_62__AddDispositionConcepts.sql`: ADMIT "Admit Patient",
DISCHARGE "Discharge Patient", TRANSFER "Transfer Patient"; `bahmni-emr-api/.../disposition/*`). The ADT app then saves an
`ADMISSION` / `DISCHARGE` encounter (`V1_68__EncounterTypeForAdmission.sql`, `V1_70__...Discharge.sql`).
`BahmniVisitAttributeService` keeps visit attributes "Visit Status" (OPD/IPD visit type) and "Admission Status" =
"Admitted"/"Discharged" derived from those encounter types. Discharge REST (`BahmniDischargeController`, `/bahmnicore/discharge`)
calls `bedManagementService.unAssignPatientFromBed`. Queue "to admit" = patients with ADMIT disposition and no admission [doc/inferred].

**Bed management [code]** (`openmrs-module-bedmanagement/api/.../entity`): `Bed(id, bedNumber, bedType, status, bedTagMap)`,
`BedType(name, displayName, description)`, `BedLocationMapping(location, bed, row, column)` (ward grid layout),
`BedPatientAssignment(bed, patient, startDatetime, endDatetime, encounter)`, `BedTag`/`BedTagMap` (e.g. isolation, blocked).
`BedStatus` = AVAILABLE | OCCUPIED only (no cleaning/maintenance state; tags fill that gap). `assignPatientToBed` first unassigns the
patient from any current bed (transfer = end old assignment + start new), saves assignment with `startDatetime =
encounter.getEncounterDatetime()`, sets bed OCCUPIED. `unassignBed` ends the patient's assignment and leaves the bed OCCUPIED if
other current assignments exist (bed sharing allowed). `BedPatientAssignmentValidator` rejects end < start, end after visit stop,
and a patient with two concurrent assignments. `deleteBed` throws `BedOccupiedException`. `AdmissionLocation` = ward Location with
a row x column `BedLayout`.

**Scheduling [code]** (`openmrs-module-appointments/api/.../model`): `AppointmentServiceDefinition(name, speciality, startTime,
endTime, maxAppointmentsLimit, durationMins, location, color, initialAppointmentStatus, weeklyAvailability, serviceTypes)`,
`ServiceWeeklyAvailability(dayOfWeek, startTime, endTime, maxAppointmentsLimit)`, `Appointment(appointmentNumber, patient, service,
serviceType, provider(s), location, startDateTime, endDateTime, appointmentKind Scheduled|WalkIn|Virtual, status, priority,
recurringPattern, appointmentAudits, relatedAppointment, teleHealthVideoLink, fulfillingEncounters, reasons)`,
`AppointmentUnavailability`. Status enum with sequence: Requested(0), WaitList(0), Scheduled(1), Arrived(2), CheckedIn(3),
Completed(4), Cancelled(4), Missed(4). `DefaultAppointmentStatusChangeValidator`: a transition must move to a strictly higher
sequence, except back to Scheduled (undo); disableable via global property. Conflicts: `PatientDoubleBookingConflict`,
`AppointmentServiceUnavailabilityConflict`. Capacity is per service/day (no slot rows), slots computed from duration.

**Permissions [code].** OpenMRS roles/privileges plus app-level privileges in `bahmnicore-omod/src/main/resources/liquibase.xml`:
`app:registration`, `app:clinical`, `app:clinical:retrospective`, `app:clinical:onbehalf`, `app:adt`, `app:orders`,
`app:appointments`, `app:emergency`, `app:documents`, `app:reports`, `app:admin`. Odoo has its own users/groups (no SSO by default) [inferred].

**UX ideas [doc/inferred].** Disposition-driven ADT queues (doctor decides, ADT clerk executes); ward bed-grid by row/column;
"Visit Status" chip OPD/IPD; quotation accumulating all charges of a visit, settled at discharge or per-visit by cashier.

### 2.3 OpenEMR

Sources [code]: `openemr/openemr` master @ 0666c1e (2026-10-23): `sql/database.sql` (285 CREATE TABLEs, downloaded to
`scratchpad/oss/openemr/database.sql`) and a sparse clone (`scratchpad/oss/openemr-src`) of `src/Billing`, `src/Common/Acl`,
`library/FeeSheet.class.php`, `interface/forms/fee_sheet`, `src/Events`, `src/Core/ModulesApplication.php`, `apis/routes`;
`interface/orders/gen_hl7_order.inc.php` and `receive_hl7_results.inc.php` via raw.githubusercontent.com.

**Architecture.** Monolithic PHP app on MySQL; `pid` (patient id) and `encounter` (integer) are the universal join keys -- most
clinical and billing tables carry `(pid, encounter)` rather than FKs. Lists/enums are rows in `list_options(list_id, option_id,
title, seq, notes, toggle_setting_1/2)` so statuses are configurable data.

**Entities [code]** (columns from `database.sql`):
- `patient_data` (demographics, `pricelevel`), `insurance_data(type primary/secondary/tertiary, provider -> insurance_companies,
  plan_name, policy_number, group_number, subscriber_* , copay, date, date_end, accept_assignment, policy_type)` -- up to 3 ranked
  payers per patient, effective-dated.
- `form_encounter(id, uuid, date, date_end, reason, facility_id, pid, encounter, onset_date, sensitivity, billing_note, pc_catid
  (visit category), last_level_billed, last_level_closed, last_stmt_date, stmt_count, provider_id, supervisor_id, referring_provider_id,
  ordering_provider_id, billing_facility, pos_code, parent_encounter_id, class_code, encounter_type_code, discharge_disposition,
  in_collection, invoice_refno)` -- encounter header doubles as the A/R invoice (billing levels live on it).
- `forms(id, date, encounter, form_name, form_id, pid, user, authorized, deleted, formdir, issue_id, provider_id)` -- registry linking
  each encounter to N form instances; each form type has its own table (`form_vitals`, `form_soap`, `form_ros`, `form_clinical_notes`,
  `form_observation`, `form_care_plan`, eye forms...) or generic Layout-Based Forms stored as EAV in `lbf_data(form_id, field_id,
  field_value)`. Forms are pluggable directories (`formdir`).
- `lists(id, type, title, begdate, enddate, diagnosis, activity, pid, outcome, reaction, verification, severity_al, ...)` -- one table for
  medical problems, allergies, medications, surgeries ("issues"); `issue_encounter` links issues to encounters.
- Scheduling: `openemr_postcalendar_events(pc_eid, pc_catid, pc_aid (provider), pc_pid, pc_eventDate, pc_endDate, pc_startTime,
  pc_endTime, pc_duration, pc_recurrtype/spec/freq, pc_apptstatus, pc_facility, pc_billing_location, pc_room, pc_sendalertsms/email)`;
  `openemr_postcalendar_categories` define visit types/durations. Patient flow board: `patient_tracker(apptdate, appttime, eid, pid,
  encounter, lastseq)` + `patient_tracker_element(pt_tracker_id, start_datetime, room, status, seq, user)` (status history).
- Lab/procedures: `procedure_type` (hierarchical compendium: name, lab_id, procedure_code, standard_code (LOINC), specimen, units,
  range), `procedure_providers` (labs, protocol), `procedure_order(procedure_order_id, provider_id, patient_id, encounter_id,
  date_ordered, date_collected, order_priority, order_status, lab_id, specimen_type, clinical_hx, order_diagnosis, billing_type,
  control_id, date_transmitted, order_intent, location_id)`, `procedure_order_code(procedure_order_id, procedure_order_seq,
  procedure_code, diagnoses, do_not_send, reason_code)` (order lines), `procedure_specimen(specimen_identifier, accession_identifier,
  specimen_type_code, collection_method, collected_date, volume_value, specimen_condition)`, `procedure_report(procedure_order_id,
  procedure_order_seq, date_collected, date_report, specimen_num, report_status, review_status)`, `procedure_result(procedure_report_id,
  result_code, result_text, units, result, range, abnormal, result_status, document_id)`.
- Pharmacy: `drugs(drug_id, name, ndc_number, reorder_point, max_level, form, size, unit, route, dispensable, consumable,
  allow_multiple, related_code (billing code))`, `drug_inventory(inventory_id, drug_id, lot_number, expiration, manufacturer, on_hand,
  warehouse_id, vendor_id, destroy_date/method/witness)` (lot-level stock per warehouse), `drug_sales(sale_id, drug_id, inventory_id,
  prescription_id, pid, encounter, sale_date, quantity, fee, billed, trans_type, xfer_inventory_id, pharmacy_supply_type)` -- comment:
  `trans_type 1=sale, 2=purchase, 3=return, 4=transfer, 5=adjustment`; `billed` "indicates if the sale is posted to accounting".
  One ledger table for all stock movements, each optionally tied to an encounter and prescription. `prescriptions(patient_id,
  provider_id, encounter, drug_id, rxnorm_drugcode, dosage, quantity, route, interval, refills, per_refill, filled_date, active,
  erx_source, erx_uploaded, prn, request_intent, diagnosis)`; `erx_rx_log`, `erx_narcotics`.
- Billing/A-R: `billing(id, date, code_type, code, pid, provider_id, encounter, code_text, billed, activity, payer_id, bill_process,
  bill_date, modifier, units, fee, justify, x12_partner_id, ndc_info, pricelevel, revenue_code, chargecat)` -- one charge line per
  CPT/HCPCS/ICD code per encounter; `activity = 0` is the soft delete (`BillingUtilities::deleteBilling`); `justify` links a CPT line to
  ICD pointers. `fee_schedule`, `prices` (per pricelevel), `codes` (code master with fee). `claims(patient_id, encounter_id, version,
  payer_id, status, payer_type, bill_process, bill_time, process_file, target, x12_partner_id, submitted_claim)` -- versioned: a new
  row per (re)submission. `ar_session(session_id, payer_id, user_id, closed, reference, check_date, deposit_date, pay_total,
  payment_type, adjustment_code, patient_id, payment_method)` = a remittance/check batch; `ar_activity(pid, encounter, sequence_no,
  code_type, code, modifier, payer_type, post_time, post_user, session_id, memo, pay_amount, adj_amount, account_code, reason_code,
  deleted, payer_claim_number)` = line-level payment/adjustment postings. `payments` is the older copay table.

**State machines [code].**
- Appointment `pc_apptstatus` is a configurable list (`list_options` 'apptstat', `database.sql` lines ~4463-4481): `-` None,
  `*` Reminder done, `+` Chart pulled, `x` Canceled, `?` No show, `@` Arrived, `~` Arrived late, `!` Left w/o visit, `#` Ins/fin issue,
  `<` In exam room, `>` Checked out, `$` Coding done, `%` Canceled < 24h, `^` Pending, plus AVM/SMS/EMAIL Confirmed, CALL Callback.
  `notes` holds `color|minutes` (flow-board colour and alert-after-N-minutes [minutes meaning inferred]); `toggle_setting_1` marks
  check-in statuses and `toggle_setting_2` check-out statuses (`src/Services/AppointmentService.php` `isCheckInStatus`/`isCheckOutStatus`);
  `AppointmentService::createEncounterForAppointment($eid)` opens the encounter at check-in [trigger condition inferred].
  No enforced transitions were found -- any status to any status.
- Lab order `ord_status`: pending -> routed -> complete | canceled. Report `proc_rep_status`: final, review, prelim, cancel, error,
  correct. Result `proc_res_status`: final, prelim, cancel, error, correct, incomplete (mirror HL7 v2 OBR-25/OBX-11).
- Claim (`src/Billing/BillingUtilities.php` `updateClaim`, comment block lines ~1492-1520 and `SLEOB::arSetupSecondary`): status 1 =
  open/queued, 2 = billed (after X12 837P generation or "mark as billed"), 6 = crossover-forwarded to secondary, 7 = denied; `bill_process`
  tracks queue/generation; EOB posting closes a payer level and `arSetupSecondary` reopens the encounter for the next payer
  (`form_encounter.last_level_billed/last_level_closed`). [Status values 3-5 not verified.]

**Charge capture [code].** The Fee Sheet (`interface/forms/fee_sheet/*`, `library/FeeSheet.class.php`) is an encounter form where the
clinician/coder picks codes: `addServiceLineItem()` writes `billing` rows priced by the patient's `pricelevel` from `prices`;
`addProductLineItem()` writes `drug_sales` rows (dispense + charge in one step, decrementing `drug_inventory`). `visitChecksum()`
hashes all billing/drug_sales lines of the visit to detect concurrent edits (optimistic locking). Lab orders carry `billing_type`
and `procedure_order_code` lines can be billed. The Fee Sheet can also set the appointment status
(`FeeSheetAppointmentStatusSetter.php`). Claims: `src/Billing/BillingProcessor/Tasks/GeneratorX12.php`, `GeneratorHCFA*`,
`GeneratorUB04*`, `X125010837P.php`/`837I`; remittance: `ParseERA.php` (X12 835), `EraCheckPosting.php`; eligibility `EDI270.php`.

**Integration [code].** HL7 v2 lab: `gen_hl7_order.inc.php` builds MSH/PID/ORC/OBR order messages and transmits via SFTP/file
(`phpseclib3\Net\SFTP`); `receive_hl7_results.inc.php` parses ORU (OBR/OBX, embedded docs, performing-lab OBX-23..25, MDM).
FHIR R4 US Core server (`apis/routes/_rest_routes_fhir_r4_us_core_3_1_0.inc.php`): Patient, Encounter, Appointment, Coverage,
Observation, DiagnosticReport, ServiceRequest, Specimen, MedicationRequest, MedicationDispense, Procedure, Location, Practitioner,
PractitionerRole, Task, Provenance, Questionnaire(Response), etc.; each route calls `RestConfig::request_authorization_check($request,
"patients", "med")` or `("encounters", "auth_a")` -- the same ACL as the UI. eRx via modules (`oe-module-weno`).

**Modules [code].** `src/Core/ModulesApplication.php` boots Laminas ("zend") modules and custom modules; each custom module's
`openemr.bootstrap.php` receives the Symfony `EventDispatcher` and `addListener(...)` to events such as `MenuEvent::MENU_UPDATE`,
`PatientCreatedEvent`, `ServiceSaveEvent::EVENT_PRE_SAVE/POST_SAVE` ('service.save.pre/post'), `QuestLabTransmitEvent`
('lab.transmit'). In-process hooks only; no message bus.

**Permissions (phpGACL) [code].** Tables `gacl_aro*` (requesters = users/groups), `gacl_aco*` (controlled objects), `gacl_axo*`,
`gacl_acl`. `AclMain::aclCheckCore($section, $value, $user, $return_value)`; superuser `admin/super` short-circuits every check.
ACO catalogue (header of `src/Common/Acl/AclMain.php`): `admin` (super, users, drugs "Pharmacy Dispensary", acl, ...), `acct` (bill,
disc "allowed to discount prices", eob, rep, rep_a), `patients` (appt, demo, med, trans, docs, docs_rm, notes, sign "Sign Lab Results",
rx, lab, disclosure, amendment, alert...), `encounters` (auth/auth_a "my vs any encounters", coding/coding_a, notes/notes_a, date_a,
relaxed), `sensitivities` (normal, high -> `form_encounter.sensitivity`), `lists`, `patientportal`. Return values form a lattice:
`view` < `addonly` < `wsome` < `write`. "my vs any" (`_a`) gives ownership-scoped rights; `aclCheckForm($formdir)` and
`aclCheckIssue($type)` give per-form and per-issue-type rights.

**Patient portal [code].** `onsite_portal_activity(patient_id, activity, require_audit, pending_action, action_taken, status,
table_action, table_args, action_user, checksum)`, `onsite_documents`, `onsite_messages`, `onsite_signatures` -- patient-submitted
changes are queued for staff review before they touch the chart (a review-inbox pattern).

**UX ideas.** Flow board with per-status colour and overdue timers; fee sheet with diagnosis "justify" pointers; price levels per
patient; superbill/code favourites (`fee_sheet_options`); "my encounters vs any encounters" scoping.

### 2.4 ERPNext Healthcare / Marley Health

Source [code]: shallow clone `github.com/earthians/marley` @ ff03fb1 (2026-10-23) at `scratchpad/oss/marley`; 141 doctypes under
`healthcare/healthcare/doctype/<name>/<name>.json` (summarised with a Node script that only JSON-parses the files). Paths below are
relative to `healthcare/healthcare/`.

**Architecture.** A Frappe app on top of ERPNext; every entity is a DocType (table `tab<DocType>`), human IDs from naming series
(`HLC-PAT-.YYYY.-`, `HLC-APP-`, `HLC-ENC-`, `HLC-INP-`, `HSR-`, `HMR-`). Links are typed FKs (`Link`), polymorphic refs are
`Dynamic Link` pairs (`reference_doctype` + `reference_docname`) -- used everywhere for order->fulfilment->invoice traceability.
Clinical docs are "submittable": Draft (docstatus 0) -> Submitted (1, immutable) -> Cancelled (2); corrections create an amendment
(`amended_from`). Billing, stock and accounting are plain ERPNext (Customer, Item, Price List, Sales Invoice, Stock Entry, Warehouse,
Payment Entry, Journal Entry, Company). Integration with ERPNext is in-process via `hooks.py` `doc_events`.

**Entities [code]** (key fields; `->` = Link):
- `Patient`: first/middle/last_name, sex->Gender, dob, blood_group, status Active|Disabled, `customer`->Customer (billing party),
  `default_price_list`, `inpatient_status{Admission Scheduled|Admitted|Discharge Scheduled}`, `inpatient_record`, allergies/medication
  /history as Small Text, `invite_user` (portal user). Separate `Patient Allergy`, `Patient Relation`, `Patient Insurance Policy`.
- `Patient Appointment`: patient, practitioner, department, `service_unit`, `appointment_type`, `appointment_for{Practitioner|Department|
  Service Unit}`, appointment_date/time/datetime, duration, `status{Scheduled|Open|Confirmed|Checked In|Checked Out|Closed|Cancelled|
  No Show}`, `invoiced`, `ref_sales_invoice`, `billing_item`, `paid_amount`, `mode_of_payment`, insurance_payor/policy/coverage,
  `position_in_queue`, `appointment_based_on_check_in`, `service_request`, `therapy_plan`, `procedure_template`, telehealth link.
- `Patient Encounter` (submittable): appointment, patient, practitioner, encounter_date/time, `symptoms`, `diagnosis` (child table
  Patient Encounter Diagnosis), `codification_table` (coded terms), child tables `drug_prescription`, `lab_test_prescription`,
  `procedure_prescription`, `therapies`; `status{Open|Ordered|Completed|Cancelled}`, `submit_orders_on_save`, `inpatient_record`.
- `Vital Signs` (submittable): patient, appointment, encounter, signs_date/time, temperature, pulse, respiratory_rate, bp_systolic,
  bp_diastolic, height, weight, bmi, `inpatient_record`.
- Orders (FHIR-shaped, newer): `Service Request` (`HSR-`): order_group (dynamic -> source doc, usually the encounter),
  `template_dt/template_dn` (what is ordered: Lab Test Template, Clinical Procedure Template, Therapy Type, Observation Template...),
  `status`, `intent`, `priority` -> `Code Value` (FHIR code systems stored as data), quantity, `occurrence_date/time`, `staff_role`,
  `healthcare_service_unit_type`, `sample_collection_required`, `qty_invoiced`, `billing_status{Pending|Partly Invoiced|Invoiced}`,
  insurance coverage. `Medication Request` (`HMR-`): same shape plus medication, `medication_item`->Item, dosage, period,
  `number_of_repeats_allowed`, `total_dispensable_quantity`.
- Lab: `Lab Test Template` (catalogue + billing Item), `Sample Collection` (`status{Pending|Partly Collected|Collected}`, sample,
  collected_by, collected_time, `collection_point`->Service Unit, `consume_stock`, `consumables`), `Lab Test` (submittable;
  `status{Draft|Completed|Approved|Rejected|Cancelled}`, template, sample, `normal_test_items` / `sensitivity_test_items` /
  `descriptive_test_items` / `organism_test_items` child tables, approved_date, service_request, invoiced), `Observation`
  (`status{Registered|Preliminary|Final|Amended|Corrected|Cancelled|Entered in Error|Unknown|Approved|Rejected}`, observation_template,
  `parent_observation` (panels), `permitted_data_type`, result, result_flag, specimen, `sample_status{Accepted|Rejected}`,
  `observation_category` (FHIR categories), service_request, sales_invoice), `Diagnostic Report`, `Specimen`.
- `Clinical Procedure` (submittable): procedure_template, service_unit, `warehouse`, `consume_stock`, `items` (consumables),
  `invoice_separately_as_consumables`, `consumption_invoiced`, `status{Draft|Submitted|Cancelled|In Progress|Completed|Pending}`,
  actual_start/end_datetime, service_request.
- ADT: `Inpatient Record` (`HLC-INP-`): patient, primary/secondary_practitioner, `status{Admission Scheduled|Admitted|Discharge
  Scheduled|Discharged|Cancelled}`, scheduled_date, admission_ordered_for, admitted_datetime, expected_length_of_stay,
  expected_discharge, admission_encounter, discharge_encounter, `admission_service_unit_type`, `inpatient_occupancies` (child),
  diagnosis, discharge_note, followup_date, `approval_status{Pending|Approved|Rejected|Invoiced}` (insurance pre-auth),
  admission/discharge nursing checklist templates, `items`, price_list, total, paid_amount.
  `Inpatient Occupancy` (child): service_unit, check_in, check_out, `left`, `transferred_for_procedure`, `invoiced`,
  `scheduled_billing_time`, coverage_status.
- Beds/wards: `Healthcare Service Unit` is a nested-set TREE (`lft/rgt`, `parent_healthcare_service_unit`, `is_group`): hospital ->
  building -> ward -> room -> bed; leaf flags `allow_appointments`, `overlap_appointments`, `inpatient_occupancy`, `occupancy_status
  {Vacant|Occupied}`, `warehouse` (ward store), `service_unit_capacity`. `Healthcare Service Unit Type`: `inpatient_occupancy`,
  `is_billable`, `item`/`item_code`, `uom`, `no_of_hours`, `rate`, `minimum_billable_qty`, `is_ot` (operating theatre flag).
- Scheduling: `Practitioner Schedule(schedule_name, time_slots)` + `Healthcare Schedule Time Slot(day, from_time, to_time,
  maximum_appointments, duration)`; a practitioner links schedules per service unit via `Practitioner Service Unit Schedule(schedule,
  service_unit)`. Slots are computed at booking time, not stored.
- `Fee Validity`: practitioner, patient, `visited`, `max_visits`, `valid_till`, `start_date`, `status{Active|Expired|Completed|Cancelled}`,
  `sales_invoice_ref`, `reference_visits`. `doctype/fee_validity/fee_validity.py`: status = Expired if past `valid_till`, Completed when
  `visited == max_visits`, else Active; `create_fee_validity` takes `valid_days`/`max_visits` from Healthcare Settings or the
  practitioner; a daily job `update_validity_status` expires them. This is the "free follow-up within N days / N visits" rule.
- `Therapy Plan(patient, therapy_plan_details, total_sessions, total_sessions_completed, status{Not Started|In Progress|Completed|
  Cancelled}, therapy_plan_template, invoiced)` -> `Therapy Session`s.
- eMAR: `Inpatient Medication Order` (submittable, from an encounter; `medication_orders` child entries per dose with `date`, `time`,
  `status{Pending|Transferred|Completed|Stopped}`, `medication_request`), `Inpatient Medication Entry` (ward issue run; warehouse,
  `update_stock`), and the newer `Medication Administration` (`status{Scheduled|Given|Held|Refused|Not Available|Missed|Cancelled}`,
  route, scheduled_time, administered_time, `administered_by`, `second_check_by` (double check), reason, order_doctype/order_name,
  `dose_key`, `stock_entry`). `doctype/medication_administration/medication_administration.py`: `dose_key =
  "{patient}::{drug_code}::{scheduled_time}"` (idempotency); `issue_from_the_ward()` creates the Stock Entry from the ward warehouse
  when given; docstring: "Correct a mistake with a Stock Entry, not by editing this". `api/medication.py` `schedule_due_medications`
  (scheduler "all") materialises due doses from orders within a lead time and `lapse_missed_doses` marks misses.
  `Nursing Task` status set mirrors FHIR Task (Draft|Requested|Received|Accepted|Rejected|Ready|In Progress|On Hold|Missed|Completed|
  Failed|Cancelled|Entered in Error); hourly `lapse_missed_tasks`.
- Insurance: `Insurance Payor`, `Insurance Payor Contract` (price list), `Insurance Payor Eligibility Plan`, `Item Insurance Eligibility`,
  `Patient Insurance Policy`, `Patient Insurance Coverage` (per service: coverage %, discount, `mode_of_approval{Manual|Automatic}`,
  `status{Draft|Approved|Cancelled|Rejected|Invoiced|Partly Invoiced}`, patient_payable, coverage_amount, approved_amount),
  `Insurance Claim` (payor, from/to_date, coverages, `status{Draft|Submitted|Completed|Cancelled|Error}`, claim/approved/rejected/paid/
  outstanding amounts).

**State machines [code].**
- Appointment (`doctype/patient_appointment/patient_appointment.py` `set_status`, lines ~137-150): terminal-ish statuses Checked In,
  Checked Out, Closed, Cancelled, No Show are left alone; otherwise date-driven: today -> "Open" (unless Confirmed), future ->
  "Scheduled" (unless Confirmed), past -> "No Show". A daily job `update_appointment_status` re-evaluates non-Closed/Cancelled/Confirmed.
- Inpatient (`doctype/inpatient_record/inpatient_record.py`): `schedule_inpatient(admission_order)` -> Admission Scheduled;
  `admit_patient()` -> Admitted (+ `transfer_patient` into the first bed; sets Patient.inpatient_status); `transfer_patient()` throws
  "Service Unit Occupied" unless the unit is Vacant, appends an occupancy row, marks the previous row `left = 1` (unless
  `transferred_for_procedure`, which keeps the bed held during an OT trip), and sets the unit Occupied; `schedule_discharge()` ->
  Discharge Scheduled; `discharge_patient()` runs `validate_nursing_tasks`, `validate_inpatient_invoicing` (throws "Unbilled Services"
  unless Healthcare Settings `allow_discharge_despite_unbilled_services`), `validate_incomplete_service_requests`, then
  `check_out_inpatient` (frees beds -> Vacant) and status Discharged; `set_ip_order_cancelled` -> Cancelled.
- Lab test (`doctype/lab_test/lab_test.py`): on_submit -> status Completed and linked Service Request -> "completed-Request Status";
  on_cancel -> Cancelled and Service Request back to "active-Request Status"; `update_status()` sets Approved/Rejected with
  `approved_date` (role LabTest Approver). Sample Collection Pending -> Partly Collected -> Collected.
- Docstatus lifecycle (Draft/Submitted/Cancelled + amendment) applies to Encounter, Vital Signs, Lab Test, Clinical Procedure,
  Service Request, Medication Request, Insurance Claim.

**Charge capture [code].** PULL model at the cashier: `utils.py get_healthcare_services_to_invoice(patient, company)` gathers every
un-invoiced billable document for the patient -- `get_appointments_to_invoice`, `get_encounters_to_invoice`, `get_lab_tests_to_invoice`,
`get_clinical_procedures_to_invoice`, `get_observations_to_invoice`, `get_inpatient_services_to_invoice` (bed occupancy qty from the
service unit type's `no_of_hours`/`minimum_billable_qty`), `get_therapy_sessions_to_invoice`, `get_service_requests_to_invoice`,
`get_drugs_to_invoice` -- into Sales Invoice items that carry `reference_dt`/`reference_dn`. `hooks.py` `doc_events["Sales Invoice"]`
`on_submit`/`on_cancel` -> `manage_invoice_submit_cancel` -> `set_invoiced(item, method)` flips `invoiced` on the source doc (or
`consumption_invoiced` for procedure consumables), increments `qty_invoiced`/`billing_status` on Service/Medication Requests
(`hso.update_invoice_details(qty)`, negative on cancel), stamps the appointment `ref_sales_invoice` and updates Fee Validity. Prices come
from Item + Price List (patient default, payor contract, appointment type, practitioner `op_consulting_charge`). Daily job
`add_occupied_service_unit_in_ip_to_billables` accrues bed-days. Insurance: `Payment Entry` validate hook sets claim fields;
`post_transfer_journal_entry_and_update_coverage` moves the covered share from patient to payor receivable (journal entry).
Stock: Clinical Procedure and Sample Collection consume from a warehouse (`consume_stock`), Medication Administration issues from the
ward warehouse; all are ERPNext `Stock Entry` documents that post to the stock ledger and GL.

**Permissions [code].** Frappe per-DocType role permissions in each JSON (`permissions[]`: read/write/create/submit/cancel/amend/
report/export per role). Roles seen across doctypes: System Manager (63 doctypes), Healthcare Administrator (57), Physician (55),
Nursing User (37), Laboratory User (11), Accounts Manager, Accounts User, LabTest Approver (3), Patient (1). Submit/cancel as separate
permissions gives maker-checker for free (e.g., only LabTest Approver approves). Record-level scoping uses Frappe "User Permissions" on
Link values (Company, Service Unit, Practitioner) [doc/framework knowledge, not read here].

**Other [code].** `hooks.py` `doc_events["*"]` on_submit/on_cancel/on_update_after_submit -> `patient_history_settings.create_medical_record`
builds a unified patient timeline (`Patient Medical Record`) from any submitted clinical doc. Code systems are data (`Code System`,
`Code Value`, `Codification Table`), used for FHIR-valued statuses (`completed-Request Status`). `regional/india/abdm` integrates ABDM
(India's health ID). `scheduler_events`: appointment reminders and due-medication scheduling every tick, hourly nursing-task lapse, daily
appointment/fee-validity/bed-accrual jobs.

**UX ideas.** "Get items from healthcare services" button on Sales Invoice; Fee Validity (free follow-up) shown at booking; ward
tree with Vacant/Occupied; queue position for check-in-based appointments; medication round view `doses_on_the_round(patient, hours)`;
discharge blocked until unbilled services, open nursing tasks and incomplete service requests are resolved.

### 2.5 GNU Health

Source [code]: sparse shallow clone of `codeberg.org/gnuhealth/his` (branch devel @ 5ce62d3, 2026-10-12) at `scratchpad/oss/gnuhealth`;
Python model files of `tryton/health`, `health_inpatient`, `health_lab`, `health_services`, `health_services_lab`, `health_surgery`,
`health_nursing`, `health_stock`, `health_stock_inpatient`, `health_insurance`, `health_imaging`, `health_icu`, `health_calendar`.

**Module list [code]** (`tryton/` directory, each a Tryton module with `tryton.cfg` `depends:`): health (core), health_inpatient,
health_inpatient_calendar, health_icu, health_lab, health_crypto_lab, health_services, health_services_lab, health_services_imaging,
health_imaging, health_imaging_worklist, health_orthanc (PACS), health_surgery, health_surgery_protocols, health_nursing,
health_stock, health_stock_inpatient, health_stock_nursing, health_stock_surgery, health_insurance, health_calendar, health_caldav,
health_crypto (document signing), health_federation (multi-site PUID federation), health_archives, health_history, health_reporting,
health_icd10/icd10pcs/icd11/icd9procs/icpm (code systems), health_who_essential_medicines, specialty modules (gyneco, pediatrics +
growth charts, ophthalmology, dentistry, genetics, disability, lifestyle, socioeconomics, ntd_*, contact_tracing, ems, iss, mdg6,
qrcodes, webdav3_server). Example: `health_inpatient/tryton.cfg` depends on `health`, `health_lifestyle`.
Modules communicate in-process through the Tryton ORM: a module re-declares a model (`__name__ = 'gnuhealth.patient'` again in
health_lab, `gnuhealth.prescription.order` again in health_stock) to add fields and override methods (class extension via `Pool`).

**Core entities [code]** (`tryton/health/health.py`): a Person is a `party.party` (Tryton party = patient, professional,
institution, insurer all at once); `gnuhealth.patient` links to a party; `gnuhealth.person_alternative_identification`;
`gnuhealth.institution` -> `gnuhealth.hospital.building` -> `gnuhealth.hospital.unit` -> `gnuhealth.hospital.ward` ->
`gnuhealth.hospital.bed`; `gnuhealth.hospital.or` (operating rooms); `gnuhealth.healthprofessional` + `gnuhealth.hp_specialty`;
`gnuhealth.pathology` (ICD), `gnuhealth.procedure`; `gnuhealth.medicament` (wraps `product.product`); `gnuhealth.insurance` /
`gnuhealth.insurance.plan`; `gnuhealth.appointment`; `gnuhealth.patient.evaluation` (the encounter); `gnuhealth.prescription.order`
+ `gnuhealth.prescription.line`; `gnuhealth.patient.medication`, `gnuhealth.vaccination`, `gnuhealth.patient.disease`,
`gnuhealth.birth_certificate`, `gnuhealth.death_certificate`.
- Bed (`gnuhealth.hospital.bed`): `product` (bed is a billable product), institution, ward, `bed_type` (gatch, electric, stretcher, low,
  low_air_loss, circo_electric, clinitron), telephone_number, `state{free|reserved|occupied|to_clean|na}`.
- Ward: gender (men/women/unisex), `state{beds_available|full|na}`. Operating room: `state{free|scheduled|confirmed|occupied|na}`.
- Appointment: healthprof, patient, appointment_date, checked_in_date, institution, speciality, `state{free|confirmed|checked_in|done|
  user_cancelled|center_cancelled|no_show}`, `urgency{a Normal|b Urgent|c Medical Emergency}`, `appointment_type{outpatient|
  telemedicine|homecare|inpatient}`, `visit_type{new|followup|well_child|well_woman|well_man}`, consultations (billable product),
  insurance. A "free" appointment is an empty SLOT pre-generated for a professional and later assigned a patient (slot-as-record).
- Evaluation: patient, appointment, evaluation_start/endtime, wait_time, `state{in_progress|done|signed}`, `signed_by`, healthprof,
  chief_complaint, present_illness, vitals as columns (systolic, diastolic, bpm, respiratory_rate, osat, temperature, weight, height, bmi,
  glycemia, cholesterol...), Glasgow (loc_eyes/verbal/motor), mental status, diagnosis, secondary_conditions.
- Prescription order: patient, prescription_id, prescription_date, pharmacy, prescription_line, `pregnancy_warning`, `allergy_warning`,
  `prescription_warning_ack` (CDS acknowledgement), healthprof, `state{draft|done|validated}`.

**ADT state machine [code]** (`health_inpatient/health_inpatient.py`, model `gnuhealth.inpatient.registration`; fields name, patient,
`admission_type{routine|maternity|elective|urgent|emergency}`, hospitalization_date, discharge_date, attending_physician,
operating_physician, admission_reason, bed, nursing_plan, medications, therapeutic_diets, discharge_plan, `bed_transfers`
(`gnuhealth.bed.transfer`), discharged_by, `discharge_reason{home|transfer|death|against_advice}`, discharge_dx, puid):
- `free` -(confirmed button: checks discharge >= admission, runs an SQL overlap query on `[hospitalization_date, discharge_date]` for
  the same bed in states confirmed/hospitalized/done, raises `BedIsNotAvailable`)-> `confirmed` (bed -> `reserved`)
- `confirmed` -(admission)-> `hospitalized` (bed -> `occupied`);  `confirmed` -(cancel)-> `cancelled` (bed -> `free`)
- `hospitalized` -(discharge, requires discharge_reason, records `discharged_by` = signing professional)-> `done` "Discharged - needs
  cleaning" (bed -> `to_clean`)
- `done` -(bedclean)-> `finished` (bed -> `free`). Button visibility (`_buttons`) encodes the allowed transitions.
Also in the module: `gnuhealth.inpatient.medication` + `.admin_time` + `.log` (inpatient MAR), `gnuhealth.inpatient.diet`, meal orders,
`gnuhealth.patient.rounding` (nursing rounds) and `gnuhealth.rounding_procedure`. `health_icu` adds `gnuhealth.inpatient.icu`, Glasgow,
APACHE II, ventilation, chest drainage.

**Lab [code]** (`health_lab/health_lab.py`): `gnuhealth.lab.test_type` (catalogue with category hematology/biochemical/
microbiological/..., `product` for billing), `gnuhealth.lab.test.critearea` (analyte rows with ranges), `gnuhealth.lab.test.units`.
Request `gnuhealth.patient.lab.test(test_type, date, state{draft|tested|ordered|cancel}, patient_id, doctor_id, specimen_type, urgent,
request)`. Result `gnuhealth.lab(test, patient, specimen_type, pathologist, requestor, results, diagnosis, critearea, date_requested,
date_analysis, request_order, state{draft|done|validated}, done_by, done_date, validated_by, validation_date)` -- two-person
done/validated sign-off. `health_crypto_lab` signs validated results.

**Surgery [code]** (`health_surgery/health_surgery.py`): `gnuhealth.surgery(patient, admission, operating_room, protocol,
procedures, supplies, classification{o Optional|r Required|u Urgent|e Emergency}, surgeon, anesthetist, surgery_date, surgery_end_date,
state{draft|confirmed|cancelled|in_progress|done|signed}, signed_by, preop_* WHO checklist booleans (site marking, antibiotics,
sterility, oximeter, bleeding risk), anesthesia_type, patient_positioning, laterality, clavien_dindo, complications, drains, surgery_team,
postoperative_dx)`, `gnuhealth.preoperative_assessment`, `gnuhealth.rcri` (cardiac risk index), `gnuhealth.or.schedule`.

**Charge capture [code].** `health_services/health_services.py`: `gnuhealth.health_service(name, patient, institution, company,
service_date, service_line, state{draft|invoiced}, invoice_to)` and `gnuhealth.health_service.line(service, desc, appointment,
to_invoice, product, qty, from_date, to_date, action_required)` -- a per-episode "service document" that accumulates billable
products; a wizard turns it into a Tryton `account.invoice` (`health_services/invoice.py` extends `account.invoice` /
`account.invoice.line`). `health_services_lab/health_services_lab.py` appends a line (`'product': laborder.name.product_id`) to the
chosen health_service when a lab order is created (error "no service associated" otherwise); prescriptions and evaluations get a
`service` link the same way. Beds, consultations, lab tests and medicaments are all `product.product`, so price lists and taxes come
from Tryton. Insurance: `gnuhealth.insurance.plan.product.policy(plan, product, product_category, discount, price)` = per-plan discount
or fixed price applied on invoicing. Stock: `health_stock` extends `stock.move`/`stock.lot` and `gnuhealth.prescription.order`
(dispense = stock move from pharmacy location); `health_stock_inpatient` adds `gnuhealth.patient.rounding.medicament` /
`.medical_supply` so nurse rounds consume stock.

**Permissions [code].** Tryton groups in `health/security/access_rights.xml` (109 `ir.model.access` records): Health Administration,
Health Back Office, Health Doctor, Health Front Desk, Health Nurse, Health Nurse Administration, Health Social Worker; each model access
row sets `perm_read/perm_write/perm_create/perm_delete` per group. Clinical documents are additionally locked by state (signed/validated
records become read-only through `states` on fields) [inferred from field `states` usage].

**Integration.** health_federation (Thalamus REST + PUID), health_orthanc (Orthanc DICOM), health_imaging_worklist, health_caldav
[module names verified; internals not read]. No HL7 v2 engine in core [not found in files read].

**UX ideas.** Bed "needs cleaning" state integrated with discharge; slot-as-record appointments (front desk sees free slots as rows);
WHO surgical safety checklist as structured booleans; warnings (allergy, pregnancy) that require explicit acknowledgement on prescription.

### 2.6 HospitalRun

Sources [code] (GitHub API/raw): `HospitalRun/hospitalrun-frontend` master (v2.0.0-alpha.7, React 17 + Redux Toolkit) and branch
`1.0.0-beta` (v1, Ember + Ember Data), `HospitalRun/hospitalrun-server` branch `1.0.0-beta`. Status: all three repos are ARCHIVED on
GitHub (frontend last push 2023-01-09, monorepo 2021-02-05). v2 never reached a stable release; v1 is the feature-complete one.

**Offline-first architecture [code].** v2 `src/shared/config/pouchdb.ts`: a browser PouchDB `local_hospitalrun` and a remote
`${REACT_APP_HOSPITALRUN_API}/hospitalrun` CouchDB, joined by `localDb.sync(serverDb, { live: true, retry: true })` (continuous
bidirectional replication); plugins `relational-pouch` (typed docs with `hasMany`/`belongsTo` relations, e.g. patient hasMany
appointments, labs, medications, imagings via `queryInverse`), `pouchdb-find` (Mango queries), `pouchdb-quick-search` (full text),
`pouchdb-authentication` (CouchDB sessions). Repositories per aggregate (`src/shared/db/PatientRepository.ts`, `LabRepository.ts`,
`MedicationRepository.ts`, `ImagingRepository.ts`, `AppointmentRepository.ts`, `IncidentRepository.ts`). Every doc extends
`AbstractDBModel{id, rev, createdAt, updatedAt}` -- `rev` is the CouchDB MVCC revision.
v1: a service worker (`app/serviceworkers/pouchdb-sync.js`) proxies all DB calls; after any `put/bulkDocs/post/remove` it triggers
`remoteSync()`; if the HTTP adapter fails it retries against the local DB ("If the failure was on http, retry with local db").
v1 `app/models/abstract.js` keeps `archived` (soft delete), `lastModified`, `modifiedBy`, and `modifiedFields` -- a map of field ->
timestamp updated before each save. Server `utils/conflict-res.js` builds a CouchDB view of docs with `_conflicts`, loads all
`open_revs`, and merges field by field keeping the value with the newest `modifiedFields[key]` timestamp (field-level last-writer-wins),
saves a record of the losing revisions, then deletes them.

**Entities [code].** v2 models (`src/shared/model/*.ts`): Patient, Allergy, Diagnosis, CarePlan, CareGoal, Note, RelatedPerson,
Visit (`status` Planned|Arrived|Triaged|In Progress|On Leave|Finished|Cancelled = FHIR Encounter.status; startDateTime, endDateTime,
type, reason, location), Appointment (startDateTime, endDateTime, patient, location, reason, type), Lab (`status requested|completed|
canceled`, requestedOn/completedOn/canceledOn, result, visitId), Imaging (same lifecycle), Medication (`status draft|active|on hold|
canceled|completed|entered in error|stopped|unknown`, `intent proposal|plan|order|original order|reflex order|filler order|instance
order|option`, `priority routine|urgent|asap|stat`, quantity{value, unit}) -- copied verbatim from FHIR MedicationRequest value sets;
Incident (`status reported|resolved`).
v1 models (`app/models/*.js` on 1.0.0-beta): patient, visit (`outPatient`, `paymentState` clear|pending, `dischargeInfo`, statuses in
`app/utils/visit-statuses.js`: Admitted, Discharged, CheckedIn, CheckedOut), appointment, lab, imaging, medication, procedure,
operative-plan, operation-report, vital, invoice (`billDate`, `externalInvoiceNumber`, `paidTotal`, `status` ("Paid" sets `paidFlag`),
`lineItems` -> billing-line-item -> line-item-detail, `payments`, `paymentProfile` -> price-profile, `visit`), pricing,
override-price, price-profile, proc-charge (`quantity`, `dateCharged`, `medication` -> inventory, `pricingItem` -> pricing), payment,
inventory, inventory-batch, inv-location, inv-purchase, inv-request (`status` Requested -> Completed/Fulfilled, `transactionType`,
`quantity`, `costPerUnit`, `expenseAccount`, `markAsConsumed`, `patient`, `visit`), social-expense, incident.

**Charge capture [code].** v1 `app/mixins/charge-actions.js` lets any clinical screen (lab, imaging, procedure, medication) add
`proc-charge` records (pricingItem + quantity) to `model.charges`; the visit invoice (`invoice.visit`) is then built from those charges and the
inventory requests tied to the visit [assembly logic inferred, not read]. Inventory requests carry `patient`/`visit` and
`markAsConsumed`, so stock issue and charge share the visit as the join key.

**Permissions [code].** v2 `src/shared/model/Permissions.ts`: capability strings `read:patients`, `write:patients`,
`read:appointments`, `write:appointments`, `delete:appointment`, `write:allergy`, `write:diagnosis`, `write:labs`, `cancel:lab`,
`complete:lab`, `read:labs`, `write:medications`, `cancel:medication`, `complete:medication`, `write:incident`, `resolve:incident`,
`write:visit`, ... (verb:resource, with lifecycle verbs as first-class permissions). v1 `app/models/user-role.js` (`name`,
`capabilities`, `navRoute`) and `app/mixins/user-roles.js` roles: Data Entry, Doctor, Finance, Finance Manager, Hospital Administrator,
Inventory Manager, Imaging Technician, Lab Technician, Medical Records Officer, Nurse, Nurse Manager, Patient Administration, Pharmacist,
Social Worker, System Administrator, User Administrator, Cashier. Enforcement is client-side in the SPA; server-side the CouchDB
database security is coarse [inferred].

**UX ideas.** Works fully offline in low-connectivity hospitals, syncs when back online; role-based landing route (`navRoute`); quick
"Add charge" from any clinical page; incident reporting built in. **Why it stalled [inferred from repo state]:** the v2 rewrite (React,
then a planned GraphQL server: branch `add-graphql`) restarted the data layer and was archived before parity with v1.

### 2.7 FHIR R4 canonical vocabulary

Sources [doc]: hl7.org/fhir/R4 pages `encounter.html`, `episodeofcare.html`, `appointment.html`, `slot.html`, `schedule.html`,
`servicerequest.html`, `medicationrequest.html`, `medicationadministration.html`, `medicationdispense.html`,
`valueset-observation-status.html`, `diagnosticreport.html`, `valueset-diagnostic-report-status.html`, `specimen.html`, `location.html`,
`valueset-location-physical-type.html`, `chargeitem.html`, `invoice.html`, `claim.html`, `coverage.html`, `task.html`;
`terminology.hl7.org/CodeSystem-v2-0116.json`.

| Resource | Status / key codes (R4, required bindings) | Key links |
|---|---|---|
| Patient | (no status; `active` boolean) | identifier[] (MRN etc), link (merge) |
| Encounter | `planned, arrived, triaged, in-progress, onleave, finished, cancelled` (+ `entered-in-error, unknown` in the R4 value set; not in the fetched summary); `class` = v3 ActEncounterCode, extensible (AMB, IMP, EMER... from memory, not re-fetched); `statusHistory{status, period}`, `classHistory{class, period}` | `episodeOfCare[]`, `basedOn[]` -> ServiceRequest, `partOf` -> Encounter (stay -> sub-encounters), `account[]`; `hospitalization{preAdmissionIdentifier, origin, admitSource, reAdmission, dietPreference, specialCourtesy, specialArrangement, destination, dischargeDisposition}`; `location[]{location, status planned/active/reserved/completed, physicalType, period}` = bed history |
| EpisodeOfCare | `planned, waitlist, active, onhold, finished, cancelled, entered-in-error`; statusHistory | `diagnosis{condition, role, rank}`, managingOrganization, referralRequest -> ServiceRequest, careManager, team, `account[]` |
| Appointment | `proposed, pending, booked, arrived, fulfilled, cancelled, noshow, entered-in-error, checked-in, waitlist`; `participant.status accepted, declined, tentative, needs-action` | `slot[]`, `basedOn[]` -> ServiceRequest; invariant: only proposed/cancelled may lack start/end; cancelationReason only for cancelled/noshow |
| Schedule / Slot | Slot `busy, free, busy-unavailable, busy-tentative, entered-in-error`; `overbooked` | Schedule.actor[] (Practitioner, PractitionerRole, Location, HealthcareService, Device...), `planningHorizon`; Slot.schedule 1..1, start/end 1..1 |
| ServiceRequest | `draft, active, on-hold, revoked, completed, entered-in-error, unknown`; intent `proposal, plan, directive, order, original-order, reflex-order, filler-order, instance-order, option`; priority `routine, urgent, asap, stat` | `requisition` (shared id for orders signed together), `basedOn`, `replaces[]` (revision chain), `specimen[]`, `occurrence[x]`, `performer[]`, `encounter`, `insurance[]` -> Coverage, `reasonCode[]` |
| MedicationRequest | `active, on-hold, cancelled, completed, entered-in-error, stopped, draft, unknown`; intent as ServiceRequest minus directive | `dosageInstruction[]` (Dosage), `dispenseRequest{initialFill, dispenseInterval, validityPeriod, numberOfRepeatsAllowed, quantity, expectedSupplyDuration, performer}`, `substitution{allowed[x], reason}`, `priorPrescription`, `groupIdentifier`, `courseOfTherapyType` |
| MedicationDispense | `preparation, in-progress, cancelled, on-hold, completed, entered-in-error, stopped, declined, unknown` | `authorizingPrescription[]` -> MedicationRequest, `type` (ActPharmacySupplyType), quantity, daysSupply, `whenPrepared`, `whenHandedOver` (not before whenPrepared), `substitution{wasSubstituted, type, reason, responsibleParty}` |
| MedicationAdministration | `in-progress, not-done, on-hold, completed, entered-in-error, stopped, unknown`; `statusReason` (why not given) | `request` -> MedicationRequest, `effective[x]` 1..1, `dosage{site, route, method, dose, rate[x]}`, `partOf`, `device[]` (pump) |
| Observation | `registered, preliminary, final, amended (> corrected), cancelled, entered-in-error, unknown` | basedOn, specimen, hasMember (panels), derivedFrom, referenceRange, interpretation |
| DiagnosticReport | `registered, partial (> preliminary), final, amended (> corrected, appended), cancelled, entered-in-error, unknown` | `basedOn[]`, `specimen[]`, `result[]` -> Observation, `imagingStudy[]`, conclusion, conclusionCode, presentedForm, resultsInterpreter |
| Specimen | `available, unavailable, unsatisfactory, entered-in-error` | `accessionIdentifier`, `collection{collector, collected[x], quantity, method, bodySite, fastingStatus[x]}`, `container[]`, `request[]` -> ServiceRequest, `condition` (v2 0493) |
| Task | TaskStatus (page truncated; full R4 set cross-checked against Marley's Nursing Task options): draft, requested, received, accepted, rejected, ready, cancelled, in-progress, on-hold, failed, completed, entered-in-error; `businessStatus` free CodeableConcept (e.g. "Specimen collected") | `basedOn` (the order), `focus`, `for`, `owner` |
| Location (beds) | `status active, suspended, inactive`; `mode instance, kind`; `operationalStatus` (Coding, preferred v2 0116: C Closed, H Housekeeping, O Occupied, U Unoccupied, K Contaminated, I Isolated); `physicalType` si, bu, wi, wa (ward), lvl, co, ro (room), bd (bed), ve, ho, ca, rd, area, jdn | `partOf` -> Location (site > building > wing > ward > room > bed) |
| ChargeItem | `planned, billable, not-billable, aborted, billed, entered-in-error, unknown`; required status, code, subject | `context` -> Encounter/EpisodeOfCare, `occurrence[x]`, `performer[]`, `quantity`, `priceOverride`, `factorOverride`, `overrideReason`, `enterer`, `enteredDate`, `service[]` -> DiagnosticReport/ImagingStudy/Immunization/MedicationAdministration/MedicationDispense/Observation/Procedure/SupplyDelivery, `product[x]`, `account[]`, `costCenter`, `definitionCanonical` -> ChargeItemDefinition (pricing rules). Spec: a ChargeItem is not a financial transaction; a billing engine collects them per Account/Encounter and creates Invoices |
| Invoice | `draft, issued, balanced, cancelled, entered-in-error` | `lineItem[]{sequence, chargeItem[x], priceComponent[]{type base/surcharge/deduction/discount/tax/informational, code, factor, amount}}`, `totalPriceComponent`, `totalNet`, `totalGross`, `account`, `paymentTerms`, `cancelledReason` |
| Claim | `active, cancelled, draft, entered-in-error`; use `claim, preauthorization, predetermination` | required: type, use, patient, created, provider, priority, `insurance[]{sequence, focal, coverage}`; `diagnosis[]`, `procedure[]`, `item[]{sequence, diagnosisSequence, revenue, productOrService, modifier, quantity, unitPrice, factor, net, encounter, detail[]}`; response = ClaimResponse; eligibility = CoverageEligibilityRequest |
| Coverage | `active, cancelled, draft, entered-in-error` | `beneficiary` 1..1, `payor[]` 1..*, subscriber, subscriberId, dependent, relationship, period, `class[]{type, value}` (group/plan), `order` (does not by itself mean primary), network, `costToBeneficiary[]` (copay), contract |

Takeaways for ProHealth: (1) FHIR separates request (ServiceRequest/MedicationRequest), event (Procedure, MedicationDispense,
MedicationAdministration, Observation) and workflow (Task) -- our JSON `prescriptions`/`lab_orders` blobs conflate them. (2) Bed state
lives on Location (`operationalStatus`), the patient's bed history lives on Encounter.location[] with periods. (3) Billing intent
(ChargeItem) is distinct from the invoice; `ChargeItem.service` points back at the clinical event, which is exactly the
`reference_dt/reference_dn` (Marley) and `external_order_id` (Bahmni) pattern.

## 3. Cross-system comparison (ADT/beds, orders, lab, pharmacy, billing, scheduling)

All cells summarise sections 2.1-2.7 (citations there). "-" = not present in what was read.

**3.1 ADT and beds**

| | OpenMRS + Bahmni | OpenEMR | Marley (ERPNext) | GNU Health | HospitalRun v1 | FHIR R4 |
|---|---|---|---|---|---|---|
| Stay container | Visit (IPD visit type) + "Admission Status" visit attribute | `form_encounter` (date..date_end), no ADT module | `Inpatient Record` | `gnuhealth.inpatient.registration` | visit (Admitted/Discharged) | Encounter (class IMP) |
| Admit decision | Disposition obs ADMIT in consultation, then ADMISSION encounter | - | `schedule_inpatient(admission_order)` from encounter | registration `free` -> `confirmed` | - | ServiceRequest/Encounter planned |
| Location tree | Location hierarchy + tags; `AdmissionLocation` with row x column layout | `facility` only | `Healthcare Service Unit` nested-set tree, leaf = bed | institution > building > unit > ward > bed (+ OR) | - | Location.partOf + physicalType (wa/ro/bd) |
| Bed states | AVAILABLE / OCCUPIED (+ tags) | - | Vacant / Occupied | free / reserved / occupied / to_clean / na | - | operationalStatus v2 0116: U, O, H, C, K, I |
| Bed history | `bed_patient_assignment(start, end, encounter)` | - | `Inpatient Occupancy` rows (check_in/out, left, transferred_for_procedure) | `gnuhealth.bed.transfer` | - | Encounter.location[]{status, period} |
| Double-booking guard | validator: patient not in two beds; beds MAY be shared | - | throws unless unit Vacant | SQL date-range overlap check on reservation | - | - |
| Discharge gate | DISCHARGE encounter + unassign bed | - | blocks on unbilled services, open nursing tasks, incomplete service requests | requires discharge_reason, signer; bed -> to_clean | - | hospitalization.dischargeDisposition |

**3.2 Orders (CPOE)**

| | OpenMRS | OpenEMR | Marley | GNU Health | FHIR |
|---|---|---|---|---|---|
| Order entity | `orders` + subclass tables (`drug_order`, `test_order`, referral) | `procedure_order` + `procedure_order_code` lines; `prescriptions` separate | `Service Request` / `Medication Request` (FHIR-shaped) + legacy child tables on encounter | `gnuhealth.patient.lab.test`, `prescription.order`, imaging request | ServiceRequest / MedicationRequest |
| Change model | immutable rows; REVISE/DISCONTINUE create new order linked by `previousOrder`; old one gets `dateStopped` | edit in place | docstatus submit/cancel + amendment | edit until state change | `replaces[]`, `priorPrescription` |
| Orderer vs filler | `action` (orderer) vs `fulfillerStatus` (filler) separate | `order_status` only | status + Task-like nursing tasks | state only | ServiceRequest.status vs Task.status |
| Grouping | OrderGroup / OrderSet | one procedure_order per lab with N codes | `order_group` dynamic link | - | `requisition`, `groupIdentifier` |
| Duplicate check | active same-orderable overlapping drug orders rejected | - | - | allergy/pregnancy warnings w/ acknowledgement | - |

**3.3 Lab**

| | Bahmni (OpenELIS) | OpenEMR | Marley | GNU Health | FHIR |
|---|---|---|---|---|---|
| Catalogue | OpenMRS Concepts (uuid shared with ELIS) | `procedure_type` tree with LOINC `standard_code` | `Lab Test Template` + `Observation Template` | `lab.test_type` + `critearea` analytes | ActivityDefinition/ObservationDefinition [not fetched] |
| Specimen | inside ELIS (accession = OpenMRS encounter uuid) | `procedure_specimen(specimen_identifier, accession_identifier, ...)` | `Sample Collection` Pending/Partly Collected/Collected; Observation `sample_status` Accepted/Rejected | `specimen_type` field | Specimen available/unavailable/unsatisfactory + accessionIdentifier |
| Result | Obs in LAB_RESULT encounter, abnormal flag, min/maxNormal | `procedure_report` + `procedure_result(result, range, abnormal, result_status)` | `Lab Test` child tables or `Observation` (parent/child) | `gnuhealth.lab` draft/done/validated (done_by, validated_by) | DiagnosticReport + Observation |
| Verification | in ELIS | review_status, "sign" ACL | LabTest Approver role: Approved/Rejected | two-step done -> validated, crypto signing | DiagnosticReport preliminary -> final -> amended/corrected |
| Integration | atomfeed both ways + REST pull | HL7 v2 ORM out / ORU in via SFTP | in-process | in-process | - |

**3.4 Pharmacy, inventory and eMAR**

| | Bahmni (Odoo) | OpenEMR | Marley | GNU Health | HospitalRun v1 |
|---|---|---|---|---|---|
| Stock model | Odoo `stock.picking`/moves, lots with expiry, per-shop warehouse | `drug_inventory` lots per warehouse + `drug_sales` ledger (trans_type 1-5) | ERPNext Item, Batch, Warehouse, Stock Entry (ward warehouses) | Tryton `stock.move`/`stock.lot`, pharmacy locations | inventory, inventory-batch, inv-location, inv-purchase, inv-request |
| Dispense record | sale.order.line `dispensed` + delivery | `drug_sales` row (sale) | Medication Request qty_invoiced + Stock Entry | prescription -> stock move | inv-request Completed/Fulfilled |
| Inpatient MAR | (Bahmni IPD app; not read) | - | `Medication Administration` Scheduled/Given/Held/Refused/Not Available/Missed/Cancelled, dose_key, second_check_by, ward issue | `inpatient.medication` + admin_time + log | - |
| Order -> dispense link | `external_order_id` = OpenMRS order uuid | `prescription_id` on drug_sales | `order_doctype/order_name`, `medication_request` | prescription_order | visit + patient |

**3.5 Billing and charge capture**

| | Bahmni | OpenEMR | Marley | GNU Health | HospitalRun v1 | FHIR |
|---|---|---|---|---|---|---|
| Trigger | PUSH: each order event creates/updates a draft quotation line | MANUAL: coder fills Fee Sheet per encounter | PULL: cashier fetches un-invoiced docs | SEMI: modules append lines to a `health_service`; wizard invoices | MANUAL: "add charge" on clinical screens | ChargeItem created when planned/provided |
| Charge entity | `sale.order.line(external_order_id, dispensed, lot_id)` | `billing` (CPT/ICD lines, justify, modifier, units, fee) + `drug_sales` | Sales Invoice item with `reference_dt/reference_dn` | `health_service.line(product, qty, to_invoice)` | `proc-charge(pricingItem, quantity)` | ChargeItem(service[], context, quantity, priceOverride) |
| Price source | shop pricelist | `prices` by `pricelevel` | Price List (patient, payor contract), practitioner charge | product list price, insurance plan policy discount | pricing + price-profile + override-price | ChargeItemDefinition |
| Cancellation | DISCONTINUE/void unlinks line if quotation still draft | `billing.activity = 0` | invoice cancel flips `invoiced` back, qty_invoiced -= qty | - | - | ChargeItem aborted/entered-in-error |
| Insurance/claims | - (Odoo) | full US RCM: `claims` versions, X12 837P/I, 835 ERA, `ar_session`/`ar_activity`, secondary crossover | Coverage per service, pre-auth on Inpatient Record, Insurance Claim, payor receivable JE | plan product policy discounts | - | Coverage, Claim, ClaimResponse, CoverageEligibilityRequest |
| Bed-day charges | (Odoo, not read) | - | daily job accrues occupancy by service-unit-type hours/rate | bed is a product | - | ChargeItem per day [inferred] |

**3.6 Scheduling**

| | Bahmni appointments | OpenEMR | Marley | GNU Health | ProHealth today | FHIR |
|---|---|---|---|---|---|---|
| Availability | service definition + weekly availability + max per day | calendar categories + provider calendar | Practitioner Schedule time slots (day, from, to, duration, max) per service unit | pre-created `free` appointment rows | JSON arrays on doctor | Schedule + Slot |
| Slot storage | computed | events only | computed | stored (slot = record) | none | Slot resources |
| Statuses | Requested, WaitList, Scheduled, Arrived, CheckedIn, Completed, Cancelled, Missed | configurable list (~20) | Scheduled, Open, Confirmed, Checked In, Checked Out, Closed, Cancelled, No Show | free, confirmed, checked_in, done, user_cancelled, center_cancelled, no_show | SCHEDULED, CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, NO_SHOW | proposed ... waitlist (10) |
| Transition rule | monotonic sequence, undo to Scheduled | none | date-driven auto status + daily job | buttons | none | not formalised |
| Conflicts | patient double booking, service unavailability | - | `overlap_appointments` flag per unit | - | none | Slot.overbooked |
| Billing tie | - | check-in opens encounter; fee sheet | invoice at booking, Fee Validity free follow-ups | consultations product | consultation_fee copied | - |

**3.7 Integration and permission styles**

| | Integration | Module communication | Permissions |
|---|---|---|---|
| OpenMRS | REST, FHIR2, legacy HL7 v2 inbound queue, new outbox_event + CDC (2.9) | in-process Spring services + AOP advice | Role -> Privilege strings on service methods; no instance-level ACL in core |
| Bahmni | atomfeed (thin events + REST pull, per-consumer markers, failed_events), HL7 v2 ORM/OMG to PACS | separate products, own DBs | OpenMRS privileges + `app:*` UI privileges; Odoo groups separate |
| OpenEMR | HL7 v2 lab (SFTP), X12 837/835/270, FHIR R4 US Core (OAuth2 tables `oauth_clients`, `api_token` in schema) | Symfony EventDispatcher listeners | phpGACL ACO section/value with view < addonly < wsome < write, "my vs any", sensitivity |
| Marley | ERPNext in-process, ABDM, FHIR-shaped doctypes | `hooks.py` doc_events + scheduler_events | Frappe role x doctype x (read/write/create/submit/cancel/amend); User Permissions |
| GNU Health | federation REST (Thalamus), Orthanc | Tryton Pool model extension | Tryton groups x model access (rwcd) |
| HospitalRun | CouchDB replication | single SPA | capability strings `verb:resource` |

## 4. Proposed TARGET for ProHealth

This section is DESIGN (my proposal), grounded in sections 2-3. Conventions kept from our code: `VARCHAR(64)` text ids with prefixes,
snake_case columns, `TIMESTAMPTZ created_at/updated_at`, human numbers `XXX-<year>-<n>`, routes `/api/v1/<service>/...` proxied by
the gateway `pathFilter`, events `hospital.<domain>.<event_name>` wrapped in `BaseDomainEvent<T>`, cross-service references are
plain `VARCHAR(64)` columns without FKs (as `appointments.patient_id` today); FKs only inside one service's tables.

### 4.1 Principles (each traced to a lesson)

1. **Request / fulfilment / charge are three records** (FHIR ServiceRequest vs Task/Dispense/Administration vs ChargeItem; OpenMRS
   `action` vs `fulfillerStatus`; Marley order -> Lab Test -> Sales Invoice item). Replace `clinical_encounters.prescriptions` and
   `.lab_orders` JSON with order rows; keep the JSON as a read-only snapshot for backward compatibility during migration.
2. **Orders are append-only.** Revise/discontinue create a new row with `previous_order_id` (OpenMRS `REVISE`/`DISCONTINUE`); never
   edit a signed order.
3. **Explicit, stored state machines** with a transition table enforced in the service (Bahmni `DefaultAppointmentStatusChangeValidator`,
   GNU Health `_buttons`), not statuses derived at read time (OpenMRS FHIR2 returns Encounter.status UNKNOWN).
4. **Transactional outbox + durable consumers.** Every service writes `outbox_events` in the same transaction as the change (OpenMRS
   2.9 `outbox_event`, atomfeed `event_records_queue`), a relay publishes to NATS JetStream; consumers record `inbox_events(event_id)`
   for idempotency and keep a dead-letter `failed_events(event_id, error, retries)` (atomfeed client tables).
5. **Charge capture is PUSH with a PULL safety net**: services emit clinical events -> billing creates `charge_items` (Bahmni);
   the cashier screen also lists unbilled sources (Marley `get_healthcare_services_to_invoice`); discharge is gated on financial
   clearance (Marley `validate_inpatient_invoicing`).
6. **One owner per reference catalogue.** Orderables, drugs and price items each have one owning service, published as versioned
   catalogue events (Bahmni's ELIS failures when a test concept uuid is missing).
7. **Database-level invariants** for things the studied systems enforce only in code: no overlapping bed assignments (Postgres
   exclusion constraint), one active slot booking, unique `idempotency_key` on stock and charge rows.
8. **Fix foundations first**: signed tokens (JWT/HMAC) instead of `tok_<base64 JSON>`, hashed passwords, sequence-based numbers instead of
   `APT-2026-<random>`, one source of truth (Neon) instead of dual writes to SQLite.

### 4.2 Services

| Service (port) | Status | Owns |
|---|---|---|
| auth-service (4004) | extend | users, roles, `role_permissions`, signed tokens, break-glass grants |
| patient-service (4001) | extend | patients, `patient_identifiers`, `patient_allergies`, `patient_coverages`, `payers`, `patient_consents`, `patient_merges` |
| appointment-service (4002) | extend | departments, doctors, `practitioner_schedules`, `schedule_exceptions`, appointments, `follow_up_validities` |
| clinical-service (4003) | extend | clinical_encounters, `encounter_diagnoses`, `observations` (vitals, nursing charts), `clinical_notes`, `conditions` |
| audit-service (4005) | keep | audit_records (add new `AuditResourceType`s) |
| adt-service (4006) | NEW | `facility_locations` (wards/rooms/beds tree), `bed_categories`, `admissions`, `bed_assignments`, `bed_status_log` |
| order-service (4007) | NEW | `order_catalog_items`, `order_frequencies`, `order_sets`, `service_requests`, `medication_requests`, `order_alerts` (CDS) |
| lab-service (4008) | NEW | `lab_test_definitions`, `lab_analyte_definitions`, `lab_accessions`, `lab_specimens`, `lab_results`, `lab_reports` |
| imaging-service (4009) | NEW (phase 4) | `imaging_studies`, `imaging_reports`; HL7 v2 ORM^O01 to PACS worklist |
| pharmacy-service (4010) | NEW | `drugs` (formulary), `medication_dispenses`, `medication_administrations` (eMAR) |
| inventory-service (4011) | NEW | `inventory_items`, `stores`, `stock_batches`, `stock_ledger`, `stock_balances`, `indents`, `suppliers`, `purchase_orders`, `goods_receipts` |
| billing-service (4012) | NEW | `billing_items`, `price_lists`, `patient_accounts`, `charge_items`, `invoices`, `invoice_lines`, `payments`, `payment_allocations`, `preauthorizations`, `claims`, `claim_lines` |
| hr-service (4013) | NEW (phase 4) | `staff_members`, `shifts`, `roster_entries`, `leave_requests` |
| ot-service (4014) | NEW (phase 4) | `ot_bookings`, `surgical_safety_checklists` (OT rooms are `facility_locations` of type OT) |

CDS lives inside order-service as rule functions run on `POST /orders` and `POST /orders/check` (drug-allergy against
`patient_allergies`, duplicate active order, drug-drug, dose range) -- GNU Health's `allergy_warning` + `prescription_warning_ack`
shows the acknowledge-and-override pattern. Gateway: add `pathFilter` entries `/api/v1/adt`, `/api/v1/orders`, `/api/v1/lab`,
`/api/v1/imaging`, `/api/v1/pharmacy`, `/api/v1/inventory`, `/api/v1/billing`, `/api/v1/hr`, `/api/v1/ot`.
Every new service gets `outbox_events(id, event_type, subject, payload JSONB, status PENDING|PUBLISHED|FAILED, attempts, created_at,
published_at)` and `inbox_events(event_id PK, subject, processed_at)`.

### 4.3 Postgres tables (key columns; `FK` = same-service foreign key; `ref` = cross-service id, no FK)

Common columns on every table unless noted: `id VARCHAR(64) PK`, `created_at`, `updated_at`, `created_by` (ref users),
`version INTEGER NOT NULL DEFAULT 1` (optimistic locking, cf. OpenEMR `visitChecksum`). Clinical rows also get
`voided_at, voided_by, void_reason` (OpenMRS soft void) instead of DELETE. Business numbers come from a per-service
`number_sequences(name, year, last_value)` row locked `FOR UPDATE` (gapless, needed for invoices) or a Postgres SEQUENCE.

**patient-service (extend)**
- `patient_identifiers(id 'pid_', patient_id FK patients, id_type MRN|NATIONAL_ID|ABHA|PASSPORT|INSURANCE_MEMBER|OTHER, value,
  issuer, valid_from, valid_to, is_primary)`, `UNIQUE(id_type, value)` (OpenMRS PatientIdentifier + IdentifierType uniqueness).
- `patient_allergies(id 'alg_', patient_id FK, category DRUG|FOOD|ENVIRONMENT|BIOLOGIC|OTHER, allergen_code, allergen_system
  (SNOMED|RXNORM|LOCAL), allergen_text, reactions JSONB, severity MILD|MODERATE|SEVERE, criticality LOW|HIGH|UNABLE_TO_ASSESS,
  clinical_status ACTIVE|INACTIVE|RESOLVED, verification_status UNCONFIRMED|CONFIRMED|REFUTED|ENTERED_IN_ERROR, onset_date,
  recorded_by, encounter_id ref)`; add `patients.allergy_status UNKNOWN|NO_KNOWN_ALLERGIES|HAS_ALLERGIES` (OpenMRS `allergyStatus`).
  Keep `patients.allergies` JSONB as a derived display list.
- `payers(id 'pyr_', code UNIQUE, name, payer_type INSURER|TPA|CORPORATE|GOVERNMENT_SCHEME, price_list_id ref billing,
  contract_valid_from, contract_valid_to, active)`.
- `patient_coverages(id 'cov_', patient_id FK, payer_id FK payers, plan_name, policy_number, member_id, subscriber_name,
  subscriber_relationship, priority SMALLINT (1 primary, 2 secondary -- OpenEMR insurance_data.type), valid_from, valid_to,
  status DRAFT|ACTIVE|CANCELLED|ENTERED_IN_ERROR, copay_percent, coverage_limit, verified_at)`. `patients.insurance_provider/
  insurance_policy_number` become a view of the priority-1 coverage.
- `patient_consents(id 'cns_', patient_id FK, consent_type TREATMENT|DATA_SHARING|PROCEDURE|RESEARCH|TELEHEALTH, scope,
  status DRAFT|ACTIVE|REVOKED|EXPIRED, granted_at, expires_at, revoked_at, document_url, witness_id, encounter_id ref)`.
- `patient_merges(id, surviving_patient_id FK, merged_patient_id FK, merged_by, merged_at, reason)` + `patients.status
  ACTIVE|MERGED|INACTIVE` (FHIR Patient.link replaced-by).

**appointment-service (extend)**
- `practitioner_schedules(id 'sch_', doctor_id FK doctors, department_id FK, location_id ref adt, day_of_week SMALLINT, start_time,
  end_time, slot_minutes, max_appointments, appointment_types JSONB, valid_from, valid_to, active)` (Marley Practitioner Schedule time
  slot, Bahmni ServiceWeeklyAvailability); replaces `doctors.available_days/available_slots`.
- `schedule_exceptions(id, doctor_id FK, starts_at, ends_at, reason LEAVE|HOLIDAY|BLOCKED, created_by)` (Bahmni AppointmentUnavailability).
- `appointments` add: `slot_start TIMESTAMPTZ`, `slot_end TIMESTAMPTZ`, `checked_in_at`, `cancel_reason`, `encounter_id` ref,
  `invoice_id` ref, `follow_up_validity_id` FK; partial unique index `UNIQUE(doctor_id, slot_start) WHERE status NOT IN
  ('CANCELLED','NO_SHOW')` to stop double booking.
- `follow_up_validities(id 'fuv_', patient_id ref, doctor_id FK, department_id FK, valid_from, valid_till, max_visits, visits_used,
  source_invoice_id ref, status ACTIVE|EXPIRED|COMPLETED|CANCELLED)` (Marley Fee Validity).

**clinical-service (extend)**
- `clinical_encounters` add: `admission_id` ref, `parent_encounter_id` FK (FHIR partOf), `department_id`, `location_id` ref,
  `started_at`, `ended_at`. Keep `status OPEN|FINALIZED|AMENDED` as the documentation lifecycle.
- `encounter_diagnoses(id 'dx_', encounter_id FK, patient_id, code_system ICD10, code, display, rank SMALLINT (1 = primary),
  certainty PROVISIONAL|CONFIRMED|REFUTED, diagnosis_use ADMITTING|WORKING|DISCHARGE|BILLING, condition_id FK)` (OpenMRS Diagnosis).
- `conditions(id 'cnd_', patient_id, code_system, code, display, clinical_status ACTIVE|RECURRENCE|INACTIVE|RESOLVED,
  verification_status, onset_date, abatement_date, recorded_in_encounter_id FK)` -- longitudinal problem list.
- `observations(id 'obs_', patient_id, encounter_id FK, admission_id ref, category VITAL_SIGNS|NURSING|INTAKE_OUTPUT|SCORE,
  code_system LOINC, code, value_numeric, value_text, unit, interpretation, status PRELIMINARY|FINAL|AMENDED|ENTERED_IN_ERROR,
  effective_at, recorded_by, previous_observation_id FK)` -- IPD charting; `clinical_encounters.vitals` stays as latest snapshot.
- `clinical_notes(id 'note_', encounter_id FK, admission_id ref, note_type PROGRESS|NURSING|CONSULT|OPERATIVE|DISCHARGE_SUMMARY,
  body, status DRAFT|SIGNED|AMENDED|ENTERED_IN_ERROR, author_id, signed_at, amended_from_id FK)`.

**adt-service (new)**
- `facility_locations(id 'loc_', code UNIQUE, name, physical_type SITE|BUILDING|WING|FLOOR|WARD|ROOM|BED|OT|AREA, parent_id FK
  facility_locations, department_id ref, bed_category_id FK, gender_restriction MALE|FEMALE|ANY, is_isolation, grid_row, grid_col
  (Bahmni BedLocationMapping), operational_status UNOCCUPIED|OCCUPIED|RESERVED|HOUSEKEEPING|CLOSED|ISOLATED|CONTAMINATED
  (beds/OT only; v2 0116), status ACTIVE|SUSPENDED|INACTIVE, store_id ref inventory (ward store))`.
- `bed_categories(id 'bct_', code, name, billing_item_code ref billing, billing_unit DAY|HOUR_BLOCK, block_hours)` (Marley service
  unit type `no_of_hours`/`rate`).
- `admissions(id 'adm_', admission_number UNIQUE 'ADM-<yyyy>-<seq>', patient_id ref, encounter_id ref (the IPD encounter),
  request_encounter_id ref (where the doctor decided), admission_type ELECTIVE|EMERGENCY|MATERNITY|DAY_CARE|TRANSFER_IN,
  admit_source, department_id ref, admitting_doctor_id ref, attending_doctor_id ref, requested_bed_category_id FK, status (4.4),
  requested_at, expected_admit_at, admitted_at, expected_discharge_at, discharge_ordered_at, discharged_at, discharge_disposition
  HOME|TRANSFERRED|LAMA|DECEASED|ABSCONDED|REFERRED, discharge_summary_note_id ref, coverage_id ref, preauth_status, billing_account_id
  ref, financial_clearance_at)`.
- `bed_assignments(id 'bas_', admission_id FK, bed_id FK facility_locations, patient_id, status RESERVED|ACTIVE|COMPLETED|CANCELLED
  (FHIR Encounter.location.status), reason ADMIT|TRANSFER|PROCEDURE_HOLD|UPGRADE, start_at, end_at, hold_while_away BOOLEAN
  (Marley `transferred_for_procedure`), created_by)`.
  Invariants: `CREATE EXTENSION btree_gist;` then `EXCLUDE USING gist (bed_id WITH =, tstzrange(start_at, COALESCE(end_at,
  'infinity')) WITH &&) WHERE (status IN ('RESERVED','ACTIVE'))` (no double booking; GNU Health checks this only in code) and
  `UNIQUE(admission_id) WHERE status = 'ACTIVE' AND NOT hold_while_away` (Bahmni rule: one current bed per patient).
  [Neon extension availability for btree_gist to be verified.]
- `bed_status_log(id, bed_id FK, from_status, to_status, reason, admission_id FK, actor_id, at)` (housekeeping turnaround KPI).

**order-service (new)**
- `order_catalog_items(id 'oci_', code UNIQUE, name, category LAB|IMAGING|PROCEDURE|MEDICATION|NURSING|DIET|CONSULT|BLOOD,
  code_system LOINC|SNOMED|LOCAL, external_code, fulfiller_service lab|imaging|pharmacy|clinical|ot, specimen_type, default_priority,
  billing_item_code ref billing, requires_consent, active, catalog_version)`.
- `order_frequencies(code PK e.g. OD|BD|TDS|QID|Q4H|Q6H|Q8H|HS|STAT|PRN|WEEKLY, display, frequency_per_day NUMERIC (OpenMRS
  OrderFrequency), timing JSONB (FHIR Timing: times_of_day for eMAR))`; `order_sets(id, name, department_id, items JSONB)`.
- `service_requests(id 'srq_', order_number UNIQUE 'ORD-<yyyy>-<seq>', requisition_number (orders signed together; FHIR
  requisition), patient_id ref, encounter_id ref, admission_id ref, catalog_item_id FK, category, intent ORDER|ORIGINAL_ORDER|
  REFLEX_ORDER|PLAN, priority ROUTINE|URGENT|ASAP|STAT, status (4.4), fulfiller_status RECEIVED|IN_PROGRESS|ON_HOLD|EXCEPTION|
  DECLINED|COMPLETED (OpenMRS), action NEW|REVISE|DISCONTINUE|RENEW, previous_order_id FK self, orderer_id ref, occurrence_at,
  reason_codes JSONB, clinical_history, body_site, laterality, performer_department_id ref, accession_number, coverage_id ref,
  billing_status UNBILLED|CHARGED|INVOICED|NOT_BILLABLE, signed_at, stopped_at, auto_expire_at, stop_reason)`.
- `medication_requests(id 'mrq_', order_number UNIQUE, requisition_number, patient_id, encounter_id, admission_id, care_setting
  OPD|IPD|ER, drug_id ref pharmacy, drug_display, dose NUMERIC, dose_unit, route, frequency_code FK order_frequencies, as_needed,
  as_needed_reason, duration, duration_unit, quantity, quantity_unit, refills_allowed, dispense_as_written, instructions, status (4.4),
  action, previous_order_id FK self, orderer_id, start_at, stop_at, stop_reason, alerts_acknowledged JSONB)`.
  Rule (OpenMRS `AmbiguousOrderException`): reject a second ACTIVE medication_request for the same drug with overlapping
  [start_at, stop_at] unless flagged parallel.
- `order_alerts(id 'oal_', order_id, order_kind SERVICE|MEDICATION, alert_type DRUG_ALLERGY|DUPLICATE|DRUG_DRUG|DOSE_RANGE|
  PREGNANCY|RENAL, severity INFO|WARNING|CRITICAL, message, overridden BOOLEAN, override_reason, acknowledged_by, acknowledged_at)`.


**lab-service (new)**
- `lab_test_definitions(id 'ltd_', catalog_item_id ref orders, code, name, loinc_code, department LAB_HEMATOLOGY|BIOCHEMISTRY|
  MICROBIOLOGY|SEROLOGY|HISTOPATHOLOGY|..., specimen_type, container_type, volume_ml, tat_minutes, is_panel, requires_verification)`.
- `lab_analyte_definitions(id 'lad_', test_definition_id FK, code, loinc_code, name, value_type NUMERIC|TEXT|CODED|ORGANISM,
  unit, ref_low, ref_high, critical_low, critical_high, sex ANY|MALE|FEMALE, age_min_days, age_max_days, display_order)`
  (OpenMRS ConceptNumeric hi/lowNormal + hi/lowCritical; GNU Health `lab.test.critearea`).
- `lab_accessions(id 'acc_', accession_number UNIQUE 'LAB-<yyyy>-<seq>' (barcode), patient_id ref, encounter_id ref, admission_id
  ref, requisition_number, priority, status REGISTERED|PARTIALLY_COLLECTED|COLLECTED|RECEIVED|IN_PROGRESS|RESULTED|VERIFIED|CANCELLED,
  ordering_doctor_id ref)` -- Bahmni uses the order-encounter uuid as accession; we keep our own number but store
  `requisition_number` so lab and orders join.
- `lab_specimens(id 'spc_', accession_id FK, specimen_type, container_type, barcode UNIQUE, status PENDING_COLLECTION|COLLECTED|
  IN_TRANSIT|RECEIVED|REJECTED|CONSUMED|DISPOSED, rejection_reason, collected_at, collected_by, collection_site_id ref adt,
  received_at, received_by)`; `lab_specimen_orders(specimen_id FK, service_request_id ref, PRIMARY KEY(both))`.
- `lab_results(id 'lrs_', service_request_id ref, specimen_id FK, analyte_definition_id FK, analyte_code, value_numeric,
  value_text, value_coded, unit, ref_range_text, ref_low, ref_high, interpretation N|L|H|LL|HH|A|POS|NEG|R|S|I, status REGISTERED|
  PRELIMINARY|FINAL|AMENDED|CORRECTED|CANCELLED|ENTERED_IN_ERROR, previous_result_id FK self, instrument_code, performed_by,
  performed_at, verified_by, verified_at)` (OpenMRS Obs.previousVersion + Interpretation; GNU Health done_by/validated_by).
- `lab_reports(id 'lrp_', report_number UNIQUE, accession_id FK, service_request_id ref, patient_id, status REGISTERED|PARTIAL|
  PRELIMINARY|FINAL|AMENDED|CORRECTED|CANCELLED|ENTERED_IN_ERROR, conclusion, released_by, released_at, pdf_url)`.
- `critical_result_calls(id, result_id FK, notified_user_id ref, notified_at, read_back_confirmed BOOLEAN, notes)` [design addition,
  not seen in the studied systems; supports JCI/NABH critical-value policy].

**pharmacy-service (new)**
- `drugs(id 'drg_', code UNIQUE, generic_name, brand_name, dosage_form, strength, strength_unit, default_route, atc_code,
  external_code (RxNorm/SNOMED/local), is_controlled, control_schedule, is_high_alert, requires_second_check, min_daily_dose,
  max_daily_dose, dose_unit, inventory_item_id ref inventory, billing_item_code ref billing, allergen_classes JSONB, active)`
  (OpenMRS Drug + OpenEMR drugs).
- `medication_dispenses(id 'dsp_', dispense_number UNIQUE, medication_request_id ref orders, patient_id, encounter_id, admission_id,
  drug_id FK, batch_id ref inventory, quantity, quantity_unit, days_supply, dispense_type FIRST_FILL|REFILL|EMERGENCY|PARTIAL|
  WARD_STOCK (OpenEMR `pharmacy_supply_type`), status PREPARATION|IN_PROGRESS|ON_HOLD|COMPLETED|CANCELLED|DECLINED|STOPPED|
  ENTERED_IN_ERROR, was_substituted, substitution_reason, store_id ref, prepared_by, prepared_at, verified_by, handed_over_at,
  stock_ledger_id ref, idempotency_key UNIQUE)` (OpenMRS MedicationDispense fields).
- `medication_administrations(id 'mad_', medication_request_id ref, admission_id ref, patient_id, drug_id FK, scheduled_at,
  dose_key UNIQUE (`patient_id::drug_id::scheduled_at`, Marley), status SCHEDULED|GIVEN|HELD|REFUSED|NOT_GIVEN|MISSED|CANCELLED|
  ENTERED_IN_ERROR, status_reason, dose_given, dose_unit, route, site, administered_at, administered_by, second_check_by (required
  when drug.requires_second_check), bed_id ref, stock_ledger_id ref, notes)`. Rows are materialised for the next 24h by a scheduler
  from ACTIVE IPD medication_requests + `order_frequencies.timing`; overdue SCHEDULED rows become MISSED after a grace window
  (Marley `schedule_due_medications` / `lapse_missed_doses`). A GIVEN row is never edited; corrections are ENTERED_IN_ERROR + new row.

**inventory-service (new)**
- `inventory_items(id 'itm_', code UNIQUE, name, item_type DRUG|CONSUMABLE|IMPLANT|REAGENT|LINEN|ASSET, base_uom, purchase_uom,
  conversion_factor, batch_tracked, expiry_tracked, reorder_level, max_level, billing_item_code ref, hsn_code, active)`.
- `stores(id 'str_', code, name, store_type CENTRAL|PHARMACY|WARD|OT|LAB|ER, location_id ref adt, department_id ref, parent_store_id FK)`.
- `stock_batches(id 'bat_', item_id FK, batch_no, expiry_date, manufacturer, unit_cost, mrp, UNIQUE(item_id, batch_no))`.
- `stock_ledger(id 'stl_', item_id FK, batch_id FK, store_id FK, movement_type RECEIPT|ISSUE_PATIENT|ISSUE_DEPARTMENT|TRANSFER_OUT|
  TRANSFER_IN|RETURN_FROM_PATIENT|RETURN_TO_SUPPLIER|ADJUSTMENT|EXPIRY_WRITE_OFF, quantity NUMERIC (signed), unit_cost,
  reference_type DISPENSE|ADMINISTRATION|PROCEDURE|GRN|INDENT|ADJUSTMENT, reference_id, patient_id, encounter_id, posted_at,
  posted_by, idempotency_key UNIQUE)` -- append-only (OpenEMR `drug_sales.trans_type` 1-5, ERPNext Stock Entry).
- `stock_balances(item_id, batch_id, store_id, qty_on_hand, qty_reserved, PRIMARY KEY(item_id, batch_id, store_id),
  CHECK (qty_on_hand >= 0))` updated in the same transaction as the ledger row (`SELECT ... FOR UPDATE`).
- `indents(id 'ind_', indent_number, from_store_id FK, to_store_id FK, status DRAFT|SUBMITTED|APPROVED|PARTIALLY_ISSUED|ISSUED|
  CANCELLED, requested_by, approved_by)` + `indent_lines(indent_id FK, item_id FK, qty_requested, qty_issued)` (HospitalRun inv-request).
- `suppliers(id 'sup_', code, name, gstin, contact JSONB, active)`; `purchase_orders(id 'po_', po_number, supplier_id FK, store_id FK,
  status DRAFT|APPROVED|SENT|PARTIALLY_RECEIVED|RECEIVED|CLOSED|CANCELLED, approved_by, expected_at)` + `purchase_order_lines`;
  `goods_receipts(id 'grn_', grn_number, purchase_order_id FK, supplier_id FK, store_id FK, invoice_ref, status DRAFT|POSTED|CANCELLED,
  received_by, posted_at)` + `goods_receipt_lines(grn_id FK, item_id FK, batch_no, expiry_date, qty, free_qty, unit_cost)`; posting a
  GRN writes RECEIPT ledger rows.

**billing-service (new)**
- `billing_items(code PK, name, category REGISTRATION|CONSULTATION|BED|NURSING|LAB|IMAGING|PROCEDURE|SURGERY|DRUG|CONSUMABLE|PACKAGE|
  MISC, revenue_department_id ref, tax_code, sac_hsn_code, unit, active)` -- the single price-item catalogue every other service points
  at through `billing_item_code`.
- `price_lists(id 'prl_', code, name, currency, payer_id ref (null = self-pay tariff), valid_from, valid_to, is_default)` and
  `price_list_items(price_list_id FK, billing_item_code FK, unit_price NUMERIC(12,2), min_qty, valid_from, valid_to,
  PRIMARY KEY(price_list_id, billing_item_code, valid_from))` (OpenEMR `prices` per pricelevel, Marley payor contract price list).
- `patient_accounts(id 'acct_', account_number UNIQUE, patient_id ref, account_type OPD|IPD|ER|DAY_CARE, encounter_id ref,
  admission_id ref, status OPEN|ON_HOLD|FINAL_BILLED|CLOSED|CANCELLED, primary_coverage_id ref, secondary_coverage_id ref,
  price_list_id FK, deposit_balance, credit_limit, opened_at, closed_at)` (FHIR Account; one per visit/stay so all charges roll up).
- `charge_items(id 'chg_', account_id FK, patient_id, billing_item_code FK, description, quantity NUMERIC, unit_price,
  price_override, override_reason, discount_amount, discount_approved_by, tax_amount, net_amount, service_at, ordering_doctor_id,
  performer_id, department_id, source_type APPOINTMENT|SERVICE_REQUEST|LAB_RESULT|IMAGING_STUDY|MEDICATION_DISPENSE|
  MEDICATION_ADMINISTRATION|BED_DAY|PROCEDURE|MANUAL, source_id, source_event_id UNIQUE (idempotency), status PLANNED|BILLABLE|
  NOT_BILLABLE|ABORTED|BILLED|ENTERED_IN_ERROR (FHIR ChargeItem), coverage_id ref, payer_amount, patient_amount, invoice_id FK,
  entered_by, entered_at)`; partial unique index on (source_type, source_id, billing_item_code) for rows whose status is not
  ABORTED or ENTERED_IN_ERROR (Bahmni `_order_already_processed`, Marley `invoiced` flag).
- `invoices(id 'inv_', invoice_number UNIQUE 'INV-<fy>-<gapless seq>', account_id FK, patient_id, bill_to SELF|PAYER|CORPORATE,
  payer_id ref, invoice_type INTERIM|FINAL|CREDIT_NOTE, credit_note_of_id FK self, status DRAFT|ISSUED|PARTIALLY_PAID|PAID|CANCELLED|
  ENTERED_IN_ERROR, total_gross, total_discount, total_tax, total_net, amount_paid, balance_due, issued_at, issued_by,
  cancelled_reason)` + `invoice_lines(id, invoice_id FK, charge_item_id FK UNIQUE, sequence, description, qty, unit_price,
  discount, tax, amount, price_components JSONB)` (FHIR Invoice.lineItem.priceComponent).
- `payments(id 'pay_', receipt_number UNIQUE, patient_id, account_id FK, method CASH|CARD|UPI|BANK_TRANSFER|CHEQUE|INSURANCE|
  DEPOSIT_ADJUSTMENT, amount, payer_id ref, reference, received_at, received_by, status POSTED|REVERSED, reversal_of_id FK self,
  is_deposit BOOLEAN)` + `payment_allocations(payment_id FK, invoice_id FK, amount, PRIMARY KEY(payment_id, invoice_id))`
  (OpenEMR `ar_session` = payment batch, `ar_activity` = line postings).
- `preauthorizations(id 'pa_', admission_id ref, account_id FK, coverage_id ref, payer_id ref, requested_amount, approved_amount,
  status DRAFT|SUBMITTED|QUERY|APPROVED|PARTIALLY_APPROVED|REJECTED|EXPIRED|CANCELLED, payer_reference, submitted_at, decided_at,
  documents JSONB)` (FHIR Claim use=preauthorization; Marley Inpatient Record `approval_status`).
- `claims(id 'clm_', claim_number UNIQUE, account_id FK, invoice_id FK, coverage_id ref, payer_id ref, use CLAIM|PREAUTH_ENHANCEMENT,
  submission_version SMALLINT (OpenEMR `claims.version`), status DRAFT|SUBMITTED|ACKNOWLEDGED|QUERY_RAISED|APPROVED|PARTIALLY_APPROVED|
  REJECTED|SETTLED|CLOSED|CANCELLED, claimed_amount, approved_amount, disallowed_amount, settled_amount, tds_amount, payer_claim_ref,
  denial_codes JSONB, submitted_at, settled_at)` + `claim_lines(claim_id FK, charge_item_id FK, claimed_amount, approved_amount,
  denial_code)`.

**Phase-4 sketches.** `imaging_studies(id 'img_', service_request_id ref, accession_number, modality CR|CT|MR|US|XA|MG,
study_instance_uid UNIQUE, scheduled_at, performed_at, status SCHEDULED|ARRIVED|IN_PROGRESS|COMPLETED|CANCELLED, pacs_viewer_url)`,
`imaging_reports(id, study_id FK, status PRELIMINARY|FINAL|AMENDED, findings, impression, radiologist_id, signed_at)`;
`ot_bookings(id 'otb_', admission_id ref, patient_id, ot_room_id ref adt, procedure_codes JSONB, surgeon_id, anaesthetist_id,
scheduled_start, scheduled_end, actual_start, actual_end, urgency ELECTIVE|URGENT|EMERGENCY, status DRAFT|CONFIRMED|IN_PROGRESS|DONE|
SIGNED|CANCELLED (GNU Health surgery))`, `surgical_safety_checklists(ot_booking_id FK, phase SIGN_IN|TIME_OUT|SIGN_OUT, items JSONB,
completed_by, completed_at)`; `staff_members(id, user_id ref, employee_code, designation, department_id, registration_no)`,
`shifts(code, start_time, end_time)`, `roster_entries(id, staff_member_id FK, location_id ref, shift_code FK, roster_date,
status PLANNED|PUBLISHED|SWAPPED|ABSENT|WORKED)`, `leave_requests(id, staff_member_id FK, from_date, to_date, leave_type, status)`.

### 4.4 State machines

Each aggregate gets a `transitions` map in its service; an illegal move returns HTTP 409 `INVALID_TRANSITION` and is audited.

- **Appointment** (extend the `AppointmentStatus` contract additively with `CHECKED_IN`): SCHEDULED -> CONFIRMED | CANCELLED;
  CONFIRMED -> CHECKED_IN | CANCELLED | NO_SHOW; CHECKED_IN -> IN_PROGRESS (encounter opened; cf. OpenEMR check-in opens the encounter)
  | CANCELLED; IN_PROGRESS -> COMPLETED. Undo: CANCELLED or NO_SHOW -> SCHEDULED by RECEPTIONIST or higher (Bahmni allows a return to
  Scheduled). A nightly job marks past SCHEDULED/CONFIRMED rows NO_SHOW (Marley `update_appointment_status`).
- **Encounter documentation** (unchanged): OPEN -> FINALIZED -> AMENDED (-> AMENDED). FHIR Encounter.status is derived from the
  appointment or admission (OPEN = in-progress, FINALIZED = finished).
- **Admission**: REQUESTED -> BED_RESERVED | ADMITTED | CANCELLED; BED_RESERVED -> ADMITTED | CANCELLED (reservation released);
  ADMITTED <-> ON_LEAVE; ADMITTED -> DISCHARGE_ORDERED -> DISCHARGED; DISCHARGE_ORDERED -> ADMITTED (discharge revoked).
  Guards on DISCHARGED (after Marley `discharge_patient`): no ACTIVE inpatient medication_requests without a stop, no IN_PROGRESS
  service_requests, billing `financial_clearance_at` set (or a reasoned override by CMO/ADMIN), discharge summary SIGNED.
  Transfers do not change admission status; they close one `bed_assignment` and open another.
- **Bed `operational_status`**: UNOCCUPIED -> RESERVED (reservation) -> OCCUPIED (admit) -> HOUSEKEEPING (discharge or transfer out;
  GNU Health `to_clean`) -> UNOCCUPIED (cleaning done). Any state -> CLOSED | ISOLATED | CONTAMINATED (maintenance, infection) ->
  HOUSEKEEPING -> UNOCCUPIED. RESERVED -> UNOCCUPIED on cancel.
- **Service request**, orderer axis: DRAFT -> ACTIVE (signed) -> COMPLETED | REVOKED (discontinued) | ON_HOLD -> ACTIVE;
  -> ENTERED_IN_ERROR only before fulfilment starts. Revise = a new ACTIVE row; the old row -> REVOKED with `stopped_at`.
  Fulfiller axis (`fulfiller_status`, written only by lab/imaging/pharmacy): RECEIVED -> IN_PROGRESS -> COMPLETED | EXCEPTION |
  ON_HOLD | DECLINED. The order becomes COMPLETED when the fulfiller reports COMPLETED and its report is FINAL.
- **Lab specimen**: PENDING_COLLECTION -> COLLECTED -> IN_TRANSIT -> RECEIVED -> CONSUMED -> DISPOSED; COLLECTED or RECEIVED ->
  REJECTED (with reason; recollection creates a new specimen). **Lab result**: REGISTERED -> PRELIMINARY -> FINAL (verified by a second
  user, as GNU Health done/validated) -> AMENDED or CORRECTED (new row with `previous_result_id`); -> ENTERED_IN_ERROR.
  **Lab report** uses the FHIR DiagnosticReport set; FINAL requires every result FINAL; release publishes to the patient portal.
- **Medication request**: DRAFT -> ACTIVE -> COMPLETED (course over) | STOPPED (discontinued) | ON_HOLD -> ACTIVE |
  CANCELLED (before any dispense) | ENTERED_IN_ERROR.
- **Dispense**: PREPARATION -> IN_PROGRESS -> COMPLETED (stock issued) | ON_HOLD | DECLINED (pharmacist refuses) | CANCELLED.
  A return after COMPLETED writes a RETURN ledger row and a negative charge; the dispense row is never edited.
- **Administration (eMAR)**: SCHEDULED -> GIVEN | HELD | REFUSED | NOT_GIVEN | MISSED (timeout) | CANCELLED (order stopped);
  GIVEN -> ENTERED_IN_ERROR plus a new row.
- **Charge item**: PLANNED (order signed, price estimated) -> BILLABLE (service performed) -> BILLED (on an issued invoice);
  PLANNED or BILLABLE -> ABORTED (order revoked before it was performed) | NOT_BILLABLE (package or covered). BILLED changes only
  through a credit note.
- **Invoice**: DRAFT -> ISSUED -> PARTIALLY_PAID -> PAID; ISSUED or PARTIALLY_PAID -> CANCELLED only by issuing a CREDIT_NOTE invoice;
  numbers are gapless and never reused. **Account**: OPEN <-> ON_HOLD; OPEN -> FINAL_BILLED -> CLOSED (balance 0).
- **Pre-auth and claim**: DRAFT -> SUBMITTED -> (QUERY <-> SUBMITTED) -> APPROVED | PARTIALLY_APPROVED | REJECTED -> SETTLED -> CLOSED;
  a rejected claim resubmitted gets `submission_version + 1` (OpenEMR versioned `claims`).
- **Indent, PO, GRN**: as in their status columns; a POSTED GRN is reversed only by a RETURN_TO_SUPPLIER movement.

### 4.5 Domain events (subjects in our `EventSubjects` style; payload = `BaseDomainEvent<T>`)

Payloads carry ids, the new status, `aggregateVersion`, and enough denormalised data for consumers to act without a callback
(unlike atomfeed's thin URI events, which force consumers to call the producer). Breaking changes bump `BaseDomainEvent.version`.

| Subject | Producer | Main consumers |
|---|---|---|
| `hospital.patient.merged`, `hospital.patient.allergy_recorded`, `hospital.patient.coverage_updated`, `hospital.patient.consent_changed` | patient | orders (CDS), billing, all (merge) |
| `hospital.appointment.checked_in`, `hospital.appointment.completed`, `hospital.appointment.no_show` (existing: `.created`, `.cancelled`) | appointment | clinical (open encounter), billing (consultation charge) |
| `hospital.admission.created` (requested), `hospital.admission.bed_reserved`, `hospital.admission.admitted`, `hospital.admission.transferred`, `hospital.admission.leave_started`, `hospital.admission.leave_ended`, `hospital.admission.discharge_ordered`, `hospital.admission.discharged`, `hospital.admission.cancelled` | adt | billing (open IPD account, bed-day accrual, final bill), pharmacy (eMAR scope, ward store), clinical, notifications |
| `hospital.bed.status_changed` | adt | bed board, housekeeping |
| `hospital.order.created`, `hospital.order.revised`, `hospital.order.discontinued`, `hospital.order.held`, `hospital.order.completed` (payload `category` LAB/IMAGING/PROCEDURE/MEDICATION) | orders | lab, imaging, pharmacy (worklists), billing (PLANNED charge or ABORT) |
| `hospital.order.fulfiller_status_changed` | lab/imaging/pharmacy | orders |
| `hospital.lab.specimen_collected`, `hospital.lab.specimen_received`, `hospital.lab.specimen_rejected`, `hospital.lab.result_verified`, `hospital.lab.report_released`, `hospital.lab.critical_result` | lab | orders, clinical, billing (BILLABLE), notifications |
| `hospital.imaging.study_scheduled`, `hospital.imaging.study_completed`, `hospital.imaging.report_signed` | imaging | orders, billing, clinical |
| `hospital.pharmacy.dispense_completed`, `hospital.pharmacy.dispense_returned`, `hospital.mar.dose_administered`, `hospital.mar.dose_missed` | pharmacy | billing, inventory (if not synchronous), clinical, nursing alerts |
| `hospital.inventory.stock_issued`, `hospital.inventory.stock_received`, `hospital.inventory.low_stock`, `hospital.inventory.batch_expiring` | inventory | pharmacy, procurement |
| `hospital.billing.charge_created`, `hospital.billing.charge_cancelled`, `hospital.billing.invoice_issued`, `hospital.billing.payment_received`, `hospital.billing.account_cleared`, `hospital.billing.preauth_decided`, `hospital.billing.claim_submitted`, `hospital.billing.claim_settled` | billing | adt (discharge gate), portal, finance export |
| `hospital.catalog.item_updated` | orders / pharmacy / billing (each for its own catalogue) | lab, billing, inventory |

Transport: NATS JetStream stream `HOSPITAL` on `hospital.>` with one durable consumer per service (the current code uses core NATS
`nc.subscribe`, which drops messages when a consumer is down). Synchronous calls stay only where the user needs an immediate answer:
stock reservation on dispense (`POST /api/v1/inventory/stock-movements` with an `idempotency_key`), and slot or bed availability.

### 4.6 REST endpoints (all under the gateway; state changes are POST "commands", not PATCH of `status`)

- **patient** (extend `/api/v1/patients`): `GET|POST /:id/identifiers`; `GET|POST /:id/allergies`, `PATCH /:id/allergies/:allergyId`;
  `GET|POST /:id/coverages`, `POST /:id/coverages/:covId/verify`; `GET|POST /:id/consents`, `POST /:id/consents/:cid/revoke`;
  `POST /merge {survivingPatientId, mergedPatientId, reason}`; `GET /payers`.
- **appointment** (extend `/api/v1/appointments`): `GET|POST /schedules`, `POST /schedules/:id/exceptions`;
  `GET /slots?doctorId=&date=` (computed from schedules minus bookings minus exceptions); `POST /:id/confirm`, `/:id/check-in`,
  `/:id/start`, `/:id/complete`, `/:id/cancel {reason}`, `/:id/no-show`, `/:id/reschedule {slotStart}`; keep
  `PATCH /:id/status` for compatibility, routed through the transition map. `GET /follow-up-validity?patientId=&doctorId=`.
- **clinical** (extend `/api/v1/clinical`): `GET|POST /encounters/:id/observations`, `GET /patients/:patientId/observations?code=&from=`
  (vitals charts), `GET|POST /encounters/:id/diagnoses`, `GET|POST /encounters/:id/notes`, `POST /notes/:id/sign`,
  `GET|POST /patients/:patientId/conditions`.
- **adt** `/api/v1/adt`: `GET /locations?type=WARD&parentId=`, `POST /locations`; `GET /bed-board?wardId=` (grid with status, patient,
  expected discharge); `PATCH /beds/:id/operational-status {status, reason}` (housekeeping); `POST /admissions` (request);
  `GET /admissions?status=&wardId=&doctorId=`; `GET /admissions/:id`; `POST /admissions/:id/reserve-bed {bedId}`;
  `POST /admissions/:id/admit {bedId, admittedAt}`; `POST /admissions/:id/transfer {toBedId, reason, holdCurrentBed}`;
  `POST /admissions/:id/leave`, `/return`; `POST /admissions/:id/order-discharge {expectedAt, disposition}`;
  `POST /admissions/:id/revoke-discharge`; `POST /admissions/:id/discharge {disposition, overrideReason?}` (runs the guards);
  `POST /admissions/:id/cancel {reason}`; `GET /admissions/:id/bed-history`; `GET /census?date=` (midnight census).
- **orders** `/api/v1/orders`: `GET /catalog?search=&category=`; `GET /order-sets`; `POST /check` (CDS dry run returns
  `order_alerts`); `POST /` (order basket: `{encounterId, admissionId?, serviceRequests[], medicationRequests[], acknowledgedAlerts[]}`,
  one `requisition_number`); `GET /?patientId=&encounterId=&admissionId=&status=&category=`; `GET /:id`;
  `POST /:id/revise {changes}`; `POST /:id/discontinue {reason}`; `POST /:id/hold`, `/:id/resume`; `POST /:id/enter-in-error`;
  `POST /:id/fulfiller-status {status, comment, accessionNumber}` (fulfiller roles only).
- **lab** `/api/v1/lab`: `GET /worklist?status=&department=&priority=`; `POST /accessions {serviceRequestIds[]}` (prints barcodes);
  `POST /specimens/:id/collect`, `/receive`, `/reject {reason}`; `POST /results` (batch entry, also the analyzer/LIS interface entry
  point); `POST /results/:id/verify`; `POST /results/:id/amend {value, reason}`; `GET /reports/:id`, `POST /reports/:id/release`;
  `GET /patients/:patientId/results?loinc=&from=` (cumulative view); `GET|POST /test-definitions`.
- **pharmacy** `/api/v1/pharmacy`: `GET /drugs?search=`; `GET /queue?store=&careSetting=` (ACTIVE medication_requests awaiting
  dispense); `POST /dispenses {medicationRequestId, batchId, quantity, idempotencyKey}`; `POST /dispenses/:id/complete`, `/hold`,
  `/decline {reason}`, `/cancel`, `/return {quantity, reason}`; `GET /mar?admissionId=&from=&to=` (round view);
  `POST /mar/:id/administer {doseGiven, route, site, secondCheckBy?}`; `POST /mar/:id/hold|refuse|not-given {reason}`;
  `POST /mar/:id/enter-in-error {reason}`.
- **inventory** `/api/v1/inventory`: `GET|POST /items`, `GET|POST /stores`; `GET /stock?storeId=&itemId=&expiringBefore=`;
  `POST /stock-movements {type, itemId, batchId, storeId, quantity, reference, idempotencyKey}`; `POST /indents`,
  `POST /indents/:id/submit|approve|issue|cancel`; `GET|POST /suppliers`; `POST /purchase-orders`, `POST /purchase-orders/:id/approve|send`;
  `POST /goods-receipts`, `POST /goods-receipts/:id/post`; `GET /alerts/low-stock`, `GET /alerts/expiring`.
- **billing** `/api/v1/billing`: `GET|POST /items`, `GET|POST /price-lists`, `GET /price?itemCode=&patientId=&date=`;
  `GET /accounts?patientId=&status=`, `GET /accounts/:id` (charges, deposits, balance), `POST /accounts/:id/hold|release`;
  `GET /patients/:patientId/unbilled` (Marley-style pull list of BILLABLE charges and un-charged sources); `POST /charges` (manual,
  permission `create:charge`), `POST /charges/:id/cancel {reason}`, `POST /charges/:id/discount {amount, reason}` (approval permission);
  `POST /invoices {accountId, chargeIds?, type}`, `POST /invoices/:id/issue`, `POST /invoices/:id/credit-note {lines, reason}`,
  `GET /invoices/:id/pdf`; `POST /payments {accountId, method, amount, allocations[]}`, `POST /payments/:id/reverse`;
  `POST /accounts/:id/deposits`; `GET /accounts/:id/clearance` (discharge gate); `POST /preauthorizations`,
  `POST /preauthorizations/:id/submit|record-decision`; `POST /claims {accountId}`, `POST /claims/:id/submit|record-query|settle|resubmit`.
- **fhir facade** (later, read-only first): `GET /api/v1/fhir/{Patient|Encounter|Appointment|Slot|ServiceRequest|MedicationRequest|
  MedicationDispense|MedicationAdministration|Observation|DiagnosticReport|Specimen|Location|ChargeItem|Invoice|Coverage|Claim}`
  implemented as translators per resource, as OpenMRS FHIR2 does (`api/translators/*`), never as the internal storage model.

### 4.7 FHIR R4 mapping

| ProHealth table | FHIR resource | Status mapping / notes |
|---|---|---|
| patients + patient_identifiers | Patient | identifier[] from identifiers (MRN type `MR`); `status MERGED` -> `link.type replaced-by`; active = status ACTIVE |
| patient_allergies | AllergyIntolerance | clinical_status / verification_status 1:1 (lower-case, hyphenated); category, criticality 1:1 |
| patient_coverages, payers | Coverage, Organization | DRAFT/ACTIVE/CANCELLED/ENTERED_IN_ERROR 1:1; `priority` -> `order`; payer -> `payor` |
| patient_consents | Consent | ACTIVE -> active, REVOKED -> inactive, DRAFT -> draft |
| practitioner_schedules / computed slots | Schedule / Slot | free/busy computed; exceptions -> busy-unavailable |
| appointments | Appointment | SCHEDULED/CONFIRMED -> booked, CHECKED_IN -> checked-in, IN_PROGRESS -> arrived, COMPLETED -> fulfilled, CANCELLED -> cancelled, NO_SHOW -> noshow |
| clinical_encounters | Encounter | OPEN -> in-progress, FINALIZED/AMENDED -> finished; type OPD -> class AMB, IPD -> IMP, EMERGENCY -> EMER; `parent_encounter_id` -> partOf; `admission_id` -> the IPD Encounter |
| admissions | Encounter (class IMP) + hospitalization | REQUESTED/BED_RESERVED -> planned, ADMITTED/DISCHARGE_ORDERED -> in-progress, ON_LEAVE -> onleave, DISCHARGED -> finished, CANCELLED -> cancelled; discharge_disposition -> hospitalization.dischargeDisposition; admit_source -> admitSource |
| bed_assignments | Encounter.location[] | RESERVED -> reserved, ACTIVE -> active, COMPLETED -> completed; period = start_at..end_at |
| facility_locations | Location | physical_type -> physicalType (si, bu, wi, lvl, wa, ro, bd); operational_status -> operationalStatus v2 0116 (UNOCCUPIED U, OCCUPIED O, HOUSEKEEPING H, CLOSED C, ISOLATED I, CONTAMINATED K; RESERVED has no 0116 code -> use U plus an extension) [mapping is my design]; parent_id -> partOf |
| encounter_diagnoses, conditions | Condition (+ Encounter.diagnosis) | rank -> Encounter.diagnosis.rank; diagnosis_use -> role |
| observations, lab_results | Observation | status 1:1 (lower-case); interpretation -> v2 0078 codes; previous_result_id -> derivedFrom (or replaced) |
| lab_reports | DiagnosticReport | status 1:1; result[] = lab_results; basedOn = service_requests |
| lab_specimens | Specimen | RECEIVED/COLLECTED -> available, REJECTED -> unsatisfactory, CONSUMED/DISPOSED -> unavailable; accession_number -> accessionIdentifier |
| service_requests | ServiceRequest (+ Task for fulfiller_status) | status 1:1 (REVOKED -> revoked); `fulfiller_status` -> Task.status (RECEIVED -> received, IN_PROGRESS -> in-progress, COMPLETED -> completed, DECLINED -> rejected, ON_HOLD -> on-hold, EXCEPTION -> failed); previous_order_id -> replaces; requisition_number -> requisition |
| medication_requests | MedicationRequest | status 1:1 (STOPPED -> stopped, CANCELLED -> cancelled); frequency -> dosageInstruction.timing; refills -> dispenseRequest.numberOfRepeatsAllowed; previous_order_id -> priorPrescription |
| medication_dispenses | MedicationDispense | status 1:1 (PREPARATION -> preparation ...); dispense_type -> type (ActPharmacySupplyType) |
| medication_administrations | MedicationAdministration | GIVEN -> completed, HELD -> on-hold, REFUSED/NOT_GIVEN/MISSED -> not-done (+ statusReason), CANCELLED -> stopped, SCHEDULED -> no resource yet (or in-progress) |
| charge_items | ChargeItem | status 1:1; source_type/source_id -> service[] reference; account_id -> account |
| invoices, invoice_lines | Invoice | DRAFT -> draft, ISSUED/PARTIALLY_PAID -> issued, PAID -> balanced, CANCELLED -> cancelled; lines -> lineItem with priceComponent |
| patient_accounts | Account | OPEN -> active, CLOSED -> inactive |
| preauthorizations, claims | Claim (use preauthorization / claim) + ClaimResponse | DRAFT -> draft, SUBMITTED.. -> active, CANCELLED -> cancelled; adjudication outcome -> ClaimResponse |
| imaging_studies / imaging_reports | ImagingStudy / DiagnosticReport | study_instance_uid -> ImagingStudy.identifier |
| ot_bookings | Procedure (+ Appointment for the slot) | DONE/SIGNED -> completed, IN_PROGRESS -> in-progress, CANCELLED -> not-done |

### 4.8 Contract (`packages/contracts`) and permission changes

Additive changes only, so existing services and the ERP UI keep compiling:
- `AppointmentStatus` add `'CHECKED_IN'`. `ClinicalEncounter` add optional `admissionId`, `parentEncounterId`, `diagnoses?:
  EncounterDiagnosis[]`; mark `prescriptions`/`labOrders` as deprecated snapshots filled from order-service.
- `AuditResourceType` add `'ADMISSION' | 'BED' | 'SERVICE_REQUEST' | 'MEDICATION_REQUEST' | 'SPECIMEN' | 'DIAGNOSTIC_REPORT' |
  'MEDICATION_DISPENSE' | 'MEDICATION_ADMINISTRATION' | 'STOCK_MOVEMENT' | 'CHARGE_ITEM' | 'PAYMENT' | 'CLAIM' | 'COVERAGE' | 'CONSENT'`
  (`'PRESCRIPTION'`, `'LAB_RESULT'`, `'BILLING_INVOICE'` already exist).
- New interfaces per domain (`Admission`, `BedAssignment`, `FacilityLocation`, `ServiceRequest`, `MedicationRequest`, `LabSpecimen`,
  `LabResult`, `LabReport`, `MedicationDispense`, `MedicationAdministration`, `StockMovement`, `ChargeItem`, `Invoice`, `Payment`,
  `PatientCoverage`, `Claim`) and typed events (`AdmissionAdmittedEvent = BaseDomainEvent<{admissionId, admissionNumber, patientId,
  bedId, wardId, attendingDoctorId, admittedAt}>`, etc.), plus the new constants in `EventSubjects`.
- `UserRole` add `'CASHIER' | 'BILLING_OFFICER' | 'INSURANCE_COORDINATOR' | 'STORE_KEEPER' | 'RADIOLOGY_TECHNICIAN' | 'WARD_CLERK' |
  'HR_MANAGER'` (HospitalRun v1 had Cashier, Finance, Inventory Manager, Imaging Technician, Patient Administration).
- Permission model: keep roles, add `role_permissions(role, permission)` with `verb:resource` strings (HospitalRun v2
  `Permissions.ts`; OpenMRS privileges) where lifecycle verbs are first-class: `create:service_request`, `discontinue:service_request`,
  `verify:lab_result`, `release:lab_report`, `dispense:medication`, `administer:medication`, `admit:patient`, `discharge:patient`,
  `issue:invoice`, `discount:charge` (OpenEMR `acct/disc`), `cancel:invoice`, `adjust:stock`, `approve:purchase_order`. Each permission
  has a scope `own | department | all` (OpenEMR "my encounters" vs "any encounters"; HospitalRun-style capability checks enforced
  server-side, not only in the SPA). Maker-checker pairs (Frappe submit vs approve; GNU Health done vs validated): result entered and
  verified by different users; discount requested vs approved; PO created vs approved. Break-glass stays in audit with
  `clinicalReason`. Tokens: signed JWT with `role`, `permissions`, `departmentId`, short expiry; services must verify the signature
  instead of trusting `x-user-*` headers from the network.

### 4.9 Phasing

1. **Foundations** (blocks everything): signed JWT + password hashing; sequence-based numbers; outbox/inbox + JetStream; drop SQLite
   dual-write for new services; `role_permissions`; patient identifiers/allergies/coverages; appointment schedules, slot uniqueness and
   transition map.
2. **Orders + Billing core**: order-service (catalogue, service/medication requests, revise/discontinue, CDS allergy + duplicate
   checks); billing-service (billing items, price lists, accounts, charge capture from `hospital.appointment.checked_in` and
   `hospital.order.*`, invoices, payments, unbilled pull list).
3. **ADT + Lab**: adt-service with bed board, reservations, transfers, housekeeping and discharge gate; bed-day accrual job in
   billing; lab-service with accessions, specimens, results, verification, reports and critical-value calls.
4. **Pharmacy + Inventory**: formulary, dispense with stock ledger, ward stores, indents, purchase orders and GRN, eMAR materialiser.
5. **Imaging, OT, HR rostering, claims depth** (pre-auth, claim submission, settlement), FHIR read facade, HL7 v2 interfaces (lab
   analyzers ORU, PACS ORM/OMG as Bahmni `pacs-integration`).

## 5. Pitfalls and lessons learned

Each item cites what was seen in code (section 2) and says what ProHealth should do. "[inferred]" marks interpretation.

1. **Derived status loses information.** OpenMRS has no stored encounter or visit status, so the FHIR2 `EncounterTranslatorImpl`
   always emits `status = UNKNOWN`, and order status is recomputed from dates (`MedicationRequestStatusTranslatorImpl`). Store explicit
   statuses with a transition map, and add timestamps alongside them.
2. **Append-only orders are right but need rules.** OpenMRS forbids editing a saved order ("Order.cannot.edit.existing") and checks
   revise compatibility (same orderable, type, care setting) and duplicate overlapping drug orders (`AmbiguousOrderException`,
   `PARALLEL_ORDERS`). Copy the rules, not only the `previous_order_id` column. Without them you get two active orders for one drug.
3. **Reference data drift breaks integrations.** Bahmni's ELIS worker throws "Concept for lab test ... not found in openmrs" and the
   event lands in `failed_events`; the Odoo side needs `order.type.shop.map` and `syncable.units.mapping` to be configured, and
   `_get_shop_and_location_id` silently falls back to the first shop ("Unable to find OrderType-Shop mapping ... So using first shop
   entry"). Use one owner per catalogue, versioned `hospital.catalog.item_updated` events, startup validation, and fail loudly.
4. **Charge reversal after billing.** Bahmni unlinks a quotation line on DISCONTINUE only "if the sale order is still draft"; once
   confirmed, a discontinued order stays billed [inferred: no credit path in the code read]. OpenEMR soft-deletes a charge with
   `billing.activity = 0`. Model reversals as credit notes and ABORTED charge items, never deletes.
5. **Pull-only billing finds missed charges too late.** Marley gathers billable docs when the cashier opens the invoice, and needs a
   setting `allow_discharge_despite_unbilled_services` to stop discharge being blocked. Use push (events create charge items when work
   happens) plus the pull list as a reconciliation view, plus the discharge clearance gate.
6. **Manual coding leaks revenue.** OpenEMR depends on a person filling the Fee Sheet; `visitChecksum()` exists because two people edit
   the same visit at once. Auto-capture from orders and dispenses; keep a manual-charge path with permission and a reason.
7. **Thin events couple consumers to producers.** Atomfeed events carry only a URI and every consumer calls back
   (`httpClient.get(openElisUri + event.getContent())`); when the producer is down, the consumer fails. Our `BaseDomainEvent` already
   carries `data`: keep payloads self-sufficient and versioned. Keep the atomfeed lessons on cursors (`markers`) and dead letters with
   retries (`failed_events.retries`, `failed_event_retry_log`). Our current core-NATS subscription loses events when a service is down.
8. **No outbox = lost or phantom events.** Bahmni bed advice publishes inside `AtomFeedSpringTransactionManager`; OpenMRS 2.9 added
   `outbox_event`. Our services publish after the DB write with no outbox. Add an outbox before adding billing, which depends on events.
9. **Bed state is under-modelled in most systems.** Bahmni `BedStatus` is AVAILABLE/OCCUPIED only and allows several patients in one
   bed (unassign keeps OCCUPIED if other assignments exist); Marley is Vacant/Occupied. GNU Health alone has `reserved` and `to_clean`
   and a date-overlap check, done in code. Use v2 0116 states, a housekeeping step, and a DB exclusion constraint. Decide bed sharing
   (mother and baby) explicitly, as a flag on the assignment.
10. **Transfer for a procedure is a special case.** Marley keeps the ward bed with `transferred_for_procedure` so an OT trip does not
    free it. Without this, beds get reassigned while the patient is in theatre. Our `hold_while_away` covers it.
11. **Magic numbers and free-form lists.** OpenEMR claim status 1/2/6/7, `pc_apptstatus` symbols (`@`, `~`, `>`), and `list_options`
    statuses without transitions make reporting and integrations fragile. Use named enums in contracts with CHECK constraints; keep
    configurable lists only for display labels and colours.
12. **Missing referential integrity.** OpenEMR joins on `(pid, encounter)` integers without FKs; OpenMRS and Marley use real FKs.
    Inside a service, use FKs; across services, use ids plus reconciliation jobs (e.g. charges whose source order no longer exists).
13. **Offline-first with last-writer-wins is unsafe for orders and medications.** HospitalRun's `conflict-res.js` merges CouchDB
    conflicts field by field using `modifiedFields` timestamps, so a stale device can silently overwrite a newer dose or result.
    If ProHealth needs offline wards, restrict it to read caches and append-only captures (vitals, MAR entries keyed by `dose_key`)
    that the server validates.
14. **Big-bang rewrites stall.** HospitalRun v2 (React, PouchDB relational, then an `add-graphql` server branch) never reached v1
    parity and all repos are archived [inferred from repo state]. Extend ProHealth incrementally, service by service, behind the gateway.
15. **Permissions at the wrong layer.** OpenMRS checks privileges on service methods and its core has "no built-in notion of
    per-instance access restriction"; HospitalRun v2 checks capabilities in the SPA. OpenEMR's ACO lattice (view < addonly < wsome < write,
    my vs any, sensitivity) and Frappe's submit/cancel/amend split show useful granularity. ProHealth's gateway trusts an unsigned base64
    token and forwards `x-user-role` headers, so any client can claim ADMIN. Fix this before handling money or controlled drugs.
16. **Idempotency on clinical side effects.** Marley's `dose_key` (`patient::drug::scheduled_time`) and Bahmni's
    `_order_already_processed(external_order_id)` exist because events and schedulers repeat. Every consumer that writes stock, charges
    or MAR rows needs a unique idempotency key.
17. **Immutability of performed events.** Marley: "Correct a mistake with a Stock Entry, not by editing this"; OpenMRS voids and
    re-creates obs (`previousVersion`); GNU Health signs results and surgeries. Make dispensed, administered, verified and invoiced rows
    immutable, with ENTERED_IN_ERROR plus a replacement row.
18. **Separate products, separate truths.** Bahmni runs four databases (OpenMRS, OpenELIS, Odoo, PACS) with separate users and
    separate configuration of the same concepts. The odoo-connect setup docs found in search give commands for OpenERP 7 / Odoo 10,
    while `bahmni-odoo-modules` uses Odoo 16-era APIs (`stock.lot`, `account_type`) [version inferred from those names]. Owning billing, stock and lab inside one platform with shared contracts avoids this.
    Our shared single Neon schema has the opposite risk: services can read each other's tables. Give each new service its own Postgres
    schema and grant only its own role.
19. **Bed-day billing rules vary.** Marley bills occupancy by service-unit-type `no_of_hours` and `minimum_billable_qty` with a
    daily accrual job; GNU Health treats the bed as a product. Decide the tariff rule up front (midnight census vs 24-hour blocks vs hourly
    for ICU) and store it on `bed_categories`.
20. **Our own code today**: year hard-coded random numbers (`APT-2026-<4 random digits>`), no slot-conflict check, any-to-any
    appointment status PATCH, plaintext password comparison, SQLite and Neon dual writes. These are cheap to fix and are prerequisites
    for every domain in section 4.
