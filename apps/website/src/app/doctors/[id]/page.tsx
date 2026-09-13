import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopEmergencyBar from '../../../components/TopEmergencyBar';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EmergencyFAB from '../../../components/EmergencyFAB';
import { DOCTORS } from '../../../data/hospitalData';
import { 
  ChevronRight, 
  Star, 
  Calendar, 
  Award, 
  GraduationCap, 
  FileBadge, 
  Phone, 
  Mail, 
  ShieldCheck, 
  CheckCircle2,
  Clock
} from 'lucide-react';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return DOCTORS.map((doc) => ({
    id: doc.id,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const doc = DOCTORS.find((d) => d.id === params.id);
  if (!doc) return { title: 'Physician Not Found' };
  return {
    title: `${doc.title} | ProHealth Hospital Specialist`,
    description: `${doc.name} is a ${doc.specialty} specialist at ProHealth Academic Medical Center. Experience: ${doc.experienceYears} years.`,
  };
}

export default function DoctorProfilePage({ params }: Props) {
  const doc = DOCTORS.find((d) => d.id === params.id);
  if (!doc) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-white py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
            <Link href="/" className="hover:text-prohealth-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link href="/doctors" className="hover:text-prohealth-primary transition-colors">Doctors</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">{doc.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={doc.avatarUrl}
              alt={doc.name}
              className="w-36 h-36 md:w-44 md:h-44 rounded-3xl object-cover shadow-lg border-2 border-white"
            />
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2F9] border border-[#CBD5E1] text-prohealth-primary text-xs font-bold">
                <Link href={`/departments/${doc.departmentId}`} className="hover:underline">
                  {doc.departmentName}
                </Link>
                <span>•</span>
                <span>NPI: {doc.npiNumber}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-prohealth-heading">
                {doc.title}
              </h1>
              <p className="text-base text-prohealth-secondary font-medium">{doc.specialty}</p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-5 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{doc.rating} / 5.0</span>
                  <span className="text-slate-500 font-normal">({doc.reviewCount} verified reviews)</span>
                </div>
                <span>•</span>
                <div>
                  <strong className="text-slate-900">{doc.experienceYears} Years</strong> Clinical Practice
                </div>
                <span>•</span>
                <div>
                  Fee: <strong className="text-slate-900">${doc.consultationFee}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Profile Details */}
      <section className="py-16 bg-white flex-1">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Biography */}
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900 font-display">
                  Physician Biography & Clinical Focus
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {doc.bio}
                </p>
              </div>

              {/* Education & Residency */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-cyan-600" />
                  <span>Education & Academic Fellowships</span>
                </h3>
                <div className="space-y-2.5">
                  {doc.education.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-800">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Board Certifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <FileBadge className="w-5 h-5 text-indigo-600" />
                  <span>Board Certifications & Licensure</span>
                </h3>
                <div className="space-y-2.5">
                  {doc.certifications.map((cert, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center gap-3">
                      <Award className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="text-xs font-semibold text-indigo-950">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Patient Satisfaction Indicators */}
              <div className="space-y-4 pt-4">
                <h3 className="text-lg font-bold text-slate-900">Clinical Quality Indicators</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl font-extrabold text-cyan-700 font-display">99.1%</div>
                    <div className="text-[11px] text-slate-500 mt-1">Patient Recommendation</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl font-extrabold text-slate-900 font-display">0.2%</div>
                    <div className="text-[11px] text-slate-500 mt-1">30-Day Readmission Rate</div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center">
                    <div className="text-2xl font-extrabold text-emerald-600 font-display">100%</div>
                    <div className="text-[11px] text-slate-500 mt-1">Board Certified Active</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Booking & Schedule Sidebar */}
            <div className="space-y-6">
              {/* Direct Booking Widget */}
              <div className="bg-[#1F5084] text-white p-6 rounded-3xl shadow-xl space-y-5">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-sky-200">
                    Book Consultation
                  </div>
                  <h3 className="text-xl font-bold font-display mt-1">Consult with {doc.name}</h3>
                  <p className="text-xs text-sky-100 mt-1">
                    Select an available slot below to start your direct appointment reservation.
                  </p>
                </div>

                {/* Days available */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-sky-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-sky-300" />
                    <span>Clinic Clinic Days:</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doc.availableDays.map((day, i) => (
                      <span key={i} className="text-[11px] bg-white/15 text-white px-2.5 py-1 rounded-md border border-white/20">
                        {day}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Slots available */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-sky-200">Standard Consultation Slots:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {doc.availableSlots.map((slot, i) => (
                      <Link
                        key={i}
                        href={`/appointments?doc=${doc.id}&slot=${encodeURIComponent(slot)}`}
                        className="text-xs font-semibold bg-white/10 hover:bg-white text-white hover:text-[#1F5084] p-2 rounded-lg border border-white/20 text-center transition-all"
                      >
                        {slot}
                      </Link>
                    ))}
                  </div>
                </div>

                <Link
                  href={`/appointments?doc=${doc.id}`}
                  className="w-full bg-white hover:bg-sky-50 text-[#1F5084] font-bold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-[0.98]"
                >
                  <Calendar className="w-4 h-4" />
                  Reserve Official Appointment
                </Link>
              </div>

              {/* Physician Contact Info */}
              <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                <h4 className="font-bold text-slate-900 text-sm">Direct Clinical Office</h4>
                <div className="space-y-2.5 text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-cyan-600" />
                    <a href={`tel:${doc.phone}`} className="hover:text-slate-900 font-medium">
                      {doc.phone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-cyan-600" />
                    <a href={`mailto:${doc.email}`} className="hover:text-slate-900 font-medium">
                      {doc.email}
                    </a>
                  </div>
                </div>
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
