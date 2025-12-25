import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  fetchPhases, 
  fetchDeliverables, 
  fetchBudgetEnvelopes,
  updatePhase,
  updateDeliverable,
  updateBudgetEnvelope,
  savePlanData,
  Phase,
  Deliverable,
  BudgetEnvelope
} from '@/services/planService';
import { toast } from 'sonner';

// Query keys
export const planKeys = {
  all: ['plan'] as const,
  phases: (projectId: string, baselineId?: string) => 
    [...planKeys.all, 'phases', projectId, baselineId] as const,
  deliverables: (projectId: string, baselineId?: string) => 
    [...planKeys.all, 'deliverables', projectId, baselineId] as const,
  budgets: (projectId: string, baselineId?: string) => 
    [...planKeys.all, 'budgets', projectId, baselineId] as const,
};

// Fetch hooks
export function usePhases(projectId: string, baselineId?: string) {
  return useQuery({
    queryKey: planKeys.phases(projectId, baselineId),
    queryFn: () => fetchPhases(projectId, baselineId),
    enabled: !!projectId,
  });
}

export function useDeliverables(projectId: string, baselineId?: string) {
  return useQuery({
    queryKey: planKeys.deliverables(projectId, baselineId),
    queryFn: () => fetchDeliverables(projectId, baselineId),
    enabled: !!projectId,
  });
}

export function useBudgetEnvelopes(projectId: string, baselineId?: string) {
  return useQuery({
    queryKey: planKeys.budgets(projectId, baselineId),
    queryFn: () => fetchBudgetEnvelopes(projectId, baselineId),
    enabled: !!projectId,
  });
}

// Mutation hooks
export function useUpdatePhase() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ phaseId, data }: { phaseId: string; data: Partial<Phase> }) => 
      updatePhase(phaseId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast.success('Phase updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update phase');
      console.error('Update phase error:', error);
    },
  });
}

export function useUpdateDeliverable() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ deliverableId, data }: { deliverableId: string; data: Partial<Deliverable> }) => 
      updateDeliverable(deliverableId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast.success('Deliverable updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update deliverable');
      console.error('Update deliverable error:', error);
    },
  });
}

export function useUpdateBudgetEnvelope() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ envelopeId, data }: { envelopeId: string; data: Partial<BudgetEnvelope> }) => 
      updateBudgetEnvelope(envelopeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast.success('Budget envelope updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update budget envelope');
      console.error('Update budget envelope error:', error);
    },
  });
}

export function useSavePlanData(projectId: string) {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      phases?: Phase[];
      deliverables?: Deliverable[];
      budgetEnvelopes?: BudgetEnvelope[];
    }) => savePlanData(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: planKeys.all });
      toast.success('Plan saved successfully');
    },
    onError: (error) => {
      toast.error('Failed to save plan');
      console.error('Save plan error:', error);
    },
  });
}
