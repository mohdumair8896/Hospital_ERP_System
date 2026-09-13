import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  UserPlus, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Play, 
  CheckCheck, 
  XCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { Appointment, Patient, AppointmentStatus } from '@hospital/contracts';

export default function ReceptionDesk() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'APPOINTMENTS' | 'NEW_PATIENT'>('APPOINTMENTS');

  // New Patient Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('1990-01-01');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [bloodGroup, setBloodGroup] = useState<'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'>('O+');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('New York');
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/appointments');
      const data = await res.json();
      setAppointments(data.appointments || []);
    } catch (err) {
      console.error('Failed to load appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, status: AppointmentStatus) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/appointments/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchAppointments();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleRegisterPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        firstName,
        lastName,
        dateOfBirth: dob,
        gender,
        bloodGroup,
        phoneNumber: phone,
        email,
        street,
        city,
        state: 'NY',
        postalCode: '10001',
        emergencyContactName: 'Guardian Contact',
        emergencyContactPhone: phone,
        emergencyContactRelation: 'Family'
      };

      const res = await fetch('http://localhost:4000/api/v1/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to register patient');
      const saved = await res.json();
      setCreatedPatient(saved);
      // Reset
      setFirstName('');
      setLastName('');
      setPhone('');
      setEmail('');
      setStreet('');
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Tabs */}
      <div className="flex justify-between items-center bg-white border border-[#E4E7EC] p-2 rounded-2xl shadow-sm">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('APPOINTMENTS')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'APPOINTMENTS'
                ? 'bg-[#1F5084] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Outpatient Appointments Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('NEW_PATIENT')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'NEW_PATIENT'
                ? 'bg-[#1F5084] text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Fast Patient Registration</span>
          </button>
        </div>

        <button
          onClick={fetchAppointments}
          className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-3 py-2 rounded-xl flex items-center gap-1 font-semibold border border-slate-200 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {activeTab === 'APPOINTMENTS' && (
        <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-[#E4E7EC] flex justify-between items-center text-xs">
            <span className="font-bold text-[#1D2939]">Scheduled Appointments ({appointments.length})</span>
            <span className="text-slate-500 text-[11px]">Real-time synchronization with appointment_db</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F6FB] text-slate-600 border-b border-[#E4E7EC] uppercase font-bold tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Ref Number</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Doctor</th>
                  <th className="py-3 px-4">Slot</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E4E7EC] text-slate-700">
                {appointments.map(appt => (
                  <tr key={appt.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-3 px-4 font-mono text-[#1F5084] font-bold">{appt.appointmentNumber}</td>
                    <td className="py-3 px-4 font-bold text-[#1D2939]">
                      {appt.patientName}
                      <div className="text-[10px] text-slate-500 font-normal">{appt.patientPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      {appt.doctorName}
                      <div className="text-[10px] text-slate-500">{appt.departmentName}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-[#1D2939]">{appt.slotDate}</span>
                      <div className="text-[11px] text-[#1F5084] font-semibold">{appt.slotTime}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        appt.status === 'CONFIRMED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        appt.status === 'IN_PROGRESS' ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' :
                        appt.status === 'COMPLETED' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                        'bg-red-50 text-red-700 border border-red-200'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        {appt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'IN_PROGRESS')}
                            className="bg-amber-500 hover:bg-amber-600 text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm"
                          >
                            <Play className="w-3 h-3" />
                            <span>Check-In</span>
                          </button>
                        )}
                        {appt.status === 'IN_PROGRESS' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm"
                          >
                            <CheckCheck className="w-3 h-3" />
                            <span>Complete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'NEW_PATIENT' && (
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 max-w-2xl mx-auto shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-4 mb-6">
            <UserPlus className="w-5 h-5 text-[#1F5084]" />
            <div>
              <h3 className="text-base font-bold text-[#1D2939]">Direct Patient Registration & MRN Generation</h3>
              <p className="text-xs text-slate-500">Registers patient in patient_db with cryptographic creation audit</p>
            </div>
          </div>

          {createdPatient && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold block">Patient Registered Successfully!</span>
                <span>MRN Assigned: <strong className="font-mono text-[#1F5084]">{createdPatient.mrn}</strong> ({createdPatient.firstName} {createdPatient.lastName})</span>
              </div>
              <button
                onClick={() => setCreatedPatient(null)}
                className="text-emerald-700 underline font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          <form onSubmit={handleRegisterPatient} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">First Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                />
              </div>
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fox"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">Date of Birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                />
              </div>
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">Gender</label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">Blood Group</label>
                <select
                  value={bloodGroup}
                  onChange={e => setBloodGroup(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                >
                  <option value="A+">A+</option>
                  <option value="O+">O+</option>
                  <option value="B+">B+</option>
                  <option value="AB+">AB+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                />
              </div>
              <div>
                <label className="block text-[#1D2939] font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="patient@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#1D2939] font-bold mb-1">Residential Address</label>
              <input
                type="text"
                placeholder="Street address"
                value={street}
                onChange={e => setStreet(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3 py-2 text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
              />
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="bg-[#1F5084] hover:bg-[#164273] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-[#1F5084]/20 active:scale-95 transition-all"
              >
                Register & Issue MRN
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
