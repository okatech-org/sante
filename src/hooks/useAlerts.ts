import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, Alert } from '@/services/api';

export const useAlerts = (): UseQueryResult<Alert[], Error> => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getAlerts();
        return data ?? [];
      } catch {
        return [];
      }
    },
    initialData: [],
    staleTime: 30000,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
  });
};

