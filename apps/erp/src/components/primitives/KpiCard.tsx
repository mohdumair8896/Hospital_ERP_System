import * as React from "react"
import { useReducedMotion } from "framer-motion"
import { Area, AreaChart } from "recharts"
import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "./Skeleton"

export interface KpiDelta {
  /** Shown as-is, e.g. "12%" or "+3". */
  value: string | number
  direction: "up" | "down"
  /** Whether the change is good news, bad news or neither (drives the colour). */
  tone: "good" | "bad" | "neutral"
}

export interface KpiCardProps {
  label: string
  /** Numbers count up once on first display (≤ 400ms); strings render as-is. */
  value: number | string
  /** Formats numeric values (default: locale grouping, same decimals as the value). */
  format?: (value: number) => string
  delta?: KpiDelta
  /** Small line under the value, e.g. "vs. last 7 days". */
  caption?: React.ReactNode
  /** A lucide icon component or any node, shown top-right. */
  icon?: LucideIcon | React.ReactNode
  /** Tiny trend line (no axes) along the bottom of the card. */
  sparkline?: number[]
  loading?: boolean
  className?: string
}

const DELTA_TONE: Record<KpiDelta["tone"], string> = {
  good: "bg-care-soft text-care",
  bad: "bg-alert-soft text-alert",
  neutral: "bg-muted text-muted-foreground",
}

const COUNT_UP_MS = 400

function decimalsOf(n: number) {
  if (!Number.isFinite(n) || Number.isInteger(n)) return 0
  return Math.min(4, (String(n).split(".")[1] ?? "").length)
}

function defaultFormat(decimals: number) {
  const fmt = new Intl.NumberFormat(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
  return (n: number) => fmt.format(n)
}

/** Counts from 0 to `target` the first time a number is available; later changes jump. */
function useCountUp(target: number | null) {
  const reduce = useReducedMotion()
  const done = React.useRef(false)
  const [current, setCurrent] = React.useState<number | null>(null)

  React.useLayoutEffect(() => {
    if (target === null || done.current) return
    // Skip when motion is reduced or the page is hidden (rAF does not run in background tabs).
    if (reduce || document.hidden || target === 0 || !Number.isFinite(target)) {
      done.current = true
      return
    }
    let frame = 0
    const finish = () => {
      cancelAnimationFrame(frame)
      done.current = true
      setCurrent(null)
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_UP_MS)
      if (t >= 1) return finish()
      setCurrent(target * (1 - Math.pow(1 - t, 3)))
      frame = requestAnimationFrame(tick)
    }
    setCurrent(0)
    frame = requestAnimationFrame(tick)
    // Guarantees the final value even if frames are throttled.
    const fallback = window.setTimeout(finish, COUNT_UP_MS + 150)
    return () => {
      cancelAnimationFrame(frame)
      window.clearTimeout(fallback)
      setCurrent(null)
    }
  }, [target, reduce])

  return current ?? target
}

function Sparkline({ data }: { data: number[] }) {
  const reduce = useReducedMotion()
  const gradientId = `kpi-spark-${React.useId().replace(/:/g, "")}`
  const points = React.useMemo(() => data.map((v, i) => ({ i, v })), [data])
  return (
    <div aria-hidden="true" className="-mx-1 mt-3 h-9">
      <AreaChart
        responsive
        accessibilityLayer={false}
        data={points}
        margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
        style={{ width: "100%", height: 36 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.22} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke="hsl(var(--primary))"
          strokeWidth={1.5}
          fill={`url(#${gradientId})`}
          dot={false}
          activeDot={false}
          isAnimationActive={!reduce}
          animationDuration={400}
        />
      </AreaChart>
    </div>
  )
}

function isComponent(icon: unknown): icon is LucideIcon {
  return typeof icon === "function" || (typeof icon === "object" && icon !== null && "render" in icon)
}

/** Dashboard metric tile: label, large tabular number, delta pill, caption and optional sparkline. */
export function KpiCard({ label, value, format, delta, caption, icon, sparkline, loading = false, className }: KpiCardProps) {
  const numeric = typeof value === "number" ? value : null
  const animated = useCountUp(loading ? null : numeric)
  const formatNumber = format ?? defaultFormat(decimalsOf(numeric ?? 0))
  const finalText = numeric === null ? String(value) : formatNumber(numeric)
  const visibleText = numeric === null ? String(value) : formatNumber(animated ?? numeric)
  const Icon = isComponent(icon) ? icon : null
  const DeltaIcon = delta?.direction === "down" ? ArrowDownRight : ArrowUpRight

  if (loading) {
    return (
      <div aria-busy="true" className={cn("rounded-xl border border-border bg-card p-4 shadow-soft", className)}>
        <span className="sr-only">Loading {label}</span>
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="mt-3 h-7 w-20" />
        <Skeleton className="mt-3 h-3 w-32" />
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col rounded-xl border border-border bg-card p-4 shadow-soft", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
            {Icon ? <Icon className="size-4" aria-hidden="true" /> : (icon as React.ReactNode)}
          </span>
        )}
      </div>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">
          <span aria-hidden="true">{visibleText}</span>
          <span className="sr-only">{finalText}</span>
        </p>
        {delta && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[11px] font-semibold tabular-nums",
              DELTA_TONE[delta.tone]
            )}
          >
            <DeltaIcon className="size-3" aria-hidden="true" />
            <span className="sr-only">{delta.direction === "up" ? "Up" : "Down"}</span>
            {typeof delta.value === "number" ? delta.value.toLocaleString() : delta.value}
          </span>
        )}
      </div>
      {caption && <p className="mt-1 text-xs text-muted-foreground">{caption}</p>}
      {sparkline && sparkline.length > 1 && <Sparkline data={sparkline} />}
    </div>
  )
}
