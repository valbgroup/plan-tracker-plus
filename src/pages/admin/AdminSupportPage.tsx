import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Eye } from "lucide-react";

const mockTickets = [
  { id: "TKT-001", subject: "Cannot access dashboard", customer: "TechCorp Inc.", priority: "High", status: "Open", created: "2 hours ago" },
  { id: "TKT-002", subject: "Billing question", customer: "GlobalMedia Ltd.", priority: "Medium", status: "In Progress", created: "5 hours ago" },
  { id: "TKT-003", subject: "Feature request: Export to Excel", customer: "StartupXYZ", priority: "Low", status: "Open", created: "1 day ago" },
  { id: "TKT-004", subject: "Integration help needed", customer: "Enterprise Co.", priority: "High", status: "In Progress", created: "1 day ago" },
  { id: "TKT-005", subject: "Password reset issue", customer: "SmallBiz LLC", priority: "Medium", status: "Resolved", created: "2 days ago" },
];

const AdminSupportPage = () => {
  return (
    <PageContainer
      title="Support"
      description="Manage customer support tickets"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Open Tickets", value: "23", color: "text-red-600" },
          { label: "In Progress", value: "15", color: "text-yellow-600" },
          { label: "Resolved Today", value: "42", color: "text-green-600" },
          { label: "Avg. Response Time", value: "2.4h", color: "text-blue-600" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Tickets
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tickets..." className="pl-9 w-64" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        ticket.priority === "High" ? "destructive" : 
                        ticket.priority === "Medium" ? "secondary" : "outline"
                      }
                    >
                      {ticket.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        ticket.status === "Resolved" ? "default" : 
                        ticket.status === "In Progress" ? "secondary" : "outline"
                      }
                    >
                      {ticket.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{ticket.created}</TableCell>
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

export default AdminSupportPage;
