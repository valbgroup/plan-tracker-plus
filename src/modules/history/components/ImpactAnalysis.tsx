import React from 'react';
import { GitMerge, ArrowRight, AlertTriangle, CheckCircle, Info, TrendingUp, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImpactItem {
  id: string;
  entity: string;
  type: 'BUDGET' | 'SCHEDULE' | 'SCOPE' | 'RESOURCE' | 'RISK';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  cascadeEffects: string[];
}

interface ChangeProposal {
  id: string;
  title: string;
  type: string;
  proposedBy: string;
  date: Date;
  status: 'ANALYZING' | 'APPROVED' | 'REJECTED';
  impacts: ImpactItem[];
}

const MOCK_PROPOSAL: ChangeProposal = {
  id: 'proposal-1',
  title: 'Budget Increase for Phase 3',
  type: 'BUDGET',
  proposedBy: 'Ahmed Benali',
  date: new Date(),
  status: 'ANALYZING',
  impacts: [
    {
      id: 'impact-1',
      entity: 'Project Budget',
      type: 'BUDGET',
      severity: 'HIGH',
      description: 'Total budget increases by 20% from 100,000 DZD to 120,000 DZD',
      cascadeEffects: ['Portfolio budget reallocation required', 'CFO approval needed'],
    },
    {
      id: 'impact-2',
      entity: 'Phase 3 Schedule',
      type: 'SCHEDULE',
      severity: 'MEDIUM',
      description: 'Additional resources will accelerate Phase 3 by 2 weeks',
      cascadeEffects: ['Phase 4 can start earlier', 'Testing timeline improved'],
    },
    {
      id: 'impact-3',
      entity: 'Team Capacity',
      type: 'RESOURCE',
      severity: 'LOW',
      description: '2 additional developers needed for 3 months',
      cascadeEffects: ['HR recruitment process', 'Onboarding time'],
    },
    {
      id: 'impact-4',
      entity: 'Risk Profile',
      type: 'RISK',
      severity: 'MEDIUM',
      description: 'Technical risk reduced with additional expertise',
      cascadeEffects: ['Quality metrics improvement expected'],
    },
  ],
};

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'HIGH': return 'destructive';
    case 'MEDIUM': return 'secondary';
    default: return 'outline';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'BUDGET': return '💰';
    case 'SCHEDULE': return '📅';
    case 'SCOPE': return '📋';
    case 'RESOURCE': return '👥';
    case 'RISK': return '⚠️';
    default: return '📌';
  }
};

export const ImpactAnalysis: React.FC = () => {
  const highImpacts = MOCK_PROPOSAL.impacts.filter((i) => i.severity === 'HIGH').length;
  const mediumImpacts = MOCK_PROPOSAL.impacts.filter((i) => i.severity === 'MEDIUM').length;
  const lowImpacts = MOCK_PROPOSAL.impacts.filter((i) => i.severity === 'LOW').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitMerge className="w-6 h-6" />
            Impact Analysis
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Analyze change impacts before approval
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">New Analysis</Button>
          <Button>Run Simulation</Button>
        </div>
      </div>

      {/* Current Proposal */}
      <Card className="border-primary/50">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-start justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">Analyzing</Badge>
              <CardTitle>{MOCK_PROPOSAL.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Proposed by {MOCK_PROPOSAL.proposedBy} on {MOCK_PROPOSAL.date.toLocaleDateString()}
              </p>
            </div>
            <Badge variant="outline" className="text-lg px-3 py-1">
              {MOCK_PROPOSAL.type}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Impact Summary */}
          <div className="grid grid-cols-3 border-b">
            <div className="p-4 text-center border-r">
              <p className="text-3xl font-bold text-destructive">{highImpacts}</p>
              <p className="text-sm text-muted-foreground">High Impact</p>
            </div>
            <div className="p-4 text-center border-r">
              <p className="text-3xl font-bold text-amber-600">{mediumImpacts}</p>
              <p className="text-sm text-muted-foreground">Medium Impact</p>
            </div>
            <div className="p-4 text-center">
              <p className="text-3xl font-bold text-emerald-600">{lowImpacts}</p>
              <p className="text-sm text-muted-foreground">Low Impact</p>
            </div>
          </div>

          {/* Impact Details */}
          <div className="divide-y">
            {MOCK_PROPOSAL.impacts.map((impact) => (
              <div key={impact.id} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="text-2xl">{getTypeIcon(impact.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{impact.entity}</span>
                      <Badge variant={getSeverityColor(impact.severity)} className="text-xs">
                        {impact.severity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">{impact.description}</p>

                    {/* Cascade Effects */}
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                        <ArrowRight className="w-3 h-3" />
                        Cascade Effects:
                      </p>
                      <ul className="space-y-1">
                        {impact.cascadeEffects.map((effect, i) => (
                          <li key={i} className="text-sm flex items-center gap-2 text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
                            {effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendation */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h4 className="font-semibold text-primary mb-1">Analysis Recommendation</h4>
              <p className="text-sm text-muted-foreground">
                Based on the impact analysis, this change has a <strong>moderate overall risk level</strong>. 
                The budget impact is significant but manageable with proper portfolio reallocation. 
                The schedule improvement and risk reduction make this a favorable trade-off.
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="default" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approve with Conditions
                </Button>
                <Button variant="outline" className="gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Request More Info
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Historical Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Similar Changes (Last 12 months)</p>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground mt-1">6 approved, 2 rejected</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Avg Implementation Time</p>
              <p className="text-2xl font-bold">14 days</p>
              <p className="text-xs text-muted-foreground mt-1">From approval to completion</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg border">
              <p className="text-sm text-muted-foreground mb-2">Success Rate</p>
              <p className="text-2xl font-bold text-emerald-600">87%</p>
              <p className="text-xs text-muted-foreground mt-1">Changes achieving expected outcome</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
