import { useState, useEffect } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, Users, Search, Download, Shield, CheckCircle, XCircle, Clock, FileText, Upload, Link as LinkIcon, Mail, ArrowUpDown, Eye, Edit, Trash2, MoreVertical, Filter, Grid3x3, List, ChevronLeft, ChevronRight, RefreshCw, MapPin, Phone, Globe } from "lucide-react";
import { EstablishmentStatsCard } from "@/components/stats/EstablishmentStats";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
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
  const { isSuperAdmin } = useOfflineAuth();
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredEstablishments, setFilteredEstablishments] = useState<Establishment[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [claimFilter, setClaimFilter] = useState("all");
  const [sortBy, setSortBy] = useState("smart");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [showJsonData, setShowJsonData] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedStatFilter, setSelectedStatFilter] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEstablishments();
  }, [searchTerm, statusFilter, typeFilter, claimFilter, sortBy, establishments, selectedStatFilter]);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, professionals]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les establishments depuis la DB
      const { data: estData, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (estError) throw estError;

      console.log(`Chargement de ${estData?.length || 0} établissements depuis la DB`);

      // Charger les OSM providers
      const osmProviders = await getOSMProvidersFromSupabase();
      console.log(`Chargement de ${osmProviders.length} acteurs depuis OSM`);

      // Convertir OSM providers en format Establishment
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
        'cabinet_medical': 'cabinet_medical', // Garder tel quel (professionnel individuel)
        'cabinet_dentaire': 'cabinet_dentaire', // Garder tel quel (professionnel individuel)
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

      const osmEstablishments = osmProviders.map((provider: any) => ({
        id: provider.id,
        raison_sociale: provider.nom,
        type_etablissement: typeMap[provider.type?.toLowerCase()] || 'centre_medical',
        secteur: secteurMap[provider.secteur?.toLowerCase()] || 'prive',
        ville: provider.ville,
        province: provider.province,
        statut: 'actif' as any,
        email: provider.email || null,
        telephone_standard: provider.telephones?.[0] || null,
        telephone_urgences: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        account_claimed: false,
        claimed_at: null,
        claimed_by: null,
        invitation_token: null,
        numero_rccm: null,
        numero_autorisation: `OSM-${provider.osm_id}`,
        forme_juridique: null,
        capital: null,
        directeur_general_nom: null,
        directeur_general_telephone: null,
        directeur_general_email: null,
        directeur_medical_nom: null,
        directeur_medical_numero_ordre: null,
        adresse_rue: provider.adresse_descriptive || '',
        adresse_quartier: null,
        adresse_arrondissement: null,
        code_postal: null,
        latitude: provider.coordonnees?.lat || null,
        longitude: provider.coordonnees?.lng || null,
        repere_geographique: null,
        site_web: provider.site_web || null,
        whatsapp_business: null,
        nombre_lits_total: provider.nombre_lits || 0,
        nombre_blocs_operatoires: 0,
        nombre_salles_consultation: 0,
        service_urgences_actif: provider.ouvert_24_7 || false,
        cnamgs_conventionne: provider.cnamgs || false,
        cnamgs_numero_convention: null,
        cnamgs_date_debut: null,
        cnamgs_date_fin: null,
        cnamgs_tiers_payant_actif: false,
        taux_occupation: null,
        satisfaction_moyenne: null,
        nombre_avis: 0,
        date_inscription: new Date().toISOString().split('T')[0],
        source: 'osm'
      }));

      // Combiner DB + OSM et dédupliquer par ID
      const dbEstablishments = (estData || []).map(e => ({ ...e, source: 'db' }));
      const combined = [...dbEstablishments];
      const existingIds = new Set(dbEstablishments.map(e => e.id));

      osmEstablishments.forEach(oe => {
        if (!existingIds.has(oe.id)) {
          combined.push(oe);
        }
      });

      console.log(`Total: ${combined.length} acteurs (${dbEstablishments.length} DB + ${osmEstablishments.length} OSM, après déduplication)`);

      setEstablishments(combined);

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

    // Filtre par statistique sélectionnée
    if (selectedStatFilter) {
      const professionalTypes = ['cabinet_medical', 'cabinet_dentaire'];
      
      switch (selectedStatFilter) {
        case 'establishments':
          filtered = filtered.filter(est => !professionalTypes.includes(est.type_etablissement));
          break;
        case 'subscriptions':
          filtered = filtered.filter(est => est.account_claimed === true);
          break;
        case 'professionals':
          filtered = filtered.filter(est => professionalTypes.includes(est.type_etablissement));
          break;
        case 'pending':
          filtered = filtered.filter(est => est.statut === 'en_validation');
          break;
        case 'active':
          filtered = filtered.filter(est => est.statut === 'actif');
          break;
        case 'claimed':
          filtered = filtered.filter(est => est.account_claimed === true);
          break;
        case 'unclaimed':
          filtered = filtered.filter(est => est.account_claimed === false);
          break;
      }
    }

    if (searchTerm) {
      filtered = filtered.filter(est =>
        est.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.ville.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.province.toLowerCase().includes(searchTerm.toLowerCase())
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

    // Tri intelligent et hiérarchique
    filtered = [...filtered].sort((a, b) => {
      // Priorité 1: Trier par source (DB > OSM > JSON)
      const sourceOrder = { 'db': 0, 'osm': 1, 'json': 2 };
      const sourceA = (a as any).source || 'db';
      const sourceB = (b as any).source || 'db';
      
      switch (sortBy) {
        case "name-asc":
          return a.raison_sociale.localeCompare(b.raison_sociale, 'fr', { sensitivity: 'base' });
        case "name-desc":
          return b.raison_sociale.localeCompare(a.raison_sociale, 'fr', { sensitivity: 'base' });
        
        case "date-asc":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "date-desc":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        
        case "city-asc":
          return a.ville.localeCompare(b.ville, 'fr') || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        case "city-desc":
          return b.ville.localeCompare(a.ville, 'fr') || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
        case "province-asc":
          return a.province.localeCompare(b.province, 'fr') || a.ville.localeCompare(b.ville, 'fr');
        case "province-desc":
          return b.province.localeCompare(a.province, 'fr') || a.ville.localeCompare(b.ville, 'fr');
        
        case "type-asc":
          return a.type_etablissement.localeCompare(b.type_etablissement) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        case "type-desc":
          return b.type_etablissement.localeCompare(a.type_etablissement) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
        case "secteur-asc":
          return a.secteur.localeCompare(b.secteur) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        case "secteur-desc":
          return b.secteur.localeCompare(a.secteur) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
        case "status-claimed":
          return (b.account_claimed ? 1 : 0) - (a.account_claimed ? 1 : 0) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        case "status-unclaimed":
          return (a.account_claimed ? 1 : 0) - (b.account_claimed ? 1 : 0) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
        case "source-db":
          return (sourceOrder[sourceA] - sourceOrder[sourceB]) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        case "source-external":
          return (sourceOrder[sourceB] - sourceOrder[sourceA]) || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
        // Tri par catégorie d'établissement (Hôpitaux > Cliniques > Centres > Pharmacies > Laboratoires)
        case "category-priority":
          const categoryOrder: Record<string, number> = {
            'chu': 0,
            'chr': 1,
            'hopital': 2,
            'hopital_confessionnel': 3,
            'hopital_departemental': 4,
            'clinique': 5,
            'polyclinique': 6,
            'centre_medical': 7,
            'centre_sante': 8,
            'dispensaire': 9,
            'pharmacie': 10,
            'laboratoire': 11,
            'cabinet_medical': 12,
            'cabinet_dentaire': 13
          };
          const orderA = categoryOrder[a.type_etablissement] ?? 99;
          const orderB = categoryOrder[b.type_etablissement] ?? 99;
          return orderA - orderB || a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
        // Tri intelligent: DB d'abord, puis par type, puis par nom
        case "smart":
          const sourceCompare = sourceOrder[sourceA] - sourceOrder[sourceB];
          if (sourceCompare !== 0) return sourceCompare;
          const typeCompare = a.type_etablissement.localeCompare(b.type_etablissement);
          if (typeCompare !== 0) return typeCompare;
          return a.raison_sociale.localeCompare(b.raison_sociale, 'fr');
        
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
      <SuperAdminLayoutSimple>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="bg-card/50 backdrop-blur-xl border-border/50">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-destructive" />
              <h2 className="text-2xl font-bold mb-2">Accès refusé</h2>
              <p className="text-muted-foreground">Seuls les super admins peuvent accéder à cette page.</p>
            </CardContent>
          </Card>
        </div>
      </SuperAdminLayoutSimple>
    );
  }

  // Types considérés comme professionnels individuels
  const professionalTypes = ['cabinet_medical', 'cabinet_dentaire'];
  
  // Séparer établissements et cabinets professionnels
  const professionalCabinets = establishments.filter(e => professionalTypes.includes(e.type_etablissement));
  const realEstablishments = establishments.filter(e => !professionalTypes.includes(e.type_etablissement));
  
  const stats = {
    total: establishments.length,
    establishments: realEstablishments.length,
    subscriptions: establishments.filter(e => e.account_claimed === true).length,
    professionals: professionalCabinets.length,
    pending: establishments.filter(e => e.statut === 'en_validation').length,
    active: establishments.filter(e => e.statut === 'actif').length,
    claimed: establishments.filter(e => e.account_claimed === true).length,
    unclaimed: establishments.filter(e => e.account_claimed === false).length
  };

  return (
    <SuperAdminLayoutSimple>
      <div className="p-6 space-y-4 max-w-7xl mx-auto">
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
            { id: null, label: 'Total acteurs', value: stats.total, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { id: 'establishments', label: 'Établissements', value: stats.establishments, icon: Building2, color: 'from-green-500 to-emerald-500' },
            { id: 'subscriptions', label: 'Abonnements', value: stats.subscriptions, icon: CheckCircle, color: 'from-orange-500 to-amber-500' },
            { id: 'professionals', label: 'Professionnels', value: stats.professionals, icon: Users, color: 'from-purple-500 to-pink-500' },
            { id: 'pending', label: 'En validation', value: stats.pending, icon: Clock, color: 'from-yellow-500 to-amber-500' },
            { id: 'active', label: 'Actifs', value: stats.active, icon: CheckCircle, color: 'from-emerald-500 to-teal-500' },
            { id: 'claimed', label: 'Revendiqués', value: stats.claimed, icon: LinkIcon, color: 'from-indigo-500 to-purple-500' },
            { id: 'unclaimed', label: 'Non revendiqués', value: stats.unclaimed, icon: XCircle, color: 'from-red-500 to-pink-500' }
          ].map((stat, i) => (
            <Card 
              key={i} 
              className={`bg-card/50 backdrop-blur-xl border-border/50 transition-all ${
                stat.id ? 'cursor-pointer hover:bg-card/70 hover:scale-105' : ''
              } ${
                selectedStatFilter === stat.id ? 'ring-2 ring-primary bg-card/90' : ''
              }`}
              onClick={() => stat.id && setSelectedStatFilter(selectedStatFilter === stat.id ? null : stat.id)}
            >
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
                  {filteredEstablishments.length} acteurs de santé référencés
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Les données affichées incluent les établissements de la base de données et ceux provenant d'OpenStreetMap.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques des établissements */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Répartition par type d'établissement</h3>
          <EstablishmentStatsCard variant="detailed" showTotal={true} />
        </div>

        {/* Establishments Section */}
        <div className="space-y-4">
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
                      <SelectContent className="bg-background border-border z-50 max-h-[400px] overflow-y-auto">
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">📊 Tri Intelligent</div>
                        <SelectItem value="smart">✨ Tri intelligent (recommandé)</SelectItem>
                        <SelectItem value="category-priority">🏥 Par catégorie (Hôpitaux → Pharmacies)</SelectItem>
                        
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border/50 mt-2">📝 Par Nom</div>
                        <SelectItem value="name-asc">Nom (A → Z)</SelectItem>
                        <SelectItem value="name-desc">Nom (Z → A)</SelectItem>
                        
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border/50 mt-2">📅 Par Date</div>
                        <SelectItem value="date-desc">Plus récent d'abord</SelectItem>
                        <SelectItem value="date-asc">Plus ancien d'abord</SelectItem>
                        
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border/50 mt-2">📍 Par Localisation</div>
                        <SelectItem value="province-asc">Province (A → Z)</SelectItem>
                        <SelectItem value="province-desc">Province (Z → A)</SelectItem>
                        <SelectItem value="city-asc">Ville (A → Z)</SelectItem>
                        <SelectItem value="city-desc">Ville (Z → A)</SelectItem>
                        
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border/50 mt-2">🏢 Par Type & Secteur</div>
                        <SelectItem value="type-asc">Type (A → Z)</SelectItem>
                        <SelectItem value="type-desc">Type (Z → A)</SelectItem>
                        <SelectItem value="secteur-asc">Secteur (A → Z)</SelectItem>
                        <SelectItem value="secteur-desc">Secteur (Z → A)</SelectItem>
                        
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border/50 mt-2">🔗 Par Statut</div>
                        <SelectItem value="status-claimed">Revendiqués d'abord</SelectItem>
                        <SelectItem value="status-unclaimed">Non revendiqués d'abord</SelectItem>
                        
                        <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground border-t border-border/50 mt-2">💾 Par Source</div>
                        <SelectItem value="source-db">Base de données d'abord</SelectItem>
                        <SelectItem value="source-external">Sources externes d'abord</SelectItem>
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
                        setSortBy("smart");
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
          </div>

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
    </SuperAdminLayoutSimple>
  );
}
