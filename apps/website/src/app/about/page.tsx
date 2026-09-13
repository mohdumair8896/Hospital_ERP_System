import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { 
  Award, 
  ShieldCheck, 
  Users, 
  Building2, 
  Activity, 
  Stethoscope, 
  Microscope, 
  HeartHandshake, 
  ChevronRight,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About ProHealth Academic Medical Center | Mission & Leadership',
  description: 'Learn about ProHealth Hospital, our 45-year history of clinical excellence, JCI accreditation, and robotic surgical innovations.',
};

export default function AboutPage() {
  const leadership = [
    {
      name: 'Dr. Arthur Vance, MD, FACEP',
      role: 'Hospital Medical Director & Chief of Surgery',
      bio: 'Board-certified emergency physician with 26 years of trauma leadership. Former advisor to the American College of Emergency Physicians.',
      image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Dr. Elena Rostova, MD, PhD',
      role: 'Vice President of Clinical Affairs & Stroke Director',
      bio: 'Pioneered rapid endovascular mechanical thrombectomy protocols that reduced door-to-recanalization times by 35%.',
      image: 'https://images.unsplash.com/photo-1594824813571-638f02638520?auto=format&fit=crop&q=80&w=600'
    },
    {
      name: 'Eleanor Campbell, JD, CHC',
      role: 'Chief Compliance & Patient Privacy Officer',
      bio: 'Directs institutional compliance, ethical oversight, and oversees our immutable cryptographic audit logging infrastructure.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
    }
  ];

  const accreditations = [
    {
      title: 'JCI Gold Seal of Approval',
      desc: 'Accredited by Joint Commission International for exceeding international patient safety and healthcare quality standards.',
      badge: 'JCI Accredited'
    },
    {
      title: 'Malcolm Baldrige National Quality Award',
      desc: 'Recipient of the highest presidential honor for organizational performance excellence and clinical outcome leadership.',
      badge: 'Baldrige Honoree'
    },
    {
      title: 'Magnet Recognition for Nursing',
      desc: 'Awarded by the American Nurses Credentialing Center for exemplary professional nursing practice and clinical satisfaction.',
      badge: 'Magnet Designated'
    },
    {
      title: 'HIMSS Stage 7 Certified EHR',
      desc: 'Recognized for complete digital paperless clinical operations and zero-trust cryptographic audit verification.',
      badge: 'HIMSS Stage 7'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#F0F6FB] via-[#EBF3FB] to-white py-16 border-b border-slate-100">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4 font-medium">
            <Link href="/" className="hover:text-prohealth-primary transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-semibold">About Us</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAF2F9] border border-[#CBD5E1] text-prohealth-primary text-xs font-bold">
              <Building2 className="w-3.5 h-3.5 text-prohealth-secondary" />
              <span>45 Years of Clinical Dedication</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-prohealth-heading">
              Pioneering Medicine.{' '}
              <span className="text-prohealth-primary">
                Compassionate Care.
              </span>
            </h1>
            <p className="text-sm sm:text-base text-prohealth-body leading-relaxed">
              ProHealth Academic Medical Center is an integrated academic health system dedicated to healing, innovative scientific discovery, and educating the next generation of healthcare leaders.
            </p>
          </div>
        </div>
      </section>

      {/* Real Statistics Strip */}
      <section className="bg-slate-50 border-b border-slate-200 py-10">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-slate-900 font-display">450+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Licensed Inpatient Beds</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-cyan-600 font-display">18,000+</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Annual Surgical Procedures</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-slate-900 font-display">99.4%</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Clinical Satisfaction Score</div>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <div className="text-3xl font-extrabold text-emerald-600 font-display">4.2 min</div>
              <div className="text-xs text-slate-500 font-semibold mt-1">Average Trauma Triage Door Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 space-y-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-md border border-cyan-100">
                Our Institutional Purpose
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
                Our Mission & Patient Promise
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                To improve the health and wellbeing of the diverse communities we serve by delivering extraordinary, patient-centric clinical care, pioneering biomedical research, and setting global benchmarks in medical safety.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900">Zero-Harm Clinical Culture:</strong>
                    <p className="text-xs text-slate-500">Every clinical workflow is backed by standardized check-protocols and immutable record audits.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900">Patient-First Shared Decision Making:</strong>
                    <p className="text-xs text-slate-500">Patients and families are full partners in diagnostic deliberations and treatment plans.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-xs font-bold text-slate-900">Accelerated Translational Research:</strong>
                    <p className="text-xs text-slate-500">Bench-to-bedside clinical trials offering next-generation immunotherapies and robotic surgery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                alt="Modern ProHealth Academic Hospital Campus"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                <div className="text-white">
                  <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">Campus Overview</div>
                  <div className="text-lg font-bold">123 Healthcare Boulevard, Medical District</div>
                  <div className="text-xs text-slate-300 mt-1">Featuring 8 Specialized Surgical Theatres & Rooftop Helipad</div>
                </div>
              </div>
            </div>
          </div>

          {/* Accreditations Grid */}
          <div className="space-y-8 pt-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-md border border-cyan-100">
                Quality & Verification
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display">
                National & International Accreditations
              </h2>
              <p className="text-xs text-slate-500">
                Our clinical protocols undergo rigorous annual independent audits to maintain top-tier clinical credentials.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {accreditations.map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
                    <Award className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900">{item.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                  <span className="inline-block text-[10px] font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200">
                    {item.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership Team */}
          <div className="space-y-8 pt-10">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-600 bg-cyan-50 px-3 py-1 rounded-md border border-cyan-100">
                Executive Governance
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 font-display">
                Hospital Leadership & Medical Directors
              </h2>
              <p className="text-xs text-slate-500">
                Guided by seasoned medical physicians and healthcare administrators committed to compassionate patient advocacy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {leadership.map((leader, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                  <img
                    src={leader.image}
                    alt={leader.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-6 space-y-2">
                    <h3 className="text-base font-bold text-slate-900">{leader.name}</h3>
                    <div className="text-xs text-cyan-700 font-semibold">{leader.role}</div>
                    <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                      {leader.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-gradient-to-r from-sky-700 via-indigo-700 to-cyan-700 rounded-3xl p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-display">Ready to Consult With Our Faculty?</h3>
              <p className="text-xs text-sky-100 max-w-xl">
                Schedule a priority consultation with our board-certified department chairs and specialists.
              </p>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/appointments"
                className="bg-white text-sky-800 hover:bg-sky-50 font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98]"
              >
                Book Consultation
              </Link>
              <Link
                href="/doctors"
                className="bg-sky-800/60 hover:bg-sky-800 text-white font-semibold text-xs py-3 px-5 rounded-xl border border-sky-400/40 transition-all"
              >
                View Physicians
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
