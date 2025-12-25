import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  ClipboardList, TrendingUp, TrendingDown, AlertTriangle, Check, 
  Download, Search, Eye, XCircle, ArrowUpRight 
} from 'lucide-react';
import { toast } from 'sonner';

const complianceKPIs = [
  { 
    name: 'Traceability Rate', 
    value: '94%', 
    target: '95%', 
    status: 'warning', 
    trend: '+2%',
    trendUp: true,
  },
  { 
    name: 'Approval Delay', 
    value: '38 hours', 
    target: '48 hours', 
    status: 'success', 
    trend: '-4 hours',
    trendUp: false,
  },
  { 
    name: 'Baseline Changes', 
    value: '12/month', 
    target: '2/month', 
    status: 'warning', 
    trend: '+3',
    trendUp: true,
  },
  { 
    name: 'Signature Compliance', 
    value: '100%', 
    target: '100%', 
    status: 'success', 
    trend: 'Stable',
    trendUp: null,
  },
  { 
    name: 'Active Users', 
    value: '47 users', 
    target: '', 
    status: 'info', 
    trend: '-5 users',
    trendUp: false,
  },
];

const anomalies = [
  {
    id: '1',
    type: 'Mass Modification',
    severity: 'high',
    time: '2025-12-24 14:30',
    description: '52 changes by single user in 1 hour',
    project: 'Project Alpha',
    user: 'John Doe',
    status: 'NEW',
  },
  {
    id: '2',
    type: 'Off-hours Activity',
    severity: 'medium',
    time: '2025-12-24 03:15',
    description: 'Changes made at 3:15 AM',
    project: 'Project Beta',
    user: 'Jane Smith',
    status: 'INVESTIGATING',
  },
  {
    id: '3',
    type: 'Unstable Baseline',
    severity: 'low',
    time: '2025-12-23 16:45',
    description: '6 baseline versions in current month',
    project: 'Project Gamma',
    user: 'Mike Johnson',
    status: 'RESOLVED',
  },
];

export function AuditCompliance() {
  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [soxEnabled, setSoxEnabled] = useState(true);
  const [isoEnabled, setIsoEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState(90);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success bg-success/20 border-success/30';
      case 'warning': return 'text-warning bg-warning/20 border-warning/30';
      case 'info': return 'text-primary bg-primary/20 border-primary/30';
      default: return 'text-muted-foreground bg-secondary border-border';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'low': return <AlertTriangle className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      NEW: 'destructive',
      INVESTIGATING: 'default',
      RESOLVED: 'secondary',
      CLOSED: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Compliance KPIs */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-primary" />
            Compliance KPIs
          </CardTitle>
          <CardDescription>Real-time compliance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {complianceKPIs.map((kpi, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${getStatusColor(kpi.status)}`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium">{kpi.name}</span>
                  {kpi.status === 'success' && <Check className="w-4 h-4" />}
                  {kpi.status === 'warning' && <AlertTriangle className="w-4 h-4" />}
                </div>
                <div className="mt-2">
                  <span className="text-2xl font-bold">{kpi.value}</span>
                  {kpi.target && (
                    <span className="text-xs text-muted-foreground ml-2">/ {kpi.target}</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1 text-xs">
                  {kpi.trendUp === true && <TrendingUp className="w-3 h-3" />}
                  {kpi.trendUp === false && <TrendingDown className="w-3 h-3" />}
                  <span>{kpi.trend} this month</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detected Anomalies */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Detected Anomalies</CardTitle>
            <CardDescription>Unusual activity requiring attention</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{anomalies.filter(a => a.status === 'NEW').length} New</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {anomalies.map((anomaly) => (
                <TableRow key={anomaly.id}>
                  <TableCell>
                    <Badge variant="outline">{anomaly.type}</Badge>
                  </TableCell>
                  <TableCell>{getSeverityIcon(anomaly.severity)}</TableCell>
                  <TableCell className="text-muted-foreground">{anomaly.time}</TableCell>
                  <TableCell>{anomaly.description}</TableCell>
                  <TableCell className="text-primary cursor-pointer hover:underline">
                    {anomaly.project}
                  </TableCell>
                  <TableCell>{anomaly.user}</TableCell>
                  <TableCell>{getStatusBadge(anomaly.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Search className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <XCircle className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowUpRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Regulatory Compliance */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Regulatory Compliance</CardTitle>
          <CardDescription>Active compliance frameworks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <span className="font-medium">GDPR Compliance</span>
                <p className="text-xs text-muted-foreground">Last audit: 2025-10-15</p>
              </div>
              <Switch checked={gdprEnabled} onCheckedChange={setGdprEnabled} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <span className="font-medium">SOX Compliance</span>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <Switch checked={soxEnabled} onCheckedChange={setSoxEnabled} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <span className="font-medium">ISO 27001</span>
                <p className="text-xs text-muted-foreground">Active</p>
              </div>
              <Switch checked={isoEnabled} onCheckedChange={setIsoEnabled} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div>
              <span className="font-medium">Data Retention</span>
              <p className="text-sm text-muted-foreground">{dataRetention} days | Last cleanup: 2025-12-20</p>
            </div>
            <Select value={String(dataRetention)} onValueChange={(v) => setDataRetention(Number(v))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
                <SelectItem value="365">1 year</SelectItem>
                <SelectItem value="730">2 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Export */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Audit Export</CardTitle>
          <CardDescription>Generate compliance reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4">
            <Select defaultValue="30">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last quarter</SelectItem>
                <SelectItem value="365">Year</SelectItem>
                <SelectItem value="custom">Custom range</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="pdf">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => toast.success('Audit report generated')}>
              <Download className="w-4 h-4 mr-2" />
              Export Audit Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
