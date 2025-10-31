import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMultiEstablishment } from "@/contexts/MultiEstablishmentContext";
import { Building2, ChevronDown, Stethoscope, Shield, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/config/menuDefinitions";

export const RoleAndEstablishmentSwitcher = () => {
  const navigate = useNavigate();
  const {
    currentEstablishment,
    currentRole,
    establishments,
    switchEstablishment,
    switchRole,
    availableRoles,
  } = useMultiEstablishment();

  if (!currentEstablishment || !currentRole) {
    return null;
  }

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'director':
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      default:
        return Users;
    }
  };

  const RoleIcon = getRoleIcon(currentRole);

  return (
    <div className="flex items-center gap-2">
      {/* Établissement actuel */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="max-w-[150px] truncate">
              {currentEstablishment.establishment?.name}
            </span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>Mes établissements</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {establishments.map((establishment) => {
            const isActive =
              establishment.establishment_id === currentEstablishment.establishment_id;
            return (
              <DropdownMenuItem
                key={establishment.staff_id}
                onClick={() => {
                  if (!isActive) {
                    switchEstablishment(establishment.staff_id);
                  }
                }}
                className={isActive ? "bg-accent" : ""}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span className="font-medium">{establishment.establishment_name}</span>
                    {isActive && (
                      <Badge variant="secondary" className="ml-auto">
                        Actuel
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {ROLE_LABELS[establishment.role_in_establishment] ||
                      establishment.role_in_establishment}
                  </span>
                </div>
              </DropdownMenuItem>
            );
          })}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/professional/establishments")}>
            Gérer mes affiliations
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Rôle actuel */}
      {availableRoles && availableRoles.length > 1 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <RoleIcon className="h-4 w-4" />
              <span>{ROLE_LABELS[currentRole] || currentRole}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Mes rôles</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableRoles.map((role) => {
              const isActive = role === currentRole;
              const Icon = getRoleIcon(role);
              return (
                <DropdownMenuItem
                  key={role}
                  onClick={() => {
                    if (!isActive) {
                      switchRole(role);
                    }
                  }}
                  className={isActive ? "bg-accent" : ""}
                >
                  <div className="flex items-center gap-2 w-full">
                    <Icon className="h-4 w-4" />
                    <span>{ROLE_LABELS[role] || role}</span>
                    {isActive && (
                      <Badge variant="secondary" className="ml-auto">
                        Actuel
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
