import { useState, useEffect, useMemo } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useNavigate, Link } from "react-router-dom";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Building2, Search, Plus, MapPin, Phone, Mail, CheckCircle, 
  XCircle, Clock, Eye, Ban, Edit, Map, Filter, Download,
  Building, Bed, Pill, FlaskConical, Stethoscope, Users,
  AlertCircle, Globe, ExternalLink, Home, Settings
} from "lucide-react";
import { toast } from "sonner";
import HealthProvidersMap from "@/components/landing/HealthProvidersMap";

// Import des 397 établissements réels
import providersData from "@/data/cartography-providers.json";

interface Establishment {
  id: string;
  nom: string;
  type: string;
  province: string;
  ville: string;
  coordonnees: { lat: number; lng: number };
  adresse_descriptive?: string;
  telephones?: string[];
  email?: string;
  site_web?: string;
  services?: string[];
  secteur?: string;
  conventionnement?: {
    cnamgs: boolean;
    cnss: boolean;
  };
  claim_status?: 'unclaimed' | 'claim_pending' | 'verified';
  claimed_by?: string;
  claimed_at?: string;
}

export default function AdminEstablishments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterProvince, setFilterProvince] = useState("all");
  const [activeTab, setActiveTab] = useState("table");
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 50;

  // Fonction pour déterminer si une structure a une page dédiée
  const getEstablishmentPageUrl = (establishment: Establishment): string | null => {
    // Vérifier si c'est SOGARA
    if (establishment.nom.toLowerCase().includes('sogara') || 
        establishment.nom.toLowerCase().includes('cmst')) {
      return '/sogara'; // Page publique SOGARA
    }
    // Ajouter d'autres établissements avec pages dédiées ici
    // if (establishment.nom.includes('CHU Libreville')) {
    //   return '/chu-libreville';
    // }
    return null;
  };
  
  // Fonction pour obtenir l'URL de gestion Super Admin d'un établissement
  const getManagementPageUrl = (establishment: Establishment): string | null => {
    if (establishment.nom.toLowerCase().includes('sogara') || 
        establishment.nom.toLowerCase().includes('cmst')) {
      return '/admin/establishments/sogara';
    }
    return null;
  };

  // Charger les 397 structures et ajouter un statut de revendication aléatoire pour la démo
  const [establishments, setEstablishments] = useState<Establishment[]>([]);

  useEffect(() => {
    // Charger les 397 structures et ajouter des statuts de revendication
    const loadEstablishments = () => {
      const data = (providersData as any[]).map((inst: any) => {
        // Simuler des statuts de revendication (80% non revendiqué, 15% en attente, 5% vérifié)
        const rand = Math.random();
        let claim_status: 'unclaimed' | 'claim_pending' | 'verified' = 'unclaimed';
        
        if (rand > 0.95) {
          claim_status = 'verified';
        } else if (rand > 0.80) {
          claim_status = 'claim_pending';
        }

        // Adapter le format CartographyProvider vers Establishment
        return {
          id: inst.id,
          nom: inst.nom,
          type: inst.type === 'hopital' ? 'hospital' :
                inst.type === 'clinique' ? 'clinic' :
                inst.type === 'pharmacie' ? 'pharmacy' :
                inst.type === 'laboratoire' ? 'laboratory' :
                inst.type === 'imagerie' ? 'imaging' :
                inst.type === 'cabinet_medical' ? 'cabinet_medical' : 'institution',
          province: inst.province,
          ville: inst.ville,
          coordonnees: inst.coordonnees ? { lat: inst.coordonnees.lat, lng: inst.coordonnees.lng } : { lat: 0, lng: 0 },
          adresse_descriptive: inst.adresse_descriptive,
          telephones: inst.telephones || [],
          email: inst.email,
          site_web: inst.site_web,
          services: inst.services || [],
          secteur: inst.secteur,
          conventionnement: inst.conventionnement,
          claim_status,
          claimed_by: claim_status !== 'unclaimed' ? `admin-${Math.floor(Math.random() * 100)}` : undefined,
          claimed_at: claim_status !== 'unclaimed' ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString() : undefined
        };
      });

      setEstablishments(data);
      console.log(`Loaded ${data.length} establishments from cartography-providers.json`);
    };

    loadEstablishments();
  }, []);

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      institution: "Institution",
      hospital: "Hôpital",
      clinic: "Clinique",
      pharmacy: "Pharmacie",
      laboratory: "Laboratoire",
      imaging: "Imagerie",
      cabinet_medical: "Cabinet médical",
      centre_sante: "Centre de santé",
      dispensaire: "Dispensaire",
      maternite: "Maternité"
    };
    return labels[type] || type;
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      institution: Building,
      hospital: Bed,
      pharmacy: Pill,
      laboratory: FlaskConical,
      cabinet_medical: Stethoscope,
      clinic: Building2
    };
    const Icon = icons[type] || Building2;
    return Icon;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      verified: { 
        label: "Vérifié", 
        className: "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30",
        icon: CheckCircle
      },
      claim_pending: { 
        label: "En attente", 
        className: "bg-orange-500/20 text-orange-700 dark:text-orange-400 border-orange-500/30",
        icon: Clock
      },
      unclaimed: { 
        label: "Non revendiqué", 
        className: "bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30",
        icon: AlertCircle
      }
    };
    const variant = variants[status] || variants.unclaimed;
    const Icon = variant.icon;
    
    return (
      <Badge variant="outline" className={variant.className}>
        <Icon className="w-3 h-3 mr-1" />
        {variant.label}
      </Badge>
    );
  };

  const getProvinceLabel = (code: string) => {
    const provinces: Record<string, string> = {
      "G1": "Estuaire",
      "G2": "Haut-Ogooué",
      "G3": "Moyen-Ogooué",
      "G4": "Ngounié",
      "G5": "Nyanga",
      "G6": "Ogooué-Ivindo",
      "G7": "Ogooué-Lolo",
      "G8": "Ogooué-Maritime",
      "G9": "Woleu-Ntem"
    };
    return provinces[code] || code;
  };

  // Filtrage
  const filteredEstablishments = useMemo(() => {
    return establishments.filter(est => {
      const matchesSearch = est.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           est.ville.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           (est.adresse_descriptive?.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesType = filterType === "all" || est.type === filterType;
      const matchesStatus = filterStatus === "all" || est.claim_status === filterStatus;
      const matchesProvince = filterProvince === "all" || est.province === filterProvince;
      return matchesSearch && matchesType && matchesStatus && matchesProvince;
    });
  }, [establishments, searchQuery, filterType, filterStatus, filterProvince]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, filterType, filterStatus, filterProvince]);

  const totalResults = filteredEstablishments.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalResults);
  const paginatedEstablishments = useMemo(() => {
    return filteredEstablishments.slice(startIndex, endIndex);
  }, [filteredEstablishments, startIndex, endIndex]);

  // Statistiques
  const stats = useMemo(() => {
    const typeCount = establishments.reduce((acc, est) => {
      acc[est.type] = (acc[est.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const claimCount = establishments.reduce((acc, est) => {
      acc[est.claim_status || 'unclaimed'] = (acc[est.claim_status || 'unclaimed'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: establishments.length,
      verified: claimCount.verified || 0,
      pending: claimCount.claim_pending || 0,
      unclaimed: claimCount.unclaimed || 0,
      hospitals: typeCount.hospital || 0,
      clinics: typeCount.clinic || 0,
      pharmacies: typeCount.pharmacy || 0,
      laboratories: typeCount.laboratory || 0,
      imaging: typeCount.imaging || 0,
      institutions: typeCount.institution || 0,
      cabinets: typeCount.cabinet_medical || 0,
      cnamgs: establishments.filter(e => e.conventionnement?.cnamgs).length
    };
  }, [establishments]);

  const provinces = ["G1", "G2", "G3", "G4", "G5", "G6", "G7", "G8", "G9"];

  const handleVerify = (id: string) => {
    setEstablishments(prev => prev.map(est => 
      est.id === id ? { ...est, claim_status: 'verified' as const, claimed_at: new Date().toISOString() } : est
    ));
    toast.success("Établissement vérifié avec succès");
  };

  const handleReject = (id: string) => {
    setEstablishments(prev => prev.map(est => 
      est.id === id ? { ...est, claim_status: 'unclaimed' as const, claimed_by: undefined } : est
    ));
    toast.error("Revendication rejetée");
  };

  const handleViewDetails = (establishment: Establishment) => {
    setSelectedEstablishment(establishment);
    setDetailsOpen(true);
  };

  // Convertir pour la carte
  const mapProviders = establishments.map(est => ({
    id: est.id,
    type: est.type === 'hospital' ? 'hopital' : 
          est.type === 'clinic' ? 'clinique' :
          est.type === 'pharmacy' ? 'pharmacie' :
          est.type === 'laboratory' ? 'laboratoire' :
          est.type === 'imaging' ? 'imagerie' :
          est.type === 'institution' ? 'institution' : 'cabinet_medical',
    nom: est.nom,
    name: est.nom,
    address: est.adresse_descriptive || est.ville,
    ville: est.ville,
    city: est.ville,
    coordonnees: est.coordonnees,
    lat: est.coordonnees.lat,
    lng: est.coordonnees.lng,
    phone: est.telephones?.[0],
    telephones: est.telephones,
    email: est.email,
    services: est.services || [],
    claimed: est.claim_status !== 'unclaimed'
  }));

  return (
    <SuperAdminLayoutSimple>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
              Gestion des Établissements
            </h1>
            <p className="text-muted-foreground mt-2">
              {stats.total} structures de santé référencées au Gabon
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Exporter
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">Total</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.verified}</div>
              <p className="text-xs text-muted-foreground mt-1">Vérifiés</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Clock className="h-5 w-5 text-orange-500" />
              </div>
              <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">En attente</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <AlertCircle className="h-5 w-5 text-gray-500" />
              </div>
              <div className="text-2xl font-bold text-gray-600">{stats.unclaimed}</div>
              <p className="text-xs text-muted-foreground mt-1">Non revendiqués</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Bed className="h-5 w-5 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{stats.hospitals}</div>
              <p className="text-xs text-muted-foreground mt-1">Hôpitaux</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Pill className="h-5 w-5 text-green-500" />
              </div>
              <div className="text-2xl font-bold">{stats.pharmacies}</div>
              <p className="text-xs text-muted-foreground mt-1">Pharmacies</p>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <FlaskConical className="h-5 w-5 text-purple-500" />
              </div>
              <div className="text-2xl font-bold">{stats.laboratories}</div>
              <p className="text-xs text-muted-foreground mt-1">Laboratoires</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Table / Map */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="table" className="gap-2">
              <Building2 className="w-4 h-4" />
              Liste ({filteredEstablishments.length})
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="w-4 h-4" />
              Carte
            </TabsTrigger>
          </TabsList>

          {/* Table View */}
          <TabsContent value="table" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle>Liste des établissements</CardTitle>
                    <CardDescription>
                      {filteredEstablishments.length} établissement(s) affiché(s)
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher par nom, ville ou adresse..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      <SelectItem value="hospital">Hôpitaux</SelectItem>
                      <SelectItem value="clinic">Cliniques</SelectItem>
                      <SelectItem value="pharmacy">Pharmacies</SelectItem>
                      <SelectItem value="laboratory">Laboratoires</SelectItem>
                      <SelectItem value="imaging">Imagerie</SelectItem>
                      <SelectItem value="cabinet_medical">Cabinets</SelectItem>
                      <SelectItem value="institution">Institutions</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="verified">Vérifiés</SelectItem>
                      <SelectItem value="claim_pending">En attente</SelectItem>
                      <SelectItem value="unclaimed">Non revendiqués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Select value={filterProvince} onValueChange={setFilterProvince}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Province" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les provinces</SelectItem>
                      {provinces.map(prov => (
                        <SelectItem key={prov} value={prov}>
                          {getProvinceLabel(prov)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {(searchQuery || filterType !== "all" || filterStatus !== "all" || filterProvince !== "all") && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterType("all");
                        setFilterStatus("all");
                        setFilterProvince("all");
                        setPage(1);
                      }}
                    >
                      Réinitialiser filtres
                    </Button>
                  )}
                </div>

                {/* Table */}
                <div className="border rounded-lg overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Établissement</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Localisation</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead>CNAMGS</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedEstablishments.map((est) => {
                        const TypeIcon = getTypeIcon(est.type);
                        return (
                          <TableRow key={est.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <TypeIcon className="w-5 h-5 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{est.nom}</span>
                                    {getEstablishmentPageUrl(est) && (
                                      <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30">
                                        <Home className="w-3 h-3 mr-1" />
                                        Page dédiée
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {est.services?.slice(0, 2).join(", ")}
                                    {est.services && est.services.length > 2 && "..."}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{getTypeLabel(est.type)}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center gap-1 text-sm font-medium">
                                  <MapPin className="w-3 h-3 text-muted-foreground" />
                                  {est.ville}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {getProvinceLabel(est.province)}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1 text-xs">
                                {est.telephones?.[0] && (
                                  <div className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-muted-foreground" />
                                    {est.telephones[0]}
                                  </div>
                                )}
                                {est.email && (
                                  <div className="flex items-center gap-1 truncate max-w-[200px]">
                                    <Mail className="w-3 h-3 text-muted-foreground" />
                                    {est.email}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(est.claim_status || 'unclaimed')}</TableCell>
                            <TableCell>
                              {est.conventionnement?.cnamgs ? (
                                <Badge variant="outline" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Oui
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-500/20 text-gray-700 dark:text-gray-400 border-gray-500/30">
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Non
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewDetails(est)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {est.claim_status === "claim_pending" && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleVerify(est.id)}
                                    >
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleReject(est.id)}
                                    >
                                      <XCircle className="w-4 h-4 text-red-600" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    {totalResults > 0 ? (
                      <span>
                        Affichage de {startIndex + 1}–{endIndex} sur {totalResults} résultats{totalResults > pageSize ? ". Utilisez les filtres pour affiner la recherche." : "."}
                      </span>
                    ) : (
                      <span>Aucun résultat</span>
                    )}
                  </div>
                  {totalPages > 1 && (
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.max(1, p - 1));
                            }}
                            className={page === 1 ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === page}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(p);
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPage((p) => Math.min(totalPages, p + 1));
                            }}
                            className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Map View */}
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>Carte des Établissements</CardTitle>
                <CardDescription>Visualisation géographique des {stats.total} structures</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[600px] rounded-lg overflow-hidden border">
                  <HealthProvidersMap 
                    providers={mapProviders}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedEstablishment && (
              <>
                <DialogHeader>
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const Icon = getTypeIcon(selectedEstablishment.type);
                        return <Icon className="w-7 h-7 text-primary" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <DialogTitle className="text-xl">{selectedEstablishment.nom}</DialogTitle>
                      <DialogDescription className="mt-1">
                        {getTypeLabel(selectedEstablishment.type)} • {selectedEstablishment.ville}
                      </DialogDescription>
                    </div>
                    {getStatusBadge(selectedEstablishment.claim_status || 'unclaimed')}
                  </div>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Informations générales */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Province</p>
                      <p className="text-sm">{getProvinceLabel(selectedEstablishment.province)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Ville</p>
                      <p className="text-sm">{selectedEstablishment.ville}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Secteur</p>
                      <p className="text-sm capitalize">{selectedEstablishment.secteur || "Non spécifié"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">CNAMGS</p>
                      <p className="text-sm">
                        {selectedEstablishment.conventionnement?.cnamgs ? (
                          <Badge variant="outline" className="bg-green-500/20 text-green-700">Conventionné</Badge>
                        ) : (
                          <Badge variant="outline">Non conventionné</Badge>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Adresse */}
                  {selectedEstablishment.adresse_descriptive && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Adresse</p>
                      <p className="text-sm flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                        {selectedEstablishment.adresse_descriptive}
                      </p>
                    </div>
                  )}

                  {/* Contact */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Contact</p>
                    <div className="space-y-2">
                      {selectedEstablishment.telephones?.map((phone, i) => (
                        <p key={i} className="text-sm flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {phone}
                        </p>
                      ))}
                      {selectedEstablishment.email && (
                        <p className="text-sm flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {selectedEstablishment.email}
                        </p>
                      )}
                      {selectedEstablishment.site_web && (
                        <p className="text-sm flex items-center gap-2">
                          <Globe className="w-4 h-4 text-muted-foreground" />
                          <a href={selectedEstablishment.site_web} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {selectedEstablishment.site_web}
                            <ExternalLink className="w-3 h-3 inline ml-1" />
                          </a>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Services */}
                  {selectedEstablishment.services && selectedEstablishment.services.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Services proposés</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedEstablishment.services.map((service, i) => (
                          <Badge key={i} variant="outline">{service}</Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coordonnées GPS */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Coordonnées GPS</p>
                    <p className="text-sm font-mono bg-muted/50 p-2 rounded">
                      {selectedEstablishment.coordonnees.lat}, {selectedEstablishment.coordonnees.lng}
                    </p>
                  </div>

                  {/* Actions */}
                  <DialogFooter className="flex-col sm:flex-row gap-2">
                    {/* Boutons d'accès si disponibles */}
                    {(() => {
                      const pageUrl = getEstablishmentPageUrl(selectedEstablishment);
                      const managementUrl = getManagementPageUrl(selectedEstablishment);
                      return (
                        <>
                          {pageUrl && (
                            <Button
                              variant="outline"
                              className="w-full sm:w-auto"
                              onClick={() => {
                                setDetailsOpen(false);
                                navigate(pageUrl);
                              }}
                            >
                              <Home className="w-4 h-4 mr-2" />
                              Page publique
                            </Button>
                          )}
                          {managementUrl && (
                            <Button
                              variant="default"
                              className="w-full sm:w-auto"
                              onClick={() => {
                                setDetailsOpen(false);
                                navigate(managementUrl);
                              }}
                            >
                              <Settings className="w-4 h-4 mr-2" />
                              Gérer l'établissement
                            </Button>
                          )}
                        </>
                      );
                    })()}
                    
                    {/* Boutons de validation pour les demandes en attente */}
                    {selectedEstablishment.claim_status === "claim_pending" && (
                      <>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            handleReject(selectedEstablishment.id);
                            setDetailsOpen(false);
                          }}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Rejeter
                        </Button>
                        <Button 
                          onClick={() => {
                            handleVerify(selectedEstablishment.id);
                            setDetailsOpen(false);
                          }}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Vérifier
                        </Button>
                      </>
                    )}
                  </DialogFooter>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </SuperAdminLayoutSimple>
  );
}
