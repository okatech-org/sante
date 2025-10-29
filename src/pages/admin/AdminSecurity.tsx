import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, AlertTriangle, Activity, Lock, Eye, UserX } from "lucide-react";

export default function AdminSecurity() {
  const auditLogs = [
    { id: "1", action: "Login", user: "superadmin@sante.ga", ip: "192.168.1.100", status: "success", risk: "low", time: "Il y a 5 min" },
    { id: "2", action: "Suspend User", user: "admin@sante.ga", ip: "192.168.1.101", status: "success", risk: "high", time: "Il y a 15 min" },
    { id: "3", action: "Login Failed", user: "unknown@test.com", ip: "45.67.89.123", status: "failure", risk: "medium", time: "Il y a 20 min" },
    { id: "4", action: "API Key Created", user: "admin@sante.ga", ip: "192.168.1.101", status: "success", risk: "medium", time: "Il y a 1h" },
  ];

  const stats = { incidents24h: 0, failedLogins: 23, suspiciousIPs: 2, activeAlerts: 0 };

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sécurité & Audit</h1>
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{stats.incidents24h}</div><p className="text-xs text-muted-foreground mt-1">Incidents</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.failedLogins}</div><p className="text-xs text-muted-foreground mt-1">Échecs login</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{stats.suspiciousIPs}</div><p className="text-xs text-muted-foreground mt-1">IPs suspectes</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{stats.activeAlerts}</div><p className="text-xs text-muted-foreground mt-1">Alertes actives</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Logs d'Audit</CardTitle><CardDescription>Toutes les actions critiques</CardDescription></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Risque</TableHead>
                  <TableHead>Horodatage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell className="font-mono text-xs">{log.ip}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={log.status === "success" ? "bg-green-500/20 text-green-700" : "bg-red-500/20 text-red-700"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={log.risk === "low" ? "bg-blue-500/20" : log.risk === "medium" ? "bg-orange-500/20" : "bg-red-500/20"}>
                        {log.risk}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </SuperAdminLayoutSimple>
  );
}
