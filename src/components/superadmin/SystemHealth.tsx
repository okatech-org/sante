import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server, Database, Video, HardDrive } from "lucide-react";

const services = [
  {
    name: "API Gateway",
    status: "operational",
    uptime: "99.98%",
    responseTime: "45ms",
    icon: Server
  },
  {
    name: "Database Primary",
    status: "operational",
    uptime: "99.99%",
    responseTime: "12ms",
    icon: Database
  },
  {
    name: "WebRTC Server",
    status: "degraded",
    uptime: "98.45%",
    responseTime: "89ms",
    icon: Video
  },
  {
    name: "Storage Service",
    status: "operational",
    uptime: "100%",
    responseTime: "23ms",
    icon: HardDrive
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "operational":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "degraded":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "outage":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export function SystemHealth() {
  return (
    <Card className="bg-card/40 backdrop-blur-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-foreground flex items-center gap-2">
          <Server className="h-5 w-5" />
          Santé du Système
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-background/30 rounded-lg border border-border/30">
              <div className="flex items-center gap-3">
                <service.icon className="h-5 w-5 text-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">{service.name}</p>
                  <p className="text-xs text-muted-foreground">Réponse: {service.responseTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground">{service.uptime}</span>
                <Badge className={getStatusColor(service.status)}>
                  {service.status === "operational" ? "Opérationnel" : "Dégradé"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
