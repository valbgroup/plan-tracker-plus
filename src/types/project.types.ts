// ============================================
// PROJECT MAIN ENTITY
// ============================================

export interface Project {
  project_id: string;
  code: string;
  libellé: string;
  description: string;
  type_projet_id: string;
  nature_id: string;
  taille_id: string;
  approche_id: string;
  portefeuille_id: string;
  programme_id: string;
  date_debut_planifiée: string;
  date_fin_planifiée: string;
  date_debut_reelle?: string;
  date_fin_reelle?: string;
  statut_id: string;
  etat_sante_id: string;
  montant_budget_total: number;
  devise_pivot_id: string;
  budget_consomme: number;
  perimetre: string;
  nombre_livrables_planifies: number;
  nombre_livrables_acceptes: number;
  baseline_actuelle_id: string;
  baseline_lock: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  updated_by: string;
  is_active: boolean;
}

// ============================================
// PROJECT PLAN - DETAILED PLANNING
// ============================================

export interface ProjectPlan {
  plan_id: string;
  project_id: string;
  baseline_id: string;
  sponsor_id: string;
  pmo_id: string;
  tech_lead_id: string;
  business_owner_id: string;
  phases: Phase[];
  deliverables: Deliverable[];
  enveloppes: BudgetEnvelope[];
  total_budget: number;
  allocations: ResourceAllocation[];
  stakeholders: ProjectStakeholder[];
  plan_status: 'DRAFT' | 'SUBMITTED' | 'APPROVED';
  created_at: string;
  updated_at: string;
}

// ============================================
// WORK BREAKDOWN STRUCTURE (WBS)
// ============================================

export interface Phase {
  phase_id: string;
  project_id: string;
  baseline_id: string;
  code: string;
  libellé: string;
  description: string;
  ordre: number;
  date_debut: string;
  date_fin: string;
  date_debut_reelle?: string;
  date_fin_reelle?: string;
  progres_reel: number;
  progres_prevu: number;
  statut_id: string;
  etat_sante_id: string;
  deliverables: Deliverable[];
  parent_phase_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  deliverable_id: string;
  project_id: string;
  phase_id: string;
  baseline_id: string;
  code: string;
  libellé: string;
  description: string;
  type_livrable_id: string;
  statut_livrable_id: string;
  etat_sante_id: string;
  date_debut_prevue: string;
  date_fin_prevue: string;
  date_debut_reelle?: string;
  date_fin_reelle?: string;
  date_acceptation?: string;
  progres_reel: number;
  responsable_id: string;
  acceptance_criteria: string;
  accepted_by?: string;
  accepted_at?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// BUDGET MANAGEMENT
// ============================================

export interface BudgetEnvelope {
  envelope_id: string;
  project_id: string;
  baseline_id: string;
  type_enveloppe_id: string;
  type_budget_id: string;
  montant_alloue: number;
  montant_consomme: number;
  devise_id: string;
  budget_items: BudgetItem[];
  created_at: string;
  updated_at: string;
}

export interface BudgetItem {
  item_id: string;
  envelope_id: string;
  description: string;
  montant_planifie: number;
  montant_reel?: number;
  source_financement_id?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// RESOURCE ALLOCATION
// ============================================

export interface ResourceAllocation {
  allocation_id: string;
  project_id: string;
  baseline_id: string;
  ressource_id: string;
  date_debut: string;
  date_fin: string;
  pourcentage_allocation: number;
  nombre_heures_prevues: number;
  nombre_heures_reelles?: number;
  cout_jour: number;
  devise_id: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// STAKEHOLDERS & RACI
// ============================================

export interface ProjectStakeholder {
  stakeholder_id: string;
  project_id: string;
  collaborateur_id?: string;
  collaborateur_externe_id?: string;
  fonction_id: string;
  position_id: string;
  responsible: boolean;
  accountable: boolean;
  consulted: boolean;
  informed: boolean;
  created_at: string;
  updated_at: string;
}

// ============================================
// ENUMS & CONSTANTS
// ============================================

export enum ProjectStatus {
  INIT = 'INIT',
  PLAN = 'PLAN',
  EXEC = 'EXEC',
  CLOT = 'CLOT',
  SUSP = 'SUSP',
}

export enum HealthStatus {
  NORMAL = 'NORMAL',
  ADV = 'ADV',
  LATE = 'LATE',
  VLATE = 'VLATE',
}

export enum DeliverableStatus {
  OPEN = 'OPEN',
  PLAN = 'PLAN',
  IN_PROGRESS = 'IN_PROGRESS',
  FINAL = 'FINAL',
  DELIVERED = 'DELIVERED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  REPLANNED = 'REPLANNED',
  RETAKE = 'RETAKE',
}

export enum ApproachType {
  PRED = 'PRED',
  AGI = 'AGI',
  HYB = 'HYB',
}

export type ProjectWithDetails = Project & {
  plan: ProjectPlan;
  baseline_actuelle: import('./baseline.types').Baseline;
  type_projet: unknown;
  nature: unknown;
  approche: unknown;
  statut: unknown;
};
