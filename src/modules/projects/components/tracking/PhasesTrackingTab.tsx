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
  TrendingUp,
  TrendingDown,
  Clock,
} from 'lucide-react';
import { PhaseTrackingRow, calculatePhaseStatus } from './types';

// Mock data for demonstration
const MOCK_PHASES: PhaseTrackingRow[] = [
  {
    phaseId: 'phase-1',
    phaseName: 'Initiation',
    plannedStartDate: '2024-01-15',
    realStartDate: '2024-01-15',
    plannedEndDate: '2024-02-15',
    realEndDate: '2024-02-14',
    plannedDuration: 31,
    realDuration: 30,
    percentComplete: 100,
    status: 'ON_TRACK',
    variance: -1,
    notes: 'Completed on schedule',
    updatedAt: '2024-02-14T10:30:00Z',
    updatedBy: 'John Doe',
  },
  {
    phaseId: 'phase-2',
    phaseName: 'Planning',
    plannedStartDate: '2024-02-16',
    realStartDate: '2024-02-16',
    plannedEndDate: '2024-03-31',
    realEndDate: null,
    plannedDuration: 44,
    realDuration: null,
    percentComplete: 85,
    status: 'ON_TRACK',
    variance: 0,
    notes: '',
    updatedAt: '2024-03-20T14:00:00Z',
    updatedBy: 'Jane Smith',
  },
  {
    phaseId: 'phase-3',
    phaseName: 'Execution',
    plannedStartDate: '2024-04-01',
    realStartDate: '2024-04-05',
    plannedEndDate: '2024-08-31',
    realEndDate: null,
    plannedDuration: 153,
    realDuration: null,
    percentComplete: 45,
    status: 'AT_RISK',
    variance: 4,
    notes: 'Started 4 days late due to resource constraints',
    updatedAt: '2024-06-15T09:00:00Z',
    updatedBy: 'Bob Wilson',
  },
  {
    phaseId: 'phase-4',
    phaseName: 'Testing',
    plannedStartDate: '2024-09-01',
    realStartDate: null,
    plannedEndDate: '2024-10-15',
    realEndDate: null,
    plannedDuration: 45,
    realDuration: null,
    percentComplete: 0,
    status: 'ON_TRACK',
    variance: 0,
    notes: '',
    updatedAt: '',
    updatedBy: '',
  },
  {
    phaseId: 'phase-5',
    phaseName: 'Closure',
    plannedStartDate: '2024-10-16',
    realStartDate: null,
    plannedEndDate: '2024-11-30',
    realEndDate: null,
    plannedDuration: 46,
    realDuration: null,
    percentComplete: 0,
    status: 'ON_TRACK',
    variance: 0,
    notes: '',
    updatedAt: '',
    updatedBy: '',
  },
];

interface PhasesTrackingTabProps {
  projectId: string;
}

export const PhasesTrackingTab: React.FC<PhasesTrackingTabProps> = ({ projectId }) => {
  const [phases, setPhases] = useState<PhaseTrackingRow[]>(MOCK_PHASES);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Calculate summary metrics
  const metrics = useMemo(() => {
    const completed = phases.filter(p => p.percentComplete === 100).length;
    const atRisk = phases.filter(p => p.status === 'AT_RISK').length;
    const offTrack = phases.filter(p => p.status === 'OFF_TRACK').length;
    const avgProgress = Math.round(phases.reduce((sum, p) => sum + p.percentComplete, 0) / phases.length);
    const totalVariance = phases.reduce((sum, p) => sum + p.variance, 0);
    
    return { completed, atRisk, offTrack, avgProgress, totalVariance };
  }, [phases]);

  const handleUpdatePhase = (phaseId: string, field: keyof PhaseTrackingRow, value: unknown) => {
    setPhases(prev => prev.map(phase => {
      if (phase.phaseId !== phaseId) return phase;
      
      const updated = { ...phase, [field]: value };
      
      // Auto-calculate real duration
      if (field === 'realStartDate' || field === 'realEndDate') {
        if (updated.realStartDate && updated.realEndDate) {
          updated.realDuration = differenceInDays(
            parseISO(updated.realEndDate),
            parseISO(updated.realStartDate)
          );
        }
      }
      
      // Auto-calculate variance
      if (field === 'realEndDate' && updated.realEndDate) {
        updated.variance = differenceInDays(
          parseISO(updated.realEndDate),
          parseISO(updated.plannedEndDate)
        );
      }
      
      // Auto-set status
      updated.status = calculatePhaseStatus(updated.plannedEndDate, updated.realEndDate, updated.percentComplete);
      updated.updatedAt = new Date().toISOString();
      updated.updatedBy = 'Current User';
      
      return updated;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Phase tracking data saved successfully');
      setEditingId(null);
    } catch {
      toast.error('Failed to save phase data');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
        return (
          <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            On Track
          </Badge>
        );
      case 'AT_RISK':
        return (
          <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            At Risk
          </Badge>
        );
      case 'OFF_TRACK':
        return (
          <Badge className="bg-destructive/10 text-destructive border-destructive/20">
            <XCircle className="w-3 h-3 mr-1" />
            Off Track
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Total Phases</div>
            <div className="text-2xl font-bold">{phases.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Completed</div>
            <div className="text-2xl font-bold text-emerald-600">{metrics.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">At Risk</div>
            <div className="text-2xl font-bold text-amber-600">{metrics.atRisk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Off Track</div>
            <div className="text-2xl font-bold text-destructive">{metrics.offTrack}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Avg Progress</div>
            <div className="text-2xl font-bold">{metrics.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Schedule Variance Summary */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Schedule Variance</CardTitle>
            <div className={cn(
              'flex items-center gap-1 text-sm font-medium',
              metrics.totalVariance > 0 ? 'text-destructive' : 'text-emerald-600'
            )}>
              {metrics.totalVariance > 0 ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              {Math.abs(metrics.totalVariance)} days {metrics.totalVariance > 0 ? 'behind' : 'ahead'}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress 
            value={metrics.avgProgress} 
            className="h-3"
          />
        </CardContent>
      </Card>

      {/* Phases Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Phase Tracking</CardTitle>
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
                  <TableHead className="w-[150px]">Phase</TableHead>
                  <TableHead className="w-[120px]">Planned Start</TableHead>
                  <TableHead className="w-[140px]">Real Start</TableHead>
                  <TableHead className="w-[120px]">Planned End</TableHead>
                  <TableHead className="w-[140px]">Real End</TableHead>
                  <TableHead className="w-[100px]">Duration</TableHead>
                  <TableHead className="w-[180px]">% Complete</TableHead>
                  <TableHead className="w-[100px]">Variance</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[200px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {phases.map((phase) => (
                  <TableRow 
                    key={phase.phaseId}
                    className={cn(
                      phase.status === 'AT_RISK' && 'bg-amber-50 dark:bg-amber-950/20',
                      phase.status === 'OFF_TRACK' && 'bg-destructive/5'
                    )}
                  >
                    <TableCell className="font-medium">{phase.phaseName}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(phase.plannedStartDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              'h-8 w-[120px] justify-start text-left font-normal',
                              !phase.realStartDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {phase.realStartDate ? format(parseISO(phase.realStartDate), 'dd/MM/yy') : 'Set date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={phase.realStartDate ? parseISO(phase.realStartDate) : undefined}
                            onSelect={(date) => date && handleUpdatePhase(phase.phaseId, 'realStartDate', format(date, 'yyyy-MM-dd'))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(parseISO(phase.plannedEndDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              'h-8 w-[120px] justify-start text-left font-normal',
                              !phase.realEndDate && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-1 h-3 w-3" />
                            {phase.realEndDate ? format(parseISO(phase.realEndDate), 'dd/MM/yy') : 'Set date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={phase.realEndDate ? parseISO(phase.realEndDate) : undefined}
                            onSelect={(date) => date && handleUpdatePhase(phase.phaseId, 'realEndDate', format(date, 'yyyy-MM-dd'))}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>P: {phase.plannedDuration}d</div>
                        {phase.realDuration !== null && (
                          <div className={cn(
                            phase.realDuration > phase.plannedDuration ? 'text-destructive' : 'text-emerald-600'
                          )}>
                            R: {phase.realDuration}d
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Slider
                          value={[phase.percentComplete]}
                          onValueChange={([value]) => handleUpdatePhase(phase.phaseId, 'percentComplete', value)}
                          max={100}
                          step={5}
                          className="w-full"
                        />
                        <div className="text-xs text-center text-muted-foreground">
                          {phase.percentComplete}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        'flex items-center gap-1 text-sm font-medium',
                        phase.variance > 0 ? 'text-destructive' : phase.variance < 0 ? 'text-emerald-600' : 'text-muted-foreground'
                      )}>
                        <Clock className="w-3 h-3" />
                        {phase.variance > 0 ? '+' : ''}{phase.variance}d
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(phase.status)}</TableCell>
                    <TableCell>
                      <Textarea
                        value={phase.notes}
                        onChange={(e) => handleUpdatePhase(phase.phaseId, 'notes', e.target.value)}
                        placeholder="Add notes..."
                        className="min-h-[60px] text-xs resize-none"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Last Updated Info */}
      <div className="text-xs text-muted-foreground text-right">
        Last updated: {phases.find(p => p.updatedAt)?.updatedAt 
          ? format(parseISO(phases.find(p => p.updatedAt)!.updatedAt), 'dd/MM/yyyy HH:mm')
          : 'Never'
        } by {phases.find(p => p.updatedBy)?.updatedBy || 'N/A'}
      </div>
    </div>
  );
};
