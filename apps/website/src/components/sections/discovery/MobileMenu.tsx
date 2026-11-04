'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Calendar, Clock, Mail, Menu, Phone, Search, Stethoscope, X } from 'lucide-react';
import { EASE_OUT_SOFT } from '@/components/motion';

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

export type NavLink = { label: string; href: string };

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links: NavLink[];
  pathname: string | null;
  onOpenSearch: () => void;
  /** When set, "Book appointment" opens the booking modal instead of navigating. */
  onOpenBooking?: () => void;
};

/**
 * Full-screen menu for small screens (pattern C30) on Radix Dialog: focus is
 * trapped, Escape closes it and focus returns to the menu button. Big primary
 * links stagger in; secondary actions and the emergency number sit below.
 */
export default function MobileMenu({ open, onOpenChange, links, pathname, onOpenSearch, onOpenBooking }: MobileMenuProps) {
  // "Search" and "Book" close this dialog first and open the next dialog only
  // once this one has fully closed, so the two never fight over focus.
  const pending = useRef<(() => void) | null>(null);
  const closeThen = (action: () => void) => {
    pending.current = action;
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger
        aria-label="Open menu"
        className={`rounded-full p-1.5 text-prohealth-heading transition-colors hover:bg-muted min-[360px]:p-2 xl:hidden ${RING}`}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Content
          aria-modal="true"
          onCloseAutoFocus={(e) => {
            const action = pending.current;
            if (!action) return;
            pending.current = null;
            e.preventDefault();
            // Focus the menu button first so the next dialog returns focus there.
            (document.querySelector('[aria-label="Open menu"]') as HTMLElement | null)?.focus();
            action();
          }}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white focus:outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0"
        >
          <Dialog.Title className="sr-only">Site menu</Dialog.Title>
          <Dialog.Description className="sr-only">Pages, booking and emergency contacts</Dialog.Description>

          <div className="flex h-16 items-center justify-between border-b border-border px-4 sm:px-6">
            <Link href="/" onClick={() => onOpenChange(false)} className={`flex items-center gap-2 rounded-lg ${RING}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Stethoscope className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="font-display text-lg font-extrabold text-prohealth-heading">
                Pro<span className="text-prohealth-secondary">Health</span>
              </span>
            </Link>
            <Dialog.Close aria-label="Close menu" className={`rounded-full p-2 text-prohealth-heading hover:bg-muted ${RING}`}>
              <X className="h-6 w-6" aria-hidden="true" />
            </Dialog.Close>
          </div>

          <nav aria-label="Main" className="flex-1 px-4 py-6 sm:px-6">
            <ul className="space-y-1">
              {links.map((link, i) => {
                const active = pathname === link.href;
                return (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE_OUT_SOFT, delay: 0.04 + i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => onOpenChange(false)}
                      className={`block rounded-xl px-3 py-2.5 font-display text-2xl font-bold transition-colors ${
                        active ? 'bg-secondary text-primary' : 'text-prohealth-heading hover:bg-muted hover:text-primary'
                      } ${RING}`}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>

            <div className="mt-8 grid grid-cols-1 gap-3 border-t border-border pt-6 sm:grid-cols-3">
              <Link
                href="/appointments"
                onClick={(e) => {
                  if (onOpenBooking) {
                    e.preventDefault();
                    closeThen(onOpenBooking);
                  } else {
                    onOpenChange(false);
                  }
                }}
                className={`flex items-center justify-center gap-2 rounded-pill bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground ${RING}`}
              >
                <Calendar className="h-4 w-4" aria-hidden="true" />
                Book appointment
              </Link>
              <button
                type="button"
                onClick={() => closeThen(onOpenSearch)}
                className={`flex items-center justify-center gap-2 rounded-pill border border-border px-5 py-3 text-sm font-semibold text-prohealth-heading hover:bg-muted ${RING}`}
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                Search the site
              </button>
              <Link
                href="/timetable"
                onClick={() => onOpenChange(false)}
                className={`flex items-center justify-center gap-2 rounded-pill border border-border px-5 py-3 text-sm font-semibold text-prohealth-heading hover:bg-muted ${RING}`}
              >
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                OPD timetable
              </Link>
            </div>
          </nav>

          {/* Contact row: the emergency number is always here */}
          <div className="space-y-3 border-t border-border bg-alert-soft px-4 py-5 sm:px-6">
            <a
              href="tel:876256876"
              className={`flex items-center justify-center gap-2 rounded-pill bg-alert px-5 py-3 text-base font-bold text-white hover:bg-alert-strong ${RING}`}
            >
              <Phone className="h-5 w-5" aria-hidden="true" />
              Ambulance: 876-256-876
            </a>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-prohealth-body">
              <a href="tel:1234567890" className={`inline-flex items-center gap-1.5 rounded hover:text-primary ${RING}`}>
                <Phone className="h-4 w-4" aria-hidden="true" />
                Hotline 123-456-7890
              </a>
              <a href="mailto:care@prohealth.hospital" className={`inline-flex items-center gap-1.5 rounded hover:text-primary ${RING}`}>
                <Mail className="h-4 w-4" aria-hidden="true" />
                care@prohealth.hospital
              </a>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
