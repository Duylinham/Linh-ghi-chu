
import { useState, useEffect, useCallback, useRef } from 'react';
import type { Appointment } from '../types';

const STORAGE_KEY = 'appointments';

export const useAppointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const storedAppointments = localStorage.getItem(STORAGE_KEY);
      return storedAppointments ? JSON.parse(storedAppointments) : [];
    } catch (error) {
      console.error('Error reading appointments from localStorage', error);
      return [];
    }
  });

  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(Notification.permission);
  const notifiedAppointmentsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
    } catch (error) {
      console.error('Error saving appointments to localStorage', error);
    }
  }, [appointments]);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
    }
  }, []);

  const checkAndSendNotifications = useCallback(() => {
    if (notificationPermission !== 'granted') return;

    const now = new Date();
    appointments.forEach(appointment => {
      if (notifiedAppointmentsRef.current.has(appointment.id)) return;

      const appointmentTime = new Date(`${appointment.date}T${appointment.time}`);
      if (appointmentTime <= now) {
        new Notification('Appointment Reminder', {
          body: appointment.title,
        });
        notifiedAppointmentsRef.current.add(appointment.id);
      }
    });
  }, [appointments, notificationPermission]);

  useEffect(() => {
    const intervalId = setInterval(checkAndSendNotifications, 30 * 1000); // Check every 30 seconds
    return () => clearInterval(intervalId);
  }, [checkAndSendNotifications]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (updatedAppointment: Appointment) => {
    setAppointments(prev =>
      prev.map(app => (app.id === updatedAppointment.id ? updatedAppointment : app))
    );
    notifiedAppointmentsRef.current.delete(updatedAppointment.id);
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(app => app.id !== id));
    notifiedAppointmentsRef.current.delete(id);
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    notificationPermission,
    requestNotificationPermission,
  };
};
