import { useState } from "react";
import { ProfessionalEstablishmentLayout } from "@/components/layout/ProfessionalEstablishmentLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Briefcase, Search, Calendar, AlertTriangle, CheckCircle,
  Clock, Users, TrendingUp, FileText, Plus, Eye
} from "lucide-react";

export default function SogaraWorkMedicine() {
  const [searchQuery, setSearchQuery] = useState("");

  // Statistiques médecine du travail
  const stats = {
    totalEmployees: 1250,
    examsDue: 23,
    examsThisMonth: 187,
    accidentsThisMonth: 3,
    complianceRate: 94
  };

  // Examens en attente
  const pendingExams = [
    { id: 1, employee: "Jean Mbadinga", matricule: "EMP-1234", type: "Visite périodique", dueDate: "2024-01-25", status: "urgent" },
    { id: 2, employee: "Marie Okemba", matricule: "EMP-2345", type: "Visite d'embauche", dueDate: "2024-01-28", status: "pending" },
    { id: 3, employee: "Paul Nguema", matricule: "EMP-3456", type: "Visite de reprise", dueDate: "2024-01-30", status: "pending" },
  ];

  // Examens récents
  const recentExams = [
    { id: 1, employee: "Sophie Taylor", matricule: "EMP-4567", type: "Visite périodique", date: "2024-01-20", result: "Apte", doctor: "Dr. Okemba" },
    { id: 2, employee: "Marc Dubois", matricule: "EMP-5678", type: "Visite d'embauche", date: "2024-01-19", result: "Apte", doctor: "Dr. Nguema" },
    { id: 3, employee: "Lisa Chen", matricule: "EMP-6789", type: "Visite de reprise", date: "2024-01-18", result: "Apte avec restrictions", doctor: "Dr. Mbina" },
  ];

  return (
    <ProfessionalEstablishmentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-primary" />
              Médecine du Travail
            </h1>
            <p className="text-muted-foreground mt-1">
              Suivi médical réglementaire des employés SOGARA
            </p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Planifier un examen
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalEmployees}</div>
              <p className="text-xs text-muted-foreground mt-1">Sous surveillance</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Examens dus</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.examsDue}</div>
              <p className="text-xs text-muted-foreground mt-1">À planifier</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ce mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.examsThisMonth}</div>
              <Badge className="mt-1 bg-green-500/20 text-green-700 border-green-500/30">
                <TrendingUp className="w-3 h-3 mr-1" />
                +12%
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Accidents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accidentsThisMonth}</div>
              <p className="text-xs text-muted-foreground mt-1">Ce mois</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Conformité</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.complianceRate}%</div>
              <p className="text-xs text-muted-foreground mt-1">Taux global</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              <Clock className="w-4 h-4 mr-2" />
              En attente ({pendingExams.length})
            </TabsTrigger>
            <TabsTrigger value="recent">
              <CheckCircle className="w-4 h-4 mr-2" />
              Examens récents
            </TabsTrigger>
            <TabsTrigger value="statistics">
              <TrendingUp className="w-4 h-4 mr-2" />
              Statistiques
            </TabsTrigger>
          </TabsList>

          {/* Examens en attente */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Examens à planifier</CardTitle>
                <CardDescription>
                  Liste des examens médicaux réglementaires en attente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un employé..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Type d'examen</TableHead>
                      <TableHead>Date limite</TableHead>
                      <TableHead>Priorité</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.employee}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{exam.matricule}</code>
                        </TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            {exam.dueDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {exam.status === 'urgent' ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Urgent
                            </Badge>
                          ) : (
                            <Badge variant="outline">En attente</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            Planifier
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examens récents */}
          <TabsContent value="recent">
            <Card>
              <CardHeader>
                <CardTitle>Examens récents</CardTitle>
                <CardDescription>
                  Derniers examens médicaux effectués
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employé</TableHead>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Type d'examen</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Résultat</TableHead>
                      <TableHead>Médecin</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentExams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell className="font-medium">{exam.employee}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">{exam.matricule}</code>
                        </TableCell>
                        <TableCell>{exam.type}</TableCell>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500/20 text-green-700 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {exam.result}
                          </Badge>
                        </TableCell>
                        <TableCell>{exam.doctor}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Statistiques */}
          <TabsContent value="statistics">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition des examens</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Visites périodiques</span>
                        <span className="text-sm font-semibold">65%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Visites d'embauche</span>
                        <span className="text-sm font-semibold">20%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Visites de reprise</span>
                        <span className="text-sm font-semibold">15%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accidents du travail</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Ce mois</span>
                      <Badge variant="outline">{stats.accidentsThisMonth}</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Mois dernier</span>
                      <Badge variant="outline">5</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm">Cette année</span>
                      <Badge variant="outline">42</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ProfessionalEstablishmentLayout>
  );
}

