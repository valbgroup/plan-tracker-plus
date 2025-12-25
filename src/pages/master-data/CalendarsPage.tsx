import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MasterDataTable, MasterDataFormModal } from '@/components/master-data';
import { MOCK_CALENDAR_MODELS } from '@/data/masterDataMock';
import type { CalendarModel } from '@/types/masterData.types';
import { Calendar, Clock, Star } from 'lucide-react';
import { HolidayCalendarsPage } from './HolidayCalendarsPage';

export default function CalendarsPage() {
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
      case 'calendar-model':
        return [
          { key: 'code', label: 'Code', type: 'text' as const, required: true },
          { key: 'libelle', label: 'Name', type: 'text' as const, required: true },
          { key: 'description', label: 'Description', type: 'textarea' as const },
          { key: 'daily_work_hours', label: 'Daily Work Hours', type: 'number' as const, required: true },
          {
            key: 'calculation_mode',
            label: 'Calculation Mode',
            type: 'select' as const,
            required: true,
            options: [
              { value: 'working_days', label: 'Working Days' },
              { value: 'calendars', label: 'Calendar Days' },
            ],
          },
          { key: 'include_holidays', label: 'Include Holidays', type: 'boolean' as const },
          { key: 'is_default', label: 'Default Calendar', type: 'boolean' as const },
          { key: 'is_active', label: 'Active', type: 'boolean' as const },
        ];
      default:
        return [];
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calendars</h1>
          <p className="text-muted-foreground mt-1">
            Manage work calendars and holiday schedules
          </p>
        </div>
      </div>

      <Tabs defaultValue="calendar-model" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="calendar-model">Calendar Models</TabsTrigger>
          <TabsTrigger value="holiday-calendar">Holiday Calendars</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar-model">
          <div className="space-y-6">
            {/* Calendar Model Preview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MOCK_CALENDAR_MODELS.map((calendar) => (
                <Card
                  key={calendar.model_id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEdit(calendar, 'calendar-model')}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        {calendar.libelle}
                      </CardTitle>
                      {calendar.is_default && (
                        <Badge variant="default" className="gap-1">
                          <Star className="w-3 h-3" /> Default
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{calendar.code}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Daily Hours</span>
                        <Badge variant="outline">{calendar.daily_work_hours}h</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Mode</span>
                        <Badge variant="secondary">
                          {calendar.calculation_mode === 'working_days' ? 'Working Days' : 'Calendar'}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Weekend</span>
                        <span className="text-xs">{calendar.weekend_days.join(', ')}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Holidays</span>
                        <Badge variant={calendar.include_holidays ? 'default' : 'secondary'}>
                          {calendar.include_holidays ? 'Included' : 'Excluded'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add New Card */}
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow border-dashed flex items-center justify-center min-h-[200px]"
                onClick={() => handleCreate('calendar-model')}
              >
                <div className="text-center text-muted-foreground">
                  <Calendar className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Add Calendar Model</p>
                  <p className="text-xs">Click to create</p>
                </div>
              </Card>
            </div>

            {/* Table View */}
            <MasterDataTable<CalendarModel>
              data={MOCK_CALENDAR_MODELS}
              columns={[
                {
                  key: 'code',
                  label: 'Code',
                  render: (value, row) => (
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{String(value)}</span>
                      {(row as CalendarModel).is_default && (
                        <Badge variant="default" className="gap-1">
                          <Star className="w-3 h-3" /> Default
                        </Badge>
                      )}
                    </div>
                  ),
                },
                { key: 'libelle', label: 'Name' },
                {
                  key: 'daily_work_hours',
                  label: 'Daily Hours',
                  render: (value) => <Badge variant="outline">{String(value)}h</Badge>,
                },
                {
                  key: 'calculation_mode',
                  label: 'Mode',
                  render: (value) => (
                    <Badge variant="secondary">
                      {value === 'working_days' ? 'Working Days' : 'Calendar'}
                    </Badge>
                  ),
                },
                {
                  key: 'weekend_days',
                  label: 'Weekend',
                  render: (value) => <span className="text-sm">{(value as string[]).join(', ')}</span>,
                },
                {
                  key: 'include_holidays',
                  label: 'Holidays',
                  render: (value) => (
                    <Badge variant={value ? 'default' : 'secondary'}>
                      {value ? 'Yes' : 'No'}
                    </Badge>
                  ),
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
              title="Calendar Models"
              description="Work schedule configurations"
              onEdit={(row) => handleEdit(row, 'calendar-model')}
              onDelete={(row) => console.log('Delete:', row)}
              onAdd={() => handleCreate('calendar-model')}
              isFrozen={false}
              idKey="model_id"
            />
          </div>
        </TabsContent>

        <TabsContent value="holiday-calendar">
          <HolidayCalendarsPage />
        </TabsContent>
      </Tabs>

      <MasterDataFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        title={editItem ? 'Edit Calendar Model' : 'Create Calendar Model'}
        fields={getFormFields()}
        initialData={editItem || undefined}
      />
    </div>
  );
}
