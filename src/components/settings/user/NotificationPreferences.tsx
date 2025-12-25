import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Bell, Clock, Moon } from 'lucide-react';
import { toast } from 'sonner';

export function NotificationPreferences() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [dashboardEnabled, setDashboardEnabled] = useState(true);
  const [emailDigest, setEmailDigest] = useState('daily');
  const [activeHoursEnabled, setActiveHoursEnabled] = useState(true);
  const [activeStart, setActiveStart] = useState('07:00');
  const [activeEnd, setActiveEnd] = useState('19:00');
  const [dndEnabled, setDndEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-5 h-5 text-primary" />Notification Channels</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div><span className="font-medium">Email Notifications</span><p className="text-xs text-muted-foreground">john.doe@company.com</p></div>
            <Switch checked={emailEnabled} onCheckedChange={(v) => { setEmailEnabled(v); toast.success('Email notifications ' + (v ? 'enabled' : 'disabled')); }} />
          </div>
          {emailEnabled && (
            <div className="ml-4 space-y-2">
              <Label>Digest Mode</Label>
              <Select value={emailDigest} onValueChange={(v) => { setEmailDigest(v); toast.success('Digest mode updated'); }}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="flex items-center justify-between p-4 rounded-lg border border-border">
            <div><span className="font-medium">Dashboard Notifications</span><p className="text-xs text-muted-foreground">Show in notification center</p></div>
            <Switch checked={dashboardEnabled} onCheckedChange={(v) => { setDashboardEnabled(v); toast.success('Dashboard notifications ' + (v ? 'enabled' : 'disabled')); }} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />Active Hours</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Switch checked={activeHoursEnabled} onCheckedChange={setActiveHoursEnabled} />
            <Label>Enable active hours</Label>
          </div>
          {activeHoursEnabled && (
            <div className="flex items-center gap-4">
              <div className="space-y-1"><Label className="text-xs">Start</Label><Input type="time" value={activeStart} onChange={(e) => setActiveStart(e.target.value)} className="w-32" /></div>
              <span className="mt-5">to</span>
              <div className="space-y-1"><Label className="text-xs">End</Label><Input type="time" value={activeEnd} onChange={(e) => setActiveEnd(e.target.value)} className="w-32" /></div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5 text-primary" />Do Not Disturb</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Switch checked={dndEnabled} onCheckedChange={(v) => { setDndEnabled(v); toast.success('DND ' + (v ? 'enabled' : 'disabled')); }} />
            <Label>{dndEnabled ? 'DND is active' : 'Enable Do Not Disturb'}</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
