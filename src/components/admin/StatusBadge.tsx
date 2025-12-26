import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 
  | "active" 
  | "inactive" 
  | "expiring" 
  | "expired" 
  | "pending"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "open"
  | "in_progress"
  | "closed"
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "basic"
  | "pro"
  | "enterprise"
  | "admin"
  | "manager"
  | "support"
  | "user";

interface StatusBadgeProps {
  status: StatusType;
  text?: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  // Status types
  active: "bg-success/20 text-success border-success/30",
  inactive: "bg-muted text-muted-foreground border-muted-foreground/30",
  expiring: "bg-warning/20 text-warning border-warning/30",
  expired: "bg-destructive/20 text-destructive border-destructive/30",
  pending: "bg-warning/20 text-warning border-warning/30",
  
  // Result types
  success: "bg-success/20 text-success border-success/30",
  warning: "bg-warning/20 text-warning border-warning/30",
  error: "bg-destructive/20 text-destructive border-destructive/30",
  info: "bg-info/20 text-info border-info/30",
  
  // Ticket status
  open: "bg-info/20 text-info border-info/30",
  in_progress: "bg-warning/20 text-warning border-warning/30",
  closed: "bg-muted text-muted-foreground border-muted-foreground/30",
  
  // Priority
  low: "bg-muted text-muted-foreground border-muted-foreground/30",
  medium: "bg-info/20 text-info border-info/30",
  high: "bg-warning/20 text-warning border-warning/30",
  critical: "bg-destructive/20 text-destructive border-destructive/30",
  
  // License types
  basic: "bg-secondary text-secondary-foreground border-secondary",
  pro: "bg-primary/20 text-primary border-primary/30",
  enterprise: "bg-accent/20 text-accent border-accent/30",
  
  // User roles
  admin: "bg-destructive/20 text-destructive border-destructive/30",
  manager: "bg-primary/20 text-primary border-primary/30",
  support: "bg-info/20 text-info border-info/30",
  user: "bg-muted text-muted-foreground border-muted-foreground/30",
};

const statusLabels: Partial<Record<StatusType, string>> = {
  active: "Active",
  inactive: "Inactive",
  expiring: "Expiring",
  expired: "Expired",
  pending: "Pending",
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
  open: "Open",
  in_progress: "In Progress",
  closed: "Closed",
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
  basic: "Basic",
  pro: "Pro",
  enterprise: "Enterprise",
  admin: "Admin",
  manager: "Manager",
  support: "Support",
  user: "User",
};

export function StatusBadge({ status, text, className }: StatusBadgeProps) {
  const displayText = text || statusLabels[status] || status;
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border capitalize",
        statusStyles[status],
        className
      )}
    >
      {displayText}
    </Badge>
  );
}

export default StatusBadge;
