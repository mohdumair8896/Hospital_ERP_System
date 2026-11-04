# Benchmark: Leading Hospital Information Systems and Hospital ERPs vs. ProHealth

Status: complete

Research date: 2026-10-24. Sources are public (vendor product pages, developer/interoperability docs, release notes, government portals, press). Claims are cited inline. Items marked "(unverified)" or "(uncertain)" could not be confirmed from a fetched source.

## 1. System profiles

### 1.1 Epic (Epic Systems, Verona WI)

**Positioning.** Market leader in US acute care. KLAS market-share coverage (as reported by Becker's/Fierce; KLAS report itself not fetched, so treat figures as secondary) puts Epic at ~43.7% of US acute-care multispecialty hospitals and ~56.9% of beds, followed by Oracle Health 21.9%, MEDITECH 14.7%, TruBridge 7.6%, Altera 2.9%; Epic net +77 hospitals in 2025, Oracle Health net -56 ([Becker's](https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/hospital-ehr-market-share-leaders-in-2025-by-category/), [Fierce Healthcare](https://www.fiercehealthcare.com/health-tech/epic-continues-grow-ehr-market-share-it-makes-gains-small-health-systems); both returned 403 to direct fetch, figures from search abstracts). 2026 Best in KLAS: Epic EpicCare Inpatient/Resolute Hospital Billing won Acute Care EHR & Patient Accounting for large (>400 beds) and midsize hospitals; MEDITECH Expanse won small hospitals ([Becker's Best in KLAS 2026](https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/best-in-klas-2026-whos-winning-in-ambient-ai-ehrs-revenue-cycle-and-more/), [KLAS press](https://engage.klasresearch.com/press-release/2026-best-in-klas-global-software-awards-announced/)).

**Architecture: one database, many applications.** All applications run on the Chronicles database (listed under "Epic Analytic Tools" by Alberta's Connect Care glossary, alongside Clarity, Caboodle, Cogito, SlicerDicer, Reporting Workbench, Radar Dashboard, Registry) ([Connect Care analytic tools](https://ehealth.connect-care.ca/epic-systems/epic-analytic-tools)). The desktop client is Hyperspace. Connect Care lists 39 Epic modules including Anesthesia, ASAP, Beacon, Beaker, Bones, Cadence, Canto, Care Everywhere, Cupid, EpicCare, Grand Central, Haiku, Healthy Planet, Kaleidoscope, MyChart, OpTime, Prelude, Radiant, Resolute, Rover, Stork, Storyboard, Willow, Wisdom ([Connect Care modules](https://ehealth.connect-care.ca/epic-systems/epic-modules)). Every module reads and writes the same patient and encounter records, so a pharmacist in Willow, a nurse in Rover and a biller in Resolute work on one chart.

**Module roles (from public glossary and training pages):**

| Module | What it does (source) |
|---|---|
| EpicCare Inpatient / Ambulatory | Core clinical EHR (documentation, CPOE, results). Epic's own site gives no module text ([epic.com/software](https://www.epic.com/software) shows only segment cards); descriptions come from third-party guides. |
| Cadence | Outpatient/specialty scheduling and check-in (third-party study guides; secondary). |
| Prelude | "Enterprise registration and patient tracking", to "manage identity and disposition across the continuum of care" ([Connect Care Prelude](https://ehealth.connect-care.ca/epic-systems/epic-modules/prelude)). |
| Grand Central | "Enterprise admission-discharge-transfer system", pre-admission through discharge/transfer, multi-facility bed planning, housekeeping, patient transport, location tracking, real-time utilization reports ([Connect Care Grand Central](https://ehealth.connect-care.ca/epic-systems/epic-modules/grand-central)). U Iowa ADT training covers the Unit Manager activity, bed requests, bed blocks and bed swap ([U Iowa Epic support](https://epicsupport.sites.uiowa.edu/node/1331)). |
| ASAP | ED system: "tools for triage, department management and active decision support", color-coded dashboards, documentation narrators ([Connect Care ASAP](https://ehealth.connect-care.ca/epic-systems/epic-modules/asap)). |
| Willow | Pharmacy (Inpatient and Ambulatory). Closed-loop medication management from reconciliation through ordering, dispensing, administering; inventory across facilities with balance updates, returns/waste, stock transfers, PO generation ([Connect Care Willow](https://ehealth.connect-care.ca/epic-systems/epic-modules/willow)). open.epic lists "Outgoing Verified Medication Orders" from Willow Inpatient to dispensing systems and incoming ADS (cabinet/robot) dispense, return and waste ([open.epic HL7v2](https://open.epic.com/Interface/HL7v2)). |
| Beaker | LIS combining "core lab, microbiology, and anatomic pathology workflows" with closed-loop results ([Connect Care Beaker](https://ehealth.connect-care.ca/epic-systems/epic-modules/beaker)). |
| Radiant | Radiology information system (orders, tracking, documentation; images via PACS). Secondary sources only. |
| OpTime (+ Anesthesia) | Surgical workflows: scheduling, pre-op assessment, anesthesia, procedure documentation; pre/intra/post-op orders "coordinated through a single screen" ([Connect Care OpTime](https://ehealth.connect-care.ca/epic-systems/epic-modules/optime)). Preference cards not confirmed on that page. |
| Resolute | "Automates and organizes the revenue cycle"; Hospital Billing (HB), Professional Billing (PB) and Single Billing Office (SBO) ([Connect Care Resolute](https://ehealth.connect-care.ca/epic-systems/epic-modules/resolute), [U Iowa](https://epicsupport.sites.uiowa.edu/epic-resources/customer-servicefinancial-counselor)). |
| MyChart | Patient portal: scheduling, medications, results, bills, family (proxy) care management, virtual visits, one login across organizations ([mychart.org](https://www.mychart.org/)). |
| Cogito | Analytics umbrella: Clarity (relational reporting DB), Caboodle (data warehouse), SlicerDicer (self-service), Reporting Workbench (operational reports) ([Connect Care analytic tools](https://ehealth.connect-care.ca/epic-systems/epic-analytic-tools); per-tool pages not fetched, so the parenthetical roles are common usage, not verified here). |
| Healthy Planet | Population health: risk stratification, point-of-care metrics and registries for "high-risk, high-resource" populations ([Connect Care Healthy Planet](https://ehealth.connect-care.ca/epic-systems/epic-modules/healthy-planet)). |
| Rover / Haiku / Canto | Mobile: Rover for nurses, including barcode medication administration that files to the MAR; Haiku (phone) and Canto (tablet) for providers ([Texas Children's](https://texaschildrensnews.org/epic-rover-launch-enhances-patient-safety-prevents-medication-errors/); other sources are vendor blogs). |
| In Basket | Clinician message and task hub for results, portal messages, refill requests ([Mindbowser guide](https://www.mindbowser.com/epic-in-basket-guide/), third party). |
| Storyboard | Patient-specific UI "always visible in the leftmost screen column", showing demographics, allergies, problems, medications and social determinants whatever else is open; shared by Hyperspace, mobile and portal ([Connect Care Storyboard](https://ehealth.connect-care.ca/epic-systems/epic-modules/storyboard)). It replaced the older patient header to cut clicks and screen jumps ([TriHealth](https://bridge.trihealth.com/our-stories/2020/may/storyboard-coming-to-epic)). |

**Data-model concepts confirmed.** The revenue cycle separates the *guarantor account* (the financially responsible party; PB charges, payments and adjustments post here) from the *hospital account record (HAR)* (the billing container for a stay or visit; HB charges, payments and adjustments post here). Single Billing Office combines HB and PB self-pay for the same guarantor ([U Iowa Epic support](https://epicsupport.sites.uiowa.edu/epic-resources/customer-servicefinancial-counselor)). The chain is therefore patient (MRN) -> encounter (clinical contact) -> hospital account (billing container) -> guarantor (who pays) plus coverages.

**Interoperability.** open.epic documents HL7 v2 interfaces by function: outgoing/incoming patient administration (ADT, including bed status), MDM for notes, scheduling, orders and results (LRI/ELR), imaging orders and results to PACS, verified medication orders, ADS dispense, medication administration notification, incoming financial transactions (charges), blood bank, materials and procedural supply usage ([open.epic HL7v2](https://open.epic.com/Interface/HL7v2)). Epic on FHIR supports DSTU2, STU3 and R4, OAuth 2.0 including backend clients, Bulk Data (kickoff/status/file), a CDS Hooks tutorial, a FHIRcast tutorial and a sandbox. Resources include Patient ($match, $summary), Observation ($lastn), Encounter, Coverage, MedicationRequest, ServiceRequest, DiagnosticReport, DocumentReference and Appointment ([fhir.epic.com](https://fhir.epic.com/)). Care Everywhere is the record-exchange module (listed by Connect Care).

**AI.** Epic's AI brands are Art (clinicians), Penny (revenue cycle) and Emmie (patients, in MyChart). AI Charting (ambient: listens to the visit, drafts notes, suggests orders, restyles by voice command) was announced at UGM in August 2025 and made broadly available on 4 Feb 2026 ([HLTH](https://hlth.com/insights/news/epic-releases-native-ai-charting-for-integrated-clinical-documentation-2026-02-06), [MedCity News](https://medcitynews.com/2026/02/ambient-scribe-ai-startups-epic/)). Capture is reportedly via Haiku/Canto, with Microsoft Dragon Ambient supplying transcription and diarization (seen only in search abstracts; not independently confirmed). HLTH reports more than 200 organizations use Penny for coding automation (vendor-sourced claim).

**UX differentiators.** Storyboard persistent patient sidebar; In Basket as the unified worklist; role-specific activities in Hyperspace; a mobile app per role (Rover/Haiku/Canto); color-coded ED and unit dashboards; formal personalization training (Epic "efficiency" sessions on In Basket, Patient Lists and personalizing Hyperspace) ([efficiency.epic.com](https://efficiency.epic.com/register)).

### 1.2 Oracle Health (formerly Cerner; Millennium and the new Oracle Health EHR)

**Positioning.** Oracle acquired Cerner (deal closed June 2022, ~US$28.3B) and rebranded it Oracle Health ([Wikipedia: Oracle Health](https://en.wikipedia.org/wiki/Oracle_Health)). Number two in US acute care by hospitals (~21.9%) but losing share: net -56 hospitals and -14,676 beds in 2025, the third straight year of net losses, per coverage of KLAS ([Becker's](https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/health-systems-moving-to-epic-oracle-in-2026/), search abstract). Oracle's own oracle.com pages returned 403 to direct fetch, so product claims below come from Oracle docs, trade press and hospital training material.

**Millennium architecture.** Millennium is a single platform with one clinical database; departmental "solutions" plug into it ([Wikipedia: Cerner](https://www.wikipedia.org/wiki/Cerner)):
- PowerChart: clinician documentation and ordering (CPOE), the core chart.
- FirstNet: emergency department (tracking, triage, ED documentation).
- SurgiNet (and SurgiNet Anesthesia): perioperative scheduling and documentation.
- PharmNet: pharmacy (order verification, dispensing).
- PathNet: laboratory (Cerner's first product in 1984).
- RadNet: radiology information system.
- Revenue cycle: Millennium Patient Accounting, and now Oracle Health Patient Accounting (OHPAC, also called RevElate). Oracle describes it as EHR-agnostic and cloud-enabled, working "seamlessly" with Millennium ([Oracle patient accounting](https://www.oracle.com/health/revenue-cycle/patient-accounting/), [HIT Leaders](https://www.healthcareitleaders.com/blog/implementing-oracle-health-patient-accounting-in-a-mature-clinical-environment-what-clients-need-to-know/)). A consultancy notes that relatively few health systems have gone live on it. Job postings describe chargemaster maintenance and troubleshooting HL7 ADT/DFT messages that drive charge posting (secondary).
- Queensland Health's ieMR is an example of PowerChart, FirstNet, SurgiNet and RadNet on one Millennium build (Wikipedia, secondary).

**Millennium UX (from hospital training guides).** MPages are the patient-level summary pages and workflow layouts; users can add, reorder and hide components ([Munson MPage personalization PDF](https://www.munsonhealthcare.org/media/file/MPage%20and%20Workflow%20Personalizations.pdf)). Interactive View (iView) is the flowsheet for nursing and ambulatory documentation, organized in bands and sections, with a default 24-hour timeframe ([Munson iView PDF](https://www.munsonhealthcare.org/sites/default/files/media/file/IView%20Documentation.pdf)). PowerForms are structured forms that can be favorited, and Clinical Entry Workspace is available in all Workflow MPages ([Northern Light](https://hi.northernlighthealth.org/Flyers/Providers/ED/Clinical-Entry-Workspace.aspx)). Worklists are parameter-driven ("Dynamic Worklist"; described in a training transcript, so secondary).

**New Oracle Health EHR (2025-2026).** Announced 13 Aug 2025 for US ambulatory providers. Oracle says it was built from the ground up on Oracle Cloud Infrastructure rather than on Cerner infrastructure. It is voice-first, with conversational search, AI-generated patient summaries, voice queries across drug databases, pharmacy records and guidelines, and flags for care gaps, financial concerns and readmission risk. Every AI capability is labeled with its data sources, intended use, limitations and risks ([Healthcare Dive](https://www.healthcaredive.com/news/oracle-new-ehr-artificial-intelligence-ai/757588/)). Advisory Board reported in Nov 2025 that it received ONC certification and met DEA EPCS requirements, with acute care functionality planned for 2026. Customers can extend Oracle's agents, build their own or add third-party models ([Advisory Board](https://www.advisory.com/daily-briefing/2025/11/20/oracle-ehr)). I found no 2026 source confirming an acute-care go-live of the new EHR (uncertain).

**Clinical AI Agent.** Combines generative AI, multimodal voice and screen-driven assistance; released before the new EHR and embedded in it (Advisory Board). On 14 Sep 2026 Oracle launched (US commercial availability) a Clinical AI Agent for inpatient nurses, embedded in the "Oracle Health Foundation EHR". It turns dictated observations, vitals, fluid measurements and assessments into discrete EHR fields after the nurse reviews and approves them, produces shift-handoff summaries from notes, medications, labs and orders, and supports voice search and navigation. BayCare is an early evaluator. Oracle claims the physician agent has saved more than 400,000 documentation hours (vendor claim) ([HLTH, 15 Sep 2026](https://hlth.com/insights/news/oracle-health-expands-ai-agent-for-inpatient-nursing-workflows), [HIT Consultant](https://hitconsultant.net/2026/09/14/oracle-health-launches-clinical-ai-agent-for-nurses-inpatient-ehr-documentation/)). How "Foundation EHR" relates to Millennium versus the new EHR is not stated in the sources I fetched (uncertain).

**Interoperability.** Millennium Platform APIs: FHIR R4 (recommended), FHIR R4 Bulk Data Access, deprecated DSTU2 ("Oracle no longer supports DSTU 2 FHIR APIs"), proprietary "EHR APIs", SMART on FHIR app support, an authorization framework, public patient and provider R4 endpoints, and open and secure sandboxes ([Oracle docs](https://docs.oracle.com/en/industries/health/millennium-platform-apis/)).

**Takeaways for ProHealth.** (1) Department-named solutions on one database map naturally to microservices *only if* they share one patient/encounter identity and one order/result model. (2) Make AI output provenance explicit (sources, intended use, limits). (3) Voice-to-discrete-flowsheet with mandatory human review is the nursing AI pattern to copy, rather than free-text notes.

### 1.3 MEDITECH Expanse

**Positioning.** "The Intelligent EHR", described as a "cloud-native, highly scalable EHR platform" with a "mobile-first design" ([MEDITECH Expanse](https://ehr.meditech.com/ehr-solutions/meditech-expanse)). Strong in community and standalone hospitals: 2026 Best in KLAS Acute Care EHR (Small, 1-150 beds) went to MEDITECH Expanse/MaaS ([Becker's](https://www.beckershospitalreview.com/healthcare-information-technology/ehrs/best-in-klas-2026-whos-winning-in-ambient-ai-ehrs-revenue-cycle-and-more/)), and coverage of KLAS says MEDITECH leads standalone hospitals with 26-200 beds and kept 84% of legacy customers (search abstract of Becker's/Fierce). It is offered on-premise or as cloud-hosted MEDITECH-as-a-Service (MaaS).

**Modules (as listed on the Expanse page).** Care settings: acute, ambulatory, Emergency Department, Surgical Services. Solutions: Expanse Pharmacy, Expanse Pathology, Genomics, a "unified revenue cycle solution", Patient Connect, self-service and virtual care, Traverse Exchange for referral partners, Expanse Navigator (search across structured and unstructured data including scanned documents), and AI hospital-course summaries and nurse handoffs ([MEDITECH Expanse](https://ehr.meditech.com/ehr-solutions/meditech-expanse)). The page did not list a separately named lab or imaging module (uncertain whether that is only a page-content gap). Mobile apps are Expanse Now (physicians) and Expanse Point of Care (nurses) (see AI below).

**Clinical decision support.** Surveillance works "in the background" as an early-warning system: patients meeting profile criteria auto-populate tracking boards for potential hospital-acquired conditions, with alerts broadcast to status boards across Expanse. It includes two Surviving Sepsis Campaign-derived adult sepsis screening algorithms (global and ED triage) and a Sepsis Management Toolkit ([MEDITECH Surveillance](https://ehr.meditech.com/ehr-solutions/meditech-surveillance), [MEDITECH sepsis news](https://ehr.meditech.com/news/recognize-sepsis-awareness-month-with-meditech)). One hospital's build fires a SIRS alert to nurse and provider on vital-sign and lab criteria, with lactate and procalcitonin added to the screen ([Brockton/Betsy Lehman Center PDF](https://betsylehmancenterma.gov/assets/uploads/general/Signature-Brockton-MEDITECH-sepsis-tool-FINAL.pdf)).

**AI (2025-2026).** Expanse Navigator: AI search and summary across structured and unstructured data, built on Google Cloud. Generative course-of-stay narratives and nurse shift summaries are reported to use Google Vertex AI/Gemini (secondary). On 27 Apr 2026 MEDITECH announced:
- native ambient AI in Expanse Now (clinic visit notes) and Expanse Point of Care (inpatient nursing assessments that nurses review and edit before filing, with a documentation-completeness checklist);
- MyHealth Assistant, a patient chatbot in the MyHealth portal for navigation, information and scheduling;
- Ask Expanse, a clinician chatbot for record queries, summaries and admin tasks such as referral letters;
- Claim Denial Agents, which research denial causes, rank work by likelihood of success and draft evidence-based appeals ([Pulse+IT, 27 Apr 2026](https://www.pulseit.news/?p=51563)).

**Interoperability.** Traverse Exchange is MEDITECH's FHIR-based exchange network, launched in the US in late 2024 (search abstract; not fetched directly). MEDITECH demonstrated interoperability with partners at HIMSS25 ([Business Wire](https://www.businesswire.com/news/home/20250213961119/en/MEDITECH-Partners-with-Technology-Leaders-to-Showcase-Interoperability-at-HIMSS25)).

**Takeaways for ProHealth.** Role-based *status boards* are MEDITECH's main UX primitive and double as the CDS delivery surface: surveillance rules put patients onto boards rather than only firing pop-ups. Denial management is an early, high-ROI target for agentic AI.

### 1.4 athenahealth athenaOne

**Positioning.** Cloud, single-instance, continuously updated suite aimed mainly at ambulatory and physician practices, not inpatient hospitals. athenaOne bundles the EHR (athenaClinicals), practice management and RCM (athenaCollector) and patient engagement. athenahealth.com marketing pages returned 403, but the public user-guide site help.athenahealth.com was readable and is the best source.

**athenaCollector (PM + RCM).** Covers registration, scheduling, check-in, charge entry, referral management, checkout, follow-up, collections, accounting and reporting. It checks eligibility before appointments and flags ineligible patients. It tracks activity in real time so that every encounter generates charges and claims, and a workflow dashboard shows which claims are paid, unpaid and why. A billing services center submits electronic and paper claims, confirms receipt, resubmits lost claims, posts remittance (scanning paper remittance advice), and follows up denied or unpaid claims. "Live Benchmarking" compares a practice with peers by state, specialty or nationally ([athenaCollector overview](https://help.athenahealth.com/Ohelp/Content/Features/athenaCollector_A.htm)).

**Rules engine (the network effect).** A database of payer-specific reimbursement requirements, "updated daily", that verifies data at key workflow points and alerts staff when a claim needs correction ([athenaCollector overview](https://help.athenahealth.com/Ohelp/Content/Features/athenaCollector_A.htm)). athenahealth patented the method of storing and modifying claim rules from payer messages ([Healthcare IT News](https://healthcareitnews.com/node/414291)). Rule tiers are global rules (written by athenahealth), local rules (practice-requested, written by athenahealth if compliant) and custom rules (practice-configured, which can only move claims to HOLD or MGRHOLD) (search abstract of athenahealth help; not fetched directly).

**Claim state machine (verbatim status codes, a good model for our billing service)** ([Claim Status guide](https://help.athenahealth.com/Ohelp/Content/Features/Claim_Status_A.htm)):

| Status | Meaning | Owner |
|---|---|---|
| MISSING | Set automatically at check-in until charge entry is done (or the visit is marked "no charge entry") | Practice |
| HOLD | Claim-specific scrub errors (demographics, insurance, CPT) | Practice |
| MGRHOLD | Errors needing a billing manager (provider number, credentialing) | Practice |
| DROP | Passed the Rules Engine scrub; batched and usually sent electronically the same night (minimum one-hour delay) | athenahealth |
| BILLED | Submitted, awaiting remittance | athenahealth |
| FOLLOWUP | Remittance overdue; a "claim alarm" fires at the payer's usual processing time | athenahealth |
| CBOHOLD | Failed adjudication; needs investigation, or waiting on appeal/resubmission | athenahealth |
| ATHENADROP | At risk of missing the filing deadline (assigned 15 days before); sent on paper, then returns to its prior status | system |
| APPEALED | Denied and being appealed (only for no-follow-up clients) | Practice |
| OVERPAID | Credit balance after the OVERPYMT kick code | Practice |
| COLLECT | Charges eligible for collections, shown on the Collections Worklist | Practice |
| CLOSED | Remittance received or charge adjusted off | n/a |

Claims worklists, a Claim Review tab and a Workflow Dashboard expose these states to staff ([View Claims Worklists](https://help.athenahealth.com/Ohelp/Content/View_Claims_Worklists_PH.htm), [Workflow Dashboard](https://help.athenahealth.com/Ohelp/Content/Workflow_Dashboard_PH.htm)).

**AI (2025-2026).** On 9 Oct 2025 athenahealth announced AI-native practice and RCM capabilities, including automated insurance selection and AI agents for prior authorization and claims. It claims clean-claim rates near 99% and a 5.7% median initial denial rate versus an industry average above 10% (vendor claims; [press release listing](https://www.athenahealth.com/press-releases/athenahealth-introduces-ai-native-athenaone), page returned 403, figures from search abstract). On 4 Jun 2026 it announced an 80+ feature AI roadmap: insurance-package identification from a photo of the card, AI voice agents that place prior-auth calls (to expand to referrals and claim status), AI copay estimates, denial-resolution automation, and Express coding in beta for 500+ clinicians. It reports coding-denial recoveries up 30% and insurance-related denials down 16% ([TechTarget](https://www.techtarget.com/revcyclemanagement/news/366643899/Athenahealth-unveils-over-80-revenue-cycle-AI-features)). Ambient documentation: an "Ambient Notes" marketplace lets clinicians pick among embedded scribe models, with Microsoft Dragon Copilot added in H1 2026 ([Business Wire, Dec 2025](https://secure.businesswire.com/news/home/20251209452332/en/athenahealth-Collaborates-with-Microsoft-to-Offer-Microsoft-Dragon-Copilot-as-Ambient-Notes-Option-Enhancing-Choice-and-Flexibility-for-Ambulatory-Clinicians)). A native "athenaAmbient" scribe was described as "coming in 2026", and I could not confirm its GA date. The next-generation "AI native" athenaClinicals was unveiled in Sep 2025 ([Business Wire](https://www.businesswire.com/news/home/20250909029187/en/athenahealth-Unveils-Next-Generation-AI-Native-EHR-Solution-athenaClinicals-to-Simplify-Clinician-Experience-for-Ambulatory-Practices)).

**Takeaways for ProHealth.** (1) Model claims as an explicit state machine with an *owner* per state and worklists per owner. (2) A claim-scrub rules engine at charge entry is the cheapest way to cut denials. (3) An auto-created "MISSING charge" placeholder at check-in closes charge-capture leakage. In India the same idea applies to TPA claims and package bills.

### 1.5 Altera Digital Health Sunrise (formerly Allscripts)

**History and positioning.** Allscripts sold its Hospitals and Large Physician Practices segment (Sunrise, Paragon, TouchWorks, Opal, STAR, HealthQuest, dbMotion) to N. Harris Computer Corporation, a Constellation Software subsidiary. The sale was announced 2 Mar 2022 (up to US$700M) and closed 2 May 2022. The segment operates as Altera Digital Health, and the remaining Allscripts business became Veradigm ([Altera newsroom](https://www.alterahealth.com/newsroom/harris-completes-purchase-of-allscripts-hospitals-and-large-physician-practices-business-segment/), [Allscripts 10-Q](https://www.sec.gov/Archives/edgar/data/1124804/000095017022022665/mdrx-20220930.htm)). Altera markets Sunrise as "A complete clinical and financial platform for midsized hospitals" on "One shared platform connecting clinical, financial and operational workflows", with role-based views ([Altera Sunrise](https://www.alterahealth.com/solutions/sunrise/)). US acute share is about 2.9% and falling (KLAS coverage, see 1.1). Early 2026 brought 14 Sunrise contract renewals ([DistilInfo](https://distilinfo.com/2026/02/26/altera-sunrise-ehr-renews-14-hospital-partnerships/)).

**Named components** ([Altera Sunrise](https://www.alterahealth.com/solutions/sunrise/)):
- Sunrise Thread AI: ambient documentation; structured notes that providers review and finalize. GA reported Nov 2025 (tag-page snippet; thin).
- Sunrise Axon: brings external patient data into the chart.
- Sunrise Mobile: mobile access to records and alerts.
- Sunrise CarePath: patient access, messaging, scheduling.
- Sunrise Financial Manager: revenue cycle and billing.
- Sunrise Health Record: health information management.
- Altera Lab is listed separately as a LIS. A shared database across emergency, ambulatory, oncology, anesthesia and surgical modules is claimed by third-party summaries (secondary).

**Sunrise 25.1 (GA 17 Jun 2025, "nearly 700" enhancements).** It added:
- a Financial Manager *billing hub* grouping billing requests, claims and self-pay into three tabs;
- an Ambulatory unified list for appointments *and walk-ins* with visual cues and "mini-views" for one-click patient switching;
- patient-level order entry and maintenance in acute care, and query entry without exact search terms (fuzzy search) ([Altera 25.1 release](https://www.alterahealth.com/newsroom/altera-digital-health-makes-sunrise-25-1-generally-available-to-hospitals-and-health-systems/)).

I found no 2026 Sunrise release notes.

**Takeaways for ProHealth.** A merged appointment + walk-in queue is the right pattern for Indian OPDs, where walk-ins dominate. A three-tab billing hub (requests / claims / self-pay) is a simple, effective RCM home screen. Fuzzy order search lowers CPOE friction.

### 1.6 eClinicalWorks and NextGen (ambulatory-first comparators)

Both are primarily ambulatory/practice systems. They are useful benchmarks for ProHealth's OPD, portal and RCM, not for IPD.

**eClinicalWorks.** Cloud EHR + PM. Its patient engagement platform is *healow* (mobile app, TeleVisits, kiosks). Sunoh.ai is a healow ambient scribe sold EHR-agnostically but optimized for eCW (healow app, eClinicalTouch on iPad). A third-party review claims more than 100,000 providers use it (unverified) ([Commure review of Sunoh](https://www.commure.com/blog-scribe/sunoh-ai-review), competitor source). Vendor case studies report 2-4 hours/day of documentation savings at a neurology center (Jun 2026) and healow Genie, an AI contact-center agent, handling ~80% of call volume at one FQHC (May 2026) ([eCW 2026 press releases](https://www.eclinicalworks.com/2026/?cat=42), [Business Wire FQHC case](https://www.businesswire.com/news/home/20250220031952/en/eClinicalWorks-AI-Solutions-and-Sunoh.ai-Revolutionize-Clinical-Efficiency-at-Large-FQHC-HealthWorks-for-Northern-Virginia)). All of these are vendor-reported. I could not confirm an inpatient/hospital product from fetched sources.

**NextGen Healthcare.** Products are NextGen Enterprise (mid-size to large practices) and NextGen Office (small groups) (third-party review; the review site's certificate had expired so it was not fetched). Ambient Assist is an ambient-listening note generator. PM-integrated billing uses an "AI Rules Engine" for claim accuracy (NextGen product pages via search abstract). NextGen also owns the **Mirth Connect** integration engine. With v4.6 (2025) NextGen moved from a dual open-source/commercial license to a "single commercial and proprietary" license. Open-source users can stay on 4.5.2 or license 4.6 ([NextGen blog](https://www.nextgen.com/blog/industry-news/a-new-era-for-mirth-connect-by-nextgen-healthcare), [4.6 upgrade notes](https://docs.nextgen.com/en-US/mirthc2ae-connect-by-nextgen-healthcare-user-guide-3273569/4-6-0-upgrade-notes-203222)). A community fork, "BridgeLink" (Innovar Healthcare), was reported on LinkedIn (weak source).

**Takeaways for ProHealth.** (1) The ambient scribe is now table stakes even for small ambulatory vendors; the differentiator is native integration (orders, codes, discrete fields), not transcription. (2) An AI phone/contact-center agent for appointment calls is a realistic early win for Indian OPDs. (3) Do not assume Mirth Connect is free for an HL7 v2 gateway. Budget for a license, use the last OSS release with care, or build HL7 v2 handling in-house (e.g., a Node HL7 parser in an `integration` service).

### 1.7 India-focused HIMS

**The certification benchmark that matters most for ProHealth: NABH Digital Health Standards for HIS/EMR Systems.** NABH certifies HIS and EMR *software* (separately) at Basic or Advanced level, valid for two years. The programme is "1st Edition September 2024", with standards V12.1 of 14 Sep 2024. **Eligibility requires at least three deployments in operational Indian hospitals and a valid ABDM M3 compliance certificate.** Fees run from INR 50,000 (Basic, one system) to INR 1,50,000 (both Advanced) plus GST. The programme is designed to fit ABDM and the DPDP Act ([NABH programme page](https://nabh.co/programmes/digital-health-standards-his-emr-systems/), [NABH announcement PDF](https://portal.nabh.co/Announcement/Announcement%20for%20Applications%20for%20NABH%20Certification%20of%20HIS%20EMR%20Systems.pdf)). The July 2024 draft had 212 objective elements (OEs): 61 Core, 91 Commitment, 37 Achievement, 23 Excellence (draft; final may differ) ([Healthcare IT News](https://www.healthcareitnews.com/news/asia/india-drafts-emr-his-standards)). Published certification listings show the chapter structure:
- **EMR chapters:** Access, Assessment & Continuity of Care (AAC), Care of Patients, Management of Medication (MOM), Digital Application Controls (DAC), Digital Operations Management (DOM), Information Management System (IMS).
- **HIS chapters:** the same plus Finance and Procurement Management (FPM) and Human Resource Management (HRM) ([NABH listing: Suvarna](https://nabh.co/software/suvarna-hims-emr/)).

A third-party blog says the NABH hospital standards 6th edition (effective 1 Jan 2025) weight EMR/ABDM integration and that HIP registration is needed for PM-JAY/CGHS/ECHS empanelment ([dev.to, eCorpIT](https://dev.to/mr_manushukla/abdm-hip-integration-in-2026-fhir-r4-abha-linking-and-nabh-6th-edition-readiness-50i4); vendor blog, unverified).

| Product | Positioning and modules (source) | Notes |
|---|---|---|
| **KareXpert** (Gurugram; "A Reliance Jio backed venture") | SaaS suite: Advance HIMS, EMR/EHR, Virtual Care, LIMS, RIS/PACS, Pharmacy, Connected Ambulance, AI Healthcare, Homecare, Advance BI, Medical IoT; "60+ Integrated Modules"; "ABDM M1,M2,M3 Certified"; single data lake for transactional + BI; mobile, tablet, kiosk and TV channels ([karexpert.com](https://www.karexpert.com/)) | Claims 500+ hospitals, 30,000+ beds (vendor). Customers include HCL Healthcare, SVIMS (TTD), Tata Motors Hospital. |
| **Insta HMS by Practo** | Web HIS for clinics through multi-centre chains; modules named on site: Revenue Cycle Management, Clinical Solutions, Patient Administration, Lab/Radiology/Services, Pharmacy and Inventory, Integrations, Insurance (NPHIES, Riayati), Regulatory Compliance, Health Information Exchange (NABIDH, Malaffi, Riayati) ([instahms.com](https://www.instahms.com/)) | Site emphasizes GCC compliance; ABDM/NABH not named on the homepage (only third-party roundups claim them). Claims 1,250+ centres, 22+ countries. |
| **MediXcel (Plus91, Pune)** | ABDM-compliant EMR + HIS; NRCeS registry lists V4.12.2 live for clinics, labs and hospitals, supporting "Billing, Scheduling, Stores, CDSS, A-D-T" ([NRCeS registry](https://www.nrces.in//registry/information/33), [NABH listing](https://nabh.co/software/plus91-technologies-pvt-ltd/)) | Note: medixcel.com is an unrelated Saudi company. The 2023 press release claims QCI/NABH audits passed for all modules. |
| **Birlamedisoft (Pune, est. 2001)** | Quanta HIS: admin, insurance, OPD, IPD, billing, registration, OT, reports; older deck lists pharmacy, blood bank, ICD-10, payroll, MIS, LIS/RIS/PACS ([SlideShare](https://www.slideshare.net/slideshow/hims-pptquanta-v3-0/47668963)) | Dated, secondary sources only. No NABH listing found. |
| **Suvarna HIMS & EMR (Suvarna Technosoft, Hyderabad)** | NABH Digital Health **Advanced** for both HIS and EMR, certificates DH-HIS-A-2025-0001 / DH-EMR-A-2025-0001 (valid 13 May 2025 - 12 May 2027); HIS 149/171 OEs (87%), EMR 145/166 (87%); references KIMS, Apex, ASRAMS ([NABH listing](https://nabh.co/software/suvarna-hims-emr/)) | The certificate numbers suggest it was the first certified under this scheme. |
| **Akhil Systems (Delhi): Miracle HIS & EMR** | Web HIS/EMR, NABH Digital Health **Advanced** (valid 2 Sep 2025 - 1 Sep 2027); "40+ modules" from registration to discharge; on-prem, SaaS or hybrid ([NABH listing](https://nabh.co/software/akhil-systems-pvt-ltd/)) | Named modules include registration, OPD, IPD, OPD pharmacy, purchase & stores (Slashdot, secondary). |
| **NIC e-Hospital** (Govt of India, National Informatics Centre) | "Workflow based Integrated HMIS over cloud": Patient Registration (OPD, Casualty, Appointment & ORS), Admission, Discharge & Transfer (IPD), Billing, Clinic (OPD & IPD) ([ehospital.gov.in](https://ehospital.gov.in/)); full module list adds LIS, RIS, Dietary, Laundry, Store & Pharmacy, OT ([NIC module list](https://ehospital.nic.in/ehospitalsso/ehosModuleList.jsp)); ORS (ors.gov.in) patient portal for appointments, lab reports, blood availability, online payment; integrated with ABDM (ABHA, HFR, consent) | NIC says 1,000+ facilities use it (search abstract). It is the reference for government hospitals and ABHA-based queue registration. |

**Common Indian HIMS feature set (synthesized from the above; cross-vendor pattern, not any one vendor's spec):** UHID-based registration with ABHA linking; OPD token and queue; IPD with bed allotment, deposits/advances and running bills; TPA/insurance desk with pre-auth, tariff and package masters; pharmacy with batch/expiry and GST; LIS with barcode samples and machine interfacing (HL7/ASTM); RIS/PACS; OT scheduling; CSSD, dietary, laundry, blood bank; stores and purchase; HR and payroll; MIS dashboards.

### 1.8 ABDM / ABHA integration requirements (India)

Official ABDM portals (sandbox.abdm.gov.in, abdm.gov.in) are JavaScript apps that returned no text to WebFetch, and nrces.in rejected the TLS certificate. Details below come from official PDFs, the official developer forum, and implementer docs, with the source type marked.

**Building blocks.**
- **ABHA**: 14-digit health account and address.
- **HFR**: Health Facility Registry.
- **HPR**: Health Professional Registry.
- **HIE-CM**: Health Information Exchange and Consent Manager, which brokers consent artefacts and routes requests via the ABDM gateway.
- **HIP**: Health Information Provider, a facility that *holds* records and shares them.
- **HIU**: Health Information User, a facility or app that *requests* records under consent.
- **NHCX**: National Health Claims Exchange.

NIC e-Hospital lists ABHA ID, Health Facility ID, consent management and the ABHA App as integrated components (search abstract of [NIC about](https://ehospital.nic.in/ehospitalsso/aboutus)).

**Milestones (certification gates attach to the software, not the hospital).** The commonly described sequence is below. Sources disagree on where care-context linking sits, so confirm against the current sandbox test cases ([ABDM dev forum: M1/M2/M3 test cases](https://devforum.abdm.gov.in/t/regarding-m1-m2-m3-testcases/7525)):
- **M1 (identity):** ABHA creation and verification (Aadhaar/mobile OTP), ABHA address, profile fetch; some guides also include facility/professional registration.
- **M2 (HIP):** respond to patient discovery, link care contexts (user-initiated via discovery, or HIP-initiated via a link token), receive consent notifications, and on a health-information request, encrypt and push FHIR bundles to the HIU, then notify status to the gateway. The pattern is request-in, HTTP 202-out, async callback. Paths differ by API version (v0.5 `/care-contexts/on-discover`, `/links/link/init` and `confirm` versus v3 `/patient/care-context/on-discover`, `/hip/v3/link/carecontext`) ([forum thread on on-discover](https://devforum.abdm.gov.in/t/query-regarding-to-v0-5-care-contexts-on-discover/7236), [forum: link confirm](https://devforum.abdm.gov.in/t/not-receiving-v0-5-links-link-confirm-from-the-gateway-using-discovery-flow/4402)). Encryption is "Fidelius": ECDH on Curve25519 with AES-256-GCM (implementer blog, [Nirmitee](https://nirmitee.io/blog/building-abdm-hip-from-scratch-m2-flow-reference-architecture/); verify against the spec).
- **M3 (HIU):** create consent requests, receive granted artefacts, request and decrypt records from other HIPs. **NABH HIS/EMR certification requires a valid M3 certificate** (see 1.7).

**FHIR content.** ABDM uses FHIR R4 profiles published by NRCeS (C-DAC). The HI types are Prescription, OPConsultation, DiagnosticReport, DischargeSummary, ImmunizationRecord, HealthDocumentRecord and WellnessRecord ([Bahmni HI types](https://bahmni.atlassian.net/wiki/spaces/BAH/pages/3162079253)). Note the naming mismatch: API hiType enums (e.g., `OPConsultation`) differ from IG profile names (e.g., `OPConsultRecord`, `PrescriptionRecord`, `DischargeSummaryRecord`, `DiagnosticReportRecord`) ([ABDM dev forum](https://devforum.abdm.gov.in/t/correct-enums-for-hitype-fhir-ig-or-apidocs/7067)). The IG also carries an InvoiceRecord and the NHCX claim profiles ([NRCeS IG artifacts](https://nrces.in/ndhm/fhir/r4/3.1.0/artifacts.html), not fetched; [NRCeS adoption guide PDF](https://www.nrces.in/download/files/pdf/Implementation_Guide_for_Adoption_of_FHIR_in_ABDM_and_NHCX.pdf)). Coding is SNOMED CT and LOINC (e.g., OPConsult composition uses SNOMED 371530004, per a developer guide).

**Scan & Share (OPD queue).** The hospital posts a facility QR at registration. The patient scans it with an ABDM app (ABHA app, Aarogya Setu, Paytm, EkaCare, Driefcase, Bajaj Health) and shares the ABHA profile. The hospital issues a token, which is pushed to the app and shown on counter screens, and the patient collects the OP slip. It launched 6 Oct 2022 and by early 2024 ran in 3,860+ facilities with more than 2 crore tokens ([ABDM Scan & Share onboarding manual PDF](https://abdm.gov.in/strapicms/uploads/ABDM_Scan_and_Share_Onboarding_Manual_18_01_2023_1_0600fe7747.pdf), [Indian Pharma Post](https://www.indianpharmapost.com/digitisation/lite/abha-based-scan-and-share-service-facilitates-2-crore-instant-opd-registrations-nationwide-15323)). The **Digital Health Incentive Scheme (DHIS)** pays incentives for Scan & Share transactions and health records generated.

### 1.9 India TPA / insurance cashless (pre-authorization) workflow

**Regulatory timeline.** The IRDAI Master Circular on Health Insurance (29 May 2024, consolidating 55 earlier circulars) requires insurers to decide cashless authorization **within 1 hour** of the hospital's request and give final discharge authorization **within 3 hours**. Extra hospital charges from a delay beyond 3 hours are borne by the insurer (from shareholder funds). Insurers and TPAs, not the patient, must collect claim documents from the hospital ([The Week](https://www.theweek.in/news/india/2024/05/30/irdai-issues-new-master-circular-to-make-health-insurance-claims-process-more-seamless.amp.html), [Deccan Chronicle](https://deccanchronicle.com/news/irdai-asks-insurers-to-settle-cashless-claims-in-3-hours-896346); press coverage, circular text not fetched; check for later amendments).

**Desk workflow (consistent across hospital SOP pages; local variations).**
1. **Admission / TPA desk:** verify the health card, policy and government ID, and check eligibility and sum insured. The patient or relative fills the request form; the admitting doctor completes history, diagnosis, planned line of treatment and estimated cost and length of stay. The patient signs an indemnity for non-payables and balance.
2. **Pre-auth submission** to the TPA/insurer (portal, email or NHCX), with the estimate.
3. **Response:** approved (with amount), partially approved, query (more documents), or denied. Denial converts the case to cash/reimbursement.
4. **Enhancement:** when the running bill exceeds the approved amount (one hospital triggers at INR 1 lakh over), send the interim bill and clinical update for enhancement; some hospitals collect a deposit if it is not approved within 24h ([Sri Ramakrishna Hospital](https://www.sriramakrishnahospital.com/insurance/), [Moneylife (sponsored)](https://www.moneylife.in/article/cashless-health-insurance-in-india-hospital-desk-process-and-preauthorisation-steps/81725.html)).
5. **Discharge:** send the final itemized bill, discharge summary, investigation reports and pharmacy log for final authorization; collect non-payables, co-pay and deductions from the patient; release the patient.
6. **Claim submission and settlement:** physical or digital file, then settlement with deductions, reconciliation (TDS, disallowances) and denial or short-payment follow-up ([TPA reconciliation guide](https://www.myndsolution.com/hospital-tpa-reconciliation-guide-india/), vendor blog).

**Government schemes and package pricing.** Under AB PM-JAY, hospitals bill fixed **Health Benefit Package** rates covering medicines, diagnostics, consultations, implants and pre/post-hospitalisation, and may not charge beyond the package. HBP 2022 has 1,961 procedures across 27 specialties ([Parliament answer PDF](https://eparlib.sansad.in/bitstream/123456789/2997506/1/AU1010_xngq7y.pdf)). Claims run through NHA's Transaction Management System (TMS), which enforces mandatory pre-auth (e.g., for unspecified surgical packages) ([NHA HBP 2.2 manual](https://nha.gov.in/img/resources/HBP-2.2-manual.pdf)).

**NHCX** is NHA's FHIR R4 payer-provider exchange covering eligibility, pre-auth request, claim request, payment notification/acknowledgement and claim-status search ([NRCeS HCX profile](https://www.nrces.in/ndhm/fhir/r4/hcx-profile.html), via search abstract). Each exchange is asynchronous (request to gateway, insurer's callback later). A vendor analysis says NHCX is live for private insurance, while PM-JAY production claims still run on TMS ([Nirmitee](https://nirmitee.io/blog/nhcx-pmjay-tms-ayushman-bharat-claims/); secondary).

**Implications for ProHealth's data model.** Coverage (payer, TPA, policy, member ID, sum insured, room-rent cap, co-pay) -> PreAuthorization (estimate, status, approved amount, queries, enhancements[]) linked to the IPD encounter -> PackageMaster/Tariff (by payer: CGHS/PM-JAY/insurer/corporate rate cards) -> Claim (submitted, settled, deductions, TDS). SLA timers matter (1h pre-auth / 3h discharge), so the TPA desk needs a worklist with countdowns.

### 1.10 Back-office ERP paired with HIS/EHR (SAP, Oracle Fusion, Workday)

The leaders split the *clinical/patient-financial* system (EHR + patient accounting) from the *enterprise* ERP (general ledger, procurement, supply chain, HR/payroll). Typical US pattern: Epic (clinical + Resolute) + Workday or Oracle Fusion or SAP (GL, AP, procurement, HCM). Charges and revenue flow from the EHR to the GL as journal summaries, and supply usage flows from OR/procedure documentation to ERP inventory.

**SAP.** SAP's hospital patient management and billing (IS-H) stays on Business Suite 7 mainstream maintenance until 2027, with optional extended maintenance to end-2030. **It will not be re-engineered for S/4HANA**, and SAP said patient administration and billing will be covered by third-party HIS vendors ([SAP blog on health strategy](https://blogs.sap.com/t5/sap-for-healthcare-blogs/what-does-the-sap-health-product-strategy-update-to-support-hybrid-modular/ba-p/13553548), [Taylor Wessing, May 2026](https://www.taylorwessing.com/de/insights-and-events/insights/2026/05/is-h-abloesung)). Partner successors on S/4HANA include T-Systems Solution for Healthcare (patient management, service billing, open interfaces) ([T-Systems](https://www.t-systems.com/sg/en/industries/healthcare/solutions/t-systems-solution-for-healthcare)), ATSP's s4health with HL7/FHIR, Fiori and BTP ([SAP partner listing](https://www.sap.com/latvia/products/erp/partners/atsp-gmbh-s4health-patient-management-billing-on-sap-s4hana.html)), and SnapWare GHT in 60+ DACH hospitals (search abstract). S/4HANA itself remains the finance (FI/CO), materials management, procurement and plant-maintenance backbone. **Lesson:** even SAP has exited patient management, so ProHealth should not try to be an ERP-grade GL. Own patient-financial (charges, bills, deposits, TPA) and export to an accounting/ERP system.

**Oracle Fusion Cloud.** ERP (financials, procurement), SCM and HCM. On 11 Sep 2025 Oracle announced *Fusion Cloud Advanced Inventory Management* for healthcare: embedded AI for stock levels and replenishment, PAR task assignment, and autonomous mobile robots (ST Engineering Aethon) moving supplies from stockrooms to PAR locations (press release via search abstract; oracle.com returned 403) ([Oracle press release](https://www.oracle.com/news/announcement/oracle-helps-healthcare-organizations-streamline-supply-chain-operations-2025-09-11/)). Partner tooling adds PAR-count, 2-bin and request replenishment methods ([Apps Associates PAR datasheet](https://appsassociates.com/wp-content/uploads/2025/01/PAR-Management-Workbench-Data-Sheet-AppsAccelerate-for-Healthcare.pdf)). A medical center case shows an Epic-to-Oracle integration for ~600 daily supply-usage updates, min/max replenishment and Pyxis cabinets ([Apps Associates case](https://appsassociates.com/resources/case-study/transforming-healthcare-operations-with-oracle-cloud/)). McLeod Health runs Oracle Fusion ERP + Epic + Tecsys SCM ([Tecsys case PDF](https://tecsys.com/hubfs/Case-Study/McLeod-health-three-system-cloud-solution-for-supply-chain-success.pdf?hsLang=en)).

**Workday.** Its healthcare page lists a "Single system" for finance, HR and supply data; grants budgeting and cost tracking; recruiting, onboarding and "Certification and licensure tracking"; "Staffing model support" and "Automated staffing intelligence"; supply chain with "Bill-only and consignment", "PAR and Kanban support", and "Sync with EHR and point-of-use"; "Utilisation analytics" blending clinical and business data; and ML anomaly detection for finance ([Workday healthcare](https://www.workday.com/en-ch/solutions/industries/healthcare.html)). A KPMG podcast cites a nurse-manager dashboard showing hours remaining before overtime ([Workday blog](https://blog.workday.com/en-us/2022/workday-podcast-pushing-pedal-healthcare-digital-acceleration-kpmg.html)). The healthcare datasheet PDF could not be text-extracted (compressed streams; no PDF tools installed, per the no-install rule).

**Back-office concepts ProHealth needs (even if a later ERP integration replaces them):** item master with GTIN/HSN, batch/lot and expiry; stores hierarchy (central store -> sub-stores -> ward PAR locations -> patient); indent/requisition -> PO -> GRN -> issue -> consumption (patient-chargeable vs. non-chargeable); bill-only/consignment implants charged on use; recall management; vendor and contract pricing; staff master with licensure/registration (NMC/State Council, nursing council) and expiry alerts; rosters and shift swaps; GL export (revenue by department/payer, deposits, refunds, TDS).

### 1.11 Cross-cutting evidence (CDS, interoperability, security, downtime, UX)

**Clinical decision support.**
- *Medication alerts:* drug-drug, drug-allergy and dose checks fire at order entry and pharmacist verification and are driven by a licensed drug knowledge base (commercial EHRs embed First Databank, Medi-Span or Multum; vendor-specific choice not verified here). Override rates are very high: 49-96% in a 1980-2004 review, 93% of DDI alerts in one Boston study, and allergy-alert overrides rising from 83.3% (2004) to 87.6% (2013) ([PMC review](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC9754301/), [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4187095)). **Design lesson:** tier severity, show interruptive alerts only for high severity, and log override reasons.
- *Best-practice advisories:* Epic BestPractice Advisories, SmartSets and order sets are built by "physician builders" (Epic course CLN150 covers SmartTexts, SmartPhrases, SmartLists, SmartLinks, SmartSets, Order Sets, BPAs, preference lists) ([UW ICEP CLN150](https://ce.icep.wisc.edu/node/17140)).
- *Sepsis and early warning:* NEWS2 (RCP 2017) bands are 0-4 low (ward response); a single parameter scoring 3 is low-medium (urgent ward review); 5-6 medium (key threshold, urgent response, at least hourly observations); 7+ high (emergency response by a team with critical-care skills). Scale 2 SpO2 applies only for prescribed 88-92% targets ([RCP NEWS2 thresholds PDF](https://www.rcp.ac.uk/media/2acdezkd/news2-chart-2_news-thresholds-and-triggers_0.pdf)). Proprietary predictive models need local validation: the Epic Sepsis Model's external validation at Michigan Medicine (27,697 patients, 38,455 hospitalizations) found hospitalization-level AUC 0.63, sensitivity 33% and PPV 12%; Epic disputed the threshold choice ([JAMA Intern Med 2021](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/2781313), [Healthcare IT News](https://www.healthcareitnews.com/news/research-suggests-epic-sepsis-model-lacking-predictive-power)). MEDITECH uses SSC-derived screening rules that push patients onto status boards (1.3).
- *US certification:* ONC HTI-1 replaced the CDS criterion 170.315(a)(9) with **Decision Support Interventions 170.315(b)(11)**, requiring source attributes for evidence-based and predictive DSIs ([ONC DSI fact sheet](https://www.healthit.gov/sites/default/files/page/2023-12/HTI-1_DSI_fact%20sheet_508.pdf), [ONC test method](https://www.healthit.gov/test-method/decision-support-interventions)). Oracle's per-AI-feature labeling of sources, intended use and limits (1.2) is the product expression of this.

**Interoperability standards.**
- *HL7 v2* (the in-hospital workhorse; MSH-9 carries type^trigger):
  - ADT: A01 admit, A02 transfer, A03 discharge, A04 register outpatient/ED, A08 update, A11/A12/A13 cancel admit/transfer/discharge.
  - Others: SIU^S12 new appointment; ORM^O01 general order (ORC-1 order control new/cancel/change/status); ORU^R01 observation result; DFT^P03 charge posting to billing ([HL7 Table 0003](https://terminology.hl7.org/5.3.0/CodeSystem-v2-0003.json.html), [Microsoft BizTalk HL7 events](https://learn.microsoft.com/en-us/biztalk/adapters-and-accelerators/accelerator-hl7/trigger-events-and-messages)).
  - Epic's open.epic catalogue shows the real-world breadth: ADT, MDM, scheduling, orders/results, PACS, pharmacy dispense cabinets, financial transactions, blood bank, supply usage (1.1).
- *FHIR R4* with SMART on FHIR (OAuth 2.0), Bulk Data, and CDS Hooks/FHIRcast (Epic, Oracle docs in 1.1/1.2). In India, ABDM FHIR R4 profiles (NRCeS) and NHCX (1.8-1.9).
- *X12 (US HIPAA):* version 5010 for 837 claims, 835 remittance, 270/271 eligibility, 276/277 claim status, 278 prior auth; NCPDP D.0 for retail pharmacy ([CMS adopted standards](https://www.cms.gov/about-cms/what-we-do/administrative-simplification/hipaa/adopted-standards-operating-rules)). India has no X12 equivalent. Private claims go via TPA portals and increasingly NHCX; PM-JAY via TMS.
- *DICOM* for imaging. The RIS sends modality worklists (DICOM MWL) derived from orders (HL7 ORM) and PACS returns study availability; Epic documents "Outgoing Imaging Results and Orders" to PACS (1.1). DICOMweb (WADO-RS/QIDO-RS/STOW-RS) is the web API layer (standard knowledge; not separately fetched).

**Security and privacy.**
- *Break-the-glass:* a flagged record requires users outside the care team to enter a reason (and, at some sites, re-enter their password). The access is logged, and compliance reviews it. One site allows re-access for four days after a BTG event, and another suppressed BTG during an active inpatient stay for safety ([U Iowa BTG](https://epicsupport.sites.uiowa.edu/epic-resources/break-glass), [Texas Children's](https://texaschildrensnews.org/compliance-and-privacy-spotlight-break-the-glass-epic/), [UT Southwestern](https://utsouthwestern.edu/sites/campus-news/archive/year-2020/break-the-glass.html)).
- *India DPDP:* DPDP Rules 2025 were notified 13 Nov 2025. Board provisions apply immediately, Consent Manager registration (Rule 4) from 13 Nov 2026, and core obligations (notice, consent, security safeguards, breach intimation, retention, data-principal rights) from 13 May 2027 ([Mondaq](https://www.mondaq.com/india/data-protection/1708164/digital-personal-data-protection-rules-2025-notified), [Hogan Lovells](https://www.hoganlovells.com/en/publications/indias-digital-personal-data-protection-act-2023-brought-into-force-)). NABH HIS/EMR standards explicitly align with DPDP and include Digital Application Controls and Digital Operations Management chapters (1.7).

**Downtime (business continuity).**
- *Epic tiers:* (1) Shadow Read-Only (SRO), a recent read-only snapshot of production launched from a desktop icon; (2) BCA Web, a browser snapshot; (3) BCA PCs, designated standalone workstations (on emergency power) holding periodically printed reports such as census, MAR, clinical summaries, schedules and downtime Kardex. After recovery, paper documentation and orders are back-entered ([Trinity/SPHP BCA](https://www.sphp.com/downtime/accessing-info-via-bca), [Houston Methodist BCA guide PDF](https://it.houstonmethodist.org/wp-content/uploads/2021/07/CC-Epic-BCA-Downtime-Guide_Final_Wave-1_060821.pdf)).
- *Oracle/Cerner:* the 724Access Downtime Viewer is a read-only view of labs, MAR, orders and vitals for the last 15 days. Units print downtime MARs before planned downtime and add data-entry staff for outages over 4 hours. Recovery includes back-entry of uncompleted orders and notes, with verification ([Niagara Health PDF](https://niagarahealth.on.ca/files/his_tip_sheets/HealthInformationSystemDowntimeProcedure-FINAL-08-11-2024-NoCyberArkTipSheet.pdf), [Health PEI 724 PDF](https://src.healthpei.ca/sites/src.healthpei.ca/files/CIS/Downtime%20Procedures/724_Access_%20Downtime_%20Viewer_%20May_%202025.pdf), [UCLA Olive View](https://www.uclaoliveview.org/medicine/blog/?p=1842)).

**UX evidence.**
- *ED Track Board:* configurable columns (e.g., combined Sepsis/ABX icon columns driven by documentation), vitals entry without leaving the board, Quick Triage section ([Houston Methodist](https://it.houstonmethodist.org/sepsis-and-abx-columns-combined/), [U Iowa ASAP resources](https://epicsupport.sites.uiowa.edu/epic-resources/asap-emergency-department)).
- *EVS/bed board:* discharge or transfer marks the bed dirty and auto-creates a cleaning request. Housekeepers use Rover, and managers use the EVS Command Center and Hospital Logistics Command Center to assign work and monitor productivity ([U Iowa EVS](https://epicsupport.sites.uiowa.edu/epic-resources/environmental-services-evs)).

## 2. Canonical module map for a complete hospital ERP

This is a synthesis from Section 1. Module names are generic (not any vendor's), with the closest vendor analogue in brackets.

**How the leaders share one patient record.** Epic (one Chronicles database), Millennium (one platform), Sunrise and Expanse all put every module on **one patient identity (MRN/MPI)**, **one encounter/visit spine** and **one order/result model**. Departmental modules are *views and workflows* over shared records, not separate copies. In a microservice design, ProHealth gets the same effect only if:
1. Patient (MPI) and Encounter are authoritative in one service each, and other services hold only IDs plus cached display fields.
2. Orders, results and charges use shared IDs (orderId, accessionNumber, encounterId, accountId).
3. Every state change emits a versioned event, so read-model projections (Storyboard header, worklists, bed board) can be assembled.

**Core data-model spine.**
```
Patient (MRN, ABHA no./address, demographics, allergies, problems, consents, identifiers[])
  └── Encounter / Visit (OPD | IPD | ED | Daycare | Tele; class, status, location/bed, attending, dates)
        ├── Orders (ServiceRequest / MedicationRequest; status lifecycle; ordering provider; priority)
        │     └── Results / Administrations / Dispenses / Procedures (linked by orderId / accession)
        ├── Clinical documents (notes, flowsheet rows, assessments, care plans)
        └── Charges (from orders/results/administrations/bed-days via Tariff/Chargemaster)
  Account (HAR-equivalent billing container: 1..n per encounter; package, payer, deposits, status)
    ├── Guarantor (who pays: self, employer, insurer via policy)
    └── Coverage[] (payer, TPA, policy, member ID, sum insured, room-rent cap, co-pay) → PreAuth[] → Claim[]
```
The patient/encounter/account/guarantor split is confirmed for Epic (HAR vs. guarantor account; see 1.1). Chargemaster/tariff-driven charge posting via ADT/DFT appears in Oracle job descriptions (1.2), and athenaCollector creates a placeholder "MISSING" claim at check-in to force charge capture (1.4).

| # | Module (vendor analogue) | Key entities | Key features | Owning role(s) |
|---|---|---|---|---|
| 1 | Identity & access (Epic security classes, Oracle positions) | User, Role, Permission, Department, Facility, Session, DelegatedAccess | SSO/MFA, signed short-lived tokens, RBAC + attribute rules (care-team, department), break-the-glass, sensitive-record flags, session timeout, e-signature | ADMIN, COMPLIANCE_AUDITOR |
| 2 | Patient administration & MPI (Prelude) | Patient, Identifier (MRN, ABHA, Aadhaar-masked, passport), Contact, Guarantor, Coverage, Consent, PatientMerge | Duplicate detection (probabilistic match), merge/unmerge, ABHA create/verify/link (M1), consent capture with purpose and expiry, photo/ID scan, Scan & Share token | RECEPTIONIST, front office |
| 3 | Scheduling & queue (Cadence) | Resource (doctor, room, equipment), Template, Slot, Appointment, Waitlist, Token/Queue | Templates and blocks, overbooking rules, walk-in plus appointment unified queue (Sunrise 25.1), token display, reminders, no-show tracking, tele-slots | RECEPTIONIST, scheduler |
| 4 | ADT & bed management (Grand Central) | Encounter (IPD), Bed, Room, Ward, BedRequest, Transfer, BedCleaningTask, TransportRequest | Admit/transfer/discharge, bed board with status (occupied/dirty/clean/blocked), bed requests and blocks, swap, auto-dirty plus EVS task on discharge, census, expected discharges | Admission desk, bed manager, NURSE in charge, EVS |
| 5 | Clinical documentation (EpicCare/PowerChart) | Note, Template, SmartPhrase/Macro, Problem, Allergy, MedicationStatement, Diagnosis (ICD-10), CarePlan | Specialty templates, smart phrases, structured + free text, co-sign/attest, amendments with audit, discharge summary, ambient AI draft (Art/Clinical AI Agent) | DOCTOR, NURSE |
| 6 | Orders/CPOE & order sets (SmartSets/PowerPlans) | Order (lab, imaging, med, procedure, diet, nursing, consult), OrderSet, OrderPanel, OrderFavorite | Order lifecycle (draft → signed → active → in-progress → completed/discontinued), order sets and favorites, verbal-order co-sign, CDS checks at sign | DOCTOR |
| 7 | Clinical decision support (BPA/Surveillance) | Rule, Alert, AlertResponse (override reason), ScoreRun (NEWS2/qSOFA) | Drug-drug/allergy/dose/duplicate checks via a drug knowledge base, best-practice advisories, NEWS2 auto-calc from flowsheets, sepsis screen, critical-value alerts, DSI source attributes | CMO / pharmacy and therapeutics committee |
| 8 | Pharmacy (Willow/PharmNet) | Formulary item, MedicationOrder, Verification, Dispense, MedicationAdministration (eMAR), Return, Waste, ControlledDrugRegister | Pharmacist verification queue, IP dispensing (unit dose), OP pharmacy sale with GST, batch/expiry, substitution, eMAR with barcode (BCMA: patient + drug + nurse scan), high-alert double check | PHARMACIST, NURSE |
| 9 | Laboratory (Beaker/PathNet) | LabOrder, Specimen, Accession, Container/Barcode, TestDefinition, Worklist, Result, ReferenceRange, CriticalValueNotification | Sample collection with barcode labels, accessioning, analyzer interfaces (HL7/ASTM), auto-verification, delta checks, critical-value call log, micro culture/sensitivity, NABL QC | LAB_TECHNICIAN, pathologist |
| 10 | Radiology (Radiant/RadNet + PACS) | ImagingOrder, ModalitySchedule, Study (DICOM UID), Report, Addendum | Modality worklist, protocoling, scan tracking, structured reporting, PACS viewer link, critical findings | Radiographer, radiologist |
| 11 | Perioperative / OT (OpTime/SurgiNet) | CaseRequest, OTSlot/Room, PreferenceCard, SurgicalChecklist, AnesthesiaRecord, ImplantUsage | OT scheduling, pre-op assessment, WHO checklist, intra-op timings, anesthesia record, implant capture to billing and inventory, PACU | Surgeon, anesthetist, OT nurse |
| 12 | Emergency (ASAP/FirstNet) | EDVisit, TriageAssessment (ESI/MTS), TrackingBoardEntry, Disposition, MLC record | Quick registration (unknown patient), triage acuity, tracking board with timers/icons, ED orders, disposition (admit/discharge/transfer/LAMA), medico-legal case flags (India) | ED NURSE, ED DOCTOR |
| 13 | Nursing (iView/Rover) | Flowsheet row, Assessment, NursingCarePlan, Task, HandoffNote, IntakeOutput | Flowsheets, care plans, task lists by shift, NEWS2, fall/pressure-injury risk, I/O, handoff summary (AI-drafted in Oracle/MEDITECH 2026) | NURSE |
| 14 | Patient financials / RCM (Resolute/Patient Accounting) | Tariff/Chargemaster item, PriceList (by payer), Package, Charge, Account, Deposit, Bill (interim/final), Discount, Refund, Payment, Claim, Remittance, Denial | Automatic charge capture from orders/ADT, package billing with inclusions/exclusions, deposits and running bill, discount approvals, claim scrubbing, claim state machine (athena-style), denial worklists | Billing executive, accounts |
| 15 | Insurance / TPA desk | Payer, TPA, PolicyCoverage, PreAuthRequest, Enhancement, Query, Approval, DischargeApproval, Settlement | Pre-auth with estimate, query handling, enhancement, 1h/3h SLA timers (IRDAI), NHCX FHIR exchange, PM-JAY TMS packages, document checklist, reconciliation | TPA coordinator |
| 16 | Patient engagement (MyChart/healow) | PortalAccount, Proxy, Message, Reminder, Payment, TeleVisit, Questionnaire | Login with OTP/ABHA, appointments, results release rules, bill pay, proxy/family access, tele-consult, pre-visit questionnaires, AI assistant (Emmie/MyHealth Assistant) | PATIENT |
| 17 | Supply chain & inventory (Willow Inventory, Oracle/Workday SCM) | Item, Store, Bin/PAR location, Indent, PurchaseOrder, GRN, StockLedger, Batch/Lot, Expiry, Consignment, Recall | Indent → PO → GRN → issue, PAR/2-bin replenishment, batch/expiry FEFO, consignment/bill-only implants, recall, vendor rates | Store manager, purchase |
| 18 | HR & rostering (Workday HCM) | Employee, Credential/License, Roster, Shift, Attendance, Leave, Training | Credential expiry alerts, rosters with skill mix, shift swap, overtime alerts (Workday nurse-manager dashboard), payroll export | HR, nursing superintendent |
| 19 | Finance/ERP integration (SAP/Oracle/Workday) | GLAccount mapping, JournalBatch, CostCenter | Daily revenue/deposit/refund journal export, cost centres per department, AP from GRN | Accounts |
| 20 | BI & quality (Cogito/Healthy Planet) | Metric, Dashboard, Registry, QualityIndicator, Incident | Census, ALOS, bed occupancy, OPD wait, lab TAT, revenue/AR ageing, denial rates, NABH quality indicators, incident reporting, HAI surveillance | CMO, quality manager |
| 21 | Interoperability hub (Bridges, Mirth) | InterfaceChannel, Message, AckLog, ABDM CareContext, ConsentArtefact | HL7 v2 in/out, FHIR R4 API (SMART), ABDM HIP/HIU, NHCX, DICOM MWL, device feeds, retry and dead-letter, monitoring | Integration engineer |
| 22 | Audit, privacy & consent | AuditRecord, AccessReason, Disclosure, ConsentArtefact, DataPrincipalRequest | Tamper-evident audit, access reports per patient, break-the-glass review queue, DPDP notices and rights, retention | COMPLIANCE_AUDITOR |
| 23 | Business continuity | DowntimeSnapshot, DowntimeReport, BackEntryTask | Read-only shadow, scheduled per-unit PDF census/MAR/Kardex, paper-form back-entry worklist (Epic SRO/BCA, Cerner 724) | IT, nursing |
| 24 | Ancillary services | DietOrder, LaundryBatch, CSSDSet, BloodUnit/Crossmatch, AmbulanceTrip, MortuaryRecord, Asset/Maintenance | Diet orders to kitchen, CSSD set tracking, blood bank, ambulance dispatch, biomedical equipment PM (NIC e-Hospital lists dietary, laundry, OT, store) | Respective departments |

## 3. End-to-end workflow walkthroughs

These walkthroughs synthesize the vendor material in Section 1 and Indian practice (1.7-1.9). The states are proposed canonical states for ProHealth, not any single vendor's codes, except where marked. Event names are proposed NATS subjects.

### 3.1 OPD (outpatient)

| Step | Actor | What happens | State / event |
|---|---|---|---|
| 1. Schedule | Patient (web/app/phone AI agent), receptionist | Slot from resource template; walk-ins join the same queue (Sunrise 25.1 pattern) | Appointment `BOOKED` -> `appointment.booked` |
| 2. Remind | System | SMS/WhatsApp/app reminder, pre-visit questionnaire, pay-ahead | `reminder.sent` |
| 3. Register / verify | Receptionist or self-kiosk | MPI search and duplicate check; ABHA verify/link (Scan & Share QR gives token); coverage capture; eligibility check (athenaCollector checks eligibility pre-visit) | Patient `ACTIVE`; Coverage `VERIFIED/UNVERIFIED` |
| 4. Check-in / token | Receptionist | Arrival creates the **OPD encounter + account**, prints the OP slip; consult fee collected or deferred to the account; **charge placeholder created** (athena "MISSING" pattern) | Appointment `CHECKED_IN`; Encounter `ARRIVED` -> `encounter.started` |
| 5. Triage / vitals | Nurse | Vitals, pain, weight, allergies reviewed; NEWS2 if applicable | Encounter `TRIAGED` |
| 6. Consult | Doctor | Storyboard-style header (allergies, problems, meds); note from template/smart phrases/ambient draft; ICD-10 diagnosis | Encounter `IN_CONSULT` |
| 7. Orders + eRx | Doctor | Lab/imaging orders (order lifecycle), prescription with drug-allergy/DDI checks; referral; follow-up interval | Order `SIGNED` -> `order.signed`; `prescription.signed` |
| 8. Charges | System | Consult, procedure and order charges from tariff (payer-specific price list) | Charge `POSTED` -> `charge.posted` |
| 9. Checkout / pay | Cashier | Bill, payment (cash/UPI/card), or route to insurer/corporate | Bill `FINAL`, `PAID/PARTIAL` |
| 10. Claim (if insured) | Billing/TPA | OPD claims are usually reimbursement or corporate credit in India; scrub and submit | Claim state machine (3.8) |
| 11. Close and share | System | Encounter signed and locked; ABDM care context linked; OPConsult/Prescription FHIR bundle available to HIU on consent | Encounter `FINISHED` -> `encounter.finalized`, `abdm.carecontext.linked` |
| 12. Follow-up | System/patient | Follow-up appointment suggested; results released to portal per rules | `appointment.booked` |

### 3.2 IPD / ADT

| Step | Actor | What happens | State / event |
|---|---|---|---|
| 1. Admission request | Doctor (OPD/ED) | Admission order: ward/specialty, bed class, expected LOS, provisional diagnosis, package (if any) | BedRequest `PENDING` -> `adt.admit_requested` |
| 2. Financial clearance | Admission desk / TPA | Deposit per bed class (cash) **or** pre-auth submitted (insured/PM-JAY); estimate given | PreAuth `SUBMITTED` (1h SLA) |
| 3. Bed assignment | Bed manager | Bed board: clean/available beds by ward/gender/isolation; block or assign | Bed `RESERVED`; Encounter `ADMITTED` (HL7 A01) -> `adt.admitted` |
| 4. Nursing admission | Nurse | Admission assessment, risk scores (falls, pressure, nutrition), care plan, med reconciliation | Flowsheets, CarePlan `ACTIVE` |
| 5. CPOE and order sets | Doctor | Admission order set (diet, activity, labs, IV fluids, meds, VTE prophylaxis); CDS at sign | Orders `SIGNED` |
| 6. Pharmacy verification | Pharmacist | Verify each med order (dose, renal, interactions); dispense unit-dose or ward stock; returns | MedOrder `VERIFIED` -> `DISPENSED` |
| 7. eMAR administration | Nurse | Scan wristband + drug barcode (BCMA, Epic Rover pattern) -> five-rights check -> document given/held/refused | MedAdmin `GIVEN/HELD/MISSED`; charge on administration (for ward-stock models) |
| 8. Monitoring | Nurse | Flowsheet vitals -> auto NEWS2; ≥5 urgent review, ≥7 emergency (RCP) -> alert to doctor/RRT | `ews.threshold_crossed` |
| 9. Lab/radiology | Ancillaries | See 3.6/3.7; results route to ordering doctor's in-basket; critical values phoned and logged | Result `FINAL` -> `result.finalized` |
| 10. Transfer | Doctor/bed manager | Ward/ICU transfer with handoff note; bed swap without discharge (U Iowa ADT) | HL7 A02 -> `adt.transferred`; old bed `DIRTY` -> EVS task |
| 11. Running bill / enhancement | Billing/TPA | Daily bed and nursing charges; interim bill; TPA enhancement when the bill nears the approved amount | Account `OPEN`; PreAuth `ENHANCEMENT_REQUESTED` |
| 12. Discharge planning | Doctor/nurse | Expected discharge date; discharge summary (ABDM DischargeSummary bundle), discharge meds, follow-up | Encounter `DISCHARGE_ORDERED` |
| 13. Final bill and clearance | Billing/TPA | Final bill; TPA final approval (3h SLA); patient pays non-payables; pharmacy returns cleared | Bill `FINAL`; PreAuth `FINAL_APPROVED` |
| 14. Discharge | Nurse/desk | Gate pass; bed auto-marked dirty with cleaning task (Epic EVS pattern); census updated | HL7 A03 -> `adt.discharged`; Bed `DIRTY` -> `CLEAN` -> `AVAILABLE` |
| 15. Claim and settlement | TPA desk | File claim with documents; track settlement and deductions | Claim (3.8) |

### 3.3 Emergency department

- **Arrival.** Quick registration (allows unknown/unidentified patient with a temporary MRN to merge later). The ED encounter is created on arrival (HL7 A04).
- **Triage.** A triage nurse assigns acuity (ESI 1-5 or MTS colour) plus vitals and chief complaint. A sepsis screen runs at triage (MEDITECH ships an ED-triage sepsis algorithm, 1.3).
- **Tracking board.** One row per patient with location/bed, acuity colour, time since arrival, assigned doctor/nurse, pending-order/result icons, and sepsis/antibiotic icon columns. Vitals can be entered from the board (Houston Methodist/U Iowa ASAP material, 1.11).
- **Disposition.** Admit (becomes an IPD BedRequest, then 3.2), discharge, transfer out, LAMA/DAMA, or death. India adds **MLC (medico-legal case)** registration and police intimation fields, a common Indian HIMS feature (not verified in a specific vendor source here).
- **States.** `ARRIVED -> TRIAGED -> ROOMED -> SEEN -> DISPO_DECIDED -> DEPARTED`, with door-to-doctor and door-to-disposition timers.

### 3.4 Surgery / OT

`CASE_REQUESTED` (surgeon: procedure, side/site, duration, implants, anesthesia type) -> `SCHEDULED` (OT room/slot, team) -> `PRE_OP_CLEARED` (pre-anesthesia check, consent, investigations, pre-auth for insured) -> `IN_OR` (WHO checklist sign-in / time-out / sign-out; anesthesia record; intra-op timings; implant barcode capture -> inventory consumption + patient charge) -> `IN_PACU` -> `RECOVERED` -> back to ward (transfer). OpTime coordinates pre/intra/post-op orders "through a single screen" (1.1). Supply usage flows to ERP inventory (open.epic "Outgoing Inventory Depletion" and "Incoming Procedural Supply Usage"; Oracle/Epic ~600 daily supply-usage updates, 1.10).

### 3.5 Pharmacy (inpatient + outpatient + inventory)

- **Inpatient.**
  1. A MedicationOrder is `SIGNED` by the doctor (CDS at sign).
  2. It enters the pharmacist **verification queue**: dose/route/frequency, renal/hepatic adjustment, DDI/allergy re-check, formulary substitution. It is then `VERIFIED` or `REJECTED/CLARIFY` (message back to the prescriber's in-basket). Epic Willow sends "Outgoing Verified Medication Orders" to dispensing systems (1.1).
  3. Dispensing: unit dose (cart fill), first dose (STAT), or ward/ADC stock (cabinets report dispense/return/waste back) -> `DISPENSED`.
  4. The nurse administers via barcode eMAR -> `GIVEN`. Returns and waste are recorded. Controlled drugs keep a register with witness.
- **Outpatient.** The prescription is received (eRx or paper) -> billed with GST, batch selected FEFO -> dispensed -> counselling.
- **Inventory.** Stock ledger per store and batch, reorder level/PAR, expiry alerts, near-expiry returns to vendor, indent from central store. Willow Inventory covers balances, returns/waste, transfers and PO generation (1.1).

### 3.6 Laboratory

`ORDERED` -> `COLLECTED` (barcode label printed at collection; collector, time) -> `RECEIVED/ACCESSIONED` (lab receipt; rejection reasons: haemolysed, QNS, mislabelled) -> `IN_PROCESS` (analyzer worklist via HL7/ASTM; open.epic lists incoming/outgoing orders to lab instruments) -> `RESULTED` (auto-verification rules, delta checks) -> `VERIFIED/FINAL` (pathologist sign-off for selected tests) -> `REPORTED` (to ordering doctor's in-basket and the portal per release rules; ABDM DiagnosticReport bundle). Critical values are phoned and acknowledged with a read-back log. Microbiology has `PRELIMINARY` -> `FINAL` with culture/sensitivity. Corrections create an amended result with audit. Each order also posts a charge (on order or on result, depending on policy).

### 3.7 Radiology

`ORDERED` (with clinical indication and protocol) -> `SCHEDULED` (modality slot; contrast/pregnancy checks) -> `ARRIVED` -> `IN_PROGRESS` (MWL sent to modality; study UID created) -> `COMPLETED` (images in PACS) -> `PRELIM_REPORTED` -> `FINAL_REPORTED` (radiologist signs; critical findings communicated) -> `ADDENDED` if changed. HL7 ORM/ORU or FHIR ServiceRequest/DiagnosticReport carries orders and reports, and DICOM carries images. Epic "Outgoing Imaging Results and Orders" go to PACS (1.1).

### 3.8 Billing / revenue cycle (with Indian specifics)

- **Charge capture.** Charges are posted automatically from encounter events: consult on check-in/close, bed-day and nursing charges at the census hour, lab/radiology on order or result, pharmacy on dispense/administration, OT/implants on case close. A "missing charge" worklist covers check-ins without charges (athena MISSING).
- **Pricing.** A tariff/chargemaster item has a service code, department, GST/HSN-SAC, and price lists per payer (self, corporate, insurer, CGHS, PM-JAY). Bed-category multipliers apply. **Packages** carry an inclusion list, exclusions, LOS cap and over-package rules; PM-JAY HBP packages are all-inclusive and nothing may be charged beyond the package (1.9).
- **Deposits and interim bills.** Advance deposits, running bill visible to the ward and TPA, discount approvals (with approver and reason), refunds.
- **Claim lifecycle.** Model on athenaOne's explicit owner-per-state machine (1.4), adapted:

```
DRAFT -> SCRUB_HOLD (front-desk/doctor fix) | MANAGER_HOLD (config/credential issue)
      -> READY (passed scrub rules) -> SUBMITTED (TPA portal / NHCX / TMS)
      -> QUERY (payer asks for docs) -> RESUBMITTED
      -> APPROVED/SETTLED (with deductions, TDS) -> CLOSED
      -> DENIED -> APPEALED -> SETTLED | WRITTEN_OFF
      FOLLOWUP alarm when SUBMITTED exceeds payer TAT; TIMELY_FILING_RISK before the deadline
```
- **Pre-auth lifecycle (India).** `DRAFT -> SUBMITTED -> QUERY -> APPROVED (amount) | PARTIAL | DENIED -> ENHANCEMENT_REQUESTED -> ENHANCED -> FINAL_SUBMITTED -> FINAL_APPROVED`, with 1h/3h SLA timers per IRDAI (1.9).
- **Coding.** ICD-10 diagnoses (ICD-10-PCS/CPT are rarely used in India), with procedure codes from tariff/package masters. US vendors add coding AI (Epic Penny, athena Express coding, MEDITECH Claim Denial Agents).
- **US analogues** for reference: X12 837 out, 835 remittance in, 270/271 eligibility, 276/277 status, 278 prior auth (1.11).

## 4. UX patterns that make the leaders effective

| Pattern | Evidence (Section 1) | How ProHealth should apply it |
|---|---|---|
| **Persistent patient header / sidebar** | Epic Storyboard: always-visible left column with demographics, allergies, problems, meds, SDOH, shared across desktop, mobile and portal; replaced the older header to cut clicks and screen jumps (1.1) | One `PatientBanner` component across ClinicalWorkbench, nursing, pharmacy and billing: name, age/sex, MRN + ABHA, allergies (red), code status, isolation, encounter/bed, attending, payer/package, NEWS2 chip. Feed it from a read-model API, not N service calls |
| **Role-based home dashboards / status boards** | MEDITECH role-based status boards that surveillance populates (1.3); Sunrise role-based views (1.5); Oracle MPages with user add/reorder/hide components (1.2); Epic Radar dashboards (Connect Care list) | Replace hardcoded `AnalyticsDashboard` with per-role landing pages: reception queue, doctor's list + in-basket, nurse unit board, pharmacist verification queue, lab worklist, billing hub, TPA SLA board, admin census |
| **Worklists and in-basket** | Epic In Basket for results, portal messages, refills (1.1); athenaOne claim worklists and owner-per-status workflow dashboard (1.4); Sunrise three-tab billing hub (1.5) | A generic `worklist` primitive (filter, sort, assign, SLA timer, bulk action) reused for in-basket, verification, specimen receipt, claim holds and pre-auth queries. Every task has an owner role and state |
| **Unified queue (appointments + walk-ins)** | Sunrise 25.1 unified list with mini-views for one-click patient switching (1.5); ABDM Scan & Share token flow (1.8) | Merge ReceptionDesk's appointment list with walk-in tokens; token display screen; QR self-registration |
| **Global patient search with fuzzy matching** | Sunrise 25.1 queries "without exact search terms" (1.5); Epic Patient $match FHIR operation (1.1) | Search by name (phonetic/fuzzy), MRN, ABHA, phone, DOB; show duplicate-risk warnings at registration |
| **Order sets, favorites, preference lists** | Epic SmartSets, Order Sets, Order Panels, preference lists built by physician builders (CLN150, 1.11); Sunrise patient-level order entry (1.5) | `OrderSet` entity (versioned, department-owned), personal favorites, default doses; sign-all with one CDS pass |
| **Smart phrases and templates** | Epic SmartPhrases, SmartLinks (pull live data), SmartLists (pick lists) (1.11); Oracle PowerForms with favorites (1.2) | Note templates per specialty; `.phrase` expansion; tokens like `@VITALS@`, `@ALLERGIES@`, `@MEDS@` resolved from the record |
| **Flowsheets** | Oracle iView bands and sections with a default 24h window (1.2); Epic Rover BCMA to MAR (1.1) | Time-columned flowsheet for vitals/I-O/assessments, with NEWS2 computed per column |
| **ED tracking board** | Epic ASAP track board with configurable icon columns (sepsis/ABX), vitals from the board, Quick Triage (1.11) | Board with acuity colour, timers, pending-order/result icons, sepsis flag, click-to-chart |
| **Bed board + EVS loop** | Grand Central bed planning; discharge auto-marks bed dirty and creates a cleaning request; EVS Command Center (1.1, 1.11) | Ward grid with bed states; `adt.discharged` -> EVS task -> `bed.cleaned` -> available |
| **Mobile app per role** | Epic Rover (nurse, BCMA, EVS), Haiku/Canto (doctor); MEDITECH Expanse Now / Point of Care (1.1, 1.3) | PWA views for nurse eMAR scanning and doctor rounds lists before native apps |
| **Ambient AI documentation with human review** | Epic AI Charting (notes + suggested orders); Oracle nurse agent -> discrete flowsheet fields after review; MEDITECH nurse assessments with a completeness checklist; Altera Thread AI; athena multi-model marketplace (1.1-1.6) | Phase-3 add-on: draft-only output into the note/flowsheet, explicit accept, provenance tags, never auto-sign |
| **AI provenance labeling** | Oracle labels each AI capability's sources, intended use, limitations and risks (1.2); ONC DSI source attributes (1.11) | Every CDS/AI card shows its rule or model, version, inputs, and "why" |
| **Alert hygiene** | DDI/allergy override rates of 49-96% (1.11) | Severity tiers; interruptive only for contraindicated/high; mandatory override reason; monthly override analytics |
| **Peer benchmarking** | athena "Live Benchmarking" by state/specialty (1.4) | Later: multi-tenant benchmarks (OPD wait, LOS, denial rate) if ProHealth runs as SaaS |
| **Keyboard-first navigation** | Not verified from sources fetched (Epic has extensive keyboard use per common knowledge; treat as unverified) | Command palette (Ctrl+K) for patient search/actions, shortcut keys on worklists, tab-order discipline on forms |
| **Downtime viewers** | Epic SRO/BCA; Cerner 724Access (1.11) | Read-only replica mode plus a scheduled per-ward PDF (census, MAR, allergies, active orders) |

## 5. Gap analysis

**Method.** "ProHealth today" was confirmed by reading `packages/contracts/src/index.ts`, `packages/events/src/index.ts`, `packages/audit-client/src/index.ts`, `apps/*/src/index.ts`, `apps/api-gateway/src/security.ts`, `apps/patient-service/src/database.ts` and the ERP components (read-only; nothing was run, so runtime behaviour is inferred from code). Priorities: **P0** = safety/security or a blocker for any real deployment or NABH/ABDM certification; **P1** = core hospital operations; **P2** = differentiators/scale.

**Code-level findings that change priorities (verify by test before fixing):**
1. **Tokens are forgeable.** `auth-service/src/index.ts:74` issues `tok_` + base64(JSON session), unsigned. The gateway decodes it (`security.ts` `decodeSession`). `apps/erp/src/components/LoginScreen.tsx:135-142` also mints tokens *client-side* from `PRESET_STAFF_USERS` with hardcoded passwords when the gateway call fails. Anyone can craft an ADMIN token.
2. **RBAC helper unused.** `requireRoles` (`security.ts:264`) is defined but never applied. `enforceRecordLevelSecurity` only restricts the PATIENT role and the audit and user-provisioning routes. Anonymous `GET /api/v1/patients` (patient registry) and `GET /api/v1/appointments` fall through to `next()` (`security.ts:356-388`). `GET /api/v1/auth/users` lists all users with no check (`auth-service/src/index.ts:100`). Patient isolation on clinical routes checks only the `patientId` query, not `GET /encounters/:id` (`security.ts:341-350`).
3. **Identity headers are trusted.** Services read `x-user-id/name/role` for audit attribution and fall back to hard-coded actors (e.g., `clinical-service/src/index.ts:47-49` defaults to `doc_sarah`). The gateway overwrites these only when a token is present, and CORS allows clients to send `X-User-Role`, so audit attribution is spoofable.
4. **The event bus is write-only.** Services publish (`appointment.created`, `clinical.encounter_finalized`, `audit.logged`), but no service subscribes (no `.subscribe(` in `apps/`). Without `NATS_URL`, the in-memory bus is per-process (`events/src/index.ts:64`), so events cannot cross services. With NATS, `nc.publish` is core NATS, not JetStream (`events/src/index.ts:84`), so there is no persistence or replay despite the "JetStream" naming. Event-driven modules (billing on charge events, ABDM linking on encounter close) need a durable bus first.
5. **MPI integrity.** The MRN is `MRN-2026-` + a random 5-digit number (`patient-service/src/database.ts:137-139`) under a UNIQUE constraint. Collisions become likely after a few hundred patients (birthday problem), and the year is hard-coded. There is no duplicate detection, search is SQL `LIKE`, and `consentGiven` is always `true` (`database.ts:168`).
6. **Encounters are created already FINALIZED** (`clinical-service/src/index.ts:113`). There is no draft/sign/amend lifecycle, although the contract has `OPEN|FINALIZED|AMENDED`. `labOrders` is `string[]` and prescriptions are free text (`contracts/src/index.ts:189-216`).
7. **Appointments** are created directly `CONFIRMED` with no slot-capacity or double-booking check, and `PATCH /:id/status` accepts any transition (`appointment-service/src/index.ts:64-150`).
8. **ERP mock surfaces.** `AnalyticsDashboard.tsx` and `IntegrationPipeline.tsx` make no API calls (static data). `StaffProvisioningCenter.tsx` only POSTs new users. ICD-10 is a hardcoded short list (`ClinicalWorkbench.tsx:68`).

### 5.1 Platform, identity, security, data

| Capability | How leaders do it | ProHealth today | Priority | Suggested implementation |
|---|---|---|---|---|
| Authentication tokens | SSO/MFA, signed sessions; SMART/OAuth 2.0 for APIs (Epic, Oracle docs) | **Partial (unsafe):** unsigned base64 token, client-side minting (finding 1) | P0 | `auth-service`: argon2/bcrypt hashes, RS256/EdDSA JWT (15-min access + rotating refresh), JWKS endpoint, gateway verifies the signature; remove the LoginScreen fallback; optional TOTP MFA for staff; OIDC later |
| RBAC + record-level access | Security classes/positions per role; care-team + department scoping | **Partial:** 9 roles in contracts; RLS for PATIENT only; `requireRoles` unused (finding 2) | P0 | Gateway policy table (route × method × role) enforced default-deny; attribute checks (care team, department, own record) in services; deny anonymous reads except public directory endpoints |
| Trusted identity propagation | Server-side session context | **No:** spoofable `x-user-*` headers (finding 3) | P0 | Gateway strips inbound `x-user-*`, re-signs an internal context (signed header or mTLS + JWT pass-through); services reject requests not from the gateway |
| Break-the-glass | Reason prompt + password re-entry, audit, compliance review, time-boxed re-access (Epic sites, 1.11) | **Partial:** `BREAK_GLASS_OVERRIDE` audit action and `clinicalReason` field exist; no sensitive-record flag or enforcement | P1 | `patient-service`: `sensitivity` flag (VIP, psychiatric, HIV, MLC); gateway returns 423 + reason required; `audit-service` BTG review worklist; `audit.btg_used` event |
| Audit trail | Access logs, per-patient access reports | **Yes (strong):** SHA-256 hash chain, integrity verify, disclosure accounting (`apps/audit-service`) | P1 (harden) | Fix actor attribution (finding 3); add the `SEARCH` action on list endpoints; immutable store (append-only table + periodic anchor hash); export for NABH/DPDP audits |
| Consent (DPDP, ABDM) | ABDM consent artefacts; DPDP notice/consent by 13 May 2027 (1.11) | **Partial:** boolean `consentGiven`, always true (finding 5) | P0 | New `consent` module in `patient-service`: Consent{purpose, scope, grantedAt, expiresAt, revokedAt, channel, artefactId}; notice versions; data-principal request workflow |
| Durable eventing | Interface engines with ack/retry (Epic Bridges asynchronous acks, 1.1) | **Partial:** publish-only, non-durable (finding 4) | P0 (before new modules) | NATS JetStream streams per domain, durable consumers, an outbox table per service, idempotent handlers, dead-letter subject; contract-versioned event schemas in `packages/contracts` |
| MPI quality | Duplicate detection, merge/unmerge, multiple identifiers | **Partial:** MRN + demographics; random MRN, no dedupe (finding 5) | P0 | `patient-service`: sequence-based MRN per facility; Identifier[] (ABHA no., ABHA address, Aadhaar last-4 only, passport); fuzzy match on name/DOB/phone; `patient.merged` event consumed by all services |
| Downtime / BCA | SRO read-only shadow, BCA PCs with printed census/MAR/Kardex, back-entry (1.11) | **No** | P1 | `reporting` job: per-ward PDF every 2h (census, allergies, active meds/MAR, orders) to a local share; read-only replica mode in the ERP; back-entry worklist |
| Multi-facility master data | Facility/department/location hierarchy (Epic multi-facility bed planning) | **Partial:** departments + doctors seed (`contracts/src/seed-data.ts`) | P1 | `org` data in `auth-service` or a new `masters-service`: Facility, Department, Location (ward/room/bed), ServiceCatalog, Tariff, Payer |

### 5.2 Clinical and operational modules

| Capability | How leaders do it | ProHealth today | Priority | Suggested implementation |
|---|---|---|---|---|
| OPD scheduling and queue | Templates, slots, walk-ins in one list (Cadence; Sunrise 25.1), reminders, Scan & Share tokens | **Partial:** departments, doctors, slot strings; statuses SCHEDULED..NO_SHOW; 5-step public booking (`apps/appointment-service`, `apps/website`, `ReceptionDesk.tsx`) | P1 | `appointment-service`: ResourceSchedule/Template/Slot tables with capacity, transactional booking (unique slot index), status transition guard, Token/Queue entity with display endpoint; events `appointment.booked/checked_in/no_show` |
| Check-in -> encounter + account | Check-in creates the visit and billing container; missing-charge placeholder (athena) | **No:** check-in only changes appointment status | P1 | `clinical-service` subscribes to `appointment.checked_in` -> creates Encounter(ARRIVED); `billing-service` (new) creates Account + placeholder charge |
| Encounter lifecycle | Draft, sign, attest, amend with audit | **Partial:** OPD/IPD/EMERGENCY types; created FINALIZED (finding 6) | P0 | States ARRIVED -> IN_PROGRESS -> SIGNED -> AMENDED; `POST /encounters/:id/sign`, `/amend` (reason, diff in audit); notes as separate versioned Documents |
| IPD / ADT and bed board | Grand Central: ADT, bed planning, bed requests/blocks/swap, EVS loop, transport (1.1) | **No** (IPD is only an encounter type) | P1 | New `adt-service`: Ward, Room, Bed(status), BedRequest, Admission, Transfer, Discharge; HL7-equivalent events `adt.admitted/transferred/discharged`, `bed.status_changed`; ERP bed board grid; EVS tasks |
| CPOE and order lifecycle | Orders with lifecycle, order sets/favorites, CDS at sign (EpicCare, PowerChart) | **No:** `labOrders: string[]` | P1 | New `orders-service`: Order{type, code, priority, status, encounterId, orderer}, OrderSet (versioned), favorites; states DRAFT -> SIGNED -> ACTIVE -> IN_PROGRESS -> COMPLETED/DISCONTINUED/CANCELLED; `order.signed` routes to lab/rad/pharmacy |
| Medication CDS | Drug-drug/allergy/dose/duplicate checks via a licensed knowledge base; tiered alerts; override reasons | **No:** allergies shown only (`ClinicalWorkbench.tsx:299`) | P0 (once eRx is used clinically) | New `cds-service`: CDS Hooks-style `order-sign` endpoint; drug knowledge base (licensed Indian drug database, or FDB/Medi-Span-type license; open data such as RxNorm lacks Indian brands, so choose a vendor); AlertResponse table; severity tiers |
| Early-warning scores / sepsis | NEWS2 bands (RCP); MEDITECH surveillance boards; validate predictive models locally (Epic ESM study) | **Partial:** single VitalSigns snapshot per encounter; no score | P1 | `clinical-service` flowsheet rows (time series); NEWS2 calculator (deterministic, rule-sourced); `ews.threshold_crossed` -> nurse/doctor worklist + board icon; qSOFA/SIRS screen at ED triage |
| Nursing (flowsheets, care plans, handoff) | iView flowsheets; Rover mobile; AI handoff summaries (Oracle, MEDITECH 2026) | **No** (NURSE role only) | P1 | `nursing` module in `clinical-service` (or new `nursing-service`): FlowsheetRow, Assessment, CarePlan, Task, IntakeOutput, Handoff |
| Pharmacy verification + dispensing | Willow/PharmNet verification queue, unit dose, ADC interfaces, inventory (1.1) | **No** (PHARMACIST role only) | P1 | New `pharmacy-service`: Formulary, MedicationOrder (from `order.signed`), Verification, Dispense, Return; OP pharmacy sale with GST + batch; events `med.verified/dispensed` |
| eMAR + barcode (BCMA) | Rover scan wristband + drug; files to MAR (1.1) | **No** | P1 | `pharmacy-service` MedicationAdministration; wristband barcode/QR printing in ADT; PWA scanner (camera) for nurses; five-rights validation; `med.administered` -> charge |
| LIS | Beaker/PathNet: core lab, micro, AP; analyzer interfaces; closed-loop results (1.1-1.2) | **No** (LAB_TECHNICIAN role, `LAB_RESULT` audit type only) | P1 | New `lab-service`: Specimen, Accession(barcode), TestCatalog, ReferenceRange, Result, CriticalValueCall; HL7 v2 ORM/ORU or ASTM via `integration-service`; FHIR DiagnosticReport; `result.finalized` -> in-basket + portal |
| Radiology / PACS | RIS + PACS via HL7/DICOM (Radiant, RadNet) | **No** | P2 | Integrate an open-source PACS (e.g., Orthanc/dcm4chee) rather than build; `orders-service` imaging orders -> MWL; report entity in `lab-service` or new `radiology-service` |
| OT / perioperative | OpTime: scheduling, pre-op, anesthesia, single-screen periop orders; implant -> inventory/billing | **No** | P2 | New `ot-service`: CaseRequest, OTSchedule, Checklist(WHO), AnesthesiaRecord, ImplantUsage -> `inventory.consumed` + `charge.posted` |
| ED triage + tracking board | ASAP/FirstNet: triage, color-coded board, timers, sepsis icons (1.11) | **Partial:** `EMERGENCY` encounter type, `EMERGENCY_TRAUMA` appointment type, public symptom triage | P1 | `clinical-service` ED encounter states + TriageAssessment (ESI/MTS) + MLC fields; ERP tracking board view fed by an encounter read model |
| Clinical documentation productivity | SmartPhrases/SmartLinks/templates; ambient AI (Epic, Oracle, MEDITECH, Altera, athena, eCW, NextGen) | **Partial:** single free-text note + short ICD-10 list | P1 (templates) / P2 (ambient) | Template + phrase library in `clinical-service`; full ICD-10 (WHO) code table with search; ambient AI later as a draft-only, human-accept feature with provenance |
| In-basket / worklists | Epic In Basket; athena claim worklists | **No** | P1 | New `tasks` capability (shared library + table per service, or a `worklist-service`): Task{type, ownerRole/user, patient, dueAt, state}; ERP universal worklist UI |

### 5.3 Revenue cycle, India integration, engagement, back office, analytics

| Capability | How leaders do it | ProHealth today | Priority | Suggested implementation |
|---|---|---|---|---|
| Tariff / chargemaster + payer price lists | Chargemaster-driven charge posting (Oracle ADT/DFT postings, 1.2); HB/PB accounts (Epic) | **No:** only `consultationFee` on Doctor/Appointment | P0 (for any paying deployment) | New `billing-service`: ServiceItem(code, dept, HSN/SAC, GST rate), PriceList(payer, bed class), Package(inclusions, exclusions, LOS cap) |
| Charge capture | Automatic from clinical events; missing-charge worklist (athena MISSING) | **No** | P0 | `billing-service` consumes `encounter.started`, `order.signed/result.finalized`, `med.dispensed/administered`, `adt.*` (bed-days via census job), `ot.case_closed` -> Charge; idempotency by source event ID |
| Account / guarantor / coverage model | Patient -> encounter -> HAR -> guarantor + coverages (Epic, 1.1) | **Partial:** `insuranceProvider`, `insurancePolicyNumber` strings on Patient | P0 | `billing-service` Account(encounterId, payerMix, status), Guarantor, Coverage(payer, TPA, policy, member, sumInsured, roomRentCap, copay) |
| Deposits, interim and final bill, refunds, discounts | Indian HIMS standard (1.7); Sunrise billing hub tabs (1.5) | **No** | P0 | Deposit, Bill(INTERIM/FINAL), BillLine, Discount(approver, reason), Refund, Payment(UPI/card/cash; gateway integration); GST invoice numbering; `bill.finalized` |
| TPA pre-auth + enhancements | IRDAI 1h/3h SLA; pre-auth, query, enhancement, final approval (1.9) | **No** | P1 | New `insurance-service` (or a module of billing): PreAuth state machine (3.8), document checklist, SLA timers, TPA worklist; `preauth.*` events |
| Claims + denials | athena owner-per-state claim machine and rules engine; AI denial agents (MEDITECH, athena) | **No** | P1 | `insurance-service` Claim state machine (3.8), scrub rules table (payer-specific), denial reasons, settlement/TDS reconciliation; AI appeal drafting later (P2) |
| PM-JAY / government schemes | HBP packages; TMS mandatory pre-auth (1.9) | **No** | P2 (P1 if targeting empanelled hospitals) | Package master import; TMS remains a separate portal, so start with package pricing + document export |
| NHCX | FHIR R4 eligibility, pre-auth, claim, payment notice, async callbacks (1.9) | **No** | P2 | `integration-service` NHCX adapter (FHIR Claim/ClaimResponse/CoverageEligibility*), callback correlation table |
| ABDM M1 (ABHA) | KareXpert claims M1-M3; NIC e-Hospital integrated; Scan & Share (1.7-1.8) | **No** | P0 for India go-to-market | New `abdm-service`: ABHA create/verify (OTP), ABHA address, profile share/Scan & Share token -> `patient-service` Identifier + `appointment-service` token |
| ABDM M2 (HIP) | Discovery, care-context linking, consent notify, encrypted FHIR push (1.8) | **No** | P0 (NABH HIS/EMR needs M3, which implies M1-M2) | `abdm-service`: gateway callbacks (async 202 pattern), CareContext per encounter (on `encounter.finalized`), FHIR bundle builders (OPConsult, Prescription, DiagnosticReport, DischargeSummary), Fidelius ECDH/AES-GCM encryption, consent artefact store |
| ABDM M3 (HIU) | Consent request, fetch and decrypt external records (1.8) | **No** | P1 | `abdm-service` HIU flows; "External records" tab in the patient chart |
| NABH Digital Health HIS/EMR certification | Basic/Advanced; requires 3 live hospitals + ABDM M3; chapters AAC, COP, MOM, DAC, DOM, FPM, HRM, IMS (1.7) | **No** (references NABH in audit contract comments) | P1 (product goal) | Obtain the standard PDF; map each objective element to features; track it as a compliance matrix in the repo |
| Interoperability engine (HL7 v2, FHIR API) | open.epic HL7v2 catalogue; FHIR R4 + SMART + Bulk (Epic, Oracle) | **No:** `IntegrationPipeline.tsx` is a static mock | P1 | New `integration-service`: HL7 v2 MLLP listener/sender (ADT A01-A13, ORM/ORU, SIU, DFT), mapping to internal events; FHIR R4 facade (Patient, Encounter, Observation, ServiceRequest, DiagnosticReport, MedicationRequest, Appointment, Coverage) with SMART scopes; note the Mirth Connect licence change (1.6) |
| Patient portal + app | MyChart: scheduling, results, bills, proxy, video visits; AI assistant (Emmie, MyHealth Assistant) | **No:** public Next.js site with booking, no login; PATIENT role + RLS exist | P1 | `apps/website` patient login (mobile OTP / ABHA), my appointments, results (release rules), bills/payments, prescriptions, proxy access; reuse gateway PATIENT isolation |
| Telehealth | MyChart video visits; healow TeleVisits; Insta DHA teleconsult | **Partial:** `TELEHEALTH_VIRTUAL` appointment type only | P2 | `appointment-service` tele-slot + video room link (WebRTC vendor); e-consent; follow Telemedicine Practice Guidelines (India) |
| Reminders / notifications | Reminders, AI contact centre (healow Genie), AI prior-auth calls (athena) | **No:** `appointment.created` published, no consumer | P1 | New `notification-service` consuming events: SMS/WhatsApp/email templates, DLT-registered SMS (India), opt-out per consent |
| Inventory and procurement | Willow inventory; Oracle Advanced Inventory (PAR, AI replenishment); Workday PAR/Kanban, bill-only, EHR sync (1.10) | **No** | P1 | New `inventory-service`: Item, Store, Batch, StockLedger, Indent, PO, GRN, Issue, PAR level; consumes `med.dispensed`, `ot.implant_used`; emits `stock.low`, `batch.near_expiry` |
| HR and rostering | Workday credential/licence tracking, staffing intelligence, overtime dashboards (1.10) | **Partial:** staff user provisioning only; staff lists are mock | P2 | `hr-service` (or extend `auth-service`): Employee, Credential(expiry), Roster, Shift, Leave; nurse-to-bed ratios from the ADT census |
| BI and analytics | Cogito (Clarity/Caboodle/SlicerDicer); athena Live Benchmarking; MEDITECH status boards | **Partial:** `AnalyticsDashboard.tsx` hardcoded | P1 | Read-model/warehouse fed from events (Postgres reporting schema or DuckDB/ClickHouse later); KPIs: OPD wait, census, ALOS, occupancy, TAT, revenue, AR ageing, denial rate, NABH quality indicators |
| Finance / ERP back office | SAP/Oracle/Workday GL, AP, procurement; SAP exited patient management (1.10) | **No** | P2 | Do not build a GL; daily journal export (CSV/API) to Tally/Zoho/SAP Business One/Oracle; cost-centre mapping |
| Downtime-safe printing | Downtime MAR/Kardex/census (1.11) | **No** | P1 | See 5.1 Downtime row |

## 6. Phased roadmap

Durations assume a small team and are indicative only. Ordering follows dependencies: nothing event-driven should be built before the bus is durable, and no money or PHI should flow before tokens are signed.

### Phase 0: Make the foundation safe (about 3-5 weeks)
- **Auth:** signed JWT with JWKS and refresh; password hashing; remove client-side token minting in `LoginScreen.tsx`; MFA for ADMIN/CMO/COMPLIANCE.
- **Access control:** gateway default-deny policy matrix using `requireRoles` plus attribute checks; strip inbound `x-user-*`; lock down `GET /auth/users`, `/patients`, `/appointments` and `/clinical/encounters/:id`.
- **Events:** JetStream streams + durable consumers + transactional outbox; versioned event schemas in `packages/contracts`.
- **MPI:** sequence-based MRN; Identifier[]; duplicate-match on create; `patient.merged`.
- **Encounters:** lifecycle (draft/sign/amend) with audit diffs; real actor attribution in audit.
- **Consent:** Consent entity (purpose, scope, expiry, revocation) replacing the boolean.
- **Exit criteria:** a pen-test checklist passes (token forgery, IDOR, header spoofing); events survive a service restart.

### Phase 1: Revenue-ready OPD + ABDM identity (about 2-3 months)
- **Scheduling:** templates, slot capacity, transactional booking, walk-in + appointment unified queue, token display, Scan & Share.
- **Check-in:** check-in -> Encounter + Account (event-driven).
- **`billing-service` v1:** tariff/price lists, packages (basic), auto charge capture, OPD bill/payment (UPI/card/cash), GST invoice, refunds, discount approvals, daily journal export.
- **`orders-service` v1** (lab and imaging orders with lifecycle, favorites) + **`lab-service` v1** (barcode specimen -> manual result entry -> verify -> report; critical-value log).
- **`notification-service`:** reminders, results-ready, bill links.
- **`abdm-service` M1 + M2:** ABHA create/verify/link, care-context linking on encounter sign, OPConsult/Prescription/DiagnosticReport bundles, consent artefacts, encryption. Start sandbox certification early, since it gates NABH.
- **UX:** shared PatientBanner, universal worklist, role-based home pages, real analytics from read models (retire the mock `AnalyticsDashboard`/`IntegrationPipeline`), command-palette patient search.
- **Patient portal v1:** OTP login, appointments, reports, bills, payments.
- **Exit criteria:** an OPD can run a full day (book -> token -> consult -> orders -> lab report -> bill -> ABHA-linked record) with no mock data.

### Phase 2: Inpatient core, medication safety, insurance (about 3-4 months)
- **`adt-service`:** wards/rooms/beds, admission/transfer/discharge, bed board, bed requests, EVS loop, census job (bed-day charges).
- **Nursing:** flowsheets, assessments, care plans, I/O, NEWS2 auto-score with escalation worklists, handoff notes.
- **`pharmacy-service`:** formulary, verification queue, IP dispensing, OP pharmacy with batch/GST; **eMAR with barcode/QR scanning** (PWA camera).
- **`cds-service`:** order-sign hook; drug-allergy, DDI, duplicate and dose checks on a licensed drug knowledge base; tiered alerts with override reasons; DSI-style source display.
- **`insurance-service`:** coverage, pre-auth/enhancement/final-approval state machine with IRDAI SLA timers, TPA worklist, claims with scrub rules, settlement reconciliation.
- **`inventory-service` v1:** item/batch/store, indent -> PO -> GRN -> issue, consumption from dispense, expiry/low-stock alerts.
- **ED:** quick registration, triage (ESI/MTS), tracking board, disposition, MLC fields.
- **Discharge:** discharge summary template + ABDM DischargeSummary bundle; final bill clearance checklist.
- **Downtime:** scheduled per-ward PDFs and read-only mode.
- **ABDM M3 (HIU)**, then apply for M3 certification.
- **Exit criteria:** one ward runs admit -> eMAR -> discharge -> TPA final approval end to end; DDI/allergy alerts fire on test cases.

### Phase 3: Breadth, interoperability, certification, AI (about 4-6 months)
- **`integration-service`:** HL7 v2 MLLP (ADT/ORM/ORU/SIU/DFT), analyzer interfaces (HL7/ASTM), FHIR R4 facade with SMART scopes; message monitor replacing the mock pipeline.
- **Radiology:** RIS workflow + open-source PACS integration (DICOM MWL, viewer link, reports).
- **`ot-service`:** case requests, OT scheduling, WHO checklist, anesthesia record, implant capture -> inventory + billing.
- **India payer rails:** NHCX adapter; PM-JAY package master and claim document packs.
- **HR:** rostering and credential-expiry tracking (`hr-service`).
- **BI:** warehouse; NABH quality indicators; AR ageing, denial and TAT dashboards; multi-site benchmarks.
- **NABH Digital Health HIS/EMR certification application:** needs 3 live hospital deployments + a valid ABDM M3 certificate; target Basic first, then Advanced.
- **AI (draft-only, human-accept, provenance-labelled):**
  - ambient note drafting;
  - nurse voice-to-flowsheet;
  - discharge-summary drafting;
  - denial-appeal drafting;
  - patient chatbot for scheduling.
- **Telehealth:** tele-consults (video vendor + e-consent).
- **Exit criteria:** NABH application submitted; at least one analyzer and one PACS integrated in production.

### Proposed service map after Phase 3
`api-gateway`, `auth-service` (+ org masters), `patient-service` (MPI, consent), `appointment-service` (+ queue), `clinical-service` (encounters, notes, flowsheets, ED), `adt-service`, `orders-service`, `cds-service`, `pharmacy-service` (+ eMAR), `lab-service`, `radiology-service` (thin, PACS-backed), `ot-service`, `billing-service`, `insurance-service`, `inventory-service`, `hr-service`, `notification-service`, `abdm-service`, `integration-service`, `audit-service`, `reporting-service` (read models/BI). Shared: `packages/contracts` (versioned DTOs + event schemas), `packages/events` (JetStream + outbox), `packages/audit-client`.

## Appendix: source log and fetch failures

**Fetched successfully (primary or near-primary):** open.epic.com HL7v2 catalogue; fhir.epic.com; Alberta Connect Care Epic glossary pages (modules, Grand Central, Prelude, ASAP, Willow, Beaker, OpTime, Resolute, Healthy Planet, Storyboard, analytic tools); mychart.org; University of Iowa Epic support pages (via search abstracts); TriHealth Storyboard; HLTH (Epic AI Charting; Oracle nurse agent); Healthcare Dive and Advisory Board (Oracle new EHR); docs.oracle.com Millennium Platform APIs; ehr.meditech.com Expanse; Pulse+IT (MEDITECH Apr 2026); help.athenahealth.com (athenaCollector, Claim Status); TechTarget (athena Jun 2026); alterahealth.com (Sunrise, 25.1 release); karexpert.com; instahms.com; nabh.co (Digital Health programme page; Suvarna listing); ehospital.gov.in; Workday healthcare page.

**Failed or blocked (noted and skipped):**
- **HTTP 403:** epic.com detail pages (no module text), oracle.com (Clinical AI Agent page and press releases), athenahealth.com marketing/press pages, Becker's, Fierce Healthcare, Healthcare IT News (Oracle EHR article), HIT Consultant (Epic AI article), Business Wire (MEDITECH Sep 2025).
- **Certificate or redirect errors:** regionh.dk Epic module PDF (security-check redirect), nrces.in ABDM FHIR IG (TLS certificate rejected), ehrsource.com (expired certificate).
- **No text extracted:** sandbox.abdm.gov.in and abdm.gov.in (JavaScript apps); Workday healthcare datasheet PDF (compressed streams; no PDF tooling installed, per the no-install rule); NHS England NEWS2 page (empty).
- **Third-party sourcing:** Bahmni Confluence parent page was truncated; child-page facts came from search abstracts.

**Not verified / flagged in text:** KLAS market-share figures (secondary coverage only); Epic-Microsoft Dragon relationship for AI Charting; Oracle "Foundation EHR" naming vs. Millennium; acute-care GA of Oracle's new EHR; athenaAmbient GA date; eClinicalWorks inpatient product; Birlamedisoft NABH status; Insta HMS ABDM/NABH status (third-party only); ABDM milestone boundaries (sources disagree) and current API version (v0.5 vs v3); IRDAI circular text (press coverage only); keyboard-first navigation claims; exact drug knowledge base used by each EHR.

**No browser was used.** All research used WebSearch and WebFetch. No project files were modified. The only file written is this report.

