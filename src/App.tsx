import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/components/layout";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/auth/LoginPage";
import OperationalDashboard from "./pages/dashboard/OperationalDashboard";
import TacticalDashboard from "./pages/dashboard/TacticalDashboard";
import StrategicDashboard from "./pages/dashboard/StrategicDashboard";

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

// TESTING MODE: No auth protection
const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <MainLayout>{children}</MainLayout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root redirect */}
          <Route path="/" element={<Index />} />
          
          {/* Dashboard routes */}
          <Route path="/dashboard/operational" element={<AppLayout><OperationalDashboard /></AppLayout>} />
          <Route path="/dashboard/tactical" element={<AppLayout><TacticalDashboard /></AppLayout>} />
          <Route path="/dashboard/strategic" element={<AppLayout><StrategicDashboard /></AppLayout>} />

          {/* Project routes */}
          <Route path="/projects" element={<ProjectsLayout />}>
            <Route index element={<ProjectListPage />} />
            <Route path="dashboard" element={<ProjectDashboardPage />} />
            <Route path=":id" element={<ProjectDetailsLayout />}>
              <Route path="plan" element={<ProjectPlanPage />} />
              <Route path="tracking" element={<ProjectTrackingPage />} />
              <Route path="history" element={<ProjectHistoryPage />} />
            </Route>
          </Route>

          {/* Master Data routes */}
          <Route path="/master-data" element={<Navigate to="/master-data/qualifications" replace />} />
          <Route path="/master-data/qualifications" element={<AppLayout><ProjectQualificationsPage /></AppLayout>} />
          <Route path="/master-data/deliverables" element={<AppLayout><DeliverableQualificationsPage /></AppLayout>} />
          <Route path="/master-data/budget" element={<AppLayout><BudgetPage /></AppLayout>} />
          <Route path="/master-data/locations" element={<AppLayout><LocalizationPage /></AppLayout>} />
          <Route path="/master-data/organization" element={<AppLayout><OrganizationPage /></AppLayout>} />
          <Route path="/master-data/resources" element={<AppLayout><ResourcesPage /></AppLayout>} />
          <Route path="/master-data/risks" element={<AppLayout><RisksIssuesPage /></AppLayout>} />
          <Route path="/master-data/agile" element={<AppLayout><AgilePage /></AppLayout>} />
          <Route path="/master-data/calendars" element={<AppLayout><CalendarsPage /></AppLayout>} />

          {/* History & Audit - Primary route */}
          <Route path="/history" element={<AppLayout><GlobalAuditPage /></AppLayout>} />
          
          {/* Redirects for backward compatibility */}
          <Route path="/history/audit" element={<Navigate to="/history" replace />} />
          <Route path="/history/impact" element={<Navigate to="/history" replace />} />
          <Route path="/history/impact-analysis" element={<Navigate to="/history" replace />} />
          <Route path="/history/compliance" element={<Navigate to="/history" replace />} />
          <Route path="/history/reports" element={<Navigate to="/history" replace />} />
          <Route path="/global-audit" element={<Navigate to="/history" replace />} />

          {/* Settings routes */}
          <Route path="/settings" element={<Navigate to="/settings/system" replace />} />
          <Route path="/settings/system" element={<AppLayout><SystemSettings /></AppLayout>} />
          <Route path="/settings/profile" element={<AppLayout><UserSettings /></AppLayout>} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
