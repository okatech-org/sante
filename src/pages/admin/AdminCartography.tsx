import { useState, useEffect, useMemo } from "react";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { useOfflineAuth } from "@/contexts/OfflineAuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Map, Building2, RefreshCw, Download, Shield, Database, Upload, MapPin, Activity } from "lucide-react";
import HealthProvidersMap from "@/components/landing/HealthProvidersMap";
import CartographySmartSearch from "@/components/cartography/CartographySmartSearch";
import CartographyListView from "@/components/cartography/CartographyListView";
import { CartographyProvider } from "@/types/cartography";
import { getOSMProvidersFromSupabase } from "@/utils/osm-supabase-sync";
import { dedupeProviders } from "@/utils/cartography-dedupe";
import { establishmentsService } from "@/services/establishments.service";
import { useNavigate } from "react-router-dom";


type SortBy = "name-asc" | "name-desc" | "city-asc" | "city-desc" | "type-asc" | "distance-asc";

export default function AdminCartography() {
  const { isSuperAdmin } = useOfflineAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ 
    total: 0, 
    hopitaux: 0, 
    cliniques: 0, 
    pharmacies: 0,
    cabinets: 0,
    laboratoires: 0,
    imagerie: 0,
    institutions: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [osmProviders, setOsmProviders] = useState<CartographyProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<CartographyProvider | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name-asc");

  const [establishmentProviders, setEstablishmentProviders] = useState<CartographyProvider[]>([]);
  const [reloadKey, setReloadKey] = useState(0);
  const [adminInstitutions, setAdminInstitutions] = useState<CartographyProvider[]>([]);

  const allProviders = useMemo(() => {
    // Conserver les acteurs OSM (sauf institutions) + ajouter uniquement les 10 institutions administratives
    const filteredOSM = osmProviders.filter(p => p.type !== 'institution');
    const combined = [...filteredOSM, ...adminInstitutions];
    const seenIds = new Set();
    
    return combined.filter(provider => {
      if (seenIds.has(provider.id)) {
        return false;
      }
      seenIds.add(provider.id);
      return true;
    });
  }, [osmProviders, adminInstitutions]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Utiliser le service unifié pour obtenir tous les providers (397 établissements)
      const allProviders = await establishmentsService.getAllProviders(true);
      
      // Séparer les institutions pour l'affichage spécifique
      const institutions = allProviders.filter(p => p.type === 'institution');
      const otherProviders = allProviders.filter(p => p.type !== 'institution');
      
      setAdminInstitutions(institutions);
      setOsmProviders(otherProviders);

      // Charger les establishments depuis Supabase
      const { data: estabData, error: estabError } = await supabase
        .from('establishments')
        .select('*');

      if (estabError) throw estabError;

      // Normaliser le type d'établissement vers les catégories CartographyProvider
      const normalizeEstablishmentType = (type: string): CartographyProvider['type'] => {
        // Mapper les types d'établissements vers les catégories d'affichage
        const typeMap: Record<string, CartographyProvider['type']> = {
          'chu': 'hopital',
          'chr': 'hopital',
          'hopital_departemental': 'hopital',
          'hopital_confessionnel': 'hopital',
          'polyclinique': 'clinique',
          'clinique': 'clinique',
          'centre_medical': 'cabinet_medical',
          'institution': 'institution',
        };
        return typeMap[type] || 'cabinet_medical';
      };

      // Convertir les establishments au format CartographyProvider
      const estabProviders: CartographyProvider[] = (estabData || []).map(estab => ({
        id: estab.id,
        nom: estab.raison_sociale,
        type: normalizeEstablishmentType(estab.type_etablissement),
        province: estab.province,
        ville: estab.ville,
        adresse: [estab.adresse_rue, estab.adresse_quartier, estab.adresse_arrondissement].filter(Boolean).join(', '),
        adresse_descriptive: [estab.adresse_rue, estab.adresse_quartier, estab.ville, estab.province].filter(Boolean).join(', '),
        coordonnees: estab.latitude && estab.longitude ? {
          lat: typeof estab.latitude === 'string' ? parseFloat(estab.latitude) : estab.latitude,
          lng: typeof estab.longitude === 'string' ? parseFloat(estab.longitude) : estab.longitude
        } : undefined,
        telephones: [estab.telephone_standard, estab.telephone_urgences].filter(Boolean) as string[],
        email: estab.email || undefined,
        site_web: estab.site_web || undefined,
        ouvert_24_7: estab.service_urgences_actif || false,
        cnamgs: estab.cnamgs_conventionne || false,
        conventionnement: {
          cnamgs: estab.cnamgs_conventionne || false,
          cnss: false
        },
        secteur: (estab.secteur as any) || 'prive',
        services: [],
        specialites: [],
        has_account: true,
        source: 'Plateforme',
        statut_operationnel: estab.statut === 'actif' ? 'operationnel' : 'inconnu',
        nombre_lits: estab.nombre_lits_total
      }));

      setEstablishmentProviders(estabProviders);

      // Combiner et calculer les statistiques (exclure les institutions OSM)
      const filteredOSMData = dedupeProviders(osmData).filter(p => p.type !== 'institution');
      const combined = [...filteredOSMData, ...gabonInstitutions];
      const seenIds = new Set();
      const unique = combined.filter(p => {
        if (seenIds.has(p.id)) return false;
        seenIds.add(p.id);
        return true;
      });

      // Heuristique de classification pour correspondre aux attentes
      const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
      const clinicNameRegex = /(clinique|centre medical|polyclinique)/;

      const hopitaux = unique.filter(p => p.type === 'hopital').length;
      const pharmacies = unique.filter(p => p.type === 'pharmacie').length;
      const laboratoires = unique.filter(p => p.type === 'laboratoire').length;
      const imagerie = unique.filter(p => p.type === 'imagerie').length;

      const cliniques = unique.filter(p => {
        const n = normalize(p.nom || '');
        return p.type === 'clinique' || (p.type === 'cabinet_medical' && clinicNameRegex.test(n));
      }).length;

      // Cabinets = cabinets médicaux uniquement (exclut cabinets dentaires et ceux assimilés à des cliniques)
      const cabinets = unique.filter(p => {
        if (p.type !== 'cabinet_medical') return false;
        const n = normalize(p.nom || '');
        return !clinicNameRegex.test(n);
      }).length;

      setStats({
        total: unique.length,
        hopitaux,
        cliniques,
        pharmacies,
        cabinets,
        laboratoires,
        imagerie,
        institutions: gabonInstitutions.length
      });
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setIsLoading(true);
      toast.info("Synchronisation avec OpenStreetMap en cours...");
      
      // Appeler l'Edge Function avec sauvegarde en base (requiert super_admin)
      const { data, error } = await supabase.functions.invoke('fetch-osm-health-providers', {
        body: { province: 'all', city: 'all', saveToDatabase: true }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Échec de la synchronisation OSM');
      }

      if (data.count) {
        toast.success(`${data.count} établissements OSM importés`);
      } else if (Array.isArray(data.providers)) {
        toast.success(`${data.providers.length} établissements OSM récupérés`);
      } else {
        toast.success(`Synchronisation OSM terminée`);
      }
      
      // Recharger les données depuis la base
      await loadData();
      setReloadKey((k) => k + 1);
    } catch (error: any) {
      console.error('Erreur de synchronisation:', error);
      toast.error("Erreur lors de la synchronisation OSM");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(allProviders, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `cartographie-sante-gabon-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Export réussi");
    } catch (error) {
      toast.error("Erreur lors de l'export");
    }
  };

  const filteredProviders = useMemo(() => {
    let filtered = allProviders;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.nom.toLowerCase().includes(query) ||
        p.ville.toLowerCase().includes(query) ||
        p.type.toLowerCase().includes(query) ||
        p.adresse_descriptive?.toLowerCase().includes(query)
      );
    }

    // Tri
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.nom.localeCompare(b.nom);
        case "name-desc":
          return b.nom.localeCompare(a.nom);
        case "city-asc":
          return a.ville.localeCompare(b.ville);
        case "city-desc":
          return b.ville.localeCompare(a.ville);
        case "type-asc":
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    return sorted;
  }, [allProviders, searchQuery, sortBy]);

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

  return (
    <SuperAdminLayoutSimple>
      <div className="p-6 space-y-4 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cartographie Santé
            </h1>
            <p className="text-muted-foreground mt-1">
              Gestion et visualisation des prestataires de santé au Gabon
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSync} variant="outline" className="gap-2" disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Synchroniser
            </Button>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: Activity, color: 'from-blue-500 to-cyan-500' },
            { label: 'Hôpitaux', value: stats.hopitaux, icon: Building2, color: 'from-purple-500 to-pink-500' },
            { label: 'Cliniques', value: stats.cliniques, icon: Building2, color: 'from-green-500 to-emerald-500' },
            { label: 'Pharmacies', value: stats.pharmacies, icon: MapPin, color: 'from-orange-500 to-amber-500' },
            { label: 'Cabinets', value: stats.cabinets, icon: Building2, color: 'from-indigo-500 to-blue-500' },
            { label: 'Laboratoires', value: stats.laboratoires, icon: Database, color: 'from-pink-500 to-rose-500' },
            { label: 'Imagerie', value: stats.imagerie, icon: Upload, color: 'from-violet-500 to-purple-500' },
            { label: 'Institutions', value: stats.institutions, icon: Shield, color: 'from-teal-500 to-cyan-500' }
          ].map((stat, i) => (
            <Card key={i} className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{isLoading ? '...' : stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recherche intelligente */}
        <div className="flex justify-center">
          <CartographySmartSearch
            providers={allProviders}
            onSearch={setSearchQuery}
            onProviderSelect={setSelectedProvider}
            searchQuery={searchQuery}
          />
        </div>

        {/* Onglets Carte / Liste */}
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="map" className="gap-2">
              <Map className="w-4 h-4" />
              Carte
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <Database className="w-4 h-4" />
              Liste ({filteredProviders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-4">
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Carte interactive des prestataires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg overflow-hidden">
                  <HealthProvidersMap key={reloadKey} providers={allProviders} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <Card className="bg-card/50 backdrop-blur-xl border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Liste des prestataires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CartographyListView
                  providers={filteredProviders}
                  sortBy={sortBy}
                  onSortChange={(newSort) => setSortBy(newSort as SortBy)}
                  onProviderClick={(providerId) => {
                    const provider = allProviders.find(p => p.id === providerId);
                    if (provider) setSelectedProvider(provider);
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Résultats de recherche */}
        {searchQuery && (
          <div className="text-center text-sm text-muted-foreground">
            {filteredProviders.length} résultat(s) pour "{searchQuery}"
          </div>
        )}
      </div>
    </SuperAdminLayoutSimple>
  );
}
