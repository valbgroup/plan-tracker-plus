import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Sun, Moon, Globe, Calendar, LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';

export function SystemPreferences() {
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [numberFormat, setNumberFormat] = useState('1,234.56');
  const [defaultPortfolio, setDefaultPortfolio] = useState('none');
  const [defaultLifecycle, setDefaultLifecycle] = useState('predictive');
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [initialStatus, setInitialStatus] = useState('draft');
  const [initialHealth, setInitialHealth] = useState('green');
  const [dashboardTheme, setDashboardTheme] = useState('standard');
  const [defaultChartType, setDefaultChartType] = useState('bar');

  const handleChange = (setter: (val: string) => void, value: string, name: string) => {
    setter(value);
    toast.success(`${name} updated`);
  };

  return (
    <div className="space-y-6">
      {/* UI Defaults */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            UI Defaults
          </CardTitle>
          <CardDescription>Default appearance settings for all users (users can override)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                System Theme
              </Label>
              <Select value={theme} onValueChange={(v) => handleChange(setTheme, v, 'Theme')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <span className="flex items-center gap-2"><Sun className="w-4 h-4" />Light</span>
                  </SelectItem>
                  <SelectItem value="dark">
                    <span className="flex items-center gap-2"><Moon className="w-4 h-4" />Dark</span>
                  </SelectItem>
                  <SelectItem value="auto">Auto (System)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Default Language
              </Label>
              <Select value={language} onValueChange={(v) => handleChange(setLanguage, v, 'Language')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Format
              </Label>
              <Select value={dateFormat} onValueChange={(v) => handleChange(setDateFormat, v, 'Date format')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY (24/12/2025)</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY (12/24/2025)</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD (2025-12-24)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Number Format</Label>
              <Select value={numberFormat} onValueChange={(v) => handleChange(setNumberFormat, v, 'Number format')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1,234.56">1,234.56 (US)</SelectItem>
                  <SelectItem value="1.234,56">1.234,56 (EU)</SelectItem>
                  <SelectItem value="1234.56">1234.56</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Defaults */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Project Defaults</CardTitle>
          <CardDescription>Default settings for new projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Default Portfolio</Label>
              <Select value={defaultPortfolio} onValueChange={(v) => handleChange(setDefaultPortfolio, v, 'Portfolio')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No portfolio</SelectItem>
                  <SelectItem value="strategic">Strategic Initiatives</SelectItem>
                  <SelectItem value="it">IT Projects</SelectItem>
                  <SelectItem value="innovation">Innovation Lab</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Lifecycle</Label>
              <Select value={defaultLifecycle} onValueChange={(v) => handleChange(setDefaultLifecycle, v, 'Lifecycle')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="predictive">Predictive</SelectItem>
                  <SelectItem value="agile">Agile</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={(v) => handleChange(setDefaultCurrency, v, 'Currency')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="DZD">DZD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Initial Project Status</Label>
              <Select value={initialStatus} onValueChange={(v) => handleChange(setInitialStatus, v, 'Initial status')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Initial Project Health</Label>
              <Select value={initialHealth} onValueChange={(v) => handleChange(setInitialHealth, v, 'Initial health')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="green">🟢 Green</SelectItem>
                  <SelectItem value="yellow">🟡 Yellow</SelectItem>
                  <SelectItem value="red">🔴 Red</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Defaults */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            Dashboard Defaults
          </CardTitle>
          <CardDescription>Default dashboard appearance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Dashboard Theme</Label>
              <Select value={dashboardTheme} onValueChange={(v) => handleChange(setDashboardTheme, v, 'Dashboard theme')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Default Chart Type</Label>
              <Select value={defaultChartType} onValueChange={(v) => handleChange(setDefaultChartType, v, 'Chart type')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Line Chart</SelectItem>
                  <SelectItem value="bar">Bar Chart</SelectItem>
                  <SelectItem value="pie">Pie Chart</SelectItem>
                  <SelectItem value="table">Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
