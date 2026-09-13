import React from 'react';
import { UserRole, UserSession } from '@hospital/contracts';
import { ShieldCheck, Stethoscope, UserCog, ClipboardList, ChevronDown } from 'lucide-react';

interface RoleSwitcherProps {
  currentSession: UserSession;
  onSelectRole: (role: UserRole) => void;
}

const PRESET_USERS: Record<UserRole, UserSession> = {
  COMPLIANCE_AUDITOR: {
    id: 'usr_auditor',
    username: 'auditor',
    email: 'eleanor.compliance@hospital.com',
    name: 'Eleanor Campbell',
    role: 'COMPLIANCE_AUDITOR'
  },
  DOCTOR: {
    id: 'usr_sarah',
    username: 'dr_sarah',
    email: 'sarah.patel@hospital.com',
    name: 'Dr. Sarah Patel, MD',
    role: 'DOCTOR',
    departmentId: 'dept_card',
    doctorId: 'doc_sarah'
  },
  ADMIN: {
    id: 'usr_admin',
    username: 'admin',
    email: 'arthur.vance@hospital.com',
    name: 'Dr. Arthur Vance (Director)',
    role: 'ADMIN'
  },
  RECEPTIONIST: {
    id: 'usr_reception',
    username: 'reception',
    email: 'sam.reception@hospital.com',
    name: 'Samuel Rivera (OPD Desk)',
    role: 'RECEPTIONIST'
  },
  CHIEF_MEDICAL_OFFICER: {
    id: 'usr_cmo',
    username: 'cmo',
    email: 'cmo@hospital.com',
    name: 'Dr. Marcus Vance (CMO)',
    role: 'CHIEF_MEDICAL_OFFICER'
  },
  NURSE: {
    id: 'usr_nurse',
    username: 'nurse_jane',
    email: 'jane.rn@hospital.com',
    name: 'Jane Miller, RN',
    role: 'NURSE'
  },
  PHARMACIST: {
    id: 'usr_pharm',
    username: 'pharm_dave',
    email: 'dave.pharm@hospital.com',
    name: 'David Miller, PharmD',
    role: 'PHARMACIST'
  },
  LAB_TECHNICIAN: {
    id: 'usr_lab',
    username: 'lab_tech',
    email: 'lab.tech@hospital.com',
    name: 'Alex Rivera, MLS',
    role: 'LAB_TECHNICIAN'
  },
  PATIENT: {
    id: 'usr_paulo',
    username: 'paulo',
    email: 'paulo.hubert@example.com',
    name: 'Paulo Hubert',
    role: 'PATIENT',
    patientId: 'pat_1'
  }
};

export default function RoleSwitcher({ currentSession, onSelectRole }: RoleSwitcherProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-slate-600 font-medium hidden sm:inline">Active Persona:</span>
      <select
        value={currentSession.role}
        onChange={e => onSelectRole(e.target.value as UserRole)}
        className="bg-white border border-slate-300 text-[#1F5084] text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#1F5084]/20 focus:border-[#1F5084] cursor-pointer shadow-sm"
      >
        <option value="COMPLIANCE_AUDITOR">🛡️ Eleanor Campbell (Compliance Auditor)</option>
        <option value="DOCTOR">🩺 Dr. Sarah Patel, MD (Cardiologist)</option>
        <option value="ADMIN">💼 Dr. Arthur Vance (Hospital Director)</option>
        <option value="RECEPTIONIST">📋 Samuel Rivera (OPD Reception Desk)</option>
      </select>
    </div>
  );
}

export { PRESET_USERS };
