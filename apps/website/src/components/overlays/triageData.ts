import { Activity, Baby, Bone, Brain, Heart, Stethoscope, type LucideIcon } from 'lucide-react';

export type TriageCategory = 'CARDIOLOGY' | 'NEUROLOGY' | 'ORTHOPEDICS' | 'PEDIATRICS' | 'GENERAL' | 'GASTROENTEROLOGY';

export type TriageStep = 1 | 2 | 3 | 4;

/** Department pastel from the shared preset (dept-{tone}-bg / dept-{tone}-fg). */
export type TriageTone = 'blue' | 'green' | 'amber' | 'rose';

export interface SymptomOption {
  id: TriageCategory;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  tone: TriageTone;
  deptId: string;
  matchedDocId: string;
  commonSymptoms: string[];
}

/** Icon tile classes per tone; every fg/bg pair passes WCAG AA. */
export const TONE_TILE: Record<TriageTone, string> = {
  blue: 'bg-dept-blue-bg text-dept-blue-fg',
  green: 'bg-dept-green-bg text-dept-green-fg',
  amber: 'bg-dept-amber-bg text-dept-amber-fg',
  rose: 'bg-dept-rose-bg text-dept-rose-fg',
};

export const STEP_TITLES: Record<TriageStep, string> = {
  1: 'What medical symptoms are you experiencing?',
  2: 'Emergency Red-Flag Check',
  3: 'Duration, Severity & Details',
  4: 'Your Recommended Doctor & Department',
};

/** Short names for the progress indicator. */
export const STEP_LABELS: Record<TriageStep, string> = {
  1: 'Concern',
  2: 'Safety',
  3: 'Details',
  4: 'Match',
};

export const DURATION_OPTIONS = [
  { value: 'under_24_hours', label: '< 24 Hours (Sudden onset)' },
  { value: '2_to_7_days', label: '2 – 7 Days (Recent)' },
  { value: '1_to_4_weeks', label: '1 – 4 Weeks (Ongoing)' },
  { value: 'chronic_month', label: '> 1 Month (Chronic)' },
] as const;

export const RED_FLAG_SIGNS = [
  'Crushing chest pain radiating to the left arm, neck, or jaw',
  'Sudden facial drooping, arm weakness, or slurred speech (Stroke Signs)',
  'Severe acute shortness of breath or inability to speak full sentences',
  'Sudden fainting, loss of consciousness, or severe head trauma',
];

export const SYMPTOM_OPTIONS: SymptomOption[] = [
  {
    id: 'CARDIOLOGY',
    title: 'Chest, Heart & Blood Pressure',
    subtitle: 'Chest discomfort, palpitations, hypertension, shortness of breath',
    icon: Heart,
    tone: 'rose',
    deptId: 'dept_card',
    matchedDocId: 'doc_sarah',
    commonSymptoms: [
      'Chest tightness or squeezing sensation',
      'Irregular or racing heartbeat (palpitations)',
      'Shortness of breath during mild exertion',
      'Uncontrolled high blood pressure',
      'Swelling in ankles or lower legs',
    ],
  },
  {
    id: 'NEUROLOGY',
    title: 'Brain, Nerves & Headaches',
    subtitle: 'Severe migraines, dizziness, numbness, tremors, memory issues',
    icon: Brain,
    tone: 'blue',
    deptId: 'dept_neuro',
    matchedDocId: 'doc_elena',
    commonSymptoms: [
      'Severe or recurring throbbing headaches / migraines',
      'Tingling, numbness, or loss of sensation in limbs',
      'Persistent dizziness, vertigo, or loss of balance',
      'Unexplained tremors, muscle twitches, or stiffness',
      'Cognitive brain fog, confusion, or memory lapses',
    ],
  },
  {
    id: 'ORTHOPEDICS',
    title: 'Bones, Joints & Spine',
    subtitle: 'Joint pain, sports injuries, back stiffness, fractures',
    icon: Bone,
    tone: 'amber',
    deptId: 'dept_ortho',
    matchedDocId: 'doc_james',
    commonSymptoms: [
      'Knee, hip, or shoulder chronic pain / osteoarthritis',
      'Persistent lower back pain or sciatica radiating down leg',
      'Acute sports injury, ligament sprain, or joint swelling',
      'Difficulty walking, bearing weight, or stiffness in morning',
      'Joint locking, instability, or clicking with motion',
    ],
  },
  {
    id: 'PEDIATRICS',
    title: 'Child, Infant & Newborn Care',
    subtitle: 'Pediatric fever, newborn wellness, cough, infant feeding',
    icon: Baby,
    tone: 'blue',
    deptId: 'dept_peds',
    matchedDocId: 'doc_marcus',
    commonSymptoms: [
      'High child fever, persistent cough, or wheezing',
      'Infant poor feeding, colic, or excessive crying',
      'Developmental milestones, growth, or nutrition review',
      'Skin rash, earache, or pediatric sore throat',
      'Routine vaccination & well-child pediatric checkup',
    ],
  },
  {
    id: 'GENERAL',
    title: 'General Health & Preventive Checkup',
    subtitle: 'Fatigue, mild fever, routine blood work, medication review',
    icon: Stethoscope,
    tone: 'green',
    deptId: 'dept_card',
    matchedDocId: 'doc_sarah',
    commonSymptoms: [
      'Persistent unexplained fatigue or generalized malaise',
      'Mild fever, sore throat, or seasonal cold symptoms',
      'Routine annual executive health evaluation',
      'Prescription refill & chronic care monitoring',
      'Pre-operative medical clearance assessment',
    ],
  },
  {
    id: 'GASTROENTEROLOGY',
    title: 'Digestive, Stomach & Liver',
    subtitle: 'Acid reflux, abdominal pain, digestive discomfort, liver health',
    icon: Activity,
    tone: 'green',
    deptId: 'dept_card',
    matchedDocId: 'doc_sarah',
    commonSymptoms: [
      'Persistent acid reflux, heartburn, or GERD',
      'Upper or lower abdominal cramping, bloating, or pain',
      'Chronic indigestion, nausea, or appetite changes',
      'Irregular bowel habits or unexplained weight loss',
      'Preventive endoscopic / gastrointestinal checkup',
    ],
  },
];
