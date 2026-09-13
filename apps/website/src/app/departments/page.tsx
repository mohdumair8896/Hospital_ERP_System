import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { DEPARTMENTS } from '../../data/hospitalData';
import { 
  HeartPulse, 
  Brain, 
  Baby, 
  Bone, 
  Ambulance, 
  Sparkles, 
  ChevronRight, 
  ArrowRight,
  ShieldAlert,
  Calendar
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Clinical Departments & Centers of Excellence | ProHealth Hospital',
  description: 'Explore ProHealth clinical institutes: Cardiology, Emergency Trauma, Neurology, Orthopedics, Pediatrics, and Maternal Health.',
};

const iconMap: Record<string, React.ReactNode> = {
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-600" />,
  Brain: <Brain className="w-6 h-6 text-purple-600" />,
  Baby: <Baby className="w-6 h-6 text-amber-600" />,
  Bone: <Bone className="w-6 h-6 text-emerald-600" />,
  Ambulance: <Ambulance className="w-6 h-6 text-red-600" />,
  Sparkles: <Sparkles className="w-6 h-6 text-pink-600" />,
};

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-white py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-prohealth-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Departments</span>
          </nav>
          <div className="max-w-3xl space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-prohealth-primary bg-[#EAF2F9] px-3 py-1 rounded-full border border-[#CBD5E1]">
              Centers of Excellence
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-prohealth-heading">
              Clinical Departments & Specialized Institutes
            </h1>
            <p className="text-sm sm:text-base text-prohealth-body leading-relaxed">
              Every department at ProHealth operates as a dedicated multidisciplinary center, integrating certified clinicians, diagnostic suites, and personalized patient recovery protocols.
            </p>
          </div>
        </div>
      </section>

      {/* Departments Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DEPARTMENTS.map((dept) => (
              <div
                key={dept.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-cyan-500/40 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-7 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                      {iconMap[dept.iconName] || <HeartPulse className="w-6 h-6 text-cyan-600" />}
                    </div>
                    {dept.emergencySupport && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
                        <ShieldAlert className="w-3 h-3" />
                        24/7 Response
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-cyan-600 transition-colors">
                      {dept.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{dept.location}</p>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {dept.shortDesc}
                  </p>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                    <div className="flex justify-between">
                      <span>Lead Physician:</span>
                      <strong className="text-slate-700">{dept.leadPhysician}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Annual Cases:</span>
                      <span className="font-semibold text-cyan-700">{dept.annualProcedures}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                  <Link
                    href={`/departments/${dept.id}`}
                    className="text-cyan-700 hover:text-cyan-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Department Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    href={`/appointments?dept=${dept.id}`}
                    className="text-slate-600 hover:text-slate-900 font-medium text-[11px] flex items-center gap-1"
                  >
                    <Calendar className="w-3 h-3 text-slate-400" />
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
