import { PageContainer } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Download,
  Calendar,
  DollarSign,
  Target,
  Award,
  Users,
  BarChart3,
  Globe,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const roiData = [
  { quarter: 'Q1 2023', investment: 1200000, returns: 800000 },
  { quarter: 'Q2 2023', investment: 1500000, returns: 1100000 },
  { quarter: 'Q3 2023', investment: 1800000, returns: 1500000 },
  { quarter: 'Q4 2023', investment: 2100000, returns: 2000000 },
  { quarter: 'Q1 2024', investment: 2400000, returns: 2600000 },
  { quarter: 'Q2 2024', investment: 2800000, returns: 3200000 },
];

const strategicMetrics = [
  {
    id: 1,
    title: 'Return on Investment',
    value: '156%',
    change: 12.5,
    trend: 'up',
    icon: DollarSign,
    description: 'Total portfolio ROI',
  },
  {
    id: 2,
    title: 'Strategic Alignment',
    value: '89%',
    change: 4.2,
    trend: 'up',
    icon: Target,
    description: 'Projects aligned with goals',
  },
  {
    id: 3,
    title: 'Value Delivered',
    value: '$4.2M',
    change: 18.7,
    trend: 'up',
    icon: Award,
    description: 'Business value this year',
  },
  {
    id: 4,
    title: 'Team Capacity',
    value: '78%',
    change: -3.1,
    trend: 'down',
    icon: Users,
    description: 'Resource utilization',
  },
];

const initiativeBreakdown = [
  { name: 'Digital Transformation', value: 35, color: 'bg-primary' },
  { name: 'Operational Excellence', value: 28, color: 'bg-accent' },
  { name: 'Customer Experience', value: 22, color: 'bg-success' },
  { name: 'Innovation', value: 15, color: 'bg-warning' },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              ${(entry.value / 1000000).toFixed(1)}M
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function StrategicDashboard() {
  return (
    <PageContainer
      title="Strategic Dashboard"
      description="Executive-level insights for organizational strategy and investment decisions"
      actions={
        <>
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="w-4 h-4" />
            Q2 2024
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export to PowerPoint
          </Button>
        </>
      }
    >
      {/* Strategic Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategicMetrics.map((metric, index) => (
          <Card
            key={metric.id}
            className={cn(
              'glass-card group animate-fade-in-up opacity-0',
              'hover:border-primary/30 transition-all duration-300'
            )}
            style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center transition-all',
                    'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground'
                  )}
                >
                  <metric.icon className="w-6 h-6" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm font-medium',
                    metric.trend === 'up' ? 'text-success' : 'text-destructive'
                  )}
                >
                  {metric.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {metric.trend === 'up' && '+'}
                  {metric.change}%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
              <p className="text-xs text-muted-foreground mt-2">{metric.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ROI Chart & Initiative Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card
          className="glass-card lg:col-span-2 animate-fade-in-up opacity-0"
          style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Investment vs Returns Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={roiData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorReturns" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis
                    dataKey="quarter"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    tickFormatter={(value) => `$${value / 1000000}M`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="investment"
                    name="Investment"
                    stroke="hsl(var(--muted-foreground))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorInvestment)"
                  />
                  <Area
                    type="monotone"
                    dataKey="returns"
                    name="Returns"
                    stroke="hsl(var(--success))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorReturns)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card
          className="glass-card animate-fade-in-up opacity-0"
          style={{ animationDelay: '250ms', animationFillMode: 'forwards' }}
        >
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-accent" />
              Strategic Initiatives
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {initiativeBreakdown.map((initiative, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{initiative.name}</span>
                  <span className="font-medium">{initiative.value}%</span>
                </div>
                <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all duration-700', initiative.color)}
                    style={{
                      width: `${initiative.value}%`,
                      animationDelay: `${300 + index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-4 mt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-2">Total Budget Allocation</p>
              <p className="text-2xl font-bold text-foreground">$12.8M</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                15% increase from FY2023
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Summary */}
      <Card
        className="glass-card animate-fade-in-up opacity-0"
        style={{ animationDelay: '300ms', animationFillMode: 'forwards' }}
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Executive Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-success/10 border border-success/20">
              <h4 className="font-semibold text-success mb-2">Achievements</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• ROI exceeded target by 24%</li>
                <li>• 3 major initiatives completed ahead of schedule</li>
                <li>• Customer satisfaction up 15 points</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-warning/10 border border-warning/20">
              <h4 className="font-semibold text-warning mb-2">Watch Items</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Resource capacity approaching limits</li>
                <li>• 2 projects with budget variance &gt;10%</li>
                <li>• Vendor contract renewals pending</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">Recommendations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Approve additional Q3 headcount</li>
                <li>• Fast-track innovation pipeline</li>
                <li>• Review strategic partnership options</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

export default StrategicDashboard;
