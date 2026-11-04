'use client';

import React, { useLayoutEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import AppointmentBookingWizard from './appointment/AppointmentBookingWizard';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
  /** Prefills "Reason for visit" (e.g. the symptom triage summary). */
  initialSymptoms?: string;
}

/**
 * Booking wizard in a Radix Dialog: role="dialog" with aria-modal, a title and
 * description, Escape and outside click close it, and Tab stays inside. The
 * wizard moves focus to its step heading on open; on close, focus returns to
 * the button that opened it (callers open it with their own buttons, not a
 * Dialog.Trigger, so the opener is remembered here).
 */
export default function AppointmentBookingModal({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedDepartmentId,
  initialSymptoms,
}: AppointmentBookingModalProps) {
  const openerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Layout effects run before the wizard's focus effect, so activeElement is still the opener.
  useLayoutEffect(() => {
    if (isOpen) openerRef.current = document.activeElement as HTMLElement | null;
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs animate-in fade-in-0 duration-200" />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
          <Dialog.Content
            ref={contentRef}
            aria-modal="true"
            onOpenAutoFocus={(e) => {
              // Land on the step heading rather than the close button.
              e.preventDefault();
              // While a preselected step loads there is no heading yet: hold focus on
              // the dialog itself; the heading takes it once it mounts.
              const heading = contentRef.current?.querySelector<HTMLElement>('[data-step-heading]');
              (heading ?? contentRef.current)?.focus();
            }}
            onCloseAutoFocus={(e) => {
              e.preventDefault();
              openerRef.current?.focus();
            }}
            className="pointer-events-auto relative max-h-[calc(100dvh-1.5rem)] w-full max-w-2xl overflow-y-auto overscroll-contain rounded-panel border border-border bg-card p-5 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200 focus:outline-none sm:max-h-[calc(100dvh-3rem)] sm:p-8"
          >
            <Dialog.Title className="sr-only">Book an appointment</Dialog.Title>
            <Dialog.Description className="sr-only">
              Five short steps: department, doctor, date and time, your details, then review and confirm.
            </Dialog.Description>
            <Dialog.Close
              aria-label="Close booking"
              className="absolute right-3 top-3 z-10 rounded-full p-2 text-muted-foreground transition-colors duration-250 hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:right-4 sm:top-4"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Dialog.Close>
            <div className="pt-8 sm:pr-8 sm:pt-0">
              <AppointmentBookingWizard
                variant="modal"
                onClose={onClose}
                preselectedDoctorId={preselectedDoctorId}
                preselectedDepartmentId={preselectedDepartmentId}
                initialSymptoms={initialSymptoms}
              />
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
