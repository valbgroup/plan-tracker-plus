import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { AddLicenseModal, EditLicenseModal, RenewLicenseModal, DeleteLicenseModal } from "@/components/admin/modals";

const initialLicenses = [
  { id: "LIC-001", customer: "TechCorp Inc.", type: "Enterprise", seats: 50, used: 45, expires: "2026-01-15", status: "Active" },
  { id: "LIC-002", customer: "GlobalMedia Ltd.", type: "Professional", seats: 15, used: 12, expires: "2025-06-20", status: "Active" },
  { id: "LIC-003", customer: "StartupXYZ", type: "Trial", seats: 5, used: 3, expires: "2025-01-10", status: "Expiring" },
  { id: "LIC-004", customer: "Enterprise Co.", type: "Enterprise", seats: 150, used: 120, expires: "2026-03-01", status: "Active" },
  { id: "LIC-005", customer: "SmallBiz LLC", type: "Starter", seats: 5, used: 0, expires: "2024-12-01", status: "Expired" },
];

type License = typeof initialLicenses[0];

const AdminLicensesPage = () => {
  const [licenses, setLicenses] = useState(initialLicenses);
  const [modals, setModals] = useState({ add: false, edit: false, renew: false, delete: false });
  const [selectedLicense, setSelectedLicense] = useState<License | null>(null);

  const openModal = (modal: keyof typeof modals, license?: License) => {
    if (license) setSelectedLicense(license);
    setModals(prev => ({ ...prev, [modal]: true }));
  };

  const closeModal = (modal: keyof typeof modals) => {
    setModals(prev => ({ ...prev, [modal]: false }));
  };

  return (
    <PageContainer
      title="Licenses"
      description="Manage license keys and subscriptions"
      actions={
        <Button size="sm" onClick={() => openModal('add')}>
          <Plus className="h-4 w-4 mr-2" />
          Generate License
        </Button>
      }
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Total Licenses", value: licenses.length.toString() },
          { label: "Active", value: licenses.filter(l => l.status === "Active").length.toString() },
          { label: "Expiring Soon", value: licenses.filter(l => l.status === "Expiring").length.toString() },
          { label: "Expired", value: licenses.filter(l => l.status === "Expired").length.toString() },
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {licenses.map((license) => (
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
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => openModal('renew', license)}>
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openModal('edit', license)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openModal('delete', license)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddLicenseModal isOpen={modals.add} onClose={() => closeModal('add')} onAdd={(l) => setLicenses(prev => [...prev, l as License])} />
      <EditLicenseModal isOpen={modals.edit} onClose={() => closeModal('edit')} license={selectedLicense} onSave={(l) => setLicenses(prev => prev.map(x => x.id === l.id ? l : x))} />
      <RenewLicenseModal isOpen={modals.renew} onClose={() => closeModal('renew')} license={selectedLicense} onRenew={(l) => setLicenses(prev => prev.map(x => x.id === l.id ? l : x))} />
      <DeleteLicenseModal isOpen={modals.delete} onClose={() => closeModal('delete')} license={selectedLicense} onDelete={(id) => setLicenses(prev => prev.filter(x => x.id !== id))} />
    </PageContainer>
  );
};

export default AdminLicensesPage;
