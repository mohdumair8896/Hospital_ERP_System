import React, { useState, useEffect } from "react"
import {
  Stethoscope,
  Activity,
  Pill,
  FileText,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Video,
  FileCodeIcon,
  XIcon,
  Archive,
  Edit3,
  MessageSquare,
  Paperclip,
  Sparkles,
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Shimmer } from "@/components/ui/shimmer"
import { UserSession, Patient, ClinicalEncounter, PrescriptionItem } from "@hospital/contracts"
import { API_BASE_URL } from "@/lib/api"

// UI Component Integrations
import { AvatarLabelGroup } from "@/components/base/avatar/avatar-label-group"
import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { Button } from "@/components/base/buttons/button"
import { Badge } from "@/components/ui/badge"
import { BadgeGroup } from "@/components/base/badges/badge-groups"
import { Switch } from "@/components/ui/switch"
import {
  Bubble,
  BubbleContent,
  BubbleGroup,
  BubbleReactions,
} from "@/components/ui/bubble"
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"

interface ClinicalWorkbenchProps {
  session: UserSession
}

const COMMON_ICD10_DIAGNOSES = [
  { code: "I10", name: "Essential (primary) hypertension" },
  { code: "E11.9", name: "Type 2 diabetes mellitus without complications" },
  { code: "J06.9", name: "Acute upper respiratory infection, unspecified" },
  { code: "I20.9", name: "Angina pectoris, unspecified" },
  { code: "M54.5", name: "Low back pain, unspecified" },
  { code: "K21.9", name: "Gastro-esophageal reflux disease without esophagitis" },
  { code: "G43.909", name: "Migraine, unspecified, not intractable" },
  { code: "J45.909", name: "Unspecified asthma, uncomplicated" },
]

const getPatientAvatar = (p?: Patient) => {
  if (!p) return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
  const g = (p.gender || "").toUpperCase()
  if (g === "MALE" || g === "M") {
    return "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  }
  return "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
}

export default function ClinicalWorkbench({ session }: ClinicalWorkbenchProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("pat_1")
  const [encounters, setEncounters] = useState<ClinicalEncounter[]>([])
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isGeneratingAiNotes, setIsGeneratingAiNotes] = useState(false)

  // Encounter Type
  const [encounterType, setEncounterType] = useState<string>("OPD")
  const [isTelehealth, setIsTelehealth] = useState(false)
  const [isCritical, setIsCritical] = useState(false)

  // Form Vitals
  const [bpSys, setBpSys] = useState(120)
  const [bpDia, setBpDia] = useState(80)
  const [heartRate, setHeartRate] = useState(72)
  const [oxygen, setOxygen] = useState(98)
  const [temp, setTemp] = useState(36.8)
  const [respRate, setRespRate] = useState(16)

  // Clinical Details
  const [chiefComplaint, setChiefComplaint] = useState("")
  const [diagnosisCode, setDiagnosisCode] = useState("I10")
  const [diagnosisName, setDiagnosisName] = useState("Essential (primary) hypertension")
  const [clinicalNotes, setClinicalNotes] = useState("")

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    {
      medicineName: "Amlodipine Besylate 5mg",
      dosage: "5mg Oral Tablet",
      frequency: "OD (Once daily)",
      duration: "30 days",
      instructions: "Take in morning",
    },
  ])

  // Load patients
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/patients`)
      .then((res) => res.json())
      .then((data) => {
        setPatients(data.patients || [])
        if (data.patients?.length > 0 && !selectedPatientId) {
          setSelectedPatientId(data.patients[0].id)
        }
      })
      .catch(() => {})
  }, [])

  // Load encounters for selected patient
  useEffect(() => {
    if (!selectedPatientId) return
    fetch(`${API_BASE_URL}/api/v1/clinical/encounters?patientId=${selectedPatientId}`)
      .then((res) => res.json())
      .then((data) => setEncounters(data.encounters || []))
      .catch(() => {})
  }, [selectedPatientId])

  const activePatient = patients.find((p) => p.id === selectedPatientId)

  const handleAddRx = () => {
    setPrescriptions([
      ...prescriptions,
      {
        medicineName: "",
        dosage: "",
        frequency: "TDS (3x daily)",
        duration: "7 days",
        instructions: "Take with food",
      },
    ])
  }

  const handleRemoveRx = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx))
  }

  const handleSubmitEncounter = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg(null)

    const payload = {
      patientId: selectedPatientId,
      doctorId: session.doctorId || "doc_sarah",
      doctorName: session.name,
      type: encounterType,
      chiefComplaint: chiefComplaint || "Routine cardiac follow-up and blood pressure monitoring",
      vitals: {
        bloodPressureSystolic: bpSys,
        bloodPressureDiastolic: bpDia,
        heartRateBpm: heartRate,
        oxygenSaturationSpO2: oxygen,
        bodyTemperatureCelsius: temp,
        respiratoryRate: respRate,
        recordedAt: new Date().toISOString(),
      },
      primaryDiagnosisCode: diagnosisCode,
      primaryDiagnosisName: diagnosisName,
      secondaryDiagnoses: [],
      clinicalNotes: clinicalNotes || "Patient examined. Heart sounds regular. Medication refilled.",
      prescriptions: prescriptions.filter((p) => p.medicineName.trim() !== ""),
    }

    try {
      const savePromise = fetch(`${API_BASE_URL}/api/v1/clinical/encounters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": session.id,
          "X-User-Name": session.name,
          "X-User-Role": session.role,
          "X-Clinical-Reason": "Clinical Encounter Documentation",
        },
        body: JSON.stringify(payload),
      }).then(async (res) => {
        if (!res.ok) throw new Error("Failed to record clinical encounter");
        return res.json();
      });

      toast.promise(savePromise, {
        loading: "Encrypting and signing clinical encounter...",
        success: (saved: any) => {
          setEncounters([saved, ...encounters]);
          setSuccessMsg(`Clinical Encounter ${saved.encounterNumber} successfully saved and audited!`);
          setChiefComplaint("");
          setClinicalNotes("");
          return `Encounter ${saved.encounterNumber} recorded successfully!`;
        },
        error: "Could not record encounter.",
      });

      await savePromise;
    } catch (err) {
      // Handled by toast.promise
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAiNotes = () => {
    setIsGeneratingAiNotes(true);
    setTimeout(() => {
      setClinicalNotes((prev) =>
        (prev ? prev + "\n\n" : "") +
        "AI CLINICAL SCRIBE ASSESSMENT:\n- Patient demonstrates stable cardiovascular hemodynamics under current regimen.\n- Dual-pathway pharmacotherapy indicated with 30-day ambulatory monitoring.\n- Scheduled outpatient follow-up with comprehensive metabolic and lipid panel."
      );
      setIsGeneratingAiNotes(false);
      toast.add({
        title: "AI Note Generated",
        description: "Clinical summary successfully drafted into encounter notes.",
      });
    }, 1200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Patient Selector Sidebar & Quick Info */}
      <div className="lg:col-span-4 space-y-4">
        {/* Patient Queue Card */}
        <div className="bg-card border rounded-2xl p-4 shadow-xs">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Assigned Patients Queue
            </h3>
            <Badge variant="outline" className="text-[10px]">
              {patients.length} active
            </Badge>
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {patients.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedPatientId === p.id
                    ? "bg-primary/10 border-primary text-foreground shadow-xs"
                    : "bg-muted/30 border-transparent hover:bg-muted/60 text-muted-foreground"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-foreground">
                    {p.firstName} {p.lastName}
                  </span>
                  <span className="font-mono text-[10px] text-primary font-bold">{p.mrn}</span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-1">
                  DOB: {p.dateOfBirth} • Blood: {p.bloodGroup}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Patient Medical Summary */}
        {activePatient && (
          <div className="bg-card border rounded-2xl p-4 text-xs space-y-3 shadow-xs">
            <div className="pb-2 border-b">
              <AvatarLabelGroup
                size="md"
                src={getPatientAvatar(activePatient)}
                alt={`${activePatient.firstName} ${activePatient.lastName}`}
                title={`${activePatient.firstName} ${activePatient.lastName}`}
                subtitle={`MRN: ${activePatient.mrn} • Blood: ${activePatient.bloodGroup}`}
              />
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Known Drug Allergies:</span>
              <span className="font-bold text-destructive">
                {activePatient.allergies?.length > 0 ? activePatient.allergies.join(", ") : "None documented"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block text-[10px]">Emergency Contact:</span>
              <span className="text-foreground font-medium">
                {activePatient.emergencyContact?.name} ({activePatient.emergencyContact?.relationship}) -{" "}
                {activePatient.emergencyContact?.phone}
              </span>
            </div>
          </div>
        )}

        {/* Attachments Section (Lab Reports, ECG, Radiology) */}
        <div className="bg-card border rounded-2xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Paperclip className="h-3.5 w-3.5 text-primary" />
            Diagnostic Scans &amp; Lab Attachments
          </h3>
          <div className="flex flex-col gap-2.5 w-full">
            <Attachment orientation="horizontal" className="w-full">
              <AttachmentMedia variant="icon">
                <FileCodeIcon className="h-4 w-4 text-blue-600" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle className="text-xs font-medium truncate">12-Lead-ECG-Trace.pdf</AttachmentTitle>
                <AttachmentDescription className="text-[11px]">Sinus Rhythm · 420 KB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction aria-label="Open scan">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>

            <Attachment orientation="horizontal" className="w-full">
              <AttachmentMedia variant="icon">
                <Activity className="h-4 w-4 text-amber-600" />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle className="text-xs font-medium truncate">CBC-Metabolic-Panel.xlsx</AttachmentTitle>
                <AttachmentDescription className="text-[11px]">Lab Service · 1.2 MB</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          </div>
        </div>

        {/* Clinical Handover Notes Thread (Chat Bubbles) */}
        <div className="bg-card border rounded-2xl p-4 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="h-3.5 w-3.5 text-primary" />
            Shift Handover &amp; Clinical Notes
          </h3>
          <div className="space-y-3 pt-1">
            <Bubble align="start">
              <BubbleContent>
                <span className="font-bold block text-[10px] text-muted-foreground">Triage Nurse (08:30)</span>
                Patient presented with elevated BP (142/92). Initial ECG normal sinus rhythm.
              </BubbleContent>
              <BubbleReactions role="img" aria-label="Reaction: acknowledged">
                <span>👍</span>
              </BubbleReactions>
            </Bubble>

            <Bubble align="end">
              <BubbleContent>
                <span className="font-bold block text-[10px] text-primary/80">Dr. Sarah (09:15)</span>
                Examined. Continuing Amlodipine 5mg. Scheduled for 2-week ambulatory check.
              </BubbleContent>
            </Bubble>
          </div>
        </div>
      </div>

      {/* Main Clinical Documentation Form */}
      <div className="lg:col-span-8">
        <form onSubmit={handleSubmitEncounter} className="bg-card border rounded-2xl p-6 space-y-6 shadow-xs">
          {/* Header Bar with Encounter Type ButtonGroup & Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" />
                Clinical Encounter Documentation
              </h2>
              <p className="text-xs text-muted-foreground">
                Document vitals, ICD-10 diagnostic coding, and electronic prescriptions into patient electronic health record.
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Telehealth Switch */}
              <div className="flex items-center space-x-2 bg-muted/30 px-2.5 py-1.5 rounded-lg border">
                <Switch
                  id="telehealth-switch"
                  checked={isTelehealth}
                  onCheckedChange={setIsTelehealth}
                />
                <label htmlFor="telehealth-switch" className="text-xs font-semibold text-foreground flex items-center gap-1 cursor-pointer">
                  <Video className="w-3.5 h-3.5 text-primary" /> Telehealth
                </label>
              </div>

              {/* Encounter Type Selector */}
              <div className="flex rounded-lg border bg-muted p-0.5 text-xs font-medium">
                {["OPD", "IPD", "EMERGENCY"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setEncounterType(type)}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      encounterType === type
                        ? "bg-background text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Vitals Signs Strip */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider">
                Vital Signs Measurement
              </label>
              <span className="text-[11px] text-muted-foreground">Recorded at bedside / consultation</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              <div className="bg-muted/30 p-2.5 rounded-xl border text-center">
                <span className="text-[10px] text-muted-foreground block font-medium">BP (mmHg)</span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <input
                    type="number"
                    value={bpSys}
                    onChange={(e) => setBpSys(parseInt(e.target.value) || 0)}
                    className="w-10 bg-transparent text-center text-xs font-bold text-foreground focus:outline-none"
                  />
                  <span className="text-muted-foreground">/</span>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={(e) => setBpDia(parseInt(e.target.value) || 0)}
                    className="w-10 bg-transparent text-center text-xs font-bold text-foreground focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-muted/30 p-2.5 rounded-xl border text-center">
                <span className="text-[10px] text-muted-foreground block font-medium">Pulse (bpm)</span>
                <input
                  type="number"
                  value={heartRate}
                  onChange={(e) => setHeartRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-foreground mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-muted/30 p-2.5 rounded-xl border text-center">
                <span className="text-[10px] text-muted-foreground block font-medium">SpO2 (%)</span>
                <input
                  type="number"
                  value={oxygen}
                  onChange={(e) => setOxygen(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-foreground mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-muted/30 p-2.5 rounded-xl border text-center">
                <span className="text-[10px] text-muted-foreground block font-medium">Temp (°C)</span>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={(e) => setTemp(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-foreground mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-muted/30 p-2.5 rounded-xl border text-center">
                <span className="text-[10px] text-muted-foreground block font-medium">Resp (bpm)</span>
                <input
                  type="number"
                  value={respRate}
                  onChange={(e) => setRespRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-foreground mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl text-center flex flex-col justify-center">
                <span className="text-[10px] text-emerald-600 block font-semibold">Triage Score</span>
                <span className="text-xs font-extrabold text-emerald-700">ESI 4 - STABLE</span>
              </div>
            </div>
          </div>

          {/* Chief Complaint & ICD-10 Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-foreground mb-1">Chief Complaint</label>
              <input
                type="text"
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                placeholder="e.g. Mild chest tightness on exertion"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-foreground">
                  Primary ICD-10 Diagnosis Code &amp; Name
                </label>
                <span className="text-[10px] text-muted-foreground">WHO ICD-10 Clinical Coding</span>
              </div>
              <div className="mb-1.5">
                <select
                  aria-label="Select Common Diagnosis Preset"
                  className="w-full h-7 rounded-md border border-input bg-muted/40 px-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                  onChange={(e) => {
                    const selected = COMMON_ICD10_DIAGNOSES.find((d) => d.code === e.target.value);
                    if (selected) {
                      setDiagnosisCode(selected.code);
                      setDiagnosisName(selected.name);
                    }
                  }}
                  value={COMMON_ICD10_DIAGNOSES.some((d) => d.code === diagnosisCode) ? diagnosisCode : ""}
                >
                  <option value="" disabled>-- Quick Select Diagnosis Preset --</option>
                  {COMMON_ICD10_DIAGNOSES.map((d) => (
                    <option key={d.code} value={d.code}>
                      [{d.code}] {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={diagnosisCode}
                  onChange={(e) => setDiagnosisCode(e.target.value)}
                  className="w-24 flex h-9 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-mono font-bold"
                  placeholder="I10"
                />
                <input
                  type="text"
                  value={diagnosisName}
                  onChange={(e) => setDiagnosisName(e.target.value)}
                  className="flex-1 flex h-9 rounded-md border border-input bg-background px-3 py-1.5 text-xs"
                  placeholder="Essential (primary) hypertension"
                />
              </div>
            </div>
          </div>

          {/* Clinical Notes & AI Scribe */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-foreground">Doctor's Clinical Notes</label>
              <div className="flex items-center gap-2">
                {isGeneratingAiNotes && (
                  <Shimmer className="text-xs">
                    Generating diagnostic summary&hellip;
                  </Shimmer>
                )}
                <Button
                  color="secondary"
                  size="sm"
                  type="button"
                  onClick={handleGenerateAiNotes}
                  disabled={isGeneratingAiNotes}
                  className="h-7 text-xs bg-blue-50/80 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  AI Clinical Scribe
                </Button>
              </div>
            </div>
            <textarea
              rows={3}
              value={clinicalNotes}
              onChange={(e) => setClinicalNotes(e.target.value)}
              placeholder="Clinical evaluation findings, differential diagnosis, and patient instructions..."
              className="flex w-full rounded-md border border-input bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* e-Prescription List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-primary" />
                Prescribed Medications
              </label>
              <Button
                color="secondary"
                size="sm"
                type="button"
                onClick={handleAddRx}
                className="h-7 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Medication
              </Button>
            </div>

            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-muted/20 p-2.5 rounded-xl border">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Metformin 500mg)"
                    value={rx.medicineName}
                    onChange={(e) => {
                      const copy = [...prescriptions]
                      copy[idx].medicineName = e.target.value
                      setPrescriptions(copy)
                    }}
                    className="flex-1 min-w-40 flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={rx.dosage}
                    onChange={(e) => {
                      const copy = [...prescriptions]
                      copy[idx].dosage = e.target.value
                      setPrescriptions(copy)
                    }}
                    className="w-28 flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={rx.frequency}
                    onChange={(e) => {
                      const copy = [...prescriptions]
                      copy[idx].frequency = e.target.value
                      setPrescriptions(copy)
                    }}
                    className="w-32 flex h-9 rounded-md border border-input bg-background px-2.5 py-1 text-xs"
                  />
                  <Button
                    color="secondary"
                    size="sm"
                    type="button"
                    onClick={() => handleRemoveRx(idx)}
                    className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons with AlertDialog confirmation */}
          <div className="pt-4 border-t flex items-center justify-between">
            <AlertDialog>
              <AlertDialogTrigger
                render={
                  <Button color="secondary" size="md" type="button">
                    Clear Draft
                  </Button>
                }
              />
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Discard Encounter Draft?</AlertDialogTitle>
                  <AlertDialogDescription>
                    All uncommitted clinical notes and vitals for this session will be cleared.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Editing</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      setChiefComplaint("")
                      setClinicalNotes("")
                      toast.info("Clinical draft reset")
                    }}
                  >
                    Discard
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button color="primary" size="md" type="submit" disabled={loading}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              {loading ? "Recording Encounter..." : "Sign & Finalize Clinical Encounter"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
