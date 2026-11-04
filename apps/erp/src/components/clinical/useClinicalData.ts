import { useCallback, useEffect, useState } from "react"
import type { ClinicalEncounter, Patient } from "@hospital/contracts"
import { apiFetch } from "@/lib/api"

export type LoadStatus = "idle" | "loading" | "error" | "ready"

async function readJson(res: Response, what: string) {
  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || body?.error || `${what} responded with ${res.status}`)
  }
  return res.json()
}

const isAbort = (err: unknown) => (err as { name?: string } | null)?.name === "AbortError"
const messageOf = (err: unknown) => (err instanceof Error ? err.message : "Network error")

/** The patient worklist: GET /api/v1/patients with loading, error and retry. */
export function usePatients() {
  const [state, setState] = useState<{ status: LoadStatus; patients: Patient[]; error?: string }>({
    status: "loading",
    patients: [],
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    setState((s) => ({ ...s, status: "loading", error: undefined }))
    apiFetch("/api/v1/patients", { signal: controller.signal })
      .then((res) => readJson(res, "Patient service"))
      .then((data) => setState({ status: "ready", patients: Array.isArray(data?.patients) ? data.patients : [] }))
      .catch((err) => {
        if (!isAbort(err)) setState({ status: "error", patients: [], error: messageOf(err) })
      })
    return () => controller.abort()
  }, [attempt])

  const reload = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, reload }
}

/**
 * Stored encounters. Records saved before the gateway's CreateEncounterSchema matched the
 * contracts may use the old key names (temperatureCelsius, medicationName, ...), so read both.
 */
export type StoredEncounter = Omit<ClinicalEncounter, "vitals" | "prescriptions"> & {
  vitals?: Partial<ClinicalEncounter["vitals"]> & { temperatureCelsius?: number; oxygenSaturationPercent?: number }
  prescriptions?: Array<
    Partial<ClinicalEncounter["prescriptions"][number]> & { medicationName?: string; durationDays?: number }
  >
}

/** Encounter history for one patient: GET /api/v1/clinical/encounters?patientId= */
export function useEncounters(patientId: string | null) {
  const [state, setState] = useState<{ status: LoadStatus; encounters: StoredEncounter[]; error?: string }>({
    status: "idle",
    encounters: [],
  })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (!patientId) {
      setState({ status: "idle", encounters: [] })
      return
    }
    const controller = new AbortController()
    // Never show the previous patient's history while the next one loads.
    setState((s) => ({ status: "loading", encounters: s.status === "ready" && s.encounters[0]?.patientId === patientId ? s.encounters : [] }))
    apiFetch(`/api/v1/clinical/encounters?patientId=${encodeURIComponent(patientId)}`, { signal: controller.signal })
      .then((res) => readJson(res, "Clinical service"))
      .then((data) => {
        const list: StoredEncounter[] = Array.isArray(data?.encounters) ? data.encounters : []
        list.sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
        setState({ status: "ready", encounters: list })
      })
      .catch((err) => {
        if (!isAbort(err)) setState({ status: "error", encounters: [], error: messageOf(err) })
      })
    return () => controller.abort()
  }, [patientId, attempt])

  const reload = useCallback(() => setAttempt((a) => a + 1), [])
  return { ...state, reload }
}
