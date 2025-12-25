import React, { useState } from 'react';
import { FileText, Download, Calendar, Settings, Check, File, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ReportTemplate {
  id: string;
  name: string;
  frequency: string;
  pageCount: string;
  format: 'PDF' | 'Excel' | 'PDF/Excel';
  description: string;
  icon: React.ReactNode;
}

interface RecentReport {
  id: string;
  name: string;
  date: string;
  size: string;
  format: 'PDF' | 'Excel';
}

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'executive',
    name: 'Executive Summary',
    frequency: 'Monthly',
    pageCount: '2-3 pages',
    format: 'PDF',
    description: 'High-level overview for leadership with key metrics and insights',
    icon: <FileText className="w-6 h-6" />,
  },
  {
    id: 'detailed',
    name: 'Detailed Audit Trail',
    frequency: 'Weekly',
    pageCount: '10-20 pages',
    format: 'Excel',
    description: 'Complete change log with all modifications and approvals',
    icon: <FileSpreadsheet className="w-6 h-6" />,
  },
  {
    id: 'compliance',
    name: 'Compliance Report',
    frequency: 'Monthly',
    pageCount: '5-8 pages',
    format: 'PDF',
    description: 'Regulatory compliance status and user activity analysis',
    icon: <File className="w-6 h-6" />,
  },
  {
    id: 'impact',
    name: 'Impact Analysis Report',
    frequency: 'On Demand',
    pageCount: '6-10 pages',
    format: 'PDF/Excel',
    description: 'Detailed change impact assessment with recommendations',
    icon: <FileText className="w-6 h-6" />,
  },
];

const RECENT_REPORTS: RecentReport[] = [
  { id: '1', name: 'Executive Summary', date: 'Dec 24, 2024', size: '2.3 MB', format: 'PDF' },
  { id: '2', name: 'Detailed Audit Trail', date: 'Dec 23, 2024', size: '8.5 MB', format: 'Excel' },
  { id: '3', name: 'Compliance Report', date: 'Dec 22, 2024', size: '4.1 MB', format: 'PDF' },
];

const getFormatColor = (format: string) => {
  switch (format) {
    case 'PDF':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'Excel':
      return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'PDF/Excel':
      return 'bg-purple-100 text-purple-700 border-purple-200';
    default:
      return 'bg-muted';
  }
};

export const AuditReports: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [includeChanges, setIncludeChanges] = useState(true);
  const [includeAnomalies, setIncludeAnomalies] = useState(true);
  const [includeMetrics, setIncludeMetrics] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setSelectedTemplate(null);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Audit Reports
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Generate and schedule audit reports
          </p>
        </div>
      </div>

      {/* Report Templates */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REPORT_TEMPLATES.map((template) => (
            <Card
              key={template.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selectedTemplate === template.id && 'ring-2 ring-primary border-primary'
              )}
              onClick={() => setSelectedTemplate(template.id === selectedTemplate ? null : template.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-muted rounded-lg">
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{template.name}</h4>
                        <p className="text-xs text-muted-foreground">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="outline" className="text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {template.frequency}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.pageCount}
                      </Badge>
                      <Badge variant="outline" className={cn('text-xs', getFormatColor(template.format))}>
                        {template.format}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration Form */}
      {selectedTemplate && (
        <Card className="border-primary/50">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Configure Report
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="mb-2 block">From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateFrom && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="mb-2 block">To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !dateTo && 'text-muted-foreground'
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, 'PPP') : 'Select date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Include Options */}
            <div>
              <Label className="mb-3 block">Include in Report</Label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="changes"
                    checked={includeChanges}
                    onCheckedChange={(checked) => setIncludeChanges(checked as boolean)}
                  />
                  <label htmlFor="changes" className="text-sm font-medium cursor-pointer">
                    Changes
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anomalies"
                    checked={includeAnomalies}
                    onCheckedChange={(checked) => setIncludeAnomalies(checked as boolean)}
                  />
                  <label htmlFor="anomalies" className="text-sm font-medium cursor-pointer">
                    Anomalies
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="metrics"
                    checked={includeMetrics}
                    onCheckedChange={(checked) => setIncludeMetrics(checked as boolean)}
                  />
                  <label htmlFor="metrics" className="text-sm font-medium cursor-pointer">
                    Metrics
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="pt-4 border-t">
              <Button 
                className="w-full md:w-auto gap-2" 
                size="lg"
                onClick={handleGenerateReport}
                disabled={generating}
              >
                {generating ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Recent Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {RECENT_REPORTS.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'p-2 rounded',
                    report.format === 'PDF' ? 'bg-red-100' : 'bg-emerald-100'
                  )}>
                    {report.format === 'PDF' ? (
                      <FileText className="w-4 h-4 text-red-700" />
                    ) : (
                      <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{report.name}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">{report.size}</span>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
