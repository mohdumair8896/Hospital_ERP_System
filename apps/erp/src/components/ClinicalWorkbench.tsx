import { useCallback, useEffect, useMemo, useState } from "react"
import { ClipboardList, FileText, HeartPulse, Pill, Stethoscope, Users } from "lucide-react"
import { toast } from "sonner"
import type { UserSession } from "@hospital/contracts"
import { apiFetch } from "@/lib/api"
import { EmptyState, PatientBanner, Skeleton } from "@/components/primitives"
import { setUrlParam, useUrlParam } from "@/components/shell/url-state"
import { PatientQueue } from "./clinical/PatientQueue"
import { PatientSummary } from "./clinical/PatientSummary"
import { EncounterTabs, type EncounterTabDef } from "./clinical/EncounterTabs"
import { SoapNotes } from "./clinical/SoapNotes"
import { VitalsPanel } from "./clinical/VitalsPanel"
import { PrescriptionEditor } from "./clinical/PrescriptionEditor"
import { EncounterHistory } from "./clinical/EncounterHistory"
import { EncounterActions, type SaveSummary } from "./clinical/EncounterActions"
import { formatWhen, storedVitals } from "./clinical/EncounterDetailSheet"
import { useEncounters, usePatients } from "./clinical/useClinicalData"
import {
  abnormalVitals,
  buildEncounterPayload,
  emptyDraft,
  isDraftDirty,
  issueCounts,
  validateDraft,
  type EncounterDraft,
} from "./clinical/encounter-model"

interface ClinicalWorkbenchProps {
  session: UserSession
}

type ClinicalTab = "soap" | "vitals" | "erx" | "history"
const BLANK = emptyDraft()

export default function ClinicalWorkbench({ session }: ClinicalWorkbenchProps) {
  const patientsState = usePatients()
  const { patients, status: patientStatus } = patientsState
  const urlPatient = useUrlParam("patient")

  // Selection lives in the URL (?patient=, also set by the command palette); default to the first patient.
  const selectedId = useMemo(() => {
    if (urlPatient && patients.some((p) => p.id === urlPatient)) return urlPatient
    return patients[0]?.id ?? null
  }, [urlPatient, patients])
  const patient = patients.find((p) => p.id === selectedId) ?? null

  useEffect(() => {
    if (patientStatus !== "ready" || !selectedId || urlPatient === selectedId) return
    if (urlPatient) {
      toast.warning("That patient isn't in the queue", { description: "Showing the first patient instead." })
    }
    setUrlParam("patient", selectedId)
  }, [patientStatus, selectedId, urlPatient])

  // One draft per patient, lifted here so it survives tab and patient switches.
  const [drafts, setDrafts] = useState<Record<string, EncounterDraft>>({})
  const [attempted, setAttempted] = useState<Record<string, boolean>>({})
  const [savedFor, setSavedFor] = useState<Record<string, string>>({})
  const [tab, setTab] = useState<ClinicalTab>("soap")
  const [saving, setSaving] = useState(false)
  const encounterLog = useEncounters(selectedId)

  const draft = (selectedId && drafts[selectedId]) || BLANK
  const showAllErrors = selectedId ? !!attempted[selectedId] : false
  const issues = useMemo(() => validateDraft(draft), [draft])
  const counts = issueCounts(issues)
  const dirty = isDraftDirty(draft)
  const abnormal = abnormalVitals(draft.vitals)
  const medications = draft.rx.map((r) => r.medicineName.trim()).filter(Boolean)
  const draftIds = useMemo(
    () => new Set(Object.entries(drafts).filter(([, d]) => isDraftDirty(d)).map(([id]) => id)),
    [drafts]
  )

  const updateDraft = useCallback(
    (fn: (d: EncounterDraft) => EncounterDraft) => {
      if (!selectedId) return
      setDrafts((prev) => ({ ...prev, [selectedId]: fn(prev[selectedId] ?? emptyDraft()) }))
    },
    [selectedId]
  )

  const resetDraft = (patientId: string) => {
    setDrafts(({ [patientId]: _removed, ...rest }) => rest)
    setAttempted(({ [patientId]: _flag, ...rest }) => rest)
  }

  const requestSave = () => {
    if (!selectedId) return false
    setAttempted((a) => ({ ...a, [selectedId]: true }))
    if (counts.total === 0) return true
    setTab(counts.soap ? "soap" : counts.vitals ? "vitals" : "erx")
    toast.error(`${counts.total} ${counts.total === 1 ? "field needs" : "fields need"} attention`, {
      description: "Fix the highlighted fields, then sign again.",
    })
    // After the tab switch renders, move focus to the first invalid field.
    window.setTimeout(() => {
      document.querySelector<HTMLElement>('[role="tabpanel"][data-state="active"] [aria-invalid="true"]')?.focus()
    }, 0)
    return false
  }

  const confirmSave = async () => {
    if (!selectedId || !patient || !session.doctorId) return
    const patientId = selectedId
    const name = `${patient.firstName} ${patient.lastName}`
    const payload = buildEncounterPayload(draft, patientId, session.doctorId, session)
    setSaving(true)
    const toastId = toast.loading(`Signing and saving the encounter for ${name}…`)
    try {
      const res = await apiFetch("/api/v1/clinical/encounters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": session.id,
          "X-User-Name": session.name,
          "X-User-Role": session.role,
          "X-Clinical-Reason": "Clinical Encounter Documentation",
        },
        body: JSON.stringify(payload),
      })
      const body = await res.json().catch(() => null)
      if (!res.ok) {
        const first = body?.details?.[0]
        throw new Error(first ? `${first.field}: ${first.message}` : body?.message || body?.error || `Server responded ${res.status}`)
      }
      toast.success(body?.encounterNumber ? `Encounter ${body.encounterNumber} saved` : "Encounter saved", {
        id: toastId,
        description: `Signed for ${name} and added to the encounter history.`,
        action: { label: "View history", onClick: () => setTab("history") },
      })
      resetDraft(patientId)
      setSavedFor((s) => ({ ...s, [patientId]: body?.encounterNumber ?? "saved" }))
      encounterLog.reload()
    } catch (err) {
      toast.error("Couldn't save the encounter", {
        id: toastId,
        description: `${err instanceof Error ? err.message : "Network error"}. Your draft is kept.`,
      })
    } finally {
      setSaving(false)
    }
  }

  const latest = encounterLog.status === "ready" ? encounterLog.encounters[0] : undefined
  const v = draft.vitals
  const summary: SaveSummary = {
    patientName: patient ? `${patient.firstName} ${patient.lastName}` : "this patient",
    diagnosis: `${draft.soap.diagnosisCode} ${draft.soap.diagnosisName}`.trim() || "—",
    vitals: `BP ${v.bpSys}/${v.bpDia} mmHg · HR ${v.heartRate} · SpO₂ ${v.oxygen}% · ${v.temp} °C · RR ${v.respRate}`,
    abnormal: abnormal.map((s) => s.label),
    medications,
  }

  const tabs: EncounterTabDef<ClinicalTab>[] = [
    {
      value: "soap",
      label: "SOAP",
      icon: FileText,
      hasError: showAllErrors && counts.soap > 0,
      panel: (
        <SoapNotes
          draft={draft}
          errors={issues.soap}
          showAllErrors={showAllErrors}
          onChange={(patch) => updateDraft((d) => ({ ...d, soap: { ...d.soap, ...patch } }))}
        />
      ),
    },
    {
      value: "vitals",
      label: "Vitals",
      icon: HeartPulse,
      count: abnormal.length || undefined,
      countLabel: `${abnormal.length} outside normal range`,
      countTone: "warning",
      hasError: showAllErrors && counts.vitals > 0,
      panel: (
        <VitalsPanel
          vitals={draft.vitals}
          errors={issues.vitals}
          showAllErrors={showAllErrors}
          onChange={(key, value) => updateDraft((d) => ({ ...d, vitals: { ...d.vitals, [key]: value } }))}
          previous={latest ? storedVitals(latest) : undefined}
          previousDate={latest ? formatWhen(latest.createdAt) : undefined}
        />
      ),
    },
    {
      value: "erx",
      label: "e-Rx",
      icon: Pill,
      count: medications.length,
      countLabel: `${medications.length} ${medications.length === 1 ? "medication" : "medications"}`,
      hasError: showAllErrors && counts.rx > 0,
      panel: (
        <PrescriptionEditor
          rows={draft.rx}
          errors={issues.rx}
          showAllErrors={showAllErrors}
          allergies={(patient?.allergies ?? []).filter(Boolean)}
          onChange={(rx) => updateDraft((d) => ({ ...d, rx }))}
        />
      ),
    },
    {
      value: "history",
      label: "History",
      icon: ClipboardList,
      count: encounterLog.status === "ready" ? encounterLog.encounters.length : undefined,
      countLabel: `${encounterLog.encounters.length} past ${encounterLog.encounters.length === 1 ? "encounter" : "encounters"}`,
      panel: (
        <EncounterHistory
          status={encounterLog.status}
          encounters={encounterLog.encounters}
          error={encounterLog.error}
          onRetry={encounterLog.reload}
        />
      ),
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-6">
      <div className="lg:col-span-4 2xl:col-span-3">
        <PatientQueue
          status={patientStatus}
          patients={patients}
          error={patientsState.error}
          selectedId={selectedId}
          draftIds={draftIds}
          onSelect={(id) => setUrlParam("patient", id)}
          onRetry={patientsState.reload}
        />
      </div>

      <div className="min-w-0 space-y-4 lg:col-span-8 lg:row-span-2 2xl:col-span-9">
        {patient ? (
          <div key={patient.id} className="space-y-4">
            <PatientBanner
              patient={patient}
              encounterStatus={dirty ? "IN_PROGRESS" : savedFor[patient.id] ? "SIGNED" : "NEW"}
              attending={session.role === "DOCTOR" ? session.name : undefined}
            />
            <div className="rounded-xl border border-border bg-card shadow-xs">
              <EncounterTabs value={tab} onValueChange={setTab} tabs={tabs} />
              <EncounterActions
                type={draft.type}
                onTypeChange={(type) => updateDraft((d) => ({ ...d, type }))}
                dirty={dirty}
                saving={saving}
                onClear={() => {
                  resetDraft(patient.id)
                  toast("Draft discarded")
                }}
                onRequestSave={requestSave}
                summary={summary}
                onConfirm={confirmSave}
                signBlockedReason={
                  session.doctorId ? undefined : "Only a signed-in physician can sign encounters. You can review the chart."
                }
              />
            </div>
          </div>
        ) : patientStatus === "loading" ? (
          <div role="status" aria-busy="true" className="space-y-4">
            <span className="sr-only">Loading chart…</span>
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card">
            <EmptyState
              icon={patientStatus === "error" ? Stethoscope : Users}
              title={patientStatus === "error" ? "Chart unavailable" : "No patient selected"}
              description={
                patientStatus === "error"
                  ? "The patient queue couldn't be loaded. Use Try again in the queue."
                  : "Register a patient at the reception desk to start an encounter."
              }
            />
          </div>
        )}
      </div>

      {patient && (
        <div className="lg:col-span-4 lg:self-start 2xl:col-span-3">
          <PatientSummary patient={patient} />
        </div>
      )}
    </div>
  )
}
