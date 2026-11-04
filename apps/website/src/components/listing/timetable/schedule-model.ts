import type { Department, Doctor } from '@hospital/contracts';
import { themeFor, type DeptTheme } from '@/components/sections/discovery/departmentThemes';

/** Week order for the tabs (Monday first). */
export const WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const;
export type Weekday = (typeof WEEK)[number];

/** JS getDay() index (0 = Sunday) -> weekday name. */
const BY_JS_DAY: Weekday[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const todayWeekday = (date = new Date()): Weekday => BY_JS_DAY[date.getDay()];

/**
 * OPD consulting rooms from the published timetable, keyed by doctor name
 * (doctor ids differ between the API and the bundled data). Doctors without
 * an entry show their department's location instead.
 */
const OPD_ROOMS: Record<string, string> = {
  'Dr. Sarah Patel': 'OPD Suite 302',
  'Dr. Michael Chang': 'OPD Suite 210',
  'Dr. Elena Rostova': 'OPD Suite 402',
  'Dr. David Rodriguez': 'OPD Suite 108',
};

/** "09:30 AM" -> minutes after midnight, or null for text such as "24 Hours On-Call". */
export function slotMinutes(slot: string): number | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
  if (!m) return null;
  let hours = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(m[2]);
}

export type Period = 'Morning' | 'Afternoon' | 'Evening';
const periodOf = (minutes: number): Period => (minutes < 12 * 60 ? 'Morning' : minutes < 17 * 60 ? 'Afternoon' : 'Evening');

export type SlotGroup = { period: Period; slots: string[] };

export type ScheduleRow = {
  doctor: Doctor;
  department?: Department;
  theme: DeptTheme;
  /** OPD room, or the department location when no room is published. */
  room?: string;
  location?: string;
  days: Weekday[];
  /** Bookable times, earliest first, grouped by part of the day. */
  groups: SlotGroup[];
  firstSlot: number;
};

/**
 * One row per doctor with at least one bookable OPD time. Doctors whose only
 * "slot" is text (the emergency on-call rota) are left out: emergency care is
 * walk-in and has no OPD timetable.
 */
export function buildRows(doctors: Doctor[], departments: Department[]): ScheduleRow[] {
  const rows: ScheduleRow[] = [];
  for (const doctor of doctors) {
    const timed = (doctor.availableSlots ?? [])
      .map((slot) => ({ slot, minutes: slotMinutes(slot) }))
      .filter((s): s is { slot: string; minutes: number } => s.minutes !== null)
      .sort((a, b) => a.minutes - b.minutes);
    const days = WEEK.filter((d) => doctor.availableDays?.includes(d));
    if (timed.length === 0 || days.length === 0) continue;

    const deptIndex = departments.findIndex((d) => d.id === doctor.departmentId);
    const department = deptIndex >= 0 ? departments[deptIndex] : undefined;
    const groups: SlotGroup[] = [];
    for (const { slot, minutes } of timed) {
      const period = periodOf(minutes);
      const group = groups.find((g) => g.period === period);
      if (group) group.slots.push(slot);
      else groups.push({ period, slots: [slot] });
    }

    rows.push({
      doctor,
      department,
      theme: themeFor(department?.code ?? '', department?.name ?? doctor.specialty, Math.max(deptIndex, 0)),
      room: OPD_ROOMS[doctor.name],
      location: department?.location,
      days,
      groups,
      firstSlot: timed[0].minutes,
    });
  }
  return rows.sort((a, b) => a.firstSlot - b.firstSlot || a.doctor.name.localeCompare(b.doctor.name));
}

/** Short label for a department chip ("Cardiology"). */
export const deptLabel = (dept: Department, index: number) => themeFor(dept.code, dept.name, index).label;
