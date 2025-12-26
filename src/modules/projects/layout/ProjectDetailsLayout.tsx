import React, { useMemo } from 'react';
import { useParams, useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useProject } from '@/hooks/useProject';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types/project.types';

export interface ProjectDetailsContext {
  project: Project;
  isLocked: boolean;
}

export const ProjectDetailsLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: project, isLoading, error } = useProject(id || '');

  // Determine if project is locked
  const isLocked = useMemo(() => {
    if (!project) return false;
    return project.baseline_lock || project.statut_id === 'CLOT' || project.statut_id === 'SUSP';
  }, [project]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <h2 className="text-xl font-semibold text-foreground">Project Not Found</h2>
        <p className="text-muted-foreground mt-2">The project you're looking for doesn't exist.</p>
        <Button
          onClick={() => navigate('/app/projects')}
          className="mt-4"
        >
          Back to Projects
        </Button>
      </div>
    );
  }

  const isActivePath = (path: string) => {
    const basePath = `/app/projects/${id}`;
    if (path === 'plan') return location.pathname === `${basePath}` || location.pathname === `${basePath}/plan`;
    return location.pathname === `${basePath}/${path}`;
  };

  const outletContext: ProjectDetailsContext = {
    project,
    isLocked,
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex flex-col gap-2">
          <button
            onClick={() => navigate('/app/projects')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 font-medium w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">{project.libellé}</h1>
            {isLocked && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Locked
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">{project.code}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border bg-card">
        <div className="px-6">
          <nav className="flex gap-1">
            <Link
              to={`/app/projects/${id}/plan`}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActivePath('plan')
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Plan
            </Link>
            <Link
              to={`/app/projects/${id}/tracking`}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActivePath('tracking')
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Tracking
            </Link>
            <Link
              to={`/app/projects/${id}/history`}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                isActivePath('history')
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              History
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <Outlet context={outletContext} />
      </div>
    </div>
  );
};

export default ProjectDetailsLayout;