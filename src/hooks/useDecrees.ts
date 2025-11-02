import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { dashboardApi, Decree } from '@/services/api';

export const useDecrees = (params?: { status?: string }): UseQueryResult<Decree[], Error> => {
  return useQuery({
    queryKey: ['decrees', params?.status || 'all'],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getDecrees(params);
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching decrees:', error);
        return [];
      }
    },
    initialData: [],
    staleTime: 120000,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useCreateDecree = (): UseMutationResult<Decree, Error, Partial<Decree>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (decree: Partial<Decree>) => dashboardApi.createDecree(decree),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decrees'] });
    },
  });
};

export const useUpdateDecree = (): UseMutationResult<Decree, Error, { id: string; decree: Partial<Decree> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, decree }: { id: string; decree: Partial<Decree> }) => 
      dashboardApi.updateDecree(id, decree),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decrees'] });
    },
  });
};

export const useDeleteDecree = (): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => dashboardApi.deleteDecree(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decrees'] });
    },
  });
};

