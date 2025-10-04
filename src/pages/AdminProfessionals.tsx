import { useState, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, UserCog, Activity, Stethoscope, Pill, FlaskConical, Building2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

type ProfessionalStatus = "active" | "inactive" | "suspended";
type ProfessionalType = "doctor" | "pharmacist" | "lab_technician" | "nurse" | "specialist";

interface Professional {
  id: string;
  type: ProfessionalType;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  specialty?: string;
  establishment: string;
  city: string;
  province: string;
  status: ProfessionalStatus;
  registeredAt: Date;
  consultationCount: number;
}

const mockProfessionals: Professional[] = [
  {
    id: "1",
    type: "doctor",
    firstName: "Dr. Marie",
    lastName: "NDONG",
    email: "m.ndong@hopital.ga",
    phone: "+241 06 12 34 56",
    licenseNumber: "MD-2020-001",
    specialty: "Cardiologie",
    establishment: "CHU de Libreville",
    city: "Libreville",
    province: "Estuaire",
    status: "active",
    registeredAt: new Date("2023-01-15"),
    consultationCount: 245
  },
  {
    id: "2",
    type: "pharmacist",
    firstName: "Jean",
    lastName: "OBIANG",
    email: "j.obiang@pharmacie.ga",
    phone: "+241 06 23 45 67",
    licenseNumber: "PH-2021-045",
    establishment: "Pharmacie Centrale",
    city: "Libreville",
    province: "Estuaire",
    status: "active",
    registeredAt: new Date("2023-03-20"),
    consultationCount: 128
  },
  {
    id: "3",
    type: "doctor",
    firstName: "Dr. Paul",
    lastName: "MBOUMBA",
    email: "p.mboumba@clinic.ga",
    phone: "+241 06 34 56 78",
    licenseNumber: "MD-2019-034",
    specialty: "Pédiatrie",
    establishment: "Clinique de la Santé",
    city: "Port-Gentil",
    province: "Ogooué-Maritime",
    status: "active",
    registeredAt: new Date("2022-11-10"),
    consultationCount: 312
  },
  {
    id: "4",
    type: "lab_technician",
    firstName: "Sophie",
    lastName: "BOUANGA",
    email: "s.bouanga@labo.ga",
    phone: "+241 06 45 67 89",
    licenseNumber: "LT-2022-012",
    establishment: "Laboratoire Bio-Santé",
    city: "Franceville",
    province: "Haut-Ogooué",
    status: "active",
    registeredAt: new Date("2023-05-12"),
    consultationCount: 89
  },
  {
    id: "5",
    type: "doctor",
    firstName: "Dr. André",
    lastName: "KOUMBA",
    email: "a.koumba@hospital.ga",
    phone: "+241 06 56 78 90",
    licenseNumber: "MD-2018-067",
    specialty: "Chirurgie générale",
    establishment: "Hôpital Régional",
    city: "Oyem",
    province: "Woleu-Ntem",
    status: "inactive",
    registeredAt: new Date("2022-08-05"),
    consultationCount: 187
  },
  {
    id: "6",
    type: "nurse",
    firstName: "Claire",
    lastName: "EKOMI",
    email: "c.ekomi@clinic.ga",
    phone: "+241 06 67 89 01",
    licenseNumber: "RN-2021-089",
    establishment: "Centre Médical Akébé",
    city: "Libreville",
    province: "Estuaire",
    status: "active",
    registeredAt: new Date("2023-02-18"),
    consultationCount: 156
  }
];

const AdminProfessionals = () => {
  const { hasRole, hasAnyRole } = useAuth();
  const isSuperAdmin = hasRole('super_admin');
  const isAdmin = hasAnyRole(['super_admin', 'admin']);
  const { toast } = useToast();
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [provinceFilter, setProvinceFilter] = useState<string>("all");
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<ProfessionalStatus>("active");

  useEffect(() => {
    loadProfessionals();
  }, []);

  useEffect(() => {
    filterProfessionals();
  }, [professionals, searchTerm, typeFilter, statusFilter, provinceFilter]);

  const loadProfessionals = () => {
    setProfessionals(mockProfessionals);
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.firstName.toLowerCase().includes(search) ||
        p.lastName.toLowerCase().includes(search) ||
        p.email.toLowerCase().includes(search) ||
        p.phone.includes(search) ||
        p.establishment.toLowerCase().includes(search) ||
        p.licenseNumber.toLowerCase().includes(search)
      );
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(p => p.type === typeFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    if (provinceFilter !== "all") {
      filtered = filtered.filter(p => p.province === provinceFilter);
    }

    setFilteredProfessionals(filtered);
  };

  const openDetailsDialog = (professional: Professional) => {
    setSelectedProfessional(professional);
    setIsDetailsOpen(true);
  };

  const openStatusDialog = (professional: Professional) => {
    setSelectedProfessional(professional);
    setNewStatus(professional.status);
    setIsStatusDialogOpen(true);
  };

  const handleStatusChange = () => {
    if (!selectedProfessional) return;

    setProfessionals(prev =>
      prev.map(p =>
        p.id === selectedProfessional.id
          ? { ...p, status: newStatus }
          : p
      )
    );

    toast({
      title: "Statut modifié",
      description: `Le statut de ${selectedProfessional.firstName} ${selectedProfessional.lastName} a été changé à ${newStatus}.`,
    });

    setIsStatusDialogOpen(false);
    setSelectedProfessional(null);
  };

  const getTypeIcon = (type: ProfessionalType) => {
    switch (type) {
      case "doctor":
        return <Stethoscope className="h-4 w-4" />;
      case "pharmacist":
        return <Pill className="h-4 w-4" />;
      case "lab_technician":
        return <FlaskConical className="h-4 w-4" />;
      case "nurse":
        return <Activity className="h-4 w-4" />;
      case "specialist":
        return <UserCog className="h-4 w-4" />;
      default:
        return <Stethoscope className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: ProfessionalType) => {
    const labels = {
      doctor: "Médecin",
      pharmacist: "Pharmacien",
      lab_technician: "Technicien labo",
      nurse: "Infirmier(ère)",
      specialist: "Spécialiste"
    };
    return labels[type];
  };

  const getStatusBadge = (status: ProfessionalStatus) => {
    const variants = {
      active: "default",
      inactive: "secondary",
      suspended: "destructive"
    } as const;

    const labels = {
      active: "Actif",
      inactive: "Inactif",
      suspended: "Suspendu"
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const stats = {
    total: professionals.length,
    active: professionals.filter(p => p.status === "active").length,
    doctors: professionals.filter(p => p.type === "doctor").length,
    pharmacists: professionals.filter(p => p.type === "pharmacist").length,
    totalConsultations: professionals.reduce((sum, p) => sum + p.consultationCount, 0)
  };

  if (!isSuperAdmin && !isAdmin) {
    return (
      <MainLayout>
        <div className="container py-8">
          <Card>
            <CardHeader>
              <CardTitle>Accès non autorisé</CardTitle>
              <CardDescription>
                Vous n'avez pas les permissions nécessaires pour accéder à cette page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Professionnels de santé</h1>
          <p className="text-muted-foreground">
            Gérez les professionnels de santé enregistrés sur la plateforme
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Médecins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.doctors}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pharmaciens
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pharmacists}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Consultations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConsultations}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="search">Rechercher</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nom, email, téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="doctor">Médecins</SelectItem>
                    <SelectItem value="pharmacist">Pharmaciens</SelectItem>
                    <SelectItem value="lab_technician">Techniciens labo</SelectItem>
                    <SelectItem value="nurse">Infirmier(ère)s</SelectItem>
                    <SelectItem value="specialist">Spécialistes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                  <SelectTrigger id="province">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les provinces</SelectItem>
                    <SelectItem value="Estuaire">Estuaire</SelectItem>
                    <SelectItem value="Haut-Ogooué">Haut-Ogooué</SelectItem>
                    <SelectItem value="Moyen-Ogooué">Moyen-Ogooué</SelectItem>
                    <SelectItem value="Ngounié">Ngounié</SelectItem>
                    <SelectItem value="Nyanga">Nyanga</SelectItem>
                    <SelectItem value="Ogooué-Ivindo">Ogooué-Ivindo</SelectItem>
                    <SelectItem value="Ogooué-Lolo">Ogooué-Lolo</SelectItem>
                    <SelectItem value="Ogooué-Maritime">Ogooué-Maritime</SelectItem>
                    <SelectItem value="Woleu-Ntem">Woleu-Ntem</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professionals Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des professionnels ({filteredProfessionals.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Professionnel</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Établissement</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Consultations</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProfessionals.map((professional) => (
                  <TableRow key={professional.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTypeIcon(professional.type)}
                        <span className="text-sm">{getTypeLabel(professional.type)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {professional.firstName} {professional.lastName}
                        </div>
                        {professional.specialty && (
                          <div className="text-sm text-muted-foreground">
                            {professional.specialty}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          {professional.licenseNumber}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{professional.email}</div>
                        <div className="text-muted-foreground">{professional.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{professional.establishment}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{professional.city}</div>
                        <div className="text-muted-foreground">{professional.province}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{professional.consultationCount}</Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(professional.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDetailsDialog(professional)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        {isSuperAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openStatusDialog(professional)}
                          >
                            <UserCog className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du professionnel</DialogTitle>
            <DialogDescription>
              Informations complètes du professionnel de santé
            </DialogDescription>
          </DialogHeader>
          {selectedProfessional && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {getTypeIcon(selectedProfessional.type)}
                    <span>{getTypeLabel(selectedProfessional.type)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Statut</Label>
                  <div className="mt-1">{getStatusBadge(selectedProfessional.status)}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Nom complet</Label>
                  <div className="mt-1">
                    {selectedProfessional.firstName} {selectedProfessional.lastName}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Numéro de licence</Label>
                  <div className="mt-1">{selectedProfessional.licenseNumber}</div>
                </div>
                {selectedProfessional.specialty && (
                  <div>
                    <Label className="text-muted-foreground">Spécialité</Label>
                    <div className="mt-1">{selectedProfessional.specialty}</div>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <div className="mt-1">{selectedProfessional.email}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Téléphone</Label>
                  <div className="mt-1">{selectedProfessional.phone}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Établissement</Label>
                  <div className="mt-1">{selectedProfessional.establishment}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ville</Label>
                  <div className="mt-1">{selectedProfessional.city}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Province</Label>
                  <div className="mt-1">{selectedProfessional.province}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date d'inscription</Label>
                  <div className="mt-1">
                    {selectedProfessional.registeredAt.toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Consultations effectuées</Label>
                  <div className="mt-1 font-semibold">
                    {selectedProfessional.consultationCount}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <AlertDialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier le statut</AlertDialogTitle>
            <AlertDialogDescription>
              Sélectionnez le nouveau statut pour{" "}
              {selectedProfessional?.firstName} {selectedProfessional?.lastName}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={newStatus} onValueChange={(value) => setNewStatus(value as ProfessionalStatus)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default AdminProfessionals;
