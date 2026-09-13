import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Stethoscope, 
  ClipboardList, 
  Server, 
  Activity, 
  Building2, 
  ExternalLink,
  ChevronRight,
  Database
} from 'lucide-react';
import RoleSwitcher, { PRESET_USERS } from './components/RoleSwitcher';
import AuditLogViewer from './components/AuditLogViewer';
import ClinicalWorkbench from './components/ClinicalWorkbench';
import ReceptionDesk from './components/ReceptionDesk';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import { UserRole, UserSession } from '@hospital/contracts';
import { Toaster } from 'sonner';

type Tab = 'AUDIT' | 'CLINICAL' | 'RECEPTION' | 'INFRASTRUCTURE' | 'ANALYTICS';

export default function App() {
  const [currentSession, setCurrentSession] = useState<UserSession>(PRESET_USERS.COMPLIANCE_AUDITOR);
  const [activeTab, setActiveTab] = useState<Tab>('AUDIT');
  const [gatewayStatus, setGatewayStatus] = useState<any>(null);

  // When role changes, adapt the default view to fit the persona
  const handleSelectRole = (role: UserRole) => {
    const session = PRESET_USERS[role];
    if (session) {
      setCurrentSession(session);
      if (role === 'COMPLIANCE_AUDITOR') setActiveTab('AUDIT');
      else if (role === 'DOCTOR') setActiveTab('CLINICAL');
      else if (role === 'RECEPTIONIST') setActiveTab('RECEPTION');
    }
  };

  // Poll Gateway health status
  useEffect(() => {
    const check = () => {
      fetch('http://localhost:4000/api/v1/gateway/status')
        .then(res => res.json())
        .then(data => setGatewayStatus(data))
        .catch(() => setGatewayStatus({ gateway: 'OFFLINE', services: [] }));
    };

    check();
    const interval = setInterval(check, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <Toaster position="bottom-right" richColors />
    <div className="min-h-screen bg-[#F8FAFC] text-[#1D2939] flex flex-col font-sans">
      {/* Top Header Navigation */}
      <header className="bg-white/95 backdrop-blur-md border-b border-[#E4E7EC] sticky top-0 z-30 px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1F5084] to-[#2B78C6] flex items-center justify-center text-white shadow-md shadow-[#1F5084]/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-tight text-[#1D2939]">
                ProHealth <span className="text-[#1F5084] font-bold">ERP Operations</span>
              </h1>
              <span className="text-[10px] bg-[#EAF2F9] text-[#1F5084] border border-[#CBD5E1] px-2 py-0.5 rounded-full font-mono font-bold">
                Microservices V1
              </span>
            </div>
            <p className="text-[11px] text-[#667085]">
              Domain-Isolated Databases • Asynchronous NATS JetStream • HIPAA Audit Mesh
            </p>
          </div>
        </div>

        {/* Right Action Tools: Role Switcher & Live Portal Link */}
        <div className="flex items-center gap-4">
          <RoleSwitcher
            currentSession={currentSession}
            onSelectRole={handleSelectRole}
          />

          <a
            href="http://localhost:3001"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1.5 text-xs text-slate-700 hover:text-[#1F5084] bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors font-medium shadow-sm"
          >
            <span>Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#2B78C6]" />
          </a>
        </div>
      </header>

      {/* Main Navigation Sub-Bar */}
      <div className="bg-[#F0F6FB] border-b border-[#E4E7EC] px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('AUDIT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AUDIT'
                ? 'bg-[#1F5084] text-white shadow-md shadow-[#1F5084]/20'
                : 'text-[#475467] hover:text-[#1D2939] hover:bg-white/80'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Database Audit Log & Integrity</span>
          </button>

          <button
            onClick={() => setActiveTab('CLINICAL')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CLINICAL'
                ? 'bg-[#1F5084] text-white shadow-md shadow-[#1F5084]/20'
                : 'text-[#475467] hover:text-[#1D2939] hover:bg-white/80'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span>Clinical Encounter Workbench</span>
          </button>

          <button
            onClick={() => setActiveTab('RECEPTION')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'RECEPTION'
                ? 'bg-[#1F5084] text-white shadow-md shadow-[#1F5084]/20'
                : 'text-[#475467] hover:text-[#1D2939] hover:bg-white/80'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>Reception & Registration</span>
          </button>

          <button
            onClick={() => setActiveTab('INFRASTRUCTURE')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'INFRASTRUCTURE'
                ? 'bg-[#1F5084] text-white shadow-md shadow-[#1F5084]/20'
                : 'text-[#475467] hover:text-[#1D2939] hover:bg-white/80'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Microservices Mesh Topology</span>
          </button>

          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'ANALYTICS'
                ? 'bg-[#1F5084] text-white shadow-md shadow-[#1F5084]/20'
                : 'text-[#475467] hover:text-[#1D2939] hover:bg-white/80'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Analytics &amp; Reports</span>
          </button>
        </div>

        {/* Mesh Live Health Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-500 text-[11px] font-medium">API Gateway:</span>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
            gatewayStatus?.gateway === 'ONLINE' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {gatewayStatus?.gateway || 'CHECKING...'}
          </span>
        </div>
      </div>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'AUDIT' && <AuditLogViewer />}
        {activeTab === 'CLINICAL' && <ClinicalWorkbench session={currentSession} />}
        {activeTab === 'RECEPTION' && <ReceptionDesk />}
        {activeTab === 'ANALYTICS' && <AnalyticsDashboard />}
        {activeTab === 'INFRASTRUCTURE' && (
          <div className="space-y-6">
            <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-bold text-[#1D2939] mb-2 flex items-center gap-2">
                <Server className="w-5 h-5 text-[#1F5084]" />
                Domain Microservices Architecture & Database Isolation Status
              </h2>
              <p className="text-xs text-[#475467] mb-6 leading-relaxed">
                As per enterprise specification, each domain service operates completely independently with its own persistent database. Services communicate via high-performance REST/gRPC through the central API Gateway and stream asynchronous events via NATS JetStream.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gatewayStatus?.services?.map((s: any) => (
                  <div key={s.service} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E4E7EC] flex justify-between items-center hover:border-slate-300 transition-colors shadow-sm">
                    <div>
                      <div className="text-xs font-bold text-[#1D2939]">{s.service}</div>
                      <div className="text-[10px] font-mono text-slate-500">{s.url}</div>
                      <div className="text-[10px] text-[#1F5084] font-medium mt-1">
                        Isolated DB: {s.service.replace('-service', '_db.sqlite')}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="bg-white border-t border-[#E4E7EC] text-slate-500 text-[11px] px-8 py-4 flex justify-between items-center">
        <span>ProHealth Hospital Information Management System (HIMS)</span>
        <span>Cryptographic Hash-Chain v1.0 • All Database Operations Logged</span>
      </footer>
    </div>
    </>
  );
}
