import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

interface CreateProjectWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    code: '',
    description: '',
    startDate: '',
    endDate: '',
    manager: '',
    budget: '',
    methodology: 'predictive',
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCreate = () => {
    console.log('Creating project:', formData);
    onSuccess();
  };

  const methodologyOptions = [
    {
      value: 'predictive',
      label: 'Predictive (Waterfall)',
      desc: 'Traditional sequential approach',
    },
    {
      value: 'agile',
      label: 'Agile (Scrum/Kanban)',
      desc: 'Iterative and incremental approach',
    },
    {
      value: 'hybrid',
      label: 'Hybrid',
      desc: 'Mix of predictive and agile elements',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-foreground">Create New Project</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
          {step === 1 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">
                Step 1: Basic Information
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Project Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="Enter project title"
                  />
                </div>
                <div>
                  <Label htmlFor="code">Project Code *</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., PROJ-2024-001"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Enter project description"
                    rows={3}
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">
                Step 2: Timeline
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                  />
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">
                Step 3: Team & Budget
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="manager">Project Manager *</Label>
                  <Input
                    id="manager"
                    value={formData.manager}
                    onChange={(e) =>
                      setFormData({ ...formData, manager: e.target.value })
                    }
                    placeholder="Select project manager"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget *</Label>
                  <Input
                    id="budget"
                    type="number"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    placeholder="Enter budget amount"
                  />
                </div>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">
                Step 4: Methodology
              </h3>
              <RadioGroup
                value={formData.methodology}
                onValueChange={(value) =>
                  setFormData({ ...formData, methodology: value })
                }
                className="space-y-3"
              >
                {methodologyOptions.map((option) => (
                  <Label
                    key={option.value}
                    htmlFor={option.value}
                    className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.methodology === option.value
                        ? 'bg-primary/10 border-primary'
                        : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mr-3" />
                    <div>
                      <div className="font-medium text-foreground">{option.label}</div>
                      <div className="text-sm text-muted-foreground">{option.desc}</div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </>
          )}

          {step === 5 && (
            <>
              <h3 className="text-lg font-semibold text-foreground">
                Step 5: Review & Confirm
              </h3>
              <div className="space-y-4 bg-muted/50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Project Title</p>
                  <p className="font-semibold text-foreground">{formData.title || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Project Code</p>
                  <p className="font-semibold text-foreground">{formData.code || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Timeline</p>
                  <p className="font-semibold text-foreground">
                    {formData.startDate || '-'} to {formData.endDate || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-semibold text-foreground">
                    {formData.budget ? `$${formData.budget}` : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Methodology</p>
                  <p className="font-semibold text-foreground capitalize">
                    {formData.methodology}
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t p-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={step === 1}
          >
            Previous
          </Button>

          {step < 5 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button onClick={handleCreate} className="bg-green-600 hover:bg-green-700">
              Create Project
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CreateProjectWizard;
