import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, Search, Download, Shield, CheckCircle, Clock, Upload, Link as LinkIcon, Mail, Copy, Send } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import cartographyProviders from "@/data/cartography-providers.json";

interface HealthEntity {
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
  claimed_by: string | null;
  invitation_token: string | null;
}

const entityTypes: Record<string, string> = {
  hopital: 'Hôpital',
  clinique: 'Clinique',
  polyclinique: 'Polyclinique',
  chr: 'CHR',
  chu: 'CHU',
  centre_medical: 'Centre Médical',
  hopital_confessionnel: 'Hôpital Confessionnel',
  hopital_departemental: 'Hôpital Départemental'
};

export default function AdminHealthEntities() {
  const { isSuperAdmin } = useAuth();
  const [entities, setEntities] = useState<HealthEntity[]>([]);
  const [filteredEntities, setFilteredEntities] = useState<HealthEntity[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [claimFilter, setClaimFilter] = useState("all");
  const [provinceFilter, setProvinceFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<HealthEntity | null>(null);
  const [showTokenDialog, setShowTokenDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("");

  useEffect(() => {
    loadEntities();
  }, []);

  useEffect(() => {
    filterEntities();
  }, [searchTerm, claimFilter, provinceFilter, entities]);

  const loadEntities = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntities(data || []);
    } catch (error: any) {
      toast.error("Erreur lors du chargement");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEntities = () => {
    let filtered = entities;

    if (searchTerm) {
      filtered = filtered.filter(e =>
        e.raison_sociale.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.ville.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (claimFilter === "claimed") {
      filtered = filtered.filter(e => e.account_claimed === true);
    } else if (claimFilter === "unclaimed") {
      filtered = filtered.filter(e => e.account_claimed === false);
    }

    if (provinceFilter !== "all") {
      filtered = filtered.filter(e => e.province === provinceFilter);
    }

    setFilteredEntities(filtered);
  };

  const handleImportEntities = async () => {
    try {
      setIsImporting(true);
      toast.info("Import des entités en cours...");

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

      const entitiesToInsert = cartographyProviders.map((provider: any) => ({
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

      const batchSize = 50;
      for (let i = 0; i < entitiesToInsert.length; i += batchSize) {
        const batch = entitiesToInsert.slice(i, i + batchSize);
        const { error } = await supabase
          .from('establishments')
          .insert(batch);

        if (error) {
          console.error('Batch error:', error);
          throw error;
        }
      }

      toast.success(`${entitiesToInsert.length} entités importées avec succès`);
      loadEntities();
    } catch (error: any) {
      toast.error("Erreur lors de l'import: " + error.message);
      console.error(error);
    } finally {
      setIsImporting(false);
    }
  };

  const handleGenerateToken = async (entity: HealthEntity) => {
    try {
      const { data, error } = await supabase.rpc('generate_establishment_invitation_token', {
        _establishment_id: entity.id
      });

      if (error) throw error;

      setGeneratedToken(data);
      setSelectedEntity(entity);
      setShowTokenDialog(true);
      toast.success("Lien d'invitation généré");
    } catch (error: any) {
      toast.error("Erreur lors de la génération");
      console.error(error);
    }
  };

  const copyInvitationLink = () => {
    const link = `${window.location.origin}/claim-establishment/${generatedToken}`;
    navigator.clipboard.writeText(link);
    toast.success("Lien copié");
  };

  const sendInvitationEmail = async () => {
    if (!selectedEntity?.email) {
      toast.error("Aucun email disponible pour cet établissement");
      return;
    }
    
    toast.info("Envoi d'email en cours...");
    // TODO: Implémenter l'envoi d'email via Edge Function
    toast.success("Email envoyé (à implémenter)");
  };

  const exportEntities = () => {
    const csv = [
      ['Nom', 'Type', 'Province', 'Ville', 'Statut Revendication', 'Email', 'Téléphone', 'Date Revendication'],
      ...filteredEntities.map(e => [
        e.raison_sociale,
        entityTypes[e.type_etablissement] || e.type_etablissement,
        e.province,
        e.ville,
        e.account_claimed ? 'Revendiqué' : 'Non revendiqué',
        e.email || '',
        e.telephone_standard || '',
        e.claimed_at ? new Date(e.claimed_at).toLocaleDateString('fr-FR') : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `entites-sante_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
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
    total: entities.length,
    claimed: entities.filter(e => e.account_claimed === true).length,
    unclaimed: entities.filter(e => e.account_claimed === false).length,
    pendingRate: entities.length > 0 
      ? Math.round((entities.filter(e => !e.account_claimed).length / entities.length) * 100)
      : 0
  };

  const provinces = [...new Set(entities.map(e => e.province))].sort();

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Gestion des Entités Santé
            </h1>
            <p className="text-muted-foreground mt-1">
              Pré-création et revendication des comptes établissements
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={handleImportEntities} 
              variant="outline"
              disabled={isImporting}
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              {isImporting ? "Import..." : "Importer 414 Entités"}
            </Button>
            <Button onClick={exportEntities} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Entités', value: stats.total, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Revendiqués', value: stats.claimed, icon: CheckCircle, color: 'from-green-500 to-emerald-500' },
            { label: 'Non Revendiqués', value: stats.unclaimed, icon: Clock, color: 'from-orange-500 to-amber-500' },
            { label: 'Taux Disponible', value: `${stats.pendingRate}%`, icon: LinkIcon, color: 'from-purple-500 to-pink-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50 hover:bg-card/70 transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Filtres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={claimFilter} onValueChange={setClaimFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut revendication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous</SelectItem>
                  <SelectItem value="claimed">Revendiqués</SelectItem>
                  <SelectItem value="unclaimed">Non revendiqués</SelectItem>
                </SelectContent>
              </Select>
              <Select value={provinceFilter} onValueChange={setProvinceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les provinces</SelectItem>
                  {provinces.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-xl border-border/50">
          <CardHeader>
            <CardTitle>Liste des entités ({filteredEntities.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12 text-muted-foreground">Chargement...</div>
            ) : (
              <div className="rounded-lg border border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Établissement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Revendication</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntities.map((entity) => (
                      <TableRow key={entity.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{entity.raison_sociale}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-400/30">
                            {entityTypes[entity.type_etablissement] || entity.type_etablissement}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {entity.ville}, {entity.province}
                        </TableCell>
                        <TableCell>
                          {entity.account_claimed ? (
                            <div className="space-y-1">
                              <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-400/30">
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Revendiqué
                              </Badge>
                              {entity.claimed_at && (
                                <p className="text-xs text-muted-foreground">
                                  {new Date(entity.claimed_at).toLocaleDateString('fr-FR')}
                                </p>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-400/30">
                              <Clock className="w-3 h-3 mr-1" />
                              Disponible
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {entity.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {entity.email}
                            </div>
                          )}
                          {entity.telephone_standard && (
                            <div className="text-xs">{entity.telephone_standard}</div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {!entity.account_claimed && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateToken(entity)}
                              className="gap-2 text-primary hover:text-primary"
                            >
                              <LinkIcon className="w-4 h-4" />
                              Générer lien
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showTokenDialog} onOpenChange={setShowTokenDialog}>
          <DialogContent className="bg-card/95 backdrop-blur-xl border-border/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Lien de Revendication</DialogTitle>
              <DialogDescription>
                Partagez ce lien avec l'établissement pour qu'il puisse revendiquer son compte
              </DialogDescription>
            </DialogHeader>
            {selectedEntity && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50">
                  <p className="font-medium text-lg">{selectedEntity.raison_sociale}</p>
                  <p className="text-sm text-muted-foreground">{selectedEntity.ville}, {selectedEntity.province}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">Lien d'invitation</p>
                  <div className="flex gap-2">
                    <Input
                      value={`${window.location.origin}/claim-establishment/${generatedToken}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button onClick={copyInvitationLink} variant="outline" size="icon">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {selectedEntity.email && (
                  <Button onClick={sendInvitationEmail} className="w-full gap-2">
                    <Send className="w-4 h-4" />
                    Envoyer par email à {selectedEntity.email}
                  </Button>
                )}

                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <p className="text-sm text-blue-400">
                    <strong>Instructions :</strong> Ce lien permet à l'établissement de créer un compte administrateur 
                    et de revendiquer ses données. Le lien est à usage unique et sera désactivé après utilisation.
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
