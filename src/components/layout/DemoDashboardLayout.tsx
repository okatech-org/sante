import { ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { Header } from "./Header";
import { MobileBottomNav } from "./MobileBottomNav";
import { 
  Home, Calendar, Users, Video, ClipboardList, Pill, 
  DollarSign, TrendingUp, Mail, Stethoscope, Link2, Settings,
  Activity, TestTube, UserSearch, CreditCard, User, BarChart3,
  Building2, Shield, FileText
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoDashboardLayoutProps {
  children: ReactNode;
  demoType?: 'doctor' | 'specialist' | 'hospital' | 'clinic';
}

export const DemoDashboardLayout = ({ children, demoType = 'doctor' }: DemoDashboardLayoutProps) => {
  const location = useLocation();

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex h-[calc(100vh-4rem)] w-64 flex-col border-r bg-sidebar sticky top-16">
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="flex flex-col gap-1 p-4">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                      "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" style={{ color: item.color }} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-destructive text-destructive-foreground rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {/* Footer sidebar */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Activity className="h-4 w-4" />
              <span>Mode Démo - {demoType === 'doctor' ? 'Médecin' : demoType === 'hospital' ? 'Hôpital' : demoType === 'clinic' ? 'Clinique' : 'Spécialiste'}</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t shadow-2xl">
        <div className="grid grid-cols-5 gap-1 p-2">
          {menuItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.id}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg p-2 text-xs font-medium transition-all relative",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Icon className="h-5 w-5" style={{ color: isActive ? item.color : undefined }} />
                <span className="text-[10px] truncate max-w-full">{item.label}</span>
                {item.badge && (
                  <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[8px] font-bold bg-destructive text-destructive-foreground rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
