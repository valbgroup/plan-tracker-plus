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
import { BaselineSelector, Baseline } from '../components/BaselineSelector';
import { VarianceAnalysis, Variance } from '../components/VarianceAnalysis';
import { BaselineControlHeader, BaselineStatus } from '../components/BaselineControlHeader';
import { BaselineImpactIcon } from '../components/BaselineImpactIcon';
import { MasterDataDropdown } from '../components/MasterDataDropdown';
import { KeyMilestonesTable, Milestone } from '../components/KeyMilestonesTable';
import { AutoSaveIndicator } from '../components/AutoSaveIndicator';
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
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// Mock baselines for demo
const MOCK_BASELINES: Baseline[] = [
  { id: 'bl-1', version: 1, createdDate: new Date('2024-01-15'), createdBy: 'System', description: 'Initial baseline', status: 'superseded' },
  { id: 'bl-2', version: 2, createdDate: new Date('2024-03-01'), createdBy: 'Admin', description: 'Post-planning baseline', status: 'active' },
];

type TabId = 'identification' | 'wbs' | 'stakeholders' | 'resources' | 'budget' | 'log';

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
  
  const [activeTab, setActiveTab] = useState<TabId>('identification');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBaselineId, setSelectedBaselineId] = useState<string>('bl-2');
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [baselineStatus, setBaselineStatus] = useState<BaselineStatus>('draft');
  const [hasModifications, setHasModifications] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
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
                      {/* Project Title */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center">
                          Project Title <span className="text-destructive ml-1">*</span>
                        </label>
                        <Input
                          value={formData.libellé}
                          onChange={(e) => updateFormData({ libellé: e.target.value })}
                          disabled={!isEditing || isLocked}
                          maxLength={250}
                          className={cn(errors.libellé && 'border-destructive')}
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
                      {/* Start Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center">
                          Planned Start Date <span className="text-destructive ml-1">*</span>
                          <BaselineImpactIcon
                            isValidated={baselineStatus === 'validated'}
                            hasChanged={formData.date_debut_planifiée !== initialFormData?.date_debut_planifiée}
                          />
                        </label>
                        <Input
                          type="date"
                          value={formData.date_debut_planifiée}
                          onChange={(e) => updateFormData({ date_debut_planifiée: e.target.value })}
                          disabled={!isEditing || isLocked}
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center">
                          Planned End Date <span className="text-destructive ml-1">*</span>
                          <BaselineImpactIcon
                            isValidated={baselineStatus === 'validated'}
                            hasChanged={formData.date_fin_planifiée !== initialFormData?.date_fin_planifiée}
                          />
                        </label>
                        <Input
                          type="date"
                          value={formData.date_fin_planifiée}
                          onChange={(e) => updateFormData({ date_fin_planifiée: e.target.value })}
                          disabled={!isEditing || isLocked}
                          min={formData.date_debut_planifiée}
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

                      {/* Budget Amount */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground flex items-center">
                          Budget Amount <span className="text-destructive ml-1">*</span>
                          <BaselineImpactIcon
                            isValidated={baselineStatus === 'validated'}
                            hasChanged={formData.montant_budget_total !== initialFormData?.montant_budget_total}
                          />
                        </label>
                        <Input
                          type="number"
                          value={formData.montant_budget_total}
                          onChange={(e) => updateFormData({ montant_budget_total: Number(e.target.value) })}
                          disabled={!isEditing || isLocked}
                          min={1}
                          className={cn(errors.budget && 'border-destructive')}
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
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Work Breakdown Structure</h3>
                  
                  {phasesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    </div>
                  ) : phases.length > 0 ? (
                    <div className="space-y-4">
                      {phases.map((phase) => (
                        <div 
                          key={phase.phase_id}
                          className="flex items-center gap-4 p-4 border border-border rounded-lg"
                        >
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{phase.ordre}</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-foreground">{phase.libellé}</h4>
                            <p className="text-sm text-muted-foreground">{phase.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              <span>{format(new Date(phase.date_debut), 'MMM dd')} - {format(new Date(phase.date_fin), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-foreground">{phase.progres_reel}%</div>
                            <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${phase.progres_reel}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground py-12">
                      <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No phases defined yet.</p>
                      <p className="text-sm mt-2">Hierarchical task structure with drag-and-drop coming soon.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'stakeholders' && (
                <div className="text-center text-muted-foreground py-12">
                  <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Stakeholder Management</p>
                  <p className="text-sm mt-2">Coming Soon</p>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="text-center text-muted-foreground py-12">
                  <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Resource Allocation</p>
                  <p className="text-sm mt-2">Coming Soon</p>
                </div>
              )}

              {activeTab === 'budget' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-foreground">Project Budget</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Planned Budget</p>
                      <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                        {new Intl.NumberFormat('fr-DZ').format(project?.montant_budget_total || 0)} DZD
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium">Spent</p>
                      <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                        {new Intl.NumberFormat('fr-DZ').format(project?.budget_consomme || 0)} DZD
                      </p>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Remaining</p>
                      <p className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                        {new Intl.NumberFormat('fr-DZ').format((project?.montant_budget_total || 0) - (project?.budget_consomme || 0))} DZD
                      </p>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                      <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Utilization</p>
                      <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                        {project?.montant_budget_total 
                          ? Math.round((project.budget_consomme / project.montant_budget_total) * 100) 
                          : 0}%
                      </p>
                    </div>
                  </div>

                  {envelopes.length > 0 && (
                    <div className="mt-8">
                      <VarianceAnalysis 
                        variances={budgetVariances}
                        title="Budget vs Actual"
                        isLoading={envelopesLoading}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'log' && (
                <div className="text-center text-muted-foreground py-12">
                  <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Activity Log</p>
                  <p className="text-sm mt-2">Coming Soon</p>
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
      </div>
    </PageContainer>
  );
};

export default ProjectPlanPage;
