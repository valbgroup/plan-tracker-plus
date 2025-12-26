import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BaselineFieldProps {
  fieldName: string;
  fieldLabel: string;
  value: React.ReactNode;
  isBaseline: boolean;
  isAutoBaseline?: boolean;
  isPending?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  onToggleBaseline?: (fieldName: string, isMarked: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const BaselineField: React.FC<BaselineFieldProps> = ({
  fieldName,
  fieldLabel,
  value,
  isBaseline,
  isAutoBaseline = false,
  isPending = false,
  isLoading = false,
  disabled = false,
  onToggleBaseline,
  className,
  children,
}) => {
  const handleToggle = (checked: boolean) => {
    if (onToggleBaseline && !isAutoBaseline && !isLoading) {
      onToggleBaseline(fieldName, checked);
    }
  };

  return (
    <div
      className={cn(
        'relative rounded-lg border p-4 transition-all duration-200',
        isBaseline && 'border-primary/30 bg-primary/5',
        isPending && 'border-amber-500/30 bg-amber-500/5',
        !isBaseline && !isPending && 'border-border bg-card',
        className
      )}
    >
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {/* Toggle (only for non-auto-baseline fields) */}
          {!isAutoBaseline && (
            <div className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              ) : (
                <Switch
                  checked={isBaseline}
                  onCheckedChange={handleToggle}
                  disabled={disabled || isLoading}
                  className="data-[state=checked]:bg-primary"
                />
              )}
            </div>
          )}
          
          {/* Field Label */}
          <span className="text-sm font-medium text-foreground">
            {fieldLabel}
          </span>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {isPending && (
            <Badge 
              variant="outline" 
              className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"
            >
              ⏳ Pending
            </Badge>
          )}
          
          {(isBaseline || isAutoBaseline) && !isPending && (
            <Badge 
              variant="outline" 
              className="bg-primary/10 text-primary border-primary/20 text-xs flex items-center gap-1"
            >
              <Lock className="h-3 w-3" />
              Baseline
            </Badge>
          )}
        </div>
      </div>

      {/* Value Display */}
      <div className="text-sm text-muted-foreground pl-0">
        {children || (
          <span className={cn(
            'font-medium',
            isBaseline ? 'text-foreground' : 'text-muted-foreground'
          )}>
            {value || '-'}
          </span>
        )}
      </div>
    </div>
  );
};

export default BaselineField;
