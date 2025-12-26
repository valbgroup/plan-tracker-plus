import { Outlet, useParams, useLocation, NavLink, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { cn } from '@/lib/utils';
import { FileText, BarChart3, History, ChevronRight, List, LayoutDashboard } from 'lucide-react';
import { useProject } from '@/hooks/useProject';

const projectTabs = [
  { label: 'Plan', href: 'plan', icon: FileText },
  { label: 'Tracking', href: 'tracking', icon: BarChart3 },
  { label: 'History', href: 'history', icon: History },
];

const moduleTabs = [
  { label: 'Projects', href: '/app/projects', icon: List },
  { label: 'Dashboard', href: '/app/projects/dashboard', icon: LayoutDashboard },
];

export function ProjectsLayout() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { data: project } = useProject(projectId || '');

  const isProjectDetail = !!projectId;
  const currentTab = location.pathname.split('/').pop();

  // Check if we're on module level (list or dashboard)
  const isModuleLevel = !isProjectDetail;
  const currentModulePath = location.pathname;

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Module Level Header with Projects/Dashboard Tabs */}
        {isModuleLevel && (
          <div className="border-b border-border bg-card px-6">
            <div className="flex gap-2 py-1">
              {moduleTabs.map((tab) => (
                <button
                  key={tab.href}
                  onClick={() => navigate(tab.href)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                    currentModulePath === tab.href || (tab.href === '/app/projects' && currentModulePath.startsWith('/app/projects') && currentModulePath !== '/app/projects/dashboard')
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Project Detail Header with Tabs */}
        {isProjectDetail && project && (
          <div className="border-b border-border bg-card">
            {/* Breadcrumb */}
            <div className="px-6 py-3 flex items-center gap-2 text-sm text-muted-foreground">
              <NavLink to="/app/projects" className="hover:text-foreground transition-colors">
                Projects
              </NavLink>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground font-medium">{project.libellé}</span>
              <span className="text-muted-foreground">({project.code})</span>
            </div>

            {/* Tabs */}
            <div className="px-6 flex gap-1">
              {projectTabs.map((tab) => (
                <NavLink
                  key={tab.href}
                  to={`/app/projects/${projectId}/${tab.href}`}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors',
                    currentTab === tab.href
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </MainLayout>
  );
}

export default ProjectsLayout;