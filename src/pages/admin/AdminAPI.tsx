import { useState } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Globe, Key, Plus, Eye, Ban, Copy, CheckCircle, AlertCircle, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function AdminAPI() {
  const apiKeys = [
    { id: "1", name: "CNAMGS Integration", key: "sk_live_***************", owner: "Système", scopes: ["cnamgs:read", "cnamgs:write"], calls: 125634, status: "active", created: "2023-01-15" },
    { id: "2", name: "Mobile App API", key: "sk_live_***************", owner: "App Mobile", scopes: ["users:read", "appointments:write"], calls: 89234, status: "active", created: "2023-03-20" },
    { id: "3", name: "CHU Libreville", key: "sk_live_***************", owner: "CHU Libreville", scopes: ["consultations:write"], calls: 45678, status: "active", created: "2023-06-10" },
    { id: "4", name: "Dev Environment", key: "sk_test_***************", owner: "Dev Team", scopes: ["*:*"], calls: 1234, status: "revoked", created: "2024-01-05" }
  ];

  const integrations = [
    { name: "CNAMGS", status: "connected", uptime: 99.8, lastSync: "Il y a 2 min", endpoint: "https://api.cnamgs.ga" },
    { name: "CNSS", status: "connected", uptime: 99.5, lastSync: "Il y a 5 min", endpoint: "https://api.cnss.ga" },
    { name: "CNOM", status: "connected", uptime: 98.9, lastSync: "Il y a 10 min", endpoint: "https://api.cnom.ga" },
    { name: "Mobile Money", status: "connected", uptime: 99.9, lastSync: "Il y a 1 min", endpoint: "https://api.mobilemoney.ga" }
  ];

  const stats = {
    totalKeys: 24,
    activeKeys: 21,
    revokedKeys: 3,
    totalCalls24h: 125634,
    errorRate: 0.3,
    avgResponseTime: 145
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            API & Intégrations
          </h1>
          <p className="text-muted-foreground mt-2">
            Gestion des clés API et intégrations externes
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.totalKeys}</div><p className="text-xs text-muted-foreground mt-1">Clés API</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{stats.activeKeys}</div><p className="text-xs text-muted-foreground mt-1">Actives</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{(stats.totalCalls24h / 1000).toFixed(1)}K</div><p className="text-xs text-muted-foreground mt-1">Appels 24h</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.avgResponseTime}ms</div><p className="text-xs text-muted-foreground mt-1">Temps réponse</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{stats.errorRate}%</div><p className="text-xs text-muted-foreground mt-1">Taux erreur</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">4</div><p className="text-xs text-muted-foreground mt-1">Intégrations</p></CardContent></Card>
        </div>

        {/* Intégrations externes */}
        <Card>
          <CardHeader>
            <CardTitle>Intégrations Externes</CardTitle>
            <CardDescription>Connexions aux services tiers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {integrations.map((int, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-primary" />
                    <div>
                      <p className="font-medium">{int.name}</p>
                      <p className="text-xs text-muted-foreground">{int.endpoint}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">{int.uptime}% uptime</p>
                      <p className="text-xs text-muted-foreground">{int.lastSync}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {int.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Clés API */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Clés API</CardTitle>
                <CardDescription>Gestion des accès API</CardDescription>
              </div>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle clé
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Clé</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Appels 24h</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell className="font-mono text-xs">{key.key}</TableCell>
                    <TableCell>{key.owner}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {key.scopes.slice(0, 2).map((scope, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{scope}</Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>{key.calls.toLocaleString()}</TableCell>
                    <TableCell>
                      {key.status === "active" ? (
                        <Badge variant="outline" className="bg-green-500/20 text-green-700 border-green-500/30">Actif</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-500/20 text-red-700 border-red-500/30">Révoqué</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button>
                        {key.status === "active" && <Button variant="ghost" size="sm"><Ban className="w-4 h-4 text-red-600" /></Button>}
                      </div>
                    </TableCell>
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
