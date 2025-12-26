import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import OperationalDashboard from "./pages/dashboard/OperationalDashboard";
import TacticalDashboard from "./pages/dashboard/TacticalDashboard";
import StrategicDashboard from "./pages/dashboard/StrategicDashboard";

// Public Pages
import { PublicLayout } from "@/components/public";
import { HomePage, PricingPage, FeaturesPage } from "@/pages/public";
import { LoginPage as PublicLoginPage, SignupPage, VerifyEmailPage } from "@/pages/public/auth";

// Admin Pages
import {
  AdminDashboardPage,
  AdminCustomersPage,
  AdminLicensesPage,
  AdminRevenuePage,
  AdminAnalyticsPage,
  AdminProductsPage,
  AdminPromotionsPage,
  AdminUsersPage,
  AdminSettingsPage,
  AdminAuditLogPage,
  AdminSupportPage,
} from "@/pages/admin";

// Projects Module
import { 
  ProjectsLayout,
  ProjectListPage,
  ProjectPlanPage,
  ProjectTrackingPage,
  ProjectHistoryPage,
  ProjectDashboardPage,
} from "@/modules/projects";
import { ProjectDetailsLayout } from "@/modules/projects/layout/ProjectDetailsLayout";

// History Module
import { GlobalAuditPage } from "@/modules/history";

// Master Data Pages
import ProjectQualificationsPage from "./pages/master-data/ProjectQualificationsPage";
import DeliverableQualificationsPage from "./pages/master-data/DeliverableQualificationsPage";
import BudgetPage from "./pages/master-data/BudgetPage";
import LocalizationPage from "./pages/master-data/LocalizationPage";
import OrganizationPage from "./pages/master-data/OrganizationPage";
import ResourcesPage from "./pages/master-data/ResourcesPage";
import RisksIssuesPage from "./pages/master-data/RisksIssuesPage";
import AgilePage from "./pages/master-data/AgilePage";
import CalendarsPage from "./pages/master-data/CalendarsPage";

// Settings Pages
import SystemSettings from "./pages/settings/SystemSettings";
import UserSettings from "./pages/settings/UserSettings";

const queryClient = new QueryClient();

// Layout wrappers
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

const AdminLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* ====================================== */}
          {/* PUBLIC ROUTES (/public/*) - Marketing */}
          {/* ====================================== */}
          <Route path="/public" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="features" element={<FeaturesPage />} />
            <Route path="pricing" element={<PricingPage />} />
          </Route>
          
          {/* Public Auth Routes */}
          <Route path="/public/auth/login" element={<PublicLoginPage />} />
          <Route path="/public/auth/signup" element={<SignupPage />} />
          <Route path="/public/auth/verify-email" element={<VerifyEmailPage />} />

          {/* Root redirect */}
          <Route path="/" element={<Index />} />
          
          {/* ====================================== */}
          {/* APP ROUTES (/app/*) - SaaS Product    */}
          {/* ====================================== */}
          
          {/* Dashboard routes */}
          <Route path="/app" element={<Navigate to="/app/dashboard/operational" replace />} />
          <Route path="/app/dashboard" element={<Navigate to="/app/dashboard/operational" replace />} />
          <Route path="/app/dashboard/operational" element={<AppLayout><OperationalDashboard /></AppLayout>} />
          <Route path="/app/dashboard/tactical" element={<AppLayout><TacticalDashboard /></AppLayout>} />
          <Route path="/app/dashboard/strategic" element={<AppLayout><StrategicDashboard /></AppLayout>} />

          {/* Project routes */}
          <Route path="/app/projects" element={<ProjectsLayout />}>
            <Route index element={<ProjectListPage />} />
            <Route path="dashboard" element={<ProjectDashboardPage />} />
            <Route path=":id" element={<ProjectDetailsLayout />}>
              <Route path="plan" element={<ProjectPlanPage />} />
              <Route path="tracking" element={<ProjectTrackingPage />} />
              <Route path="history" element={<ProjectHistoryPage />} />
            </Route>
          </Route>

          {/* Master Data routes */}
          <Route path="/app/master-data" element={<Navigate to="/app/master-data/qualifications" replace />} />
          <Route path="/app/master-data/qualifications" element={<AppLayout><ProjectQualificationsPage /></AppLayout>} />
          <Route path="/app/master-data/deliverables" element={<AppLayout><DeliverableQualificationsPage /></AppLayout>} />
          <Route path="/app/master-data/budget" element={<AppLayout><BudgetPage /></AppLayout>} />
          <Route path="/app/master-data/locations" element={<AppLayout><LocalizationPage /></AppLayout>} />
          <Route path="/app/master-data/organization" element={<AppLayout><OrganizationPage /></AppLayout>} />
          <Route path="/app/master-data/resources" element={<AppLayout><ResourcesPage /></AppLayout>} />
          <Route path="/app/master-data/risks" element={<AppLayout><RisksIssuesPage /></AppLayout>} />
          <Route path="/app/master-data/agile" element={<AppLayout><AgilePage /></AppLayout>} />
          <Route path="/app/master-data/calendars" element={<AppLayout><CalendarsPage /></AppLayout>} />

          {/* History & Audit */}
          <Route path="/app/history" element={<AppLayout><GlobalAuditPage /></AppLayout>} />

          {/* Settings routes */}
          <Route path="/app/settings" element={<Navigate to="/app/settings/system" replace />} />
          <Route path="/app/settings/system" element={<AppLayout><SystemSettings /></AppLayout>} />
          <Route path="/app/settings/profile" element={<AppLayout><UserSettings /></AppLayout>} />

          {/* ====================================== */}
          {/* ADMIN ROUTES (/admin/*) - Backoffice  */}
          {/* ====================================== */}
          
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboardPage /></AdminLayout>} />
          <Route path="/admin/customers" element={<AdminLayout><AdminCustomersPage /></AdminLayout>} />
          <Route path="/admin/licenses" element={<AdminLayout><AdminLicensesPage /></AdminLayout>} />
          <Route path="/admin/revenue" element={<AdminLayout><AdminRevenuePage /></AdminLayout>} />
          <Route path="/admin/analytics" element={<AdminLayout><AdminAnalyticsPage /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
          <Route path="/admin/promotions" element={<AdminLayout><AdminPromotionsPage /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
          <Route path="/admin/settings" element={<AdminLayout><AdminSettingsPage /></AdminLayout>} />
          <Route path="/admin/audit-log" element={<AdminLayout><AdminAuditLogPage /></AdminLayout>} />
          <Route path="/admin/support" element={<AdminLayout><AdminSupportPage /></AdminLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
