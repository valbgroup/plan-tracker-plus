import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
import { useRBAC } from '@/hooks/useRBAC';
import { 
  Check,
  X,
  Eye,
  GitCompare,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export type ChangeType = 'MINOR' | 'MAJOR' | 'CRITICAL';
export type ChangeStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface ChangeRequestData {
  id: string;
  requestNumber: string;
  requestDate: Date;
  requestorName: string;
  requestorEmail: string;
  changeType: ChangeType;
  description: string;
  status: ChangeStatus;
  approverName?: string;
  approverEmail?: string;
  approvalComments?: string;
  affectedFields: string[];
  budgetImpact?: number;
  timelineImpact?: string;
  riskLevel: number;
}

interface ChangeRequestsTableProps {
  requests: ChangeRequestData[];
  isBaselineValidated: boolean;
  onApprove?: (requestId: string, comments: string) => Promise<void>;
  onReject?: (requestId: string, reason: string) => Promise<void>;
}

const CHANGE_TYPE_CONFIG: Record<ChangeType, { label: string; color: string }> = {
  MINOR: { label: 'Minor', color: 'bg-blue-500 text-white' },
  MAJOR: { label: 'Major', color: 'bg-orange-500 text-white' },
  CRITICAL: { label: 'Critical', color: 'bg-red-500 text-white' },
};

const STATUS_CONFIG: Record<ChangeStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'bg-yellow-500 text-white' },
  APPROVED: { label: 'Approved', color: 'bg-green-500 text-white' },
  REJECTED: { label: 'Rejected', color: 'bg-red-500 text-white' },
};

export const ChangeRequestsTable: React.FC<ChangeRequestsTableProps> = ({
  requests,
  isBaselineValidated,
  onApprove,
  onReject,
}) => {
  const { isPMO, checkPermission } = useRBAC();
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewRequest, setViewRequest] = useState<ChangeRequestData | null>(null);
  const [approveRequest, setApproveRequest] = useState<ChangeRequestData | null>(null);
  const [rejectRequest, setRejectRequest] = useState<ChangeRequestData | null>(null);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canApprove = checkPermission('canApproveChange');
  const canReject = checkPermission('canRejectChange');

  const filteredRequests = requests.filter(r => {
    const statusMatch = statusFilter === 'all' || r.status === statusFilter;
    const typeMatch = typeFilter === 'all' || r.changeType === typeFilter;
    return statusMatch && typeMatch;
  });

  const handleApprove = async () => {
    if (!approveRequest || !onApprove) return;
    
    setIsProcessing(true);
    try {
      await onApprove(approveRequest.id, comments);
      toast.success(`Change request ${approveRequest.requestNumber} approved`);
      setApproveRequest(null);
      setComments('');
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectRequest || !onReject) return;
    
    setIsProcessing(true);
    try {
      await onReject(rejectRequest.id, comments);
      toast.success(`Change request ${rejectRequest.requestNumber} rejected`);
      setRejectRequest(null);
      setComments('');
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isBaselineValidated) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="w-12 h-12 text-muted-foreground mb-4" />
        <h4 className="text-lg font-medium text-foreground">No Change Requests</h4>
        <p className="text-sm text-muted-foreground mt-2">
          Change requests are only available after the baseline is validated.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-md font-semibold text-foreground">Change Requests</h4>
          <p className="text-sm text-muted-foreground">
            {requests.filter(r => r.status === 'PENDING').length} pending requests
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border shadow-lg z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[130px] h-8">
              <SelectValue placeholder="Type" />
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
              <TableHead className="w-[100px]">Request #</TableHead>
              <TableHead className="w-[130px]">Date</TableHead>
              <TableHead className="w-[140px]">Requestor</TableHead>
              <TableHead className="w-[90px]">Type</TableHead>
              <TableHead className="w-[250px]">Description</TableHead>
              <TableHead className="w-[90px]">Status</TableHead>
              <TableHead className="w-[140px]">Approver</TableHead>
              <TableHead className="w-[140px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRequests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                  No change requests found.
                </TableCell>
              </TableRow>
            ) : (
              filteredRequests.map((request) => (
                <TableRow key={request.id} className={request.status === 'PENDING' ? 'bg-yellow-50/50 dark:bg-yellow-950/10' : ''}>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {request.requestNumber}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {format(request.requestDate, 'dd/MM/yyyy HH:mm')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{request.requestorName}</p>
                      <p className="text-muted-foreground text-xs">{request.requestorEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={CHANGE_TYPE_CONFIG[request.changeType].color}>
                      {CHANGE_TYPE_CONFIG[request.changeType].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm" title={request.description}>
                      {request.description.length > 60 
                        ? `${request.description.substring(0, 60)}...` 
                        : request.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge className={STATUS_CONFIG[request.status].color}>
                      {STATUS_CONFIG[request.status].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {request.approverName ? (
                      <div className="text-sm">
                        <p className="font-medium">{request.approverName}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Pending Assignment</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setViewRequest(request)}
                        title="View Impact"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'PENDING' && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-green-600 hover:text-green-700"
                            onClick={() => canApprove && setApproveRequest(request)}
                            disabled={!canApprove}
                            title={canApprove ? 'Approve' : 'PMO access required'}
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-600 hover:text-red-700"
                            onClick={() => canReject && setRejectRequest(request)}
                            disabled={!canReject}
                            title={canReject ? 'Reject' : 'PMO access required'}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* View Impact Dialog */}
      <Dialog open={!!viewRequest} onOpenChange={() => setViewRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Change Impact Analysis</DialogTitle>
            <DialogDescription>
              Request: {viewRequest?.requestNumber}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                {viewRequest && (
                  <Badge className={CHANGE_TYPE_CONFIG[viewRequest.changeType].color}>
                    {CHANGE_TYPE_CONFIG[viewRequest.changeType].label}
                  </Badge>
                )}
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Risk Level</p>
                <p className="font-medium">{viewRequest?.riskLevel}/10</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{viewRequest?.description}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Fields Affected ({viewRequest?.affectedFields.length})
              </p>
              <div className="border rounded p-2 max-h-[100px] overflow-y-auto">
                {viewRequest?.affectedFields.map((field, idx) => (
                  <p key={idx} className="text-sm py-0.5">• {field}</p>
                ))}
              </div>
            </div>
            {viewRequest?.budgetImpact !== undefined && (
              <div>
                <p className="text-sm text-muted-foreground">Budget Impact</p>
                <p className={cn(
                  'font-medium',
                  viewRequest.budgetImpact > 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  {viewRequest.budgetImpact > 0 ? '+' : ''}{viewRequest.budgetImpact.toLocaleString()} DZD
                </p>
              </div>
            )}
            {viewRequest?.timelineImpact && (
              <div>
                <p className="text-sm text-muted-foreground">Timeline Impact</p>
                <p className="font-medium">{viewRequest.timelineImpact}</p>
              </div>
            )}
            {viewRequest?.approvalComments && (
              <div>
                <p className="text-sm text-muted-foreground">Approval Comments</p>
                <p className="text-sm">{viewRequest.approvalComments}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setViewRequest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={!!approveRequest} onOpenChange={() => { setApproveRequest(null); setComments(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve {approveRequest?.requestNumber}?</DialogTitle>
            <DialogDescription>
              This will create a new baseline version.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-2">
              <strong>Type:</strong> {approveRequest && CHANGE_TYPE_CONFIG[approveRequest.changeType].label}
            </p>
            <p className="text-sm mb-4">{approveRequest?.description}</p>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add approval comments (required)..."
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">{comments.length}/500</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setApproveRequest(null); setComments(''); }}>
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isProcessing || !comments.trim()} className="bg-green-600 hover:bg-green-700">
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={!!rejectRequest} onOpenChange={() => { setRejectRequest(null); setComments(''); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject {rejectRequest?.requestNumber}?</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm mb-4">{rejectRequest?.description}</p>
            <Textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Reason for rejection (required)..."
              maxLength={500}
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">{comments.length}/500</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectRequest(null); setComments(''); }}>
              Cancel
            </Button>
            <Button onClick={handleReject} disabled={isProcessing || !comments.trim()} variant="destructive">
              {isProcessing && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
