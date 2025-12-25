import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/types';
import { cn } from '@/lib/utils';
import { AlertCircle, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AlertListProps {
  alerts: Alert[];
  className?: string;
  delay?: number;
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    color: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-l-destructive',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-l-warning',
  },
  info: {
    icon: Info,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-l-info',
  },
  success: {
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-l-success',
  },
};

export function AlertList({ alerts, className, delay = 0 }: AlertListProps) {
  return (
    <Card
      className={cn(
        'glass-card animate-fade-in-up opacity-0',
        className
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
    >
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          Alerts
          <span className="text-sm font-normal text-muted-foreground">
            ({alerts.filter((a) => !a.read).length} unread)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              className={cn(
                'p-3 rounded-lg border-l-4 transition-colors cursor-pointer',
                'hover:bg-secondary/50',
                config.bg,
                config.border,
                !alert.read && 'ring-1 ring-border'
              )}
            >
              <div className="flex items-start gap-3">
                <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', config.color)} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium text-sm text-foreground">
                      {alert.title}
                    </p>
                    {!alert.read && (
                      <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {alert.message}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-2">
                    {formatDistanceToNow(new Date(alert.timestamp), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
