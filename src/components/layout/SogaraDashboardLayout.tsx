import { ReactNode, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { 
  Building2, Menu, LogOut, Settings, Home,
  BarChart3, Stethoscope, AlertTriangle, Users,
  Briefcase, Bed, Activity, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import logoSante from "@/assets/logo_sante.png";

interface SogaraDashboardLayoutProps {
  children: ReactNode;
}

export function SogaraDashboardLayout({ children }: SogaraDashboardLayoutProps) {
  const { user, signOut } = useOfflineAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Récupérer les données utilisateur SOGARA depuis localStorage
  const sogaraUserData = localStorage.getItem('sogara_user_data');
  const userData = sogaraUserData ? JSON.parse(sogaraUserData) : null;
  const fullName = userData?.fullName || user?.user_metadata?.full_name || 'Utilisateur SOGARA';

  const handleSignOut = async () => {
    await signOut();
    localStorage.removeItem('sogara_user_data');
    toast.success("Déconnexion réussie");
    navigate("/sogara");
  };

  // Menu items pour SOGARA
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Vue d\'ensemble', 
      icon: BarChart3, 
      path: '/establishments/sogara/admin',
    },
    { 
      id: 'consultations', 
      label: 'Consultations', 
      icon: Stethoscope, 
      path: '/establishments/sogara/admin/consultations',
    },
    { 
      id: 'emergency', 
      label: 'Urgences', 
      icon: AlertTriangle, 
      path: '/establishments/sogara/admin/emergency',
    },
    { 
      id: 'employees', 
      label: 'Employés SOGARA', 
      icon: Users, 
      path: '/establishments/sogara/admin/employees',
    },
    { 
      id: 'work-medicine', 
      label: 'Médecine du travail', 
      icon: Briefcase, 
      path: '/establishments/sogara/admin/work-medicine',
    },
    { 
      id: 'hospitalization', 
      label: 'Hospitalisation', 
      icon: Bed, 
      path: '/establishments/sogara/admin/hospitalization',
    },
    { 
      id: 'technical', 
      label: 'Plateaux Tech.', 
      icon: Activity, 
      path: '/establishments/sogara/admin/technical',
    },
    { 
      id: 'staff', 
      label: 'Personnel', 
      icon: UserCheck, 
      path: '/establishments/sogara/admin/staff',
    },
  ];

  const activeMenu = menuItems.find(item => item.path === location.pathname)?.id || 'overview';

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar latérale */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-card border-r border-border shadow-lg">
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Logo et titre */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">CMST SOGARA</h1>
              <p className="text-xs text-muted-foreground">Centre Médical</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5">
            {menuItems.map((item) => {
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
                  <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isActive ? 'text-primary-foreground' : ''}`} />
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
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium truncate">{fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">{userData?.department || 'SOGARA'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/sogara')}>
                  <Home className="h-4 w-4 mr-2" />
                  Page publique
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 dark:text-red-400">
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64 flex-1 flex flex-col">
        {/* Top header pour mobile */}
        <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-lg border-b border-border shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 bg-card p-0">
                  <div className="flex flex-col h-full">
                    {/* Logo mobile */}
                    <div className="flex items-center gap-3 px-6 py-6 border-b border-border/50">
                      <img src={logoSante} alt="SOGARA" className="h-8 w-8" />
                      <div>
                        <h1 className="text-lg font-bold text-foreground">CMST SOGARA</h1>
                        <p className="text-xs text-muted-foreground">Centre Médical</p>
                      </div>
                    </div>
                    {/* Navigation mobile */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5">
                      {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeMenu === item.id;
                        return (
                          <Link
                            key={item.id}
                            to={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-md'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${isActive ? 'text-primary-foreground' : ''}`} />
                            <span className="flex-1">{item.label}</span>
                          </Link>
                        );
                      })}
                    </nav>
                    {/* User profile mobile */}
                    <div className="p-4 border-t border-border/50">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold">
                            {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">{userData?.department || 'SOGARA'}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-red-600 dark:text-red-400 hover:bg-red-500/10"
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

              {/* Page Title (Desktop) */}
              <h2 className="text-xl font-semibold text-foreground hidden lg:block">
                {menuItems.find(item => item.path === location.pathname)?.label || 'CMST SOGARA'}
              </h2>

              {/* Right side: User Menu (Desktop) */}
              <div className="flex items-center gap-3 ml-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="hidden lg:flex items-center gap-2 h-9">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white font-bold text-xs">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{fullName.split(' ')[0]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{fullName}</p>
                      <p className="text-xs text-muted-foreground">{userData?.department || 'SOGARA'}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/sogara')}>
                      <Home className="h-4 w-4 mr-2" />
                      Page publique
                    </DropdownMenuItem>
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
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

