'use client';

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Ambulance, Phone, X } from 'lucide-react';

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * Bottom-right emergency button, always visible. It is the bottom-most floating
 * control and sits above other floating UI (z-45, below z-50 modals); the
 * symptom-triage launcher stacks above it.
 *
 * It renders inline for the server HTML (visible on first paint), then moves
 * into a portal on <body> so page-transition transforms in app/template.tsx
 * never displace it.
 */
export default function EmergencyFAB() {
  const [expanded, setExpanded] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useIsomorphicLayoutEffect(() => {
    setPortalTarget(document.body);
  }, []);

  const close = () => {
    setExpanded(false);
    toggleRef.current?.focus();
  };

  const fab = (
    <div
      className="fixed bottom-6 right-6 z-[45] flex flex-col items-end"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && expanded) close();
      }}
    >
      {expanded && (
        <div
          id={panelId}
          role="region"
          aria-label="Emergency triage"
          className="mb-3 bg-white rounded-2xl p-4 shadow-2xl border border-red-100 text-slate-800 text-sm w-72 max-w-[calc(100vw-3rem)] animate-in fade-in slide-in-from-bottom-5"
        >
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 mb-2">
            <span className="font-extrabold text-red-700 flex items-center gap-1.5">
              <Ambulance className="w-4 h-4" aria-hidden="true" />
              Emergency Triage
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close emergency panel"
              className={`p-1 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 ${FOCUS_RING}`}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
          <p className="text-sm text-slate-600 mb-3 leading-relaxed">
            If you are experiencing chest pain, acute shortness of breath, or trauma, contact dispatch immediately:
          </p>
          <a
            href="tel:876256876"
            className={`w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 text-sm shadow-md transition-colors active:scale-95 ${FOCUS_RING}`}
          >
            <Phone className="w-4 h-4" aria-hidden="true" />
            <span>Call Ambulance: 876-256-876</span>
          </a>
        </div>
      )}

      <button
        ref={toggleRef}
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-label={expanded ? 'Close emergency call panel' : 'Emergency call: open ambulance contact'}
        aria-expanded={expanded}
        aria-controls={expanded ? panelId : undefined}
        className={`w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-600/30 flex items-center justify-center transition-[background-color,transform] motion-safe:hover:scale-[1.04] active:scale-95 border-2 border-white ring-4 ring-red-500/20 ${FOCUS_RING}`}
      >
        <Ambulance className="w-7 h-7 motion-safe:animate-pulse" aria-hidden="true" />
      </button>
    </div>
  );

  return portalTarget ? createPortal(fab, portalTarget) : fab;
}
