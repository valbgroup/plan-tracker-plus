import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'chef_de_projet' | 'pmo' | 'team_member' | 'admin';

export interface RBACPermissions {
  canEditTabs1to5: boolean;
  canEditTab6: boolean;
  canValidateBaseline: boolean;
  canRequestChange: boolean;
  canApproveChange: boolean;
  canRejectChange: boolean;
  canRestoreBaseline: boolean;
  canDeleteProject: boolean;
  canForceOverride: boolean;
}

export interface RBACUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface RBACState {
  currentUser: RBACUser | null;
  setCurrentUser: (user: RBACUser | null) => void;
  setRole: (role: UserRole) => void;
}

const ROLE_PERMISSIONS: Record<UserRole, RBACPermissions> = {
  chef_de_projet: {
    canEditTabs1to5: true,
    canEditTab6: false,
    canValidateBaseline: true,
    canRequestChange: true,
    canApproveChange: false,
    canRejectChange: false,
    canRestoreBaseline: false,
    canDeleteProject: false,
    canForceOverride: false,
  },
  pmo: {
    canEditTabs1to5: true,
    canEditTab6: true,
    canValidateBaseline: true,
    canRequestChange: true,
    canApproveChange: true,
    canRejectChange: true,
    canRestoreBaseline: true,
    canDeleteProject: true,
    canForceOverride: false,
  },
  team_member: {
    canEditTabs1to5: false,
    canEditTab6: false,
    canValidateBaseline: false,
    canRequestChange: false,
    canApproveChange: false,
    canRejectChange: false,
    canRestoreBaseline: false,
    canDeleteProject: false,
    canForceOverride: false,
  },
  admin: {
    canEditTabs1to5: true,
    canEditTab6: true,
    canValidateBaseline: true,
    canRequestChange: true,
    canApproveChange: true,
    canRejectChange: true,
    canRestoreBaseline: true,
    canDeleteProject: true,
    canForceOverride: true,
  },
};

const ROLE_LABELS: Record<UserRole, string> = {
  chef_de_projet: 'Chef de Projet',
  pmo: 'PMO',
  team_member: 'Team Member',
  admin: 'Admin',
};

export const useRBACStore = create<RBACState>()(
  persist(
    (set) => ({
      currentUser: {
        id: '1',
        name: 'Ahmed Benali',
        email: 'ahmed.benali@company.dz',
        role: 'chef_de_projet',
      },
      setCurrentUser: (user) => set({ currentUser: user }),
      setRole: (role) => set((state) => ({
        currentUser: state.currentUser ? { ...state.currentUser, role } : null,
      })),
    }),
    {
      name: 'rbac-storage',
    }
  )
);

export const useRBAC = () => {
  const { currentUser, setCurrentUser, setRole } = useRBACStore();
  
  const permissions = currentUser 
    ? ROLE_PERMISSIONS[currentUser.role] 
    : ROLE_PERMISSIONS.team_member;

  const roleLabel = currentUser 
    ? ROLE_LABELS[currentUser.role] 
    : 'Unknown';

  const isReadOnly = !permissions.canEditTabs1to5;
  const isPMO = currentUser?.role === 'pmo' || currentUser?.role === 'admin';
  const isAdmin = currentUser?.role === 'admin';

  const checkPermission = (permission: keyof RBACPermissions): boolean => {
    return permissions[permission];
  };

  const getAllRoles = (): { value: UserRole; label: string }[] => {
    return Object.entries(ROLE_LABELS).map(([value, label]) => ({
      value: value as UserRole,
      label,
    }));
  };

  return {
    currentUser,
    permissions,
    roleLabel,
    isReadOnly,
    isPMO,
    isAdmin,
    setCurrentUser,
    setRole,
    checkPermission,
    getAllRoles,
  };
};
