import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopEmergencyBar from '../../../components/TopEmergencyBar';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EmergencyFAB from '../../../components/EmergencyFAB';
import { DEPARTMENTS, DOCTORS } from '../../../data/hospitalData';
import { 
  ChevronRight, 
  CheckCircle2, 
  Calendar, 
  Stethoscope, 
  ShieldCheck, 
  Building2, 
  Cpu, 
  Clock, 
  PhoneCall,
  User
} from 'lucide-react';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return DEPARTMENTS.map((dept) => ({
    id: dept.id,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const dept = DEPARTMENTS.find((d) => d.id === params.id);
  if (!dept) return { title: 'Department Not Found' };
  return {
    title: `${dept.name} | ProHealth Hospital`,
    description: dept.shortDesc,
  };
}

export default function DepartmentDetailPage({ params }: Props) {
  const dept = DEPARTMENTS.find((d) => d.id === params.id);
  if (!dept) notFound();

  const deptDoctors = DOCTORS.filter((doc) => doc.departmentId === dept.id);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Header Banner */}
      <section className="relative py-16 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/departments" className="hover:text-[#1F5084]">Departments</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">{dept.name}</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F5084]/10 border border-[#1F5084]/20 text-[#1F5084] text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>{dept.location}</span>
              <span>•</span>
              <span>{dept.beds} Dedicated Inpatient Beds</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              {dept.name}
            </h1>
            <p className="text-sm text-[#475467] leading-relaxed max-w-2xl">
              {dept.shortDesc}
            </p>
          </div>
        </div>
      </section>

      {/* Detail Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Information Column */}
            <div className="lg:col-span-2 space-y-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  Institute Overview & Clinical Philosophy
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {dept.fullDesc}
                </p>
              </div>

              {/* Conditions Treated */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-cyan-600" />
                  <span>Primary Conditions & Pathologies Treated</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dept.conditionsTreated.map((cond, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700 font-medium">{cond}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedures Offered */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-cyan-600" />
                  <span>Surgical & Diagnostic Procedures</span>
                </h3>
                <div className="space-y-2.5">
                  {dept.proceduresOffered.map((proc, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-800">{proc}</span>
                      <span className="text-[10px] uppercase font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                        Certified Care Path
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technologies */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-600" />
                  <span>Specialized Diagnostic & Robotic Systems</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dept.technologies.map((tech, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs font-medium text-indigo-950 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />
                      <span>{tech}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Faculty / Doctors */}
              {deptDoctors.length > 0 && (
                <div className="space-y-5 pt-4">
                  <h3 className="text-lg font-bold text-slate-900">Department Physicians & Specialists</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {deptDoctors.map((doc) => (
                      <div key={doc.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm flex items-center gap-4">
                        <img
                          src={doc.avatarUrl}
                          alt={doc.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900">{doc.name}</h4>
                          <p className="text-[11px] text-cyan-700 font-medium">{doc.specialty}</p>
                          <div className="flex items-center gap-3 pt-1">
                            <Link
                              href={`/doctors/${doc.id}`}
                              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 underline"
                            >
                              Profile
                            </Link>
                            <Link
                              href={`/appointments?doc=${doc.id}`}
                              className="text-[11px] font-bold text-cyan-700 hover:text-cyan-800"
                            >
                              Book Slot
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Widget Column */}
            <div className="space-y-6">
              {/* Direct Booking Card */}
              <div className="bg-[#1F5084] text-white p-6 rounded-3xl shadow-xl space-y-4">
                <div className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-200 bg-white/10 px-2.5 py-1 rounded border border-white/20">
                  Priority Access
                </div>
                <h3 className="text-xl font-bold font-display">Schedule a Department Appointment</h3>
                <p className="text-xs text-sky-100 leading-relaxed">
                  Direct online reservation for initial clinical consultations, pre-operative clearances, and second opinions.
                </p>
                <Link
                  href={`/appointments?dept=${dept.id}`}
                  className="w-full bg-white hover:bg-sky-50 text-[#1F5084] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  Book Department Visit
                </Link>
              </div>

              {/* Department Facts */}
              <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Key Department Metrics</h4>
                <div className="space-y-3 text-slate-600">
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span>Department Chair:</span>
                    <strong className="text-slate-900">{dept.leadPhysician}</strong>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span>Location:</span>
                    <span className="font-medium text-slate-800">{dept.location}</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span>Inpatient Bed Capacity:</span>
                    <span className="font-semibold text-slate-900">{dept.beds} Beds</span>
                  </div>
                  <div className="flex justify-between pb-2 border-b border-slate-200">
                    <span>Annual Patient Volumes:</span>
                    <span className="font-semibold text-cyan-700">{dept.annualProcedures}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>24/7 Emergency Support:</span>
                    <span className={dept.emergencySupport ? 'text-red-600 font-bold' : 'text-slate-500'}>
                      {dept.emergencySupport ? 'Active 24/7' : 'Scheduled Hours'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Emergency Ribbon */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-red-700">
                  <PhoneCall className="w-4 h-4" />
                  <span>Immediate Medical Emergency?</span>
                </div>
                <p className="text-[11px] text-red-800">
                  Call our 24/7 Emergency Trauma Desk directly at <strong className="text-red-950">876-256-876</strong> or proceed to the dedicated ground-floor entrance.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
