import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Heart, Activity, Pill, Download, Share2, Loader2, Menu } from "lucide-react";
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background sombre avec étoiles */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
      </div>

      {/* Container avec sidebar */}
      <div className="relative flex">
        {/* Sidebar Desktop */}
        <aside className="hidden md:block w-64 h-screen fixed left-0 top-0 p-4 z-40">
          <div className="h-full rounded-2xl backdrop-blur-xl p-6 bg-[#1a1f2e]/90 border border-white/10 shadow-2xl flex flex-col">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-2">
                <img src={logoSante} alt="SANTE.GA Logo" className="h-12 w-auto object-contain" />
                <h1 className="text-2xl font-bold text-white">SANTE.GA</h1>
              </div>
              <p className="text-xs text-gray-500">Votre santé à portée de clic</p>
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
                      isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                          isActive ? '' : 'bg-white/5'
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

            <div className="mt-auto pt-6 border-t border-white/10">
              <div className="p-3 rounded-lg bg-white/5">
                <div className="flex items-center gap-3">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold bg-[#00d4ff]">
                      {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                  )}
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
              <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
              <h1 className="text-xl font-bold text-white tracking-tight">SANTE.GA</h1>
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
                      <img src={logoSante} alt="SANTE.GA Logo" className="h-10 w-auto object-contain" />
                      <h1 className="text-2xl font-bold text-white tracking-tight">SANTE.GA</h1>
                    </div>
                    <p className="text-xs text-gray-500 ml-1">Votre santé à portée de clic</p>
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
                            isActive ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
                                isActive ? '' : 'bg-white/5'
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
                    <h1 className="text-3xl font-bold text-white">Mon Dossier Médical</h1>
                    <p className="text-gray-400 mt-2">
                      Accédez à l'historique complet de votre parcours de santé
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                      <Share2 className="h-4 w-4 mr-2" />
                      Partager
                    </Button>
                    <Button className="bg-gradient-to-r from-[#00d4ff] to-[#0088ff] hover:opacity-90">
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger
                    </Button>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-[#00d4ff]/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-[#00d4ff]" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Patient</p>
                        <p className="text-2xl font-bold text-white">{profile?.full_name || 'N/A'}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Consultations</p>
                        <p className="text-2xl font-bold text-white">{consultations.length}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Antécédents</p>
                        <p className="text-2xl font-bold text-white">{medicalHistory.length}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Carnets numériques */}
                <div className="grid gap-6 md:grid-cols-3">
                  <HealthBooklet 
                    profile={profile}
                    medicalHistory={medicalHistory}
                    treatments={treatments}
                    consultations={consultations}
                  />
                  <VaccinationBooklet profile={profile} />
                  <CNAMGSCard profile={profile} />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Heart className="h-5 w-5 text-[#ff0088]" />
                      <h2 className="text-xl font-semibold text-white">Antécédents Médicaux</h2>
                    </div>
                    <Separator className="mb-4 bg-white/10" />
                    <div className="space-y-3">
                      {medicalHistory.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                          Aucun antécédent médical enregistré
                        </p>
                      ) : (
                        medicalHistory.map((item) => (
                          <div key={item.id} className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-white">{item.condition_name}</p>
                              <p className="text-sm text-gray-400">
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

                  <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <Pill className="h-5 w-5 text-[#0088ff]" />
                      <h2 className="text-xl font-semibold text-white">Traitements en Cours</h2>
                    </div>
                    <Separator className="mb-4 bg-white/10" />
                    <div className="space-y-3">
                      {treatments.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                          Aucun traitement en cours
                        </p>
                      ) : (
                        treatments.map((treatment) => (
                          <div key={treatment.id} className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-white">{treatment.medication_name} {treatment.dosage}</p>
                              <p className="text-sm text-gray-400">{treatment.frequency}</p>
                            </div>
                            <Badge className="bg-green-600">Actif</Badge>
                          </div>
                        ))
                      )}
                    </div>
                  </Card>
                </div>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Activity className="h-5 w-5 text-[#ffaa00]" />
                    <h2 className="text-xl font-semibold text-white">Historique des Consultations</h2>
                  </div>
                  <Separator className="mb-4 bg-white/10" />
                  <div className="space-y-4">
                    {consultations.length === 0 ? (
                      <p className="text-sm text-gray-400 text-center py-8">
                        Aucune consultation enregistrée
                      </p>
                    ) : (
                      consultations.map((consultation) => (
                        <div
                          key={consultation.id}
                          className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span className="font-medium text-white">
                                {format(new Date(consultation.consultation_date), "dd/MM/yyyy", { locale: fr })}
                              </span>
                              <Badge variant="outline" className="border-white/10 text-gray-300">
                                {consultation.consultation_type}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-400">{consultation.doctor_name}</p>
                            <p className="text-sm mt-1 text-gray-300">{consultation.reason}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewConsultation(consultation)}
                            className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10"
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
