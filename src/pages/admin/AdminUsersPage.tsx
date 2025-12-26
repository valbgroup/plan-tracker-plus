import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";
import { AddUserModal, EditUserModal, DeleteUserModal } from "@/components/admin/modals";

const mockUsers = [
  { id: "1", name: "John Smith", email: "john@techcorp.com", role: "Admin", department: "IT", status: "Active", lastLogin: "2 hours ago", twoFAEnabled: true },
  { id: "2", name: "Sarah Johnson", email: "sarah@lightpro.com", role: "Admin", department: "Sales", status: "Active", lastLogin: "1 day ago", twoFAEnabled: true },
  { id: "3", name: "Mike Chen", email: "mike@lightpro.com", role: "Support", department: "Support", status: "Active", lastLogin: "3 hours ago", twoFAEnabled: false },
  { id: "4", name: "Emily Davis", email: "emily@lightpro.com", role: "Manager", department: "Sales", status: "Active", lastLogin: "5 mins ago", twoFAEnabled: true },
  { id: "5", name: "Tom Wilson", email: "tom@lightpro.com", role: "Support", department: "Support", status: "Inactive", lastLogin: "2 weeks ago", twoFAEnabled: false },
];

const AdminUsersPage = () => {
  const [modals, setModals] = useState({
    add: false,
    edit: false,
    delete: false,
  });
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAddModal = () => setModals({ ...modals, add: true });
  const closeAddModal = () => setModals({ ...modals, add: false });

  const openEditModal = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setModals({ ...modals, edit: true });
  };
  const closeEditModal = () => setModals({ ...modals, edit: false });

  const openDeleteModal = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setModals({ ...modals, delete: true });
  };
  const closeDeleteModal = () => setModals({ ...modals, delete: false });

  return (
    <PageContainer
      title="Admin Users"
      description="Manage platform administrators and staff"
      actions={
        <Button size="sm" onClick={openAddModal}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Staff Members</CardTitle>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search users..." 
                  className="pl-9 w-64" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.role === "Admin" ? "default" : "secondary"}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.department}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditModal(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => openDeleteModal(user)}
                      >
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

      {/* Modals */}
      <AddUserModal isOpen={modals.add} onClose={closeAddModal} />
      <EditUserModal 
        isOpen={modals.edit} 
        onClose={closeEditModal} 
        user={selectedUser} 
      />
      <DeleteUserModal 
        isOpen={modals.delete} 
        onClose={closeDeleteModal} 
        user={selectedUser} 
      />
    </PageContainer>
  );
};

export default AdminUsersPage;
