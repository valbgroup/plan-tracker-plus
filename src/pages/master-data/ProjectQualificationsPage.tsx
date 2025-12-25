import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import { useToast } from '@/hooks/use-toast';
import {
  MOCK_PROJ_TYPES,
  MOCK_PROJ_NATURES,
  MOCK_PROJ_SIZES,
  MOCK_PROJ_STATUSES,
  MOCK_HEALTH_STATUSES,
  MOCK_PORTFOLIOS,
  MOCK_PROGRAMS,
  MOCK_LIFECYCLE_APPROACHES,
} from '@/data/masterDataMock';
import type { ProjType } from '@/types/masterData.types';

export default function ProjectQualificationsPage() {
  const { toast } = useToast();
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTable, setActiveTable] = useState<string>('');

  const handleEdit = (item: unknown, table: string) => {
    setEditItem(item as Record<string, unknown>);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleAdd = (table: string) => {
    setEditItem(null);
    setActiveTable(table);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    toast({ title: 'Success', description: 'Item saved successfully' });
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    toast({ title: 'Deleted', description: 'Item deleted successfully' });
  };

  const commonFields = [
    { key: 'code', label: 'Code', type: 'text' as const, required: true },
    { key: 'libelle', label: 'Label', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'is_active', label: 'Status', type: 'boolean' as const },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Project Qualifications</h1>
        <p className="text-muted-foreground">Manage project types, natures, sizes, and statuses</p>
      </div>

      <Tabs defaultValue="types" className="space-y-4">
        <TabsList className="flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="types">Types</TabsTrigger>
          <TabsTrigger value="natures">Natures</TabsTrigger>
          <TabsTrigger value="sizes">Sizes</TabsTrigger>
          <TabsTrigger value="statuses">Statuses</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="portfolios">Portfolios</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="lifecycle">Lifecycle</TabsTrigger>
        </TabsList>

        <TabsContent value="types">
          <MasterDataTable
            title="Project Types"
            data={MOCK_PROJ_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
              { key: 'is_active', label: 'Status' },
            ]}
            idKey="type_projet_id"
            onEdit={(row) => handleEdit(row, 'types')}
            onDelete={handleDelete}
            onAdd={() => handleAdd('types')}
          />
        </TabsContent>

        <TabsContent value="natures">
          <MasterDataTable
            title="Project Natures"
            data={MOCK_PROJ_NATURES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
              { key: 'is_active', label: 'Status' },
            ]}
            idKey="nature_id"
            onEdit={(row) => handleEdit(row, 'natures')}
            onDelete={handleDelete}
            onAdd={() => handleAdd('natures')}
          />
        </TabsContent>

        <TabsContent value="sizes">
          <MasterDataTable
            title="Project Sizes"
            data={MOCK_PROJ_SIZES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
              { key: 'is_active', label: 'Status' },
            ]}
            idKey="taille_id"
            onEdit={(row) => handleEdit(row, 'sizes')}
            onDelete={handleDelete}
            onAdd={() => handleAdd('sizes')}
          />
        </TabsContent>

        <TabsContent value="statuses">
          <MasterDataTable
            title="Project Statuses"
            data={MOCK_PROJ_STATUSES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'ordre_affichage', label: 'Order' },
              { key: 'is_terminal', label: 'Terminal' },
              { key: 'is_active', label: 'Status' },
            ]}
            idKey="statut_id"
            isFrozen
          />
        </TabsContent>

        <TabsContent value="health">
          <MasterDataTable
            title="Health Statuses"
            data={MOCK_HEALTH_STATUSES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
              { key: 'color', label: 'Color', render: (v) => (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: String(v) }} />
                  {String(v)}
                </div>
              )},
            ]}
            idKey="etat_id"
            isFrozen
          />
        </TabsContent>

        <TabsContent value="portfolios">
          <MasterDataTable
            title="Portfolios"
            data={MOCK_PORTFOLIOS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'is_default_global', label: 'Default', render: (v) => v ? <Badge>Default</Badge> : null },
              { key: 'is_active', label: 'Status' },
            ]}
            idKey="portefeuille_id"
            onEdit={(row) => handleEdit(row, 'portfolios')}
            onDelete={handleDelete}
            onAdd={() => handleAdd('portfolios')}
          />
        </TabsContent>

        <TabsContent value="programs">
          <MasterDataTable
            title="Programs"
            data={MOCK_PROGRAMS}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
              { key: 'is_active', label: 'Status' },
            ]}
            idKey="programme_id"
            onEdit={(row) => handleEdit(row, 'programs')}
            onDelete={handleDelete}
            onAdd={() => handleAdd('programs')}
          />
        </TabsContent>

        <TabsContent value="lifecycle">
          <MasterDataTable
            title="Lifecycle Approaches"
            data={MOCK_LIFECYCLE_APPROACHES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
            ]}
            idKey="approche_id"
            isFrozen
          />
        </TabsContent>
      </Tabs>

      <MasterDataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editItem ? 'Edit Entry' : 'New Entry'}
        fields={commonFields}
        initialData={editItem || undefined}
        onSave={handleSave}
      />
    </div>
  );
}
