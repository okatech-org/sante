import { Home, Users, Activity, Pill, DollarSign, Calendar, Settings, LogOut, Sun, Moon, Laptop, Menu, Building2, TestTube, Ambulance, BarChart3, UserCog, Globe } from "lucide-react";
import { useState, ReactNode } from "react";
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

interface HospitalDashboardLayoutProps {
  children: ReactNode;
}

export function HospitalDashboardLayout({ children }: HospitalDashboardLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState('fr');

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
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

  const menuItems = [
    { id: 'dashboard', label: 'Vue d\'ensemble', icon: Home, path: '/demo/hospital', color: '#00d4ff' },
    { id: 'admissions', label: 'Admissions', icon: Users, path: '/demo/hospital/admissions', color: '#0088ff' },
    { id: 'emergency', label: 'Urgences', icon: Ambulance, path: '/demo/hospital/emergency', color: '#ff0088' },
    { id: 'laboratory', label: 'Laboratoire', icon: TestTube, path: '/demo/hospital/laboratory', color: '#ffaa00' },
    { id: 'pharmacy', label: 'Pharmacie', icon: Pill, path: '/demo/hospital/pharmacy', color: '#00d4ff' },
    { id: 'staff', label: 'Personnel', icon: UserCog, path: '/demo/hospital/staff', color: '#8b5cf6' },
    { id: 'planning', label: 'Planning', icon: Calendar, path: '/demo/hospital/planning', color: '#0088ff' },
    { id: 'finances', label: 'Finances', icon: DollarSign, path: '/demo/hospital/finances', color: '#ffaa00' },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3, path: '/demo/hospital/statistics', color: '#ff0088' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/demo/hospital/settings', color: '#0088ff' }
  ];

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
                <div>
                  <h1 className="text-2xl font-bold text-sidebar-foreground">
                    CHU OWENDO
                  </h1>
                  <p className="text-xs text-muted-foreground">
                    Centre Hospitalier Universitaire
                  </p>
                </div>
              </div>
            </div>

            {renderMenu()}

            {/* User Profile */}
            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
              {/* Theme & Logout Controls */}
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
                      onClick={() => setTheme('light')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      <Sun className="w-4 h-4 mr-2" />
                      Clair
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setTheme('dark')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      <Moon className="w-4 h-4 mr-2" />
                      Sombre
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setTheme('system')}
                      className="text-popover-foreground hover:bg-accent cursor-pointer"
                    >
                      <Laptop className="w-4 h-4 mr-2" />
                      Système
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

              {/* Hospital Profile Card */}
              <div className="p-3 rounded-lg bg-sidebar-accent/30">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: '#00d4ff' }}
                  >
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      CHU Owendo
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Hôpital Public
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
              <div>
                <h1 className="text-lg font-bold text-sidebar-foreground tracking-tight">
                  CHU OWENDO
                </h1>
                <p className="text-[10px] text-muted-foreground">
                  Centre Hospitalier
                </p>
              </div>
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
                    onClick={() => setTheme('light')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    <Sun className="w-4 h-4 mr-2" />
                    Clair
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTheme('dark')}
                    className="text-popover-foreground hover:bg-accent cursor-pointer"
                  >
                    <Moon className="w-4 h-4 mr-2" />
                    Sombre
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setTheme('system')}
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
                      <div>
                        <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
                          CHU OWENDO
                        </h1>
                        <p className="text-xs text-muted-foreground">
                          Centre Hospitalier Universitaire
                        </p>
                      </div>
                    </div>
                  </div>

                  {renderMenu()}

                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: '#00d4ff' }}
                        >
                          <Building2 className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">CHU Owendo</p>
                          <p className="text-xs text-white/70">Hôpital Public</p>
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
        <main className="flex-1 md:ml-72 min-h-screen pt-20 md:pt-6 px-3 md:px-6 pb-6">
          {children}
        </main>
      </div>
    </div>
  );
}
