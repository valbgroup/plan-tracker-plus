// User Roles - MVP
export type UserRole = 'ADMIN' | 'PMO' | 'PROJECT_MANAGER' | 'VIEWER';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
