import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowRight,
  Eye,
  Shield,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRBAC } from '@/hooks/useRBAC';
import { toast } from 'sonner';
import { PendingChangeRequest, ChangeStatus, MOCK_PENDING_REQUESTS } from './types';

interface PendingChangeRequestsTabProps {
  projectId: string;
  requests?: PendingChangeRequest[];
  onApprove?: (requestId: string, comments?: string) => Promise<void>;
  onReject?: (requestId: string, reason: string) => Promise<void>;
}

export function PendingChangeRequestsTab({ 
  projectId, 
  requests: initialRequests = MOCK_PENDING_REQUESTS,
  onApprove,
  onReject,
}: PendingChangeRequestsTabProps) {
  const { isPMO, currentUser } = useRBAC();
  const [requests, setRequests] = useState(initialRequests);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<PendingChangeRequest | null>(null);
  const [actionDialog, setActionDialog] = useState<{
    type: 'approve' | 'reject';
    request: PendingChangeRequest;
  } | null>(null);
  const [comments, setComments] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter only pending requests
  const pendingRequests = requests
    .filter(r => r.status === 'pending')
    .filter(r => r.projectId === projectId || projectId === 'all')
    .filter(r => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          r.fieldLabel.toLowerCase().includes(query) ||
          r.requestedByName.toLowerCase().includes(query) ||
          r.justification?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime());

  const handleApprove = async () => {
    if (!actionDialog || actionDialog.type !== 'approve') return;
    
    setIsProcessing(true);
    try {
      if (onApprove) {
        await onApprove(actionDialog.request.id, comments);
      }
      
      // Update local state
      setRequests(prev => prev.map(r => 
        r.id === actionDialog.request.id 
          ? { ...r, status: 'approved' as ChangeStatus, approverComments: comments }
          : r
      ));
      
      toast.success('Change request approved', {
        description: `${actionDialog.request.fieldLabel} has been updated`,
      });
    } catch (error) {
      toast.error('Failed to approve request');
    } finally {
      setIsProcessing(false);
      setActionDialog(null);
      setComments('');
    }
  };

  const handleReject = async () => {
    if (!actionDialog || actionDialog.type !== 'reject') return;
    
    if (!comments.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    
    setIsProcessing(true);
    try {
      if (onReject) {
        await onReject(actionDialog.request.id, comments);
      }
      
      // Update local state
      setRequests(prev => prev.map(r => 
        r.id === actionDialog.request.id 
          ? { ...r, status: 'rejected' as ChangeStatus, approverComments: comments }
          : r
      ));
      
      toast.success('Change request rejected', {
        description: 'The requester will be notified',
      });
    } catch (error) {
      toast.error('Failed to reject request');
    } finally {
      setIsProcessing(false);
      setActionDialog(null);
      setComments('');
    }
  };

  return (
    <div className="space-y-4">
      {/* PMO Notice */}
      {!isPMO && (
        <Card className="bg-amber-500/5 border-amber-500/20">
          <CardContent className="flex items-center gap-3 py-4">
            <Shield className="w-5 h-5 text-amber-500" />
            <div>
              <p className="font-medium text-amber-600">View Only Access</p>
              <p className="text-sm text-muted-foreground">
                Only PMO members can approve or reject change requests
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
          <Clock className="w-4 h-4 mr-1" />
          {pendingRequests.length} Pending Approval{pendingRequests.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Requests Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Change</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Justification</TableHead>
                  {isPMO && <TableHead className="text-right">Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingRequests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isPMO ? 6 : 5} className="text-center py-12">
                      <div className="flex flex-col items-center gap-2">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                        <p className="font-medium">All caught up!</p>
                        <p className="text-sm text-muted-foreground">
                          No pending change requests to review
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pendingRequests.map((request) => (
                    <TableRow key={request.id} className="group">
                      <TableCell>
                        <span className="font-medium">{request.fieldLabel}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground max-w-[100px] truncate">
                            {request.oldValue}
                          </span>
                          <ArrowRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-primary font-medium max-w-[100px] truncate">
                            {request.newValue}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{request.requestedByName}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(request.requestedAt), { addSuffix: true })}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px]">
                        <p className="text-sm text-muted-foreground truncate">
                          {request.justification || '-'}
                        </p>
                      </TableCell>
                      {isPMO && (
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setSelectedRequest(request)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => setActionDialog({ type: 'approve', request })}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => setActionDialog({ type: 'reject', request })}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Change Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground">Field</label>
                  <p className="font-medium">{selectedRequest.fieldLabel}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Submitted</label>
                  <p className="font-medium">
                    {format(new Date(selectedRequest.requestedAt), 'MMM dd, yyyy HH:mm')}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Current Value</label>
                    <p className="font-mono text-sm bg-muted px-2 py-1 rounded mt-1">
                      {selectedRequest.oldValue}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <label className="text-xs text-muted-foreground">Proposed Value</label>
                    <p className="font-mono text-sm bg-primary/10 text-primary px-2 py-1 rounded mt-1">
                      {selectedRequest.newValue}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Requested By</label>
                <p className="font-medium">{selectedRequest.requestedByName}</p>
              </div>

              {selectedRequest.justification && (
                <div>
                  <label className="text-xs text-muted-foreground">Justification</label>
                  <p className="mt-1 text-sm p-3 bg-muted/30 rounded-lg border border-border">
                    {selectedRequest.justification}
                  </p>
                </div>
              )}

              {isPMO && (
                <DialogFooter className="gap-2">
                  <Button
                    variant="outline"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      setSelectedRequest(null);
                      setActionDialog({ type: 'reject', request: selectedRequest });
                    }}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => {
                      setSelectedRequest(null);
                      setActionDialog({ type: 'approve', request: selectedRequest });
                    }}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve/Reject Confirmation Dialog */}
      <AlertDialog open={!!actionDialog} onOpenChange={() => !isProcessing && setActionDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              {actionDialog?.type === 'approve' ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  Approve Change Request
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-destructive" />
                  Reject Change Request
                </>
              )}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {actionDialog && (
                  <div className="p-3 bg-muted/50 rounded-lg text-sm">
                    <p className="font-medium text-foreground">{actionDialog.request.fieldLabel}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-muted-foreground">{actionDialog.request.oldValue}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="text-primary font-medium">{actionDialog.request.newValue}</span>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    {actionDialog?.type === 'approve' ? 'Comments (optional)' : 'Reason for rejection *'}
                  </label>
                  <Textarea
                    placeholder={
                      actionDialog?.type === 'approve'
                        ? 'Add any comments for the requester...'
                        : 'Please explain why this request is being rejected...'
                    }
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                  />
                </div>

                {actionDialog?.type === 'approve' && (
                  <div className="flex items-start gap-2 p-3 bg-emerald-500/10 text-emerald-700 rounded-lg text-sm">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <p>
                      This will update the baseline value and increment the baseline version.
                      This action will be logged in the audit trail.
                    </p>
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
            {actionDialog?.type === 'approve' ? (
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={handleApprove}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Confirm Approval
              </Button>
            ) : (
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4 mr-2" />
                )}
                Confirm Rejection
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default PendingChangeRequestsTab;
