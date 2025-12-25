import React from 'react';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

export interface EVMetrics {
  plannedValue: number;
  earnedValue: number;
  actualCost: number;
  budgetAtCompletion: number;
  scheduleVariance: number;
  costVariance: number;
  schedulePerformanceIndex: number;
  costPerformanceIndex: number;
}

interface EVMetricsDashboardProps {
  metrics: EVMetrics;
  currency?: string;
}

const formatCurrency = (value: number, currency: string = 'DZD'): string => {
  return new Intl.NumberFormat('fr-DZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value) + ` ${currency}`;
};

const getVarianceStatus = (variance: number, isSchedule: boolean = false) => {
  if (isSchedule) {
    if (variance > 0) return { status: 'ahead', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' };
    if (variance < 0) return { status: 'behind', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' };
  } else {
    if (variance > 0) return { status: 'under-budget', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800' };
    if (variance < 0) return { status: 'over-budget', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' };
  }
  return { status: 'on-track', color: 'text-primary', bg: 'bg-primary/10', border: 'border-primary/20' };
};

export const EVMetricsDashboard: React.FC<EVMetricsDashboardProps> = ({ metrics, currency = 'DZD' }) => {
  const scheduleVarianceStatus = getVarianceStatus(metrics.scheduleVariance, true);
  const costVarianceStatus = getVarianceStatus(metrics.costVariance);

  const scheduleHealthy = metrics.schedulePerformanceIndex >= 0.95;
  const costHealthy = metrics.costPerformanceIndex >= 0.95;

  return (
    <div className="space-y-6">
      {/* Variance Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule Variance Card */}
        <Card className={cn(scheduleVarianceStatus.bg, scheduleVarianceStatus.border)}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Schedule Variance</p>
                <p className={cn('text-3xl font-bold mt-2', scheduleVarianceStatus.color)}>
                  {metrics.scheduleVariance > 0 ? '+' : ''}
                  {metrics.scheduleVariance.toFixed(1)} days
                </p>
              </div>
              {scheduleHealthy ? (
                <CheckCircle2 className={cn('w-8 h-8', scheduleVarianceStatus.color)} />
              ) : (
                <AlertCircle className={cn('w-8 h-8', scheduleVarianceStatus.color)} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              SPI: {metrics.schedulePerformanceIndex.toFixed(2)} ({scheduleHealthy ? 'On Track' : 'At Risk'})
            </p>
          </CardContent>
        </Card>

        {/* Cost Variance Card */}
        <Card className={cn(costVarianceStatus.bg, costVarianceStatus.border)}>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Cost Variance</p>
                <p className={cn('text-3xl font-bold mt-2', costVarianceStatus.color)}>
                  {metrics.costVariance > 0 ? '+' : ''}
                  {formatCurrency(metrics.costVariance, currency)}
                </p>
              </div>
              {costHealthy ? (
                <CheckCircle2 className={cn('w-8 h-8', costVarianceStatus.color)} />
              ) : (
                <AlertCircle className={cn('w-8 h-8', costVarianceStatus.color)} />
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              CPI: {metrics.costPerformanceIndex.toFixed(2)} ({costHealthy ? 'On Track' : 'At Risk'})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed EV Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Earned Value Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Planned Value (PV)</p>
              <p className="text-lg font-semibold text-foreground mt-2">
                {formatCurrency(metrics.plannedValue, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total planned budget</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Earned Value (EV)</p>
              <p className="text-lg font-semibold text-emerald-600 mt-2">
                {formatCurrency(metrics.earnedValue, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Completed work value</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Actual Cost (AC)</p>
              <p className="text-lg font-semibold text-primary mt-2">
                {formatCurrency(metrics.actualCost, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Real expenses</p>
            </div>

            <div className="border border-border rounded-lg p-4">
              <p className="text-xs font-medium text-muted-foreground uppercase">Budget at Completion</p>
              <p className="text-lg font-semibold text-foreground mt-2">
                {formatCurrency(metrics.budgetAtCompletion, currency)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Total project budget</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Indexes */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Indexes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* SPI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Schedule Performance Index (SPI)</span>
                <span className="text-sm font-semibold text-foreground">{metrics.schedulePerformanceIndex.toFixed(2)}</span>
              </div>
              <Progress 
                value={Math.min(metrics.schedulePerformanceIndex * 100, 100)} 
                className={cn(
                  'h-2',
                  metrics.schedulePerformanceIndex >= 1 ? '[&>div]:bg-emerald-500' :
                  metrics.schedulePerformanceIndex >= 0.95 ? '[&>div]:bg-amber-500' : '[&>div]:bg-destructive'
                )}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.schedulePerformanceIndex >= 1 ? 'Ahead of schedule' :
                 metrics.schedulePerformanceIndex >= 0.95 ? 'On schedule' : 'Behind schedule'}
              </p>
            </div>

            {/* CPI */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">Cost Performance Index (CPI)</span>
                <span className="text-sm font-semibold text-foreground">{metrics.costPerformanceIndex.toFixed(2)}</span>
              </div>
              <Progress 
                value={Math.min(metrics.costPerformanceIndex * 100, 100)} 
                className={cn(
                  'h-2',
                  metrics.costPerformanceIndex >= 1 ? '[&>div]:bg-emerald-500' :
                  metrics.costPerformanceIndex >= 0.95 ? '[&>div]:bg-amber-500' : '[&>div]:bg-destructive'
                )}
              />
              <p className="text-xs text-muted-foreground mt-2">
                {metrics.costPerformanceIndex >= 1 ? 'Under budget' :
                 metrics.costPerformanceIndex >= 0.95 ? 'On budget' : 'Over budget'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trend Analysis */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <TrendingUp className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Trend Analysis</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {metrics.schedulePerformanceIndex >= 1 && metrics.costPerformanceIndex >= 1
                  ? '✓ Project is ahead of schedule and under budget'
                  : metrics.schedulePerformanceIndex < 0.95 || metrics.costPerformanceIndex < 0.95
                  ? '⚠ Project requires attention - variance detected'
                  : '→ Project is on track'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EVMetricsDashboard;
