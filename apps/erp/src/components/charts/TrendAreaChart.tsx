import { useId } from "react"
import { useReducedMotionConfig } from "framer-motion"
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts"

export interface TrendPoint {
  label: string
  value: number
}

function TrendTooltip({ active, payload, format }: Partial<TooltipContentProps<number, string>> & { format: (v: number) => string }) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload as TrendPoint
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-soft">
      <p className="font-medium">{point.label}</p>
      <p className="mt-0.5 font-semibold tabular-nums">{format(point.value)}</p>
    </div>
  )
}

/** Single-series area trend with a crosshair tooltip (2px line, soft fill, recessive grid). */
export function TrendAreaChart({
  data,
  format = (v) => v.toLocaleString(),
  height = 160,
}: {
  data: TrendPoint[]
  format?: (value: number) => string
  height?: number
}) {
  const reduce = useReducedMotionConfig()
  const gradientId = `trend-${useId().replace(/:/g, "")}`
  return (
    <AreaChart responsive data={data} margin={{ top: 8, right: 4, bottom: 0, left: -16 }} style={{ width: "100%", height }} accessibilityLayer>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.18} />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
      <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
      <YAxis tickLine={false} axisLine={false} width={56} tickFormatter={(v: number) => format(v)} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} />
      <Tooltip cursor={{ stroke: "hsl(var(--muted-foreground))", strokeDasharray: "3 3" }} content={<TrendTooltip format={format} />} />
      <Area
        type="monotone"
        dataKey="value"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        fill={`url(#${gradientId})`}
        activeDot={{ r: 4, strokeWidth: 2, stroke: "hsl(var(--card))" }}
        isAnimationActive={!reduce}
        animationDuration={250}
      />
    </AreaChart>
  )
}
