import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, Activity, Clock } from "lucide-react";

const AdminAnalyticsPage = () => {
  return (
    <PageContainer
      title="Analytics"
      description="Platform usage and engagement metrics"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "Daily Active Users", value: "1,847", icon: Users },
          { label: "Avg. Session Time", value: "24m 32s", icon: Clock },
          { label: "Page Views", value: "45,231", icon: BarChart3 },
          { label: "Feature Usage", value: "89%", icon: Activity },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Features</CardTitle>
            <CardDescription>Most used platform features</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { feature: "Project Dashboard", usage: 92 },
                { feature: "Gantt Charts", usage: 78 },
                { feature: "Resource Planning", usage: 65 },
                { feature: "Budget Tracking", usage: 58 },
                { feature: "Reports Export", usage: 45 },
              ].map((item) => (
                <div key={item.feature} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.feature}</span>
                    <span className="text-muted-foreground">{item.usage}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${item.usage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Retention</CardTitle>
            <CardDescription>Monthly cohort retention rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { cohort: "Month 1", retention: "95%" },
                { cohort: "Month 3", retention: "82%" },
                { cohort: "Month 6", retention: "71%" },
                { cohort: "Month 12", retention: "58%" },
                { cohort: "Month 24", retention: "42%" },
              ].map((item) => (
                <div key={item.cohort} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">{item.cohort}</span>
                  <span className="font-medium">{item.retention}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminAnalyticsPage;
