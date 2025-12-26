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
          {/* Public routes (future: will be under /public/*) */}
          <Route path="/login" element={<LoginPage />} />

          {/* Root redirect - redirects to app dashboard */}
          <Route path="/" element={<Index />} />
          
          {/* ====================================== */}
          {/* APP ROUTES (/app/*) - SaaS Product    */}
          {/* ====================================== */}
          
          {/* Dashboard routes */}
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

          {/* History & Audit - Primary route */}
          <Route path="/app/history" element={<AppLayout><GlobalAuditPage /></AppLayout>} />

          {/* Settings routes */}
          <Route path="/app/settings" element={<Navigate to="/app/settings/system" replace />} />
          <Route path="/app/settings/system" element={<AppLayout><SystemSettings /></AppLayout>} />
          <Route path="/app/settings/profile" element={<AppLayout><UserSettings /></AppLayout>} />

          {/* ====================================== */}
          {/* LEGACY REDIRECTS (old routes → /app/*) */}
          {/* ====================================== */}
          
          {/* Dashboard redirects */}
          <Route path="/dashboard/operational" element={<Navigate to="/app/dashboard/operational" replace />} />
          <Route path="/dashboard/tactical" element={<Navigate to="/app/dashboard/tactical" replace />} />
          <Route path="/dashboard/strategic" element={<Navigate to="/app/dashboard/strategic" replace />} />
          
          {/* Projects redirects */}
          <Route path="/projects" element={<Navigate to="/app/projects" replace />} />
          <Route path="/projects/dashboard" element={<Navigate to="/app/projects/dashboard" replace />} />
          <Route path="/projects/:id/plan" element={<Navigate to="/app/projects/:id/plan" replace />} />
          <Route path="/projects/:id/tracking" element={<Navigate to="/app/projects/:id/tracking" replace />} />
          <Route path="/projects/:id/history" element={<Navigate to="/app/projects/:id/history" replace />} />
          
          {/* Master Data redirects */}
          <Route path="/master-data" element={<Navigate to="/app/master-data/qualifications" replace />} />
          <Route path="/master-data/qualifications" element={<Navigate to="/app/master-data/qualifications" replace />} />
          <Route path="/master-data/deliverables" element={<Navigate to="/app/master-data/deliverables" replace />} />
          <Route path="/master-data/budget" element={<Navigate to="/app/master-data/budget" replace />} />
          <Route path="/master-data/locations" element={<Navigate to="/app/master-data/locations" replace />} />
          <Route path="/master-data/organization" element={<Navigate to="/app/master-data/organization" replace />} />
          <Route path="/master-data/resources" element={<Navigate to="/app/master-data/resources" replace />} />
          <Route path="/master-data/risks" element={<Navigate to="/app/master-data/risks" replace />} />
          <Route path="/master-data/agile" element={<Navigate to="/app/master-data/agile" replace />} />
          <Route path="/master-data/calendars" element={<Navigate to="/app/master-data/calendars" replace />} />
          
          {/* History redirects */}
          <Route path="/history" element={<Navigate to="/app/history" replace />} />
          <Route path="/history/audit" element={<Navigate to="/app/history" replace />} />
          <Route path="/history/impact" element={<Navigate to="/app/history" replace />} />
          <Route path="/history/impact-analysis" element={<Navigate to="/app/history" replace />} />
          <Route path="/history/compliance" element={<Navigate to="/app/history" replace />} />
          <Route path="/history/reports" element={<Navigate to="/app/history" replace />} />
          <Route path="/global-audit" element={<Navigate to="/app/history" replace />} />
          
          {/* Settings redirects */}
          <Route path="/settings" element={<Navigate to="/app/settings/system" replace />} />
          <Route path="/settings/system" element={<Navigate to="/app/settings/system" replace />} />
          <Route path="/settings/profile" element={<Navigate to="/app/settings/profile" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;