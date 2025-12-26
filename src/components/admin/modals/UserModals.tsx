import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { FormInput } from "../FormInput";
import { FormSelect } from "../FormSelect";
import { FormCheckbox } from "../FormCheckbox";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
  department?: string;
}

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (user: Partial<User>) => void;
}

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave?: (user: User) => void;
}

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onDelete?: (id: string) => void;
}

const roleOptions = [
  { value: 'Super Admin', label: 'Super Admin' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Support', label: 'Support' },
  { value: 'Sales', label: 'Sales' },
  { value: 'User', label: 'User' }
];

const departmentOptions = [
  { value: 'IT', label: 'IT' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Other', label: 'Other' }
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' }
];

export const AddUserModal = ({ isOpen, onClose, onAdd }: AddUserModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    department: 'Other',
    status: 'Active',
    require2FA: true,
    sendInvite: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
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
      role: formData.role,
      status: formData.status,
      lastLogin: 'Never',
      department: formData.department
    });
    
    toast({
      title: "User added",
      description: formData.sendInvite 
        ? `Invitation sent to ${formData.email}.`
        : `${formData.name} has been added.`
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      role: 'User',
      department: 'Other',
      status: 'Active',
      require2FA: true,
      sendInvite: true
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add User"
      subtitle="Create a new admin user"
      onClose={handleClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: handleClose, variant: 'outline' },
        { label: 'Add User', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
          error={errors.name}
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@company.com"
          required
          error={errors.email}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Role"
            name="role"
            value={formData.role}
            onValueChange={handleSelectChange('role')}
            options={roleOptions}
          />
          <FormSelect
            label="Department"
            name="department"
            value={formData.department}
            onValueChange={handleSelectChange('department')}
            options={departmentOptions}
          />
        </div>

        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onValueChange={handleSelectChange('status')}
          options={statusOptions}
        />

        <div className="space-y-3 pt-2">
          <FormCheckbox
            label="Require 2FA"
            name="require2FA"
            checked={formData.require2FA}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, require2FA: checked }))}
            help="User must set up two-factor authentication"
          />
          <FormCheckbox
            label="Send Invitation Email"
            name="sendInvite"
            checked={formData.sendInvite}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, sendInvite: checked }))}
            help="Send setup instructions to the user's email"
          />
        </div>
      </div>
    </Modal>
  );
};

export const EditUserModal = ({ isOpen, onClose, user, onSave }: EditUserModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'User',
    department: 'Other',
    status: 'Active'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department || 'Other',
        status: user.status
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!user) return;
    
    onSave?.({
      ...user,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      department: formData.department
    });
    
    toast({
      title: "User updated",
      description: `${formData.name} has been updated.`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Edit User"
      subtitle={user?.email}
      onClose={onClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Save Changes', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <FormInput
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter full name"
          required
        />

        <FormInput
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="user@company.com"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Role"
            name="role"
            value={formData.role}
            onValueChange={handleSelectChange('role')}
            options={roleOptions}
          />
          <FormSelect
            label="Department"
            name="department"
            value={formData.department}
            onValueChange={handleSelectChange('department')}
            options={departmentOptions}
          />
        </div>

        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onValueChange={handleSelectChange('status')}
          options={statusOptions}
        />

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Login:</span>
            <span className="font-medium">{user?.lastLogin}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const DeleteUserModal = ({ isOpen, onClose, user, onDelete }: DeleteUserModalProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (!user) return;
    onDelete?.(user.id);
    toast({
      title: "User deleted",
      description: `${user.name} has been removed.`,
      variant: "destructive"
    });
    onClose();
  };

  const isAdmin = user?.role === 'Super Admin' || user?.role === 'Admin';

  return (
    <Modal
      isOpen={isOpen}
      title="Delete User"
      onClose={onClose}
      size="sm"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Delete', onClick: handleDelete, variant: 'destructive' }
      ]}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-foreground">{user?.name}</span>?
        </p>
        {isAdmin && (
          <p className="text-sm text-destructive">
            Warning: This user has admin privileges. Make sure another admin exists.
          </p>
        )}
      </div>
    </Modal>
  );
};
