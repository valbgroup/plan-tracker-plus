import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { FormInput } from "../FormInput";
import { FormTextarea } from "../FormTextarea";
import { FormSelect } from "../FormSelect";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  plan: string;
  status: string;
  mrr: string;
  users: number;
  phone?: string;
  website?: string;
  address?: string;
  industry?: string;
}

interface AddCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (customer: Partial<Customer>) => void;
}

interface EditCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onSave?: (customer: Customer) => void;
}

interface DeleteCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  onDelete?: (id: string) => void;
}

const initialFormData = {
  name: '',
  contactPerson: '',
  email: '',
  phone: '',
  website: '',
  address: '',
  status: 'Active',
  plan: 'Starter',
  industry: 'Tech'
};

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Trial', label: 'Trial' },
  { value: 'Churned', label: 'Churned' }
];

const planOptions = [
  { value: 'Starter', label: 'Starter' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Enterprise', label: 'Enterprise' }
];

const industryOptions = [
  { value: 'Tech', label: 'Technology' },
  { value: 'Finance', label: 'Finance' },
  { value: 'Healthcare', label: 'Healthcare' },
  { value: 'Retail', label: 'Retail' },
  { value: 'Other', label: 'Other' }
];

export const AddCustomerModal = ({ isOpen, onClose, onAdd }: AddCustomerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
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
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    onAdd?.({
      id: `${Date.now()}`,
      name: formData.name,
      email: formData.email,
      plan: formData.plan,
      status: formData.status,
      mrr: '$0',
      users: 1
    });
    
    toast({
      title: "Customer added",
      description: `${formData.name} has been added successfully.`
    });
    setFormData(initialFormData);
    onClose();
  };

  const handleClose = () => {
    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add Customer"
      subtitle="Create a new customer account"
      onClose={handleClose}
      size="lg"
      actions={[
        { label: 'Cancel', onClick: handleClose, variant: 'outline' },
        { label: 'Save Customer', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            error={errors.name}
          />
          <FormInput
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Enter contact name"
            required
            error={errors.contactPerson}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@company.com"
            required
            error={errors.email}
          />
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
            required
            error={errors.phone}
          />
        </div>

        <FormInput
          label="Website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://company.com"
        />

        <FormTextarea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter company address"
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onValueChange={handleSelectChange('status')}
            options={statusOptions}
          />
          <FormSelect
            label="Plan"
            name="plan"
            value={formData.plan}
            onValueChange={handleSelectChange('plan')}
            options={planOptions}
          />
          <FormSelect
            label="Industry"
            name="industry"
            value={formData.industry}
            onValueChange={handleSelectChange('industry')}
            options={industryOptions}
          />
        </div>
      </div>
    </Modal>
  );
};

export const EditCustomerModal = ({ isOpen, onClose, customer, onSave }: EditCustomerModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name || '',
        contactPerson: '',
        email: customer.email || '',
        phone: '',
        website: '',
        address: '',
        status: customer.status || 'Active',
        plan: customer.plan || 'Starter',
        industry: 'Tech'
      });
    }
  }, [customer]);

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
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate() || !customer) return;
    
    onSave?.({
      ...customer,
      name: formData.name,
      email: formData.email,
      plan: formData.plan,
      status: formData.status
    });
    
    toast({
      title: "Customer updated",
      description: `${formData.name} has been updated successfully.`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Customer"
      subtitle={customer?.name}
      onClose={onClose}
      size="lg"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Save Changes', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Company Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            error={errors.name}
          />
          <FormInput
            label="Contact Person"
            name="contactPerson"
            value={formData.contactPerson}
            onChange={handleChange}
            placeholder="Enter contact name"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@company.com"
            required
            error={errors.email}
          />
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 (555) 000-0000"
          />
        </div>

        <FormInput
          label="Website"
          name="website"
          type="url"
          value={formData.website}
          onChange={handleChange}
          placeholder="https://company.com"
        />

        <FormTextarea
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Enter company address"
          rows={2}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormSelect
            label="Status"
            name="status"
            value={formData.status}
            onValueChange={handleSelectChange('status')}
            options={statusOptions}
          />
          <FormSelect
            label="Plan"
            name="plan"
            value={formData.plan}
            onValueChange={handleSelectChange('plan')}
            options={planOptions}
          />
          <FormSelect
            label="Industry"
            name="industry"
            value={formData.industry}
            onValueChange={handleSelectChange('industry')}
            options={industryOptions}
          />
        </div>
      </div>
    </Modal>
  );
};

export const DeleteCustomerModal = ({ isOpen, onClose, customer, onDelete }: DeleteCustomerModalProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (!customer) return;
    onDelete?.(customer.id);
    toast({
      title: "Customer deleted",
      description: `${customer.name} has been deleted.`,
      variant: "destructive"
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete Customer"
      onClose={onClose}
      size="sm"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Delete', onClick: handleDelete, variant: 'destructive' }
      ]}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-foreground">{customer?.name}</span>?
        </p>
        <p className="text-sm text-destructive">
          This action cannot be undone. All associated data will be permanently removed.
        </p>
      </div>
    </Modal>
  );
};
