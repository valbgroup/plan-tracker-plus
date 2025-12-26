import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  variant?: "default" | "success" | "warning" | "info" | "destructive";
  className?: string;
  formatValue?: (value: number | string) => string;
}

const variantStyles = {
  default: "bg-card",
  success: "bg-success/10 border-success/20",
  warning: "bg-warning/10 border-warning/20",
  info: "bg-info/10 border-info/20",
  destructive: "bg-destructive/10 border-destructive/20",
};

export function KPICard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  variant = "default",
  className,
  formatValue,
}: KPICardProps) {
  const displayValue = formatValue ? formatValue(value) : value;
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card className={cn("relative overflow-hidden", variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground tracking-tight">
              {displayValue}
            </p>
            {change !== undefined && (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "flex items-center gap-0.5 text-sm font-medium",
                    isPositive ? "text-success" : "text-destructive"
                  )}
                >
                  {isPositive ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  {isPositive ? "+" : ""}{change}%
                </span>
                <span className="text-xs text-muted-foreground">{changeLabel}</span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default KPICard;
