import { useState, useCallback } from 'react';
import neuralApi from '../lib/neuralApi';

export function useProfessionals() {
  const [professionals, setProfessionals] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchProfessionals = useCallback(async (filters: any = {}) => {
    try {
      setLoading(true);
      const data = await neuralApi.searchProfessionals(filters);
      setProfessionals(data);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message);
      setProfessionals([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProfessional = useCallback(async (professionalId: string) => {
    try {
      setLoading(true);
      const data = await neuralApi.getProfessionalProfile(professionalId);
      setError(null);
      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    professionals,
    loading,
    error,
    searchProfessionals,
    getProfessional
  };
}

export default useProfessionals;
