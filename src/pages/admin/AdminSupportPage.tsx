import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, MessageSquare, Plus, UserCheck, CheckCircle } from "lucide-react";
import { CreateTicketModal, AssignTicketModal, CloseTicketModal } from "@/components/admin/modals";

const mockTickets = [
  { id: "TKT-001", subject: "Cannot access dashboard", customer: "TechCorp Inc.", priority: "High", status: "Open", created: "2 hours ago", assignedTo: "Unassigned", category: "Bug" },
  { id: "TKT-002", subject: "Billing question", customer: "GlobalMedia Ltd.", priority: "Medium", status: "In Progress", created: "5 hours ago", assignedTo: "Mike Chen", category: "Billing" },
  { id: "TKT-003", subject: "Feature request: Export to Excel", customer: "StartupXYZ", priority: "Low", status: "Open", created: "1 day ago", assignedTo: "Unassigned", category: "Feature" },
  { id: "TKT-004", subject: "Integration help needed", customer: "Enterprise Co.", priority: "High", status: "In Progress", created: "1 day ago", assignedTo: "Sarah Johnson", category: "Other" },
  { id: "TKT-005", subject: "Password reset issue", customer: "SmallBiz LLC", priority: "Medium", status: "Resolved", created: "2 days ago", assignedTo: "Tom Wilson", category: "Bug" },
];

const AdminSupportPage = () => {
  const [modals, setModals] = useState({
    create: false,
    assign: false,
    close: false,
  });
  const [selectedTicket, setSelectedTicket] = useState<typeof mockTickets[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredTickets = mockTickets.filter(ticket => {
    const matchesSearch = ticket.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openCreateModal = () => setModals({ ...modals, create: true });
  const closeCreateModal = () => setModals({ ...modals, create: false });

  const openAssignModal = (ticket: typeof mockTickets[0]) => {
    setSelectedTicket(ticket);
    setModals({ ...modals, assign: true });
  };
  const closeAssignModal = () => setModals({ ...modals, assign: false });

  const openCloseModal = (ticket: typeof mockTickets[0]) => {
    setSelectedTicket(ticket);
    setModals({ ...modals, close: true });
  };
  const closeCloseModal = () => setModals({ ...modals, close: false });

  return (
    <PageContainer
      title="Support"
      description="Manage customer support tickets"
      actions={
        <Button size="sm" onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      }
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support Tickets
            </CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search tickets..." 
                  className="pl-9 w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="All Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
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
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-mono">{ticket.id}</TableCell>
                  <TableCell className="font-medium">{ticket.subject}</TableCell>
                  <TableCell>{ticket.customer}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        ticket.priority === "High" || ticket.priority === "Critical" ? "destructive" : 
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
                  <TableCell className="text-muted-foreground">{ticket.assignedTo}</TableCell>
                  <TableCell className="text-muted-foreground">{ticket.created}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Assign"
                        onClick={() => openAssignModal(ticket)}
                      >
                        <UserCheck className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        title="Close Ticket"
                        className="text-green-600 hover:text-green-600"
                        onClick={() => openCloseModal(ticket)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modals */}
      <CreateTicketModal isOpen={modals.create} onClose={closeCreateModal} />
      <AssignTicketModal 
        isOpen={modals.assign} 
        onClose={closeAssignModal} 
        ticket={selectedTicket} 
      />
      <CloseTicketModal 
        isOpen={modals.close} 
        onClose={closeCloseModal} 
        ticket={selectedTicket} 
      />
    </PageContainer>
  );
};

export default AdminSupportPage;
