import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SendToPharmacyModal } from "@/components/prescriptions/SendToPharmacyModal";
import {
  FileText, 
  Download, 
  Share2,
  Eye,
  Send,
  Calendar, 
  Clock, 
  User, 
  Pill,
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Menu,
  Home,
  Video,
  Shield,
  Activity,
  Bell,
  Settings,
  FileHeart
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import logoSante from "@/assets/logo_sante.png";

interface Prescription {
  id: string;
  date: string;
  doctor: string;
  specialty: string;
  status: "active" | "expired" | "renewed";
  validUntil: string;
  medications: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  notes?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: "ORD-2024-001",
    date: "15/12/2024",
    doctor: "Dr. Ondo (Cardiologue)",
    specialty: "Cardiologie",
    status: "active",
    validUntil: "15/03/2025",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10 mg",
        frequency: "1 comprimé par jour",
        duration: "3 mois",
        instructions: "À prendre le matin à jeun"
      },
      {
        name: "Aspirine",
        dosage: "100 mg",
        frequency: "1 comprimé par jour",
        duration: "3 mois",
        instructions: "À prendre le soir après le repas"
      }
    ],
    notes: "Contrôle tension artérielle tous les mois. Prochain RDV: 15/01/2025"
  },
  {
    id: "ORD-2024-002",
    date: "03/11/2024",
    doctor: "Dr. Nzamba",
    specialty: "Médecine générale",
    status: "active",
    validUntil: "03/02/2025",
    medications: [
      {
        name: "Metformine",
        dosage: "500 mg",
        frequency: "2 fois par jour",
        duration: "3 mois",
        instructions: "Pendant ou après les repas"
      },
      {
        name: "Atorvastatine",
        dosage: "20 mg",
        frequency: "1 comprimé le soir",
        duration: "3 mois"
      }
    ],
    notes: "Surveillance glycémie. Bilan sanguin dans 1 mois."
  },
  {
    id: "ORD-2023-089",
    date: "15/09/2024",
    doctor: "Dr. Mbina",
    specialty: "Médecine générale",
    status: "expired",
    validUntil: "15/12/2024",
    medications: [
      {
        name: "Amoxicilline",
        dosage: "500 mg",
        frequency: "3 fois par jour",
        duration: "7 jours",
        instructions: "Pendant les repas"
      }
    ],
    notes: "Traitement infection respiratoire - Terminé"
  },
  {
    id: "ORD-2023-078",
    date: "10/08/2024",
    doctor: "Dr. Ondo (Cardiologue)",
    specialty: "Cardiologie",
    status: "renewed",
    validUntil: "10/11/2024",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10 mg",
        frequency: "1 comprimé par jour",
        duration: "3 mois"
      }
    ],
    notes: "Renouvelée le 15/12/2024"
  }
];

export default function Prescriptions() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('ordonnances');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [previewPrescription, setPreviewPrescription] = useState<Prescription | null>(null);
  const [sendToPharmacyOpen, setSendToPharmacyOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);

  const fullName = (user?.user_metadata as any)?.full_name || 'Utilisateur';

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: Home, path: '/dashboard/patient', color: '#00d4ff' },
    { id: 'appointments', label: 'Mes rendez-vous', icon: Calendar, badge: '2', path: '/appointments', color: '#0088ff' },
    { id: 'teleconsult', label: 'Téléconsultation', icon: Video, path: '/teleconsultation', color: '#00d4ff' },
    { id: 'dossier', label: 'Dossier Médical', icon: FileHeart, path: '/medical-record', color: '#ffaa00' },
    { id: 'ordonnances', label: 'Mes ordonnances', icon: Pill, badge: '1', path: '/prescriptions', color: '#ff0088' },
    { id: 'resultats', label: 'Résultats d\'analyses', icon: Activity, path: '/results', color: '#0088ff' },
    { id: 'cnamgs', label: 'Droits CNAMGS', icon: Shield, path: '/reimbursements', color: '#00d4ff' },
    { id: 'messages', label: 'Messages', icon: Bell, badge: '3', path: '/support', color: '#ffaa00' },
    { id: 'settings', label: 'Paramètres', icon: Settings, path: '/profile', color: '#ff0088' }
  ];

  useEffect(() => {
    loadAvatar();
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

  const filteredPrescriptions = mockPrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.doctor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medications.some(med => 
        med.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTab = 
      selectedTab === "all" ||
      prescription.status === selectedTab;

    return matchesSearch && matchesTab;
  });

  const activePrescriptions = mockPrescriptions.filter(p => p.status === "active");
  const expiredPrescriptions = mockPrescriptions.filter(p => p.status === "expired");

  const handleDownload = (id: string) => {
    toast.success(`Téléchargement de l'ordonnance ${id}...`);
  };

  const handleShare = (id: string) => {
    toast.success(`Partage de l'ordonnance ${id}...`);
  };

  const handleSendToPharmacy = (id: string) => {
    setSelectedPrescriptionId(id);
    setSendToPharmacyOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expirée</Badge>;
      case "renewed":
        return <Badge className="bg-blue-600">Renouvelée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "expired":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "renewed":
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background étoilé */}
      <div className="fixed inset-0 bg-[#0f1419] -z-10">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 60% 70%, rgba(255,255,255,0.05) 1px, transparent 1px), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.08) 1.5px, transparent 1.5px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.04) 1px, transparent 1px), radial-gradient(circle at 90% 50%, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '200px 200px, 250px 250px, 180px 180px, 220px 220px, 190px 190px',
          backgroundPosition: '0 0, 50px 50px, 100px 25px, 150px 75px, 25px 100px'
        }} />
      </div>

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
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-white">
                  Mes <span className="bg-gradient-to-r from-[#00d4ff] via-[#0088ff] to-[#ff0088] bg-clip-text text-transparent">Ordonnances</span>
                </h1>
                <p className="text-gray-400 mt-2">
                  Consultez et gérez vos prescriptions médicales
                </p>
              </div>

              {/* Statistiques */}
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Ordonnances actives</p>
                      <p className="text-2xl font-bold text-white">{activePrescriptions.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                      <XCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Expirées</p>
                      <p className="text-2xl font-bold text-white">{expiredPrescriptions.length}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#ff0088]/10 flex items-center justify-center">
                      <FileText className="h-6 w-6 text-[#ff0088]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-2xl font-bold text-white">{mockPrescriptions.length}</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Recherche */}
              <Card className="p-4 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Rechercher par médicament, médecin ou numéro..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
                    />
                  </div>
                  <Button variant="outline" className="sm:w-auto border-white/10 bg-white/5 text-white hover:bg-white/10">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </div>
              </Card>

              {/* Tabs */}
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-4 bg-[#1a1f2e]/50 border border-white/10">
                  <TabsTrigger value="all" className="data-[state=active]:bg-[#00d4ff]/20 data-[state=active]:text-[#00d4ff]">
                    Toutes ({mockPrescriptions.length})
                  </TabsTrigger>
                  <TabsTrigger value="active" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-500">
                    Actives ({activePrescriptions.length})
                  </TabsTrigger>
                  <TabsTrigger value="expired" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-500">
                    Expirées ({expiredPrescriptions.length})
                  </TabsTrigger>
                  <TabsTrigger value="renewed" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-500">
                    Renouvelées
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="mt-6">
                  {filteredPrescriptions.length === 0 ? (
                    <Card className="p-12 text-center bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm">
                      <FileText className="h-12 w-12 mx-auto text-gray-500 mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-white">Aucune ordonnance trouvée</h3>
                      <p className="text-gray-400">
                        {searchQuery 
                          ? "Essayez avec d'autres termes de recherche"
                          : "Vous n'avez pas encore d'ordonnances dans cette catégorie"}
                      </p>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {filteredPrescriptions.map((prescription) => (
                      <Card key={prescription.id} className="p-4 bg-[#1a1f2e]/50 border-white/10 backdrop-blur-sm hover:bg-[#1a1f2e]/70 transition-all">
                        <div className="flex flex-col lg:flex-row gap-4">
                          {/* Colonne gauche - Informations */}
                          <div className="flex-1 min-w-0">
                            {/* En-tête */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start gap-3 min-w-0 flex-1">
                                <div className="h-10 w-10 rounded-full bg-[#ff0088]/10 flex items-center justify-center flex-shrink-0">
                                  {getStatusIcon(prescription.status)}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-semibold text-base text-white">{prescription.id}</h3>
                                    {getStatusBadge(prescription.status)}
                                  </div>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                                    <div className="flex items-center gap-1">
                                      <User className="h-3 w-3" />
                                      <span className="truncate">{prescription.doctor}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {prescription.date}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {prescription.validUntil}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex gap-1 flex-shrink-0 ml-2 lg:hidden">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setPreviewPrescription(prescription)}
                                  className="text-[#ff0088] hover:text-[#ff0088] hover:bg-[#ff0088]/10 h-8 w-8 p-0"
                                  title="Visualiser"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleShare(prescription.id)}
                                  className="text-gray-400 hover:text-white hover:bg-white/10 h-8 w-8 p-0"
                                  title="Partager"
                                >
                                  <Share2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleDownload(prescription.id)}
                                  className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 h-8 w-8 p-0"
                                  title="Télécharger"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>

                            {/* Médicaments */}
                            <div className="space-y-2 mb-3">
                              <h4 className="font-semibold flex items-center gap-2 text-sm text-white">
                                <Pill className="h-3.5 w-3.5 text-[#ff0088]" />
                                Médicaments ({prescription.medications.length})
                              </h4>
                              {prescription.medications.map((med, index) => (
                                <div 
                                  key={index} 
                                  className="border border-white/10 rounded-lg p-3 bg-white/5"
                                >
                                  <div className="flex items-start justify-between mb-1.5">
                                    <div className="min-w-0 flex-1">
                                      <p className="font-semibold text-sm text-white truncate">{med.name}</p>
                                      <p className="text-xs text-gray-400">{med.dosage}</p>
                                    </div>
                                    <Badge variant="outline" className="border-white/10 text-gray-300 text-xs ml-2 flex-shrink-0">{med.duration}</Badge>
                                  </div>
                                  <div className="space-y-0.5 text-xs">
                                    <p className="text-gray-300"><span className="font-medium">Posologie:</span> {med.frequency}</p>
                                    {med.instructions && (
                                      <p className="text-gray-400">
                                        <AlertCircle className="h-3 w-3 inline mr-1" />
                                        {med.instructions}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Actions pharmacie */}
                            <div className="mb-3">
                              <Button
                                onClick={() => handleSendToPharmacy(prescription.id)}
                                className="w-full bg-gradient-to-r from-[#00d4ff] to-[#0088ff] hover:opacity-90 text-white"
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Envoyer à une pharmacie
                              </Button>
                            </div>

                            {/* Notes */}
                            {prescription.notes && (
                              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                                <p className="text-xs text-gray-300">
                                  <span className="font-semibold text-white">Note:</span>{" "}
                                  {prescription.notes}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Colonne droite - Miniature A4 (desktop uniquement) */}
                          <div className="hidden lg:block w-64 flex-shrink-0">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden aspect-[1/1.414] relative">
                              <div className="absolute inset-0 p-4 overflow-hidden text-[6px] leading-tight">
                                {/* En-tête */}
                                <div className="text-center mb-2 pb-1 border-b border-gray-300">
                                  <h2 className="font-bold text-gray-800 text-[8px]">ORDONNANCE MÉDICALE</h2>
                                  <p className="text-gray-600 text-[5px]">République Gabonaise</p>
                                </div>

                                {/* Médecin */}
                                <div className="mb-2">
                                  <p className="font-bold text-gray-800 text-[6px]">{prescription.doctor}</p>
                                  <p className="text-gray-600 text-[5px]">{prescription.specialty}</p>
                                  <p className="text-gray-600 text-[5px]">N°: {prescription.id}</p>
                                </div>

                                {/* Dates */}
                                <div className="flex justify-between text-[5px] mb-2 pb-1 border-b border-gray-200">
                                  <span className="text-gray-600">Date: {prescription.date}</span>
                                  <span className="text-gray-600">Valable: {prescription.validUntil}</span>
                                </div>

                                {/* Médicaments */}
                                <div className="mb-2">
                                  <h3 className="font-bold text-gray-800 text-[6px] mb-1">MÉDICAMENTS</h3>
                                  {prescription.medications.map((med, index) => (
                                    <div key={index} className="mb-1.5 pl-2 border-l-2 border-[#ff0088]">
                                      <p className="font-semibold text-gray-800 text-[5px]">{index + 1}. {med.name}</p>
                                      <p className="text-gray-600 text-[4px]">{med.dosage}</p>
                                      <p className="text-gray-600 text-[4px]">{med.frequency}</p>
                                      <p className="text-gray-600 text-[4px]">{med.duration}</p>
                                    </div>
                                  ))}
                                </div>

                                {/* Notes */}
                                {prescription.notes && (
                                  <div className="bg-blue-50 p-1 rounded text-[4px] mb-2">
                                    <p className="text-gray-700">{prescription.notes}</p>
                                  </div>
                                )}

                                {/* Actions desktop */}
                                <div className="absolute bottom-2 right-2 flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setPreviewPrescription(prescription)}
                                    className="text-[#ff0088] hover:text-[#ff0088] hover:bg-[#ff0088]/10 h-6 w-6 p-0"
                                    title="Agrandir"
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleShare(prescription.id)}
                                    className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 h-6 w-6 p-0"
                                    title="Partager"
                                  >
                                    <Share2 className="h-3 w-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleDownload(prescription.id)}
                                    className="text-[#00d4ff] hover:text-[#00d4ff] hover:bg-[#00d4ff]/10 h-6 w-6 p-0"
                                    title="Télécharger"
                                  >
                                    <Download className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Modal de prévisualisation */}
      <Dialog open={!!previewPrescription} onOpenChange={() => setPreviewPrescription(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1f2e] border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Aperçu de l'ordonnance</DialogTitle>
          </DialogHeader>
          
          {previewPrescription && (
            <div className="space-y-4">
              {/* En-tête ordonnance */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="text-center mb-6 pb-4 border-b-2 border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">ORDONNANCE MÉDICALE</h2>
                  <p className="text-sm text-gray-600">République Gabonaise - Ministère de la Santé</p>
                </div>

                {/* Informations médecin */}
                <div className="mb-6">
                  <p className="font-bold text-gray-800">{previewPrescription.doctor}</p>
                  <p className="text-sm text-gray-600">{previewPrescription.specialty}</p>
                  <p className="text-sm text-gray-600">N° d'ordre: {previewPrescription.id}</p>
                </div>

                {/* Date et validité */}
                <div className="flex justify-between text-sm mb-6 pb-4 border-b border-gray-200">
                  <p className="text-gray-600">Date: <span className="font-medium text-gray-800">{previewPrescription.date}</span></p>
                  <p className="text-gray-600">Valable jusqu'au: <span className="font-medium text-gray-800">{previewPrescription.validUntil}</span></p>
                </div>

                {/* Médicaments */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-800 mb-3">MÉDICAMENTS PRESCRITS</h3>
                  {previewPrescription.medications.map((med, index) => (
                    <div key={index} className="mb-4 pl-4 border-l-2 border-[#ff0088]">
                      <p className="font-semibold text-gray-800">{index + 1}. {med.name}</p>
                      <p className="text-sm text-gray-600">Dosage: {med.dosage}</p>
                      <p className="text-sm text-gray-600">Posologie: {med.frequency}</p>
                      <p className="text-sm text-gray-600">Durée: {med.duration}</p>
                      {med.instructions && (
                        <p className="text-sm text-gray-600 italic mt-1">→ {med.instructions}</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* Notes */}
                {previewPrescription.notes && (
                  <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-500 mb-6">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Note du médecin:</span> {previewPrescription.notes}
                    </p>
                  </div>
                )}

                {/* Signature */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-right">
                  <p className="text-sm text-gray-600 mb-4">Signature et cachet du médecin</p>
                  <div className="h-16"></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => handleShare(previewPrescription.id)}
                  className="border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Partager
                </Button>
                <Button 
                  onClick={() => handleDownload(previewPrescription.id)}
                  className="bg-[#00d4ff] hover:bg-[#00d4ff]/80 text-white"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal envoi pharmacie */}
      {selectedPrescriptionId && (
        <SendToPharmacyModal
          open={sendToPharmacyOpen}
          onOpenChange={setSendToPharmacyOpen}
          prescriptionId={selectedPrescriptionId}
        />
      )}
    </div>
  );
}
