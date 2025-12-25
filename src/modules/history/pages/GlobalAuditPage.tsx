import React, { useState } from 'react';
import { PageContainer } from '@/components/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlobalAudit } from '../components/GlobalAudit';
import { ImpactAnalysis } from '../components/ImpactAnalysis';
import { ComplianceDashboard } from '../components/ComplianceDashboard';
import { AuditReports } from '../components/AuditReports';
import { Shield, GitMerge, BarChart3, FileText } from 'lucide-react';

type AuditTab = 'audit' | 'impact' | 'compliance' | 'reports';

export function GlobalAuditPage() {
  const [activeTab, setActiveTab] = useState<AuditTab>('audit');

  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">History & Audit</h1>
          <p className="text-muted-foreground mt-1">
            Cross-project compliance, audit trail, and impact analysis
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AuditTab)}>
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
            <TabsTrigger value="audit" className="gap-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Global Audit</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="gap-2">
              <GitMerge className="w-4 h-4" />
              <span className="hidden sm:inline">Impact Analysis</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="gap-2">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="audit" className="mt-6">
            <GlobalAudit />
          </TabsContent>

          <TabsContent value="impact" className="mt-6">
            <ImpactAnalysis />
          </TabsContent>

          <TabsContent value="compliance" className="mt-6">
            <ComplianceDashboard />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <AuditReports />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}

export default GlobalAuditPage;
