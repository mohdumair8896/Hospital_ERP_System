import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TopEmergencyBar from '../../../components/TopEmergencyBar';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import EmergencyFAB from '../../../components/EmergencyFAB';
import DepartmentServiceStack from '../../../components/appointment/DepartmentServiceStack';
import WhatToExpect from '../../../components/appointment/WhatToExpect';
import { Reveal } from '@/components/motion';
import { DEPARTMENTS, DOCTORS } from '../../../data/hospitalData';
import { ChevronRight, CheckCircle2, Calendar, ShieldCheck, Building2, Cpu, PhoneCall } from 'lucide-react';

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return DEPARTMENTS.map((dept) => ({
    id: dept.id,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const dept = DEPARTMENTS.find((d) => d.id === params.id);
  if (!dept) return { title: 'Department Not Found' };
  return {
    title: `${dept.name} | ProHealth Hospital`,
    description: dept.shortDesc,
  };
}

const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const H2 = 'font-display text-2xl font-bold text-foreground';

export default function DepartmentDetailPage({ params }: Props) {
  const dept = DEPARTMENTS.find((d) => d.id === params.id);
  if (!dept) notFound();

  const deptDoctors = DOCTORS.filter((doc) => doc.departmentId === dept.id);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-prohealth-ice via-prohealth-tint to-background py-12 sm:py-16">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl -mr-24 -mt-24 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className={`rounded-sm hover:text-primary ${FOCUS_RING}`}>Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li><Link href="/departments" className={`rounded-sm hover:text-primary ${FOCUS_RING}`}>Departments</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5" /></li>
              <li aria-current="page" className="font-semibold text-foreground">{dept.name}</li>
            </ol>
          </nav>

          <div className="max-w-3xl space-y-4">
            <p className="inline-flex flex-wrap items-center gap-2 rounded-pill border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
              <Building2 className="w-4 h-4" aria-hidden="true" />
              <span>{dept.location}</span>
              <span aria-hidden="true">·</span>
              <span>{dept.beds} inpatient beds</span>
            </p>
            <h1 className="font-display text-display-md text-foreground">{dept.name}</h1>
            <p className="text-base sm:text-lead text-prohealth-body max-w-2xl">{dept.shortDesc}</p>
            <Link
              href={`/appointments?dept=${dept.id}`}
              className={`inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-soft hover:bg-prohealth-primary-hover transition-colors lg:hidden ${FOCUS_RING}`}
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Book a visit
            </Link>
          </div>
        </div>
      </section>

      {/* Detail content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] gap-10 xl:gap-16">
            <div className="min-w-0 space-y-16">
              <Reveal as="section" aria-labelledby="overview-heading" className="space-y-4">
                <h2 id="overview-heading" className={H2}>Overview and clinical philosophy</h2>
                <p className="text-base leading-relaxed text-prohealth-body max-w-prose">{dept.fullDesc}</p>
              </Reveal>

              <Reveal as="section" aria-labelledby="conditions-heading" className="space-y-4">
                <h2 id="conditions-heading" className={`flex items-center gap-2 ${H2}`}>
                  <ShieldCheck className="w-6 h-6 text-primary" aria-hidden="true" />
                  Conditions we treat
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dept.conditionsTreated.map((cond) => (
                    <li key={cond} className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/50 p-3.5">
                      <CheckCircle2 className="mt-0.5 w-4 h-4 shrink-0 text-care" aria-hidden="true" />
                      <span className="text-sm font-medium text-foreground">{cond}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {/* Stacked service cards (C04): not wrapped in Reveal so sticky stays simple */}
              <section aria-labelledby="services-heading" className="space-y-5">
                <div className="space-y-2">
                  <p className="text-eyebrow uppercase text-muted-foreground">Services</p>
                  <h2 id="services-heading" className={H2}>Procedures and diagnostics</h2>
                </div>
                <DepartmentServiceStack services={dept.proceduresOffered} location={dept.location} headingId="services-heading" />
              </section>

              <section aria-labelledby="expect-heading" className="space-y-8">
                <div className="space-y-2">
                  <p className="text-eyebrow uppercase text-muted-foreground">Your visit</p>
                  <h2 id="expect-heading" className={H2}>What to expect</h2>
                </div>
                <WhatToExpect departmentId={dept.id} location={dept.location} headingId="expect-heading" />
              </section>

              <Reveal as="section" aria-labelledby="tech-heading" className="space-y-4">
                <h2 id="tech-heading" className={`flex items-center gap-2 ${H2}`}>
                  <Cpu className="w-6 h-6 text-primary" aria-hidden="true" />
                  Diagnostic and robotic systems
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dept.technologies.map((tech) => (
                    <li key={tech} className="flex items-center gap-2.5 rounded-xl border border-dept-blue-bg bg-dept-blue-bg/60 p-3.5 text-sm font-medium text-foreground">
                      <span className="w-2 h-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                      {tech}
                    </li>
                  ))}
                </ul>
              </Reveal>

              {deptDoctors.length > 0 && (
                <Reveal as="section" aria-labelledby="doctors-heading" className="space-y-5">
                  <h2 id="doctors-heading" className={H2}>Physicians and specialists</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {deptDoctors.map((doc) => (
                      <li key={doc.id} className="flex items-center gap-4 rounded-card border border-border bg-card p-4 shadow-soft">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={doc.avatarUrl} alt="" width={64} height={64} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="min-w-0 space-y-1">
                          <h3 className="text-sm font-bold text-foreground">{doc.name}</h3>
                          <p className="text-sm font-medium text-primary">{doc.specialty}</p>
                          <div className="flex items-center gap-4 pt-1 text-sm">
                            <Link href={`/doctors/${doc.id}`} className={`rounded-sm font-semibold text-muted-foreground underline hover:text-foreground ${FOCUS_RING}`}>
                              Profile<span className="sr-only"> of {doc.name}</span>
                            </Link>
                            <Link href={`/appointments?doc=${doc.id}`} className={`rounded-sm font-semibold text-primary hover:underline ${FOCUS_RING}`}>
                              Book<span className="sr-only"> with {doc.name}</span>
                            </Link>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              )}
            </div>

            {/* Sidebar */}
            <aside aria-label="Book and department facts" className="space-y-6">
              <div className="bg-primary text-primary-foreground p-6 rounded-panel shadow-lift space-y-4">
                <p className="inline-block text-eyebrow uppercase text-sky-100 bg-white/10 px-2.5 py-1 rounded border border-white/20">
                  Priority access
                </p>
                <h2 className="text-xl font-bold font-display">Book a department appointment</h2>
                <p className="text-sm text-sky-100 leading-relaxed">
                  First consultations, pre-operative clearances and second opinions.
                </p>
                <Link
                  href={`/appointments?dept=${dept.id}`}
                  className={`w-full bg-white hover:bg-sky-50 text-primary font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary`}
                >
                  <Calendar className="w-4 h-4" aria-hidden="true" />
                  Book a department visit
                </Link>
              </div>

              <div className="bg-muted/50 border border-border p-6 rounded-card text-sm">
                <h2 className="font-bold text-foreground text-base mb-3">Department facts</h2>
                <dl className="space-y-3 text-muted-foreground">
                  {[
                    ['Department chair', dept.leadPhysician],
                    ['Location', dept.location],
                    ['Inpatient beds', `${dept.beds}`],
                    ['Patients a year', dept.annualProcedures],
                  ].map(([term, value]) => (
                    <div key={term} className="flex justify-between gap-3 pb-2 border-b border-border">
                      <dt>{term}</dt>
                      <dd className="text-right font-semibold text-foreground">{value}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3">
                    <dt>24/7 emergency support</dt>
                    <dd className={dept.emergencySupport ? 'font-bold text-alert' : 'text-muted-foreground'}>
                      {dept.emergencySupport ? 'Active 24/7' : 'Scheduled hours'}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="p-4 rounded-card bg-alert-soft border border-alert/20 space-y-2">
                <p className="flex items-center gap-2 font-bold text-sm text-alert-strong">
                  <PhoneCall className="w-4 h-4" aria-hidden="true" />
                  Medical emergency?
                </p>
                <p className="text-sm text-alert-strong">
                  Call our 24/7 trauma desk on{' '}
                  <a href="tel:876256876" className={`rounded-sm font-bold underline underline-offset-2 ${FOCUS_RING}`}>876-256-876</a>{' '}
                  or come to the ground-floor emergency entrance.
                </p>
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
