"use client"

import * as React from "react"
import {
  Activity,
  Users,
  CalendarCheck,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  BarChart3,
} from "lucide-react"

import { AreaChartInteractive } from "./charts/AreaChartInteractive"
import { AreaChartGradient } from "./charts/AreaChartGradient"
import { AreaChartStacked } from "./charts/AreaChartStacked"
import { AreaChartStep } from "./charts/AreaChartStep"

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
            <BarChart3 className="w-4 h-4 text-[#1F5084]" /> Fiscal Year 2026-Q3
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

      {/* Clinical Operations & Departmental Utilization */}
      <div className="border-t border-slate-200 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Departmental Bed Utilization &amp; Clinical Throughput
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Real-time inpatient census, average length of stay (ALOS), and hospital bed allocation metrics.
            </p>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Census: 182 / 196 Beds (92.8%)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { dept: 'Cardiology & Heart Center', occupied: 38, total: 40, alos: '3.2 days', status: 'Near Capacity', color: 'text-rose-600', bg: 'bg-rose-50' },
            { dept: 'Neurology & Brain Sciences', occupied: 24, total: 28, alos: '4.1 days', status: 'Optimal Flow', color: 'text-purple-600', bg: 'bg-purple-50' },
            { dept: 'Pediatric ICU & Ward', occupied: 18, total: 24, alos: '2.4 days', status: 'Normal Census', color: 'text-sky-600', bg: 'bg-sky-50' },
            { dept: 'Emergency & Trauma (Level 1)', occupied: 14, total: 16, alos: '4.2 hrs', status: 'Surge Ready', color: 'text-amber-600', bg: 'bg-amber-50' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-800 truncate">{item.dept}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <div className="text-xl font-black text-slate-900">
                  {item.occupied} <span className="text-xs font-normal text-slate-400">/ {item.total} beds</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.bg} ${item.color}`}>
                  {item.status}
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-[#1F5084] h-full rounded-full transition-all"
                  style={{ width: `${(item.occupied / item.total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Avg Stay (ALOS):</span>
                <span className="font-semibold text-slate-700">{item.alos}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Quality Improvement (CQI) Safeguards Strip */}
        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Sentinel Events</span>
            <span className="text-lg font-black text-emerald-600">0 (Target: 0)</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Medication Accuracy</span>
            <span className="text-lg font-black text-slate-900">99.8%</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">Infection Rate (HAI)</span>
            <span className="text-lg font-black text-slate-900">0.12 / 1k</span>
          </div>
          <div>
            <span className="text-[11px] text-slate-500 uppercase font-semibold block">30-Day Readmission</span>
            <span className="text-lg font-black text-emerald-600">4.2%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
