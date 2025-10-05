import { useAuth } from "@/contexts/AuthContext";
import { Calendar, Video, Stethoscope, Shield, Activity, Pill, CheckCircle, FileHeart, AlertCircle, Home, Bell, Settings, Heart, MapPin, ChevronRight, Menu, X, Edit, LogOut, Sun, Moon, Globe, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import { EditMedicalInfoModal } from "@/components/profile/EditMedicalInfoModal";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import logoSante from "@/assets/logo_sante.png";
export default function DashboardPatient() {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [editMedicalOpen, setEditMedicalOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState('fr');
  
  const userName = (user?.user_metadata as any)?.full_name?.split(' ')[0] || 'Jean-Pierre';
  const fullName = (user?.user_metadata as any)?.full_name || 'Jean-Pierre Mbadinga';

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
  
  // Séparer le nom et le prénom
  const nameParts = fullName.split(' ');
  const firstName = nameParts.slice(0, -1).join(' ') || 'Jean-Pierre';
  const lastName = nameParts[nameParts.length - 1] || 'Mbadinga';
  const menuItems = [{
    id: 'dashboard',
    label: 'Tableau de bord',
    icon: Home,
    path: '/dashboard/patient',
    color: '#00d4ff'
  }, {
    id: 'appointments',
    label: 'Mes rendez-vous',
    icon: Calendar,
    badge: '2',
    path: '/appointments',
    color: '#0088ff'
  }, {
    id: 'teleconsult',
    label: 'Téléconsultation',
    icon: Video,
    path: '/teleconsultation',
    color: '#00d4ff'
  }, {
    id: 'dossier',
    label: 'Dossier Médical',
    icon: FileHeart,
    path: '/medical-record',
    color: '#ffaa00'
  }, {
    id: 'ordonnances',
    label: 'Mes ordonnances',
    icon: Pill,
    badge: '1',
    path: '/prescriptions',
    color: '#ff0088'
  }, {
    id: 'resultats',
    label: 'Résultats d\'analyses',
    icon: Activity,
    path: '/results',
    color: '#0088ff'
  }, {
    id: 'cnamgs',
    label: 'Droits CNAMGS',
    icon: Shield,
    path: '/reimbursements',
    color: '#00d4ff'
  }, {
    id: 'messages',
    label: 'Messages',
    icon: Bell,
    badge: '3',
    path: '/messages',
    color: '#ffaa00'
  }, {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    path: '/parametres',
    color: '#ff0088'
  }];
  useEffect(() => {
    // Animation des progress bars au chargement
    setTimeout(() => {
      const progressBar = document.querySelector('.progress-fill');
      if (progressBar) {
        (progressBar as HTMLElement).style.width = '100%';
      }
    }, 100);

    // Charger l'avatar depuis le profil
    const loadAvatar = async () => {
      if (user?.id) {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data?.avatar_url) {
          setAvatarUrl(data.avatar_url);
        }
      }
    };
    loadAvatar();
  }, [user?.id]);
  const isDark = theme === 'dark';
  return <div className="min-h-screen relative overflow-hidden bg-background">
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
        {/* Sidebar Desktop et Tablette - caché uniquement sur mobile */}
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

            {/* Menu */}
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return <button key={item.id} onClick={() => {
                setActiveMenu(item.id);
                if (item.path) navigate(item.path);
              }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isActive ? '' : 'bg-sidebar-accent/30'}`} style={isActive ? {
                    backgroundColor: `${item.color}20`
                  } : {}}>
                        <Icon className="w-5 h-5" style={{
                      color: isActive ? item.color : ''
                    }} />
                      </div>
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge && <span className="px-2.5 py-1 text-xs font-semibold rounded-full text-white" style={{
                  backgroundColor: item.color
                }}>
                        {item.badge}
                      </span>}
                  </button>;
            })}
            </nav>

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
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                    {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">
                      {fullName.split(' ')[0]} ast...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      N° ••••7891
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header avec menu hamburger - visible uniquement sur mobile */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar/95 backdrop-blur-xl border-b border-sidebar-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">
                SANTE.GA
              </h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-sidebar-accent/30 text-sidebar-foreground hover:bg-sidebar-accent transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar border-sidebar-border p-0">
                <div className="h-full flex flex-col p-6">
                  {/* Logo */}
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

                  {/* Menu Mobile */}
                  <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeMenu === item.id;
                    return <button key={item.id} onClick={() => {
                      setActiveMenu(item.id);
                      if (item.path) navigate(item.path);
                      setMobileMenuOpen(false);
                    }} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${isActive ? '' : 'bg-sidebar-accent/30'}`} style={isActive ? {
                          backgroundColor: `${item.color}20`
                        } : {}}>
                              <Icon className="w-5 h-5" style={{
                            color: isActive ? item.color : ''
                          }} />
                            </div>
                            <span className="text-sm font-medium">{item.label}</span>
                          </div>
                          {item.badge && <span className="px-2.5 py-1 text-xs font-semibold rounded-full text-white" style={{
                        backgroundColor: item.color
                      }}>
                              {item.badge}
                            </span>}
                        </button>;
                  })}
                  </nav>

                  {/* User Profile Mobile */}
                  <div className="mt-auto pt-6 border-t border-sidebar-border space-y-2">
                    {/* Theme, Language & Logout Controls Mobile */}
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

                    {/* User Profile Card Mobile */}
                    <div className="p-3 rounded-xl bg-sidebar-accent/30">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff] text-lg">
                          {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-sidebar-foreground truncate">
                            {fullName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            N° ••••7891
                          </p>
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
        <main className="flex-1 md:ml-72 p-4 lg:p-6 max-w-7xl pt-20 md:pt-6">
          {/* Header Card avec dégradé coloré comme "portée de clic" */}
          <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-8 bg-card/80 border border-border shadow-2xl mb-6 relative">
            {/* Bouton Modifier en haut à droite */}
            <Button
              onClick={() => setEditProfileOpen(true)}
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
              {/* Photo d'identité */}
              <div className="flex-shrink-0 mx-auto sm:mx-0 relative">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gradient-to-br from-[#00d4ff] to-[#0088ff] p-1">
                  <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img 
                        src={avatarUrl} 
                        alt="Photo de profil" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl sm:text-5xl font-bold text-card-foreground">
                        {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    )}
                  </div>
                </div>
                <AvatarUpload
                  currentAvatarUrl={avatarUrl || undefined}
                  onAvatarUpdate={setAvatarUrl}
                />
              </div>

              {/* Informations personnelles */}
              <div className="flex-1 space-y-3 sm:space-y-4">
                {/* Nom complet - Bloc séparé */}
                <div className="bg-muted/30 rounded-xl p-3">
                  <p className="text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">{lastName}</p>
                  <p className="text-base sm:text-xl font-normal text-foreground mt-1">{firstName}</p>
                </div>

                {/* Âge et Sexe - sur la même ligne */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Âge</p>
                    <p className="text-base sm:text-xl font-bold text-foreground">34 ans</p>
                  </div>

                  <div className="bg-muted/30 rounded-xl p-3">
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Sexe</p>
                    <p className="text-base sm:text-xl font-bold text-foreground">Masculin</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informations médicales - Bloc séparé */}
          <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-2xl mb-6 relative">
            {/* Bouton Modifier */}
            <Button
              onClick={() => setEditMedicalOpen(true)}
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 gap-2"
            >
              <Edit className="w-4 h-4" />
              Modifier
            </Button>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Poids</p>
                <p className="text-base sm:text-xl font-bold text-foreground">78 kg</p>
              </div>

              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Taille</p>
                <p className="text-base sm:text-xl font-bold text-foreground">1.75 m</p>
              </div>

              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">Groupe</p>
                <p className="text-base sm:text-xl font-bold text-foreground">O+</p>
              </div>

              <div className="bg-muted/30 rounded-xl p-3">
                <p className="text-[10px] sm:text-xs text-muted-foreground font-medium mb-1">N° CNAMGS</p>
                <p className="text-xs sm:text-sm font-bold text-foreground">GA2384567891</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div onClick={() => navigate('/appointments')} className="group rounded-xl backdrop-blur-xl p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                    <Calendar className="w-4 h-4 sm:w-7 sm:h-7 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground text-xs sm:text-lg mb-0.5 sm:mb-2">Prendre RDV</h3>
                    <span className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                      Disponible aujourd'hui
                    </span>
                  </div>
                </div>
                <ChevronRight className="hidden sm:block w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </div>

            <div onClick={() => navigate('/teleconsultation')} className="group rounded-xl backdrop-blur-xl p-3 sm:p-6 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-card/80 border border-border hover:bg-card/90 shadow-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                    <Video className="w-4 h-4 sm:w-7 sm:h-7 text-[#00d4ff]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground text-xs sm:text-lg mb-0.5 sm:mb-2">Téléconsultation</h3>
                    <span className="inline-block px-1.5 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-xs rounded-full bg-[#ff0088]/20 text-[#ff0088]">
                      Médecins disponibles
                    </span>
                  </div>
                </div>
                <ChevronRight className="hidden sm:block w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </div>
            </div>
          </div>

          {/* Health Overview - compact pour mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {/* Prochain RDV */}
            <div className="p-4 sm:p-6 rounded-xl bg-card/80 backdrop-blur-xl border border-border shadow-xl">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Prochain Rendez-vous</p>
                  <p className="text-base sm:text-xl font-bold mt-0.5 sm:mt-1 text-card-foreground">Mardi 8 Oct - 14h30</p>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-muted-foreground font-medium">Dr.Ékomi - Cardiologie</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">Cabinet Montagne Sainte, Libreville</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                  <Stethoscope className="w-5 h-5 sm:w-7 sm:h-7 text-[#00d4ff]" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mt-2 sm:mt-3 bg-muted/20 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg">
                <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#00d4ff]" />
                <span>3.2 km de votre position</span>
              </div>
            </div>

            {/* Couverture CNAMGS */}
            <div className="p-4 sm:p-6 rounded-xl bg-card/80 backdrop-blur-xl border border-border shadow-xl">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground font-medium">Couverture CNAMGS</p>
                  <p className="text-lg sm:text-3xl font-bold mt-1 sm:mt-2 text-card-foreground">100%</p>
                  <p className="text-xs sm:text-sm mt-1 sm:mt-2 text-muted-foreground font-medium">Statut: Actif</p>
                  <p className="text-[10px] sm:text-xs text-muted-foreground/70 mt-1">N° GA2384567891</p>
                </div>
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center bg-[#00d4ff]/20 flex-shrink-0">
                  <Shield className="w-5 h-5 sm:w-7 sm:h-7 text-[#00d4ff]" />
                </div>
              </div>
              <div className="h-2 sm:h-2.5 rounded-full overflow-hidden bg-muted/20 mt-3 sm:mt-4">
                <div className="progress-fill h-full rounded-full transition-all duration-1000 bg-gradient-to-r from-[#00d4ff] to-[#0088ff]" style={{
                width: '0%'
              }} />
              </div>
            </div>
          </div>

          {/* Stats Grid - compact pour mobile */}
          <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl mb-6">
            <div className="grid grid-cols-4 gap-3 sm:gap-4">
              {[{
              label: 'Consultations',
              value: '8',
              icon: Stethoscope,
              trend: 'Cette année',
              color: '#00d4ff'
            }, {
              label: 'Ordonnances actives',
              value: '3',
              icon: Pill,
              trend: 'En cours',
              color: '#0088ff'
            }, {
              label: 'Analyses en attente',
              value: '1',
              icon: Activity,
              trend: 'Résultat prévu lundi',
              color: '#ffaa00'
            }, {
              label: 'Vaccins à jour',
              value: '100%',
              icon: CheckCircle,
              trend: 'Prochain: 2026',
              color: '#ff0088'
            }].map((stat, index) => {
              const Icon = stat.icon;
              return <div key={index} className="text-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl mx-auto mb-2 flex items-center justify-center" style={{
                  backgroundColor: `${stat.color}20`
                }}>
                      <Icon className="w-5 h-5 sm:w-7 sm:h-7" style={{
                    color: stat.color
                  }} />
                    </div>
                    <p className="text-lg sm:text-3xl font-bold text-card-foreground mb-1">{stat.value}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">{stat.label}</p>
                    <p className="text-[9px] sm:text-xs text-muted-foreground/70 hidden sm:block">{stat.trend}</p>
                  </div>;
            })}
            </div>
          </div>

          {/* Rappels & Alertes et Dossier Médical sur la même ligne */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Rappels & Alertes */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
                Rappels & Alertes
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {[{
                time: 'Aujourd\'hui 14h30',
                event: 'Consultation cardiologie - Dr.Ékomi',
                location: 'Cabinet Montagne Sainte',
                icon: Calendar,
                color: '#00d4ff'
              }, {
                time: 'Dans 3 jours',
                event: 'Résultats d\'analyses disponibles',
                location: 'Laboratoire BIOLAB',
                icon: Activity,
                color: '#0088ff'
              }, {
                time: 'Cette semaine',
                event: 'Ordonnance à renouveler',
                location: 'Pharmacie de la Grâce',
                icon: Pill,
                color: '#ffaa00'
              }, {
                time: 'Urgent',
                event: 'Vaccin tétanos recommandé',
                location: 'Tout centre de vaccination',
                icon: AlertCircle,
                color: '#ff0088'
              }].map((reminder, idx) => {
                const Icon = reminder.icon;
                return <div key={idx} className="p-2.5 sm:p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                        backgroundColor: `${reminder.color}20`
                      }}>
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{
                          color: reminder.color
                        }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5">{reminder.time}</p>
                          <p className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight line-clamp-2">{reminder.event}</p>
                        </div>
                      </div>
                      <p className="text-[9px] sm:text-xs text-muted-foreground/70 ml-10 sm:ml-0 truncate">
                        {reminder.location}
                      </p>
                    </div>
                  </div>;
              })}
              </div>
            </div>

            {/* Dossier Médical Récent */}
            <div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-foreground">
                Dossier Médical Récent
              </h3>
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[{
                title: 'Dernière consultation',
                date: '28 Sept 2025',
                type: 'Cardiologie',
                icon: FileHeart,
                color: '#00d4ff'
              }, {
                title: 'Dernière ordonnance',
                date: '28 Sept 2025',
                type: '3 médicaments',
                icon: Pill,
                color: '#ffaa00'
              }, {
                title: 'Dernière analyse',
                date: '15 Sept 2025',
                type: 'Bilan sanguin',
                icon: Activity,
                color: '#0088ff'
              }].map((doc, idx) => {
                const Icon = doc.icon;
                return <div key={idx} className="p-2.5 sm:p-5 rounded-xl hover:scale-[1.02] transition-all cursor-pointer bg-card/80 hover:bg-card/90 border border-border shadow-xl backdrop-blur-xl">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{
                        backgroundColor: `${doc.color}20`
                      }}>
                          <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{
                          color: doc.color
                        }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-card-foreground leading-tight line-clamp-2 mb-0.5">{doc.title}</p>
                        </div>
                      </div>
                      <div className="ml-10 sm:ml-0 space-y-0.5">
                        <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{doc.date}</p>
                        <p className="text-[9px] sm:text-xs text-muted-foreground/70 truncate">{doc.type}</p>
                      </div>
                    </div>
                  </div>;
              })}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals de modification */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        userId={user?.id || ''}
        currentData={{
          firstName,
          lastName,
          birthDate: user?.user_metadata?.birth_date,
          gender: user?.user_metadata?.gender
        }}
      />
      
      <EditMedicalInfoModal
        isOpen={editMedicalOpen}
        onClose={() => setEditMedicalOpen(false)}
        userId={user?.id || ''}
        currentData={{
          weight: 78,
          height: 1.75,
          bloodGroup: 'O+',
          cnamgsNumber: 'GA2384567891'
        }}
      />
    </div>;
}