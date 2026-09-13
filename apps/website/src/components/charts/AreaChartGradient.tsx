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
  { month: "January", admitted: 186, discharged: 120 },
  { month: "February", admitted: 245, discharged: 190 },
  { month: "March", admitted: 290, discharged: 230 },
  { month: "April", admitted: 310, discharged: 270 },
  { month: "May", admitted: 360, discharged: 315 },
  { month: "June", admitted: 420, discharged: 380 },
]

const chartConfig = {
  admitted: {
    label: "Admitted",
    color: "#1F5084",
  },
  discharged: {
    label: "Discharged",
    color: "#10b981",
  },
} satisfies ChartConfig

export function AreaChartGradient() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900">
          Inpatient Flow — Gradient Analysis
        </CardTitle>
        <CardDescription>
          Tracking monthly admissions vs discharge throughput across all wards
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
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDischarged" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-discharged)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-discharged)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAdmitted" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-admitted)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-admitted)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="discharged"
              type="natural"
              fill="url(#fillDischarged)"
              fillOpacity={0.4}
              stroke="var(--color-discharged)"
              stackId="a"
            />
            <Area
              dataKey="admitted"
              type="natural"
              fill="url(#fillAdmitted)"
              fillOpacity={0.4}
              stroke="var(--color-admitted)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none text-slate-800">
              Discharge velocity up by 8.4% this quarter <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2 leading-none text-slate-500 text-xs">
              January – June 2024 (Active Inpatient Records)
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
