import { useState } from 'react';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, Check, Shield, Stethoscope, UserCog } from 'lucide-react';
import { ROLE_LABELS } from '@/config/menuDefinitions';
import { toast } from 'sonner';

export function RoleSwitcher() {
  const {
    currentEstablishment,
    currentRole,
    availableRoles,
    switchRole
  } = useMultiEstablishment();

  const [isOpen, setIsOpen] = useState(false);

  // Si un seul rôle, ne pas afficher le switcher
  if (!availableRoles || availableRoles.length <= 1) {
    return null;
  }

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;

    try {
      if (switchRole) {
        await switchRole(newRole);
        toast.success('Rôle changé', {
          description: `Vous êtes maintenant en mode ${ROLE_LABELS[newRole] || newRole}`
        });
        setIsOpen(false);
        
        // Rafraîchir pour recharger le menu
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de changer de rôle'
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'director':
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      default:
        return UserCog;
    }
  };

  return (
    <div className="px-4 py-3 border-t border-border/50">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-3"
          >
            <div className="flex items-center gap-2">
              {getRoleIcon(currentRole || 'doctor') && (
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {(() => {
                    const Icon = getRoleIcon(currentRole || 'doctor');
                    return <Icon className="w-4 h-4 text-primary" />;
                  })()}
                </div>
              )}
              <div className="text-left">
                <div className="text-sm font-semibold">
                  {ROLE_LABELS[currentRole || 'doctor'] || currentRole}
                </div>
                <div className="text-xs text-muted-foreground">
                  Changer de rôle
                </div>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="w-[280px]">
          <DropdownMenuLabel className="text-xs uppercase text-muted-foreground">
            Rôles disponibles dans {currentEstablishment?.establishment_name || 'cet établissement'}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          {availableRoles.map((role) => {
            const isActive = role === currentRole;
            const Icon = getRoleIcon(role);

            return (
              <DropdownMenuItem
                key={role}
                onClick={() => handleRoleChange(role)}
                disabled={isActive}
                className={`cursor-pointer ${isActive ? 'bg-accent' : ''}`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${isActive ? 'bg-primary/10' : 'bg-muted'} flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <p className="font-medium">
                        {ROLE_LABELS[role] || role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {role === 'director' ? 'Accès complet' : 'Accès médical'}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default RoleSwitcher;
