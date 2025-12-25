import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Variance {
  field: string;
  planned: number;
  actual: number;
  variance: number;
  percentageVariance: number;
  status: 'on-track' | 'at-risk' | 'off-track';
}

interface VarianceAnalysisProps {
  variances: Variance[];
  title?: string;
  isLoading?: boolean;
}

export const VarianceAnalysis: React.FC<VarianceAnalysisProps> = ({
  variances,
  title = 'Variance Analysis',
  isLoading = false,
}) => {
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800';
      case 'at-risk':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800';
      case 'off-track':
        return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800';
      default:
        return 'bg-muted border-border';
    }
  };

  const getStatusTextClasses = (status: string) => {
    switch (status) {
      case 'on-track':
        return 'text-green-700 dark:text-green-400';
      case 'at-risk':
        return 'text-yellow-700 dark:text-yellow-400';
      case 'off-track':
        return 'text-red-700 dark:text-red-400';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTrendIcon = (variance: number) => {
    if (variance > 0) {
      return <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />;
    } else if (variance < 0) {
      return <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  if (isLoading) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!variances || variances.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No variance data available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variances.map((item, idx) => (
          <div
            key={idx}
            className={cn('rounded-lg p-4 border-2', getStatusClasses(item.status))}
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h4 className="font-semibold text-foreground">{item.field}</h4>
                <span
                  className={cn(
                    'text-xs font-medium mt-1 inline-block px-2 py-1 rounded capitalize',
                    getStatusTextClasses(item.status)
                  )}
                >
                  {item.status.replace('-', ' ')}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {getTrendIcon(item.variance)}
                <span
                  className={cn(
                    'text-sm font-bold',
                    item.variance > 0 ? 'text-green-600 dark:text-green-400' : item.variance < 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'
                  )}
                >
                  {item.variance > 0 ? '+' : ''}{item.percentageVariance.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Planned</span>
                <span className="font-semibold text-foreground">
                  {item.planned.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Actual</span>
                <span className="font-semibold text-foreground">
                  {item.actual.toLocaleString()}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between">
                <span className="text-muted-foreground font-medium">Variance</span>
                <span className="font-bold text-foreground">
                  {item.variance > 0 ? '+' : ''}{item.variance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VarianceAnalysis;
