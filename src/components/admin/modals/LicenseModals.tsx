import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { FormInput } from "../FormInput";
import { FormSelect } from "../FormSelect";
import { FormCheckbox } from "../FormCheckbox";
import { useToast } from "@/hooks/use-toast";
import { format, addYears } from "date-fns";

interface License {
  id: string;
  customer: string;
  type: string;
  seats: number;
  used: number;
  expires: string;
  status: string;
}

interface AddLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (license: Partial<License>) => void;
}

interface EditLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  onSave?: (license: License) => void;
}

interface RenewLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  onRenew?: (license: License) => void;
}

interface DeleteLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  onDelete?: (id: string) => void;
}

const typeOptions = [
  { value: 'Trial', label: 'Trial' },
  { value: 'Starter', label: 'Starter' },
  { value: 'Professional', label: 'Professional' },
  { value: 'Enterprise', label: 'Enterprise' }
];

const durationOptions = [
  { value: '1', label: '1 Year' },
  { value: '2', label: '2 Years' },
  { value: '3', label: '3 Years' }
];

const customerOptions = [
  { value: 'TechCorp Inc.', label: 'TechCorp Inc.' },
  { value: 'GlobalMedia Ltd.', label: 'GlobalMedia Ltd.' },
  { value: 'StartupXYZ', label: 'StartupXYZ' },
  { value: 'Enterprise Co.', label: 'Enterprise Co.' },
  { value: 'SmallBiz LLC', label: 'SmallBiz LLC' }
];

export const AddLicenseModal = ({ isOpen, onClose, onAdd }: AddLicenseModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customer: '',
    type: 'Starter',
    seats: '5',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    duration: '1',
    autoRenew: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const expiryDate = formData.startDate 
    ? format(addYears(new Date(formData.startDate), parseInt(formData.duration)), 'yyyy-MM-dd')
    : '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    if (!formData.customer) newErrors.customer = 'Customer is required';
    if (!formData.seats || parseInt(formData.seats) < 1) newErrors.seats = 'At least 1 seat required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    onAdd?.({
      id: `LIC-${Date.now().toString().slice(-3)}`,
      customer: formData.customer,
      type: formData.type,
      seats: parseInt(formData.seats),
      used: 0,
      expires: expiryDate,
      status: 'Active'
    });
    
    toast({
      title: "License generated",
      description: `New ${formData.type} license created for ${formData.customer}.`
    });
    onClose();
  };

  const handleClose = () => {
    setFormData({
      customer: '',
      type: 'Starter',
      seats: '5',
      startDate: format(new Date(), 'yyyy-MM-dd'),
      duration: '1',
      autoRenew: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Generate License"
      subtitle="Create a new license key"
      onClose={handleClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: handleClose, variant: 'outline' },
        { label: 'Generate License', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="License Type"
            name="type"
            value={formData.type}
            onValueChange={handleSelectChange('type')}
            options={typeOptions}
          />
          <FormInput
            label="Seats"
            name="seats"
            type="number"
            value={formData.seats}
            onChange={handleChange}
            required
            error={errors.seats}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
          />
          <FormSelect
            label="Duration"
            name="duration"
            value={formData.duration}
            onValueChange={handleSelectChange('duration')}
            options={durationOptions}
          />
        </div>

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Expiry Date:</span>
            <span className="font-medium">{expiryDate}</span>
          </div>
        </div>

        <FormCheckbox
          label="Auto Renewal"
          name="autoRenew"
          checked={formData.autoRenew}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, autoRenew: checked }))}
          help="Automatically renew this license before expiry"
        />
      </div>
    </Modal>
  );
};

export const EditLicenseModal = ({ isOpen, onClose, license, onSave }: EditLicenseModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: 'Starter',
    seats: '5',
    expires: ''
  });

  useEffect(() => {
    if (license) {
      setFormData({
        type: license.type,
        seats: license.seats.toString(),
        expires: license.expires
      });
    }
  }, [license]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!license) return;
    
    onSave?.({
      ...license,
      type: formData.type,
      seats: parseInt(formData.seats),
      expires: formData.expires
    });
    
    toast({
      title: "License updated",
      description: `License ${license.id} has been updated.`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Edit License"
      subtitle={license?.id}
      onClose={onClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Save Changes', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Customer:</span>
            <span className="font-medium">{license?.customer}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="License Type"
            name="type"
            value={formData.type}
            onValueChange={handleSelectChange('type')}
            options={typeOptions}
          />
          <FormInput
            label="Seats"
            name="seats"
            type="number"
            value={formData.seats}
            onChange={handleChange}
          />
        </div>

        <FormInput
          label="Expiry Date"
          name="expires"
          type="date"
          value={formData.expires}
          onChange={handleChange}
        />
      </div>
    </Modal>
  );
};

export const RenewLicenseModal = ({ isOpen, onClose, license, onRenew }: RenewLicenseModalProps) => {
  const { toast } = useToast();
  const [duration, setDuration] = useState('1');

  const newExpiry = license?.expires
    ? format(addYears(new Date(license.expires), parseInt(duration)), 'yyyy-MM-dd')
    : '';

  const handleSubmit = () => {
    if (!license) return;
    
    onRenew?.({
      ...license,
      expires: newExpiry,
      status: 'Active'
    });
    
    toast({
      title: "License renewed",
      description: `License ${license.id} has been renewed until ${newExpiry}.`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Renew License"
      subtitle={license?.id}
      onClose={onClose}
      size="sm"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Renew License', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <div className="p-3 bg-muted rounded-lg space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Customer:</span>
            <span className="font-medium">{license?.customer}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Current Expiry:</span>
            <span className="font-medium">{license?.expires}</span>
          </div>
        </div>

        <FormSelect
          label="Renewal Duration"
          name="duration"
          value={duration}
          onValueChange={setDuration}
          options={durationOptions}
        />

        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">New Expiry Date:</span>
            <span className="font-medium text-primary">{newExpiry}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const DeleteLicenseModal = ({ isOpen, onClose, license, onDelete }: DeleteLicenseModalProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (!license) return;
    onDelete?.(license.id);
    toast({
      title: "License deleted",
      description: `License ${license.id} has been deleted.`,
      variant: "destructive"
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete License"
      onClose={onClose}
      size="sm"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Delete', onClick: handleDelete, variant: 'destructive' }
      ]}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete license <span className="font-mono font-medium text-foreground">{license?.id}</span>?
        </p>
        <p className="text-sm text-destructive">
          This will immediately revoke access for {license?.customer}.
        </p>
      </div>
    </Modal>
  );
};
