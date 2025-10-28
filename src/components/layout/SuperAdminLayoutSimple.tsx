import { ReactNode, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
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
  const [language, setLanguage] = useState('fr');

  const fullName = (user?.user_metadata as any)?.full_name || 'Super Admin';

  // Charger les préférences depuis localStorage (mode hors-ligne)
  useEffect(() => {
    const loadPreferences = () => {
      const savedLanguage = localStorage.getItem('admin_language') || 'fr';
      const savedTheme = localStorage.getItem('admin_theme') || 'system';
      
      setLanguage(savedLanguage);
      setTheme(savedTheme);
    };
    loadPreferences();
  }, [setTheme]);

  // Sauvegarder les préférences dans localStorage (mode hors-ligne)
  const handleLanguageChange = async (newLanguage: string) => {
    setLanguage(newLanguage);
    localStorage.setItem('admin_language', newLanguage);
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('admin_theme', newTheme);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
  };

  // Menu items pour super admin - Nouvelle Architecture Multi-Établissements
  const superAdminMenuItems = [
    // Vue d'ensemble
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: BarChart3, 
      path: '/admin', 
      color: '#3b82f6',
      description: 'Vue d\'ensemble du système'
    },
    // Gestion des utilisateurs
    { 
      id: 'users', 
      label: 'Utilisateurs', 
      icon: Users, 
      path: '/admin/users', 
      color: '#10b981',
      description: 'Gestion des comptes utilisateurs'
    },
    // Gestion des professionnels
    { 
      id: 'professionals', 
      label: 'Professionnels', 
      icon: UserCheck, 
      path: '/admin/health-actors', 
      color: '#8b5cf6',
      description: 'Gestion des professionnels de santé'
    },
    // Approbations
    { 
      id: 'approvals', 
      label: 'Approbations', 
      icon: Clock, 
      path: '/admin/approvals', 
      color: '#f59e0b',
      description: 'Validation des demandes'
    },
    // Établissements
    { 
      id: 'establishments', 
      label: 'Établissements', 
      icon: Building2, 
      path: '/admin/establishments', 
      color: '#06b6d4',
      description: 'Gestion des établissements de santé'
    },
    // Cartographie
    { 
      id: 'cartography', 
      label: 'Cartographie', 
      icon: Map, 
      path: '/cartography', 
      color: '#ef4444',
      description: 'Visualisation géographique'
    },
    // Audit
    { 
      id: 'audit', 
      label: 'Audit', 
      icon: Activity, 
      path: '/admin/audit', 
      color: '#84cc16',
      description: 'Traçabilité et conformité'
    },
    // Documentation
    { 
      id: 'docs', 
      label: 'Documentation', 
      icon: BookOpen, 
      path: '/admin/docs', 
      color: '#6366f1',
      description: 'Guide d\'utilisation'
    }
  ];

  const activeMenu = superAdminMenuItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src={logoSante} alt="SANTE.GA" className="h-8 w-8" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">SANTE.GA</span>
              </Link>
            </div>

            {/* Navigation Desktop */}
            <nav className="hidden md:flex space-x-8">
              {superAdminMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeMenu === item.id
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" style={{ color: item.color }} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleLanguageChange('fr')}>
                    🇫🇷 Français
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleLanguageChange('en')}>
                    🇬🇧 English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    {theme === 'dark' ? <Moon className="h-4 w-4" /> : 
                     theme === 'light' ? <Sun className="h-4 w-4" /> : 
                     <Laptop className="h-4 w-4" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
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

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-blue-600 text-white">
                        {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:block text-sm font-medium">{fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    {superAdminMenuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeMenu === item.id
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                              : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
                          }`}
                        >
                          <Icon className="h-5 w-5" style={{ color: item.color }} />
                          <div>
                            <div>{item.label}</div>
                            <div className="text-xs text-gray-500">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
