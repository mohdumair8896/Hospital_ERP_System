"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const chartData = [
  { date: "2024-04-01", inpatients: 222, outpatients: 150 },
  { date: "2024-04-05", inpatients: 242, outpatients: 260 },
  { date: "2024-04-10", inpatients: 373, outpatients: 290 },
  { date: "2024-04-15", inpatients: 301, outpatients: 340 },
  { date: "2024-04-20", inpatients: 245, outpatients: 180 },
  { date: "2024-04-25", inpatients: 409, outpatients: 320 },
  { date: "2024-04-30", inpatients: 327, outpatients: 350 },
  { date: "2024-05-05", inpatients: 292, outpatients: 210 },
  { date: "2024-05-10", inpatients: 342, outpatients: 380 },
  { date: "2024-05-15", inpatients: 446, outpatients: 360 },
  { date: "2024-05-20", inpatients: 364, outpatients: 410 },
  { date: "2024-05-25", inpatients: 387, outpatients: 290 },
  { date: "2024-05-30", inpatients: 454, outpatients: 380 },
  { date: "2024-06-05", inpatients: 385, outpatients: 420 },
  { date: "2024-06-10", inpatients: 481, outpatients: 390 },
  { date: "2024-06-15", inpatients: 498, outpatients: 520 },
  { date: "2024-06-20", inpatients: 448, outpatients: 490 },
  { date: "2024-06-25", inpatients: 475, outpatients: 520 },
  { date: "2024-06-30", inpatients: 512, outpatients: 540 },
]

const chartConfig = {
  inpatients: {
    label: "Inpatient Admissions",
    color: "#1F5084",
  },
  outpatients: {
    label: "Outpatient Encounters",
    color: "#0284c7",
  },
} satisfies ChartConfig

export function AreaChartInteractive() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-slate-100 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className="text-base font-bold text-slate-900">
            Patient Census & Volume Dynamics
          </CardTitle>
          <CardDescription>
            Interactive tracking of Inpatient Admissions vs Outpatient Encounters
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[280px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillInpatients" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-inpatients)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-inpatients)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillOutpatients" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-outpatients)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-outpatients)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    if (!value) return ""
                    return new Date(String(value)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="outpatients"
              type="natural"
              fill="url(#fillOutpatients)"
              stroke="var(--color-outpatients)"
              stackId="a"
            />
            <Area
              dataKey="inpatients"
              type="natural"
              fill="url(#fillInpatients)"
              stroke="var(--color-inpatients)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
