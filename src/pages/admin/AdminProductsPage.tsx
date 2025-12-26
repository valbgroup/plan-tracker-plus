import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import { AddProductModal, EditProductModal, DeleteProductModal } from "@/components/admin/modals";

const mockProducts = [
  { 
    id: "1", 
    name: "Starter Plan", 
    price: "$49/mo", 
    category: "Software",
    description: "Perfect for small teams getting started",
    stock: 999,
    features: ["5 projects", "2 users", "Basic reports"],
    status: "Active",
    subscribers: 1245
  },
  { 
    id: "2", 
    name: "Professional Plan", 
    price: "$149/mo", 
    category: "Software",
    description: "For growing teams with advanced needs",
    stock: 999,
    features: ["25 projects", "10 users", "Advanced analytics", "API access"],
    status: "Active",
    subscribers: 1102
  },
  { 
    id: "3", 
    name: "Enterprise Plan", 
    price: "Custom", 
    category: "Service",
    description: "Full-featured solution for large organizations",
    stock: 999,
    features: ["Unlimited projects", "Unlimited users", "Custom integrations", "Dedicated support"],
    status: "Active",
    subscribers: 500
  },
];

const AdminProductsPage = () => {
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedProduct, setSelectedProduct] = useState<typeof mockProducts[0] | null>(null);

  const openAddModal = () => setModals({ ...modals, add: true });
  const closeAddModal = () => setModals({ ...modals, add: false });

  const openEditModal = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setModals({ ...modals, edit: true });
  };
  const closeEditModal = () => setModals({ ...modals, edit: false });

  const openDeleteModal = (product: typeof mockProducts[0]) => {
    setSelectedProduct(product);
    setModals({ ...modals, delete: true });
  };
  const closeDeleteModal = () => setModals({ ...modals, delete: false });

  return (
    <PageContainer
      title="Products"
      description="Manage subscription plans and pricing"
      actions={
        <Button size="sm" onClick={openAddModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        {mockProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <CardTitle>{product.name}</CardTitle>
                </div>
                <Badge variant="secondary">{product.status}</Badge>
              </div>
              <CardDescription className="text-2xl font-bold text-foreground">
                {product.price}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  {product.subscribers.toLocaleString()} active subscribers
                </div>
                <ul className="space-y-1">
                  {product.features.map((feature) => (
                    <li key={feature} className="text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 bg-primary rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => openEditModal(product)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => openDeleteModal(product)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modals */}
      <AddProductModal isOpen={modals.add} onClose={closeAddModal} />
      <EditProductModal 
        isOpen={modals.edit} 
        onClose={closeEditModal} 
        product={selectedProduct} 
      />
      <DeleteProductModal 
        isOpen={modals.delete} 
        onClose={closeDeleteModal} 
        product={selectedProduct} 
      />
    </PageContainer>
  );
};

export default AdminProductsPage;
