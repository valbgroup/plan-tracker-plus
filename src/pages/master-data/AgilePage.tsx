import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import { MOCK_REQUIREMENT_PRIORITIES } from '@/data/masterDataMock';
import type { RequirementPriority } from '@/types/masterData.types';
import { Lock, Zap } from 'lucide-react';

export default function AgilePage() {
  const [editItem, setEditItem] = useState<Record<string, unknown> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (item: unknown) => {
    setEditItem(item as Record<string, unknown>);
    setIsModalOpen(true);
  };

  const handleSave = (data: Record<string, unknown>) => {
    console.log('Saving description only:', data);
    setIsModalOpen(false);
    setEditItem(null);
  };

  const getFormFields = () => {
    return [
      { key: 'description', label: 'Description', type: 'textarea' as const },
    ];
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Zap className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Agile</h1>
          <p className="text-muted-foreground mt-1">
            Agile methodology settings and MoSCoW prioritization
          </p>
        </div>
      </div>

      <Tabs defaultValue="requirement-priority" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requirement-priority">
            Requirement Priority <Lock className="w-3 h-3 ml-1" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="requirement-priority">
          <div className="space-y-6">
            {/* MoSCoW Visual Cards */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>MoSCoW Prioritization</CardTitle>
                  <Badge variant="outline" className="gap-1">
                    <Lock className="w-3 h-3" /> Codes are Read-Only
                  </Badge>
                </div>
                <CardDescription>
                  Standard requirement prioritization framework. Descriptions can be edited.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {MOCK_REQUIREMENT_PRIORITIES.map((priority) => (
                    <div
                      key={priority.code}
                      className="relative p-4 rounded-lg border-2 transition-all hover:shadow-md cursor-pointer"
                      style={{ borderColor: priority.color }}
                      onClick={() => handleEdit(priority)}
                    >
                      <div
                        className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
                        style={{ backgroundColor: priority.color }}
                      />
                      <div className="flex items-center gap-3 mb-2 mt-1">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: priority.color }}
                        >
                          {priority.code}
                        </div>
                        <div>
                          <div className="font-semibold">{priority.titre}</div>
                          <div className="text-xs text-muted-foreground">Priority {priority.ordre}</div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{priority.description}</p>
                      <div className="absolute bottom-2 right-2">
                        <Badge variant="outline" className="text-xs">Click to edit</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Table View */}
            <MasterDataTable<RequirementPriority>
              data={MOCK_REQUIREMENT_PRIORITIES}
              columns={[
                {
                  key: 'code',
                  label: 'Code',
                  render: (value, row) => (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: (row as RequirementPriority).color }}
                      >
                        {String(value)}
                      </div>
                    </div>
                  ),
                },
                { key: 'titre', label: 'Title' },
                { key: 'ordre', label: 'Priority Order' },
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
              title="Requirement Priorities (MoSCoW)"
              description="Must have, Should have, Could have, Won't have"
              onEdit={(row) => handleEdit(row)}
              isFrozen={true}
              idKey="code"
            />
          </div>
        </TabsContent>
      </Tabs>

      <MasterDataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title="Edit Description"
        fields={getFormFields()}
        initialData={editItem || undefined}
      />
    </div>
  );
}
