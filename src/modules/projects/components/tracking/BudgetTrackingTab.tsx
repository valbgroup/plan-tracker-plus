import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  PieChart,
} from 'lucide-react';
import { BudgetTrackingRow, calculateBudgetStatus } from './types';

// Mock budget data
const MOCK_BUDGET: BudgetTrackingRow[] = [
  {
    budgetLineId: 'bl-1',
    category: 'Personnel',
    plannedBudget: 500000,
    actualConsumption: 280000,
    remainingBudget: 220000,
    percentConsumed: 56,
    forecastAtCompletion: 520000,
    variance: -20000,
    variancePercent: -4,
    status: 'WARNING',
    notes: 'Slightly over due to overtime',
    updatedAt: '2024-06-15T10:00:00Z',
    updatedBy: 'Finance Team',
  },
  {
    budgetLineId: 'bl-2',
    category: 'Infrastructure',
    plannedBudget: 200000,
    actualConsumption: 150000,
    remainingBudget: 50000,
    percentConsumed: 75,
    forecastAtCompletion: 200000,
    variance: 0,
    variancePercent: 0,
    status: 'ON_BUDGET',
    notes: 'On track',
    updatedAt: '2024-06-15T10:00:00Z',
    updatedBy: 'IT Team',
  },
  {
    budgetLineId: 'bl-3',
    category: 'Software Licenses',
    plannedBudget: 100000,
    actualConsumption: 45000,
    remainingBudget: 55000,
    percentConsumed: 45,
    forecastAtCompletion: 90000,
    variance: 10000,
    variancePercent: 10,
    status: 'ON_BUDGET',
    notes: 'Under budget - good negotiation',
    updatedAt: '2024-06-10T14:00:00Z',
    updatedBy: 'Procurement',
  },
  {
    budgetLineId: 'bl-4',
    category: 'Training',
    plannedBudget: 50000,
    actualConsumption: 60000,
    remainingBudget: -10000,
    percentConsumed: 120,
    forecastAtCompletion: 70000,
    variance: -20000,
    variancePercent: -40,
    status: 'OVER_BUDGET',
    notes: 'Additional training required',
    updatedAt: '2024-06-12T09:00:00Z',
    updatedBy: 'HR Team',
  },
  {
    budgetLineId: 'bl-5',
    category: 'Contingency',
    plannedBudget: 150000,
    actualConsumption: 20000,
    remainingBudget: 130000,
    percentConsumed: 13,
    forecastAtCompletion: 80000,
    variance: 70000,
    variancePercent: 47,
    status: 'ON_BUDGET',
    notes: 'Reserve fund',
    updatedAt: '2024-06-01T11:00:00Z',
    updatedBy: 'PMO',
  },
];

interface BudgetTrackingTabProps {
  projectId: string;
  currency?: string;
}

export const BudgetTrackingTab: React.FC<BudgetTrackingTabProps> = ({ 
  projectId,
  currency = 'DZD'
}) => {
  const [budgetLines, setBudgetLines] = useState<BudgetTrackingRow[]>(MOCK_BUDGET);
  const [isSaving, setIsSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'category' | 'phase' | 'resource'>('category');

  const metrics = useMemo(() => {
    const totalPlanned = budgetLines.reduce((sum, b) => sum + b.plannedBudget, 0);
    const totalActual = budgetLines.reduce((sum, b) => sum + (b.actualConsumption || 0), 0);
    const totalRemaining = totalPlanned - totalActual;
    const percentConsumed = Math.round((totalActual / totalPlanned) * 100);
    const totalForecast = budgetLines.reduce((sum, b) => sum + b.forecastAtCompletion, 0);
    const totalVariance = totalPlanned - totalForecast;
    const overBudgetCount = budgetLines.filter(b => b.status === 'OVER_BUDGET').length;
    const burnRate = totalActual / 180; // Assuming 180 days elapsed
    
    return { 
      totalPlanned, 
      totalActual, 
      totalRemaining, 
      percentConsumed, 
      totalForecast,
      totalVariance,
      overBudgetCount,
      burnRate
    };
  }, [budgetLines]);

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  const handleUpdateBudget = (id: string, field: keyof BudgetTrackingRow, value: unknown) => {
    setBudgetLines(prev => prev.map(line => {
      if (line.budgetLineId !== id) return line;
      
      const updated = { ...line, [field]: value };
      
      // Recalculate derived fields
      if (field === 'actualConsumption') {
        const actual = value as number;
        updated.remainingBudget = updated.plannedBudget - actual;
        updated.percentConsumed = Math.round((actual / updated.plannedBudget) * 100);
        updated.variance = updated.plannedBudget - updated.forecastAtCompletion;
        updated.variancePercent = Math.round((updated.variance / updated.plannedBudget) * 100);
        updated.status = calculateBudgetStatus(updated.percentConsumed, updated.variance);
      }
      
      if (field === 'forecastAtCompletion') {
        updated.variance = updated.plannedBudget - (value as number);
        updated.variancePercent = Math.round((updated.variance / updated.plannedBudget) * 100);
        updated.status = calculateBudgetStatus(updated.percentConsumed, updated.variance);
      }
      
      updated.updatedAt = new Date().toISOString();
      updated.updatedBy = 'Current User';
      
      return updated;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Budget tracking data saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ON_BUDGET':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"><CheckCircle className="w-3 h-3 mr-1" />On Budget</Badge>;
      case 'WARNING':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20"><AlertTriangle className="w-3 h-3 mr-1" />Warning</Badge>;
      case 'OVER_BUDGET':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20"><TrendingDown className="w-3 h-3 mr-1" />Over Budget</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DollarSign className="w-4 h-4" />
              Total Budget
            </div>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalPlanned)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Consumed</div>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalActual)}</div>
            <Progress value={metrics.percentConsumed} className="mt-2 h-2" />
            <div className="text-xs text-muted-foreground mt-1">{metrics.percentConsumed}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Remaining</div>
            <div className={cn(
              'text-2xl font-bold',
              metrics.totalRemaining < 0 ? 'text-destructive' : 'text-emerald-600'
            )}>
              {formatCurrency(metrics.totalRemaining)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Forecast Variance</div>
            <div className={cn(
              'text-2xl font-bold flex items-center gap-1',
              metrics.totalVariance >= 0 ? 'text-emerald-600' : 'text-destructive'
            )}>
              {metrics.totalVariance >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
              {formatCurrency(Math.abs(metrics.totalVariance))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Forecast at Completion</div>
            <div className="text-lg font-semibold">{formatCurrency(metrics.totalForecast)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Burn Rate</div>
            <div className="text-lg font-semibold">{formatCurrency(Math.round(metrics.burnRate))}/day</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Over Budget Items</div>
            <div className={cn(
              'text-lg font-semibold',
              metrics.overBudgetCount > 0 ? 'text-destructive' : 'text-emerald-600'
            )}>
              {metrics.overBudgetCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Budget Health</div>
            <div className={cn(
              'text-lg font-semibold',
              metrics.totalVariance >= 0 ? 'text-emerald-600' : 'text-destructive'
            )}>
              {metrics.totalVariance >= 0 ? 'Healthy' : 'At Risk'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Budget Tracking by {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border shadow-lg z-50">
                  <SelectItem value="category">By Category</SelectItem>
                  <SelectItem value="phase">By Phase</SelectItem>
                  <SelectItem value="resource">By Resource</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleSave} disabled={isSaving} size="sm">
                {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[150px]">Category</TableHead>
                  <TableHead className="w-[130px] text-right">Planned</TableHead>
                  <TableHead className="w-[150px]">Actual Consumption</TableHead>
                  <TableHead className="w-[130px] text-right">Remaining</TableHead>
                  <TableHead className="w-[100px]">% Used</TableHead>
                  <TableHead className="w-[150px]">Forecast (EAC)</TableHead>
                  <TableHead className="w-[120px] text-right">Variance</TableHead>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead className="w-[150px]">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {budgetLines.map((line) => (
                  <TableRow 
                    key={line.budgetLineId}
                    className={cn(
                      line.status === 'WARNING' && 'bg-amber-50/50 dark:bg-amber-950/10',
                      line.status === 'OVER_BUDGET' && 'bg-destructive/5'
                    )}
                  >
                    <TableCell className="font-medium">{line.category}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(line.plannedBudget)}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.actualConsumption ?? ''}
                        onChange={(e) => handleUpdateBudget(line.budgetLineId, 'actualConsumption', parseInt(e.target.value) || 0)}
                        className="h-8 w-[130px]"
                      />
                    </TableCell>
                    <TableCell className={cn(
                      'text-right font-medium',
                      line.remainingBudget < 0 ? 'text-destructive' : 'text-emerald-600'
                    )}>
                      {formatCurrency(line.remainingBudget)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Progress 
                          value={Math.min(line.percentConsumed, 100)} 
                          className={cn(
                            'h-2',
                            line.percentConsumed > 100 && '[&>div]:bg-destructive',
                            line.percentConsumed > 80 && line.percentConsumed <= 100 && '[&>div]:bg-amber-500'
                          )}
                        />
                        <div className={cn(
                          'text-xs text-center',
                          line.percentConsumed > 100 ? 'text-destructive' : 'text-muted-foreground'
                        )}>
                          {line.percentConsumed}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={line.forecastAtCompletion}
                        onChange={(e) => handleUpdateBudget(line.budgetLineId, 'forecastAtCompletion', parseInt(e.target.value) || 0)}
                        className="h-8 w-[130px]"
                      />
                    </TableCell>
                    <TableCell className={cn(
                      'text-right font-medium',
                      line.variance >= 0 ? 'text-emerald-600' : 'text-destructive'
                    )}>
                      {line.variance >= 0 ? '+' : ''}{formatCurrency(line.variance)}
                      <div className="text-xs text-muted-foreground">
                        ({line.variancePercent >= 0 ? '+' : ''}{line.variancePercent}%)
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(line.status)}</TableCell>
                    <TableCell>
                      <Textarea
                        value={line.notes}
                        onChange={(e) => handleUpdateBudget(line.budgetLineId, 'notes', e.target.value)}
                        placeholder="Notes..."
                        className="min-h-[50px] text-xs resize-none"
                      />
                    </TableCell>
                  </TableRow>
                ))}
                {/* Totals Row */}
                <TableRow className="bg-muted/30 font-semibold">
                  <TableCell>TOTAL</TableCell>
                  <TableCell className="text-right">{formatCurrency(metrics.totalPlanned)}</TableCell>
                  <TableCell>{formatCurrency(metrics.totalActual)}</TableCell>
                  <TableCell className={cn(
                    'text-right',
                    metrics.totalRemaining < 0 ? 'text-destructive' : 'text-emerald-600'
                  )}>
                    {formatCurrency(metrics.totalRemaining)}
                  </TableCell>
                  <TableCell>{metrics.percentConsumed}%</TableCell>
                  <TableCell>{formatCurrency(metrics.totalForecast)}</TableCell>
                  <TableCell className={cn(
                    'text-right',
                    metrics.totalVariance >= 0 ? 'text-emerald-600' : 'text-destructive'
                  )}>
                    {metrics.totalVariance >= 0 ? '+' : ''}{formatCurrency(metrics.totalVariance)}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
