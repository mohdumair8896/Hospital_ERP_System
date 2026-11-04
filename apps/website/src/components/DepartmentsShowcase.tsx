'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import * as Tabs from '@radix-ui/react-tabs';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, MapPin, Siren, Sparkles } from 'lucide-react';
import { Reveal, EASE_OUT_SOFT } from '@/components/motion';
import { useDepartments, departmentHref, staticDepartmentFor } from '@/components/sections/discovery/data';
import { themeFor } from '@/components/sections/discovery/departmentThemes';

interface DepartmentsShowcaseProps {
  onSelectDepartment: (deptId: string) => void;
}

const RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2';
const FADE = { duration: 0.6, ease: EASE_OUT_SOFT };

/**
 * Tabbed split card (pattern C20): Radix Tabs with a sliding `layoutId`
 * underline, a crossfading photo and pastel panel per department. No
 * autoplay: only the visitor changes the tab.
 */
export default function DepartmentsShowcase({ onSelectDepartment }: DepartmentsShowcaseProps) {
  const { items: departments, loading } = useDepartments();
  const [selected, setSelected] = useState<string | null>(null);

  const activeIndex = Math.max(0, departments.findIndex((d) => d.id === selected));
  const active = departments[activeIndex];
  const theme = active ? themeFor(active.code, active.name, activeIndex) : null;
  const details = active ? staticDepartmentFor(active) : undefined;

  return (
    <section id="departments" aria-labelledby="departments-title" className="bg-white py-section">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-12 xl:px-20">
        <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-1.5 text-eyebrow uppercase text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Centers of excellence
            </p>
            <h2 id="departments-title" className="mt-3 font-display text-display-md text-prohealth-heading">
              Clinical departments and specialties
            </h2>
            <p className="mt-3 max-w-2xl text-base text-prohealth-body">
              Modern diagnostic laboratories, hybrid surgical suites and dedicated intensive care units.
            </p>
          </div>
          <Link
            href="/departments"
            className={`group inline-flex shrink-0 items-center gap-2 self-start rounded-pill border border-border bg-white px-5 py-2.5 text-sm font-semibold text-primary shadow-soft transition-colors duration-250 hover:bg-muted md:self-auto ${RING}`}
          >
            View all departments
            <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </Reveal>

        {loading || !active || !theme ? (
          <DepartmentsSkeleton />
        ) : (
          <Tabs.Root value={active.id} onValueChange={setSelected}>
            <Tabs.List
              aria-label="Departments"
              className="-mx-4 mb-6 flex gap-1 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0"
            >
              {departments.map((dept, i) => {
                const t = themeFor(dept.code, dept.name, i);
                const isActive = dept.id === active.id;
                return (
                  <Tabs.Trigger
                    key={dept.id}
                    value={dept.id}
                    className={`relative shrink-0 whitespace-nowrap rounded-t-lg px-4 pb-3.5 pt-3 text-sm font-semibold transition-colors duration-250 ${
                      isActive ? t.fg : 'text-prohealth-muted hover:text-prohealth-heading'
                    } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring`}
                  >
                    {t.label}
                    {isActive && (
                      <motion.span
                        layoutId="dept-tab-underline"
                        className="absolute inset-x-2 bottom-0 h-[3px] rounded-full bg-current"
                        transition={{ duration: 0.4, ease: EASE_OUT_SOFT }}
                        aria-hidden="true"
                      />
                    )}
                  </Tabs.Trigger>
                );
              })}
            </Tabs.List>

            <div className="relative grid overflow-hidden rounded-panel border border-border lg:grid-cols-2">
              {/* Photo: crossfade */}
              <div className="relative aspect-[16/10] bg-muted lg:aspect-auto lg:min-h-[28rem]">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={FADE}
                  >
                    <Image src={theme.image} alt={theme.imageAlt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Pastel panel: the tint crossfades under the content */}
              <div className="relative">
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active.id}
                    className={`absolute inset-0 ${theme.bg}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={FADE}
                    aria-hidden="true"
                  />
                </AnimatePresence>
                <AnimatePresence mode="wait" initial={false}>
                  <Tabs.Content key={active.id} value={active.id} forceMount asChild>
                    <motion.div
                      className={`relative flex h-full flex-col p-6 sm:p-10 lg:p-12 ${RING} focus-visible:ring-inset`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25, ease: EASE_OUT_SOFT }}
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/80 ${theme.fg}`}>
                          <theme.icon className="h-6 w-6" aria-hidden="true" />
                        </span>
                        {active.emergencySupport && (
                          <span className="inline-flex items-center gap-1.5 rounded-pill bg-white/80 px-3 py-1 text-sm font-semibold text-alert">
                            <Siren className="h-4 w-4" aria-hidden="true" />
                            24/7 emergency support
                          </span>
                        )}
                      </div>

                      <h3 className={`mt-5 font-display text-2xl font-bold sm:text-3xl ${theme.fg}`}>{active.name}</h3>
                      <p className="mt-3 max-w-prose text-base leading-relaxed text-prohealth-body">
                        {active.description}
                      </p>

                      <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
                        <div className="col-span-2 sm:col-span-1">
                          <dt className="text-prohealth-muted">Location</dt>
                          <dd className="mt-0.5 flex items-center gap-1 font-semibold text-prohealth-heading">
                            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            {active.location}
                          </dd>
                        </div>
                        {details && (
                          <>
                            <div>
                              <dt className="text-prohealth-muted">Inpatient beds</dt>
                              <dd className="mt-0.5 font-semibold text-prohealth-heading">{details.beds}</dd>
                            </div>
                            <div>
                              <dt className="text-prohealth-muted">Procedures a year</dt>
                              <dd className="mt-0.5 font-semibold text-prohealth-heading">{details.annualProcedures}</dd>
                            </div>
                          </>
                        )}
                      </dl>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row lg:mt-auto lg:pt-8">
                        <Link
                          href={departmentHref(active)}
                          className={`group inline-flex items-center justify-center gap-2 rounded-pill bg-white px-5 py-3 text-sm font-semibold shadow-soft transition-colors duration-250 hover:bg-white/70 ${theme.fg} ${RING}`}
                        >
                          {details ? `Explore ${theme.label.toLowerCase()}` : 'Browse all departments'}
                          <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-out-soft group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onSelectDepartment(active.id)}
                          className={`inline-flex items-center justify-center gap-2 rounded-pill bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-250 hover:bg-prohealth-primary-hover ${RING}`}
                        >
                          Book an OPD visit
                        </button>
                      </div>
                    </motion.div>
                  </Tabs.Content>
                </AnimatePresence>
              </div>
            </div>
          </Tabs.Root>
        )}
      </div>
    </section>
  );
}

function DepartmentsSkeleton() {
  return (
    <div role="status" aria-label="Loading departments">
      <div className="mb-6 flex gap-2 overflow-hidden border-b border-border pb-3" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="h-8 w-24 shrink-0 rounded-pill bg-muted motion-safe:animate-pulse" />
        ))}
      </div>
      <div className="grid overflow-hidden rounded-panel border border-border lg:grid-cols-2" aria-hidden="true">
        <div className="aspect-[16/10] bg-muted motion-safe:animate-pulse lg:aspect-auto lg:min-h-[28rem]" />
        <div className="space-y-4 p-6 sm:p-10 lg:p-12">
          <div className="h-12 w-12 rounded-2xl bg-muted motion-safe:animate-pulse" />
          <div className="h-8 w-2/3 rounded bg-muted motion-safe:animate-pulse" />
          <div className="h-4 w-full rounded bg-muted motion-safe:animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted motion-safe:animate-pulse" />
          <div className="h-11 w-48 rounded-pill bg-muted motion-safe:animate-pulse" />
        </div>
      </div>
    </div>
  );
}
