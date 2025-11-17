import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { getMenuForRole, ROLE_LABELS, type MenuSection } from '@/config/menuDefinitions';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Building2, Shield, Stethoscope, ChevronRight, ChevronDown, LogOut, Settings,
  BarChart3, Menu, X, Moon, Sun, Calendar, Siren, Activity, Clock, FileText, 
  AlertTriangle, ClipboardList, Bed, UserPlus, Home
} from 'lucide-react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { RoleSwitcher } from '@/components/professional/RoleSwitcher';

interface ProfessionalEstablishmentLayoutProps {
  children: ReactNode;
}

export function ProfessionalEstablishmentLayout({ children }: ProfessionalEstablishmentLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    establishments,
    currentEstablishment,
    currentRole,
    availableRoles,
    switchRole,
    hasPermission,
    selectEstablishment
  } = useMultiEstablishment();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('professional_theme');
    return saved === 'dark';
  });
  const [isRoleMenuExpanded, setIsRoleMenuExpanded] = useState(true);
  const [isAccueilHDJExpanded, setIsAccueilHDJExpanded] = useState(false);
  const [isAccueilUrgencesExpanded, setIsAccueilUrgencesExpanded] = useState(false);
  const [isAccueilHospitalisationExpanded, setIsAccueilHospitalisationExpanded] = useState(false);

  // Fonction pour mapper les rôles de la base de données vers les rôles du frontend
  const mapRoleToFrontend = (dbRole: string): string => {
    const roleLower = (dbRole || '').toLowerCase();
    // Mapping des rôles de la base de données vers les rôles frontend
    // Priorité: Admin en premier (car "Administrateur" contient aussi "directeur")
    if (roleLower.includes('administrateur') || roleLower.includes('admin') || roleLower.includes('direction')) {
      return 'admin';
    }
    if (roleLower.includes('directeur') || roleLower.includes('director') || roleLower.includes('médecin en chef') || roleLower.includes('chef')) {
      return 'director';
    }
    if (roleLower.includes('médecin') || roleLower.includes('doctor') || roleLower.includes('medecin')) {
      return 'doctor';
    }
    if (roleLower.includes('pharmacien') || roleLower.includes('pharmacist')) {
      return 'pharmacist';
    }
    if (roleLower.includes('laborantin') || roleLower.includes('lab')) {
      return 'laborantin';
    }
    if (roleLower.includes('infirmier') || roleLower.includes('nurse')) {
      return 'nurse';
    }
    if (roleLower.includes('réception') || roleLower.includes('reception')) {
      return 'receptionist';
    }
    // Par défaut, retourner le rôle tel quel
    return roleLower;
  };

  // Grouper établissements par ID pour afficher rôles multiples (déplacé ici)
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
    const mappedRole = mapRoleToFrontend(est.role_in_establishment);
    acc[key].roles.push({
      role: mappedRole,
      originalRole: est.role_in_establishment, // Garder le rôle original pour affichage
      staffId: est.staff_id || est.id,
      isAdmin: est.is_admin || mappedRole === 'admin' || mappedRole === 'director'
    });
    return acc;
  }, {} as Record<string, any>);

  const establishmentsList = Object.values(establishmentGroups);

  // Déterminer le rôle actif avec une priorité métier (évite de tomber par défaut sur réceptionniste)
  const rolePriority = ['admin', 'director', 'doctor', 'pharmacist', 'laborantin', 'nurse', 'receptionist'];
  const firstGroupRoles: string[] =
    (establishmentsList.length > 0 && establishmentsList[0].roles
      ? establishmentsList[0].roles.map((r: any) => (r?.role || '').toLowerCase())
      : []);
  const preferredRole = firstGroupRoles.length
    ? firstGroupRoles.slice().sort((a, b) => {
        const indexA = rolePriority.indexOf(a) !== -1 ? rolePriority.indexOf(a) : 999;
        const indexB = rolePriority.indexOf(b) !== -1 ? rolePriority.indexOf(b) : 999;
        return indexA - indexB;
      })[0]
    : undefined;
  // Ne jamais tomber par défaut sur réceptionniste si l'utilisateur a d'autres rôles
  const activeRole = (currentRole || preferredRole || (firstGroupRoles.length > 0 ? firstGroupRoles[0] : 'doctor')) as string;
  
  // Récupérer le menu selon le rôle actuel
  const menuSections: MenuSection[] = getMenuForRole(activeRole);

  const fullName = user?.user_metadata?.full_name || 'Professionnel';

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('professional_theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const getRoleIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'director':
      case 'admin':
        return Shield;
      case 'doctor':
        return Stethoscope;
      case 'receptionist':
      case 'reception':
        return Building2;
      case 'nurse':
        return Building2;
      case 'laborantin':
        return Building2;
      case 'pharmacist':
        return Building2;
      default:
        return Building2;
    }
  };

  const handleRoleChange = async (newRole: string) => {
    try {
      // Si le rôle est déjà actif, toggle l'expansion du menu
      if (newRole === activeRole) {
        setIsRoleMenuExpanded(!isRoleMenuExpanded);
        return;
      }
      
      // Si on change de rôle, l'activer et ouvrir le menu
      setIsRoleMenuExpanded(true);
      
      // Utiliser directement switchRole du contexte
      if (switchRole) {
        await switchRole(newRole);
        
        toast.success(`Rôle changé`, {
          description: `Vous êtes maintenant en mode ${ROLE_LABELS[newRole] || newRole}`
        });
        
        // Pas de rechargement pour garder l'expérience fluide
        // Le menu se met à jour automatiquement grâce au state
      }
    } catch (error) {
      toast.error('Erreur lors du changement de rôle');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/login/professional');
  };


  // Sidebar content (shared between desktop and mobile)
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">SANTE.GA</h2>
            <p className="text-xs text-muted-foreground">Espace Professionnel</p>
          </div>
        </div>

        {/* User profile */}
        <div className="space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-sm">
                {fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-medium">{fullName}</p>
              <p className="text-xs text-muted-foreground">Professionnel de santé</p>
            </div>
          </div>

          {/* Établissement actif */}
          {currentEstablishment && (
            <div className="px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">Établissement actif</span>
              </div>
              <p className="text-sm font-medium text-foreground truncate">
                {currentEstablishment.establishment_name}
              </p>
              {currentEstablishment.department && (
                <p className="text-xs text-muted-foreground">
                  {currentEstablishment.department}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation hiérarchique */}
      <div className="flex-1 overflow-y-auto">
        {/* Tableau de bord */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Tableau de bord
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/professional/dashboard');
              setMobileOpen(false);
            }}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Vue d'ensemble
          </Button>
        </div>

        {/* Établissements avec rôles hiérarchiques */}
        <div className="p-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Établissements
          </h3>
          
          {/* Liste dynamique des établissements */}
          {establishmentsList.length > 0 ? (
            <div className="space-y-2">
              {establishmentsList.map((est: any) => {
                const isCurrentEstablishment = currentEstablishment?.establishment_id === est.id;
                
                return (
                  <div key={est.id} className="mb-3">
                    {/* Nom de l'établissement */}
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
                      isCurrentEstablishment ? "bg-primary/10" : ""
                    )}>
                      <Building2 className={cn(
                        "h-4 w-4",
                        isCurrentEstablishment ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className={cn(
                        "text-sm font-medium flex-1",
                        isCurrentEstablishment ? "text-primary" : "text-foreground"
                      )}>
                        {est.name}
                      </span>
                      {isCurrentEstablishment && (
                        <Badge variant="secondary" className="text-xs">Actif</Badge>
                      )}
                    </div>
                    
                    {/* Rôles de l'utilisateur dans cet établissement */}
                    <div className="ml-6 mt-1 space-y-1">
                      {est.roles.map((roleItem: any) => {
                        const Icon = getRoleIcon(roleItem.role);
                        const roleLabel = ROLE_LABELS[roleItem.role] || roleItem.role.toUpperCase();
                        const isActiveRole = isCurrentEstablishment && activeRole === roleItem.role;
                        
                        // Ne pas afficher réceptionniste comme rôle cliquable
                        if (roleItem.role === 'receptionist') {
                          return null;
                        }
                        
                        return (
                          <button
                            key={`${est.id}-${roleItem.role}`}
                            onClick={async () => {
                              // Si c'est un autre établissement, le sélectionner d'abord
                              if (!isCurrentEstablishment) {
                                await selectEstablishment(roleItem.staffId, roleItem.role);
                                navigate('/professional/dashboard');
                                setMobileOpen(false);
                              } else {
                                // Même établissement, juste changer de rôle
                                await handleRoleChange(roleItem.role);
                              }
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                              isActiveRole
                                ? "bg-primary text-primary-foreground font-medium"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="flex-1 text-left">{roleLabel}</span>
                            {roleItem.isAdmin && (
                              <Badge variant="outline" className="text-xs">Admin</Badge>
                            )}
                            {isActiveRole && (
                              isRoleMenuExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground px-3 py-2">
              Aucun établissement
            </p>
          )}

          {/* Actions */}
          <div className="mt-4 space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start border-dashed border-2 hover:bg-primary/5"
              onClick={() => {
                navigate('/professional/join-establishment');
                setMobileOpen(false);
              }}
            >
              <Building2 className="h-4 w-4 mr-2" />
              + Rejoindre un établissement
            </Button>

            {establishments.length > 1 && (
              <Button
                variant="outline"
                className="w-full justify-start hover:bg-primary/5"
                onClick={() => {
                  navigate('/professional/select-establishment');
                  setMobileOpen(false);
                }}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Changer d'établissement
              </Button>
            )}
          </div>
        </div>

        {/* Menus spécifiques pour réceptionniste */}
        {activeRole === 'receptionist' && (
          <>
            {/* Accueil Hôpital */}
            <div className="mb-3">
              <button
                onClick={() => setIsAccueilHDJExpanded(!isAccueilHDJExpanded)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isAccueilHDJExpanded || location.pathname.includes('/professional/accueil-hdj')
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Accueil Hôpital</span>
                </div>
                {isAccueilHDJExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {isAccueilHDJExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => navigate('/professional/accueil-hdj')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hdj'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Activity className="h-3 w-3" />
                    <span className="flex-1 text-left">Dashboard HDJ</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-hdj/rdv')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hdj/rdv'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Calendar className="h-3 w-3" />
                    <span className="flex-1 text-left">Rendez-vous</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-hdj/files-attente')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hdj/files-attente'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Clock className="h-3 w-3" />
                    <span className="flex-1 text-left">Files d'attente</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-hdj/dossiers')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hdj/dossiers'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <FileText className="h-3 w-3" />
                    <span className="flex-1 text-left">Dossiers HDJ</span>
                  </button>
                </div>
              )}
            </div>

            {/* Accueil Urgences */}
            <div className="mb-3">
              <button
                onClick={() => setIsAccueilUrgencesExpanded(!isAccueilUrgencesExpanded)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isAccueilUrgencesExpanded || location.pathname.includes('/professional/accueil-urgences')
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Siren className="h-4 w-4" />
                  <span>Accueil Urgences</span>
                </div>
                {isAccueilUrgencesExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {isAccueilUrgencesExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => navigate('/professional/accueil-urgences')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-urgences'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Activity className="h-3 w-3" />
                    <span className="flex-1 text-left">Dashboard urgences</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-urgences/triage')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-urgences/triage'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <AlertTriangle className="h-3 w-3" />
                    <span className="flex-1 text-left">Triage rapide</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-urgences/dossiers')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-urgences/dossiers'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <ClipboardList className="h-3 w-3" />
                    <span className="flex-1 text-left">Dossiers urgences</span>
                  </button>
                </div>
              )}
            </div>

            {/* Accueil Hospitalisation */}
            <div className="mb-3">
              <button
                onClick={() => setIsAccueilHospitalisationExpanded(!isAccueilHospitalisationExpanded)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all",
                  isAccueilHospitalisationExpanded || location.pathname.includes('/professional/accueil-hospitalisation')
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4" />
                  <span>Accueil Hospitalisation</span>
                </div>
                {isAccueilHospitalisationExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {isAccueilHospitalisationExpanded && (
                <div className="ml-6 mt-1 space-y-1">
                  <button
                    onClick={() => navigate('/professional/accueil-hospitalisation')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hospitalisation'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Activity className="h-3 w-3" />
                    <span className="flex-1 text-left">Dashboard admissions</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-hospitalisation/admissions')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hospitalisation/admissions'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <UserPlus className="h-3 w-3" />
                    <span className="flex-1 text-left">Nouvelles admissions</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-hospitalisation/chambres')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hospitalisation/chambres'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <Home className="h-3 w-3" />
                    <span className="flex-1 text-left">Gestion chambres</span>
                  </button>
                  <button
                    onClick={() => navigate('/professional/accueil-hospitalisation/sorties')}
                    className={cn(
                      "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all",
                      location.pathname === '/professional/accueil-hospitalisation/sorties'
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <ClipboardList className="h-3 w-3" />
                    <span className="flex-1 text-left">Sorties du jour</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Paramètres */}
        <div className="p-4 border-t border-border/50">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
            Paramètres
          </h3>
          <Button
            variant="ghost"
            className="w-full justify-start mb-2"
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 mr-2" />
                Mode Clair
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 mr-2" />
                Mode Sombre
              </>
            )}
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              navigate('/professional/settings');
              setMobileOpen(false);
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Paramètres
          </Button>
        </div>
      </div>

      {/* Role Switcher */}
      {availableRoles && availableRoles.length > 1 && (
        <RoleSwitcher />
      )}

      {/* Footer avec déconnexion */}
      <div className="p-4 border-t border-border/50">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-red-600"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile menu button */}
      <div className="md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon"
              className="fixed top-4 left-4 z-50"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar gauche - Architecture hiérarchique */}
      <aside className="hidden md:flex w-72 bg-card border-r border-border flex-col shadow-lg">
        <SidebarContent />
      </aside>

      {/* Zone principale avec menu accordéon */}
      <div className="flex-1 flex">
        {/* Menu accordéon contextuel - Masqué pour les réceptionnistes */}
        {activeRole && isRoleMenuExpanded && activeRole !== 'receptionist' && (
          <aside className="hidden lg:block w-64 bg-card border-r border-border">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center gap-2">
                <Badge variant="default">{ROLE_LABELS[activeRole] || activeRole}</Badge>
                <span className="text-sm text-muted-foreground">Menu</span>
              </div>
            </div>
            
            <nav className="p-4">
              <Accordion 
                type="multiple" 
                defaultValue={menuSections.map(s => s.id)} 
                className="space-y-2"
              >
                {menuSections.map((section) => (
                  <AccordionItem key={section.id} value={section.id} className="border-none">
                    <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 rounded-lg">
                      <span className="text-xs font-semibold text-muted-foreground uppercase">
                        {section.label}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-1 mt-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive = location.pathname === item.href;
                          
                          if (item.permission && hasPermission && !hasPermission(item.permission)) {
                            return null;
                          }
                          
                          return (
                            <Link
                              key={item.href}
                              to={item.href}
                              className={cn(
                                "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                                isActive
                                  ? "bg-primary text-primary-foreground shadow-sm"
                                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                              )}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="h-4 w-4" />
                                <span>{item.label}</span>
                              </div>
                              {item.badge && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </nav>
          </aside>
        )}

        {/* Contenu principal */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default ProfessionalEstablishmentLayout;