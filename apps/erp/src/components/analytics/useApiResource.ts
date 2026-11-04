import { useCallback, useEffect, useRef, useState } from "react"
import { apiFetch } from "@/lib/api"

export type Resource<T> =
  | { status: "loading"; data: T | null; error?: undefined; updatedAt: number | null }
  | { status: "ready"; data: T; error?: undefined; updatedAt: number }
  | { status: "error"; data: T | null; error: string; updatedAt: number | null }

interface Options {
  /** Refetch every `pollMs` while the document is visible. */
  pollMs?: number
}

/**
 * GET `path` through apiFetch and parse the JSON body. Keeps the last good data while
 * refetching, reports errors without inventing data, and pauses polling in hidden tabs.
 */
export function useApiResource<T>(path: string, parse: (body: unknown) => T, options: Options = {}) {
  const [state, setState] = useState<Resource<T>>({ status: "loading", data: null, updatedAt: null })
  const [tick, setTick] = useState(0)
  const parseRef = useRef(parse)
  parseRef.current = parse

  useEffect(() => {
    const controller = new AbortController()
    setState((prev) => ({ status: "loading", data: prev.data, updatedAt: prev.updatedAt }))
    apiFetch(path, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          let message = `HTTP ${res.status}`
          try {
            const body = await res.json()
            if (body?.error) message = `${body.error} (HTTP ${res.status})`
          } catch {}
          throw new Error(message)
        }
        const data = parseRef.current(await res.json())
        setState({ status: "ready", data, updatedAt: Date.now() })
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return
        const message =
          err instanceof TypeError ? "The API gateway could not be reached." : err instanceof Error ? err.message : "Request failed."
        setState((prev) => ({ status: "error", data: prev.data, error: message, updatedAt: prev.updatedAt }))
      })
    return () => controller.abort()
  }, [path, tick])

  const { pollMs } = options
  useEffect(() => {
    if (!pollMs) return
    const id = window.setInterval(() => {
      if (!document.hidden) setTick((t) => t + 1)
    }, pollMs)
    const onVisible = () => {
      if (!document.hidden) setTick((t) => t + 1)
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      window.clearInterval(id)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [pollMs])

  const reload = useCallback(() => setTick((t) => t + 1), [])
  return { ...state, reload }
}
