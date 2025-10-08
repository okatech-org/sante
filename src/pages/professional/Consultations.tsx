import { useState, useEffect } from "react";
import { FileText, Search, Filter, Calendar, User, Pill, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConsultationDetailsModal } from "@/components/medical/ConsultationDetailsModal";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { ConsultationListItem } from "@/components/professional/ConsultationListItem";
import { ConsultationsStats } from "@/components/professional/ConsultationsStats";
import { useConsultations } from "@/hooks/useConsultations";

export default function ProfessionalConsultations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const { consultations, stats, loading, error } = useConsultations();


  if (loading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </PatientDashboardLayout>
    );
  }

  if (error) {
    return (
      <PatientDashboardLayout>
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </PatientDashboardLayout>
    );
  }

  const filteredConsultations = searchQuery
    ? consultations.filter(
        (c) =>
          c.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.diagnosis && c.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : consultations;

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
          <ConsultationsStats 
            today={stats.today} 
            month={stats.month} 
            prescriptions={stats.prescriptions} 
            uniquePatients={stats.uniquePatients} 
          />
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
              {filteredConsultations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucune consultation trouvée</p>
                </div>
              ) : (
                filteredConsultations.map((consultation) => (
                <ConsultationListItem
                  key={consultation.id}
                  consultation={consultation as any}
                  onSelect={() => setSelectedConsultation(consultation)}
                />
                ))
              )}
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
