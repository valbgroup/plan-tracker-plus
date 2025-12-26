// App routes (SaaS product for customers/project managers)
// These routes require authentication

export const APP_ROUTES = {
  // Dashboard
  DASHBOARD_OPERATIONAL: '/app/dashboard/operational',
  DASHBOARD_TACTICAL: '/app/dashboard/tactical',
  DASHBOARD_STRATEGIC: '/app/dashboard/strategic',
  
  // Projects
  PROJECTS: '/app/projects',
  PROJECTS_DASHBOARD: '/app/projects/dashboard',
  PROJECT_PLAN: (id: string) => `/app/projects/${id}/plan`,
  PROJECT_TRACKING: (id: string) => `/app/projects/${id}/tracking`,
  PROJECT_HISTORY: (id: string) => `/app/projects/${id}/history`,
  
  // Master Data
  MASTER_DATA: '/app/master-data',
  MASTER_DATA_QUALIFICATIONS: '/app/master-data/qualifications',
  MASTER_DATA_DELIVERABLES: '/app/master-data/deliverables',
  MASTER_DATA_BUDGET: '/app/master-data/budget',
  MASTER_DATA_LOCATIONS: '/app/master-data/locations',
  MASTER_DATA_ORGANIZATION: '/app/master-data/organization',
  MASTER_DATA_RESOURCES: '/app/master-data/resources',
  MASTER_DATA_RISKS: '/app/master-data/risks',
  MASTER_DATA_AGILE: '/app/master-data/agile',
  MASTER_DATA_CALENDARS: '/app/master-data/calendars',
  
  // History & Audit
  HISTORY: '/app/history',
  
  // Settings
  SETTINGS: '/app/settings',
  SETTINGS_SYSTEM: '/app/settings/system',
  SETTINGS_PROFILE: '/app/settings/profile',
} as const;
