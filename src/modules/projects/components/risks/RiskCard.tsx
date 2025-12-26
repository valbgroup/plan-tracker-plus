import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  Calendar, 
  Edit2, 
  Trash2, 
  User,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Risk, 
  RISK_TYPES, 
  RISK_RESPONSES, 
  RISK_STATUSES,
  getRiskScoreColor,
  getRiskScoreLevel,
} from '../../types/risks-issues.types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface RiskCardProps {
  risk: Risk;
  index: number;
  onEdit: (risk: Risk) => void;
  onDelete: (riskId: string) => void;
  disabled?: boolean;
}

export const RiskCard: React.FC<RiskCardProps> = ({
  risk,
  index,
  onEdit,
  onDelete,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const typeLabel = RISK_TYPES.find(t => t.value === risk.type)?.label || risk.type;
  const responseLabel = RISK_RESPONSES.find(r => r.value === risk.response)?.label || risk.response;
  const statusLabel = RISK_STATUSES.find(s => s.value === risk.status)?.label || risk.status;

  return (
    <Card className={cn(
      'transition-all duration-200',
      getRiskScoreColor(risk.score).includes('destructive') && 'border-destructive/30'
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
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground">#{index + 1}</span>
                  <h4 className="font-semibold text-foreground">{risk.title}</h4>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-xs">{typeLabel}</Badge>
                  <Badge variant="outline" className={cn('text-xs', getRiskScoreColor(risk.score))}>
                    Score: {risk.score} ({getRiskScoreLevel(risk.score)})
                  </Badge>
                  <Badge variant="outline" className="text-xs">{statusLabel}</Badge>
                </div>
              </div>
            </CollapsibleTrigger>

            {!disabled && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(risk)}
                  className="h-8 w-8 p-0"
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(risk.id)}
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
                  <p className="text-foreground">{risk.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Probability:</span>
                    <span className="font-medium">{risk.probability}/5</span>
                    <span className="text-muted-foreground">×</span>
                    <span className="text-muted-foreground">Impact:</span>
                    <span className="font-medium">{risk.impact}/5</span>
                    <span className="text-muted-foreground">=</span>
                    <Badge variant="outline" className={cn('text-xs', getRiskScoreColor(risk.score))}>
                      {risk.score}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Response:</span>
                    <Badge variant="outline" className="text-xs">{responseLabel}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Owner:</span>
                  <span className="font-medium">{risk.ownerName || 'Unassigned'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">
                    {risk.targetDate ? format(new Date(risk.targetDate), 'PPP') : '-'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-muted-foreground">Observation:</span>
                <p className="text-foreground">{risk.observation}</p>
              </div>

              {(risk.linkedPhaseId || risk.linkedDeliverableId) && (
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  {risk.linkedPhaseId && (
                    <span className="text-xs text-muted-foreground">
                      Linked to Phase: <span className="font-medium text-foreground">{risk.linkedPhaseId}</span>
                    </span>
                  )}
                  {risk.linkedDeliverableId && (
                    <span className="text-xs text-muted-foreground">
                      Linked to Deliverable: <span className="font-medium text-foreground">{risk.linkedDeliverableId}</span>
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

export default RiskCard;
