import { useSyncExternalStore } from "react"

/**
 * URL query state for the ERP shell (there is no router).
 *
 * Conventions (all written with history.replaceState, so no history entries pile up):
 * - `?tab=<Tab>`            the active screen; App validates it against the role's tabs
 * - `&patient=<patientId>`  a patient to open (CLINICAL / RECEPTION read it)
 * - `&action=<name>`        a one-shot action (`register` on RECEPTION, `verify` on AUDIT);
 *                           the screen should run it, then call `setUrlParam("action", null)`
 *
 * Screens subscribe with `useUrlParam(name)`; it re-renders on every change made through
 * these helpers (and on popstate).
 */

/** Window event fired after any change made through these helpers. */
export const URL_CHANGE_EVENT = "erp:urlchange"

type ParamValue = string | null | undefined

function subscribe(onChange: () => void) {
  window.addEventListener(URL_CHANGE_EVENT, onChange)
  window.addEventListener("popstate", onChange)
  return () => {
    window.removeEventListener(URL_CHANGE_EVENT, onChange)
    window.removeEventListener("popstate", onChange)
  }
}

const getSearch = () => window.location.search
const getServerSearch = () => ""

/** Reactive read of one query parameter (null when absent). */
export function useUrlParam(name: string): string | null {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch)
  return new URLSearchParams(search).get(name)
}

/** Non-reactive read of one query parameter. */
export function readUrlParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name)
}

/**
 * Merge `params` into the query string (null/undefined/"" removes a key).
 * With `reset: true` every other key is dropped first.
 */
export function replaceUrlParams(params: Record<string, ParamValue>, options: { reset?: boolean } = {}) {
  const search = new URLSearchParams(options.reset ? "" : window.location.search)
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") search.delete(key)
    else search.set(key, value)
  }
  const query = search.toString()
  const next = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  if (next !== current) {
    window.history.replaceState(window.history.state, "", next)
    window.dispatchEvent(new Event(URL_CHANGE_EVENT))
  }
}

/** Set or clear a single query parameter, keeping the others. */
export function setUrlParam(name: string, value: ParamValue) {
  replaceUrlParams({ [name]: value })
}

/**
 * Switch screens: writes `?tab=<tab>` plus `extra` and drops every other key.
 * App picks the change up; an unknown or forbidden tab falls back to the role's default.
 */
export function navigateTo(tab: string, extra: Record<string, ParamValue> = {}) {
  replaceUrlParams({ tab, ...extra }, { reset: true })
}

/** Remove the whole query string (used on sign out). */
export function clearUrlParams() {
  replaceUrlParams({}, { reset: true })
}
