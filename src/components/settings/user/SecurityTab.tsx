import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Shield, Key, Smartphone, Monitor, LogOut, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export function SecurityTab() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);

  const sessions = [
    { device: 'Chrome on Windows', location: 'New York, USA', lastActive: 'Now', current: true },
    { device: 'Safari on iPhone', location: 'New York, USA', lastActive: '2 hours ago', current: false },
  ];

  const getStrength = () => {
    if (!newPassword) return 0;
    let s = 0;
    if (newPassword.length >= 8) s += 25;
    if (/[A-Z]/.test(newPassword)) s += 25;
    if (/[0-9]/.test(newPassword)) s += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) s += 25;
    return s;
  };

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Key className="w-5 h-5 text-primary" />Change Password</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <Progress value={getStrength()} className="h-2" />
            <div className="flex gap-2 text-xs">
              {[{c:/^.{8,}$/,l:'8+ chars'},{c:/[A-Z]/,l:'Uppercase'},{c:/[0-9]/,l:'Number'},{c:/[^A-Za-z0-9]/,l:'Special'}].map(({c,l}) => (
                <span key={l} className={c.test(newPassword) ? 'text-success' : 'text-muted-foreground'}>{c.test(newPassword) ? <Check className="w-3 h-3 inline mr-1" /> : <X className="w-3 h-3 inline mr-1" />}{l}</span>
              ))}
            </div>
          </div>
          <div className="space-y-2"><Label>Confirm Password</Label><Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /></div>
          <Button onClick={() => { if (newPassword === confirmPassword && getStrength() === 100) toast.success('Password changed'); else toast.error('Please check password requirements'); }}>Change Password</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="w-5 h-5 text-primary" />Two-Factor Authentication</CardTitle></CardHeader>
        <CardContent>
          {twoFaEnabled ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Badge variant="secondary" className="bg-success/20 text-success">Enabled</Badge><span>Authenticator App</span></div>
              <Button variant="outline" onClick={() => { setTwoFaEnabled(false); toast.success('2FA disabled'); }}>Disable</Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">Enable 2FA for enhanced security</p>
              <Button onClick={() => { setTwoFaEnabled(true); toast.success('2FA enabled'); }}>Enable 2FA</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Monitor className="w-5 h-5 text-primary" />Active Sessions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Device</TableHead><TableHead>Location</TableHead><TableHead>Last Active</TableHead><TableHead></TableHead></TableRow></TableHeader>
            <TableBody>
              {sessions.map((s, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{s.device}</TableCell>
                  <TableCell>{s.location}</TableCell>
                  <TableCell>{s.lastActive}{s.current && <Badge className="ml-2" variant="secondary">Current</Badge>}</TableCell>
                  <TableCell>{!s.current && <Button variant="ghost" size="sm" onClick={() => toast.success('Session terminated')}><LogOut className="w-4 h-4 mr-1" />Sign Out</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
