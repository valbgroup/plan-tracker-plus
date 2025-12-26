// Admin routes (business backoffice for owners/admins)
// These routes require admin authentication
//
// Future routes:
// - /admin/dashboard - Admin dashboard
// - /admin/licenses - License management
// - /admin/revenue - Revenue analytics
// - /admin/products - Product management
// - /admin/promotions - Promotions management
// - /admin/customers - Customer management
// - /admin/users - User administration
// - /admin/analytics - Business analytics
// - /admin/settings - Admin settings

export const ADMIN_ROUTES = {
  DASHBOARD: '/admin/dashboard',
  LICENSES: '/admin/licenses',
  REVENUE: '/admin/revenue',
  PRODUCTS: '/admin/products',
  PROMOTIONS: '/admin/promotions',
  CUSTOMERS: '/admin/customers',
  USERS: '/admin/users',
  ANALYTICS: '/admin/analytics',
  SETTINGS: '/admin/settings',
} as const;
