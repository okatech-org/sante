import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Video, Calendar, Clock, User, Building2,
  Plus, Phone, MessageSquare, Monitor, Info
} from "lucide-react";

export default function Teleconsultation() {
  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Video className="w-6 h-6 text-primary" />
            Téléconsultation
          </h1>
          <p className="text-muted-foreground">Consultez un médecin en ligne depuis chez vous</p>
        </div>

        {/* Info Banner */}
        <Card className="border-primary/20 bg-primary/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Service de téléconsultation disponible</h3>
                <p className="text-sm text-muted-foreground">
                  Prenez rendez-vous avec nos médecins partenaires pour une consultation vidéo sécurisée.
                  Disponible 7j/7 de 7h à 22h.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                  <Video className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">Consultation Vidéo</h3>
                <p className="text-sm text-muted-foreground">Consultation en face à face par vidéo</p>
                <Button className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Réserver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
                  <Phone className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold">Appel Audio</h3>
                <p className="text-sm text-muted-foreground">Consultation téléphonique</p>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Réserver
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto">
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">Chat Médical</h3>
                <p className="text-sm text-muted-foreground">Discussion par messagerie</p>
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Démarrer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Médecins disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Médecins disponibles maintenant</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Dr. Marie OKEMBA", specialty: "Médecine Générale", available: true },
                { name: "Dr. Paul NGUEMA", specialty: "Urgences", available: true },
                { name: "Dr. Léa Mbina", specialty: "Cardiologie", available: false }
              ].map((doctor, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{doctor.name}</h4>
                      <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={doctor.available ? "default" : "secondary"}>
                      {doctor.available ? "Disponible" : "Occupé"}
                    </Badge>
                    {doctor.available && (
                      <Button size="sm">
                        <Video className="w-4 h-4 mr-2" />
                        Consulter
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comment ça marche */}
        <Card>
          <CardHeader>
            <CardTitle>Comment ça marche ?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { icon: Calendar, title: "1. Réservez", desc: "Choisissez votre créneau" },
                { icon: Clock, title: "2. Préparez", desc: "10min avant l'heure" },
                { icon: Monitor, title: "3. Connectez", desc: "Rejoignez la consultation" },
                { icon: FileText, title: "4. Recevez", desc: "Ordonnance si nécessaire" }
              ].map((step, idx) => (
                <div key={idx} className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientDashboardLayout>
  );
}