import { useState } from 'react';
import { Establishment, EstablishmentFormData } from '@/types/establishment';
import { establishmentsAPI } from '@/api/establishments.api';

export const useEstablishments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEstablishments = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await establishmentsAPI.getAll();
      return data;
    } catch (err) {
      setError('Erreur lors du chargement des établissements');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEstablishment = async (data: EstablishmentFormData): Promise<Establishment> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await establishmentsAPI.create(data);
      return result;
    } catch (err) {
      setError('Erreur lors de la création de l\'établissement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateEstablishment = async (id: string, data: Partial<EstablishmentFormData>): Promise<Establishment> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await establishmentsAPI.update(id, data);
      return result;
    } catch (err) {
      setError('Erreur lors de la mise à jour de l\'établissement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteEstablishment = async (id: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await establishmentsAPI.delete(id);
      return result;
    } catch (err) {
      setError('Erreur lors de la suppression de l\'établissement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const importEstablishments = async (file: File): Promise<Establishment[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // TODO: Remplacer par un vrai appel API
      const response = await fetch('/api/admin/establishments/import', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Erreur lors de l\'import');
      const result = await response.json();
      return result;
    } catch (err) {
      setError('Erreur lors de l\'import des établissements');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const exportEstablishments = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Remplacer par un vrai appel API
      const response = await fetch(`/api/admin/establishments/export?format=${format}`);
      
      if (!response.ok) throw new Error('Erreur lors de l\'export');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `etablissements.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      return true;
    } catch (err) {
      setError('Erreur lors de l\'export des établissements');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const validateEstablishment = async (id: string, validationData: any) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Remplacer par un vrai appel API
      const response = await fetch(`/api/admin/establishments/${id}/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validationData),
      });
      
      if (!response.ok) throw new Error('Erreur lors de la validation');
      const result = await response.json();
      return result;
    } catch (err) {
      setError('Erreur lors de la validation de l\'établissement');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEstablishmentStats = async (establishmentId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Remplacer par un vrai appel API
      const response = await fetch(`/api/admin/establishments/${establishmentId}/stats`);
      
      if (!response.ok) throw new Error('Erreur lors de la récupération des stats');
      const data = await response.json();
      return data;
    } catch (err) {
      setError('Erreur lors de la récupération des statistiques');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchEstablishments,
    createEstablishment,
    updateEstablishment,
    deleteEstablishment,
    importEstablishments,
    exportEstablishments,
    validateEstablishment,
    getEstablishmentStats,
  };
};
