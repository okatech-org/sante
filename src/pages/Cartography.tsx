import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import CartographySearchBar from "@/components/cartography/CartographySearchBar";
import CartographyFilterPanel from "@/components/cartography/CartographyFilterPanel";
import CartographyMapView from "@/components/cartography/CartographyMapView";
import CartographyListView from "@/components/cartography/CartographyListView";
import CartographyProviderModal from "@/components/cartography/CartographyProviderModal";
import CartographyStats from "@/components/cartography/CartographyStats";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Map, List, LayoutGrid, Filter, MapPin } from "lucide-react";
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

  const stats = useMemo(() => calculateStats(providers), [providers]);

  const content = (
    <div className="space-y-6">
      {/* Header avec effet glassmorphism */}
      <header className="backdrop-blur-xl bg-card/80 rounded-2xl border p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Cartographie Santé
              </h1>
              <p className="text-sm text-muted-foreground">Gabon • {filteredProviders.length} résultats</p>
            </div>
          </div>
          <CartographySearchBar
            onSearch={(text) => setFilters({ ...filters, searchText: text })}
            onGeolocate={getUserLocation}
            providers={providers}
          />
        </div>
      </header>

      {/* Stats avec animation */}
      <div className="animate-fade-in">
        <CartographyStats stats={stats} provinces={provincesData.provinces} />
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-4 animate-fade-in">
            <CartographyFilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              provinces={provincesData.provinces}
              hasUserLocation={!!userLocation}
            />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-2 justify-between backdrop-blur-xl bg-card/80 p-3 rounded-lg border">
            <div className="flex gap-2">
              {/* Mobile Filter Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filtres
                    {(filters.types.length > 0 || filters.cnamgs || filters.ouvert24_7) && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {filters.types.length + (filters.cnamgs ? 1 : 0) + (filters.ouvert24_7 ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full sm:max-w-md overflow-y-auto">
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

              {/* View Mode Switcher */}
              <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                <Button
                  variant={viewMode === 'map' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                  className={cn(
                    "transition-all",
                    viewMode === 'map' && "shadow-md"
                  )}
                >
                  <Map className="h-4 w-4 mr-1" /> 
                  <span className="hidden sm:inline">Carte</span>
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    "transition-all",
                    viewMode === 'list' && "shadow-md"
                  )}
                >
                  <List className="h-4 w-4 mr-1" /> 
                  <span className="hidden sm:inline">Liste</span>
                </Button>
                <Button
                  variant={viewMode === 'both' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('both')}
                  className={cn(
                    "hidden md:flex transition-all",
                    viewMode === 'both' && "shadow-md"
                  )}
                >
                  <LayoutGrid className="h-4 w-4 mr-1" /> 
                  Les deux
                </Button>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(filters.types.length > 0 || filters.province !== 'all' || filters.cnamgs || filters.ouvert24_7) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="hidden sm:inline">Filtres actifs:</span>
                <div className="flex gap-1">
                  {filters.types.length > 0 && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {filters.types.length} type{filters.types.length > 1 ? 's' : ''}
                    </span>
                  )}
                  {filters.province !== 'all' && (
                    <span className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs">
                      Province
                    </span>
                  )}
                  {filters.cnamgs && (
                    <span className="px-2 py-1 bg-accent/10 text-accent rounded text-xs">
                      CNAMGS
                    </span>
                  )}
                  {filters.ouvert24_7 && (
                    <span className="px-2 py-1 bg-success/10 text-success rounded text-xs">
                      24/7
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Map View */}
          {(viewMode === 'map' || viewMode === 'both') && (
            <div className={cn(
              "rounded-lg overflow-hidden border shadow-lg transition-all",
              viewMode === 'map' ? 'h-[calc(100vh-400px)]' : 'h-[500px]'
            )}>
              <CartographyMapView
                providers={filteredProviders}
                userLocation={userLocation}
                onMarkerClick={(id) => setSelectedProvider(providers.find(p => p.id === id) || null)}
              />
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
