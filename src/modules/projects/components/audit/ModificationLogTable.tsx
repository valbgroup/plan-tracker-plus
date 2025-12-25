import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  RotateCcw, 
  Download, 
  Loader2,
  Search,
  CalendarIcon,
  Lock,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export type ActionType = 'Created' | 'Modified' | 'Deleted' | 'Validated' | 'Rejected';

export interface ModificationLogData {
  id: string;
  timestamp: Date;
  changedBy: string;
  changedByRole: string;
  actionType: ActionType;
  modifiedElement: string;
  oldValue: string;
  newValue: string;
  hasBaselineImpact: boolean;
  justification?: string;
}

interface ModificationLogTableProps {
  logs: ModificationLogData[];
  onRollback?: (logId: string) => Promise<void>;
  onExport?: (format: 'pdf' | 'excel' | 'csv', filters: any) => Promise<void>;
}

const ACTION_TYPE_CONFIG: Record<ActionType, { color: string }> = {
  Created: { color: 'bg-green-500 text-white' },
  Modified: { color: 'bg-blue-500 text-white' },
  Deleted: { color: 'bg-red-500 text-white' },
  Validated: { color: 'bg-purple-500 text-white' },
  Rejected: { color: 'bg-red-600 text-white' },
};

export const ModificationLogTable: React.FC<ModificationLogTableProps> = ({
  logs,
  onRollback,
  onExport,
}) => {
  const { isPMO } = useRBAC();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [elementFilter, setElementFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [rollbackLog, setRollbackLog] = useState<ModificationLogData | null>(null);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique elements for filter
  const uniqueElements = useMemo(() => {
    const elements = new Set(logs.map(l => l.modifiedElement.split('.')[0]));
    return Array.from(elements);
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search filter
      const searchMatch = 
        searchTerm === '' ||
        log.changedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.modifiedElement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.oldValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.newValue.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.justification?.toLowerCase().includes(searchTerm.toLowerCase()) || false);

      // Action filter
      const actionMatch = actionFilter === 'all' || log.actionType === actionFilter;

      // Element filter
      const elementMatch = elementFilter === 'all' || log.modifiedElement.startsWith(elementFilter);

      // Date filter
      const dateMatch = 
        (!startDate || log.timestamp >= startDate) &&
        (!endDate || log.timestamp <= endDate);

      return searchMatch && actionMatch && elementMatch && dateMatch;
    });
  }, [logs, searchTerm, actionFilter, elementFilter, startDate, endDate]);

  // Paginate
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredLogs.slice(start, start + rowsPerPage);
  }, [filteredLogs, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredLogs.length / rowsPerPage);

  const handleRollback = async () => {
    if (!rollbackLog || !onRollback) return;
    
    setIsRollingBack(true);
    try {
      await onRollback(rollbackLog.id);
      toast.success('Change rolled back successfully');
      setRollbackLog(null);
    } catch (error) {
      toast.error('Failed to rollback change');
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel' | 'csv') => {
    if (!onExport) return;
    
    setIsExporting(true);
    try {
      await onExport(format, { actionFilter, elementFilter, startDate, endDate, searchTerm });
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setActionFilter('all');
    setElementFilter('all');
    setStartDate(undefined);
    setEndDate(undefined);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm || actionFilter !== 'all' || elementFilter !== 'all' || startDate || endDate;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Modification Log</h4>
          <p className="text-sm text-muted-foreground">
            {filteredLogs.length} of {logs.length} entries
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
          >
            {isExporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 p-3 bg-muted/30 rounded-lg">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-8"
            />
          </div>
        </div>
        <Select value={actionFilter} onValueChange={setActionFilter}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Action" />
          </SelectTrigger>
          <SelectContent className="bg-popover border shadow-lg z-50">
            <SelectItem value="all">All Actions</SelectItem>
            {Object.keys(ACTION_TYPE_CONFIG).map(action => (
              <SelectItem key={action} value={action}>{action}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={elementFilter} onValueChange={setElementFilter}>
          <SelectTrigger className="w-[130px] h-8">
            <SelectValue placeholder="Element" />
          </SelectTrigger>
          <SelectContent className="bg-popover border shadow-lg z-50">
            <SelectItem value="all">All Elements</SelectItem>
            {uniqueElements.map(element => (
              <SelectItem key={element} value={element}>{element}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {startDate ? format(startDate, 'dd/MM') : 'Start'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={setStartDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="w-4 h-4 mr-2" />
              {endDate ? format(endDate, 'dd/MM') : 'End'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={setEndDate}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="h-8" onClick={clearFilters}>
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[140px]">Timestamp</TableHead>
              <TableHead className="w-[140px]">Changed By</TableHead>
              <TableHead className="w-[90px]">Action</TableHead>
              <TableHead className="w-[150px]">Element</TableHead>
              <TableHead className="w-[150px]">Old Value</TableHead>
              <TableHead className="w-[150px]">New Value</TableHead>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="w-[60px]">Undo</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No log entries found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedLogs.map((log) => (
                <TableRow key={log.id} className={log.hasBaselineImpact ? 'bg-amber-50/50 dark:bg-amber-950/10' : ''}>
                  <TableCell>
                    <span className="text-sm font-mono">
                      {format(log.timestamp, 'dd/MM/yyyy HH:mm:ss')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{log.changedBy}</p>
                      <p className="text-muted-foreground text-xs">{log.changedByRole}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={ACTION_TYPE_CONFIG[log.actionType].color}>
                      {log.actionType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-medium" title={log.modifiedElement}>
                      {log.modifiedElement.length > 25 
                        ? `${log.modifiedElement.substring(0, 25)}...` 
                        : log.modifiedElement}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono text-muted-foreground" title={log.oldValue}>
                      {log.oldValue.length > 20 
                        ? `${log.oldValue.substring(0, 20)}...` 
                        : log.oldValue || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-mono" title={log.newValue}>
                      {log.newValue.length > 20 
                        ? `${log.newValue.substring(0, 20)}...` 
                        : log.newValue || '-'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {log.hasBaselineImpact && (
                      <span title="Baseline Impact"><Lock className="w-4 h-4 text-amber-600" /></span>
                    )}
                  </TableCell>
                  <TableCell>
                    {log.actionType === 'Modified' && isPMO && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setRollbackLog(log)}
                        title="Rollback this change"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
            <Select value={String(rowsPerPage)} onValueChange={(v) => { setRowsPerPage(Number(v)); setCurrentPage(1); }}>
              <SelectTrigger className="w-[80px] h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover border shadow-lg z-50">
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="500">500</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Rollback Confirmation Dialog */}
      <Dialog open={!!rollbackLog} onOpenChange={() => setRollbackLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rollback Change</DialogTitle>
            <DialogDescription>
              This will reverse the following change:
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2 text-sm">
            <p><strong>Element:</strong> {rollbackLog?.modifiedElement}</p>
            <p><strong>From:</strong> {rollbackLog?.newValue}</p>
            <p><strong>To:</strong> {rollbackLog?.oldValue}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRollbackLog(null)}>
              Cancel
            </Button>
            <Button onClick={handleRollback} disabled={isRollingBack}>
              {isRollingBack && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Rollback
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
