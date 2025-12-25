import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

export function DataPreferences() {
  const [currencyFormat, setCurrencyFormat] = useState('1,234.56');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [decimals, setDecimals] = useState('2');
  const [relativeDates, setRelativeDates] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState('25');
  const [exportFormat, setExportFormat] = useState('excel');

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-primary" />Display Formats</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Currency Format</Label>
              <Select value={currencyFormat} onValueChange={(v) => { setCurrencyFormat(v); toast.success('Currency format updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1,234.56">1,234.56 (US)</SelectItem>
                  <SelectItem value="1.234,56">1.234,56 (EU)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={dateFormat} onValueChange={(v) => { setDateFormat(v); toast.success('Date format updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Decimal Places</Label>
              <Select value={decimals} onValueChange={(v) => { setDecimals(v); toast.success('Decimals updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={relativeDates} onCheckedChange={(v) => { setRelativeDates(v); toast.success('Relative dates ' + (v ? 'enabled' : 'disabled')); }} />
            <Label>Use relative dates (e.g., "2 days ago")</Label>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Table & Export Preferences</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Default Rows per Page</Label>
              <Select value={rowsPerPage} onValueChange={(v) => { setRowsPerPage(v); toast.success('Rows per page updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Export Format</Label>
              <Select value={exportFormat} onValueChange={(v) => { setExportFormat(v); toast.success('Export format updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
