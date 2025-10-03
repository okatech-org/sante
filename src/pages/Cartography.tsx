import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import CartographySearchBar from "@/components/cartography/CartographySearchBar";
import CartographyFilterPanel from "@/components/cartography/CartographyFilterPanel";
import CartographyMapView from "@/components/cartography/CartographyMapView";
import CartographyListView from "@/components/cartography/CartographyListView";
import CartographyProviderModal from "@/components/cartography/CartographyProviderModal";
import CartographyStats from "@/components/cartography/CartographyStats";
import { Button } from "@/components/ui/button";
import { Map, List, LayoutGrid } from "lucide-react";
import { CartographyProvider, CartographyFilters, Coordonnees } from "@/types/cartography";
import { calculateDistance } from "@/utils/distance";
import { filterProviders, sortProviders, calculateStats } from "@/utils/cartography-filters";
import providersData from "@/data/cartography-providers.json";
import provincesData from "@/data/cartography-provinces.json";

export default function Cartography() {
  const [providers, setProviders] = useState<CartographyProvider[]>(providersData);
  const [filteredProviders, setFilteredProviders] = useState<CartographyProvider[]>(providersData);
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

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
            <h1 className="text-2xl font-bold">🗺️ Cartographie Santé Gabon</h1>
            <CartographySearchBar
              onSearch={(text) => setFilters({ ...filters, searchText: text })}
              onGeolocate={getUserLocation}
              providers={providers}
            />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <CartographyStats stats={stats} provinces={provincesData.provinces} />

        <div className="mt-6 flex gap-6">
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <CartographyFilterPanel
              filters={filters}
              onFiltersChange={setFilters}
              provinces={provincesData.provinces}
              hasUserLocation={!!userLocation}
            />
          </aside>

          <main className="flex-1 space-y-4">
            <div className="flex gap-2 justify-end">
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <Map className="h-4 w-4 mr-1" /> Carte
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4 mr-1" /> Liste
              </Button>
              <Button
                variant={viewMode === 'both' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('both')}
              >
                <LayoutGrid className="h-4 w-4 mr-1" /> Les deux
              </Button>
            </div>

            {(viewMode === 'map' || viewMode === 'both') && (
              <div className="h-[500px]">
                <CartographyMapView
                  providers={filteredProviders}
                  userLocation={userLocation}
                  onMarkerClick={(id) => setSelectedProvider(providers.find(p => p.id === id) || null)}
                />
              </div>
            )}

            {(viewMode === 'list' || viewMode === 'both') && (
              <CartographyListView
                providers={filteredProviders}
                sortBy={sortBy}
                onSortChange={setSortBy}
                onProviderClick={(id) => setSelectedProvider(providers.find(p => p.id === id) || null)}
              />
            )}
          </main>
        </div>
      </div>

      <CartographyProviderModal
        provider={selectedProvider}
        userLocation={userLocation}
        onClose={() => setSelectedProvider(null)}
      />
    </div>
  );
}
