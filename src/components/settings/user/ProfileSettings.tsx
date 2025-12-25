import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, User, Globe, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ProfileSettings() {
  const [avatar, setAvatar] = useState<string | null>(null);
  const [email, setEmail] = useState('john.doe@company.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [timezone, setTimezone] = useState('UTC+00:00');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" />Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={avatar || ''} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">JD</AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar-upload" className="cursor-pointer">
                <Button variant="outline" asChild><span><Upload className="w-4 h-4 mr-2" />Upload Photo</span></Button>
              </Label>
              <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (ev) => { setAvatar(ev.target?.result as string); toast.success('Photo updated'); };
                  reader.readAsDataURL(file);
                }
              }} />
              <p className="text-xs text-muted-foreground">PNG, JPG. Max 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>From your company directory</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value="John Doe" disabled className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <Input value="Senior Project Manager" disabled className="bg-secondary/50" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => toast.success('Email updated')} />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={() => toast.success('Phone updated')} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Globe className="w-5 h-5 text-primary" />Regional Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={timezone} onValueChange={(v) => { setTimezone(v); toast.success('Timezone updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['UTC+00:00','UTC+01:00','UTC+02:00','UTC+03:00','UTC-05:00','UTC-08:00'].map(tz => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Language</Label>
              <Select value={language} onValueChange={(v) => { setLanguage(v); toast.success('Language updated'); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
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
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-success"><Check className="w-4 h-4" />All changes saved</div>
        </CardContent>
      </Card>
    </div>
  );
}
