import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type: 'text' | 'number' | 'boolean' | 'select' | 'textarea' | 'date';
  required?: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface MasterDataFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: Field[];
  initialData?: Record<string, unknown>;
  onSave: (data: Record<string, unknown>) => void;
  isLoading?: boolean;
}

export function MasterDataFormModal({
  isOpen,
  onClose,
  title,
  fields,
  initialData,
  onSave,
  isLoading = false,
}: MasterDataFormModalProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Initialize form with defaults or existing data
      const initial: Record<string, unknown> = {};
      fields.forEach((field) => {
        if (initialData && field.key in initialData) {
          initial[field.key] = initialData[field.key];
        } else if (field.type === 'boolean') {
          initial[field.key] = true;
        } else {
          initial[field.key] = '';
        }
      });
      setFormData(initial);
      setErrors({});
    }
  }, [isOpen, initialData, fields]);

  const handleChange = (key: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (field.required) {
        const value = formData[field.key];
        if (value === undefined || value === null || value === '') {
          newErrors[field.key] = `${field.label} is required`;
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Edit the details below' : 'Fill in the details to create a new entry'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.key} className="grid gap-2">
              <Label htmlFor={field.key}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>

              {field.type === 'text' && (
                <Input
                  id={field.key}
                  value={String(formData[field.key] || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={errors[field.key] ? 'border-destructive' : ''}
                />
              )}

              {field.type === 'number' && (
                <Input
                  id={field.key}
                  type="number"
                  value={String(formData[field.key] || '')}
                  onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                  placeholder={field.placeholder}
                  className={errors[field.key] ? 'border-destructive' : ''}
                />
              )}

              {field.type === 'date' && (
                <Input
                  id={field.key}
                  type="date"
                  value={String(formData[field.key] || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  className={errors[field.key] ? 'border-destructive' : ''}
                />
              )}

              {field.type === 'textarea' && (
                <Textarea
                  id={field.key}
                  value={String(formData[field.key] || '')}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className={errors[field.key] ? 'border-destructive' : ''}
                  rows={3}
                />
              )}

              {field.type === 'boolean' && (
                <div className="flex items-center gap-2">
                  <Switch
                    id={field.key}
                    checked={Boolean(formData[field.key])}
                    onCheckedChange={(checked) => handleChange(field.key, checked)}
                  />
                  <Label htmlFor={field.key} className="font-normal">
                    {formData[field.key] ? 'Active' : 'Inactive'}
                  </Label>
                </div>
              )}

              {field.type === 'select' && field.options && (
                <Select
                  value={String(formData[field.key] || '')}
                  onValueChange={(value) => handleChange(field.key, value)}
                >
                  <SelectTrigger className={errors[field.key] ? 'border-destructive' : ''}>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {errors[field.key] && (
                <p className="text-sm text-destructive">{errors[field.key]}</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Save Changes' : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
