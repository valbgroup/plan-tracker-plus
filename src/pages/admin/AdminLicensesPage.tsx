import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

const mockLicenses = [
  { id: "LIC-001", customer: "TechCorp Inc.", type: "Enterprise", seats: 50, used: 45, expires: "2026-01-15", status: "Active" },
  { id: "LIC-002", customer: "GlobalMedia Ltd.", type: "Professional", seats: 15, used: 12, expires: "2025-06-20", status: "Active" },
  { id: "LIC-003", customer: "StartupXYZ", type: "Trial", seats: 5, used: 3, expires: "2025-01-10", status: "Expiring" },
  { id: "LIC-004", customer: "Enterprise Co.", type: "Enterprise", seats: 150, used: 120, expires: "2026-03-01", status: "Active" },
  { id: "LIC-005", customer: "SmallBiz LLC", type: "Starter", seats: 5, used: 0, expires: "2024-12-01", status: "Expired" },
];

const AdminLicensesPage = () => {
  return (
    <PageContainer
      title="Licenses"
      description="Manage license keys and subscriptions"
      actions={
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Generate License
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Total Licenses", value: "4,231" },
          { label: "Active", value: "3,892" },
          { label: "Expiring Soon", value: "127" },
          { label: "Expired", value: "212" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            License Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>License ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Seats</TableHead>
                <TableHead>Used</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLicenses.map((license) => (
                <TableRow key={license.id}>
                  <TableCell className="font-mono text-sm">{license.id}</TableCell>
                  <TableCell>{license.customer}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{license.type}</Badge>
                  </TableCell>
                  <TableCell>{license.seats}</TableCell>
                  <TableCell>{license.used}</TableCell>
                  <TableCell>{license.expires}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        license.status === "Active" ? "default" : 
                        license.status === "Expiring" ? "secondary" : "destructive"
                      }
                    >
                      {license.status}
                    </Badge>
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

export default AdminLicensesPage;
