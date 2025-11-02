import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, KPI } from '@/services/api';

export const useKPIs = (periode?: string): UseQueryResult<KPI[], Error> => {
  return useQuery({
    queryKey: ['kpis', periode || 'all'],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getKPIs(periode);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching KPIs:', error);
        return [];
      }
    },
    initialData: [],
    staleTime: 60000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

