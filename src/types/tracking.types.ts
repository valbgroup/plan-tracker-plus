export interface ProjectTracking {
  tracking_id: string;
  project_id: string;
  date_reporting: string;
  schedule_actuals: ScheduleActual[];
  budget_actuals: BudgetActual[];
  resource_actuals: ResourceActual[];
  deliverable_actuals: DeliverableActual[];
  risk_actuals: RiskActual[];
  overall_progress: number;
  schedule_variance: number;
  cost_variance: number;
  spi: number;
  cpi: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleActual {
  actual_id: string;
  project_id: string;
  entity_type: 'PHASE' | 'DELIVERABLE';
  entity_id: string;
  date_debut_reelle: string;
  date_fin_reelle?: string;
  variance_jours: number;
  variance_percent: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  created_at: string;
}

export interface BudgetActual {
  actual_id: string;
  project_id: string;
  envelope_id: string;
  montant_reel: number;
  devise_id: string;
  variance_montant: number;
  variance_percent: number;
  earned_value?: number;
  eac?: number;
  created_at: string;
}

export interface ResourceActual {
  actual_id: string;
  project_id: string;
  allocation_id: string;
  nombre_heures_reelles: number;
  utilization_percent: number;
  status: 'UNDER_UTILIZED' | 'OPTIMAL' | 'OVER_UTILIZED';
  created_at: string;
}

export interface DeliverableActual {
  actual_id: string;
  project_id: string;
  deliverable_id: string;
  statut_livrable_reelle: string;
  progres_reel: number;
  date_livraison_reelle?: string;
  is_accepted: boolean;
  accepted_by?: string;
  accepted_at?: string;
  acceptance_comments?: string;
  created_at: string;
}

export interface RiskActual {
  actual_id: string;
  project_id: string;
  risk_id: string;
  status: 'ACTIVE' | 'MITIGATED' | 'CLOSED';
  occurred: boolean;
  occurred_at?: string;
  impact_realized?: number;
  mitigation_status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  created_at: string;
}
