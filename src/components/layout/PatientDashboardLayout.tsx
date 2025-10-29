import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, FileHeart, AlertCircle, Home, Bell, Settings, Heart, Menu, LogOut, Sun, Moon, Globe, Laptop, Users, ClipboardList, DollarSign, TrendingUp, Mail, Link2 } from "lucide-react";
import { useState, ReactNode, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoSante from "@/assets/logo_sante.png";
import { NotificationBell } from "@/components/professional/NotificationBell";

interface PatientDashboardLayoutProps {
  children: ReactNode;
}

export function PatientDashboardLayout({ children }: PatientDashboardLayoutProps) {
  const { user, hasRole, signOut } = useOfflineAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('fr');
  
  // IMPORTANT: PatientDashboardLayout affiche UNIQUEMENT le menu patient
  // Même si l'utilisateur a d'autres rôles (admin, pro), on affiche le menu patient
  const isProfessional = hasRole('doctor') || hasRole('medical_staff');
  
  // Récupérer les vraies informations du patient connecté
  const fullName = (user?.user_metadata as any)?.full_name || 
                   (user?.email?.split('@')[0]?.replace(/\./g, ' ')?.toUpperCase()) || 
                   'Utilisateur';
  
  // Générer un numéro CNAMGS basé sur l'ID utilisateur
  const cnamgsNumber = user?.id ? 
    `GA${user.id.substring(0, 8).toUpperCase().replace(/-/g, '')}` : 
    'Non renseigné';

  // Charger les préférences depuis localStorage (mode hors-ligne)
  useEffect(() => {
    const loadPreferences = () => {
      const savedLanguage = localStorage.getItem('user_language') || 'fr';
      const savedTheme = localStorage.getItem('user_theme') || 'system';
      
      setLanguage(savedLanguage);
      setTheme(savedTheme);
    };
    loadPreferences();
  }, [setTheme]);

  // Sauvegarder les préférences dans localStorage (mode hors-ligne)
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('user_language', newLanguage);
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('user_theme', newTheme);
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Déconnexion réussie",
        description: "À bientôt !",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la déconnexion",
        variant: "destructive",
      });
    }
  };
  
  // Menu items pour patient (PatientDashboardLayout affiche UNIQUEMENT le menu patient)
  const patientMenuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff', badge: undefined },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: Video, path: '/teleconsultation', color: '#00d4ff', badge: undefined },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00', badge: undefined },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff', badge: undefined },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff', badge: undefined },
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/messages', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/parametres', color: '#ff0088', badge: undefined }
  ];

  // Toujours afficher le menu patient dans PatientDashboardLayout
  const menuItems = patientMenuItems;

  const activeMenu = menuItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  const handleMenuClick = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  const renderMenu = () => (
    <nav className="space-y-1 flex-1 overflow-y-auto">
      {menuItems.map((item) => {
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
            {item.badge && (
              <span 
                className="px-2.5 py-1 text-xs font-semibold rounded-full text-white"
                style={{ backgroundColor: item.color }}
              >
                {item.badge}
              </span>
            )}
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
                  onClick={handleLogout}
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
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]"
                  >
                    <span>{fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {cnamgsNumber}
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
                onClick={handleLogout}
                className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                title="Déconnexion"
              >
                <LogOut className="w-4 h-4" />
              </button>

              {isProfessional && <NotificationBell />}
              
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

                  <div className="mt-auto pt-6 border-t border-white/10 space-y-3">
                    {/* Logout Button */}
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span className="text-sm font-medium">Déconnexion</span>
                    </button>

                    {/* User Profile */}
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg bg-[#00d4ff]"
                        >
                          <span>{fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{fullName.split(' ')[0]}</p>
                          <p className="text-xs text-gray-500">{cnamgsNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            </div>
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
}
