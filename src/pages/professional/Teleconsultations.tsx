import { useState } from "react";
import { Video, Clock, Users, CheckCircle, XCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProfessionalTeleconsultations() {
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
    <div className="container mx-auto p-6 space-y-6">
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

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aujourd'hui</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Video className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ce mois</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Durée moyenne</p>
                <p className="text-2xl font-bold">22min</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taux satisfaction</p>
                <p className="text-2xl font-bold">4.8/5</p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salle d'attente virtuelle */}
      <Card className="border-primary/50">
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

      {/* Liste des téléconsultations */}
      <Card>
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
                <Card key={consult.id} className="hover:bg-muted/50 transition-colors">
                  <CardContent className="p-4">
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
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="space-y-3 mt-4">
              {completedConsultations.map((consult) => (
                <Card key={consult.id} className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
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
                  </CardContent>
                </Card>
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
  );
}
