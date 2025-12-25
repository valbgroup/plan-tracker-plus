import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Database,
  History,
  Settings,
  ChevronDown,
  Activity,
  Target,
  TrendingUp,
  Users,
  Calendar,
  MapPin,
  Building2,
  Briefcase,
  FileText,
  Shield,
  Zap,
  BarChart3,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

interface NavChild {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavItem {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href?: string;
  children?: NavChild[];
}

const navigation: NavItem[] = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      { title: 'Operational', href: '/dashboard/operational', icon: Activity },
      { title: 'Tactical', href: '/dashboard/tactical', icon: Target },
      { title: 'Strategic', href: '/dashboard/strategic', icon: TrendingUp },
    ],
  },
  {
    title: 'Projects',
    icon: FolderKanban,
    children: [
      { title: 'Project List', href: '/projects', icon: FolderKanban },
      { title: 'Portfolio Dashboard', href: '/projects/dashboard', icon: BarChart3 },
    ],
  },
  {
    title: 'Master Data',
    icon: Database,
    children: [
      { title: 'Project Qualifications', href: '/master-data/qualifications', icon: FileText },
      { title: 'Deliverables', href: '/master-data/deliverables', icon: FileText },
      { title: 'Budget Settings', href: '/master-data/budget', icon: Briefcase },
      { title: 'Locations', href: '/master-data/locations', icon: MapPin },
      { title: 'Organization', href: '/master-data/organization', icon: Building2 },
      { title: 'Resources', href: '/master-data/resources', icon: Users },
      { title: 'Risks & Issues', href: '/master-data/risks', icon: Shield },
      { title: 'Agile', href: '/master-data/agile', icon: Zap },
      { title: 'Calendars', href: '/master-data/calendars', icon: Calendar },
    ],
  },
  {
    title: 'History & Audit',
    icon: History,
    href: '/history',
  },
  {
    title: 'Settings',
    icon: Settings,
    children: [
      { title: 'System', href: '/settings/system', icon: Zap },
      { title: 'Profile', href: '/settings/profile', icon: Users },
    ],
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const isActive = (href: string) => location.pathname === href;
  const isGroupActive = (children?: { href: string }[]) =>
    children?.some((child) => location.pathname.startsWith(child.href));

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="h-16 flex items-center justify-center border-b border-sidebar-border">
        <NavLink to="/" className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-lg text-sidebar-accent-foreground">
              LightPro
            </span>
          )}
        </NavLink>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-sidebar-foreground/60 mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) =>
                item.children ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={isGroupActive(item.children)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          className={cn(
                            'w-full justify-between',
                            isGroupActive(item.children) &&
                              'bg-sidebar-accent text-sidebar-accent-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <item.icon className="w-4 h-4" />
                            {!isCollapsed && <span>{item.title}</span>}
                          </div>
                          {!isCollapsed && (
                            <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                          )}
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      {!isCollapsed && (
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive(child.href)}
                                >
                                  <NavLink
                                    to={child.href}
                                    className={cn(
                                      'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors',
                                      isActive(child.href)
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                                    )}
                                  >
                                    <child.icon className="w-3.5 h-3.5" />
                                    <span>{child.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      )}
                    </SidebarMenuItem>
                  </Collapsible>
                ) : item.href ? (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.href)}
                      className={cn(
                        isActive(item.href) &&
                          'bg-primary text-primary-foreground'
                      )}
                    >
                      <NavLink
                        to={item.href}
                        className="flex items-center gap-2"
                      >
                        <item.icon className="w-4 h-4" />
                        {!isCollapsed && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ) : null
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <div className="text-xs text-sidebar-foreground/50">
            LightPro v1.0.0
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
