import { useState } from "react";
import { FileText, Search, Filter, Calendar, User, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationDetailsModal } from "@/components/medical/ConsultationDetailsModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";

export default function ProfessionalConsultations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

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

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
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
          <Card className="glass-card">
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
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ce mois</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Calendar className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ordonnances émises</p>
                  <p className="text-2xl font-bold">134</p>
                </div>
                <Pill className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Patients uniques</p>
                  <p className="text-2xl font-bold">89</p>
                </div>
                <User className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recherche et filtres */}
        <Card className="glass-card">
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
    </PatientDashboardLayout>
  );
}
