import React from 'react';
import Link from 'next/link';
import TopEmergencyBar from '../components/TopEmergencyBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmergencyFAB from '../components/EmergencyFAB';
import { Stethoscope, Ambulance, Home, Calendar, PhoneCall, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopEmergencyBar />
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-20 px-4">
        <div className="max-w-lg w-full bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 sm:p-12 text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto shadow-inner border border-cyan-100">
            <Stethoscope className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-700 bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
              Error 404 • Page Not Found
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display">
              We Couldn’t Find That Clinical Page
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
              The page or resource you requested has been relocated, renamed, or is temporarily unavailable. Let us guide you back to proper care.
            </p>
          </div>

          {/* Quick Navigation Shortcuts */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link
              href="/"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-cyan-900"
            >
              <Home className="w-4 h-4 text-cyan-600" />
              <span>Hospital Home</span>
            </Link>

            <Link
              href="/appointments"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-cyan-900"
            >
              <Calendar className="w-4 h-4 text-cyan-600" />
              <span>Appointments</span>
            </Link>

            <Link
              href="/departments"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-cyan-900"
            >
              <Search className="w-4 h-4 text-cyan-600" />
              <span>Departments</span>
            </Link>

            <Link
              href="/doctors"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all flex items-center justify-center gap-2 text-xs font-bold text-slate-700 hover:text-cyan-900"
            >
              <Stethoscope className="w-4 h-4 text-cyan-600" />
              <span>Find Doctors</span>
            </Link>
          </div>

          {/* Urgent Emergency Callout */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-3 text-left">
              <Ambulance className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <div className="text-xs font-bold text-red-950">Immediate Medical Emergency?</div>
                <div className="text-[11px] text-red-800">
                  Call our 24/7 Ambulance hotline at{' '}
                  <a href="tel:876256876" className="font-extrabold text-red-950 underline">
                    876-256-876
                  </a>.
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
