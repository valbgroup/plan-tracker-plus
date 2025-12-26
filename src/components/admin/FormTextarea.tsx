import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface FormTextareaProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  help?: string;
  className?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  rows = 4,
  help,
  className,
  maxLength,
  showCount = false
}: FormTextareaProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          "w-full resize-none",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      <div className="flex justify-between">
        {help && !error && (
          <p className="text-xs text-muted-foreground">{help}</p>
        )}
        {error && (
          <p className="text-xs text-destructive">{error}</p>
        )}
        {showCount && maxLength && (
          <p className="text-xs text-muted-foreground ml-auto">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
};
