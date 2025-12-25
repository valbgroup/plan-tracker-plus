import React, { useState } from 'react';
import { AlertTriangle, Shield, Filter, Search, ExternalLink, Eye, Users, FileText, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Anomaly {
  id: string;
  type: 'MASS_MODIFICATION' | 'OFFHOURS_ACTIVITY' | 'UNSTABLE_BASELINE' | 'CRITICAL_DELETION' | 'UNUSUAL_ACTIVITY';
  detectionTime: Date;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  affectedRecords: number;
  requiresReview: boolean;
  project?: string;
}

interface AuditEvent {
  time: string;
  user: string;
  action: string;
  project: string;
  count: number;
}

const MOCK_ANOMALIES: Anomaly[] = [
  {
    id: 'anomaly-1',
    type: 'MASS_MODIFICATION',
    detectionTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
    severity: 'HIGH',
    description: '47 budget changes made by user ahmed.benali in under 1 hour',
    affectedRecords: 47,
    requiresReview: true,
    project: 'Digital Transformation',
  },
  {
    id: 'anomaly-2',
    type: 'OFFHOURS_ACTIVITY',
    detectionTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
    severity: 'MEDIUM',
    description: 'Critical changes made at 23:30 by system administrator',
    affectedRecords: 3,
    requiresReview: true,
    project: 'ERP Migration',
  },
  {
    id: 'anomaly-3',
    type: 'UNSTABLE_BASELINE',
    detectionTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
    severity: 'MEDIUM',
    description: '6 baseline versions created in 30 days - exceeds normal threshold',
    affectedRecords: 1,
    requiresReview: true,
    project: 'Mobile App',
  },
];

const MOCK_EVENTS: AuditEvent[] = [
  { time: '10:30', user: 'PMO Admin', action: 'APPROVE', project: 'Digital Transformation', count: 3 },
  { time: '09:15', user: 'Ahmed Benali', action: 'CREATE', project: 'ERP Migration', count: 1 },
  { time: '08:45', user: 'Fatima Zohra', action: 'UPDATE', project: 'Mobile App', count: 5 },
  { time: '07:20', user: 'System', action: 'CONFIG', project: 'All Projects', count: 2 },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'HIGH': return 'destructive';
    case 'MEDIUM': return 'secondary';
    default: return 'outline';
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case 'CREATE': return 'bg-emerald-100 text-emerald-800';
    case 'UPDATE': return 'bg-blue-100 text-blue-800';
    case 'DELETE': return 'bg-red-100 text-red-800';
    case 'APPROVE': return 'bg-purple-100 text-purple-800';
    case 'CONFIG': return 'bg-slate-100 text-slate-800';
    default: return 'bg-muted';
  }
};

export const GlobalAudit: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Global Audit
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Cross-project compliance monitoring and anomaly detection
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search audit logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>
      </div>

      {/* Compliance KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Traceability Rate</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-2xl font-bold text-emerald-600">98%</p>
              <span className="text-xs text-muted-foreground">Target: 95%</span>
            </div>
            <Progress value={98} className="h-2 [&>div]:bg-emerald-500" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Avg Approval Time</p>
            </div>
            <p className="text-2xl font-bold text-primary">32h</p>
            <p className="text-xs text-muted-foreground mt-1">Target: 48h</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Baseline Changes</p>
            </div>
            <p className="text-2xl font-bold text-amber-600">18</p>
            <p className="text-xs text-muted-foreground mt-1">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <p className="text-2xl font-bold text-purple-600">12</p>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Anomalies Detection */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Detected Anomalies ({MOCK_ANOMALIES.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {MOCK_ANOMALIES.map((anomaly) => (
              <div key={anomaly.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Badge variant={getSeverityColor(anomaly.severity)}>
                        {anomaly.severity}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground">
                        {anomaly.type.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        • {anomaly.detectionTime.toLocaleString()}
                      </span>
                    </div>

                    <p className="font-medium mb-2">{anomaly.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        <strong className="text-foreground">{anomaly.affectedRecords}</strong> affected records
                      </span>
                      {anomaly.project && (
                        <span className="text-muted-foreground">
                          Project: <strong className="text-foreground">{anomaly.project}</strong>
                        </span>
                      )}
                      <span className={cn(
                        'font-medium',
                        anomaly.requiresReview ? 'text-amber-600' : 'text-emerald-600'
                      )}>
                        {anomaly.requiresReview ? '⚠ Requires Review' : '✓ Reviewed'}
                      </span>
                    </div>
                  </div>

                  <Button variant="destructive" size="sm" className="gap-1.5 shrink-0">
                    <Eye className="w-3.5 h-3.5" />
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Audit Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Audit Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {MOCK_EVENTS.map((event, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-medium text-muted-foreground bg-background px-2 py-1 rounded">
                    {event.time}
                  </span>
                  <span className="font-medium">{event.user}</span>
                  <Badge variant="outline" className={cn('text-xs', getActionColor(event.action))}>
                    {event.action}
                  </Badge>
                  <span className="text-muted-foreground text-sm">
                    on <span className="font-medium text-foreground">{event.project}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{event.count} event(s)</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
