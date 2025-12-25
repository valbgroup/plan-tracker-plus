import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle, X, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export interface RiskIssue {
  id: string;
  type: 'risk' | 'issue';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  probability?: number;
  status: 'open' | 'mitigating' | 'resolved';
  owner: string;
  dueDate: Date;
  mitigation?: string;
}

interface RiskIssuesDashboardProps {
  items: RiskIssue[];
  onClose?: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<RiskIssue>) => void;
}

const getImpactBadgeVariant = (impact: string) => {
  switch (impact) {
    case 'high':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'medium':
      return 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
    case 'low':
      return 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open':
      return <AlertTriangle className="w-5 h-5 text-destructive" />;
    case 'mitigating':
      return <Clock className="w-5 h-5 text-amber-500" />;
    case 'resolved':
      return <CheckCircle className="w-5 h-5 text-emerald-500" />;
    default:
      return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
  }
};

export const RiskIssuesDashboard: React.FC<RiskIssuesDashboardProps> = ({
  items,
  onClose,
  onUpdate,
}) => {
  const openItems = items.filter((i) => i.status === 'open');
  const mitigatingItems = items.filter((i) => i.status === 'mitigating');
  const resolvedItems = items.filter((i) => i.status === 'resolved');

  const highImpactCount = items.filter((i) => i.impact === 'high' && i.status !== 'resolved').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open Issues</p>
                <p className="text-3xl font-bold text-destructive mt-1">{openItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mitigating</p>
                <p className="text-3xl font-bold text-amber-600 mt-1">{mitigatingItems.length}</p>
              </div>
              <Clock className="w-8 h-8 text-amber-500/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">In mitigation process</p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">{resolvedItems.length}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-emerald-500/50" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Closed items</p>
          </CardContent>
        </Card>

        <Card className={cn(
          highImpactCount > 0 
            ? 'bg-destructive/10 border-destructive/20' 
            : 'bg-muted border-border'
        )}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Impact</p>
                <p className={cn(
                  'text-3xl font-bold mt-1',
                  highImpactCount > 0 ? 'text-destructive' : 'text-muted-foreground'
                )}>
                  {highImpactCount}
                </p>
              </div>
              <AlertCircle className={cn(
                'w-8 h-8',
                highImpactCount > 0 ? 'text-destructive/50' : 'text-muted-foreground/50'
              )} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Critical items active</p>
          </CardContent>
        </Card>
      </div>

      {/* Open Items */}
      {openItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Open Issues ({openItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {openItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-foreground">{item.title}</h4>
                          <Badge variant="outline" className={cn('text-xs', getImpactBadgeVariant(item.impact))}>
                            {item.impact.toUpperCase()} Impact
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.type.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Owner: {item.owner}</span>
                          <span>Due: {format(item.dueDate, 'MMM d, yyyy')}</span>
                          {item.probability !== undefined && (
                            <span>Probability: {Math.round(item.probability * 100)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {onClose && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onClose(item.id)}
                        className="h-8 w-8"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mitigating Items */}
      {mitigatingItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Clock className="w-5 h-5" />
              In Mitigation ({mitigatingItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mitigatingItems.map((item) => (
                <div
                  key={item.id}
                  className="border border-border rounded-lg p-4"
                >
                  <div className="flex items-start gap-3">
                    {getStatusIcon(item.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-foreground">{item.title}</h4>
                        <Badge variant="outline" className={cn('text-xs', getImpactBadgeVariant(item.impact))}>
                          {item.impact.toUpperCase()}
                        </Badge>
                      </div>
                      {item.mitigation && (
                        <p className="text-sm text-muted-foreground mt-2">
                          <strong>Mitigation:</strong> {item.mitigation}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">Owner: {item.owner}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {items.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No Risks or Issues</h3>
              <p className="text-muted-foreground mt-1">All clear! No active risks or issues.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RiskIssuesDashboard;
