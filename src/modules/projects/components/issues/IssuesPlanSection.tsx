import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { ClipboardList, Plus, Loader2 } from 'lucide-react';
import { IssueFormModal } from './IssueFormModal';
import { IssueCard } from './IssueCard';
import { Issue } from '../../types/risks-issues.types';
import { toast } from 'sonner';

interface IssuesPlanSectionProps {
  issues: Issue[];
  onAddIssue: (issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onUpdateIssue: (issueId: string, issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onDeleteIssue: (issueId: string) => Promise<void>;
  employees: { id: string; name: string }[];
  phases?: { id: string; title: string }[];
  deliverables?: { id: string; title: string }[];
  disabled?: boolean;
}

export const IssuesPlanSection: React.FC<IssuesPlanSectionProps> = ({
  issues,
  onAddIssue,
  onUpdateIssue,
  onDeleteIssue,
  employees,
  phases = [],
  deliverables = [],
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<Issue | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; issueId: string | null }>({
    isOpen: false,
    issueId: null,
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Calculate summary stats
  const highPriority = issues.filter(i => i.priority === 'high' && i.status !== 'done').length;
  const blockedIssues = issues.filter(i => i.status === 'blocked').length;
  const doneIssues = issues.filter(i => i.status === 'done').length;

  const handleOpenModal = (issue?: Issue) => {
    setEditingIssue(issue || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIssue(null);
  };

  const handleSubmit = async (issueData: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      if (editingIssue) {
        await onUpdateIssue(editingIssue.id, issueData);
        toast.success('Issue updated successfully');
      } else {
        await onAddIssue(issueData);
        toast.success('Issue created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingIssue ? 'Failed to update issue' : 'Failed to create issue');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (issueId: string) => {
    setDeleteConfirm({ isOpen: true, issueId });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.issueId) return;
    
    setIsDeleting(true);
    try {
      await onDeleteIssue(deleteConfirm.issueId);
      toast.success('Issue deleted successfully');
      setDeleteConfirm({ isOpen: false, issueId: null });
    } catch (error) {
      toast.error('Failed to delete issue');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-primary" />
                Issues / Actions
              </CardTitle>
              <Badge variant="outline" className="text-xs">
                {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
              </Badge>
            </div>
            
            {!disabled && (
              <Button onClick={() => handleOpenModal()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Issue
              </Button>
            )}
          </div>

          {/* Summary Stats */}
          {issues.length > 0 && (
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive" />
                <span className="text-sm text-muted-foreground">High Priority: {highPriority}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="text-sm text-muted-foreground">Blocked: {blockedIssues}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-sm text-muted-foreground">Done: {doneIssues}</span>
              </div>
            </div>
          )}
        </CardHeader>
        
        <CardContent className="space-y-4">
          {issues.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No issues identified yet.</p>
              <p className="text-sm">Click "Add Issue" to log an issue or action item.</p>
            </div>
          ) : (
            issues.map((issue, index) => (
              <IssueCard
                key={issue.id}
                issue={issue}
                index={index}
                onEdit={handleOpenModal}
                onDelete={handleDeleteClick}
                disabled={disabled}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* Issue Form Modal */}
      <IssueFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={editingIssue}
        employees={employees}
        phases={phases}
        deliverables={deliverables}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirm.isOpen} onOpenChange={(open) => !open && setDeleteConfirm({ isOpen: false, issueId: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Issue</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this issue? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default IssuesPlanSection;
