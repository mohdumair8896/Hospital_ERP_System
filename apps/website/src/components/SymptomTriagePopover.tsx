'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Brain,
  Bone,
  Baby,
  Stethoscope,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  Phone,
  X,
  Sparkles,
  ShieldCheck,
  Award,
  HelpCircle,
  Activity
} from 'lucide-react';
import { DOCTORS, DEPARTMENTS } from '../data/hospitalData';

export interface SymptomTriagePopoverProps {
  onScheduleDirectly?: (doctorId: string, departmentId: string, symptomsText: string) => void;
}

type TriageCategory = 'CARDIOLOGY' | 'NEUROLOGY' | 'ORTHOPEDICS' | 'PEDIATRICS' | 'GENERAL' | 'GASTROENTEROLOGY';

interface SymptomOption {
  id: TriageCategory;
  title: string;
  subtitle: string;
  icon: any;
  accentColor: string;
  deptId: string;
  matchedDocId: string;
  commonSymptoms: string[];
}

const SYMPTOM_OPTIONS: SymptomOption[] = [
  {
    id: 'CARDIOLOGY',
    title: 'Chest, Heart & Blood Pressure',
    subtitle: 'Chest discomfort, palpitations, hypertension, shortness of breath',
    icon: Heart,
    accentColor: 'from-rose-500 to-red-600',
    deptId: 'dept_card',
    matchedDocId: 'doc_sarah',
    commonSymptoms: [
      'Chest tightness or squeezing sensation',
      'Irregular or racing heartbeat (palpitations)',
      'Shortness of breath during mild exertion',
      'Uncontrolled high blood pressure',
      'Swelling in ankles or lower legs'
    ]
  },
  {
    id: 'NEUROLOGY',
    title: 'Brain, Nerves & Headaches',
    subtitle: 'Severe migraines, dizziness, numbness, tremors, memory issues',
    icon: Brain,
    accentColor: 'from-purple-500 to-indigo-600',
    deptId: 'dept_neuro',
    matchedDocId: 'doc_elena',
    commonSymptoms: [
      'Severe or recurring throbbing headaches / migraines',
      'Tingling, numbness, or loss of sensation in limbs',
      'Persistent dizziness, vertigo, or loss of balance',
      'Unexplained tremors, muscle twitches, or stiffness',
      'Cognitive brain fog, confusion, or memory lapses'
    ]
  },
  {
    id: 'ORTHOPEDICS',
    title: 'Bones, Joints & Spine',
    subtitle: 'Joint pain, sports injuries, back stiffness, fractures',
    icon: Bone,
    accentColor: 'from-amber-500 to-orange-600',
    deptId: 'dept_ortho',
    matchedDocId: 'doc_james',
    commonSymptoms: [
      'Knee, hip, or shoulder chronic pain / osteoarthritis',
      'Persistent lower back pain or sciatica radiating down leg',
      'Acute sports injury, ligament sprain, or joint swelling',
      'Difficulty walking, bearing weight, or stiffness in morning',
      'Joint locking, instability, or clicking with motion'
    ]
  },
  {
    id: 'PEDIATRICS',
    title: 'Child, Infant & Newborn Care',
    subtitle: 'Pediatric fever, newborn wellness, cough, infant feeding',
    icon: Baby,
    accentColor: 'from-sky-500 to-blue-600',
    deptId: 'dept_peds',
    matchedDocId: 'doc_marcus',
    commonSymptoms: [
      'High child fever, persistent cough, or wheezing',
      'Infant poor feeding, colic, or excessive crying',
      'Developmental milestones, growth, or nutrition review',
      'Skin rash, earache, or pediatric sore throat',
      'Routine vaccination & well-child pediatric checkup'
    ]
  },
  {
    id: 'GENERAL',
    title: 'General Health & Preventive Checkup',
    subtitle: 'Fatigue, mild fever, routine blood work, medication review',
    icon: Stethoscope,
    accentColor: 'from-emerald-500 to-teal-600',
    deptId: 'dept_card',
    matchedDocId: 'doc_sarah',
    commonSymptoms: [
      'Persistent unexplained fatigue or generalized malaise',
      'Mild fever, sore throat, or seasonal cold symptoms',
      'Routine annual executive health evaluation',
      'Prescription refill & chronic care monitoring',
      'Pre-operative medical clearance assessment'
    ]
  },
  {
    id: 'GASTROENTEROLOGY',
    title: 'Digestive, Stomach & Liver',
    subtitle: 'Acid reflux, abdominal pain, digestive discomfort, liver health',
    icon: Activity,
    accentColor: 'from-teal-500 to-emerald-600',
    deptId: 'dept_card',
    matchedDocId: 'doc_sarah',
    commonSymptoms: [
      'Persistent acid reflux, heartburn, or GERD',
      'Upper or lower abdominal cramping, bloating, or pain',
      'Chronic indigestion, nausea, or appetite changes',
      'Irregular bowel habits or unexplained weight loss',
      'Preventive endoscopic / gastrointestinal checkup'
    ]
  }
];

export default function SymptomTriagePopover({ onScheduleDirectly }: SymptomTriagePopoverProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [showNotificationBadge, setShowNotificationBadge] = useState(true);

  // Questionnaire state
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<TriageCategory | null>(null);
  const [hasRedFlags, setHasRedFlags] = useState<boolean>(false);
  const [duration, setDuration] = useState<string>('2_to_7_days');
  const [severity, setSeverity] = useState<number>(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [customNotes, setCustomNotes] = useState<string>('');

  // Auto-prompt subtle invitation on initial visit after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasPrompted && !isOpen) {
        setHasPrompted(true);
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, [hasPrompted, isOpen]);

  const activeOption = SYMPTOM_OPTIONS.find((opt) => opt.id === selectedCategory);
  const matchedDoctor = activeOption ? DOCTORS.find((d) => d.id === activeOption.matchedDocId) : null;
  const matchedDept = activeOption ? DEPARTMENTS.find((d) => d.id === activeOption.deptId) : null;

  const handleSelectCategory = (cat: TriageCategory) => {
    setSelectedCategory(cat);
    setSelectedSymptoms([]);
    setStep(2);
  };

  const toggleSymptom = (sym: string) => {
    if (selectedSymptoms.includes(sym)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== sym));
    } else {
      setSelectedSymptoms([...selectedSymptoms, sym]);
    }
  };

  const handleProceedToMatch = () => {
    setStep(4);
  };

  const handleBookAppointment = () => {
    if (!matchedDoctor || !matchedDept) return;

    const reasonsList = [
      ...selectedSymptoms,
      customNotes.trim() ? `Notes: ${customNotes.trim()}` : '',
      `Duration: ${duration.replace(/_/g, ' ')}`,
      `Severity: ${severity}/10`
    ].filter(Boolean).join(' • ');

    if (onScheduleDirectly) {
      onScheduleDirectly(matchedDoctor.id, matchedDept.id, reasonsList);
      setIsOpen(false);
    } else {
      const url = `/appointments?dept=${matchedDept.id}&doc=${matchedDoctor.id}&reason=${encodeURIComponent(
        reasonsList
      )}`;
      router.push(url);
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSelectedCategory(null);
    setHasRedFlags(false);
    setSelectedSymptoms([]);
    setCustomNotes('');
    setSeverity(5);
  };

  return (
    <>
      {/* Floating Widget Trigger on Bottom-Right */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
        {/* Subtle Welcome Balloon on First Visit */}
        {hasPrompted && !isOpen && (
          <div className="bg-white rounded-2xl shadow-xl border border-sky-100 p-4 max-w-xs animate-in fade-in slide-in-from-bottom-3 duration-300 relative">
            <button
              onClick={() => setHasPrompted(false)}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Close tip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">Unsure which doctor to see?</h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Take our 60-second symptom questionnaire to match with the right board-certified specialist.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(true);
                    setHasPrompted(false);
                  }}
                  className="mt-2 text-xs font-bold text-[#1F5084] hover:text-[#164273] inline-flex items-center gap-1 group"
                >
                  <span>Start Free Symptom Check</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Persistent Floating Button */}
        <button
          onClick={() => {
            setIsOpen(true);
            setHasPrompted(false);
            setShowNotificationBadge(false);
          }}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-[#1F5084] to-[#2B78C6] hover:from-[#164273] hover:to-[#1F5084] text-white px-4 py-3 rounded-full shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all active:scale-95 border border-white/20"
          aria-label="Open Symptom Questionnaire & Doctor Matcher"
        >
          <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
            <Stethoscope className="w-4 h-4 text-sky-200" />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-[10px] uppercase font-bold tracking-wider text-sky-200 leading-tight">
              Clinical Triage
            </div>
            <div className="text-xs font-extrabold leading-tight">Symptom Checker</div>
          </div>
          {showNotificationBadge && (
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping absolute -top-1 -right-1" />
          )}
        </button>
      </div>

      {/* Main Questionnaire Modal Popover */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#1F5084] via-[#24629e] to-[#2B78C6] p-5 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-sky-200 border border-white/20 shadow-inner">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full text-sky-100">
                      Step {step} of 4
                    </span>
                    <span className="text-xs text-sky-200">• Intelligent Specialist Triage</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-extrabold text-white">
                    {step === 1 && 'What medical symptoms are you experiencing?'}
                    {step === 2 && 'Emergency Red-Flag Check'}
                    {step === 3 && 'Duration, Severity & Details'}
                    {step === 4 && 'Your Recommended Doctor & Department'}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 shrink-0">
              <div
                className="bg-[#2B78C6] h-1.5 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* STEP 1: Select Chief Medical Domain */}
              {step === 1 && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Select the category that best describes your primary health concern. We will guide you through diagnostic questions to pair you with an accredited specialist.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {SYMPTOM_OPTIONS.map((opt) => {
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.id}
                          onClick={() => handleSelectCategory(opt.id)}
                          className="text-left p-4 rounded-2xl border border-slate-200 hover:border-[#1F5084] hover:shadow-md transition-all group bg-white hover:bg-sky-50/40 relative overflow-hidden"
                        >
                          <div className="flex items-start gap-3.5">
                            <div
                              className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${opt.accentColor} text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#1F5084] transition-colors">
                                {opt.title}
                              </h4>
                              <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                                {opt.subtitle}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Emergency Red Flag Detection */}
              {step === 2 && activeOption && (
                <div className="space-y-5">
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs text-amber-900">
                      <span className="font-bold block">Patient Safety First</span>
                      <p className="leading-relaxed">
                        Before recommending an outpatient appointment, we must ensure you do not have acute symptoms that require immediate Emergency Room attention.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-900 block">
                      Are you currently experiencing any of the following acute symptoms?
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span>Crushing chest pain radiating to the left arm, neck, or jaw</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span>Sudden facial drooping, arm weakness, or slurred speech (Stroke Signs)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span>Severe acute shortness of breath or inability to speak full sentences</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                        <span>Sudden fainting, loss of consciousness, or severe head trauma</span>
                      </li>
                    </ul>

                    {/* Radio Choice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => setHasRedFlags(false)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                          !hasRedFlags
                            ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-2 ring-emerald-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold">No Acute Red Flags</div>
                          <div className="text-[11px] text-slate-500">My symptoms are stable for outpatient consult</div>
                        </div>
                        {!hasRedFlags && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>

                      <button
                        onClick={() => setHasRedFlags(true)}
                        className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                          hasRedFlags
                            ? 'border-red-500 bg-red-50/50 text-red-950 ring-2 ring-red-500/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-red-700">Yes, I Have Severe Symptoms</div>
                          <div className="text-[11px] text-slate-500">I require emergency medical triage</div>
                        </div>
                        {hasRedFlags && <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />}
                      </button>
                    </div>
                  </div>

                  {/* Red Flag Alert Mode */}
                  {hasRedFlags && (
                    <div className="p-5 rounded-2xl bg-red-600 text-white space-y-3 animate-in fade-in duration-200 shadow-lg">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
                        <span>CRITICAL MEDICAL ALERT: IMMEDIATE ACTION REQUIRED</span>
                      </div>
                      <p className="text-xs leading-relaxed text-red-100">
                        Based on your reported symptoms, you should not wait for an outpatient appointment. Please call our 24/7 Level 1 Trauma Center immediately or proceed directly to the Emergency Room.
                      </p>
                      <div className="flex flex-wrap gap-3 pt-2">
                        <a
                          href="tel:876256876"
                          className="bg-white text-red-700 hover:bg-red-50 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Ambulance Hotline: 876-256-876</span>
                        </a>
                        <Link
                          href="/contact"
                          onClick={() => setIsOpen(false)}
                          className="bg-red-700/80 hover:bg-red-800 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-white/20 transition-colors"
                        >
                          Emergency Room Directions
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Duration, Severity & Specific Symptoms */}
              {step === 3 && activeOption && (
                <div className="space-y-5">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block mb-2">
                      Select all symptoms that apply to you:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeOption.commonSymptoms.map((sym) => {
                        const isSelected = selectedSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            onClick={() => toggleSymptom(sym)}
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all text-left border ${
                              isSelected
                                ? 'bg-[#1F5084] text-white border-[#1F5084] shadow-sm'
                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    {/* Duration */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-900 block">
                        How long have you had these symptoms?
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full text-xs font-medium bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F5084]/20"
                      >
                        <option value="under_24_hours">&lt; 24 Hours (Sudden onset)</option>
                        <option value="2_to_7_days">2 – 7 Days (Recent)</option>
                        <option value="1_to_4_weeks">1 – 4 Weeks (Ongoing)</option>
                        <option value="chronic_month">&gt; 1 Month (Chronic)</option>
                      </select>
                    </div>

                    {/* Severity Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs">
                        <span className="font-bold text-slate-900">Discomfort Severity:</span>
                        <span className="font-bold text-[#1F5084]">{severity}/10</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={severity}
                        onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#1F5084]"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>1 (Mild)</span>
                        <span>5 (Moderate)</span>
                        <span>10 (Severe)</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Notes */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-bold text-slate-900 block">
                      Additional Details / Medical History (Optional):
                    </label>
                    <textarea
                      value={customNotes}
                      onChange={(e) => setCustomNotes(e.target.value)}
                      placeholder="e.g. Previous cardiac stent, taking blood pressure medication, symptoms worse in the morning..."
                      rows={2}
                      className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1F5084]/20"
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: Doctor & Department Recommendation */}
              {step === 4 && activeOption && matchedDoctor && matchedDept && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Algorithmic Match Banner */}
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-extrabold text-emerald-950">
                          Clinical Match Found (98% Relevance)
                        </div>
                        <div className="text-[11px] text-emerald-800">
                          Based on your symptom inputs, we recommend an outpatient consult with:
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full border border-emerald-300 shrink-0">
                      Accredited Specialist
                    </span>
                  </div>

                  {/* Recommended Doctor Card */}
                  <div className="border border-slate-200 rounded-2xl p-5 bg-gradient-to-br from-white via-sky-50/20 to-white shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <img
                        src={matchedDoctor.avatarUrl}
                        alt={matchedDoctor.name}
                        className="w-16 h-16 rounded-2xl object-cover shadow-sm border border-slate-200 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-[#1F5084] bg-sky-100/80 px-2 py-0.5 rounded-full border border-sky-200">
                            {matchedDept.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            ★ {matchedDoctor.rating} ({matchedDoctor.reviewCount} reviews)
                          </span>
                        </div>
                        <h4 className="text-base font-extrabold text-slate-900">{matchedDoctor.title}</h4>
                        <p className="text-xs text-slate-600 font-medium">{matchedDoctor.specialty}</p>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 pt-3 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Experience:</span>
                        <span className="font-bold text-slate-800">{matchedDoctor.experienceYears} Years</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Next Available:</span>
                        <span className="font-bold text-emerald-700">
                          {matchedDoctor.availableDays[0]} at {matchedDoctor.availableSlots[0]}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Consultation Fee:</span>
                        <span className="font-bold text-slate-800">${matchedDoctor.consultationFee}</span>
                      </div>
                    </div>

                    {/* Clinical Rationale Note */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800 block mb-0.5">Clinical Care Plan:</span>
                      {matchedDoctor.bio.slice(0, 160)}...
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleBookAppointment}
                      className="flex-1 bg-gradient-to-r from-[#1F5084] to-[#2B78C6] hover:from-[#164273] hover:to-[#1F5084] text-white py-3.5 px-6 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-xl transition-all active:scale-[0.98]"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Schedule Consult with {matchedDoctor.name}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 py-3.5 px-5 rounded-2xl font-bold text-xs transition-colors border border-slate-200"
                    >
                      Retake Check
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            {step < 4 && (
              <div className="bg-slate-50 p-4 border-t border-slate-100 flex items-center justify-between shrink-0">
                {step > 1 ? (
                  <button
                    onClick={() => setStep((step - 1) as any)}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 rounded-xl hover:bg-slate-200/60"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  {step === 2 && !hasRedFlags && (
                    <button
                      onClick={() => setStep(3)}
                      className="bg-[#1F5084] hover:bg-[#164273] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Continue Assessment</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {step === 3 && (
                    <button
                      onClick={handleProceedToMatch}
                      className="bg-[#1F5084] hover:bg-[#164273] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
                    >
                      <span>Find Matching Specialist</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
