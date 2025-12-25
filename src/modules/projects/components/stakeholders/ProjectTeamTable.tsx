import React, { useState } from 'react';
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
import { Plus, Trash2, Save, Loader2, AlertTriangle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface TeamMemberData {
  id: string;
  roleId: string;
  employeeId: string;
  allocationPercent: number;
  startDate?: string;
  endDate?: string;
  remarks: string;
  isNew?: boolean;
}

interface MemberRole {
  id: string;
  code: string;
  label: string;
}

interface Employee {
  id: string;
  label: string;
  email?: string;
}

interface ProjectTeamTableProps {
  members: TeamMemberData[];
  roles: MemberRole[];
  employees: Employee[];
  onChange: (members: TeamMemberData[]) => void;
  onSave: () => Promise<void>;
  projectStartDate: string;
  projectEndDate: string;
  disabled?: boolean;
  isBaselineValidated?: boolean;
  initialMembers?: TeamMemberData[];
}

export const ProjectTeamTable: React.FC<ProjectTeamTableProps> = ({
  members,
  roles,
  employees,
  onChange,
  onSave,
  projectStartDate,
  projectEndDate,
  disabled = false,
  isBaselineValidated = false,
  initialMembers = [],
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const hasChanges = JSON.stringify(members) !== JSON.stringify(initialMembers);
  
  // Calculate team change percentage
  const initialEmployeeIds = new Set(initialMembers.map(m => m.employeeId));
  const currentEmployeeIds = new Set(members.map(m => m.employeeId));
  const changedCount = [...initialEmployeeIds].filter(id => !currentEmployeeIds.has(id)).length +
                       [...currentEmployeeIds].filter(id => !initialEmployeeIds.has(id)).length;
  const changePercent = initialMembers.length > 0 ? (changedCount / initialMembers.length) * 100 : 0;
  const hasSignificantChange = isBaselineValidated && changePercent >= 30;

  // Check for duplicate employees
  const employeeIds = members.map(m => m.employeeId).filter(id => id);
  const hasDuplicates = employeeIds.length !== new Set(employeeIds).size;

  const validateMember = (member: TeamMemberData): Record<string, string> => {
    const memberErrors: Record<string, string> = {};
    
    if (!member.roleId) {
      memberErrors.roleId = 'Role is required';
    }

    if (!member.employeeId) {
      memberErrors.employeeId = 'Employee is required';
    } else if (members.filter(m => m.employeeId === member.employeeId).length > 1) {
      memberErrors.employeeId = 'Employee already in team';
    }

    if (member.allocationPercent < 1 || member.allocationPercent > 100) {
      memberErrors.allocationPercent = 'Must be 1-100';
    }

    if (member.startDate && member.endDate && member.startDate >= member.endDate) {
      memberErrors.endDate = 'Must be after start';
    }

    if (member.startDate && projectStartDate && member.startDate < projectStartDate) {
      memberErrors.startDate = 'Must be within project dates';
    }

    if (member.endDate && projectEndDate && member.endDate > projectEndDate) {
      memberErrors.endDate = 'Must be within project dates';
    }

    if (member.remarks.length > 200) {
      memberErrors.remarks = 'Max 200 characters';
    }

    return memberErrors;
  };

  const handleAddMember = () => {
    const newMember: TeamMemberData = {
      id: `team-new-${Date.now()}`,
      roleId: '',
      employeeId: '',
      allocationPercent: 100,
      startDate: projectStartDate,
      endDate: projectEndDate,
      remarks: '',
      isNew: true,
    };
    onChange([...members, newMember]);
  };

  const handleUpdateMember = (id: string, field: keyof TeamMemberData, value: string | number) => {
    const updated = members.map(m => 
      m.id === id ? { ...m, [field]: value } : m
    );
    onChange(updated);

    const member = updated.find(m => m.id === id);
    if (member) {
      const memberErrors = validateMember(member);
      setErrors(prev => ({ ...prev, [id]: memberErrors }));
    }
  };

  const handleDeleteMember = () => {
    if (!deleteId) return;
    
    if (members.length === 1) {
      toast.error('At least one team member is required');
      setDeleteId(null);
      return;
    }
    
    const updated = members.filter(m => m.id !== deleteId);
    onChange(updated);
    setDeleteId(null);
    toast.success('Team member removed');
  };

  const handleSave = async () => {
    // Validate minimum 1 member
    if (members.length === 0) {
      toast.error('At least one team member is required');
      return;
    }

    // Validate all members
    const allErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    members.forEach(member => {
      const memberErrors = validateMember(member);
      if (Object.keys(memberErrors).length > 0) {
        allErrors[member.id] = memberErrors;
        hasErrors = true;
      }
    });

    setErrors(allErrors);

    if (hasErrors) {
      toast.error('Please fix validation errors');
      return;
    }

    if (hasDuplicates) {
      toast.error('Duplicate employees found in team');
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      toast.success(`${members.length} team members saved`);
    } catch (error) {
      toast.error('Failed to save team');
    } finally {
      setIsSaving(false);
    }
  };

  const getEmployeeById = (id: string) => employees.find(e => e.id === id);

  return (
    <div className="space-y-4">
      {/* Baseline Impact Alert */}
      {hasSignificantChange && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">BASELINE IMPACT</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Team changes exceed 30%. This affects baseline.
            </p>
          </div>
        </div>
      )}

      {/* Minimum Member Warning */}
      {members.length === 0 && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive font-medium">
            At least one team member is required
          </p>
        </div>
      )}

      {/* Duplicate Warning */}
      {hasDuplicates && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-sm text-destructive font-medium">
            Duplicate employees detected. Each employee can only appear once.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Project Team *</h4>
          <p className="text-sm text-muted-foreground">Mandatory: At least 1 team member required</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddMember}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving || !hasChanges || hasDuplicates}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save Team
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[150px]">Role *</TableHead>
              <TableHead className="w-[200px]">Employee *</TableHead>
              <TableHead className="w-[100px]">Allocation % *</TableHead>
              <TableHead className="w-[130px]">Start Date</TableHead>
              <TableHead className="w-[130px]">End Date</TableHead>
              <TableHead>Remarks</TableHead>
              <TableHead className="w-[60px]">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-destructive py-8">
                  No team members. At least one is required. Click "Add Member".
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => {
                const memberErrors = errors[member.id] || {};
                const employee = getEmployeeById(member.employeeId);
                
                return (
                  <TableRow key={member.id} className={member.isNew ? 'bg-primary/5' : ''}>
                    <TableCell>
                      <Select
                        value={member.roleId}
                        onValueChange={(v) => handleUpdateMember(member.id, 'roleId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', memberErrors.roleId && 'border-destructive')}>
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
                      <Select
                        value={member.employeeId}
                        onValueChange={(v) => handleUpdateMember(member.id, 'employeeId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', memberErrors.employeeId && 'border-destructive')}>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {employees.map(e => (
                            <SelectItem key={e.id} value={e.id}>
                              {e.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {memberErrors.employeeId && (
                        <p className="text-xs text-destructive mt-1">{memberErrors.employeeId}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={member.allocationPercent}
                          onChange={(e) => handleUpdateMember(member.id, 'allocationPercent', parseInt(e.target.value) || 0)}
                          disabled={disabled}
                          min={1}
                          max={100}
                          className={cn('h-8 w-16', memberErrors.allocationPercent && 'border-destructive')}
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={member.startDate || ''}
                        onChange={(e) => handleUpdateMember(member.id, 'startDate', e.target.value)}
                        disabled={disabled}
                        min={projectStartDate}
                        max={projectEndDate}
                        className={cn('h-8', memberErrors.startDate && 'border-destructive')}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={member.endDate || ''}
                        onChange={(e) => handleUpdateMember(member.id, 'endDate', e.target.value)}
                        disabled={disabled}
                        min={member.startDate || projectStartDate}
                        max={projectEndDate}
                        className={cn('h-8', memberErrors.endDate && 'border-destructive')}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={member.remarks}
                        onChange={(e) => handleUpdateMember(member.id, 'remarks', e.target.value)}
                        disabled={disabled}
                        maxLength={200}
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
                        onClick={() => setDeleteId(member.id)}
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
            <DialogTitle>Remove Team Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this team member?
              {members.length === 1 && (
                <span className="block mt-2 text-destructive font-medium">
                  Warning: At least one team member is required.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteMember}
              disabled={members.length === 1}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
