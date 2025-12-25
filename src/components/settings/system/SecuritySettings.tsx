import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Key, AlertTriangle, Check } from 'lucide-react';
import { toast } from 'sonner';

export function SecuritySettings() {
  const [passwordLength, setPasswordLength] = useState(8);
  const [complexityRequired, setComplexityRequired] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState(90);
  const [maxLoginAttempts, setMaxLoginAttempts] = useState(3);
  const [lockDuration, setLockDuration] = useState(30);
  const [sessionTimeout, setSessionTimeout] = useState(8);
  const [twoFactorMode, setTwoFactorMode] = useState('recommended');
  const [ssoEnabled, setSsoEnabled] = useState(false);

  const [gdprEnabled, setGdprEnabled] = useState(true);
  const [soxEnabled, setSoxEnabled] = useState(true);
  const [isoEnabled, setIsoEnabled] = useState(true);
  const [dataRetention, setDataRetention] = useState('90');

  return (
    <div className="space-y-6">
      {/* Authentication Policy */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            Authentication Policy
          </CardTitle>
          <CardDescription>Configure password and login security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="password-length">Minimum Password Length</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="password-length"
                  type="number"
                  min={6}
                  max={20}
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">characters (6-20)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password Complexity</Label>
              <div className="flex items-center gap-2">
                <Switch
                  checked={complexityRequired}
                  onCheckedChange={setComplexityRequired}
                />
                <span className="text-sm">{complexityRequired ? 'Required' : 'Not required'}</span>
              </div>
              {complexityRequired && (
                <p className="text-xs text-muted-foreground">
                  Uppercase, lowercase, number, special char
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="password-expiry"
                  type="number"
                  min={30}
                  max={365}
                  value={passwordExpiry}
                  onChange={(e) => setPasswordExpiry(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">days (30-365)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="max-attempts">Max Login Attempts</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="max-attempts"
                  type="number"
                  min={3}
                  max={10}
                  value={maxLoginAttempts}
                  onChange={(e) => setMaxLoginAttempts(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">attempts (3-10)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lock-duration">Account Lock Duration</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="lock-duration"
                  type="number"
                  min={15}
                  max={120}
                  value={lockDuration}
                  onChange={(e) => setLockDuration(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">minutes (15-120)</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="session-timeout"
                  type="number"
                  min={1}
                  max={24}
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">hours (1-24)</span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Two-Factor Authentication</Label>
              <Select value={twoFactorMode} onValueChange={setTwoFactorMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="mandatory">Mandatory</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Methods: Authenticator app (TOTP), SMS
              </p>
            </div>

            <div className="space-y-2">
              <Label>SSO Integration</Label>
              <div className="flex items-center gap-4">
                <Switch checked={ssoEnabled} onCheckedChange={setSsoEnabled} />
                <Badge variant={ssoEnabled ? 'default' : 'secondary'}>
                  {ssoEnabled ? 'Configured' : 'Not configured'}
                </Badge>
              </div>
              {ssoEnabled && (
                <Button variant="link" className="p-0 h-auto text-primary">
                  Configure Azure AD / Google Workspace
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Privacy */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Data Privacy & Compliance
          </CardTitle>
          <CardDescription>Configure data protection and regulatory compliance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-secondary/20">
              <Checkbox
                id="gdpr"
                checked={gdprEnabled}
                onCheckedChange={(checked) => setGdprEnabled(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="gdpr" className="font-medium cursor-pointer">GDPR Compliance</Label>
                <p className="text-xs text-muted-foreground">
                  Auto-delete on account deletion, 90-day retention, consent management
                </p>
                {gdprEnabled && <Badge variant="secondary" className="mt-2"><Check className="w-3 h-3 mr-1" />Active</Badge>}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-secondary/20">
              <Checkbox
                id="sox"
                checked={soxEnabled}
                onCheckedChange={(checked) => setSoxEnabled(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="sox" className="font-medium cursor-pointer">SOX Compliance</Label>
                <p className="text-xs text-muted-foreground">
                  Immutable audit logs, encryption, verification required
                </p>
                {soxEnabled && <Badge variant="secondary" className="mt-2"><Check className="w-3 h-3 mr-1" />Active</Badge>}
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-secondary/20">
              <Checkbox
                id="iso"
                checked={isoEnabled}
                onCheckedChange={(checked) => setIsoEnabled(checked as boolean)}
              />
              <div className="space-y-1">
                <Label htmlFor="iso" className="font-medium cursor-pointer">ISO 27001 Mode</Label>
                <p className="text-xs text-muted-foreground">
                  Encryption at rest, data classification, strict access control
                </p>
                {isoEnabled && <Badge variant="secondary" className="mt-2"><Check className="w-3 h-3 mr-1" />Active</Badge>}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data Retention Policy</Label>
            <div className="flex items-center gap-4">
              <Select value={dataRetention} onValueChange={setDataRetention}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                  <SelectItem value="730">2 years</SelectItem>
                  <SelectItem value="unlimited">Unlimited</SelectItem>
                </SelectContent>
              </Select>
              {dataRetention !== 'unlimited' && (
                <div className="flex items-center gap-2 text-sm text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  Data older than {dataRetention} days will be deleted
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => toast.success('Security policy updated')}>
              Save Security Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
