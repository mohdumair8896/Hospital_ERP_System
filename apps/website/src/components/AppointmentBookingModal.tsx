import React, { useState, useEffect } from 'react';
import { 
  X, 
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
  AlertCircle
} from 'lucide-react';
import { Department, Doctor, Appointment } from '@hospital/contracts';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedDepartmentId
}: AppointmentBookingModalProps) {
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
  const [slotTime, setSlotTime] = useState<string>('');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [patientLastName, setPatientLastName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [symptoms, setSymptoms] = useState('');

  // Fetch departments & doctors
  useEffect(() => {
    if (!isOpen) return;

    fetch('http://localhost:4000/api/v1/appointments/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (!selectedDeptId && data.length > 0) {
          setSelectedDeptId(data[0].id);
        }
      })
      .catch(() => {});

    fetch('http://localhost:4000/api/v1/appointments/doctors')
      .then(res => res.json())
      .then(data => {
        setDoctors(data);
        if (preselectedDoctorId) {
          setSelectedDoctorId(preselectedDoctorId);
          const doc = data.find((d: Doctor) => d.id === preselectedDoctorId);
          if (doc) setSelectedDeptId(doc.departmentId);
        }
      })
      .catch(() => {});
  }, [isOpen, preselectedDoctorId, preselectedDepartmentId]);

  if (!isOpen) return null;

  const activeDoctor = doctors.find(d => d.id === selectedDoctorId);
  const availableSlots = activeDoctor ? activeDoctor.availableSlots : ['09:00 AM', '10:30 AM', '02:00 PM', '03:30 PM'];

  const handleNext = () => {
    setErrorMsg(null);
    if (step === 1 && !selectedDeptId) {
      setErrorMsg('Please select a department');
      return;
    }
    if (step === 2 && !selectedDoctorId) {
      setErrorMsg('Please select a physician');
      return;
    }
    if (step === 3 && (!slotDate || !slotTime)) {
      setErrorMsg('Please select your preferred date and time slot');
      return;
    }
    if (step === 4) {
      if (!patientFirstName || !patientLastName || !patientPhone || !patientEmail) {
        setErrorMsg('Please fill in all contact details');
        return;
      }
      handleSubmitBooking();
      return;
    }
    setStep(s => s + 1);
  };

  const handleBack = () => {
    setErrorMsg(null);
    setStep(s => Math.max(1, s - 1));
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    setErrorMsg(null);

    const payload = {
      doctorId: selectedDoctorId,
      departmentId: selectedDeptId,
      slotDate,
      slotTime,
      type: careType,
      symptoms: symptoms || 'General Medical Consultation',
      newPatient: {
        firstName: patientFirstName,
        lastName: patientLastName,
        phoneNumber: patientPhone,
        email: patientEmail
      }
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to book appointment');
      }

      const data = await res.json();
      setConfirmedAppt(data);
      setStep(5); // Success step
    } catch (err) {
      setErrorMsg((err as Error).message || 'Server error during booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#1F5084] text-white p-6 flex justify-between items-center border-b border-[#164273]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 text-white flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold">Schedule an Appointment</h2>
              <p className="text-xs text-sky-200">ProHealth Academic Medical Center</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-sky-200 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar (Steps 1 to 4) */}
        {step < 5 && (
          <div className="px-6 pt-4 pb-2 bg-slate-50 border-b border-slate-100">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
              <span className={step >= 1 ? 'text-[#1F5084] font-bold' : ''}>1. Department</span>
              <span className={step >= 2 ? 'text-[#1F5084] font-bold' : ''}>2. Doctor</span>
              <span className={step >= 3 ? 'text-[#1F5084] font-bold' : ''}>3. Date &amp; Slot</span>
              <span className={step >= 4 ? 'text-[#1F5084] font-bold' : ''}>4. Patient Info</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1F5084] h-full transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6">
          {/* STEP 1: Department & Care Type */}
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Care Mode
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setCareType('OPD_IN_PERSON')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      careType === 'OPD_IN_PERSON'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-950 font-bold ring-2 ring-cyan-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Building2 className="w-5 h-5 text-cyan-600" />
                    <div>
                      <div className="text-xs font-bold">In-Person Clinic (OPD)</div>
                      <div className="text-[10px] text-slate-500">Visit medical center</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCareType('TELEHEALTH_VIRTUAL')}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all ${
                      careType === 'TELEHEALTH_VIRTUAL'
                        ? 'border-cyan-600 bg-cyan-50/50 text-cyan-950 font-bold ring-2 ring-cyan-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Video className="w-5 h-5 text-sky-600" />
                    <div>
                      <div className="text-xs font-bold">Telehealth Video</div>
                      <div className="text-[10px] text-slate-500">Encrypted virtual consult</div>
                    </div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Choose Clinical Specialty
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                  {departments.map(dept => (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => {
                        setSelectedDeptId(dept.id);
                        setSelectedDoctorId(''); // Reset doctor when dept changes
                      }}
                      className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                        selectedDeptId === dept.id
                          ? 'border-cyan-600 bg-cyan-50/70 text-cyan-950 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{dept.name}</div>
                        <div className="text-[10px] text-slate-500">{dept.location}</div>
                      </div>
                      {dept.emergencySupport && (
                        <span className="text-[9px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">24/7</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Selection */}
          {step === 2 && (
            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Select Physician / Consultant
              </label>
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {doctors
                  .filter(d => !selectedDeptId || d.departmentId === selectedDeptId)
                  .map(doc => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                        selectedDoctorId === doc.id
                          ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-500/20'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={doc.avatarUrl}
                        alt={doc.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="flex-1">
                        <div className="text-xs font-bold text-slate-900">{doc.name}</div>
                        <div className="text-[11px] text-cyan-700 font-medium">{doc.specialty}</div>
                        <div className="text-[10px] text-slate-500">{doc.qualification}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-extrabold text-slate-900">${doc.consultationFee}</div>
                        <div className="text-[10px] text-slate-400">Consultation</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3: Date & Slot Selection */}
          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Appointment Date
                </label>
                <input
                  type="date"
                  value={slotDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={e => setSlotDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {availableSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setSlotTime(slot)}
                      className={`py-2.5 px-3 rounded-lg border text-xs font-bold transition-all text-center ${
                        slotTime === slot
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-sm'
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {activeDoctor && (
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-600 shrink-0" />
                  <span>
                    Consulting with <strong>{activeDoctor.name}</strong> • ${activeDoctor.consultationFee} Standard Fee
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Patient Contact Info */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John"
                    value={patientFirstName}
                    onChange={e => setPatientFirstName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Doe"
                    value={patientLastName}
                    onChange={e => setPatientLastName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+1 (555) 000-0000"
                    value={patientPhone}
                    onChange={e => setPatientPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="john.doe@example.com"
                    value={patientEmail}
                    onChange={e => setPatientEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Chief Symptoms / Reason for Visit</label>
                <textarea
                  rows={2}
                  placeholder="Describe any symptoms, ongoing treatment, or referral notes..."
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-lg text-[11px] text-cyan-900 leading-relaxed">
                ℹ️ By booking, you agree to receive automated appointment reminders via SMS & Email. All health information is securely audited under HIPAA compliance regulations.
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation Receipt */}
          {step === 5 && confirmedAppt && (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Appointment Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-0.5">Your schedule has been reserved in our clinical management system.</p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-mono font-bold text-cyan-700">{confirmedAppt.appointmentNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Patient Name</span>
                  <span className="font-bold text-slate-800">{confirmedAppt.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Physician</span>
                  <span className="font-bold text-slate-800">{confirmedAppt.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Specialty</span>
                  <span className="font-semibold text-slate-800">{confirmedAppt.departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Date & Slot</span>
                  <span className="font-bold text-emerald-600">{confirmedAppt.slotDate} at {confirmedAppt.slotTime}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-500">Consultation Fee</span>
                  <span className="font-bold text-slate-900">${confirmedAppt.consultationFee}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="bg-[#1F5084] hover:bg-[#164273] text-white text-xs font-bold px-6 py-2.5 rounded-xl transition-colors"
              >
                Close Receipt
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Controls (Steps 1 to 4) */}
        {step < 5 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              disabled={loading}
              onClick={handleNext}
              className="flex items-center gap-1.5 bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-700 hover:to-cyan-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md shadow-cyan-600/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <span>{step === 4 ? (loading ? 'Processing...' : 'Confirm & Book') : 'Continue'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
