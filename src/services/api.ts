import axios, { AxiosInstance } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour JWT
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur d'erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      useAuthStore.getState().logout();
      window.location.href = '/gouv/login';
    }
    return Promise.reject(error);
  }
);

// Types Dashboard
export interface KPI {
  id: string;
  nom: string;
  valeur: number;
  delta: number;
  unite: string;
  periode: string;
  date: string;
}

export interface Alert {
  id: string;
  titre: string;
  description: string;
  severity: 'critique' | 'haute' | 'moyenne';
  province: string;
  statut: string;
  action?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface Decree {
  id: string;
  titre: string;
  numero: string;
  date: string;
  statut: 'draft' | 'signed' | 'published';
  categorie: string;
  pdfUrl?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Objectif {
  id: string;
  nom: string;
  description?: string;
  cible: number;
  progres: number;
  unite: string;
  deadline: string;
  provinceId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Province {
  id: string;
  nom: string;
  code: string;
  population: number;
  structures: number;
  couverture: number;
  medecins: number;
  infirmiers: number;
  lits: number;
  budget: number;
  centroid: { lat: number; lng: number };
  bounds: [[number, number], [number, number]];
  needs: string[];
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

// Fonctions API Dashboard
export const dashboardApi = {
  // KPIs
  getKPIs: async (periode?: string): Promise<KPI[]> => {
    const { data } = await api.get<APIResponse<KPI[]>>('/dashboard/kpis', { 
      params: { periode } 
    });
    return data.data;
  },

  // Alerts
  getAlerts: async (): Promise<Alert[]> => {
    const { data } = await api.get<APIResponse<Alert[]>>('/dashboard/alerts');
    return data.data;
  },

  // Decrees
  getDecrees: async (params?: { status?: string }): Promise<Decree[]> => {
    const { data } = await api.get<APIResponse<Decree[]>>('/dashboard/decrets', { 
      params 
    });
    return data.data;
  },

  createDecree: async (decree: Partial<Decree>): Promise<Decree> => {
    const { data } = await api.post<APIResponse<Decree>>('/dashboard/decrets', decree);
    return data.data;
  },

  updateDecree: async (id: string, decree: Partial<Decree>): Promise<Decree> => {
    const { data } = await api.patch<APIResponse<Decree>>(`/dashboard/decrets/${id}`, decree);
    return data.data;
  },

  deleteDecree: async (id: string): Promise<void> => {
    await api.delete(`/dashboard/decrets/${id}`);
  },

  // Objectifs
  getObjectifs: async (params?: { category?: string }): Promise<Objectif[]> => {
    const { data } = await api.get<APIResponse<Objectif[]>>('/dashboard/objectifs', { 
      params 
    });
    return data.data;
  },

  createObjectif: async (objectif: Partial<Objectif>): Promise<Objectif> => {
    const { data } = await api.post<APIResponse<Objectif>>('/dashboard/objectifs', objectif);
    return data.data;
  },

  updateObjectif: async (id: string, objectif: Partial<Objectif>): Promise<Objectif> => {
    const { data } = await api.patch<APIResponse<Objectif>>(`/dashboard/objectifs/${id}`, objectif);
    return data.data;
  },

  // Provinces
  getProvinces: async (): Promise<Province[]> => {
    const { data } = await api.get<APIResponse<Province[]>>('/dashboard/provinces');
    return data.data;
  },

  getProvince: async (id: string): Promise<Province> => {
    const { data } = await api.get<APIResponse<Province>>(`/dashboard/provinces/${id}`);
    return data.data;
  },

  updateProvince: async (id: string, province: Partial<Province>): Promise<Province> => {
    const { data } = await api.patch<APIResponse<Province>>(`/dashboard/provinces/${id}`, province);
    return data.data;
  },

  // Statistiques globales
  getStats: async (periode?: string): Promise<any> => {
    const { data } = await api.get<APIResponse<any>>('/dashboard/stats', { 
      params: { periode } 
    });
    return data.data;
  },
};

export default api;

