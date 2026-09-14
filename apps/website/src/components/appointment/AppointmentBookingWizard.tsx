'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft, 
  Phone, 
  Mail, 
  Stethoscope, 
  Video, 
  Building2,
  AlertCircle,
  X,
  ShieldCheck,
  Star
} from 'lucide-react';
import { Department, Doctor, Appointment } from '@hospital/contracts';
import { API_BASE_URL } from '@/lib/api';
import { DEPARTMENTS as FALLBACK_DEPTS, DOCTORS as FALLBACK_DOCS } from '@/data/hospitalData';

export interface AppointmentBookingWizardProps {
  variant?: 'embedded' | 'modal' | 'page';
  onClose?: () => void;
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
  preselectedSlot?: string;
}

const DEFAULT_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

export default function AppointmentBookingWizard({
  variant = 'page',
  onClose,
  preselectedDoctorId,
  preselectedDepartmentId,
  preselectedSlot,
}: AppointmentBookingWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [selectedDeptId, setSelectedDeptId] = useState<string>(preselectedDepartmentId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  const [careType, setCareType] = useState<'OPD_IN_PERSON' | 'TELEHEALTH_VIRTUAL'>('OPD_IN_PERSON');
  const [slotDate, setSlotDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slotTime, setSlotTime] = useState<string>(preselectedSlot || '10:00 AM');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [consentGiven, setConsentGiven] = useState(true);

  // Load live data from API Gateway with graceful static fallback
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/v1/appointments/departments`)
      .then(res => res.json())
      .then(data => setDepartments(Array.isArray(data) ? data : (FALLBACK_DEPTS as any)))
      .catch(() => setDepartments(FALLBACK_DEPTS as any));

    fetch(`${API_BASE_URL}/api/v1/appointments/doctors`)
      .then(res => res.json())
      .then(data => setDoctors(Array.isArray(data) ? data : (FALLBACK_DOCS as any)))
      .catch(() => setDoctors(FALLBACK_DOCS as any));
  }, []);

  // Synchronize preselected inputs
  useEffect(() => {
    if (preselectedDoctorId) {
      setSelectedDoctorId(preselectedDoctorId);
      const matched = doctors.find(d => d.id === preselectedDoctorId);
      if (matched) {
        setSelectedDeptId(matched.departmentId);
        setStep(3); // Jump directly to slot selection
      }
    } else if (preselectedDepartmentId) {
      setSelectedDeptId(preselectedDepartmentId);
      setStep(2);
    }
  }, [preselectedDoctorId, preselectedDepartmentId, doctors]);

  const selectedDepartment = departments.find(d => d.id === selectedDeptId);
  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId);
  const availableDoctors = selectedDeptId
    ? doctors.filter(d => d.departmentId === selectedDeptId)
    : doctors;

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1 && !selectedDeptId) {
      setErrorMsg('Please select a clinical department to continue.');
      return;
    }
    if (step === 2 && !selectedDoctorId) {
      setErrorMsg('Please select a specialist physician to proceed.');
      return;
    }
    if (step === 3 && (!slotDate || !slotTime)) {
      setErrorMsg('Please select both an appointment date and time slot.');
      return;
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(s => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!patientFirstName.trim() || !patientLastName.trim() || !patientPhone.trim()) {
      setErrorMsg('First Name, Last Name, and Contact Phone are required.');
      return;
    }
    if (!consentGiven) {
      setErrorMsg('Please consent to HIPAA-compliant medical scheduling.');
      return;
    }

    setLoading(true);

    const payload = {
      doctorId: selectedDoctorId,
      departmentId: selectedDeptId,
      doctorName: selectedDoctor?.name || 'Assigned Specialist',
      departmentName: selectedDepartment?.name || 'General Outpatient Care',
      slotDate,
      slotTime,
      type: careType,
      symptoms: symptoms.trim() || 'Routine clinical outpatient evaluation',
      newPatient: {
        firstName: patientFirstName.trim(),
        lastName: patientLastName.trim(),
        phoneNumber: patientPhone.trim(),
        email: patientEmail.trim() || 'patient@prohealth.hospital',
      },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to confirm appointment booking');
      }

      const appt: Appointment = await res.json();
      setConfirmedAppt(appt);
      setStep(5);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred during booking.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfirmedAppt(null);
    setSelectedDeptId('');
    setSelectedDoctorId('');
    setPatientFirstName('');
    setPatientLastName('');
    setPatientPhone('');
    setPatientEmail('');
    setSymptoms('');
    setStep(1);
    if (onClose) onClose();
  };

  const content = (
    <div className="space-y-6">
      {/* Step Indicators */}
      {step < 5 && (
        <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-slate-800 pr-10 sm:pr-12">
          {[
            { num: 1, label: 'Department' },
            { num: 2, label: 'Physician' },
            { num: 3, label: 'Schedule' },
            { num: 4, label: 'Patient Info' },
          ].map((item, idx) => (
            <div key={item.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === item.num
                    ? 'bg-[#1F5084] text-white shadow-sm'
                    : step > item.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step > item.num ? '✓' : item.num}
              </div>
              <span className={`text-xs font-medium hidden sm:inline ${step === item.num ? 'text-[#1F5084] font-bold' : 'text-slate-500'}`}>
                {item.label}
              </span>
              {idx < 3 && <ChevronRight className="w-3.5 h-3.5 text-slate-300 hidden sm:inline" />}
            </div>
          ))}
        </div>
      )}

      {/* Error Alert */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Select Department */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Select Clinical Department
            </h3>
            <p className="text-xs text-slate-500">
              Choose the specialty center matching your medical concern.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {departments.map((dept) => (
              <div
                key={dept.id}
                onClick={() => setSelectedDeptId(dept.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDeptId === dept.id
                    ? 'border-[#1F5084] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#1F5084]'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-[#1F5084]/10 text-[#1F5084] flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{dept.name}</h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{dept.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: Select Physician */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Select Specialist Doctor
            </h3>
            <p className="text-xs text-slate-500">
              Showing accredited specialists for {selectedDepartment?.name || 'selected department'}.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {availableDoctors.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  selectedDoctorId === doc.id
                    ? 'border-[#1F5084] bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-[#1F5084]'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-800'
                }`}
              >
                <img
                  src={doc.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=120'}
                  alt={doc.name}
                  className="w-12 h-12 rounded-xl object-cover shrink-0 border"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{doc.name}</h4>
                  <p className="text-[11px] text-[#1F5084] font-medium">{doc.specialty}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                    <span className="flex items-center gap-0.5 font-semibold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {doc.rating}
                    </span>
                    <span>•</span>
                    <span>Fee: ${doc.consultationFee}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: Mode, Date & Time Slot */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Select Care Mode &amp; Time Slot
            </h3>
            <p className="text-xs text-slate-500">
              Consulting with {selectedDoctor?.name || 'your physician'}.
            </p>
          </div>

          {/* Consultation Type */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setCareType('OPD_IN_PERSON')}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                careType === 'OPD_IN_PERSON'
                  ? 'border-[#1F5084] bg-blue-50/50 dark:bg-blue-950/30 text-[#1F5084] font-bold ring-1 ring-[#1F5084]'
                  : 'border-slate-200 text-slate-600 dark:border-slate-800'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-[#1F5084]" />
              <div>
                <p className="text-xs">In-Person Consultation</p>
                <p className="text-[10px] opacity-75 font-normal">Hospital OPD Suite</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setCareType('TELEHEALTH_VIRTUAL')}
              className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                careType === 'TELEHEALTH_VIRTUAL'
                  ? 'border-[#1F5084] bg-blue-50/50 dark:bg-blue-950/30 text-[#1F5084] font-bold ring-1 ring-[#1F5084]'
                  : 'border-slate-200 text-slate-600 dark:border-slate-800'
              }`}
            >
              <Video className="w-4 h-4 text-purple-600" />
              <div>
                <p className="text-xs">Virtual Telehealth</p>
                <p className="text-[10px] opacity-75 font-normal">Encrypted Video Call</p>
              </div>
            </button>
          </div>

          {/* Date Picker */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Select Consultation Date
            </label>
            <input
              type="date"
              value={slotDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSlotDate(e.target.value)}
              className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs focus:ring-1 focus:ring-[#1F5084] outline-none"
            />
          </div>

          {/* Time Slots */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Available Time Slots
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {(selectedDoctor?.availableSlots && selectedDoctor.availableSlots.length > 0
                ? selectedDoctor.availableSlots
                : DEFAULT_SLOTS
              ).map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSlotTime(time)}
                  className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-all ${
                    slotTime === time
                      ? 'bg-[#1F5084] text-white border-[#1F5084] shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STEP 4: Patient Details */}
      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Patient Identification &amp; Contact
            </h3>
            <p className="text-xs text-slate-500">
              Enter personal details to generate your electronic health record intake.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                placeholder="Elena"
                value={patientFirstName}
                onChange={(e) => setPatientFirstName(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs outline-none focus:ring-1 focus:ring-[#1F5084]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                placeholder="Markov"
                value={patientLastName}
                onChange={(e) => setPatientLastName(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs outline-none focus:ring-1 focus:ring-[#1F5084]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 234-5678"
                value={patientPhone}
                onChange={(e) => setPatientPhone(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs outline-none focus:ring-1 focus:ring-[#1F5084]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="patient@example.com"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className="w-full h-9 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 text-xs outline-none focus:ring-1 focus:ring-[#1F5084]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
              Symptoms / Chief Concern
            </label>
            <textarea
              rows={3}
              placeholder="Describe primary symptoms, pain duration, or previous diagnoses..."
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-2.5 text-xs outline-none focus:ring-1 focus:ring-[#1F5084]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="consent"
              checked={consentGiven}
              onChange={(e) => setConsentGiven(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#1F5084] focus:ring-[#1F5084]"
            />
            <label htmlFor="consent" className="text-[11px] text-slate-600 dark:text-slate-400">
              I consent to HIPAA-compliant medical intake and clinical scheduling.
            </label>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1F5084] hover:bg-[#164273] text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? 'Confirming with Hospital DB...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      )}

      {/* Navigation Buttons for Steps 1-3 */}
      {step < 4 && (
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          {step > 1 ? (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}
          <button
            type="button"
            onClick={handleNext}
            className="bg-[#1F5084] hover:bg-[#164273] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
          >
            Continue <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* STEP 5: Confirmation */}
      {step === 5 && confirmedAppt && (
        <div className="py-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Appointment Confirmed
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
              Booking ID: {confirmedAppt.appointmentNumber}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              A confirmation and clinical preparation instructions have been recorded.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-xs text-left space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-slate-500">Physician:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{confirmedAppt.doctorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Department:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">{confirmedAppt.departmentName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date &amp; Time:</span>
              <span className="font-bold text-[#1F5084]">{confirmedAppt.slotDate} at {confirmedAppt.slotTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Patient:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">{confirmedAppt.patientName}</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50"
            >
              Book Another
            </button>
            {variant === 'modal' && onClose && (
              <button
                type="button"
                onClick={onClose}
                className="bg-[#1F5084] hover:bg-[#164273] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === 'modal') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {content}
        </div>
      </div>
    );
  }

  if (variant === 'embedded') {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
        {content}
      </div>
    );
  }

  // Standalone 'page' variant
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 max-w-3xl mx-auto">
      {content}
    </div>
  );
}
