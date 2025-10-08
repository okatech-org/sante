import { useEffect } from "react";
import { Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import { TeleExpertiseStats } from "@/components/professional/TeleExpertiseStats";

export default function ProfessionalTeleExpertise() {
  useEffect(() => {
    document.title = "Télé-expertise | Espace Professionnel - SANTE.GA";
    const meta = document.querySelector('meta[name="description"]');
    const content = "Collaboration interprovinciale entre professionnels de santé, demandes d'avis spécialisés.";
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
    link.setAttribute('href', window.location.origin + '/professional/tele-expertise');
  }, []);

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
    <PatientDashboardLayout>
      <div className="space-y-6">
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

        <div className="rounded-xl backdrop-blur-xl p-4 sm:p-6 bg-card/80 border border-border shadow-xl">
          <TeleExpertiseStats received={3} given={12} avgTime="2h" />
        </div>

      <Card className="rounded-xl backdrop-blur-xl bg-card/80 border border-border shadow-xl">
        <CardHeader>
          <CardTitle>Demandes en cours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {requests.map((req) => (
            <div key={req.id} className="p-4 rounded-xl bg-card/80 border border-border shadow-sm hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{req.from}</h4>
                    <p className="text-sm text-muted-foreground">{req.specialty}</p>
                    <Badge className="mt-2">{req.urgency}</Badge>
                  </div>
                  <Button>Voir le cas</Button>
                </div>
              </div>
          ))}
        </CardContent>
      </Card>
      </div>
    </PatientDashboardLayout>
  );
}
