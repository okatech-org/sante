import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, KPI } from '@/services/api';

export const useKPIs = (periode?: string): UseQueryResult<KPI[], Error> => {
  return useQuery({
    queryKey: ['kpis', periode],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getKPIs(periode);
        return data ?? [];
      } catch {
        return [];
      }
    },
    initialData: [],
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });
};

