import { MainLayout } from "@/components/layout/MainLayout";
import { SearchBar } from "@/components/providers/SearchBar";
import { FiltersSidebar } from "@/components/providers/FiltersSidebar";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { ProviderModal } from "@/components/providers/ProviderModal";
import { mockProviders, Provider } from "@/lib/providers-data";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { List, Map as MapIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type ViewMode = 'list' | 'map';
type SortBy = 'relevance' | 'distance' | 'rating';

export default function Providers() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [sortBy, setSortBy] = useState<SortBy>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [providers, setProviders] = useState<Provider[]>(mockProviders);
  const [filteredProviders, setFilteredProviders] = useState<Provider[]>(mockProviders);

  useEffect(() => {
    // Sort providers based on selected criteria
    const sorted = [...filteredProviders].sort((a, b) => {
      switch (sortBy) {
        case 'distance':
          return (a.distance || 999) - (b.distance || 999);
        case 'rating':
          return b.rating - a.rating;
        case 'relevance':
        default:
          return 0;
      }
    });
    setFilteredProviders(sorted);
  }, [sortBy]);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredProviders(providers);
      return;
    }

    const filtered = providers.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.specialtyLabel?.toLowerCase().includes(query.toLowerCase()) ||
      p.city.toLowerCase().includes(query.toLowerCase()) ||
      p.address.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProviders(filtered);
    toast.success(`${filtered.length} résultat(s) trouvé(s)`);
  };

  const handleUseLocation = () => {
    toast.info("Géolocalisation en cours...");
    // Simulate geolocation
    setTimeout(() => {
      toast.success("Position détectée: Libreville");
    }, 1000);
  };

  const handleApplyFilters = (filters: any) => {
    let filtered = [...providers];

    // Filter by province/city
    if (filters.province) {
      filtered = filtered.filter(p => 
        p.province.toLowerCase() === filters.province.toLowerCase()
      );
    }

    if (filters.city) {
      filtered = filtered.filter(p => 
        p.city.toLowerCase().includes(filters.city.toLowerCase())
      );
    }

    // Filter by availability
    if (filters.openNow) {
      filtered = filtered.filter(p => p.isOpenNow);
    }

    if (filters.open24h) {
      filtered = filtered.filter(p => p.isOpen24h);
    }

    if (filters.availableToday) {
      filtered = filtered.filter(p => p.availableToday);
    }

    if (filters.acceptsNewPatients) {
      filtered = filtered.filter(p => p.acceptsNewPatients);
    }

    // Filter by insurance
    if (filters.cnamgs) {
      filtered = filtered.filter(p => p.cnamgsConventioned);
    }

    if (filters.cnss) {
      filtered = filtered.filter(p => p.acceptsCNSS);
    }

    // Filter by services
    if (filters.telemedicine) {
      filtered = filtered.filter(p => p.telemedicine);
    }

    if (filters.onlineBooking) {
      filtered = filtered.filter(p => p.onlineBooking);
    }

    setFilteredProviders(filtered);
    toast.success(`${filtered.length} prestataire(s) trouvé(s)`);
  };

  const handleViewProfile = (provider: Provider) => {
    setSelectedProvider(provider);
    setShowModal(true);
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  const handleGetDirections = (provider: Provider) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${provider.lat},${provider.lng}`;
    window.open(mapsUrl, '_blank');
  };

  const handleBookAppointment = (providerId: string) => {
    toast.info("Redirection vers la prise de rendez-vous...");
    // Navigate to appointment booking
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-background">
        <SearchBar
          onSearch={handleSearch}
          onUseLocation={handleUseLocation}
          onToggleFilters={() => setShowFilters(true)}
        />

        <div className="flex">
          <FiltersSidebar
            open={showFilters}
            onClose={() => setShowFilters(false)}
            onApplyFilters={handleApplyFilters}
          />

          <main className="flex-1">
            <div className="container max-w-7xl mx-auto px-4 py-6">
              {/* Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <p className="text-lg font-medium">
                    {filteredProviders.length} prestataire(s) trouvé(s)
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Pertinence</SelectItem>
                      <SelectItem value="distance">Distance</SelectItem>
                      <SelectItem value="rating">Note</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-1 border rounded-lg p-1">
                    <Button
                      size="sm"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={viewMode === 'map' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('map')}
                    >
                      <MapIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Results */}
              {viewMode === 'list' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProviders.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      onViewProfile={handleViewProfile}
                      onCall={handleCall}
                      onBookAppointment={handleBookAppointment}
                      onGetDirections={handleGetDirections}
                    />
                  ))}
                </div>
              ) : (
                <div className="bg-accent/20 rounded-lg p-12 text-center">
                  <MapIcon className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-lg font-medium mb-2">Vue carte</p>
                  <p className="text-muted-foreground">
                    La carte interactive sera disponible prochainement avec géolocalisation en temps réel
                  </p>
                </div>
              )}

              {filteredProviders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl font-medium mb-2">Aucun résultat trouvé</p>
                  <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>

        <ProviderModal
          provider={selectedProvider}
          open={showModal}
          onClose={() => setShowModal(false)}
          onCall={handleCall}
          onGetDirections={handleGetDirections}
          onBookAppointment={handleBookAppointment}
        />
      </div>
    </MainLayout>
  );
}
