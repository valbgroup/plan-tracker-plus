import { create } from 'zustand';
import { AuthUser, UserRole } from '@/types/auth.types';

// TESTING MODE: Mock authenticated admin user
const mockUser: AuthUser = {
  id: 'mock-user-001',
  email: 'admin@lightpro.dev',
  firstName: 'Admin',
  lastName: 'User',
  role: 'ADMIN' as UserRole,
  department: 'Administration',
};

interface AuthStore {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthStore>()((set) => ({
  user: mockUser, // Always authenticated for testing
  isAuthenticated: true, // Always true for testing
  isLoading: false,

  login: async () => {
    set({ isAuthenticated: true });
    return true;
  },

  logout: () => {
    // In testing mode, just redirect but keep authenticated
    set({ isAuthenticated: true });
  },

  setUser: (user) => {
    set({
      user: user || mockUser,
      isAuthenticated: true,
    });
  },
}));

// Permission checking utility for future use
export const hasPermission = (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
  const roleHierarchy: Record<UserRole, number> = {
    ADMIN: 100,
    PMO: 80,
    PROJECT_MANAGER: 60,
    VIEWER: 20,
  };

  const userLevel = roleHierarchy[userRole];
  const requiredLevel = Math.min(...requiredRoles.map((r) => roleHierarchy[r]));
  
  return userLevel >= requiredLevel;
};
