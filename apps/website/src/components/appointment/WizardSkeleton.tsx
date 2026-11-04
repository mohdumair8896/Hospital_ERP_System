import React from 'react';

const BAR = 'rounded bg-muted motion-safe:animate-pulse';

/** Suspense fallback shaped like the booking wizard card (progress, heading, choice grid). */
export default function WizardSkeleton() {
  return (
    <div className="rounded-panel border border-border bg-card p-5 shadow-lift sm:p-8 lg:p-10">
      <p className="sr-only" role="status">
        Loading the booking form
      </p>
      <div className="space-y-6" aria-hidden="true">
        <div className="space-y-3">
          <div className={`h-4 w-40 ${BAR}`} />
          <div className="h-1.5 rounded-pill bg-muted" />
          <div className="hidden grid-cols-5 gap-2 sm:grid">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-6 ${BAR}`} />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className={`h-7 w-2/3 ${BAR}`} />
          <div className={`h-4 w-1/2 ${BAR}`} />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3 rounded-card border border-border p-4">
              <div className={`h-10 w-10 shrink-0 rounded-xl ${BAR}`} />
              <div className="flex-1 space-y-2 pt-1">
                <div className={`h-3.5 w-2/3 ${BAR}`} />
                <div className={`h-3 w-full ${BAR}`} />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end border-t border-border pt-5">
          <div className={`h-11 w-32 rounded-xl ${BAR}`} />
        </div>
      </div>
    </div>
  );
}
