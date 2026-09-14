"use client"

import * as React from "react"
import { Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, Cell } from "recharts"
import { cn } from "cn"

export interface PieChartDataItem {
  name: string
  value: number
  className?: string
  fill?: string
}

export interface PieChartProps {
  data?: PieChartDataItem[]
  className?: string
  height?: number
  innerRadius?: number
  outerRadius?: number
}

const DEFAULT_COLORS = [
  "#2563eb", // blue-600
  "#3b82f6", // blue-500
  "#60a5fa", // blue-400
  "#93c5fd", // blue-300
  "#cbd5e1", // slate-300
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
]

export const pieChartData: PieChartDataItem[] = [
  {
    name: "Series 1",
    value: 200,
    className: "text-blue-600",
    fill: "#2563eb",
  },
  {
    name: "Series 2",
    value: 350,
    className: "text-blue-500",
    fill: "#3b82f6",
  },
  {
    name: "Series 3",
    value: 100,
    className: "text-blue-400",
    fill: "#60a5fa",
  },
  {
    name: "Series 4",
    value: 120,
    className: "text-blue-300",
    fill: "#93c5fd",
  },
  {
    name: "Series 5",
    value: 230,
    className: "text-slate-300",
    fill: "#cbd5e1",
  },
]

export function ChartTooltipContent({
  active,
  payload,
  isPieChart = false,
}: any) {
  if (!active || !payload || !payload.length) {
    return null
  }

  return (
    <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-md">
      {payload.map((entry: any, index: number) => (
        <div key={`item-${index}`} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: entry.color || entry.payload?.fill || entry.fill }}
          />
          <span className="font-medium text-foreground">{entry.name}:</span>
          <span className="text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  )
}

export function ChartLegendContent(props: any) {
  const { payload } = props
  if (!payload || !payload.length) return null

  return (
    <ul className="flex flex-col gap-1 text-xs text-muted-foreground pt-1">
      {payload.map((entry: any, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-1.5">
          <span
            className="h-2 w-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="truncate">{entry.value}</span>
        </li>
      ))}
    </ul>
  )
}

export const PieChartXxs = ({
  data = pieChartData,
  className,
  height = 120,
  innerRadius = 30,
  outerRadius = 60,
}: PieChartProps) => {
  return (
    <div className={cn("w-full max-w-52", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsPieChart
          margin={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Legend
            verticalAlign="top"
            align="right"
            layout="vertical"
            content={<ChartLegendContent />}
          />
          <Tooltip content={<ChartTooltipContent isPieChart />} />

          <Pie
            isAnimationActive={false}
            startAngle={-270}
            endAngle={-630}
            stroke="none"
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={innerRadius}
            outerRadius={outerRadius}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.fill || DEFAULT_COLORS[index % DEFAULT_COLORS.length]}
              />
            ))}
          </Pie>
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  )
}
