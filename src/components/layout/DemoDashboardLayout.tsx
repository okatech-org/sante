import { ReactNode, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { 
  Home, Calendar, Users, Video, ClipboardList, Pill, 
  DollarSign, TrendingUp, Mail, Stethoscope, Link2, Settings,
  Activity, TestTube, UserSearch, BarChart3, Sun, Moon, Laptop, LogOut
} from "lucide-react";
import logoSante from "@/assets/logo_sante.png";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";

interface DemoDashboardLayoutProps {
  children: ReactNode;
  demoType?: 'doctor' | 'specialist' | 'hospital' | 'clinic';
}

export const DemoDashboardLayout = ({ children, demoType = 'doctor' }: DemoDashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Menu items selon le type de démo
  const getDemoMenuItems = () => {
    switch (demoType) {
      case 'doctor':
      case 'specialist':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: `/demo/${demoType}`, color: '#00d4ff' },
          { id: 'agenda', label: 'Agenda & RDV', icon: Calendar, path: `/demo/${demoType}/agenda`, color: '#0088ff', badge: '8' },
          { id: 'patients', label: 'Mes patients', icon: Users, path: `/demo/${demoType}/patients`, color: '#00d4ff' },
          { id: 'teleconsultations', label: 'Téléconsultations', icon: Video, path: `/demo/${demoType}/teleconsultations`, color: '#ffaa00' },
          { id: 'consultations', label: 'Consultations', icon: ClipboardList, path: `/demo/${demoType}/consultations`, color: '#ff0088' },
          { id: 'prescriptions', label: 'Prescriptions', icon: Pill, path: `/demo/${demoType}/prescriptions`, color: '#0088ff' },
          { id: 'finances', label: 'Finances & CNAMGS', icon: DollarSign, path: `/demo/${demoType}/finances`, color: '#00d4ff' },
          { id: 'statistics', label: 'Statistiques', icon: TrendingUp, path: `/demo/${demoType}/statistics`, color: '#ffaa00' },
          { id: 'messages', label: 'Messages', icon: Mail, path: `/demo/${demoType}/messages`, color: '#ff0088', badge: '5' },
          { id: 'tele-expertise', label: 'Télé-expertise', icon: Stethoscope, path: `/demo/${demoType}/tele-expertise`, color: '#0088ff' },
          { id: 'integrations', label: 'Intégrations', icon: Link2, path: `/demo/${demoType}/integrations`, color: '#00d4ff' },
          { id: 'settings', label: 'Paramètres', icon: Settings, path: `/demo/${demoType}/settings`, color: '#ff0088' }
        ];
      
      case 'hospital':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/demo/hospital', color: '#00d4ff' },
          { id: 'admissions', label: 'Admissions', icon: UserSearch, path: '/demo/hospital/admissions', color: '#0088ff' },
          { id: 'emergency', label: 'Urgences', icon: Activity, path: '/demo/hospital/emergency', color: '#ff0088' },
          { id: 'planning', label: 'Planification', icon: Calendar, path: '/demo/hospital/planning', color: '#00d4ff' },
          { id: 'staff', label: 'Personnel', icon: Users, path: '/demo/hospital/staff', color: '#0088ff' },
          { id: 'pharmacy', label: 'Pharmacie', icon: Pill, path: '/demo/hospital/pharmacy', color: '#ffaa00' },
          { id: 'laboratory', label: 'Laboratoire', icon: TestTube, path: '/demo/hospital/laboratory', color: '#00d4ff' },
          { id: 'finances', label: 'Finances', icon: DollarSign, path: '/demo/hospital/finances', color: '#0088ff' },
          { id: 'statistics', label: 'Statistiques', icon: BarChart3, path: '/demo/hospital/statistics', color: '#ffaa00' },
          { id: 'settings', label: 'Paramètres', icon: Settings, path: '/demo/hospital/settings', color: '#ff0088' }
        ];
      
      case 'clinic':
        return [
          { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/demo/clinic', color: '#00d4ff' },
          { id: 'appointments', label: 'Rendez-vous', icon: Calendar, path: '/demo/clinic/appointments', color: '#0088ff' },
          { id: 'patients', label: 'Patients', icon: Users, path: '/demo/clinic/patients', color: '#00d4ff' },
          { id: 'staff', label: 'Personnel', icon: Users, path: '/demo/clinic/staff', color: '#0088ff' },
          { id: 'finances', label: 'Finances', icon: DollarSign, path: '/demo/clinic/finances', color: '#ffaa00' },
          { id: 'settings', label: 'Paramètres', icon: Settings, path: '/demo/clinic/settings', color: '#ff0088' }
        ];
      
      default:
        return [];
    }
  };

  const menuItems = getDemoMenuItems();
  const activeMenu = menuItems.find(item => item.path === location.pathname)?.id || 'dashboard';

  const getDemoTitle = () => {
    switch (demoType) {
      case 'doctor': return 'Dr. Pierre KOMBILA';
      case 'specialist': return 'Dr. Spécialiste';
      case 'hospital': return 'CHU Libreville';
      case 'clinic': return 'Clinique Démo';
      default: return 'Compte Démo';
    }
  };

  const getDemoSubtitle = () => {
    switch (demoType) {
      case 'doctor': return 'Médecin - Cardiologie';
      case 'specialist': return 'Spécialiste';
      case 'hospital': return 'Centre Hospitalier Universitaire';
      case 'clinic': return 'Clinique Privée';
      default: return 'Mode Démo';
    }
  };

  const renderMenu = () => (
    <nav className="space-y-1 flex-1 overflow-y-auto">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.id;
        return (
          <Link
            key={item.id}
            to={item.path}
            onClick={() => setMobileMenuOpen(false)}
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
          </Link>
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
        {/* Sidebar Desktop - Glassmorphic */}
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
                Mode Démo - {getDemoSubtitle()}
              </p>
            </div>

            {renderMenu()}

            {/* User Profile & Controls */}
            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
              {/* Theme, Language & Demo Controls */}
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

                {/* Exit Demo Button */}
                <button 
                  onClick={() => navigate('/admin/demo')}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground"
                  title="Quitter la démo"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Demo User Profile */}
              <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent/20">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0088ff] flex items-center justify-center text-white font-bold">
                  {getDemoTitle().split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {getDemoTitle()}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {getDemoSubtitle()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content avec marge pour la sidebar */}
        <main className="flex-1 md:ml-72 min-h-screen p-4 md:p-6">
          {children}
        </main>

        {/* Mobile Menu */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="md:hidden fixed bottom-4 right-4 z-50 rounded-full h-14 w-14 shadow-lg backdrop-blur-xl bg-sidebar/90"
            >
              <Home className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0 bg-sidebar/95 backdrop-blur-xl border-sidebar-border">
            <div className="h-full p-5 flex flex-col">
              {/* Logo Mobile */}
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                  <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                  <h1 className="text-2xl font-bold text-sidebar-foreground">
                    SANTE.GA
                  </h1>
                </div>
                <p className="text-xs text-muted-foreground">
                  Mode Démo - {getDemoSubtitle()}
                </p>
              </div>

              {renderMenu()}

              {/* Mobile Controls */}
              <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
                <div className="flex items-center gap-2 px-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                        {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setTheme('light')}>
                        <Sun className="w-4 h-4 mr-2" /> Clair
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('dark')}>
                        <Moon className="w-4 h-4 mr-2" /> Sombre
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTheme('system')}>
                        <Laptop className="w-4 h-4 mr-2" /> Système
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <button 
                    onClick={() => navigate('/admin/demo')}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-sidebar-accent/20">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#0088ff] flex items-center justify-center text-white font-bold">
                    {getDemoTitle().split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {getDemoTitle()}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {getDemoSubtitle()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
