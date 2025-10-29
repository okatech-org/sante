import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, MessageSquare, Clock, CheckCircle, Eye } from "lucide-react";

export default function AdminSupport() {
  const tickets = [
    { id: "TICKET-001", subject: "Impossible de se connecter", user: "jean.mbadinga@email.com", priority: "high", status: "open", created: "Il y a 10 min", category: "technique" },
    { id: "TICKET-002", subject: "Question sur facturation", user: "clinique.mandji@email.com", priority: "medium", status: "in_progress", created: "Il y a 1h", category: "billing" },
    { id: "TICKET-003", subject: "Erreur lors de l'envoi d'ordonnance", user: "pharmacie.grace@email.com", priority: "high", status: "open", created: "Il y a 2h", category: "technical" },
    { id: "TICKET-004", subject: "Demande d'activation compte", user: "dr.okemba@email.com", priority: "low", status: "resolved", created: "Il y a 5h", category: "account" },
  ];

  const stats = { open: 12, inProgress: 8, resolved: 156, avgResponseTime: "2.5h" };

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Support & Tickets</h1>
        <div className="grid grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-orange-600">{stats.open}</div><p className="text-xs text-muted-foreground mt-1">Ouverts</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-blue-600">{stats.inProgress}</div><p className="text-xs text-muted-foreground mt-1">En cours</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-600">{stats.resolved}</div><p className="text-xs text-muted-foreground mt-1">Résolus</p></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{stats.avgResponseTime}</div><p className="text-xs text-muted-foreground mt-1">Temps réponse moyen</p></CardContent></Card>
        </div>
        <Card>
          <CardHeader><CardTitle>Tickets Récents</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-mono text-xs">{ticket.id}</TableCell>
                    <TableCell className="font-medium">{ticket.subject}</TableCell>
                    <TableCell>{ticket.user}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ticket.priority === "high" ? "bg-red-500/20 text-red-700" : ticket.priority === "medium" ? "bg-orange-500/20" : "bg-blue-500/20"}>
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ticket.status === "open" ? "bg-orange-500/20" : ticket.status === "in_progress" ? "bg-blue-500/20" : "bg-green-500/20"}>
                        {ticket.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{ticket.created}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm"><Eye className="w-4 h-4" /></Button>
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
