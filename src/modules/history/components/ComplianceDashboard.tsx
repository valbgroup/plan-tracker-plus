import React from 'react';
import { CheckCircle2, AlertTriangle, Shield, TrendingUp, Activity, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface UserComplianceData {
  id: string;
  name: string;
  totalChanges: number;
  approvedChanges: number;
  approvalRate: number;
  status: 'COMPLIANT' | 'WARNING' | 'NON_COMPLIANT';
}

const MOCK_USER_COMPLIANCE: UserComplianceData[] = [
  { id: '1', name: 'John Doe', totalChanges: 47, approvedChanges: 46, approvalRate: 97.9, status: 'COMPLIANT' },
  { id: '2', name: 'Jane Smith', totalChanges: 23, approvedChanges: 23, approvalRate: 100, status: 'COMPLIANT' },
  { id: '3', name: 'Ahmed Ben Ali', totalChanges: 15, approvedChanges: 14, approvalRate: 93.3, status: 'WARNING' },
  { id: '4', name: 'PMO Admin', totalChanges: 8, approvedChanges: 8, approvalRate: 100, status: 'COMPLIANT' },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'COMPLIANT':
      return (
        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 gap-1">
          <CheckCircle2 className="w-3 h-3" />
          COMPLIANT
        </Badge>
      );
    case 'WARNING':
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 gap-1">
          <AlertTriangle className="w-3 h-3" />
          WARNING
        </Badge>
      );
    case 'NON_COMPLIANT':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 gap-1">
          <AlertTriangle className="w-3 h-3" />
          NON-COMPLIANT
        </Badge>
      );
    default:
      return null;
  }
};

export const ComplianceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            Compliance Dashboard
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Regulatory compliance tracking and reporting
          </p>
        </div>
      </div>

      {/* Traceability Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Traceability Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Audit Trail Completeness */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Audit Trail Completeness</span>
              <span className="text-sm font-bold text-emerald-600">98%</span>
            </div>
            <Progress value={98} className="h-3 [&>div]:bg-emerald-500" />
            <p className="text-xs text-muted-foreground mt-1">All changes properly documented and timestamped</p>
          </div>

          {/* Signature Compliance */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Signature Compliance</span>
              <span className="text-sm font-bold text-primary">92%</span>
            </div>
            <Progress value={92} className="h-3 [&>div]:bg-primary" />
            <p className="text-xs text-muted-foreground mt-1">Electronic signatures for critical changes</p>
          </div>

          {/* Change Documentation */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Change Documentation</span>
              <span className="text-sm font-bold text-emerald-600">100%</span>
            </div>
            <Progress value={100} className="h-3 [&>div]:bg-emerald-500" />
            <p className="text-xs text-muted-foreground mt-1">Full justification provided for all modifications</p>
          </div>
        </CardContent>
      </Card>

      {/* Baseline Stability */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Baseline Stability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-muted-foreground mb-1">Change Rate</p>
              <p className="text-2xl font-bold text-emerald-700">1.5/month</p>
              <p className="text-xs text-emerald-600 mt-1">Within acceptable range</p>
            </div>

            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-1">Days Between Changes</p>
              <p className="text-2xl font-bold text-primary">20 days</p>
              <p className="text-xs text-muted-foreground mt-1">Average interval</p>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <p className="text-sm text-muted-foreground mb-1">Unapproved Changes</p>
              <p className="text-2xl font-bold text-emerald-700">0</p>
              <p className="text-xs text-emerald-600 mt-1">All changes validated</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Compliance Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Compliance Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead className="text-center">Changes</TableHead>
                <TableHead className="text-center">Approved</TableHead>
                <TableHead className="text-center">Rate</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_USER_COMPLIANCE.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-center">{user.totalChanges}</TableCell>
                  <TableCell className="text-center">{user.approvedChanges}</TableCell>
                  <TableCell className="text-center">
                    <span className={cn(
                      'font-medium',
                      user.approvalRate >= 95 ? 'text-emerald-600' : 
                      user.approvalRate >= 90 ? 'text-amber-600' : 'text-red-600'
                    )}>
                      {user.approvalRate.toFixed(1)}%
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {getStatusBadge(user.status)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <Card className="bg-emerald-50/50 border-emerald-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-800 mb-1">Overall Compliance Status: Excellent</h4>
              <p className="text-sm text-emerald-700">
                The project portfolio maintains high compliance standards with 98% traceability, 
                100% documentation coverage, and stable baseline management. One user (Ahmed Ben Ali) 
                requires attention due to approval rate below 95%.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
