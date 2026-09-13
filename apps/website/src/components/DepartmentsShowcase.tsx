'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Department } from '@hospital/contracts';
import { 
  Flame, 
  HeartPulse, 
  Baby, 
  Brain, 
  HeartHandshake, 
  Bone, 
  Stethoscope, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface DepartmentsShowcaseProps {
  onSelectDepartment: (deptId: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Flame: <Flame className="w-6 h-6 text-red-500" />,
  HeartPulse: <HeartPulse className="w-6 h-6 text-rose-500" />,
  Baby: <Baby className="w-6 h-6 text-amber-500" />,
  Brain: <Brain className="w-6 h-6 text-indigo-500" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6 text-pink-500" />,
  Bone: <Bone className="w-6 h-6 text-sky-500" />,
};

export default function DepartmentsShowcase({ onSelectDepartment }: DepartmentsShowcaseProps) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/appointments/departments')
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback static data
        setDepartments([
          {
            id: 'dept_card',
            code: 'CARDIOLOGY',
            name: 'Cardiology & Heart Center',
            description: 'Comprehensive cardiovascular diagnostics, cath lab, interventional cardiology, and cardiac surgery.',
            location: 'Building B, 3rd Floor',
            emergencySupport: true,
            icon: 'HeartPulse'
          },
          {
            id: 'dept_emg',
            code: 'EMERGENCY',
            name: 'Emergency & Trauma Department',
            description: '24/7 acute emergency medical and surgical triage care with Level 1 trauma facilities.',
            location: 'Building A, Ground Floor',
            emergencySupport: true,
            icon: 'Flame'
          },
          {
            id: 'dept_ped',
            code: 'PEDIATRICS',
            name: 'Pediatrics & Neonatology',
            description: 'Child-centered healthcare from newborn care and immunizations to adolescent medicine.',
            location: 'Building C, 2nd Floor',
            emergencySupport: false,
            icon: 'Baby'
          },
          {
            id: 'dept_neur',
            code: 'NEUROLOGY',
            name: 'Neurology & Neurosurgery',
            description: 'Advanced brain and nervous system care, stroke unit, epilepsy management, and spinal surgery.',
            location: 'Building B, 4th Floor',
            emergencySupport: true,
            icon: 'Brain'
          },
          {
            id: 'dept_gyn',
            code: 'GYNECOLOGY',
            name: 'Gynecology & Obstetrics',
            description: 'Maternal health, prenatal care, high-risk pregnancy management, and minimally invasive surgery.',
            location: 'Building C, 3rd Floor',
            emergencySupport: true,
            icon: 'HeartHandshake'
          },
          {
            id: 'dept_orth',
            code: 'ORTHOPEDICS',
            name: 'Orthopedics & Joint Replacement',
            description: 'Specialized bone, joint, and sports injury recovery with robotic arthroplasty programs.',
            location: 'Building A, 2nd Floor',
            emergencySupport: false,
            icon: 'Bone'
          }
        ]);
        setLoading(false);
      });
  }, []);

  return (
    <section id="departments" className="py-24 bg-white">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        {/* Soft Ice-Blue Container Background */}
        <div className="bg-[#EAF2F9] rounded-3xl sm:rounded-4xl p-8 sm:p-14 lg:p-16 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-prohealth-primary text-xs font-extrabold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CENTERS OF EXCELLENCE</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
                Clinical Departments & Specialties
              </h2>
              <p className="text-sm sm:text-base text-prohealth-body mt-2 max-w-2xl">
                Equipped with modern diagnostic laboratories, hybrid surgical suites, and dedicated intensive care units.
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link
                href="/departments"
                className="inline-flex items-center gap-2 text-xs font-bold text-prohealth-primary hover:text-prohealth-secondary bg-white px-5 py-2.5 rounded-full shadow-sm border border-slate-200/80 transition-all hover:shadow"
              >
                <span>View All Departments</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Department Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const icon = iconMap[dept.icon] || <Stethoscope className="w-6 h-6 text-prohealth-primary" />;
              return (
                <div
                  key={dept.id}
                  className="prohealth-card bg-white p-7 transition-all duration-200 hover:shadow-prohealth-hover hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-prohealth-canvas border border-slate-100 flex items-center justify-center">
                        {icon}
                      </div>
                      {dept.emergencySupport && (
                        <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-red-50 text-red-600 border border-red-200">
                          24/7 Trauma
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-prohealth-heading hover:text-prohealth-primary transition-colors">
                      <Link href={`/departments/${dept.id}`}>
                        {dept.name}
                      </Link>
                    </h3>

                    <p className="text-xs text-prohealth-body mt-2 leading-relaxed">
                      {dept.description}
                    </p>

                    <div className="mt-4 text-[11px] font-medium text-slate-400">
                      📍 {dept.location}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between gap-3">
                    <Link
                      href={`/departments/${dept.id}`}
                      className="text-xs font-bold text-slate-600 hover:text-prohealth-primary transition-colors"
                    >
                      Read More →
                    </Link>

                    <button
                      onClick={() => onSelectDepartment(dept.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-prohealth-primary hover:text-white bg-prohealth-ice hover:bg-prohealth-primary px-4 py-2 rounded-full transition-all"
                    >
                      <span>Book OPD</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

