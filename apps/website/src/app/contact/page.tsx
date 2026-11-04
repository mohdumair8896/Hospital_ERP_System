import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { ContactInquiryForm } from '../../components/content/ContactInquiryForm';
import { Phone, Mail, MapPin, Ambulance, Clock, ShieldCheck, ChevronRight, Car, ArrowUpRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact, Visiting Hours & Directions',
  description: 'Phone, email and campus address for ProHealth Medical Center, with opening hours, parking and the 24/7 emergency line.',
};

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const MAPS_URL = 'https://www.google.com/maps/search/?api=1&query=123+Healthcare+Blvd+New+York+NY+10016';

/** The three contact channels (C38), all taken from the existing page. */
const CONTACT_TILES = [
  {
    Icon: Phone,
    title: 'Call the switchboard',
    value: '+1 (555) 019-2831',
    note: 'Main switchboard / OPD desk, Mon–Sat 07:00 AM – 08:00 PM',
    href: 'tel:+15550192831',
  },
  {
    Icon: Mail,
    title: 'Email patient relations',
    value: 'care@prohealth.hospital',
    note: 'Patient relations & general inquiries',
    href: 'mailto:care@prohealth.hospital',
  },
  {
    Icon: MapPin,
    title: 'Visit the campus',
    value: '123 Healthcare Blvd',
    note: 'Medical District, New York, NY 10016',
    href: MAPS_URL,
    external: true,
  },
];

const HOURS = [
  { label: 'Emergency Department', value: 'Open 24 Hours / 365 Days', highlight: true },
  { label: 'Outpatient Consultations', value: 'Mon–Fri: 8:00 AM – 6:00 PM' },
  { label: 'Diagnostic Imaging & Lab', value: 'Open 24/7 (Inpatients & ER)' },
  { label: 'Outpatient Pharmacy', value: 'Daily: 7:30 AM – 10:00 PM' },
];

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopEmergencyBar />
      <Navbar />

      {/* Hero */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-br from-prohealth-ice via-prohealth-tint to-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" />
        <div className="relative max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex items-center gap-2 text-sm text-prohealth-muted">
              <li><Link href="/" className={`rounded hover:text-prohealth-primary ${FOCUS_RING}`}>Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li aria-current="page" className="text-prohealth-primary font-semibold">Contact &amp; Campus</li>
            </ol>
          </nav>
          <div className="max-w-3xl space-y-3">
            <span className="inline-block text-xs font-bold uppercase tracking-widest text-prohealth-primary bg-prohealth-primary/10 px-3 py-1 rounded border border-prohealth-primary/20">
              Reach Out &amp; Directions
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-prohealth-heading">
              Contact ProHealth Medical Center
            </h1>
            <p className="text-base text-prohealth-body leading-relaxed">
              We are here to support your clinical journey 24 hours a day, 7 days a week. Connect with our administrative desks or patient advocates.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 bg-slate-50 flex-1">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20 space-y-8">
          {/* Emergency line: first paint, no animation */}
          <div className="p-5 sm:p-6 rounded-3xl bg-red-950 text-white border border-red-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="flex items-center gap-2.5 text-red-300 font-extrabold text-sm uppercase tracking-wider">
                <Ambulance className="w-5 h-5" aria-hidden="true" />
                <span>24/7 Level 1 Trauma &amp; Ambulance</span>
              </p>
              <p className="text-sm text-red-100 leading-relaxed max-w-2xl">
                Dedicated priority line for acute cardiopulmonary emergencies, polytrauma, and urgent pediatric transport.
              </p>
            </div>
            <a
              href="tel:876256876"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white text-red-800 px-5 py-3 text-2xl font-extrabold font-display hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-950"
            >
              <Phone className="w-5 h-5" aria-hidden="true" />
              876-256-876
            </a>
          </div>

          {/* Three contact tiles */}
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CONTACT_TILES.map(({ Icon, title, value, note, href, external }) => (
              <li key={title}>
                <a
                  href={href}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className={`group h-full flex items-start gap-4 p-5 rounded-card bg-white border border-prohealth-border shadow-soft transition-[transform,box-shadow,border-color] duration-400 ease-out-soft hover:border-prohealth-secondary/40 hover:shadow-lift motion-safe:hover:-translate-y-0.5 ${FOCUS_RING}`}
                >
                  <span className="w-11 h-11 rounded-xl bg-prohealth-ice text-prohealth-primary flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1 text-sm font-semibold text-prohealth-muted">
                      {title}
                      {external && <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />}
                      {external && <span className="sr-only">(opens Google Maps in a new tab)</span>}
                    </span>
                    <span className="block text-base font-bold text-prohealth-heading break-words group-hover:text-prohealth-primary transition-colors">
                      {value}
                    </span>
                    <span className="block text-sm text-prohealth-body mt-0.5">{note}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
            {/* Form */}
            <div className="p-6 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-xl space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-display">Send an Administrative Inquiry</h2>
                <p className="text-sm text-slate-600 mt-1">
                  For non-urgent inquiries, billing questions, or appointment reschedule requests.
                </p>
              </div>
              <ContactInquiryForm />
            </div>

            {/* Visit info + hours */}
            <div className="space-y-6">
              <article className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=900"
                  alt="ProHealth Academic Hospital campus"
                  loading="lazy"
                  className="w-full h-44 object-cover"
                />
                <div className="p-6 space-y-4">
                  <h2 className="text-lg font-bold text-slate-900 font-display">Plan your visit</h2>
                  <ul className="space-y-3 text-sm text-slate-700">
                    <li className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-prohealth-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>123 Healthcare Blvd, Medical District, New York, NY 10016</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Car className="w-4 h-4 text-prohealth-primary mt-0.5 shrink-0" aria-hidden="true" />
                      <span>Parking available in Pavilion Garage C</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <ShieldCheck className="w-4 h-4 text-care mt-0.5 shrink-0" aria-hidden="true" />
                      <span>
                        Medical records &amp; release of information:{' '}
                        <a href="mailto:records@prohealth.hospital" className={`font-semibold text-prohealth-primary underline underline-offset-2 rounded ${FOCUS_RING}`}>
                          records@prohealth.hospital
                        </a>
                      </span>
                    </li>
                  </ul>
                </div>
              </article>

              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
                <h2 className="text-lg font-bold text-slate-900 font-display flex items-center gap-2">
                  <Clock className="w-5 h-5 text-prohealth-primary" aria-hidden="true" />
                  <span>Opening hours</span>
                </h2>
                <dl className="divide-y divide-slate-100 text-sm">
                  {HOURS.map((h) => (
                    <div key={h.label} className="flex flex-wrap justify-between gap-x-4 gap-y-0.5 py-2.5">
                      <dt className="text-slate-600">{h.label}</dt>
                      <dd className={h.highlight ? 'font-bold text-care' : 'font-medium text-slate-900'}>{h.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
