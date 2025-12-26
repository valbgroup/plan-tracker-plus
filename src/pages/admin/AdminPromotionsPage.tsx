import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag, Plus } from "lucide-react";

const mockPromotions = [
  { id: "NEWYEAR25", discount: "25%", type: "Percentage", valid: "2025-01-01 - 2025-01-31", uses: 234, status: "Active" },
  { id: "ENTERPRISE50", discount: "$500", type: "Fixed", valid: "2025-01-01 - 2025-12-31", uses: 45, status: "Active" },
  { id: "TRIAL30", discount: "30 days", type: "Extended Trial", valid: "Always", uses: 892, status: "Active" },
  { id: "BLACKFRIDAY", discount: "40%", type: "Percentage", valid: "2024-11-29 - 2024-11-30", uses: 1205, status: "Expired" },
];

const AdminPromotionsPage = () => {
  return (
    <PageContainer
      title="Promotions"
      description="Manage discount codes and promotional campaigns"
      actions={
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Promotion
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Active Promotions", value: "8" },
          { label: "Total Redemptions", value: "2,376" },
          { label: "Revenue Impact", value: "-$45,230" },
          { label: "Conversion Boost", value: "+32%" },
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
            <Tag className="h-5 w-5" />
            All Promotions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Valid Period</TableHead>
                <TableHead>Uses</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPromotions.map((promo) => (
                <TableRow key={promo.id}>
                  <TableCell className="font-mono font-medium">{promo.id}</TableCell>
                  <TableCell>{promo.discount}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{promo.type}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{promo.valid}</TableCell>
                  <TableCell>{promo.uses}</TableCell>
                  <TableCell>
                    <Badge variant={promo.status === "Active" ? "default" : "secondary"}>
                      {promo.status}
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

export default AdminPromotionsPage;
