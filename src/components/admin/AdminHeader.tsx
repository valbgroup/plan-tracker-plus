import { useState } from "react";
import { Bell, Search, User, Menu, RefreshCw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  actions?: React.ReactNode;
  showDateRange?: boolean;
  showRefresh?: boolean;
  onRefresh?: () => void;
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export function AdminHeader({
  title,
  actions,
  showDateRange = false,
  showRefresh = false,
  onRefresh,
  onMenuClick,
  showMobileMenu = false,
}: AdminHeaderProps) {
  const [dateRange, setDateRange] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const notificationCount = 3;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-card border-b border-border">
      {/* Left section */}
      <div className="flex items-center gap-4">
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      {/* Center/Right section */}
      <div className="flex items-center gap-3">
        {/* Search - hidden on mobile */}
        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-64 bg-secondary/50"
          />
        </div>

        {/* Date Range */}
        {showDateRange && (
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32 hidden sm:flex">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Refresh */}
        {showRefresh && (
          <Button variant="outline" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}

        {/* Custom Actions */}
        {actions}

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <span className="font-medium">New customer signup</span>
              <span className="text-xs text-muted-foreground">TechCorp Inc. just signed up</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <span className="font-medium">License expiring soon</span>
              <span className="text-xs text-muted-foreground">Acme Corp license expires in 7 days</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1">
              <span className="font-medium">Critical support ticket</span>
              <span className="text-xs text-muted-foreground">Ticket T004 marked as critical</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span>Admin User</span>
                <span className="text-xs text-muted-foreground font-normal">admin@lightpro.com</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile Settings</DropdownMenuItem>
            <DropdownMenuItem>Help & Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default AdminHeader;
