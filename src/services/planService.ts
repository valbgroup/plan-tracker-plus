import { MOCK_PHASES, MOCK_DELIVERABLES, MOCK_BUDGET_ENVELOPES } from '@/data/mockProjectData';

// Types
export interface Phase {
  phase_id: string;
  project_id: string;
  baseline_id?: string;
  libellé: string;
  description: string;
  ordre: number;
  date_debut: string;
  date_fin: string;
  progres_reel: number;
}

export interface Deliverable {
  deliverable_id: string;
  project_id: string;
  baseline_id?: string;
  code: string;
  libellé: string;
  date_fin_prevue: string;
  progres_reel: number;
}

export interface BudgetEnvelope {
  envelope_id: string;
  project_id: string;
  baseline_id?: string;
  type_enveloppe_id: string;
  type_budget_id: string;
  montant_alloue: number;
  montant_consomme: number;
}

// API Functions (currently using mock data)
export const fetchPhases = async (projectId: string, baselineId?: string): Promise<Phase[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return MOCK_PHASES.filter(p => {
    if (p.project_id !== projectId) return false;
    if (baselineId && p.baseline_id && p.baseline_id !== baselineId) return false;
    return true;
  }) as Phase[];
};

export const fetchDeliverables = async (projectId: string, baselineId?: string): Promise<Deliverable[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return MOCK_DELIVERABLES.filter(d => {
    if (d.project_id !== projectId) return false;
    if (baselineId && d.baseline_id && d.baseline_id !== baselineId) return false;
    return true;
  }) as Deliverable[];
};

export const fetchBudgetEnvelopes = async (projectId: string, baselineId?: string): Promise<BudgetEnvelope[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  
  return MOCK_BUDGET_ENVELOPES.filter(e => {
    if (e.project_id !== projectId) return false;
    if (baselineId && e.baseline_id && e.baseline_id !== baselineId) return false;
    return true;
  }) as BudgetEnvelope[];
};

export const updatePhase = async (phaseId: string, data: Partial<Phase>): Promise<Phase> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const phase = MOCK_PHASES.find(p => p.phase_id === phaseId);
  if (!phase) throw new Error('Phase not found');
  
  // In real app, this would update the database
  Object.assign(phase, data);
  return phase as Phase;
};

export const updateDeliverable = async (deliverableId: string, data: Partial<Deliverable>): Promise<Deliverable> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const deliverable = MOCK_DELIVERABLES.find(d => d.deliverable_id === deliverableId);
  if (!deliverable) throw new Error('Deliverable not found');
  
  Object.assign(deliverable, data);
  return deliverable as Deliverable;
};

export const updateBudgetEnvelope = async (envelopeId: string, data: Partial<BudgetEnvelope>): Promise<BudgetEnvelope> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const envelope = MOCK_BUDGET_ENVELOPES.find(e => e.envelope_id === envelopeId);
  if (!envelope) throw new Error('Budget envelope not found');
  
  Object.assign(envelope, data);
  return envelope as BudgetEnvelope;
};

// Save all plan data
export const savePlanData = async (
  projectId: string,
  data: {
    phases?: Phase[];
    deliverables?: Deliverable[];
    budgetEnvelopes?: BudgetEnvelope[];
  }
): Promise<{ success: boolean }> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In real app, this would batch update all data
  console.log('Saving plan data for project:', projectId, data);
  
  return { success: true };
};
