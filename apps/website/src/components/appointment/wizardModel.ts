import * as z from 'zod';
import type { Variants } from 'framer-motion';
import type { Department, Doctor } from '@hospital/contracts';
import { API_BASE_URL } from '@/lib/api';
import { EASE_OUT_SOFT } from '@/components/motion/constants';
import { DEPARTMENTS as FALLBACK_DEPTS, DOCTORS as FALLBACK_DOCS } from '@/data/hospitalData';

/** Shared model for the 5-step booking wizard (pattern P-FORM-3). */

/** Fetches a list from the gateway, falling back to static data on any failure. */
export function loadList<T>(path: string, fallback: T[], set: (list: T[]) => void) {
  fetch(`${API_BASE_URL}${path}`)
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
    .then((data) => set(Array.isArray(data) && data.length ? data : fallback))
    .catch(() => set(fallback));
}

/**
 * Step transition: slide `offset` px in the travel direction with a fade, 0.25s
 * in and 0.15s out. Pass 0 under reduced motion so only opacity changes.
 */
export function stepVariants(offset: number): Variants {
  return {
    enter: (dir: number) => ({ x: dir * offset, opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.25, ease: EASE_OUT_SOFT } },
    exit: (dir: number) => ({ x: -dir * offset, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' } }),
  };
}

export type CareType = 'OPD_IN_PERSON' | 'TELEHEALTH_VIRTUAL';

export const WIZARD_STEPS = [
  { num: 1, label: 'Department' },
  { num: 2, label: 'Doctor' },
  { num: 3, label: 'Date & time' },
  { num: 4, label: 'Your details' },
  { num: 5, label: 'Review' },
] as const;

export const TOTAL_STEPS = WIZARD_STEPS.length;

export const DEFAULT_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
];

/** Main hospital line and ambulance line, as shown in the site header. */
/** sessionStorage key the symptom triage tool uses to hand its summary to /appointments (kept out of the URL). */
export const TRIAGE_REASON_KEY = 'prohealth_triage_reason';

export const HOSPITAL_PHONE = { label: '123-456-7890', href: 'tel:1234567890' };
export const AMBULANCE_PHONE = { label: '876-256-876', href: 'tel:876256876' };

/** Static department data reshaped to the API contract, used when the gateway is down. */
export const FALLBACK_DEPARTMENTS: Department[] = FALLBACK_DEPTS.map((d) => ({
  id: d.id,
  code: d.id,
  name: d.name,
  description: d.shortDesc,
  location: d.location,
  emergencySupport: d.emergencySupport,
  icon: d.iconName,
}));

export const FALLBACK_DOCTORS: Doctor[] = FALLBACK_DOCS;

/** Slots the doctor offers, or the standard OPD slots when none are listed. */
export function slotsFor(doctor?: Doctor): string[] {
  return doctor?.availableSlots?.length ? doctor.availableSlots : DEFAULT_SLOTS;
}

/** Today's date in the visitor's time zone as YYYY-MM-DD. Call only on the client. */
export function todayLocalISO(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseISO(iso: string): Date | null {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** "Monday" for a YYYY-MM-DD string, or '' when it is not a valid date. */
export function weekdayOf(iso: string): string {
  const date = parseISO(iso);
  return date ? date.toLocaleDateString('en-US', { weekday: 'long' }) : '';
}

/** "Monday, October 26, 2026" for a YYYY-MM-DD string. */
export function formatLongDate(iso: string): string {
  const date = parseISO(iso);
  return date
    ? date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : iso;
}

/** "Mon, Wed and Fri" from a list of weekday names. */
export function shortDayList(days: string[]): string {
  const short = days.map((d) => d.slice(0, 3));
  if (short.length <= 1) return short.join('');
  return `${short.slice(0, -1).join(', ')} and ${short[short.length - 1]}`;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_CHARS_RE = /^\+?[\d\s().-]+$/;

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter the patient’s first name.').max(60, 'Use 60 characters or fewer.'),
  lastName: z.string().trim().min(1, 'Enter the patient’s last name.').max(60, 'Use 60 characters or fewer.'),
  phone: z
    .string()
    .trim()
    .min(1, 'Enter a phone number so we can confirm the visit.')
    .refine(
      (v) => PHONE_CHARS_RE.test(v) && v.replace(/\D/g, '').length >= 7,
      'Enter a valid phone number, for example +1 555 234 5678.'
    ),
  email: z
    .string()
    .trim()
    .refine((v) => v === '' || EMAIL_RE.test(v), 'Enter a valid email address, or leave it blank.'),
  symptoms: z.string().trim().max(500, 'Keep this under 500 characters.'),
  consent: z.boolean().refine((v) => v, 'Please agree to this before we can book your appointment.'),
});

export type PatientFormValues = z.infer<typeof patientSchema>;

/** Fields validated when leaving step 4 (consent is checked on the review step). */
export const DETAIL_FIELDS = ['firstName', 'lastName', 'phone', 'email', 'symptoms'] as const;

export type StepErrorField = 'department' | 'doctor' | 'date' | 'time' | 'submit';
export type StepError = { field: StepErrorField; message: string } | null;
