import { PageContainer } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from "lucide-react";

const AdminRevenuePage = () => {
  return (
    <PageContainer
      title="Revenue"
      description="Financial metrics and revenue analytics"
    >
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        {[
          { label: "MRR", value: "$127,450", change: "+15.3%", icon: DollarSign },
          { label: "ARR", value: "$1.53M", change: "+18.2%", icon: TrendingUp },
          { label: "ARPU", value: "$44.78", change: "+5.1%", icon: CreditCard },
          { label: "Net Revenue", value: "$142,300", change: "+12.8%", icon: ArrowUpRight },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
            <CardDescription>Monthly breakdown by subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { plan: "Enterprise", revenue: "$78,500", pct: 62 },
                { plan: "Professional", revenue: "$35,200", pct: 28 },
                { plan: "Starter", revenue: "$13,750", pct: 10 },
              ].map((item) => (
                <div key={item.plan} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.plan}</span>
                    <span>{item.revenue}</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full">
                    <div 
                      className="h-full bg-primary rounded-full transition-all" 
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
            <CardTitle>Monthly Trend</CardTitle>
            <CardDescription>Last 6 months revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { month: "December", revenue: "$127,450" },
                { month: "November", revenue: "$118,200" },
                { month: "October", revenue: "$112,800" },
                { month: "September", revenue: "$105,300" },
                { month: "August", revenue: "$98,700" },
                { month: "July", revenue: "$92,100" },
              ].map((item) => (
                <div key={item.month} className="flex justify-between items-center border-b pb-2">
                  <span className="text-sm">{item.month}</span>
                  <span className="font-medium">{item.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
};

export default AdminRevenuePage;
