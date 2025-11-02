import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { dashboardApi, Objectif } from '@/services/api';

export const useObjectifs = (params?: { category?: string }): UseQueryResult<Objectif[], Error> => {
  return useQuery({
    queryKey: ['objectifs', params ?? {}],
    queryFn: async () => {
      try {
        const data = await dashboardApi.getObjectifs(params);
        return data ?? [];
      } catch {
        return [];
      }
    },
    initialData: [],
    staleTime: 300000,
    refetchOnWindowFocus: false,
  });
};

export const useCreateObjectif = (): UseMutationResult<Objectif, Error, Partial<Objectif>> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (objectif: Partial<Objectif>) => dashboardApi.createObjectif(objectif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectifs'] });
    },
  });
};

export const useUpdateObjectif = (): UseMutationResult<Objectif, Error, { id: string; objectif: Partial<Objectif> }> => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, objectif }: { id: string; objectif: Partial<Objectif> }) => 
      dashboardApi.updateObjectif(id, objectif),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['objectifs'] });
    },
  });
};

