import { SogaraDashboardLayout } from "@/components/layout/SogaraDashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserCheck, Search, Plus, Users, Award, Calendar, Mail, Phone
} from "lucide-react";
import { useState } from "react";

export default function SogaraStaff() {
  const [searchQuery, setSearchQuery] = useState("");

  const stats = {
    totalStaff: 52,
    doctors: 12,
    nurses: 28,
    administrative: 12
  };

  const staff = [
    { id: 1, name: "Dr. Marie Okemba", role: "Médecin", department: "Médecine Générale", status: "active", phone: "+241 XX XX XX XX" },
    { id: 2, name: "Dr. Paul Nguema", role: "Médecin", department: "Urgences", status: "active", phone: "+241 XX XX XX XX" },
    { id: 3, name: "Sylvie Mba", role: "Infirmière", department: "Soins Intensifs", status: "active", phone: "+241 XX XX XX XX" },
    { id: 4, name: "Patricia Nze", role: "Infirmière", department: "Urgences", status: "active", phone: "+241 XX XX XX XX" },
    { id: 5, name: "André Moussavou", role: "Technicien", department: "Laboratoire", status: "active", phone: "+241 XX XX XX XX" },
  ];

  return (
    <SogaraDashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <UserCheck className="w-8 h-8 text-primary" />
              Personnel Médical
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion du personnel du CMST SOGARA
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Ajouter du personnel
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Personnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStaff}</div>
              <p className="text-xs text-muted-foreground mt-1">Membres actifs</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Médecins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.doctors}</div>
              <p className="text-xs text-muted-foreground mt-1">Toutes spécialités</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Infirmiers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.nurses}</div>
              <p className="text-xs text-muted-foreground mt-1">Tous services</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Administratif</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.administrative}</div>
              <p className="text-xs text-muted-foreground mt-1">Support</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Liste du Personnel</CardTitle>
            <CardDescription>Personnel médical et administratif du CMST SOGARA</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un membre du personnel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Département</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {staff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.role}</Badge>
                    </TableCell>
                    <TableCell>{member.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {member.phone}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                        Actif
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Calendar className="w-4 h-4 mr-2" />
                        Planning
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Répartition par Département</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Médecine Générale", count: 8 },
                  { name: "Urgences", count: 12 },
                  { name: "Laboratoire", count: 6 },
                  { name: "Administration", count: 12 },
                  { name: "Autres", count: 14 }
                ].map((dept, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">{dept.name}</span>
                      <span className="text-sm font-semibold">{dept.count} personnes</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${(dept.count / stats.totalStaff) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plannings de Garde</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { day: "Lundi", staff: "Dr. Okemba, Infirmières (2)" },
                  { day: "Mardi", staff: "Dr. Nguema, Infirmiers (2)" },
                  { day: "Mercredi", staff: "Dr. Mbina, Infirmières (2)" },
                  { day: "Jeudi", staff: "Dr. Mezui, Infirmiers (2)" }
                ].map((schedule, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{schedule.day}</p>
                      <p className="text-xs text-muted-foreground">{schedule.staff}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Calendar className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SogaraDashboardLayout>
  );
}

