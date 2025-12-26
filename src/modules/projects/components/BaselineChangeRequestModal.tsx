import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BaselineChangeRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (justification?: string) => void;
  fieldName: string;
  fieldLabel: string;
  oldValue: string | number | Date | null;
  newValue: string | number | Date | null;
  isSubmitting?: boolean;
}

export const BaselineChangeRequestModal: React.FC<BaselineChangeRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  fieldName,
  fieldLabel,
  oldValue,
  newValue,
  isSubmitting = false,
}) => {
  const [justification, setJustification] = useState('');

  const formatValue = (value: string | number | Date | null): string => {
    if (value === null || value === undefined || value === '') return '-';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  const handleSubmit = () => {
    onSubmit(justification.trim() || undefined);
    setJustification('');
  };

  const handleClose = () => {
    setJustification('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="h-5 w-5" />
            Baseline Change Request
          </DialogTitle>
          <DialogDescription>
            You are modifying a baseline-protected field. This change requires approval.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Field Info */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Field:</span>
              <Badge variant="outline" className="font-medium">
                {fieldLabel}
              </Badge>
            </div>

            {/* Old → New Value */}
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-md border border-destructive/20 bg-destructive/5 p-3">
                <p className="text-xs text-muted-foreground mb-1">Old Value</p>
                <p className="text-sm font-medium text-foreground line-through opacity-70">
                  {formatValue(oldValue)}
                </p>
              </div>
              
              <ArrowRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              
              <div className="flex-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 p-3">
                <p className="text-xs text-muted-foreground mb-1">New Value</p>
                <p className="text-sm font-medium text-foreground">
                  {formatValue(newValue)}
                </p>
              </div>
            </div>
          </div>

          {/* Justification */}
          <div className="space-y-2">
            <Label htmlFor="justification" className="text-sm font-medium">
              Justification <span className="text-muted-foreground">(Optional)</span>
            </Label>
            <Textarea
              id="justification"
              placeholder="Explain why this baseline change is needed..."
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground">
              Providing a justification helps the PMO understand the reason for this change.
            </p>
          </div>

          {/* Info Box */}
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3">
            <p className="text-xs text-amber-700 dark:text-amber-400">
              <strong>Note:</strong> This change will be submitted for PMO approval. 
              The field will show as "Pending" until approved.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit for Approval'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BaselineChangeRequestModal;
