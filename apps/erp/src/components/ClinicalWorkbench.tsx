import React, { useState, useEffect } from 'react';
import { 
  Stethoscope, 
  Activity, 
  Pill, 
  FileText, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';
import { Patient, ClinicalEncounter, UserSession, PrescriptionItem } from '@hospital/contracts';

interface ClinicalWorkbenchProps {
  session: UserSession;
}

export default function ClinicalWorkbench({ session }: ClinicalWorkbenchProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat_1');
  const [encounters, setEncounters] = useState<ClinicalEncounter[]>([]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form Vitals
  const [bpSys, setBpSys] = useState(120);
  const [bpDia, setBpDia] = useState(80);
  const [heartRate, setHeartRate] = useState(72);
  const [oxygen, setOxygen] = useState(98);
  const [temp, setTemp] = useState(36.8);
  const [respRate, setRespRate] = useState(16);

  // Clinical Details
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosisCode, setDiagnosisCode] = useState('I10');
  const [diagnosisName, setDiagnosisName] = useState('Essential (primary) hypertension');
  const [clinicalNotes, setClinicalNotes] = useState('');

  // Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([
    { medicineName: 'Amlodipine Besylate 5mg', dosage: '5mg Oral Tablet', frequency: 'OD (Once daily)', duration: '30 days', instructions: 'Take in morning' }
  ]);

  // Load patients
  useEffect(() => {
    fetch('http://localhost:4000/api/v1/patients')
      .then(res => res.json())
      .then(data => {
        setPatients(data.patients || []);
        if (data.patients?.length > 0 && !selectedPatientId) {
          setSelectedPatientId(data.patients[0].id);
        }
      })
      .catch(() => {});
  }, []);

  // Load encounters for selected patient
  useEffect(() => {
    if (!selectedPatientId) return;
    fetch(`http://localhost:4000/api/v1/clinical/encounters?patientId=${selectedPatientId}`)
      .then(res => res.json())
      .then(data => setEncounters(data.encounters || []))
      .catch(() => {});
  }, [selectedPatientId]);

  const activePatient = patients.find(p => p.id === selectedPatientId);

  const handleAddRx = () => {
    setPrescriptions([
      ...prescriptions,
      { medicineName: '', dosage: '', frequency: 'TDS (3x daily)', duration: '7 days', instructions: 'Take with food' }
    ]);
  };

  const handleRemoveRx = (idx: number) => {
    setPrescriptions(prescriptions.filter((_, i) => i !== idx));
  };

  const handleSubmitEncounter = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);

    const payload = {
      patientId: selectedPatientId,
      doctorId: session.doctorId || 'doc_sarah',
      doctorName: session.name,
      type: 'OPD',
      chiefComplaint: chiefComplaint || 'Routine cardiac follow-up and blood pressure monitoring',
      vitals: {
        bloodPressureSystolic: bpSys,
        bloodPressureDiastolic: bpDia,
        heartRateBpm: heartRate,
        oxygenSaturationSpO2: oxygen,
        bodyTemperatureCelsius: temp,
        respiratoryRate: respRate,
        recordedAt: new Date().toISOString()
      },
      primaryDiagnosisCode: diagnosisCode,
      primaryDiagnosisName: diagnosisName,
      secondaryDiagnoses: [],
      clinicalNotes: clinicalNotes || 'Patient examined. Heart sounds regular. Medication refilled.',
      prescriptions: prescriptions.filter(p => p.medicineName.trim() !== '')
    };

    try {
      const res = await fetch('http://localhost:4000/api/v1/clinical/encounters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': session.id,
          'X-User-Name': session.name,
          'X-User-Role': session.role,
          'X-Clinical-Reason': 'Clinical Encounter Documentation'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to record clinical encounter');
      const saved = await res.json();
      setEncounters([saved, ...encounters]);
      setSuccessMsg(`Clinical Encounter ${saved.encounterNumber} successfully saved to clinical_db and audited!`);
      setChiefComplaint('');
      setClinicalNotes('');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Patient Selector Sidebar */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-[#1D2939] uppercase tracking-wider mb-3">
            Assigned Patients Queue
          </h3>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {patients.map(p => (
              <div
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`p-3 rounded-xl cursor-pointer transition-all border ${
                  selectedPatientId === p.id
                    ? 'bg-[#EAF2F9] border-[#1F5084] text-[#1F5084]'
                    : 'bg-[#F8FAFC] border-slate-200 hover:bg-[#F0F6FB] text-slate-700'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="font-bold text-xs text-[#1D2939]">{p.firstName} {p.lastName}</span>
                  <span className="font-mono text-[10px] text-[#1F5084] font-bold">{p.mrn}</span>
                </div>
                <div className="text-[11px] text-[#667085] mt-1">
                  DOB: {p.dateOfBirth} • Blood: {p.bloodGroup}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Patient Medical Summary */}
        {activePatient && (
          <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 text-xs space-y-3 shadow-sm">
            <h3 className="font-bold text-[#1D2939] flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Activity className="w-4 h-4 text-rose-500" />
              Patient Profile: {activePatient.firstName} {activePatient.lastName}
            </h3>
            <div>
              <span className="text-slate-500 block text-[10px]">Medical Record Number:</span>
              <span className="font-mono font-bold text-[#1F5084] text-xs">{activePatient.mrn}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Known Drug Allergies:</span>
              <span className="font-bold text-rose-600">
                {activePatient.allergies.length > 0 ? activePatient.allergies.join(', ') : 'None documented'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Emergency Contact:</span>
              <span className="text-slate-700">
                {activePatient.emergencyContact.name} ({activePatient.emergencyContact.relationship}) - {activePatient.emergencyContact.phone}
              </span>
            </div>
          </div>
        )}

        {/* Past Encounters History */}
        <div className="bg-white border border-[#E4E7EC] rounded-2xl p-4 shadow-sm">
          <h3 className="text-xs font-bold text-[#1D2939] uppercase tracking-wider mb-3">
            Encounter History ({encounters.length})
          </h3>
          <div className="space-y-2 max-h-56 overflow-y-auto text-xs">
            {encounters.map(enc => (
              <div key={enc.id} className="p-3 bg-[#F8FAFC] rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-[#1F5084] font-bold">{enc.encounterNumber}</span>
                  <span className="text-slate-500">{enc.createdAt.split('T')[0]}</span>
                </div>
                <div className="text-[#1D2939] font-semibold text-xs">{enc.primaryDiagnosisName}</div>
                <div className="text-[10px] text-[#667085]">
                  BP: {enc.vitals.bloodPressureSystolic}/{enc.vitals.bloodPressureDiastolic} • HR: {enc.vitals.heartRateBpm} bpm
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Clinical Documentation Form */}
      <div className="lg:col-span-8">
        <form onSubmit={handleSubmitEncounter} className="bg-white border border-[#E4E7EC] rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-[#1F5084]" />
              <h2 className="text-base font-bold text-[#1D2939]">
                New Clinical Encounter Documentation
              </h2>
            </div>
            <span className="text-xs bg-[#EAF2F9] text-[#1F5084] border border-[#CBD5E1] px-3 py-1 rounded-full font-mono font-bold">
              Dr: {session.name}
            </span>
          </div>

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Vitals Signs Strip */}
          <div>
            <label className="block text-xs font-bold text-[#1D2939] uppercase tracking-wider mb-2">
              Vital Signs Measurement
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
              <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">BP (mmHg)</span>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <input
                    type="number"
                    value={bpSys}
                    onChange={e => setBpSys(parseInt(e.target.value) || 0)}
                    className="w-10 bg-transparent text-center text-xs font-bold text-[#1D2939] focus:outline-none"
                  />
                  <span className="text-slate-400">/</span>
                  <input
                    type="number"
                    value={bpDia}
                    onChange={e => setBpDia(parseInt(e.target.value) || 0)}
                    className="w-10 bg-transparent text-center text-xs font-bold text-[#1D2939] focus:outline-none"
                  />
                </div>
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Pulse (bpm)</span>
                <input
                  type="number"
                  value={heartRate}
                  onChange={e => setHeartRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-[#1D2939] mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">SpO2 (%)</span>
                <input
                  type="number"
                  value={oxygen}
                  onChange={e => setOxygen(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-emerald-600 mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Temp (°C)</span>
                <input
                  type="number"
                  step="0.1"
                  value={temp}
                  onChange={e => setTemp(parseFloat(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-[#1D2939] mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Resp Rate</span>
                <input
                  type="number"
                  value={respRate}
                  onChange={e => setRespRate(parseInt(e.target.value) || 0)}
                  className="w-full bg-transparent text-center text-xs font-bold text-[#1D2939] mt-1 focus:outline-none"
                />
              </div>

              <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] text-slate-500 block">Triage Status</span>
                <span className="text-xs font-bold text-emerald-600 block mt-1">Normal</span>
              </div>
            </div>
          </div>

          {/* Chief Complaint & ICD-10 Diagnosis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1D2939] uppercase tracking-wider mb-1">
                Chief Complaint
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Recurrent palpitations during walking"
                value={chiefComplaint}
                onChange={e => setChiefComplaint(e.target.value)}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1D2939] uppercase tracking-wider mb-1">
                ICD-10 Primary Diagnosis
              </label>
              <select
                value={diagnosisCode}
                onChange={e => {
                  setDiagnosisCode(e.target.value);
                  const codeMap: Record<string, string> = {
                    'I10': 'Essential (primary) hypertension',
                    'I20.9': 'Angina pectoris, unspecified',
                    'E11.9': 'Type 2 diabetes mellitus without complications',
                    'J45.909': 'Unspecified asthma, uncomplicated',
                    'M54.5': 'Low back pain'
                  };
                  setDiagnosisName(codeMap[e.target.value] || 'General Clinical Condition');
                }}
                className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
              >
                <option value="I10">I10 - Essential (primary) hypertension</option>
                <option value="I20.9">I20.9 - Angina pectoris, unspecified</option>
                <option value="E11.9">E11.9 - Type 2 diabetes mellitus</option>
                <option value="J45.909">J45.909 - Unspecified asthma</option>
                <option value="M54.5">M54.5 - Low back pain</option>
              </select>
            </div>
          </div>

          {/* Clinical Examination Notes */}
          <div>
            <label className="block text-xs font-bold text-[#1D2939] uppercase tracking-wider mb-1">
              Physician Clinical Notes
            </label>
            <textarea
              rows={3}
              placeholder="Record physical findings, heart sounds, pulmonary auscultation, treatment strategy..."
              value={clinicalNotes}
              onChange={e => setClinicalNotes(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-slate-200 rounded-xl p-3 text-xs text-[#1D2939] focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
            />
          </div>

          {/* Prescriptions */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-[#1D2939] uppercase tracking-wider flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#1F5084]" />
                Prescriptions & Medication Orders
              </label>
              <button
                type="button"
                onClick={handleAddRx}
                className="text-[11px] font-bold text-[#1F5084] hover:text-[#164273] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medication
              </button>
            </div>

            <div className="space-y-2">
              {prescriptions.map((rx, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 bg-[#F8FAFC] p-2.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    placeholder="Medicine Name (e.g. Amlodipine 5mg)"
                    value={rx.medicineName}
                    onChange={e => {
                      const updated = [...prescriptions];
                      updated[idx].medicineName = e.target.value;
                      setPrescriptions(updated);
                    }}
                    className="col-span-5 bg-transparent border-b border-slate-300 text-xs text-[#1D2939] focus:outline-none px-1"
                  />
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 5mg)"
                    value={rx.dosage}
                    onChange={e => {
                      const updated = [...prescriptions];
                      updated[idx].dosage = e.target.value;
                      setPrescriptions(updated);
                    }}
                    className="col-span-3 bg-transparent border-b border-slate-300 text-xs text-[#1D2939] focus:outline-none px-1"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={rx.frequency}
                    onChange={e => {
                      const updated = [...prescriptions];
                      updated[idx].frequency = e.target.value;
                      setPrescriptions(updated);
                    }}
                    className="col-span-3 bg-transparent border-b border-slate-300 text-xs text-[#1D2939] focus:outline-none px-1"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRx(idx)}
                    className="col-span-1 text-slate-400 hover:text-red-500 flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-[#1F5084] hover:bg-[#164273] text-white font-bold px-6 py-2.5 rounded-xl text-xs shadow-md shadow-[#1F5084]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? 'Submitting to Clinical DB...' : 'Finalize Encounter & Emit Audit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
