'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, Stethoscope, ChevronRight, ArrowRight, User } from 'lucide-react';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import AppointmentBookingModal from '../../components/AppointmentBookingModal';
import { DEPARTMENTS, DOCTORS } from '../../data/hospitalData';

export default function TimetablePage() {
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [bookingOpen, setBookingOpen] = useState(false);
  const [preselectedDocId, setPreselectedDocId] = useState<string | undefined>(undefined);

  const timetableData = [
    {
      doctorId: 'doc_sarah',
      doctorName: 'Dr. Sarah Patel',
      title: 'MD, FACC',
      department: 'Cardiology & Heart Center',
      deptId: 'dept_card',
      room: 'OPD Suite 302',
      schedule: [
        { day: 'Monday', time: '09:00 AM – 01:00 PM', shift: 'Morning Clinic' },
        { day: 'Tuesday', time: '02:00 PM – 06:00 PM', shift: 'Evening Clinic' },
        { day: 'Wednesday', time: '09:00 AM – 01:00 PM', shift: 'Morning Clinic' },
        { day: 'Thursday', time: '10:00 AM – 02:00 PM', shift: 'Cath Lab Consults' },
        { day: 'Friday', time: '09:00 AM – 01:00 PM', shift: 'Morning Clinic' },
      ],
    },
    {
      doctorId: 'doc_michael',
      doctorName: 'Dr. Michael Chang',
      title: 'MD, FAAP',
      department: 'Pediatrics & Neonatology',
      deptId: 'dept_ped',
      room: 'OPD Suite 210',
      schedule: [
        { day: 'Monday', time: '09:30 AM – 01:30 PM', shift: 'Well-Child Clinic' },
        { day: 'Wednesday', time: '09:30 AM – 01:30 PM', shift: 'Immunization Clinic' },
        { day: 'Friday', time: '02:00 PM – 06:00 PM', shift: 'Adolescent Care' },
        { day: 'Saturday', time: '09:00 AM – 01:00 PM', shift: 'Weekend Pediatric Desk' },
      ],
    },
    {
      doctorId: 'doc_elena',
      doctorName: 'Dr. Elena Rostova',
      title: 'MD, PhD',
      department: 'Neurology & Neurosurgery',
      deptId: 'dept_neur',
      room: 'OPD Suite 402',
      schedule: [
        { day: 'Tuesday', time: '10:00 AM – 02:00 PM', shift: 'Stroke & Epilepsy' },
        { day: 'Wednesday', time: '02:00 PM – 06:00 PM', shift: 'Neuro-rehab Clinic' },
        { day: 'Thursday', time: '10:00 AM – 02:00 PM', shift: 'Spine & Memory Care' },
      ],
    },
    {
      doctorId: 'doc_david',
      doctorName: 'Dr. David Rodriguez',
      title: 'MD, FACS',
      department: 'Orthopedics & Joint Replacement',
      deptId: 'dept_orth',
      room: 'OPD Suite 108',
      schedule: [
        { day: 'Monday', time: '08:30 AM – 12:30 PM', shift: 'Arthroplasty Screening' },
        { day: 'Tuesday', time: '01:00 PM – 05:00 PM', shift: 'Sports Injuries' },
        { day: 'Friday', time: '08:30 AM – 12:30 PM', shift: 'Joint Preservation' },
      ],
    },
  ];

  const filteredData =
    selectedDept === 'ALL'
      ? timetableData
      : timetableData.filter((item) => item.deptId === selectedDept);

  const handleBookDoctor = (docId: string) => {
    setPreselectedDocId(docId);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar onOpenBooking={() => setBookingOpen(true)} />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-white py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-prohealth-primary">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 font-semibold">Timetable & Doctor Schedules</span>
          </nav>

          <div className="max-w-3xl">
            <span className="text-xs font-extrabold uppercase tracking-wider text-prohealth-primary">
              CLINIC OPERATION HOURS
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-prohealth-heading font-display mt-2">
              Weekly Specialist Clinic Timetable
            </h1>
            <p className="text-sm sm:text-base text-prohealth-body mt-3 leading-relaxed">
              Browse weekly outpatient department (OPD) timings for each physician. Direct online reservations ensure guaranteed zero waiting room queue times.
            </p>
          </div>
        </div>
      </section>

      {/* Timetable Content */}
      <section className="py-16 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          {/* Department Filter Pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setSelectedDept('ALL')}
              className={`text-xs font-bold px-5 py-2.5 rounded-full transition-all ${
                selectedDept === 'ALL'
                  ? 'bg-prohealth-primary text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Departments
            </button>
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDept(dept.id)}
                className={`text-xs font-bold px-5 py-2.5 rounded-full transition-all ${
                  selectedDept === dept.id
                    ? 'bg-prohealth-primary text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {dept.name.split('&')[0].trim()}
              </button>
            ))}
          </div>

          {/* Schedule Grid */}
          <div className="space-y-6">
            {filteredData.map((docItem) => (
              <div
                key={docItem.doctorId}
                className="prohealth-card bg-white p-6 sm:p-8 border border-slate-200/80 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-prohealth-ice text-prohealth-primary flex items-center justify-center font-bold">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-prohealth-heading flex items-center gap-2">
                        <span>{docItem.doctorName}</span>
                        <span className="text-xs font-medium text-slate-400 font-mono">({docItem.title})</span>
                      </h2>
                      <p className="text-xs text-prohealth-muted">
                        {docItem.department} • <span className="font-semibold text-slate-700">{docItem.room}</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleBookDoctor(docItem.doctorId)}
                    className="inline-flex items-center gap-2 bg-prohealth-primary hover:bg-prohealth-primary-hover text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-md transition-all self-start md:self-auto"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Book with {docItem.doctorName}</span>
                  </button>
                </div>

                {/* Day Slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {docItem.schedule.map((slot, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-prohealth-canvas border border-slate-200/60 space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                        <span>{slot.day}</span>
                        <span className="text-[10px] font-semibold text-prohealth-primary bg-prohealth-ice px-2 py-0.5 rounded-full">
                          {slot.shift}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3 text-prohealth-secondary shrink-0" />
                        <span>{slot.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />

      <AppointmentBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedDoctorId={preselectedDocId}
      />
    </main>
  );
}
