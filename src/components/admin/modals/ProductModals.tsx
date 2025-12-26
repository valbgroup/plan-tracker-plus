import { useState, useEffect } from "react";
import { Modal } from "../Modal";
import { FormInput } from "../FormInput";
import { FormTextarea } from "../FormTextarea";
import { FormSelect } from "../FormSelect";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: string;
  features: string[];
  status: string;
  subscribers: number;
  category?: string;
  description?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (product: Partial<Product>) => void;
}

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave?: (product: Product) => void;
}

interface DeleteProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onDelete?: (id: string) => void;
}

const categoryOptions = [
  { value: 'Software', label: 'Software' },
  { value: 'Service', label: 'Service' },
  { value: 'Add-on', label: 'Add-on' }
];

const statusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Inactive', label: 'Inactive' },
  { value: 'Coming Soon', label: 'Coming Soon' }
];

export const AddProductModal = ({ isOpen, onClose, onAdd }: AddProductModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Software',
    description: '',
    price: '',
    status: 'Active'
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
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.price.trim()) newErrors.price = 'Price is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    onAdd?.({
      id: `${Date.now()}`,
      name: formData.name,
      price: formData.price,
      features: [],
      status: formData.status,
      subscribers: 0,
      category: formData.category,
      description: formData.description
    });
    
    toast({
      title: "Product added",
      description: `${formData.name} has been added successfully.`
    });
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: '',
      category: 'Software',
      description: '',
      price: '',
      status: 'Active'
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Add Product"
      subtitle="Create a new product or plan"
      onClose={handleClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: handleClose, variant: 'outline' },
        { label: 'Add Product', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <FormInput
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
          error={errors.name}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onValueChange={handleSelectChange('category')}
            options={categoryOptions}
          />
          <FormInput
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="$99/mo"
            required
            error={errors.price}
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={3}
        />

        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onValueChange={handleSelectChange('status')}
          options={statusOptions}
        />
      </div>
    </Modal>
  );
};

export const EditProductModal = ({ isOpen, onClose, product, onSave }: EditProductModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Software',
    description: '',
    price: '',
    status: 'Active'
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category || 'Software',
        description: product.description || '',
        price: product.price,
        status: product.status
      });
    }
  }, [product]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!product) return;
    
    onSave?.({
      ...product,
      name: formData.name,
      price: formData.price,
      status: formData.status,
      category: formData.category,
      description: formData.description
    });
    
    toast({
      title: "Product updated",
      description: `${formData.name} has been updated successfully.`
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Edit Product"
      subtitle={product?.name}
      onClose={onClose}
      size="md"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Save Changes', onClick: handleSubmit }
      ]}
    >
      <div className="space-y-4">
        <FormInput
          label="Product Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter product name"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Category"
            name="category"
            value={formData.category}
            onValueChange={handleSelectChange('category')}
            options={categoryOptions}
          />
          <FormInput
            label="Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="$99/mo"
            required
          />
        </div>

        <FormTextarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter product description"
          rows={3}
        />

        <FormSelect
          label="Status"
          name="status"
          value={formData.status}
          onValueChange={handleSelectChange('status')}
          options={statusOptions}
        />

        <div className="p-3 bg-muted rounded-lg">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Subscribers:</span>
            <span className="font-medium">{product?.subscribers.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const DeleteProductModal = ({ isOpen, onClose, product, onDelete }: DeleteProductModalProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (!product) return;
    onDelete?.(product.id);
    toast({
      title: "Product deleted",
      description: `${product.name} has been deleted.`,
      variant: "destructive"
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      title="Delete Product"
      onClose={onClose}
      size="sm"
      actions={[
        { label: 'Cancel', onClick: onClose, variant: 'outline' },
        { label: 'Delete', onClick: handleDelete, variant: 'destructive' }
      ]}
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <span className="font-medium text-foreground">{product?.name}</span>?
        </p>
        {product && product.subscribers > 0 && (
          <p className="text-sm text-destructive">
            Warning: This product has {product.subscribers.toLocaleString()} active subscribers.
          </p>
        )}
      </div>
    </Modal>
  );
};
