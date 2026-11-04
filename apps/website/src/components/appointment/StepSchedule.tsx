'use client';

import React from 'react';
import { Info, Stethoscope, Video } from 'lucide-react';
import type { Doctor } from '@hospital/contracts';
import { cn } from '@/lib/utils';
import { type CareType, shortDayList, weekdayOf } from './wizardModel';
import { ChoiceCard, FieldMessage, FOCUS_RING, INPUT_CLASS, StepHeading, describedBy } from './WizardUi';

interface StepScheduleProps {
  idPrefix: string;
  doctor?: Doctor;
  careType: CareType;
  onCareType: (type: CareType) => void;
  today: string;
  slotDate: string;
  onDate: (date: string) => void;
  slots: string[];
  slotTime: string;
  onTime: (time: string) => void;
  dateError?: string;
  timeError?: string;
  autoFocus: boolean;
}

const CARE_OPTIONS: { value: CareType; title: string; detail: string; Icon: typeof Video }[] = [
  { value: 'OPD_IN_PERSON', title: 'In person', detail: 'At the hospital outpatient clinic', Icon: Stethoscope },
  { value: 'TELEHEALTH_VIRTUAL', title: 'Video visit', detail: 'Secure video call from home', Icon: Video },
];

/** Step 3: visit type, date and time slot. */
export default function StepSchedule({
  idPrefix,
  doctor,
  careType,
  onCareType,
  today,
  slotDate,
  onDate,
  slots,
  slotTime,
  onTime,
  dateError,
  timeError,
  autoFocus,
}: StepScheduleProps) {
  const dateId = `${idPrefix}-date`;
  const timeLegendId = `${idPrefix}-time-legend`;
  const timeErrorId = `${idPrefix}-time-error`;
  const days = doctor?.availableDays ?? [];
  const weekday = weekdayOf(slotDate);
  const offDay = Boolean(weekday && days.length && !days.includes(weekday));

  return (
    <div className="space-y-6">
      <StepHeading
        id={`${idPrefix}-schedule-heading`}
        step={3}
        title="Pick a date and time"
        description={doctor ? `Your appointment is with ${doctor.name}.` : undefined}
        autoFocus={autoFocus}
      />

      <fieldset className="min-w-0 space-y-2">
        <legend className="mb-2 text-sm font-semibold text-foreground">Type of visit</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {CARE_OPTIONS.map(({ value, title, detail, Icon }) => (
            <ChoiceCard key={value} pressed={careType === value} onClick={() => onCareType(value)} className="items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="pr-6">
                <span className="block text-sm font-semibold text-foreground">{title}</span>
                <span className="block text-[13px] text-muted-foreground">{detail}</span>
              </span>
            </ChoiceCard>
          ))}
        </div>
      </fieldset>

      <div className="space-y-1.5">
        <label htmlFor={dateId} className="block text-sm font-semibold text-foreground">
          Date <span className="font-normal text-muted-foreground">(required)</span>
        </label>
        <input
          id={dateId}
          type="date"
          value={slotDate}
          min={today || undefined}
          onChange={(e) => onDate(e.target.value)}
          aria-invalid={dateError ? true : undefined}
          aria-describedby={describedBy(dateId, { hint: days.length > 0, error: Boolean(dateError) })}
          className={cn(INPUT_CLASS, 'h-11 sm:max-w-xs')}
        />
        {days.length > 0 ? (
          <p id={`${dateId}-hint`} className="text-[13px] text-muted-foreground">
            {doctor?.name ?? 'This doctor'} usually holds clinic on {shortDayList(days)}.
          </p>
        ) : null}
        {offDay && !dateError ? (
          <p className="flex items-start gap-1.5 text-[13px] text-dept-amber-fg">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {weekday} is not a usual clinic day. You can still request it, and our desk will call if it needs to move.
          </p>
        ) : null}
        <FieldMessage id={`${dateId}-error`} message={dateError} />
      </div>

      <fieldset
        className="min-w-0"
        aria-describedby={timeError ? timeErrorId : undefined}
      >
        <legend id={timeLegendId} className="mb-2 text-sm font-semibold text-foreground">
          Time <span className="font-normal text-muted-foreground">(required)</span>
        </legend>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slots.map((time) => {
            const pressed = slotTime === time;
            return (
              <button
                key={time}
                type="button"
                aria-pressed={pressed}
                onClick={() => onTime(time)}
                className={cn(
                  'rounded-xl border px-2 py-2.5 text-sm font-medium tabular-nums transition-colors duration-250',
                  pressed
                    ? 'border-primary bg-primary text-primary-foreground shadow-soft'
                    : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-dept-blue-bg',
                  FOCUS_RING
                )}
              >
                {time}
              </button>
            );
          })}
        </div>
        <div className="mt-2">
          <FieldMessage id={timeErrorId} message={timeError} />
        </div>
      </fieldset>
    </div>
  );
}
