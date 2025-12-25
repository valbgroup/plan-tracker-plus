import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { MOCK_CALENDAR_MODELS } from '@/data/masterDataMock';

interface Holiday {
  id: string;
  name: string;
  date: Date;
  recurring: 'none' | 'annual' | 'monthly' | 'weekly';
  linkedCalendars: string[];
  description: string;
  isActive: boolean;
}

interface HolidayFormData {
  name: string;
  date: string;
  recurring: 'none' | 'annual' | 'monthly' | 'weekly';
  linkedCalendars: string[];
  description: string;
}

const INITIAL_HOLIDAYS: Holiday[] = [
  {
    id: '1',
    name: 'New Year',
    date: new Date('2025-01-01'),
    recurring: 'annual',
    linkedCalendars: ['STD35', 'STD40'],
    description: 'Global holiday - January 1st',
    isActive: true,
  },
  {
    id: '2',
    name: 'Christmas',
    date: new Date('2025-12-25'),
    recurring: 'annual',
    linkedCalendars: ['STD40'],
    description: 'Christian holiday - December 25th',
    isActive: true,
  },
  {
    id: '3',
    name: 'Eid al-Fitr',
    date: new Date('2025-04-10'),
    recurring: 'annual',
    linkedCalendars: ['STD35'],
    description: 'Islamic holiday - varies by lunar calendar',
    isActive: true,
  },
];

export const HolidayCalendarsPage: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(INITIAL_HOLIDAYS);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<HolidayFormData>({
    name: '',
    date: '',
    recurring: 'none',
    linkedCalendars: [],
    description: '',
  });
  const [filterRecurring, setFilterRecurring] = useState<'all' | 'annual' | 'monthly' | 'weekly' | 'none'>('all');

  const calendarModels = MOCK_CALENDAR_MODELS.map(m => ({
    id: m.code,
    name: m.libelle,
  }));

  const handleAddHoliday = () => {
    setEditingId(null);
    setFormData({
      name: '',
      date: '',
      recurring: 'none',
      linkedCalendars: [],
      description: '',
    });
    setShowForm(true);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setEditingId(holiday.id);
    setFormData({
      name: holiday.name,
      date: holiday.date.toISOString().split('T')[0],
      recurring: holiday.recurring,
      linkedCalendars: holiday.linkedCalendars,
      description: holiday.description,
    });
    setShowForm(true);
  };

  const handleSaveHoliday = () => {
    if (!formData.name.trim()) {
      toast.error('Holiday name is required');
      return;
    }
    if (!formData.date) {
      toast.error('Date is required');
      return;
    }

    if (editingId) {
      setHolidays(
        holidays.map((h) =>
          h.id === editingId
            ? {
                ...h,
                name: formData.name,
                date: new Date(formData.date),
                recurring: formData.recurring,
                linkedCalendars: formData.linkedCalendars,
                description: formData.description,
              }
            : h
        )
      );
      toast.success('Holiday updated successfully');
    } else {
      const newHoliday: Holiday = {
        id: `holiday-${Date.now()}`,
        name: formData.name,
        date: new Date(formData.date),
        recurring: formData.recurring,
        linkedCalendars: formData.linkedCalendars,
        description: formData.description,
        isActive: true,
      };
      setHolidays([...holidays, newHoliday]);
      toast.success('Holiday created successfully');
    }

    setShowForm(false);
  };

  const handleDeleteHoliday = (id: string) => {
    setHolidays(holidays.filter((h) => h.id !== id));
    toast.success('Holiday deleted');
  };

  const handleToggleCalendarLink = (calendarId: string) => {
    setFormData((prev) => ({
      ...prev,
      linkedCalendars: prev.linkedCalendars.includes(calendarId)
        ? prev.linkedCalendars.filter((id) => id !== calendarId)
        : [...prev.linkedCalendars, calendarId],
    }));
  };

  const filteredHolidays =
    filterRecurring === 'all'
      ? holidays
      : holidays.filter((h) => h.recurring === filterRecurring);

  const getRecurringBadgeVariant = (recurring: string): 'default' | 'secondary' | 'outline' => {
    switch (recurring) {
      case 'annual':
        return 'default';
      case 'monthly':
        return 'secondary';
      case 'weekly':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Holiday Calendars</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage holidays and special dates linked to calendar models
          </p>
        </div>
        <Button onClick={handleAddHoliday} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Holiday
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'annual', 'monthly', 'weekly', 'none'] as const).map((type) => (
          <Button
            key={type}
            variant={filterRecurring === type ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterRecurring(type)}
          >
            {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
          </Button>
        ))}
      </div>

      {/* Holiday Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit Holiday' : 'Add New Holiday'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Holiday Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., New Year, Christmas, Eid"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Date *
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Recurring Pattern
                </label>
                <Select
                  value={formData.recurring}
                  onValueChange={(value) => setFormData({ ...formData, recurring: value as typeof formData.recurring })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Recurrence</SelectItem>
                    <SelectItem value="annual">Annual (yearly)</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Description
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add notes about this holiday..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground">
                Link to Calendar Models
              </label>
              <div className="space-y-2">
                {calendarModels.map((model) => (
                  <div
                    key={model.id}
                    className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => handleToggleCalendarLink(model.id)}
                  >
                    <Checkbox
                      checked={formData.linkedCalendars.includes(model.id)}
                      onCheckedChange={() => handleToggleCalendarLink(model.id)}
                    />
                    <div>
                      <p className="font-medium text-foreground">{model.name}</p>
                      <p className="text-xs text-muted-foreground">{model.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveHoliday}>
              {editingId ? 'Update Holiday' : 'Create Holiday'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Holidays List */}
      <div className="space-y-3">
        {filteredHolidays.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-lg border-2 border-dashed border-border">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium">No holidays found</p>
            <p className="text-sm text-muted-foreground">Create your first holiday to get started</p>
          </div>
        ) : (
          filteredHolidays.map((holiday) => (
            <Card key={holiday.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {holiday.name}
                      </h3>
                      <Badge variant={getRecurringBadgeVariant(holiday.recurring)}>
                        {holiday.recurring === 'none' ? 'One-time' : holiday.recurring.charAt(0).toUpperCase() + holiday.recurring.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>
                        📅 <span className="font-medium">Date:</span>{' '}
                        {holiday.date.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {holiday.description && (
                        <p>
                          <span className="font-medium">Description:</span> {holiday.description}
                        </p>
                      )}
                    </div>

                    {holiday.linkedCalendars.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {holiday.linkedCalendars.map((calId) => {
                          const model = calendarModels.find((m) => m.id === calId);
                          return (
                            <Badge key={calId} variant="outline" className="gap-1">
                              <Calendar className="w-3 h-3" />
                              {model?.name || calId}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditHoliday(holiday)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteHoliday(holiday.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Holiday Calendar Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Holiday Calendar Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {calendarModels.map((model) => {
              const modelHolidays = holidays.filter((h) =>
                h.linkedCalendars.includes(model.id)
              );
              return (
                <div key={model.id} className="border border-border rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-3">{model.name}</h3>
                  {modelHolidays.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No holidays linked</p>
                  ) : (
                    <ul className="space-y-2">
                      {modelHolidays
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((h) => (
                          <li key={h.id} className="flex justify-between items-center text-sm">
                            <span className="text-foreground">{h.name}</span>
                            <span className="text-muted-foreground">
                              {h.date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolidayCalendarsPage;
