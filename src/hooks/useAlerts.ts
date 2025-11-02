import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, Alert } from '@/services/api';

export const useAlerts = (): UseQueryResult<Alert[], Error> => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: () => dashboardApi.getAlerts(),
    staleTime: 30000, // 30 secondes
    refetchInterval: 60000, // Refetch toutes les minutes
    refetchOnWindowFocus: true,
  });
};

