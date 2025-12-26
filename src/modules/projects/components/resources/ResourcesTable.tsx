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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { BaselineImpactIcon } from '../BaselineImpactIcon';
import { Plus, Trash2, Save, Loader2, AlertTriangle, AlertCircle, Search, CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export interface ResourceData {
  id: string;
  resourceId: string;
  resourceType?: string;
  resourceFamily?: string;
  startDate: string;
  endDate: string;
  quantity: number;
  unitRate: number;
  hasConflict?: boolean;
  conflictDates?: string;
  isNew?: boolean;
}

interface ResourceOption {
  id: string;
  label: string;
  typeId: string;
  familyId: string;
}

interface ResourceType {
  id: string;
  label: string;
  familyId: string;
}

interface ResourceFamily {
  id: string;
  label: string;
}

interface ResourcesTableProps {
  resources: ResourceData[];
  resourceOptions: ResourceOption[];
  resourceTypes: ResourceType[];
  resourceFamilies: ResourceFamily[];
  currency: string;
  projectStartDate: string;
  projectEndDate: string;
  onChange: (resources: ResourceData[]) => void;
  onSave: () => Promise<void>;
  disabled?: boolean;
  isBaselineValidated?: boolean;
  initialResources?: ResourceData[];
}

export const ResourcesTable: React.FC<ResourcesTableProps> = ({
  resources,
  resourceOptions,
  resourceTypes,
  resourceFamilies,
  currency,
  projectStartDate,
  projectEndDate,
  onChange,
  onSave,
  disabled = false,
  isBaselineValidated = false,
  initialResources = [],
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const hasChanges = JSON.stringify(resources) !== JSON.stringify(initialResources);
  const hasConflicts = resources.some(r => r.hasConflict);

  const getResourceInfo = (resourceId: string) => {
    const resource = resourceOptions.find(r => r.id === resourceId);
    if (!resource) return { type: '', family: '' };
    
    const type = resourceTypes.find(t => t.id === resource.typeId);
    const family = resourceFamilies.find(f => f.id === resource.familyId);
    
    return {
      type: type?.label || '',
      family: family?.label || '',
    };
  };

  const validateResource = (resource: ResourceData): Record<string, string> => {
    const resErrors: Record<string, string> = {};
    
    if (!resource.resourceId) {
      resErrors.resourceId = 'Resource is required';
    }

    if (!resource.startDate || !resource.endDate) {
      resErrors.dates = 'Both dates are required';
    } else {
      const start = new Date(resource.startDate);
      const end = new Date(resource.endDate);
      const projStart = new Date(projectStartDate);
      const projEnd = new Date(projectEndDate);

      if (start > end) {
        resErrors.dates = 'Start date must be before end date';
      }
      if (start < projStart || end > projEnd) {
        resErrors.dates = 'Dates must be within project range';
      }
    }

    if (resource.quantity <= 0) {
      resErrors.quantity = 'Must be > 0';
    }

    return resErrors;
  };

  const handleAddResource = () => {
    const newResource: ResourceData = {
      id: `res-new-${Date.now()}`,
      resourceId: '',
      startDate: projectStartDate,
      endDate: projectEndDate,
      quantity: 1,
      unitRate: 0,
      isNew: true,
    };
    onChange([...resources, newResource]);
  };

  const handleUpdateResource = (id: string, field: keyof ResourceData, value: string | number | boolean | undefined) => {
    const updated = resources.map(r => {
      if (r.id === id) {
        const updatedRes = { ...r, [field]: value };
        
        // Update type/family when resource changes
        if (field === 'resourceId') {
          const info = getResourceInfo(value as string);
          updatedRes.resourceType = info.type;
          updatedRes.resourceFamily = info.family;
          updatedRes.hasConflict = false;
          updatedRes.conflictDates = undefined;
        }
        
        return updatedRes;
      }
      return r;
    });
    onChange(updated);

    const resource = updated.find(r => r.id === id);
    if (resource) {
      const resErrors = validateResource(resource);
      setErrors(prev => ({ ...prev, [id]: resErrors }));
    }
  };

  const handleCheckAvailability = async (id: string) => {
    const resource = resources.find(r => r.id === id);
    if (!resource || !resource.resourceId) return;

    setCheckingAvailability(id);
    
    // Simulate API call for availability check
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock conflict detection (random for demo)
    const hasConflict = Math.random() > 0.7;
    
    const updated = resources.map(r => {
      if (r.id === id) {
        return {
          ...r,
          hasConflict,
          conflictDates: hasConflict 
            ? `Resource engaged from ${format(new Date(), 'dd/MM/yyyy')} to ${format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'dd/MM/yyyy')}. Overlap: 5 days`
            : undefined,
        };
      }
      return r;
    });
    
    onChange(updated);
    setCheckingAvailability(null);
    
    if (hasConflict) {
      toast.warning('Resource conflict detected - you may override with a note');
    } else {
      toast.success('Resource is available');
    }
  };

  const handleDeleteResource = () => {
    if (!deleteId) return;
    const updated = resources.filter(r => r.id !== deleteId);
    onChange(updated);
    setDeleteId(null);
    toast.success('Resource removed');
  };

  const handleSave = async () => {
    // Validate all resources
    const allErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    resources.forEach(resource => {
      const resErrors = validateResource(resource);
      if (Object.keys(resErrors).length > 0) {
        allErrors[resource.id] = resErrors;
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
      toast.success(`${resources.length} resources saved`);
    } catch (error) {
      toast.error('Failed to save resources');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateTotalCost = (resource: ResourceData) => {
    return resource.quantity * resource.unitRate;
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const totalResourceCost = useMemo(() => 
    resources.reduce((sum, r) => sum + calculateTotalCost(r), 0),
    [resources]
  );

  return (
    <div className="space-y-4">
      {/* Conflict Warning */}
      {hasConflicts && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          <div className="flex-1">
            <p className="font-semibold text-amber-800 dark:text-amber-200">RESOURCE CONFLICTS DETECTED</p>
            <p className="text-sm text-amber-700 dark:text-amber-300">
              Some resources have scheduling conflicts. Review and resolve before proceeding.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Project Resources</h4>
          <p className="text-sm text-muted-foreground">
            Total Resource Cost: {formatCurrency(totalResourceCost)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddResource}
            disabled={disabled}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
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
            Save Resources
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[180px]">Resource *</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Family</TableHead>
              <TableHead className="w-[220px]">Engagement Period *</TableHead>
              <TableHead className="w-[100px]">Quantity *</TableHead>
              <TableHead className="w-[120px]">Unit Rate</TableHead>
              <TableHead className="w-[120px]">Total Cost</TableHead>
              <TableHead className="w-[100px]">Availability</TableHead>
              <TableHead className="w-[60px]">Del</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No resources allocated. Click "Add Resource" to add one.
                </TableCell>
              </TableRow>
            ) : (
              resources.map((resource) => {
                const resErrors = errors[resource.id] || {};
                const info = getResourceInfo(resource.resourceId);
                
                return (
                  <TableRow 
                    key={resource.id} 
                    className={cn(
                      resource.isNew && 'bg-primary/5',
                      resource.hasConflict && 'bg-amber-50 dark:bg-amber-950/20'
                    )}
                  >
                    <TableCell>
                      <Select
                        value={resource.resourceId}
                        onValueChange={(v) => handleUpdateResource(resource.id, 'resourceId', v)}
                        disabled={disabled}
                      >
                        <SelectTrigger className={cn('h-8', resErrors.resourceId && 'border-destructive')}>
                          <SelectValue placeholder="Select resource" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {resourceOptions
                            .filter(r => r.id && r.id.trim() !== '')
                            .map(r => (
                              <SelectItem key={r.id} value={r.id}>
                                {r.label}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      {resErrors.resourceId && (
                        <p className="text-xs text-destructive mt-1">{resErrors.resourceId}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{info.type || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">{info.family || '-'}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                'h-8 w-[100px] justify-start text-left font-normal',
                                !resource.startDate && 'text-muted-foreground',
                                resErrors.dates && 'border-destructive'
                              )}
                              disabled={disabled}
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {resource.startDate ? format(new Date(resource.startDate), 'dd/MM/yy') : 'Start'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={resource.startDate ? new Date(resource.startDate) : undefined}
                              onSelect={(date) => date && handleUpdateResource(resource.id, 'startDate', format(date, 'yyyy-MM-dd'))}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn(
                                'h-8 w-[100px] justify-start text-left font-normal',
                                !resource.endDate && 'text-muted-foreground',
                                resErrors.dates && 'border-destructive'
                              )}
                              disabled={disabled}
                            >
                              <CalendarIcon className="mr-1 h-3 w-3" />
                              {resource.endDate ? format(new Date(resource.endDate), 'dd/MM/yy') : 'End'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={resource.endDate ? new Date(resource.endDate) : undefined}
                              onSelect={(date) => date && handleUpdateResource(resource.id, 'endDate', format(date, 'yyyy-MM-dd'))}
                              initialFocus
                              className="p-3 pointer-events-auto"
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      {resErrors.dates && (
                        <p className="text-xs text-destructive mt-1">{resErrors.dates}</p>
                      )}
                      {resource.hasConflict && resource.conflictDates && (
                        <p className="text-xs text-amber-600 mt-1">{resource.conflictDates}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={resource.quantity}
                        onChange={(e) => handleUpdateResource(resource.id, 'quantity', parseInt(e.target.value) || 0)}
                        disabled={disabled}
                        min={1}
                        className={cn('h-8 w-20', resErrors.quantity && 'border-destructive')}
                      />
                      {resErrors.quantity && (
                        <p className="text-xs text-destructive mt-1">{resErrors.quantity}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={resource.unitRate}
                        onChange={(e) => handleUpdateResource(resource.id, 'unitRate', parseFloat(e.target.value) || 0)}
                        disabled={disabled}
                        min={0}
                        className="h-8 w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm font-medium">
                        {formatCurrency(calculateTotalCost(resource))}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          'h-8',
                          resource.hasConflict && 'border-amber-500 text-amber-600'
                        )}
                        onClick={() => handleCheckAvailability(resource.id)}
                        disabled={disabled || !resource.resourceId || checkingAvailability === resource.id}
                      >
                        {checkingAvailability === resource.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : resource.hasConflict ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => setDeleteId(resource.id)}
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
            <DialogTitle>Delete Resource</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this resource from the project?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteResource}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
