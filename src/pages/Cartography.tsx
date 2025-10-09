import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import CartographySmartSearch from "@/components/cartography/CartographySmartSearch";
import CartographyFilterPanel from "@/components/cartography/CartographyFilterPanel";
import HealthProvidersMap from "@/components/landing/HealthProvidersMap";
import CartographyListView from "@/components/cartography/CartographyListView";
import CartographyProviderModal from "@/components/cartography/CartographyProviderModal";
import QuickFilters from "@/components/cartography/QuickFilters";
import SearchGuide from "@/components/cartography/SearchGuide";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List, LayoutGrid, Filter, MapPin, Locate, ArrowDown, Info } from "lucide-react";
import { CartographyProvider, CartographyFilters, Coordonnees } from "@/types/cartography";
import { calculateDistance } from "@/utils/distance";
import { filterProviders, sortProviders, calculateStats } from "@/utils/cartography-filters";
import providersData from "@/data/cartography-providers.json";
import provincesData from "@/data/cartography-provinces.json";
import { cn } from "@/lib/utils";

export default function Cartography() {
  const { isSuperAdmin } = useAuth();
  const [providers, setProviders] = useState<CartographyProvider[]>(providersData as CartographyProvider[]);
  const [filteredProviders, setFilteredProviders] = useState<CartographyProvider[]>(providersData as CartographyProvider[]);
  const [userLocation, setUserLocation] = useState<Coordonnees | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CartographyProvider | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [sortBy, setSortBy] = useState('distance');
  
  const [filters, setFilters] = useState<CartographyFilters>({
    types: [],
    province: 'all',
    ouvert24_7: false,
    cnamgs: false,
    specialite: null,
    equipement: null,
    maxDistance: null,
    searchText: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Géolocalisation non supportée");
      return;
    }

    toast.loading("Localisation en cours...");
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(coords);
        
        const withDistances = providers.map(p => ({
          ...p,
          distance: p.coordonnees ? calculateDistance(coords, p.coordonnees) : undefined
        }));
        setProviders(withDistances);
        toast.success("Position obtenue");
      },
      (error) => {
        toast.error("Impossible d'obtenir votre position");
        console.error(error);
      }
    );
  };

  useEffect(() => {
    let filtered = filterProviders(providers, filters);
    filtered = sortProviders(filtered, sortBy);
    setFilteredProviders(filtered);
  }, [providers, filters, sortBy]);

  const content = (
    <div className="space-y-6">
      {/* Hero Section avec recherche guidée */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative p-6 md:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl animate-scale-in">
                <MapPin className="h-7 w-7 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Trouvez votre professionnel de santé
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Recherchez facilement parmi {providers.length} établissements de santé au Gabon
            </p>
          </div>

          {/* Barre de recherche intelligente */}
          <div className="flex justify-center animate-fade-in">
            <CartographySmartSearch
              providers={providers}
              onSearch={(text) => setFilters({ ...filters, searchText: text })}
              onProviderSelect={(provider) => setSelectedProvider(provider)}
              searchQuery={filters.searchText}
            />
          </div>

          {/* Quick Filters */}
          <div className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <QuickFilters
              selectedType={filters.types[0] || null}
              onFilterSelect={(type) => setFilters({ 
                ...filters, 
                types: type ? [type] : [] 
              })}
            />
          </div>

          {/* Search Guide */}
          <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
            <SearchGuide
              onPreferenceSelect={(pref) => setFilters({
                ...filters,
                ouvert24_7: pref.ouvert247 || false,
                cnamgs: pref.cnamgs || false,
                maxDistance: pref.proche ? 10 : null
              })}
            />
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 text-muted-foreground animate-bounce pt-4">
            <span className="text-sm font-medium">Voir les résultats</span>
            <ArrowDown className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Résultats Section */}
      <div className="flex gap-6">
        {/* Desktop Sidebar avec filtres avancés */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtres avancés
              {showAdvancedFilters ? " ▼" : " ▶"}
            </Button>
            
            {showAdvancedFilters && (
              <div className="animate-fade-in">
                <CartographyFilterPanel
                  filters={filters}
                  onFiltersChange={setFilters}
                  provinces={provincesData.provinces}
                  hasUserLocation={!!userLocation}
                />
              </div>
            )}

            {/* Aide contextuelle */}
            <div className="bg-muted/50 rounded-xl p-4 space-y-2 border">
              <div className="flex items-center gap-2 text-primary">
                <Info className="h-5 w-5" />
                <span className="font-semibold text-sm">Astuce</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Utilisez la carte pour une vue géographique ou la liste pour comparer les établissements en détail.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-4">
          {/* Results Header avec info */}
          <div className="backdrop-blur-xl bg-card/80 rounded-xl border p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="font-semibold text-lg">
                {filteredProviders.length} résultat{filteredProviders.length > 1 ? 's' : ''}
              </div>
              {filteredProviders.length > 0 && (
                <Button
                  onClick={getUserLocation}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <Locate className="h-4 w-4" />
                  <span className="hidden sm:inline">Localiser</span>
                </Button>
              )}
            </div>

            {/* View Switcher avec tabs */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="map" className="gap-2">
                  <Map className="h-4 w-4" />
                  <span className="hidden sm:inline">Carte</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Liste</span>
                </TabsTrigger>
                <TabsTrigger value="both" className="gap-2 hidden md:flex">
                  <LayoutGrid className="h-4 w-4" />
                  Les deux
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Mobile Filter Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="lg:hidden gap-2">
                  <Filter className="h-4 w-4" />
                  Filtres
                  {(filters.types.length > 0 || filters.cnamgs || filters.ouvert24_7) && (
                    <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {filters.types.length + (filters.cnamgs ? 1 : 0) + (filters.ouvert24_7 ? 1 : 0)}
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="w-full sm:max-w-md overflow-y-auto max-h-[90vh]">
                <DialogHeader>
                  <DialogTitle>Filtres de recherche</DialogTitle>
                </DialogHeader>
                <div className="pt-2">
                  <CartographyFilterPanel
                    filters={filters}
                    onFiltersChange={setFilters}
                    provinces={provincesData.provinces}
                    hasUserLocation={!!userLocation}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Map View */}
          {(viewMode === 'map' || viewMode === 'both') && (
            <div className={cn(
              "rounded-lg overflow-hidden transition-all",
              viewMode === 'map' ? 'h-[calc(100vh-400px)]' : 'h-[600px]'
            )}>
              <HealthProvidersMap />
            </div>
          )}

          {/* List View */}
          {(viewMode === 'list' || viewMode === 'both') && (
            <div className="animate-fade-in">
              <CartographyListView
                providers={filteredProviders}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onProviderClick={(id) => setSelectedProvider(providers.find(p => p.id === id) || null)}
              />
            </div>
          )}

          {/* Empty State */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                <Map className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    types: [],
                    province: 'all',
                    ouvert24_7: false,
                    cnamgs: false,
                    specialite: null,
                    equipement: null,
                    maxDistance: null,
                    searchText: ''
                  });
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </main>
      </div>

      {/* Provider Details Modal */}
      <CartographyProviderModal
        provider={selectedProvider}
        userLocation={userLocation}
        onClose={() => setSelectedProvider(null)}
      />
    </div>
  );

  return isSuperAdmin ? (
    <SuperAdminLayout>
      {content}
    </SuperAdminLayout>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4">
      {content}
    </div>
  );
}
