import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import {
  MOCK_RISK_ISSUE_TYPES,
  MOCK_RISK_RESPONSE_TYPES,
  MOCK_RISK_RESPONSE_STATUSES,
  MOCK_ISSUE_STATUSES,
  MOCK_PRIORITY_SCALES,
} from '@/data/masterDataMock';
import type {
  RiskIssueType,
  RiskResponseType,
  RiskResponseStatus,
  IssueStatus,
  PriorityScale,
} from '@/types/masterData.types';
import { Lock, AlertTriangle, ArrowRight, ArrowDown } from 'lucide-react';

export default function RisksIssuesPage() {
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('');

  const handleEdit = (item: unknown, table: string) => {
    setEditItem(item as Record<string, unknown>);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleCreate = (table: string) => {
    setEditItem(null);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleSave = (data: Record<string, unknown>) => {
    console.log('Saving:', activeTable, data);
    setIsModalOpen(false);
    setEditItem(null);
  };

  const getFormFields = () => {
    switch (activeTable) {
      case 'risk-issue-type':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'priority-scale':
        return [
          {
            key: 'usage',
            label: 'Usage',
            type: 'select' as const,
            required: true,
            options: [
              { value: 'PRIORITE', label: 'Priority' },
              { value: 'IMPORTANCE', label: 'Importance' },
            ],
          },
          { key: 'score', label: 'Score (1-10)', type: 'number' as const, required: true },
          { key: 'libelle', label: 'Label', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'couleur_hex', label: 'Color (Hex)', type: 'text' as const, required: true },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      default:
        return [];
    }
  };

  const sortedRiskResponseStatuses = [...MOCK_RISK_RESPONSE_STATUSES].sort((a, b) => a.ordre_affichage - b.ordre_affichage);
  const sortedIssueStatuses = [...MOCK_ISSUE_STATUSES].sort((a, b) => a.ordre_affichage - b.ordre_affichage);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risks & Issues</h1>
          <p className="text-muted-foreground mt-1">
            Manage risk types, response strategies, and priority scales
          </p>
        </div>
      </div>

      <Tabs defaultValue="risk-issue-type" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="risk-issue-type">Types</TabsTrigger>
          <TabsTrigger value="risk-response-type">
            Response <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="risk-response-status">
            Risk Status <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="issue-status">
            Issue Status <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="priority-scale">Priority</TabsTrigger>
        </TabsList>

        <TabsContent value="risk-issue-type">
          <MasterDataTable<RiskIssueType>
            data={MOCK_RISK_ISSUE_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Type' },
              { key: 'description', label: 'Description' },
              {
                key: 'is_active',
                label: 'Status',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Risk & Issue Types"
            description="Categories of risks and issues"
            onEdit={(row) => handleEdit(row, 'risk-issue-type')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('risk-issue-type')}
            isFrozen={false}
            idKey="type_id"
          />
        </TabsContent>

        <TabsContent value="risk-response-type">
          <MasterDataTable<RiskResponseType>
            data={MOCK_RISK_RESPONSE_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Strategy' },
              { key: 'description', label: 'Description' },
            ]}
            title="Risk Response Types"
            description="Strategies for handling risks (fixed)"
            isFrozen={true}
            idKey="type_reponse_id"
          />
        </TabsContent>

        <TabsContent value="risk-response-status">
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Risk Response Workflow</h3>
                <Badge variant="outline" className="gap-1">
                  <Lock className="w-3 h-3" /> Read-Only
                </Badge>
              </div>
              
              {/* Workflow Visualization */}
              <div className="flex flex-col items-start gap-2 p-4 bg-muted/30 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">Not Planned</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline" className="px-3 py-1">Planned</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="destructive" className="px-3 py-1">Applied (Final)</Badge>
                </div>
                <div className="flex items-center gap-2 ml-[180px]">
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 ml-[148px]">
                  <Badge variant="secondary" className="px-3 py-1">Obsolete (Final)</Badge>
                </div>
              </div>
            </div>

            <MasterDataTable<RiskResponseStatus>
              data={sortedRiskResponseStatuses}
              columns={[
                { key: 'code', label: 'Code' },
                { key: 'libelle', label: 'Status' },
                { key: 'ordre_affichage', label: 'Order' },
                {
                  key: 'is_terminal',
                  label: 'Terminal',
                  render: (value) => (
                    <Badge variant={value ? 'destructive' : 'outline'}>
                      {value ? 'Final' : 'In Progress'}
                    </Badge>
                  ),
                },
              ]}
              title="Risk Response Statuses"
              description="Workflow statuses for risk responses (fixed)"
              isFrozen={true}
              idKey="statut_reponse_id"
            />
          </div>
        </TabsContent>

        <TabsContent value="issue-status">
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Issue Workflow</h3>
                <Badge variant="outline" className="gap-1">
                  <Lock className="w-3 h-3" /> Read-Only
                </Badge>
              </div>
              
              {/* Workflow Visualization */}
              <div className="flex flex-col items-start gap-2 p-4 bg-muted/30 rounded-lg mb-6">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="px-3 py-1">New</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Badge variant="outline" className="px-3 py-1">In Progress</Badge>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <Badge className="px-3 py-1 bg-green-600">Resolved (Final)</Badge>
                </div>
                <div className="flex items-center gap-2 ml-[220px]">
                  <ArrowDown className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2 ml-[180px]">
                  <Badge variant="destructive" className="px-3 py-1">Unresolved (Final)</Badge>
                </div>
              </div>
            </div>

            <MasterDataTable<IssueStatus>
              data={sortedIssueStatuses}
              columns={[
                { key: 'code', label: 'Code' },
                { key: 'libelle', label: 'Status' },
                { key: 'ordre_affichage', label: 'Order' },
                {
                  key: 'is_terminal',
                  label: 'Terminal',
                  render: (value) => (
                    <Badge variant={value ? 'destructive' : 'outline'}>
                      {value ? 'Final' : 'In Progress'}
                    </Badge>
                  ),
                },
              ]}
              title="Issue Statuses"
              description="Workflow statuses for issues (fixed)"
              isFrozen={true}
              idKey="statut_point_id"
            />
          </div>
        </TabsContent>

        <TabsContent value="priority-scale">
          <MasterDataTable<PriorityScale>
            data={MOCK_PRIORITY_SCALES}
            columns={[
              {
                key: 'score',
                label: 'Score',
                render: (value, row) => (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: (row as PriorityScale).couleur_hex }}
                    >
                      {String(value)}
                    </div>
                  </div>
                ),
              },
              { key: 'libelle', label: 'Label' },
              {
                key: 'usage',
                label: 'Usage',
                render: (value) => <Badge variant="outline">{String(value)}</Badge>,
              },
              {
                key: 'couleur_hex',
                label: 'Color',
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: String(value) }}
                    />
                    <span className="font-mono text-xs">{String(value)}</span>
                  </div>
                ),
              },
              { key: 'description', label: 'Description' },
            ]}
            title="Priority Scale"
            description="Priority and importance levels (1-10)"
            onEdit={(row) => handleEdit(row, 'priority-scale')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('priority-scale')}
            isFrozen={false}
            idKey="echelle_id"
          />
        </TabsContent>
      </Tabs>

      <MasterDataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editItem ? 'Edit Item' : 'Create Item'}
        fields={getFormFields()}
        initialData={editItem || undefined}
      />
    </div>
  );
}
