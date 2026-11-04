'use client';

import React, { useState } from 'react';
import TopEmergencyBar from '../components/TopEmergencyBar';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import StatsAndTrust from '../components/StatsAndTrust';
import DepartmentsShowcase from '../components/DepartmentsShowcase';
import DoctorDirectory from '../components/DoctorDirectory';
import AppointmentSection from '../components/AppointmentSection';
import PatientReviews from '../components/PatientReviews';
import FAQSection from '../components/FAQSection';
import HealthInsights from '../components/HealthInsights';
import EmergencyBanner from '../components/EmergencyBanner';
import Footer from '../components/Footer';
import EmergencyFAB from '../components/EmergencyFAB';
import AppointmentBookingModal from '../components/AppointmentBookingModal';
import SymptomTriagePopover from '../components/SymptomTriagePopover';

export default function HomePage() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>(undefined);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string | undefined>(undefined);
  const [triageReason, setTriageReason] = useState<string | undefined>(undefined);

  const handleOpenBooking = () => {
    setSelectedDoctorId(undefined);
    setSelectedDepartmentId(undefined);
    setTriageReason(undefined);
    setBookingOpen(true);
  };

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDepartmentId(undefined);
    setTriageReason(undefined);
    setBookingOpen(true);
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setSelectedDoctorId(undefined);
    setTriageReason(undefined);
    setBookingOpen(true);
  };

  const handleScheduleFromTriage = (doctorId: string, departmentId: string, symptomsText: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDepartmentId(departmentId);
    setTriageReason(symptomsText);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Top Emergency Bar */}
      <TopEmergencyBar />

      {/* 2. Sticky navigation: condenses into a pill after 80px; full-screen menu below 1280px */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* 3. Hero: staggered headline, next-available-appointment card, feature cards */}
      <HeroSection onOpenBooking={handleOpenBooking} />

      {/* 4. About, count-up stats and awards grid (py-section) */}
      <StatsAndTrust />

      {/* 5. Departments: tabbed split card, one pastel per department (py-section) */}
      <DepartmentsShowcase onSelectDepartment={handleSelectDepartment} />

      {/* 6. Doctor directory: animated specialty filter and card grid (py-section) */}
      <DoctorDirectory onSelectDoctor={handleSelectDoctor} />

      {/* 7. In-Page Appointment Booking Form with 24/7 Emergency Hotline */}
      <AppointmentSection />

      {/* 8. Verified Patient Testimonials with Interactive Avatar Selector */}
      <PatientReviews />

      {/* 9. Frequently Asked Questions (FAQ) Accordion */}
      <FAQSection />

      {/* 10. Medical Insights & Health Articles Blog */}
      <HealthInsights />

      {/* 11. Emergency callout: never wrapped in a reveal, the number shows on first paint */}
      <EmergencyBanner onOpenBooking={handleOpenBooking} />

      {/* 12. 4-Column ProHealth Navy Footer with Newsletter & Back-to-Top */}
      <Footer />

      {/* 13. Floating Emergency Ambulance FAB */}
      <EmergencyFAB />

      {/* 14. Interactive Symptom Triage Questionnaire Popover & Doctor Matcher */}
      <SymptomTriagePopover onScheduleDirectly={handleScheduleFromTriage} />

      {/* 15. 5-Step Progressive Disclosure Modal Booking Flow */}
      <AppointmentBookingModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
        preselectedDoctorId={selectedDoctorId}
        preselectedDepartmentId={selectedDepartmentId}
        initialSymptoms={triageReason}
      />
    </main>
  );
}

