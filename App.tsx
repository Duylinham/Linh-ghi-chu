
import React, { useState, useEffect } from 'react';
import { useAppointments } from './hooks/useAppointments';
import type { Appointment } from './types';
import { Header } from './components/Header';
import { AppointmentList } from './components/AppointmentList';
import { AppointmentModal } from './components/AppointmentModal';
import { PlusIcon } from './components/Icons';

const App: React.FC = () => {
  const {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    requestNotificationPermission,
    notificationPermission,
  } = useAppointments();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  const handleOpenModal = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSaveAppointment = (appointment: Omit<Appointment, 'id'>) => {
    if (editingAppointment) {
      updateAppointment({ ...appointment, id: editingAppointment.id });
    } else {
      addAppointment({
        ...appointment,
        id: crypto.randomUUID(),
      });
    }
    handleCloseModal();
  };

  useEffect(() => {
    if (notificationPermission === 'default') {
      // Optional: You might want to show a custom UI element before requesting permission.
      // For simplicity, we'll rely on the header button.
    }
  }, [notificationPermission]);

  return (
    <div className="min-h-screen bg-slate-900 text-gray-100 font-sans">
      <div className="container mx-auto max-w-4xl p-4 md:p-8">
        <Header 
          notificationPermission={notificationPermission}
          onNotificationRequest={requestNotificationPermission} 
        />
        <main>
          <AppointmentList
            appointments={appointments}
            onEdit={handleEditAppointment}
            onDelete={deleteAppointment}
          />
        </main>
        
        <div className="fixed bottom-8 right-8">
          <button
            onClick={handleOpenModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-4 shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            aria-label="Add new appointment"
          >
            <PlusIcon className="w-8 h-8" />
          </button>
        </div>

        {isModalOpen && (
          <AppointmentModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSave={handleSaveAppointment}
            appointment={editingAppointment}
          />
        )}
      </div>
    </div>
  );
};

export default App;
