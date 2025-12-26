import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, History } from "lucide-react";

const mockAuditLogs = [
  { id: "1", action: "User Login", user: "john@techcorp.com", ip: "192.168.1.1", timestamp: "2025-12-26 14:32:15", status: "Success" },
  { id: "2", action: "License Generated", user: "sarah@lightpro.com", ip: "10.0.0.45", timestamp: "2025-12-26 14:28:03", status: "Success" },
  { id: "3", action: "Customer Created", user: "mike@lightpro.com", ip: "10.0.0.32", timestamp: "2025-12-26 14:15:42", status: "Success" },
  { id: "4", action: "Settings Updated", user: "john@techcorp.com", ip: "192.168.1.1", timestamp: "2025-12-26 13:55:21", status: "Success" },
  { id: "5", action: "Failed Login", user: "unknown@test.com", ip: "203.45.67.89", timestamp: "2025-12-26 13:42:08", status: "Failed" },
  { id: "6", action: "Promotion Created", user: "emily@lightpro.com", ip: "10.0.0.28", timestamp: "2025-12-26 12:30:15", status: "Success" },
];

const AdminAuditLogPage = () => {
  return (
    <PageContainer
      title="Audit Log"
      description="Track all administrative actions"
      actions={
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Activity Log
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search logs..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action</TableHead>
                <TableHead>User</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockAuditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.action}</TableCell>
                  <TableCell>{log.user}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                  <TableCell className="text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                      {log.status}
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

export default AdminAuditLogPage;
