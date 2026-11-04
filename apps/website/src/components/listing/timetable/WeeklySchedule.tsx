'use client';

import React, { useEffect, useMemo, useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { CalendarX2, Info, Phone } from 'lucide-react';
import { EASE_OUT_SOFT } from '@/components/motion';
import { useDepartments, useDoctors } from '@/components/sections/discovery/data';
import { EmptyState, FilterChips, ResetButton, focusActiveChip, focusLater, type ChipOption } from '../FilterChips';
import { FOCUS_RING } from '../PageHeader';
import { DoctorScheduleRow, ScheduleRowSkeleton } from './DoctorScheduleRow';
import { WeekOverview } from './WeekOverview';
import { WEEK, buildRows, deptLabel, todayWeekday, type Weekday } from './schedule-model';

const ALL = 'ALL';
const plural = (n: number, word: string) => `${n} ${n === 1 ? word : `${word}s`}`;

/**
 * Weekly OPD timetable built from the same doctor and department data the
 * booking wizard uses (API, with the bundled fallback), so every time chip
 * preselects a doctor and time the wizard knows.
 *
 * Department chips filter the doctors; day tabs (Radix Tabs: arrow keys,
 * Home/End) start on today and show each doctor's times for that day. The
 * selected tab's pill slides with a framer `layoutId`.
 */
export function WeeklySchedule() {
  const doctorsState = useDoctors();
  const departmentsState = useDepartments();
  const loading = doctorsState.loading || departmentsState.loading;
  const departments = departmentsState.items;

  const [dept, setDept] = useState<string>(ALL);
  const [day, setDay] = useState<Weekday>('Monday');
  const [today, setToday] = useState<Weekday | null>(null);

  // Today is only known in the browser (the visitor's time zone).
  useEffect(() => {
    const t = todayWeekday();
    setToday(t);
    setDay(t);
  }, []);

  const showAllDepartments = () => {
    setDept(ALL);
    focusActiveChip('timetable-departments');
  };

  const rows = useMemo(() => buildRows(doctorsState.items, departments), [doctorsState.items, departments]);
  const deptRows = dept === ALL ? rows : rows.filter((r) => r.doctor.departmentId === dept);
  const countOn = (d: Weekday) => deptRows.filter((r) => r.days.includes(d)).length;

  const selectedIndex = departments.findIndex((d) => d.id === dept);
  const selectedDept = selectedIndex >= 0 ? departments[selectedIndex] : undefined;
  const selectedLabel = selectedDept ? deptLabel(selectedDept, selectedIndex) : 'all departments';

  const options: ChipOption[] = [
    { value: ALL, label: 'All departments', count: rows.length },
    ...departments.map((d, i) => ({
      value: d.id,
      label: deptLabel(d, i),
      count: rows.filter((r) => r.doctor.departmentId === d.id).length,
    })),
  ];

  if (loading) {
    return (
      <div role="status" aria-label="Loading the timetable" className="space-y-6">
        <div className="flex flex-wrap gap-2" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="h-10 w-32 rounded-pill bg-muted motion-safe:animate-pulse" />
          ))}
        </div>
        <div className="h-16 rounded-card bg-muted motion-safe:animate-pulse" aria-hidden="true" />
        {Array.from({ length: 3 }, (_, i) => (
          <ScheduleRowSkeleton key={i} />
        ))}
      </div>
    );
  }

  const dayRows = deptRows.filter((r) => r.days.includes(day));
  const dayIndex = WEEK.indexOf(day);
  const nextDay = [1, 2, 3, 4, 5, 6].map((k) => WEEK[(dayIndex + k) % 7]).find((d) => countOn(d) > 0);

  return (
    <div>
      <FilterChips
        id="timetable-departments"
        label="Filter the timetable by department"
        options={options}
        value={dept}
        onChange={setDept}
        layoutId="timetable-dept-pill"
        countNoun="doctor"
      />

      <p className="mt-5 text-sm text-prohealth-muted" aria-live="polite">
        {deptRows.length === 0
          ? `No OPD clinics for ${selectedLabel}.`
          : `Showing ${plural(dayRows.length, 'doctor')} on ${day} for ${selectedLabel}.`}
      </p>

      {deptRows.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon={<CalendarX2 className="h-6 w-6" aria-hidden="true" />}
            title={selectedDept?.code === 'EMERGENCY' ? 'Emergency care is open 24/7' : 'No clinics this week'}
            description={
              selectedDept?.code === 'EMERGENCY'
                ? 'Emergency care is walk-in and open 24/7, so it has no OPD timetable.'
                : `No OPD clinics are scheduled for ${selectedLabel} this week.`
            }
          >
            {selectedDept?.code === 'EMERGENCY' && (
              <a
                href="tel:876256876"
                className={`inline-flex items-center gap-1.5 rounded-pill bg-alert px-4 py-2 text-sm font-semibold text-white transition-colors duration-250 hover:bg-alert-strong ${FOCUS_RING}`}
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Call 876-256-876
              </a>
            )}
            <ResetButton onClick={showAllDepartments}>Show all departments</ResetButton>
          </EmptyState>
        </div>
      ) : (
        <Tabs.Root value={day} onValueChange={(v) => setDay(v as Weekday)} className="mt-6">
          <Tabs.List
            aria-label="Day of the week"
            className="grid grid-cols-7 gap-1 rounded-card border border-border bg-card p-1.5 shadow-soft"
          >
            {WEEK.map((d) => {
              const active = d === day;
              const n = countOn(d);
              return (
                <Tabs.Trigger
                  key={d}
                  value={d}
                  className={`relative isolate flex min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-2 text-sm font-semibold transition-colors duration-250 ${
                    active ? 'text-primary-foreground' : 'text-prohealth-heading hover:bg-muted'
                  } ${FOCUS_RING}`}
                >
                  {active && (
                    <motion.span
                      layoutId="timetable-day-pill"
                      className="absolute inset-0 -z-10 rounded-xl bg-primary"
                      transition={{ duration: 0.35, ease: EASE_OUT_SOFT }}
                      aria-hidden="true"
                    />
                  )}
                  <span aria-hidden="true" className="lg:hidden">
                    {d.slice(0, 3)}
                  </span>
                  <span className="sr-only lg:not-sr-only">{d}</span>
                  <span
                    aria-hidden="true"
                    className={`text-xs font-medium tabular-nums ${active ? 'text-primary-foreground/85' : 'text-prohealth-muted'}`}
                  >
                    {n === 0 ? '–' : n}
                    <span className="hidden sm:inline"> {n === 0 ? '' : n === 1 ? 'doctor' : 'doctors'}</span>
                  </span>
                  <span className="sr-only">, {n === 0 ? 'no clinics' : plural(n, 'doctor')}</span>
                  {d === today && (
                    <>
                      <span
                        aria-hidden="true"
                        className={`absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full ${active ? 'bg-primary-foreground' : 'bg-care'}`}
                      />
                      <span className="sr-only">, today</span>
                    </>
                  )}
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {WEEK.map((d) => (
            <Tabs.Content
              key={d}
              value={d}
              className={`mt-6 rounded-card motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 ${FOCUS_RING}`}
            >
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
                <h2 className="font-display text-xl font-bold text-prohealth-heading">
                  {d === today ? `Today, ${d}` : d}
                </h2>
                {dayRows.length > 0 && (
                  <p className="flex items-center gap-1.5 text-sm text-prohealth-muted">
                    <Info className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    Pick a time to start booking. You choose the date in the next step.
                  </p>
                )}
              </div>

              {dayRows.length === 0 ? (
                <EmptyState
                  icon={<CalendarX2 className="h-6 w-6" aria-hidden="true" />}
                  title={`No ${dept === ALL ? 'OPD' : selectedLabel} clinics on ${d}`}
                  description={nextDay ? `The next clinic day is ${nextDay}.` : undefined}
                >
                  {nextDay && (
                    <ResetButton
                      onClick={() => {
                        setDay(nextDay);
                        focusLater('[role="tablist"] [aria-selected="true"]');
                      }}
                    >
                      See {nextDay}
                    </ResetButton>
                  )}
                  {dept !== ALL && <ResetButton onClick={showAllDepartments}>Show all departments</ResetButton>}
                </EmptyState>
              ) : (
                <ul className="space-y-4">
                  {dayRows.map((row) => (
                    <li key={row.doctor.id}>
                      <DoctorScheduleRow row={row} day={d} />
                    </li>
                  ))}
                </ul>
              )}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      )}

      <WeekOverview rows={deptRows} selected={day} today={today} />
    </div>
  );
}
