import { useEffect, useState } from "react";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  Search, 
  Filter,
  Eye,
  Edit,
  CheckCircle2,
  XCircle,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  Users as UsersIcon,
  Activity,
  Plus
} from "lucide-react";
import { toast } from "sonner";

interface Establishment {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health_center' | 'medical_center';
  email: string | null;
  phone: string;
  address: string;
  city: string;
  province: string;
  is_24_7: boolean;
  has_emergency: boolean;
  has_laboratory: boolean;
  has_imaging: boolean;
  bed_capacity?: number;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
}

const establishmentTypes: Record<string, string> = {
  hospital: "Hôpital",
  clinic: "Clinique",
  health_center: "Centre de Santé",
  medical_center: "Centre Médical",
};

const statusLabels: Record<string, string> = {
  active: "Actif",
  inactive: "Inactif",
  suspended: "Suspendu",
};

const statusColors: Record<string, string> = {
  active: "bg-success text-success-foreground",
  inactive: "bg-secondary text-secondary-foreground",
  suspended: "bg-destructive text-destructive-foreground",
};

export default function AdminEstablishments() {
  const { hasRole } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterProvince, setFilterProvince] = useState<string>("all");
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const isSuperAdmin = hasRole("super_admin");
  const isAdmin = hasRole("admin") || isSuperAdmin;

  useEffect(() => {
    if (isAdmin) {
      loadEstablishments();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterEstablishments();
  }, [establishments, searchTerm, filterType, filterStatus, filterProvince]);

  const loadEstablishments = async () => {
    try {
      setIsLoading(true);
      
      // Données mockées pour démonstration
      const mockData: Establishment[] = [
        {
          id: "1",
          name: "CHU de Libreville",
          type: "hospital",
          email: "contact@chu-libreville.ga",
          phone: "+241 011 76 14 68",
          address: "Boulevard Triomphal",
          city: "Libreville",
          province: "Estuaire",
          is_24_7: true,
          has_emergency: true,
          has_laboratory: true,
          has_imaging: true,
          bed_capacity: 450,
          status: "active",
          created_at: new Date("2023-01-15").toISOString(),
        },
        {
          id: "2",
          name: "Polyclinique Dr. Chambrier",
          type: "clinic",
          email: "info@chambrier.ga",
          phone: "+241 011 76 14 68",
          address: "Montagne Sainte",
          city: "Libreville",
          province: "Estuaire",
          is_24_7: true,
          has_emergency: true,
          has_laboratory: true,
          has_imaging: true,
          bed_capacity: 120,
          status: "active",
          created_at: new Date("2022-06-10").toISOString(),
        },
        {
          id: "3",
          name: "Centre Hospitalier Régional de Franceville",
          type: "hospital",
          email: "chr.franceville@sante.ga",
          phone: "+241 067 12 34 56",
          address: "Avenue de l'Indépendance",
          city: "Franceville",
          province: "Haut-Ogooué",
          is_24_7: true,
          has_emergency: true,
          has_laboratory: true,
          has_imaging: false,
          bed_capacity: 200,
          status: "active",
          created_at: new Date("2023-03-20").toISOString(),
        },
        {
          id: "4",
          name: "Clinique Sainte-Marie",
          type: "clinic",
          email: "contact@saintemarie.ga",
          phone: "+241 011 45 67 89",
          address: "Quartier Batterie IV",
          city: "Libreville",
          province: "Estuaire",
          is_24_7: false,
          has_emergency: false,
          has_laboratory: true,
          has_imaging: false,
          bed_capacity: 45,
          status: "active",
          created_at: new Date("2023-08-05").toISOString(),
        },
        {
          id: "5",
          name: "Centre de Santé d'Owendo",
          type: "health_center",
          email: "cs.owendo@sante.ga",
          phone: "+241 062 89 01 23",
          address: "Route Nationale",
          city: "Owendo",
          province: "Estuaire",
          is_24_7: false,
          has_emergency: false,
          has_laboratory: false,
          has_imaging: false,
          status: "active",
          created_at: new Date("2022-11-12").toISOString(),
        },
        {
          id: "6",
          name: "Centre Médical Port-Gentil",
          type: "medical_center",
          email: "cm.portgentil@sante.ga",
          phone: "+241 055 34 56 78",
          address: "Boulevard de l'Océan",
          city: "Port-Gentil",
          province: "Ogooué-Maritime",
          is_24_7: true,
          has_emergency: true,
          has_laboratory: true,
          has_imaging: true,
          bed_capacity: 80,
          status: "active",
          created_at: new Date("2023-02-28").toISOString(),
        },
        {
          id: "7",
          name: "Clinique Les Mimosas",
          type: "clinic",
          email: "info@mimosas.ga",
          phone: "+241 011 23 45 67",
          address: "Quartier Glass",
          city: "Libreville",
          province: "Estuaire",
          is_24_7: false,
          has_emergency: false,
          has_laboratory: true,
          has_imaging: false,
          bed_capacity: 30,
          status: "suspended",
          created_at: new Date("2021-09-15").toISOString(),
        },
      ];

      setEstablishments(mockData);
    } catch (error: any) {
      console.error('Error loading establishments:', error);
      toast.error("Erreur lors du chargement des établissements");
    } finally {
      setIsLoading(false);
    }
  };

  const filterEstablishments = () => {
    let filtered = establishments;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(e => 
        e.name.toLowerCase().includes(term) ||
        e.email?.toLowerCase().includes(term) ||
        e.phone.includes(term) ||
        e.city.toLowerCase().includes(term) ||
        e.address.toLowerCase().includes(term)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(e => e.type === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(e => e.status === filterStatus);
    }

    if (filterProvince !== "all") {
      filtered = filtered.filter(e => e.province === filterProvince);
    }

    setFilteredEstablishments(filtered);
  };

  const openDetailsDialog = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = async (establishmentId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    try {
      // TODO: Implémenter le changement de statut réel
      setEstablishments(prev => 
        prev.map(e => e.id === establishmentId ? { ...e, status: newStatus } : e)
      );
      toast.success("Statut modifié avec succès");
    } catch (error: any) {
      console.error('Error changing status:', error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const provinces = Array.from(new Set(establishments.map(e => e.province))).sort();

  const stats = {
    total: establishments.length,
    active: establishments.filter(e => e.status === 'active').length,
    hospitals: establishments.filter(e => e.type === 'hospital').length,
    clinics: establishments.filter(e => e.type === 'clinic').length,
    emergency_24_7: establishments.filter(e => e.is_24_7 && e.has_emergency).length,
  };

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Shield className="h-6 w-6" />
                Accès refusé
              </CardTitle>
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
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Gestion des Établissements
            </h1>
            <p className="text-muted-foreground mt-1">
              Administrez tous les établissements de santé du Gabon
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un établissement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Actifs</CardDescription>
              <CardTitle className="text-3xl text-success">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Hôpitaux</CardDescription>
              <CardTitle className="text-3xl">{stats.hospitals}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Cliniques</CardDescription>
              <CardTitle className="text-3xl">{stats.clinics}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Urgences 24/7</CardDescription>
              <CardTitle className="text-3xl">{stats.emergency_24_7}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">
                  <Search className="h-4 w-4 inline mr-2" />
                  Rechercher
                </Label>
                <Input
                  id="search"
                  placeholder="Nom, ville, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter-type">
                  <Filter className="h-4 w-4 inline mr-2" />
                  Type
                </Label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger id="filter-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Tous les types</SelectItem>
                    <SelectItem value="hospital">Hôpitaux</SelectItem>
                    <SelectItem value="clinic">Cliniques</SelectItem>
                    <SelectItem value="health_center">Centres de Santé</SelectItem>
                    <SelectItem value="medical_center">Centres Médicaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-province">Province</Label>
                <Select value={filterProvince} onValueChange={setFilterProvince}>
                  <SelectTrigger id="filter-province">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Toutes les provinces</SelectItem>
                    {provinces.map(province => (
                      <SelectItem key={province} value={province}>{province}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-status">Statut</Label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger id="filter-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                    <SelectItem value="suspended">Suspendus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                  setFilterStatus("all");
                  setFilterProvince("all");
                }}
              >
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Liste des établissements */}
        <Card>
          <CardHeader>
            <CardTitle>Résultats ({filteredEstablishments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-muted-foreground">Chargement...</div>
              </div>
            ) : filteredEstablishments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Building2 className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucun établissement trouvé</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos filtres de recherche
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstablishments.map((establishment) => (
                      <TableRow key={establishment.id}>
                        <TableCell className="font-medium">
                          <div>
                            <div className="flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                              {establishment.name}
                            </div>
                            {establishment.bed_capacity && (
                              <div className="text-xs text-muted-foreground mt-1">
                                {establishment.bed_capacity} lits
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {establishmentTypes[establishment.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Phone className="h-3 w-3 text-muted-foreground" />
                              {establishment.phone}
                            </div>
                            {establishment.email && (
                              <div className="flex items-center gap-1 text-sm">
                                <Mail className="h-3 w-3 text-muted-foreground" />
                                {establishment.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {establishment.city}
                            </div>
                            <div className="text-xs text-muted-foreground pl-4">
                              {establishment.province}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {establishment.is_24_7 && (
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                24/7
                              </Badge>
                            )}
                            {establishment.has_emergency && (
                              <Badge variant="secondary" className="text-xs">
                                <Activity className="h-3 w-3 mr-1" />
                                Urgences
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[establishment.status]} variant="secondary">
                            {statusLabels[establishment.status]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openDetailsDialog(establishment)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {isSuperAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog Détails */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Détails de l'établissement
            </DialogTitle>
            <DialogDescription>
              Informations complètes et services disponibles
            </DialogDescription>
          </DialogHeader>
          
          {selectedEstablishment && (
            <div className="space-y-6">
              {/* En-tête */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold">{selectedEstablishment.name}</h3>
                  <Badge variant="outline" className="mt-2">
                    {establishmentTypes[selectedEstablishment.type]}
                  </Badge>
                </div>
                <Badge className={statusColors[selectedEstablishment.status]}>
                  {statusLabels[selectedEstablishment.status]}
                </Badge>
              </div>

              {/* Informations principales */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Capacité</Label>
                  <p className="font-medium">
                    {selectedEstablishment.bed_capacity 
                      ? `${selectedEstablishment.bed_capacity} lits` 
                      : 'Non spécifiée'}
                  </p>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date d'ajout</Label>
                  <p className="font-medium">
                    {new Date(selectedEstablishment.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>

              {/* Contact */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Coordonnées</Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedEstablishment.phone}</span>
                  </div>
                  {selectedEstablishment.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedEstablishment.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Adresse */}
              <div>
                <Label className="text-xs text-muted-foreground mb-2 block">Adresse</Label>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p>{selectedEstablishment.address}</p>
                    <p>{selectedEstablishment.city}, {selectedEstablishment.province}</p>
                  </div>
                </div>
              </div>

              {/* Services disponibles */}
              <div>
                <Label className="text-xs text-muted-foreground mb-3 block">Services & Équipements</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    {selectedEstablishment.is_24_7 ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm">Ouvert 24h/24, 7j/7</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    {selectedEstablishment.has_emergency ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm">Service d'urgences</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    {selectedEstablishment.has_laboratory ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm">Laboratoire d'analyses</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-lg border">
                    {selectedEstablishment.has_imaging ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className="text-sm">Imagerie médicale</span>
                  </div>
                </div>
              </div>

              {/* Actions administrateur */}
              {isSuperAdmin && selectedEstablishment.status !== 'suspended' && (
                <div className="pt-4 border-t">
                  <Label className="text-xs text-muted-foreground mb-3 block">Actions administratives</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleStatusChange(
                          selectedEstablishment.id,
                          selectedEstablishment.status === 'active' ? 'inactive' : 'active'
                        );
                        setShowDetailsDialog(false);
                      }}
                    >
                      {selectedEstablishment.status === 'active' ? 'Désactiver' : 'Activer'}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleStatusChange(selectedEstablishment.id, 'suspended');
                        setShowDetailsDialog(false);
                      }}
                    >
                      Suspendre
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
}
