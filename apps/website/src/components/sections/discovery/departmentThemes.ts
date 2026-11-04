import type { LucideIcon } from 'lucide-react';
import { Ambulance, Baby, Bone, Brain, HeartHandshake, HeartPulse, Ribbon, Stethoscope } from 'lucide-react';

export type DeptTheme = {
  /** Short tab label. */
  label: string;
  /** Pastel panel background. */
  bg: string;
  /** AA text colour on that pastel (and on white). */
  fg: string;
  icon: LucideIcon;
  image: string;
  imageAlt: string;
};

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=80&w=1000`;

/** One pastel per department; every bg/fg pair passes WCAG AA for body text. */
const THEMES: Record<string, DeptTheme> = {
  CARDIOLOGY: {
    label: 'Cardiology',
    bg: 'bg-dept-rose-bg',
    fg: 'text-dept-rose-fg',
    icon: HeartPulse,
    image: img('1505751172876-fa1923c5c528'),
    imageAlt: 'Stethoscope resting on a clinic bed',
  },
  NEUROLOGY: {
    label: 'Neurology',
    bg: 'bg-dept-blue-bg',
    fg: 'text-dept-blue-fg',
    icon: Brain,
    image: img('1579684385127-1ef15d508118'),
    imageAlt: 'Surgical team leaning over a patient under theatre lights',
  },
  PEDIATRICS: {
    label: 'Pediatrics',
    bg: 'bg-dept-amber-bg',
    fg: 'text-dept-amber-fg',
    icon: Baby,
    image: img('1584515979956-d9f6e5d09982'),
    imageAlt: 'Clinician in gloves giving a vaccination',
  },
  ONCOLOGY: {
    label: 'Oncology',
    bg: 'bg-dept-green-bg',
    fg: 'text-dept-green-fg',
    icon: Ribbon,
    image: img('1576091160399-112ba8d25d1d'),
    imageAlt: 'Doctor with a stethoscope reviewing results on a phone',
  },
  ORTHOPEDICS: {
    label: 'Orthopedics',
    bg: 'bg-sand',
    fg: 'text-dept-blue-fg',
    icon: Bone,
    image: img('1516549655169-df83a0774514'),
    imageAlt: 'Modern operating room with surgical lights',
  },
  EMERGENCY: {
    label: 'Emergency',
    bg: 'bg-alert-soft',
    fg: 'text-alert',
    icon: Ambulance,
    image: img('1551076805-e1869033e561'),
    imageAlt: 'Equipped treatment room ready for a patient',
  },
  GYNECOLOGY: {
    label: 'Gynecology',
    bg: 'bg-dept-rose-bg',
    fg: 'text-dept-rose-fg',
    icon: HeartHandshake,
    image: img('1519494026892-80bbd2d6fd0d'),
    imageAlt: 'Bright hospital reception area',
  },
};

const CYCLE = [
  ['bg-dept-blue-bg', 'text-dept-blue-fg'],
  ['bg-dept-green-bg', 'text-dept-green-fg'],
  ['bg-dept-amber-bg', 'text-dept-amber-fg'],
  ['bg-dept-rose-bg', 'text-dept-rose-fg'],
];

/** Theme for a department code; unknown codes cycle through the four pastels. */
export function themeFor(code: string, name: string, index: number): DeptTheme {
  const known = THEMES[code];
  if (known) return known;
  const [bg, fg] = CYCLE[index % CYCLE.length];
  return {
    label: name.split('&')[0].trim(),
    bg,
    fg,
    icon: Stethoscope,
    image: img('1519494026892-80bbd2d6fd0d'),
    imageAlt: 'Bright hospital reception area',
  };
}
