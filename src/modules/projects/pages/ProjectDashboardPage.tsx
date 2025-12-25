import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface KPIMetric {
  label: string;
  value: number | string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export const ProjectDashboardPage: React.FC = () => {
  const portfolioData = {
    totalProjects: 12,
    activeProjects: 5,
    completedProjects: 4,
    archivedProjects: 3,
    totalBudget: 3500000,
    spentBudget: 1890000,
    onTimeProjects: 9,
    onBudgetProjects: 10,
  };

  const kpis: KPIMetric[] = [
    {
      label: 'Portfolio Value',
      value: `$${(portfolioData.totalBudget / 1000000).toFixed(1)}M`,
      change: 12,
      trend: 'up',
    },
    {
      label: 'Budget Utilization',
      value: `${Math.round((portfolioData.spentBudget / portfolioData.totalBudget) * 100)}%`,
      change: 5,
      trend: 'up',
    },
    {
      label: 'On-Time Performance',
      value: `${Math.round((portfolioData.onTimeProjects / portfolioData.totalProjects) * 100)}%`,
      change: -2,
      trend: 'down',
    },
    {
      label: 'On-Budget Performance',
      value: `${Math.round((portfolioData.onBudgetProjects / portfolioData.totalProjects) * 100)}%`,
      change: 8,
      trend: 'up',
    },
  ];

  const projectsByStatus = [
    { status: 'Active', count: portfolioData.activeProjects, color: 'bg-green-500' },
    { status: 'Planning', count: 0, color: 'bg-blue-500' },
    { status: 'Completed', count: portfolioData.completedProjects, color: 'bg-purple-500' },
    { status: 'Archived', count: portfolioData.archivedProjects, color: 'bg-muted' },
  ];

  const projectsByHealth = [
    { health: 'Healthy', count: 8, variant: 'default' as const },
    { health: 'At Risk', count: 3, variant: 'secondary' as const },
    { health: 'Critical', count: 1, variant: 'destructive' as const },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Portfolio Dashboard</h1>
        <p className="text-muted-foreground mt-1">Portfolio overview and performance metrics</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <Card key={idx} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-sm font-medium text-muted-foreground">{kpi.label}</h3>
                <div className="flex items-center gap-1">
                  {kpi.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : kpi.trend === 'down' ? (
                    <TrendingDown className="w-4 h-4 text-destructive" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span
                    className={`text-xs font-semibold ${
                      kpi.trend === 'up'
                        ? 'text-green-600'
                        : kpi.trend === 'down'
                        ? 'text-destructive'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {kpi.change > 0 ? '+' : ''}{kpi.change}%
                  </span>
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-2">vs. previous period</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Projects by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {projectsByStatus.map((item, idx) => (
              <div key={idx}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{item.status}</span>
                  <span className="text-sm font-semibold text-foreground">{item.count}</span>
                </div>
                <Progress 
                  value={(item.count / portfolioData.totalProjects) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Projects by Health */}
        <Card>
          <CardHeader>
            <CardTitle>Project Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {projectsByHealth.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <Badge variant={item.variant}>{item.count}</Badge>
                <span className="text-sm text-muted-foreground">{item.health}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-muted-foreground">Completed This Month</p>
                <p className="text-lg font-semibold text-foreground">2 projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-xs text-muted-foreground">Needs Attention</p>
                <p className="text-lg font-semibold text-foreground">3 projects</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Avg. Progress</p>
                <p className="text-lg font-semibold text-foreground">54%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Budget Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Total Budget</span>
                <span className="text-sm font-semibold text-foreground">
                  ${(portfolioData.totalBudget / 1000000).toFixed(1)}M
                </span>
              </div>
              <Progress 
                value={(portfolioData.spentBudget / portfolioData.totalBudget) * 100} 
                className="h-4"
              />
              <p className="text-xs text-muted-foreground mt-2">
                ${(portfolioData.spentBudget / 1000000).toFixed(1)}M spent (
                {Math.round((portfolioData.spentBudget / portfolioData.totalBudget) * 100)}%)
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Remaining</span>
                <span className="text-sm font-semibold text-foreground">
                  ${((portfolioData.totalBudget - portfolioData.spentBudget) / 1000000).toFixed(1)}M
                </span>
              </div>
              <Progress 
                value={((portfolioData.totalBudget - portfolioData.spentBudget) / portfolioData.totalBudget) * 100} 
                className="h-4"
              />
              <p className="text-xs text-muted-foreground mt-2">
                ${((portfolioData.totalBudget - portfolioData.spentBudget) / 1000000).toFixed(1)}M available
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectDashboardPage;
