import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BaselineField } from './BaselineField';
import { BaselineChangeRequestModal } from './BaselineChangeRequestModal';
import { ClipboardList } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface IdentificationData {
  projectName: string;
  startDate: string;
  endDate: string;
  duration?: number;
  projectManager: string;
  projectManagerId?: string;
  lifecycleApproach: string;
  projectNature: string;
  globalBudget: number;
  currency?: string;
  description?: string;
}

export interface BaselineState {
  [fieldName: string]: {
    isBaseline: boolean;
    isPending: boolean;
    pendingValue?: any;
  };
}

interface IdentificationSectionProps {
  data: IdentificationData;
  baselineState: BaselineState;
  isEditing?: boolean;
  isLocked?: boolean;
  onBaselineToggle?: (fieldName: string, isMarked: boolean) => void;
  onFieldChange?: (fieldName: string, oldValue: any, newValue: any, justification?: string) => void;
  viewMode?: 'plan' | 'tracking';
}

export const IdentificationSection: React.FC<IdentificationSectionProps> = ({
  data,
  baselineState,
  isEditing = false,
  isLocked = false,
  onBaselineToggle,
  onFieldChange,
  viewMode = 'plan',
}) => {
  const [changeModal, setChangeModal] = useState<{
    isOpen: boolean;
    fieldName: string;
    fieldLabel: string;
    oldValue: any;
    newValue: any;
  }>({
    isOpen: false,
    fieldName: '',
    fieldLabel: '',
    oldValue: null,
    newValue: null,
  });
  const [loadingFields, setLoadingFields] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-baseline fields (always marked, no toggle)
  const autoBaselineFields = ['projectName', 'startDate', 'endDate', 'globalBudget'];

  const isAutoBaseline = (fieldName: string) => autoBaselineFields.includes(fieldName);
  
  const getBaselineStatus = (fieldName: string) => {
    if (isAutoBaseline(fieldName)) {
      return { isBaseline: true, isPending: false };
    }
    return baselineState[fieldName] || { isBaseline: false, isPending: false };
  };

  const handleToggleBaseline = useCallback(async (fieldName: string, isMarked: boolean) => {
    if (isAutoBaseline(fieldName)) return;
    
    setLoadingFields(prev => ({ ...prev, [fieldName]: true }));
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (onBaselineToggle) {
        onBaselineToggle(fieldName, isMarked);
      }
      
      toast.success(
        isMarked 
          ? `${fieldName} marked as baseline` 
          : `${fieldName} removed from baseline`
      );
    } catch (error) {
      toast.error('Failed to update baseline status');
    } finally {
      setLoadingFields(prev => ({ ...prev, [fieldName]: false }));
    }
  }, [onBaselineToggle]);

  const handleBaselineFieldChange = (
    fieldName: string, 
    fieldLabel: string, 
    oldValue: any, 
    newValue: any
  ) => {
    const status = getBaselineStatus(fieldName);
    
    if (status.isBaseline) {
      // Field is baseline - show change request modal
      setChangeModal({
        isOpen: true,
        fieldName,
        fieldLabel,
        oldValue,
        newValue,
      });
    } else {
      // Field is not baseline - update immediately
      if (onFieldChange) {
        onFieldChange(fieldName, oldValue, newValue);
      }
    }
  };

  const handleSubmitChangeRequest = async (justification?: string) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onFieldChange) {
        onFieldChange(
          changeModal.fieldName,
          changeModal.oldValue,
          changeModal.newValue,
          justification
        );
      }
      
      toast.success('Change request submitted for approval');
      setChangeModal(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      toast.error('Failed to submit change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'PPP');
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount: number, currency?: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'DZD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateDuration = () => {
    if (!data.startDate || !data.endDate) return '-';
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Identification
            {viewMode === 'tracking' && (
              <span className="text-sm font-normal text-muted-foreground ml-2">
                (Read-only)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Row 1: Project Name (full width, auto-baseline) */}
          <BaselineField
            fieldName="projectName"
            fieldLabel="Project Name"
            value={data.projectName}
            isBaseline={true}
            isAutoBaseline={true}
            disabled={isLocked}
          />

          {/* Row 2: Dates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <BaselineField
              fieldName="startDate"
              fieldLabel="Start Date"
              value={formatDate(data.startDate)}
              isBaseline={true}
              isAutoBaseline={true}
              disabled={isLocked}
            />
            <BaselineField
              fieldName="endDate"
              fieldLabel="End Date"
              value={formatDate(data.endDate)}
              isBaseline={true}
              isAutoBaseline={true}
              disabled={isLocked}
            />
            <BaselineField
              fieldName="duration"
              fieldLabel="Duration"
              value={calculateDuration()}
              isBaseline={false}
              isAutoBaseline={false}
              disabled={true}
            />
          </div>

          {/* Row 3: Budget & Manager */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaselineField
              fieldName="globalBudget"
              fieldLabel="Global Budget"
              value={formatCurrency(data.globalBudget, data.currency)}
              isBaseline={true}
              isAutoBaseline={true}
              disabled={isLocked}
            />
            <BaselineField
              fieldName="projectManager"
              fieldLabel="Project Manager"
              value={data.projectManager}
              isBaseline={getBaselineStatus('projectManager').isBaseline}
              isPending={getBaselineStatus('projectManager').isPending}
              isLoading={loadingFields['projectManager']}
              onToggleBaseline={handleToggleBaseline}
              disabled={isLocked}
            />
          </div>

          {/* Row 4: Project Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaselineField
              fieldName="lifecycleApproach"
              fieldLabel="Lifecycle Approach"
              value={data.lifecycleApproach}
              isBaseline={getBaselineStatus('lifecycleApproach').isBaseline}
              isPending={getBaselineStatus('lifecycleApproach').isPending}
              isLoading={loadingFields['lifecycleApproach']}
              onToggleBaseline={handleToggleBaseline}
              disabled={isLocked}
            />
            <BaselineField
              fieldName="projectNature"
              fieldLabel="Project Nature"
              value={data.projectNature}
              isBaseline={getBaselineStatus('projectNature').isBaseline}
              isPending={getBaselineStatus('projectNature').isPending}
              isLoading={loadingFields['projectNature']}
              onToggleBaseline={handleToggleBaseline}
              disabled={isLocked}
            />
          </div>

          {/* Row 5: Description (if available) */}
          {data.description && (
            <BaselineField
              fieldName="description"
              fieldLabel="Description"
              value={data.description}
              isBaseline={getBaselineStatus('description').isBaseline}
              isPending={getBaselineStatus('description').isPending}
              isLoading={loadingFields['description']}
              onToggleBaseline={handleToggleBaseline}
              disabled={isLocked}
            />
          )}
        </CardContent>
      </Card>

      {/* Change Request Modal */}
      <BaselineChangeRequestModal
        isOpen={changeModal.isOpen}
        onClose={() => setChangeModal(prev => ({ ...prev, isOpen: false }))}
        onSubmit={handleSubmitChangeRequest}
        fieldName={changeModal.fieldName}
        fieldLabel={changeModal.fieldLabel}
        oldValue={changeModal.oldValue}
        newValue={changeModal.newValue}
        isSubmitting={isSubmitting}
      />
    </>
  );
};

export default IdentificationSection;
