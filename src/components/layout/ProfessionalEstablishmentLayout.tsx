import { ReactNode, useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMultiEstablishment } from '@/contexts/MultiEstablishmentContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from '@/components/ui/badge';
import { 
  Building2, Menu, LogOut, Settings, ChevronDown, Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { RoleAndEstablishmentSwitcher } from './RoleAndEstablishmentSwitcher';
import { useIsSogara } from '@/contexts/SogaraAuthContext';
import { SogaraDashboardLayout } from '@/components/layout/SogaraDashboardLayout';
import { getMenuForContext, ROLE_LABELS, type MenuSection } from '@/config/menuDefinitions';

interface ProfessionalEstablishmentLayoutProps {
  children: ReactNode;
}

export function ProfessionalEstablishmentLayout({ children }: ProfessionalEstablishmentLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const {
    establishments,
    currentEstablishment,
    currentRole,
    switchEstablishment,
    hasPermission,
    hasAnyPermission,
    isDirector,
    isAdmin
  } = useMultiEstablishment();
  const isSogara = useIsSogara();

  // Récupérer les informations du profil
  const [profileData, setProfileData] = useState<any>(null);
  useEffect(() => {
    const loadProfile = async () => {
      if (user?.id) {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfileData(data);
        }
      }
    };
    loadProfile();
  }, [user?.id]);

  const fullName = profileData?.full_name || user?.user_metadata?.full_name || 'Professionnel';
  const avatarUrl = profileData?.avatar_url;

  // ⭐ NOUVEAU: Récupérer le menu selon le type d'établissement et le rôle
  const establishmentType = currentEstablishment?.establishment?.type || 'hopital';
  const role = currentRole || currentEstablishment?.role || 'doctor';
  const menuSections: MenuSection[] = getMenuForContext(establishmentType, role);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Déconnexion réussie');
    navigate('/login/professional');
  };

  const handleSwitchEstablishment = async (staffRoleId: string) => {
    await switchEstablishment(staffRoleId);
    setMobileMenuOpen(false);
  };

  // Fonction pour obtenir le label du rôle
  const getRoleLabel = (roleKey: string) => {
    return ROLE_LABELS[roleKey] || roleKey;
  };

  if (!currentEstablishment) {
    // Fallback SOGARA: afficher le layout spécifique si aucun établissement n'est lié
    if (isSogara) {
      return (
        <SogaraDashboardLayout>
          {children}
        </SogaraDashboardLayout>
      );
    }
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar latérale (Desktop) */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-card border-r border-border shadow-lg">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Header avec établissement */}
          <div className="px-6 py-5 border-b border-border/50">
            {/* Sélecteur d'établissement si plusieurs */}
            {establishments.length > 1 ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between h-auto p-3 hover:bg-muted/50">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">
                          {currentEstablishment.establishment.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {getRoleLabel(currentEstablishment.role)}
                        </p>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  <DropdownMenuLabel>Mes Établissements</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {establishments.map((staffRole) => (
                    <DropdownMenuItem
                      key={staffRole.id}
                      onClick={() => handleSwitchEstablishment(staffRole.id)}
                      className={staffRole.id === currentEstablishment.id ? 'bg-muted' : ''}
                    >
                      <div className="flex items-center gap-3 w-full">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{staffRole.establishment.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {getRoleLabel(staffRole.role)}
                            {staffRole.department && ` - ${staffRole.department}`}
                          </p>
                        </div>
                        {staffRole.id === currentEstablishment.id && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/professional/select-establishment')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Gérer les établissements
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-foreground">
                    {currentEstablishment.establishment.name}
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    {getRoleLabel(currentEstablishment.role)}
                  </p>
                </div>
              </div>
            )}

            {/* Badge admin/directeur */}
            {(isAdmin || isDirector) && (
              <div className="mt-3">
                <Badge variant={isDirector ? 'default' : 'secondary'} className="w-full justify-center">
                  <Shield className="h-3 w-3 mr-1" />
                  {isDirector ? 'Direction' : 'Administration'}
                </Badge>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6">
            <Accordion type="multiple" defaultValue={menuSections.map(s => s.label)} className="space-y-2">
              {menuSections.map((section) => (
                <AccordionItem key={section.label} value={section.label} className="border-none">
                  <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 rounded-lg">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {section.label}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-1 mt-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.href;
                        
                        // Vérifier la permission si définie
                        if (item.permission && !hasPermission(item.permission)) {
                          return null;
                        }
                        
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            className={`
                              flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
                              ${isActive
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                              }
                            `}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : ''}`} />
                              <span>{item.label}</span>
                            </div>
                            {item.badge && typeof item.badge === 'number' && (
                              <Badge 
                                variant="secondary" 
                                className="ml-auto text-xs px-1.5 py-0 h-5"
                              >
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

          {/* User profile dans la sidebar */}
          <div className="p-4 border-t border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-muted/50">
                  <Avatar className="h-10 w-10 mr-3">
                    {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {currentEstablishment.department || getRoleLabel(currentEstablishment.role)}
                    </p>
                  </div>
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
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 flex-1 flex flex-col">
        {/* Top header pour mobile */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm lg:hidden">
          <div className="px-4 py-4">
            <div className="flex justify-between items-center">
              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  {/* Mobile menu content - similar to desktop sidebar */}
                  <div className="flex flex-col h-full">
                    {/* Header établissement mobile */}
                    <div className="px-6 py-5 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <Building2 className="h-5 w-5 text-primary" />
                        <div>
                          <p className="text-sm font-semibold">
                            {currentEstablishment.establishment.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {getRoleLabel(currentEstablishment.role)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Navigation mobile */}
                    <nav className="flex-1 px-4 py-6 overflow-y-auto">
                      <Accordion type="multiple" defaultValue={menuSections.map(s => s.label)} className="space-y-2">
                        {menuSections.map((section) => (
                          <AccordionItem key={section.label} value={section.label} className="border-none">
                            <AccordionTrigger className="px-3 py-2 hover:no-underline hover:bg-muted/50 rounded-lg">
                              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {section.label}
                              </span>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="space-y-1 mt-1">
                                {section.items.map((item) => {
                                  const Icon = item.icon;
                                  const isActive = location.pathname === item.href;
                                  
                                  // Vérifier la permission si définie
                                  if (item.permission && !hasPermission(item.permission)) {
                                    return null;
                                  }
                                  
                                  return (
                                    <Link
                                      key={item.href}
                                      to={item.href}
                                      onClick={() => setMobileMenuOpen(false)}
                                      className={`
                                        flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                                        ${isActive
                                          ? 'bg-primary text-primary-foreground'
                                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                                        }
                                      `}
                                    >
                                      <div className="flex items-center gap-3">
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                      </div>
                                      {item.badge && typeof item.badge === 'number' && (
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

                    {/* User profile mobile */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                            {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {currentEstablishment.department || getRoleLabel(currentEstablishment.role)}
                          </p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 dark:text-red-400"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          handleSignOut();
                        }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* Titre et avatar mobile */}
              <div className="flex items-center gap-3">
                <RoleAndEstablishmentSwitcher />
                <Avatar className="h-8 w-8">
                  {avatarUrl && <AvatarImage src={avatarUrl} alt={fullName} />}
                  <AvatarFallback className="text-xs">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Header desktop avec switcher */}
          <div className="hidden lg:flex justify-between items-center mb-6">
            <RoleAndEstablishmentSwitcher />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
