import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import {
  MOCK_RESOURCE_FAMILIES,
  MOCK_RESOURCE_TYPES,
  MOCK_BRANDS,
  MOCK_RESOURCES,
} from '@/data/masterDataMock';
import type { ResourceFamily, ResourceType, Brand, Resource } from '@/types/masterData.types';
import { Lock, Package } from 'lucide-react';

export default function ResourcesPage() {
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

  const getFamilyName = (id: string) => {
    return MOCK_RESOURCE_FAMILIES.find((f) => f.famille_id === id)?.libelle || id;
  };

  const getTypeName = (id: string) => {
    return MOCK_RESOURCE_TYPES.find((t) => t.type_id === id)?.libelle || id;
  };

  const getBrandName = (id: string) => {
    return MOCK_BRANDS.find((b) => b.marque_id === id)?.libelle || id;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Disponible':
        return 'bg-green-500';
      case 'Occupée':
        return 'bg-yellow-500';
      case 'En maintenance':
        return 'bg-orange-500';
      case 'Hors service':
        return 'bg-red-500';
      case 'En réparation':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getFormFields = () => {
    switch (activeTable) {
      case 'brand':
        return [
          { key: 'libelle', label: 'Brand Name', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'site_web', label: 'Website', type: 'text' as const },
          { key: 'image_url', label: 'Logo URL', type: 'text' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'resource':
        return [
          { key: 'intitule', label: 'Name', type: 'text' as const, required: true },
          {
            key: 'famille_id',
            label: 'Family',
            type: 'select' as const,
            required: true,
            options: MOCK_RESOURCE_FAMILIES.map((f) => ({ value: f.famille_id, label: f.libelle })),
          },
          {
            key: 'type_id',
            label: 'Type',
            type: 'select' as const,
            required: true,
            options: MOCK_RESOURCE_TYPES.map((t) => ({ value: t.type_id, label: t.libelle })),
          },
          {
            key: 'marque_id',
            label: 'Brand',
            type: 'select' as const,
            options: MOCK_BRANDS.map((b) => ({ value: b.marque_id, label: b.libelle })),
          },
          { key: 'modele', label: 'Model', type: 'text' as const },
          { key: 'numero_serie', label: 'Serial Number', type: 'text' as const },
          {
            key: 'statut',
            label: 'Status',
            type: 'select' as const,
            required: true,
            options: [
              { value: 'Disponible', label: 'Available' },
              { value: 'Occupée', label: 'In Use' },
              { value: 'En maintenance', label: 'Maintenance' },
              { value: 'Hors service', label: 'Out of Service' },
              { value: 'En réparation', label: 'Under Repair' },
            ],
          },
          {
            key: 'condition_physique',
            label: 'Condition',
            type: 'select' as const,
            options: [
              { value: 'Neuf', label: 'New' },
              { value: 'Bon état', label: 'Good' },
              { value: 'Usagé', label: 'Used' },
              { value: 'Défaillant', label: 'Faulty' },
            ],
          },
          { key: 'site_specifique', label: 'Location', type: 'text' as const },
          { key: 'date_acquisition', label: 'Acquisition Date', type: 'date' as const },
          { key: 'valeur_acquisition', label: 'Acquisition Value', type: 'number' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Package className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground mt-1">
            Manage resource families, types, brands, and inventory
          </p>
        </div>
      </div>

      <Tabs defaultValue="resource-family" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="resource-family">
            Families <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="resource-type">
            Types <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="brand">Brands</TabsTrigger>
          <TabsTrigger value="resource">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="resource-family">
          <MasterDataTable<ResourceFamily>
            data={MOCK_RESOURCE_FAMILIES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              { key: 'description', label: 'Description' },
            ]}
            title="Resource Families"
            description="Top-level resource categories (fixed)"
            isFrozen={true}
            idKey="famille_id"
          />
        </TabsContent>

        <TabsContent value="resource-type">
          <MasterDataTable<ResourceType>
            data={MOCK_RESOURCE_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Name' },
              {
                key: 'famille_id',
                label: 'Family',
                render: (value) => <Badge variant="outline">{getFamilyName(String(value))}</Badge>,
              },
              {
                key: 'maintenance_required',
                label: 'Maintenance',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Required' : 'No'}
                  </Badge>
                ),
              },
              { key: 'description', label: 'Description' },
            ]}
            title="Resource Types"
            description="Specific resource types within families (fixed)"
            isFrozen={true}
            idKey="type_id"
          />
        </TabsContent>

        <TabsContent value="brand">
          <MasterDataTable<Brand>
            data={MOCK_BRANDS}
            columns={[
              { key: 'libelle', label: 'Brand' },
              { key: 'description', label: 'Description' },
              { key: 'site_web', label: 'Website' },
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
            title="Brands"
            description="Equipment and product brands"
            onEdit={(row) => handleEdit(row, 'brand')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('brand')}
            isFrozen={false}
            idKey="marque_id"
          />
        </TabsContent>

        <TabsContent value="resource">
          <MasterDataTable<Resource>
            data={MOCK_RESOURCES}
            columns={[
              { key: 'intitule', label: 'Name' },
              {
                key: 'type_id',
                label: 'Type',
                render: (value) => <Badge variant="outline">{getTypeName(String(value))}</Badge>,
              },
              {
                key: 'marque_id',
                label: 'Brand',
                render: (value) => value ? <Badge variant="secondary">{getBrandName(String(value))}</Badge> : '-',
              },
              { key: 'modele', label: 'Model' },
              {
                key: 'statut',
                label: 'Status',
                render: (value) => (
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(String(value))}`} />
                    <span>{String(value)}</span>
                  </div>
                ),
              },
              { key: 'condition_physique', label: 'Condition' },
              {
                key: 'is_active',
                label: 'Active',
                render: (value) => (
                  <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Active' : 'Inactive'}
                  </Badge>
                ),
              },
            ]}
            title="Resource Inventory"
            description="All organizational resources"
            onEdit={(row) => handleEdit(row, 'resource')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('resource')}
            isFrozen={false}
            idKey="ressource_id"
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
