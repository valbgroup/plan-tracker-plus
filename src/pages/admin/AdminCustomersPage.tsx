import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download, Eye } from "lucide-react";

const mockCustomers = [
  { id: "1", name: "TechCorp Inc.", email: "admin@techcorp.com", plan: "Enterprise", status: "Active", mrr: "$2,500", users: 45 },
  { id: "2", name: "GlobalMedia Ltd.", email: "info@globalmedia.com", plan: "Professional", status: "Active", mrr: "$149", users: 12 },
  { id: "3", name: "StartupXYZ", email: "hello@startupxyz.io", plan: "Starter", status: "Trial", mrr: "$0", users: 3 },
  { id: "4", name: "Enterprise Co.", email: "contact@enterprise.co", plan: "Enterprise", status: "Active", mrr: "$5,000", users: 120 },
  { id: "5", name: "SmallBiz LLC", email: "owner@smallbiz.com", plan: "Starter", status: "Churned", mrr: "$0", users: 2 },
];

const AdminCustomersPage = () => {
  return (
    <PageContainer
      title="Customers"
      description="Manage customer accounts and subscriptions"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">Add Customer</Button>
        </div>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Customers</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>MRR</TableHead>
                <TableHead>Users</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>
                    <Badge variant={customer.plan === "Enterprise" ? "default" : "secondary"}>
                      {customer.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        customer.status === "Active" ? "default" : 
                        customer.status === "Trial" ? "secondary" : "destructive"
                      }
                    >
                      {customer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{customer.mrr}</TableCell>
                  <TableCell>{customer.users}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default AdminCustomersPage;
