import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Search,
  Menu,
  ChevronRight,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { mockAlerts } from '@/data/mockData';
import { cn } from '@/lib/utils';

const breadcrumbMap: Record<string, string> = {
  app: 'App',
  dashboard: 'Dashboard',
  operational: 'Operational',
  tactical: 'Tactical',
  strategic: 'Strategic',
  projects: 'Projects',
  'master-data': 'Master Data',
  qualifications: 'Qualifications',
  budget: 'Budget Settings',
  locations: 'Locations',
  organization: 'Organization',
  resources: 'Resources',
  calendars: 'Calendars',
  history: 'History & Audit',
  audit: 'Audit Log',
  compliance: 'Compliance',
  settings: 'Settings',
  system: 'System',
  profile: 'Profile',
};

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useUIStore();
  const [searchOpen, setSearchOpen] = useState(false);

  // Filter out 'app' from breadcrumb display since it's just a prefix
  const pathSegments = location.pathname.split('/').filter(Boolean).filter(segment => segment !== 'app');
  const unreadAlerts = mockAlerts.filter((a) => !a.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
  };

  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="lg:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SidebarTrigger>

        {/* Breadcrumb */}
        <nav className="hidden sm:flex items-center gap-1 text-sm">
          {pathSegments.map((segment, index) => (
            <div key={segment} className="flex items-center gap-1">
              {index > 0 && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className={cn(
                  index === pathSegments.length - 1
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground cursor-pointer transition-colors'
                )}
              >
                {breadcrumbMap[segment] || segment}
              </span>
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div
          className={cn(
            'transition-all duration-300 overflow-hidden',
            searchOpen ? 'w-64' : 'w-0'
          )}
        >
          <Input
            placeholder="Search projects, tasks..."
            className="h-9 bg-secondary border-border"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>


        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadAlerts > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadAlerts}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {mockAlerts.slice(0, 4).map((alert) => (
              <DropdownMenuItem
                key={alert.id}
                className={cn(
                  'flex flex-col items-start gap-1 p-3 cursor-pointer',
                  !alert.read && 'bg-secondary/50'
                )}
              >
                <div className="flex items-center gap-2 w-full">
                  <div
                    className={cn(
                      'w-2 h-2 rounded-full',
                      alert.type === 'error' && 'bg-destructive',
                      alert.type === 'warning' && 'bg-warning',
                      alert.type === 'info' && 'bg-info',
                      alert.type === 'success' && 'bg-success'
                    )}
                  />
                  <span className="font-medium text-sm">{alert.title}</span>
                </div>
                <span className="text-xs text-muted-foreground line-clamp-1">
                  {alert.message}
                </span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-primary cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 px-2 flex items-center gap-2"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  {user?.firstName?.[0]}
                  {user?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => navigate('/app/settings/profile')}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate('/app/settings/system')}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="cursor-pointer text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}