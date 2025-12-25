import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertTriangle, CheckCircle, Shield, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type BaselineStatus = 'draft' | 'modified' | 'validated';

interface BaselineControlHeaderProps {
  status: BaselineStatus;
  version?: string;
  onValidateBaseline: () => Promise<void>;
  onRequestChange: (data: { type: string; description: string }) => Promise<void>;
  hasModifications?: boolean;
  validationErrors?: string[];
  isValidating?: boolean;
}

export const BaselineControlHeader: React.FC<BaselineControlHeaderProps> = ({
  status,
  version = 'V1.0',
  onValidateBaseline,
  onRequestChange,
  hasModifications = false,
  validationErrors = [],
  isValidating = false,
}) => {
  const [showValidateModal, setShowValidateModal] = useState(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [changeType, setChangeType] = useState<string>('');
  const [changeDescription, setChangeDescription] = useState('');

  const getStatusBadge = () => {
    switch (status) {
      case 'draft':
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Draft
          </Badge>
        );
      case 'modified':
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
            Modified
          </Badge>
        );
      case 'validated':
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
            Validated {version}
          </Badge>
        );
      default:
        return null;
    }
  };

  const canValidate = status === 'draft' || status === 'modified';
  const canRequestChange = status === 'validated';

  const handleValidate = async () => {
    if (validationErrors.length > 0) {
      toast.error('Cannot validate: missing required fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onValidateBaseline();
      setShowValidateModal(false);
      toast.success(`Project validated as baseline ${version}`);
    } catch (error) {
      toast.error('Failed to validate baseline');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRequestChange = async () => {
    if (!changeType || !changeDescription.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await onRequestChange({ type: changeType, description: changeDescription });
      setShowChangeRequestModal(false);
      setChangeType('');
      setChangeDescription('');
      toast.success('Change request CHG-001 submitted');
    } catch (error) {
      toast.error('Failed to submit change request');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-muted/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Left: Status Badge */}
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Baseline Status:</span>
            {getStatusBadge()}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setShowValidateModal(true)}
              disabled={!canValidate || isValidating}
              className={cn(
                'transition-colors',
                canValidate
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Validate as Baseline
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChangeRequestModal(true)}
              disabled={!canRequestChange}
              className={cn(
                'transition-colors',
                canRequestChange
                  ? 'border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30'
                  : 'border-muted text-muted-foreground cursor-not-allowed'
              )}
            >
              Request Change
            </Button>
          </div>
        </div>

        {/* Modification Alert */}
        {status === 'validated' && hasModifications && (
          <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 dark:bg-amber-950/30 border-t border-amber-200 dark:border-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ This project baseline is validated. Changes will require approval.
            </span>
          </div>
        )}
      </div>

      {/* Validate Baseline Modal */}
      <Dialog open={showValidateModal} onOpenChange={setShowValidateModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Validate as Baseline
            </DialogTitle>
            <DialogDescription>
              This will create a baseline version of your project. All future changes will be tracked against this version.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {validationErrors.length > 0 ? (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-start gap-2">
                  <XCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <p className="font-medium text-destructive">Missing Required Fields</p>
                    <ul className="mt-2 text-sm text-destructive/90 list-disc list-inside">
                      {validationErrors.map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <p className="text-green-800 dark:text-green-200">All required fields are complete</p>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowValidateModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleValidate}
              disabled={validationErrors.length > 0 || isSubmitting}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Validate Baseline
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Change Modal */}
      <Dialog open={showChangeRequestModal} onOpenChange={setShowChangeRequestModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Baseline Change</DialogTitle>
            <DialogDescription>
              Submit a change request that will be reviewed by the PMO.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="change-type">Change Type *</Label>
              <Select value={changeType} onValueChange={setChangeType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select change type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MINOR">Minor - Small adjustments</SelectItem>
                  <SelectItem value="MAJOR">Major - Significant changes</SelectItem>
                  <SelectItem value="CRITICAL">Critical - Fundamental restructuring</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="change-description">Description *</Label>
              <Textarea
                id="change-description"
                placeholder="Describe the changes you need to make..."
                value={changeDescription}
                onChange={(e) => setChangeDescription(e.target.value)}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {changeDescription.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowChangeRequestModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleRequestChange}
              disabled={!changeType || !changeDescription.trim() || isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Submit Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
