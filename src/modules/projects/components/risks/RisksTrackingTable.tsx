import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  Search, 
  Download, 
  ChevronDown,
  ChevronRight,
  Filter,
} from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';

interface RisksTrackingTableProps {
  risks: Risk[];
  onUpdateRisk?: (riskId: string, updates: Partial<Risk>) => Promise<void>;
  onExport?: () => void;
}

export const RisksTrackingTable: React.FC<RisksTrackingTableProps> = ({
  risks,
  onUpdateRisk,
  onExport,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [editingComments, setEditingComments] = useState<{ [key: string]: string }>({});

  // Filter risks
  const filteredRisks = useMemo(() => {
    return risks.filter(risk => {
      const matchesSearch = 
        risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        risk.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || risk.status === statusFilter;
      const matchesType = typeFilter === 'all' || risk.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [risks, searchQuery, statusFilter, typeFilter]);

  // Sort by score (highest first)
  const sortedRisks = useMemo(() => {
    return [...filteredRisks].sort((a, b) => b.score - a.score);
  }, [filteredRisks]);

  // New risks (created in last 7 days)
  const newRisks = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return risks.filter(r => new Date(r.createdAt) > sevenDaysAgo);
  }, [risks]);

  const handleUpdateComments = async (riskId: string) => {
    if (onUpdateRisk && editingComments[riskId] !== undefined) {
      await onUpdateRisk(riskId, { trackingComments: editingComments[riskId] });
    }
  };

  const handleStatusChange = async (riskId: string, newStatus: Risk['status']) => {
    if (onUpdateRisk) {
      await onUpdateRisk(riskId, { status: newStatus });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Risks Tracking
            <Badge variant="outline" className="text-xs ml-2">
              {filteredRisks.length} of {risks.length}
            </Badge>
          </CardTitle>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search risks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-[200px]"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Status</SelectItem>
                {RISK_STATUSES.map((s) => (
                  <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all">All Types</SelectItem>
                {RISK_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
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

      <CardContent className="space-y-6">
        {/* Risks Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-center">Prob</TableHead>
                <TableHead className="text-center">Impact</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead>Response</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[40px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRisks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No risks found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                sortedRisks.map((risk, index) => (
                  <React.Fragment key={risk.id}>
                    <TableRow 
                      className={cn(
                        'cursor-pointer hover:bg-muted/50',
                        expandedRow === risk.id && 'bg-muted/30'
                      )}
                      onClick={() => setExpandedRow(expandedRow === risk.id ? null : risk.id)}
                    >
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium">{risk.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {RISK_TYPES.find(t => t.value === risk.type)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">{risk.probability}</TableCell>
                      <TableCell className="text-center">{risk.impact}</TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className={cn('font-bold', getRiskScoreColor(risk.score))}>
                          {risk.score}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {RISK_RESPONSES.find(r => r.value === risk.response)?.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Select 
                          value={risk.status} 
                          onValueChange={(v) => handleStatusChange(risk.id, v as Risk['status'])}
                        >
                          <SelectTrigger className="h-8 w-[120px] bg-background" onClick={(e) => e.stopPropagation()}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background z-50">
                            {RISK_STATUSES.map((s) => (
                              <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        {expandedRow === risk.id ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    {expandedRow === risk.id && (
                      <TableRow>
                        <TableCell colSpan={9} className="p-4 bg-muted/20">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Description</p>
                                <p className="text-sm">{risk.description}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground mb-1">Response Observation</p>
                                <p className="text-sm">{risk.observation}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-sm text-muted-foreground">Owner</p>
                                <p className="text-sm font-medium">{risk.ownerName || 'Unassigned'}</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Target Date</p>
                                <p className="text-sm font-medium">
                                  {risk.targetDate ? format(new Date(risk.targetDate), 'PPP') : '-'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Response Effectiveness</p>
                                <p className="text-sm font-medium">{risk.responseEffectiveness ?? '-'}%</p>
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">Actual Score</p>
                                <p className="text-sm font-medium">
                                  {risk.actualProbability && risk.actualImpact 
                                    ? risk.actualProbability * risk.actualImpact 
                                    : '-'}
                                </p>
                              </div>
                            </div>

                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Tracking Comments</p>
                              <Textarea
                                value={editingComments[risk.id] ?? risk.trackingComments ?? ''}
                                onChange={(e) => setEditingComments({ ...editingComments, [risk.id]: e.target.value })}
                                onBlur={() => handleUpdateComments(risk.id)}
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

        {/* New Risks Section */}
        {newRisks.length > 0 && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <h4 className="font-semibold text-amber-600 mb-2">New Risks Identified</h4>
            <ul className="space-y-1">
              {newRisks.map(risk => (
                <li key={risk.id} className="text-sm flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>{risk.title}</span>
                  <span className="text-muted-foreground">
                    (Added {format(new Date(risk.createdAt), 'MMM d, yyyy')})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RisksTrackingTable;
