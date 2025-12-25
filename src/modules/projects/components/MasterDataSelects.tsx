import React, { useState } from 'react';
import { AlertCircle, Check, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  useEmployees,
  useResources,
  useMethodologies,
  filterEmployees,
  filterResources,
} from '../hooks/useMasterDataLookups';

// Manager Select Component
interface ManagerSelectProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export const ManagerSelect: React.FC<ManagerSelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
  error,
}) => {
  const { data: employees, isLoading, error: fetchError } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredEmployees = filterEmployees(employees, searchTerm);
  const selectedEmployee = employees?.find((emp) => emp.id === value);

  if (fetchError) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
        <p className="text-destructive text-sm">Failed to load managers</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Project Manager {required && <span className="text-destructive">*</span>}
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
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
          <span className={cn(!selectedEmployee && 'text-muted-foreground')}>
            {isLoading ? 'Loading...' : selectedEmployee?.name || 'Select a manager'}
          </span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
            <div className="p-2 border-b border-border">
              <Input
                placeholder="Search managers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No managers found
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <button
                    key={emp.id}
                    type="button"
                    onClick={() => {
                      onChange(emp.id);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2 hover:bg-accent flex items-center justify-between transition-colors',
                      value === emp.id && 'bg-accent'
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{emp.name}</span>
                      <span className="text-xs text-muted-foreground">{emp.email}</span>
                    </div>
                    {value === emp.id && <Check className="w-4 h-4 text-primary" />}
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

      <p className="text-xs text-muted-foreground">Connected to Master Data (MD.Organization)</p>
    </div>
  );
};

// Stakeholders Multi-Select Component
interface StakeholdersSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export const StakeholdersSelect: React.FC<StakeholdersSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { data: employees, isLoading } = useEmployees();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredEmployees = filterEmployees(employees, searchTerm);
  const selectedEmployees = employees?.filter((emp) => value.includes(emp.id)) || [];

  const handleToggle = (empId: string) => {
    if (value.includes(empId)) {
      onChange(value.filter((id) => id !== empId));
    } else {
      onChange([...value, empId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Stakeholders</label>

      {selectedEmployees.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedEmployees.map((emp) => (
            <Badge key={emp.id} variant="secondary" className="flex items-center gap-1">
              {emp.name}
              <button
                type="button"
                onClick={() => handleToggle(emp.id)}
                disabled={disabled}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={cn(
            'w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between transition-colors',
            disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'border-input bg-background hover:border-primary'
          )}
        >
          <span className="text-muted-foreground">
            {isLoading ? 'Loading...' : 'Add stakeholder'}
          </span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
            <div className="p-2 border-b border-border">
              <Input
                placeholder="Search stakeholders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredEmployees.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No stakeholders found
                </div>
              ) : (
                filteredEmployees.map((emp) => (
                  <label
                    key={emp.id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(emp.id)}
                      onChange={() => handleToggle(emp.id)}
                      className="w-4 h-4 rounded border-input"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{emp.name}</span>
                      <span className="text-xs text-muted-foreground">{emp.email}</span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Connected to Master Data (MD.Organization)</p>
    </div>
  );
};

// Resources Multi-Select Component
interface ResourcesSelectProps {
  value: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
}

export const ResourcesSelect: React.FC<ResourcesSelectProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const { data: resources, isLoading } = useResources();
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredResources = filterResources(resources, searchTerm);
  const selectedResources = resources?.filter((res) => value.includes(res.id)) || [];

  const handleToggle = (resId: string) => {
    if (value.includes(resId)) {
      onChange(value.filter((id) => id !== resId));
    } else {
      onChange([...value, resId]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Resources</label>

      {selectedResources.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedResources.map((res) => (
            <Badge key={res.id} variant="outline" className="flex items-center gap-1 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800">
              {res.name}
              <button
                type="button"
                onClick={() => handleToggle(res.id)}
                disabled={disabled}
                className="hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled || isLoading}
          className={cn(
            'w-full px-4 py-2 border rounded-lg text-left flex items-center justify-between transition-colors',
            disabled
              ? 'bg-muted text-muted-foreground cursor-not-allowed'
              : 'border-input bg-background hover:border-primary'
          )}
        >
          <span className="text-muted-foreground">
            {isLoading ? 'Loading...' : 'Add resource'}
          </span>
          <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-popover border border-border rounded-lg shadow-lg">
            <div className="p-2 border-b border-border">
              <Input
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>

            <div className="max-h-48 overflow-y-auto">
              {filteredResources.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  No resources found
                </div>
              ) : (
                filteredResources.map((res) => (
                  <label
                    key={res.id}
                    className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={value.includes(res.id)}
                      onChange={() => handleToggle(res.id)}
                      className="w-4 h-4 rounded border-input"
                    />
                    <div className="flex flex-col">
                      <span className="font-medium text-foreground">{res.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {res.type} • ${res.costPerHour}/hr
                      </span>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <p className="text-xs text-muted-foreground">Connected to Master Data (MD.Resources)</p>
    </div>
  );
};

// Methodology Select Component
interface MethodologySelectProps {
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export const MethodologySelect: React.FC<MethodologySelectProps> = ({
  value,
  onChange,
  disabled = false,
  required = false,
}) => {
  const { data: methodologies, isLoading } = useMethodologies();
  const selectedMethodology = methodologies?.find((m) => m.id === value);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Methodology {required && <span className="text-destructive">*</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || isLoading}
        className={cn(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-colors',
          disabled
            ? 'bg-muted text-muted-foreground cursor-not-allowed'
            : 'bg-background border-input text-foreground'
        )}
      >
        <option value="">Select a methodology</option>
        {methodologies?.map((meth) => (
          <option key={meth.id} value={meth.id}>
            {meth.name}
          </option>
        ))}
      </select>

      {selectedMethodology && (
        <p className="text-xs text-muted-foreground">{selectedMethodology.description}</p>
      )}

      <p className="text-xs text-muted-foreground">Connected to Master Data (MD.Agile)</p>
    </div>
  );
};
