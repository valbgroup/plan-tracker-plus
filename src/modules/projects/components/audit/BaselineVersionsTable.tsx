import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { useRBAC } from '@/hooks/useRBAC';
import { 
  GitCompare, 
  Eye, 
  RotateCcw, 
  Download, 
  Loader2,
  FileText,
  FileSpreadsheet,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export type ChangeCategory = 'STRUCTURAL' | 'BUDGETARY' | 'PLANNING' | 'GOVERNANCE' | 'MIXED';
export type VersionStatus = 'ACTIVE' | 'ARCHIVED' | 'SUSPENDED' | 'REJECTED';

export interface BaselineVersionData {
  id: string;
  versionNumber: string;
  createdDate: Date;
  createdBy: string;
  createdByEmail: string;
  changeType: ChangeCategory;
  modifiedItemsCount: number;
  modifiedItems: string[];
  justification: string;
  status: VersionStatus;
  businessImpact: number;
}

interface BaselineVersionsTableProps {
  versions: BaselineVersionData[];
  onRestore?: (versionId: string) => Promise<void>;
  onExport?: (versionId: string, format: 'pdf' | 'excel' | 'csv') => Promise<void>;
}

const CHANGE_TYPE_CONFIG: Record<ChangeCategory, { label: string; color: string }> = {
  STRUCTURAL: { label: 'Structural', color: 'bg-red-500 text-white' },
  BUDGETARY: { label: 'Budgetary', color: 'bg-orange-500 text-white' },
  PLANNING: { label: 'Planning', color: 'bg-blue-500 text-white' },
  GOVERNANCE: { label: 'Governance', color: 'bg-purple-500 text-white' },
  MIXED: { label: 'Mixed', color: 'bg-gray-500 text-white' },
};

const STATUS_CONFIG: Record<VersionStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Active', color: 'bg-green-500 text-white' },
  ARCHIVED: { label: 'Archived', color: 'bg-gray-400 text-white' },
  SUSPENDED: { label: 'Suspended', color: 'bg-orange-400 text-white' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500 text-white' },
};

export const BaselineVersionsTable: React.FC<BaselineVersionsTableProps> = ({
  versions,
  onRestore,
  onExport,
}) => {
  const { isPMO, checkPermission } = useRBAC();
  const [compareVersion, setCompareVersion] = useState<BaselineVersionData | null>(null);
  const [viewVersion, setViewVersion] = useState<BaselineVersionData | null>(null);
  const [restoreVersion, setRestoreVersion] = useState<BaselineVersionData | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const canRestore = checkPermission('canRestoreBaseline');

  const filteredVersions = versions.filter(v => {
    if (filterType === 'all') return true;
    return v.changeType === filterType;
  });

  const handleRestore = async () => {
    if (!restoreVersion || !onRestore) return;
    
    setIsRestoring(true);
    try {
      await onRestore(restoreVersion.id);
      toast.success(`Baseline ${restoreVersion.versionNumber} restored successfully`);
      setRestoreVersion(null);
    } catch (error) {
      toast.error('Failed to restore baseline');
    } finally {
      setIsRestoring(false);
    }
  };

  const handleExport = async (versionId: string, format: 'pdf' | 'excel' | 'csv') => {
    if (!onExport) return;
    
    setIsExporting(versionId);
    try {
      await onExport(versionId, format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Export failed');
    } finally {
      setIsExporting(null);
    }
  };

  const getImpactColor = (impact: number) => {
    if (impact <= 3) return 'bg-green-500';
    if (impact <= 7) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getVersionBadgeColor = (version: string) => {
    const majorVersion = parseInt(version.replace('V', '').split('.')[0]);
    if (majorVersion >= 2) return 'bg-blue-500 text-white';
    return 'bg-green-500 text-white';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Baseline Versions</h4>
          <p className="text-sm text-muted-foreground">
            {versions.length} version{versions.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px] h-8">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50">
              <SelectItem value="all">All Types</SelectItem>
              {Object.entries(CHANGE_TYPE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-[80px]">Version</TableHead>
              <TableHead className="w-[140px]">Created</TableHead>
              <TableHead className="w-[150px]">Created By</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Items</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="w-[120px]">Impact</TableHead>
              <TableHead className="w-[160px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredVersions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No baseline versions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredVersions.map((version) => (
                <TableRow key={version.id} className={version.status === 'ACTIVE' ? 'bg-green-50/50 dark:bg-green-950/10' : ''}>
                  <TableCell>
                    <Badge className={getVersionBadgeColor(version.versionNumber)}>
                      {version.versionNumber}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(version.createdDate, 'dd/MM/yyyy HH:mm')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{version.createdBy}</p>
                      <p className="text-muted-foreground text-xs">{version.createdByEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={CHANGE_TYPE_CONFIG[version.changeType].color}>
                      {CHANGE_TYPE_CONFIG[version.changeType].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => setViewVersion(version)}
                      className="text-sm text-primary hover:underline cursor-pointer"
                    >
                      {version.modifiedItemsCount} items
                    </button>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_CONFIG[version.status].color}>
                      {STATUS_CONFIG[version.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={version.businessImpact * 10} 
                        className={cn('h-2 w-16', getImpactColor(version.businessImpact))}
                      />
                      <span className="text-xs text-muted-foreground">
                        {version.businessImpact}/10
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setCompareVersion(version)}
                        title="Compare Versions"
                      >
                        <GitCompare className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setViewVersion(version)}
                        title="View Version"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => canRestore && setRestoreVersion(version)}
                        disabled={!canRestore || version.status === 'ACTIVE'}
                        title={canRestore ? 'Restore Version' : 'PMO access required'}
                      >
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleExport(version.id, 'pdf')}
                        disabled={isExporting === version.id}
                        title="Export"
                      >
                        {isExporting === version.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Compare Dialog */}
      <Dialog open={!!compareVersion} onOpenChange={() => setCompareVersion(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version Comparison: {compareVersion?.versionNumber}</DialogTitle>
            <DialogDescription>
              Comparing changes from previous version
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Field</TableHead>
                    <TableHead>Previous</TableHead>
                    <TableHead>Current</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {compareVersion?.modifiedItems.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">{item}</TableCell>
                      <TableCell className="bg-red-50 dark:bg-red-950/20 text-red-600">
                        <span className="line-through">Old value</span>
                      </TableCell>
                      <TableCell className="bg-green-50 dark:bg-green-950/20 text-green-600">
                        New value
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompareVersion(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={!!viewVersion} onOpenChange={() => setViewVersion(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Version Details: {viewVersion?.versionNumber}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="font-medium">{viewVersion?.createdDate && format(viewVersion.createdDate, 'dd/MM/yyyy HH:mm')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created By</p>
                <p className="font-medium">{viewVersion?.createdBy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Change Type</p>
                {viewVersion && (
                  <Badge className={CHANGE_TYPE_CONFIG[viewVersion.changeType].color}>
                    {CHANGE_TYPE_CONFIG[viewVersion.changeType].label}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                {viewVersion && (
                  <Badge className={STATUS_CONFIG[viewVersion.status].color}>
                    {STATUS_CONFIG[viewVersion.status].label}
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Modified Items ({viewVersion?.modifiedItemsCount})</p>
              <div className="border rounded p-2 max-h-[150px] overflow-y-auto">
                {viewVersion?.modifiedItems.map((item, idx) => (
                  <p key={idx} className="text-sm py-1">• {item}</p>
                ))}
              </div>
            </div>
            {viewVersion?.justification && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Justification</p>
                <p className="text-sm">{viewVersion.justification}</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport(viewVersion?.id || '', 'pdf')}>
              <FileText className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport(viewVersion?.id || '', 'excel')}>
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button onClick={() => setViewVersion(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Confirmation Dialog */}
      <Dialog open={!!restoreVersion} onOpenChange={() => setRestoreVersion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Baseline {restoreVersion?.versionNumber}?</DialogTitle>
            <DialogDescription>
              This will revert all changes since this version and create a new version.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm">
              <strong>Restoring to:</strong> {restoreVersion?.versionNumber}
            </p>
            <p className="text-sm text-muted-foreground">
              A new version will be created with the restored state.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRestoreVersion(null)}>
              Cancel
            </Button>
            <Button onClick={handleRestore} disabled={isRestoring}>
              {isRestoring && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
