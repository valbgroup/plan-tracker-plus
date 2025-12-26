import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, differenceInDays, parseISO } from 'date-fns';
import { 
  CalendarIcon, 
  Save, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Package,
  Bug,
} from 'lucide-react';
import { DeliverableTrackingRow, calculatePhaseStatus } from './types';

// Mock data
const MOCK_DELIVERABLES: DeliverableTrackingRow[] = [
  {
    deliverableId: 'del-1',
    deliverableName: 'Project Charter',
    phaseId: 'phase-1',
    phaseName: 'Initiation',
    plannedDate: '2024-02-01',
    realDate: '2024-01-30',
    plannedEffort: 40,
    realEffort: 35,
    percentComplete: 100,
    status: 'ON_TRACK',
    qualityMetrics: { defects: 0 },
    acceptanceStatus: 'ACCEPTED',
    acceptedBy: 'John Doe',
    variance: -2,
    notes: 'Delivered early',
    updatedAt: '2024-01-30T16:00:00Z',
    updatedBy: 'Jane Smith',
  },
  {
    deliverableId: 'del-2',
    deliverableName: 'Requirements Document',
    phaseId: 'phase-2',
    phaseName: 'Planning',
    plannedDate: '2024-03-15',
    realDate: '2024-03-18',
    plannedEffort: 80,
    realEffort: 95,
    percentComplete: 100,
    status: 'ON_TRACK',
    qualityMetrics: { defects: 2 },
    acceptanceStatus: 'ACCEPTED',
    acceptedBy: 'Bob Wilson',
    variance: 3,
    notes: 'Minor delays due to scope changes',
    updatedAt: '2024-03-18T10:00:00Z',
    updatedBy: 'Jane Smith',
  },
  {
    deliverableId: 'del-3',
    deliverableName: 'System Design',
    phaseId: 'phase-2',
    phaseName: 'Planning',
    plannedDate: '2024-03-25',
    realDate: null,
    plannedEffort: 120,
    realEffort: 90,
    percentComplete: 75,
    status: 'AT_RISK',
    qualityMetrics: { defects: 1 },
    acceptanceStatus: 'PENDING',
    acceptedBy: null,
    variance: 0,
    notes: 'In review',
    updatedAt: '2024-03-20T14:00:00Z',
    updatedBy: 'Tech Lead',
  },
  {
    deliverableId: 'del-4',
    deliverableName: 'MVP Release',
    phaseId: 'phase-3',
    phaseName: 'Execution',
    plannedDate: '2024-06-30',
    realDate: null,
    plannedEffort: 400,
    realEffort: 180,
    percentComplete: 45,
    status: 'ON_TRACK',
    qualityMetrics: { defects: 5 },
    acceptanceStatus: 'PENDING',
    acceptedBy: null,
    variance: 0,
    notes: '',
    updatedAt: '2024-06-15T09:00:00Z',
    updatedBy: 'Dev Team',
  },
  {
    deliverableId: 'del-5',
    deliverableName: 'User Documentation',
    phaseId: 'phase-3',
    phaseName: 'Execution',
    plannedDate: '2024-08-15',
    realDate: null,
    plannedEffort: 60,
    realEffort: null,
    percentComplete: 0,
    status: 'ON_TRACK',
    qualityMetrics: { defects: 0 },
    acceptanceStatus: 'PENDING',
    acceptedBy: null,
    variance: 0,
    notes: '',
    updatedAt: '',
    updatedBy: '',
  },
];

const TEAM_MEMBERS = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
  { id: '3', name: 'Bob Wilson' },
  { id: '4', name: 'Alice Brown' },
];

interface DeliverablesTrackingTabProps {
  projectId: string;
}

export const DeliverablesTrackingTab: React.FC<DeliverablesTrackingTabProps> = ({ projectId }) => {
  const [deliverables, setDeliverables] = useState<DeliverableTrackingRow[]>(MOCK_DELIVERABLES);
  const [isSaving, setIsSaving] = useState(false);

  const metrics = useMemo(() => {
    const accepted = deliverables.filter(d => d.acceptanceStatus === 'ACCEPTED').length;
    const pending = deliverables.filter(d => d.acceptanceStatus === 'PENDING').length;
    const rejected = deliverables.filter(d => d.acceptanceStatus === 'REJECTED').length;
    const totalDefects = deliverables.reduce((sum, d) => sum + d.qualityMetrics.defects, 0);
    const avgProgress = Math.round(deliverables.reduce((sum, d) => sum + d.percentComplete, 0) / deliverables.length);
    const totalPlannedEffort = deliverables.reduce((sum, d) => sum + d.plannedEffort, 0);
    const totalRealEffort = deliverables.reduce((sum, d) => sum + (d.realEffort || 0), 0);
    
    return { accepted, pending, rejected, totalDefects, avgProgress, totalPlannedEffort, totalRealEffort };
  }, [deliverables]);

  const handleUpdateDeliverable = (id: string, field: keyof DeliverableTrackingRow, value: unknown) => {
    setDeliverables(prev => prev.map(del => {
      if (del.deliverableId !== id) return del;
      
      let updated = { ...del, [field]: value };
      
      // Auto-calculate variance
      if (field === 'realDate' && updated.realDate) {
        updated.variance = differenceInDays(parseISO(updated.realDate), parseISO(updated.plannedDate));
      }
      
      // Auto-set status
      updated.status = calculatePhaseStatus(updated.plannedDate, updated.realDate, updated.percentComplete);
      updated.updatedAt = new Date().toISOString();
      updated.updatedBy = 'Current User';
      
      return updated;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Deliverable tracking data saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const getAcceptanceBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Accepted</Badge>;
      case 'PENDING':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Rejected</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold">{deliverables.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Accepted</div>
            <div className="text-2xl font-bold text-emerald-600">{metrics.accepted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Pending</div>
            <div className="text-2xl font-bold text-amber-600">{metrics.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Rejected</div>
            <div className="text-2xl font-bold text-destructive">{metrics.rejected}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground flex items-center gap-1">
              <Bug className="w-3 h-3" /> Defects
            </div>
            <div className="text-2xl font-bold">{metrics.totalDefects}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Effort Variance</div>
            <div className={cn(
              'text-2xl font-bold',
              metrics.totalRealEffort > metrics.totalPlannedEffort ? 'text-destructive' : 'text-emerald-600'
            )}>
              {metrics.totalRealEffort - metrics.totalPlannedEffort}h
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Deliverables Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Deliverable Tracking
            </CardTitle>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[180px]">Deliverable</TableHead>
                  <TableHead className="w-[100px]">Phase</TableHead>
                  <TableHead className="w-[100px]">Planned</TableHead>
                  <TableHead className="w-[130px]">Real Date</TableHead>
                  <TableHead className="w-[100px]">Effort (h)</TableHead>
                  <TableHead className="w-[150px]">% Complete</TableHead>
                  <TableHead className="w-[70px]">Defects</TableHead>
                  <TableHead className="w-[120px]">Acceptance</TableHead>
                  <TableHead className="w-[120px]">Accepted By</TableHead>
                  <TableHead className="w-[80px]">Variance</TableHead>
                  <TableHead className="w-[150px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliverables.map((del) => (
                  <TableRow 
                    key={del.deliverableId}
                    className={cn(
                      del.acceptanceStatus === 'REJECTED' && 'bg-destructive/5'
                    )}
                  >
                    <TableCell className="font-medium">{del.deliverableName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{del.phaseName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(parseISO(del.plannedDate), 'dd/MM/yy')}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              'h-8 w-[110px] justify-start text-left font-normal',
                              !del.realDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {del.realDate ? format(parseISO(del.realDate), 'dd/MM/yy') : 'Set'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={del.realDate ? parseISO(del.realDate) : undefined}
                            onSelect={(date) => date && handleUpdateDeliverable(del.deliverableId, 'realDate', format(date, 'yyyy-MM-dd'))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1 items-center">
                        <span className="text-xs text-muted-foreground">P:{del.plannedEffort}</span>
                        <Input
                          type="number"
                          value={del.realEffort ?? ''}
                          onChange={(e) => handleUpdateDeliverable(del.deliverableId, 'realEffort', parseInt(e.target.value) || null)}
                          className="h-7 w-16 text-xs"
                          placeholder="Real"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Slider
                          value={[del.percentComplete]}
                          onValueChange={([value]) => handleUpdateDeliverable(del.deliverableId, 'percentComplete', value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-muted-foreground">{del.percentComplete}%</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={del.qualityMetrics.defects}
                        onChange={(e) => {
                          const newDefects = parseInt(e.target.value) || 0;
                          setDeliverables(prev => prev.map(d => 
                            d.deliverableId === del.deliverableId 
                              ? { ...d, qualityMetrics: { ...d.qualityMetrics, defects: newDefects } }
                              : d
                          ));
                        }}
                        className="h-7 w-14 text-xs"
                        min={0}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={del.acceptanceStatus}
                        onValueChange={(v) => handleUpdateDeliverable(del.deliverableId, 'acceptanceStatus', v)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="ACCEPTED">Accepted</SelectItem>
                          <SelectItem value="REJECTED">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={del.acceptedBy || ''}
                        onValueChange={(v) => handleUpdateDeliverable(del.deliverableId, 'acceptedBy', v || null)}
                      >
                        <SelectTrigger className="h-8 text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          {TEAM_MEMBERS.map(m => (
                            <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'text-sm font-medium',
                        del.variance > 0 ? 'text-destructive' : del.variance < 0 ? 'text-emerald-600' : 'text-muted-foreground'
                      )}>
                        {del.variance > 0 ? '+' : ''}{del.variance}d
                      </div>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={del.notes}
                        onChange={(e) => handleUpdateDeliverable(del.deliverableId, 'notes', e.target.value)}
                        placeholder="Notes..."
                        className="min-h-[50px] text-xs resize-none"
                      />
                    </TableCell>
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
