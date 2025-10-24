
import React, { useMemo } from 'react';
import type { Appointment } from '../types';
import { EditIcon, TrashIcon, CalendarIcon, ClockIcon } from './Icons';

interface AppointmentItemProps {
  appointment: Appointment;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
}

export const AppointmentItem: React.FC<AppointmentItemProps> = ({ appointment, onEdit, onDelete }) => {
    
    const formattedDateTime = useMemo(() => {
        if (!appointment.date || !appointment.time) {
            return { date: 'No date', time: 'No time' };
        }
        const date = new Date(`${appointment.date}T${appointment.time}`);
        if (isNaN(date.getTime())) {
            return { date: 'Invalid date', time: 'Invalid time' };
        }

        const formattedDate = date.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });

        const formattedTime = date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });

        return { date: formattedDate, time: formattedTime };
    }, [appointment.date, appointment.time]);
    
    const isPast = useMemo(() => {
        if (!appointment.date || !appointment.time) return false;
        const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
        return appointmentDate < new Date();
    }, [appointment.date, appointment.time]);

  return (
    <div className={`
      bg-slate-800 rounded-lg p-4 shadow-md transition-all duration-300 
      border-l-4 ${isPast ? 'border-slate-600 opacity-60' : 'border-indigo-500'}
      flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0
    `}>
      <div className="flex-grow">
        <h3 className={`text-xl font-semibold ${isPast ? 'line-through text-slate-400' : 'text-white'}`}>
          {appointment.title}
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center text-slate-400 text-sm mt-2 space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center">
                <CalendarIcon className="w-4 h-4 mr-2 text-slate-500" />
                <span>{formattedDateTime.date}</span>
            </div>
            <div className="flex items-center">
                <ClockIcon className="w-4 h-4 mr-2 text-slate-500" />
                <span>{formattedDateTime.time}</span>
            </div>
        </div>
      </div>
      <div className="flex items-center space-x-2 flex-shrink-0">
        <button
          onClick={() => onEdit(appointment)}
          className="p-2 rounded-full hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          aria-label="Edit appointment"
        >
          <EditIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(appointment.id)}
          className="p-2 rounded-full hover:bg-slate-700 text-red-500 hover:text-red-400 transition-colors"
          aria-label="Delete appointment"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
