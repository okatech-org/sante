import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Building2, LogOut, Settings, Shield, Stethoscope, ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { ROLE_LABELS } from '@/config/menuDefinitions';

interface MultiEstablishmentDashboardProps {
  children?: ReactNode;
}

export function MultiEstablishmentDashboard({ children }: MultiEstablishmentDashboardProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    establishments,
    currentEstablishment,
    currentRole,
    selectEstablishment,
  } = useMultiEstablishment();

  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState<string | null>(
    currentEstablishment?.establishment_id || null
  );
  const [selectedRole, setSelectedRole] = useState<string | null>(currentRole);

  // Récupérer le nom et avatar
  const fullName = user?.user_metadata?.full_name || 'Professionnel';
  const avatarUrl = user?.user_metadata?.avatar_url;

  // Grouper les établissements par ID
  const establishmentGroups = establishments.reduce((acc, est) => {
    const key = est.establishment_id;
    if (!acc[key]) {
      acc[key] = {
        id: est.establishment_id,
        name: est.establishment_name,
        type: est.establishment_type,
        roles: []
      };
    }
    acc[key].roles.push({
      role: est.role_in_establishment,
      staffId: est.staff_id,
      department: est.department,
      isAdmin: est.is_admin
    });
    return acc;
  }, {} as Record<string, any>);

  const establishmentsList = Object.values(establishmentGroups);

  const handleSelectRole = async (establishmentId: string, role: string, staffId: string) => {
    setSelectedEstablishmentId(establishmentId);
    setSelectedRole(role);
    await selectEstablishment(staffId, role);
    navigate('/dashboard/professional');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/login/professional');
  };

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'director':
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      default:
        return Building2;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar gauche */}
      <aside className="w-72 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-lg">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">SANTE.GA</h2>
              <p className="text-xs text-muted-foreground">Espace Professionnel</p>
            </div>
          </div>

          {/* User Info */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
            <Avatar className="h-10 w-10">
              {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-sm">
                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{fullName}</p>
              <p className="text-xs text-muted-foreground">Professionnel de santé</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            {/* Tableau de bord */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Tableau de bord
              </h3>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/dashboard/professional')}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Vue d'ensemble
              </Button>
            </div>

            {/* Établissements */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Établissements
              </h3>
              <div className="space-y-2">
                {establishmentsList.map((establishment) => (
                  <div key={establishment.id}>
                    {/* Nom de l'établissement */}
                    <div className="px-3 py-2 text-sm font-medium text-foreground">
                      {establishment.name}
                    </div>

                    {/* Rôles dans cet établissement */}
                    <div className="ml-4 space-y-1">
                      {establishment.roles.map((roleData: any) => {
                        const RoleIcon = getRoleIcon(roleData.role);
                        const isSelected = 
                          selectedEstablishmentId === establishment.id && 
                          selectedRole === roleData.role;

                        return (
                          <button
                            key={`${establishment.id}-${roleData.role}`}
                            onClick={() => handleSelectRole(
                              establishment.id,
                              roleData.role,
                              roleData.staffId
                            )}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                              isSelected
                                ? "bg-primary text-primary-foreground font-medium shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-900"
                            )}
                          >
                            <RoleIcon className="h-4 w-4" />
                            <span className="flex-1 text-left uppercase">
                              {ROLE_LABELS[roleData.role] || roleData.role}
                            </span>
                            {isSelected && <ChevronRight className="h-4 w-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Placeholder pour autres établissements */}
                <div className="space-y-1 pt-4 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    disabled
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Etablissement 2
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-muted-foreground"
                    disabled
                  >
                    <Building2 className="h-4 w-4 mr-2" />
                    Etablissement X
                  </Button>
                </div>
              </div>
            </div>

            {/* Paramètres */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Paramètres
              </h3>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={() => navigate('/professional/settings')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </Button>
            </div>
          </div>
        </nav>

        {/* Footer avec déconnexion */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <Avatar className="h-8 w-8 mr-2">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                  <AvatarFallback className="text-xs">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm truncate">{fullName}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/professional/profile')}>
                <Settings className="h-4 w-4 mr-2" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/professional/settings')}>
                <Settings className="h-4 w-4 mr-2" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-red-600 dark:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Zone principale */}
      <main className="flex-1 overflow-y-auto">
        {selectedEstablishmentId && selectedRole ? (
          // Contenu du dashboard
          <div className="p-8">
            {children}
          </div>
        ) : (
          // Vue de sélection
          <div className="p-8">
            <div className="max-w-7xl mx-auto space-y-8">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Bienvenue sur votre espace professionnel
                </h1>
                <p className="text-muted-foreground">
                  Sélectionnez un établissement et un rôle dans la barre latérale pour commencer
                </p>
              </div>

              {/* Information de Profil */}
              <Card className="p-8">
                <h2 className="text-xl font-semibold mb-6">Information de Profil</h2>
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-2xl">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{fullName}</h3>
                    <p className="text-muted-foreground">{user?.email}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="secondary">Professionnel de santé</Badge>
                      <Badge variant="outline">{establishments.length} établissement(s)</Badge>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Mes Établissements */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Mes Établissements</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {establishmentsList.map((establishment) => (
                    <Card
                      key={establishment.id}
                      className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => {
                        const firstRole = establishment.roles[0];
                        handleSelectRole(
                          establishment.id,
                          firstRole.role,
                          firstRole.staffId
                        );
                      }}
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{establishment.name}</h3>
                          <p className="text-xs text-muted-foreground">{establishment.type}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {establishment.roles.map((roleData: any) => {
                          const Icon = getRoleIcon(roleData.role);
                          return (
                            <div
                              key={roleData.role}
                              className="text-sm text-muted-foreground flex items-center gap-2"
                            >
                              <Icon className="h-3 w-3" />
                              <span>{ROLE_LABELS[roleData.role] || roleData.role}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  ))}

                  {/* Placeholders */}
                  <Card className="p-6 border-dashed opacity-50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-muted-foreground">Etablissement 2</h3>
                        <p className="text-xs text-muted-foreground">À venir</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 border-dashed opacity-50">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-muted-foreground">Etablissement X</h3>
                        <p className="text-xs text-muted-foreground">À venir</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Autres Informations */}
              <Card className="p-8">
                <h2 className="text-xl font-semibold mb-4">Autres Informations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Statut</h3>
                    <Badge variant="default" className="text-sm">Actif</Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Dernière connexion</h3>
                    <p className="text-sm text-foreground">Aujourd'hui</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

