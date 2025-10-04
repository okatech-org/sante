
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FileText, Calendar, User, Heart, Activity, Pill, Download, Share2 } from "lucide-react";

export default function MedicalRecord() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mon Dossier Médical</h1>
            <p className="text-muted-foreground mt-2">
              Accédez à l'historique complet de votre parcours de santé
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button>
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
                <p className="text-sm text-muted-foreground">Informations</p>
                <p className="text-2xl font-bold">Patient</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Consultations</p>
                <p className="text-2xl font-bold">24</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documents</p>
                <p className="text-2xl font-bold">156</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Antécédents Médicaux</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Hypertension artérielle</p>
                  <p className="text-sm text-muted-foreground">Diagnostiqué en 2018</p>
                </div>
                <Badge>Chronique</Badge>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Diabète type 2</p>
                  <p className="text-sm text-muted-foreground">Diagnostiqué en 2020</p>
                </div>
                <Badge variant="destructive">Actif</Badge>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Allergie pénicilline</p>
                  <p className="text-sm text-muted-foreground">Déclaré en 2015</p>
                </div>
                <Badge variant="outline">Allergie</Badge>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Traitements en Cours</h2>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Lisinopril 10mg</p>
                  <p className="text-sm text-muted-foreground">1 comprimé/jour le matin</p>
                </div>
                <Badge className="bg-green-600">Actif</Badge>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Metformine 500mg</p>
                  <p className="text-sm text-muted-foreground">2 fois/jour aux repas</p>
                </div>
                <Badge className="bg-green-600">Actif</Badge>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium">Aspirine 100mg</p>
                  <p className="text-sm text-muted-foreground">1 comprimé/jour</p>
                </div>
                <Badge className="bg-green-600">Actif</Badge>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Historique des Consultations</h2>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-4">
            {[
              { date: "15/12/2024", type: "Consultation généraliste", medecin: "Dr. Mbina", motif: "Contrôle tension" },
              { date: "03/11/2024", type: "Analyse de sang", medecin: "Laboratoire Biolab", motif: "Bilan diabète" },
              { date: "20/10/2024", type: "Consultation cardiologie", medecin: "Dr. Ondo", motif: "ECG de contrôle" },
              { date: "05/09/2024", type: "Consultation généraliste", medecin: "Dr. Nzamba", motif: "Renouvellement ordonnance" },
            ].map((consultation, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{consultation.date}</span>
                    <Badge variant="outline">{consultation.type}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{consultation.medecin}</p>
                  <p className="text-sm mt-1">{consultation.motif}</p>
                </div>
                <Button variant="ghost" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Voir
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
