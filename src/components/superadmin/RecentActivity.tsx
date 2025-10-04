import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Video, DollarSign, AlertTriangle, UserPlus } from "lucide-react";

const activities = [
  {
    time: "Il y a 2 min",
    event: "Nouveau médecin inscrit",
    user: "Dr. Ondo - Cardiologie",
    type: "provider",
    icon: Building2
  },
  {
    time: "Il y a 5 min",
    event: "Téléconsultation terminée",
    user: "Patient #8472 → Dr. Ekomi",
    type: "consultation",
    icon: Video
  },
  {
    time: "Il y a 8 min",
    event: "Paiement CNAMGS validé",
    user: "12,500 FCFA - Facture #4782",
    type: "payment",
    icon: DollarSign
  },
  {
    time: "Il y a 12 min",
    event: "Alerte système résolue",
    user: "WebRTC Server - Latence haute",
    type: "alert",
    icon: AlertTriangle
  },
  {
    time: "Il y a 15 min",
    event: "Nouveau patient inscrit",
    user: "Jean Mbadinga - Libreville",
    type: "user",
    icon: UserPlus
  }
];

const getTypeColor = (type: string) => {
  switch (type) {
    case "provider":
      return "text-blue-400";
    case "consultation":
      return "text-green-400";
    case "payment":
      return "text-yellow-400";
    case "alert":
      return "text-red-400";
    case "user":
      return "text-purple-400";
    default:
      return "text-muted-foreground";
  }
};

export function RecentActivity() {
  return (
    <Card className="bg-card/40 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground">Activité Récente</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className={`p-2 rounded-lg bg-background/30 ${getTypeColor(activity.type)}`}>
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.event}</p>
                <p className="text-xs text-muted-foreground truncate">{activity.user}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
