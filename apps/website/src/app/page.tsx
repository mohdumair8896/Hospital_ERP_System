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

  const handleOpenBooking = () => {
    setSelectedDoctorId(undefined);
    setSelectedDepartmentId(undefined);
    setBookingOpen(true);
  };

  const handleSelectDoctor = (doctorId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDepartmentId(undefined);
    setBookingOpen(true);
  };

  const handleSelectDepartment = (deptId: string) => {
    setSelectedDepartmentId(deptId);
    setSelectedDoctorId(undefined);
    setBookingOpen(true);
  };

  const handleScheduleFromTriage = (doctorId: string, departmentId: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDepartmentId(departmentId);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Top Emergency Bar */}
      <TopEmergencyBar />

      {/* 2. Main Navigation with Search Modal & Sidebar Drawer */}
      <Navbar onOpenBooking={handleOpenBooking} />

      {/* 3. ProHealth Hero Section with 3 Feature Boxes & Social Proof Badges */}
      <HeroSection onOpenBooking={handleOpenBooking} />

      {/* 4. About ProHealth Section & 4 Quality Awards */}
      <StatsAndTrust />

      {/* 5. Clinical Departments in Ice-Blue Curved Container */}
      <DepartmentsShowcase onSelectDepartment={handleSelectDepartment} />

      {/* 6. Qualified Specialist Doctors Directory with Category Pills */}
      <DoctorDirectory onSelectDoctor={handleSelectDoctor} />

      {/* 7. In-Page Appointment Booking Form with 24/7 Emergency Hotline */}
      <AppointmentSection />

      {/* 8. Verified Patient Testimonials with Interactive Avatar Selector */}
      <PatientReviews />

      {/* 9. Frequently Asked Questions (FAQ) Accordion */}
      <FAQSection />

      {/* 10. Medical Insights & Health Articles Blog */}
      <HealthInsights />

      {/* 11. Full-width Emergency Ambulance Callout Banner */}
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
      />
    </main>
  );
}

