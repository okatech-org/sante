import { useState, useEffect } from "react";
import { Video, Clock, Users, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { TeleconsultationsStats } from "@/components/professional/TeleconsultationsStats";

export default function ProfessionalTeleconsultations() {
  useEffect(() => {
    document.title = "Téléconsultations | Espace Professionnel - SANTE.GA";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Téléconsultations à distance via WebRTC, gestion des sessions vidéo et suivi patients.";
    if (meta) {
      meta.setAttribute("content", content);
    } else {
      const m = document.createElement("meta");
      m.name = "description";
      m.content = content;
      document.head.appendChild(m);
    }
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', window.location.origin + '/professional/teleconsultations');
  }, []);

  const upcomingConsultations = [
    {
      id: 1,
      time: "09:30",
      date: "2025-02-05",
      patient: "Jean NZENGUE",
      reason: "Suivi hypertension",
      status: "confirmé",
      cnamgs: "GAB987654321"
    },
    {
      id: 2,
      time: "14:00",
      date: "2025-02-05",
      patient: "Alice MEZUI",
      reason: "Consultation dermatologie",
      status: "en_attente",
      cnamgs: "GAB456123789"
    }
  ];

  const completedConsultations = [
    {
      id: 3,
      time: "10:00",
      date: "2025-02-01",
      patient: "Marie MOUSSAVOU",
      reason: "Contrôle diabète",
      duration: "25 min",
      prescription: true
    },
    {
      id: 4,
      time: "15:30",
      date: "2025-01-30",
      patient: "Paul MINTSA",
      reason: "Consultation générale",
      duration: "20 min",
      prescription: false
    }
  ];

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Téléconsultations</h1>
          <p className="text-muted-foreground">Consultations à distance via WebRTC</p>
        </div>
        <Button>
          <Video className="mr-2 h-4 w-4" />
          Démarrer une session
        </Button>
      </div>

        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <TeleconsultationsStats today={5} month={45} avgDuration="22min" satisfaction="4.8/5" />
        </div>

        <Card className="border-primary/50 rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Salle d'attente virtuelle
          </CardTitle>
          <CardDescription>Patients en attente de connexion</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Aucun patient en attente actuellement</p>
          </div>
        </CardContent>
      </Card>

        <Card className="rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
        <CardHeader>
          <CardTitle>Mes téléconsultations</CardTitle>
          <CardDescription>Historique et consultations à venir</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList>
              <TabsTrigger value="upcoming">À venir ({upcomingConsultations.length})</TabsTrigger>
              <TabsTrigger value="completed">Terminées</TabsTrigger>
              <TabsTrigger value="cancelled">Annulées</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-3 mt-4">
              {upcomingConsultations.map((consult) => (
                <div key={consult.id} className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                      <div className="flex gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center min-w-[80px]">
                          <Clock className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-semibold text-sm">{consult.time}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(consult.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{consult.patient}</h4>
                            <Badge variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Téléconsultation
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{consult.reason}</p>
                          {consult.cnamgs && (
                            <p className="text-xs text-muted-foreground">CNAMGS: {consult.cnamgs}</p>
                          )}
                        </div>
                      </div>
                      <Button>
                        <Video className="mr-2 h-4 w-4" />
                        Rejoindre
                      </Button>
                    </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-4">
              {completedConsultations.map((consult) => (
                <div key={consult.id} className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className="flex flex-col items-center justify-center min-w-[80px]">
                        <CheckCircle className="h-4 w-4 text-green-500 mb-1" />
                        <span className="font-semibold text-sm">{consult.time}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(consult.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{consult.patient}</h4>
                          {consult.prescription && (
                            <Badge variant="outline" className="text-xs">Ordonnance émise</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{consult.reason}</p>
                        <p className="text-xs text-muted-foreground">Durée: {consult.duration}</p>
                      </div>
                    </div>
                    <Button variant="outline">Voir détails</Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="mt-4">
              <div className="text-center py-8 text-muted-foreground">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Aucune téléconsultation annulée</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      </div>
    </PatientDashboardLayout>
  );
}
