import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, GitBranch, Shield, Plug, SlidersHorizontal, ClipboardList, Users } from 'lucide-react';
import { OrganizationConfig } from '@/components/settings/system/OrganizationConfig';
import { WorkflowSettings } from '@/components/settings/system/WorkflowSettings';
import { SecuritySettings } from '@/components/settings/system/SecuritySettings';
import { IntegrationConfig } from '@/components/settings/system/IntegrationConfig';
import { SystemPreferences } from '@/components/settings/system/SystemPreferences';
import { AuditCompliance } from '@/components/settings/system/AuditCompliance';
import { UserManagement } from '@/components/settings/system/UserManagement';

const tabs = [
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'workflows', label: 'Workflows', icon: GitBranch },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integration', label: 'Integration', icon: Plug },
  { id: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { id: 'audit', label: 'Audit & Compliance', icon: ClipboardList },
  { id: 'users', label: 'User Management', icon: Users },
];

interface SystemSettingsProps {
  tab?: string;
}

export default function SystemSettings({ tab }: SystemSettingsProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = tab || searchParams.get('tab') || 'organization';

  const handleTabChange = (value: string) => {
    if (tab) {
      navigate(`/settings/system/${value === 'organization' ? '' : value}`);
    } else {
      setSearchParams({ tab: value });
    }
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <p className="text-muted-foreground">
          Configure organization-wide settings, workflows, and integrations
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

        <TabsContent value="organization" className="space-y-6 mt-6">
          <OrganizationConfig />
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6 mt-6">
          <WorkflowSettings />
        </TabsContent>

        <TabsContent value="security" className="space-y-6 mt-6">
          <SecuritySettings />
        </TabsContent>

        <TabsContent value="integration" className="space-y-6 mt-6">
          <IntegrationConfig />
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6 mt-6">
          <SystemPreferences />
        </TabsContent>

        <TabsContent value="audit" className="space-y-6 mt-6">
          <AuditCompliance />
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <UserManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
