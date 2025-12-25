import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useRBAC, UserRole } from '@/hooks/useRBAC';
import { Shield, User, Users, Settings } from 'lucide-react';

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  chef_de_projet: <User className="w-4 h-4" />,
  pmo: <Shield className="w-4 h-4" />,
  team_member: <Users className="w-4 h-4" />,
  admin: <Settings className="w-4 h-4" />,
};

const ROLE_COLORS: Record<UserRole, string> = {
  chef_de_projet: 'bg-blue-500',
  pmo: 'bg-purple-500',
  team_member: 'bg-gray-500',
  admin: 'bg-red-500',
};

export const RoleSwitcher: React.FC = () => {
  const { currentUser, roleLabel, setRole, getAllRoles } = useRBAC();
  
  if (!currentUser) return null;

  const roles = getAllRoles();

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${ROLE_COLORS[currentUser.role]} text-white`}>
        {ROLE_ICONS[currentUser.role]}
        <span className="ml-1">{roleLabel}</span>
      </Badge>
      <Select value={currentUser.role} onValueChange={(v) => setRole(v as UserRole)}>
        <SelectTrigger className="w-[160px] h-8">
          <SelectValue placeholder="Switch role" />
        </SelectTrigger>
        <SelectContent className="bg-popover border shadow-lg z-50">
          {roles.map(role => (
            <SelectItem key={role.value} value={role.value}>
              <div className="flex items-center gap-2">
                {ROLE_ICONS[role.value]}
                {role.label}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
