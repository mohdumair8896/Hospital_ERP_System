"use client"

import * as React from "react"
import {
  Activity,
  Users,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Bug,
  Bell,
  BarChart3,
} from "lucide-react"

import { AreaChartInteractive } from "./charts/AreaChartInteractive"
import { AreaChartGradient } from "./charts/AreaChartGradient"
import { AreaChartStacked } from "./charts/AreaChartStacked"
import { AreaChartStep } from "./charts/AreaChartStep"
import { BugReportForm } from "./BugReportForm"
import { FormRhfCheckbox } from "./FormRhfCheckbox"

const STATS = [
  {
    label: "Total Patient Encounters",
    value: "24,892",
    sub: "+12.4% from last month",
    trend: "+12.4%",
    icon: Users,
    color: "#1F5084",
  },
  {
    label: "Completed Procedures",
    value: "1,428",
    sub: "99.1% success rate",
    trend: "+6.8%",
    icon: CalendarCheck,
    color: "#0284c7",
  },
  {
    label: "Clinical Revenue (MTD)",
    value: "$482,500",
    sub: "Target: $450,000",
    trend: "+18.2%",
    icon: DollarSign,
    color: "#10b981",
  },
  {
    label: "Telemetry & Bed Census",
    value: "94.2%",
    sub: "182 / 196 active beds",
    trend: "Optimal",
    icon: Activity,
    color: "#6366f1",
  },
]

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1F5084]/10 text-[#1F5084] border border-[#1F5084]/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Live Clinical Telemetry
            </span>
            <span className="text-xs text-slate-400">|</span>
            <span className="text-xs text-slate-500 font-medium">Updated 2 minutes ago</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mt-1.5">
            Hospital Clinical Analytics & Intelligence Hub
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Executive monitoring of inpatient/outpatient census, departmental distributions, and clinical infrastructure.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 shadow-sm">
            <BarChart3 className="w-4 h-4 text-[#1F5084]" /> shadcn/ui Recharts v3
          </span>
        </div>
      </div>

      {/* KPI Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {stat.sub}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Interactive Area Chart */}
      <div>
        <AreaChartInteractive />
      </div>

      {/* Area Chart Grid - Gradient, Stacked, Step */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AreaChartGradient />
        <AreaChartStacked />
        <AreaChartStep />
      </div>

      {/* Forms Section: Bug Report Form + Notification Preferences */}
      <div className="border-t border-slate-200 pt-8">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900">
            System Governance & Feedback Workflows
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Configured with React Hook Form, Zod validation, Sonner toast feedback, and shadcn/ui design tokens.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Bug Report Form */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Bug className="w-4 h-4 text-orange-500" />
              <span>Incident & Bug Escalation Form</span>
            </div>
            <BugReportForm />
          </div>

          {/* Notifications Form */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <Bell className="w-4 h-4 text-[#1F5084]" />
              <span>Telemetry Notification Preferences</span>
            </div>
            <FormRhfCheckbox />
          </div>
        </div>
      </div>
    </div>
  )
}
