import { useState } from 'react';
import { PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Users,
  DollarSign,
  ArrowUpRight,
  LayoutGrid,
  List,
  ChevronDown,
} from 'lucide-react';
import { mockProjects } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Project } from '@/types';

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

export function ProjectListPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesHealth = healthFilter === 'all' || project.health === healthFilter;
    return matchesSearch && matchesStatus && matchesHealth;
  });

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const ProjectGridCard = ({ project, index }: { project: Project; index: number }) => (
    <Card
      className={cn(
        'glass-card group cursor-pointer',
        'hover:border-primary/40 hover:shadow-glow transition-all duration-300',
        'animate-fade-in-up opacity-0'
      )}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'forwards' }}
      onClick={() => navigate(`/projects/${project.id}/plan`)}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-xs font-mono text-muted-foreground">{project.code}</span>
            <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {project.name}
            </h3>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View Details</DropdownMenuItem>
              <DropdownMenuItem>Edit Project</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className={cn('text-xs', healthColors[project.health])}>
            {project.health}
          </Badge>
          <Badge variant="outline" className={cn('text-xs', statusColors[project.status])}>
            {project.status}
          </Badge>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {formatCurrency(project.spent)} / {formatCurrency(project.budget)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {project.team.length} members
            </div>
            <div className="flex items-center gap-1 col-span-2">
              <Calendar className="w-3 h-3" />
              {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            Baseline {project.baselineVersion}
          </span>
          <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </CardContent>
    </Card>
  );

  const ProjectListRow = ({ project, index }: { project: Project; index: number }) => (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-lg glass-card cursor-pointer',
        'hover:border-primary/40 hover:shadow-glow transition-all duration-300',
        'animate-slide-in-left opacity-0'
      )}
      style={{ animationDelay: `${index * 30}ms`, animationFillMode: 'forwards' }}
      onClick={() => navigate(`/projects/${project.id}/plan`)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground">{project.code}</span>
          <h3 className="font-medium text-foreground truncate">{project.name}</h3>
          <Badge variant="outline" className={cn('text-xs', healthColors[project.health])}>
            {project.health}
          </Badge>
          <Badge variant="outline" className={cn('text-xs', statusColors[project.status])}>
            {project.status}
          </Badge>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="w-32">
          <div className="flex justify-between mb-1">
            <span>{project.progress}%</span>
          </div>
          <Progress value={project.progress} className="h-1.5" />
        </div>

        <div className="w-24 text-right">
          {formatCurrency(project.spent)}
        </div>

        <div className="w-20 text-right">
          {project.team.length} team
        </div>

        <div className="w-28 text-right">
          {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Archive</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <PageContainer
      title="Projects"
      description={`${filteredProjects.length} projects total`}
      actions={
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          New Project
        </Button>
      }
    >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between animate-fade-in">
        <div className="flex flex-1 gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-10 bg-secondary border-border"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 bg-secondary border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={healthFilter} onValueChange={setHealthFilter}>
            <SelectTrigger className="w-36 bg-secondary border-border">
              <SelectValue placeholder="Health" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Health</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="at-risk">At Risk</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Project Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProjects.map((project, index) => (
            <ProjectGridCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {/* List Header */}
          <div className="flex items-center gap-4 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <div className="flex-1">Project</div>
            <div className="w-32">Progress</div>
            <div className="w-24 text-right">Budget</div>
            <div className="w-20 text-right">Team</div>
            <div className="w-28 text-right">Due Date</div>
            <div className="w-8" />
          </div>
          {filteredProjects.map((project, index) => (
            <ProjectListRow key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No projects found matching your criteria.</p>
        </div>
      )}
    </PageContainer>
  );
}

export default ProjectListPage;
