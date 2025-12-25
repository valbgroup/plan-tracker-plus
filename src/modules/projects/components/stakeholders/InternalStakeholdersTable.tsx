import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
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
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface InternalStakeholderData {
  id: string;
  orgId: string;
  roleId: string;
  memberIds: string[];
  description: string;
  isNew?: boolean;
}

interface OrgStructure {
  id: string;
  code: string;
  label: string;
}

interface ProjectRole {
  id: string;
  code: string;
  label: string;
}

interface Employee {
  id: string;
  label: string;
}

interface InternalStakeholdersTableProps {
  stakeholders: InternalStakeholderData[];
  organizations: OrgStructure[];
  roles: ProjectRole[];
  employees: Employee[];
  onChange: (stakeholders: InternalStakeholderData[]) => void;
  onSave: () => Promise<void>;
  disabled?: boolean;
}

export const InternalStakeholdersTable: React.FC<InternalStakeholdersTableProps> = ({
  stakeholders,
  organizations,
  roles,
  employees,
  onChange,
  onSave,
  disabled = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const validateStakeholder = (stakeholder: InternalStakeholderData): Record<string, string> => {
    const shErrors: Record<string, string> = {};
    
    if (!stakeholder.orgId) {
      shErrors.orgId = 'Organization is required';
    }

    if (!stakeholder.roleId) {
      shErrors.roleId = 'Role is required';
    }

    if (stakeholder.description.length > 300) {
      shErrors.description = 'Max 300 characters';
    }

    return shErrors;
  };

  const handleAddStakeholder = () => {
    const newStakeholder: InternalStakeholderData = {
      id: `int-sh-new-${Date.now()}`,
      orgId: '',
      roleId: '',
      memberIds: [],
      description: '',
      isNew: true,
    };
    onChange([...stakeholders, newStakeholder]);
  };

  const handleUpdateStakeholder = (id: string, field: keyof InternalStakeholderData, value: string | string[]) => {
    const updated = stakeholders.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    );
    onChange(updated);

    const stakeholder = updated.find(s => s.id === id);
    if (stakeholder) {
      const shErrors = validateStakeholder(stakeholder);
      setErrors(prev => ({ ...prev, [id]: shErrors }));
    }
  };

  const handleDeleteStakeholder = () => {
    if (!deleteId) return;
    const updated = stakeholders.filter(s => s.id !== deleteId);
    onChange(updated);
    setDeleteId(null);
    toast.success('Stakeholder removed');
  };

  const handleSave = async () => {
    const allErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    stakeholders.forEach(stakeholder => {
      const shErrors = validateStakeholder(stakeholder);
      if (Object.keys(shErrors).length > 0) {
        allErrors[stakeholder.id] = shErrors;
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
      toast.success('Internal stakeholders saved');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Internal Stakeholders</h4>
          <p className="text-sm text-muted-foreground">Optional: Internal organizations involved in the project</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddStakeholder}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Stakeholder
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[200px]">Organization *</TableHead>
              <TableHead className="w-[150px]">Role *</TableHead>
              <TableHead>Team Members</TableHead>
              <TableHead className="w-[200px]">Description</TableHead>
              <TableHead className="w-[60px]">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stakeholders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No internal stakeholders defined. Click "Add Stakeholder" to add one (optional).
                </TableCell>
              </TableRow>
            ) : (
              stakeholders.map((stakeholder) => {
                const shErrors = errors[stakeholder.id] || {};
                
                return (
                  <TableRow key={stakeholder.id} className={stakeholder.isNew ? 'bg-primary/5' : ''}>
                    <TableCell>
                      <Select
                        value={stakeholder.orgId}
                        onValueChange={(v) => handleUpdateStakeholder(stakeholder.id, 'orgId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', shErrors.orgId && 'border-destructive')}>
                          <SelectValue placeholder="Select org" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {organizations.map(o => (
                            <SelectItem key={o.id} value={o.id}>
                              {o.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={stakeholder.roleId}
                        onValueChange={(v) => handleUpdateStakeholder(stakeholder.id, 'roleId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', shErrors.roleId && 'border-destructive')}>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {roles.map(r => (
                            <SelectItem key={r.id} value={r.id}>
                              {r.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {stakeholder.memberIds.length > 0 
                          ? `${stakeholder.memberIds.length} members`
                          : 'No members'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={stakeholder.description}
                        onChange={(e) => handleUpdateStakeholder(stakeholder.id, 'description', e.target.value)}
                        disabled={disabled}
                        maxLength={300}
                        placeholder="Optional description"
                        className="min-h-[36px] h-9 resize-none"
                        rows={1}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(stakeholder.id)}
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

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Stakeholder</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this internal stakeholder?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteStakeholder}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
