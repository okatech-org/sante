import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Home,
  Calendar,
  Video,
  Shield,
  Activity,
  Pill,
  Bell,
  Settings,
  FileHeart,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  FileText,
  LogOut,
  Sun,
  Moon,
  Globe,
  Laptop
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logoSante from "@/assets/logo_sante.png";
import { CNAMGSCard } from "@/components/medical/CNAMGSCard";
import { toast } from "sonner";

export default function Reimbursements() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('cnamgs');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const [language, setLanguage] = useState('fr');

  const fullName = profileData?.full_name || (user?.user_metadata as any)?.full_name || 'Utilisateur';

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

  // Charger les préférences et le profil depuis la base de données
  useEffect(() => {
    const loadProfileAndPreferences = async () => {
      if (user?.id) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfileData(data);
          if (data.language) setLanguage(data.language);
          if (data.theme) setTheme(data.theme);
          if (data.avatar_url) setAvatarUrl(data.avatar_url);
        }
      }
    };
    loadProfileAndPreferences();
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
      toast.success("Déconnexion réussie - À bientôt !");
      navigate('/');
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

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
        {/* Sidebar Desktop et Tablette */}
        <aside className="hidden md:block w-72 h-screen fixed left-0 top-0 p-3 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-5 bg-sidebar/90 border border-sidebar-border shadow-2xl flex flex-col">
            {/* Logo */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-sidebar-foreground">SANTE.GA</h1>
              </div>
              <p className="text-xs text-muted-foreground">Votre santé à portée de clic</p>
            </div>

            {/* Menu */}
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = activeMenu === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveMenu(item.id);
                      if (item.path) navigate(item.path);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-sidebar-accent/30'
                        }`}
                        style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                      >
                        <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
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

            {/* User Profile */}
            <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
              {/* Theme, Language & Logout Controls */}
              <div className="flex items-center gap-2 px-2">
                {/* Theme Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                      {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                    <DropdownMenuItem onClick={() => handleThemeChange('light')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                      <Sun className="w-4 h-4 mr-2" />Clair
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                      <Moon className="w-4 h-4 mr-2" />Sombre
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleThemeChange('system')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                      <Laptop className="w-4 h-4 mr-2" />Système
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
                  <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                    <DropdownMenuItem onClick={() => handleLanguageChange('fr')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                      🇫🇷 Français
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                      🇬🇧 English
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Logout Button */}
                <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300" title="Déconnexion">
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
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{fullName.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">Patient</p>
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

                  <nav className="space-y-1 flex-1 overflow-y-auto">
                    {menuItems.map(item => {
                      const Icon = item.icon;
                      const isActive = activeMenu === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveMenu(item.id);
                            if (item.path) navigate(item.path);
                            setMobileMenuOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                            isActive ? 'bg-sidebar-accent text-sidebar-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-sidebar-accent/30'
                              }`}
                              style={isActive ? { backgroundColor: `${item.color}20` } : {}}
                            >
                              <Icon className="w-5 h-5" style={{ color: isActive ? item.color : '' }} />
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

                  {/* Contrôles Mobile : Theme, Language, Logout */}
                  <div className="mt-auto pt-4 border-t border-sidebar-border space-y-2">
                    <div className="flex items-center gap-2 px-2">
                      {/* Theme Selector */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent/30 hover:bg-sidebar-accent transition-colors text-muted-foreground hover:text-sidebar-foreground">
                            {theme === 'dark' ? <Moon className="w-4 h-4" /> : theme === 'light' ? <Sun className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                          <DropdownMenuItem onClick={() => handleThemeChange('light')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                            <Sun className="w-4 h-4 mr-2" />Clair
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleThemeChange('dark')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                            <Moon className="w-4 h-4 mr-2" />Sombre
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleThemeChange('system')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                            <Laptop className="w-4 h-4 mr-2" />Système
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
                        <DropdownMenuContent align="end" className="bg-popover border-border z-50">
                          <DropdownMenuItem onClick={() => handleLanguageChange('fr')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                            🇫🇷 Français
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleLanguageChange('en')} className="text-popover-foreground hover:bg-accent cursor-pointer">
                            🇬🇧 English
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {/* Logout Button */}
                      <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300" title="Déconnexion">
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
                          <p className="text-sm font-medium text-sidebar-foreground truncate">{fullName.split(' ')[0]}</p>
                          <p className="text-xs text-muted-foreground">Patient</p>
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
        <main className="flex-1 md:ml-72 pt-20 md:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Header */}
              <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 lg:p-8 bg-card/80 border border-border shadow-2xl">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Droits CNAMGS</h1>
                <p className="text-muted-foreground mt-2">
                  Consultez vos droits et suivez vos remboursements CNAMGS
                </p>
              </div>

              {/* Statistiques */}
              <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Droits actifs</p>
                      <p className="text-2xl font-bold text-foreground">Valides</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-[#00d4ff]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Remboursements en cours</p>
                      <p className="text-2xl font-bold text-foreground">2</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#ffaa00]/20 flex items-center justify-center">
                      <Shield className="h-6 w-6 text-[#ffaa00]" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Taux de couverture</p>
                      <p className="text-2xl font-bold text-foreground">80%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte CNAMGS */}
              <div className="rounded-xl backdrop-blur-xl p-6 bg-card/80 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[#00d4ff]" />
                  Votre carte d'assuré CNAMGS
                </h2>
                {profileData && <CNAMGSCard profile={profileData} />}
              </div>

              {/* Demandes de remboursement */}
              <div className="rounded-xl backdrop-blur-xl p-6 bg-card/80 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-4">Demandes de remboursement récentes</h2>
                <div className="space-y-4">
                  <Card className="p-4 bg-card/50 border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-[#00d4ff]/20 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-[#00d4ff]" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">Consultation cardiologie</h3>
                            <Badge className="bg-[#ffaa00]/20 text-[#ffaa00] border-[#ffaa00]/30">
                              <Clock className="h-3 w-3 mr-1" />
                              En cours
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Montant: 25,000 FCFA • Date: 15/12/2024</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>

                  <Card className="p-4 bg-card/50 border-border">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                          <FileText className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground">Analyses biologiques</h3>
                            <Badge className="bg-green-600">Remboursé</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Montant: 15,000 FCFA • Date: 10/12/2024</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Informations */}
              <div className="rounded-xl backdrop-blur-xl p-6 bg-card/80 border border-border">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-[#00d4ff] mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">Informations importantes</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Les demandes de remboursement sont traitées sous 7 à 15 jours ouvrés</li>
                      <li>• Conservez vos factures originales pendant 3 ans</li>
                      <li>• Le taux de remboursement varie selon le type de soins</li>
                      <li>• Vérifiez votre solde de droits avant chaque consultation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
