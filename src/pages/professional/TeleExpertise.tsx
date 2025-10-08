import { Stethoscope, Video, FileText, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProfessionalTeleExpertise() {
  const requests = [
    {
      id: 1,
      from: "Dr MOUSSAVOU - CHR Mouila",
      specialty: "Cardiologie",
      urgency: "modérée",
      patient: "Anonymisé-2025-001",
      date: "2025-02-05"
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Télé-expertise</h1>
          <p className="text-muted-foreground">Collaboration interprovinciale</p>
        </div>
        <Button>
          <Video className="mr-2 h-4 w-4" />
          Demander un avis
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Demandes reçues</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avis donnés</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Temps moyen</p>
                <p className="text-2xl font-bold">2h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes en cours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{req.from}</h4>
                    <p className="text-sm text-muted-foreground">{req.specialty}</p>
                    <Badge className="mt-2">{req.urgency}</Badge>
                  </div>
                  <Button>Voir le cas</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
