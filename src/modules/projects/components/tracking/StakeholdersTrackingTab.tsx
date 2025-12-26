import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Popover, PopoverContent, PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format, parseISO } from 'date-fns';
import { Save, Loader2, Users2, CalendarIcon } from 'lucide-react';
import { StakeholderTrackingRow, calculateStakeholderStatus } from './types';

const MOCK_STAKEHOLDERS: StakeholderTrackingRow[] = [
  { stakeholderId: 'sh-1', name: 'CEO', role: 'Executive Sponsor', interest: 'HIGH', plannedEngagementLevel: 'HIGHLY_ENGAGED', realEngagementLevel: 'HIGHLY_ENGAGED', communicationFrequency: 'WEEKLY', satisfactionLevel: 5, lastCommunicationDate: '2024-06-10', issuesRaised: 0, issuesList: [], status: 'GREEN', nextActionItem: 'Monthly status report', actionDueDate: '2024-06-30', notes: '', updatedAt: '2024-06-10T10:00:00Z', updatedBy: 'PM' },
  { stakeholderId: 'sh-2', name: 'IT Director', role: 'Technical Stakeholder', interest: 'HIGH', plannedEngagementLevel: 'ENGAGED', realEngagementLevel: 'INFORMED', communicationFrequency: 'MONTHLY', satisfactionLevel: 3, lastCommunicationDate: '2024-05-15', issuesRaised: 2, issuesList: ['Performance concerns', 'Integration delays'], status: 'YELLOW', nextActionItem: 'Technical review meeting', actionDueDate: '2024-06-20', notes: 'Needs more involvement', updatedAt: '2024-06-08T14:00:00Z', updatedBy: 'PM' },
  { stakeholderId: 'sh-3', name: 'End Users Rep', role: 'User Representative', interest: 'MEDIUM', plannedEngagementLevel: 'ENGAGED', realEngagementLevel: 'AT_RISK', communicationFrequency: 'WEEKLY', satisfactionLevel: 2, lastCommunicationDate: '2024-06-01', issuesRaised: 5, issuesList: ['UI concerns', 'Training needed'], status: 'RED', nextActionItem: 'User feedback session', actionDueDate: '2024-06-15', notes: 'Critical - schedule meeting ASAP', updatedAt: '2024-06-05T09:00:00Z', updatedBy: 'PM' },
];

interface StakeholdersTrackingTabProps {
  projectId: string;
}

export const StakeholdersTrackingTab: React.FC<StakeholdersTrackingTabProps> = ({ projectId }) => {
  const [stakeholders, setStakeholders] = useState<StakeholderTrackingRow[]>(MOCK_STAKEHOLDERS);
  const [isSaving, setIsSaving] = useState(false);

  const metrics = useMemo(() => {
    const green = stakeholders.filter(s => s.status === 'GREEN').length;
    const yellow = stakeholders.filter(s => s.status === 'YELLOW').length;
    const red = stakeholders.filter(s => s.status === 'RED').length;
    const avgSatisfaction = (stakeholders.reduce((sum, s) => sum + s.satisfactionLevel, 0) / stakeholders.length).toFixed(1);
    const totalIssues = stakeholders.reduce((sum, s) => sum + s.issuesRaised, 0);
    return { green, yellow, red, avgSatisfaction, totalIssues };
  }, [stakeholders]);

  const handleUpdate = (id: string, field: keyof StakeholderTrackingRow, value: unknown) => {
    setStakeholders(prev => prev.map(s => {
      if (s.stakeholderId !== id) return s;
      const updated = { ...s, [field]: value };
      if (field === 'satisfactionLevel' || field === 'realEngagementLevel') {
        updated.status = calculateStakeholderStatus(
          field === 'satisfactionLevel' ? value as number : updated.satisfactionLevel,
          field === 'realEngagementLevel' ? value as string : updated.realEngagementLevel
        );
      }
      updated.updatedAt = new Date().toISOString();
      return updated;
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Stakeholder tracking saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = { GREEN: 'bg-emerald-500/10 text-emerald-600', YELLOW: 'bg-amber-500/10 text-amber-600', RED: 'bg-destructive/10 text-destructive' };
    return <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Total</div><div className="text-2xl font-bold">{stakeholders.length}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Green</div><div className="text-2xl font-bold text-emerald-600">{metrics.green}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Yellow</div><div className="text-2xl font-bold text-amber-600">{metrics.yellow}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Red</div><div className="text-2xl font-bold text-destructive">{metrics.red}</div></CardContent></Card>
        <Card><CardContent className="pt-4"><div className="text-sm text-muted-foreground">Avg Satisfaction</div><div className="text-2xl font-bold">{metrics.avgSatisfaction}/5</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Users2 className="w-5 h-5" />Stakeholder Tracking</CardTitle>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Interest</TableHead>
                  <TableHead>Engagement</TableHead>
                  <TableHead>Satisfaction</TableHead>
                  <TableHead>Comm. Freq</TableHead>
                  <TableHead>Issues</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Next Action</TableHead>
                  <TableHead>Due Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stakeholders.map((sh) => (
                  <TableRow key={sh.stakeholderId} className={cn(sh.status === 'RED' && 'bg-destructive/5', sh.status === 'YELLOW' && 'bg-amber-50/50 dark:bg-amber-950/10')}>
                    <TableCell className="font-medium">{sh.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{sh.role}</TableCell>
                    <TableCell><Badge variant="outline">{sh.interest}</Badge></TableCell>
                    <TableCell>
                      <Select value={sh.realEngagementLevel} onValueChange={(v) => handleUpdate(sh.stakeholderId, 'realEngagementLevel', v)}>
                        <SelectTrigger className="h-7 text-xs w-32"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="HIGHLY_ENGAGED">Highly Engaged</SelectItem>
                          <SelectItem value="ENGAGED">Engaged</SelectItem>
                          <SelectItem value="INFORMED">Informed</SelectItem>
                          <SelectItem value="AT_RISK">At Risk</SelectItem>
                          <SelectItem value="DISENGAGED">Disengaged</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Slider value={[sh.satisfactionLevel]} onValueChange={([v]) => handleUpdate(sh.stakeholderId, 'satisfactionLevel', v)} min={1} max={5} className="w-20" />
                      <span className="text-xs ml-1">{sh.satisfactionLevel}/5</span>
                    </TableCell>
                    <TableCell>
                      <Select value={sh.communicationFrequency} onValueChange={(v) => handleUpdate(sh.stakeholderId, 'communicationFrequency', v)}>
                        <SelectTrigger className="h-7 text-xs w-24"><SelectValue /></SelectTrigger>
                        <SelectContent className="bg-popover border shadow-lg z-50">
                          <SelectItem value="DAILY">Daily</SelectItem>
                          <SelectItem value="WEEKLY">Weekly</SelectItem>
                          <SelectItem value="MONTHLY">Monthly</SelectItem>
                          <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className={cn(sh.issuesRaised > 0 && 'text-destructive font-medium')}>{sh.issuesRaised}</TableCell>
                    <TableCell>{getStatusBadge(sh.status)}</TableCell>
                    <TableCell><Input value={sh.nextActionItem} onChange={(e) => handleUpdate(sh.stakeholderId, 'nextActionItem', e.target.value)} className="h-7 text-xs w-32" /></TableCell>
                    <TableCell>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="h-7 text-xs w-24">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {sh.actionDueDate ? format(parseISO(sh.actionDueDate), 'dd/MM') : 'Set'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={sh.actionDueDate ? parseISO(sh.actionDueDate) : undefined} onSelect={(d) => d && handleUpdate(sh.stakeholderId, 'actionDueDate', format(d, 'yyyy-MM-dd'))} className="p-3 pointer-events-auto" />
                        </PopoverContent>
                      </Popover>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
