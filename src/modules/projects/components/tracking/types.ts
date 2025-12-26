// Tracking Types for Project Data Input

export interface PhaseTrackingRow {
  phaseId: string;
  phaseName: string;
  plannedStartDate: string;
  realStartDate: string | null;
  plannedEndDate: string;
  realEndDate: string | null;
  plannedDuration: number;
  realDuration: number | null;
  percentComplete: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  variance: number;
  notes: string;
  updatedAt: string;
  updatedBy: string;
}

export interface DeliverableTrackingRow {
  deliverableId: string;
  deliverableName: string;
  phaseId: string;
  phaseName: string;
  plannedDate: string;
  realDate: string | null;
  plannedEffort: number;
  realEffort: number | null;
  percentComplete: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  qualityMetrics: {
    defects: number;
  };
  acceptanceStatus: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  acceptedBy: string | null;
  variance: number;
  notes: string;
  updatedAt: string;
  updatedBy: string;
}

export interface WBSNode {
  workPackageId: string;
  name: string;
  level: number;
  parentId: string | null;
  children: WBSNode[];
  plannedWork: number;
  realWorkDone: number | null;
  percentComplete: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
  responsiblePerson: string;
  variance: number;
  notes: string;
  totalPlanned: number;
  totalReal: number;
  totalPercent: number;
  isExpanded?: boolean;
}

export interface BudgetTrackingRow {
  budgetLineId: string;
  category: string;
  plannedBudget: number;
  actualConsumption: number | null;
  remainingBudget: number;
  percentConsumed: number;
  forecastAtCompletion: number;
  variance: number;
  variancePercent: number;
  status: 'ON_BUDGET' | 'WARNING' | 'OVER_BUDGET';
  notes: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ResourceTrackingRow {
  assignmentId: string;
  resourceId: string;
  resourceName: string;
  role: string;
  phaseId: string;
  phaseName: string;
  plannedAllocationPercent: number;
  realAllocationPercent: number;
  plannedHours: number;
  realHours: number;
  costRate: number;
  actualCost: number;
  utilizationPercent: number;
  availability: 'AVAILABLE' | 'UNAVAILABLE' | 'PARTIAL';
  variance: number;
  notes: string;
  updatedAt: string;
  updatedBy: string;
}

export interface StakeholderTrackingRow {
  stakeholderId: string;
  name: string;
  role: string;
  interest: 'HIGH' | 'MEDIUM' | 'LOW';
  plannedEngagementLevel: 'HIGHLY_ENGAGED' | 'ENGAGED' | 'INFORMED' | 'AT_RISK' | 'DISENGAGED';
  realEngagementLevel: 'HIGHLY_ENGAGED' | 'ENGAGED' | 'INFORMED' | 'AT_RISK' | 'DISENGAGED';
  communicationFrequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY';
  satisfactionLevel: number;
  lastCommunicationDate: string;
  issuesRaised: number;
  issuesList: string[];
  status: 'GREEN' | 'YELLOW' | 'RED';
  nextActionItem: string;
  actionDueDate: string;
  notes: string;
  updatedAt: string;
  updatedBy: string;
}

// Helper function to calculate status based on variance
export function calculatePhaseStatus(
  plannedEnd: string,
  realEnd: string | null,
  percentComplete: number
): 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK' {
  if (!realEnd && percentComplete >= 95) return 'ON_TRACK';
  
  const today = new Date();
  const planned = new Date(plannedEnd);
  const daysRemaining = Math.ceil((planned.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  if (percentComplete >= 100) return 'ON_TRACK';
  if (daysRemaining < 0 && percentComplete < 100) return 'OFF_TRACK';
  if (daysRemaining < 7 && percentComplete < 80) return 'AT_RISK';
  if (percentComplete < 50 && daysRemaining < 14) return 'AT_RISK';
  
  return 'ON_TRACK';
}

export function calculateBudgetStatus(
  percentConsumed: number,
  variance: number
): 'ON_BUDGET' | 'WARNING' | 'OVER_BUDGET' {
  if (variance < 0) return 'OVER_BUDGET';
  if (percentConsumed > 90) return 'WARNING';
  if (percentConsumed > 80) return 'WARNING';
  return 'ON_BUDGET';
}

export function calculateStakeholderStatus(
  satisfactionLevel: number,
  engagementLevel: string
): 'GREEN' | 'YELLOW' | 'RED' {
  if (satisfactionLevel <= 2 || engagementLevel === 'DISENGAGED' || engagementLevel === 'AT_RISK') {
    return 'RED';
  }
  if (satisfactionLevel === 3 || engagementLevel === 'INFORMED') {
    return 'YELLOW';
  }
  return 'GREEN';
}
