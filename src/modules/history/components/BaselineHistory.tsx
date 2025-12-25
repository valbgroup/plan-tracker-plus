import React, { useState } from 'react';
import { TrendingUp, Archive, Copy, Download, GitBranch, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BaselineVersion {
  id: string;
  version: string;
  createdDate: Date;
  createdBy: string;
  changeCategory: 'STRUCTUREL' | 'BUDGETAIRE' | 'PLANNING' | 'GOUVERNANCE';
  modifiedItems: number;
  reason: string;
  status: 'ACTIVE' | 'ARCHIVEE' | 'SUSPENDUE';
  businessImpact: number;
}

interface BaselineHistoryProps {
  projectId?: string;
}

const MOCK_VERSIONS: BaselineVersion[] = [
  {
    id: 'v1',
    version: 'V2.0',
    createdDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    createdBy: 'PMO Team',
    changeCategory: 'STRUCTUREL',
    modifiedItems: 12,
    reason: 'Major scope change with 2 new phases added to address client feedback',
    status: 'ACTIVE',
    businessImpact: 8,
  },
  {
    id: 'v2',
    version: 'V1.1',
    createdDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    createdBy: 'Ahmed Benali',
    changeCategory: 'BUDGETAIRE',
    modifiedItems: 5,
    reason: 'Budget adjustment for Q2 operational expenses and contingency',
    status: 'ARCHIVEE',
    businessImpact: 6,
  },
  {
    id: 'v3',
    version: 'V1.0',
    createdDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    createdBy: 'Project Manager',
    changeCategory: 'STRUCTUREL',
    modifiedItems: 0,
    reason: 'Initial project baseline - approved by steering committee',
    status: 'ARCHIVEE',
    businessImpact: 10,
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'STRUCTUREL': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'BUDGETAIRE': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'PLANNING': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'GOUVERNANCE': return 'bg-amber-100 text-amber-800 border-amber-200';
    default: return 'bg-muted';
  }
};

const getImpactColor = (impact: number) => {
  if (impact >= 8) return 'text-destructive';
  if (impact >= 5) return 'text-amber-600';
  return 'text-emerald-600';
};

export const BaselineHistory: React.FC<BaselineHistoryProps> = ({ projectId }) => {
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);

  const activeVersion = MOCK_VERSIONS.find((v) => v.status === 'ACTIVE');
  const daysSinceLastChange = activeVersion
    ? Math.floor((Date.now() - activeVersion.createdDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Baseline History
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Evolution of baseline versions with impact analysis
          </p>
        </div>
        <Button className="gap-2">
          <Copy className="w-4 h-4" />
          New Baseline
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Current Version</p>
            <p className="text-3xl font-bold text-primary mt-2">{activeVersion?.version || 'N/A'}</p>
            <p className="text-xs text-muted-foreground mt-1">Active baseline</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Versions</p>
            <p className="text-3xl font-bold mt-2">{MOCK_VERSIONS.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Complete history</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Baseline Stability</p>
            <p className="text-3xl font-bold text-amber-600 mt-2">
              {MOCK_VERSIONS.length <= 3 ? 'High' : 'Low'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {MOCK_VERSIONS.length} changes in project
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Days Since Change</p>
            <p className="text-3xl font-bold mt-2">{daysSinceLastChange}</p>
            <p className="text-xs text-muted-foreground mt-1">By {activeVersion?.createdBy}</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Version Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {MOCK_VERSIONS.map((version, index) => (
              <div key={version.id} className="flex gap-4">
                {/* Timeline marker */}
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2',
                      version.status === 'ACTIVE'
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted text-muted-foreground border-border'
                    )}
                  >
                    {version.version.replace('V', '')}
                  </div>
                  {index < MOCK_VERSIONS.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[3rem] bg-border my-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-2">
                  <Card className={cn(version.status === 'ACTIVE' && 'border-primary/50')}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{version.version}</h4>
                            {version.status === 'ACTIVE' && (
                              <Badge variant="default" className="text-xs">Active</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {version.createdDate.toLocaleDateString()} by {version.createdBy}
                          </p>
                        </div>
                        <Badge variant="outline" className={cn('text-xs', getCategoryColor(version.changeCategory))}>
                          {version.changeCategory}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div>
                          <span className="text-xs text-muted-foreground block">Modified Items</span>
                          <p className="font-medium">{version.modifiedItems}</p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Business Impact</span>
                          <p className={cn('font-bold', getImpactColor(version.businessImpact))}>
                            {version.businessImpact}/10
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground block">Status</span>
                          <p className="font-medium">{version.status}</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3">{version.reason}</p>

                      <div className="flex gap-2">
                        {version.status === 'ACTIVE' ? (
                          <>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <ArrowRight className="w-3.5 h-3.5" />
                              Compare
                            </Button>
                            <Button variant="outline" size="sm" className="gap-1.5">
                              <Download className="w-3.5 h-3.5" />
                              Export
                            </Button>
                          </>
                        ) : (
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Archive className="w-3.5 h-3.5" />
                            Restore
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Change Frequency */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Change Frequency Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {['Month 1', 'Month 2', 'Month 3', 'Month 4'].map((month, i) => (
              <div key={i} className="text-center">
                <div className="h-24 bg-muted/50 rounded-lg border flex items-end justify-center p-2">
                  <div
                    className="w-8 bg-primary rounded-t transition-all"
                    style={{ height: `${Math.random() * 80 + 20}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{month}</p>
                <p className="font-semibold">{Math.floor(Math.random() * 2) + 1} version(s)</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
