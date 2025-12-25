import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Accessibility, Eye, Keyboard } from 'lucide-react';
import { toast } from 'sonner';

export function AccessibilitySettings() {
  const [highContrast, setHighContrast] = useState(false);
  const [colorblindMode, setColorblindMode] = useState('none');
  const [fontSize, setFontSize] = useState([100]);
  const [textSpacing, setTextSpacing] = useState([1.5]);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(true);
  const [screenReader, setScreenReader] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-primary" />Visual Accessibility</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div><Label>High Contrast Mode</Label><p className="text-xs text-muted-foreground">Enhanced color contrast</p></div>
            <Switch checked={highContrast} onCheckedChange={(v) => { setHighContrast(v); toast.success('High contrast ' + (v ? 'enabled' : 'disabled')); }} />
          </div>
          <div className="space-y-2">
            <Label>Colorblind Mode</Label>
            <Select value={colorblindMode} onValueChange={(v) => { setColorblindMode(v); toast.success('Colorblind mode updated'); }}>
              <SelectTrigger className="w-64"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia (Red-Green)</SelectItem>
                <SelectItem value="protanopia">Protanopia</SelectItem>
                <SelectItem value="tritanopia">Tritanopia</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Font Size: {fontSize[0]}%</Label>
            <Slider value={fontSize} onValueChange={setFontSize} min={80} max={200} step={10} className="w-64" />
          </div>
          <div className="space-y-2">
            <Label>Line Height: {textSpacing[0]}x</Label>
            <Slider value={textSpacing} onValueChange={setTextSpacing} min={1} max={2} step={0.1} className="w-64" />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Reduce Motion</Label><p className="text-xs text-muted-foreground">Disable animations</p></div>
            <Switch checked={reduceMotion} onCheckedChange={(v) => { setReduceMotion(v); toast.success('Reduce motion ' + (v ? 'enabled' : 'disabled')); }} />
          </div>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader><CardTitle className="flex items-center gap-2"><Keyboard className="w-5 h-5 text-primary" />Navigation Accessibility</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div><Label>Keyboard Navigation</Label><p className="text-xs text-muted-foreground">Show focus indicators</p></div>
            <Switch checked={keyboardNav} onCheckedChange={setKeyboardNav} />
          </div>
          <div className="flex items-center justify-between">
            <div><Label>Screen Reader Support</Label><p className="text-xs text-muted-foreground">Enable ARIA labels</p></div>
            <Switch checked={screenReader} onCheckedChange={setScreenReader} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
