import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  TestTube, 
  Download, 
  Share2, 
  Calendar, 
  User, 
  AlertCircle,
  Search,
  Filter,
  Eye,
  Clock,
  Activity,
  FileText,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Menu,
  Home,
  Video,
  Shield,
  Pill,
  Bell,
  Settings,
  FileHeart,
  Heart,
  LogOut,
  Sun,
  Moon,
  Globe,
  Laptop
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import logoSante from "@/assets/logo_sante.png";

interface ResultItem {
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: "normal" | "high" | "low";
}

interface MedicalResult {
  id: string;
  type: "blood" | "urine" | "imaging" | "biopsy" | "other";
  title: string;
  date: string;
  laboratory: string;
  doctor: string;
  status: "pending" | "available" | "viewed";
  category: string;
  urgent: boolean;
  results?: ResultItem[];
  conclusion?: string;
  recommendations?: string;
  imageUrl?: string;
}

const mockResults: MedicalResult[] = [
  {
    id: "RES-2024-012",
    type: "blood",
    title: "Bilan lipidique complet",
    date: "18/12/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Ondo",
    status: "available",
    category: "Analyses de sang",
    urgent: false,
    results: [
      { parameter: "Cholestérol total", value: "2.10", unit: "g/L", referenceRange: "< 2.0", status: "high" },
      { parameter: "HDL (bon cholestérol)", value: "0.55", unit: "g/L", referenceRange: "> 0.40", status: "normal" },
      { parameter: "LDL (mauvais cholestérol)", value: "1.35", unit: "g/L", referenceRange: "< 1.60", status: "normal" },
      { parameter: "Triglycérides", value: "1.20", unit: "g/L", referenceRange: "< 1.50", status: "normal" }
    ],
    conclusion: "Légère hypercholestérolémie. Cholestérol total légèrement élevé.",
    recommendations: "Surveillance diététique. Privilégier les acides gras insaturés. Contrôle dans 3 mois."
  },
  {
    id: "RES-2024-011",
    type: "blood",
    title: "Glycémie à jeun + HbA1c",
    date: "15/12/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Nzamba",
    status: "available",
    category: "Analyses de sang",
    urgent: false,
    results: [
      { parameter: "Glycémie à jeun", value: "1.15", unit: "g/L", referenceRange: "0.70 - 1.10", status: "high" },
      { parameter: "HbA1c", value: "6.2", unit: "%", referenceRange: "< 5.7", status: "high" }
    ],
    conclusion: "Hyperglycémie modérée. HbA1c limite supérieure.",
    recommendations: "Ajustement du traitement antidiabétique. Contrôle strict de l'alimentation. RDV médecin traitant."
  },
  {
    id: "RES-2024-010",
    type: "imaging",
    title: "Radiographie thoracique",
    date: "10/12/2024",
    laboratory: "Centre d'Imagerie Médicale",
    doctor: "Dr. Chambrier",
    status: "viewed",
    category: "Imagerie",
    urgent: false,
    conclusion: "Radiographie thoracique normale. Pas d'anomalie détectée. Champs pulmonaires clairs. Silhouette cardiaque normale.",
    recommendations: "Aucun suivi particulier nécessaire."
  },
  {
    id: "RES-2024-009",
    type: "blood",
    title: "NFS (Numération Formule Sanguine)",
    date: "05/12/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Nzamba",
    status: "viewed",
    category: "Analyses de sang",
    urgent: false,
    results: [
      { parameter: "Globules rouges", value: "4.8", unit: "M/mm³", referenceRange: "4.5 - 5.5", status: "normal" },
      { parameter: "Hémoglobine", value: "14.2", unit: "g/dL", referenceRange: "13.0 - 17.0", status: "normal" },
      { parameter: "Hématocrite", value: "42", unit: "%", referenceRange: "40 - 50", status: "normal" },
      { parameter: "Globules blancs", value: "7.2", unit: "K/mm³", referenceRange: "4.0 - 10.0", status: "normal" },
      { parameter: "Plaquettes", value: "250", unit: "K/mm³", referenceRange: "150 - 400", status: "normal" }
    ],
    conclusion: "NFS normale. Tous les paramètres dans les normes.",
    recommendations: "Aucune action requise."
  },
  {
    id: "RES-2024-008",
    type: "urine",
    title: "Analyse d'urine complète",
    date: "28/11/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Nzamba",
    status: "viewed",
    category: "Analyses d'urine",
    urgent: false,
    results: [
      { parameter: "pH", value: "6.0", unit: "", referenceRange: "5.0 - 7.0", status: "normal" },
      { parameter: "Protéines", value: "Négatif", unit: "", referenceRange: "Négatif", status: "normal" },
      { parameter: "Glucose", value: "Négatif", unit: "", referenceRange: "Négatif", status: "normal" },
      { parameter: "Leucocytes", value: "Négatif", unit: "", referenceRange: "Négatif", status: "normal" }
    ],
    conclusion: "Analyse d'urine normale. Absence d'infection urinaire.",
    recommendations: "Pas de suivi nécessaire."
  },
  {
    id: "RES-2024-007",
    type: "blood",
    title: "Bilan hépatique",
    date: "20/11/2024",
    laboratory: "Laboratoire Biolab",
    doctor: "Dr. Ondo",
    status: "pending",
    category: "Analyses de sang",
    urgent: true
  }
];

export default function Results() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedResult, setSelectedResult] = useState<MedicalResult | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('resultats');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState('fr');
  const [profileData, setProfileData] = useState<{
    full_name: string;
  } | null>(null);

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
          .select('full_name, language, theme, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (data && !error) {
          setProfileData({
            full_name: data.full_name,
          });
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

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = 
      result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.laboratory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTab = 
      selectedTab === "all" ||
      result.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const availableResults = mockResults.filter(r => r.status === "available");
  const pendingResults = mockResults.filter(r => r.status === "pending");

  const handleDownload = (id: string) => {
    toast.success(`Téléchargement du résultat ${id}...`);
  };

  const handleShare = (id: string) => {
    toast.success(`Partage du résultat ${id}...`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-green-600">Disponible</Badge>;
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "viewed":
        return <Badge variant="outline">Consulté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    const types: Record<string, { label: string; className: string }> = {
      blood: { label: "Sang", className: "bg-red-500" },
      urine: { label: "Urine", className: "bg-yellow-600" },
      imaging: { label: "Imagerie", className: "bg-blue-600" },
      biopsy: { label: "Biopsie", className: "bg-purple-600" },
      other: { label: "Autre", className: "bg-gray-600" }
    };
    
    const typeInfo = types[type] || types.other;
    return <Badge className={typeInfo.className}>{typeInfo.label}</Badge>;
  };

  const getResultIcon = (status: string) => {
    switch (status) {
      case "normal":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
      case "high":
        return <TrendingUp className="h-4 w-4 text-destructive" />;
      case "low":
        return <TrendingDown className="h-4 w-4 text-secondary" />;
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />;
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
                        className="px-2.5 py-1 text-xs font-semibold rounded-full text-primary-foreground"
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
                <button onClick={handleLogout} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 transition-colors text-destructive hover:text-destructive" title="Déconnexion">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-3 rounded-lg bg-sidebar-accent/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold bg-primary">
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
                              className="px-2.5 py-1 text-xs font-semibold rounded-full text-primary-foreground"
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
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-primary-foreground font-bold bg-primary">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Mes Résultats d'Analyses</h1>
                <p className="text-muted-foreground mt-2">
                  Consultez vos résultats d'examens médicaux et biologiques
                </p>
              </div>

              {/* Statistiques rapides */}
              <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-success/20 flex items-center justify-center">
                      <Eye className="h-6 w-6 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Résultats disponibles</p>
                      <p className="text-2xl font-bold text-foreground">{availableResults.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-warning/20 flex items-center justify-center">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">En attente</p>
                      <p className="text-2xl font-bold text-foreground">{pendingResults.length}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <TestTube className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-2xl font-bold text-foreground">{mockResults.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Barre de recherche */}
              <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par type, laboratoire ou numéro..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-muted border-border text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </div>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <div className="rounded-2xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border">
                  <TabsList className="grid w-full grid-cols-4 bg-muted">
                    <TabsTrigger value="all" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Tous ({mockResults.length})</TabsTrigger>
                    <TabsTrigger value="available" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Disponibles ({availableResults.length})</TabsTrigger>
                    <TabsTrigger value="pending" className="data-[state=active]:bg-warning/20 data-[state=active]:text-warning">En attente ({pendingResults.length})</TabsTrigger>
                    <TabsTrigger value="viewed" className="data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">Consultés</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value={selectedTab} className="space-y-4 mt-6">
                  {filteredResults.length === 0 ? (
                    <div className="rounded-xl backdrop-blur-xl p-12 text-center bg-card/80 border border-border">
                      <TestTube className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Aucun résultat trouvé</h3>
                      <p className="text-muted-foreground">
                        {searchQuery 
                          ? "Essayez avec d'autres termes de recherche"
                          : "Vous n'avez pas encore de résultats dans cette catégorie"}
                      </p>
                    </div>
                  ) : (
                    filteredResults.map((result) => (
                      <div key={result.id} className="rounded-xl backdrop-blur-xl p-6 bg-card/80 border border-border hover:bg-card/90 transition-all shadow-xl">
                        {/* En-tête */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                              {result.type === "blood" && <TestTube className="h-6 w-6 text-primary" />}
                              {result.type === "imaging" && <Activity className="h-6 w-6 text-primary" />}
                              {result.type === "urine" && <TestTube className="h-6 w-6 text-primary" />}
                              {!["blood", "imaging", "urine"].includes(result.type) && <FileText className="h-6 w-6 text-primary" />}
                            </div>
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-foreground">{result.title}</h3>
                              {getStatusBadge(result.status)}
                              {getTypeBadge(result.type)}
                              {result.urgent && (
                                <Badge variant="destructive" className="animate-pulse">
                                  Urgent
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {result.date}
                              </div>
                              <div className="flex items-center gap-1">
                                <TestTube className="h-4 w-4" />
                                {result.laboratory}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                Prescrit par {result.doctor}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleShare(result.id)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDownload(result.id)}
                            className="text-gray-400 hover:text-white hover:bg-white/10"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Résultats disponibles */}
                      {result.status !== "pending" && (
                        <div className="space-y-3">
                          {result.results && result.results.length > 0 && (
                            <div className="border border-border rounded-lg p-4 bg-muted">
                              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-primary" />
                                Paramètres analysés
                              </h4>
                              <div className="space-y-2">
                                {result.results.map((item, index) => (
                                  <div 
                                    key={index}
                                    className="flex items-center justify-between p-2 rounded bg-card/50"
                                  >
                                    <div className="flex items-center gap-2">
                                      {getResultIcon(item.status)}
                                      <span className="font-medium text-foreground">{item.parameter}</span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className={
                                        item.status === "high" ? "text-destructive font-semibold" :
                                        item.status === "low" ? "text-secondary font-semibold" :
                                        "text-foreground"
                                      }>
                                        {item.value} {item.unit}
                                      </span>
                                      <span className="text-muted-foreground">
                                        Norme: {item.referenceRange}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Conclusion */}
                          {result.conclusion && (
                            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                              <p className="text-sm text-muted-foreground">
                                <span className="font-semibold text-foreground">Conclusion:</span>{" "}
                                {result.conclusion}
                              </p>
                            </div>
                          )}

                          {/* Recommandations */}
                          {result.recommendations && (
                            <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                                <p className="text-sm text-muted-foreground">
                                  <span className="font-semibold text-foreground">Recommandations:</span>{" "}
                                  {result.recommendations}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Bouton voir détails */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10"
                                onClick={() => setSelectedResult(result)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Voir les détails complets
                              </Button>
                            </DialogTrigger>
                        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{result.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-semibold">ID:</span> {result.id}
                              </div>
                              <div>
                                <span className="font-semibold">Date:</span> {result.date}
                              </div>
                              <div>
                                <span className="font-semibold">Laboratoire:</span> {result.laboratory}
                              </div>
                              <div>
                                <span className="font-semibold">Médecin:</span> {result.doctor}
                              </div>
                            </div>
                            {result.results && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-3">Résultats détaillés</h4>
                                <div className="space-y-2">
                                  {result.results.map((item, index) => (
                                    <div key={index} className="p-3 bg-accent rounded-lg">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium">{item.parameter}</span>
                                        {getResultIcon(item.status)}
                                      </div>
                                      <div className="text-sm text-muted-foreground">
                                        Valeur: <span className="font-semibold text-foreground">{item.value} {item.unit}</span>
                                        {" | "}
                                        Norme: {item.referenceRange}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                            {result.conclusion && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Conclusion</h4>
                                <p className="text-sm">{result.conclusion}</p>
                              </div>
                            )}
                            {result.recommendations && (
                              <div className="border-t pt-4">
                                <h4 className="font-semibold mb-2">Recommandations</h4>
                                <p className="text-sm">{result.recommendations}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  )}

                  {/* Message en attente */}
                  {result.status === "pending" && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
                      <Clock className="h-8 w-8 mx-auto text-orange-600 mb-2" />
                      <p className="font-semibold text-white">Résultat en cours de traitement</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Vous recevrez une notification dès que les résultats seront disponibles
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
          </div>
        </main>
      </div>
    </div>
  );
}
