import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, Calendar, FileText, Pill, DollarSign, 
  TestTube, Video, User, LogOut, Globe, Moon, Sun, Laptop, Menu
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logoSante from "@/assets/logo_sante.png";

interface MenuItem {
  label: string;
  icon: any;
  path: string;
  badge?: number;
}

export function PatientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState<string>('/dashboard/patient');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fullName, setFullName] = useState<string>("");
  const [cnamgsNumber, setCnamgsNumber] = useState<string>("");

  const menuItems: MenuItem[] = [
    { label: "Tableau de bord", icon: LayoutDashboard, path: '/dashboard/patient' },
    { label: "Mes Rendez-vous", icon: Calendar, path: '/appointments', badge: 2 },
    { label: "Dossier Médical", icon: FileText, path: '/medical-record' },
    { label: "Ordonnances", icon: Pill, path: '/prescriptions', badge: 1 },
    { label: "Remboursements", icon: DollarSign, path: '/reimbursements' },
    { label: "Résultats", icon: TestTube, path: '/results', badge: 3 },
    { label: "Téléconsultation", icon: Video, path: '/teleconsultation' },
    { label: "Paramètres", icon: User, path: '/parametres' },
  ];

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location]);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("full_name, cnamgs_number")
        .eq("id", user.id)
        .single();

      if (data) {
        setFullName(data.full_name || "");
        setCnamgsNumber(data.cnamgs_number || "");
      }

      if (!data?.full_name) {
        setFullName((user?.user_metadata as any)?.full_name || user?.email || "Utilisateur");
      }
    };

    loadUserData();
  }, [user]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleLanguageChange = async (newLanguage: 'fr' | 'en') => {
    setLanguage(newLanguage);
    if (user?.id) {
      await supabase.from('profiles').update({ language: newLanguage }).eq('id', user.id);
    }
  };

  const handleThemeChange = async (newTheme: string) => {
    setTheme(newTheme);
    if (user?.id) {
      await supabase.from('profiles').update({ theme: newTheme }).eq('id', user.id);
    }
  };

  const renderMenuItems = () => (
    <nav className="space-y-2 flex-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeMenu === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => {
              setActiveMenu(item.path);
              navigate(item.path);
              setMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
              isActive 
                ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-lg' 
                : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
            }`}
          >
            <Icon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">{item.label}</span>
            {item.badge && (
              <span className="ml-auto bg-[#00d4ff] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );

  const renderUserControls = () => (
    <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
      <div className="flex items-center gap-2 px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
              {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem onClick={() => handleThemeChange('light')} className="text-popover-foreground hover:bg-accent cursor-pointer">
              <Sun className="w-4 h-4 mr-2" />
              Clair
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="text-popover-foreground hover:bg-accent cursor-pointer">
              <Moon className="w-4 h-4 mr-2" />
              Sombre
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleThemeChange('system')} className="text-popover-foreground hover:bg-accent cursor-pointer">
              <Laptop className="w-4 h-4 mr-2" />
              Système
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{language.toUpperCase()}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-popover border-border">
            <DropdownMenuItem onClick={() => handleLanguageChange('fr')} className="text-popover-foreground hover:bg-accent cursor-pointer">
              🇫🇷 Français
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="text-popover-foreground hover:bg-accent cursor-pointer">
              🇬🇧 English
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button 
          onClick={handleLogout}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
          title="Déconnexion"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 rounded-lg bg-sidebar-accent/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
            {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {fullName.split(' ')[0]} {fullName.split(' ')[1]?.substring(0, 3)}...
            </p>
            <p className="text-xs text-muted-foreground">
              N° {cnamgsNumber ? `••••${cnamgsNumber.slice(-4)}` : '••••7891'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-72 min-h-screen bg-sidebar border-r border-sidebar-border flex-col p-6 sticky top-0">
        <Link to="/dashboard/patient" className="flex items-center gap-3 mb-8">
          <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
          <div>
            <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">SANTE.GA</h1>
            <p className="text-xs text-muted-foreground">Votre santé à portée de clic</p>
          </div>
        </Link>

        {renderMenuItems()}
        {renderUserControls()}
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
            <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">SANTE.GA</h1>
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
                    <h1 className="text-2xl font-bold text-sidebar-foreground tracking-tight">SANTE.GA</h1>
                  </div>
                  <p className="text-xs text-muted-foreground ml-1">Votre santé à portée de clic</p>
                </div>

                {renderMenuItems()}
                {renderUserControls()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}
