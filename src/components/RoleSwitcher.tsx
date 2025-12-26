import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRBAC, UserRole } from '@/hooks/useRBAC';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ROLE_INITIALS: Record<UserRole, string> = {
  chef_de_projet: 'PM',
  pmo: 'MO',
  team_member: 'TM',
  admin: 'AD',
};

const ROLE_DISPLAY: Record<UserRole, string> = {
  chef_de_projet: 'Chef de Projet (PM)',
  pmo: 'PMO',
  team_member: 'Team Member (TM)',
  admin: 'Admin',
};

export const RoleSwitcher: React.FC = () => {
  const { currentUser, setRole, getAllRoles } = useRBAC();
  
  if (!currentUser) return null;

  const roles = getAllRoles();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "bg-primary text-primary-foreground font-semibold text-sm",
            "hover:bg-primary/90 transition-colors cursor-pointer",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          )}
          title="Switch test role"
        >
          {ROLE_INITIALS[currentUser.role]}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 bg-popover border shadow-lg z-50">
        <DropdownMenuLabel className="flex items-center gap-2">
          <span className="text-xs font-normal text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">TEST</span>
          <span>Switch Role</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map(role => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => setRole(role.value)}
            className={cn(
              "cursor-pointer flex items-center justify-between",
              currentUser.role === role.value && "bg-secondary"
            )}
          >
            <span>{ROLE_DISPLAY[role.value]}</span>
            {currentUser.role === role.value && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
