import { Modal } from "../Modal";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  user: string;
  ip: string;
  timestamp: string;
  status: string;
  details?: string;
  oldValue?: string;
  newValue?: string;
  userAgent?: string;
}

interface AuditDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
}

export const AuditDetailsModal = ({ isOpen, onClose, log }: AuditDetailsModalProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    if (!log) return;
    
    const details = `
Action: ${log.action}
User: ${log.user}
IP Address: ${log.ip}
Timestamp: ${log.timestamp}
Status: ${log.status}
${log.details ? `Details: ${log.details}` : ''}
${log.oldValue ? `Old Value: ${log.oldValue}` : ''}
${log.newValue ? `New Value: ${log.newValue}` : ''}
    `.trim();
    
    navigator.clipboard.writeText(details);
    toast({
      title: "Copied",
      description: "Audit details copied to clipboard."
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Audit Log Details"
      subtitle={log?.timestamp}
      onClose={onClose}
      size="md"
      actions={[
        { label: 'Close', onClick: onClose, variant: 'outline' }
      ]}
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <Copy className="h-4 w-4 mr-2" />
            Copy Details
          </Button>
        </div>

        <div className="space-y-3">
          <DetailRow label="Action" value={log?.action || ''} />
          <DetailRow label="User" value={log?.user || ''} />
          <DetailRow label="IP Address" value={log?.ip || ''} mono />
          <DetailRow label="Timestamp" value={log?.timestamp || ''} />
          <DetailRow 
            label="Status" 
            value={log?.status || ''} 
            className={log?.status === 'Success' ? 'text-green-600' : 'text-red-600'}
          />
          
          {log?.details && (
            <DetailRow label="Details" value={log.details} />
          )}
          
          {log?.oldValue && (
            <DetailRow label="Old Value" value={log.oldValue} mono />
          )}
          
          {log?.newValue && (
            <DetailRow label="New Value" value={log.newValue} mono />
          )}
          
          {log?.userAgent && (
            <DetailRow label="User Agent" value={log.userAgent} mono className="text-xs" />
          )}
        </div>
      </div>
    </Modal>
  );
};

interface DetailRowProps {
  label: string;
  value: string;
  mono?: boolean;
  className?: string;
}

const DetailRow = ({ label, value, mono, className }: DetailRowProps) => (
  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 py-2 border-b border-border last:border-0">
    <span className="text-sm text-muted-foreground">{label}</span>
    <span className={`text-sm font-medium ${mono ? 'font-mono' : ''} ${className || ''}`}>
      {value}
    </span>
  </div>
);
