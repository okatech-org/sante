import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { 
  Users, Search, UserPlus, FileText, AlertCircle,
  CheckCircle, Clock, Activity, Phone, Mail,
  Briefcase, MapPin, Calendar, Loader2, ArrowLeft,
  Download, Filter, X
} from "lucide-react";
import { SogaraDashboardLayout } from "@/components/layout/SogaraDashboardLayout";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Types
interface Employee {
  id: string;
  nom: string;
  poste: string;
  departement: string;
  dateEmbauche: string;
  statut: "actif" | "conge" | "arret";
  derniereVisite: string;
  prochainExamen: string;
  phone: string;
  email: string;
  ayantsDroit: number;
  dossierComplet: boolean;
  alertes?: string[];
}

export default function SogaraEmployees() {
  const navigate = useNavigate();

  // States
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addEmployeeOpen, setAddEmployeeOpen] = useState(false);
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Données initiales - Employés SOGARA Direction + Cadres + Exemples
  const initialEmployees: Employee[] = [
    // === DIRECTION ===
    {
      id: "EMP-SOGARA-0001",
      nom: "Christian AVARO",
      poste: "Directeur Général",
      departement: "Direction Générale",
      dateEmbauche: "2010-01-15",
      statut: "actif",
      derniereVisite: "2024-10-15",
      prochainExamen: "2025-04-15",
      phone: "+241 06 01 02 03",
      email: "c.avaro@sogara.ga",
      ayantsDroit: 4,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-0002",
      nom: "Ingride TCHEN",
      poste: "Directrice des Ressources Humaines",
      departement: "Ressources Humaines",
      dateEmbauche: "2012-03-20",
      statut: "actif",
      derniereVisite: "2024-09-28",
      prochainExamen: "2025-03-28",
      phone: "+241 06 04 05 06",
      email: "i.tchen@sogara.ga",
      ayantsDroit: 3,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-0003",
      nom: "Éric AVARO",
      poste: "Directeur Communication",
      departement: "Communication",
      dateEmbauche: "2014-06-10",
      statut: "actif",
      derniereVisite: "2024-10-20",
      prochainExamen: "2025-04-20",
      phone: "+241 06 07 08 09",
      email: "e.avaro@sogara.ga",
      ayantsDroit: 2,
      dossierComplet: true
    },
    
    // === CADRES HSSE & QUALITÉ ===
    {
      id: "EMP-SOGARA-0004",
      nom: "Lié Orphé BOURDES",
      poste: "Chef de Division HSSE et Conformité",
      departement: "HSSE",
      dateEmbauche: "2013-09-15",
      statut: "actif",
      derniereVisite: "2024-10-05",
      prochainExamen: "2025-04-05",
      phone: "+241 06 10 11 12",
      email: "l.bourdes@sogara.ga",
      ayantsDroit: 3,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-0005",
      nom: "Lise Véronique DITSOUGOU",
      poste: "Chef HSSE Opérationnel",
      departement: "HSSE",
      dateEmbauche: "2015-11-20",
      statut: "actif",
      derniereVisite: "2024-09-15",
      prochainExamen: "2025-03-15",
      phone: "+241 06 13 14 15",
      email: "l.ditsougou@sogara.ga",
      ayantsDroit: 2,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-0006",
      nom: "Pierrette NOMSI",
      poste: "Chef QUALITÉ et CONFORMITÉ",
      departement: "Qualité",
      dateEmbauche: "2016-04-12",
      statut: "actif",
      derniereVisite: "2024-10-18",
      prochainExamen: "2025-04-18",
      phone: "+241 06 16 17 18",
      email: "p.nomsi@sogara.ga",
      ayantsDroit: 3,
      dossierComplet: true
    },
    {
      id: "EMP-SOGARA-0007",
      nom: "Sylvie KOUMBA",
      poste: "Responsable Sécurité",
      departement: "HSSE",
      dateEmbauche: "2017-02-08",
      statut: "actif",
      derniereVisite: "2024-09-22",
      prochainExamen: "2025-03-22",
      phone: "+241 06 19 20 21",
      email: "s.koumba@sogara.ga",
      ayantsDroit: 1,
      dossierComplet: true
    },

    // === PRODUCTION/TECHNIQUE ===
    {
      id: "EMP-SOGARA-0008",
      nom: "Pierre BEKALE",
      poste: "Technicien Raffinage",
      departement: "Production",
      dateEmbauche: "2018-07-15",
      statut: "actif",
      derniereVisite: "2024-08-12",
      prochainExamen: "2024-12-12",
      phone: "+241 06 22 23 24",
      email: "p.bekale@sogara.ga",
      ayantsDroit: 2,
      dossierComplet: false,
      alertes: ["Examen périodique bientôt dû"]
    },

  ];

  // Load employees on mount
  useEffect(() => {
    const loadEmployees = async () => {
      setLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 600));
        setEmployees(initialEmployees);
        setLoading(false);
      } catch (err) {
        toast.error("Erreur de chargement des employés");
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  // Stats calculées
  const stats = {
    totalEmployees: employees.length,
    actifs: employees.filter(e => e.statut === "actif").length,
    ayantsDroit: employees.reduce((sum, e) => sum + e.ayantsDroit, 0),
    derniereVisite: employees.filter(e => e.dossierComplet).length,
    alertes: employees.filter(e => e.alertes && e.alertes.length > 0).length
  };

  // Get status badge
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

  // Handlers
  const handleViewDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDetailsOpen(true);
  };

  const handleExport = () => {
    toast.success("Export en cours", {
      description: "Le fichier CSV est en cours de génération..."
    });
    // Simulate export
    setTimeout(() => {
      toast.success("Export terminé", {
        description: `${employees.length} employés exportés avec succès`
      });
    }, 1500);
  };

  const handleAddEmployee = () => {
    setAddEmployeeOpen(true);
  };

  const handleScheduleExam = (employee: Employee) => {
    toast.info("Planification RDV", {
      description: `Planification pour ${employee.nom}...`
    });
    navigate('/establishments/sogara/admin/work-medicine');
  };

  const handleViewMedicalFile = (employee: Employee) => {
    toast.info("Dossier médical", {
      description: `Ouverture du dossier de ${employee.nom}...`
    });
  };

  // Filtering
  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         emp.departement.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === "all" || emp.departement === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Get unique departments
  const departments = ["all", ...Array.from(new Set(employees.map(e => e.departement)))];

  // Loading state
  if (loading) {
    return (
      <SogaraDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Chargement des employés...</p>
          </div>
        </div>
      </SogaraDashboardLayout>
    );
  }

  return (
    <SogaraDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/establishments/sogara/admin')}
              className="flex-shrink-0"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            <div className="min-w-0">
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">Gestion des Employés</h1>
              <p className="text-sm md:text-base text-muted-foreground">Base de données des employés SOGARA et ayants droit</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={handleExport}
              aria-label="Exporter la liste des employés"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Exporter</span>
            </Button>
            <Button 
              className="gap-2"
              onClick={handleAddEmployee}
              aria-label="Ajouter un nouvel employé"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Nouvel Employé</span>
              <span className="sm:hidden">Nouveau</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Employés</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.totalEmployees}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stats.actifs} actifs</p>
                </div>
                <Users className="w-8 md:w-10 h-8 md:h-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ayants Droit</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.ayantsDroit}</p>
                  <p className="text-xs text-muted-foreground mt-1">Déclarés</p>
                </div>
                <Users className="w-8 md:w-10 h-8 md:h-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Dossiers Complets</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.derniereVisite}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round((stats.derniereVisite / stats.totalEmployees) * 100)}% du total
                  </p>
                </div>
                <CheckCircle className="w-8 md:w-10 h-8 md:h-10 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Alertes</p>
                  <p className="text-2xl md:text-3xl font-bold text-foreground">{stats.alertes}</p>
                  <p className="text-xs text-muted-foreground mt-1">Examens en attente</p>
                </div>
                <AlertCircle className="w-8 md:w-10 h-8 md:h-10 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="all">Tous ({stats.totalEmployees})</TabsTrigger>
            <TabsTrigger value="actifs">Actifs ({stats.actifs})</TabsTrigger>
            <TabsTrigger value="alerts">Alertes ({stats.alertes})</TabsTrigger>
            <TabsTrigger value="dependants">Ayants Droit ({stats.ayantsDroit})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Liste des Employés</CardTitle>
                    <CardDescription>Base de données complète - {filteredEmployees.length} résultat(s)</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder="Rechercher..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        aria-label="Rechercher un employé"
                      />
                      {searchTerm && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setSearchTerm("")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                      <SelectTrigger className="w-full sm:w-48">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Département" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les départements</SelectItem>
                        {departments.filter(d => d !== "all").map(dept => (
                          <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Matricule</TableHead>
                        <TableHead>Nom</TableHead>
                        <TableHead>Poste</TableHead>
                        <TableHead>Département</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="hidden md:table-cell">Dernière Visite</TableHead>
                        <TableHead className="hidden lg:table-cell">Prochain Examen</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployees.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12 text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>Aucun employé trouvé</p>
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredEmployees.map((employee) => (
                          <TableRow 
                            key={employee.id} 
                            className="cursor-pointer hover:bg-muted/50" 
                            onClick={() => handleViewDetails(employee)}
                          >
                            <TableCell className="font-mono text-xs">{employee.id}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <Users className="w-4 h-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-foreground truncate">{employee.nom}</p>
                                  {employee.ayantsDroit > 0 && (
                                    <p className="text-xs text-muted-foreground">{employee.ayantsDroit} ayant(s) droit</p>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-sm">{employee.poste}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">{employee.departement}</Badge>
                            </TableCell>
                            <TableCell>{getStatusBadge(employee.statut)}</TableCell>
                            <TableCell className="hidden md:table-cell text-sm">
                              {new Date(employee.derniereVisite).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <div className="flex items-center gap-2">
                                <span className="text-sm">{new Date(employee.prochainExamen).toLocaleDateString('fr-FR')}</span>
                                {employee.alertes && (
                                  <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(employee);
                                }}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actifs">
            <Card>
              <CardHeader>
                <CardTitle>Employés Actifs</CardTitle>
                <CardDescription>{employees.filter(e => e.statut === "actif").length} employés actifs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.filter(e => e.statut === "actif").map((employee) => (
                    <div 
                      key={employee.id} 
                      className="p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleViewDetails(employee)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{employee.nom}</p>
                          <p className="text-sm text-muted-foreground">{employee.poste} • {employee.departement}</p>
                        </div>
                        {getStatusBadge(employee.statut)}
                      </div>
                    </div>
                  ))}
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
                  {employees.filter(e => e.alertes).length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-green-500" />
                      <p>Aucune alerte en cours</p>
                    </div>
                  ) : (
                    employees.filter(e => e.alertes).map((employee) => (
                      <div key={employee.id} className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-foreground">{employee.nom}</p>
                            <p className="text-sm text-muted-foreground">{employee.id} • {employee.poste}</p>
                            <div className="mt-2 space-y-1">
                              {employee.alertes?.map((alerte, idx) => (
                                <p key={idx} className="text-sm text-orange-700 dark:text-orange-300">• {alerte}</p>
                              ))}
                            </div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleScheduleExam(employee)}
                            className="flex-shrink-0"
                          >
                            Planifier
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dependants">
            <Card>
              <CardHeader>
                <CardTitle>Ayants Droit</CardTitle>
                <CardDescription>Total de {stats.ayantsDroit} ayants droit déclarés</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees.filter(e => e.ayantsDroit > 0).map((employee) => (
                    <div key={employee.id} className="p-4 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-foreground">{employee.nom}</p>
                          <p className="text-sm text-muted-foreground">{employee.poste}</p>
                        </div>
                        <Badge variant="outline" className="bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30">
                          {employee.ayantsDroit} ayant(s) droit
                        </Badge>
                      </div>
                    </div>
                  ))}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  {selectedEmployee.alertes && selectedEmployee.alertes.length > 0 && (
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
                </div>

                {/* Actions */}
                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Button 
                    className="flex-1 gap-2"
                    onClick={() => handleViewMedicalFile(selectedEmployee)}
                  >
                    <FileText className="w-4 h-4" />
                    Voir Dossier Médical
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => handleScheduleExam(selectedEmployee)}
                  >
                    <Calendar className="w-4 h-4" />
                    Planifier RDV
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Dialog Nouvel Employé */}
        <Dialog open={addEmployeeOpen} onOpenChange={setAddEmployeeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel Employé</DialogTitle>
              <DialogDescription>Ajouter un employé à la base de données</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nom">Nom complet</Label>
                <Input id="nom" placeholder="NZAMBA Jean-Paul" />
              </div>
              <div>
                <Label htmlFor="poste">Poste</Label>
                <Input id="poste" placeholder="Technicien" />
              </div>
              <div>
                <Label htmlFor="departement">Département</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.filter(d => d !== "all").map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddEmployeeOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => {
                toast.success("Employé ajouté", {
                  description: "L'employé a été ajouté à la base de données"
                });
                setAddEmployeeOpen(false);
              }}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SogaraDashboardLayout>
  );
}
