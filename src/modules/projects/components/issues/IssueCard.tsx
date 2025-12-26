import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  ClipboardList, 
  Calendar, 
  Edit2, 
  Trash2, 
  User,
  ChevronDown,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertOctagon,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
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

interface IssueCardProps {
  issue: Issue;
  index: number;
  onEdit: (issue: Issue) => void;
  onDelete: (issueId: string) => void;
  disabled?: boolean;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  index,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const categoryLabel = ISSUE_CATEGORIES.find(c => c.value === issue.category)?.label || issue.category;
  const priorityLabel = ISSUE_PRIORITIES.find(p => p.value === issue.priority)?.label || issue.priority;
  const statusLabel = ISSUE_STATUSES.find(s => s.value === issue.status)?.label || issue.status;

  const daysUntilTarget = issue.targetDate 
    ? differenceInDays(new Date(issue.targetDate), new Date())
    : null;

  const getStatusIcon = () => {
    switch (issue.status) {
      case 'done': return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-500" />;
      case 'blocked': return <AlertOctagon className="h-4 w-4 text-destructive" />;
      default: return <ClipboardList className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className={cn(
      'transition-all duration-200',
      issue.status === 'blocked' && 'border-destructive/30',
      issue.priority === 'high' && issue.status !== 'done' && 'border-destructive/30'
    )}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-4">
            <CollapsibleTrigger className="flex items-start gap-3 flex-1 text-left hover:opacity-80">
              <div className="flex items-center gap-2 mt-0.5">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                {getStatusIcon()}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                  <h4 className="font-semibold text-foreground">{issue.title}</h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{categoryLabel}</Badge>
                  <Badge variant="outline" className={cn('text-xs', getIssuePriorityColor(issue.priority))}>
                    {priorityLabel}
                  </Badge>
                  <Badge variant="outline" className={cn('text-xs', getIssueStatusColor(issue.status))}>
                    {statusLabel}
                  </Badge>
                  {daysUntilTarget !== null && issue.status !== 'done' && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        'text-xs',
                        daysUntilTarget < 0 && 'bg-destructive/10 text-destructive border-destructive/20',
                        daysUntilTarget >= 0 && daysUntilTarget <= 3 && 'bg-amber-500/10 text-amber-600 border-amber-500/20'
                      )}
                    >
                      {daysUntilTarget < 0 
                        ? `${Math.abs(daysUntilTarget)} days overdue`
                        : daysUntilTarget === 0 
                          ? 'Due today'
                          : `${daysUntilTarget} days left`}
                    </Badge>
                  )}
                </div>
              </div>
            </CollapsibleTrigger>

            {!disabled && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(issue)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(issue.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CollapsibleContent>
          <CardContent className="pt-0 pb-4">
            <div className="space-y-3 text-sm pl-9">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-muted-foreground">Description:</span>
                  <p className="text-foreground">{issue.description}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Planned Action:</span>
                  <p className="text-foreground">{issue.action}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{issue.ownerName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">
                    {issue.targetDate ? format(new Date(issue.targetDate), 'PPP') : '-'}
                  </span>
                </div>
              </div>

              {issue.progress !== undefined && (
                <div>
                  <span className="text-muted-foreground">Progress:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all" 
                        style={{ width: `${issue.progress}%` }} 
                      />
                    </div>
                    <span className="text-xs font-medium">{issue.progress}%</span>
                  </div>
                </div>
              )}

              {issue.status === 'blocked' && issue.blockedReason && (
                <div className="p-2 bg-destructive/10 border border-destructive/20 rounded-md">
                  <span className="text-destructive font-medium">Blocked Reason:</span>
                  <p className="text-destructive/80">{issue.blockedReason}</p>
                </div>
              )}

              {(issue.linkedPhaseId || issue.linkedDeliverableId) && (
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  {issue.linkedPhaseId && (
                    <span className="text-xs text-muted-foreground">
                      Linked to Phase: <span className="font-medium text-foreground">{issue.linkedPhaseId}</span>
                    </span>
                  )}
                  {issue.linkedDeliverableId && (
                    <span className="text-xs text-muted-foreground">
                      Linked to Deliverable: <span className="font-medium text-foreground">{issue.linkedDeliverableId}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default IssueCard;
