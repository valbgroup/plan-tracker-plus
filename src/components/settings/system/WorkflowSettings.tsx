import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GitBranch, Plus, Edit, Eye, Archive, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

interface Workflow {
  id: string;
  name: string;
  trigger: string;
  steps: number;
  timeouts: string;
  autoEscalate: boolean;
  notifications: boolean;
  isDefault: boolean;
}

const defaultWorkflows: Workflow[] = [
  {
    id: '1',
    name: 'Baseline Validation',
    trigger: 'Structural change (phases, deliverables)',
    steps: 3,
    timeouts: '24h | 48h | 72h',
    autoEscalate: true,
    notifications: true,
    isDefault: true,
  },
  {
    id: '2',
    name: 'Budget Approval',
    trigger: 'Budget overspend >10%',
    steps: 3,
    timeouts: '12h | 24h | 48h',
    autoEscalate: true,
    notifications: true,
    isDefault: true,
  },
  {
    id: '3',
    name: 'Team Change',
    trigger: 'Team modification ≥30% members',
    steps: 2,
    timeouts: '24h | 48h',
    autoEscalate: true,
    notifications: true,
    isDefault: true,
  },
  {
    id: '4',
    name: 'Project Closure',
    trigger: 'Project closure request',
    steps: 3,
    timeouts: '24h | 48h | 72h',
    autoEscalate: true,
    notifications: true,
    isDefault: true,
  },
];

interface ApprovalMatrix {
  id: string;
  decisionType: string;
  amountImpact: string;
  level1: string;
  level2: string;
  level3: string;
  required: boolean;
  autoEscalate: boolean;
}

const defaultApprovalMatrix: ApprovalMatrix[] = [
  { id: '1', decisionType: 'Budget Initial', amountImpact: '<50k', level1: 'Chef Projet', level2: 'PMO', level3: '—', required: true, autoEscalate: false },
  { id: '2', decisionType: 'Budget Overspend', amountImpact: '10-25%', level1: 'Chef Projet', level2: 'PMO', level3: 'Director', required: true, autoEscalate: true },
  { id: '3', decisionType: 'Budget Overspend', amountImpact: '>25%', level1: 'Chef Projet', level2: 'Director', level3: 'CEO', required: true, autoEscalate: true },
];

const auditLogs = [
  { id: '1', date: '2025-12-24 14:30', workflow: 'Baseline Validation', project: 'Project Alpha', trigger: 'Phase restructure', step: 'PMO Review', approver: 'John Doe', status: 'IN_PROGRESS', days: 1 },
  { id: '2', date: '2025-12-23 09:15', workflow: 'Budget Approval', project: 'Project Beta', trigger: '15% overspend', step: 'Director Approval', approver: 'Jane Smith', status: 'APPROVED', days: 2 },
  { id: '3', date: '2025-12-22 16:45', workflow: 'Team Change', project: 'Project Gamma', trigger: '40% team change', step: 'PMO Review', approver: 'Mike Johnson', status: 'ESCALATED', days: 3 },
];

export function WorkflowSettings() {
  const [workflows, setWorkflows] = useState(defaultWorkflows);
  const [approvalMatrix, setApprovalMatrix] = useState(defaultApprovalMatrix);
  const [showAddWorkflow, setShowAddWorkflow] = useState(false);

  const toggleWorkflowSetting = (id: string, field: 'autoEscalate' | 'notifications') => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, [field]: !w[field] } : w
    ));
    toast.success('Workflow updated');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      IN_PROGRESS: 'default',
      APPROVED: 'secondary',
      REJECTED: 'destructive',
      ESCALATED: 'outline',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Approval Workflows */}
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-primary" />
              Approval Workflows
            </CardTitle>
            <CardDescription>Configure multi-level approval processes</CardDescription>
          </div>
          <Dialog open={showAddWorkflow} onOpenChange={setShowAddWorkflow}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Workflow
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workflow</DialogTitle>
                <DialogDescription>Define a new approval workflow</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Workflow Name</Label>
                  <Input placeholder="e.g., Custom Approval" />
                </div>
                <div className="space-y-2">
                  <Label>Trigger Event</Label>
                  <Input placeholder="e.g., Budget change > 5%" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" onClick={() => setShowAddWorkflow(false)}>Cancel</Button>
                  <Button onClick={() => {
                    toast.success('Workflow created');
                    setShowAddWorkflow(false);
                  }}>Create</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Workflow Name</TableHead>
                <TableHead>Trigger Event</TableHead>
                <TableHead>Steps</TableHead>
                <TableHead>Timeouts</TableHead>
                <TableHead>Auto-Escalate</TableHead>
                <TableHead>Notifications</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workflows.map((workflow) => (
                <TableRow key={workflow.id}>
                  <TableCell className="font-medium">
                    {workflow.name}
                    {workflow.isDefault && (
                      <Badge variant="outline" className="ml-2 text-xs">Default</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{workflow.trigger}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {Array.from({ length: workflow.steps }).map((_, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">{i + 1}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{workflow.timeouts}</TableCell>
                  <TableCell>
                    <Switch
                      checked={workflow.autoEscalate}
                      onCheckedChange={() => toggleWorkflowSetting(workflow.id, 'autoEscalate')}
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={workflow.notifications}
                      onCheckedChange={() => toggleWorkflowSetting(workflow.id, 'notifications')}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!workflow.isDefault && (
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Approval Matrix */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Approval Matrix</CardTitle>
          <CardDescription>Define approval thresholds and levels</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Decision Type</TableHead>
                <TableHead>Amount/Impact</TableHead>
                <TableHead>Level 1</TableHead>
                <TableHead>Level 2</TableHead>
                <TableHead>Level 3</TableHead>
                <TableHead>Required</TableHead>
                <TableHead>Auto-Escalate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvalMatrix.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.decisionType}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{row.amountImpact}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={row.level1}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chef Projet">Chef Projet</SelectItem>
                        <SelectItem value="PMO">PMO</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="CEO">CEO</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={row.level2}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="—">—</SelectItem>
                        <SelectItem value="Chef Projet">Chef Projet</SelectItem>
                        <SelectItem value="PMO">PMO</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="CEO">CEO</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Select defaultValue={row.level3}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="—">—</SelectItem>
                        <SelectItem value="Director">Director</SelectItem>
                        <SelectItem value="CEO">CEO</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked={row.required} />
                  </TableCell>
                  <TableCell>
                    <Switch defaultChecked={row.autoEscalate} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-between mt-4">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Row
            </Button>
            <Button onClick={() => toast.success('Approval matrix saved')}>
              Save All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Audit Log */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Workflow Audit Log</CardTitle>
          <CardDescription>Recent approval workflow activity</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date/Time</TableHead>
                <TableHead>Workflow</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Trigger</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead>Approver</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {auditLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-muted-foreground">{log.date}</TableCell>
                  <TableCell className="font-medium">{log.workflow}</TableCell>
                  <TableCell className="text-primary cursor-pointer hover:underline">{log.project}</TableCell>
                  <TableCell>{log.trigger}</TableCell>
                  <TableCell>{log.step}</TableCell>
                  <TableCell>{log.approver}</TableCell>
                  <TableCell>{getStatusBadge(log.status)}</TableCell>
                  <TableCell>
                    {log.days > 2 && <AlertTriangle className="w-4 h-4 text-warning inline mr-1" />}
                    {log.days}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
