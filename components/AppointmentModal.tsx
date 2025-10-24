
import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types';
import { SparklesIcon, XIcon } from './Icons';
import { parseAppointmentFromText } from '../services/geminiService';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
  appointment: Appointment | null;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({ isOpen, onClose, onSave, appointment }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setDate(appointment.date);
      setTime(appointment.time);
    } else {
      setTitle('');
      setDate('');
      setTime('');
    }
    setAiPrompt('');
    setError('');
  }, [appointment, isOpen]);

  const handleGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    setError('');
    try {
      const result = await parseAppointmentFromText(aiPrompt);
      if (result) {
        if(result.title) setTitle(result.title);
        if(result.date) setDate(result.date);
        if(result.time) setTime(result.time);
      } else {
        setError("AI couldn't understand the request. Please be more specific.");
      }
    } catch (err) {
      setError('Failed to generate details. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !date || !time) {
        setError('Title, date, and time are required.');
        return;
    }
    onSave({ title, date, time });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity" onClick={onClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-full max-w-lg relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
          <XIcon className="w-6 h-6" />
        </button>
        <form onSubmit={handleSubmit} className="p-8">
          <h2 className="text-2xl font-bold mb-6 text-white">{appointment ? 'Edit Appointment' : 'New Appointment'}</h2>
          
          <div className="space-y-4 mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Or just type what you want to be reminded of..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full pl-10 pr-24 py-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <SparklesIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !aiPrompt}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-indigo-600 text-white px-3 py-1 text-sm rounded-md hover:bg-indigo-500 disabled:bg-slate-600 disabled:cursor-not-allowed"
              >
                {isGenerating ? '...' : 'Generate'}
              </button>
            </div>
          </div>
          
          <div className="h-px bg-slate-700 my-6"></div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-400">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 w-full p-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-400">Date</label>
                <input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full p-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-400">Time</label>
                <input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full p-2 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
          
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-slate-600 hover:bg-slate-500 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition-colors">
              Save Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
