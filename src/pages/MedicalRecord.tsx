import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Heart, Activity, Pill, Download, Share2, Loader2, Menu, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ConsultationDetailsModal } from "@/components/medical/ConsultationDetailsModal";
import { HealthBooklet } from "@/components/medical/HealthBooklet";
import { VaccinationBooklet } from "@/components/medical/VaccinationBooklet";
import { CNAMGSCard } from "@/components/medical/CNAMGSCard";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import logoSante from "@/assets/logo_sante.png";
import { 
  Home, 
  Video, 
  Stethoscope, 
  Shield, 
  Bell, 
  Settings, 
  FileHeart 
} from "lucide-react";

interface MedicalHistory {
  id: string;
  condition_name: string;
  diagnosed_date: string | null;
  status: string;
  notes: string | null;
}

interface Treatment {
  id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  status: string;
  start_date: string;
  end_date: string | null;
}

interface Consultation {
  id: string;
  consultation_date: string;
  consultation_type: string;
  doctor_name: string;
  reason: string;
  diagnosis: string | null;
  notes: string | null;
  documents: any;
}

export default function MedicalRecord() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dossier');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const fullName = (user?.user_metadata as any)?.full_name || 'Utilisateur';

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

  useEffect(() => {
    if (user?.id) {
      loadMedicalData();
      loadAvatar();
    }
  }, [user?.id]);

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

  const loadMedicalData = async () => {
    try {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      
      if (profileData) setProfile(profileData);

      const { data: historyData, error: historyError } = await supabase
        .from('medical_history')
        .select('*')
        .eq('user_id', user!.id)
        .order('diagnosed_date', { ascending: false });

      if (historyError) throw historyError;
      setMedicalHistory(historyData || []);

      const { data: treatmentsData, error: treatmentsError } = await supabase
        .from('treatments')
        .select('*')
        .eq('user_id', user!.id)
        .eq('status', 'active')
        .order('start_date', { ascending: false });

      if (treatmentsError) throw treatmentsError;
      setTreatments(treatmentsData || []);

      const { data: consultationsData, error: consultationsError } = await supabase
        .from('consultations')
        .select('*')
        .eq('user_id', user!.id)
        .order('consultation_date', { ascending: false });

      if (consultationsError) throw consultationsError;
      setConsultations(consultationsData || []);

    } catch (error) {
      console.error('Error loading medical data:', error);
      toast.error("Erreur lors du chargement des données médicales");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="destructive">Actif</Badge>;
      case 'chronic':
        return <Badge>Chronique</Badge>;
      case 'resolved':
        return <Badge variant="outline">Résolu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleViewConsultation = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success("Déconnexion réussie");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Background pattern */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, hsl(var(--primary) / 0.1) 1px, transparent 1px), radial-gradient(circle at 60% 70%, hsl(var(--primary) / 0.05) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px',
          backgroundPosition: '0 0, 50px 50px'
        }} />
      </div>

      {/* Container avec sidebar */}
      <div className="relative flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 p-4 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-6 bg-sidebar-background/95 border border-sidebar-border shadow-2xl flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-sidebar-foreground">SANTE.GA</h1>
              </div>
              <p className="text-xs text-muted-foreground">Votre santé à portée de clic</p>
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
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-muted/30'
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

            <div className="mt-auto pt-6 border-t border-sidebar-border space-y-4">
              <div className="flex items-center justify-center gap-2">
                <ThemeToggle />
                <LanguageToggle />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout}
                  className="hover:bg-sidebar-accent"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-sidebar-accent/30">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold bg-primary text-primary-foreground">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{fullName.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">Patient</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-sidebar-background/95 backdrop-blur-xl border-b border-sidebar-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-sidebar-foreground tracking-tight">SANTE.GA</h1>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button className="w-10 h-10 rounded-lg flex items-center justify-center bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-accent/80 transition-all">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-sidebar-background border-sidebar-border p-0">
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
                            isActive ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-muted/30'
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

                  <div className="mt-auto pt-6 border-t border-sidebar-border space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <ThemeToggle />
                      <LanguageToggle />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="hover:bg-sidebar-accent"
                      >
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 pt-20 md:pt-0">
          <div className="p-4 sm:p-6 lg:p-8">
            {loading ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-foreground">Mon Dossier Médical</h1>
                    <p className="text-muted-foreground mt-2">
                      Accédez à l'historique complet de votre parcours de santé
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    <Button className="bg-gradient-to-r from-primary to-secondary hover:opacity-90">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Patient</p>
                        <p className="text-2xl font-bold text-foreground">{profile?.full_name || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Consultations</p>
                        <p className="text-2xl font-bold text-foreground">{consultations.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Antécédents</p>
                        <p className="text-2xl font-bold text-foreground">{medicalHistory.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Carnets numériques */}
                <div className="space-y-6">
                  <HealthBooklet 
                    profile={profile}
                    medicalHistory={medicalHistory}
                    treatments={treatments}
                    consultations={consultations}
                  />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <VaccinationBooklet profile={profile} />
                    <CNAMGSCard profile={profile} />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="h-5 w-5 text-accent" />
                      <h2 className="text-xl font-semibold text-foreground">Antécédents Médicaux</h2>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                      {medicalHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucun antécédent médical enregistré
                        </p>
                      ) : (
                        medicalHistory.map((item) => (
                          <div key={item.id} className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{item.condition_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.diagnosed_date
                                  ? `Diagnostiqué le ${format(new Date(item.diagnosed_date), "dd/MM/yyyy", { locale: fr })}`
                                  : 'Date inconnue'}
                              </p>
                            </div>
                            {getStatusBadge(item.status)}
                          </div>
                        ))
                      )}
                    </div>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="h-5 w-5 text-secondary" />
                      <h2 className="text-xl font-semibold text-foreground">Traitements en Cours</h2>
                    </div>
                    <Separator className="mb-4" />
                    <div className="space-y-3">
                      {treatments.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          Aucun traitement en cours
                        </p>
                      ) : (
                        treatments.map((treatment) => (
                          <div key={treatment.id} className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-foreground">{treatment.medication_name} {treatment.dosage}</p>
                              <p className="text-sm text-muted-foreground">{treatment.frequency}</p>
                            </div>
                            <Badge className="bg-success text-success-foreground">Actif</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>

                <Card className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-warning" />
                    <h2 className="text-xl font-semibold text-foreground">Historique des Consultations</h2>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-4">
                    {consultations.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Aucune consultation enregistrée
                      </p>
                    ) : (
                      consultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium text-foreground">
                                {format(new Date(consultation.consultation_date), "dd/MM/yyyy", { locale: fr })}
                              </span>
                              <Badge variant="outline">
                                {consultation.consultation_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{consultation.doctor_name}</p>
                            <p className="text-sm mt-1 text-foreground/80">{consultation.reason}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewConsultation(consultation)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>

      <ConsultationDetailsModal
        consultation={selectedConsultation}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </div>
  );
}
