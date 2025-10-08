import { useEffect, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
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
  CheckCircle2,
  XCircle,
  Shield,
  Phone,
  Mail,
  MapPin,
  Clock,
  Activity,
  Plus,
  Bed,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: 'chu' | 'chr' | 'polyclinique' | 'clinique' | 'centre_medical' | 'hopital_departemental' | 'hopital_confessionnel';
  secteur: 'public' | 'prive' | 'confessionnel' | 'militaire' | 'parapublic';
  telephone_standard: string | null;
  email: string | null;
  province: string;
  ville: string;
  adresse_rue: string | null;
  nombre_lits_total: number;
  service_urgences_actif: boolean;
  statut: 'actif' | 'suspendu' | 'en_maintenance' | 'en_validation';
  taux_occupation: number | null;
  cnamgs_conventionne: boolean;
  satisfaction_moyenne: number | null;
}

const establishmentTypes: Record<string, string> = {
  chu: "CHU",
  chr: "CHR",
  polyclinique: "Polyclinique",
  clinique: "Clinique",
  centre_medical: "Centre Médical",
  hopital_departemental: "Hôpital Départemental",
  hopital_confessionnel: "Hôpital Confessionnel"
};

const establishmentSectors: Record<string, string> = {
  public: "Public",
  prive: "Privé",
  confessionnel: "Confessionnel",
  militaire: "Militaire",
  parapublic: "Parapublic"
};

const statusLabels: Record<string, string> = {
  actif: "Actif",
  suspendu: "Suspendu",
  en_maintenance: "En Maintenance",
  en_validation: "En Validation"
};

const statusColors: Record<string, string> = {
  actif: "bg-green-500/10 text-green-600 border-green-500/20",
  suspendu: "bg-red-500/10 text-red-600 border-red-500/20",
  en_maintenance: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  en_validation: "bg-blue-500/10 text-blue-600 border-blue-500/20"
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
  const [filterSector, setFilterSector] = useState<string>("all");
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
  }, [establishments, searchTerm, filterType, filterStatus, filterProvince, filterSector]);

  const loadEstablishments = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEstablishments(data || []);
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
        e.raison_sociale.toLowerCase().includes(term) ||
        e.email?.toLowerCase().includes(term) ||
        e.telephone_standard?.includes(term) ||
        e.ville.toLowerCase().includes(term) ||
        e.adresse_rue?.toLowerCase().includes(term)
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(e => e.type_etablissement === filterType);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(e => e.statut === filterStatus);
    }

    if (filterProvince !== "all") {
      filtered = filtered.filter(e => e.province === filterProvince);
    }

    if (filterSector !== "all") {
      filtered = filtered.filter(e => e.secteur === filterSector);
    }

    setFilteredEstablishments(filtered);
  };

  const openDetailsDialog = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = async (establishmentId: string, newStatus: 'actif' | 'suspendu' | 'en_maintenance' | 'en_validation') => {
    try {
      const { error } = await supabase
        .from('establishments')
        .update({ statut: newStatus })
        .eq('id', establishmentId);

      if (error) throw error;

      setEstablishments(prev => 
        prev.map(e => e.id === establishmentId ? { ...e, statut: newStatus } : e)
      );
      setShowDetailsDialog(false);
      toast.success("Statut modifié avec succès");
    } catch (error: any) {
      console.error('Error changing status:', error);
      toast.error("Erreur lors du changement de statut");
    }
  };

  const provinces = Array.from(new Set(establishments.map(e => e.province))).sort();

  const stats = {
    total: establishments.length,
    active: establishments.filter(e => e.statut === 'actif').length,
    hospitals: establishments.filter(e => e.type_etablissement === 'chu' || e.type_etablissement === 'chr').length,
    clinics: establishments.filter(e => e.type_etablissement === 'clinique' || e.type_etablissement === 'polyclinique').length,
    emergency_24_7: establishments.filter(e => e.service_urgences_actif).length,
    cnamgs: establishments.filter(e => e.cnamgs_conventionne).length
  };

  if (!isAdmin) {
    return (
      <SuperAdminLayout>
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
      </SuperAdminLayout>
    );
  }

  return (
    <SuperAdminLayout>
      <div className="container max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              Gestion des Établissements de Santé
            </h1>
            <p className="text-muted-foreground mt-1">
              Administrez tous les établissements de santé du réseau SANTE.GA
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvel Établissement
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Actifs</CardDescription>
              <CardTitle className="text-3xl text-green-600">{stats.active}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>CHU/CHR</CardDescription>
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
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>CNAMGS</CardDescription>
              <CardTitle className="text-3xl">{stats.cnamgs}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-5 gap-4">
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
                    <SelectItem value="chu">CHU</SelectItem>
                    <SelectItem value="chr">CHR</SelectItem>
                    <SelectItem value="polyclinique">Polycliniques</SelectItem>
                    <SelectItem value="clinique">Cliniques</SelectItem>
                    <SelectItem value="centre_medical">Centres Médicaux</SelectItem>
                    <SelectItem value="hopital_departemental">Hôpitaux Départementaux</SelectItem>
                    <SelectItem value="hopital_confessionnel">Hôpitaux Confessionnels</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="filter-sector">Secteur</Label>
                <Select value={filterSector} onValueChange={setFilterSector}>
                  <SelectTrigger id="filter-sector">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="all">Tous les secteurs</SelectItem>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="prive">Privé</SelectItem>
                    <SelectItem value="confessionnel">Confessionnel</SelectItem>
                    <SelectItem value="militaire">Militaire</SelectItem>
                    <SelectItem value="parapublic">Parapublic</SelectItem>
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
                    <SelectItem value="actif">Actifs</SelectItem>
                    <SelectItem value="en_validation">En Validation</SelectItem>
                    <SelectItem value="en_maintenance">En Maintenance</SelectItem>
                    <SelectItem value="suspendu">Suspendus</SelectItem>
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
                  setFilterSector("all");
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
                      <TableHead>Secteur</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Services</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEstablishments.map((establishment) => (
                      <TableRow key={establishment.id}>
                        <TableCell className="font-medium">
                          {establishment.raison_sociale}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {establishmentTypes[establishment.type_etablissement]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {establishmentSectors[establishment.secteur]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm space-y-1">
                            {establishment.telephone_standard && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {establishment.telephone_standard}
                              </div>
                            )}
                            {establishment.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {establishment.email}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {establishment.ville}, {establishment.province}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <Bed className="h-3 w-3" />
                            {establishment.nombre_lits_total} lits
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {establishment.service_urgences_actif && (
                              <Badge variant="destructive" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                24/7
                              </Badge>
                            )}
                            {establishment.cnamgs_conventionne && (
                              <Badge variant="default" className="text-xs">
                                CNAMGS
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[establishment.statut]}>
                            {statusLabels[establishment.statut]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openDetailsDialog(establishment)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
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

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedEstablishment?.raison_sociale}
            </DialogTitle>
            <DialogDescription>
              Détails de l'établissement et actions administratives
            </DialogDescription>
          </DialogHeader>

          {selectedEstablishment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium">{establishmentTypes[selectedEstablishment.type_etablissement]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Secteur</Label>
                  <p className="font-medium">{establishmentSectors[selectedEstablishment.secteur]}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Ville</Label>
                  <p className="font-medium">{selectedEstablishment.ville}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Province</Label>
                  <p className="font-medium">{selectedEstablishment.province}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Capacité</Label>
                  <p className="font-medium">{selectedEstablishment.nombre_lits_total} lits</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Taux d'occupation</Label>
                  <p className="font-medium">{selectedEstablishment.taux_occupation || 'N/A'}%</p>
                </div>
              </div>

              {isSuperAdmin && (
                <div className="space-y-3 pt-4 border-t">
                  <Label>Actions administratives</Label>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedEstablishment.id, 'actif')}
                      disabled={selectedEstablishment.statut === 'actif'}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Activer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStatusChange(selectedEstablishment.id, 'en_maintenance')}
                      disabled={selectedEstablishment.statut === 'en_maintenance'}
                    >
                      <AlertCircle className="h-4 w-4 mr-2" />
                      Maintenance
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleStatusChange(selectedEstablishment.id, 'suspendu')}
                      disabled={selectedEstablishment.statut === 'suspendu'}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
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
    </SuperAdminLayout>
  );
}
