'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Doctor } from '@hospital/contracts';
import { Star, Calendar, Clock, ArrowRight, Award, Stethoscope } from 'lucide-react';

interface DoctorDirectoryProps {
  onSelectDoctor: (doctorId: string) => void;
}

export default function DoctorDirectory({ onSelectDoctor }: DoctorDirectoryProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredSpecialty, setFilteredSpecialty] = useState<string>('ALL');

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/appointments/doctors')
      .then(res => res.json())
      .then(data => setDoctors(data))
      .catch(() => {
        // Fallback
        setDoctors([
          {
            id: 'doc_sarah',
            name: 'Dr. Sarah Patel',
            title: 'Dr. Sarah Patel, MD, FACC',
            specialty: 'Cardiologist',
            departmentId: 'dept_card',
            qualification: 'MD (Harvard), Fellowship Interventional Cardiology',
            experienceYears: 16,
            rating: 4.96,
            reviewCount: 248,
            consultationFee: 150,
            availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            availableSlots: ['09:00 AM', '10:30 AM', '02:00 PM'],
            avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=400',
            bio: 'World-renowned interventional cardiologist specializing in coronary artery disease and non-invasive valve repair.',
            phone: '+1 (555) 123-4567',
            email: 'sarah.patel@hospital.com'
          },
          {
            id: 'doc_michael',
            name: 'Dr. Michael Chang',
            title: 'Dr. Michael Chang, MD, FAAP',
            specialty: 'Pediatric Specialist',
            departmentId: 'dept_ped',
            qualification: 'MD (Stanford), Board Certified Pediatrician',
            experienceYears: 12,
            rating: 4.92,
            reviewCount: 194,
            consultationFee: 120,
            availableDays: ['Monday', 'Wednesday', 'Friday', 'Saturday'],
            availableSlots: ['09:30 AM', '11:00 AM', '03:00 PM'],
            avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400',
            bio: 'Whole-child pediatric specialist dedicated to compassionate care from infancy to adolescence.',
            phone: '+1 (555) 234-5678',
            email: 'michael.chang@hospital.com'
          },
          {
            id: 'doc_elena',
            name: 'Dr. Elena Rostova',
            title: 'Dr. Elena Rostova, MD, PhD',
            specialty: 'Senior Neurologist',
            departmentId: 'dept_neur',
            qualification: 'MD, PhD in Neurobiology (Columbia University)',
            experienceYears: 19,
            rating: 4.98,
            reviewCount: 312,
            consultationFee: 180,
            availableDays: ['Tuesday', 'Wednesday', 'Thursday'],
            availableSlots: ['10:00 AM', '11:30 AM', '02:30 PM'],
            avatarUrl: 'https://images.unsplash.com/photo-1594824813576-a364802c63ef?auto=format&fit=crop&q=80&w=400',
            bio: 'Expert in cerebrovascular stroke rehabilitation and complex neuro-degenerative disorders.',
            phone: '+1 (555) 345-6789',
            email: 'elena.rostova@hospital.com'
          },
          {
            id: 'doc_david',
            name: 'Dr. David Rodriguez',
            title: 'Dr. David Rodriguez, MD, FACS',
            specialty: 'Orthopedic Surgeon',
            departmentId: 'dept_orth',
            qualification: 'MD (UCLA), Sports Medicine Fellowship (Cedars-Sinai)',
            experienceYears: 14,
            rating: 4.89,
            reviewCount: 180,
            consultationFee: 160,
            availableDays: ['Monday', 'Tuesday', 'Friday'],
            availableSlots: ['08:30 AM', '10:00 AM', '01:00 PM'],
            avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=400',
            bio: 'Specialist in minimally invasive joint preservation and rapid-recovery robotic arthroplasty.',
            phone: '+1 (555) 456-7890',
            email: 'david.rodriguez@hospital.com'
          }
        ]);
      });
  }, []);

  const specialties = ['ALL', ...Array.from(new Set(doctors.map(d => d.specialty)))];

  const displayedDoctors = filteredSpecialty === 'ALL'
    ? doctors
    : doctors.filter(d => d.specialty === filteredSpecialty);

  return (
    <section id="doctors" className="py-24 bg-prohealth-canvas">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 xl:px-20">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-prohealth-primary text-xs font-extrabold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>QUALIFIED PHYSICIANS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-prohealth-heading font-display">
            Meet Our Senior Medical Specialists
          </h2>
          <p className="text-sm sm:text-base text-prohealth-body mt-2">
            Our physicians are board-certified leaders recognized for clinical precision and compassionate patient outcomes.
          </p>

          {/* Specialty Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-8">
            {specialties.map(spec => (
              <button
                key={spec}
                onClick={() => setFilteredSpecialty(spec)}
                className={`text-xs font-bold px-5 py-2.5 rounded-full transition-all ${
                  filteredSpecialty === spec
                    ? 'bg-prohealth-primary text-white shadow-md shadow-prohealth-primary/20'
                    : 'bg-white text-slate-600 hover:bg-prohealth-ice hover:text-prohealth-primary border border-slate-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedDoctors.map(doc => (
            <div
              key={doc.id}
              className="prohealth-card bg-white overflow-hidden transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Rating Badge */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 text-xs font-bold text-amber-500">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({doc.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm text-prohealth-primary text-[11px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {doc.specialty}
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-3">
                  <div>
                    <h3 className="text-base font-bold text-prohealth-heading group-hover:text-prohealth-primary transition-colors">
                      <Link href={`/doctors/${doc.id}`}>
                        {doc.name}
                      </Link>
                    </h3>
                    <p className="text-[11px] text-prohealth-muted font-medium line-clamp-1">{doc.qualification}</p>
                  </div>

                  <p className="text-xs text-prohealth-body line-clamp-2 leading-relaxed">
                    {doc.bio}
                  </p>

                  <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-3 h-3 text-prohealth-secondary" />
                      <span>{doc.experienceYears} Years Clinical Practice</span>
                    </div>
                    <div className="text-[11px] font-semibold text-slate-700">
                      Consultation: <span className="text-prohealth-primary font-bold">${doc.consultationFee}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => onSelectDoctor(doc.id)}
                  className="w-full flex items-center justify-center gap-2 bg-prohealth-primary hover:bg-prohealth-primary-hover text-white font-bold py-2.5 px-4 rounded-full text-xs shadow-md shadow-prohealth-primary/20 hover:shadow-lg transition-all active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Appointment</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

