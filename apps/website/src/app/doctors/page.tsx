import React from 'react';
import type { Metadata } from 'next';
import { CalendarDays, CalendarPlus, Stethoscope } from 'lucide-react';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { HeaderAction, LISTING_CONTAINER, PageHeader } from '../../components/listing/PageHeader';
import { DoctorsExplorer } from '../../components/listing/doctors/DoctorsExplorer';

export const metadata: Metadata = {
  title: 'Find a Doctor',
  description:
    'Search ProHealth board-certified physicians by name, specialty or condition, see consultation fees and book an appointment online.',
};

export default function DoctorsDirectoryPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      <PageHeader
        breadcrumb={[{ label: 'Find a doctor' }]}
        eyebrow="Board-certified specialists"
        eyebrowIcon={Stethoscope}
        title="Find a physician or specialist"
        intro="Search our attending physicians by name, specialty or condition, compare experience and fees, and book a visit in a few steps."
        actions={
          <>
            <HeaderAction href="/appointments" icon={CalendarPlus}>
              Book an appointment
            </HeaderAction>
            <HeaderAction href="/timetable" icon={CalendarDays} variant="secondary">
              See the weekly timetable
            </HeaderAction>
          </>
        }
      />

      <main className="flex-1 bg-prohealth-canvas py-12 sm:py-16" aria-labelledby="doctors-heading">
        <div className={LISTING_CONTAINER}>
          <h2 id="doctors-heading" className="sr-only">
            Doctors
          </h2>
          <DoctorsExplorer />
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
