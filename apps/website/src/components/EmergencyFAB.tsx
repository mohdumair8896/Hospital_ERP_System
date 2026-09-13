'use client';

import React, { useState } from 'react';
import { Ambulance, Phone, X } from 'lucide-react';

export default function EmergencyFAB() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {expanded && (
        <div className="mb-3 bg-white rounded-2xl p-4 shadow-2xl border border-red-100 text-slate-800 text-xs w-72 animate-in fade-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
            <span className="font-extrabold text-red-600 flex items-center gap-1.5">
              <Ambulance className="w-4 h-4" />
              Emergency Triage
            </span>
            <button onClick={() => setExpanded(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mb-3">
            If you are experiencing chest pain, acute shortness of breath, or trauma, contact dispatch immediately:
          </p>
          <a
            href="tel:876256876"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md transition-all active:scale-95"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Ambulance: 876-256-876</span>
          </a>
        </div>
      )}

      <button
        onClick={() => setExpanded(!expanded)}
        aria-label="Emergency Call"
        className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 border-2 border-white ring-4 ring-red-500/20"
      >
        <Ambulance className="w-7 h-7 animate-pulse" />
      </button>
    </div>
  );
}
