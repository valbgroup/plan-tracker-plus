import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { AlertTriangle, Plus, Loader2 } from 'lucide-react';
import { RiskFormModal } from './RiskFormModal';
import { RiskCard } from './RiskCard';
import { Risk, getRiskScoreColor, getRiskScoreLevel } from '../../types/risks-issues.types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface RisksPlanSectionProps {
  risks: Risk[];
  onAddRisk: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => Promise<void>;
  onUpdateRisk: (riskId: string, risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => Promise<void>;
  onDeleteRisk: (riskId: string) => Promise<void>;
  employees: { id: string; name: string }[];
  phases?: { id: string; title: string }[];
  deliverables?: { id: string; title: string }[];
  disabled?: boolean;
}

export const RisksPlanSection: React.FC<RisksPlanSectionProps> = ({
  risks,
  onAddRisk,
  onUpdateRisk,
  onDeleteRisk,
  employees,
  phases = [],
  deliverables = [],
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; riskId: string | null }>({
    isOpen: false,
    riskId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate summary stats
  const highRisks = risks.filter(r => r.score > 15).length;
  const mediumRisks = risks.filter(r => r.score > 10 && r.score <= 15).length;
  const lowRisks = risks.filter(r => r.score <= 10).length;

  const handleOpenModal = (risk?: Risk) => {
    setEditingRisk(risk || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRisk(null);
  };

  const handleSubmit = async (riskData: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => {
    setIsSubmitting(true);
    try {
      if (editingRisk) {
        await onUpdateRisk(editingRisk.id, riskData);
        toast.success('Risk updated successfully');
      } else {
        await onAddRisk(riskData);
        toast.success('Risk created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingRisk ? 'Failed to update risk' : 'Failed to create risk');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (riskId: string) => {
    setDeleteConfirm({ isOpen: true, riskId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.riskId) return;
    
    setIsDeleting(true);
    try {
      await onDeleteRisk(deleteConfirm.riskId);
      toast.success('Risk deleted successfully');
      setDeleteConfirm({ isOpen: false, riskId: null });
    } catch (error) {
      toast.error('Failed to delete risk');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Risks
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {risks.length} {risks.length === 1 ? 'risk' : 'risks'}
              </Badge>
            </div>
            
            {!disabled && (
              <Button onClick={() => handleOpenModal()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Risk
              </Button>
            )}
          </div>

          {/* Summary Stats */}
          {risks.length > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">Critical: {highRisks}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500" />
                <span className="text-sm text-muted-foreground">High: {mediumRisks}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Medium/Low: {lowRisks}</span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {risks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No risks identified yet.</p>
              <p className="text-sm">Click "Add Risk" to identify potential risks.</p>
            </div>
          ) : (
            risks.map((risk, index) => (
              <RiskCard
                key={risk.id}
                risk={risk}
                index={index}
                onEdit={handleOpenModal}
                onDelete={handleDeleteClick}
                disabled={disabled}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Risk Form Modal */}
      <RiskFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingRisk}
        employees={employees}
        phases={phases}
        deliverables={deliverables}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => !open && setDeleteConfirm({ isOpen: false, riskId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Risk</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this risk? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RisksPlanSection;
