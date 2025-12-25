import { PageContainer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Target,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Download,
  Filter,
  BarChart3,
  PieChart,
  Activity,
} from 'lucide-react';

// Mock tactical KPIs
const tacticalKPIs = [
  {
    id: 1,
    title: 'Schedule Performance Index (SPI)',
    value: 0.94,
    target: 1.0,
    status: 'warning',
    description: 'Slightly behind schedule',
  },
  {
    id: 2,
    title: 'Cost Performance Index (CPI)',
    value: 1.08,
    target: 1.0,
    status: 'success',
    description: 'Under budget',
  },
  {
    id: 3,
    title: 'Risk Exposure Index',
    value: 0.32,
    target: 0.25,
    status: 'warning',
    description: 'Above threshold',
  },
  {
    id: 4,
    title: 'Resource Efficiency',
    value: 0.87,
    target: 0.85,
    status: 'success',
    description: 'Meeting target',
  },
];

const riskMatrix = [
  { id: 1, name: 'Data migration delays', probability: 'High', impact: 'High', score: 9 },
  { id: 2, name: 'Resource availability', probability: 'Medium', impact: 'High', score: 6 },
  { id: 3, name: 'Vendor dependency', probability: 'Medium', impact: 'Medium', score: 4 },
  { id: 4, name: 'Scope creep', probability: 'Low', impact: 'High', score: 3 },
  { id: 5, name: 'Technical debt', probability: 'High', impact: 'Low', score: 3 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'success':
      return 'text-success';
    case 'warning':
      return 'text-warning';
    case 'danger':
      return 'text-destructive';
    default:
      return 'text-muted-foreground';
  }
};

const getRiskColor = (score: number) => {
  if (score >= 6) return 'bg-destructive/20 text-destructive border-destructive/30';
  if (score >= 4) return 'bg-warning/20 text-warning border-warning/30';
  return 'bg-success/20 text-success border-success/30';
};

export function TacticalDashboard() {
  return (
    <PageContainer
      title="Tactical Dashboard"
      description="PMO-level insights for portfolio management and decision support"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </>
      }
    >
      {/* Performance Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tacticalKPIs.map((kpi, index) => (
          <Card
            key={kpi.id}
            className={cn(
              'glass-card animate-fade-in-up opacity-0',
              'hover:border-primary/30 transition-all duration-300'
            )}
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    kpi.status === 'success' && 'bg-success/10',
                    kpi.status === 'warning' && 'bg-warning/10',
                    kpi.status === 'danger' && 'bg-destructive/10'
                  )}
                >
                  {kpi.status === 'success' ? (
                    <TrendingUp className="w-5 h-5 text-success" />
                  ) : kpi.status === 'warning' ? (
                    <AlertTriangle className="w-5 h-5 text-warning" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-destructive" />
                  )}
                </div>
                <Target className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground mb-2">{kpi.title}</p>
              <div className="flex items-baseline gap-2">
                <span className={cn('text-3xl font-bold', getStatusColor(kpi.status))}>
                  {kpi.value.toFixed(2)}
                </span>
                <span className="text-sm text-muted-foreground">
                  / {kpi.target.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Risk Matrix */}
        <Card
          className="glass-card animate-fade-in-up opacity-0"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Top Risks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {riskMatrix.map((risk) => (
              <div
                key={risk.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground truncate">
                    {risk.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <span>Probability: {risk.probability}</span>
                    <span>•</span>
                    <span>Impact: {risk.impact}</span>
                  </div>
                </div>
                <Badge variant="outline" className={cn('ml-2', getRiskColor(risk.score))}>
                  Score: {risk.score}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Portfolio Summary */}
        <Card
          className="glass-card animate-fade-in-up opacity-0"
          style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Portfolio Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-muted-foreground">Total Projects</p>
                <p className="text-2xl font-bold text-primary">12</p>
              </div>
              <div className="p-4 rounded-lg bg-success/10 border border-success/20">
                <p className="text-sm text-muted-foreground">On Track</p>
                <p className="text-2xl font-bold text-success">8</p>
              </div>
              <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
                <p className="text-sm text-muted-foreground">At Risk</p>
                <p className="text-2xl font-bold text-warning">3</p>
              </div>
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-muted-foreground">Critical</p>
                <p className="text-2xl font-bold text-destructive">1</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Overall Portfolio Health</span>
                <span className="text-sm font-medium text-success">78%</span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-success to-primary rounded-full transition-all duration-500"
                  style={{ width: '78%' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Trend */}
        <Card
          className="glass-card lg:col-span-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              Benchmarking & Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Delivery Rate</span>
                  <span className="text-sm font-medium">92%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full">
                  <div className="h-full w-[92%] bg-success rounded-full" />
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5% vs last quarter
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Budget Adherence</span>
                  <span className="text-sm font-medium">87%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full">
                  <div className="h-full w-[87%] bg-primary rounded-full" />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Stable
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Quality Score</span>
                  <span className="text-sm font-medium">94%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full">
                  <div className="h-full w-[94%] bg-accent rounded-full" />
                </div>
                <p className="text-xs text-success flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +2% vs last quarter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}

export default TacticalDashboard;
