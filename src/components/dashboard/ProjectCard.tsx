import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import {
  ArrowUpRight,
  Calendar,
  DollarSign,
  Users,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

const healthColors = {
  healthy: 'bg-success/20 text-success border-success/30',
  'at-risk': 'bg-warning/20 text-warning border-warning/30',
  critical: 'bg-destructive/20 text-destructive border-destructive/30',
};

const statusColors = {
  draft: 'bg-muted text-muted-foreground',
  active: 'bg-primary/20 text-primary',
  'on-hold': 'bg-warning/20 text-warning',
  completed: 'bg-success/20 text-success',
  cancelled: 'bg-destructive/20 text-destructive',
};

export function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  const navigate = useNavigate();
  const budgetPercent = Math.round((project.spent / project.budget) * 100);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <Card
      className={cn(
        'glass-card group cursor-pointer',
        'hover:border-primary/40 hover:shadow-glow transition-all duration-300',
        'animate-fade-in-up opacity-0'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'forwards' }}
      onClick={() => navigate(`/app/projects/${project.id}/plan`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                {project.code}
              </span>
              <Badge
                variant="outline"
                className={cn('text-xs', healthColors[project.health])}
              >
                {project.health}
              </Badge>
            </div>
            <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
          </div>
          <ArrowUpRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-4 h-4" />
            <span>
              {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>{project.team.length} members</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground col-span-2">
            <Calendar className="w-4 h-4" />
            <span>
              {new Date(project.startDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}{' '}
              -{' '}
              {new Date(project.endDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Badge variant="outline" className={cn(statusColors[project.status])}>
            {project.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Baseline {project.baselineVersion}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}