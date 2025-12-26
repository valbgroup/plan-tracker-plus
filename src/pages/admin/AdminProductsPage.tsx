import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, Plus, Edit } from "lucide-react";

const mockProducts = [
  { 
    id: "1", 
    name: "Starter Plan", 
    price: "$49/mo", 
    features: ["5 projects", "2 users", "Basic reports"],
    status: "Active",
    subscribers: 1245
  },
  { 
    id: "2", 
    name: "Professional Plan", 
    price: "$149/mo", 
    features: ["25 projects", "10 users", "Advanced analytics", "API access"],
    status: "Active",
    subscribers: 1102
  },
  { 
    id: "3", 
    name: "Enterprise Plan", 
    price: "Custom", 
    features: ["Unlimited projects", "Unlimited users", "Custom integrations", "Dedicated support"],
    status: "Active",
    subscribers: 500
  },
];

const AdminProductsPage = () => {
  return (
    <PageContainer
      title="Products"
      description="Manage subscription plans and pricing"
      actions={
        <Button size="sm">
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
                <Button variant="outline" size="sm" className="w-full mt-4">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
};

export default AdminProductsPage;
