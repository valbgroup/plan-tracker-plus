// Risk Types
export type RiskType = 
  | 'technical'
  | 'schedule'
  | 'budget'
  | 'resource'
  | 'external'
  | 'quality'
  | 'compliance'
  | 'other';

export type RiskResponse = 
  | 'mitigate'
  | 'avoid'
  | 'accept'
  | 'transfer'
  | 'escalate';

export type RiskStatus = 
  | 'identified'
  | 'assessed'
  | 'mitigating'
  | 'triggered'
  | 'closed';

export interface Risk {
  id: string;
  title: string;
  description: string;
  type: RiskType;
  probability: number; // 1-5
  impact: number; // 1-5
  score: number; // probability × impact (auto-calculated)
  response: RiskResponse;
  ownerId: string;
  ownerName?: string;
  targetDate: string;
  observation: string;
  status: RiskStatus;
  linkedPhaseId?: string;
  linkedDeliverableId?: string;
  createdAt: string;
  updatedAt: string;
  // Tracking fields
  actualProbability?: number;
  actualImpact?: number;
  responseEffectiveness?: number; // 0-100%
  trackingComments?: string;
}

// Issue Types
export type IssueCategory = 
  | 'technical'
  | 'organizational'
  | 'resource'
  | 'budget'
  | 'other';

export type IssuePriority = 'high' | 'medium' | 'low';

export type IssueStatus = 'todo' | 'in_progress' | 'done' | 'blocked';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  action: string;
  ownerId: string;
  ownerName?: string;
  targetDate: string;
  status: IssueStatus;
  linkedPhaseId?: string;
  linkedDeliverableId?: string;
  createdAt: string;
  updatedAt: string;
  // Tracking fields
  progress?: number; // 0-100%
  blockedReason?: string;
  trackingComments?: string;
}

// Lookup options
export const RISK_TYPES: { value: RiskType; label: string }[] = [
  { value: 'technical', label: 'Technical Risk' },
  { value: 'schedule', label: 'Schedule Risk' },
  { value: 'budget', label: 'Budget Risk' },
  { value: 'resource', label: 'Resource Risk' },
  { value: 'external', label: 'External Risk' },
  { value: 'quality', label: 'Quality Risk' },
  { value: 'compliance', label: 'Compliance Risk' },
  { value: 'other', label: 'Other' },
];

export const RISK_RESPONSES: { value: RiskResponse; label: string }[] = [
  { value: 'mitigate', label: 'Mitigate' },
  { value: 'avoid', label: 'Avoid' },
  { value: 'accept', label: 'Accept' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'escalate', label: 'Escalate' },
];

export const RISK_STATUSES: { value: RiskStatus; label: string }[] = [
  { value: 'identified', label: 'Identified' },
  { value: 'assessed', label: 'Assessed' },
  { value: 'mitigating', label: 'Mitigating' },
  { value: 'triggered', label: 'Triggered' },
  { value: 'closed', label: 'Closed' },
];

export const ISSUE_CATEGORIES: { value: IssueCategory; label: string }[] = [
  { value: 'technical', label: 'Technical' },
  { value: 'organizational', label: 'Organizational' },
  { value: 'resource', label: 'Resource' },
  { value: 'budget', label: 'Budget' },
  { value: 'other', label: 'Other' },
];

export const ISSUE_PRIORITIES: { value: IssuePriority; label: string }[] = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
];

export const ISSUE_STATUSES: { value: IssueStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'blocked', label: 'Blocked' },
];

// Helper functions
export function getRiskScoreColor(score: number): string {
  if (score <= 5) return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  if (score <= 10) return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
  if (score <= 15) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
  return 'bg-destructive/10 text-destructive border-destructive/20';
}

export function getRiskScoreLevel(score: number): string {
  if (score <= 5) return 'Low';
  if (score <= 10) return 'Medium';
  if (score <= 15) return 'High';
  return 'Critical';
}

export function getIssuePriorityColor(priority: IssuePriority): string {
  switch (priority) {
    case 'high': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'medium': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'low': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
  }
}

export function getIssueStatusColor(status: IssueStatus): string {
  switch (status) {
    case 'done': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'in_progress': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'blocked': return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'todo': return 'bg-muted text-muted-foreground border-border';
  }
}
