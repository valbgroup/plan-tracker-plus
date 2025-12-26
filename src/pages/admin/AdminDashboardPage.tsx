import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, TrendingUp, Package, BarChart3 } from "lucide-react";

const stats = [
  { title: "Total Customers", value: "2,847", change: "+12.5%", icon: Users },
  { title: "Active Licenses", value: "4,231", change: "+8.2%", icon: FileText },
  { title: "Monthly Revenue", value: "$127,450", change: "+15.3%", icon: DollarSign },
  { title: "Growth Rate", value: "23.5%", change: "+2.1%", icon: TrendingUp },
];

const AdminDashboardPage = () => {
  return (
    <PageContainer
      title="Admin Dashboard"
      description="Business overview and key metrics"
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Signups
            </CardTitle>
            <CardDescription>Latest customer registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["TechCorp Inc.", "GlobalMedia Ltd.", "StartupXYZ", "Enterprise Co."].map((company) => (
                <div key={company} className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm">{company}</span>
                  <span className="text-xs text-muted-foreground">Today</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              License Distribution
            </CardTitle>
            <CardDescription>By plan type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { plan: "Starter", count: 1245, pct: 44 },
                { plan: "Professional", count: 1102, pct: 39 },
                { plan: "Enterprise", count: 500, pct: 17 },
              ].map((item) => (
                <div key={item.plan} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.plan}</span>
                    <span className="text-muted-foreground">{item.count}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Revenue Breakdown
            </CardTitle>
            <CardDescription>Monthly recurring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { source: "Subscriptions", amount: "$98,450" },
                { source: "Add-ons", amount: "$18,200" },
                { source: "Overages", amount: "$10,800" },
              ].map((item) => (
                <div key={item.source} className="flex items-center justify-between border-b pb-2">
                  <span className="text-sm">{item.source}</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminDashboardPage;
