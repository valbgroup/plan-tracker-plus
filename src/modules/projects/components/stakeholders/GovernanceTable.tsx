import React, { useState } from 'react';
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
import { Plus, Trash2, Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface GovernanceInstanceData {
  id: string;
  title: string;
  dimension: 'GOV' | 'MGMT' | 'OPR' | '';
  meetingFrequency: 'Weekly' | 'Bi-weekly' | 'Monthly' | 'Quarterly' | '';
  memberIds: string[];
  isNew?: boolean;
}

interface Employee {
  id: string;
  label: string;
}

interface GovernanceTableProps {
  instances: GovernanceInstanceData[];
  employees: Employee[];
  onChange: (instances: GovernanceInstanceData[]) => void;
  onSave: () => Promise<void>;
  disabled?: boolean;
}

const DIMENSIONS = [
  { value: 'GOV', label: 'Governance' },
  { value: 'MGMT', label: 'Management' },
  { value: 'OPR', label: 'Operational' },
];

const FREQUENCIES = [
  { value: 'Weekly', label: 'Weekly' },
  { value: 'Bi-weekly', label: 'Bi-weekly' },
  { value: 'Monthly', label: 'Monthly' },
  { value: 'Quarterly', label: 'Quarterly' },
];

export const GovernanceTable: React.FC<GovernanceTableProps> = ({
  instances,
  employees,
  onChange,
  onSave,
  disabled = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleAddInstance = () => {
    const newInstance: GovernanceInstanceData = {
      id: `gov-new-${Date.now()}`,
      title: '',
      dimension: '',
      meetingFrequency: '',
      memberIds: [],
      isNew: true,
    };
    onChange([...instances, newInstance]);
  };

  const handleUpdateInstance = (id: string, field: keyof GovernanceInstanceData, value: string | string[]) => {
    const updated = instances.map(i => 
      i.id === id ? { ...i, [field]: value } : i
    );
    onChange(updated);
  };

  const handleDeleteInstance = () => {
    if (!deleteId) return;
    const updated = instances.filter(i => i.id !== deleteId);
    onChange(updated);
    setDeleteId(null);
    toast.success('Instance deleted');
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave();
      toast.success('Governance instances saved');
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
          <h4 className="text-md font-semibold text-foreground">Project Governance</h4>
          <p className="text-sm text-muted-foreground">Optional: Define governance instances for the project</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddInstance}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Instance
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
              <TableHead className="w-[200px]">Instance Title</TableHead>
              <TableHead className="w-[150px]">Dimension</TableHead>
              <TableHead className="w-[150px]">Meeting Frequency</TableHead>
              <TableHead>Members</TableHead>
              <TableHead className="w-[60px]">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  No governance instances defined. Click "Add Instance" to create one (optional).
                </TableCell>
              </TableRow>
            ) : (
              instances.map((instance) => (
                <TableRow key={instance.id} className={instance.isNew ? 'bg-primary/5' : ''}>
                  <TableCell>
                    <Input
                      value={instance.title}
                      onChange={(e) => handleUpdateInstance(instance.id, 'title', e.target.value)}
                      disabled={disabled}
                      maxLength={50}
                      placeholder="e.g., Steering Committee"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={instance.dimension}
                      onValueChange={(v) => handleUpdateInstance(instance.id, 'dimension', v)}
                      disabled={disabled || !instance.title}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        {DIMENSIONS.map(d => (
                          <SelectItem key={d.value} value={d.value}>
                            {d.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select
                      value={instance.meetingFrequency}
                      onValueChange={(v) => handleUpdateInstance(instance.id, 'meetingFrequency', v)}
                      disabled={disabled || !instance.title}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border shadow-lg z-50">
                        {FREQUENCIES.map(f => (
                          <SelectItem key={f.value} value={f.value}>
                            {f.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {instance.memberIds.length > 0 
                        ? `${instance.memberIds.length} members selected`
                        : 'No members'
                      }
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => setDeleteId(instance.id)}
                      disabled={disabled}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Instance</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this governance instance?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteInstance}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
