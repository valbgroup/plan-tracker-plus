import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Upload, Download, X, Copy, Check, Building2, Key, Palette } from 'lucide-react';
import { toast } from 'sonner';

const currencies = ['USD', 'EUR', 'GBP', 'DZD', 'MAD', 'TND', 'CAD', 'AUD'];
const timezones = [
  'UTC+00:00', 'UTC+01:00', 'UTC+02:00', 'UTC+03:00', 'UTC+04:00', 
  'UTC+05:00', 'UTC+06:00', 'UTC+07:00', 'UTC+08:00', 'UTC+09:00',
  'UTC+10:00', 'UTC+11:00', 'UTC+12:00', 'UTC-01:00', 'UTC-02:00',
  'UTC-03:00', 'UTC-04:00', 'UTC-05:00', 'UTC-06:00', 'UTC-07:00',
  'UTC-08:00', 'UTC-09:00', 'UTC-10:00', 'UTC-11:00', 'UTC-12:00',
];
const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'Français' },
  { value: 'ar', label: 'العربية' },
  { value: 'es', label: 'Español' },
];
const dateFormats = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];

export function OrganizationConfig() {
  const [companyName, setCompanyName] = useState('Acme Corporation');
  const [address, setAddress] = useState('123 Business St, Suite 400\nCity, Country 12345');
  const [currency, setCurrency] = useState('USD');
  const [timezone, setTimezone] = useState('UTC+00:00');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [logo, setLogo] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [primaryColor, setPrimaryColor] = useState('#208080');
  const [secondaryColor, setSecondaryColor] = useState('#5E5240');

  // License info (read-only)
  const licenseInfo = {
    type: 'Professional',
    key: 'LPRO-XXXX-XXXX-XXXX-7K9Q',
    expiry: '31/12/2025',
    maxUsers: 100,
    currentUsers: 47,
    daysUntilExpiry: 372,
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        setLogo(ev.target?.result as string);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const copyLicenseKey = () => {
    navigator.clipboard.writeText('LPRO-XXXX-XXXX-XXXX-7K9Q');
    setCopiedKey(true);
    toast.success('License key copied');
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const getExpiryStatus = (): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (licenseInfo.daysUntilExpiry > 30) return 'secondary';
    if (licenseInfo.daysUntilExpiry > 15) return 'outline';
    return 'destructive';
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Company Profile */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Company Profile
          </CardTitle>
          <CardDescription>Basic organization information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input
              id="company-name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              maxLength={100}
              onBlur={() => toast.success('Company name saved')}
            />
          </div>

          <div className="space-y-2">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="w-[200px] h-[60px] border border-dashed border-border rounded-lg flex items-center justify-center bg-secondary/30">
                {logo ? (
                  <img src={logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-xs text-muted-foreground">No logo uploaded</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button variant="outline" size="sm" asChild>
                    <span><Upload className="w-4 h-4 mr-2" />Upload</span>
                  </Button>
                </Label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                {logo && (
                  <Button variant="ghost" size="sm" onClick={() => setLogo(null)}>
                    <X className="w-4 h-4 mr-2" />Remove
                  </Button>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">PNG, JPG. Max 2MB. Recommended: 200x60px</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Headquarters Address</Label>
            <Textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              maxLength={300}
              rows={3}
              onBlur={() => toast.success('Address saved')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Base Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Default Timezone</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timezones.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>System Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((l) => (
                    <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date Format</Label>
              <Select value={dateFormat} onValueChange={setDateFormat}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dateFormats.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Information */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            License Information
          </CardTitle>
          <CardDescription>Your LightPro license details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">License Type</span>
            <Badge variant="secondary">{licenseInfo.type}</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">License Key</span>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-secondary px-2 py-1 rounded">{licenseInfo.key}</code>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyLicenseKey}>
                {copiedKey ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Expiry Date</span>
            <div className="flex items-center gap-2">
              <span>{licenseInfo.expiry}</span>
              <Badge variant={getExpiryStatus()}>
                {licenseInfo.daysUntilExpiry} days
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">User Seats</span>
              <span>{licenseInfo.currentUsers} / {licenseInfo.maxUsers}</span>
            </div>
            <Progress value={(licenseInfo.currentUsers / licenseInfo.maxUsers) * 100} className="h-2" />
          </div>

          <Button variant="outline" className="w-full">
            Contact Support to Renew
          </Button>
        </CardContent>
      </Card>

      {/* Branding */}
      <Card className="glass-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-primary" />
            Branding
          </CardTitle>
          <CardDescription>Customize the look and feel of LightPro</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Primary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Secondary Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-12 h-10 rounded border border-border cursor-pointer"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Preview</Label>
              <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg">
                <Button style={{ backgroundColor: primaryColor }}>Primary Button</Button>
                <Button variant="outline" style={{ borderColor: secondaryColor, color: secondaryColor }}>
                  Secondary
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={() => toast.success('Branding updated for all users')}>
              Apply Branding Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
