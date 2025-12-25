import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { baselineService } from '@/services/baselineService';

export const useBaselines = (projectId: string) => {
  return useQuery({
    queryKey: ['baselines', projectId],
    queryFn: () => baselineService.getBaselinesByProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCurrentBaseline = (projectId: string) => {
  return useQuery({
    queryKey: ['currentBaseline', projectId],
    queryFn: () => baselineService.getCurrentBaseline(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubmitBaseline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ baselineId, submittedBy }: { baselineId: string; submittedBy: string }) =>
      baselineService.submitForApproval(baselineId, submittedBy),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['baselines', data.project_id] });
    },
  });
};

export const useApproveBaseline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ baselineId, approvedBy }: { baselineId: string; approvedBy: string }) =>
      baselineService.approveBaseline(baselineId, approvedBy),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['baselines', data.project_id] });
      queryClient.invalidateQueries({ queryKey: ['currentBaseline', data.project_id] });
    },
  });
};

export const useRejectBaseline = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ baselineId, rejectedBy, reason }: { baselineId: string; rejectedBy: string; reason: string }) =>
      baselineService.rejectBaseline(baselineId, rejectedBy, reason),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['baselines', data.project_id] });
    },
  });
};
