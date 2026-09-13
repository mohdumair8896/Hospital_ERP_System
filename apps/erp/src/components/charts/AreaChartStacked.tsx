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
  { month: "January", cardiology: 186, neurology: 80, pediatrics: 95 },
  { month: "February", cardiology: 305, neurology: 200, pediatrics: 140 },
  { month: "March", cardiology: 237, neurology: 120, pediatrics: 175 },
  { month: "April", cardiology: 273, neurology: 190, pediatrics: 160 },
  { month: "May", cardiology: 320, neurology: 210, pediatrics: 195 },
  { month: "June", cardiology: 380, neurology: 240, pediatrics: 230 },
]

const chartConfig = {
  cardiology: {
    label: "Cardiology",
    color: "#1F5084",
  },
  neurology: {
    label: "Neurology",
    color: "#0284c7",
  },
  pediatrics: {
    label: "Pediatrics",
    color: "#10b981",
  },
} satisfies ChartConfig

export function AreaChartStacked() {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900">
          Departmental Caseload — Stacked Distribution
        </CardTitle>
        <CardDescription>
          Multi-specialty consultation volume distribution over the past 6 months
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
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="pediatrics"
              type="natural"
              fill="var(--color-pediatrics)"
              fillOpacity={0.3}
              stroke="var(--color-pediatrics)"
              stackId="a"
            />
            <Area
              dataKey="neurology"
              type="natural"
              fill="var(--color-neurology)"
              fillOpacity={0.4}
              stroke="var(--color-neurology)"
              stackId="a"
            />
            <Area
              dataKey="cardiology"
              type="natural"
              fill="var(--color-cardiology)"
              fillOpacity={0.5}
              stroke="var(--color-cardiology)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter>
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-1">
            <div className="flex items-center gap-2 font-medium leading-none text-slate-800">
              Cardiology appointments surging +14.2% <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2 leading-none text-slate-500 text-xs">
              Specialized clinical referral pathways active
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
