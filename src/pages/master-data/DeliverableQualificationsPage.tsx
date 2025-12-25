import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import {
  MOCK_DELIVERABLE_TYPES,
  MOCK_DELIVERABLE_STATUSES,
} from '@/data/masterDataMock';
import type { DeliverableType, DeliverableStatus } from '@/types/masterData.types';
import { ArrowRight, Lock } from 'lucide-react';

export default function DeliverableQualificationsPage() {
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
      case 'deliverable-type':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Label', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      default:
        return [];
    }
  };

  const sortedStatuses = [...MOCK_DELIVERABLE_STATUSES].sort((a, b) => a.ordre_affichage - b.ordre_affichage);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Deliverable Qualifications</h1>
        <p className="text-muted-foreground mt-1">
          Manage deliverable types and status workflow
        </p>
      </div>

      <Tabs defaultValue="deliverable-type" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="deliverable-type">Type</TabsTrigger>
          <TabsTrigger value="deliverable-status">
            Status <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deliverable-type">
          <MasterDataTable<DeliverableType>
            data={MOCK_DELIVERABLE_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
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
            title="Deliverable Types"
            description="Types of deliverables that can be created"
            onEdit={(row) => handleEdit(row, 'deliverable-type')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('deliverable-type')}
            isFrozen={false}
            idKey="type_livrable_id"
          />
        </TabsContent>

        <TabsContent value="deliverable-status">
          <div className="space-y-4">
            <div className="bg-card rounded-lg border p-6">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Deliverable Status Workflow</h3>
                <Badge variant="outline" className="gap-1">
                  <Lock className="w-3 h-3" /> Read-Only
                </Badge>
              </div>
              
              {/* Workflow Visualization */}
              <div className="flex flex-wrap items-center gap-2 p-4 bg-muted/30 rounded-lg mb-6">
                {sortedStatuses.map((status, index) => (
                  <div key={status.statut_livrable_id} className="flex items-center gap-2">
                    <Badge
                      variant={status.is_terminal ? 'destructive' : 'default'}
                      className="px-3 py-1"
                    >
                      {status.libelle}
                      {status.is_terminal && <span className="ml-1 text-xs">(Final)</span>}
                    </Badge>
                    {index < sortedStatuses.length - 1 && !status.is_terminal && (
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <MasterDataTable<DeliverableStatus>
              data={MOCK_DELIVERABLE_STATUSES}
              columns={[
                { key: 'code', label: 'Code' },
                { key: 'libelle', label: 'Label' },
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
                { key: 'description', label: 'Description' },
              ]}
              title="Deliverable Statuses"
              description="Fixed workflow statuses for deliverables"
              isFrozen={true}
              idKey="statut_livrable_id"
            />
          </div>
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
