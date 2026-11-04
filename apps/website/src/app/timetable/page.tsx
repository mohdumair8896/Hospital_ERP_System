import React from 'react';
import type { Metadata } from 'next';
import { CalendarClock, CalendarPlus, Phone } from 'lucide-react';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { HeaderAction, LISTING_CONTAINER, PageHeader } from '../../components/listing/PageHeader';
import { WeeklySchedule } from '../../components/listing/timetable/WeeklySchedule';

export const metadata: Metadata = {
  title: 'OPD Timetable & Doctor Schedules',
  description:
    'Weekly outpatient (OPD) clinic times for every ProHealth specialist. Pick a day, see each doctor’s room and times, and book a slot online.',
};

export default function TimetablePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      <PageHeader
        breadcrumb={[{ label: 'Timetable' }]}
        eyebrow="Clinic hours"
        eyebrowIcon={CalendarClock}
        title="Weekly OPD timetable"
        intro="See which specialists hold outpatient clinics each day, where to find them and the times you can book. Emergency care needs no appointment."
        actions={
          <>
            <HeaderAction href="/appointments" icon={CalendarPlus}>
              Book an appointment
            </HeaderAction>
            <HeaderAction href="tel:876256876" icon={Phone} variant="alert">
              Emergency 24/7: 876-256-876
            </HeaderAction>
          </>
        }
      />

      <main className="flex-1 bg-prohealth-canvas py-12 sm:py-16">
        <div className={LISTING_CONTAINER}>
          <WeeklySchedule />
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
