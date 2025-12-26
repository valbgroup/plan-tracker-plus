import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormSelectProps {
  label: string;
  name: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  help?: string;
  className?: string;
}

export const FormSelect = ({
  label,
  name,
  value,
  onValueChange,
  options,
  error,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  help,
  className
}: FormSelectProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={name}
          className={cn(
            "w-full",
            error && "border-destructive focus:ring-destructive"
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="bg-popover border shadow-lg z-50">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {help && !error && (
        <p className="text-xs text-muted-foreground">{help}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
