import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { 
  MOCK_EMPLOYEES, 
  MOCK_LIFECYCLE_APPROACHES, 
  MOCK_PROJ_NATURES 
} from '@/data/masterDataMock';

interface CreateProjectWizardProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProjectWizard: React.FC<CreateProjectWizardProps> = ({
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    projectName: '',
    startDate: '',
    endDate: '',
    globalBudget: '',
    projectManager: '',
    lifecycleApproach: '',
    projectNature: '',
    projectDescription: '',
  });

  const [calculatedDuration, setCalculatedDuration] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get active employees for Project Manager dropdown
  const activeEmployees = MOCK_EMPLOYEES.filter(emp => emp.is_active);

  // Get active lifecycle approaches
  const activeApproaches = MOCK_LIFECYCLE_APPROACHES.filter(a => a.is_active);

  // Get active project natures
  const activeNatures = MOCK_PROJ_NATURES.filter(n => n.is_active);

  // Calculate duration whenever dates change
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setCalculatedDuration(diffDays >= 0 ? diffDays : null);
    } else {
      setCalculatedDuration(null);
    }
  }, [formData.startDate, formData.endDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    if (!formData.globalBudget) {
      newErrors.globalBudget = 'Global budget is required';
    }
    if (!formData.projectManager) {
      newErrors.projectManager = 'Project manager is required';
    }
    if (!formData.lifecycleApproach) {
      newErrors.lifecycleApproach = 'Lifecycle approach is required';
    }
    if (!formData.projectNature) {
      newErrors.projectNature = 'Project nature is required';
    }

    // Validate date range
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }

    console.log('Creating project:', {
      ...formData,
      calculatedDuration,
    });

    toast({
      title: "Project Created",
      description: `Project "${formData.projectName}" has been created successfully.`,
    });

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Create New Project</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <CardContent className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Section 1: Project Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Project Information
              </h3>
              <div>
                <Label htmlFor="projectName">Project Name *</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  className={errors.projectName ? 'border-destructive' : ''}
                />
                {errors.projectName && (
                  <p className="text-xs text-destructive mt-1">{errors.projectName}</p>
                )}
              </div>
            </div>

            {/* Section 2: Schedule & Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Schedule & Duration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className={errors.startDate ? 'border-destructive' : ''}
                  />
                  {errors.startDate && (
                    <p className="text-xs text-destructive mt-1">{errors.startDate}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className={errors.endDate ? 'border-destructive' : ''}
                  />
                  {errors.endDate && (
                    <p className="text-xs text-destructive mt-1">{errors.endDate}</p>
                  )}
                </div>
                <div>
                  <Label>Duration</Label>
                  <div className="h-10 px-3 py-2 rounded-md border border-input bg-muted/50 flex items-center text-muted-foreground">
                    {calculatedDuration !== null ? `${calculatedDuration} days` : '-'}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Budget & Team */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Budget & Team
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="globalBudget">Global Budget *</Label>
                  <Input
                    id="globalBudget"
                    name="globalBudget"
                    type="number"
                    value={formData.globalBudget}
                    onChange={handleInputChange}
                    placeholder="Enter budget amount"
                    className={errors.globalBudget ? 'border-destructive' : ''}
                  />
                  {errors.globalBudget && (
                    <p className="text-xs text-destructive mt-1">{errors.globalBudget}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="projectManager">Project Manager *</Label>
                  <Select
                    value={formData.projectManager}
                    onValueChange={(value) => handleSelectChange('projectManager', value)}
                  >
                    <SelectTrigger 
                      id="projectManager" 
                      className={`w-full ${errors.projectManager ? 'border-destructive' : ''}`}
                    >
                      <SelectValue placeholder="Select project manager" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
                      {activeEmployees.map((emp) => (
                        <SelectItem key={emp.collaborateur_id} value={emp.collaborateur_id}>
                          {emp.matricule} - {emp.prenom} {emp.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectManager && (
                    <p className="text-xs text-destructive mt-1">{errors.projectManager}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 4: Project Type */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Project Type
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lifecycleApproach">Lifecycle Approach *</Label>
                  <Select
                    value={formData.lifecycleApproach}
                    onValueChange={(value) => handleSelectChange('lifecycleApproach', value)}
                  >
                    <SelectTrigger 
                      id="lifecycleApproach" 
                      className={`w-full ${errors.lifecycleApproach ? 'border-destructive' : ''}`}
                    >
                      <SelectValue placeholder="Select approach" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
                      {activeApproaches.map((approach) => (
                        <SelectItem key={approach.approche_id} value={approach.approche_id}>
                          {approach.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lifecycleApproach && (
                    <p className="text-xs text-destructive mt-1">{errors.lifecycleApproach}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="projectNature">Project Nature *</Label>
                  <Select
                    value={formData.projectNature}
                    onValueChange={(value) => handleSelectChange('projectNature', value)}
                  >
                    <SelectTrigger 
                      id="projectNature" 
                      className={`w-full ${errors.projectNature ? 'border-destructive' : ''}`}
                    >
                      <SelectValue placeholder="Select nature" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border shadow-lg z-50">
                      {activeNatures.map((nature) => (
                        <SelectItem key={nature.nature_id} value={nature.nature_id}>
                          {nature.libelle}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.projectNature && (
                    <p className="text-xs text-destructive mt-1">{errors.projectNature}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 5: Additional Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground border-b pb-2">
                Additional Information
              </h3>
              <div>
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription}
                  onChange={handleInputChange}
                  placeholder="Enter project description (optional)"
                  rows={4}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateProjectWizard;
