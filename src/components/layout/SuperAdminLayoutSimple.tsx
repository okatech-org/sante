import { ReactNode, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Button } from "@/components/ui/button";
import { 
  LogOut, Settings, Sun, Moon, Laptop, Globe, Menu, X, 
  BarChart3, Users, Clock, UserCheck, Map, Building2, 
  DollarSign, Shield, Bell, Activity, Server, Pill 
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import logoSante from "@/assets/logo_sante.png";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export const SuperAdminLayoutSimple = ({ children }: SuperAdminLayoutProps) => {
  const { user, signOut } = useOfflineAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fullName = (user?.user_metadata as any)?.full_name || 'Super Admin';

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

  // Menu items pour super admin - Architecture complète
  const superAdminMenuItems = [
    // Vue d'ensemble
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/admin',
      description: 'Vue d\'ensemble du système'
    },
    
    // Gestion Utilisateurs
    { 
      id: 'users', 
      label: 'Utilisateurs', 
      icon: Users, 
      path: '/admin/users',
      description: 'Gestion des comptes patients'
    },
    
    // Gestion Professionnels
    { 
      id: 'professionals', 
      label: 'Professionnels', 
      icon: UserCheck, 
      path: '/admin/health-actors',
      description: 'Validation et gestion des professionnels'
    },
    
    // Gestion Établissements
    { 
      id: 'establishments', 
      label: 'Établissements', 
      icon: Building2, 
      path: '/admin/establishments',
      description: 'Hôpitaux, cliniques, centres'
    },
    
    // Structure Pharmaceutique (nouveau volet)
    { 
      id: 'pharmacy-structure', 
      label: 'Structure Pharmaceutique', 
      icon: Pill, 
      path: '/admin/pharmacy-structure',
      description: 'Pharmacies & dépôt pharmaceutique'
    },
    
    // Approbations
    { 
      id: 'approvals', 
      label: 'Approbations', 
      icon: Clock, 
      path: '/admin/approvals',
      description: 'Demandes en attente'
    },
    
    // Cartographie Santé
    { 
      id: 'cartography', 
      label: 'Cartographie', 
      icon: Map, 
      path: '/admin/cartography',
      description: 'Carte interactive des structures'
    },
    
    // Facturation & Abonnements
    { 
      id: 'billing', 
      label: 'Facturation', 
      icon: DollarSign, 
      path: '/admin/billing',
      description: 'Abonnements et paiements'
    },
    
    // API & Intégrations
    { 
      id: 'api', 
      label: 'API & Intégrations', 
      icon: Globe, 
      path: '/admin/api',
      description: 'Clés API et intégrations externes'
    },
    
    // Sécurité & Audit
    { 
      id: 'security', 
      label: 'Sécurité', 
      icon: Shield, 
      path: '/admin/security',
      description: 'Logs d\'audit et alertes'
    },
    
    // Support & Tickets
    { 
      id: 'support', 
      label: 'Support', 
      icon: Bell, 
      path: '/admin/support',
      description: 'Tickets et assistance'
    },
    
    // Analytics
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: Activity, 
      path: '/admin/analytics',
      description: 'Statistiques et rapports'
    },
    
    // Système
    { 
      id: 'system', 
      label: 'Système', 
      icon: Server, 
      path: '/admin/system',
      description: 'Configuration et maintenance'
    }
  ];

  const activeMenu = superAdminMenuItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar latérale fixe - Desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border/50">
        <div className="flex flex-col flex-1">
          {/* Logo et titre */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
            <img src={logoSante} alt="SANTE.GA" className="h-10 w-10" />
            <div>
              <h1 className="text-lg font-bold text-foreground">SANTE.GA</h1>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {superAdminMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User profile dans la sidebar */}
          <div className="p-4 border-t border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start h-auto p-3 hover:bg-muted/50">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-sm">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{fullName}</p>
                    <p className="text-xs text-muted-foreground">Super Admin</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Top header - Mobile et actions */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border/50">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between lg:justify-end gap-4">
              {/* Logo mobile */}
              <div className="lg:hidden flex items-center gap-2">
                <img src={logoSante} alt="SANTE.GA" className="h-8 w-8" />
                <span className="text-lg font-bold text-foreground">SANTE.GA</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      {theme === 'dark' ? <Moon className="h-4 w-4" /> : 
                       theme === 'light' ? <Sun className="h-4 w-4" /> : 
                       <Laptop className="h-4 w-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleThemeChange('light')}>
                      <Sun className="h-4 w-4 mr-2" />
                      Clair
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange('dark')}>
                      <Moon className="h-4 w-4 mr-2" />
                      Sombre
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange('system')}>
                      <Laptop className="h-4 w-4 mr-2" />
                      Système
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu Desktop avec Déconnexion */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden lg:flex items-center gap-2 h-9">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-xs">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{fullName.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">Super Admin</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Paramètres
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/30"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Menu */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-64 p-0">
                    <div className="flex flex-col h-full bg-card">
                      {/* Logo */}
                      <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
                        <img src={logoSante} alt="SANTE.GA" className="h-10 w-10" />
                        <div>
                          <h1 className="text-lg font-bold text-foreground">SANTE.GA</h1>
                          <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                      </div>

                      {/* Navigation mobile */}
                      <nav className="flex-1 px-4 py-6 space-y-1.5">
                        {superAdminMenuItems.map((item) => {
                          const Icon = item.icon;
                          const isActive = activeMenu === item.id;
                          return (
                            <Link
                              key={item.id}
                              to={item.path}
                              onClick={() => setMobileMenuOpen(false)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                isActive
                                  ? 'bg-primary text-primary-foreground shadow-md'
                                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.label}</span>
                            </Link>
                          );
                        })}
                      </nav>

                      {/* User profile mobile */}
                      <div className="p-4 border-t border-border/50">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-sm">
                              {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{fullName}</p>
                            <p className="text-xs text-muted-foreground">Super Admin</p>
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start mt-3 text-red-600 dark:text-red-400 hover:bg-red-500/10"
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
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};
