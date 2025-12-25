// LightPro Type Definitions

// Re-export auth types
export type { UserRole, AuthUser, AuthState } from './auth.types';

// Legacy User type for mock data compatibility
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
  department?: string;
  createdAt: string;
  lastLogin?: string;
}

// Project Types
export type ProjectStatus = 'draft' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type ProjectSize = 'small' | 'medium' | 'large' | 'enterprise';
export type ProjectHealth = 'healthy' | 'at-risk' | 'critical';
export type LifecycleApproach = 'predictive' | 'agile' | 'hybrid';

export interface Project {
  id: string;
  code: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  health: ProjectHealth;
  size: ProjectSize;
  approach: LifecycleApproach;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  manager: User;
  team: User[];
  baselineVersion: string;
  createdAt: string;
  updatedAt: string;
}

// Baseline Types
export type BaselineStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

export interface Baseline {
  id: string;
  projectId: string;
  version: string;
  status: BaselineStatus;
  approvedBy?: User;
  approvedAt?: string;
  createdAt: string;
  snapshot: ProjectSnapshot;
}

export interface ProjectSnapshot {
  schedule: ScheduleData;
  budget: BudgetData;
  scope: ScopeData;
}

export interface ScheduleData {
  phases: Phase[];
  milestones: Milestone[];
}

export interface BudgetData {
  total: number;
  spent: number;
  forecast: number;
  envelopes: BudgetEnvelope[];
}

export interface ScopeData {
  deliverables: Deliverable[];
}

export interface Phase {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
}

export interface Milestone {
  id: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
}

export interface BudgetEnvelope {
  id: string;
  name: string;
  allocated: number;
  spent: number;
}

export interface Deliverable {
  id: string;
  name: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'blocked';
  dueDate: string;
}

// Dashboard KPIs
export interface KPICard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  unit?: string;
  icon?: string;
}

export interface DashboardData {
  kpis: KPICard[];
  projects: Project[];
  upcomingMilestones: Milestone[];
  alerts: Alert[];
}

export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

// Audit Trail
export interface AuditEntry {
  id: string;
  userId: string;
  user: User;
  action: string;
  entityType: 'project' | 'baseline' | 'user' | 'setting';
  entityId: string;
  changes: ChangeRecord[];
  timestamp: string;
}

export interface ChangeRecord {
  field: string;
  oldValue: any;
  newValue: any;
}

// Navigation
export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  pagination?: PaginationInfo;
}

export interface PaginationInfo {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
