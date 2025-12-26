import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  ClipboardList, 
  Search, 
  Download, 
  ChevronDown,
  ChevronRight,
  Filter,
  CheckCircle,
  Clock,
  AlertOctagon,
} from 'lucide-react';
import { 
  Issue, 
  ISSUE_CATEGORIES, 
  ISSUE_PRIORITIES, 
  ISSUE_STATUSES,
  getIssuePriorityColor,
  getIssueStatusColor,
} from '../../types/risks-issues.types';
import { cn } from '@/lib/utils';
import { format, differenceInDays } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

interface IssuesTrackingTableProps {
  issues: Issue[];
  onUpdateIssue?: (issueId: string, updates: Partial<Issue>) => Promise<void>;
  onExport?: () => void;
}

export const IssuesTrackingTable: React.FC<IssuesTrackingTableProps> = ({
  issues,
  onUpdateIssue,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingProgress, setEditingProgress] = useState<{ [key: string]: number }>({});
  const [editingComments, setEditingComments] = useState<{ [key: string]: string }>({});

  // Filter issues
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = 
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }, [issues, searchQuery, statusFilter, priorityFilter, categoryFilter]);

  // Sort: blocked first, then by priority (high > medium > low), then by target date
  const sortedIssues = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...filteredIssues].sort((a, b) => {
      // Blocked issues first
      if (a.status === 'blocked' && b.status !== 'blocked') return -1;
      if (b.status === 'blocked' && a.status !== 'blocked') return 1;
      // Done issues last
      if (a.status === 'done' && b.status !== 'done') return 1;
      if (b.status === 'done' && a.status !== 'done') return -1;
      // By priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      // By target date
      return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
    });
  }, [filteredIssues]);

  const getDaysDisplay = (issue: Issue) => {
    if (issue.status === 'done') return '✓';
    if (issue.status === 'blocked') return 'BLOCKED';
    
    const days = differenceInDays(new Date(issue.targetDate), new Date());
    if (days < 0) return `${Math.abs(days)} overdue`;
    if (days === 0) return 'Today';
    return `${days}d`;
  };

  const handleUpdateProgress = async (issueId: string, progress: number) => {
    if (onUpdateIssue) {
      await onUpdateIssue(issueId, { progress });
    }
  };

  const handleStatusChange = async (issueId: string, newStatus: Issue['status']) => {
    if (onUpdateIssue) {
      await onUpdateIssue(issueId, { status: newStatus });
    }
  };

  const handleUpdateComments = async (issueId: string) => {
    if (onUpdateIssue && editingComments[issueId] !== undefined) {
      await onUpdateIssue(issueId, { trackingComments: editingComments[issueId] });
    }
  };

  const getStatusIcon = (status: Issue['status']) => {
    switch (status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked': return <AlertOctagon className="h-4 w-4 text-destructive" />;
      default: return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <ClipboardList className="h-5 w-5 text-primary" />
            Issues Tracking
            <Badge variant="outline" className="text-xs ml-2">
              {filteredIssues.length} of {issues.length}
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search issues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[180px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Status</SelectItem>
                {ISSUE_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Priority</SelectItem>
                {ISSUE_PRIORITIES.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[130px] bg-background">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Category</SelectItem>
                {ISSUE_CATEGORIES.map((c) => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead className="text-center">Days</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No issues found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                sortedIssues.map((issue, index) => (
                  <React.Fragment key={issue.id}>
                    <TableRow 
                      className={cn(
                        'cursor-pointer hover:bg-muted/50',
                        expandedRow === issue.id && 'bg-muted/30',
                        issue.status === 'blocked' && 'bg-destructive/5',
                        issue.status === 'done' && 'bg-emerald-500/5 opacity-70'
                      )}
                      onClick={() => setExpandedRow(expandedRow === issue.id ? null : issue.id)}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className={cn(
                        'font-medium',
                        issue.status === 'done' && 'line-through opacity-70'
                      )}>
                        {issue.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {ISSUE_CATEGORIES.find(c => c.value === issue.category)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn('text-xs', getIssuePriorityColor(issue.priority))}>
                          {ISSUE_PRIORITIES.find(p => p.value === issue.priority)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={issue.status} 
                          onValueChange={(v) => handleStatusChange(issue.id, v as Issue['status'])}
                        >
                          <SelectTrigger 
                            className={cn('h-8 w-[120px] bg-background', getIssueStatusColor(issue.status))} 
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span className="flex items-center gap-2">
                              {getStatusIcon(issue.status)}
                              <SelectValue />
                            </span>
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            {ISSUE_STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="text-sm">{issue.ownerName || '-'}</TableCell>
                      <TableCell className="text-center">
                        <span className={cn(
                          'text-xs font-medium',
                          issue.status === 'blocked' && 'text-destructive',
                          getDaysDisplay(issue).includes('overdue') && 'text-destructive'
                        )}>
                          {getDaysDisplay(issue)}
                        </span>
                      </TableCell>
                      <TableCell>
                        {expandedRow === issue.id ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    {expandedRow === issue.id && (
                      <TableRow>
                        <TableCell colSpan={8} className="p-4 bg-muted/20">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Description</p>
                                <p className="text-sm">{issue.description}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Planned Action</p>
                                <p className="text-sm">{issue.action}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Owner</p>
                                <p className="text-sm font-medium">{issue.ownerName || 'Unassigned'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Target Date</p>
                                <p className="text-sm font-medium">
                                  {issue.targetDate ? format(new Date(issue.targetDate), 'PPP') : '-'}
                                </p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-sm text-muted-foreground mb-1">Progress</p>
                                <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                  <Slider
                                    value={[editingProgress[issue.id] ?? issue.progress ?? 0]}
                                    onValueChange={(val) => setEditingProgress({ ...editingProgress, [issue.id]: val[0] })}
                                    onValueCommit={(val) => handleUpdateProgress(issue.id, val[0])}
                                    max={100}
                                    step={5}
                                    className="flex-1"
                                  />
                                  <span className="text-sm font-medium w-12 text-right">
                                    {editingProgress[issue.id] ?? issue.progress ?? 0}%
                                  </span>
                                </div>
                              </div>
                            </div>

                            {issue.status === 'blocked' && (
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Blocked Reason</p>
                                <Textarea
                                  value={issue.blockedReason || ''}
                                  onChange={(e) => onUpdateIssue?.(issue.id, { blockedReason: e.target.value })}
                                  placeholder="Explain why this issue is blocked..."
                                  rows={2}
                                  className="bg-destructive/5 border-destructive/20"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            )}

                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Tracking Comments</p>
                              <Textarea
                                value={editingComments[issue.id] ?? issue.trackingComments ?? ''}
                                onChange={(e) => setEditingComments({ ...editingComments, [issue.id]: e.target.value })}
                                onBlur={() => handleUpdateComments(issue.id)}
                                placeholder="Add tracking comments..."
                                rows={2}
                                onClick={(e) => e.stopPropagation()}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default IssuesTrackingTable;
