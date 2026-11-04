import { useCallback, useEffect, useRef, useState } from "react"
import type { AuditIntegrityVerificationResult, AuditRecord } from "@hospital/contracts"
import { apiFetch } from "@/lib/api"
import { looksLikeActorId, type AuditFilters } from "./audit-format"

export const PAGE_SIZE = 200
/** The audit service rejects `limit` above this (apps/audit-service/src/index.ts). */
export const MAX_LIMIT = 1000

export interface AuditStats {
  totalRecords: number
  actionDistribution: { action: string; count: number }[]
  breakGlassCount: number
}

type Load<T> = { status: "loading"; data: T | null } | { status: "ready"; data: T } | { status: "error"; data: T | null; error: string }

async function readError(res: Response) {
  try {
    const body = await res.json()
    if (body?.error) return `${body.error} (HTTP ${res.status})`
  } catch {}
  return `The audit service responded with HTTP ${res.status}.`
}

const networkError = "Could not reach the audit service through the API gateway. Check that the gateway and audit-service are running, then retry."

/** Records for the current server filters (action, resourceType, exact actorId) and page size. */
export function useAuditRecords(filters: AuditFilters, limit: number) {
  const [state, setState] = useState<Load<{ total: number; records: AuditRecord[] }>>({ status: "loading", data: null })
  const [reloadKey, setReloadKey] = useState(0)
  const actorParam = looksLikeActorId(filters.actor) ? filters.actor.trim() : ""

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ status: "loading", data: prev.data }))
    const params = new URLSearchParams({ limit: String(limit) })
    if (filters.action !== "ALL") params.set("action", filters.action)
    if (filters.resourceType !== "ALL") params.set("resourceType", filters.resourceType)
    if (actorParam) params.set("actorId", actorParam)

    apiFetch(`/api/v1/audit/records?${params}`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(await readError(res))
        const body = await res.json()
        const records: AuditRecord[] = Array.isArray(body?.records) ? body.records : []
        setState({ status: "ready", data: { total: Number(body?.total) || records.length, records } })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message = err instanceof TypeError ? networkError : err instanceof Error ? err.message : networkError
        setState((prev) => ({ status: "error", data: prev.data, error: message }))
      })
    return () => controller.abort()
  }, [filters.action, filters.resourceType, actorParam, limit, reloadKey])

  const reload = useCallback(() => setReloadKey((k) => k + 1), [])
  return { ...state, reload }
}

/** Aggregates from GET /api/v1/audit/stats (refetched with the records). */
export function useAuditStats(reloadKey: number) {
  const [state, setState] = useState<Load<AuditStats>>({ status: "loading", data: null })
  useEffect(() => {
    const controller = new AbortController()
    apiFetch("/api/v1/audit/stats", { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error(await readError(res))
        const body = await res.json()
        setState({
          status: "ready",
          data: {
            totalRecords: Number(body?.totalRecords) || 0,
            actionDistribution: Array.isArray(body?.actionDistribution) ? body.actionDistribution : [],
            breakGlassCount: Number(body?.breakGlassCount) || 0,
          },
        })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        setState((prev) => ({ status: "error", data: prev.data, error: err instanceof Error ? err.message : networkError }))
      })
    return () => controller.abort()
  }, [reloadKey])
  return state
}

export type VerifyState =
  | { status: "idle" }
  | { status: "running"; previous: AuditIntegrityVerificationResult | null }
  | { status: "done"; result: AuditIntegrityVerificationResult }
  | { status: "error"; error: string }

/** Runs GET /api/v1/audit/verify-integrity. Never fabricates a result when the call fails. */
export function useChainVerification() {
  const [state, setState] = useState<VerifyState>({ status: "idle" })
  const running = useRef(false)

  const verify = useCallback(async (): Promise<VerifyState> => {
    if (running.current) return { status: "idle" }
    running.current = true
    setState((prev) => ({ status: "running", previous: prev.status === "done" ? prev.result : null }))
    let next: VerifyState
    try {
      const res = await apiFetch("/api/v1/audit/verify-integrity")
      if (!res.ok) throw new Error(await readError(res))
      const body = await res.json()
      next = {
        status: "done",
        result: {
          verified: Boolean(body?.verified),
          totalRecordsChecked: Number(body?.totalRecordsChecked) || 0,
          tamperedRecordIds: Array.isArray(body?.tamperedRecordIds) ? body.tamperedRecordIds : [],
          genesisHash: String(body?.genesisHash ?? ""),
          latestHash: String(body?.latestHash ?? ""),
          verifiedAt: String(body?.verifiedAt ?? new Date().toISOString()),
        },
      }
    } catch (err) {
      next = { status: "error", error: err instanceof TypeError ? networkError : err instanceof Error ? err.message : networkError }
    }
    running.current = false
    setState(next)
    return next
  }, [])

  return { state, verify }
}
