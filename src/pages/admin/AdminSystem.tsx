import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Server, Database, HardDrive, Cpu, Activity, AlertTriangle, Download, RefreshCw, Settings } from "lucide-react";

export default function AdminSystem() {
  const systemHealth = {
    database: { status: "healthy", uptime: 99.99, responseTime: 12, usage: 45 },
    api: { status: "healthy", uptime: 99.95, responseTime: 145, errorRate: 0.3 },
    storage: { status: "warning", uptime: 100, usage: 78, total: 1000, used: 780 },
    cache: { status: "healthy", uptime: 99.98, responseTime: 2, usage: 34 }
  };

  const backups = [
    { id: "1", date: "2025-01-29 02:00", type: "Full", size: "234 GB", status: "success" },
    { id: "2", date: "2025-01-28 02:00", type: "Full", size: "232 GB", status: "success" },
    { id: "3", date: "2025-01-27 02:00", type: "Full", size: "230 GB", status: "success" }
  ];

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Système & Configuration</h1>
          <Button variant="destructive" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Mode Urgence
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(systemHealth).map(([key, health]) => (
            <Card key={key}>
              <CardHeader>
                <CardTitle className="text-sm capitalize">{key}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline" className={health.status === "healthy" ? "bg-green-500/20 text-green-700" : "bg-orange-500/20 text-orange-700"}>
                  {health.status}
                </Badge>
                {health.responseTime && <div className="text-xs"><span className="font-medium">Temps:</span> {health.responseTime}ms</div>}
                {health.usage && (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Utilisation</span>
                      <span className="font-medium">{health.usage}%</span>
                    </div>
                    <Progress value={health.usage} className="h-1" />
                  </div>
                )}
                <div className="text-xs text-muted-foreground">Uptime: {health.uptime}%</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Sauvegardes</CardTitle>
                <CardDescription>Backups automatiques quotidiens</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Nouveau backup
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div key={backup.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Database className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{backup.type} Backup</p>
                      <p className="text-xs text-muted-foreground">{backup.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{backup.size}</span>
                    <Badge variant="outline" className="bg-green-500/20 text-green-700">Success</Badge>
                    <Button variant="ghost" size="sm"><Download className="w-4 h-4" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configuration Système</CardTitle>
            <CardDescription>Paramètres avancés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Settings className="w-4 h-4" />
                Variables d'environnement
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Database className="w-4 h-4" />
                Configuration base de données
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Server className="w-4 h-4" />
                Paramètres serveur
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayoutSimple>
  );
}
