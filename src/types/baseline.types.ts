export interface Baseline {
  baseline_id: string;
  project_id: string;
  version: string;
  version_number: number;
  minor_version: number;
  plan_snapshot: unknown;
  status: BaselineStatus;
  submitted_by?: string;
  submitted_at?: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  is_locked: boolean;
  changes_from_previous?: BaselineChange[];
  created_at: string;
  updated_at: string;
}

export type BaselineStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface BaselineChange {
  change_id: string;
  baseline_id: string;
  baseline_previous_id: string;
  change_type: ChangeType;
  entity_type: EntityType;
  entity_id: string;
  field_name: string;
  old_value: unknown;
  new_value: unknown;
  impact_analysis?: ImpactAnalysis;
  created_at: string;
}

export enum ChangeType {
  ADDED = 'ADDED',
  MODIFIED = 'MODIFIED',
  DELETED = 'DELETED',
}

export enum EntityType {
  PHASE = 'PHASE',
  DELIVERABLE = 'DELIVERABLE',
  BUDGET = 'BUDGET',
  RESOURCE = 'RESOURCE',
  STAKEHOLDER = 'STAKEHOLDER',
}

export interface ImpactAnalysis {
  impact_id: string;
  change_id: string;
  affected_entities: AffectedEntity[];
  cost_impact: number;
  schedule_impact: number;
  resource_impact: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  created_at: string;
}

export interface AffectedEntity {
  entity_type: EntityType;
  entity_id: string;
  impact_reason: string;
}

export interface ApprovalRequest {
  request_id: string;
  baseline_id: string;
  project_id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  requested_by: string;
  requested_at: string;
  approved_by?: string;
  approved_at?: string;
  rejected_by?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
}

export interface FieldLock {
  lock_id: string;
  project_id: string;
  entity_type: EntityType;
  entity_id: string;
  field_name: string;
  is_locked: boolean;
  locked_by: string;
  locked_at: string;
  locked_reason: string;
  unlock_request?: {
    requested_by: string;
    requested_at: string;
    reason: string;
    approved?: boolean;
  };
  created_at: string;
  updated_at: string;
}
