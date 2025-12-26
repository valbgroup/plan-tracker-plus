import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { Textarea } from '@/components/ui/textarea';
import { BaselineImpactIcon } from '../BaselineImpactIcon';
import { Plus, Trash2, Save, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface BudgetEnvelopeData {
  id: string;
  typeId: string;
  budgetTypeLabel?: string;
  amount: number;
  fundingSourceId?: string;
  isNew?: boolean;
}

interface EnvelopeType {
  id: string;
  code: string;
  label: string;
  budgetTypeId: string;
}

interface FundingSource {
  id: string;
  code: string;
  label: string;
}

interface BudgetType {
  id: string;
  label: string;
}

interface BudgetEnvelopesTableProps {
  envelopes: BudgetEnvelopeData[];
  totalBudget: number;
  currency: string;
  envelopeTypes: EnvelopeType[];
  fundingSources: FundingSource[];
  budgetTypes: BudgetType[];
  onChange: (envelopes: BudgetEnvelopeData[]) => void;
  onSave: () => Promise<void>;
  disabled?: boolean;
  isBaselineValidated?: boolean;
  initialEnvelopes?: BudgetEnvelopeData[];
}

export const BudgetEnvelopesTable: React.FC<BudgetEnvelopesTableProps> = ({
  envelopes,
  totalBudget,
  currency,
  envelopeTypes,
  fundingSources,
  budgetTypes,
  onChange,
  onSave,
  disabled = false,
  isBaselineValidated = false,
  initialEnvelopes = [],
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [confirmChange, setConfirmChange] = useState(false);
  const [changeJustification, setChangeJustification] = useState('');
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const hasChanges = JSON.stringify(envelopes) !== JSON.stringify(initialEnvelopes);
  
  // Calculate sum and variance
  const envelopeSum = useMemo(() => 
    envelopes.reduce((sum, e) => sum + (e.amount || 0), 0), 
    [envelopes]
  );
  
  const sumDifference = envelopeSum - totalBudget;
  const tolerance = totalBudget * 0.01; // 1% tolerance
  const isWithinTolerance = Math.abs(sumDifference) <= tolerance;

  // Check for significant budget change (>5%)
  const initialTotal = initialEnvelopes.reduce((sum, e) => sum + (e.amount || 0), 0);
  const changePercent = initialTotal > 0 ? Math.abs((envelopeSum - initialTotal) / initialTotal) * 100 : 0;
  const hasSignificantChange = isBaselineValidated && changePercent > 5;

  // Check for duplicate envelope types
  const typeIds = envelopes.map(e => e.typeId).filter(id => id);
  const hasDuplicates = typeIds.length !== new Set(typeIds).size;

  const getBudgetTypeLabel = (typeId: string) => {
    const envelopeType = envelopeTypes.find(t => t.id === typeId);
    if (envelopeType) {
      const budgetType = budgetTypes.find(bt => bt.id === envelopeType.budgetTypeId);
      return budgetType?.label || 'N/A';
    }
    return 'N/A';
  };

  const validateEnvelope = (envelope: BudgetEnvelopeData): Record<string, string> => {
    const envErrors: Record<string, string> = {};
    
    if (!envelope.typeId) {
      envErrors.typeId = 'Type is required';
    } else if (envelopes.filter(e => e.typeId === envelope.typeId).length > 1) {
      envErrors.typeId = 'Type already used';
    }

    if (envelope.amount <= 0) {
      envErrors.amount = 'Must be greater than 0';
    }

    return envErrors;
  };

  const handleAddEnvelope = () => {
    const newEnvelope: BudgetEnvelopeData = {
      id: `env-new-${Date.now()}`,
      typeId: '',
      amount: 0,
      fundingSourceId: undefined,
      isNew: true,
    };
    onChange([...envelopes, newEnvelope]);
  };

  const handleUpdateEnvelope = (id: string, field: keyof BudgetEnvelopeData, value: string | number | undefined) => {
    const updated = envelopes.map(e => 
      e.id === id ? { ...e, [field]: value } : e
    );
    onChange(updated);

    const envelope = updated.find(e => e.id === id);
    if (envelope) {
      const envErrors = validateEnvelope(envelope);
      setErrors(prev => ({ ...prev, [id]: envErrors }));
    }
  };

  const handleDeleteEnvelope = () => {
    if (!deleteId) return;
    const updated = envelopes.filter(e => e.id !== deleteId);
    onChange(updated);
    setDeleteId(null);
    toast.success('Envelope deleted');
  };

  const handleSave = async () => {
    // Check if significant change requires confirmation
    if (hasSignificantChange && !confirmChange) {
      setConfirmChange(true);
      return;
    }

    // Validate all envelopes
    const allErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    envelopes.forEach(envelope => {
      const envErrors = validateEnvelope(envelope);
      if (Object.keys(envErrors).length > 0) {
        allErrors[envelope.id] = envErrors;
        hasErrors = true;
      }
    });

    setErrors(allErrors);

    if (hasErrors) {
      toast.error('Please fix validation errors');
      return;
    }

    if (hasDuplicates) {
      toast.error('Duplicate envelope types found');
      return;
    }

    if (!isWithinTolerance) {
      toast.error(`Envelope total (${envelopeSum.toLocaleString()}) must equal budget (${totalBudget.toLocaleString()}) ±1%`);
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      toast.success(`${envelopes.length} envelopes saved`);
      setConfirmChange(false);
      setChangeJustification('');
    } catch (error) {
      toast.error('Failed to save envelopes');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-4">
      {/* Baseline Impact Alert */}
      {hasSignificantChange && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">BASELINE IMPACT</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Budget change exceeds 5% ({changePercent.toFixed(1)}%). This affects baseline.
            </p>
          </div>
        </div>
      )}

      {/* Sum Validation */}
      {envelopes.length > 0 && !isWithinTolerance && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">SUM MISMATCH</p>
            <p className="text-sm text-destructive/80">
              Envelopes total to {formatCurrency(envelopeSum)}, but budget is {formatCurrency(totalBudget)}. 
              Difference: {formatCurrency(Math.abs(sumDifference))}
            </p>
          </div>
        </div>
      )}

      {/* Duplicate Warning */}
      {hasDuplicates && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive font-medium">
            Duplicate envelope types detected. Each type can only appear once.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Budget Envelopes</h4>
          <p className="text-sm text-muted-foreground">
            Total Budget: {formatCurrency(totalBudget)} | Allocated: {formatCurrency(envelopeSum)}
            <span className={cn('ml-2', isWithinTolerance ? 'text-green-600' : 'text-destructive')}>
              ({isWithinTolerance ? '✓ Valid' : `Δ ${formatCurrency(sumDifference)}`})
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddEnvelope}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Envelope
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving || !hasChanges || hasDuplicates || !isWithinTolerance}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Envelopes
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Budget Type</TableHead>
              <TableHead className="w-[180px]">Envelope Type *</TableHead>
              <TableHead className="w-[150px]">
                Planned Amount *
                {isBaselineValidated && <span className="ml-1">🔐</span>}
              </TableHead>
              <TableHead className="w-[150px]">Funding Source</TableHead>
              <TableHead className="w-[100px]">Allocation %</TableHead>
              <TableHead className="w-[60px]">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {envelopes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                  No budget envelopes defined. Click "Add Envelope" to add one.
                </TableCell>
              </TableRow>
            ) : (
              envelopes.map((envelope) => {
                const envErrors = errors[envelope.id] || {};
                const initialEnv = initialEnvelopes.find(ie => ie.id === envelope.id);
                const allocationPercent = totalBudget > 0 ? (envelope.amount / totalBudget) * 100 : 0;
                
                return (
                  <TableRow key={envelope.id} className={envelope.isNew ? 'bg-primary/5' : ''}>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {getBudgetTypeLabel(envelope.typeId)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={envelope.typeId}
                        onValueChange={(v) => handleUpdateEnvelope(envelope.id, 'typeId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', envErrors.typeId && 'border-destructive')}>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {envelopeTypes.map(t => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {envErrors.typeId && (
                        <p className="text-xs text-destructive mt-1">{envErrors.typeId}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={envelope.amount}
                          onChange={(e) => handleUpdateEnvelope(envelope.id, 'amount', parseFloat(e.target.value) || 0)}
                          disabled={disabled}
                          min={0}
                          className={cn('h-8', envErrors.amount && 'border-destructive')}
                        />
                        <BaselineImpactIcon
                          isValidated={isBaselineValidated}
                          hasChanged={initialEnv?.amount !== envelope.amount}
                        />
                      </div>
                      {envErrors.amount && (
                        <p className="text-xs text-destructive mt-1">{envErrors.amount}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={envelope.fundingSourceId || '__none__'}
                        onValueChange={(v) =>
                          handleUpdateEnvelope(
                            envelope.id,
                            'fundingSourceId',
                            v === '__none__' ? undefined : v
                          )
                        }
                        disabled={disabled}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue placeholder="Optional" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="__none__">None</SelectItem>
                          {fundingSources.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {allocationPercent.toFixed(2)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(envelope.id)}
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
            <DialogTitle>Delete Envelope</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this budget envelope?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteEnvelope}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Baseline Change Confirmation Dialog */}
      <Dialog open={confirmChange} onOpenChange={setConfirmChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Baseline Change Confirmation</DialogTitle>
            <DialogDescription>
              This change affects the baseline (budget change exceeds 5%). Please provide justification.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={changeJustification}
              onChange={(e) => setChangeJustification(e.target.value)}
              placeholder="Enter justification for this budget change..."
              maxLength={500}
              rows={4}
            />
            <p className="text-xs text-muted-foreground mt-1">{changeJustification.length}/500</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!changeJustification.trim()}
            >
              Confirm Change
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
