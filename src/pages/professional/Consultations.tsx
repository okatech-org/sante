import { useState } from "react";
import { FileText, Search, Filter, Calendar, User, Pill, LayoutDashboard, Users, Video, Stethoscope, ClipboardList, DollarSign, BarChart3, MessageSquare, Network, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationDetailsModal } from "@/components/medical/ConsultationDetailsModal";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { QuickActionCard } from "@/components/dashboard/patient/QuickActionCard";

export default function ProfessionalConsultations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const navigate = useNavigate();

  const consultations = [
    {
      id: 1,
      date: "2025-02-01",
      time: "10:00",
      patient: "Marie MOUSSAVOU",
      type: "Consultation de suivi",
      diagnosis: "Diabète Type 2 - Contrôle glycémique",
      prescription: true,
      examens: ["Glycémie à jeun", "HbA1c"],
      notes: "Patient bien équilibré, poursuivre le traitement actuel",
      nextVisit: "2025-03-01"
    },
    {
      id: 2,
      date: "2025-02-01",
      time: "11:30",
      patient: "Jean NZENGUE",
      type: "Téléconsultation",
      diagnosis: "Hypertension artérielle - Suivi",
      prescription: true,
      examens: [],
      notes: "TA bien contrôlée sous traitement",
      nextVisit: "2025-02-15"
    },
    {
      id: 3,
      date: "2025-01-30",
      time: "09:00",
      patient: "Claire OBAME",
      type: "Consultation initiale",
      diagnosis: "Gastrite aiguë",
      prescription: true,
      examens: ["Fibroscopie recommandée"],
      notes: "IPP prescrit pour 4 semaines",
      nextVisit: null
    }
  ];

  const menuItems = [
    { icon: LayoutDashboard, title: "Tableau de bord", route: "/professional/dashboard" },
    { icon: Calendar, title: "Agenda & RDV", route: "/professional/agenda", badge: "8" },
    { icon: Users, title: "Mes patients", route: "/professional/patients" },
    { icon: Video, title: "Téléconsultations", route: "/professional/teleconsultations" },
    { icon: Stethoscope, title: "Consultations", route: "/professional/consultations" },
    { icon: ClipboardList, title: "Prescriptions", route: "/professional/prescriptions" },
    { icon: DollarSign, title: "Finances & CNAMGS", route: "/professional/finances" },
    { icon: BarChart3, title: "Statistiques", route: "/professional/statistics" },
    { icon: MessageSquare, title: "Messages", route: "/professional/messages", badge: "5" },
    { icon: Network, title: "Télé-expertise", route: "/professional/tele-expertise" },
    { icon: Settings, title: "Paramètres", route: "/professional/settings" },
  ];

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-background to-muted/20">
      {/* Glassmorphic Sidebar - Hidden on mobile */}
      <aside className="hidden md:block w-80 border-r border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        <div className="p-6 space-y-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Menu Professionnel
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Accès rapide</p>
          </div>
          
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <QuickActionCard
                key={index}
                icon={item.icon}
                title={item.title}
                badge={item.badge}
                onClick={() => navigate(item.route)}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto p-6 space-y-6">
          <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Consultations</h1>
          <p className="text-muted-foreground">Historique des consultations effectuées</p>
        </div>
        <Button>
          <FileText className="mr-2 h-4 w-4" />
          Nouvelle Consultation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ce mois</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ordonnances émises</p>
                <p className="text-2xl font-bold">134</p>
              </div>
              <Pill className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Patients uniques</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <User className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recherche et filtres */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par patient, diagnostic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="today">Aujourd'hui</TabsTrigger>
              <TabsTrigger value="week">Cette semaine</TabsTrigger>
              <TabsTrigger value="month">Ce mois</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-3 mt-4">
              {consultations.map((consultation) => (
                <Card 
                  key={consultation.id} 
                  className="hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedConsultation(consultation)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center min-w-[80px]">
                          <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-semibold text-sm">{consultation.time}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(consultation.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{consultation.patient}</h4>
                            <Badge variant="outline">{consultation.type}</Badge>
                            {consultation.prescription && (
                              <Badge className="bg-green-500/10 text-green-500">
                                <Pill className="h-3 w-3 mr-1" />
                                Ordonnance
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground mb-1">{consultation.diagnosis}</p>
                          <p className="text-sm text-muted-foreground">{consultation.notes}</p>
                          {consultation.nextVisit && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Prochain RDV: {new Date(consultation.nextVisit).toLocaleDateString('fr-FR')}
                            </p>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Voir détails
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

        {selectedConsultation && (
          <ConsultationDetailsModal
            open={!!selectedConsultation}
            onOpenChange={(open) => !open && setSelectedConsultation(null)}
            consultation={selectedConsultation}
          />
        )}
        </div>
      </div>
    </div>
  );
}
