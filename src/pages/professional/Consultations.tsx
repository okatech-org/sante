import { useState, useEffect } from "react";
import { FileText, Search, Filter, Calendar, User, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationDetailsModal } from "@/components/medical/ConsultationDetailsModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { ConsultationListItem } from "@/components/professional/ConsultationListItem";
import { ConsultationsStats } from "@/components/professional/ConsultationsStats";

export default function ProfessionalConsultations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);

  useEffect(() => {
    document.title = "Consultations | Espace Professionnel - SANTE.GA";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Historique des consultations, filtres et accès rapide pour les professionnels de santé.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
    // Canonical
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.origin + '/professional/consultations');
  }, []);
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
        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <ConsultationsStats today={12} month={156} prescriptions={134} uniquePatients={89} />
        </div>

        {/* Recherche et filtres */}
        <Card className="rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
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
                <ConsultationListItem
                  key={consultation.id}
                  consultation={consultation as any}
                  onSelect={() => setSelectedConsultation(consultation)}
                />
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
