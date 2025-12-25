import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import {
  MOCK_BUDGET_TYPES,
  MOCK_CURRENCIES,
  MOCK_ENVELOPE_TYPES,
  MOCK_FUNDING_SOURCES,
} from '@/data/masterDataMock';
import type { BudgetType, Currency, EnvelopeType, FundingSource } from '@/types/masterData.types';
import { Lock, Star } from 'lucide-react';

export default function BudgetPage() {
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

  const getBudgetTypeName = (id: string) => {
    return MOCK_BUDGET_TYPES.find((bt) => bt.type_budget_id === id)?.libelle || id;
  };

  const getFormFields = () => {
    switch (activeTable) {
      case 'currency':
        return [
          { key: 'code', label: 'Code (ISO)', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'taux_vs_default', label: 'Exchange Rate', type: 'number' as const, required: true },
          { key: 'is_default', label: 'Default Currency', type: 'boolean' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'envelope-type':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Label', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          {
            key: 'type_budget_id',
            label: 'Budget Type',
            type: 'select' as const,
            required: true,
            options: MOCK_BUDGET_TYPES.map((bt) => ({ value: bt.type_budget_id, label: bt.libelle })),
          },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      case 'funding-source':
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

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Budget Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage budget types, currencies, envelopes, and funding sources
        </p>
      </div>

      <Tabs defaultValue="budget-type" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 max-w-2xl">
          <TabsTrigger value="budget-type">
            Budget Type <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="envelope-type">Envelope Type</TabsTrigger>
          <TabsTrigger value="funding-source">Funding Source</TabsTrigger>
        </TabsList>

        <TabsContent value="budget-type">
          <MasterDataTable<BudgetType>
            data={MOCK_BUDGET_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              { key: 'description', label: 'Description' },
            ]}
            title="Budget Types"
            description="Fixed budget categories (CAPEX, OPEX, ND)"
            isFrozen={true}
            idKey="type_budget_id"
          />
        </TabsContent>

        <TabsContent value="currency">
          <MasterDataTable<Currency>
            data={MOCK_CURRENCIES}
            columns={[
              {
                key: 'code',
                label: 'Code',
                render: (value, row) => (
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{String(value)}</span>
                    {(row as Currency).is_default && (
                      <Badge variant="default" className="gap-1">
                        <Star className="w-3 h-3" /> Default
                      </Badge>
                    )}
                  </div>
                ),
              },
              { key: 'libelle', label: 'Name' },
              {
                key: 'taux_vs_default',
                label: 'Exchange Rate',
                render: (value) => <span className="font-mono">{String(value)}</span>,
              },
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
            title="Currencies"
            description="Available currencies with exchange rates"
            onEdit={(row) => handleEdit(row, 'currency')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('currency')}
            isFrozen={false}
            idKey="devise_id"
          />
        </TabsContent>

        <TabsContent value="envelope-type">
          <MasterDataTable<EnvelopeType>
            data={MOCK_ENVELOPE_TYPES}
            columns={[
              { key: 'code', label: 'Code' },
              { key: 'libelle', label: 'Label' },
              {
                key: 'type_budget_id',
                label: 'Budget Type',
                render: (value) => (
                  <Badge variant="outline">{getBudgetTypeName(String(value))}</Badge>
                ),
              },
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
            title="Envelope Types"
            description="Budget envelope categories linked to budget types"
            onEdit={(row) => handleEdit(row, 'envelope-type')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('envelope-type')}
            isFrozen={false}
            idKey="type_enveloppe_id"
          />
        </TabsContent>

        <TabsContent value="funding-source">
          <MasterDataTable<FundingSource>
            data={MOCK_FUNDING_SOURCES}
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
            title="Funding Sources"
            description="Available funding sources for projects"
            onEdit={(row) => handleEdit(row, 'funding-source')}
            onDelete={(row) => console.log('Delete:', row)}
            onAdd={() => handleCreate('funding-source')}
            isFrozen={false}
            idKey="source_financement_id"
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
