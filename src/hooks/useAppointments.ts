import { useState, useCallback, useEffect } from 'react';
import neuralApi from '../lib/neuralApi';

export function useAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      const data = await neuralApi.getMyAppointments(filters);
      setAppointments(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments({ upcoming: true });
  }, [fetchAppointments]);

  const createAppointment = useCallback(async (appointmentData: any) => {
    try {
      setLoading(true);
      const newAppointment = await neuralApi.createAppointment(appointmentData);
      setAppointments([...appointments, newAppointment]);
      setError(null);
      return newAppointment;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments]);

  const cancelAppointment = useCallback(async (appointmentId: string, reason: string) => {
    try {
      setLoading(true);
      await neuralApi.cancelAppointment(appointmentId, reason);
      setAppointments(appointments.filter(a => a.id !== appointmentId));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments]);

  const confirmAppointment = useCallback(async (appointmentId: string) => {
    try {
      setLoading(true);
      await neuralApi.confirmAppointment(appointmentId);
      setAppointments(appointments.map(a =>
        a.id === appointmentId ? { ...a, status: 'confirmed' } : a
      ));
      setError(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [appointments]);

  return {
    appointments,
    loading,
    error,
    fetchAppointments,
    createAppointment,
    cancelAppointment,
    confirmAppointment
  };
}

export default useAppointments;
