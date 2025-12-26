import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useUpdateProject } from '@/hooks/useProject';
import { usePhases, useDeliverables, useBudgetEnvelopes } from '@/hooks/usePlanData';
import { ProjectDetailsContext } from '../layout/ProjectDetailsLayout';
import { PageContainer } from '@/components/layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Switch } from '@/components/ui/switch';
import { BaselineSelector, Baseline } from '../components/BaselineSelector';
import { VarianceAnalysis, Variance } from '../components/VarianceAnalysis';
import { BaselineControlHeader, BaselineStatus } from '../components/BaselineControlHeader';
import { BaselineImpactIcon } from '../components/BaselineImpactIcon';
import { BaselineChangeRequestModal } from '../components/BaselineChangeRequestModal';
import { MasterDataDropdown } from '../components/MasterDataDropdown';
import { KeyMilestonesTable, Milestone } from '../components/KeyMilestonesTable';
import { AutoSaveIndicator } from '../components/AutoSaveIndicator';
import { PhasesTable, PhaseData } from '../components/wbs/PhasesTable';
import { DeliverablesTable, DeliverableData } from '../components/wbs/DeliverablesTable';
import { GovernanceTable, GovernanceInstanceData } from '../components/stakeholders/GovernanceTable';
import { ProjectTeamTable, TeamMemberData } from '../components/stakeholders/ProjectTeamTable';
import { InternalStakeholdersTable, InternalStakeholderData } from '../components/stakeholders/InternalStakeholdersTable';
import { ExternalStakeholdersTable, ExternalStakeholderData } from '../components/stakeholders/ExternalStakeholdersTable';
import { BudgetEnvelopesTable, BudgetEnvelopeData } from '../components/budget/BudgetEnvelopesTable';
import { MonthlyBudgetTable, MonthlyBudgetData } from '../components/budget/MonthlyBudgetTable';
import { ResourcesTable, ResourceData } from '../components/resources/ResourcesTable';
import { BaselineVersionsTable, BaselineVersionData } from '../components/audit/BaselineVersionsTable';
import { ModificationLogTable, ModificationLogData } from '../components/audit/ModificationLogTable';
import { RisksPlanSection } from '../components/risks';
import { IssuesPlanSection } from '../components/issues';
import { Risk, Issue } from '../types/risks-issues.types';
import { ChangeRequestsTable, ChangeRequestData } from '../components/audit/ChangeRequestsTable';
import { 
  BaselineChangeLogTab, 
  OperationalChangeLogTab, 
  PendingChangeRequestsTab,
  BaselineChangeLog,
  OperationalChangeLog,
  PendingChangeRequest,
} from '../components/log';
import { useRBAC } from '@/hooks/useRBAC';
import {
  usePortfolios,
  usePrograms,
  useProjectTypes,
  useProjectNatures,
  useCurrencies,
  useOrgStructures,
  useExternalOrgs,
  useEmployeeOptions,
  useLifecycleApproaches,
  numberToWords,
} from '../hooks/useMasterDataSelects';
import {
  MOCK_DELIVERABLE_TYPES,
  MOCK_MEMBER_ROLES,
  MOCK_PROJECT_ROLES,
  MOCK_ENVELOPE_TYPES,
  MOCK_FUNDING_SOURCES,
  MOCK_BUDGET_TYPES,
  MOCK_EXTERNAL_CONTACTS,
  MOCK_RESOURCES,
  MOCK_RESOURCE_TYPES,
  MOCK_RESOURCE_FAMILIES,
} from '@/data/masterDataMock';
import { 
  Save, 
  Edit2, 
  X, 
  AlertCircle, 
  CheckCircle,
  FileText,
  Users,
  DollarSign,
  Calendar,
  ClipboardList,
  History,
  Loader2,
  ChevronDown,
  ChevronRight,
  Lock,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Type for baseline field state
interface BaselineFieldState {
  isBaseline: boolean;
  isPending: boolean;
  pendingValue?: any;
}

// Mock baselines for demo
const MOCK_BASELINES: Baseline[] = [
  { id: 'bl-1', version: 1, createdDate: new Date('2024-01-15'), createdBy: 'System', description: 'Initial baseline', status: 'superseded' },
  { id: 'bl-2', version: 2, createdDate: new Date('2024-03-01'), createdBy: 'Admin', description: 'Post-planning baseline', status: 'active' },
];

type TabId = 'identification' | 'wbs' | 'stakeholders' | 'resources' | 'budget' | 'risks' | 'log';

interface FormData {
  // Basic Info
  libellé: string;
  shortTitle: string;
  code: string;
  charterRef: string;
  description: string;
  // Dates
  date_debut_planifiée: string;
  date_fin_planifiée: string;
  // Principal Actors
  provider_id: string;
  client_id: string;
  sponsor_id: string;
  manager_id: string;
  // Financial
  currency_id: string;
  montant_budget_total: number;
  budgetWords: string;
  // Classification
  portfolio_id: string;
  program_id: string;
  projectType_id: string;
  projectNature_id: string;
  lifecycle_id: string;
  // Milestones
  milestones: Milestone[];
}

interface ValidationErrors {
  [key: string]: string;
}

export const ProjectPlanPage: React.FC = () => {
  const { project, isLocked } = useOutletContext<ProjectDetailsContext>();
  const updateProject = useUpdateProject();
  
  // RBAC Hook
  const { permissions, isPMO, isReadOnly } = useRBAC();
  const canEdit = permissions.canEditTabs1to5 && !isLocked;
  
  const [activeTab, setActiveTab] = useState<TabId>('identification');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>('bl-2');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [baselineStatus, setBaselineStatus] = useState<BaselineStatus>('draft');
  const [hasModifications, setHasModifications] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Collapsible sections state
  const [governanceOpen, setGovernanceOpen] = useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const [externalOpen, setExternalOpen] = useState(false);

  // Baseline field marking state
  const [baselineFields, setBaselineFields] = useState<Record<string, BaselineFieldState>>({
    // Auto-baseline fields (always marked, no toggle)
    projectName: { isBaseline: true, isPending: false },
    startDate: { isBaseline: true, isPending: false },
    endDate: { isBaseline: true, isPending: false },
    globalBudget: { isBaseline: true, isPending: false },
    // Toggleable baseline fields
    projectManager: { isBaseline: false, isPending: false },
    lifecycleApproach: { isBaseline: false, isPending: false },
    projectNature: { isBaseline: false, isPending: false },
    projectType: { isBaseline: false, isPending: false },
  });
  const [baselineFieldLoading, setBaselineFieldLoading] = useState<Record<string, boolean>>({});

  // Baseline change request modal state
  const [changeRequestModal, setChangeRequestModal] = useState<{
    isOpen: boolean;
    fieldName: string;
    fieldLabel: string;
    oldValue: any;
    newValue: any;
    onConfirm: (justification?: string) => void;
  }>({
    isOpen: false,
    fieldName: '',
    fieldLabel: '',
    oldValue: null,
    newValue: null,
    onConfirm: () => {},
  });
  const [isSubmittingChangeRequest, setIsSubmittingChangeRequest] = useState(false);

  // Auto-baseline fields that cannot be toggled
  const autoBaselineFields = ['projectName', 'startDate', 'endDate', 'globalBudget'];
  const isAutoBaseline = (fieldName: string) => autoBaselineFields.includes(fieldName);

  // Toggle baseline marking for a field
  const handleToggleBaselineField = async (fieldName: string, isMarked: boolean) => {
    if (isAutoBaseline(fieldName)) return;
    
    setBaselineFieldLoading(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setBaselineFields(prev => ({
        ...prev,
        [fieldName]: { ...prev[fieldName], isBaseline: isMarked }
      }));
      
      toast.success(
        isMarked 
          ? `${fieldName} marked as baseline field` 
          : `${fieldName} removed from baseline`
      );
    } catch (error) {
      toast.error('Failed to update baseline status');
    } finally {
      setBaselineFieldLoading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  // Check if field change requires change request
  const handleBaselineProtectedChange = (
    fieldName: string,
    fieldLabel: string,
    oldValue: any,
    newValue: any,
    updateFn: () => void
  ) => {
    const fieldState = baselineFields[fieldName];
    
    if (fieldState?.isBaseline && baselineStatus === 'validated') {
      // Field is baseline-protected and validated - show change request modal
      setChangeRequestModal({
        isOpen: true,
        fieldName,
        fieldLabel,
        oldValue,
        newValue,
        onConfirm: async (justification?: string) => {
          setIsSubmittingChangeRequest(true);
          try {
            // Simulate API call to submit change request
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Create pending change request
            const newRequest: PendingChangeRequest = {
              id: `pr-${Date.now()}`,
              fieldName,
              fieldLabel,
              oldValue: String(oldValue),
              newValue: String(newValue),
              requestedBy: 'current-user',
              requestedByName: 'Current User',
              requestedAt: new Date().toISOString(),
              status: 'pending',
              justification,
              projectId: project?.project_id || 'proj-001',
            };
            setPendingRequests(prev => [newRequest, ...prev]);
            
            // Mark field as pending
            setBaselineFields(prev => ({
              ...prev,
              [fieldName]: { ...prev[fieldName], isPending: true, pendingValue: newValue }
            }));
            
            toast.success('Change request submitted for PMO approval', {
              description: `${fieldLabel} change is pending review`,
            });
            setChangeRequestModal(prev => ({ ...prev, isOpen: false }));
          } catch (error) {
            toast.error('Failed to submit change request');
          } finally {
            setIsSubmittingChangeRequest(false);
          }
        }
      });
    } else if (fieldState?.isBaseline && baselineStatus !== 'validated') {
      // Baseline field but not validated yet - allow direct edit
      updateFn();
      toast.success(`${fieldLabel} updated`);
    } else {
      // Field is not baseline-protected - apply change directly and log
      updateFn();
      addOperationalLog('Identification', fieldLabel, String(oldValue), String(newValue));
      toast.success(`${fieldLabel} updated`);
    }
  };

  // Render baseline toggle with badge
  const renderBaselineToggle = (fieldName: string, fieldLabel: string) => {
    const isAuto = isAutoBaseline(fieldName);
    const fieldState = baselineFields[fieldName] || { isBaseline: false, isPending: false };
    const isLoading = baselineFieldLoading[fieldName];

    return (
      <div className="flex items-center gap-2">
        {!isAuto && (
          <>
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Switch
                checked={fieldState.isBaseline}
                onCheckedChange={(checked) => handleToggleBaselineField(fieldName, checked)}
                disabled={isLocked || !isEditing}
                className="data-[state=checked]:bg-primary"
              />
            )}
          </>
        )}
        
        {fieldState.isPending && (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs">
            ⏳ Pending
          </Badge>
        )}
        
        {(fieldState.isBaseline || isAuto) && !fieldState.isPending && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1">
            <Lock className="h-3 w-3" />
            Baseline
          </Badge>
        )}
      </div>
    );
  };

  // WBS State (Phases + Deliverables)
  const [wbsPhases, setWbsPhases] = useState<PhaseData[]>([
    { id: 'phase-1', title: 'Initiation', startDate: '2025-01-15', endDate: '2025-02-15', coefficient: 10, remarks: '', lastModifiedBy: 'Admin', lastModifiedAt: '2025-01-10T10:00:00Z' },
    { id: 'phase-2', title: 'Planning', startDate: '2025-02-16', endDate: '2025-04-15', coefficient: 20, remarks: '', lastModifiedBy: 'Admin', lastModifiedAt: '2025-01-10T10:00:00Z' },
    { id: 'phase-3', title: 'Execution', startDate: '2025-04-16', endDate: '2025-09-15', coefficient: 50, remarks: '', lastModifiedBy: 'Admin', lastModifiedAt: '2025-01-10T10:00:00Z' },
    { id: 'phase-4', title: 'Closure', startDate: '2025-09-16', endDate: '2025-12-31', coefficient: 20, remarks: '', lastModifiedBy: 'Admin', lastModifiedAt: '2025-01-10T10:00:00Z' },
  ]);
  const [initialWbsPhases, setInitialWbsPhases] = useState<PhaseData[]>([...wbsPhases]);

  const [wbsDeliverables, setWbsDeliverables] = useState<DeliverableData[]>([
    { id: 'del-1', title: 'Project Charter', phaseId: 'phase-1', typeId: '1', duration: 5, deliveryDate: '2025-02-01', coefficient: 15, remarks: '' },
    { id: 'del-2', title: 'Requirement Document', phaseId: 'phase-2', typeId: '4', duration: 10, deliveryDate: '2025-03-15', coefficient: 25, remarks: '' },
    { id: 'del-3', title: 'System Architecture', phaseId: 'phase-2', typeId: '4', duration: 8, deliveryDate: '2025-04-01', coefficient: 20, predecessorId: 'del-2', relationType: 'FD', remarks: '' },
    { id: 'del-4', title: 'Core Module', phaseId: 'phase-3', typeId: '2', duration: 60, deliveryDate: '2025-07-15', coefficient: 30, predecessorId: 'del-3', relationType: 'FD', remarks: '' },
    { id: 'del-5', title: 'Final Report', phaseId: 'phase-4', typeId: '1', duration: 10, deliveryDate: '2025-12-15', coefficient: 10, predecessorId: 'del-4', relationType: 'FD', remarks: '' },
  ]);
  const [initialWbsDeliverables, setInitialWbsDeliverables] = useState<DeliverableData[]>([...wbsDeliverables]);

  // Stakeholders State
  const [governanceInstances, setGovernanceInstances] = useState<GovernanceInstanceData[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([
    { id: 'team-1', roleId: '1', employeeId: '1', allocationPercent: 100, startDate: '2025-01-15', endDate: '2025-12-31', remarks: '' },
  ]);
  const [initialTeamMembers, setInitialTeamMembers] = useState<TeamMemberData[]>([...teamMembers]);
  const [internalStakeholders, setInternalStakeholders] = useState<InternalStakeholderData[]>([]);
  const [externalStakeholders, setExternalStakeholders] = useState<ExternalStakeholderData[]>([]);

  // Budget State
  const [budgetEnvelopes, setBudgetEnvelopes] = useState<BudgetEnvelopeData[]>([
    { id: 'env-1', typeId: '1', amount: 50000000, fundingSourceId: '3' },
    { id: 'env-2', typeId: '2', amount: 20000000, fundingSourceId: '3' },
    { id: 'env-3', typeId: '3', amount: 25000000, fundingSourceId: '1' },
    { id: 'env-4', typeId: '5', amount: 5000000, fundingSourceId: '3' },
  ]);
  const [initialBudgetEnvelopes, setInitialBudgetEnvelopes] = useState<BudgetEnvelopeData[]>([...budgetEnvelopes]);

  const [monthlyBudget, setMonthlyBudget] = useState<MonthlyBudgetData[]>([
    { month: '01', monthLabel: 'January', amount: 8333333 },
    { month: '02', monthLabel: 'February', amount: 8333333 },
    { month: '03', monthLabel: 'March', amount: 8333333 },
    { month: '04', monthLabel: 'April', amount: 8333333 },
    { month: '05', monthLabel: 'May', amount: 8333333 },
    { month: '06', monthLabel: 'June', amount: 8333333 },
    { month: '07', monthLabel: 'July', amount: 8333333 },
    { month: '08', monthLabel: 'August', amount: 8333333 },
    { month: '09', monthLabel: 'September', amount: 8333333 },
    { month: '10', monthLabel: 'October', amount: 8333333 },
    { month: '11', monthLabel: 'November', amount: 8333333 },
    { month: '12', monthLabel: 'December', amount: 8333337 },
  ]);

  // Resources State (TAB.4)
  const [resources, setResources] = useState<ResourceData[]>([
    { id: 'res-1', resourceId: '1', startDate: '2025-02-01', endDate: '2025-06-30', quantity: 5, unitRate: 150000 },
    { id: 'res-2', resourceId: '2', startDate: '2025-01-15', endDate: '2025-12-31', quantity: 2, unitRate: 500000 },
    { id: 'res-3', resourceId: '3', startDate: '2025-03-01', endDate: '2025-09-30', quantity: 1, unitRate: 0 },
  ]);
  const [initialResources, setInitialResources] = useState<ResourceData[]>([...resources]);

  // Risks State (TAB.6 - Risks & Issues)
  const [risks, setRisks] = useState<Risk[]>([
    {
      id: 'risk-1',
      title: 'Resource Shortage',
      description: 'Senior developer may not be available during critical phase',
      type: 'resource',
      probability: 3,
      impact: 4,
      score: 12,
      response: 'mitigate',
      ownerId: '1',
      ownerName: 'Ahmed Ben Ali',
      targetDate: '2025-02-15',
      observation: 'Plan to secure backup resources from partner company',
      status: 'identified',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-10',
    },
    {
      id: 'risk-2',
      title: 'Schedule Delay',
      description: 'Delays in requirements phase may impact downstream deliverables',
      type: 'schedule',
      probability: 2,
      impact: 3,
      score: 6,
      response: 'mitigate',
      ownerId: '2',
      ownerName: 'Fatima Bouali',
      targetDate: '2025-02-28',
      observation: 'Buffer added in schedule',
      status: 'assessed',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
    },
  ]);

  // Issues State (TAB.6 - Risks & Issues)
  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 'issue-1',
      title: 'DB Connection Pooling',
      description: 'Current implementation has connection leak issues under load',
      category: 'technical',
      priority: 'high',
      action: 'Implement HikariCP connection pool by Jan 25',
      ownerId: '2',
      ownerName: 'Fatima Bouali',
      targetDate: '2025-01-25',
      status: 'done',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-25',
    },
    {
      id: 'issue-2',
      title: 'API Authentication',
      description: 'Need to implement OAuth 2.0 for API security',
      category: 'technical',
      priority: 'high',
      action: 'Integrate OAuth provider and update API endpoints',
      ownerId: '1',
      ownerName: 'Ahmed Ben Ali',
      targetDate: '2025-02-15',
      status: 'in_progress',
      progress: 60,
      createdAt: '2025-01-10',
      updatedAt: '2025-02-10',
    },
  ]);

  // Employees for Risk/Issue owner selection
  const riskIssueEmployees = [
    { id: '1', name: 'Ahmed Ben Ali' },
    { id: '2', name: 'Fatima Bouali' },
    { id: '3', name: 'Karim Hamdi' },
  ];

  // Phases and deliverables for linking
  const phasesForLinking = wbsPhases.map(p => ({ id: p.id, title: p.title }));
  const deliverablesForLinking = wbsDeliverables.map(d => ({ id: d.id, title: d.title }));

  // Risk handlers
  const handleAddRisk = async (riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => {
    const now = new Date().toISOString();
    const newRisk: Risk = {
      ...riskData,
      id: `risk-${Date.now()}`,
      score: riskData.probability * riskData.impact,
      createdAt: now,
      updatedAt: now,
    };
    setRisks(prev => [...prev, newRisk]);
    setHasModifications(true);
  };

  const handleUpdateRisk = async (riskId: string, riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => {
    setRisks(prev => prev.map(r =>
      r.id === riskId
        ? { ...r, ...riskData, score: riskData.probability * riskData.impact, updatedAt: new Date().toISOString() }
        : r
    ));
    setHasModifications(true);
  };

  const handleDeleteRisk = async (riskId: string) => {
    setRisks(prev => prev.filter(r => r.id !== riskId));
    setHasModifications(true);
  };

  // Issue handlers
  const handleAddIssue = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newIssue: Issue = {
      ...issueData,
      id: `issue-${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    setIssues(prev => [...prev, newIssue]);
    setHasModifications(true);
  };

  const handleUpdateIssue = async (issueId: string, issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIssues(prev => prev.map(i =>
      i.id === issueId
        ? { ...i, ...issueData, updatedAt: new Date().toISOString() }
        : i
    ));
    setHasModifications(true);
  };

  const handleDeleteIssue = async (issueId: string) => {
    setIssues(prev => prev.filter(i => i.id !== issueId));
    setHasModifications(true);
  };

  // Audit Log State (TAB.6)
  const [baselineVersions, setBaselineVersions] = useState<BaselineVersionData[]>([
    { id: 'v-1', versionNumber: 'V1.0', createdDate: new Date('2025-01-15'), createdBy: 'Ahmed Benali', createdByEmail: 'ahmed@company.dz', changeType: 'STRUCTURAL', modifiedItemsCount: 5, modifiedItems: ['Project.Title', 'Phase.1', 'Phase.2', 'Deliverable.1', 'Budget.Total'], justification: 'Initial baseline after planning phase', status: 'ARCHIVED', businessImpact: 3 },
    { id: 'v-2', versionNumber: 'V1.1', createdDate: new Date('2025-02-20'), createdBy: 'Fatima Kaci', createdByEmail: 'fatima@company.dz', changeType: 'BUDGETARY', modifiedItemsCount: 2, modifiedItems: ['Budget.Envelope.Personnel', 'Budget.Monthly.March'], justification: 'Budget adjustment for new resources', status: 'ACTIVE', businessImpact: 5 },
  ]);

  const [modificationLog, setModificationLog] = useState<ModificationLogData[]>([
    { id: 'log-1', timestamp: new Date('2025-02-20T14:35:00'), changedBy: 'Fatima Kaci', changedByRole: 'PMO', actionType: 'Modified', modifiedElement: 'Budget.Envelope.Personnel', oldValue: '40,000,000', newValue: '50,000,000', hasBaselineImpact: true, justification: 'Additional staff required for Phase 3' },
    { id: 'log-2', timestamp: new Date('2025-02-18T10:15:00'), changedBy: 'Ahmed Benali', changedByRole: 'Project Manager', actionType: 'Created', modifiedElement: 'Deliverable.SystemArchitecture', oldValue: '-', newValue: 'System Architecture v1.0', hasBaselineImpact: true },
    { id: 'log-3', timestamp: new Date('2025-02-15T16:20:00'), changedBy: 'Karim Hamdi', changedByRole: 'Team Member', actionType: 'Modified', modifiedElement: 'Phase.Planning.EndDate', oldValue: '2025-04-01', newValue: '2025-04-15', hasBaselineImpact: true, justification: 'Extended due to additional requirements' },
    { id: 'log-4', timestamp: new Date('2025-01-15T09:00:00'), changedBy: 'System', changedByRole: 'System', actionType: 'Validated', modifiedElement: 'Baseline.V1.0', oldValue: 'Draft', newValue: 'Validated', hasBaselineImpact: false },
  ]);

  const [changeRequests, setChangeRequests] = useState<ChangeRequestData[]>([
    { id: 'cr-1', requestNumber: 'CHG-001', requestDate: new Date('2025-02-25'), requestorName: 'Ahmed Benali', requestorEmail: 'ahmed@company.dz', changeType: 'MAJOR', description: 'Request to extend project timeline by 2 weeks due to additional scope', status: 'PENDING', affectedFields: ['Phase.Execution.EndDate', 'Phase.Closure.StartDate', 'Phase.Closure.EndDate'], timelineImpact: '+2 weeks', riskLevel: 6 },
    { id: 'cr-2', requestNumber: 'CHG-002', requestDate: new Date('2025-02-20'), requestorName: 'Fatima Kaci', requestorEmail: 'fatima@company.dz', changeType: 'MINOR', description: 'Budget reallocation from Travel to Equipment envelope', status: 'APPROVED', approverName: 'Director PMO', approverEmail: 'pmo@company.dz', approvalComments: 'Approved - sensible reallocation', affectedFields: ['Budget.Envelope.Travel', 'Budget.Envelope.Equipment'], budgetImpact: 0, riskLevel: 2 },
  ]);

  // Phase 4 Log State
  const [baselineChanges, setBaselineChanges] = useState<BaselineChangeLog[]>([
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
      justification: 'Extended timeline due to additional scope requirements',
      version: 2,
      projectId: project?.project_id || 'proj-001',
    },
    {
      id: 'bc-002',
      fieldName: 'montant_budget_total',
      fieldLabel: 'Total Budget',
      oldValue: '450,000 DZD',
      newValue: '500,000 DZD',
      requestedBy: 'user-pm-001',
      requestedByName: 'Ahmed Benali',
      requestedAt: '2024-10-20T09:15:00Z',
      approvedBy: 'user-pmo-001',
      approvedByName: 'Fatima Bouali',
      approvalDate: '2024-10-21T11:30:00Z',
      status: 'approved',
      justification: 'Budget increase to accommodate new security requirements',
      version: 1,
      projectId: project?.project_id || 'proj-001',
    },
  ]);

  const [operationalChanges, setOperationalChanges] = useState<OperationalChangeLog[]>([
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
      projectId: project?.project_id || 'proj-001',
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
      projectId: project?.project_id || 'proj-001',
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
      projectId: project?.project_id || 'proj-001',
    },
  ]);

  const [pendingRequests, setPendingRequests] = useState<PendingChangeRequest[]>([
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
      projectId: project?.project_id || 'proj-001',
    },
    {
      id: 'pr-002',
      fieldName: 'montant_budget_total',
      fieldLabel: 'Total Budget',
      oldValue: '500,000 DZD',
      newValue: '550,000 DZD',
      requestedBy: 'user-pm-002',
      requestedByName: 'Karim Hadjadj',
      requestedAt: '2024-12-24T15:30:00Z',
      status: 'pending',
      justification: 'Need additional resources for API optimization',
      projectId: project?.project_id || 'proj-001',
    },
  ]);

  // Current baseline version
  const [currentBaselineVersion, setCurrentBaselineVersion] = useState<number>(1.1);

  // PMO Approval/Rejection Handlers
  const handleApproveRequest = async (requestId: string, comments?: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    // Increment version
    const newVersion = Number((currentBaselineVersion + 0.1).toFixed(1));
    setCurrentBaselineVersion(newVersion);

    // Move to baseline changes
    const approvedChange: BaselineChangeLog = {
      ...request,
      approvedBy: 'current-user',
      approvedByName: 'Current User (PMO)',
      approvalDate: new Date().toISOString(),
      status: 'approved',
      version: newVersion,
    };
    setBaselineChanges(prev => [approvedChange, ...prev]);

    // Remove from pending
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));

    // Apply the change to the form (if applicable)
    if (request.fieldName === 'date_fin_planifiée') {
      setFormData(prev => ({ ...prev, date_fin_planifiée: request.newValue }));
    } else if (request.fieldName === 'montant_budget_total') {
      const budgetValue = parseInt(request.newValue.replace(/[^0-9]/g, ''));
      if (!isNaN(budgetValue)) {
        setFormData(prev => ({ ...prev, montant_budget_total: budgetValue }));
      }
    }

    toast.success(`Change approved! Baseline updated to v${newVersion}`, {
      description: `${request.fieldLabel} has been updated`,
    });
  };

  const handleRejectRequest = async (requestId: string, reason: string) => {
    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    // Move to baseline changes with rejected status
    const rejectedChange: BaselineChangeLog = {
      ...request,
      approvedBy: 'current-user',
      approvedByName: 'Current User (PMO)',
      approvalDate: new Date().toISOString(),
      status: 'rejected',
      version: currentBaselineVersion,
    };
    setBaselineChanges(prev => [rejectedChange, ...prev]);

    // Remove from pending
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));

    toast.success('Change request rejected', {
      description: 'The requester will be notified',
    });
  };

  // Add operational change log entry
  const addOperationalLog = (section: string, fieldLabel: string, oldValue: string, newValue: string) => {
    const newLog: OperationalChangeLog = {
      id: `oc-${Date.now()}`,
      section,
      fieldName: fieldLabel.toLowerCase().replace(/\s+/g, '_'),
      fieldLabel,
      oldValue,
      newValue,
      changedBy: 'current-user',
      changedByName: 'Current User',
      changedAt: new Date().toISOString(),
      projectId: project?.project_id || 'proj-001',
    };
    setOperationalChanges(prev => [newLog, ...prev]);
  };

  
  // Form state for editing
  const [formData, setFormData] = useState<FormData>({
    libellé: project?.libellé || '',
    shortTitle: '',
    code: project?.code || '',
    charterRef: '',
    description: project?.description || '',
    date_debut_planifiée: project?.date_debut_planifiée || '',
    date_fin_planifiée: project?.date_fin_planifiée || '',
    provider_id: '',
    client_id: '',
    sponsor_id: '',
    manager_id: project?.created_by || '',
    currency_id: '1', // Default DZD
    montant_budget_total: project?.montant_budget_total || 0,
    budgetWords: '',
    portfolio_id: '1', // Default Global
    program_id: '',
    projectType_id: '',
    projectNature_id: '',
    lifecycle_id: '',
    milestones: [],
  });

  // Initial form data for change detection
  const [initialFormData, setInitialFormData] = useState<FormData | null>(null);

  // Master Data hooks
  const { data: portfolios = [], isLoading: portfoliosLoading } = usePortfolios();
  const { data: programs = [], isLoading: programsLoading } = usePrograms(formData.portfolio_id);
  const { data: projectTypes = [], isLoading: typesLoading } = useProjectTypes();
  const { data: projectNatures = [], isLoading: naturesLoading } = useProjectNatures();
  const { data: currencies = [], isLoading: currenciesLoading } = useCurrencies();
  const { data: orgStructures = [], isLoading: orgsLoading } = useOrgStructures();
  const { data: externalOrgs = [], isLoading: externalOrgsLoading } = useExternalOrgs();
  const { data: employees = [], isLoading: employeesLoading } = useEmployeeOptions();
  const { data: lifecycles = [], isLoading: lifecyclesLoading } = useLifecycleApproaches();

  // React Query hooks for plan data
  const { data: phases = [], isLoading: phasesLoading } = usePhases(project?.project_id || '', selectedBaselineId);
  const { data: deliverables = [], isLoading: deliverablesLoading } = useDeliverables(project?.project_id || '', selectedBaselineId);
  const { data: envelopes = [], isLoading: envelopesLoading } = useBudgetEnvelopes(project?.project_id || '', selectedBaselineId);

  const tabs = [
    { id: 'identification' as TabId, label: 'Identification', icon: ClipboardList },
    { id: 'wbs' as TabId, label: 'WBS', icon: FileText },
    { id: 'stakeholders' as TabId, label: 'Stakeholders', icon: Users },
    { id: 'resources' as TabId, label: 'Resources', icon: Calendar },
    { id: 'budget' as TabId, label: 'Budget', icon: DollarSign },
    { id: 'risks' as TabId, label: 'Risks & Issues', icon: AlertTriangle },
    { id: 'log' as TabId, label: 'Log', icon: History },
  ];

  // Update budget words when amount or currency changes
  useEffect(() => {
    const currency = currencies.find(c => c.id === formData.currency_id);
    const words = numberToWords(formData.montant_budget_total, currency?.code || 'DZD');
    setFormData(prev => ({ ...prev, budgetWords: words }));
  }, [formData.montant_budget_total, formData.currency_id, currencies]);

  // Track unsaved changes
  useEffect(() => {
    if (initialFormData && isEditing) {
      const hasChanges = JSON.stringify(formData) !== JSON.stringify(initialFormData);
      setHasUnsavedChanges(hasChanges);
      if (hasChanges && baselineStatus === 'validated') {
        setHasModifications(true);
      }
    }
  }, [formData, initialFormData, isEditing, baselineStatus]);

  // Initialize form data when entering edit mode
  useEffect(() => {
    if (isEditing && !initialFormData) {
      setInitialFormData({ ...formData });
    }
  }, [isEditing, formData, initialFormData]);

  // Get selected PM contact info
  const selectedPM = employees.find(e => e.id === formData.manager_id);
  const pmContactInfo = selectedPM 
    ? `${selectedPM.label} - ${selectedPM.email} / ${selectedPM.phone}`
    : 'Select a Project Manager';

  // Calculate variances
  const budgetVariances: Variance[] = envelopes.slice(0, 4).map(env => {
    const variance = env.montant_alloue - env.montant_consomme;
    const percentageVariance = env.montant_alloue > 0 ? ((variance / env.montant_alloue) * 100) : 0;
    
    let status: 'on-track' | 'at-risk' | 'off-track' = 'on-track';
    const usage = (env.montant_consomme / env.montant_alloue) * 100;
    if (usage > 90) status = 'off-track';
    else if (usage > 70) status = 'at-risk';
    
    return {
      field: env.type_enveloppe_id,
      planned: env.montant_alloue,
      actual: env.montant_consomme,
      variance,
      percentageVariance,
      status,
    };
  });

  const getValidationErrors = (): string[] => {
    const errorList: string[] = [];
    
    if (!formData.libellé.trim()) errorList.push('Project Title is required');
    if (formData.libellé.length > 250) errorList.push('Project Title must be 250 characters or less');
    if (!formData.shortTitle.trim()) errorList.push('Short Title is required');
    if (formData.shortTitle.length > 30) errorList.push('Short Title must be 30 characters or less');
    if (!formData.code.trim()) errorList.push('Project Code is required');
    if (formData.code.length > 15) errorList.push('Project Code must be 15 characters or less');
    if (!formData.provider_id) errorList.push('Provider is required');
    if (!formData.client_id) errorList.push('Client is required');
    if (!formData.sponsor_id) errorList.push('Sponsor is required');
    if (!formData.manager_id) errorList.push('Project Manager is required');
    if (!formData.currency_id) errorList.push('Currency is required');
    if (formData.montant_budget_total <= 0) errorList.push('Budget must be greater than 0');
    if (!formData.portfolio_id) errorList.push('Portfolio is required');
    if (!formData.projectType_id) errorList.push('Project Type is required');
    if (!formData.projectNature_id) errorList.push('Project Nature is required');
    if (!formData.lifecycle_id) errorList.push('Lifecycle Approach is required');
    if (!formData.date_debut_planifiée) errorList.push('Planned Start Date is required');
    if (!formData.date_fin_planifiée) errorList.push('Planned End Date is required');
    
    if (formData.date_debut_planifiée && formData.date_fin_planifiée) {
      const start = new Date(formData.date_debut_planifiée);
      const end = new Date(formData.date_fin_planifiée);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        errorList.push('Project end date must be at least 7 days after start date');
      }
    }
    
    return errorList;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.libellé || formData.libellé.trim().length === 0) {
      newErrors.libellé = 'Project title is required';
    } else if (formData.libellé.length > 250) {
      newErrors.libellé = 'Maximum 250 characters';
    }

    if (!formData.shortTitle.trim()) {
      newErrors.shortTitle = 'Short title is required';
    } else if (formData.shortTitle.length > 30) {
      newErrors.shortTitle = 'Maximum 30 characters';
    } else if (!/^[a-zA-Z0-9\s-]+$/.test(formData.shortTitle)) {
      newErrors.shortTitle = 'Only alphanumeric characters, spaces, and hyphens allowed';
    }

    if (!formData.code || formData.code.trim().length === 0) {
      newErrors.code = 'Project code is required';
    } else if (formData.code.length > 15) {
      newErrors.code = 'Maximum 15 characters';
    } else if (!/^[A-Z0-9-]+$/.test(formData.code)) {
      newErrors.code = 'Only uppercase letters, numbers, and hyphens allowed';
    }

    if (!formData.provider_id) newErrors.provider_id = 'Provider is required';
    if (!formData.client_id) newErrors.client_id = 'Client is required';
    if (!formData.sponsor_id) newErrors.sponsor_id = 'Sponsor is required';
    if (!formData.manager_id) newErrors.manager_id = 'Project Manager is required';
    if (!formData.currency_id) newErrors.currency_id = 'Currency is required';
    if (!formData.portfolio_id) newErrors.portfolio_id = 'Portfolio is required';
    if (!formData.projectType_id) newErrors.projectType_id = 'Project Type is required';
    if (!formData.projectNature_id) newErrors.projectNature_id = 'Project Nature is required';
    if (!formData.lifecycle_id) newErrors.lifecycle_id = 'Lifecycle Approach is required';

    if (formData.date_debut_planifiée && formData.date_fin_planifiée) {
      const start = new Date(formData.date_debut_planifiée);
      const end = new Date(formData.date_fin_planifiée);
      const diffDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays < 7) {
        newErrors.dates = 'Project end date must be at least 7 days after start date';
      }
    }

    if (formData.montant_budget_total <= 0) {
      newErrors.budget = 'Budget must be greater than 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      await updateProject.mutateAsync({
        projectId: project.project_id,
        updates: formData,
      });
      setSuccessMessage('Project updated successfully');
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setInitialFormData(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      toast.error('Failed to save project');
    }
  };

  const handleAutoSave = useCallback(async () => {
    if (validateForm()) {
      await updateProject.mutateAsync({
        projectId: project.project_id,
        updates: formData,
      });
    }
  }, [formData, project?.project_id, updateProject, validateForm]);

  const handleCancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setHasUnsavedChanges(false);
    if (initialFormData) {
      setFormData(initialFormData);
    }
    setInitialFormData(null);
  };

  const handleValidateBaseline = async () => {
    // Simulate baseline validation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setBaselineStatus('validated');
    setHasModifications(false);
  };

  const handleRequestChange = async (data: { type: string; description: string }) => {
    // Simulate change request
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Change request:', data);
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const isSaving = updateProject.isPending;

  return (
    <PageContainer>
      <div className="space-y-0">
        {/* Baseline Control Header - Sticky */}
        <BaselineControlHeader
          status={baselineStatus}
          version="V1.0"
          onValidateBaseline={handleValidateBaseline}
          onRequestChange={handleRequestChange}
          hasModifications={hasModifications}
          validationErrors={getValidationErrors()}
          isValidating={isSaving}
        />

        <div className="p-6 space-y-6">

          {/* Success Message */}
          {successMessage && (
            <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-green-800 dark:text-green-200 font-medium">{successMessage}</p>
            </div>
          )}

          {/* Error Messages */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                <div>
                  <p className="font-semibold text-destructive">Cannot save: Validation Errors</p>
                  <ul className="mt-2 space-y-1 text-sm text-destructive/90">
                    {Object.entries(errors).map(([key, error]) => (
                      <li key={key}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Baseline Selector */}
          <Card>
            <CardContent className="pt-6">
              <BaselineSelector
                baselines={MOCK_BASELINES}
                activeBaselineId={selectedBaselineId}
                onSelect={setSelectedBaselineId}
                disabled={isLocked}
              />
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  disabled={isSaving}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2',
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-50'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {!isLocked && (
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={isSaving || Object.keys(errors).length > 0}
                    >
                      {isSaving ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    disabled={isSaving}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Tab Content */}
          <Card>
            <CardContent className="pt-6">
              {activeTab === 'identification' && (
                <div className="space-y-8">
                  {/* Section 1: Basic Project Info */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Basic Project Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Project Title (Auto-Baseline) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            Project Title <span className="text-destructive ml-1">*</span>
                          </label>
                          {renderBaselineToggle('projectName', 'Project Title')}
                        </div>
                        <Input
                          value={formData.libellé}
                          onChange={(e) => updateFormData({ libellé: e.target.value })}
                          disabled={!isEditing || isLocked}
                          maxLength={250}
                          className={cn(
                            errors.libellé && 'border-destructive',
                            baselineFields.projectName?.isBaseline && 'bg-primary/5 border-primary/30'
                          )}
                          placeholder="Enter project title"
                        />
                        <p className="text-xs text-muted-foreground">{formData.libellé.length}/250 characters</p>
                        {errors.libellé && <p className="text-xs text-destructive">{errors.libellé}</p>}
                      </div>

                      {/* Short Title */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center">
                          Short Title <span className="text-destructive ml-1">*</span>
                        </label>
                        <Input
                          value={formData.shortTitle}
                          onChange={(e) => updateFormData({ shortTitle: e.target.value.replace(/[^a-zA-Z0-9\s-]/g, '') })}
                          disabled={!isEditing || isLocked}
                          maxLength={30}
                          className={cn(errors.shortTitle && 'border-destructive')}
                          placeholder="e.g., ProjectABC"
                        />
                        <p className="text-xs text-muted-foreground">{formData.shortTitle.length}/30 characters</p>
                        {errors.shortTitle && <p className="text-xs text-destructive">{errors.shortTitle}</p>}
                      </div>

                      {/* Project Code */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center">
                          Project Code <span className="text-destructive ml-1">*</span>
                        </label>
                        <Input
                          value={formData.code}
                          onChange={(e) => updateFormData({ code: e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, '') })}
                          disabled={!isEditing || isLocked}
                          maxLength={15}
                          className={cn(errors.code && 'border-destructive')}
                          placeholder="e.g., PROJ-2024-001"
                        />
                        <p className="text-xs text-muted-foreground">{formData.code.length}/15 characters (uppercase, numbers, hyphens)</p>
                        {errors.code && <p className="text-xs text-destructive">{errors.code}</p>}
                      </div>

                      {/* Charter Reference */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Charter Reference</label>
                        <Input
                          value={formData.charterRef}
                          onChange={(e) => updateFormData({ charterRef: e.target.value })}
                          disabled={!isEditing || isLocked}
                          maxLength={20}
                          placeholder="e.g., CHARTER-2025-001"
                        />
                        <p className="text-xs text-muted-foreground">{formData.charterRef.length}/20 characters (optional)</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Principal Actors */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Principal Actors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Provider */}
                      <MasterDataDropdown
                        label="Provider"
                        value={formData.provider_id}
                        onChange={(id) => updateFormData({ provider_id: id })}
                        options={externalOrgs}
                        placeholder="Select provider"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.provider_id}
                        isLoading={externalOrgsLoading}
                        sourceLabel="MD.ExternalOrg"
                      />

                      {/* Client */}
                      <MasterDataDropdown
                        label="Client"
                        value={formData.client_id}
                        onChange={(id) => updateFormData({ client_id: id })}
                        options={externalOrgs}
                        placeholder="Select client"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.client_id}
                        isLoading={externalOrgsLoading}
                        sourceLabel="MD.ExternalOrg"
                      />

                      {/* Sponsor (Internal Org Only) */}
                      <MasterDataDropdown
                        label="Sponsor"
                        value={formData.sponsor_id}
                        onChange={(id) => updateFormData({ sponsor_id: id })}
                        options={orgStructures}
                        placeholder="Select sponsor (internal only)"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.sponsor_id}
                        isLoading={orgsLoading}
                        sourceLabel="MD.OrgStructure"
                      />

                      {/* Project Manager */}
                      <MasterDataDropdown
                        label="Project Manager"
                        value={formData.manager_id}
                        onChange={(id) => updateFormData({ manager_id: id })}
                        options={employees.map(e => ({ id: e.id, code: e.code, label: e.label, description: e.email }))}
                        placeholder="Select project manager"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.manager_id}
                        isLoading={employeesLoading}
                        hasBaselineImpact
                        isBaselineValidated={baselineStatus === 'validated'}
                        hasChanged={formData.manager_id !== initialFormData?.manager_id}
                        sourceLabel="MD.Employee"
                      />

                      {/* PM Contact (Auto-generated) */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground">PM Contact</label>
                        <div className="px-4 py-2 bg-muted rounded-lg text-foreground">
                          {pmContactInfo}
                        </div>
                        <p className="text-xs text-muted-foreground">Auto-populated from Project Manager selection</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Temporal Planning */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Temporal Planning</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Start Date (Auto-Baseline) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            Planned Start Date <span className="text-destructive ml-1">*</span>
                            <BaselineImpactIcon
                              isValidated={baselineStatus === 'validated'}
                              hasChanged={formData.date_debut_planifiée !== initialFormData?.date_debut_planifiée}
                            />
                          </label>
                          {renderBaselineToggle('startDate', 'Start Date')}
                        </div>
                        <Input
                          type="date"
                          value={formData.date_debut_planifiée}
                          onChange={(e) => updateFormData({ date_debut_planifiée: e.target.value })}
                          disabled={!isEditing || isLocked}
                          className={cn(
                            baselineFields.startDate?.isBaseline && 'bg-primary/5 border-primary/30'
                          )}
                        />
                      </div>

                      {/* End Date (Auto-Baseline) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            Planned End Date <span className="text-destructive ml-1">*</span>
                            <BaselineImpactIcon
                              isValidated={baselineStatus === 'validated'}
                              hasChanged={formData.date_fin_planifiée !== initialFormData?.date_fin_planifiée}
                            />
                          </label>
                          {renderBaselineToggle('endDate', 'End Date')}
                        </div>
                        <Input
                          type="date"
                          value={formData.date_fin_planifiée}
                          onChange={(e) => updateFormData({ date_fin_planifiée: e.target.value })}
                          disabled={!isEditing || isLocked}
                          min={formData.date_debut_planifiée}
                          className={cn(
                            baselineFields.endDate?.isBaseline && 'bg-primary/5 border-primary/30'
                          )}
                        />
                        {errors.dates && <p className="text-xs text-destructive">{errors.dates}</p>}
                      </div>
                    </div>

                    {/* Key Milestones Table */}
                    <div className="mt-6">
                      <KeyMilestonesTable
                        milestones={formData.milestones}
                        onChange={(milestones) => updateFormData({ milestones })}
                        projectStartDate={formData.date_debut_planifiée}
                        projectEndDate={formData.date_fin_planifiée}
                        disabled={!isEditing || isLocked}
                      />
                    </div>
                  </div>

                  {/* Section 4: Financial Planning */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Financial Planning</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Currency */}
                      <MasterDataDropdown
                        label="Currency"
                        value={formData.currency_id}
                        onChange={(id) => updateFormData({ currency_id: id })}
                        options={currencies}
                        placeholder="Select currency"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.currency_id}
                        isLoading={currenciesLoading}
                        sourceLabel="MD.Currency"
                      />

                      {/* Budget Amount (Auto-Baseline) */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-foreground flex items-center">
                            Budget Amount <span className="text-destructive ml-1">*</span>
                            <BaselineImpactIcon
                              isValidated={baselineStatus === 'validated'}
                              hasChanged={formData.montant_budget_total !== initialFormData?.montant_budget_total}
                            />
                          </label>
                          {renderBaselineToggle('globalBudget', 'Global Budget')}
                        </div>
                        <Input
                          type="number"
                          value={formData.montant_budget_total}
                          onChange={(e) => updateFormData({ montant_budget_total: Number(e.target.value) })}
                          disabled={!isEditing || isLocked}
                          min={1}
                          className={cn(
                            errors.budget && 'border-destructive',
                            baselineFields.globalBudget?.isBaseline && 'bg-primary/5 border-primary/30'
                          )}
                        />
                        {errors.budget && <p className="text-xs text-destructive">{errors.budget}</p>}
                      </div>

                      {/* Budget in Words */}
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-foreground">Budget (Words)</label>
                        <Input
                          value={formData.budgetWords}
                          onChange={(e) => updateFormData({ budgetWords: e.target.value })}
                          disabled={!isEditing || isLocked}
                          placeholder="Auto-generated from amount"
                        />
                        <p className="text-xs text-muted-foreground">Auto-generated but editable</p>
                      </div>
                    </div>
                  </div>

                  {/* Section 5: Project Classification */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Project Classification</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Lifecycle Approach */}
                      <MasterDataDropdown
                        label="Lifecycle Approach"
                        value={formData.lifecycle_id}
                        onChange={(id) => updateFormData({ lifecycle_id: id })}
                        options={lifecycles}
                        placeholder="Select approach"
                        required
                        disabled={!isEditing || isLocked || baselineStatus === 'validated'}
                        error={errors.lifecycle_id}
                        isLoading={lifecyclesLoading}
                        sourceLabel="MD.LifecycleApproach"
                      />

                      {/* Portfolio */}
                      <MasterDataDropdown
                        label="Portfolio"
                        value={formData.portfolio_id}
                        onChange={(id) => updateFormData({ portfolio_id: id, program_id: '' })}
                        options={portfolios}
                        placeholder="Select portfolio"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.portfolio_id}
                        isLoading={portfoliosLoading}
                        sourceLabel="MD.Portfolio"
                      />

                      {/* Program (Cascade filtered by Portfolio) */}
                      <MasterDataDropdown
                        label="Program"
                        value={formData.program_id}
                        onChange={(id) => updateFormData({ program_id: id })}
                        options={programs}
                        placeholder={formData.portfolio_id ? "Select program (optional)" : "Select portfolio first"}
                        disabled={!isEditing || isLocked || !formData.portfolio_id}
                        isLoading={programsLoading}
                        sourceLabel="MD.Program"
                      />

                      {/* Project Type */}
                      <MasterDataDropdown
                        label="Project Type"
                        value={formData.projectType_id}
                        onChange={(id) => updateFormData({ projectType_id: id })}
                        options={projectTypes}
                        placeholder="Select project type"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.projectType_id}
                        isLoading={typesLoading}
                        hasBaselineImpact
                        isBaselineValidated={baselineStatus === 'validated'}
                        hasChanged={formData.projectType_id !== initialFormData?.projectType_id}
                        sourceLabel="MD.ProjType"
                      />

                      {/* Project Nature */}
                      <MasterDataDropdown
                        label="Project Nature"
                        value={formData.projectNature_id}
                        onChange={(id) => updateFormData({ projectNature_id: id })}
                        options={projectNatures}
                        placeholder="Select project nature"
                        required
                        disabled={!isEditing || isLocked}
                        error={errors.projectNature_id}
                        isLoading={naturesLoading}
                        hasBaselineImpact
                        isBaselineValidated={baselineStatus === 'validated'}
                        hasChanged={formData.projectNature_id !== initialFormData?.projectNature_id}
                        sourceLabel="MD.ProjNature"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => updateFormData({ description: e.target.value })}
                      disabled={!isEditing || isLocked}
                      rows={4}
                      placeholder="Project description..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'wbs' && (
                <div className="space-y-8">
                  {/* Phases Table */}
                  <PhasesTable
                    phases={wbsPhases}
                    onChange={setWbsPhases}
                    onSave={async () => {
                      await new Promise(resolve => setTimeout(resolve, 500));
                      setInitialWbsPhases([...wbsPhases]);
                    }}
                    projectStartDate={formData.date_debut_planifiée || '2025-01-01'}
                    projectEndDate={formData.date_fin_planifiée || '2025-12-31'}
                    disabled={isLocked}
                    isBaselineValidated={baselineStatus === 'validated'}
                    initialPhases={initialWbsPhases}
                  />

                  {/* Deliverables Table */}
                  <DeliverablesTable
                    deliverables={wbsDeliverables}
                    phases={wbsPhases}
                    deliverableTypes={MOCK_DELIVERABLE_TYPES.filter(t => t.is_active).map(t => ({
                      id: t.type_livrable_id,
                      code: t.code,
                      label: t.libelle,
                    }))}
                    onChange={setWbsDeliverables}
                    onSave={async () => {
                      await new Promise(resolve => setTimeout(resolve, 500));
                      setInitialWbsDeliverables([...wbsDeliverables]);
                    }}
                    disabled={isLocked}
                    isBaselineValidated={baselineStatus === 'validated'}
                    initialDeliverables={initialWbsDeliverables}
                  />
                </div>
              )}

              {activeTab === 'stakeholders' && (
                <div className="space-y-8">
                  {/* Governance Section - Collapsible Optional */}
                  <Collapsible open={governanceOpen} onOpenChange={setGovernanceOpen}>
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        {governanceOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-semibold text-foreground">Project Governance</span>
                        <Badge variant="outline" className="ml-2">Optional</Badge>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <GovernanceTable
                        instances={governanceInstances}
                        employees={employees.map(e => ({ id: e.id, label: e.label }))}
                        onChange={setGovernanceInstances}
                        onSave={async () => {
                          await new Promise(resolve => setTimeout(resolve, 500));
                        }}
                        disabled={isLocked}
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  {/* Project Team - Mandatory */}
                  <ProjectTeamTable
                    members={teamMembers}
                    roles={MOCK_MEMBER_ROLES.filter(r => r.is_active).map(r => ({
                      id: r.member_role_id,
                      code: r.code,
                      label: r.libelle,
                    }))}
                    employees={employees.map(e => ({
                      id: e.id,
                      label: e.label,
                      email: e.email,
                    }))}
                    onChange={setTeamMembers}
                    onSave={async () => {
                      await new Promise(resolve => setTimeout(resolve, 500));
                      setInitialTeamMembers([...teamMembers]);
                    }}
                    projectStartDate={formData.date_debut_planifiée || '2025-01-01'}
                    projectEndDate={formData.date_fin_planifiée || '2025-12-31'}
                    disabled={isLocked}
                    isBaselineValidated={baselineStatus === 'validated'}
                    initialMembers={initialTeamMembers}
                  />

                  {/* Internal Stakeholders - Collapsible Optional */}
                  <Collapsible open={internalOpen} onOpenChange={setInternalOpen}>
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        {internalOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-semibold text-foreground">Internal Stakeholders</span>
                        <Badge variant="outline" className="ml-2">Optional</Badge>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <InternalStakeholdersTable
                        stakeholders={internalStakeholders}
                        organizations={orgStructures.map(o => ({ id: o.id, code: o.code, label: o.label }))}
                        roles={MOCK_PROJECT_ROLES.filter(r => r.is_active).map(r => ({
                          id: r.fonction_id,
                          code: r.code,
                          label: r.libelle,
                        }))}
                        employees={employees.map(e => ({ id: e.id, label: e.label }))}
                        onChange={setInternalStakeholders}
                        onSave={async () => {
                          await new Promise(resolve => setTimeout(resolve, 500));
                        }}
                        disabled={isLocked}
                      />
                    </CollapsibleContent>
                  </Collapsible>

                  {/* External Stakeholders - Collapsible Optional */}
                  <Collapsible open={externalOpen} onOpenChange={setExternalOpen}>
                    <CollapsibleTrigger asChild>
                      <button className="flex items-center gap-2 w-full text-left p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                        {externalOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        <span className="font-semibold text-foreground">External Stakeholders</span>
                        <Badge variant="outline" className="ml-2">Optional</Badge>
                      </button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="pt-4">
                      <ExternalStakeholdersTable
                        stakeholders={externalStakeholders}
                        externalOrgs={externalOrgs.map(o => ({ id: o.id, code: o.code, label: o.label }))}
                        roles={MOCK_PROJECT_ROLES.filter(r => r.is_active).map(r => ({
                          id: r.fonction_id,
                          code: r.code,
                          label: r.libelle,
                        }))}
                        contacts={MOCK_EXTERNAL_CONTACTS.filter(c => c.is_active).map(c => ({
                          id: c.collaborateur_externe_id,
                          orgId: c.organisation_externe_id,
                          label: `${c.prenom} ${c.nom}`,
                        }))}
                        onChange={setExternalStakeholders}
                        onSave={async () => {
                          await new Promise(resolve => setTimeout(resolve, 500));
                        }}
                        disabled={isLocked}
                      />
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Resource Allocation</h3>
                  <ResourcesTable
                    resources={resources}
                    resourceOptions={MOCK_RESOURCES.filter(r => r.is_active).map(r => ({
                      id: r.ressource_id,
                      label: r.intitule,
                      typeId: r.type_id,
                      familyId: r.famille_id,
                    }))}
                    resourceTypes={MOCK_RESOURCE_TYPES.filter(t => t.is_active).map(t => ({
                      id: t.type_id,
                      label: t.libelle,
                      familyId: t.famille_id,
                    }))}
                    resourceFamilies={MOCK_RESOURCE_FAMILIES.filter(f => f.is_active).map(f => ({
                      id: f.famille_id,
                      label: f.libelle,
                    }))}
                    currency={currencies.find(c => c.id === formData.currency_id)?.code || 'DZD'}
                    projectStartDate={formData.date_debut_planifiée || '2025-01-01'}
                    projectEndDate={formData.date_fin_planifiée || '2025-12-31'}
                    onChange={setResources}
                    onSave={async () => {
                      await new Promise(resolve => setTimeout(resolve, 500));
                      setInitialResources([...resources]);
                    }}
                    disabled={!canEdit}
                    isBaselineValidated={baselineStatus === 'validated'}
                    initialResources={initialResources}
                  />
                </div>
              )}

              {activeTab === 'budget' && (
                <div className="space-y-8">
                  <h3 className="text-lg font-semibold text-foreground">Project Budget</h3>
                  
                  {/* Budget Overview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Planned Budget</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {new Intl.NumberFormat('fr-DZ').format(formData.montant_budget_total || 0)} DZD
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Allocated</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {new Intl.NumberFormat('fr-DZ').format(budgetEnvelopes.reduce((sum, e) => sum + e.amount, 0))} DZD
                      </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Consumed</p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {new Intl.NumberFormat('fr-DZ').format(project?.budget_consomme || 0)} DZD
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Utilization</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {formData.montant_budget_total 
                          ? Math.round((budgetEnvelopes.reduce((sum, e) => sum + e.amount, 0) / formData.montant_budget_total) * 100) 
                          : 0}%
                      </p>
                    </div>
                  </div>

                  {/* Budget Envelopes Table */}
                  <BudgetEnvelopesTable
                    envelopes={budgetEnvelopes}
                    totalBudget={formData.montant_budget_total || 100000000}
                    currency={currencies.find(c => c.id === formData.currency_id)?.code || 'DZD'}
                    envelopeTypes={MOCK_ENVELOPE_TYPES.filter(t => t.is_active).map(t => ({
                      id: t.type_enveloppe_id,
                      code: t.code,
                      label: t.libelle,
                      budgetTypeId: t.type_budget_id,
                    }))}
                    fundingSources={MOCK_FUNDING_SOURCES.filter(s => s.is_active).map(s => ({
                      id: s.source_financement_id,
                      code: s.code,
                      label: s.libelle,
                    }))}
                    budgetTypes={MOCK_BUDGET_TYPES.filter(t => t.is_active).map(t => ({
                      id: t.type_budget_id,
                      label: t.libelle,
                    }))}
                    onChange={setBudgetEnvelopes}
                    onSave={async () => {
                      await new Promise(resolve => setTimeout(resolve, 500));
                      setInitialBudgetEnvelopes([...budgetEnvelopes]);
                    }}
                    disabled={isLocked}
                    isBaselineValidated={baselineStatus === 'validated'}
                    initialEnvelopes={initialBudgetEnvelopes}
                  />

                  {/* Monthly Budget Distribution */}
                  <MonthlyBudgetTable
                    monthlyData={monthlyBudget}
                    totalBudget={formData.montant_budget_total || 100000000}
                    currency={currencies.find(c => c.id === formData.currency_id)?.code || 'DZD'}
                    onChange={setMonthlyBudget}
                    onSave={async () => {
                      await new Promise(resolve => setTimeout(resolve, 500));
                    }}
                    disabled={isLocked}
                  />
                </div>
              )}

              {activeTab === 'risks' && (
                <div className="space-y-8">
                  <RisksPlanSection
                    risks={risks}
                    onAddRisk={handleAddRisk}
                    onUpdateRisk={handleUpdateRisk}
                    onDeleteRisk={handleDeleteRisk}
                    employees={riskIssueEmployees}
                    phases={phasesForLinking}
                    deliverables={deliverablesForLinking}
                    disabled={isLocked}
                  />
                  <IssuesPlanSection
                    issues={issues}
                    onAddIssue={handleAddIssue}
                    onUpdateIssue={handleUpdateIssue}
                    onDeleteIssue={handleDeleteIssue}
                    employees={riskIssueEmployees}
                    phases={phasesForLinking}
                    deliverables={deliverablesForLinking}
                    disabled={isLocked}
                  />
                </div>
              )}

              {activeTab === 'log' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground">Project Audit Log</h3>
                    <Badge variant="outline" className="font-mono">
                      Baseline v{currentBaselineVersion}
                    </Badge>
                  </div>
                  
                  <Tabs defaultValue="baseline" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="baseline">Baseline Changes</TabsTrigger>
                      <TabsTrigger value="operational">Operational Changes</TabsTrigger>
                      <TabsTrigger value="pending" className="relative">
                        Pending Requests
                        {pendingRequests.filter(r => r.status === 'pending').length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {pendingRequests.filter(r => r.status === 'pending').length}
                          </span>
                        )}
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="baseline" className="mt-6">
                      <BaselineChangeLogTab
                        projectId={project?.project_id || 'proj-001'}
                        changes={baselineChanges}
                      />
                    </TabsContent>
                    
                    <TabsContent value="operational" className="mt-6">
                      <OperationalChangeLogTab
                        projectId={project?.project_id || 'proj-001'}
                        changes={operationalChanges}
                      />
                    </TabsContent>
                    
                    <TabsContent value="pending" className="mt-6">
                      <PendingChangeRequestsTab
                        projectId={project?.project_id || 'proj-001'}
                        requests={pendingRequests}
                        onApprove={handleApproveRequest}
                        onReject={handleRejectRequest}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Auto-save indicator */}
        {isEditing && (
          <AutoSaveIndicator
            onSave={handleAutoSave}
            hasChanges={hasUnsavedChanges}
            debounceMs={5000}
          />
        )}

        {/* Baseline Change Request Modal */}
        <BaselineChangeRequestModal
          isOpen={changeRequestModal.isOpen}
          onClose={() => setChangeRequestModal(prev => ({ ...prev, isOpen: false }))}
          onSubmit={changeRequestModal.onConfirm}
          fieldName={changeRequestModal.fieldName}
          fieldLabel={changeRequestModal.fieldLabel}
          oldValue={changeRequestModal.oldValue}
          newValue={changeRequestModal.newValue}
          isSubmitting={isSubmittingChangeRequest}
        />
      </div>
    </PageContainer>
  );
};

export default ProjectPlanPage;
