import React from 'react';
import Link from 'next/link';
import TopEmergencyBar from '../components/TopEmergencyBar';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EmergencyFAB from '../components/EmergencyFAB';
import { Ambulance, ArrowRight, Calendar, Home, Search, Stethoscope, type LucideIcon } from 'lucide-react';

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const SHORTCUTS: { href: string; label: string; hint: string; icon: LucideIcon; tile: string }[] = [
  { href: '/', label: 'Hospital Home', hint: 'Back to the start', icon: Home, tile: 'bg-dept-blue-bg text-dept-blue-fg' },
  { href: '/appointments', label: 'Appointments', hint: 'Book a visit online', icon: Calendar, tile: 'bg-dept-green-bg text-dept-green-fg' },
  { href: '/departments', label: 'Departments', hint: 'Browse our specialties', icon: Search, tile: 'bg-dept-amber-bg text-dept-amber-fg' },
  { href: '/doctors', label: 'Find Doctors', hint: 'Meet our specialists', icon: Stethoscope, tile: 'bg-dept-rose-bg text-dept-rose-fg' },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-br from-prohealth-ice via-prohealth-tint to-white py-section">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-ring/10 blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-6 text-center sm:px-8">
            <span
              aria-hidden="true"
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-card bg-card text-primary shadow-soft"
            >
              <Stethoscope className="h-8 w-8" />
            </span>

            <p className="text-eyebrow uppercase text-primary">Error 404 · Page not found</p>
            <h1 className="mt-3 font-display text-display-md text-prohealth-heading">We Couldn’t Find That Clinical Page</h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-prohealth-body sm:text-lead">
              The page or resource you requested has been relocated, renamed, or is temporarily unavailable. Let us guide you
              back to proper care.
            </p>

            <nav aria-label="Helpful pages" className="mt-10">
              <ul className="grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {SHORTCUTS.map(({ href, label, hint, icon: Icon, tile }) => (
                  <li key={href} className="flex">
                    <Link
                      href={href}
                      className={`group flex flex-1 items-center gap-3 rounded-card border border-border bg-card p-4 shadow-soft transition-[border-color,box-shadow,transform] duration-250 ease-out-soft hover:border-primary/40 hover:shadow-lift motion-safe:hover:-translate-y-0.5 ${FOCUS_RING}`}
                    >
                      <span aria-hidden="true" className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tile}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold text-prohealth-heading group-hover:text-primary">{label}</span>
                        <span className="block text-sm text-prohealth-muted">{hint}</span>
                      </span>
                      <ArrowRight
                        className="h-4 w-4 shrink-0 text-prohealth-muted transition-[color,transform] duration-250 ease-out-soft group-hover:text-primary motion-safe:group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Urgent emergency callout */}
            <div className="mt-8 flex items-start gap-3 rounded-card border border-alert/15 bg-alert-soft p-4 text-left text-alert sm:items-center">
              <Ambulance className="mt-0.5 h-6 w-6 shrink-0 sm:mt-0" aria-hidden="true" />
              <p className="text-sm">
                <span className="block font-bold">Immediate medical emergency?</span>
                Call our 24/7 ambulance hotline at{' '}
                <a href="tel:876256876" className={`whitespace-nowrap rounded font-bold underline underline-offset-2 ${FOCUS_RING}`}>
                  876-256-876
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
