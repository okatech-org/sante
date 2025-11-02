import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { dashboardApi, Alert } from '@/services/api';

export const useAlerts = (): UseQueryResult<Alert[], Error> => {
  return useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getAlerts();
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching alerts:', error);
        return [];
      }
    },
    initialData: [],
    staleTime: 30000,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    retry: 1,
  });
};

