import React from 'react';
import { CheckCircle, Archive } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Baseline {
  id: string;
  version: number;
  createdDate: Date;
  createdBy: string;
  description: string;
  status: 'active' | 'archived' | 'superseded';
}

interface BaselineSelectorProps {
  baselines: Baseline[];
  activeBaselineId: string;
  onSelect: (baselineId: string) => void;
  disabled?: boolean;
}

export const BaselineSelector: React.FC<BaselineSelectorProps> = ({
  baselines,
  activeBaselineId,
  onSelect,
  disabled = false,
}) => {
  if (!baselines || baselines.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-4">
        No baselines available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Select Baseline Version
      </label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {baselines.map((baseline) => (
          <button
            key={baseline.id}
            onClick={() => onSelect(baseline.id)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
              activeBaselineId === baseline.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground',
              disabled && 'opacity-50 cursor-not-allowed'
            )}
            title={baseline.description}
          >
            {baseline.status === 'active' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <Archive className="w-4 h-4" />
            )}
            v{baseline.version}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BaselineSelector;
