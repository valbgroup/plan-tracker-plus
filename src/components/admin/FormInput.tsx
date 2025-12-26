import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'tel' | 'url' | 'password';
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  help?: string;
  className?: string;
}

export const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  help,
  className
}: FormInputProps) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={cn(
          "w-full",
          error && "border-destructive focus-visible:ring-destructive"
        )}
      />
      {help && !error && (
        <p className="text-xs text-muted-foreground">{help}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};
