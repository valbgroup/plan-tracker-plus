export type ChangeType = 'PLAN' | 'REEL' | 'BASELINE' | 'ADMIN' | 'CONFIG';
export type CriticalityLevel = 'CRITIQUE' | 'MODERE' | 'FAIBLE' | 'INFO';
export type ValidationStatus = 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE' | 'NON_REQUIS';
export type BaselineStatus = 'ACTIVE' | 'ARCHIVEE' | 'SUSPENDUE';

export interface ChangeRecord {
  id: string;
  projectId: string;
  timestamp: Date;
  userId: string;
  userName: string;
  changeType: ChangeType;
  criticalityLevel: CriticalityLevel;
  section: 'Identification' | 'WBS' | 'Budget' | 'Stakeholders' | 'Resources' | 'Risks';
  elementModified: string;
  oldValue: string | number | boolean;
  newValue: string | number | boolean;
  justification: string;
  validationStatus: ValidationStatus;
  cascadeImpact: string[];
  attachments: string[];
}

export interface BaselineVersion {
  id: string;
  projectId: string;
  versionNumber: string;
  createdDate: Date;
  createdBy: string;
  changeCategory: 'STRUCTUREL' | 'BUDGETAIRE' | 'PLANNING' | 'GOUVERNANCE';
  modifiedItemsCount: number;
  reason: string;
  status: BaselineStatus;
  businessImpact: number;
}

export interface AuditRecord {
  id: string;
  portfolio?: string;
  auditWindow: {
    start: Date;
    end: Date;
  };
  eventType: 'CREATE' | 'UPDATE' | 'DELETE' | 'APPROVE' | 'REJECT';
  criticalityLevel: CriticalityLevel;
  userId: string;
  userName: string;
  affectedEntities: string[];
  anomaliesDetected: string[];
}

export interface AuditAnomaly {
  id: string;
  type: 'MASS_MODIFICATION' | 'OFFHOURS_ACTIVITY' | 'UNSTABLE_BASELINE' | 'CRITICAL_DELETION' | 'UNUSUAL_ACTIVITY';
  detectionTime: Date;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedRecords: string[];
  automatedAction?: string;
  requiresManualReview: boolean;
}
