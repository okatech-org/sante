import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Heart, LogOut, Menu, Shield, Settings, Sun, Moon, Laptop, Globe } from "lucide-react";
import { BarChart3, BookOpen, Users, Clock, Building2, Activity, Map, Sparkles, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import logoSante from "@/assets/logo_sante.png";

interface SuperAdminLayoutProps {
  children: ReactNode;
}

export const SuperAdminLayout = ({ children }: SuperAdminLayoutProps) => {
  const { user, isSuperAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('fr');

  const fullName = (user?.user_metadata as any)?.full_name || 'Super Admin';

  // Charger les préférences depuis la base de données
  useEffect(() => {
    const loadPreferences = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('language, theme')
          .eq('id', user.id)
          .single();
        
        if (data) {
          if (data.language) setLanguage(data.language);
          if (data.theme) setTheme(data.theme);
        }
      }
    };
    loadPreferences();
  }, [user?.id, setTheme]);

  // Sauvegarder les préférences
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ language: newLanguage })
        .eq('id', user.id);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    if (user?.id) {
      await supabase
        .from('profiles')
        .update({ theme: newTheme })
        .eq('id', user.id);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/super-admin/login");
  };

  if (!isSuperAdmin) {
    navigate("/");
    return null;
  }

  // Menu items pour super admin - Nouvelle Architecture Multi-Établissements
  const superAdminMenuItems = [
    // Vue d'ensemble
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/superadmin', 
      color: '#ff0088', 
      badge: undefined,
      section: 'overview'
    },
    
    // Section: STRUCTURES DE SANTÉ
    { 
      id: 'establishments', 
      label: 'Établissements', 
      icon: Building2, 
      path: '/establishments/unclaimed', 
      color: '#0088ff', 
      badge: undefined,
      section: 'structures',
      description: 'Hôpitaux, Cliniques, Cabinets'
    },
    { 
      id: 'claims', 
      label: 'Revendications', 
      icon: Shield, 
      path: '/superadmin/claims', 
      color: '#ffaa00', 
      badge: undefined,
      section: 'structures',
      description: 'Vérifier les demandes'
    },
    { 
      id: 'cartography', 
      label: 'Cartographie', 
      icon: Map, 
      path: '/superadmin/cartography', 
      color: '#22c55e', 
      badge: undefined,
      section: 'structures',
      description: 'Carte interactive'
    },
    
    // Section: UTILISATEURS
    { 
      id: 'professionals', 
      label: 'Professionnels', 
      icon: UserCheck, 
      path: '/superadmin/professionals', 
      color: '#00d4ff', 
      badge: undefined,
      section: 'users',
      description: 'Médecins, Infirmiers, etc.'
    },
    { 
      id: 'patients', 
      label: 'Patients', 
      icon: Users, 
      path: '/superadmin/patients', 
      color: '#8b5cf6', 
      badge: undefined,
      section: 'users',
      description: 'Dossiers patients'
    },
    { 
      id: 'approvals', 
      label: 'Approbations', 
      icon: Clock, 
      path: '/superadmin/approvals', 
      color: '#f59e0b', 
      badge: undefined,
      section: 'users',
      description: 'Valider les inscriptions'
    },
    
    // Section: SYSTÈME
    { 
      id: 'audit', 
      label: 'Audit & Logs', 
      icon: Shield, 
      path: '/superadmin/audit', 
      color: '#ef4444', 
      badge: undefined,
      section: 'system',
      description: 'Traçabilité'
    },
    { 
      id: 'project', 
      label: 'Projet', 
      icon: BookOpen, 
      path: '/superadmin/project', 
      color: '#06b6d4', 
      badge: undefined,
      section: 'system',
      description: 'Gestion du projet'
    },
    { 
      id: 'settings', 
      label: 'Paramètres', 
      icon: Settings, 
      path: '/superadmin/settings', 
      color: '#64748b', 
      badge: undefined,
      section: 'system',
      description: 'Configuration'
    }
  ];

  const activeMenu = superAdminMenuItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  const handleMenuClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const renderMenu = () => (
    <nav className="space-y-1 flex-1 overflow-y-auto">
      {/* Dashboard */}
      {superAdminMenuItems.filter(item => item.section === 'overview').map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.path)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? '' : 'bg-sidebar-accent/30'
                }`}
                style={isActive ? {
                  backgroundColor: `${item.color}20`
                } : {}}
              >
                <Icon 
                  className="w-5 h-5" 
                  style={{ color: isActive ? item.color : '' }}
                />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
            </div>
          </button>
        );
      })}
      
      {/* Section: STRUCTURES DE SANTÉ */}
      <div className="mt-6 mb-2">
        <div className="px-4 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Structures de Santé
          </span>
        </div>
      </div>
      {superAdminMenuItems.filter(item => item.section === 'structures').map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.path)}
            className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? '' : 'bg-sidebar-accent/30'
                  }`}
                  style={isActive ? {
                    backgroundColor: `${item.color}20`
                  } : {}}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isActive ? item.color : '' }}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              </div>
              {item.badge && (
                <span 
                  className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
      
      {/* Section: UTILISATEURS */}
      <div className="mt-6 mb-2">
        <div className="px-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Utilisateurs
          </span>
        </div>
      </div>
      {superAdminMenuItems.filter(item => item.section === 'users').map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.path)}
            className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? '' : 'bg-sidebar-accent/30'
                  }`}
                  style={isActive ? {
                    backgroundColor: `${item.color}20`
                  } : {}}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isActive ? item.color : '' }}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              </div>
              {item.badge && (
                <span 
                  className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
      
      {/* Section: SYSTÈME */}
      <div className="mt-6 mb-2">
        <div className="px-4 flex items-center gap-2">
          <Settings className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Système
          </span>
        </div>
      </div>
      {superAdminMenuItems.filter(item => item.section === 'system').map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <button
            key={item.id}
            onClick={() => handleMenuClick(item.path)}
            className={`w-full flex flex-col px-4 py-3 rounded-xl transition-all ${
              isActive
                ? 'bg-sidebar-accent text-sidebar-foreground'
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div 
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                    isActive ? '' : 'bg-sidebar-accent/30'
                  }`}
                  style={isActive ? {
                    backgroundColor: `${item.color}20`
                  } : {}}
                >
                  <Icon 
                    className="w-5 h-5" 
                    style={{ color: isActive ? item.color : '' }}
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.description && (
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  )}
                </div>
              </div>
              {item.badge && (
                <span 
                  className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                  style={{ backgroundColor: item.color }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background avec effet étoiles */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-20 dark:opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--foreground) / 0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, hsl(var(--foreground) / 0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, hsl(var(--foreground) / 0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, hsl(var(--foreground) / 0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, hsl(var(--foreground) / 0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
      </div>

      {/* Container avec sidebar */}
      <div className="relative flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-72 h-screen fixed left-0 top-0 p-3 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-5 bg-sidebar/90 border border-sidebar-border shadow-2xl flex flex-col">
            {/* Logo */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-sidebar-foreground">
                  SANTE.GA
                </h1>
              </div>
              <p className="text-xs text-muted-foreground">
                Votre santé à portée de clic
              </p>
            </div>

            {renderMenu()}

            {/* User Profile */}
            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
              {/* Theme, Language & Logout Controls */}
              <div className="flex items-center gap-2 px-2">
                {/* Theme Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                      {theme === 'dark' ? (
                        <Moon className="w-4 h-4" />
                      ) : theme === 'light' ? (
                        <Sun className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem 
                      onClick={() => handleThemeChange('light')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Clair
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleThemeChange('dark')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Sombre
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleThemeChange('system')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      <Laptop className="w-4 h-4 mr-2" />
                      Système
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Language Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                      <Globe className="w-4 h-4" />
                      <span className="text-xs font-medium">{language.toUpperCase()}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border">
                    <DropdownMenuItem 
                      onClick={() => handleLanguageChange('fr')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      🇫🇷 Français
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleLanguageChange('en')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      🇬🇧 English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout Button */}
                <button 
                  onClick={handleSignOut}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                  title="Déconnexion"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-3 rounded-lg bg-sidebar-accent/30">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: '#ff0088' }}
                  >
                    <Shield className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {fullName.split(' ')[0]}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Super Admin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
                SANTE.GA
              </h1>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Theme Toggle Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                    {theme === 'dark' ? (
                      <Moon className="w-4 h-4" />
                    ) : theme === 'light' ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Laptop className="w-4 h-4" />
                    )}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem 
                    onClick={() => handleThemeChange('light')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Clair
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleThemeChange('dark')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Sombre
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleThemeChange('system')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    <Laptop className="w-4 h-4 mr-2" />
                    Système
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Language Toggle Mobile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-9 h-9 rounded-lg flex items-center justify-center bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                    <Globe className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover border-border">
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('fr')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleLanguageChange('en')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logout Button Mobile */}
              <button 
                onClick={handleSignOut}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar border-sidebar-border p-0">
                <div className="h-full flex flex-col p-6">
                  <div className="mb-8 mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
                      <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">
                        SANTE.GA
                      </h1>
                    </div>
                    <p className="text-xs text-muted-foreground ml-1">
                      Votre santé à portée de clic
                    </p>
                  </div>

                  {renderMenu()}

                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: '#ff0088' }}
                        >
                          <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{fullName.split(' ')[0]}</p>
                          <p className="text-xs text-gray-500">Super Admin</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 pt-14 md:pt-4">
          <div className="p-2 sm:p-3 md:p-4 lg:p-6 max-w-7xl mx-auto w-full pb-20 md:pb-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
