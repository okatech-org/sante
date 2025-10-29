import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Users, Search, UserPlus, FileText, AlertCircle,
  CheckCircle, Clock, Activity, Phone, Mail,
  Briefcase, MapPin, Calendar
} from "lucide-react";
import { HospitalDashboardLayout } from "@/components/layout/HospitalDashboardLayout";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function SogaraEmployees() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const stats = {
    totalEmployees: 1250,
    actifs: 1180,
    ayantsDroit: 420,
    derniereVisite: 892
  };

  const employees = [
    {
      id: "EMP-SOGARA-1234",
      nom: "NZAMBA Jean-Paul",
      poste: "Technicien forage",
      departement: "Production",
      dateEmbauche: "2015-03-12",
      statut: "actif",
      derniereVisite: "2024-10-15",
      prochainExamen: "2025-01-15",
      phone: "+241 XX XX XX XX",
      email: "j.nzamba@sogara.ga",
      ayantsDroit: 3,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-5678",
      nom: "MOUSSAVOU Marie",
      poste: "Secrétaire direction",
      departement: "Administration",
      dateEmbauche: "2018-06-20",
      statut: "actif",
      derniereVisite: "2024-09-28",
      prochainExamen: "2025-03-28",
      phone: "+241 XX XX XX XX",
      email: "m.moussavou@sogara.ga",
      ayantsDroit: 2,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-9012",
      nom: "ELLA Pierre",
      poste: "Opérateur production",
      departement: "Production",
      dateEmbauche: "2012-01-10",
      statut: "actif",
      derniereVisite: "2024-08-12",
      prochainExamen: "2024-11-12",
      phone: "+241 XX XX XX XX",
      email: "p.ella@sogara.ga",
      ayantsDroit: 4,
      dossierComplet: false,
      alertes: ["Examen périodique bientôt dû"]
    },
    {
      id: "EMP-SOGARA-3456",
      nom: "OBAME Claire",
      poste: "Comptable",
      departement: "Finance",
      dateEmbauche: "2019-09-15",
      statut: "actif",
      derniereVisite: "2024-10-20",
      prochainExamen: "2025-04-20",
      phone: "+241 XX XX XX XX",
      email: "c.obame@sogara.ga",
      ayantsDroit: 1,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-7890",
      nom: "NGUEMA Sylvain",
      poste: "Chauffeur",
      departement: "Logistique",
      dateEmbauche: "2016-11-05",
      statut: "actif",
      derniereVisite: "2024-07-18",
      prochainExamen: "2024-10-18",
      phone: "+241 XX XX XX XX",
      email: "s.nguema@sogara.ga",
      ayantsDroit: 2,
      dossierComplet: false,
      alertes: ["Examen périodique en retard"]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "actif":
        return <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          Actif
        </Badge>;
      case "conge":
        return <Badge variant="outline" className="bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30">
          <Clock className="w-3 h-3 mr-1" />
          En congé
        </Badge>;
      case "arret":
        return <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          Arrêt maladie
        </Badge>;
      default:
        return null;
    }
  };

  const handleViewDetails = (employee: any) => {
    setSelectedEmployee(employee);
    setDetailsOpen(true);
  };

  const filteredEmployees = employees.filter(emp => 
    emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.departement.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <HospitalDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gestion des Employés SOGARA</h1>
            <p className="text-muted-foreground">Base de données des employés et ayants droit</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <FileText className="w-4 h-4" />
              Exporter
            </Button>
            <Button className="gap-2">
              <UserPlus className="w-4 h-4" />
              Nouvel Employé
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employés</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalEmployees}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.actifs} actifs</p>
                </div>
                <Users className="w-10 h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ayants Droit</p>
                  <p className="text-3xl font-bold text-foreground">{stats.ayantsDroit}</p>
                  <p className="text-xs text-muted-foreground mt-1">Déclarés</p>
                </div>
                <Users className="w-10 h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dossiers Complets</p>
                  <p className="text-3xl font-bold text-foreground">{stats.derniereVisite}</p>
                  <p className="text-xs text-muted-foreground mt-1">71% du total</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes</p>
                  <p className="text-3xl font-bold text-foreground">23</p>
                  <p className="text-xs text-muted-foreground mt-1">Examens en attente</p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">Tous ({stats.totalEmployees})</TabsTrigger>
            <TabsTrigger value="actifs">Actifs ({stats.actifs})</TabsTrigger>
            <TabsTrigger value="alerts">Alertes (23)</TabsTrigger>
            <TabsTrigger value="dependants">Ayants Droit ({stats.ayantsDroit})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Liste des Employés</CardTitle>
                    <CardDescription>Base de données complète des employés SOGARA</CardDescription>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Rechercher employé, matricule, poste..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-96"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Matricule</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Poste</TableHead>
                      <TableHead>Département</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Dernière Visite</TableHead>
                      <TableHead>Prochain Examen</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEmployees.map((employee) => (
                      <TableRow key={employee.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleViewDetails(employee)}>
                        <TableCell className="font-mono text-xs">{employee.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{employee.nom}</p>
                              {employee.ayantsDroit > 0 && (
                                <p className="text-xs text-muted-foreground">{employee.ayantsDroit} ayant(s) droit</p>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.poste}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{employee.departement}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(employee.statut)}</TableCell>
                        <TableCell className="text-sm">{new Date(employee.derniereVisite).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{new Date(employee.prochainExamen).toLocaleDateString('fr-FR')}</span>
                            {employee.alertes && (
                              <AlertCircle className="w-4 h-4 text-orange-500" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            <FileText className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actifs">
            <Card>
              <CardHeader>
                <CardTitle>Employés Actifs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                  <p>Filtrage par statut actif</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Employés avec Alertes
                </CardTitle>
                <CardDescription>Examens en retard ou bientôt dus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employees.filter(e => e.alertes).map((employee) => (
                    <div key={employee.id} className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{employee.nom}</p>
                          <p className="text-sm text-muted-foreground">{employee.id} • {employee.poste}</p>
                          <div className="mt-2 space-y-1">
                            {employee.alertes?.map((alerte, idx) => (
                              <p key={idx} className="text-sm text-orange-700 dark:text-orange-300">• {alerte}</p>
                            ))}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Planifier</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependants">
            <Card>
              <CardHeader>
                <CardTitle>Ayants Droit</CardTitle>
                <CardDescription>Liste des ayants droit déclarés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50 text-purple-500" />
                  <p>Liste des ayants droit en cours de développement</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dialog Détails Employé */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedEmployee && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedEmployee.nom}</DialogTitle>
                  <DialogDescription>{selectedEmployee.poste} • {selectedEmployee.departement}</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Informations générales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Matricule</p>
                      <p className="text-sm font-mono">{selectedEmployee.id}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Statut</p>
                      {getStatusBadge(selectedEmployee.statut)}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Date d'embauche</p>
                      <p className="text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(selectedEmployee.dateEmbauche).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Département</p>
                      <Badge variant="outline">{selectedEmployee.departement}</Badge>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Contact</h3>
                    <div className="space-y-2">
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        {selectedEmployee.phone}
                      </p>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        {selectedEmployee.email}
                      </p>
                    </div>
                  </div>

                  {/* Suivi médical */}
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">Suivi Médical</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Dernière visite</p>
                        <p className="text-sm">{new Date(selectedEmployee.derniereVisite).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Prochain examen</p>
                        <p className="text-sm">{new Date(selectedEmployee.prochainExamen).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Dossier médical</p>
                        {selectedEmployee.dossierComplet ? (
                          <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30">
                            Complet
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30">
                            Incomplet
                          </Badge>
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Ayants droit</p>
                        <p className="text-sm font-bold">{selectedEmployee.ayantsDroit}</p>
                      </div>
                    </div>
                  </div>

                  {/* Alertes */}
                  {selectedEmployee.alertes && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-orange-500" />
                        Alertes
                      </h3>
                      <div className="space-y-2">
                        {selectedEmployee.alertes.map((alerte: string, idx: number) => (
                          <div key={idx} className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                            <p className="text-sm text-orange-700 dark:text-orange-300">{alerte}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button className="flex-1 gap-2">
                      <FileText className="w-4 h-4" />
                      Voir Dossier Médical
                    </Button>
                    <Button variant="outline" className="flex-1 gap-2">
                      <Calendar className="w-4 h-4" />
                      Planifier RDV
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </HospitalDashboardLayout>
  );
}

