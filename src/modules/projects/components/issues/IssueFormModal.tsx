import React, { useState, useEffect } from 'react';
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
  Issue,
  IssueCategory,
  IssuePriority,
  ISSUE_CATEGORIES,
  ISSUE_PRIORITIES,
  getIssuePriorityColor,
} from '../../types/risks-issues.types';
import { cn } from '@/lib/utils';

interface IssueFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Issue | null;
  employees: { id: string; name: string }[];
  phases?: { id: string; title: string }[];
  deliverables?: { id: string; title: string }[];
  isSubmitting?: boolean;
}

export const IssueFormModal: React.FC<IssueFormModalProps> = ({
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
    category: 'technical' as IssueCategory,
    priority: 'medium' as IssuePriority,
    action: '',
    ownerId: '',
    targetDate: '',
    status: 'todo' as Issue['status'],
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
          category: initialData.category,
          priority: initialData.priority,
          action: initialData.action,
          ownerId: initialData.ownerId,
          targetDate: initialData.targetDate,
          status: initialData.status,
          linkedPhaseId: initialData.linkedPhaseId || '',
          linkedDeliverableId: initialData.linkedDeliverableId || '',
        });
      } else {
        setFormData({
          title: '',
          description: '',
          category: 'technical',
          priority: 'medium',
          action: '',
          ownerId: '',
          targetDate: '',
          status: 'todo',
          linkedPhaseId: '',
          linkedDeliverableId: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (formData.title.length > 100) newErrors.title = 'Title must be less than 100 characters';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.description.length > 500) newErrors.description = 'Description must be less than 500 characters';
    if (!formData.action.trim()) newErrors.action = 'Planned action is required';
    if (formData.action.length > 500) newErrors.action = 'Action must be less than 500 characters';
    if (!formData.ownerId) newErrors.ownerId = 'Owner is required';
    if (!formData.targetDate) newErrors.targetDate = 'Target date is required';

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
          <DialogTitle>{initialData ? 'Edit Issue/Action' : 'Create Issue/Action'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update the issue details below.' : 'Fill in the issue details below.'}
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
              placeholder="Issue title"
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
              placeholder="Describe the issue..."
              rows={3}
              maxLength={500}
              className={cn(errors.description && 'border-destructive')}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category <span className="text-destructive">*</span></Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v as IssueCategory })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {ISSUE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority <span className="text-destructive">*</span></Label>
              <Select value={formData.priority} onValueChange={(v) => setFormData({ ...formData, priority: v as IssuePriority })}>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-background z-50">
                  {ISSUE_PRIORITIES.map((pri) => (
                    <SelectItem key={pri.value} value={pri.value}>
                      <span className="flex items-center gap-2">
                        <span className={cn(
                          'w-2 h-2 rounded-full',
                          pri.value === 'high' && 'bg-destructive',
                          pri.value === 'medium' && 'bg-amber-500',
                          pri.value === 'low' && 'bg-emerald-500'
                        )} />
                        {pri.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Planned Action */}
          <div className="space-y-2">
            <Label htmlFor="action">Planned Action <span className="text-destructive">*</span></Label>
            <Textarea
              id="action"
              value={formData.action}
              onChange={(e) => setFormData({ ...formData, action: e.target.value })}
              placeholder="Describe the planned action to resolve this issue..."
              rows={2}
              maxLength={500}
              className={cn(errors.action && 'border-destructive')}
            />
            {errors.action && <p className="text-xs text-destructive">{errors.action}</p>}
          </div>

          {/* Owner & Target Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Action Owner <span className="text-destructive">*</span></Label>
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
              <Label>Target Resolution Date <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className={cn(errors.targetDate && 'border-destructive')}
              />
              {errors.targetDate && <p className="text-xs text-destructive">{errors.targetDate}</p>}
            </div>
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
              initialData ? 'Update Issue' : 'Create Issue'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IssueFormModal;
