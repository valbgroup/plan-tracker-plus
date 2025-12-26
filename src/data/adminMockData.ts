// Admin Backoffice Mock Data - From PRD v1.0

export const adminDashboardStats = {
  totalCustomers: { value: 1234, change: 12, label: "Total Customers", comparison: "vs last month" },
  monthlyRevenue: { value: 45320, change: 8, label: "Monthly Revenue", comparison: "vs last month" },
  activeLicenses: { value: 567, change: 5, label: "Active Licenses", comparison: "vs last month" },
  supportTickets: { value: 12, change: -2, label: "Support Tickets", comparison: "vs yesterday" },
};

export const revenueChartData = [
  { month: "Jan", revenue: 38000, planned: 35000 },
  { month: "Feb", revenue: 41000, planned: 38000 },
  { month: "Mar", revenue: 39000, planned: 40000 },
  { month: "Apr", revenue: 42000, planned: 42000 },
  { month: "May", revenue: 45000, planned: 43000 },
  { month: "Jun", revenue: 48000, planned: 45000 },
  { month: "Jul", revenue: 52000, planned: 48000 },
  { month: "Aug", revenue: 54000, planned: 50000 },
  { month: "Sep", revenue: 51000, planned: 52000 },
  { month: "Oct", revenue: 55000, planned: 54000 },
  { month: "Nov", revenue: 58000, planned: 56000 },
  { month: "Dec", revenue: 62000, planned: 58000 },
];

export const topCustomers = [
  { id: "CUST001", name: "Acme Corporation", revenue: 5320, status: "active", license: "Enterprise" },
  { id: "CUST002", name: "TechStart Inc", revenue: 4200, status: "active", license: "Pro" },
  { id: "CUST003", name: "Global Solutions", revenue: 3850, status: "active", license: "Pro" },
  { id: "CUST004", name: "Future Tech Ltd", revenue: 2900, status: "active", license: "Basic" },
  { id: "CUST005", name: "Innovation Corp", revenue: 2450, status: "inactive", license: "Basic" },
];

export const recentActivities = [
  { id: 1, user: "admin@co.com", action: "Created customer", target: "New Corp", time: "2 min ago", status: "success" },
  { id: 2, user: "admin@co.com", action: "Renewed license", target: "License 456", time: "5 min ago", status: "success" },
  { id: 3, user: "admin@co.com", action: "Closed ticket", target: "Ticket 123", time: "15 min ago", status: "success" },
  { id: 4, user: "manager@co.com", action: "Updated product", target: "LightPro", time: "1 hour ago", status: "success" },
  { id: 5, user: "admin@co.com", action: "Failed payment", target: "ACME Corp", time: "2 hours ago", status: "warning" },
];

export const customers = [
  { id: "1", name: "John Smith", email: "john@acme.com", company: "Acme Corp", status: "active", joinDate: "01/15/2024", phone: "+1-555-123-4567", totalRevenue: 12500 },
  { id: "2", name: "Sarah Johnson", email: "sarah@startup.io", company: "TechStart Inc", status: "active", joinDate: "02/20/2024", phone: "+1-555-234-5678", totalRevenue: 8900 },
  { id: "3", name: "Mike Chen", email: "mike@globalsol.com", company: "Global Solutions", status: "active", joinDate: "03/10/2024", phone: "+1-555-345-6789", totalRevenue: 15600 },
  { id: "4", name: "Emma Wilson", email: "emma@futuretech.co", company: "Future Tech Ltd", status: "active", joinDate: "04/05/2024", phone: "+1-555-456-7890", totalRevenue: 6700 },
  { id: "5", name: "David Brown", email: "david@innovation.net", company: "Innovation Corp", status: "inactive", joinDate: "05/12/2023", phone: "+1-555-567-8901", totalRevenue: 3200 },
  { id: "6", name: "Lisa Anderson", email: "lisa@techhub.io", company: "TechHub", status: "active", joinDate: "06/18/2024", phone: "+1-555-678-9012", totalRevenue: 9400 },
  { id: "7", name: "James Taylor", email: "james@digital.com", company: "Digital First", status: "active", joinDate: "07/22/2024", phone: "+1-555-789-0123", totalRevenue: 11200 },
  { id: "8", name: "Amy Martinez", email: "amy@cloudpro.net", company: "CloudPro Solutions", status: "active", joinDate: "08/30/2024", phone: "+1-555-890-1234", totalRevenue: 7800 },
  { id: "9", name: "Robert Lee", email: "robert@nexgen.io", company: "NexGen Tech", status: "inactive", joinDate: "09/05/2023", phone: "+1-555-901-2345", totalRevenue: 2100 },
  { id: "10", name: "Jennifer Davis", email: "jennifer@smartbiz.com", company: "SmartBiz Inc", status: "active", joinDate: "10/15/2024", phone: "+1-555-012-3456", totalRevenue: 5600 },
];

export const licenses = [
  { id: "LIC001", customerId: "CUST001", customerName: "Acme Corp", type: "Enterprise", startDate: "01/01/2024", expiryDate: "01/01/2025", status: "active", daysRemaining: 365, seats: 50, price: 9900 },
  { id: "LIC002", customerId: "CUST002", customerName: "TechStart Inc", type: "Pro", startDate: "02/15/2024", expiryDate: "02/15/2025", status: "active", daysRemaining: 350, seats: 25, price: 4900 },
  { id: "LIC003", customerId: "CUST003", customerName: "Global Solutions", type: "Basic", startDate: "03/20/2024", expiryDate: "03/20/2025", status: "expiring", daysRemaining: 82, seats: 10, price: 1900 },
  { id: "LIC004", customerId: "CUST004", customerName: "Future Tech", type: "Pro", startDate: "04/10/2023", expiryDate: "04/10/2024", status: "expired", daysRemaining: -261, seats: 15, price: 4900 },
  { id: "LIC005", customerId: "CUST005", customerName: "Innovation Corp", type: "Enterprise", startDate: "05/01/2024", expiryDate: "05/01/2025", status: "active", daysRemaining: 125, seats: 100, price: 19900 },
  { id: "LIC006", customerId: "CUST006", customerName: "TechHub", type: "Basic", startDate: "06/15/2024", expiryDate: "06/15/2025", status: "active", daysRemaining: 170, seats: 5, price: 990 },
  { id: "LIC007", customerId: "CUST007", customerName: "Digital First", type: "Pro", startDate: "07/01/2024", expiryDate: "01/01/2025", status: "expiring", daysRemaining: 5, seats: 20, price: 4900 },
  { id: "LIC008", customerId: "CUST008", customerName: "CloudPro Solutions", type: "Enterprise", startDate: "08/20/2024", expiryDate: "08/20/2025", status: "active", daysRemaining: 236, seats: 75, price: 14900 },
];

export const licenseSummary = {
  total: 567,
  active: 520,
  expiring: 35,
  expired: 12,
};

export const revenueSummary = {
  totalRevenue: 2456800,
  mrr: 204733,
  growth: 23,
};

export const revenueByMonth = [
  { month: "Jan", subscriptions: 130000, oneTime: 20000 },
  { month: "Feb", subscriptions: 145000, oneTime: 20000 },
  { month: "Mar", subscriptions: 152000, oneTime: 20000 },
  { month: "Apr", subscriptions: 165000, oneTime: 20000 },
  { month: "May", subscriptions: 178000, oneTime: 20000 },
  { month: "Jun", subscriptions: 185000, oneTime: 20000 },
  { month: "Jul", subscriptions: 192000, oneTime: 20000 },
  { month: "Aug", subscriptions: 198000, oneTime: 20000 },
  { month: "Sep", subscriptions: 205000, oneTime: 20000 },
  { month: "Oct", subscriptions: 215000, oneTime: 20000 },
  { month: "Nov", subscriptions: 228000, oneTime: 20000 },
  { month: "Dec", subscriptions: 238000, oneTime: 20000 },
];

export const revenueByType = [
  { source: "Subscriptions", amount: 2100000, percentage: 85, growth: 18 },
  { source: "One-time Sales", amount: 250000, percentage: 10, growth: 5 },
  { source: "Support/Addons", amount: 106800, percentage: 5, growth: 45 },
];

export const products = [
  { id: "PROD001", name: "LightPro Basic", category: "Software", price: 99, stock: 500, status: "active", monthlySales: 145, revenue: 14355 },
  { id: "PROD002", name: "LightPro Pro", category: "Software", price: 299, stock: 1200, status: "active", monthlySales: 85, revenue: 25415 },
  { id: "PROD003", name: "Support Premium", category: "Service", price: 199, stock: "∞", status: "active", monthlySales: 42, revenue: 8358 },
  { id: "PROD004", name: "Custom Training", category: "Service", price: 500, stock: "∞", status: "active", monthlySales: 8, revenue: 4000 },
  { id: "PROD005", name: "LightPro Enterprise", category: "Software", price: 999, stock: 200, status: "active", monthlySales: 25, revenue: 24975 },
  { id: "PROD006", name: "API Access", category: "Add-on", price: 49, stock: "∞", status: "active", monthlySales: 120, revenue: 5880 },
];

export const users = [
  { id: "USR001", name: "Admin User", email: "admin@lightpro.com", role: "Admin", department: "IT", status: "active", lastLogin: "2 min ago", twoFactorEnabled: true },
  { id: "USR002", name: "John Manager", email: "manager@lightpro.com", role: "Manager", department: "Sales", status: "active", lastLogin: "15 min ago", twoFactorEnabled: true },
  { id: "USR003", name: "Support Team", email: "support@lightpro.com", role: "Support", department: "Support", status: "active", lastLogin: "1 hour ago", twoFactorEnabled: false },
  { id: "USR004", name: "Old User", email: "olduser@lightpro.com", role: "User", department: "Marketing", status: "inactive", lastLogin: "30 days ago", twoFactorEnabled: false },
  { id: "USR005", name: "Finance Lead", email: "finance@lightpro.com", role: "Manager", department: "Finance", status: "active", lastLogin: "5 min ago", twoFactorEnabled: true },
  { id: "USR006", name: "Dev Team", email: "dev@lightpro.com", role: "Admin", department: "Engineering", status: "active", lastLogin: "10 min ago", twoFactorEnabled: true },
];

export const analyticsMetrics = {
  activeUsers: 1234,
  dailyActiveUsers: 856,
  avgSessionDuration: "23.5 min",
  apiCalls: "1.2M",
};

export const userActivityData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  users: 800 + Math.floor(Math.random() * 300) + (i * 10),
}));

export const featureUsage = [
  { feature: "Dashboard", timesUsed: 45320, usersPercent: 95, trend: "up" },
  { feature: "Reports Export", timesUsed: 12450, usersPercent: 45, trend: "up" },
  { feature: "Data Import", timesUsed: 8230, usersPercent: 28, trend: "down" },
  { feature: "API Integration", timesUsed: 3100, usersPercent: 12, trend: "up" },
  { feature: "Custom Dashboards", timesUsed: 2500, usersPercent: 18, trend: "up" },
  { feature: "Collaboration", timesUsed: 1800, usersPercent: 8, trend: "up" },
];

export const auditLogs = [
  { id: 1, timestamp: "12/26 14:23 UTC", user: "admin@co.com", action: "Created", target: "Customer: New Corp", status: "success", ipAddress: "192.168.1.100" },
  { id: 2, timestamp: "12/26 14:15 UTC", user: "admin@co.com", action: "Updated", target: "License 456", status: "success", ipAddress: "192.168.1.100" },
  { id: 3, timestamp: "12/26 14:10 UTC", user: "admin@co.com", action: "Deleted", target: "User Account", status: "success", ipAddress: "192.168.1.100" },
  { id: 4, timestamp: "12/26 14:05 UTC", user: "manager@co.com", action: "Created", target: "Promotion: WINTER25", status: "success", ipAddress: "192.168.1.105" },
  { id: 5, timestamp: "12/26 13:55 UTC", user: "admin@co.com", action: "Exported", target: "Customer Report", status: "success", ipAddress: "192.168.1.100" },
  { id: 6, timestamp: "12/26 13:45 UTC", user: "support@co.com", action: "Updated", target: "Ticket T001", status: "success", ipAddress: "192.168.1.110" },
  { id: 7, timestamp: "12/26 13:30 UTC", user: "admin@co.com", action: "Login", target: "Admin Panel", status: "success", ipAddress: "192.168.1.100" },
  { id: 8, timestamp: "12/26 13:15 UTC", user: "manager@co.com", action: "Failed Login", target: "Admin Panel", status: "warning", ipAddress: "192.168.1.105" },
];

export const supportTickets = [
  { id: "T001", subject: "Integration issue with API", customer: "Acme Corp", customerId: "CUST001", status: "open", priority: "high", created: "2 hours ago", lastUpdated: "1 hour ago", assignedTo: "Support Team" },
  { id: "T002", subject: "Billing question about invoice", customer: "TechStart Inc", customerId: "CUST002", status: "in_progress", priority: "medium", created: "1 day ago", lastUpdated: "2 hours ago", assignedTo: "Finance Lead" },
  { id: "T003", subject: "Feature request for exports", customer: "Global Solutions", customerId: "CUST003", status: "closed", priority: "low", created: "3 days ago", lastUpdated: "1 day ago", assignedTo: "Dev Team" },
  { id: "T004", subject: "System down - urgent help needed", customer: "Future Tech", customerId: "CUST004", status: "open", priority: "critical", created: "10 min ago", lastUpdated: "5 min ago", assignedTo: null },
  { id: "T005", subject: "Password reset not working", customer: "Innovation Corp", customerId: "CUST005", status: "open", priority: "medium", created: "4 hours ago", lastUpdated: "3 hours ago", assignedTo: "Support Team" },
  { id: "T006", subject: "Data export taking too long", customer: "TechHub", customerId: "CUST006", status: "in_progress", priority: "low", created: "2 days ago", lastUpdated: "12 hours ago", assignedTo: "Dev Team" },
];

export const ticketMessages = [
  { id: 1, ticketId: "T001", sender: "customer", name: "John Smith", message: "We're having trouble connecting to the API. Getting 401 errors consistently.", timestamp: "2 hours ago" },
  { id: 2, ticketId: "T001", sender: "support", name: "Support Team", message: "Hi John, I'm looking into this now. Can you confirm which API key you're using?", timestamp: "1 hour 45 min ago" },
  { id: 3, ticketId: "T001", sender: "customer", name: "John Smith", message: "We're using the production key that starts with pk_live_...", timestamp: "1 hour 30 min ago" },
  { id: 4, ticketId: "T001", sender: "support", name: "Support Team", message: "I see the issue - your key was regenerated yesterday. Please use the new key from your dashboard.", timestamp: "1 hour ago" },
];

export const settingsData = {
  general: {
    platformName: "LightPro Admin",
    supportEmail: "support@lightpro.com",
    supportPhone: "+1-800-LIGHTPRO",
    websiteUrl: "https://lightpro.com",
    companyAddress: "123 Tech Street, San Francisco, CA 94105",
  },
  notifications: {
    emailOnSignup: true,
    emailOnFailedPayment: true,
    emailOnLicenseExpiration: true,
    emailOnDailySummary: false,
    slackEnabled: true,
    smsEnabled: false,
    webhookUrl: "https://hooks.example.com/webhook",
    webhookEvents: {
      customerCreated: true,
      paymentProcessed: true,
      licenseExpired: true,
      supportTicketCreated: true,
    },
  },
  theme: {
    mode: "dark",
    primaryColor: "#0066FF",
    accentColor: "#FF6B35",
    fontSize: "normal",
    fontFamily: "system",
  },
};
