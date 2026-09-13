'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { BugReportForm } from '../../components/BugReportForm';
import { FormRhfCheckbox } from '../../components/FormRhfCheckbox';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Ambulance, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  ChevronRight,
  AlertCircle,
  Building2,
  Bug,
  Bell
} from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('General Inquiries');
  const [message, setMessage] = useState('');
  const [consent, setConsent] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('Please fill in your name, email, and inquiry message.');
      return;
    }
    if (!consent) {
      setErrorMsg('You must agree to the privacy consent terms.');
      return;
    }

    setErrorMsg(null);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Hero Header */}
      <section className="relative py-16 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">Contact &amp; Campus</span>
          </nav>
          <div className="max-w-3xl space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#1F5084] bg-[#1F5084]/10 px-3 py-1 rounded border border-[#1F5084]/20">
              Reach Out &amp; Directions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
              Contact ProHealth Medical Center
            </h1>
            <p className="text-sm text-[#475467] leading-relaxed">
              We are here to support your clinical journey 24 hours a day, 7 days a week. Connect with our administrative desks or patient advocates.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left: Contact Directory & Campus Details */}
            <div className="lg:col-span-5 space-y-8">
              {/* Emergency Banner */}
              <div className="p-6 rounded-3xl bg-red-950 text-white border border-red-800 shadow-xl space-y-3">
                <div className="flex items-center gap-2.5 text-red-400 font-extrabold text-sm uppercase tracking-wider">
                  <Ambulance className="w-5 h-5 text-red-400" />
                  <span>24/7 Level 1 Trauma & Ambulance</span>
                </div>
                <div className="text-3xl font-extrabold text-white font-display">
                  876-256-876
                </div>
                <p className="text-xs text-red-200 leading-relaxed">
                  Dedicated priority line for acute cardiopulmonary emergencies, polytrauma, and urgent pediatric transport.
                </p>
              </div>

              {/* Direct Department Directory */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-5">
                <h3 className="text-base font-bold text-slate-900 font-display">Hospital Contact Directory</h3>

                <div className="space-y-4 text-xs">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <Phone className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800">Main Switchboard / OPD Desk</div>
                      <div className="text-slate-500">+1 (555) 019-2831 (Mon–Sat: 07:00 AM – 08:00 PM)</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <Mail className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800">Patient Relations & Inquiries</div>
                      <div className="text-slate-500">care@prohealth.hospital</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800">Medical Records & Release of Information</div>
                      <div className="text-slate-500">records@prohealth.hospital</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-cyan-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="font-bold text-slate-800">Campus Address</div>
                      <div className="text-slate-500">
                        123 Healthcare Blvd, Medical District, New York, NY 10016
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Parking available in Pavilion Garage C</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600" />
                  <span>Hours of Operation</span>
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span>Emergency Department:</span>
                    <strong className="text-emerald-700">Open 24 Hours / 365 Days</strong>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span>Outpatient Consultations:</span>
                    <span className="font-medium text-slate-800">Mon–Fri: 8:00 AM – 6:00 PM</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-100">
                    <span>Diagnostic Imaging & Lab:</span>
                    <span className="font-medium text-slate-800">Open 24/7 (Inpatients & ER)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outpatient Pharmacy:</span>
                    <span className="font-medium text-slate-800">Daily: 7:30 AM – 10:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Interactive Contact Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Send an Administrative Inquiry</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    For non-urgent inquiries, billing questions, or appointment reschedule requests.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in zoom-in-95 duration-200">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-base font-bold text-emerald-950">Inquiry Received</h4>
                    <p className="text-xs text-emerald-800 leading-relaxed max-w-sm mx-auto">
                      Thank you for contacting ProHealth. A patient coordinator will review your message and reply within 1 business day.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMsg && (
                      <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Full Name *</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Eleanor Vance"
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-cyan-500 outline-none text-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Email Address *</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="eleanor@example.com"
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-cyan-500 outline-none text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Phone Number</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-cyan-500 outline-none text-slate-900"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">Recipient Department</label>
                        <select
                          value={department}
                          onChange={(e) => setDepartment(e.target.value)}
                          className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-cyan-500 outline-none text-slate-900 bg-white"
                        >
                          <option value="General Inquiries">General Patient Relations</option>
                          <option value="Cardiology">Cardiology Institute</option>
                          <option value="Neurology">Neurology & Stroke Center</option>
                          <option value="Pediatrics">Children’s Health & NICU</option>
                          <option value="Orthopedics">Orthopedic Surgery</option>
                          <option value="Billing">Medical Billing & Insurance</option>
                          <option value="Privacy">Privacy Officer (HIPAA)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Your Message *</label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Please do not include sensitive medical diagnoses here. For clinical care, please book an appointment."
                        className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:border-cyan-500 outline-none text-slate-900"
                      />
                    </div>

                    {/* HIPAA Consent */}
                    <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="contactConsent"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                      />
                      <label htmlFor="contactConsent" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                        I consent to the collection and handling of my inquiry data under the{' '}
                        <Link href="/privacy-policy" className="text-cyan-700 font-bold hover:underline">
                          ProHealth Notice of Privacy Practices
                        </Link>.
                      </label>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#1F5084] hover:bg-[#164273] text-white font-bold text-xs py-3.5 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Submit Administrative Message
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Support, Bug Report & Notification Preferences */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <div className="mb-10 text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F5084] bg-[#1F5084]/10 px-3 py-1 rounded-full border border-[#1F5084]/20">
              Technical Assistance &amp; Preferences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
              Report a Portal Bug or Configure Alerts
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Found an issue using our portal on desktop or mobile? Submit a bug report or manage your notification preferences directly with our engineering team.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start justify-items-center">
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Bug className="w-4 h-4 text-orange-500" />
                <span>Portal &amp; App Bug Report</span>
              </div>
              <BugReportForm />
            </div>

            <div className="w-full flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">
                <Bell className="w-4 h-4 text-[#1F5084]" />
                <span>Communication &amp; Alert Preferences</span>
              </div>
              <FormRhfCheckbox />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
