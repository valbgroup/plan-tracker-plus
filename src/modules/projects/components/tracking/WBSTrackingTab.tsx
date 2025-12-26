import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Save, 
  Loader2, 
  ChevronRight,
  ChevronDown,
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  FolderTree,
  User,
} from 'lucide-react';
import { WBSNode } from './types';

// Mock WBS data with hierarchy
const MOCK_WBS: WBSNode[] = [
  {
    workPackageId: 'wp-1',
    name: '1. Project Management',
    level: 0,
    parentId: null,
    plannedWork: 200,
    realWorkDone: 150,
    percentComplete: 75,
    status: 'ON_TRACK',
    responsiblePerson: 'John Doe',
    variance: 0,
    notes: '',
    totalPlanned: 200,
    totalReal: 150,
    totalPercent: 75,
    isExpanded: true,
    children: [
      {
        workPackageId: 'wp-1-1',
        name: '1.1 Planning & Coordination',
        level: 1,
        parentId: 'wp-1',
        plannedWork: 100,
        realWorkDone: 80,
        percentComplete: 80,
        status: 'ON_TRACK',
        responsiblePerson: 'John Doe',
        variance: 0,
        notes: '',
        totalPlanned: 100,
        totalReal: 80,
        totalPercent: 80,
        children: [],
      },
      {
        workPackageId: 'wp-1-2',
        name: '1.2 Risk Management',
        level: 1,
        parentId: 'wp-1',
        plannedWork: 100,
        realWorkDone: 70,
        percentComplete: 70,
        status: 'ON_TRACK',
        responsiblePerson: 'Jane Smith',
        variance: 0,
        notes: '',
        totalPlanned: 100,
        totalReal: 70,
        totalPercent: 70,
        children: [],
      },
    ],
  },
  {
    workPackageId: 'wp-2',
    name: '2. Analysis & Design',
    level: 0,
    parentId: null,
    plannedWork: 400,
    realWorkDone: 320,
    percentComplete: 80,
    status: 'ON_TRACK',
    responsiblePerson: 'Tech Lead',
    variance: 0,
    notes: '',
    totalPlanned: 400,
    totalReal: 320,
    totalPercent: 80,
    isExpanded: true,
    children: [
      {
        workPackageId: 'wp-2-1',
        name: '2.1 Requirements Analysis',
        level: 1,
        parentId: 'wp-2',
        plannedWork: 150,
        realWorkDone: 150,
        percentComplete: 100,
        status: 'ON_TRACK',
        responsiblePerson: 'BA Team',
        variance: 0,
        notes: 'Complete',
        totalPlanned: 150,
        totalReal: 150,
        totalPercent: 100,
        children: [],
      },
      {
        workPackageId: 'wp-2-2',
        name: '2.2 System Architecture',
        level: 1,
        parentId: 'wp-2',
        plannedWork: 150,
        realWorkDone: 120,
        percentComplete: 80,
        status: 'ON_TRACK',
        responsiblePerson: 'Architect',
        variance: 0,
        notes: '',
        totalPlanned: 150,
        totalReal: 120,
        totalPercent: 80,
        children: [],
      },
      {
        workPackageId: 'wp-2-3',
        name: '2.3 UI/UX Design',
        level: 1,
        parentId: 'wp-2',
        plannedWork: 100,
        realWorkDone: 50,
        percentComplete: 50,
        status: 'AT_RISK',
        responsiblePerson: 'Design Team',
        variance: 0,
        notes: 'Resource shortage',
        totalPlanned: 100,
        totalReal: 50,
        totalPercent: 50,
        children: [],
      },
    ],
  },
  {
    workPackageId: 'wp-3',
    name: '3. Development',
    level: 0,
    parentId: null,
    plannedWork: 800,
    realWorkDone: 320,
    percentComplete: 40,
    status: 'AT_RISK',
    responsiblePerson: 'Dev Lead',
    variance: 0,
    notes: '',
    totalPlanned: 800,
    totalReal: 320,
    totalPercent: 40,
    isExpanded: false,
    children: [
      {
        workPackageId: 'wp-3-1',
        name: '3.1 Backend Development',
        level: 1,
        parentId: 'wp-3',
        plannedWork: 400,
        realWorkDone: 180,
        percentComplete: 45,
        status: 'AT_RISK',
        responsiblePerson: 'Backend Team',
        variance: 0,
        notes: '',
        totalPlanned: 400,
        totalReal: 180,
        totalPercent: 45,
        children: [],
      },
      {
        workPackageId: 'wp-3-2',
        name: '3.2 Frontend Development',
        level: 1,
        parentId: 'wp-3',
        plannedWork: 400,
        realWorkDone: 140,
        percentComplete: 35,
        status: 'AT_RISK',
        responsiblePerson: 'Frontend Team',
        variance: 0,
        notes: '',
        totalPlanned: 400,
        totalReal: 140,
        totalPercent: 35,
        children: [],
      },
    ],
  },
  {
    workPackageId: 'wp-4',
    name: '4. Testing & QA',
    level: 0,
    parentId: null,
    plannedWork: 300,
    realWorkDone: 0,
    percentComplete: 0,
    status: 'ON_TRACK',
    responsiblePerson: 'QA Lead',
    variance: 0,
    notes: 'Not started yet',
    totalPlanned: 300,
    totalReal: 0,
    totalPercent: 0,
    isExpanded: false,
    children: [],
  },
];

const TEAM_MEMBERS = [
  'John Doe', 'Jane Smith', 'Bob Wilson', 'Tech Lead', 'Dev Lead', 
  'BA Team', 'Architect', 'Design Team', 'Backend Team', 'Frontend Team', 'QA Lead'
];

interface WBSTrackingTabProps {
  projectId: string;
}

export const WBSTrackingTab: React.FC<WBSTrackingTabProps> = ({ projectId }) => {
  const [wbsNodes, setWbsNodes] = useState<WBSNode[]>(MOCK_WBS);
  const [isSaving, setIsSaving] = useState(false);

  const metrics = useMemo(() => {
    const flatNodes = wbsNodes.flatMap(n => [n, ...n.children]);
    const totalPlanned = wbsNodes.reduce((sum, n) => sum + n.totalPlanned, 0);
    const totalReal = wbsNodes.reduce((sum, n) => sum + n.totalReal, 0);
    const avgPercent = Math.round(flatNodes.reduce((sum, n) => sum + n.percentComplete, 0) / flatNodes.length);
    const atRisk = flatNodes.filter(n => n.status === 'AT_RISK').length;
    const offTrack = flatNodes.filter(n => n.status === 'OFF_TRACK').length;
    
    return { totalPlanned, totalReal, avgPercent, atRisk, offTrack };
  }, [wbsNodes]);

  const updateNode = (nodeId: string, field: keyof WBSNode, value: unknown) => {
    const updateRecursive = (nodes: WBSNode[]): WBSNode[] => {
      return nodes.map(node => {
        if (node.workPackageId === nodeId) {
          const updated = { ...node, [field]: value };
          // Recalculate status based on progress
          if (field === 'percentComplete') {
            const percent = value as number;
            if (percent >= 80) updated.status = 'ON_TRACK';
            else if (percent >= 50) updated.status = 'AT_RISK';
            else if (percent > 0) updated.status = 'AT_RISK';
            else updated.status = 'ON_TRACK';
          }
          return updated;
        }
        if (node.children.length > 0) {
          return { ...node, children: updateRecursive(node.children) };
        }
        return node;
      });
    };
    setWbsNodes(updateRecursive(wbsNodes));
  };

  const toggleExpand = (nodeId: string) => {
    setWbsNodes(prev => prev.map(node => 
      node.workPackageId === nodeId 
        ? { ...node, isExpanded: !node.isExpanded }
        : node
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('WBS tracking data saved');
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ON_TRACK':
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"><CheckCircle className="w-3 h-3 mr-1" />On Track</Badge>;
      case 'AT_RISK':
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 text-xs"><AlertTriangle className="w-3 h-3 mr-1" />At Risk</Badge>;
      case 'OFF_TRACK':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20 text-xs"><XCircle className="w-3 h-3 mr-1" />Off Track</Badge>;
      default:
        return null;
    }
  };

  const renderNode = (node: WBSNode, depth: number = 0) => {
    const hasChildren = node.children.length > 0;
    const paddingLeft = depth * 24;

    return (
      <div key={node.workPackageId}>
        <div 
          className={cn(
            'flex items-center gap-3 p-3 border-b hover:bg-muted/50 transition-colors',
            node.status === 'AT_RISK' && 'bg-amber-50/50 dark:bg-amber-950/10',
            node.status === 'OFF_TRACK' && 'bg-destructive/5'
          )}
          style={{ paddingLeft: `${paddingLeft + 12}px` }}
        >
          {/* Expand/Collapse */}
          <div className="w-6">
            {hasChildren && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6"
                onClick={() => toggleExpand(node.workPackageId)}
              >
                {node.isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-[200px]">
            <span className={cn('font-medium', depth === 0 && 'text-base', depth > 0 && 'text-sm')}>
              {node.name}
            </span>
          </div>

          {/* Planned Work */}
          <div className="w-20 text-center">
            <span className="text-sm text-muted-foreground">{node.plannedWork}h</span>
          </div>

          {/* Real Work */}
          <div className="w-24">
            <Input
              type="number"
              value={node.realWorkDone ?? ''}
              onChange={(e) => updateNode(node.workPackageId, 'realWorkDone', parseInt(e.target.value) || 0)}
              className="h-8 text-sm"
              placeholder="Hours"
            />
          </div>

          {/* Progress */}
          <div className="w-36">
            <div className="space-y-1">
              <Slider
                value={[node.percentComplete]}
                onValueChange={([value]) => updateNode(node.workPackageId, 'percentComplete', value)}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="text-xs text-center text-muted-foreground">{node.percentComplete}%</div>
            </div>
          </div>

          {/* Responsible */}
          <div className="w-36">
            <Select
              value={node.responsiblePerson}
              onValueChange={(v) => updateNode(node.workPackageId, 'responsiblePerson', v)}
            >
              <SelectTrigger className="h-8 text-xs">
                <User className="w-3 h-3 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                {TEAM_MEMBERS.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="w-28">
            {getStatusBadge(node.status)}
          </div>

          {/* Notes */}
          <div className="w-40">
            <Input
              value={node.notes}
              onChange={(e) => updateNode(node.workPackageId, 'notes', e.target.value)}
              className="h-8 text-xs"
              placeholder="Notes..."
            />
          </div>
        </div>

        {/* Render children if expanded */}
        {hasChildren && node.isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Summary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Planned Work</div>
            <div className="text-2xl font-bold">{metrics.totalPlanned}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Actual Work</div>
            <div className="text-2xl font-bold">{metrics.totalReal}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Avg Progress</div>
            <div className="text-2xl font-bold">{metrics.avgPercent}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">At Risk</div>
            <div className="text-2xl font-bold text-amber-600">{metrics.atRisk}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-sm text-muted-foreground">Off Track</div>
            <div className="text-2xl font-bold text-destructive">{metrics.offTrack}</div>
          </CardContent>
        </Card>
      </div>

      {/* WBS Tree */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderTree className="w-5 h-5" />
              Work Breakdown Structure
            </CardTitle>
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              Save Changes
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Header Row */}
          <div className="flex items-center gap-3 p-3 border-b bg-muted/50 text-sm font-medium text-muted-foreground">
            <div className="w-6"></div>
            <div className="flex-1 min-w-[200px]">Work Package</div>
            <div className="w-20 text-center">Planned</div>
            <div className="w-24 text-center">Actual</div>
            <div className="w-36 text-center">Progress</div>
            <div className="w-36 text-center">Responsible</div>
            <div className="w-28 text-center">Status</div>
            <div className="w-40 text-center">Notes</div>
          </div>

          {/* WBS Nodes */}
          <div className="border rounded-b-lg">
            {wbsNodes.map(node => renderNode(node))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
