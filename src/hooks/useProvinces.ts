import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { dashboardApi, Province } from '@/services/api';

export const useProvinces = (): UseQueryResult<Province[], Error> => {
  return useQuery({
    queryKey: ['provinces'],
    queryFn: () => dashboardApi.getProvinces(),
    staleTime: 600000, // 10 minutes
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

