import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjects } from '@/hooks/useProject';
import { Project } from '@/types/project.types';
import { PageContainer } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CreateProjectWizard } from '../components/CreateProjectWizard';

const healthStatusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  'health-1': { label: 'Normal', color: 'bg-emerald-500', icon: CheckCircle },
  'health-2': { label: 'At Risk', color: 'bg-amber-500', icon: AlertCircle },
  'health-3': { label: 'Late', color: 'bg-orange-500', icon: Clock },
  'health-4': { label: 'Critical', color: 'bg-red-500', icon: AlertCircle },
};

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' | 'destructive' }> = {
  'status-1': { label: 'Init', variant: 'outline' },
  'status-2': { label: 'Planning', variant: 'secondary' },
  'status-3': { label: 'Execution', variant: 'default' },
  'status-4': { label: 'Closed', variant: 'outline' },
  'status-5': { label: 'Suspended', variant: 'destructive' },
};

export function ProjectListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: projects, isLoading } = useProjects();
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [healthFilter, setHealthFilter] = useState<string>('all');
  const [showWizard, setShowWizard] = useState(false);

  const filterParam = searchParams.get('filter');

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    
    let result = [...projects];

    // Apply URL filter param
    if (filterParam === 'active') {
      result = result.filter(p => p.statut_id === 'status-3');
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        p => 
          p.libellé.toLowerCase().includes(query) ||
          p.code.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(p => p.statut_id === statusFilter);
    }

    // Apply health filter
    if (healthFilter !== 'all') {
      result = result.filter(p => p.etat_sante_id === healthFilter);
    }

    return result;
  }, [projects, searchQuery, statusFilter, healthFilter, filterParam]);

  const handleProjectClick = (project: Project) => {
    navigate(`/projects/${project.project_id}/plan`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', { 
      style: 'decimal',
      maximumFractionDigits: 0,
    }).format(amount) + ' DZD';
  };

  const getProgress = (project: Project) => {
    if (project.nombre_livrables_planifies === 0) return 0;
    return Math.round((project.nombre_livrables_acceptes / project.nombre_livrables_planifies) * 100);
  };

  const getBudgetProgress = (project: Project) => {
    if (project.montant_budget_total === 0) return 0;
    return Math.round((project.budget_consomme / project.montant_budget_total) * 100);
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Projects</h1>
            <p className="text-muted-foreground">
              {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <Button onClick={() => setShowWizard(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="status-1">Init</SelectItem>
                <SelectItem value="status-2">Planning</SelectItem>
                <SelectItem value="status-3">Execution</SelectItem>
                <SelectItem value="status-4">Closed</SelectItem>
                <SelectItem value="status-5">Suspended</SelectItem>
              </SelectContent>
            </Select>

            <Select value={healthFilter} onValueChange={setHealthFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Health" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Health</SelectItem>
                <SelectItem value="health-1">Normal</SelectItem>
                <SelectItem value="health-2">At Risk</SelectItem>
                <SelectItem value="health-3">Late</SelectItem>
                <SelectItem value="health-4">Critical</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex rounded-md border border-input">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProjects.map((project) => {
              const health = healthStatusConfig[project.etat_sante_id] || healthStatusConfig['health-1'];
              const status = statusConfig[project.statut_id] || statusConfig['status-1'];
              const progress = getProgress(project);
              const budgetProgress = getBudgetProgress(project);
              const HealthIcon = health.icon;

              return (
                <Card 
                  key={project.project_id}
                  className="cursor-pointer hover:border-primary transition-colors"
                  onClick={() => handleProjectClick(project)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base line-clamp-1">
                          {project.libellé}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">{project.code}</p>
                      </div>
                      <div className={cn('w-3 h-3 rounded-full', health.color)} title={health.label} />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <HealthIcon className="w-3 h-3" />
                        {health.label}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Deliverables</span>
                        <span className="font-medium">{project.nombre_livrables_acceptes}/{project.nombre_livrables_planifies}</span>
                      </div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {format(new Date(project.date_fin_planifiée), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <DollarSign className="w-3 h-3" />
                        {budgetProgress}% used
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Health</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => {
                  const health = healthStatusConfig[project.etat_sante_id] || healthStatusConfig['health-1'];
                  const status = statusConfig[project.statut_id] || statusConfig['status-1'];
                  const progress = getProgress(project);
                  const HealthIcon = health.icon;

                  return (
                    <TableRow 
                      key={project.project_id}
                      className="cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">{project.libellé}</p>
                          <p className="text-xs text-muted-foreground">{project.code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={cn('w-2 h-2 rounded-full', health.color)} />
                          <span className="text-sm">{health.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">{progress}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatCurrency(project.budget_consomme)}</span>
                        <span className="text-xs text-muted-foreground"> / {formatCurrency(project.montant_budget_total)}</span>
                      </TableCell>
                      <TableCell>
                        {format(new Date(project.date_fin_planifiée), 'MMM dd, yyyy')}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}

        {filteredProjects.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No projects found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || statusFilter !== 'all' || healthFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first project to get started'}
              </p>
              <Button onClick={() => setShowWizard(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Project
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Project Creation Wizard Modal */}
      {showWizard && (
        <CreateProjectWizard
          onClose={() => setShowWizard(false)}
          onSuccess={() => setShowWizard(false)}
        />
      )}
    </PageContainer>
  );
}

export default ProjectListPage;
