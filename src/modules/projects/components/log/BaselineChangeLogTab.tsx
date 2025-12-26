import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { 
  Search, 
  Download, 
  Filter, 
  CheckCircle, 
  XCircle, 
  Clock,
  FileText,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { BaselineChangeLog, ChangeStatus, MOCK_BASELINE_CHANGES } from './types';

interface BaselineChangeLogTabProps {
  projectId: string;
  changes?: BaselineChangeLog[];
}

const getStatusBadge = (status: ChangeStatus) => {
  switch (status) {
    case 'approved':
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case 'rejected':
      return (
        <Badge className="bg-destructive/10 text-destructive border-destructive/20">
          <XCircle className="w-3 h-3 mr-1" />
          Rejected
        </Badge>
      );
    case 'pending':
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
  }
};

export function BaselineChangeLogTab({ projectId, changes = MOCK_BASELINE_CHANGES }: BaselineChangeLogTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChangeStatus | 'all'>('all');
  const [selectedChange, setSelectedChange] = useState<BaselineChangeLog | null>(null);

  // Filter changes
  const filteredChanges = changes
    .filter(change => change.projectId === projectId || projectId === 'all')
    .filter(change => {
      if (statusFilter !== 'all' && change.status !== statusFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          change.fieldLabel.toLowerCase().includes(query) ||
          change.requestedByName.toLowerCase().includes(query) ||
          change.justification?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const handleExport = () => {
    // Export functionality
    const csvContent = [
      ['Field', 'Old Value', 'New Value', 'Requested By', 'Status', 'Version', 'Date'].join(','),
      ...filteredChanges.map(c => [
        c.fieldLabel,
        c.oldValue,
        c.newValue,
        c.requestedByName,
        c.status,
        `v${c.version}`,
        format(new Date(c.requestedAt), 'yyyy-MM-dd'),
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `baseline-changes-${projectId}-${format(new Date(), 'yyyyMMdd')}.csv`;
    a.click();
  };

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
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as ChangeStatus | 'all')}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card/50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Total Changes</span>
            </div>
            <p className="text-2xl font-bold mt-1">{filteredChanges.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-emerald-500/5 border-emerald-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-sm text-emerald-600">Approved</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-emerald-600">
              {filteredChanges.filter(c => c.status === 'approved').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-destructive/5 border-destructive/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-destructive" />
              <span className="text-sm text-destructive">Rejected</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-destructive">
              {filteredChanges.filter(c => c.status === 'rejected').length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-600">Pending</span>
            </div>
            <p className="text-2xl font-bold mt-1 text-amber-600">
              {filteredChanges.filter(c => c.status === 'pending').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Changes Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Ver.</TableHead>
                  <TableHead>Field Changed</TableHead>
                  <TableHead>Old Value</TableHead>
                  <TableHead></TableHead>
                  <TableHead>New Value</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Approved By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredChanges.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No baseline changes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredChanges.map((change) => (
                    <TableRow key={change.id} className="group">
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          v{change.version}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{change.fieldLabel}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[120px] truncate">
                        {change.oldValue}
                      </TableCell>
                      <TableCell className="px-1">
                        <ArrowRight className="w-4 h-4 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium text-primary max-w-[120px] truncate">
                        {change.newValue}
                      </TableCell>
                      <TableCell>{change.requestedByName}</TableCell>
                      <TableCell>
                        {change.approvedByName || (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(change.status)}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {format(new Date(change.requestedAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setSelectedChange(change)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedChange} onOpenChange={() => setSelectedChange(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Baseline Change Details
            </DialogTitle>
          </DialogHeader>
          {selectedChange && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono">v{selectedChange.version}</Badge>
                {getStatusBadge(selectedChange.status)}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Field</label>
                  <p className="font-medium">{selectedChange.fieldLabel}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Request Date</label>
                  <p className="font-medium">
                    {format(new Date(selectedChange.requestedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Old Value</label>
                    <p className="font-mono text-sm bg-destructive/10 text-destructive px-2 py-1 rounded mt-1">
                      {selectedChange.oldValue}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">New Value</label>
                    <p className="font-mono text-sm bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded mt-1">
                      {selectedChange.newValue}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Requested By</label>
                  <p className="font-medium">{selectedChange.requestedByName}</p>
                </div>
                {selectedChange.approvedByName && (
                  <div>
                    <label className="text-xs text-muted-foreground">
                      {selectedChange.status === 'approved' ? 'Approved By' : 'Reviewed By'}
                    </label>
                    <p className="font-medium">{selectedChange.approvedByName}</p>
                    {selectedChange.approvalDate && (
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(selectedChange.approvalDate), 'MMM dd, yyyy HH:mm')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {selectedChange.justification && (
                <div>
                  <label className="text-xs text-muted-foreground">Justification</label>
                  <p className="mt-1 text-sm p-3 bg-muted/30 rounded-lg border border-border">
                    {selectedChange.justification}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default BaselineChangeLogTab;
