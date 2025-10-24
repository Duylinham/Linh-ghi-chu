
import React from 'react';
import type { Appointment } from '../types';
import { AppointmentItem } from './AppointmentItem';

interface AppointmentListProps {
  appointments: Appointment[];
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, onEdit, onDelete }) => {
  const sortedAppointments = [...appointments].sort((a, b) => {
    const dateA = new Date(`${a.date}T${a.time}`);
    const dateB = new Date(`${b.date}T${b.time}`);
    return dateA.getTime() - dateB.getTime();
  });

  if (sortedAppointments.length === 0) {
    return (
      <div className="text-center py-16 px-6 bg-slate-800 rounded-lg">
        <h2 className="text-2xl font-semibold text-slate-300">No appointments yet!</h2>
        <p className="text-slate-400 mt-2">Click the '+' button to add your first reminder.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sortedAppointments.map((appointment) => (
        <AppointmentItem
          key={appointment.id}
          appointment={appointment}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
