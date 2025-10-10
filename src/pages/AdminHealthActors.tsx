import { useEffect, useState } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  Search, 
  Filter,
  Eye,
  Phone,
  Mail,
  MapPin,
  Shield,
  Plus,
  Stethoscope,
  Users,
  Activity,
  Bed,
  UserCog,
  CheckCircle2,
  XCircle,
  Ban,
  Download,
  FileCheck,
  AlertCircle,
  Edit,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: string;
  secteur: string;
  telephone_standard: string | null;
  email: string | null;
  province: string;
  ville: string;
  adresse_rue: string | null;
  nombre_lits_total: number;
  service_urgences_actif: boolean;
  statut: string;
  cnamgs_conventionne: boolean;
}

interface Professional {
  id: string;
  user_id: string;
  profession_type: string;
  specialization: string | null;
  ordre_number: string | null;
  ordre_verified: boolean;
  profiles: {
    full_name: string;
    email: string;
    phone: string;
    province: string;
  };
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

const professionTypes: Record<string, string> = {
  medecin: "Médecin",
  pharmacien: "Pharmacien",
  infirmier: "Infirmier(ère)",
  sage_femme: "Sage-femme",
  dentiste: "Dentiste",
  kinesitherapeute: "Kinésithérapeute",
  biologiste: "Biologiste médical"
};

export default function AdminHealthActors() {
  const { hasRole } = useAuth();
  const [activeTab, setActiveTab] = useState("establishments");
  
  // États pour établissements
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [establishmentSearch, setEstablishmentSearch] = useState("");
  const [establishmentTypeFilter, setEstablishmentTypeFilter] = useState("all");
  const [establishmentProvinceFilter, setEstablishmentProvinceFilter] = useState("all");
  
  // États pour professionnels
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [professionalSearch, setProfessionalSearch] = useState("");
  const [professionTypeFilter, setProfessionTypeFilter] = useState("all");
  const [professionalProvinceFilter, setProfessionalProvinceFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [actionType, setActionType] = useState<"approve" | "suspend" | "activate" | null>(null);

  const isSuperAdmin = hasRole("super_admin");
  const isAdmin = hasRole("admin") || isSuperAdmin;

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  useEffect(() => {
    filterEstablishments();
  }, [establishments, establishmentSearch, establishmentTypeFilter, establishmentProvinceFilter]);

  useEffect(() => {
    filterProfessionals();
  }, [professionals, professionalSearch, professionTypeFilter, professionalProvinceFilter, verifiedFilter]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Charger établissements
      const { data: estabData, error: estabError } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (estabError) throw estabError;
      setEstablishments(estabData || []);

      // Charger professionnels
      const { data: profData, error: profError } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          profiles!inner (
            full_name,
            email,
            phone,
            province
          )
        `)
        .order('created_at', { ascending: false });

      if (profError) throw profError;
      setProfessionals(profData || []);
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const filterEstablishments = () => {
    let filtered = establishments;

    if (establishmentSearch) {
      const term = establishmentSearch.toLowerCase();
      filtered = filtered.filter(e => 
        e.raison_sociale.toLowerCase().includes(term) ||
        e.email?.toLowerCase().includes(term) ||
        e.ville.toLowerCase().includes(term)
      );
    }

    if (establishmentTypeFilter !== "all") {
      filtered = filtered.filter(e => e.type_etablissement === establishmentTypeFilter);
    }

    if (establishmentProvinceFilter !== "all") {
      filtered = filtered.filter(e => e.province === establishmentProvinceFilter);
    }

    setFilteredEstablishments(filtered);
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    if (professionalSearch) {
      const term = professionalSearch.toLowerCase();
      filtered = filtered.filter(p => 
        p.profiles.full_name.toLowerCase().includes(term) ||
        p.profiles.email.toLowerCase().includes(term) ||
        p.ordre_number?.toLowerCase().includes(term)
      );
    }

    if (professionTypeFilter !== "all") {
      filtered = filtered.filter(p => p.profession_type === professionTypeFilter);
    }

    if (professionalProvinceFilter !== "all") {
      filtered = filtered.filter(p => p.profiles.province === professionalProvinceFilter);
    }

    if (verifiedFilter !== "all") {
      filtered = filtered.filter(p => 
        verifiedFilter === "verified" ? p.ordre_verified : !p.ordre_verified
      );
    }

    setFilteredProfessionals(filtered);
  };

  const provinces = Array.from(
    new Set([
      ...establishments.map(e => e.province),
      ...professionals.map(p => p.profiles.province)
    ])
  ).sort();

  const stats = {
    totalEstablishments: establishments.length,
    activeEstablishments: establishments.filter(e => e.statut === 'actif').length,
    totalProfessionals: professionals.length,
    verifiedProfessionals: professionals.filter(p => p.ordre_verified).length,
    privateEstablishments: establishments.filter(e => e.secteur === 'prive').length,
    doctors: professionals.filter(p => p.profession_type === 'medecin').length,
  };

  const handleApproveEstablishment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('establishments')
        .update({ statut: 'actif' })
        .eq('id', id);

      if (error) throw error;
      
      await loadData();
      setShowStatusDialog(false);
      toast.success("Établissement approuvé avec succès");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleSuspendEstablishment = async (id: string) => {
    try {
      const { error } = await supabase
        .from('establishments')
        .update({ statut: 'suspendu' })
        .eq('id', id);

      if (error) throw error;
      
      await loadData();
      setShowStatusDialog(false);
      toast.success("Établissement suspendu");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Erreur lors de la suspension");
    }
  };

  const handleVerifyProfessional = async (id: string) => {
    try {
      const { error } = await supabase
        .from('professional_profiles')
        .update({ ordre_verified: true })
        .eq('id', id);

      if (error) throw error;
      
      await loadData();
      setShowStatusDialog(false);
      toast.success("Professionnel vérifié avec succès");
    } catch (error: any) {
      console.error('Error:', error);
      toast.error("Erreur lors de la vérification");
    }
  };

  const handleAction = () => {
    if (!selectedItem || !actionType) return;

    const isEstablishment = 'raison_sociale' in selectedItem;

    if (isEstablishment) {
      if (actionType === 'approve') {
        handleApproveEstablishment(selectedItem.id);
      } else if (actionType === 'suspend') {
        handleSuspendEstablishment(selectedItem.id);
      }
    } else {
      if (actionType === 'approve') {
        handleVerifyProfessional(selectedItem.id);
      }
    }
  };

  const openActionDialog = (item: any, action: "approve" | "suspend" | "activate") => {
    setSelectedItem(item);
    setActionType(action);
    setShowStatusDialog(true);
  };

  const exportData = () => {
    const data = activeTab === 'establishments' ? filteredEstablishments : filteredProfessionals;
    const csv = [
      Object.keys(data[0] || {}).join(','),
      ...data.map(item => Object.values(item).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString()}.csv`;
    a.click();
    
    toast.success("Export réussi");
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
      <div className="w-full max-w-7xl mx-auto space-y-4">
        {/* Header compact */}
        <Card className="border-2">
          <CardHeader className="p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 shrink-0">
                <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl md:text-3xl font-bold truncate">Acteurs de Santé</h1>
                <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">
                  Gérez les établissements et professionnels du réseau SANTE.GA
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats compactes */}
        <Card className="border-2">
          <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
            <CardTitle className="text-sm sm:text-base">Statistiques</CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-4 pt-0">
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 border">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Établ.</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalEstablishments}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Actifs</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.activeEstablishments}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 border">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Prof.</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.totalProfessionals}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Vérif.</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">{stats.verifiedProfessionals}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-muted/50 border">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Privé</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold">{stats.privateEstablishments}</div>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-[10px] sm:text-xs text-muted-foreground mb-0.5">Médec.</div>
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">{stats.doctors}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Onglets compacts */}
        <Card className="border-2">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b">
                <TabsList className="w-full grid grid-cols-2 h-auto bg-transparent p-0">
                  <TabsTrigger 
                    value="establishments" 
                    className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Établissements</span>
                    <span className="xs:hidden">Étab.</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="professionals" 
                    className="flex items-center justify-center gap-1.5 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                  >
                    <Stethoscope className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Professionnels</span>
                    <span className="xs:hidden">Prof.</span>
                  </TabsTrigger>
                </TabsList>
              </div>

          {/* Onglet Établissements */}
          <TabsContent value="establishments" className="space-y-3 sm:space-y-4 mt-0 p-3 sm:p-4">
            <Card className="border shadow-sm">
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <CardTitle className="flex items-center gap-1.5 text-sm sm:text-base">
                  <Filter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="estab-search" className="text-xs">
                      <Search className="h-3 w-3 inline mr-1" />
                      Rechercher
                    </Label>
                    <Input
                      id="estab-search"
                      placeholder="Nom, ville..."
                      value={establishmentSearch}
                      onChange={(e) => setEstablishmentSearch(e.target.value)}
                      className="h-8 sm:h-9 text-xs sm:text-sm"
                    />
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="estab-type" className="text-xs">Type</Label>
                    <Select value={establishmentTypeFilter} onValueChange={setEstablishmentTypeFilter}>
                      <SelectTrigger id="estab-type" className="h-8 sm:h-9 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(establishmentTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="estab-province" className="text-xs">Province</Label>
                    <Select value={establishmentProvinceFilter} onValueChange={setEstablishmentProvinceFilter}>
                      <SelectTrigger id="estab-province" className="h-8 sm:h-9 text-xs sm:text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="all">Toutes</SelectItem>
                        {provinces.map(province => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader className="p-3 sm:p-4 pb-2 sm:pb-3">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <CardTitle className="text-sm sm:text-base">
                    Résultats ({filteredEstablishments.length})
                  </CardTitle>
                  <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" onClick={exportData} className="flex-1 sm:flex-none h-8 text-xs">
                      <Download className="mr-1 h-3 w-3" />
                      <span className="hidden xs:inline">Export</span>
                    </Button>
                    <Button size="sm" className="flex-1 sm:flex-none h-8 text-xs">
                      <Plus className="mr-1 h-3 w-3" />
                      <span className="hidden sm:inline">Nouveau</span>
                      <span className="sm:hidden">+</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground text-xs sm:text-sm">Chargement...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                      <Table className="text-xs sm:text-sm">
                        <TableHeader className="hidden sm:table-header-group">
                          <TableRow>
                            <TableHead>Nom</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Localisation</TableHead>
                            <TableHead>Capacité</TableHead>
                            <TableHead>CNAMGS</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEstablishments.map((establishment) => (
                            <TableRow key={establishment.id} className="block sm:table-row border-b sm:border-b-0 py-3 sm:py-0">
                              {/* Vue mobile - cards */}
                              <TableCell className="block sm:hidden p-4" colSpan={8}>
                                <div className="space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="font-semibold text-base mb-1">
                                        {establishment.raison_sociale}
                                      </div>
                                      <div className="flex gap-2 mb-2">
                                        <Badge variant="outline" className="text-xs">
                                          {establishmentTypes[establishment.type_etablissement] || establishment.type_etablissement}
                                        </Badge>
                                        <Badge variant="secondary" className="text-xs">
                                          {establishment.secteur}
                                        </Badge>
                                      </div>
                                    </div>
                                    {establishment.statut === 'actif' && (
                                      <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20 text-xs">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Actif
                                      </Badge>
                                    )}
                                    {establishment.statut === 'en_validation' && (
                                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 text-xs">
                                        <AlertCircle className="h-3 w-3 mr-1" />
                                        Validation
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                      <div className="text-muted-foreground mb-1">Contact</div>
                                      {establishment.telephone_standard && (
                                        <div className="flex items-center gap-1">
                                          <Phone className="h-3 w-3" />
                                          {establishment.telephone_standard}
                                        </div>
                                      )}
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">Localisation</div>
                                      <div>{establishment.ville}</div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">Capacité</div>
                                      <div className="flex items-center gap-1">
                                        <Bed className="h-3 w-3" />
                                        {establishment.nombre_lits_total || 0} lits
                                      </div>
                                    </div>
                                    <div>
                                      <div className="text-muted-foreground mb-1">CNAMGS</div>
                                      {establishment.cnamgs_conventionne ? (
                                        <Badge variant="default" className="text-xs">Conv.</Badge>
                                      ) : (
                                        <Badge variant="secondary" className="text-xs">Non</Badge>
                                      )}
                                    </div>
                                  </div>

                                  <div className="flex gap-2 pt-2 border-t">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-xs"
                                      onClick={() => {
                                        setSelectedItem(establishment);
                                        setShowDetailsDialog(true);
                                      }}
                                    >
                                      <Eye className="h-3 w-3 mr-1" />
                                      Détails
                                    </Button>
                                    {establishment.statut === 'en_validation' && (
                                      <Button
                                        size="sm"
                                        className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
                                        onClick={() => openActionDialog(establishment, 'approve')}
                                      >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Approuver
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              {/* Vue desktop - table */}
                              <TableCell className="hidden sm:table-cell font-medium">
                                {establishment.raison_sociale}
                              </TableCell>
                              <TableCell className="hidden sm:table-cell">
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
                                <div>{establishment.ville}</div>
                                <div className="text-muted-foreground">{establishment.province}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 text-sm">
                                <Bed className="h-3 w-3" />
                                {establishment.nombre_lits_total || 0} lits
                              </div>
                            </TableCell>
                            <TableCell>
                              {establishment.cnamgs_conventionne ? (
                                <Badge variant="default">Conventionné</Badge>
                              ) : (
                                <Badge variant="secondary">Non</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {establishment.statut === 'actif' && (
                                <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Actif
                                </Badge>
                              )}
                              {establishment.statut === 'en_validation' && (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  En validation
                                </Badge>
                              )}
                              {establishment.statut === 'suspendu' && (
                                <Badge variant="destructive">
                                  <Ban className="h-3 w-3 mr-1" />
                                  Suspendu
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(establishment);
                                    setShowDetailsDialog(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {establishment.statut === 'en_validation' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => openActionDialog(establishment, 'approve')}
                                  >
                                    <CheckCircle2 className="h-4 w-4" />
                                  </Button>
                                )}
                                {establishment.statut === 'actif' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-red-600 hover:text-red-700"
                                    onClick={() => openActionDialog(establishment, 'suspend')}
                                  >
                                    <Ban className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Professionnels */}
          <TabsContent value="professionals" className="space-y-4 sm:space-y-6 mt-4 sm:mt-6 px-4 sm:px-0">
            <Card className="border shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtres
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="prof-search">
                      <Search className="h-4 w-4 inline mr-2" />
                      Rechercher
                    </Label>
                    <Input
                      id="prof-search"
                      placeholder="Nom, email, n° ordre..."
                      value={professionalSearch}
                      onChange={(e) => setProfessionalSearch(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="prof-type">Profession</Label>
                    <Select value={professionTypeFilter} onValueChange={setProfessionTypeFilter}>
                      <SelectTrigger id="prof-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="all">Toutes</SelectItem>
                        {Object.entries(professionTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-province">Province</Label>
                    <Select value={professionalProvinceFilter} onValueChange={setProfessionalProvinceFilter}>
                      <SelectTrigger id="prof-province">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="all">Toutes</SelectItem>
                        {provinces.map(province => (
                          <SelectItem key={province} value={province}>{province}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="prof-verified">Vérification</Label>
                    <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                      <SelectTrigger id="prof-verified">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="verified">Vérifiés</SelectItem>
                        <SelectItem value="unverified">Non vérifiés</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border shadow-sm">
              <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <CardTitle>Résultats ({filteredProfessionals.length})</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={exportData}>
                      <Download className="mr-2 h-4 w-4" />
                      Exporter
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Nouveau Professionnel
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-muted-foreground">Chargement...</div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Professionnel</TableHead>
                          <TableHead>Profession</TableHead>
                          <TableHead>Spécialisation</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>N° Ordre</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProfessionals.map((professional) => (
                          <TableRow key={professional.id}>
                            <TableCell className="font-medium">
                              {professional.profiles.full_name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {professionTypes[professional.profession_type] || professional.profession_type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {professional.specialization || '-'}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                <div className="flex items-center gap-1">
                                  <Mail className="h-3 w-3" />
                                  {professional.profiles.email}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Phone className="h-3 w-3" />
                                  {professional.profiles.phone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {professional.profiles.province}
                              </div>
                            </TableCell>
                            <TableCell>
                              {professional.ordre_number || '-'}
                            </TableCell>
                            <TableCell>
                              {professional.ordre_verified ? (
                                <Badge variant="default" className="bg-green-500/10 text-green-600 border-green-500/20">
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Vérifié
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  En attente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedItem(professional);
                                    setShowDetailsDialog(true);
                                  }}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                {!professional.ordre_verified && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-green-600 hover:text-green-700"
                                    onClick={() => openActionDialog(professional, 'approve')}
                                  >
                                    <FileCheck className="h-4 w-4" />
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
          </TabsContent>
        </Tabs>
          </CardContent>
        </Card>

        {/* Dialog de détails amélioré */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedItem && ('raison_sociale' in selectedItem ? (
                  <>
                    <Building2 className="h-5 w-5 text-primary" />
                    Détails de l'établissement
                  </>
                ) : (
                  <>
                    <Stethoscope className="h-5 w-5 text-primary" />
                    Détails du professionnel
                  </>
                ))}
              </DialogTitle>
              <DialogDescription>
                Informations complètes et options de gestion
              </DialogDescription>
            </DialogHeader>
            {selectedItem && (
              <div className="space-y-6">
                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-4">
                  {'raison_sociale' in selectedItem ? (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Nom</Label>
                        <p className="font-medium">{selectedItem.raison_sociale}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Type</Label>
                        <p className="font-medium">
                          {establishmentTypes[selectedItem.type_etablissement] || selectedItem.type_etablissement}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Secteur</Label>
                        <p className="font-medium">{selectedItem.secteur}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Statut</Label>
                        <p className="font-medium">{selectedItem.statut}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Province</Label>
                        <p className="font-medium">{selectedItem.province}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Ville</Label>
                        <p className="font-medium">{selectedItem.ville}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Téléphone</Label>
                        <p className="font-medium">{selectedItem.telephone_standard || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedItem.email || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Nombre de lits</Label>
                        <p className="font-medium">{selectedItem.nombre_lits_total || 0}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">CNAMGS</Label>
                        <p className="font-medium">
                          {selectedItem.cnamgs_conventionne ? 'Conventionné' : 'Non conventionné'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <Label className="text-xs text-muted-foreground">Nom complet</Label>
                        <p className="font-medium">{selectedItem.profiles.full_name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Profession</Label>
                        <p className="font-medium">
                          {professionTypes[selectedItem.profession_type] || selectedItem.profession_type}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Spécialisation</Label>
                        <p className="font-medium">{selectedItem.specialization || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">N° Ordre</Label>
                        <p className="font-medium">{selectedItem.ordre_number || '-'}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="font-medium">{selectedItem.profiles.email}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Téléphone</Label>
                        <p className="font-medium">{selectedItem.profiles.phone}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Province</Label>
                        <p className="font-medium">{selectedItem.profiles.province}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Statut vérification</Label>
                        <p className="font-medium">
                          {selectedItem.ordre_verified ? 'Vérifié' : 'En attente'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Actions rapides */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Actions rapides</Label>
                  <div className="flex flex-wrap gap-2">
                    {'raison_sociale' in selectedItem ? (
                      <>
                        {selectedItem.statut === 'en_validation' && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setShowDetailsDialog(false);
                              openActionDialog(selectedItem, 'approve');
                            }}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approuver
                          </Button>
                        )}
                        {selectedItem.statut === 'actif' && (
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => {
                              setShowDetailsDialog(false);
                              openActionDialog(selectedItem, 'suspend');
                            }}
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Suspendre
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                      </>
                    ) : (
                      <>
                        {!selectedItem.ordre_verified && (
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => {
                              setShowDetailsDialog(false);
                              openActionDialog(selectedItem, 'approve');
                            }}
                          >
                            <FileCheck className="mr-2 h-4 w-4" />
                            Vérifier
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDetailsDialog(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog d'action avec confirmation */}
        <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actionType === 'approve' && 'Confirmer l\'approbation'}
                {actionType === 'suspend' && 'Confirmer la suspension'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actionType === 'approve' && selectedItem && (
                  <>
                    {'raison_sociale' in selectedItem ? (
                      <>Êtes-vous sûr de vouloir approuver l'établissement <strong>{selectedItem.raison_sociale}</strong> ? Il deviendra actif sur la plateforme.</>
                    ) : (
                      <>Êtes-vous sûr de vouloir vérifier le professionnel <strong>{selectedItem.profiles?.full_name}</strong> ? Son compte sera certifié.</>
                    )}
                  </>
                )}
                {actionType === 'suspend' && selectedItem && (
                  <>Êtes-vous sûr de vouloir suspendre <strong>{selectedItem.raison_sociale}</strong> ? L'établissement ne sera plus visible sur la plateforme.</>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleAction}>
                Confirmer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </SuperAdminLayout>
  );
}
