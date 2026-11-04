'use client';

import React, { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Department, Doctor, Appointment } from '@hospital/contracts';
import { API_BASE_URL } from '@/lib/api';
import { cn } from '@/lib/utils';
import {
  type CareType,
  type PatientFormValues,
  type StepError,
  DETAIL_FIELDS,
  FALLBACK_DEPARTMENTS,
  FALLBACK_DOCTORS,
  TOTAL_STEPS,
  patientSchema,
  slotsFor,
  loadList,
  stepVariants,
  todayLocalISO,
} from './wizardModel';
import { ChoiceSkeleton, WizardNav } from './WizardUi';
import WizardProgress from './WizardProgress';
import StepDepartment from './StepDepartment';
import StepDoctor from './StepDoctor';
import StepSchedule from './StepSchedule';
import StepDetails from './StepDetails';
import StepReview from './StepReview';
import BookingSuccess from './BookingSuccess';

export interface AppointmentBookingWizardProps {
  variant?: 'embedded' | 'modal' | 'page';
  onClose?: () => void;
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
  preselectedSlot?: string;
  /** Prefills "Reason for visit", e.g. from the triage tool's `reason` query param. */
  initialSymptoms?: string;
}

/**
 * Five-step booking wizard: department, doctor, date and time, patient details,
 * review. Steps slide 24px with a fade (no slide under reduced motion), focus
 * moves to each new step heading, and the POST payload is unchanged.
 */
export default function AppointmentBookingWizard({
  variant = 'page',
  onClose,
  preselectedDoctorId,
  preselectedDepartmentId,
  preselectedSlot,
  initialSymptoms,
}: AppointmentBookingWizardProps) {
  const idPrefix = `bw${useId().replace(/:/g, '')}`;
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  // In the page and embedded variants focus moves only after the visitor acts;
  // in the dialog the first heading takes focus as soon as it opens.
  const [focusHeading, setFocusHeading] = useState(variant === 'modal');
  const [departments, setDepartments] = useState<Department[] | null>(null);
  const [doctors, setDoctors] = useState<Doctor[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState<Appointment | null>(null);
  const [error, setError] = useState<StepError>(null);
  // With a preselected doctor or department, hold a skeleton until the doctor
  // list arrives so the right step appears directly instead of sliding past step 1.
  const [preselectReady, setPreselectReady] = useState(!(preselectedDoctorId || preselectedDepartmentId));

  const [selectedDeptId, setSelectedDeptId] = useState<string>(preselectedDepartmentId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(preselectedDoctorId || '');
  const [careType, setCareType] = useState<CareType>('OPD_IN_PERSON');
  // Dates are set after mount so server and client render the same markup.
  const [today, setToday] = useState('');
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState<string>(preselectedSlot || '');

  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientSchema),
    mode: 'onTouched',
    defaultValues: { firstName: '', lastName: '', phone: '', email: '', symptoms: initialSymptoms ?? '', consent: false },
  });

  useEffect(() => {
    const now = todayLocalISO();
    setToday(now);
    setSlotDate((d) => d || now);
  }, []);

  // Load live data from the API gateway with a static fallback.
  useEffect(() => {
    loadList('/api/v1/appointments/departments', FALLBACK_DEPARTMENTS, setDepartments);
    loadList('/api/v1/appointments/doctors', FALLBACK_DOCTORS, setDoctors);
  }, []);

  // Apply preselected doctor or department once the doctor list is known.
  useEffect(() => {
    if (!doctors) return;
    const matched = preselectedDoctorId ? doctors.find((d) => d.id === preselectedDoctorId) : undefined;
    if (matched) {
      setSelectedDoctorId(matched.id);
      setSelectedDeptId(matched.departmentId);
      setStep(3); // Jump directly to slot selection
    } else if (preselectedDepartmentId) {
      setSelectedDoctorId('');
      setSelectedDeptId(preselectedDepartmentId);
      setStep(2);
    } else if (preselectedDoctorId) {
      setSelectedDoctorId('');
    }
    setPreselectReady(true);
  }, [preselectedDoctorId, preselectedDepartmentId, doctors]);

  const selectedDepartment = departments?.find((d) => d.id === selectedDeptId);
  const availableDoctors = doctors
    ? selectedDeptId
      ? doctors.filter((d) => d.departmentId === selectedDeptId)
      : doctors
    : null;
  const selectedDoctor = availableDoctors?.find((d) => d.id === selectedDoctorId);
  const slots = slotsFor(selectedDoctor);

  const goTo = (next: number) => {
    setError(null);
    if (step === TOTAL_STEPS) form.clearErrors('consent');
    setDirection(next > step ? 1 : -1);
    setFocusHeading(true);
    setStep(Math.min(Math.max(next, 1), TOTAL_STEPS));
  };

  const selectDepartment = (id: string) => {
    if (id !== selectedDeptId) setSelectedDoctorId('');
    setSelectedDeptId(id);
    setError(null);
  };

  const handleNext = async () => {
    if (step === 1 && !selectedDepartment) {
      return setError({ field: 'department', message: 'Choose a department to continue.' });
    }
    if (step === 2 && !selectedDoctor) {
      return setError({ field: 'doctor', message: 'Choose a doctor to continue.' });
    }
    if (step === 3) {
      if (!slotDate) return setError({ field: 'date', message: 'Choose a date for your visit.' });
      if (today && slotDate < today) return setError({ field: 'date', message: 'Choose today or a later date.' });
      if (!slots.includes(slotTime)) return setError({ field: 'time', message: 'Choose a time slot.' });
    }
    if (step === 4) {
      const ok = await form.trigger([...DETAIL_FIELDS], { shouldFocus: true });
      if (!ok) return;
    }
    goTo(step + 1);
  };

  const submitBooking = async (values: PatientFormValues) => {
    setError(null);
    setLoading(true);

    const payload = {
      doctorId: selectedDoctorId,
      departmentId: selectedDeptId,
      doctorName: selectedDoctor?.name || 'Assigned Specialist',
      departmentName: selectedDepartment?.name || 'General Outpatient Care',
      slotDate,
      slotTime,
      type: careType,
      symptoms: values.symptoms.trim() || 'Routine clinical outpatient evaluation',
      newPatient: {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        phoneNumber: values.phone.trim(),
        email: values.email.trim() || 'patient@prohealth.hospital',
      },
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to confirm appointment booking');
      }

      const appt: Appointment = await res.json();
      setDirection(1);
      setFocusHeading(true);
      setConfirmedAppt(appt);
    } catch (err: any) {
      setError({ field: 'submit', message: err.message || 'An unexpected error occurred during booking.' });
    } finally {
      setLoading(false);
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    if (step < TOTAL_STEPS) {
      e.preventDefault();
      void handleNext();
      return;
    }
    void form.handleSubmit(submitBooking)(e);
  };

  const handleReset = () => {
    setConfirmedAppt(null);
    setSelectedDeptId('');
    setSelectedDoctorId('');
    setSlotTime('');
    form.reset();
    goTo(1);
  };

  // No slide under reduced motion (opacity only).
  const variants = stepVariants(reduceMotion ? 0 : 24);
  const fieldError = (field: NonNullable<StepError>['field']) => (error?.field === field ? error.message : undefined);
  const viewKey = confirmedAppt ? 'done' : `step-${step}`;

  const stepView = confirmedAppt ? (
    <BookingSuccess
      idPrefix={idPrefix}
      appointment={confirmedAppt}
      onBookAnother={handleReset}
      onClose={variant === 'modal' ? onClose : undefined}
    />
  ) : step === 1 ? (
    <StepDepartment idPrefix={idPrefix} departments={departments} selectedId={selectedDeptId} onSelect={selectDepartment} error={fieldError('department')} autoFocus={focusHeading} />
  ) : step === 2 ? (
    <StepDoctor
      idPrefix={idPrefix}
      department={selectedDepartment}
      doctors={availableDoctors}
      selectedId={selectedDoctorId}
      onSelect={(id) => { setSelectedDoctorId(id); setError(null); }}
      error={fieldError('doctor')}
      autoFocus={focusHeading}
    />
  ) : step === 3 ? (
    <StepSchedule
      idPrefix={idPrefix}
      doctor={selectedDoctor}
      careType={careType}
      onCareType={setCareType}
      today={today}
      slotDate={slotDate}
      onDate={(d) => { setSlotDate(d); setError(null); }}
      slots={slots}
      slotTime={slotTime}
      onTime={(t) => { setSlotTime(t); setError(null); }}
      dateError={fieldError('date')}
      timeError={fieldError('time')}
      autoFocus={focusHeading}
    />
  ) : step === 4 ? (
    <StepDetails idPrefix={idPrefix} form={form} autoFocus={focusHeading} />
  ) : (
    <StepReview
      idPrefix={idPrefix}
      department={selectedDepartment}
      doctor={selectedDoctor}
      careType={careType}
      slotDate={slotDate}
      slotTime={slotTime}
      form={form}
      onEdit={goTo}
      submitError={fieldError('submit')}
      autoFocus={focusHeading}
    />
  );

  const content = (
    <form noValidate onSubmit={onFormSubmit} aria-label="Book an appointment" className="space-y-6">
      {!confirmedAppt && <WizardProgress step={step} />}

      {preselectReady ? (
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.div key={viewKey} custom={direction} variants={variants} initial="enter" animate="center" exit="exit">
            {stepView}
          </motion.div>
        </AnimatePresence>
      ) : (
        <div>
          <p className="sr-only" role="status">Loading your booking</p>
          <ChoiceSkeleton count={4} />
        </div>
      )}

      {!confirmedAppt && <WizardNav step={step} loading={loading} onBack={() => goTo(step - 1)} />}
    </form>
  );

  // The dialog shell (Radix Dialog) lives in AppointmentBookingModal.
  if (variant === 'modal') return content;

  return (
    <div
      className={cn(
        'rounded-panel border border-border bg-card p-5 sm:p-8',
        variant === 'page' ? 'shadow-lift lg:p-10' : 'shadow-soft'
      )}
    >
      {content}
    </div>
  );
}
