// Route configuration index
// Organizes all routes into three main categories:
// 1. Public routes (/public/*) - Marketing website, auth pages
// 2. App routes (/app/*) - SaaS product for customers
// 3. Admin routes (/admin/*) - Business backoffice for owners

export { PUBLIC_ROUTES } from './public';
export { APP_ROUTES } from './app';
export { ADMIN_ROUTES } from './admin';

// Default redirect after login
export const DEFAULT_AUTHENTICATED_ROUTE = '/app/dashboard/operational';

// Default public route
export const DEFAULT_PUBLIC_ROUTE = '/app/dashboard/operational'; // Will change to /public when public routes are built
