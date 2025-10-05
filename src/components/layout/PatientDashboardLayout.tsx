import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, FileHeart, AlertCircle, Home, Bell, Settings, Heart, Menu } from "lucide-react";
import { useState, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface PatientDashboardLayoutProps {
  children: ReactNode;
}

export function PatientDashboardLayout({ children }: PatientDashboardLayoutProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const fullName = (user?.user_metadata as any)?.full_name || 'Jean-Pierre Mbadinga';
  
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff' },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: Video, path: '/teleconsultation', color: '#00d4ff' },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00' },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff' },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff' },
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/messages', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/parametres', color: '#ff0088' }
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
                ? 'bg-white/10 text-white'
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                  isActive ? '' : 'bg-white/5'
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Background sombre avec étoiles */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
            backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
          }}
        />
      </div>

      {/* Container avec sidebar */}
      <div className="relative flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 p-4 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/90 border border-white/10 shadow-2xl flex flex-col">
            {/* Logo */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                  <Heart className="w-6 h-6 text-[#00d4ff]" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  SANTE.GA
                </h1>
              </div>
              <p className="text-xs text-gray-500">
                Votre santé à portée de clic
              </p>
            </div>

            {renderMenu()}

            {/* User Profile */}
            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{fullName.split(' ')[0]}</p>
                    <p className="text-xs text-gray-500">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#1a1f2e]/95 backdrop-blur-xl border-b border-white/10">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                <Heart className="w-6 h-6 text-[#00d4ff]" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">
                SANTE.GA
              </h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[#1a1f2e] border-white/10 p-0">
                <div className="h-full flex flex-col p-6">
                  <div className="mb-8 mt-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#00d4ff]/20">
                        <Heart className="w-6 h-6 text-[#00d4ff]" />
                      </div>
                      <h1 className="text-2xl font-bold text-white tracking-tight">
                        SANTE.GA
                      </h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">
                      Votre santé à portée de clic
                    </p>
                  </div>

                  {renderMenu()}

                  <div className="mt-auto pt-6 border-t border-white/10">
                    <div className="p-3 rounded-xl bg-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff] text-lg">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{fullName.split(' ')[0]}</p>
                          <p className="text-xs text-gray-500">Patient</p>
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
        <main className="flex-1 md:ml-64 pt-20 md:pt-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
