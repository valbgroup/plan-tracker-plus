import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  unit?: string;
  icon: LucideIcon;
  className?: string;
  delay?: number;
}

export function KPICard({
  title,
  value,
  change,
  changeType = 'neutral',
  unit,
  icon: Icon,
  className,
  delay = 0,
}: KPICardProps) {
  const TrendIcon = {
    positive: TrendingUp,
    negative: TrendingDown,
    neutral: Minus,
  }[changeType];

  return (
    <Card
      className={cn(
        'glass-card overflow-hidden group hover:border-primary/30 transition-all duration-300',
        'animate-fade-in-up opacity-0',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-foreground">{value}</span>
              {unit && (
                <span className="text-lg text-muted-foreground">{unit}</span>
              )}
            </div>
            {change !== undefined && (
              <div
                className={cn(
                  'flex items-center gap-1 text-sm font-medium',
                  changeType === 'positive' && 'text-success',
                  changeType === 'negative' && 'text-destructive',
                  changeType === 'neutral' && 'text-muted-foreground'
                )}
              >
                <TrendIcon className="w-4 h-4" />
                <span>
                  {changeType === 'positive' && '+'}
                  {change}%
                </span>
                <span className="text-muted-foreground font-normal">
                  vs last month
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              'w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300',
              'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
