'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import AppointmentBookingWizard from '../../components/appointment/AppointmentBookingWizard';
import { ChevronRight, ShieldCheck } from 'lucide-react';

function AppointmentPageContent() {
  const searchParams = useSearchParams();
  const preselectedDocId = searchParams.get('doc') || undefined;
  const preselectedDeptId = searchParams.get('dept') || undefined;
  const preselectedSlot = searchParams.get('slot') || undefined;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopEmergencyBar />
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-slate-50 py-12 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#1F5084] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Appointment Booking</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#CBD5E1] text-[#1F5084] text-xs font-bold shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#2B78C6]" />
                <span>Central Clinical Scheduling Engine</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 font-display">
                Schedule a Medical Appointment
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Connect directly with our board-certified physicians across 6 clinical departments. Select your care modality, choose an accredited specialist, and receive real-time scheduling confirmation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Booking Container */}
      <main className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 py-12 flex-1 w-full">
        <AppointmentBookingWizard
          variant="page"
          preselectedDoctorId={preselectedDocId}
          preselectedDepartmentId={preselectedDeptId}
          preselectedSlot={preselectedSlot}
        />
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading appointment portal...</div>}>
      <AppointmentPageContent />
    </Suspense>
  );
}
