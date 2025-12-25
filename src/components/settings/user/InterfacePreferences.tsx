import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor, Palette } from 'lucide-react';
import { toast } from 'sonner';

export function InterfacePreferences() {
  const [theme, setTheme] = useState('light');
  const [sidebarBehavior, setSidebarBehavior] = useState('fixed');
  const [density, setDensity] = useState('normal');
  const [fontSize, setFontSize] = useState([100]);
  const [animations, setAnimations] = useState(true);
  const [defaultHome, setDefaultHome] = useState('dashboard');

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-5 h-5 text-primary" />Visual Theme</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup value={theme} onValueChange={(v) => { setTheme(v); toast.success('Theme updated'); }} className="grid grid-cols-3 gap-4">
            {[{v:'light',i:Sun,l:'Light'},{v:'dark',i:Moon,l:'Dark'},{v:'auto',i:Monitor,l:'Auto'}].map(({v,i:Icon,l}) => (
              <Label key={v} htmlFor={v} className={`flex flex-col items-center gap-2 p-4 rounded-lg border cursor-pointer transition-colors ${theme===v?'border-primary bg-primary/10':'border-border hover:bg-secondary/50'}`}>
                <RadioGroupItem value={v} id={v} className="sr-only" />
                <Icon className="w-6 h-6" /><span>{l}</span>
              </Label>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle>Layout Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label>Sidebar Behavior</Label>
            <RadioGroup value={sidebarBehavior} onValueChange={(v) => { setSidebarBehavior(v); toast.success('Sidebar updated'); }} className="flex gap-4">
              {['fixed','retractable','hidden'].map(v => (
                <div key={v} className="flex items-center gap-2">
                  <RadioGroupItem value={v} id={`sb-${v}`} />
                  <Label htmlFor={`sb-${v}`} className="cursor-pointer capitalize">{v}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>Interface Density</Label>
            <Select value={density} onValueChange={(v) => { setDensity(v); toast.success('Density updated'); }}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="compact">Compact</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="comfortable">Comfortable</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Font Size: {fontSize[0]}%</Label>
            <Slider value={fontSize} onValueChange={setFontSize} min={80} max={150} step={10} className="w-64" />
          </div>
          <div className="flex items-center gap-4">
            <Switch checked={animations} onCheckedChange={(v) => { setAnimations(v); toast.success('Animations ' + (v ? 'enabled' : 'disabled')); }} />
            <Label>Enable animations</Label>
          </div>
          <div className="space-y-2">
            <Label>Default Home Page</Label>
            <Select value={defaultHome} onValueChange={(v) => { setDefaultHome(v); toast.success('Home page updated'); }}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="master-data">Master Data</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
