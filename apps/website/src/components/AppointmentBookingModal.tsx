'use client';

import React from 'react';
import AppointmentBookingWizard from './appointment/AppointmentBookingWizard';

interface AppointmentBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDoctorId?: string;
  preselectedDepartmentId?: string;
}

export default function AppointmentBookingModal({
  isOpen,
  onClose,
  preselectedDoctorId,
  preselectedDepartmentId,
}: AppointmentBookingModalProps) {
  if (!isOpen) return null;

  return (
    <AppointmentBookingWizard
      variant="modal"
      onClose={onClose}
      preselectedDoctorId={preselectedDoctorId}
      preselectedDepartmentId={preselectedDepartmentId}
    />
  );
}
