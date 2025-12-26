import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Download, History, Eye } from "lucide-react";
import { AuditDetailsModal } from "@/components/admin/modals";

const mockAuditLogs = [
  { id: "1", action: "User Login", user: "john@techcorp.com", ip: "192.168.1.1", timestamp: "2025-12-26 14:32:15", status: "Success", target: "Auth System", details: "Successful login via email/password", oldValue: null, newValue: null },
  { id: "2", action: "License Generated", user: "sarah@lightpro.com", ip: "10.0.0.45", timestamp: "2025-12-26 14:28:03", status: "Success", target: "License LIC-2024-007", details: "New Enterprise license created for TechCorp Inc.", oldValue: null, newValue: "Enterprise Plan - 50 seats" },
  { id: "3", action: "Customer Created", user: "mike@lightpro.com", ip: "10.0.0.32", timestamp: "2025-12-26 14:15:42", status: "Success", target: "Customer StartupXYZ", details: "New customer account created", oldValue: null, newValue: "StartupXYZ - Basic Plan" },
  { id: "4", action: "Settings Updated", user: "john@techcorp.com", ip: "192.168.1.1", timestamp: "2025-12-26 13:55:21", status: "Success", target: "System Settings", details: "Email notification settings changed", oldValue: "Notifications: Disabled", newValue: "Notifications: Enabled" },
  { id: "5", action: "Failed Login", user: "unknown@test.com", ip: "203.45.67.89", timestamp: "2025-12-26 13:42:08", status: "Failed", target: "Auth System", details: "Invalid password attempt (3rd try)", oldValue: null, newValue: null },
  { id: "6", action: "Promotion Created", user: "emily@lightpro.com", ip: "10.0.0.28", timestamp: "2025-12-26 12:30:15", status: "Success", target: "Promotion PROMO-WINTER25", details: "25% discount promotion created", oldValue: null, newValue: "25% off - Valid until Jan 31" },
];

const AdminAuditLogPage = () => {
  const [modals, setModals] = useState({
    details: false,
  });
  const [selectedEntry, setSelectedEntry] = useState<typeof mockAuditLogs[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState("all");

  const filteredLogs = mockAuditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.target.toLowerCase().includes(searchTerm.toLowerCase());
    // Date range filtering would be implemented here
    return matchesSearch;
  });

  const openDetailsModal = (entry: typeof mockAuditLogs[0]) => {
    setSelectedEntry(entry);
    setModals({ ...modals, details: true });
  };
  const closeDetailsModal = () => setModals({ ...modals, details: false });

  const handleDownloadCSV = () => {
    // Mock CSV download
    const csvContent = mockAuditLogs.map(log => 
      `${log.timestamp},${log.user},${log.action},${log.target},${log.status}`
    ).join('\n');
    const blob = new Blob([`Timestamp,User,Action,Target,Status\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'audit-log.csv';
    a.click();
  };

  return (
    <PageContainer
      title="Audit Log"
      description="Track all administrative actions"
      actions={
        <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity Log
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search logs..." 
                  className="pl-9 w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="text-muted-foreground">{log.target}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openDetailsModal(log)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <AuditDetailsModal 
        isOpen={modals.details} 
        onClose={closeDetailsModal} 
        log={selectedEntry} 
      />
    </PageContainer>
  );
};

export default AdminAuditLogPage;
