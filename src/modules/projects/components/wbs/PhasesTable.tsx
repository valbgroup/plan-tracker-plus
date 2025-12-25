import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { BaselineImpactIcon } from '../BaselineImpactIcon';
import { Plus, Trash2, Save, History, Loader2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface PhaseData {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  coefficient: number;
  remarks: string;
  lastModifiedBy?: string;
  lastModifiedAt?: string;
  isNew?: boolean;
}

interface PhasesTableProps {
  phases: PhaseData[];
  onChange: (phases: PhaseData[]) => void;
  onSave: () => Promise<void>;
  projectStartDate: string;
  projectEndDate: string;
  disabled?: boolean;
  isBaselineValidated?: boolean;
  initialPhases?: PhaseData[];
}

export const PhasesTable: React.FC<PhasesTableProps> = ({
  phases,
  onChange,
  onSave,
  projectStartDate,
  projectEndDate,
  disabled = false,
  isBaselineValidated = false,
  initialPhases = [],
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [deletePhaseId, setDeletePhaseId] = useState<string | null>(null);
  const [historyPhaseId, setHistoryPhaseId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const hasChanges = JSON.stringify(phases) !== JSON.stringify(initialPhases);
  const hasStructuralChange = isBaselineValidated && (
    phases.length !== initialPhases.length ||
    phases.some(p => p.isNew) ||
    initialPhases.some(ip => !phases.find(p => p.id === ip.id))
  );

  const validatePhase = (phase: PhaseData): Record<string, string> => {
    const phaseErrors: Record<string, string> = {};
    
    if (!phase.title.trim()) {
      phaseErrors.title = 'Title is required';
    } else if (phase.title.length > 100) {
      phaseErrors.title = 'Max 100 characters';
    }

    if (!phase.startDate) {
      phaseErrors.startDate = 'Start date is required';
    } else if (projectStartDate && phase.startDate < projectStartDate) {
      phaseErrors.startDate = 'Must be within project dates';
    }

    if (!phase.endDate) {
      phaseErrors.endDate = 'End date is required';
    } else if (phase.startDate && phase.endDate <= phase.startDate) {
      phaseErrors.endDate = 'Must be after start date';
    } else if (projectEndDate && phase.endDate > projectEndDate) {
      phaseErrors.endDate = 'Must be within project dates';
    }

    if (phase.coefficient < 1 || phase.coefficient > 99) {
      phaseErrors.coefficient = 'Must be 1-99';
    }

    if (phase.remarks.length > 500) {
      phaseErrors.remarks = 'Max 500 characters';
    }

    return phaseErrors;
  };

  const handleAddPhase = () => {
    const newPhase: PhaseData = {
      id: `phase-new-${Date.now()}`,
      title: '',
      startDate: projectStartDate || '',
      endDate: projectEndDate || '',
      coefficient: 10,
      remarks: '',
      isNew: true,
    };
    onChange([...phases, newPhase]);
    
    // Auto-focus on new row title
    setTimeout(() => {
      const inputs = document.querySelectorAll<HTMLInputElement>('input[data-phase-title]');
      const lastInput = inputs[inputs.length - 1];
      lastInput?.focus();
    }, 100);
  };

  const handleUpdatePhase = (id: string, field: keyof PhaseData, value: string | number) => {
    const updatedPhases = phases.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    );
    onChange(updatedPhases);

    // Validate on change
    const phase = updatedPhases.find(p => p.id === id);
    if (phase) {
      const phaseErrors = validatePhase(phase);
      setErrors(prev => ({ ...prev, [id]: phaseErrors }));
    }
  };

  const handleDeletePhase = () => {
    if (!deletePhaseId) return;
    const updatedPhases = phases.filter(p => p.id !== deletePhaseId);
    onChange(updatedPhases);
    setDeletePhaseId(null);
    toast.success('Phase deleted');
  };

  const handleSave = async () => {
    // Validate all phases
    const allErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    phases.forEach(phase => {
      const phaseErrors = validatePhase(phase);
      if (Object.keys(phaseErrors).length > 0) {
        allErrors[phase.id] = phaseErrors;
        hasErrors = true;
      }
    });

    setErrors(allErrors);

    if (hasErrors) {
      toast.error('Please fix validation errors');
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      toast.success(`${phases.length} phases saved`);
    } catch (error) {
      toast.error('Failed to save phases');
    } finally {
      setIsSaving(false);
    }
  };

  const historyPhase = phases.find(p => p.id === historyPhaseId);

  return (
    <div className="space-y-4">
      {/* Structural Change Alert */}
      {hasStructuralChange && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">STRUCTURAL CHANGE DETECTED</p>
            <p className="text-sm text-destructive/80">
              Adding/removing phases affects baseline. Submit change request.
            </p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground">Project Phases</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddPhase}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Phase
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving || !hasChanges}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Phases
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px]">Title *</TableHead>
              <TableHead className="w-[140px]">
                Start Date *
                {isBaselineValidated && <span className="ml-1">🔐</span>}
              </TableHead>
              <TableHead className="w-[140px]">
                End Date *
                {isBaselineValidated && <span className="ml-1">🔐</span>}
              </TableHead>
              <TableHead className="w-[100px]">Coeff (1-99) *</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="w-[100px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {phases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No phases defined. Click "New Phase" to add one.
                </TableCell>
              </TableRow>
            ) : (
              phases.map((phase) => {
                const phaseErrors = errors[phase.id] || {};
                const initialPhase = initialPhases.find(ip => ip.id === phase.id);
                
                return (
                  <TableRow key={phase.id} className={phase.isNew ? 'bg-primary/5' : ''}>
                    <TableCell>
                      <div className="space-y-1">
                        <Input
                          data-phase-title
                          value={phase.title}
                          onChange={(e) => handleUpdatePhase(phase.id, 'title', e.target.value)}
                          disabled={disabled}
                          maxLength={100}
                          placeholder="Phase name"
                          className={cn(
                            'h-8',
                            phaseErrors.title && 'border-destructive'
                          )}
                        />
                        <p className="text-xs text-muted-foreground">{phase.title.length}/100</p>
                        {phaseErrors.title && (
                          <p className="text-xs text-destructive">{phaseErrors.title}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          value={phase.startDate}
                          onChange={(e) => handleUpdatePhase(phase.id, 'startDate', e.target.value)}
                          disabled={disabled}
                          min={projectStartDate}
                          max={projectEndDate}
                          className={cn(
                            'h-8',
                            phaseErrors.startDate && 'border-destructive'
                          )}
                        />
                        <BaselineImpactIcon
                          isValidated={isBaselineValidated}
                          hasChanged={initialPhase?.startDate !== phase.startDate}
                        />
                      </div>
                      {phaseErrors.startDate && (
                        <p className="text-xs text-destructive mt-1">{phaseErrors.startDate}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          value={phase.endDate}
                          onChange={(e) => handleUpdatePhase(phase.id, 'endDate', e.target.value)}
                          disabled={disabled}
                          min={phase.startDate || projectStartDate}
                          max={projectEndDate}
                          className={cn(
                            'h-8',
                            phaseErrors.endDate && 'border-destructive'
                          )}
                        />
                        <BaselineImpactIcon
                          isValidated={isBaselineValidated}
                          hasChanged={initialPhase?.endDate !== phase.endDate}
                        />
                      </div>
                      {phaseErrors.endDate && (
                        <p className="text-xs text-destructive mt-1">{phaseErrors.endDate}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={phase.coefficient}
                        onChange={(e) => handleUpdatePhase(phase.id, 'coefficient', parseInt(e.target.value) || 0)}
                        disabled={disabled}
                        min={1}
                        max={99}
                        className={cn(
                          'h-8 w-20',
                          phaseErrors.coefficient && 'border-destructive'
                        )}
                      />
                      {phaseErrors.coefficient && (
                        <p className="text-xs text-destructive mt-1">{phaseErrors.coefficient}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Textarea
                          value={phase.remarks}
                          onChange={(e) => handleUpdatePhase(phase.id, 'remarks', e.target.value)}
                          disabled={disabled}
                          maxLength={500}
                          placeholder="Optional remarks"
                          className="min-h-[36px] h-9 resize-none"
                          rows={1}
                        />
                        <p className="text-xs text-muted-foreground">{phase.remarks.length}/500</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setHistoryPhaseId(phase.id)}
                                disabled={phase.isNew}
                              >
                                <History className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View history</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeletePhaseId(phase.id)}
                          disabled={disabled}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletePhaseId} onOpenChange={() => setDeletePhaseId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Phase</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this phase? This action cannot be undone.
              {isBaselineValidated && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This is a structural change that affects the baseline.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeletePhaseId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePhase}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* History Dialog */}
      <Dialog open={!!historyPhaseId} onOpenChange={() => setHistoryPhaseId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phase History</DialogTitle>
            <DialogDescription>
              Modification history for "{historyPhase?.title}"
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {historyPhase?.lastModifiedBy ? (
              <p className="text-sm text-foreground">
                Last changed by <strong>{historyPhase.lastModifiedBy}</strong>
                {historyPhase.lastModifiedAt && (
                  <> on {format(new Date(historyPhase.lastModifiedAt), 'PPp')}</>
                )}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">No modification history available.</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHistoryPhaseId(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
