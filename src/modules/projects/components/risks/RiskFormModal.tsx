import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import {
  Risk,
  RiskType,
  RiskResponse,
  RISK_TYPES,
  RISK_RESPONSES,
  getRiskScoreColor,
  getRiskScoreLevel,
} from '../../types/risks-issues.types';
import { cn } from '@/lib/utils';

interface RiskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (risk: Omit<Risk, 'id' | 'createdAt' | 'updatedAt' | 'score'>) => Promise<void>;
  initialData?: Risk | null;
  employees: { id: string; name: string }[];
  phases?: { id: string; title: string }[];
  deliverables?: { id: string; title: string }[];
  isSubmitting?: boolean;
}

export const RiskFormModal: React.FC<RiskFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  employees,
  phases = [],
  deliverables = [],
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'technical' as RiskType,
    probability: 3,
    impact: 3,
    response: 'mitigate' as RiskResponse,
    ownerId: '',
    targetDate: '',
    observation: '',
    status: 'identified' as Risk['status'],
    linkedPhaseId: '',
    linkedDeliverableId: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          title: initialData.title,
          description: initialData.description,
          type: initialData.type,
          probability: initialData.probability,
          impact: initialData.impact,
          response: initialData.response,
          ownerId: initialData.ownerId,
          targetDate: initialData.targetDate,
          observation: initialData.observation,
          status: initialData.status,
          linkedPhaseId: initialData.linkedPhaseId || '',
          linkedDeliverableId: initialData.linkedDeliverableId || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          type: 'technical',
          probability: 3,
          impact: 3,
          response: 'mitigate',
          ownerId: '',
          targetDate: '',
          observation: '',
          status: 'identified',
          linkedPhaseId: '',
          linkedDeliverableId: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const score = useMemo(() => formData.probability * formData.impact, [formData.probability, formData.impact]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    if (!formData.ownerId) newErrors.ownerId = 'Owner is required';
    if (!formData.targetDate) newErrors.targetDate = 'Target date is required';
    if (!formData.observation.trim()) newErrors.observation = 'Observation is required';
    if (formData.observation.length > 500) newErrors.observation = 'Observation must be less than 500 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    await onSubmit({
      ...formData,
      ownerName: employees.find(e => e.id === formData.ownerId)?.name,
    });
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Risk' : 'Create Risk'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the risk details below.' : 'Fill in the risk details below.'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Risk title"
              maxLength={100}
              className={cn(errors.title && 'border-destructive')}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the risk..."
              rows={3}
              maxLength={500}
              className={cn(errors.description && 'border-destructive')}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <Label>Risk Type <span className="text-destructive">*</span></Label>
            <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v as RiskType })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {RISK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Probability & Impact */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Probability (1-5) <span className="text-destructive">*</span></Label>
              <Select 
                value={String(formData.probability)} 
                onValueChange={(v) => setFormData({ ...formData, probability: Number(v) })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Impact (1-5) <span className="text-destructive">*</span></Label>
              <Select 
                value={String(formData.impact)} 
                onValueChange={(v) => setFormData({ ...formData, impact: Number(v) })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Score</Label>
              <div className="flex items-center gap-2 h-10">
                <Badge variant="outline" className={cn('text-lg px-3 py-1', getRiskScoreColor(score))}>
                  {score}
                </Badge>
                <span className="text-sm text-muted-foreground">({getRiskScoreLevel(score)})</span>
              </div>
            </div>
          </div>

          {/* Response Type */}
          <div className="space-y-2">
            <Label>Response Type <span className="text-destructive">*</span></Label>
            <Select value={formData.response} onValueChange={(v) => setFormData({ ...formData, response: v as RiskResponse })}>
              <SelectTrigger className="bg-background">
                <SelectValue placeholder="Select response" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {RISK_RESPONSES.map((resp) => (
                  <SelectItem key={resp.value} value={resp.value}>{resp.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Owner & Target Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Risk Owner <span className="text-destructive">*</span></Label>
              <Select value={formData.ownerId} onValueChange={(v) => setFormData({ ...formData, ownerId: v })}>
                <SelectTrigger className={cn('bg-background', errors.ownerId && 'border-destructive')}>
                  <SelectValue placeholder="Select owner" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.ownerId && <p className="text-xs text-destructive">{errors.ownerId}</p>}
            </div>

            <div className="space-y-2">
              <Label>Target Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className={cn(errors.targetDate && 'border-destructive')}
              />
              {errors.targetDate && <p className="text-xs text-destructive">{errors.targetDate}</p>}
            </div>
          </div>

          {/* Observation */}
          <div className="space-y-2">
            <Label htmlFor="observation">Response Observation <span className="text-destructive">*</span></Label>
            <Textarea
              id="observation"
              value={formData.observation}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              placeholder="Describe the planned response..."
              rows={2}
              maxLength={500}
              className={cn(errors.observation && 'border-destructive')}
            />
            {errors.observation && <p className="text-xs text-destructive">{errors.observation}</p>}
          </div>

          {/* Linked Phase & Deliverable (Optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Linked Phase <span className="text-muted-foreground">(optional)</span></Label>
              <Select 
                value={formData.linkedPhaseId || 'none'} 
                onValueChange={(v) => setFormData({ ...formData, linkedPhaseId: v === 'none' ? '' : v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select phase" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="none">None</SelectItem>
                  {phases.map((phase) => (
                    <SelectItem key={phase.id} value={phase.id}>{phase.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Linked Deliverable <span className="text-muted-foreground">(optional)</span></Label>
              <Select 
                value={formData.linkedDeliverableId || 'none'} 
                onValueChange={(v) => setFormData({ ...formData, linkedDeliverableId: v === 'none' ? '' : v })}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select deliverable" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  <SelectItem value="none">None</SelectItem>
                  {deliverables.map((del) => (
                    <SelectItem key={del.id} value={del.id}>{del.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {initialData ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              initialData ? 'Update Risk' : 'Create Risk'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RiskFormModal;
