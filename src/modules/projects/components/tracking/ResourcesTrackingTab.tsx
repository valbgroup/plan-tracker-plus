import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
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
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Save, 
  Loader2, 
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { ResourceTrackingRow } from './types';

// Mock data
const MOCK_RESOURCES: ResourceTrackingRow[] = [
  {
    assignmentId: 'res-1',
    resourceId: 'r1',
    resourceName: 'John Doe',
    role: 'Project Manager',
    phaseId: 'phase-1',
    phaseName: 'All Phases',
    plannedAllocationPercent: 100,
    realAllocationPercent: 100,
    plannedHours: 800,
    realHours: 450,
    costRate: 150,
    actualCost: 67500,
    utilizationPercent: 56,
    availability: 'AVAILABLE',
    variance: 0,
    notes: '',
    updatedAt: '2024-06-15T10:00:00Z',
    updatedBy: 'HR',
  },
  {
    assignmentId: 'res-2',
    resourceId: 'r2',
    resourceName: 'Jane Smith',
    role: 'Lead Developer',
    phaseId: 'phase-3',
    phaseName: 'Execution',
    plannedAllocationPercent: 100,
    realAllocationPercent: 120,
    plannedHours: 600,
    realHours: 380,
    costRate: 120,
    actualCost: 45600,
    utilizationPercent: 63,
    availability: 'PARTIAL',
    variance: -20,
    notes: 'Over-allocated due to urgent fixes',
    updatedAt: '2024-06-15T10:00:00Z',
    updatedBy: 'PM',
  },
  {
    assignmentId: 'res-3',
    resourceId: 'r3',
    resourceName: 'Bob Wilson',
    role: 'QA Engineer',
    phaseId: 'phase-4',
    phaseName: 'Testing',
    plannedAllocationPercent: 50,
    realAllocationPercent: 30,
    plannedHours: 200,
    realHours: 40,
    costRate: 90,
    actualCost: 3600,
    utilizationPercent: 20,
    availability: 'AVAILABLE',
    variance: 20,
    notes: '',
    updatedAt: '2024-06-10T14:00:00Z',
    updatedBy: 'PM',
  },
];

interface ResourcesTrackingTabProps {
  projectId: string;
  currency?: string;
}

export const ResourcesTrackingTab: React.FC<ResourcesTrackingTabProps> = ({ 
  projectId,
  currency = 'DZD'
}) => {
  const [resources, setResources] = useState<ResourceTrackingRow[]>(MOCK_RESOURCES);
  const [isSaving, setIsSaving] = useState(false);

  const metrics = useMemo(() => {
    const totalPlannedHours = resources.reduce((sum, r) => sum + r.plannedHours, 0);
    const totalRealHours = resources.reduce((sum, r) => sum + r.realHours, 0);
    const totalCost = resources.reduce((sum, r) => sum + r.actualCost, 0);
    const avgUtilization = Math.round(resources.reduce((sum, r) => sum + r.utilizationPercent, 0) / resources.length);
    const overAllocated = resources.filter(r => r.realAllocationPercent > 100).length;
    
    return { totalPlannedHours, totalRealHours, totalCost, avgUtilization, overAllocated };
  }, [resources]);

  const formatCurrency = (amount: number) => `${amount.toLocaleString()} ${currency}`;

  const handleUpdateResource = (id: string, field: keyof ResourceTrackingRow, value: unknown) => {
    setResources(prev => prev.map(res => {
      if (res.assignmentId !== id) return res;
      const updated = { ...res, [field]: value };
      if (field === 'realHours') {
        updated.actualCost = (value as number) * updated.costRate;
        updated.utilizationPercent = Math.round(((value as number) / updated.plannedHours) * 100);
      }
      updated.updatedAt = new Date().toISOString();
      return updated;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Resource tracking saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Total Resources</div><div className="text-2xl font-bold">{resources.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Planned Hours</div><div className="text-2xl font-bold">{metrics.totalPlannedHours}h</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Actual Hours</div><div className="text-2xl font-bold">{metrics.totalRealHours}h</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Avg Utilization</div><div className="text-2xl font-bold">{metrics.avgUtilization}%</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Over-Allocated</div><div className="text-2xl font-bold text-amber-600">{metrics.overAllocated}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />Resource Tracking</CardTitle>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Resource</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>Allocation %</TableHead>
                  <TableHead>Hours (P/R)</TableHead>
                  <TableHead>Utilization</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Cost</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resources.map((res) => (
                  <TableRow key={res.assignmentId} className={cn(res.realAllocationPercent > 100 && 'bg-amber-50/50 dark:bg-amber-950/10')}>
                    <TableCell className="font-medium">{res.resourceName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{res.role}</TableCell>
                    <TableCell className="text-sm">{res.phaseName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">P:{res.plannedAllocationPercent}%</span>
                        <Slider value={[res.realAllocationPercent]} onValueChange={([v]) => handleUpdateResource(res.assignmentId, 'realAllocationPercent', v)} max={150} className="w-20" />
                        <span className={cn('text-xs', res.realAllocationPercent > 100 && 'text-amber-600')}>{res.realAllocationPercent}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-muted-foreground">{res.plannedHours}/</span>
                        <Input type="number" value={res.realHours} onChange={(e) => handleUpdateResource(res.assignmentId, 'realHours', parseInt(e.target.value) || 0)} className="h-7 w-16 text-xs" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Progress value={res.utilizationPercent} className="w-16 h-2" />
                      <span className="text-xs">{res.utilizationPercent}%</span>
                    </TableCell>
                    <TableCell>
                      <Select value={res.availability} onValueChange={(v) => handleUpdateResource(res.assignmentId, 'availability', v)}>
                        <SelectTrigger className="h-7 text-xs w-28"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="AVAILABLE">Available</SelectItem>
                          <SelectItem value="PARTIAL">Partial</SelectItem>
                          <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="font-medium">{formatCurrency(res.actualCost)}</TableCell>
                    <TableCell><Input value={res.notes} onChange={(e) => handleUpdateResource(res.assignmentId, 'notes', e.target.value)} className="h-7 text-xs" placeholder="Notes" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
