import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { dashboardApi, Province } from '@/services/api';

export interface ProvinceHealthData {
  id: string;
  province: string;
  population: number;
  structuresCount: number;
  hospitals: number;
  healthCenters: number;
  pharmacies: number;
  laboratories: number;
  totalStaff: number;
  doctors: number;
  nurses: number;
  coverageRate: number;
  occupancyRate: number;
  avgWaitTime: string;
  satisfaction: number;
  priority: "haute" | "moyenne" | "basse";
  needs: string[];
}

const MOCK_PROVINCES: ProvinceHealthData[] = [
  {
    id: "prov-1",
    province: "Estuaire",
    population: 850000,
    structuresCount: 95,
    hospitals: 12,
    healthCenters: 28,
    pharmacies: 42,
    laboratories: 13,
    totalStaff: 4250,
    doctors: 1892,
    nurses: 1980,
    coverageRate: 85,
    occupancyRate: 78,
    avgWaitTime: "2 jours",
    satisfaction: 4.3,
    priority: "moyenne",
    needs: ["Personnel spécialisé", "Équipements modernes"],
  },
  {
    id: "prov-2",
    province: "Haut-Ogooué",
    population: 250000,
    structuresCount: 42,
    hospitals: 5,
    healthCenters: 18,
    pharmacies: 14,
    laboratories: 5,
    totalStaff: 1420,
    doctors: 589,
    nurses: 720,
    coverageRate: 72,
    occupancyRate: 65,
    avgWaitTime: "5 jours",
    satisfaction: 4.1,
    priority: "haute",
    needs: ["Médecins spécialistes", "Laboratoires", "Ambulances"],
  },
  {
    id: "prov-3",
    province: "Ogooué-Maritime",
    population: 160000,
    structuresCount: 28,
    hospitals: 3,
    healthCenters: 15,
    pharmacies: 8,
    laboratories: 2,
    totalStaff: 890,
    doctors: 345,
    nurses: 480,
    coverageRate: 68,
    occupancyRate: 62,
    avgWaitTime: "5 jours",
    satisfaction: 4.0,
    priority: "haute",
    needs: ["Centre de santé moderne", "Personnel qualifié"],
  },
  {
    id: "prov-4",
    province: "Woleu-Ntem",
    population: 154000,
    structuresCount: 22,
    hospitals: 2,
    healthCenters: 14,
    pharmacies: 5,
    laboratories: 1,
    totalStaff: 620,
    doctors: 198,
    nurses: 380,
    coverageRate: 61,
    occupancyRate: 54,
    avgWaitTime: "8 jours",
    satisfaction: 3.9,
    priority: "haute",
    needs: ["Infrastructures", "Équipements médicaux", "Personnel"],
  },
  {
    id: "prov-5",
    province: "Ngounié",
    population: 102000,
    structuresCount: 18,
    hospitals: 2,
    healthCenters: 11,
    pharmacies: 4,
    laboratories: 1,
    totalStaff: 540,
    doctors: 176,
    nurses: 320,
    coverageRate: 60,
    occupancyRate: 60,
    avgWaitTime: "6 jours",
    satisfaction: 4.0,
    priority: "moyenne",
    needs: ["Pharmacies", "Médecins généralistes"],
  },
  {
    id: "prov-6",
    province: "Nyanga",
    population: 52000,
    structuresCount: 14,
    hospitals: 1,
    healthCenters: 10,
    pharmacies: 2,
    laboratories: 1,
    totalStaff: 410,
    doctors: 128,
    nurses: 250,
    coverageRate: 52,
    occupancyRate: 48,
    avgWaitTime: "10 jours",
    satisfaction: 3.8,
    priority: "haute",
    needs: ["Centre hospitalier régional", "Maternité", "Transport"],
  },
  {
    id: "prov-7",
    province: "Ogooué-Ivindo",
    population: 63000,
    structuresCount: 12,
    hospitals: 1,
    healthCenters: 9,
    pharmacies: 2,
    laboratories: 0,
    totalStaff: 320,
    doctors: 95,
    nurses: 210,
    coverageRate: 58,
    occupancyRate: 58,
    avgWaitTime: "9 jours",
    satisfaction: 3.7,
    priority: "haute",
    needs: ["Laboratoire", "Médecins", "Équipements"],
  },
  {
    id: "prov-8",
    province: "Ogooué-Lolo",
    population: 65000,
    structuresCount: 10,
    hospitals: 1,
    healthCenters: 7,
    pharmacies: 2,
    laboratories: 0,
    totalStaff: 280,
    doctors: 82,
    nurses: 180,
    coverageRate: 48,
    occupancyRate: 45,
    avgWaitTime: "10 jours",
    satisfaction: 3.6,
    priority: "haute",
    needs: ["Centre de santé", "Laboratoire", "Médecins"],
  },
  {
    id: "prov-9",
    province: "Moyen-Ogooué",
    population: 69000,
    structuresCount: 20,
    hospitals: 2,
    healthCenters: 13,
    pharmacies: 4,
    laboratories: 1,
    totalStaff: 690,
    doctors: 221,
    nurses: 425,
    coverageRate: 55,
    occupancyRate: 55,
    avgWaitTime: "7 jours",
    satisfaction: 3.9,
    priority: "moyenne",
    needs: ["Spécialistes", "Équipements"],
  },
];

const mapApiProvinceToHealthData = (province: Province): ProvinceHealthData => {
  const hospitals = Math.floor((province.structures || 0) * 0.15);
  const healthCenters = Math.floor((province.structures || 0) * 0.40);
  const pharmacies = Math.floor((province.structures || 0) * 0.30);
  const laboratories = Math.floor((province.structures || 0) * 0.15);
  
  const totalStaff = (province.medecins || 0) + (province.infirmiers || 0);
  const doctorRatio = province.population ? (province.medecins / province.population) * 1000 : 0;
  
  let priority: "haute" | "moyenne" | "basse" = "moyenne";
  if (province.couverture < 60 || doctorRatio < 0.8) {
    priority = "haute";
  } else if (province.couverture > 75 && doctorRatio > 1.2) {
    priority = "basse";
  }

  return {
    id: province.id,
    province: province.nom,
    population: province.population || 0,
    structuresCount: province.structures || 0,
    hospitals,
    healthCenters,
    pharmacies,
    laboratories,
    totalStaff,
    doctors: province.medecins || 0,
    nurses: province.infirmiers || 0,
    coverageRate: province.couverture || 0,
    occupancyRate: Math.round((province.lits || 0) / ((province.structures || 1) * 10) * 100),
    avgWaitTime: priority === "haute" ? "8-10 jours" : priority === "moyenne" ? "5-7 jours" : "2-3 jours",
    satisfaction: 5 - (priority === "haute" ? 1.2 : priority === "moyenne" ? 0.5 : 0),
    priority,
    needs: province.needs || [],
  };
};

export const useProvinces = (): UseQueryResult<ProvinceHealthData[], Error> => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getProvinces();
        if (data && data.length > 0) {
          return data.map(mapApiProvinceToHealthData);
        }
        return MOCK_PROVINCES;
      } catch (error) {
        console.warn('API provinces failed, using mock data:', error);
        return MOCK_PROVINCES;
      }
    },
    initialData: MOCK_PROVINCES,
    staleTime: 600000,
    refetchOnWindowFocus: false,
  });
};

export const useProvince = (id: string): UseQueryResult<Province, Error> => {
  return useQuery({
    queryKey: ['provinces', id],
    queryFn: () => dashboardApi.getProvince(id),
    staleTime: 300000, // 5 minutes
    enabled: !!id,
  });
};

export const useUpdateProvince = (): UseMutationResult<Province, Error, { id: string; province: Partial<Province> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, province }: { id: string; province: Partial<Province> }) => 
      dashboardApi.updateProvince(id, province),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['provinces'] });
      queryClient.invalidateQueries({ queryKey: ['provinces', data.id] });
    },
  });
};

