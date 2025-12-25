import { PageContainer } from '@/components/layout';
import {
  KPICard,
  ProjectCard,
  BudgetChart,
  HealthPieChart,
  ResourceChart,
  MilestoneList,
  AlertList,
} from '@/components/dashboard';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  DollarSign,
  TrendingUp,
  Heart,
  Plus,
  Download,
  RefreshCw,
} from 'lucide-react';
import {
  mockKPIs,
  mockProjects,
  mockMilestones,
  mockAlerts,
  healthDistribution,
  projectStatusDistribution,
} from '@/data/mockData';

export function OperationalDashboard() {
  const activeProjects = mockProjects.filter((p) => p.status === 'active');

  const kpiIcons = {
    folder: FolderKanban,
    dollar: DollarSign,
    trending: TrendingUp,
    heart: Heart,
  };

  return (
    <PageContainer
      title="Operational Dashboard"
      description="Real-time overview of project performance and team activities"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </>
      }
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockKPIs.map((kpi, index) => (
          <KPICard
            key={kpi.id}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            changeType={kpi.changeType}
            unit={kpi.unit}
            icon={kpiIcons[kpi.icon as keyof typeof kpiIcons] || FolderKanban}
            delay={index * 50}
          />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <BudgetChart className="lg:col-span-2" delay={200} />
        <HealthPieChart
          data={healthDistribution}
          title="Project Health"
          delay={250}
        />
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ResourceChart className="lg:col-span-2" delay={300} />
        <HealthPieChart
          data={projectStatusDistribution}
          title="Status Distribution"
          delay={350}
        />
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MilestoneList milestones={mockMilestones} delay={400} />
        <AlertList alerts={mockAlerts} delay={450} />
      </div>

      {/* Active Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold animate-fade-in delay-500">
            Active Projects
          </h2>
          <Button variant="ghost" className="text-primary animate-fade-in delay-500">
            View all projects
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {activeProjects.slice(0, 6).map((project, index) => (
            <ProjectCard key={project.id} project={project} delay={500 + index * 50} />
          ))}
        </div>
      </div>
    </PageContainer>
  );
}

export default OperationalDashboard;
