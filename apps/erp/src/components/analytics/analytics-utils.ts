import type { Appointment } from "@hospital/contracts"

/** Row shape of GET /api/v1/appointments/summary (de-identified; no patient fields). */
export type AppointmentSummary = Pick<
  Appointment,
  "id" | "slotDate" | "slotTime" | "type" | "status" | "departmentId" | "departmentName" | "doctorId" | "doctorName" | "createdAt"
>

export type RangeKey = "today" | "7d" | "30d" | "all"

export const RANGES: { key: RangeKey; label: string; long: string }[] = [
  { key: "today", label: "Today", long: "today" },
  { key: "7d", label: "7 days", long: "the last 7 days" },
  { key: "30d", label: "30 days", long: "the last 30 days" },
  { key: "all", label: "All time", long: "all time" },
]

export const DEFAULT_RANGE: RangeKey = "30d"

export function parseRange(value: string | null): RangeKey {
  return RANGES.some((r) => r.key === value) ? (value as RangeKey) : DEFAULT_RANGE
}

const pad = (n: number) => String(n).padStart(2, "0")

/** Local calendar date as YYYY-MM-DD (slotDate is a local date, not UTC). */
export function isoDay(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function addDays(d: Date, n: number) {
  const next = new Date(d)
  next.setDate(next.getDate() + n)
  return next
}

/** Inclusive [from, to] window of YYYY-MM-DD strings; null bounds for "all". */
export function rangeWindow(range: RangeKey, now = new Date()): { from: string | null; to: string | null } {
  const today = isoDay(now)
  if (range === "today") return { from: today, to: today }
  if (range === "7d") return { from: isoDay(addDays(now, -6)), to: today }
  if (range === "30d") return { from: isoDay(addDays(now, -29)), to: today }
  return { from: null, to: null }
}

export function inRange(a: AppointmentSummary, range: RangeKey, now = new Date()) {
  const { from, to } = rangeWindow(range, now)
  if (!a.slotDate) return range === "all"
  if (from && a.slotDate < from) return false
  if (to && a.slotDate > to) return false
  return true
}

const dayFmt = new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short" })

export function describeWindow(range: RangeKey, now = new Date()) {
  const { from, to } = rangeWindow(range, now)
  if (!from || !to) return "All appointments on record"
  const f = new Date(`${from}T00:00:00`)
  const t = new Date(`${to}T00:00:00`)
  return from === to ? dayFmt.format(t) : `${dayFmt.format(f)} – ${dayFmt.format(t)}`
}

export interface Bucket {
  key: string
  label: string
  count: number
}

/** "10:30 AM" → 10 */
function hourOf(slotTime: string) {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i.exec(slotTime?.trim() ?? "")
  if (!m) return null
  let h = Number(m[1]) % 12
  if (m[3]?.toUpperCase() === "PM") h += 12
  if (!m[3]) h = Number(m[1])
  return h
}

/** Appointment counts per hour (today), per day (≤ 45 days) or per week (longer spans). */
export function bucketAppointments(list: AppointmentSummary[], range: RangeKey, now = new Date()): Bucket[] {
  if (range === "today") {
    const buckets: Bucket[] = []
    for (let h = 7; h <= 20; h++) buckets.push({ key: String(h), label: `${h % 12 || 12}${h < 12 ? "a" : "p"}`, count: 0 })
    for (const a of list) {
      const h = hourOf(a.slotTime)
      const b = buckets.find((x) => Number(x.key) === h)
      if (b) b.count++
    }
    return buckets
  }

  const dates = list.map((a) => a.slotDate).filter(Boolean).sort()
  let { from, to } = rangeWindow(range, now)
  if (!from || !to) {
    if (!dates.length) return []
    from = dates[0]
    to = dates[dates.length - 1]
  }
  const start = new Date(`${from}T00:00:00`)
  const end = new Date(`${to}T00:00:00`)
  const spanDays = Math.round((end.getTime() - start.getTime()) / 86400000) + 1
  const step = spanDays > 45 ? 7 : 1

  const buckets: Bucket[] = []
  for (let d = new Date(start); d <= end; d = addDays(d, step)) {
    const key = isoDay(d)
    buckets.push({ key, label: step === 7 ? `wk of ${dayFmt.format(d)}` : dayFmt.format(d), count: 0 })
  }
  for (const a of list) {
    if (!a.slotDate) continue
    // Last bucket whose start is on or before the appointment date.
    for (let i = buckets.length - 1; i >= 0; i--) {
      if (buckets[i].key <= a.slotDate) {
        buckets[i].count++
        break
      }
    }
  }
  return buckets
}

/** Count by a key, sorted by count (desc). */
export function countBy<T>(list: T[], keyOf: (item: T) => string | undefined): { key: string; count: number }[] {
  const map = new Map<string, number>()
  for (const item of list) {
    const k = keyOf(item) || "Unknown"
    map.set(k, (map.get(k) ?? 0) + 1)
  }
  return [...map.entries()].map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count)
}
