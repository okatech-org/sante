import { useState, useEffect } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Building2, Users, Search, Download, Shield, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterEstablishments();
  }, [searchTerm, statusFilter, typeFilter, establishments]);

  useEffect(() => {
    filterProfessionals();
  }, [searchTerm, professionals]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Load establishments
      const { data: estData, error: estError } = await supabase
        .from('establishments')
        .select('*')
        .order('created_at', { ascending: false });

      if (estError) throw estError;
      setEstablishments(estData || []);

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
    active: establishments.filter(e => e.statut === 'actif').length
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Établissements', value: stats.establishments, icon: Building2, color: 'from-blue-500 to-cyan-500' },
            { label: 'Professionnels', value: stats.professionals, icon: Users, color: 'from-purple-500 to-pink-500' },
            { label: 'En validation', value: stats.pending, icon: Clock, color: 'from-orange-500 to-amber-500' },
            { label: 'Actifs', value: stats.active, icon: CheckCircle, color: 'from-green-500 to-emerald-500' }
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
                <Button onClick={() => exportData('establishments')} variant="outline" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Exporter
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
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
                          <TableHead>Contact</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEstablishments.map((est) => (
                          <TableRow key={est.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium">{est.raison_sociale}</TableCell>
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
                            <TableCell className="text-sm text-muted-foreground">
                              {est.email || est.telephone_standard || '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
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
      </div>
    </SuperAdminLayout>
  );
}
