import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Shield, Bell, Globe, Palette, Save } from "lucide-react";
import { toast } from "sonner";

const AdminSettingsPage = () => {
  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    platformName: "LightPro",
    supportEmail: "support@lightpro.io",
    supportPhone: "+1 (555) 123-4567",
    websiteUrl: "https://lightpro.io",
    maintenanceMode: false,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: true,
    sessionTimeout: true,
    sessionDuration: "60",
    passwordExpiry: "90",
    loginAttempts: "5",
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnSignup: true,
    emailOnFailedPayment: true,
    emailOnLicenseExpiration: true,
    emailOnDailySummary: false,
    slackNotifications: true,
    smsAlerts: false,
  });

  // Theme Settings State
  const [themeSettings, setThemeSettings] = useState({
    theme: "auto",
    primaryColor: "#0066FF",
    accentColor: "#FF6B35",
    fontSize: "normal",
  });

  // Localization Settings State
  const [localizationSettings, setLocalizationSettings] = useState({
    language: "en",
    timezone: "UTC",
    currency: "USD",
    dateFormat: "MM/DD/YYYY",
  });

  // General Settings Handlers
  const handleGeneralChange = (field: string, value: string | boolean) => {
    setGeneralSettings({ ...generalSettings, [field]: value });
  };

  const handleGeneralSave = () => {
    console.log("Saving general settings:", generalSettings);
    toast.success("General settings saved successfully!");
  };

  // Security Settings Handlers
  const handleSecurityChange = (field: string, value: string | boolean) => {
    setSecuritySettings({ ...securitySettings, [field]: value });
  };

  const handleSecuritySave = () => {
    console.log("Saving security settings:", securitySettings);
    toast.success("Security settings saved successfully!");
  };

  // Notification Settings Handlers
  const handleNotificationChange = (field: string, value: boolean) => {
    setNotificationSettings({ ...notificationSettings, [field]: value });
  };

  const handleNotificationSave = () => {
    console.log("Saving notification settings:", notificationSettings);
    toast.success("Notification settings saved successfully!");
  };

  // Theme Settings Handlers
  const handleThemeChange = (field: string, value: string) => {
    setThemeSettings({ ...themeSettings, [field]: value });
  };

  const handleThemeSave = () => {
    console.log("Saving theme settings:", themeSettings);
    toast.success("Theme settings saved successfully!");
  };

  // Localization Settings Handlers
  const handleLocalizationChange = (field: string, value: string) => {
    setLocalizationSettings({ ...localizationSettings, [field]: value });
  };

  const handleLocalizationSave = () => {
    console.log("Saving localization settings:", localizationSettings);
    toast.success("Localization settings saved successfully!");
  };

  return (
    <PageContainer
      title="Admin Settings"
      description="Configure platform-wide settings"
    >
      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={generalSettings.platformName}
                  onChange={(e) => handleGeneralChange("platformName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={generalSettings.supportEmail}
                  onChange={(e) => handleGeneralChange("supportEmail", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportPhone">Support Phone</Label>
                <Input
                  id="supportPhone"
                  type="tel"
                  value={generalSettings.supportPhone}
                  onChange={(e) => handleGeneralChange("supportPhone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="websiteUrl">Website URL</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={generalSettings.websiteUrl}
                  onChange={(e) => handleGeneralChange("websiteUrl", e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">Disable access for non-admins</p>
              </div>
              <Switch
                checked={generalSettings.maintenanceMode}
                onCheckedChange={(checked) => handleGeneralChange("maintenanceMode", checked)}
              />
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleGeneralSave}>
                <Save className="h-4 w-4 mr-2" />
                Save General Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </CardTitle>
            <CardDescription>Authentication and security configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Require 2FA for all admin users</p>
              </div>
              <Switch
                checked={securitySettings.twoFactorAuth}
                onCheckedChange={(checked) => handleSecurityChange("twoFactorAuth", checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
              </div>
              <Switch
                checked={securitySettings.sessionTimeout}
                onCheckedChange={(checked) => handleSecurityChange("sessionTimeout", checked)}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
              <div className="space-y-2">
                <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                <Input
                  id="sessionDuration"
                  type="number"
                  value={securitySettings.sessionDuration}
                  onChange={(e) => handleSecurityChange("sessionDuration", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                <Input
                  id="passwordExpiry"
                  type="number"
                  value={securitySettings.passwordExpiry}
                  onChange={(e) => handleSecurityChange("passwordExpiry", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                <Input
                  id="loginAttempts"
                  type="number"
                  value={securitySettings.loginAttempts}
                  onChange={(e) => handleSecurityChange("loginAttempts", e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleSecuritySave}>
                <Save className="h-4 w-4 mr-2" />
                Save Security Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Admin notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <h4 className="font-medium">Email Notifications</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>New Customer Signups</Label>
                    <p className="text-sm text-muted-foreground">Email when new customers register</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailOnSignup}
                    onCheckedChange={(checked) => handleNotificationChange("emailOnSignup", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Failed Payments</Label>
                    <p className="text-sm text-muted-foreground">Email when payments fail</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailOnFailedPayment}
                    onCheckedChange={(checked) => handleNotificationChange("emailOnFailedPayment", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>License Expiration</Label>
                    <p className="text-sm text-muted-foreground">Alert before licenses expire</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailOnLicenseExpiration}
                    onCheckedChange={(checked) => handleNotificationChange("emailOnLicenseExpiration", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Daily Summary</Label>
                    <p className="text-sm text-muted-foreground">Daily digest of activities</p>
                  </div>
                  <Switch
                    checked={notificationSettings.emailOnDailySummary}
                    onCheckedChange={(checked) => handleNotificationChange("emailOnDailySummary", checked)}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium">Third-party Integrations</h4>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Slack Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send alerts to Slack channel</p>
                  </div>
                  <Switch
                    checked={notificationSettings.slackNotifications}
                    onCheckedChange={(checked) => handleNotificationChange("slackNotifications", checked)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>SMS Alerts</Label>
                    <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                  </div>
                  <Switch
                    checked={notificationSettings.smsAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("smsAlerts", checked)}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleNotificationSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Notification Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Theme Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Theme Settings
            </CardTitle>
            <CardDescription>Customize the platform appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Theme Mode</Label>
                <div className="flex gap-2">
                  {["light", "dark", "auto"].map((mode) => (
                    <Button
                      key={mode}
                      variant={themeSettings.theme === mode ? "default" : "outline"}
                      onClick={() => handleThemeChange("theme", mode)}
                      className="capitalize"
                    >
                      {mode === "auto" ? "Auto (System)" : mode}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={themeSettings.primaryColor}
                      onChange={(e) => handleThemeChange("primaryColor", e.target.value)}
                      placeholder="#0066FF"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                      className="w-16 h-10 p-1 cursor-pointer"
                    />
                    <Input
                      value={themeSettings.accentColor}
                      onChange={(e) => handleThemeChange("accentColor", e.target.value)}
                      placeholder="#FF6B35"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t">
                <Label>Font Size</Label>
                <div className="flex gap-2">
                  {["small", "normal", "large"].map((size) => (
                    <Button
                      key={size}
                      variant={themeSettings.fontSize === size ? "default" : "outline"}
                      onClick={() => handleThemeChange("fontSize", size)}
                      className="capitalize"
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleThemeSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Theme Settings
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Localization Settings
            </CardTitle>
            <CardDescription>Regional and language configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select
                  value={localizationSettings.language}
                  onValueChange={(value) => handleLocalizationChange("language", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="pt">Portuguese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={localizationSettings.timezone}
                  onValueChange={(value) => handleLocalizationChange("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={localizationSettings.currency}
                  onValueChange={(value) => handleLocalizationChange("currency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="BRL">BRL (R$)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Select
                  value={localizationSettings.dateFormat}
                  onValueChange={(value) => handleLocalizationChange("dateFormat", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={handleLocalizationSave}>
                <Save className="h-4 w-4 mr-2" />
                Save Localization Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminSettingsPage;
