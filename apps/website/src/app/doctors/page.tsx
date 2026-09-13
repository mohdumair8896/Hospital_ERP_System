'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { DOCTORS, DEPARTMENTS } from '../../data/hospitalData';
import { 
  Search, 
  Filter, 
  Star, 
  Calendar, 
  ChevronRight, 
  Stethoscope, 
  Award, 
  MapPin, 
  Check 
} from 'lucide-react';

export default function DoctorsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('ALL');

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter((doc) => {
      const matchesSearch =
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept =
        selectedDepartment === 'ALL' || doc.departmentId === selectedDepartment;

      return matchesSearch && matchesDept;
    });
  }, [searchQuery, selectedDepartment]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-white py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-prohealth-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">Doctor Directory</span>
          </nav>
          <div className="max-w-3xl space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-prohealth-primary bg-[#EAF2F9] px-3 py-1 rounded-full border border-[#CBD5E1]">
              World-Class Faculty
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-prohealth-heading">
              Find a Physician or Specialist
            </h1>
            <p className="text-sm sm:text-base text-prohealth-body leading-relaxed">
              Our board-certified attending physicians are internationally recognized clinicians and researchers, committed to compassionate evidence-based medicine.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <section className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by doctor name, specialty, or condition..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-medium text-slate-900 placeholder:text-slate-400 outline-none transition-all"
              />
            </div>

            {/* Department Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs">
              <button
                onClick={() => setSelectedDepartment('ALL')}
                className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedDepartment === 'ALL'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Specialties
              </button>
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedDepartment === dept.id
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dept.name.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctor Cards Directory */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 space-y-8">
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> verified physicians
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Stethoscope className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-base font-bold text-slate-800">No physicians match your search criteria</div>
              <p className="text-xs text-slate-500">
                Try searching with broader terms or clear your department filter.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedDepartment('ALL'); }}
                className="mt-2 text-xs font-bold text-cyan-600 hover:underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {filteredDoctors.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all p-6 flex flex-col sm:flex-row gap-6 group"
                >
                  {/* Photo & Fee Badge */}
                  <div className="shrink-0 flex flex-col items-center sm:items-start space-y-3">
                    <div className="relative">
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-emerald-50 text-emerald-700 font-extrabold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1 shadow-sm">
                        <Check className="w-2.5 h-2.5" />
                        Verified
                      </div>
                    </div>
                    <div className="text-center sm:text-left">
                      <div className="text-sm font-extrabold text-slate-900">${doc.consultationFee}</div>
                      <div className="text-[10px] text-slate-400">Consultation Fee</div>
                    </div>
                  </div>

                  {/* Doctor Info */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                          {doc.departmentName}
                        </span>
                        <div className="flex items-center text-amber-500 text-xs font-bold gap-1 ml-auto">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span>{doc.rating}</span>
                          <span className="text-slate-400 text-[10px]">({doc.reviewCount})</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1.5 group-hover:text-cyan-600 transition-colors">
                        {doc.title}
                      </h3>
                      <p className="text-xs text-cyan-700 font-semibold">{doc.specialty}</p>
                      <p className="text-[11px] text-slate-500">{doc.qualification}</p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {doc.bio}
                    </p>

                    {/* Available slots pill */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Next Available Slots:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {doc.availableSlots.slice(0, 3).map((slot, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {slot}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action CTAs */}
                    <div className="pt-2 flex items-center gap-3">
                      <Link
                        href={`/appointments?doc=${doc.id}`}
                        className="flex-1 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl text-center shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        Book Appointment
                      </Link>

                      <Link
                        href={`/doctors/${doc.id}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-3.5 rounded-xl border border-slate-200 transition-all text-center"
                      >
                        Profile
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
