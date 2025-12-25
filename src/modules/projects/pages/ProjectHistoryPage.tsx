import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProject } from '@/hooks/useProject';
import { AlertCircle, CheckCircle, Loader2, Circle, Flag, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Baseline {
  id: string;
  version: number;
  createdDate: Date;
  createdBy: string;
  description: string;
  status: 'active' | 'archived' | 'superseded';
  changes: {
    field: string;
    oldValue: string | number;
    newValue: string | number;
  }[];
}

interface ChangeLog {
  id: string;
  date: Date;
  author: string;
  action: string;
  details: string;
  type: 'update' | 'approval' | 'milestone' | 'issue';
}

export const ProjectHistoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: project, isLoading, error } = useProject(id || '');
  const [selectedBaseline, setSelectedBaseline] = useState('baseline-1');

  const baselines: Baseline[] = [
    {
      id: 'baseline-1',
      version: 3,
      createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdBy: 'John Doe',
      description: 'Current approved baseline with design updates',
      status: 'active',
      changes: [
        { field: 'End Date', oldValue: '2024-03-15', newValue: '2024-03-20' },
        { field: 'Budget', oldValue: '280,000', newValue: '300,000' },
        { field: 'Scope', oldValue: 'Phase 1-2', newValue: 'Phase 1-3' },
      ],
    },
    {
      id: 'baseline-2',
      version: 2,
      createdDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      createdBy: 'Jane Smith',
      description: 'Previous baseline with initial scope',
      status: 'superseded',
      changes: [
        { field: 'Start Date', oldValue: '2024-01-01', newValue: '2024-01-08' },
        { field: 'Budget', oldValue: '250,000', newValue: '280,000' },
      ],
    },
    {
      id: 'baseline-3',
      version: 1,
      createdDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdBy: 'Bob Johnson',
      description: 'Original approved baseline',
      status: 'archived',
      changes: [],
    },
  ];

  const changeLogs: ChangeLog[] = [
    {
      id: '1',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      author: 'John Doe',
      action: 'Baseline v3 Approved',
      details: 'New baseline approved by steering committee',
      type: 'approval',
    },
    {
      id: '2',
      date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      author: 'Jane Smith',
      action: 'Scope Change Request #12',
      details: 'Phase 3 added to project scope',
      type: 'update',
    },
    {
      id: '3',
      date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      author: 'Bob Johnson',
      action: 'Milestone: Design Complete',
      details: 'System design phase completed ahead of schedule',
      type: 'milestone',
    },
    {
      id: '4',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      author: 'Alice Brown',
      action: 'Risk Issue Created',
      details: 'Resource allocation conflict identified',
      type: 'issue',
    },
    {
      id: '5',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      author: 'John Doe',
      action: 'Project Initiated',
      details: 'Project officially started and baseline established',
      type: 'approval',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return <p className="p-6 text-destructive">Project not found</p>;
  }

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' => {
    switch (status) {
      case 'active':
        return 'default';
      case 'superseded':
        return 'secondary';
      case 'archived':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getChangeTypeIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'issue':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'milestone':
        return <Flag className="w-4 h-4 text-primary" />;
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const selectedBase = baselines.find((b) => b.id === selectedBaseline);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-foreground">Project History</h2>
        <p className="text-muted-foreground">Baseline versions and change timeline</p>
      </div>

      {/* Baselines Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Baselines List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Baselines</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {baselines.map((baseline) => (
              <button
                key={baseline.id}
                onClick={() => setSelectedBaseline(baseline.id)}
                className={`w-full text-left p-4 transition-colors border-b border-border last:border-0 ${
                  selectedBaseline === baseline.id
                    ? 'bg-primary/10 border-l-4 border-l-primary'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Version {baseline.version}</span>
                  <span className="text-sm text-muted-foreground">
                    {baseline.createdDate.toLocaleDateString()}
                  </span>
                </div>
                <Badge variant={getStatusVariant(baseline.status)} className="mb-2">
                  {baseline.status}
                </Badge>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {baseline.description}
                </p>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Baseline Details */}
        {selectedBase && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Baseline Version {selectedBase.version}</CardTitle>
                <Badge variant={getStatusVariant(selectedBase.status)}>
                  {selectedBase.status}
                </Badge>
              </div>
              <p className="text-muted-foreground">{selectedBase.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Created Date</p>
                  <p className="font-medium">
                    {selectedBase.createdDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">Created By</p>
                  <p className="font-medium">{selectedBase.createdBy}</p>
                </div>
              </div>

              {selectedBase.changes.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Changes</h4>
                  <div className="space-y-2">
                    {selectedBase.changes.map((change, idx) => (
                      <div key={idx} className="p-3 border border-border rounded-lg">
                        <span className="font-medium text-sm">{change.field}</span>
                        <div className="flex items-center gap-2 mt-1 text-sm">
                          <span className="text-muted-foreground">From: {change.oldValue}</span>
                          <span className="text-muted-foreground">→</span>
                          <span className="text-primary">To: {change.newValue}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBase.changes.length === 0 && (
                <p className="text-muted-foreground text-center py-4">
                  No changes in this baseline
                </p>
              )}

              {selectedBase.status === 'active' && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm">
                    <strong>Current Active Baseline:</strong> This is the baseline against which all project tracking is measured.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Change Log Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Change Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

            {/* Timeline items */}
            <div className="space-y-6">
              {changeLogs.map((log) => (
                <div key={log.id} className="relative pl-10">
                  {/* Timeline dot */}
                  <div className="absolute left-2 w-5 h-5 rounded-full bg-card border-2 border-border flex items-center justify-center">
                    {getChangeTypeIcon(log.type)}
                  </div>

                  {/* Content */}
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium">{log.action}</h4>
                      <span className="text-sm text-muted-foreground">
                        {log.date.toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.details}</p>
                    <p className="text-sm text-muted-foreground mt-1">By {log.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Trail Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Baselines</p>
            <p className="text-2xl font-bold">{baselines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Active Baseline</p>
            <p className="text-2xl font-bold">v{selectedBase?.version}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Total Changes</p>
            <p className="text-2xl font-bold">{changeLogs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-sm text-muted-foreground">Last Modified</p>
            <p className="text-2xl font-bold">
              {baselines[0]?.createdDate.toLocaleDateString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectHistoryPage;
