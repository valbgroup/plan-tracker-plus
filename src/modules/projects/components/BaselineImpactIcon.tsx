import React from 'react';
import { Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BaselineImpactIconProps {
  isValidated?: boolean;
  hasChanged?: boolean;
  className?: string;
}

export const BaselineImpactIcon: React.FC<BaselineImpactIconProps> = ({
  isValidated = false,
  hasChanged = false,
  className,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={cn('inline-flex items-center', className)}>
            <Lock
              className={cn(
                'w-3.5 h-3.5 ml-1',
                isValidated && hasChanged
                  ? 'text-amber-500'
                  : 'text-muted-foreground'
              )}
            />
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Changes affect baseline validation</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
