// Public routes (marketing website, auth pages)
// These routes are accessible without authentication
// 
// Future routes:
// - /public/ - Landing page
// - /public/features - Features page
// - /public/pricing - Pricing page
// - /public/about - About page
// - /public/contact - Contact page
// - /public/auth/login - Login page
// - /public/auth/signup - Signup page
// - /public/auth/verify-email - Email verification
// - /public/auth/forgot-password - Password reset

export const PUBLIC_ROUTES = {
  HOME: '/public',
  FEATURES: '/public/features',
  PRICING: '/public/pricing',
  ABOUT: '/public/about',
  CONTACT: '/public/contact',
  LOGIN: '/public/auth/login',
  SIGNUP: '/public/auth/signup',
  VERIFY_EMAIL: '/public/auth/verify-email',
  FORGOT_PASSWORD: '/public/auth/forgot-password',
} as const;
