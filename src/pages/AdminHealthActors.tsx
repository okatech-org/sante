import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, Users, Search, Download, Shield, CheckCircle, XCircle, Clock, FileText, Upload, Link as LinkIcon, Mail, ArrowUpDown, Eye, Edit, Trash2, MoreVertical, Filter, Grid3x3, List, ChevronLeft, ChevronRight, RefreshCw, MapPin, Phone, Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import cartographyProviders from "@/data/cartography-providers.json";
import { getOSMProvidersFromSupabase } from "@/utils/osm-supabase-sync";

interface Establishment {
  id: string;
  raison_sociale: string;
  type_etablissement: string;
  secteur: string;
  ville: string;
  province: string;
  statut: string;
  email: string | null;
  telephone_standard: string | null;
  created_at: string;
  account_claimed: boolean;
  claimed_at: string | null;
  invitation_token: string | null;
}

interface Professional {
  id: string;
  user_id: string;
  profession_type: string;
  specialization: string | null;
  ordre_number: string | null;
  ordre_verified: boolean;
  created_at: string;
  profile?: {
    full_name: string;
    email: string;
    phone: string;
  };
}

const establishmentTypes: Record<string, string> = {
  hopital: 'Hôpital',
  clinique: 'Clinique',
  centre_sante: 'Centre de santé',
  dispensaire: 'Dispensaire',
  pharmacie: 'Pharmacie',
  laboratoire: 'Laboratoire',
  cabinet_medical: 'Cabinet médical'
};

const professionTypes: Record<string, string> = {
  doctor: 'Médecin',
  nurse: 'Infirmier(ère)',
  pharmacist: 'Pharmacien(ne)',
  lab_tech: 'Technicien de laboratoire',
  dentist: 'Dentiste',
  specialist: 'Spécialiste'
};

const statusColors: Record<string, string> = {
  actif: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-400/30',
  en_validation: 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-400/30',
  suspendu: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 text-red-400 border-red-400/30',
  inactif: 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-400/30'
};

export default function AdminHealthActors() {
  const { isSuperAdmin } = useAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [claimFilter, setClaimFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [showJsonData, setShowJsonData] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEstablishments();
  }, [searchTerm, statusFilter, typeFilter, claimFilter, sortBy, establishments]);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, professionals]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Charger d'abord les données du JSON
      const typeMap: Record<string, any> = {
        'hopital': 'chu',
        'clinique': 'clinique',
        'polyclinique': 'clinique',
        'chr': 'chr',
        'chu': 'chu',
        'centre_medical': 'centre_medical',
        'hopital_confessionnel': 'chu',
        'hopital_departemental': 'chr',
        'pharmacie': 'pharmacie',
        'laboratoire': 'laboratoire',
        'cabinet_medical': 'centre_medical',
        'cabinet_dentaire': 'centre_medical',
        'imagerie': 'centre_medical'
      };

      const secteurMap: Record<string, any> = {
        'public': 'public',
        'prive': 'prive',
        'parapublic': 'parapublic',
        'confessionnel': 'confessionnel',
        'ong': 'ong',
        'militaire': 'militaire'
      };

      // Transformer TOUTES les données JSON en format Establishment
      const jsonEstablishments = cartographyProviders.map((provider: any, index: number) => ({
        id: provider.id || `json-${index}`,
        raison_sociale: provider.nom,
        type_etablissement: typeMap[provider.type?.toLowerCase()] || 'centre_medical',
        secteur: secteurMap[provider.secteur?.toLowerCase()] || 'prive',
        ville: provider.ville,
        province: provider.province,
        statut: 'actif',
        email: provider.email || null,
        telephone_standard: provider.telephones?.[0] || null,
        created_at: new Date().toISOString(),
        account_claimed: false,
        claimed_at: null,
        invitation_token: null,
        isFromJson: true // Marqueur pour identifier les entrées JSON
      }));

      console.log(`Chargement de ${jsonEstablishments.length} acteurs depuis le JSON`);

      // Load OSM providers from DB
      const osmProviders = await getOSMProvidersFromSupabase();
      const osmEstablishments = osmProviders.map((provider: any, index: number) => ({
        id: provider.id,
        raison_sociale: provider.nom,
        type_etablissement: typeMap[provider.type?.toLowerCase()] || 'centre_medical',
        secteur: secteurMap[provider.secteur?.toLowerCase()] || 'prive',
        ville: provider.ville,
        province: provider.province,
        statut: 'actif',
        email: provider.email || null,
        telephone_standard: provider.telephones?.[0] || null,
        created_at: new Date().toISOString(),
        account_claimed: false,
        claimed_at: null,
        invitation_token: null,
        isFromJson: true,
        source: 'osm'
      }));

      console.log(`Chargement de ${osmEstablishments.length} acteurs depuis OSM`);

      // Load establishments from DB
      const { data: estData, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (estError) throw estError;

      console.log(`Chargement de ${estData?.length || 0} établissements depuis la DB`);

      // Combiner toutes les sources
      // Priorité aux données DB si elles existent (éviter les doublons)
      const dbNames = new Set(estData?.map(e => e.raison_sociale.toLowerCase()) || []);
      const uniqueJsonEstablishments = jsonEstablishments.filter(
        je => !dbNames.has(je.raison_sociale.toLowerCase())
      );
      const uniqueOsmEstablishments = osmEstablishments.filter(
        oe => !dbNames.has(oe.raison_sociale.toLowerCase())
      );

      console.log(`${uniqueJsonEstablishments.length} acteurs uniques du JSON non encore en DB`);
      console.log(`${uniqueOsmEstablishments.length} acteurs uniques OSM non encore en DB`);

      // Marquer les données DB
      const dbEstablishments = (estData || []).map(e => ({ ...e, isFromJson: false, source: 'db' }));

      setEstablishments([...dbEstablishments, ...uniqueJsonEstablishments, ...uniqueOsmEstablishments]);

      // Load professionals with profiles
      const { data: profData, error: profError } = await supabase
        .from('professional_profiles')
        .select(`
          *,
          profile:profiles(full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (profError) throw profError;
      setProfessionals(profData || []);

    } catch (error: any) {
      toast.error("Erreur lors du chargement des données");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEstablishments = () => {
    let filtered = establishments;

    if (searchTerm) {
      filtered = filtered.filter(est =>
        est.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.ville.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(est => est.statut === statusFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(est => est.type_etablissement === typeFilter);
    }

    if (claimFilter === "claimed") {
      filtered = filtered.filter(est => est.account_claimed === true);
    } else if (claimFilter === "unclaimed") {
      filtered = filtered.filter(est => est.account_claimed === false);
    }

    // Tri intelligent
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.raison_sociale.localeCompare(b.raison_sociale);
        case "name-desc":
          return b.raison_sociale.localeCompare(a.raison_sociale);
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "city-asc":
          return a.ville.localeCompare(b.ville);
        case "city-desc":
          return b.ville.localeCompare(a.ville);
        case "type-asc":
          return a.type_etablissement.localeCompare(b.type_etablissement);
        case "type-desc":
          return b.type_etablissement.localeCompare(a.type_etablissement);
        case "status-claimed":
          return (b.account_claimed ? 1 : 0) - (a.account_claimed ? 1 : 0);
        case "status-unclaimed":
          return (a.account_claimed ? 1 : 0) - (b.account_claimed ? 1 : 0);
        default:
          return 0;
      }
    });

    setFilteredEstablishments(filtered);
  };

  const filterProfessionals = () => {
    let filtered = professionals;

    if (searchTerm) {
      filtered = filtered.filter(prof =>
        prof.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prof.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProfessionals(filtered);
  };

  const handleApprove = async (id: string, type: 'establishment' | 'professional') => {
    try {
      if (type === 'establishment') {
        const { error } = await supabase
          .from('establishments')
          .update({ statut: 'actif' as any })
          .eq('id', id);
        if (error) throw error;
      }
      
      toast.success("Approuvé avec succès");
      loadData();
    } catch (error: any) {
      toast.error("Erreur lors de l'approbation");
    }
  };

  const handleSuspend = async (id: string, type: 'establishment' | 'professional') => {
    try {
      if (type === 'establishment') {
        const { error } = await supabase
          .from('establishments')
          .update({ statut: 'suspendu' as any })
          .eq('id', id);
        if (error) throw error;
      }
      
      toast.success("Suspendu avec succès");
      loadData();
    } catch (error: any) {
      toast.error("Erreur lors de la suspension");
    }
  };

  const handleImportCartography = async () => {
    try {
      setIsImporting(true);
      toast.info("Import en cours...");

      // Map des types
      const typeMap: Record<string, any> = {
        'hopital': 'hopital',
        'clinique': 'clinique',
        'polyclinique': 'polyclinique',
        'chr': 'chr',
        'chu': 'chu',
        'centre_medical': 'centre_medical',
        'hopital_confessionnel': 'hopital_confessionnel',
        'hopital_departemental': 'hopital_departemental',
        'pharmacie': 'hopital',
        'laboratoire': 'hopital'
      };

      const secteurMap: Record<string, any> = {
        'Public': 'public',
        'Privé': 'prive',
        'Mixte': 'parapublic',
        'Confessionnel': 'confessionnel'
      };

      // Préparer les données
      const establishmentsToInsert = cartographyProviders.map((provider: any) => ({
        raison_sociale: provider.nom,
        type_etablissement: (typeMap[provider.type] || 'hopital') as any,
        secteur: (secteurMap[provider.secteur] || 'prive') as any,
        ville: provider.ville,
        province: provider.province,
        adresse_rue: provider.adresse_descriptive || '',
        telephone_standard: provider.telephones?.[0] || null,
        email: provider.email || null,
        latitude: provider.coordonnees?.lat ? parseFloat(provider.coordonnees.lat) : null,
        longitude: provider.coordonnees?.lng ? parseFloat(provider.coordonnees.lng) : null,
        statut: 'actif' as any,
        account_claimed: false,
        numero_autorisation: `AUTO-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));

      // Insertion par lots
      const batchSize = 50;
      for (let i = 0; i < establishmentsToInsert.length; i += batchSize) {
        const batch = establishmentsToInsert.slice(i, i + batchSize);
        const { error } = await supabase
          .from('establishments')
          .insert(batch);

        if (error) {
          console.error('Batch error:', error);
          throw error;
        }
      }

      toast.success(`${establishmentsToInsert.length} établissements importés avec succès`);
      loadData();
    } catch (error: any) {
      toast.error("Erreur lors de l'import: " + error.message);
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleGenerateToken = async (establishment: Establishment) => {
    try {
      const { data, error } = await supabase.rpc('generate_establishment_invitation_token', {
        _establishment_id: establishment.id
      });

      if (error) throw error;

      setGeneratedToken(data);
      setSelectedEstablishment(establishment);
      setShowTokenDialog(true);
      toast.success("Token généré avec succès");
    } catch (error: any) {
      toast.error("Erreur lors de la génération du token");
      console.error(error);
    }
  };

  const copyInvitationLink = () => {
    const link = `${window.location.origin}/claim-establishment/${generatedToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien copié dans le presse-papier");
  };

  const exportData = (type: 'establishments' | 'professionals') => {
    if (type === 'establishments') {
      const csv = [
        ['Nom', 'Type', 'Secteur', 'Ville', 'Province', 'Statut', 'Email', 'Téléphone'],
        ...filteredEstablishments.map(e => [
          e.raison_sociale,
          establishmentTypes[e.type_etablissement] || e.type_etablissement,
          e.secteur,
          e.ville,
          e.province,
          e.statut,
          e.email || '',
          e.telephone_standard || ''
        ])
      ].map(row => row.join(',')).join('\n');

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `etablissements_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
    }
  };

  const handleBulkAction = async (action: 'approve' | 'suspend' | 'delete') => {
    if (selectedIds.length === 0) {
      toast.error("Aucun élément sélectionné");
      return;
    }

    try {
      if (action === 'approve') {
        for (const id of selectedIds) {
          await supabase
            .from('establishments')
            .update({ statut: 'actif' as any })
            .eq('id', id);
        }
        toast.success(`${selectedIds.length} établissement(s) approuvé(s)`);
      } else if (action === 'suspend') {
        for (const id of selectedIds) {
          await supabase
            .from('establishments')
            .update({ statut: 'suspendu' as any })
            .eq('id', id);
        }
        toast.success(`${selectedIds.length} établissement(s) suspendu(s)`);
      } else if (action === 'delete') {
        for (const id of selectedIds) {
          await supabase
            .from('establishments')
            .delete()
            .eq('id', id);
        }
        toast.success(`${selectedIds.length} établissement(s) supprimé(s)`);
      }
      
      setSelectedIds([]);
      loadData();
    } catch (error: any) {
      toast.error("Erreur lors de l'action groupée");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedEstablishments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedEstablishments.map(e => e.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredEstablishments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEstablishments = filteredEstablishments.slice(startIndex, endIndex);

  if (!isSuperAdmin) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
              <p className="text-muted-foreground">Seuls les super admins peuvent accéder à cette page.</p>
            </CardContent>
          </Card>
        </div>
      </SuperAdminLayout>
    );
  }

  const stats = {
    total: establishments.length,
    imported: establishments.filter((e: any) => e.isFromJson === false).length,
    notImported: establishments.filter((e: any) => e.isFromJson === true).length,
    professionals: professionals.length,
    pending: establishments.filter(e => e.statut === 'en_validation').length,
    active: establishments.filter(e => e.statut === 'actif').length,
    claimed: establishments.filter(e => e.account_claimed === true).length,
    unclaimed: establishments.filter(e => e.account_claimed === false).length
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Acteurs de Santé
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérez les établissements et professionnels de santé
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { label: 'Total acteurs', value: stats.total, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Importés en DB', value: stats.imported, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'Non importés', value: stats.notImported, icon: FileText, color: 'from-orange-500 to-amber-500' },
            { label: 'Professionnels', value: stats.professionals, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'En validation', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-amber-500' },
            { label: 'Actifs', value: stats.active, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
            { label: 'Revendiqués', value: stats.claimed, icon: LinkIcon, color: 'from-indigo-500 to-purple-500' },
            { label: 'Non revendiqués', value: stats.unclaimed, icon: XCircle, color: 'from-red-500 to-pink-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/70 transition-all">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center self-start`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Banner */}
        <Card className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-blue-400">
                  {cartographyProviders.length} acteurs de santé référencés dans la cartographie
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Les données affichées incluent les établissements de la base de données et ceux du référentiel cartographique.
                  Utilisez le bouton "Importer Carto" pour ajouter définitivement les établissements non importés.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="establishments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="establishments">Établissements</TabsTrigger>
            <TabsTrigger value="professionals">Professionnels</TabsTrigger>
          </TabsList>

          {/* Establishments Tab */}
          <TabsContent value="establishments" className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="gap-2"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Liste</span>
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="gap-2"
                >
                  <Grid3x3 className="w-4 h-4" />
                  <span className="hidden sm:inline">Grille</span>
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {selectedIds.length > 0 && (
                  <>
                    <Badge variant="secondary" className="px-3 py-1">
                      {selectedIds.length} sélectionné(s)
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <MoreVertical className="w-4 h-4" />
                          Actions groupées
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-background border-border z-50">
                        <DropdownMenuItem onClick={() => handleBulkAction('approve')} className="gap-2 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          Approuver
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBulkAction('suspend')} className="gap-2 text-orange-600">
                          <XCircle className="w-4 h-4" />
                          Suspendre
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleBulkAction('delete')} className="gap-2 text-red-600">
                          <Trash2 className="w-4 h-4" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
                      Désélectionner
                    </Button>
                  </>
                )}
                
                <Button 
                  onClick={handleImportCartography} 
                  variant="outline" 
                  size="sm"
                  disabled={isImporting}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span className="hidden sm:inline">{isImporting ? "Import..." : "Importer"}</span>
                </Button>
                <Button onClick={() => exportData('establishments')} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Exporter</span>
                </Button>
                <Button onClick={loadData} variant="outline" size="sm" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtres & Recherche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recherche */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou ville..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background/50"
                  />
                </div>

                {/* Grille de filtres */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Tri */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">
                      <ArrowUpDown className="w-3 h-3 inline mr-1" />
                      Trier par
                    </label>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="date-desc">Plus récent d'abord</SelectItem>
                        <SelectItem value="date-asc">Plus ancien d'abord</SelectItem>
                        <SelectItem value="name-asc">Nom (A → Z)</SelectItem>
                        <SelectItem value="name-desc">Nom (Z → A)</SelectItem>
                        <SelectItem value="city-asc">Ville (A → Z)</SelectItem>
                        <SelectItem value="city-desc">Ville (Z → A)</SelectItem>
                        <SelectItem value="type-asc">Type (A → Z)</SelectItem>
                        <SelectItem value="status-claimed">Revendiqués d'abord</SelectItem>
                        <SelectItem value="status-unclaimed">Non revendiqués d'abord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Statut */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Statut</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="actif">Actif</SelectItem>
                        <SelectItem value="en_validation">En validation</SelectItem>
                        <SelectItem value="suspendu">Suspendu</SelectItem>
                        <SelectItem value="inactif">Inactif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Type</label>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="all">Tous les types</SelectItem>
                        {Object.entries(establishmentTypes).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Revendication */}
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block font-medium">Revendication</label>
                    <Select value={claimFilter} onValueChange={setClaimFilter}>
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="all">Tous</SelectItem>
                        <SelectItem value="claimed">Revendiqués</SelectItem>
                        <SelectItem value="unclaimed">Non revendiqués</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Reset */}
                  <div className="flex items-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSearchTerm("");
                        setStatusFilter("all");
                        setTypeFilter("all");
                        setClaimFilter("all");
                        setSortBy("date-desc");
                      }}
                    >
                      Réinitialiser
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Content */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-primary" />
                  <p className="text-muted-foreground">Chargement des données...</p>
                </div>
              </div>
            ) : viewMode === 'list' ? (
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Établissements ({filteredEstablishments.length})
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Afficher:</span>
                    <Select value={itemsPerPage.toString()} onValueChange={(v) => {setItemsPerPage(Number(v)); setCurrentPage(1);}}>
                      <SelectTrigger className="w-20 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border-border z-50">
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg border border-border/50 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="w-12">
                            <Checkbox 
                              checked={selectedIds.length === paginatedEstablishments.length && paginatedEstablishments.length > 0}
                              onCheckedChange={toggleSelectAll}
                            />
                          </TableHead>
                          <TableHead>Nom</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="hidden md:table-cell">Localisation</TableHead>
                          <TableHead className="hidden sm:table-cell">Statut</TableHead>
                          <TableHead className="hidden lg:table-cell">Revendication</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paginatedEstablishments.map((est) => (
                          <TableRow key={est.id} className="hover:bg-muted/30 transition-colors">
                            <TableCell>
                              <Checkbox 
                                checked={selectedIds.includes(est.id)}
                                onCheckedChange={() => toggleSelect(est.id)}
                                disabled={est.id.startsWith('json-') || est.id.startsWith('osm-')}
                              />
                            </TableCell>
                            <TableCell className="font-medium">
                              <div className="flex flex-col gap-1">
                                <span className="text-sm">{est.raison_sociale}</span>
                                {(est as any).source && (
                                  <Badge variant="outline" className="w-fit text-xs bg-blue-500/10 text-blue-400 border-blue-400/30">
                                    {(est as any).source}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/30 text-xs">
                                {establishmentTypes[est.type_etablissement] || est.type_etablissement}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {est.ville}, {est.province}
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <Badge variant="outline" className={statusColors[est.statut] || ''}>
                                {est.statut}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              {est.account_claimed ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/30">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Revendiqué
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400/30">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Disponible
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-background border-border z-50">
                                  <DropdownMenuItem onClick={() => {
                                    setSelectedEstablishment(est);
                                    setShowDetailsDialog(true);
                                  }} className="gap-2">
                                    <Eye className="w-4 h-4" />
                                    Voir détails
                                  </DropdownMenuItem>
                                  {!(est.id.startsWith('json-') || est.id.startsWith('osm-')) && (
                                    <>
                                      {!est.account_claimed && (
                                        <DropdownMenuItem onClick={() => handleGenerateToken(est)} className="gap-2 text-blue-600">
                                          <LinkIcon className="w-4 h-4" />
                                          Générer lien
                                        </DropdownMenuItem>
                                      )}
                                      {est.statut === 'en_validation' && (
                                        <DropdownMenuItem onClick={() => handleApprove(est.id, 'establishment')} className="gap-2 text-green-600">
                                          <CheckCircle className="w-4 h-4" />
                                          Approuver
                                        </DropdownMenuItem>
                                      )}
                                      {est.statut === 'actif' && (
                                        <DropdownMenuItem onClick={() => handleSuspend(est.id, 'establishment')} className="gap-2 text-orange-600">
                                          <XCircle className="w-4 h-4" />
                                          Suspendre
                                        </DropdownMenuItem>
                                      )}
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground">
                        Affichage de {startIndex + 1} à {Math.min(endIndex, filteredEstablishments.length)} sur {filteredEstablishments.length} résultats
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                          className="gap-2"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Précédent
                        </Button>
                        <div className="flex gap-1">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = currentPage <= 3 ? i + 1 : currentPage + i - 2;
                            if (page > totalPages) return null;
                            return (
                              <Button
                                key={page}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => setCurrentPage(page)}
                                className="w-8 h-8 p-0"
                              >
                                {page}
                              </Button>
                            );
                          })}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                          className="gap-2"
                        >
                          Suivant
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Grid View */
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {paginatedEstablishments.map((est) => (
                    <Card key={est.id} className="bg-card/50 backdrop-blur-xl border-border/50 hover:shadow-lg hover:scale-[1.02] transition-all group">
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Checkbox 
                              checked={selectedIds.includes(est.id)}
                              onCheckedChange={() => toggleSelect(est.id)}
                              disabled={est.id.startsWith('json-') || est.id.startsWith('osm-')}
                            />
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary" />
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-background border-border z-50">
                              <DropdownMenuItem onClick={() => {
                                setSelectedEstablishment(est);
                                setShowDetailsDialog(true);
                              }} className="gap-2">
                                <Eye className="w-4 h-4" />
                                Voir détails
                              </DropdownMenuItem>
                              {!(est.id.startsWith('json-') || est.id.startsWith('osm-')) && (
                                <>
                                  {!est.account_claimed && (
                                    <DropdownMenuItem onClick={() => handleGenerateToken(est)} className="gap-2 text-blue-600">
                                      <LinkIcon className="w-4 h-4" />
                                      Générer lien
                                    </DropdownMenuItem>
                                  )}
                                  {est.statut === 'en_validation' && (
                                    <DropdownMenuItem onClick={() => handleApprove(est.id, 'establishment')} className="gap-2 text-green-600">
                                      <CheckCircle className="w-4 h-4" />
                                      Approuver
                                    </DropdownMenuItem>
                                  )}
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <h3 className="font-semibold text-base mb-2 line-clamp-2">{est.raison_sociale}</h3>
                        
                        <div className="space-y-2 mb-3">
                          <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/30 text-xs">
                            {establishmentTypes[est.type_etablissement] || est.type_etablissement}
                          </Badge>
                          <Badge variant="outline" className={statusColors[est.statut] || ''}>
                            {est.statut}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{est.ville}, {est.province}</span>
                          </div>
                          {est.telephone_standard && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{est.telephone_standard}</span>
                            </div>
                          )}
                          {est.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 flex-shrink-0" />
                              <span className="truncate">{est.email}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-border/50">
                          {est.account_claimed ? (
                            <Badge variant="outline" className="w-full justify-center bg-green-500/10 text-green-400 border-green-400/30">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Revendiqué
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="w-full justify-center bg-orange-500/10 text-orange-400 border-orange-400/30">
                              <Clock className="w-3 h-3 mr-1" />
                              Disponible
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination for Grid */}
                {totalPages > 1 && (
                  <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                    <CardContent className="p-4">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-muted-foreground">
                          Page {currentPage} sur {totalPages} ({filteredEstablishments.length} résultats)
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="gap-2"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Précédent
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="gap-2"
                          >
                            Suivant
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </TabsContent>

          {/* Professionals Tab */}
          <TabsContent value="professionals" className="space-y-4">
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle>Liste des professionnels ({filteredProfessionals.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12 text-muted-foreground">Chargement...</div>
                ) : (
                  <div className="rounded-lg border border-border/50 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Nom</TableHead>
                          <TableHead>Profession</TableHead>
                          <TableHead>Spécialisation</TableHead>
                          <TableHead>N° Ordre</TableHead>
                          <TableHead>Vérifié</TableHead>
                          <TableHead>Contact</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProfessionals.map((prof) => (
                          <TableRow key={prof.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{prof.profile?.full_name || '-'}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/30">
                                {professionTypes[prof.profession_type] || prof.profession_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">{prof.specialization || '-'}</TableCell>
                            <TableCell className="text-muted-foreground">{prof.ordre_number || '-'}</TableCell>
                            <TableCell>
                              {prof.ordre_verified ? (
                                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/30">
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Vérifié
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400/30">
                                  <Clock className="w-3 h-3 mr-1" />
                                  En attente
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {prof.profile?.email || '-'}
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

        {/* Token Dialog */}
        <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lien d'invitation généré</DialogTitle>
              <DialogDescription>
                Envoyez ce lien à l'établissement pour qu'il puisse revendiquer son compte
              </DialogDescription>
            </DialogHeader>
            {selectedEstablishment && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Établissement</p>
                  <p className="font-medium text-lg">{selectedEstablishment.raison_sociale}</p>
                  <p className="text-sm text-muted-foreground">{selectedEstablishment.ville}, {selectedEstablishment.province}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Lien d'invitation</p>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/claim-establishment/${generatedToken}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyInvitationLink} variant="outline">
                      Copier
                    </Button>
                  </div>
                </div>
                {selectedEstablishment.email && (
                  <Button 
                    variant="outline" 
                    className="w-full gap-2"
                    onClick={() => {
                      window.location.href = `mailto:${selectedEstablishment.email}?subject=Invitation à revendiquer votre établissement&body=Bonjour,%0D%0A%0D%0AVoici votre lien d'invitation: ${window.location.origin}/claim-establishment/${generatedToken}`;
                    }}
                  >
                    <Mail className="w-4 h-4" />
                    Envoyer par email
                  </Button>
                )}
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">
                    Ce lien permettra à l'établissement de créer un compte et de revendiquer ses données. 
                    Le lien est à usage unique et expire après utilisation.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Détails de l'établissement
              </DialogTitle>
            </DialogHeader>
            {selectedEstablishment && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Nom</label>
                    <p className="text-base mt-1">{selectedEstablishment.raison_sociale}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Type</label>
                    <div className="mt-1">
                      <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-400/30">
                        {establishmentTypes[selectedEstablishment.type_etablissement] || selectedEstablishment.type_etablissement}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Secteur</label>
                    <p className="text-base mt-1 capitalize">{selectedEstablishment.secteur}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Statut</label>
                    <div className="mt-1">
                      <Badge variant="outline" className={statusColors[selectedEstablishment.statut] || ''}>
                        {selectedEstablishment.statut}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Localisation
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Ville</label>
                      <p className="text-base mt-1">{selectedEstablishment.ville}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Province</label>
                      <p className="text-base mt-1">{selectedEstablishment.province}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact
                  </h3>
                  <div className="space-y-3">
                    {selectedEstablishment.email ? (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedEstablishment.email}`} className="text-primary hover:underline">
                          {selectedEstablishment.email}
                        </a>
                      </div>
                    ) : null}
                    {selectedEstablishment.telephone_standard ? (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${selectedEstablishment.telephone_standard}`} className="text-primary hover:underline">
                          {selectedEstablishment.telephone_standard}
                        </a>
                      </div>
                    ) : null}
                    {!selectedEstablishment.email && !selectedEstablishment.telephone_standard && (
                      <p className="text-sm text-muted-foreground">Aucune information de contact disponible</p>
                    )}
                  </div>
                </div>

                <div className="border-t border-border/50 pt-4">
                  <h3 className="font-semibold mb-3">Revendication</h3>
                  {selectedEstablishment.account_claimed ? (
                    <div className="space-y-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Compte revendiqué
                      </Badge>
                      {selectedEstablishment.claimed_at && (
                        <p className="text-sm text-muted-foreground">
                          Revendiqué le {new Date(selectedEstablishment.claimed_at).toLocaleDateString('fr-FR')}
                        </p>
                      )}
                    </div>
                  ) : (
                    <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400/30">
                      <Clock className="w-3 h-3 mr-1" />
                      En attente de revendication
                    </Badge>
                  )}
                </div>

                {(selectedEstablishment as any).source && (
                  <div className="border-t border-border/50 pt-4">
                    <h3 className="font-semibold mb-2">Source des données</h3>
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/30">
                      {(selectedEstablishment as any).source === 'db' ? 'Base de données' : 
                       (selectedEstablishment as any).source === 'osm' ? 'OpenStreetMap' : 
                       'Cartographie JSON'}
                    </Badge>
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
      </div>
    </SuperAdminLayout>
  );
}
