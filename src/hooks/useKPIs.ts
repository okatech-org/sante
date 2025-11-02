import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, KPI } from '@/services/api';

export const useKPIs = (periode?: string): UseQueryResult<KPI[], Error> => {
  return useQuery({
    queryKey: ['kpis', periode],
    queryFn: () => dashboardApi.getKPIs(periode),
    staleTime: 60000, // 1 minute
    refetchOnWindowFocus: false,
  });
};

