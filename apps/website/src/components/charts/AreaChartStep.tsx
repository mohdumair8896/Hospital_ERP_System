"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", icu: 14, emergency: 45 },
  { month: "February", icu: 18, emergency: 52 },
  { month: "March", icu: 16, emergency: 60 },
  { month: "April", icu: 22, emergency: 58 },
  { month: "May", icu: 19, emergency: 64 },
  { month: "June", icu: 24, emergency: 72 },
]

const chartConfig = {
  icu: {
    label: "ICU Bed Capacity",
    color: "#e11d48",
  },
  emergency: {
    label: "ER Rapid Admissions",
    color: "#1F5084",
  },
} satisfies ChartConfig

export function AreaChartStep() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900">
          Critical Care Surge — Step Area
        </CardTitle>
        <CardDescription>
          Discrete step transitions in ICU bed utilization and trauma intake
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="icu"
              type="step"
              fill="var(--color-icu)"
              fillOpacity={0.2}
              stroke="var(--color-icu)"
            />
            <Area
              dataKey="emergency"
              type="step"
              fill="var(--color-emergency)"
              fillOpacity={0.3}
              stroke="var(--color-emergency)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none text-slate-800">
              Trauma center readiness at 99.4% <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2 leading-none text-slate-500 text-xs">
              Continuous 24/7 telemetry monitoring active
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
