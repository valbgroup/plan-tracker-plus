import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Milestone } from '@/types';
import { cn } from '@/lib/utils';
import { Calendar, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface MilestoneListProps {
  milestones: Milestone[];
  className?: string;
  delay?: number;
}

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-muted-foreground',
    bg: 'bg-muted',
    badge: 'bg-muted text-muted-foreground',
  },
  completed: {
    icon: CheckCircle2,
    color: 'text-success',
    bg: 'bg-success/10',
    badge: 'bg-success/20 text-success',
  },
  overdue: {
    icon: AlertCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    badge: 'bg-destructive/20 text-destructive',
  },
};

export function MilestoneList({
  milestones,
  className,
  delay = 0,
}: MilestoneListProps) {
  return (
    <Card
      className={cn(
        'glass-card animate-fade-in-up opacity-0',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Upcoming Milestones
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {milestones.map((milestone, index) => {
          const config = statusConfig[milestone.status];
          const Icon = config.icon;

          return (
            <div
              key={milestone.id}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-colors',
                'hover:bg-secondary/50 cursor-pointer',
                config.bg
              )}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  config.bg
                )}
              >
                <Icon className={cn('w-5 h-5', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground truncate">
                  {milestone.name}
                </p>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {new Date(milestone.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
              <Badge variant="outline" className={cn('text-xs', config.badge)}>
                {milestone.status}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
