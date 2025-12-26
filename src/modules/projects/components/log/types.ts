// Change Log Types for Phase 4

export type ChangeType = 'baseline' | 'operational';
export type ChangeStatus = 'pending' | 'approved' | 'rejected';

export interface BaselineChangeLog {
  id: string;
  fieldName: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  approvedBy?: string;
  approvedByName?: string;
  approvalDate?: string;
  status: ChangeStatus;
  justification?: string;
  version: number;
  projectId: string;
}

export interface OperationalChangeLog {
  id: string;
  section: string;
  fieldName: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  changedByName: string;
  changedAt: string;
  projectId: string;
}

export interface PendingChangeRequest {
  id: string;
  fieldName: string;
  fieldLabel: string;
  oldValue: string;
  newValue: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  status: ChangeStatus;
  justification?: string;
  projectId: string;
  approverComments?: string;
}

// Mock data generators
export const MOCK_BASELINE_CHANGES: BaselineChangeLog[] = [
  {
    id: 'bc-001',
    fieldName: 'date_fin_planifiée',
    fieldLabel: 'Project End Date',
    oldValue: '2024-12-31',
    newValue: '2025-02-28',
    requestedBy: 'user-pm-001',
    requestedByName: 'Ahmed Benali',
    requestedAt: '2024-11-15T10:30:00Z',
    approvedBy: 'user-pmo-001',
    approvedByName: 'Fatima Bouali',
    approvalDate: '2024-11-16T14:00:00Z',
    status: 'approved',
    justification: 'Extended timeline due to additional scope requirements from stakeholders',
    version: 2,
    projectId: 'proj-001',
  },
  {
    id: 'bc-002',
    fieldName: 'montant_budget_total',
    fieldLabel: 'Total Budget',
    oldValue: '450000',
    newValue: '500000',
    requestedBy: 'user-pm-001',
    requestedByName: 'Ahmed Benali',
    requestedAt: '2024-10-20T09:15:00Z',
    approvedBy: 'user-pmo-001',
    approvedByName: 'Fatima Bouali',
    approvalDate: '2024-10-21T11:30:00Z',
    status: 'approved',
    justification: 'Budget increase to accommodate new security requirements',
    version: 1,
    projectId: 'proj-001',
  },
  {
    id: 'bc-003',
    fieldName: 'phase_end_date',
    fieldLabel: 'Development Phase End Date',
    oldValue: '2024-09-30',
    newValue: '2024-10-15',
    requestedBy: 'user-pm-002',
    requestedByName: 'Karim Hadjadj',
    requestedAt: '2024-09-25T16:00:00Z',
    approvedBy: 'user-pmo-002',
    approvedByName: 'Samira Meziane',
    approvalDate: '2024-09-26T10:00:00Z',
    status: 'approved',
    justification: 'API integration delays from third-party vendor',
    version: 2,
    projectId: 'proj-001',
  },
  {
    id: 'bc-004',
    fieldName: 'date_debut_planifiée',
    fieldLabel: 'Project Start Date',
    oldValue: '2024-01-15',
    newValue: '2024-01-01',
    requestedBy: 'user-pm-001',
    requestedByName: 'Ahmed Benali',
    requestedAt: '2024-12-20T08:00:00Z',
    status: 'rejected',
    justification: 'Requested earlier start date for better planning',
    version: 2,
    projectId: 'proj-001',
  },
];

export const MOCK_OPERATIONAL_CHANGES: OperationalChangeLog[] = [
  {
    id: 'oc-001',
    section: 'Stakeholders',
    fieldName: 'team_member',
    fieldLabel: 'Team Member Added',
    oldValue: '-',
    newValue: 'Youcef Amrani (Developer)',
    changedBy: 'user-pm-001',
    changedByName: 'Ahmed Benali',
    changedAt: '2024-12-24T14:30:00Z',
    projectId: 'proj-001',
  },
  {
    id: 'oc-002',
    section: 'Resources',
    fieldName: 'resource_allocation',
    fieldLabel: 'Resource Allocation Updated',
    oldValue: '50%',
    newValue: '75%',
    changedBy: 'user-pm-001',
    changedByName: 'Ahmed Benali',
    changedAt: '2024-12-23T11:15:00Z',
    projectId: 'proj-001',
  },
  {
    id: 'oc-003',
    section: 'Risks',
    fieldName: 'risk_status',
    fieldLabel: 'Risk Status Changed',
    oldValue: 'Identified',
    newValue: 'Mitigating',
    changedBy: 'user-pm-002',
    changedByName: 'Karim Hadjadj',
    changedAt: '2024-12-22T09:45:00Z',
    projectId: 'proj-001',
  },
  {
    id: 'oc-004',
    section: 'Issues',
    fieldName: 'issue_priority',
    fieldLabel: 'Issue Priority Updated',
    oldValue: 'Medium',
    newValue: 'High',
    changedBy: 'user-pm-001',
    changedByName: 'Ahmed Benali',
    changedAt: '2024-12-21T16:20:00Z',
    projectId: 'proj-001',
  },
  {
    id: 'oc-005',
    section: 'WBS',
    fieldName: 'deliverable_progress',
    fieldLabel: 'Deliverable Progress Updated',
    oldValue: '45%',
    newValue: '65%',
    changedBy: 'user-pm-002',
    changedByName: 'Karim Hadjadj',
    changedAt: '2024-12-20T10:00:00Z',
    projectId: 'proj-001',
  },
];

export const MOCK_PENDING_REQUESTS: PendingChangeRequest[] = [
  {
    id: 'pr-001',
    fieldName: 'date_fin_planifiée',
    fieldLabel: 'Project End Date',
    oldValue: '2025-02-28',
    newValue: '2025-03-31',
    requestedBy: 'user-pm-001',
    requestedByName: 'Ahmed Benali',
    requestedAt: '2024-12-25T09:00:00Z',
    status: 'pending',
    justification: 'Additional testing phase required for security compliance',
    projectId: 'proj-001',
  },
  {
    id: 'pr-002',
    fieldName: 'phase_budget',
    fieldLabel: 'Development Phase Budget',
    oldValue: '150000',
    newValue: '175000',
    requestedBy: 'user-pm-002',
    requestedByName: 'Karim Hadjadj',
    requestedAt: '2024-12-24T15:30:00Z',
    status: 'pending',
    justification: 'Need additional resources for API optimization',
    projectId: 'proj-001',
  },
  {
    id: 'pr-003',
    fieldName: 'deliverable_scope',
    fieldLabel: 'Deliverable Scope',
    oldValue: 'Basic API endpoints',
    newValue: 'Full API with GraphQL support',
    requestedBy: 'user-pm-001',
    requestedByName: 'Ahmed Benali',
    requestedAt: '2024-12-23T11:00:00Z',
    status: 'pending',
    justification: 'Client requested GraphQL support for mobile app integration',
    projectId: 'proj-001',
  },
];
