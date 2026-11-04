import React from 'react';
import type { Metadata } from 'next';
import { Building2 } from 'lucide-react';
import TopEmergencyBar from '../../components/TopEmergencyBar';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EmergencyFAB from '../../components/EmergencyFAB';
import { Stagger, StaggerItem } from '../../components/motion';
import { DEPARTMENTS } from '../../data/hospitalData';
import { LISTING_CONTAINER, PageHeader } from '../../components/listing/PageHeader';
import { DepartmentCard } from '../../components/listing/departments/DepartmentCard';

export const metadata: Metadata = {
  title: 'Clinical Departments & Centers of Excellence',
  description:
    'Explore ProHealth clinical institutes: Cardiology, Emergency Trauma, Neurology, Orthopedics, Pediatrics, and Maternal Health.',
};

const STATS = [
  { label: 'Specialist departments', value: DEPARTMENTS.length.toString() },
  { label: 'Inpatient beds', value: DEPARTMENTS.reduce((sum, d) => sum + d.beds, 0).toLocaleString('en-US') },
  { label: 'With 24/7 emergency cover', value: DEPARTMENTS.filter((d) => d.emergencySupport).length.toString() },
];

function DepartmentStats() {
  return (
    <dl className="grid grid-cols-3 divide-x divide-border rounded-card border border-border bg-background/90 shadow-soft">
      {STATS.map((s) => (
        <div key={s.label} className="flex flex-col-reverse justify-end px-4 py-5 text-center sm:px-5">
          <dt className="mt-1 text-xs leading-snug text-prohealth-muted sm:text-sm">{s.label}</dt>
          <dd className="font-display text-2xl font-bold tabular-nums text-prohealth-heading sm:text-3xl">{s.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export default function DepartmentsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopEmergencyBar />
      <Navbar />

      <PageHeader
        breadcrumb={[{ label: 'Departments' }]}
        eyebrow="Centers of excellence"
        eyebrowIcon={Building2}
        title="Clinical departments and specialist institutes"
        intro="Each department is a multidisciplinary team of certified clinicians, diagnostic suites and recovery programmes built around the patient."
        aside={<DepartmentStats />}
      />

      <main className="flex-1 bg-prohealth-canvas py-12 sm:py-16" aria-labelledby="departments-heading">
        <div className={LISTING_CONTAINER}>
          <h2 id="departments-heading" className="sr-only">
            All departments
          </h2>
          <Stagger as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {DEPARTMENTS.map((dept, i) => (
              <StaggerItem as="li" key={dept.id} className="flex">
                <DepartmentCard dept={dept} index={i} />
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </main>

      <Footer />
      <EmergencyFAB />
    </div>
  );
}
