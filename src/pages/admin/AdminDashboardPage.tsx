import { useOutletContext } from "react-router-dom";
import { AdminHeader, KPICard, StatusBadge, AdminTable, Column } from "@/components/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, DollarSign, FileKey2, Headphones, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  adminDashboardStats,
  revenueChartData,
  topCustomers,
  recentActivities,
} from "@/data/adminMockData";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value);
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();
  const context = useOutletContext<{ sidebarCollapsed: boolean; onMenuClick: () => void }>();

  const handleRefresh = () => {
    toast.success("Dashboard data refreshed");
  };

  const topCustomerColumns: Column<typeof topCustomers[0]>[] = [
    { 
      key: "name", 
      label: "Customer", 
      render: (value, row) => (
        <button 
          className="text-primary hover:underline font-medium text-left"
          onClick={() => navigate(`/admin/customers/${row.id}`)}
        >
          {value}
        </button>
      )
    },
    { 
      key: "revenue", 
      label: "Revenue", 
      render: (value) => formatCurrency(value) 
    },
    { 
      key: "status", 
      label: "Status", 
      render: (value) => <StatusBadge status={value} /> 
    },
    { key: "license", label: "License", render: (value) => <StatusBadge status={value.toLowerCase()} text={value} /> },
  ];

  const activityColumns: Column<typeof recentActivities[0]>[] = [
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "target", label: "Target" },
    { key: "time", label: "Time" },
    { key: "status", label: "Status", render: (value) => <StatusBadge status={value} /> },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader
        title="Admin Dashboard"
        showDateRange
        showRefresh
        onRefresh={handleRefresh}
        showMobileMenu
        onMenuClick={context?.onMenuClick}
      />

      <div className="flex-1 p-4 md:p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title={adminDashboardStats.totalCustomers.label}
            value={formatNumber(adminDashboardStats.totalCustomers.value)}
            change={adminDashboardStats.totalCustomers.change}
            changeLabel={adminDashboardStats.totalCustomers.comparison}
            icon={<Users className="h-5 w-5" />}
          />
          <KPICard
            title={adminDashboardStats.monthlyRevenue.label}
            value={formatCurrency(adminDashboardStats.monthlyRevenue.value)}
            change={adminDashboardStats.monthlyRevenue.change}
            changeLabel={adminDashboardStats.monthlyRevenue.comparison}
            icon={<DollarSign className="h-5 w-5" />}
          />
          <KPICard
            title={adminDashboardStats.activeLicenses.label}
            value={formatNumber(adminDashboardStats.activeLicenses.value)}
            change={adminDashboardStats.activeLicenses.change}
            changeLabel={adminDashboardStats.activeLicenses.comparison}
            icon={<FileKey2 className="h-5 w-5" />}
          />
          <KPICard
            title={adminDashboardStats.supportTickets.label}
            value={formatNumber(adminDashboardStats.supportTickets.value)}
            change={adminDashboardStats.supportTickets.change}
            changeLabel={adminDashboardStats.supportTickets.comparison}
            icon={<Headphones className="h-5 w-5" />}
          />
        </div>

        {/* Charts and Tables Row */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Revenue Chart */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Trend (Last 12 Months)
              </CardTitle>
              <CardDescription>Planned vs Actual revenue comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueChartData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPlanned" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis 
                      dataKey="month" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                      tickFormatter={(value) => `$${value / 1000}K`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [formatCurrency(value), ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="planned"
                      stroke="hsl(var(--muted-foreground))"
                      fill="url(#colorPlanned)"
                      strokeDasharray="5 5"
                      name="Planned"
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      fill="url(#colorRevenue)"
                      strokeWidth={2}
                      name="Actual"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Customers */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Top Customers
              </CardTitle>
              <CardDescription>By revenue this month</CardDescription>
            </CardHeader>
            <CardContent>
              <AdminTable
                columns={topCustomerColumns}
                data={topCustomers}
                keyField="id"
              />
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Platform Activities</CardTitle>
              <CardDescription>Latest admin actions and system events</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate("/admin/audit-log")}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <AdminTable
              columns={activityColumns}
              data={recentActivities}
              keyField="id"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
