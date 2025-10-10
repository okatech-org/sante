import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, Users, Search, Download, Shield, CheckCircle, XCircle, Clock, FileText, Upload, Link as LinkIcon, Mail } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import cartographyProviders from "@/data/cartography-providers.json";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<Establishment | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");
  const [showJsonData, setShowJsonData] = useState(true); // Afficher les données JSON par défaut

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEstablishments();
  }, [searchTerm, statusFilter, typeFilter, claimFilter, establishments]);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, professionals]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Charger d'abord les données du JSON
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

      // Transformer les données JSON en format Establishment
      const jsonEstablishments = cartographyProviders.map((provider: any, index: number) => ({
        id: provider.id || `json-${index}`,
        raison_sociale: provider.nom,
        type_etablissement: typeMap[provider.type] || 'hopital',
        secteur: secteurMap[provider.secteur] || 'prive',
        ville: provider.ville,
        province: provider.province,
        statut: 'actif',
        email: provider.email || null,
        telephone_standard: provider.telephones?.[0] || null,
        created_at: new Date().toISOString(),
        account_claimed: false,
        claimed_at: null,
        invitation_token: null
      }));

      // Load establishments from DB
      const { data: estData, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (estError) throw estError;

      // Combiner les données JSON avec celles de la DB
      // Priorité aux données DB si elles existent
      const dbIds = new Set(estData?.map(e => e.raison_sociale.toLowerCase()) || []);
      const uniqueJsonEstablishments = jsonEstablishments.filter(
        je => !dbIds.has(je.raison_sociale.toLowerCase())
      );

      setEstablishments([...(estData || []), ...uniqueJsonEstablishments]);

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
    establishments: establishments.length,
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
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {[
            { label: 'Établissements', value: stats.establishments, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Professionnels', value: stats.professionals, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'En validation', value: stats.pending, icon: Clock, color: 'from-orange-500 to-amber-500' },
            { label: 'Actifs', value: stats.active, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'Revendiqués', value: stats.claimed, icon: LinkIcon, color: 'from-indigo-500 to-purple-500' },
            { label: 'Non revendiqués', value: stats.unclaimed, icon: FileText, color: 'from-red-500 to-pink-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/70 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
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
            {/* Filters */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Filtres</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    onClick={handleImportCartography} 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    disabled={isImporting}
                  >
                    <Upload className="w-4 h-4" />
                    {isImporting ? "Import en cours..." : "Importer Carto"}
                  </Button>
                  <Button onClick={() => exportData('establishments')} variant="outline" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exporter
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="en_validation">En validation</SelectItem>
                      <SelectItem value="suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les types</SelectItem>
                      {Object.entries(establishmentTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={claimFilter} onValueChange={setClaimFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrer par revendication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="claimed">Revendiqués</SelectItem>
                      <SelectItem value="unclaimed">Non revendiqués</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle>Liste des établissements ({filteredEstablishments.length})</CardTitle>
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
                          <TableHead>Type</TableHead>
                          <TableHead>Localisation</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Revendication</TableHead>
                          <TableHead>Contact</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEstablishments.map((est) => (
                          <TableRow key={est.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">
                              {est.raison_sociale}
                              {est.id.startsWith('json-') && (
                                <Badge variant="outline" className="ml-2 bg-yellow-500/10 text-yellow-400 border-yellow-400/30 text-xs">
                                  Non importé
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/30">
                                {establishmentTypes[est.type_etablissement] || est.type_etablissement}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {est.ville}, {est.province}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={statusColors[est.statut] || ''}>
                                {est.statut}
                              </Badge>
                            </TableCell>
                            <TableCell>
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
                            <TableCell className="text-sm text-muted-foreground">
                              {est.email || est.telephone_standard || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                {est.id.startsWith('json-') ? (
                                  <Badge variant="outline" className="bg-muted text-muted-foreground">
                                    À importer
                                  </Badge>
                                ) : (
                                  <>
                                    {!est.account_claimed && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleGenerateToken(est)}
                                        className="text-blue-500 hover:text-blue-600"
                                        title="Générer un lien d'invitation"
                                      >
                                        <LinkIcon className="w-4 h-4" />
                                      </Button>
                                    )}
                                    {est.statut === 'en_validation' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleApprove(est.id, 'establishment')}
                                    className="text-green-500 hover:text-green-600"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                {est.statut === 'actif' && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleSuspend(est.id, 'establishment')}
                                    className="text-orange-500 hover:text-orange-600"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </Button>
                                )}
                                  </>
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
      </div>
    </SuperAdminLayout>
  );
}
