import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage, StorageKeys } from '../utils/storage';
import { useAuth } from './AuthContext';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadAppointments();
    else setAppointments([]);
  }, [user]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const all = (await storage.getItem(StorageKeys.APPOINTMENTS)) || {};
      const userAppts = all[user.id] || [];
      setAppointments(userAppts);
    } finally {
      setLoading(false);
    }
  };

  const persist = async (updated) => {
    const all = (await storage.getItem(StorageKeys.APPOINTMENTS)) || {};
    all[user.id] = updated;
    await storage.setItem(StorageKeys.APPOINTMENTS, all);
  };

  const bookAppointment = async ({ provider, slot, date }) => {
    try {
      const newAppt = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        providerId: provider.id,
        providerName: provider.name,
        providerCategory: provider.category,
        providerImage: provider.image,
        providerLocation: provider.location,
        providerFee: provider.fee,
        slot,
        date,
        bookedAt: new Date().toISOString(),
        status: 'upcoming',
      };
      const updated = [...appointments, newAppt];
      setAppointments(updated);
      await persist(updated);
      return { success: true, appointment: newAppt };
    } catch (e) {
      return { success: false, message: 'Booking failed. Please try again.' };
    }
  };

  const cancelAppointment = async (id) => {
    try {
      const updated = appointments.map((a) =>
        a.id === id ? { ...a, status: 'cancelled' } : a
      );
      setAppointments(updated);
      await persist(updated);
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Cancellation failed.' };
    }
  };

  const isSlotBooked = useCallback(
    (providerId, slot, date) => {
      return appointments.some(
        (a) =>
          a.providerId === providerId &&
          a.slot === slot &&
          a.date === date &&
          a.status === 'upcoming'
      );
    },
    [appointments]
  );

  const upcomingAppointments = appointments.filter((a) => a.status === 'upcoming');
  const pastAppointments = appointments.filter(
    (a) => a.status === 'cancelled' || a.status === 'completed'
  );

  return (
    <AppContext.Provider
      value={{
        appointments,
        upcomingAppointments,
        pastAppointments,
        loading,
        bookAppointment,
        cancelAppointment,
        isSlotBooked,
        refreshAppointments: loadAppointments,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
