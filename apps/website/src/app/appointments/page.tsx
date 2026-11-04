'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import AppointmentBookingWizard from '../../components/appointment/AppointmentBookingWizard';
import BookingHelpCard from '../../components/appointment/BookingHelpCard';
import WizardSkeleton from '../../components/appointment/WizardSkeleton';
import { TRIAGE_REASON_KEY } from '../../components/appointment/wizardModel';
import { ChevronRight, ShieldCheck } from 'lucide-react';

/** Triage summary handed over in sessionStorage (symptoms never travel in the URL). */
function readTriageReason(): string | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return sessionStorage.getItem(TRIAGE_REASON_KEY) || undefined;
  } catch {
    return undefined;
  }
}

/**
 * Reads the preselection query params (`doc` or `doctor`, `dept` or `department`,
 * `slot`) and renders the wizard. "Reason for visit" is prefilled from the
 * symptom triage tool's sessionStorage hand-off, which is cleared once read.
 */
function BookingWizardFromParams() {
  const searchParams = useSearchParams();
  const preselectedDocId = searchParams.get('doc') || searchParams.get('doctor') || undefined;
  const preselectedDeptId = searchParams.get('dept') || searchParams.get('department') || undefined;
  const preselectedSlot = searchParams.get('slot') || undefined;
  const [reason] = useState(readTriageReason);

  useEffect(() => {
    try {
      sessionStorage.removeItem(TRIAGE_REASON_KEY);
    } catch {
      // Storage unavailable: nothing to clear.
    }
  }, []);

  return (
    <AppointmentBookingWizard
      variant="page"
      preselectedDoctorId={preselectedDocId}
      preselectedDepartmentId={preselectedDeptId}
      preselectedSlot={preselectedSlot}
      initialSymptoms={reason}
    />
  );
}

export default function AppointmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      {/* Header banner */}
      <section className="border-b border-border bg-gradient-to-b from-prohealth-tint via-prohealth-ice/60 to-background py-10 sm:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="rounded-sm hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <ChevronRight className="w-3.5 h-3.5" />
              </li>
              <li aria-current="page" className="font-semibold text-foreground">
                Book an appointment
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-4">
            <p className="inline-flex items-center gap-2 rounded-pill border border-border bg-card px-3 py-1.5 text-sm font-semibold text-primary shadow-soft">
              <ShieldCheck className="w-4 h-4" aria-hidden="true" />
              Five short steps, about two minutes
            </p>
            <h1 className="font-display text-display-md text-foreground">Book a medical appointment</h1>
            <p className="text-base sm:text-lead text-muted-foreground">
              Choose a department and doctor, pick an in-person or video visit at a time that suits you, and get your
              booking ID straight away.
            </p>
          </div>
        </div>
      </section>

      {/* Form as the page, with help tiles beside it (pattern C38) */}
      <main className="max-w-[1400px] mx-auto w-full flex-1 px-4 sm:px-6 lg:px-12 py-10 lg:py-14">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] xl:gap-12">
          <div className="min-w-0">
            <Suspense fallback={<WizardSkeleton />}>
              <BookingWizardFromParams />
            </Suspense>
          </div>
          <aside aria-label="Help with booking" className="lg:sticky lg:top-24">
            <BookingHelpCard />
          </aside>
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
