import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopEmergencyBar from '../../../components/TopEmergencyBar';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EmergencyFAB from '../../../components/EmergencyFAB';
import DoctorBookingCard, { bookingHref } from '../../../components/appointment/DoctorBookingCard';
import { Reveal } from '@/components/motion';
import { DOCTORS } from '../../../data/hospitalData';
import { ChevronRight, Star, Award, GraduationCap, FileBadge, CheckCircle2, CalendarCheck } from 'lucide-react';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return DOCTORS.map((doc) => ({
    id: doc.id,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const doc = DOCTORS.find((d) => d.id === params.id);
  if (!doc) return { title: 'Physician Not Found' };
  return {
    title: `${doc.title} | ProHealth Hospital Specialist`,
    description: `${doc.name} is a ${doc.specialty} specialist at ProHealth Academic Medical Center. Experience: ${doc.experienceYears} years.`,
  };
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';

const QUALITY = [
  { value: '99.1%', label: 'Patient recommendation', tone: 'text-primary' },
  { value: '0.2%', label: '30-day readmission rate', tone: 'text-foreground' },
  { value: '100%', label: 'Board certification active', tone: 'text-care' },
];

export default function DoctorProfilePage({ params }: Props) {
  const doc = DOCTORS.find((d) => d.id === params.id);
  if (!doc) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="border-b border-border bg-gradient-to-b from-prohealth-tint via-prohealth-ice/60 to-background py-10 sm:py-14">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className={`rounded-sm hover:text-primary transition-colors ${FOCUS_RING}`}>Home</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li>
                <Link href="/doctors" className={`rounded-sm hover:text-primary transition-colors ${FOCUS_RING}`}>Doctors</Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li aria-current="page" className="font-semibold text-foreground">{doc.name}</li>
            </ol>
          </nav>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={doc.avatarUrl}
              alt={`Portrait of ${doc.name}`}
              width={176}
              height={176}
              className="w-36 h-36 md:w-44 md:h-44 rounded-panel object-cover shadow-lift border-4 border-white"
            />
            <div className="space-y-3 text-center md:text-left">
              <p className="inline-flex flex-wrap items-center justify-center gap-2 rounded-pill border border-border bg-card px-3 py-1 text-sm font-semibold text-primary">
                <Link href={`/departments/${doc.departmentId}`} className={`rounded-sm hover:underline ${FOCUS_RING}`}>
                  {doc.departmentName}
                </Link>
                <span aria-hidden="true">·</span>
                <span className="font-medium text-muted-foreground">NPI {doc.npiNumber}</span>
              </p>
              <h1 className="font-display text-display-md text-foreground">{doc.title}</h1>
              <p className="text-lead text-prohealth-secondary font-medium">{doc.specialty}</p>

              <ul className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2 pt-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-500" aria-hidden="true" />
                  <strong className="text-foreground">{doc.rating} / 5</strong>
                  <span>({doc.reviewCount} verified reviews)</span>
                </li>
                <li>
                  <strong className="text-foreground">{doc.experienceYears} years</strong> in practice
                </li>
                <li>
                  Fee <strong className="text-foreground">${doc.consultationFee}</strong>
                </li>
              </ul>

              {/* Small screens: the booking card sits below the bio, so offer the CTA up front too. */}
              <div className="pt-2 lg:hidden">
                <Link
                  href={bookingHref(doc.id)}
                  className={`inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-prohealth-primary-hover transition-colors ${FOCUS_RING}`}
                >
                  <CalendarCheck className="w-4 h-4" aria-hidden="true" />
                  Book with {doc.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bio with sticky booking card */}
      <section className="py-12 lg:py-16 flex-1">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_24rem] gap-10 xl:gap-16">
            <div className="min-w-0 space-y-12">
              <Reveal as="section" aria-labelledby="bio-heading" className="space-y-4">
                <h2 id="bio-heading" className="font-display text-2xl font-bold text-foreground">
                  Biography and clinical focus
                </h2>
                <p className="text-base leading-relaxed text-prohealth-body max-w-prose">{doc.bio}</p>
              </Reveal>

              <Reveal as="section" aria-labelledby="education-heading" className="space-y-4">
                <h2 id="education-heading" className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <GraduationCap className="w-5 h-5 text-primary" aria-hidden="true" />
                  Education and fellowships
                </h2>
                <ul className="space-y-2.5">
                  {doc.education.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-xl border border-border bg-muted/50 p-3.5">
                      <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-care" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal as="section" aria-labelledby="certs-heading" className="space-y-4">
                <h2 id="certs-heading" className="flex items-center gap-2 text-lg font-bold text-foreground">
                  <FileBadge className="w-5 h-5 text-primary" aria-hidden="true" />
                  Board certifications and licensure
                </h2>
                <ul className="space-y-2.5">
                  {doc.certifications.map((cert) => (
                    <li key={cert} className="flex items-start gap-3 rounded-xl border border-dept-blue-bg bg-dept-blue-bg/60 p-3.5">
                      <Award className="mt-0.5 w-4 h-4 shrink-0 text-dept-blue-fg" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{cert}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal as="section" aria-labelledby="quality-heading" className="space-y-4">
                <h2 id="quality-heading" className="text-lg font-bold text-foreground">Clinical quality indicators</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {QUALITY.map((q) => (
                    <div key={q.label} className="flex flex-col-reverse rounded-card border border-border bg-muted/50 p-4 text-center">
                      <dt className="mt-1 text-sm text-muted-foreground">{q.label}</dt>
                      <dd className={`font-display text-2xl font-bold ${q.tone}`}>{q.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>

            <aside aria-label={`Book with ${doc.name}`}>
              <div className="lg:sticky lg:top-24">
                <DoctorBookingCard doc={doc} />
              </div>
            </aside>
          </div>
        </div>
      </section>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
