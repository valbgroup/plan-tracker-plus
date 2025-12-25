import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Plus, GripVertical, X } from 'lucide-react';
import { toast } from 'sonner';

const widgets = ['My Projects', 'Urgent Tasks', 'Budget Overview', 'Risk Summary', 'Upcoming Milestones', 'Recent Activity'];
const activeWidgets = ['My Projects', 'Budget Overview', 'Risk Summary'];

export function DashboardCustomization() {
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-primary" />Dashboard Widgets</CardTitle>
          <CardDescription>Drag widgets to reorder. Click X to remove.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeWidgets.map((widget) => (
              <div key={widget} className="flex items-center justify-between p-4 rounded-lg border border-border bg-secondary/30">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                  <span className="font-medium">{widget}</span>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.success(`${widget} removed`)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Available Widgets</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {widgets.filter(w => !activeWidgets.includes(w)).map((widget) => (
              <Badge key={widget} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors" onClick={() => toast.success(`${widget} added`)}>
                <Plus className="w-3 h-3 mr-1" />{widget}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
