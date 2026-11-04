'use client';

import { useEffect, useState } from 'react';
import type { Department, Doctor } from '@hospital/contracts';
import { API_BASE_URL } from '@/lib/api';
import { DEPARTMENTS, DOCTORS } from '@/data/hospitalData';
import { FALLBACK_DEPARTMENTS, FALLBACK_DOCTORS } from './fallbackData';

export type LoadState<T> = { items: T[]; loading: boolean; fromFallback: boolean };

type Loaded = { items: unknown[]; fromFallback: boolean };
const requests = new Map<string, Promise<Loaded>>();

/**
 * Fetch a list endpoint once per page session (shared by every section that
 * asks for it). A non-2xx response, bad JSON or an empty list falls back to
 * the bundled data, and a failure is not cached so the next mount retries.
 */
function loadList(path: string, fallback: unknown[]): Promise<Loaded> {
  const cached = requests.get(path);
  if (cached) return cached;
  const request = fetch(`${API_BASE_URL}${path}`)
    .then(async (res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: unknown = await res.json();
      if (!Array.isArray(json) || json.length === 0) throw new Error('Empty list');
      return { items: json, fromFallback: false };
    })
    .catch(() => {
      requests.delete(path);
      return { items: fallback, fromFallback: true };
    });
  requests.set(path, request);
  return request;
}

function useList<T>(path: string, fallback: T[]): LoadState<T> {
  const [state, setState] = useState<LoadState<T>>({ items: [], loading: true, fromFallback: false });
  useEffect(() => {
    let active = true;
    loadList(path, fallback).then(({ items, fromFallback }) => {
      if (active) setState({ items: items as T[], loading: false, fromFallback });
    });
    return () => {
      active = false;
    };
  }, [path, fallback]);
  return state;
}

export const useDepartments = () => useList<Department>('/api/v1/appointments/departments', FALLBACK_DEPARTMENTS);
export const useDoctors = () => useList<Doctor>('/api/v1/appointments/doctors', FALLBACK_DOCTORS);

/* ------------------------------------------------------------------ */
/* Links: backend IDs differ from the static page IDs, so map them.    */
/* ------------------------------------------------------------------ */

const STATIC_DEPT_BY_CODE: Record<string, string> = {
  CARDIOLOGY: 'dept_card',
  NEUROLOGY: 'dept_neuro',
  PEDIATRICS: 'dept_peds',
  ORTHOPEDICS: 'dept_ortho',
  EMERGENCY: 'dept_emrg',
  GYNECOLOGY: 'dept_obgyn',
};

/** The static department page data for an API department, if a page exists. */
export function staticDepartmentFor(dept: Pick<Department, 'id' | 'code'>) {
  const id = STATIC_DEPT_BY_CODE[dept.code] ?? dept.id;
  return DEPARTMENTS.find((d) => d.id === id);
}

/** `/departments/<id>` when that page exists, otherwise the departments index. */
export function departmentHref(dept: Pick<Department, 'id' | 'code'>) {
  const match = staticDepartmentFor(dept);
  return match ? `/departments/${match.id}` : '/departments';
}

/**
 * `/doctors/<id>` only when a static profile exists for the same person (the
 * ID and the name must match), otherwise null so no misleading link is shown.
 */
export function doctorHref(doc: Pick<Doctor, 'id' | 'name'>) {
  const match = DOCTORS.find((d) => d.name === doc.name);
  return match ? `/doctors/${match.id}` : null;
}

/**
 * Photo for a doctor: the profile page's photo when one exists (so the card
 * matches the page it links to, and avoids a dead API image URL), else the
 * API's `avatarUrl`.
 */
export function doctorPhoto(doc: Pick<Doctor, 'name' | 'avatarUrl'>) {
  return DOCTORS.find((d) => d.name === doc.name)?.avatarUrl ?? doc.avatarUrl;
}

/* ------------------------------------------------------------------ */
/* Next open appointment, computed from the published OPD schedule.    */
/* ------------------------------------------------------------------ */

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** "09:30 AM" -> minutes after midnight, or null for text like "24 Hours On-Call". */
function slotMinutes(slot: string): number | null {
  const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(slot.trim());
  if (!m) return null;
  let hours = Number(m[1]) % 12;
  if (m[3].toUpperCase() === 'PM') hours += 12;
  return hours * 60 + Number(m[2]);
}

export type NextOpening = { doctor: Doctor; slot: string; at: Date; dayOffset: number };

/**
 * Earliest published OPD slot across all doctors, at least `leadMinutes` from
 * now, looking up to a week ahead. It reflects the published timetable, not
 * live bookings, and the UI says so.
 */
export function findNextOpening(doctors: Doctor[], now: Date, leadMinutes = 30): NextOpening | null {
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (let offset = 0; offset < 8; offset++) {
    const dayName = DAY_NAMES[(now.getDay() + offset) % 7];
    let best: NextOpening | null = null;
    for (const doctor of doctors) {
      if (!doctor.availableDays?.includes(dayName)) continue;
      for (const slot of doctor.availableSlots ?? []) {
        const minutes = slotMinutes(slot);
        if (minutes === null) continue;
        if (offset === 0 && minutes < nowMinutes + leadMinutes) continue;
        const at = new Date(now);
        at.setDate(now.getDate() + offset);
        at.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
        if (!best || at < best.at) best = { doctor, slot, at, dayOffset: offset };
      }
    }
    if (best) return best;
  }
  return null;
}

/** "in 45 min", "in 2 h 10 min", or null when it is more than 12 hours away. */
export function formatWait(from: Date, to: Date): string | null {
  const minutes = Math.max(0, Math.round((to.getTime() - from.getTime()) / 60000));
  if (minutes > 12 * 60) return null;
  if (minutes < 60) return `in ${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `in ${h} h ${m} min` : `in ${h} h`;
}

/** "Today", "Tomorrow" or the weekday name. */
export function dayLabel(opening: NextOpening) {
  if (opening.dayOffset === 0) return 'Today';
  if (opening.dayOffset === 1) return 'Tomorrow';
  return DAY_NAMES[opening.at.getDay()];
}
