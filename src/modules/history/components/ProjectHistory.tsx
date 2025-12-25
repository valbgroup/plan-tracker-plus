import React, { useState } from 'react';
import { ChevronDown, Download, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Change {
  id: string;
  timestamp: Date;
  user: string;
  type: 'PLAN' | 'REEL' | 'BASELINE' | 'ADMIN' | 'CONFIG';
  criticality: 'CRITIQUE' | 'MODERE' | 'FAIBLE' | 'INFO';
  section: string;
  element: string;
  oldValue: string;
  newValue: string;
  justification: string;
  status: 'APPROUVE' | 'EN_ATTENTE' | 'REFUSE';
}

interface ProjectHistoryProps {
  projectId?: string;
}

const MOCK_CHANGES: Change[] = [
  {
    id: 'change-1',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    user: 'Ahmed Benali',
    type: 'BASELINE',
    criticality: 'CRITIQUE',
    section: 'Budget',
    element: 'Total Budget',
    oldValue: '100,000 DZD',
    newValue: '120,000 DZD',
    justification: 'Additional resources allocated for new requirements from client',
    status: 'APPROUVE',
  },
  {
    id: 'change-2',
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    user: 'Fatima Zohra',
    type: 'REEL',
    criticality: 'MODERE',
    section: 'WBS',
    element: 'Phase 2 Completion',
    oldValue: 'Not started',
    newValue: '85% Complete',
    justification: 'Phase 2 progressing ahead of schedule',
    status: 'APPROUVE',
  },
  {
    id: 'change-3',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    user: 'Karim Mansour',
    type: 'ADMIN',
    criticality: 'FAIBLE',
    section: 'Stakeholders',
    element: 'Project Sponsor',
    oldValue: 'Mohammed Ali',
    newValue: 'Youssef Brahim',
    justification: 'Organizational restructuring',
    status: 'EN_ATTENTE',
  },
  {
    id: 'change-4',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    user: 'System',
    type: 'CONFIG',
    criticality: 'INFO',
    section: 'Resources',
    element: 'Team capacity',
    oldValue: '8 FTE',
    newValue: '10 FTE',
    justification: 'Auto-adjustment based on approved resource request',
    status: 'APPROUVE',
  },
];

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({ projectId }) => {
  const [expandedChange, setExpandedChange] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterCriticality, setFilterCriticality] = useState<string>('ALL');

  const getCriticalityVariant = (criticality: string) => {
    switch (criticality) {
      case 'CRITIQUE': return 'destructive';
      case 'MODERE': return 'secondary';
      case 'FAIBLE': return 'outline';
      default: return 'outline';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'BASELINE': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'PLAN': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'REEL': return 'bg-green-100 text-green-800 border-green-300';
      case 'ADMIN': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'CONFIG': return 'bg-slate-100 text-slate-800 border-slate-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROUVE': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'EN_ATTENTE': return <Clock className="w-4 h-4 text-amber-600" />;
      case 'REFUSE': return <X className="w-4 h-4 text-destructive" />;
      default: return null;
    }
  };

  const filteredChanges = MOCK_CHANGES.filter((change) => {
    if (filterType !== 'ALL' && change.type !== filterType) return false;
    if (filterCriticality !== 'ALL' && change.criticality !== filterCriticality) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Project Change History</h2>
          <p className="text-muted-foreground text-sm mt-1">Complete audit trail of all project modifications</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Log
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Change Type</label>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="PLAN">Planned</SelectItem>
              <SelectItem value="REEL">Actual</SelectItem>
              <SelectItem value="BASELINE">Baseline</SelectItem>
              <SelectItem value="ADMIN">Administrative</SelectItem>
              <SelectItem value="CONFIG">Configuration</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Criticality</label>
          <Select value={filterCriticality} onValueChange={setFilterCriticality}>
            <SelectTrigger>
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="CRITIQUE">Critical</SelectItem>
              <SelectItem value="MODERE">Moderate</SelectItem>
              <SelectItem value="FAIBLE">Low</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">Period</label>
          <Select defaultValue="lastMonth">
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lastWeek">Last 7 days</SelectItem>
              <SelectItem value="lastMonth">Last 30 days</SelectItem>
              <SelectItem value="lastQuarter">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Change Log */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredChanges.map((change) => (
              <div key={change.id} className="group">
                <button
                  onClick={() => setExpandedChange(expandedChange === change.id ? null : change.id)}
                  className="w-full text-left p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5 transition-transform',
                        expandedChange === change.id && 'rotate-180'
                      )}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          {change.timestamp.toLocaleDateString()} {change.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <Badge variant={getCriticalityVariant(change.criticality)} className="text-xs">
                          {change.criticality}
                        </Badge>
                        <span className={cn('px-2 py-0.5 text-xs font-medium border rounded', getTypeColor(change.type))}>
                          {change.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground block text-xs">Changed by</span>
                          <p className="font-medium truncate">{change.user}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Section</span>
                          <p className="font-medium">{change.section}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Element</span>
                          <p className="font-medium truncate">{change.element}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground block text-xs">Status</span>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {getStatusIcon(change.status)}
                            <span className="font-medium text-xs">{change.status}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedChange === change.id && (
                  <div className="px-4 pb-4 bg-muted/30 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 mb-4">
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                          Previous Value
                        </label>
                        <div className="px-3 py-2 bg-destructive/10 border border-destructive/20 rounded-md text-sm">
                          {change.oldValue}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                          New Value
                        </label>
                        <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-sm">
                          {change.newValue}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                        Justification
                      </label>
                      <p className="text-sm text-muted-foreground">{change.justification}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {filteredChanges.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No changes found matching the filters.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Changes</p>
            <p className="text-2xl font-bold mt-1">{MOCK_CHANGES.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Approved</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {MOCK_CHANGES.filter((c) => c.status === 'APPROUVE').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Critical Changes</p>
            <p className="text-2xl font-bold text-destructive mt-1">
              {MOCK_CHANGES.filter((c) => c.criticality === 'CRITIQUE').length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pending Review</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {MOCK_CHANGES.filter((c) => c.status === 'EN_ATTENTE').length}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
