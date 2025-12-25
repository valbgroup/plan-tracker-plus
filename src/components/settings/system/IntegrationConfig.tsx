import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plug, RefreshCw, Check, X, Eye, EyeOff, Copy, Calendar, FileDown } from 'lucide-react';
import { toast } from 'sonner';

export function IntegrationConfig() {
  const [adSyncFrequency, setAdSyncFrequency] = useState('daily');
  const [adSyncStrategy, setAdSyncStrategy] = useState('import');
  const [erpSystem, setErpSystem] = useState('none');
  const [erpDirection, setErpDirection] = useState('bidirectional');
  const [showApiKey, setShowApiKey] = useState(false);
  const [googleCalendar, setGoogleCalendar] = useState(false);
  const [outlookCalendar, setOutlookCalendar] = useState(false);
  const [calendarSync, setCalendarSync] = useState('daily');
  const [exportFormat, setExportFormat] = useState('excel');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [maxExportSize, setMaxExportSize] = useState(10);

  const adStatus = {
    connected: true,
    lastSync: '2025-12-24 10:30:00',
    nextSync: '2025-12-25 10:30:00',
    usersSync: 47,
    domain: 'company.onmicrosoft.com',
  };

  const erpStatus = {
    connected: false,
    lastSync: null,
    apiKey: '••••••••••••••••••7K9Q',
  };

  return (
    <div className="space-y-6">
      {/* Active Directory Sync */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="w-5 h-5 text-primary" />
            Active Directory Sync
          </CardTitle>
          <CardDescription>Synchronize users from your company directory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${adStatus.connected ? 'bg-success pulse-live' : 'bg-destructive'}`} />
              <div>
                <span className="font-medium">{adStatus.connected ? 'Connected' : 'Disconnected'}</span>
                <p className="text-sm text-muted-foreground">{adStatus.domain}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => toast.success('Connection test successful')}>
                Test Connection
              </Button>
              <Button onClick={() => toast.info('Syncing... 15/47 users')}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Sync Now
              </Button>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Last Sync</Label>
              <div className="flex items-center gap-2">
                <Badge variant="secondary"><Check className="w-3 h-3 mr-1" />Success</Badge>
                <span className="text-sm text-muted-foreground">{adStatus.lastSync}</span>
              </div>
              <p className="text-xs text-muted-foreground">{adStatus.usersSync} users synced</p>
            </div>

            <div className="space-y-2">
              <Label>Next Sync</Label>
              <span className="text-sm">{adStatus.nextSync}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Sync Frequency</Label>
              <Select value={adSyncFrequency} onValueChange={setAdSyncFrequency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Sync Strategy</Label>
              <Select value={adSyncStrategy} onValueChange={setAdSyncStrategy}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="import">Import only</SelectItem>
                  <SelectItem value="override">Manual override</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ERP Integration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>ERP Integration</CardTitle>
          <CardDescription>Connect to your enterprise resource planning system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>ERP System</Label>
              <Select value={erpSystem} onValueChange={setErpSystem}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="sap">SAP</SelectItem>
                  <SelectItem value="oracle">Oracle</SelectItem>
                  <SelectItem value="netsuite">NetSuite</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Connection Status</Label>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${erpStatus.connected ? 'bg-success' : 'bg-muted-foreground'}`} />
                <span>{erpStatus.connected ? 'Connected' : 'Not configured'}</span>
              </div>
            </div>
          </div>

          {erpSystem !== 'none' && (
            <>
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showApiKey ? 'text' : 'password'}
                      value={erpStatus.apiKey}
                      readOnly
                      className="pr-20"
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setShowApiKey(!showApiKey)}
                      >
                        {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => {
                          navigator.clipboard.writeText(erpStatus.apiKey);
                          toast.success('API key copied');
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>

              <div className="space-y-3">
                <Label>Data Direction</Label>
                <RadioGroup value={erpDirection} onValueChange={setErpDirection} className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="import" id="import" />
                    <Label htmlFor="import" className="cursor-pointer">Import only (ERP → LightPro)</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="bidirectional" id="bidirectional" />
                    <Label htmlFor="bidirectional" className="cursor-pointer">Bidirectional</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => toast.success('ERP connection test successful')}>
                  Test Connection
                </Button>
                <Button>Configure</Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Calendar Integration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Calendar Integration
          </CardTitle>
          <CardDescription>Sync project milestones with external calendars</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium">Google Calendar</span>
                  <p className="text-xs text-muted-foreground">
                    {googleCalendar ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Switch checked={googleCalendar} onCheckedChange={setGoogleCalendar} />
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-medium">Outlook Calendar</span>
                  <p className="text-xs text-muted-foreground">
                    {outlookCalendar ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <Switch checked={outlookCalendar} onCheckedChange={setOutlookCalendar} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sync Frequency</Label>
            <Select value={calendarSync} onValueChange={setCalendarSync}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Export Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown className="w-5 h-5 text-primary" />
            Export Configuration
          </CardTitle>
          <CardDescription>Configure default export settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Default Export Format</Label>
              <Select value={exportFormat} onValueChange={setExportFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Include Metadata</Label>
              <div className="flex items-center gap-2 pt-2">
                <Switch checked={includeMetadata} onCheckedChange={setIncludeMetadata} />
                <span className="text-sm">{includeMetadata ? 'Yes' : 'No'}</span>
              </div>
              <p className="text-xs text-muted-foreground">Creator, timestamp, history</p>
            </div>

            <div className="space-y-2">
              <Label>Max Export Size</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min={5}
                  max={100}
                  value={maxExportSize}
                  onChange={(e) => setMaxExportSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">MB (5-100)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
