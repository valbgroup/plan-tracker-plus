import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Search, 
  Download, 
  Filter, 
  ArrowRight,
  Users,
  FolderTree,
  AlertTriangle,
  AlertCircle,
  Wallet,
  Box,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OperationalChangeLog, MOCK_OPERATIONAL_CHANGES } from './types';

interface OperationalChangeLogTabProps {
  projectId: string;
  changes?: OperationalChangeLog[];
}

const getSectionIcon = (section: string) => {
  switch (section.toLowerCase()) {
    case 'stakeholders':
      return <Users className="w-4 h-4" />;
    case 'wbs':
      return <FolderTree className="w-4 h-4" />;
    case 'risks':
      return <AlertTriangle className="w-4 h-4" />;
    case 'issues':
      return <AlertCircle className="w-4 h-4" />;
    case 'budget':
      return <Wallet className="w-4 h-4" />;
    case 'resources':
      return <Box className="w-4 h-4" />;
    default:
      return <Box className="w-4 h-4" />;
  }
};

const getSectionColor = (section: string) => {
  switch (section.toLowerCase()) {
    case 'stakeholders':
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    case 'wbs':
      return 'bg-purple-500/10 text-purple-600 border-purple-500/20';
    case 'risks':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'issues':
      return 'bg-red-500/10 text-red-600 border-red-500/20';
    case 'budget':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'resources':
      return 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

export function OperationalChangeLogTab({ projectId, changes = MOCK_OPERATIONAL_CHANGES }: OperationalChangeLogTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState<string>('all');

  // Get unique sections
  const sections = Array.from(new Set(changes.map(c => c.section)));

  // Filter changes
  const filteredChanges = changes
    .filter(change => change.projectId === projectId || projectId === 'all')
    .filter(change => {
      if (sectionFilter !== 'all' && change.section !== sectionFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          change.fieldLabel.toLowerCase().includes(query) ||
          change.changedByName.toLowerCase().includes(query) ||
          change.section.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime());

  const handleExport = () => {
    const csvContent = [
      ['Section', 'Field', 'Old Value', 'New Value', 'Changed By', 'Date'].join(','),
      ...filteredChanges.map(c => [
        c.section,
        c.fieldLabel,
        c.oldValue,
        c.newValue,
        c.changedByName,
        format(new Date(c.changedAt), 'yyyy-MM-dd HH:mm'),
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `operational-changes-${projectId}-${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
  };

  // Group by date for timeline view
  const groupedByDate = filteredChanges.reduce((acc, change) => {
    const date = format(new Date(change.changedAt), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(change);
    return acc;
  }, {} as Record<string, OperationalChangeLog[]>);

  return (
    <div className="space-y-4">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-1 gap-3 w-full sm:w-auto">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search changes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={sectionFilter} onValueChange={setSectionFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Section" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sections</SelectItem>
              {sections.map(section => (
                <SelectItem key={section} value={section}>{section}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Section Summary */}
      <div className="flex flex-wrap gap-2">
        {sections.map(section => {
          const count = filteredChanges.filter(c => c.section === section).length;
          return (
            <Badge
              key={section}
              variant="outline"
              className={cn(
                'cursor-pointer transition-all',
                getSectionColor(section),
                sectionFilter === section && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
              )}
              onClick={() => setSectionFilter(sectionFilter === section ? 'all' : section)}
            >
              {getSectionIcon(section)}
              <span className="ml-1">{section}</span>
              <span className="ml-1 opacity-70">({count})</span>
            </Badge>
          );
        })}
      </div>

      {/* Timeline View */}
      <Card>
        <CardContent className="pt-6">
          {Object.keys(groupedByDate).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No operational changes found
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByDate).map(([date, dateChanges]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-px flex-1 bg-border" />
                    <span className="text-xs font-medium text-muted-foreground px-2">
                      {format(new Date(date), 'EEEE, MMMM d, yyyy')}
                    </span>
                    <div className="h-px flex-1 bg-border" />
                  </div>
                  
                  <div className="space-y-3">
                    {dateChanges.map((change) => (
                      <div
                        key={change.id}
                        className="flex items-start gap-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className={cn(
                          'p-2 rounded-lg',
                          getSectionColor(change.section)
                        )}>
                          {getSectionIcon(change.section)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-xs">
                              {change.section}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(change.changedAt), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <p className="font-medium text-sm">{change.fieldLabel}</p>
                          
                          <div className="flex items-center gap-2 mt-1 text-sm">
                            <span className="text-muted-foreground line-through">{change.oldValue}</span>
                            <ArrowRight className="w-3 h-3 text-muted-foreground" />
                            <span className="text-primary font-medium">{change.newValue}</span>
                          </div>
                        </div>
                        
                        <div className="text-right text-sm">
                          <p className="font-medium">{change.changedByName}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(change.changedAt), 'HH:mm')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default OperationalChangeLogTab;
