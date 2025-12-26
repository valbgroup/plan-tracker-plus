import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Trash2, Save, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PhaseData } from './PhasesTable';

export interface DeliverableData {
  id: string;
  title: string;
  phaseId: string;
  typeId: string;
  duration: number;
  deliveryDate: string;
  coefficient: number;
  predecessorId?: string;
  relationType?: 'FD' | 'DD' | 'FF' | 'DF';
  remarks: string;
  isNew?: boolean;
}

interface DeliverableType {
  id: string;
  code: string;
  label: string;
}

interface DeliverablesTableProps {
  deliverables: DeliverableData[];
  phases: PhaseData[];
  deliverableTypes: DeliverableType[];
  onChange: (deliverables: DeliverableData[]) => void;
  onSave: () => Promise<void>;
  disabled?: boolean;
  isBaselineValidated?: boolean;
  initialDeliverables?: DeliverableData[];
}

const RELATION_TYPES = [
  { value: 'FD', label: 'Finish-to-Start', description: 'Predecessor must finish before this starts' },
  { value: 'DD', label: 'Start-to-Start', description: 'Both start at the same time' },
  { value: 'FF', label: 'Finish-to-Finish', description: 'Both finish at the same time' },
  { value: 'DF', label: 'Start-to-Finish', description: 'Predecessor must start before this finishes' },
];

// Cycle detection using DFS
const detectCycle = (deliverables: DeliverableData[], startId: string): string[] | null => {
  const graph = new Map<string, string>();
  deliverables.forEach(d => {
    if (d.predecessorId) {
      graph.set(d.id, d.predecessorId);
    }
  });

  const visited = new Set<string>();
  const path: string[] = [];

  const dfs = (nodeId: string): boolean => {
    if (path.includes(nodeId)) {
      path.push(nodeId);
      return true;
    }
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    path.push(nodeId);

    const next = graph.get(nodeId);
    if (next && dfs(next)) {
      return true;
    }

    path.pop();
    return false;
  };

  if (dfs(startId)) {
    const cycleStart = path[path.length - 1];
    const cycleStartIndex = path.indexOf(cycleStart);
    return path.slice(cycleStartIndex);
  }

  return null;
};

export const DeliverablesTable: React.FC<DeliverablesTableProps> = ({
  deliverables,
  phases,
  deliverableTypes,
  onChange,
  onSave,
  disabled = false,
  isBaselineValidated = false,
  initialDeliverables = [],
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});
  const [cycleError, setCycleError] = useState<string | null>(null);

  const hasChanges = JSON.stringify(deliverables) !== JSON.stringify(initialDeliverables);
  const hasStructuralChange = isBaselineValidated && (
    deliverables.length !== initialDeliverables.length ||
    deliverables.some(d => d.isNew) ||
    initialDeliverables.some(id => !deliverables.find(d => d.id === id.id))
  );

  const getPhaseById = (phaseId: string) => phases.find(p => p.id === phaseId);

  const validateDeliverable = (deliverable: DeliverableData): Record<string, string> => {
    const delErrors: Record<string, string> = {};
    
    if (!deliverable.title.trim()) {
      delErrors.title = 'Title is required';
    } else if (deliverable.title.length > 100) {
      delErrors.title = 'Max 100 characters';
    }

    if (!deliverable.phaseId) {
      delErrors.phaseId = 'Parent phase is required';
    }

    if (!deliverable.typeId) {
      delErrors.typeId = 'Type is required';
    }

    if (deliverable.duration <= 0) {
      delErrors.duration = 'Must be > 0 days';
    }

    if (!deliverable.deliveryDate) {
      delErrors.deliveryDate = 'Delivery date is required';
    } else {
      const phase = getPhaseById(deliverable.phaseId);
      if (phase) {
        if (deliverable.deliveryDate < phase.startDate || deliverable.deliveryDate > phase.endDate) {
          delErrors.deliveryDate = 'Must be within parent phase dates';
        }
      }
    }

    if (deliverable.coefficient < 1 || deliverable.coefficient > 99) {
      delErrors.coefficient = 'Must be 1-99';
    }

    if (deliverable.predecessorId && !deliverable.relationType) {
      delErrors.relationType = 'Required when predecessor is set';
    }

    if (deliverable.remarks.length > 500) {
      delErrors.remarks = 'Max 500 characters';
    }

    return delErrors;
  };

  const handleAddDeliverable = () => {
    const newDeliverable: DeliverableData = {
      id: `del-new-${Date.now()}`,
      title: '',
      phaseId: phases[0]?.id || '',
      typeId: '',
      duration: 5,
      deliveryDate: '',
      coefficient: 10,
      predecessorId: undefined,
      relationType: undefined,
      remarks: '',
      isNew: true,
    };
    onChange([...deliverables, newDeliverable]);
  };

  const handleUpdateDeliverable = (id: string, field: keyof DeliverableData, value: string | number | undefined) => {
    const updatedDeliverables = deliverables.map(d => 
      d.id === id ? { ...d, [field]: value } : d
    );
    onChange(updatedDeliverables);

    // Check for cycles when predecessor changes
    if (field === 'predecessorId' && value) {
      const cycle = detectCycle(updatedDeliverables, id);
      if (cycle) {
        const names = cycle.map(cid => {
          const del = updatedDeliverables.find(d => d.id === cid);
          return del?.title || cid;
        });
        setCycleError(`Circular dependency detected: ${names.join(' → ')}`);
      } else {
        setCycleError(null);
      }
    }

    // Validate on change
    const deliverable = updatedDeliverables.find(d => d.id === id);
    if (deliverable) {
      const delErrors = validateDeliverable(deliverable);
      setErrors(prev => ({ ...prev, [id]: delErrors }));
    }
  };

  const handleDeleteDeliverable = () => {
    if (!deleteId) return;
    const updatedDeliverables = deliverables.filter(d => d.id !== deleteId);
    // Also clear any predecessors pointing to this deliverable
    const cleaned = updatedDeliverables.map(d => 
      d.predecessorId === deleteId ? { ...d, predecessorId: undefined, relationType: undefined } : d
    );
    onChange(cleaned);
    setDeleteId(null);
    setCycleError(null);
    toast.success('Deliverable deleted');
  };

  const handleSave = async () => {
    // Check for cycles first
    for (const deliverable of deliverables) {
      if (deliverable.predecessorId) {
        const cycle = detectCycle(deliverables, deliverable.id);
        if (cycle) {
          const names = cycle.map(cid => {
            const del = deliverables.find(d => d.id === cid);
            return del?.title || cid;
          });
          setCycleError(`Circular dependency detected: ${names.join(' → ')}`);
          toast.error('Cannot save: Circular dependency detected');
          return;
        }
      }
    }
    setCycleError(null);

    // Validate all deliverables
    const allErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    deliverables.forEach(deliverable => {
      const delErrors = validateDeliverable(deliverable);
      if (Object.keys(delErrors).length > 0) {
        allErrors[deliverable.id] = delErrors;
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
      toast.success(`${deliverables.length} deliverables saved`);
    } catch (error) {
      toast.error('Failed to save deliverables');
    } finally {
      setIsSaving(false);
    }
  };

  // Get other deliverables for predecessor dropdown (exclude self)
  const getPredecessorOptions = (currentId: string) => {
    return deliverables.filter(d => d.id !== currentId);
  };

  return (
    <div className="space-y-4">
      {/* Structural Change Alert */}
      {hasStructuralChange && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">STRUCTURAL CHANGE DETECTED</p>
            <p className="text-sm text-destructive/80">
              Adding/removing deliverables affects baseline. Submit change request.
            </p>
          </div>
        </div>
      )}

      {/* Cycle Error */}
      {cycleError && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">CIRCULAR DEPENDENCY DETECTED</p>
            <p className="text-sm text-destructive/80">{cycleError}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <h4 className="text-md font-semibold text-foreground">Project Deliverables</h4>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddDeliverable}
            disabled={disabled || phases.length === 0}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Deliverable
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving || !hasChanges || !!cycleError}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Deliverables
          </Button>
        </div>
      </div>

      {phases.length === 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <p className="text-sm text-amber-800 dark:text-amber-200">
            Please create at least one phase before adding deliverables.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Title *</TableHead>
              <TableHead className="w-[140px]">Parent Phase *</TableHead>
              <TableHead className="w-[120px]">Type *</TableHead>
              <TableHead className="w-[90px]">Days *</TableHead>
              <TableHead className="w-[130px]">
                Delivery Date *
                {isBaselineValidated && <span className="ml-1">🔐</span>}
              </TableHead>
              <TableHead className="w-[80px]">Coeff *</TableHead>
              <TableHead className="w-[140px]">Predecessor</TableHead>
              <TableHead className="w-[120px]">Relation</TableHead>
              <TableHead className="w-[150px]">Remarks</TableHead>
              <TableHead className="w-[60px] text-center">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliverables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                  No deliverables defined. Click "New Deliverable" to add one.
                </TableCell>
              </TableRow>
            ) : (
              deliverables.map((deliverable) => {
                const delErrors = errors[deliverable.id] || {};
                const phase = getPhaseById(deliverable.phaseId);
                const initialDel = initialDeliverables.find(id => id.id === deliverable.id);
                
                return (
                  <TableRow key={deliverable.id} className={deliverable.isNew ? 'bg-primary/5' : ''}>
                    <TableCell>
                      <Input
                        value={deliverable.title}
                        onChange={(e) => handleUpdateDeliverable(deliverable.id, 'title', e.target.value)}
                        disabled={disabled}
                        maxLength={100}
                        placeholder="Deliverable name"
                        className={cn('h-8', delErrors.title && 'border-destructive')}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={deliverable.phaseId}
                        onValueChange={(v) => handleUpdateDeliverable(deliverable.id, 'phaseId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', delErrors.phaseId && 'border-destructive')}>
                          <SelectValue placeholder="Select phase" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {phases.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.title || `Phase ${p.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={deliverable.typeId}
                        onValueChange={(v) => handleUpdateDeliverable(deliverable.id, 'typeId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', delErrors.typeId && 'border-destructive')}>
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {deliverableTypes.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={deliverable.duration}
                          onChange={(e) => handleUpdateDeliverable(deliverable.id, 'duration', parseInt(e.target.value) || 0)}
                          disabled={disabled}
                          min={1}
                          className={cn('h-8 w-16', delErrors.duration && 'border-destructive')}
                        />
                        <span className="text-xs text-muted-foreground">d</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="date"
                          value={deliverable.deliveryDate}
                          onChange={(e) => handleUpdateDeliverable(deliverable.id, 'deliveryDate', e.target.value)}
                          disabled={disabled}
                          min={phase?.startDate}
                          max={phase?.endDate}
                          className={cn('h-8', delErrors.deliveryDate && 'border-destructive')}
                        />
                        <BaselineImpactIcon
                          isValidated={isBaselineValidated}
                          hasChanged={initialDel?.deliveryDate !== deliverable.deliveryDate}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={deliverable.coefficient}
                        onChange={(e) => handleUpdateDeliverable(deliverable.id, 'coefficient', parseInt(e.target.value) || 0)}
                        disabled={disabled}
                        min={1}
                        max={99}
                        className={cn('h-8 w-16', delErrors.coefficient && 'border-destructive')}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={deliverable.predecessorId || '__none__'}
                        onValueChange={(v) => handleUpdateDeliverable(deliverable.id, 'predecessorId', v === '__none__' ? undefined : v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="None" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="__none__">None</SelectItem>
                          {getPredecessorOptions(deliverable.id).map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.title || `Deliverable ${p.id}`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {deliverable.predecessorId && (
                        <Select
                          value={deliverable.relationType || ''}
                          onValueChange={(v) => handleUpdateDeliverable(deliverable.id, 'relationType', v as DeliverableData['relationType'])}
                          disabled={disabled}
                        >
                          <SelectTrigger className={cn('h-8', delErrors.relationType && 'border-destructive')}>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border shadow-lg z-50">
                            {RELATION_TYPES.map(rt => (
                              <SelectItem key={rt.value} value={rt.value}>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <span>{rt.value}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>{rt.description}</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={deliverable.remarks}
                        onChange={(e) => handleUpdateDeliverable(deliverable.id, 'remarks', e.target.value)}
                        disabled={disabled}
                        maxLength={500}
                        placeholder="Optional"
                        className="min-h-[36px] h-9 resize-none"
                        rows={1}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(deliverable.id)}
                        disabled={disabled}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Deliverable</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this deliverable? This action cannot be undone.
              {isBaselineValidated && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: This is a structural change that affects the baseline.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteDeliverable}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
