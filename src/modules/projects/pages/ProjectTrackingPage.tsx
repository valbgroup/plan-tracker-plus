import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { usePhases, useDeliverables } from '@/hooks/usePlanData';
import { ProjectDetailsContext } from '../layout/ProjectDetailsLayout';
import { PageContainer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { GanttChart } from '../components/GanttChart';
import { EVMetricsDashboard } from '../components/EVMetricsDashboard';
import { ExportReport } from '../components/ExportReport';
import { RiskIssuesDashboard, RiskIssue } from '../components/RiskIssuesDashboard';
import { ProjectHistory, BaselineHistory } from '@/modules/history/components';
import { cn } from '@/lib/utils';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  Target,
  AlertCircle,
  CheckCircle,
  Activity,
  AlertTriangle,
  Download,
  History,
  GitBranch,
} from 'lucide-react';

type TrackingTab = 'overview' | 'variance' | 'risks' | 'export' | 'history' | 'baseline';

// Mock risk/issues data
const MOCK_RISKS: RiskIssue[] = [
  {
    id: 'risk-1',
    type: 'risk',
    title: 'Resource Availability',
    description: 'Key developers may not be available in Q4 due to competing priorities',
    impact: 'high',
    probability: 0.6,
    status: 'open',
    owner: 'John Doe',
    dueDate: new Date('2024-12-15'),
    mitigation: 'Hire contractors or redistribute workload',
  },
  {
    id: 'issue-1',
    type: 'issue',
    title: 'API Performance Degradation',
    description: 'API response time exceeds SLA threshold during peak hours',
    impact: 'medium',
    status: 'mitigating',
    owner: 'Jane Smith',
    dueDate: new Date('2024-11-30'),
    mitigation: 'Optimize database queries and implement caching layer',
  },
  {
    id: 'risk-2',
    type: 'risk',
    title: 'Third-party Integration Delay',
    description: 'External vendor may not deliver API on schedule',
    impact: 'medium',
    probability: 0.4,
    status: 'open',
    owner: 'Bob Johnson',
    dueDate: new Date('2024-12-01'),
  },
  {
    id: 'issue-2',
    type: 'issue',
    title: 'Security Vulnerability Patched',
    description: 'Critical security patch applied to authentication module',
    impact: 'high',
    status: 'resolved',
    owner: 'Alice Brown',
    dueDate: new Date('2024-10-15'),
    mitigation: 'Applied security patch and conducted penetration testing',
  },
];

export function ProjectTrackingPage() {
  const { project } = useOutletContext<ProjectDetailsContext>();
  const { data: phases = [] } = usePhases(project?.project_id || '');
  const { data: deliverables = [] } = useDeliverables(project?.project_id || '');
  const [activeTab, setActiveTab] = useState<TrackingTab>('overview');

  if (!project) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h2 className="text-lg font-medium">Project not found</h2>
          <p className="text-muted-foreground">The requested project could not be loaded.</p>
        </div>
      </PageContainer>
    );
  }

  const deliverableProgress = project.nombre_livrables_planifies > 0 
    ? Math.round((project.nombre_livrables_acceptes / project.nombre_livrables_planifies) * 100)
    : 0;

  const budgetProgress = project.montant_budget_total > 0
    ? Math.round((project.budget_consomme / project.montant_budget_total) * 100)
    : 0;

  // EV Metrics calculation
  const spi = 0.95;
  const cpi = 1.02;
  const earnedValue = (project.montant_budget_total || 0) * (deliverableProgress / 100);
  const scheduleVariance = spi >= 1 ? 5 : -3;
  const costVariance = (project.montant_budget_total || 0) * (cpi - 1);

  const projectStartDate = new Date(project.date_debut_planifiée);
  const projectEndDate = new Date(project.date_fin_planifiée);

  const completedDeliverables = deliverables.filter(
    (d) => d.progres_reel >= 100
  ).length;

  const tabs = [
    { id: 'overview' as TrackingTab, label: 'Overview', icon: Activity },
    { id: 'variance' as TrackingTab, label: 'EV Analysis', icon: BarChart3 },
    { id: 'risks' as TrackingTab, label: 'Risks & Issues', icon: AlertTriangle },
    { id: 'history' as TrackingTab, label: 'Change History', icon: History },
    { id: 'baseline' as TrackingTab, label: 'Baselines', icon: GitBranch },
    { id: 'export' as TrackingTab, label: 'Export', icon: Download },
  ];

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4" />
                Deliverables Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{deliverableProgress}%</p>
                <span className="text-sm text-muted-foreground mb-1">
                  ({completedDeliverables}/{deliverables.length || project.nombre_livrables_planifies})
                </span>
              </div>
              <Progress value={deliverableProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Budget Usage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <p className="text-3xl font-bold">{budgetProgress}%</p>
                <span className={cn('text-sm mb-1', budgetProgress > 80 ? 'text-amber-500' : 'text-muted-foreground')}>
                  consumed
                </span>
              </div>
              <Progress 
                value={budgetProgress} 
                className={cn('mt-2', budgetProgress > 90 ? '[&>div]:bg-destructive' : budgetProgress > 70 ? '[&>div]:bg-amber-500' : '')}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Performance (SPI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{spi.toFixed(2)}</p>
                {spi >= 1 ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    On Track
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Behind
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {spi >= 1 ? 'Ahead of schedule' : 'Schedule delay detected'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Cost Performance (CPI)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{cpi.toFixed(2)}</p>
                {cpi >= 1 ? (
                  <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Under Budget
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">
                    <TrendingDown className="w-3 h-3 mr-1" />
                    Over Budget
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {cpi >= 1 ? 'Cost efficiency maintained' : 'Cost overrun detected'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border">
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Gantt Chart */}
            <GanttChart
              phases={phases}
              deliverables={deliverables}
              projectStartDate={projectStartDate}
              projectEndDate={projectEndDate}
              showBaseline={true}
            />

            {/* Phase Summary & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phase Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {phases.length > 0 ? phases.map((phase) => (
                      <div key={phase.phase_id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn('w-2 h-2 rounded-full',
                            phase.progres_reel >= 100 ? 'bg-green-500' :
                            phase.progres_reel > 50 ? 'bg-emerald-500' :
                            phase.progres_reel > 0 ? 'bg-amber-500' : 'bg-muted'
                          )} />
                          <span className="text-sm text-foreground">{phase.libellé}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${phase.progres_reel || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                            {phase.progres_reel || 0}%
                          </span>
                        </div>
                      </div>
                    )) : (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">On Track</p>
                          <p className="text-sm text-muted-foreground">3 phases on schedule</p>
                        </div>
                        <Badge variant="secondary">75%</Badge>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                      <div>
                        <p className="text-sm">Deliverable "System Architecture Document" accepted</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                      <div>
                        <p className="text-sm">Phase "Development" progressed to 65%</p>
                        <p className="text-xs text-muted-foreground">3 days ago</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground mt-2" />
                      <div>
                        <p className="text-sm">Budget envelope updated</p>
                        <p className="text-xs text-muted-foreground">5 days ago</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'variance' && (
          <EVMetricsDashboard
            metrics={{
              plannedValue: project.montant_budget_total || 0,
              earnedValue: earnedValue,
              actualCost: project.budget_consomme || 0,
              budgetAtCompletion: project.montant_budget_total || 0,
              scheduleVariance: scheduleVariance,
              costVariance: costVariance,
              schedulePerformanceIndex: spi,
              costPerformanceIndex: cpi,
            }}
            currency="DZD"
          />
        )}

        {activeTab === 'risks' && (
          <RiskIssuesDashboard items={MOCK_RISKS} />
        )}

        {activeTab === 'history' && (
          <ProjectHistory projectId={project.project_id} />
        )}

        {activeTab === 'baseline' && (
          <BaselineHistory projectId={project.project_id} />
        )}

        {activeTab === 'export' && (
          <ExportReport
            projectId={project.project_id}
            projectName={project.libellé}
            projectData={{
              code: project.code,
              status: project.statut_id,
              health: project.etat_sante_id,
              overallProgress: deliverableProgress,
              totalBudget: project.montant_budget_total,
              spent: project.budget_consomme,
              startDate: project.date_debut_planifiée,
              endDate: project.date_fin_planifiée,
              phases: phases.map(p => ({ name: p.libellé, progress: p.progres_reel })),
            }}
          />
        )}
      </div>
    </PageContainer>
  );
}

export default ProjectTrackingPage;
