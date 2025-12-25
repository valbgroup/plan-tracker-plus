import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Save, Loader2, AlertCircle, SplitSquareHorizontal, FileInput } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export interface MonthlyBudgetData {
  month: string;
  monthLabel: string;
  amount: number;
}

interface MonthlyBudgetTableProps {
  monthlyData: MonthlyBudgetData[];
  totalBudget: number;
  currency: string;
  onChange: (data: MonthlyBudgetData[]) => void;
  onSave: () => Promise<void>;
  disabled?: boolean;
}

const MONTHS = [
  { key: '01', label: 'January' },
  { key: '02', label: 'February' },
  { key: '03', label: 'March' },
  { key: '04', label: 'April' },
  { key: '05', label: 'May' },
  { key: '06', label: 'June' },
  { key: '07', label: 'July' },
  { key: '08', label: 'August' },
  { key: '09', label: 'September' },
  { key: '10', label: 'October' },
  { key: '11', label: 'November' },
  { key: '12', label: 'December' },
];

const TEMPLATES = [
  { 
    name: 'Flat', 
    description: '~8.33% per month (equal distribution)',
    percentages: [8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.33, 8.37]
  },
  { 
    name: 'Front-loaded', 
    description: 'Higher spending in early months',
    percentages: [15, 12, 10, 10, 8, 8, 7, 7, 6, 6, 6, 5]
  },
  { 
    name: 'Back-loaded', 
    description: 'Higher spending in later months',
    percentages: [5, 5, 6, 6, 7, 8, 8, 10, 10, 10, 12, 13]
  },
  { 
    name: 'Mid-peak', 
    description: 'Peak spending in Q2-Q3',
    percentages: [5, 6, 8, 12, 14, 14, 12, 10, 8, 5, 4, 2]
  },
];

export const MonthlyBudgetTable: React.FC<MonthlyBudgetTableProps> = ({
  monthlyData,
  totalBudget,
  currency,
  onChange,
  onSave,
  disabled = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // Initialize monthly data if empty
  const data = useMemo(() => {
    if (monthlyData.length === 12) return monthlyData;
    return MONTHS.map(m => ({
      month: m.key,
      monthLabel: m.label,
      amount: 0,
    }));
  }, [monthlyData]);

  // Calculate sum and cumulative
  const monthlySum = useMemo(() => 
    data.reduce((sum, m) => sum + (m.amount || 0), 0), 
    [data]
  );

  const cumulativeData = useMemo(() => {
    let cumulative = 0;
    return data.map(m => {
      cumulative += m.amount || 0;
      return {
        ...m,
        cumulative,
        progressPercent: totalBudget > 0 ? (cumulative / totalBudget) * 100 : 0,
      };
    });
  }, [data, totalBudget]);

  const sumDifference = monthlySum - totalBudget;
  const tolerance = 1; // 1 currency unit tolerance
  const isWithinTolerance = Math.abs(sumDifference) <= tolerance;

  const handleUpdateMonth = (month: string, amount: number) => {
    const updated = data.map(m => 
      m.month === month ? { ...m, amount: Math.max(0, amount) } : m
    );
    onChange(updated);
  };

  const handleDistributeEvenly = () => {
    const perMonth = Math.floor(totalBudget / 12);
    const remainder = totalBudget - (perMonth * 12);
    
    const distributed = data.map((m, idx) => ({
      ...m,
      // Add remainder to last month to ensure exact total
      amount: idx === 11 ? perMonth + remainder : perMonth,
    }));
    
    onChange(distributed);
    toast.success(`Distributed ${perMonth.toLocaleString()} ${currency} per month`);
  };

  const handleApplyTemplate = (template: typeof TEMPLATES[0]) => {
    const distributed = data.map((m, idx) => ({
      ...m,
      amount: Math.round(totalBudget * (template.percentages[idx] / 100)),
    }));
    
    // Adjust for rounding errors
    const sum = distributed.reduce((s, d) => s + d.amount, 0);
    const diff = totalBudget - sum;
    if (diff !== 0 && distributed.length > 0) {
      distributed[11].amount += diff;
    }
    
    onChange(distributed);
    setShowTemplates(false);
    toast.success(`Applied "${template.name}" template`);
  };

  const handleSave = async () => {
    // Check for negative values
    const hasNegative = data.some(m => m.amount < 0);
    if (hasNegative) {
      toast.error('Monthly amounts cannot be negative');
      return;
    }

    if (!isWithinTolerance) {
      toast.error(`Monthly total (${monthlySum.toLocaleString()}) must equal budget (${totalBudget.toLocaleString()}) ±1`);
      return;
    }

    setIsSaving(true);
    try {
      await onSave();
      toast.success('Monthly budget saved');
    } catch (error) {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-4">
      {/* Sum Validation */}
      {!isWithinTolerance && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <div className="flex-1">
            <p className="font-semibold text-destructive">SUM MISMATCH</p>
            <p className="text-sm text-destructive/80">
              Monthly total: {formatCurrency(monthlySum)}, Budget: {formatCurrency(totalBudget)}. 
              Difference: {formatCurrency(Math.abs(sumDifference))}
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h4 className="text-md font-semibold text-foreground">Monthly Budget Distribution</h4>
          <p className="text-sm text-muted-foreground">
            Total: {formatCurrency(totalBudget)} | Allocated: {formatCurrency(monthlySum)}
            <span className={cn('ml-2', isWithinTolerance ? 'text-green-600' : 'text-destructive')}>
              ({isWithinTolerance ? '✓ Valid' : `Δ ${formatCurrency(sumDifference)}`})
            </span>
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDistributeEvenly}
            disabled={disabled || totalBudget <= 0}
          >
            <SplitSquareHorizontal className="w-4 h-4 mr-2" />
            Distribute Evenly
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTemplates(true)}
            disabled={disabled || totalBudget <= 0}
          >
            <FileInput className="w-4 h-4 mr-2" />
            Import Template
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            disabled={disabled || isSaving || !isWithinTolerance}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[120px]">Month</TableHead>
              <TableHead className="w-[180px]">Monthly Amount</TableHead>
              <TableHead className="w-[150px]">Cumulative MTD</TableHead>
              <TableHead className="w-[120px]">Progress %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cumulativeData.map((month) => (
              <TableRow key={month.month}>
                <TableCell className="font-medium">{month.monthLabel}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={month.amount}
                      onChange={(e) => handleUpdateMonth(month.month, parseFloat(e.target.value) || 0)}
                      disabled={disabled}
                      min={0}
                      className={cn(
                        'h-8 w-32',
                        month.amount < 0 && 'border-destructive'
                      )}
                    />
                    <span className="text-xs text-muted-foreground">{currency}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {formatCurrency(month.cumulative)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all",
                          month.progressPercent > 100 ? 'bg-destructive' : 'bg-primary'
                        )}
                        style={{ width: `${Math.min(100, month.progressPercent)}%` }}
                      />
                    </div>
                    <span className={cn(
                      "text-xs font-medium w-14",
                      month.progressPercent > 100 && 'text-destructive'
                    )}>
                      {month.progressPercent.toFixed(1)}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Real-time sum display */}
      <div className="flex justify-end">
        <div className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium",
          isWithinTolerance ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200" : "bg-destructive/10 text-destructive"
        )}>
          Sum: {formatCurrency(monthlySum)} / {formatCurrency(totalBudget)}
          {isWithinTolerance ? ' ✓' : ` (${sumDifference > 0 ? '+' : ''}${formatCurrency(sumDifference)})`}
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select Spending Profile</DialogTitle>
            <DialogDescription>
              Choose a template to pre-fill monthly budget distribution.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            {TEMPLATES.map((template) => (
              <button
                key={template.name}
                onClick={() => handleApplyTemplate(template)}
                className="w-full p-4 text-left border rounded-lg hover:bg-accent transition-colors"
              >
                <p className="font-medium text-foreground">{template.name}</p>
                <p className="text-sm text-muted-foreground">{template.description}</p>
                <div className="mt-2 flex gap-1">
                  {template.percentages.slice(0, 6).map((p, i) => (
                    <div 
                      key={i}
                      className="h-8 bg-primary/20 rounded flex-1"
                      style={{ height: `${Math.max(8, p * 2)}px` }}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground self-end">...</span>
                </div>
              </button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTemplates(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
