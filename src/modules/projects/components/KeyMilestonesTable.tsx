import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
}

interface KeyMilestonesTableProps {
  milestones: Milestone[];
  onChange: (milestones: Milestone[]) => void;
  projectStartDate?: string;
  projectEndDate?: string;
  disabled?: boolean;
}

export const KeyMilestonesTable: React.FC<KeyMilestonesTableProps> = ({
  milestones,
  onChange,
  projectStartDate,
  projectEndDate,
  disabled = false,
}) => {
  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `ms-${Date.now()}`,
      title: '',
      date: '',
      description: '',
    };
    onChange([...milestones, newMilestone]);
  };

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    onChange(
      milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );
  };

  const removeMilestone = (id: string) => {
    onChange(milestones.filter((m) => m.id !== id));
  };

  const isDateValid = (date: string): boolean => {
    if (!date || !projectStartDate || !projectEndDate) return true;
    const d = new Date(date);
    const start = new Date(projectStartDate);
    const end = new Date(projectEndDate);
    return d >= start && d <= end;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Key Project Milestones
        </label>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMilestone}
            className="gap-1"
          >
            <Plus className="w-4 h-4" />
            Add Milestone
          </Button>
        )}
      </div>

      {milestones.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-border rounded-lg">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No milestones added yet</p>
          {!disabled && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addMilestone}
              className="mt-2"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add your first milestone
            </Button>
          )}
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Title *
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date *
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Description
                </th>
                {!disabled && (
                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">
                    Action
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {milestones.map((milestone) => {
                const dateValid = isDateValid(milestone.date);
                return (
                  <tr key={milestone.id} className="bg-background">
                    <td className="px-4 py-2">
                      <Input
                        value={milestone.title}
                        onChange={(e) =>
                          updateMilestone(milestone.id, 'title', e.target.value)
                        }
                        placeholder="Milestone name"
                        maxLength={50}
                        disabled={disabled}
                        className="h-8"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <div className="space-y-1">
                        <Input
                          type="date"
                          value={milestone.date}
                          onChange={(e) =>
                            updateMilestone(milestone.id, 'date', e.target.value)
                          }
                          disabled={disabled}
                          className={cn('h-8', !dateValid && 'border-destructive')}
                          min={projectStartDate}
                          max={projectEndDate}
                        />
                        {!dateValid && (
                          <div className="flex items-center gap-1 text-destructive text-xs">
                            <AlertCircle className="w-3 h-3" />
                            Date outside project range
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <Textarea
                        value={milestone.description}
                        onChange={(e) =>
                          updateMilestone(milestone.id, 'description', e.target.value)
                        }
                        placeholder="Optional details"
                        maxLength={200}
                        disabled={disabled}
                        className="h-8 min-h-[32px] resize-none"
                        rows={1}
                      />
                    </td>
                    {!disabled && (
                      <td className="px-4 py-2 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMilestone(milestone.id)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
