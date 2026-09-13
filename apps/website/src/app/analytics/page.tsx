'use client';

import React from 'react';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { AreaChartInteractive } from '../../components/charts/AreaChartInteractive';
import { AreaChartGradient } from '../../components/charts/AreaChartGradient';
import { AreaChartStacked } from '../../components/charts/AreaChartStacked';
import { AreaChartStep } from '../../components/charts/AreaChartStep';
import { BugReportForm } from '../../components/BugReportForm';
import { FormRhfCheckbox } from '../../components/FormRhfCheckbox';
import {
  Activity,
  Users,
  CalendarCheck,
  ShieldCheck,
  Award,
  ChevronRight,
  TrendingUp,
  Bug,
  Bell,
  HeartPulse,
} from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    {
      label: 'Patient Encounters (MTD)',
      value: '24,892',
      change: '+12.4%',
      desc: 'Inpatient & Ambulatory Care',
      icon: Users,
      color: '#1F5084',
    },
    {
      label: 'Surgical Success Rate',
      value: '99.4%',
      change: '+0.6%',
      desc: 'Robotic & Open Procedures',
      icon: CalendarCheck,
      color: '#0284c7',
    },
    {
      label: 'ICU & Telemetry Readiness',
      value: '99.8%',
      change: 'Optimal',
      desc: 'Continuous Level 1 Coverage',
      icon: HeartPulse,
      color: '#10b981',
    },
    {
      label: 'Clinical Compliance Index',
      value: '100%',
      change: 'JCI / HIPAA',
      desc: 'Cryptographic Audit Trail',
      icon: ShieldCheck,
      color: '#6366f1',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopEmergencyBar />
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#EAF2F9] via-[#F0F6FB] to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
            <Link href="/" className="hover:text-[#1F5084] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">Clinical Transparency &amp; Quality Analytics</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[#1F5084] text-xs font-bold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2B78C6]" />
                <span>Open Clinical Quality &amp; Transparency Initiative</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 font-display">
                Hospital Clinical Quality &amp; Census Analytics
              </h1>
              <p className="text-sm text-slate-600 leading-relaxed">
                As part of our commitment to transparency, ProHealth publishes clinical throughput, patient volume dynamics, and telemetry benchmarks powered by shadcn/ui Recharts data visualization.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Telemetry Active
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Analytics Container */}
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 py-10 space-y-10 flex-1 w-full">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {s.label}
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {s.value}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {s.desc}
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${s.color}15`, color: s.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 1: Interactive Area Chart */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Patient Census Dynamics (Interactive Area Chart)
            </h2>
            <p className="text-xs text-slate-500">
              Filter by last 90 days, 30 days, or 7 days to explore admission velocity and ambulatory volume.
            </p>
          </div>
          <AreaChartInteractive />
        </div>

        {/* Section 2: Gradient, Stacked, and Step Charts */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Multi-Specialty &amp; Inpatient Distribution Charts
            </h2>
            <p className="text-xs text-slate-500">
              Comparative visualization across departments, inpatient recovery curves, and acute care step transitions.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AreaChartGradient />
            <AreaChartStacked />
            <AreaChartStep />
          </div>
        </div>

        {/* Section 3: User Forms (Bug Report & Notifications) */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F5084] bg-[#1F5084]/10 px-3 py-1 rounded-full border border-[#1F5084]/20">
              Patient &amp; Staff Feedback Hub
            </span>
            <h2 className="text-2xl font-bold text-slate-900 mt-2 font-display">
              Portal Governance &amp; Notification Preferences
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Encountered a bug on mobile, or want to manage alerts? Submit reports below with live client validation and instant toast feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Bug className="w-4 h-4 text-orange-500" />
                <span>Report an Issue / Bug</span>
              </div>
              <BugReportForm />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <Bell className="w-4 h-4 text-[#1F5084]" />
                <span>Notification Preferences</span>
              </div>
              <FormRhfCheckbox />
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
