import { useReducedMotionConfig } from "framer-motion"
import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis, type TooltipContentProps } from "recharts"

export interface CountPoint {
  key: string
  label: string
  count: number
}

function ChartTooltip({ active, payload }: Partial<TooltipContentProps<number, string>>) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload as CountPoint
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-soft">
      <p className="font-medium">{point.label}</p>
      <p className="mt-0.5 tabular-nums text-muted-foreground">
        <span className="font-semibold text-foreground">{point.count}</span> {point.count === 1 ? "appointment" : "appointments"}
      </p>
    </div>
  )
}

/**
 * Single-series column chart (counts per hour/day/week). One hue, thin bars with rounded tops,
 * recessive grid, hover tooltip; animation is skipped under reduced motion.
 */
export function AppointmentsBarChart({ data, height = 240 }: { data: CountPoint[]; height?: number }) {
  const reduce = useReducedMotionConfig()
  const dense = data.length > 16
  return (
    <BarChart
      responsive
      data={data}
      margin={{ top: 8, right: 4, bottom: 0, left: -24 }}
      barCategoryGap={dense ? "18%" : "28%"}
      style={{ width: "100%", height }}
      accessibilityLayer
    >
      <CartesianGrid vertical={false} stroke="hsl(var(--border))" />
      <XAxis
        dataKey="label"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        interval={dense ? "preserveStartEnd" : 0}
        minTickGap={12}
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
      />
      <YAxis
        allowDecimals={false}
        tickLine={false}
        axisLine={false}
        width={48}
        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
      />
      <Tooltip cursor={{ fill: "hsl(var(--muted))" }} content={<ChartTooltip />} />
      <Bar
        dataKey="count"
        name="Appointments"
        fill="hsl(var(--primary))"
        radius={[4, 4, 0, 0]}
        maxBarSize={28}
        isAnimationActive={!reduce}
        animationDuration={250}
      />
    </BarChart>
  )
}
