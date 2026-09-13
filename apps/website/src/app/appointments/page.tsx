'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { DEPARTMENTS, DOCTORS, DepartmentData, DoctorData } from '../../data/hospitalData';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  AlertCircle,
  FileCheck,
  Stethoscope
} from 'lucide-react';

function AppointmentBookingContent() {
  const searchParams = useSearchParams();
  const preselectedDocId = searchParams.get('doc');
  const preselectedDeptId = searchParams.get('dept');
  const preselectedSlot = searchParams.get('slot');

  const [step, setStep] = useState<number>(1);
  const [selectedDeptId, setSelectedDeptId] = useState<string>(preselectedDeptId || '');
  const [selectedDocId, setSelectedDocId] = useState<string>(preselectedDocId || '');
  const [slotDate, setSlotDate] = useState<string>('2026-09-25');
  const [slotTime, setSlotTime] = useState<string>(preselectedSlot || '10:30 AM');
  const [careType, setCareType] = useState<'IN_PERSON' | 'TELEHEALTH'>('IN_PERSON');

  // Patient Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [consentToTreatment, setConsentToTreatment] = useState(false);

  // States
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmationData, setConfirmationData] = useState<any>(null);

  useEffect(() => {
    if (preselectedDocId) {
      const d = DOCTORS.find(doc => doc.id === preselectedDocId);
      if (d) {
        setSelectedDocId(d.id);
        setSelectedDeptId(d.departmentId);
        setStep(3); // Jump directly to slot selection if doctor already picked
      }
    } else if (preselectedDeptId) {
      setSelectedDeptId(preselectedDeptId);
      setStep(2);
    }
  }, [preselectedDocId, preselectedDeptId]);

  const activeDoctor = DOCTORS.find(d => d.id === selectedDocId);
  const activeDepartment = DEPARTMENTS.find(d => d.id === selectedDeptId);

  const availableSlots = activeDoctor ? activeDoctor.availableSlots : [
    '09:00 AM', '10:30 AM', '01:30 PM', '03:00 PM', '04:15 PM'
  ];

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1 && !selectedDeptId) {
      setErrorMsg('Please select a clinical department');
      return;
    }
    if (step === 2 && !selectedDocId) {
      setErrorMsg('Please select a specialist physician');
      return;
    }
    if (step === 3 && (!slotDate || !slotTime)) {
      setErrorMsg('Please select appointment date and time');
      return;
    }
    if (step === 4) {
      if (!firstName || !lastName || !phone || !email) {
        setErrorMsg('Please provide complete contact information');
        return;
      }
      if (!consentToTreatment) {
        setErrorMsg('You must consent to clinical treatment and privacy terms');
        return;
      }
      handleSubmitBooking();
      return;
    }
    setStep(s => s + 1);
  };

  const handleSubmitBooking = async () => {
    setSubmitting(true);
    setErrorMsg(null);

    const payload = {
      doctorId: selectedDocId,
      departmentId: selectedDeptId,
      slotDate,
      slotTime,
      type: careType === 'IN_PERSON' ? 'OPD_IN_PERSON' : 'TELEHEALTH_VIRTUAL',
      symptoms: symptoms || 'General Clinical Consultation',
      consentToTreatment: true,
      newPatient: {
        firstName,
        lastName,
        phoneNumber: phone,
        email,
      }
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Booking reservation failed');
      }

      const booked = await res.json();
      setConfirmationData(booked);
      setStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to hospital reservation system');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="relative py-14 overflow-hidden" style={{background: 'linear-gradient(135deg, #EAF2F9 0%, #F0F6FB 50%, #FFFFFF 100%)'}}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <Link href="/" className="hover:text-[#1F5084]">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#1F5084] font-semibold">Book Appointment</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-[#1D2939]">
            Schedule a Clinical Appointment
          </h1>
          <p className="text-xs sm:text-sm text-[#475467] mt-1.5">
            4-step streamlined reservation. Real-time slot availability backed by encrypted patient record security.
          </p>
        </div>
      </section>

      {/* Progress Stepper (Zeigarnik Effect & Miller's Law) */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-6xl mx-auto px-6 sm:px-8">
          <div className="flex items-center justify-between">
            {[
              { num: 1, label: 'Department' },
              { num: 2, label: 'Physician' },
              { num: 3, label: 'Date & Slot' },
              { num: 4, label: 'Patient Info' },
              { num: 5, label: 'Confirmed' }
            ].map((st) => (
              <div key={st.num} className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    step === st.num
                      ? 'bg-cyan-600 text-white ring-4 ring-cyan-100'
                      : step > st.num
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > st.num ? '✓' : st.num}
                </div>
                <span className={`text-xs font-semibold hidden sm:inline ${step === st.num ? 'text-slate-900' : 'text-slate-400'}`}>
                  {st.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Wizard Form Body */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 py-12 flex-1 w-full">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3 text-red-800 text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Department Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Step 1: Choose Medical Department</h2>
                <p className="text-xs text-slate-500 mt-1">Select the clinical institute that aligns with your medical requirements.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DEPARTMENTS.map((dept) => (
                  <div
                    key={dept.id}
                    onClick={() => setSelectedDeptId(dept.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      selectedDeptId === dept.id
                        ? 'border-cyan-600 bg-cyan-50/60 shadow-md ring-2 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xs font-bold text-slate-900">{dept.name}</h3>
                        {dept.emergencySupport && (
                          <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">24/7</span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">{dept.shortDesc}</p>
                    </div>
                    <div className="text-[10px] text-cyan-700 font-bold flex items-center gap-1">
                      <span>Lead: {dept.leadPhysician}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Step 2: Select Attending Specialist</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Viewing available physicians in {activeDepartment ? activeDepartment.name : 'selected specialty'}.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {DOCTORS.filter(d => !selectedDeptId || d.departmentId === selectedDeptId).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDocId(doc.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${
                      selectedDocId === doc.id
                        ? 'border-cyan-600 bg-cyan-50/60 shadow-md ring-2 ring-cyan-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <img
                      src={doc.avatarUrl}
                      alt={doc.name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-sm"
                    />
                    <div className="space-y-1 flex-1">
                      <h3 className="text-xs font-bold text-slate-900">{doc.name}</h3>
                      <p className="text-[11px] text-cyan-700 font-semibold">{doc.specialty}</p>
                      <p className="text-[10px] text-slate-400">{doc.qualification}</p>
                      <div className="text-xs font-extrabold text-slate-900 pt-0.5">${doc.consultationFee} <span className="text-[10px] text-slate-400 font-normal">Fee</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Date & Slot Picker */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Step 3: Appointment Date & Time Slot</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Consultation with <strong className="text-slate-900">{activeDoctor?.title}</strong>
                </p>
              </div>

              {/* Care Type Switcher */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Consultation Type</label>
                <div className="grid grid-cols-2 gap-3 max-w-sm">
                  <button
                    type="button"
                    onClick={() => setCareType('IN_PERSON')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      careType === 'IN_PERSON'
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Hospital In-Person Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setCareType('TELEHEALTH')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                      careType === 'TELEHEALTH'
                        ? 'border-cyan-600 bg-cyan-50 text-cyan-900'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Telehealth Virtual Video
                  </button>
                </div>
              </div>

              {/* Date Input */}
              <div className="space-y-2 max-w-sm">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Preferred Date</label>
                <input
                  type="date"
                  value={slotDate}
                  min="2026-09-14"
                  max="2026-12-31"
                  onChange={(e) => setSlotDate(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 text-xs font-medium text-slate-900 outline-none"
                />
              </div>

              {/* Time Slots Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Available Consultation Slots</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {availableSlots.map((slot, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSlotTime(slot)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        slotTime === slot
                          ? 'border-cyan-600 bg-cyan-600 text-white shadow-md'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Patient Info & Consent */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Step 4: Patient Information & Clinical Consent</h2>
                <p className="text-xs text-slate-500 mt-1">Please provide accurate contact details for appointment confirmation and clinic check-in.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">First Name *</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Eleanor"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Last Name *</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Phone Number (SMS Confirmation) *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 019-2831"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs text-slate-900 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Email Address (Clinical Notices) *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eleanor@example.com"
                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Reason for Visit / Primary Symptoms</label>
                <textarea
                  rows={3}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your primary symptoms or health concern (e.g., annual cardiac evaluation, joint stiffness, second opinion)..."
                  className="w-full p-3 rounded-xl border border-slate-200 focus:border-cyan-500 text-xs text-slate-900 outline-none"
                />
              </div>

              {/* Consent Checkbox (HIPAA compliance) */}
              <div className="p-4 rounded-2xl bg-cyan-50/70 border border-cyan-100 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="consentCheck"
                  checked={consentToTreatment}
                  onChange={(e) => setConsentToTreatment(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                />
                <label htmlFor="consentCheck" className="text-xs text-slate-700 leading-relaxed cursor-pointer">
                  I give consent for ProHealth to schedule and provide clinical services. I acknowledge receipt of the{' '}
                  <Link href="/privacy-policy" className="text-cyan-700 font-bold hover:underline">
                    HIPAA Notice of Privacy Practices
                  </Link>{' '}
                  and agree to the{' '}
                  <Link href="/terms" className="text-cyan-700 font-bold hover:underline">
                    Conditions of Care
                  </Link>.
                </label>
              </div>
            </div>
          )}

          {/* STEP 5: Booking Confirmation Screen (Peak-End Rule) */}
          {step === 5 && confirmationData && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-1">
                <h2 className="text-2xl font-extrabold text-slate-900 font-display">Appointment Confirmed!</h2>
                <p className="text-xs text-slate-500">Your clinical booking has been registered in the ProHealth hospital system.</p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Confirmation Code:</span>
                  <strong className="text-cyan-700 font-mono text-sm">{confirmationData.appointmentNumber}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Physician:</span>
                  <strong className="text-slate-900">{confirmationData.doctorName}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800">{confirmationData.departmentName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Date & Slot:</span>
                  <strong className="text-slate-900">{confirmationData.slotDate} at {confirmationData.slotTime}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name:</span>
                  <span className="text-slate-800">{confirmationData.patientName}</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 max-w-sm mx-auto">
                A confirmation SMS and calendar invitation have been dispatched to your provided contact details. Please arrive 15 minutes prior to your scheduled time.
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <Link
                  href="/"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 px-5 rounded-xl border border-slate-200"
                >
                  Return to Home
                </Link>
                <a
                  href="http://localhost:5173"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-md"
                >
                  Open Patient Portal
                </a>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          {step < 5 && (
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => { setErrorMsg(null); setStep(s => s - 1); }}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back
                </button>
              ) : <div />}

              <button
                type="button"
                onClick={handleNext}
                disabled={submitting}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
              >
                <span>{step === 4 ? (submitting ? 'Confirming...' : 'Finalize Reservation') : 'Continue'}</span>
                {step < 4 && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}

export default function AppointmentsBookingPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-xs font-bold text-slate-500 animate-pulse">
            Loading Appointment Wizard...
          </div>
        </div>
      }
    >
      <AppointmentBookingContent />
    </React.Suspense>
  );
}
