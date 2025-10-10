import { useState, useEffect, useMemo } from "react";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { useAuth } from "@/contexts/AuthContext";
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
import cartographyData from "@/data/cartography-providers.json";

type SortBy = "name-asc" | "name-desc" | "city-asc" | "city-desc" | "type-asc" | "distance-asc";

export default function AdminCartography() {
  const { isSuperAdmin } = useAuth();
  const [stats, setStats] = useState({ 
    total: 0, 
    hopitaux: 0, 
    cliniques: 0, 
    pharmacies: 0,
    cabinets: 0,
    laboratoires: 0,
    withOSM: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [osmProviders, setOsmProviders] = useState<CartographyProvider[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<CartographyProvider | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("name-asc");

  const baseProviders = useMemo(() => {
    return (cartographyData as CartographyProvider[]);
  }, []);

  const allProviders = useMemo(() => {
    const combined = [...baseProviders];
    const existingIds = new Set(baseProviders.map(p => p.id));
    
    osmProviders.forEach(osmProvider => {
      if (!existingIds.has(osmProvider.id)) {
        combined.push(osmProvider);
      }
    });
    
    return combined;
  }, [baseProviders, osmProviders]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Charger les données OSM
      const osmData = await getOSMProvidersFromSupabase();
      setOsmProviders(osmData);

      // Calculer les statistiques
      const combined = [...baseProviders];
      const existingIds = new Set(baseProviders.map(p => p.id));
      
      osmData.forEach(osmProvider => {
        if (!existingIds.has(osmProvider.id)) {
          combined.push(osmProvider);
        }
      });

      setStats({
        total: combined.length,
        hopitaux: combined.filter(p => p.type === 'hopital').length,
        cliniques: combined.filter(p => p.type === 'clinique').length,
        pharmacies: combined.filter(p => p.type === 'pharmacie').length,
        cabinets: combined.filter(p => p.type === 'cabinet_medical' || p.type === 'cabinet_dentaire').length,
        laboratoires: combined.filter(p => p.type === 'laboratoire').length,
        withOSM: osmData.length
      });
    } catch (error: any) {
      console.error("Erreur:", error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    toast.info("Synchronisation en cours...");
    await loadData();
    toast.success("Données synchronisées avec succès");
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

  return (
    <SuperAdminLayout>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: 'Total', value: stats.total, icon: Activity, color: 'from-blue-500 to-cyan-500' },
            { label: 'Hôpitaux', value: stats.hopitaux, icon: Building2, color: 'from-purple-500 to-pink-500' },
            { label: 'Cliniques', value: stats.cliniques, icon: Building2, color: 'from-green-500 to-emerald-500' },
            { label: 'Pharmacies', value: stats.pharmacies, icon: MapPin, color: 'from-orange-500 to-amber-500' },
            { label: 'Cabinets', value: stats.cabinets, icon: Building2, color: 'from-indigo-500 to-blue-500' },
            { label: 'Laboratoires', value: stats.laboratoires, icon: Database, color: 'from-pink-500 to-rose-500' },
            { label: 'OSM', value: stats.withOSM, icon: Map, color: 'from-teal-500 to-cyan-500' }
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
                  <HealthProvidersMap />
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
    </SuperAdminLayout>
  );
}
