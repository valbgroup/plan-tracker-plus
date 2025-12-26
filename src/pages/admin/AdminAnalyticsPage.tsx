import { useState } from "react";
import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminTable } from "@/components/admin";
import { BarChart3, Users, Activity, Clock, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const AdminAnalyticsPage = () => {
  const [dateRange, setDateRange] = useState("30days");

  // Chart data (30 days user activity)
  const userActivityData = [
    { day: "Day 1", users: 800 },
    { day: "Day 2", users: 850 },
    { day: "Day 3", users: 920 },
    { day: "Day 4", users: 890 },
    { day: "Day 5", users: 950 },
    { day: "Day 6", users: 1020 },
    { day: "Day 7", users: 1100 },
    { day: "Day 8", users: 1050 },
    { day: "Day 9", users: 1150 },
    { day: "Day 10", users: 1200 },
    { day: "Day 11", users: 1180 },
    { day: "Day 12", users: 1250 },
    { day: "Day 13", users: 1300 },
    { day: "Day 14", users: 1350 },
    { day: "Day 15", users: 1400 },
    { day: "Day 16", users: 1380 },
    { day: "Day 17", users: 1450 },
    { day: "Day 18", users: 1500 },
    { day: "Day 19", users: 1480 },
    { day: "Day 20", users: 1550 },
    { day: "Day 21", users: 1600 },
    { day: "Day 22", users: 1580 },
    { day: "Day 23", users: 1650 },
    { day: "Day 24", users: 1700 },
    { day: "Day 25", users: 1680 },
    { day: "Day 26", users: 1750 },
    { day: "Day 27", users: 1800 },
    { day: "Day 28", users: 1820 },
    { day: "Day 29", users: 1900 },
    { day: "Day 30", users: 1950 },
  ];

  // Feature usage data
  const featureUsageData = [
    { id: 1, feature: "Dashboard", timesUsed: "45,320", usersPercent: "95%", trend: "up", change: "+12%" },
    { id: 2, feature: "Reports Export", timesUsed: "12,450", usersPercent: "45%", trend: "up", change: "+8%" },
    { id: 3, feature: "Data Import", timesUsed: "8,230", usersPercent: "28%", trend: "down", change: "-3%" },
    { id: 4, feature: "API Integration", timesUsed: "3,100", usersPercent: "12%", trend: "up", change: "+25%" },
    { id: 5, feature: "Bulk Operations", timesUsed: "2,890", usersPercent: "10%", trend: "up", change: "+15%" },
  ];

  const featureColumns = [
    { key: "feature", label: "Feature Name", sortable: true },
    { key: "timesUsed", label: "Times Used", sortable: true },
    { key: "usersPercent", label: "% of Users", sortable: true },
    { 
      key: "trend", 
      label: "Trend", 
      sortable: false,
      render: (value: string, row: any) => (
        <span className={`flex items-center gap-1 text-sm ${row.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {row.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
          {row.change}
        </span>
      )
    },
  ];

  const handleRefresh = () => {
    toast.success("Analytics data refreshed!");
  };

  return (
    <PageContainer
      title="Analytics"
      description="Platform usage and engagement metrics"
    >
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Daily Active Users", value: "1,847", icon: Users, change: "+12.5%", trend: "up" },
          { label: "Avg. Session Time", value: "24m 32s", icon: Clock, change: "+8.2%", trend: "up" },
          { label: "Page Views", value: "45,231", icon: BarChart3, change: "+15.3%", trend: "up" },
          { label: "Feature Usage", value: "89%", icon: Activity, change: "-2.1%", trend: "down" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className={`text-xs mt-1 flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* User Activity Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>User Activity (30 Days)</CardTitle>
          <CardDescription>Daily active users over the selected period</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Feature Usage and User Retention */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Feature Usage Table */}
        <Card>
          <CardHeader>
            <CardTitle>Feature Usage</CardTitle>
            <CardDescription>Most used platform features</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminTable
              columns={featureColumns}
              data={featureUsageData}
              keyField="id"
            />
          </CardContent>
        </Card>

        {/* User Retention */}
        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>Monthly cohort retention rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { cohort: "Month 1", retention: 95 },
                { cohort: "Month 3", retention: 82 },
                { cohort: "Month 6", retention: 71 },
                { cohort: "Month 12", retention: 58 },
                { cohort: "Month 24", retention: 42 },
              ].map((item) => (
                <div key={item.cohort} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.cohort}</span>
                    <span className="font-medium">{item.retention}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all duration-500" 
                      style={{ width: `${item.retention}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Features Progress */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top Features by Usage</CardTitle>
          <CardDescription>Feature adoption across all users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { feature: "Project Dashboard", usage: 92, color: "bg-blue-500" },
              { feature: "Gantt Charts", usage: 78, color: "bg-green-500" },
              { feature: "Resource Planning", usage: 65, color: "bg-yellow-500" },
              { feature: "Budget Tracking", usage: 58, color: "bg-purple-500" },
              { feature: "Reports Export", usage: 45, color: "bg-orange-500" },
            ].map((item) => (
              <div key={item.feature} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.feature}</span>
                  <span className="text-muted-foreground">{item.usage}%</span>
                </div>
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-500`}
                    style={{ width: `${item.usage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
};

export default AdminAnalyticsPage;
