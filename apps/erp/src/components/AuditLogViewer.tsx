import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  RefreshCw, 
  Search, 
  Filter, 
  FileText, 
  Lock, 
  Eye, 
  Key, 
  CheckCircle2, 
  X,
  Database,
  ExternalLink
} from 'lucide-react';
import { AuditRecord, AuditIntegrityVerificationResult } from '@hospital/contracts';

export default function AuditLogViewer() {
  const [records, setRecords] = useState<AuditRecord[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AuditRecord | null>(null);
  
  // Filters
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [resourceFilter, setResourceFilter] = useState<string>('ALL');
  const [searchActor, setSearchActor] = useState<string>('');

  // Integrity Check State
  const [verifying, setVerifying] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<AuditIntegrityVerificationResult | null>(null);

  // Disclosure Modal State
  const [disclosurePatientId, setDisclosurePatientId] = useState<string>('');
  const [disclosureData, setDisclosureData] = useState<any | null>(null);
  const [disclosureLoading, setDisclosureLoading] = useState(false);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (actionFilter !== 'ALL') params.append('action', actionFilter);
      if (resourceFilter !== 'ALL') params.append('resourceType', resourceFilter);
      if (searchActor.trim()) params.append('actorId', searchActor.trim());
      params.append('limit', '50');

      const res = await fetch(`http://localhost:4000/api/v1/audit/records?${params.toString()}`);
      const data = await res.json();
      setRecords(data.records || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [actionFilter, resourceFilter]);

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/audit/verify-integrity');
      const data = await res.json();
      setIntegrityResult(data);
    } catch (err) {
      console.error('Failed to verify audit integrity:', err);
    } finally {
      setVerifying(false);
    }
  };

  const handleGenerateDisclosures = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disclosurePatientId.trim()) return;

    setDisclosureLoading(true);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/audit/patient/${disclosurePatientId.trim()}/disclosures`);
      const data = await res.json();
      setDisclosureData(data);
    } catch (err) {
      console.error('Failed to fetch disclosures:', err);
    } finally {
      setDisclosureLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Verification Engine */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="text-lg font-bold text-[#1D2939] flex items-center gap-2">
                <Database className="w-5 h-5 text-[#1F5084]" />
                Immutable Database Audit Trail & Cryptographic Verifier
              </h2>
            </div>
            <p className="text-xs text-[#475467] max-w-3xl leading-relaxed">
              Every single user interaction, database query, PHI read, clinical diagnosis, and appointment creation is captured in a dedicated PostgreSQL/SQLite audit database with SHA-256 cryptographic hash chaining (HIPAA § 164.312(b) & NABH standard).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleVerifyIntegrity}
              disabled={verifying}
              className="flex items-center gap-2 bg-[#1F5084] hover:bg-[#164273] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-[#1F5084]/20 active:scale-95 transition-all disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{verifying ? 'Verifying Hashes...' : 'Verify Cryptographic Chain'}</span>
            </button>

            <button
              onClick={fetchRecords}
              disabled={loading}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Verification Result Banner */}
        {integrityResult && (
          <div className={`mt-4 p-4 rounded-xl border flex items-start gap-3 text-xs animate-in fade-in ${
            integrityResult.verified 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}>
            {integrityResult.verified ? (
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-1 flex-1">
              <div className="font-bold flex items-center gap-2">
                <span>{integrityResult.verified ? 'Cryptographic Integrity Confirmed' : 'Integrity Violation Detected!'}</span>
                <span className="text-[10px] opacity-75 font-mono">({integrityResult.totalRecordsChecked} records verified)</span>
              </div>
              <p className="text-[11px] opacity-90">
                {integrityResult.verified 
                  ? 'All sequential SHA-256 mathematical hashes match the genesis root. No historical rows have been deleted or altered.'
                  : `Detected ${integrityResult.tamperedRecordIds.length} tampered records! Record IDs: ${integrityResult.tamperedRecordIds.join(', ')}`}
              </p>
              <div className="text-[10px] font-mono opacity-70 truncate">
                Tip Hash: {integrityResult.latestHash}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Toolbar & Disclosure Quick Launcher */}
      <div className="bg-white border border-[#E4E7EC] rounded-xl p-4 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 shadow-sm">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
            >
              <option value="ALL">All Actions</option>
              <option value="READ">READ (PHI Views)</option>
              <option value="CREATE">CREATE (Bookings & Records)</option>
              <option value="UPDATE">UPDATE (State Changes)</option>
              <option value="LOGIN">LOGIN (Auth Security)</option>
              <option value="BREAK_GLASS_OVERRIDE">BREAK-GLASS (Emergency Overrides)</option>
            </select>
          </div>

          <div>
            <select
              value={resourceFilter}
              onChange={e => setResourceFilter(e.target.value)}
              className="bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-1 focus:ring-[#1F5084]"
            >
              <option value="ALL">All Resources</option>
              <option value="PATIENT">PATIENT</option>
              <option value="APPOINTMENT">APPOINTMENT</option>
              <option value="CLINICAL_ENCOUNTER">CLINICAL_ENCOUNTER</option>
              <option value="USER_ACCOUNT">USER_ACCOUNT</option>
            </select>
          </div>
        </div>

        {/* Patient Accounting of Disclosures Form */}
        <form onSubmit={handleGenerateDisclosures} className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter Patient ID (e.g. pat_1)"
            value={disclosurePatientId}
            onChange={e => setDisclosurePatientId(e.target.value)}
            className="bg-[#F8FAFC] border border-slate-200 text-slate-800 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#1F5084] w-48 font-mono"
          />
          <button
            type="submit"
            disabled={disclosureLoading}
            className="bg-[#2B78C6] hover:bg-[#1F5084] text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            {disclosureLoading ? '...' : 'HIPAA Disclosures'}
          </button>
        </form>
      </div>

      {/* Disclosures Result Modal */}
      {disclosureData && (
        <div className="p-4 rounded-xl bg-white border border-[#2B78C6]/40 text-xs space-y-3 shadow-md">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <span className="font-bold text-[#1F5084]">
              HIPAA § 164.528 Accounting of Disclosures for Patient: {disclosureData.patientId}
            </span>
            <button onClick={() => setDisclosureData(null)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-[#475467]">
            Total of {disclosureData.disclosuresCount} authorized access events recorded in persistent audit storage:
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto font-mono text-[11px]">
            {disclosureData.records.map((r: AuditRecord) => (
              <div key={r.id} className="p-2 bg-[#F8FAFC] rounded border border-slate-200 flex justify-between text-slate-700">
                <span>{r.timestamp.split('T')[0]} {r.timestamp.split('T')[1].substring(0, 8)} - {r.actorName} ({r.actorRole})</span>
                <span className="text-[#1F5084] font-bold">{r.action} • {r.clinicalReason || 'Routine Care'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white border border-[#E4E7EC] rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F0F6FB] text-slate-600 border-b border-[#E4E7EC] uppercase font-bold tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Seq</th>
                <th className="py-3.5 px-4">Timestamp (UTC)</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Resource</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Status / Latency</th>
                <th className="py-3.5 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E7EC] text-[#475467]">
              {records.map((rec) => {
                const isRead = rec.action === 'READ';
                const isCreate = rec.action === 'CREATE';
                const isLogin = rec.action === 'LOGIN';
                const isBreakGlass = rec.action === 'BREAK_GLASS_OVERRIDE';

                let badgeColor = 'bg-slate-100 text-slate-700 border border-slate-200';
                if (isRead) badgeColor = 'bg-blue-50 text-blue-700 border border-blue-200';
                if (isCreate) badgeColor = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
                if (isLogin) badgeColor = 'bg-purple-50 text-purple-700 border border-purple-200';
                if (isBreakGlass) badgeColor = 'bg-red-50 text-red-700 border border-red-200 animate-pulse';

                return (
                  <tr
                    key={rec.id}
                    onClick={() => setSelectedRecord(rec)}
                    className="hover:bg-[#F8FAFC] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      #{rec.sequenceNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-600">
                      {rec.timestamp.replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#1D2939] text-xs">{rec.actorName}</div>
                      <div className="text-[10px] text-slate-500">{rec.actorRole} • {rec.clientIp}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${badgeColor}`}>
                        {rec.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#1F5084] text-xs">{rec.resourceType}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{rec.resourceId}</div>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-[#1D2939]">
                      {rec.description}
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-emerald-700 font-bold">{rec.statusCode}</span>
                      <span className="text-[10px] text-slate-500 ml-1.5">({rec.executionTimeMs}ms)</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        <span>SHA-256</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {records.length === 0 && !loading && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No audit records matching criteria.
          </div>
        )}
      </div>

      {/* Audit Detail Modal / Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E4E7EC] rounded-2xl w-full max-w-2xl p-6 space-y-4 shadow-2xl text-xs text-[#1D2939]">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="font-mono text-[#1F5084] font-bold">Audit Record #{selectedRecord.sequenceNumber}</span>
                <h3 className="text-base font-bold text-[#1D2939] mt-0.5">{selectedRecord.description}</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[11px]">
              <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Actor Details</span>
                <div className="font-bold text-[#1D2939]">{selectedRecord.actorName} ({selectedRecord.actorRole})</div>
                <div className="font-mono text-slate-500">ID: {selectedRecord.actorId}</div>
                <div className="text-slate-500">IP: {selectedRecord.clientIp}</div>
              </div>

              <div className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block mb-0.5">Network & HTTP Request</span>
                <div className="font-bold text-[#1F5084] font-mono">{selectedRecord.httpMethod} {selectedRecord.endpoint}</div>
                <div className="text-slate-600">Status: {selectedRecord.statusCode} • {selectedRecord.executionTimeMs}ms</div>
                <div className="font-mono text-slate-500 truncate">Trace ID: {selectedRecord.traceId}</div>
              </div>
            </div>

            {selectedRecord.clinicalReason && (
              <div className="p-3 bg-[#EAF2F9] border border-[#2B78C6]/30 rounded-xl text-[#1F5084]">
                <span className="font-bold block mb-0.5">Clinical Justification / Context:</span>
                <span>{selectedRecord.clinicalReason}</span>
              </div>
            )}

            {/* Cryptographic Hash Chaining Details */}
            <div className="space-y-2 p-3 bg-slate-900 rounded-xl border border-slate-800 font-mono text-[10px]">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                <span>Cryptographic Proof (SHA-256 Hash Chain):</span>
              </div>
              <div>
                <span className="text-slate-400 block">Current Record Hash:</span>
                <span className="text-emerald-300 break-all">{selectedRecord.recordHash}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Chained Previous Record Hash:</span>
                <span className="text-slate-300 break-all">{selectedRecord.prevRecordHash}</span>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => setSelectedRecord(null)}
                className="bg-[#1F5084] hover:bg-[#164273] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
