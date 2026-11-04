'use client';

import React, { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Play, Stethoscope, X } from 'lucide-react';

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

/**
 * "See how we work" trigger plus the clinic tour dialog, on Radix Dialog:
 * role="dialog" with a title and description, Escape and outside click close
 * it, Tab stays inside, and focus returns to the trigger on close.
 */
export default function HeroVideoDialog({ onOpenBooking }: { onOpenBooking: () => void }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        className={`group inline-flex items-center gap-3 rounded-pill py-2 pl-2 pr-4 text-sm font-semibold text-prohealth-heading transition-colors duration-250 hover:text-primary ${RING}`}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-primary shadow-soft transition-transform duration-250 ease-out-soft group-hover:scale-[1.04]">
          <Play className="ml-0.5 h-4 w-4 fill-current" aria-hidden="true" />
        </span>
        <span>See how we work</span>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-4">
          <Dialog.Content
            aria-modal="true"
            className="pointer-events-auto relative max-h-full w-full max-w-2xl overflow-y-auto rounded-panel border border-border bg-white p-6 shadow-lift focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 sm:p-8"
          >
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                  <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                </span>
                <Dialog.Title className="font-display text-lg font-bold text-prohealth-heading">
                  ProHealth clinical excellence tour
                </Dialog.Title>
              </div>
              <Dialog.Close
                aria-label="Close tour"
                className={`rounded-full p-2 text-prohealth-muted transition-colors hover:bg-muted hover:text-prohealth-heading ${RING}`}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Dialog.Close>
            </div>
  
            <div className="space-y-4 py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-primary motion-safe:animate-pulse">
                <Stethoscope className="h-10 w-10" aria-hidden="true" />
              </div>
              <div className="mx-auto max-w-md">
                <p className="font-display text-lg font-bold text-prohealth-heading">Inside ProHealth Medical Center</p>
                <Dialog.Description className="mt-2 text-sm leading-relaxed text-prohealth-body">
                  Take a virtual walk through our da Vinci robotic surgery suites, hybrid catheterization laboratories,
                  and JCI-accredited intensive care units.
                </Dialog.Description>
              </div>
              <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onOpenBooking();
                  }}
                  className={`rounded-pill bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-250 hover:bg-prohealth-primary-hover ${RING}`}
                >
                  Book a consultation
                </button>
                <Dialog.Close
                  className={`rounded-pill bg-muted px-6 py-3 text-sm font-semibold text-prohealth-heading transition-colors duration-250 hover:bg-secondary ${RING}`}
                >
                  Close tour
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
