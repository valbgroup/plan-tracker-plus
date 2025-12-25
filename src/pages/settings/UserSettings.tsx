import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Palette, Bell, LayoutDashboard, Shield, Database, Accessibility } from 'lucide-react';
import { ProfileSettings } from '@/components/settings/user/ProfileSettings';
import { InterfacePreferences } from '@/components/settings/user/InterfacePreferences';
import { NotificationPreferences } from '@/components/settings/user/NotificationPreferences';
import { DashboardCustomization } from '@/components/settings/user/DashboardCustomization';
import { SecurityTab } from '@/components/settings/user/SecurityTab';
import { DataPreferences } from '@/components/settings/user/DataPreferences';
import { AccessibilitySettings } from '@/components/settings/user/AccessibilitySettings';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'interface', label: 'Interface', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data', icon: Database },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
];

interface UserSettingsProps {
  tab?: string;
}

export default function UserSettings({ tab }: UserSettingsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = tab || searchParams.get('tab') || 'profile';

  const handleTabChange = (value: string) => {
    if (tab) {
      navigate(`/settings/profile/${value === 'profile' ? '' : value}`);
    } else {
      setSearchParams({ tab: value });
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">My Account</h1>
        <p className="text-muted-foreground">
          Manage your personal settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="bg-secondary/50 p-1 flex flex-wrap gap-1 h-auto">
          {tabs.map((t) => (
            <TabsTrigger
              key={t.id}
              value={t.id}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center gap-2 px-4 py-2"
            >
              <t.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{t.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="interface" className="space-y-6 mt-6">
          <InterfacePreferences />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 mt-6">
          <NotificationPreferences />
        </TabsContent>

        <TabsContent value="dashboard" className="space-y-6 mt-6">
          <DashboardCustomization />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="data" className="space-y-6 mt-6">
          <DataPreferences />
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-6 mt-6">
          <AccessibilitySettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
