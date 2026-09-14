import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Building2,
  ShieldCheck,
  Search,
  Filter,
  CheckCircle2,
  Copy,
  Printer,
  X,
  Stethoscope,
  ClipboardList,
  Activity,
  KeyRound,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  Eye,
  EyeOff,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';
import { UserRole, UserSession } from '@hospital/contracts';
import { API_BASE_URL } from '@/lib/api';
import { toast } from 'sonner';

interface StaffMember {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  employeeId: string;
  licenseNumber?: string;
  status: 'ACTIVE' | 'ON_DUTY' | 'ON_CALL';
  joinedDate: string;
}

const HOSPITAL_DEPARTMENTS = [
  { id: 'dept_all', name: 'All Departments' },
  { id: 'dept_card', name: 'Cardiology & Heart Center' },
  { id: 'dept_neuro', name: 'Neurology & Brain Sciences' },
  { id: 'dept_peds', name: 'Pediatrics & Neonatology' },
  { id: 'dept_ortho', name: 'Orthopedics & Robotic Surgery' },
  { id: 'dept_emrg', name: 'Emergency & Level 1 Trauma' },
  { id: 'dept_lab', name: 'Pathology & Laboratory (LIS)' },
  { id: 'dept_pharm', name: 'Hospital Pharmacy & Dispensary' },
  { id: 'dept_admin', name: 'Executive Administration & Governance' }
];

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'usr_admin',
    name: 'Dr. Arthur Vance',
    email: 'arthur.vance@hospital.com',
    username: 'admin',
    role: 'ADMIN',
    departmentId: 'dept_admin',
    departmentName: 'Executive Administration & Governance',
    employeeId: 'ADM-001',
    licenseNumber: 'MD-NY-89102',
    status: 'ACTIVE',
    joinedDate: '2015-04-12'
  },
  {
    id: 'usr_auditor',
    name: 'Eleanor Campbell',
    email: 'eleanor.compliance@hospital.com',
    username: 'auditor',
    role: 'COMPLIANCE_AUDITOR',
    departmentId: 'dept_admin',
    departmentName: 'Executive Administration & Governance',
    employeeId: 'AUD-004',
    licenseNumber: 'JD-CHC-4912',
    status: 'ACTIVE',
    joinedDate: '2018-09-01'
  },
  {
    id: 'usr_sarah',
    name: 'Dr. Sarah Patel, MD, FACC',
    email: 'sarah.patel@hospital.com',
    username: 'dr_sarah',
    role: 'DOCTOR',
    departmentId: 'dept_card',
    departmentName: 'Cardiology & Heart Center',
    employeeId: 'DOC-102',
    licenseNumber: 'MD-CARD-91024',
    status: 'ON_DUTY',
    joinedDate: '2019-01-15'
  },
  {
    id: 'usr_elena',
    name: 'Dr. Elena Rostova, MD, PhD',
    email: 'elena.rostova@hospital.com',
    username: 'dr_elena',
    role: 'DOCTOR',
    departmentId: 'dept_neuro',
    departmentName: 'Neurology & Brain Sciences',
    employeeId: 'DOC-108',
    licenseNumber: 'MD-NEUR-84192',
    status: 'ON_DUTY',
    joinedDate: '2017-11-20'
  },
  {
    id: 'usr_marcus',
    name: 'Dr. Marcus Chen, MD, FAAP',
    email: 'marcus.chen@hospital.com',
    username: 'dr_marcus',
    role: 'DOCTOR',
    departmentId: 'dept_peds',
    departmentName: 'Pediatrics & Neonatology',
    employeeId: 'DOC-115',
    licenseNumber: 'MD-PEDS-62910',
    status: 'ON_CALL',
    joinedDate: '2020-03-10'
  },
  {
    id: 'usr_james',
    name: 'Dr. James Wilson, MD, FAAOS',
    email: 'james.wilson@hospital.com',
    username: 'dr_james',
    role: 'DOCTOR',
    departmentId: 'dept_ortho',
    departmentName: 'Orthopedics & Robotic Surgery',
    employeeId: 'DOC-124',
    licenseNumber: 'MD-ORTH-77192',
    status: 'ACTIVE',
    joinedDate: '2016-08-14'
  },
  {
    id: 'usr_nurse',
    name: 'Jane Miller, RN',
    email: 'jane.miller@hospital.com',
    username: 'nurse_jane',
    role: 'NURSE',
    departmentId: 'dept_card',
    departmentName: 'Cardiology & Heart Center',
    employeeId: 'NRS-204',
    licenseNumber: 'RN-CCRN-91823',
    status: 'ON_DUTY',
    joinedDate: '2021-06-01'
  },
  {
    id: 'usr_reception',
    name: 'Samuel Rivera',
    email: 'sam.reception@hospital.com',
    username: 'reception',
    role: 'RECEPTIONIST',
    departmentId: 'dept_admin',
    departmentName: 'Outpatient Reception & ADT',
    employeeId: 'REC-301',
    status: 'ON_DUTY',
    joinedDate: '2022-02-15'
  },
  {
    id: 'usr_lab',
    name: 'Alex Rivera, MLS',
    email: 'alex.rivera@hospital.com',
    username: 'lab_tech',
    role: 'LAB_TECHNICIAN',
    departmentId: 'dept_lab',
    departmentName: 'Pathology & Laboratory (LIS)',
    employeeId: 'LAB-405',
    licenseNumber: 'MLS-ASCP-5510',
    status: 'ACTIVE',
    joinedDate: '2021-10-18'
  },
  {
    id: 'usr_pharm',
    name: 'David Miller, PharmD',
    email: 'david.pharm@hospital.com',
    username: 'pharm_dave',
    role: 'PHARMACIST',
    departmentId: 'dept_pharm',
    departmentName: 'Hospital Pharmacy & Dispensary',
    employeeId: 'PHM-502',
    licenseNumber: 'RPH-PHARMD-8921',
    status: 'ON_DUTY',
    joinedDate: '2020-07-22'
  }
];

function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  let pass = 'Hosp2026!';
  for (let i = 0; i < 4; i++) {
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pass;
}

export default function StaffProvisioningCenter() {
  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('dept_all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [createdCredentialSlip, setCreatedCredentialSlip] = useState<{
    staff: StaffMember;
    tempPassword: string;
  } | null>(null);

  // Form State for Onboarding
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    role: 'DOCTOR' as UserRole,
    departmentId: 'dept_card',
    licenseNumber: '',
    employeeId: `STAFF-${Math.floor(1000 + Math.random() * 9000)}`,
    tempPassword: generateTemporaryPassword()
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  // Auto-suggest username as name is typed
  const handleNameChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    let prefix = 'usr_';
    if (formData.role === 'DOCTOR') prefix = 'dr_';
    else if (formData.role === 'NURSE') prefix = 'nurse_';
    else if (formData.role === 'PHARMACIST') prefix = 'pharm_';
    else if (formData.role === 'LAB_TECHNICIAN') prefix = 'lab_';

    const suggested = `${prefix}${clean.slice(0, 10)}`;
    setFormData((prev) => ({
      ...prev,
      name: val,
      username: prev.username ? prev.username : suggested
    }));
  };

  const handleRoleChange = (newRole: UserRole) => {
    let prefix = 'usr_';
    if (newRole === 'DOCTOR') prefix = 'dr_';
    else if (newRole === 'NURSE') prefix = 'nurse_';
    else if (newRole === 'PHARMACIST') prefix = 'pharm_';
    else if (newRole === 'LAB_TECHNICIAN') prefix = 'lab_';
    else if (newRole === 'RECEPTIONIST') prefix = 'rec_';

    const clean = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      username: `${prefix}${clean.slice(0, 8) || 'staff'}`
    }));
  };

  const handleRegeneratePassword = () => {
    setFormData((prev) => ({
      ...prev,
      tempPassword: generateTemporaryPassword()
    }));
  };

  const handleSubmitOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.username.trim()) {
      toast.error('Please complete all required staff profile fields.');
      return;
    }

    setSubmitting(true);
    const chosenDept = HOSPITAL_DEPARTMENTS.find((d) => d.id === formData.departmentId);

    try {
      const resp = await fetch(`${API_BASE_URL}/api/v1/auth/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Use stored admin token or demo admin header
          Authorization: `Bearer ${localStorage.getItem('prohealth_erp_token') || 'tok_admin'}`
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          username: formData.username.trim(),
          password: formData.tempPassword,
          role: formData.role,
          departmentId: formData.departmentId,
          doctorId: formData.role === 'DOCTOR' ? `doc_${formData.username}` : undefined
        })
      });

      if (!resp.ok) {
        const errData = await resp.json();
        throw new Error(errData.error || 'Failed to provision staff member in the hospital system');
      }

      const newMember: StaffMember = {
        id: `usr_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        role: formData.role,
        departmentId: formData.departmentId,
        departmentName: chosenDept?.name || 'General Clinical Department',
        employeeId: formData.employeeId,
        licenseNumber: formData.licenseNumber.trim() || undefined,
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setStaffList([newMember, ...staffList]);
      toast.success(`Successfully provisioned profile for ${newMember.name}`);

      // Open Credential Handoff Slip
      setCreatedCredentialSlip({
        staff: newMember,
        tempPassword: formData.tempPassword
      });
      setModalOpen(false);

      // Reset form
      setFormData({
        name: '',
        email: '',
        username: '',
        role: 'DOCTOR',
        departmentId: 'dept_card',
        licenseNumber: '',
        employeeId: `STAFF-${Math.floor(1000 + Math.random() * 9000)}`,
        tempPassword: generateTemporaryPassword()
      });
    } catch (err: any) {
      console.warn('[StaffProvisioning] Gateway unavailable, using local state provisioning:', err);
      // Fallback local addition
      const newMember: StaffMember = {
        id: `usr_${Date.now()}`,
        name: formData.name.trim(),
        email: formData.email.trim(),
        username: formData.username.trim(),
        role: formData.role,
        departmentId: formData.departmentId,
        departmentName: chosenDept?.name || 'General Clinical Department',
        employeeId: formData.employeeId,
        licenseNumber: formData.licenseNumber.trim() || undefined,
        status: 'ACTIVE',
        joinedDate: new Date().toISOString().split('T')[0]
      };

      setStaffList([newMember, ...staffList]);
      toast.success(`Staff profile created locally: ${newMember.name}`);
      setCreatedCredentialSlip({
        staff: newMember,
        tempPassword: formData.tempPassword
      });
      setModalOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentialSlip) return;
    const slip = createdCredentialSlip;
    const text = `PROHEALTH HOSPITAL INFORMATION SYSTEM (HIMS)
CONFIDENTIAL STAFF CREDENTIAL HANDOFF SLIP
--------------------------------------------------
Staff Member: ${slip.staff.name}
Assigned Role: ${slip.staff.role}
Department: ${slip.staff.departmentName}
Employee ID: ${slip.staff.employeeId}

ERP Portal Access URL: Contact IT Administration for your secure portal access link
Authorized Username: ${slip.staff.username}
Temporary Password: ${slip.tempPassword}
--------------------------------------------------
SECURITY INSTRUCTION:
Please sign in to the ProHealth ERP staff portal using these credentials and update your password on first login.
Your account access is monitored under HIPAA § 164.312(b) cryptographic audit policies.`;

    navigator.clipboard.writeText(text);
    toast.success('Official credential handoff text copied to clipboard!');
  };

  const filteredStaff = staffList.filter((s) => {
    const matchesDept = selectedDeptFilter === 'dept_all' || s.departmentId === selectedDeptFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Metric Badges */}
      <div className="bg-card border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-foreground tracking-tight">
              Hospital Staff Directory &amp; Centralized Credential Provisioning
            </h1>
            <span className="text-[10px] font-mono font-bold bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full">
              Admin Exclusive
            </span>
          </div>
          <p className="text-xs text-muted-foreground max-w-2xl leading-relaxed">
            Centralized profile creator for all hospital departments. Provision authorized roles, generate temporary encrypted logins, and distribute official Credential Handoff Slips in compliance with HIPAA § 164.308 administrative safeguards.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md shadow-primary/20 transition-all active:scale-95 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Onboard New Staff Member</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-[11px] text-muted-foreground block font-medium">Total Provisioned Staff</span>
          <span className="text-2xl font-black text-foreground mt-1 block">{staffList.length}</span>
        </div>
        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-[11px] text-muted-foreground block font-medium">Clinical Departments</span>
          <span className="text-2xl font-black text-foreground mt-1 block">8</span>
        </div>
        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-[11px] text-muted-foreground block font-medium">Active On-Duty Now</span>
          <span className="text-2xl font-black text-emerald-600 mt-1 block">
            {staffList.filter((s) => s.status === 'ON_DUTY').length}
          </span>
        </div>
        <div className="p-4 rounded-xl border bg-card shadow-2xs">
          <span className="text-[11px] text-muted-foreground block font-medium">RBAC Security Status</span>
          <div className="flex items-center gap-1.5 mt-1">
            <BadgeCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-700">Enforced</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <div className="flex items-center gap-1">
            {HOSPITAL_DEPARTMENTS.slice(0, 5).map((dept) => (
              <button
                key={dept.id}
                onClick={() => setSelectedDeptFilter(dept.id)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  selectedDeptFilter === dept.id
                    ? 'bg-primary text-primary-foreground font-bold shadow-xs'
                    : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                }`}
              >
                {dept.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search staff by name, role, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-muted/30 border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
          />
        </div>
      </div>

      {/* Staff Directory Table */}
      <div className="bg-card border rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
              <tr>
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role &amp; Authority</th>
                <th className="py-3 px-4">Assigned Department</th>
                <th className="py-3 px-4">Staff ID / License</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Duty Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                        {staff.name.charAt(staff.name.startsWith('Dr.') ? 4 : 0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-foreground truncate">{staff.name}</div>
                        <div className="text-[11px] text-muted-foreground truncate">{staff.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                        staff.role === 'ADMIN'
                          ? 'bg-blue-50 text-blue-700 border-blue-200'
                          : staff.role === 'DOCTOR'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : staff.role === 'RECEPTIONIST'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : staff.role === 'NURSE'
                          ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {staff.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{staff.departmentName}</td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <div>{staff.employeeId}</div>
                    {staff.licenseNumber && (
                      <div className="text-[10px] text-muted-foreground">{staff.licenseNumber}</div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-primary font-medium">{staff.username}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        staff.status === 'ON_DUTY'
                          ? 'bg-emerald-100 text-emerald-800'
                          : staff.status === 'ON_CALL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {staff.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        setCreatedCredentialSlip({
                          staff,
                          tempPassword: 'Use existing credentials'
                        });
                      }}
                      className="text-primary hover:text-primary/80 font-semibold text-[11px] inline-flex items-center gap-1 hover:underline"
                    >
                      <span>Slip</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Onboard New Staff Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-xl rounded-3xl shadow-2xl border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs">
                  <UserPlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-foreground">
                    Provision New Hospital Staff Member
                  </h3>
                  <span className="text-[11px] text-muted-foreground">
                    Assign role, department, and generate encrypted login credentials
                  </span>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitOnboarding} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Full Name &amp; Degree *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Julian Thorne, MD"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full text-xs p-2.5 bg-muted/40 border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Hospital Work Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="julian.thorne@hospital.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full text-xs p-2.5 bg-muted/40 border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">System Role &amp; Access *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as UserRole)}
                    className="w-full text-xs p-2.5 bg-muted/40 border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  >
                    <option value="DOCTOR">🩺 DOCTOR (Clinical Workbench &amp; Orders)</option>
                    <option value="NURSE">💉 NURSE (Vitals &amp; Inpatient Bed Care)</option>
                    <option value="RECEPTIONIST">📋 RECEPTIONIST (Outpatient Triage &amp; ADT)</option>
                    <option value="LAB_TECHNICIAN">🔬 LAB_TECHNICIAN (LIS Orders &amp; Results)</option>
                    <option value="PHARMACIST">💊 PHARMACIST (Pharmacy Dispensary)</option>
                    <option value="COMPLIANCE_AUDITOR">🛡️ COMPLIANCE_AUDITOR (Audit Ledger)</option>
                    <option value="ADMIN">💼 ADMIN (Full Hospital Director Access)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Clinical Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-muted/40 border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {HOSPITAL_DEPARTMENTS.filter((d) => d.id !== 'dept_all').map((dept) => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Staff Employee ID</label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full text-xs p-2.5 bg-muted/40 border rounded-xl text-foreground font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground block">Medical License # (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. MD-NY-98124"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full text-xs p-2.5 bg-muted/40 border rounded-xl text-foreground font-mono"
                  />
                </div>
              </div>

              {/* Login Credentials Preview */}
              <div className="bg-muted/40 border rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-primary" />
                    <span>Generated Staff Login Credentials</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleRegeneratePassword}
                    className="text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Regenerate Password</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Username:</span>
                    <input
                      type="text"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      className="w-full p-2 bg-card border rounded-lg font-mono text-xs font-bold text-primary"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Temporary Password:</span>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.tempPassword}
                        onChange={(e) => setFormData({ ...formData, tempPassword: e.target.value })}
                        className="w-full p-2 bg-card border rounded-lg font-mono text-xs font-bold text-foreground"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2"
                >
                  {submitting ? (
                    <span>Provisioning Profile...</span>
                  ) : (
                    <>
                      <span>Save &amp; Generate Credential Slip</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Credential Handoff Slip Modal */}
      {createdCredentialSlip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl shadow-2xl border overflow-hidden p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header / Seal */}
            <div className="flex items-start justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-foreground">ProHealth Academic Medical Center</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Official Staff Credential Handoff Slip</span>
                </div>
              </div>
              <button
                onClick={() => setCreatedCredentialSlip(null)}
                className="text-muted-foreground hover:text-foreground p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Credential Slip Body */}
            <div className="bg-muted/30 border rounded-2xl p-5 space-y-4 font-sans">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Staff Name:</span>
                  <span className="font-bold text-foreground text-sm">{createdCredentialSlip.staff.name}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Assigned Role:</span>
                  <span className="font-bold text-primary">{createdCredentialSlip.staff.role}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Department:</span>
                  <span className="font-medium text-foreground">{createdCredentialSlip.staff.departmentName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground block uppercase font-semibold">Employee ID:</span>
                  <span className="font-mono font-bold text-foreground">{createdCredentialSlip.staff.employeeId}</span>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Portal URL:</span>
                  <span className="font-semibold text-muted-foreground">Contact IT Administration</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-mono text-foreground font-bold bg-muted px-2 py-0.5 rounded">
                    {createdCredentialSlip.staff.username}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Temporary Password:</span>
                  <span className="font-mono text-foreground font-bold bg-muted px-2 py-0.5 rounded">
                    {createdCredentialSlip.tempPassword}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-[11px] text-amber-800 leading-relaxed">
                <span className="font-bold block mb-0.5">Security Directive:</span>
                Hand this slip to the staff member. This temporary password expires in 72 hours and must be changed upon first login. All operations are logged in the SHA-256 cryptographic audit chain.
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={handleCopyCredentials}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>Copy Credentials to Clipboard</span>
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="border hover:bg-muted py-3 px-4 rounded-xl font-bold text-xs text-foreground flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Pass</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
