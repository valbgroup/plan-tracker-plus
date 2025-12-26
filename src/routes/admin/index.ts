// Admin routes (business backoffice for owners/admins)
// These routes require admin authentication

export const ADMIN_ROUTES = {
  ROOT: '/admin',
  DASHBOARD: '/admin/dashboard',
  CUSTOMERS: '/admin/customers',
  LICENSES: '/admin/licenses',
  REVENUE: '/admin/revenue',
  ANALYTICS: '/admin/analytics',
  PRODUCTS: '/admin/products',
  PROMOTIONS: '/admin/promotions',
  USERS: '/admin/users',
  SETTINGS: '/admin/settings',
  AUDIT_LOG: '/admin/audit-log',
  SUPPORT: '/admin/support',
} as const;
