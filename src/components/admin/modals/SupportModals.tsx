import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { FormInput } from "../FormInput";
import { FormTextarea } from "../FormTextarea";
import { FormSelect } from "../FormSelect";
import { useToast } from "@/hooks/use-toast";

interface Ticket {
  id: string;
  subject: string;
  customer: string;
  priority: string;
  status: string;
  created: string;
  description?: string;
  assignee?: string;
}

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (ticket: Partial<Ticket>) => void;
}

interface AssignTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onAssign?: (ticket: Ticket) => void;
}

interface CloseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onCloseTicket?: (ticket: Ticket) => void;
}

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' }
];

const categoryOptions = [
  { value: 'Bug', label: 'Bug Report' },
  { value: 'Feature', label: 'Feature Request' },
  { value: 'Billing', label: 'Billing Issue' },
  { value: 'Other', label: 'Other' }
];

const customerOptions = [
  { value: 'TechCorp Inc.', label: 'TechCorp Inc.' },
  { value: 'GlobalMedia Ltd.', label: 'GlobalMedia Ltd.' },
  { value: 'StartupXYZ', label: 'StartupXYZ' },
  { value: 'Enterprise Co.', label: 'Enterprise Co.' },
  { value: 'SmallBiz LLC', label: 'SmallBiz LLC' }
];

const assigneeOptions = [
  { value: 'unassigned', label: 'Unassigned' },
  { value: 'John Smith', label: 'John Smith' },
  { value: 'Sarah Johnson', label: 'Sarah Johnson' },
  { value: 'Mike Chen', label: 'Mike Chen' }
];

const resolutionOptions = [
  { value: 'Resolved', label: 'Resolved' },
  { value: 'Duplicate', label: 'Duplicate' },
  { value: 'Invalid', label: 'Invalid' },
  { value: 'Cannot Fix', label: 'Cannot Fix' }
];

export const CreateTicketModal = ({ isOpen, onClose, onAdd }: CreateTicketModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: '',
    customer: '',
    priority: 'Medium',
    category: 'Other',
    description: '',
    assignee: 'unassigned'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    onAdd?.({
      id: `TKT-${Date.now().toString().slice(-3)}`,
      subject: formData.subject,
      customer: formData.customer,
      priority: formData.priority,
      status: 'Open',
      created: 'Just now',
      description: formData.description,
      assignee: formData.assignee === 'unassigned' ? undefined : formData.assignee
    });
    
    toast({
      title: "Ticket created",
      description: `Support ticket has been created.`
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      subject: '',
      customer: '',
      priority: 'Medium',
      category: 'Other',
      description: '',
      assignee: 'unassigned'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Create Ticket"
      subtitle="Open a new support ticket"
      onClose={handleClose}
      size="lg"
      actions={[
        { label: 'Cancel', onClick: handleClose, variant: 'outline' },
        { label: 'Create Ticket', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <FormInput
          label="Subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          placeholder="Brief description of the issue"
          required
          error={errors.subject}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Customer"
            name="customer"
            value={formData.customer}
            onValueChange={handleSelectChange('customer')}
            options={customerOptions}
            placeholder="Select customer"
            required
            error={errors.customer}
          />
          <FormSelect
            label="Priority"
            name="priority"
            value={formData.priority}
            onValueChange={handleSelectChange('priority')}
            options={priorityOptions}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onValueChange={handleSelectChange('category')}
            options={categoryOptions}
          />
          <FormSelect
            label="Assign To"
            name="assignee"
            value={formData.assignee}
            onValueChange={handleSelectChange('assignee')}
            options={assigneeOptions}
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Detailed description of the issue..."
          rows={5}
          required
          error={errors.description}
        />
      </div>
    </Modal>
  );
};

export const AssignTicketModal = ({ isOpen, onClose, ticket, onAssign }: AssignTicketModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    assignee: 'unassigned',
    note: ''
  });

  useEffect(() => {
    if (ticket) {
      setFormData({
        assignee: ticket.assignee || 'unassigned',
        note: ''
      });
    }
  }, [ticket]);

  const handleSubmit = () => {
    if (!ticket) return;
    
    onAssign?.({
      ...ticket,
      assignee: formData.assignee === 'unassigned' ? undefined : formData.assignee,
      status: 'In Progress'
    });
    
    toast({
      title: "Ticket assigned",
      description: formData.assignee !== 'unassigned' 
        ? `Ticket assigned to ${formData.assignee}.`
        : 'Ticket unassigned.'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Assign Ticket"
      subtitle={ticket?.id}
      onClose={onClose}
      size="sm"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Assign', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">{ticket?.subject}</p>
          <p className="text-xs text-muted-foreground mt-1">{ticket?.customer}</p>
        </div>

        <FormSelect
          label="Assign To"
          name="assignee"
          value={formData.assignee}
          onValueChange={(value) => setFormData(prev => ({ ...prev, assignee: value }))}
          options={assigneeOptions}
        />

        <FormTextarea
          label="Add Note (Optional)"
          name="note"
          value={formData.note}
          onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
          placeholder="Add a note about this assignment..."
          rows={3}
        />
      </div>
    </Modal>
  );
};

export const CloseTicketModal = ({ isOpen, onClose, ticket, onCloseTicket }: CloseTicketModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    resolution: '',
    category: 'Resolved'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.resolution.trim()) newErrors.resolution = 'Resolution is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !ticket) return;
    
    onCloseTicket?.({
      ...ticket,
      status: 'Resolved'
    });
    
    toast({
      title: "Ticket closed",
      description: `Ticket ${ticket.id} has been resolved.`
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      resolution: '',
      category: 'Resolved'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Close Ticket"
      subtitle={ticket?.id}
      onClose={handleClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: handleClose, variant: 'outline' },
        { label: 'Close Ticket', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm font-medium">{ticket?.subject}</p>
          <p className="text-xs text-muted-foreground mt-1">{ticket?.customer}</p>
        </div>

        <FormSelect
          label="Resolution Category"
          name="category"
          value={formData.category}
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
          options={resolutionOptions}
        />

        <FormTextarea
          label="Resolution"
          name="resolution"
          value={formData.resolution}
          onChange={(e) => {
            setFormData(prev => ({ ...prev, resolution: e.target.value }));
            if (errors.resolution) setErrors(prev => ({ ...prev, resolution: '' }));
          }}
          placeholder="Describe how the issue was resolved..."
          rows={4}
          required
          error={errors.resolution}
        />
      </div>
    </Modal>
  );
};
