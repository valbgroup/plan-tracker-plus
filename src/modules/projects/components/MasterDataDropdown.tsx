import React, { useState } from 'react';
import { Check, ChevronDown, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { BaselineImpactIcon } from './BaselineImpactIcon';

export interface DropdownOption {
  id: string;
  code: string;
  label: string;
  description?: string;
}

interface MasterDataDropdownProps {
  label: string;
  value: string;
  onChange: (id: string) => void;
  options: DropdownOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  isLoading?: boolean;
  hasBaselineImpact?: boolean;
  isBaselineValidated?: boolean;
  hasChanged?: boolean;
  searchable?: boolean;
  sourceLabel?: string;
}

export const MasterDataDropdown: React.FC<MasterDataDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  required = false,
  disabled = false,
  error,
  isLoading = false,
  hasBaselineImpact = false,
  isBaselineValidated = false,
  hasChanged = false,
  searchable = true,
  sourceLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedOption = options.find((opt) => opt.id === value);

  const filteredOptions = searchable && searchTerm
    ? options.filter(
        (opt) =>
          opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opt.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
        {hasBaselineImpact && (
          <BaselineImpactIcon
            isValidated={isBaselineValidated}
            hasChanged={hasChanged}
          />
        )}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && !isLoading && setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={cn(
            'w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between transition-colors',
            disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : error
              ? 'border-destructive bg-background'
              : 'border-input bg-background hover:border-primary'
          )}
        >
          <span className={cn(!selectedOption && 'text-muted-foreground')}>
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </span>
            ) : (
              selectedOption?.label || placeholder
            )}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 transition-transform text-muted-foreground',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
            {searchable && (
              <div className="p-2 border-b border-border">
                <Input
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-8"
                  autoFocus
                />
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option.id)}
                    className={cn(
                      'w-full text-left px-4 py-2 hover:bg-accent flex items-center justify-between transition-colors',
                      value === option.id && 'bg-accent'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </div>
                    {value === option.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-1 text-destructive text-xs">
          <AlertCircle className="w-3 h-3" />
          {error}
        </div>
      )}

      {sourceLabel && (
        <p className="text-xs text-muted-foreground">
          Connected to Master Data ({sourceLabel})
        </p>
      )}
    </div>
  );
};
