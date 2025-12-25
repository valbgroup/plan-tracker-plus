import React, { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react';
import { Phase, Deliverable } from '@/services/planService';
import { cn } from '@/lib/utils';
import { format, differenceInDays, eachWeekOfInterval, endOfWeek } from 'date-fns';

interface GanttChartProps {
  phases: Phase[];
  deliverables: Deliverable[];
  projectStartDate: Date;
  projectEndDate: Date;
  showBaseline?: boolean;
  baselineStartDate?: Date;
  baselineEndDate?: Date;
}

type RowStatus = 'planning' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'at-risk';

interface ChartRow {
  id: string;
  name: string;
  type: 'phase' | 'deliverable';
  startDate: Date;
  endDate: Date;
  progress: number;
  status: RowStatus;
  parentId?: string;
  isCritical?: boolean;
}

const getStatusColor = (status: RowStatus): string => {
  switch (status) {
    case 'planning': return 'bg-blue-400';
    case 'in-progress': return 'bg-emerald-500';
    case 'on-hold': return 'bg-amber-400';
    case 'completed': return 'bg-green-600';
    case 'cancelled': return 'bg-destructive';
    case 'at-risk': return 'bg-orange-500';
    default: return 'bg-muted';
  }
};

const getStatusBorderColor = (status: RowStatus): string => {
  switch (status) {
    case 'planning': return 'border-blue-600';
    case 'in-progress': return 'border-emerald-700';
    case 'on-hold': return 'border-amber-600';
    case 'completed': return 'border-green-800';
    case 'cancelled': return 'border-destructive';
    case 'at-risk': return 'border-orange-700';
    default: return 'border-border';
  }
};

const mapProgressToStatus = (progress: number): RowStatus => {
  if (progress >= 100) return 'completed';
  if (progress > 0) return 'in-progress';
  return 'planning';
};

export const GanttChart: React.FC<GanttChartProps> = ({
  phases,
  deliverables,
  projectStartDate,
  projectEndDate,
  showBaseline = true,
  baselineStartDate,
  baselineEndDate,
}) => {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(
    new Set(phases.map((p) => p.phase_id))
  );
  const [hoveredRowId, setHoveredRowId] = useState<string | null>(null);

  const totalDays = differenceInDays(projectEndDate, projectStartDate) + 1;

  // Build chart rows from phases and deliverables
  const chartRows: ChartRow[] = useMemo(() => {
    const rows: ChartRow[] = [];

    phases.forEach((phase) => {
      const phaseStart = new Date(phase.date_debut);
      const phaseEnd = new Date(phase.date_fin);
      
      rows.push({
        id: phase.phase_id,
        name: phase.libellé,
        type: 'phase',
        startDate: phaseStart,
        endDate: phaseEnd,
        progress: phase.progres_reel || 0,
        status: mapProgressToStatus(phase.progres_reel || 0),
        isCritical: false,
      });

      // Add deliverables for this phase if expanded
      if (expandedPhases.has(phase.phase_id)) {
        // Filter deliverables by project_id (no phase_id in simple type)
        const phaseDeliverables = deliverables.filter(
          (d) => d.project_id === phase.project_id
        );
        phaseDeliverables.forEach((deliverable) => {
          const delEnd = new Date(deliverable.date_fin_prevue);
          // Estimate start as 7 days before end
          const delStart = new Date(delEnd);
          delStart.setDate(delStart.getDate() - 7);
          
          rows.push({
            id: deliverable.deliverable_id,
            name: deliverable.libellé,
            type: 'deliverable',
            startDate: delStart,
            endDate: delEnd,
            progress: deliverable.progres_reel || 0,
            status: mapProgressToStatus(deliverable.progres_reel || 0),
            parentId: phase.phase_id,
          });
        });
      }
    });

    return rows;
  }, [phases, deliverables, expandedPhases]);

  const togglePhaseExpand = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  // Generate week headers for better readability
  const weekHeaders = useMemo(() => {
    if (totalDays <= 0) return [];
    try {
      const weeks = eachWeekOfInterval(
        { start: projectStartDate, end: projectEndDate },
        { weekStartsOn: 1 }
      );
      return weeks.map((weekStart) => {
        const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
        const clampedEnd = weekEnd > projectEndDate ? projectEndDate : weekEnd;
        const daysInWeek = differenceInDays(clampedEnd, weekStart < projectStartDate ? projectStartDate : weekStart) + 1;
        const widthPercent = (daysInWeek / totalDays) * 100;
        return {
          label: format(weekStart, 'MMM d'),
          widthPercent,
          isNewMonth: weekStart.getDate() <= 7,
        };
      });
    } catch {
      return [];
    }
  }, [projectStartDate, projectEndDate, totalDays]);

  const calculateBarStyle = (startDate: Date, endDate: Date) => {
    const startOffset = Math.max(0, differenceInDays(startDate, projectStartDate));
    const duration = differenceInDays(endDate, startDate) + 1;
    const left = (startOffset / totalDays) * 100;
    const width = Math.max((duration / totalDays) * 100, 1);
    return { left: `${left}%`, width: `${width}%` };
  };

  if (phases.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No phases available to display in the Gantt chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-muted/50 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Project Timeline</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {format(projectStartDate, 'MMM d, yyyy')} - {format(projectEndDate, 'MMM d, yyyy')} ({totalDays} days)
            </p>
          </div>
          <div className="flex items-center gap-4">
            {showBaseline && baselineStartDate && baselineEndDate && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-muted-foreground/40 rounded-sm" />
                <span className="text-sm text-muted-foreground">Baseline</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="w-4 h-2 bg-emerald-500 rounded-sm" />
              <span className="text-sm text-muted-foreground">Actual</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Timeline Header */}
          <div className="flex border-b border-border">
            {/* Labels Column */}
            <div className="w-64 flex-shrink-0 border-r border-border bg-muted/30 p-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Task</span>
            </div>

            {/* Timeline Column - Week headers */}
            <div className="flex-1 flex bg-muted/20">
              {weekHeaders.map((week, idx) => (
                <div
                  key={idx}
                  className={cn(
                    'border-r border-border/50 py-2 px-1 text-center',
                    week.isNewMonth && 'border-l-2 border-l-border'
                  )}
                  style={{ width: `${week.widthPercent}%` }}
                >
                  <span className="text-xs font-medium text-muted-foreground">{week.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          {chartRows.map((row) => (
            <div
              key={row.id}
              className={cn(
                'flex border-b border-border transition-colors',
                hoveredRowId === row.id && 'bg-accent/50',
                row.isCritical && 'bg-destructive/5'
              )}
              onMouseEnter={() => setHoveredRowId(row.id)}
              onMouseLeave={() => setHoveredRowId(null)}
            >
              {/* Labels Column */}
              <div className={cn(
                'w-64 flex-shrink-0 border-r border-border p-3 flex items-center gap-2',
                row.type === 'deliverable' && 'pl-8'
              )}>
                {row.type === 'phase' && (
                  <button
                    onClick={() => togglePhaseExpand(row.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {expandedPhases.has(row.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    'text-sm truncate text-foreground',
                    row.type === 'phase' && 'font-semibold'
                  )}>
                    {row.name}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-muted-foreground">{row.progress}%</span>
                    {row.isCritical && (
                      <span className="text-xs text-destructive font-medium">Critical</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Timeline Column */}
              <div className="flex-1 relative h-14 bg-background">
                {/* Grid lines - using week boundaries */}
                <div className="absolute inset-0 flex pointer-events-none">
                  {weekHeaders.map((week, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        'border-r border-border/30',
                        week.isNewMonth && 'border-l border-l-border/50'
                      )}
                      style={{ width: `${week.widthPercent}%` }}
                    />
                  ))}
                </div>

                {/* Today indicator */}
                {new Date() >= projectStartDate && new Date() <= projectEndDate && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary z-10"
                    style={{
                      left: `${(differenceInDays(new Date(), projectStartDate) / totalDays) * 100}%`,
                    }}
                  />
                )}

                {/* Baseline bar (if applicable) */}
                {showBaseline && baselineStartDate && baselineEndDate && row.type === 'phase' && (
                  <div
                    className="absolute top-2 h-2 bg-muted-foreground/40 rounded-sm"
                    style={calculateBarStyle(baselineStartDate, baselineEndDate)}
                    title="Baseline"
                  />
                )}

                {/* Actual bar */}
                <div
                  className={cn(
                    'absolute h-5 rounded-sm border-2 transition-all cursor-pointer',
                    row.type === 'phase' ? 'top-6' : 'top-4',
                    getStatusColor(row.status),
                    getStatusBorderColor(row.status)
                  )}
                  style={calculateBarStyle(row.startDate, row.endDate)}
                  title={`${row.name}: ${format(row.startDate, 'MMM d')} - ${format(row.endDate, 'MMM d')}`}
                >
                  {/* Progress fill */}
                  <div
                    className="h-full bg-white/30 rounded-sm"
                    style={{ width: `${row.progress}%` }}
                  />
                </div>

                {/* At-risk indicator */}
                {row.status === 'at-risk' && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-muted/30 border-t border-border p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-blue-400 rounded-sm" />
            <span className="text-xs text-muted-foreground">Planning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-emerald-500 rounded-sm" />
            <span className="text-xs text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-green-600 rounded-sm" />
            <span className="text-xs text-muted-foreground">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-amber-400 rounded-sm" />
            <span className="text-xs text-muted-foreground">On Hold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-3 bg-orange-500 rounded-sm" />
            <span className="text-xs text-muted-foreground">At Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-0.5 h-4 bg-primary rounded-full" />
            <span className="text-xs text-muted-foreground">Today</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
