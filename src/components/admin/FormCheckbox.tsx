import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface FormCheckboxProps {
  label: string;
  name: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  help?: string;
  disabled?: boolean;
  className?: string;
}

export const FormCheckbox = ({
  label,
  name,
  checked,
  onCheckedChange,
  help,
  disabled = false,
  className
}: FormCheckboxProps) => {
  return (
    <div className={cn("flex items-start space-x-3", className)}>
      <Checkbox
        id={name}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        className="mt-0.5"
      />
      <div className="space-y-1">
        <Label htmlFor={name} className="text-sm font-medium cursor-pointer">
          {label}
        </Label>
        {help && (
          <p className="text-xs text-muted-foreground">{help}</p>
        )}
      </div>
    </div>
  );
};
