import { useCallback, useEffect, useRef, useState } from "react"
import type { Appointment, AppointmentStatus } from "@hospital/contracts"
import { toast } from "sonner"
import { apiFetch } from "@/lib/api"
import { STATUS_LABELS } from "./queue-model"

export type LoadStatus = "loading" | "ready" | "error"

async function readError(res: Response) {
  try {
    const body = await res.json()
    return (body?.error as string) || `Request failed (${res.status})`
  } catch {
    return `Request failed (${res.status})`
  }
}

/** Appointments for the desk: load, retry, refresh and status changes (with sonner toasts). */
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [status, setStatus] = useState<LoadStatus>("loading")
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const mounted = useRef(true)
  const hasData = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  const load = useCallback(async () => {
    // First load (or retry after an error) shows the skeleton; later loads keep the list on screen.
    if (hasData.current) setRefreshing(true)
    else setStatus("loading")
    try {
      const res = await apiFetch("/api/v1/appointments")
      if (!res.ok) throw new Error(await readError(res))
      const data = await res.json()
      if (!mounted.current) return
      setAppointments(Array.isArray(data?.appointments) ? data.appointments : [])
      hasData.current = true
      setError(null)
      setStatus("ready")
    } catch (err) {
      if (!mounted.current) return
      const message = err instanceof Error && err.message !== "Failed to fetch" ? err.message : "The appointment service could not be reached."
      if (hasData.current) toast.error("Could not refresh the queue", { description: message })
      else {
        setError(message)
        setStatus("error")
      }
    } finally {
      if (mounted.current) setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const updateStatus = useCallback(async (appt: Appointment, next: AppointmentStatus) => {
    setPendingId(appt.id)
    try {
      const res = await apiFetch(`/api/v1/appointments/${appt.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      })
      if (!res.ok) throw new Error(await readError(res))
      const saved = (await res.json().catch(() => null)) as Appointment | null
      if (mounted.current) {
        setAppointments((list) =>
          list.map((a) => (a.id === appt.id ? { ...a, ...(saved && saved.id ? saved : {}), status: next } : a))
        )
      }
      toast.success(`${appt.patientName}: ${STATUS_LABELS[next]}`, {
        position: "bottom-center",
        description: `${appt.appointmentNumber} moved from ${STATUS_LABELS[appt.status]} to ${STATUS_LABELS[next]}.`,
      })
      return true
    } catch (err) {
      toast.error(`Could not update ${appt.appointmentNumber}`, {
        position: "bottom-center",
        description: err instanceof Error ? err.message : "Status change failed. Try again.",
      })
      return false
    } finally {
      if (mounted.current) setPendingId(null)
    }
  }, [])

  return { appointments, status, error, refreshing, pendingId, reload: load, updateStatus }
}
