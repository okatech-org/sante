// ============================================
// COMPOSANT: PharmacySearch - Recherche Pharmacies
// Date: 3 novembre 2025
// ============================================

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Phone, 
  Clock,
  Star,
  Navigation,
  Filter
} from 'lucide-react';
import { usePharmaciesSearch, useNearbyPharmacies } from '@/hooks/usePharmacy';
import { PharmacieSearchFilters, PROVINCES_GABON, VILLES_PRINCIPALES } from '@/types/pharmacy';
import { Link } from 'react-router-dom';
import { pharmacySlugFromName } from '@/lib/utils';

export function PharmacySearch() {
  const [filters, setFilters] = useState<PharmacieSearchFilters>({
    search: '',
    ville: undefined,
    province: undefined,
    ouvert_maintenant: undefined,
    ouvert_24_7: undefined,
    conventionnement_cnamgs: undefined,
    page: 1,
    limit: 20,
  });

  const [useGeolocation, setUseGeolocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { data: searchResults, isLoading } = usePharmaciesSearch(filters);
  const { data: nearbyResults, isLoading: nearbyLoading } = useNearbyPharmacies(
    userLocation?.lat,
    userLocation?.lng,
    10
  );

  const handleSearch = (value: string) => {
    setFilters({ ...filters, search: value, page: 1 });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setUseGeolocation(true);
        },
        (error) => {
          console.error('Erreur géolocalisation:', error);
        }
      );
    }
  };

  const displayResults = useGeolocation && nearbyResults 
    ? nearbyResults 
    : searchResults?.results || [];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Trouver une Pharmacie</h1>
        <p className="text-muted-foreground">
          Recherchez des pharmacies au Gabon par localisation, services ou disponibilité
        </p>
      </div>

      {/* Raccourcis Province / Ville */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">Raccourcis</p>
          {(filters.province || filters.ville) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ ...filters, province: undefined, ville: undefined, page: 1 })}
            >
              Réinitialiser
            </Button>
          )}
        </div>

        {/* Provinces */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {PROVINCES_GABON.map((province) => (
            <Badge
              key={province}
              variant={filters.province === province ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setFilters({ ...filters, province, ville: undefined, page: 1 })}
            >
              {province}
            </Badge>
          ))}
        </div>

        {/* Villes principales */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {VILLES_PRINCIPALES.map((ville) => (
            <Badge
              key={ville}
              variant={filters.ville === ville ? 'default' : 'outline'}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setFilters({ ...filters, ville, page: 1 })}
            >
              {ville}
            </Badge>
          ))}
        </div>
      </div>

      {/* Filtres de Recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtres de Recherche
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Barre de recherche */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Nom de la pharmacie..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={handleGetLocation} variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Proche de moi
            </Button>
          </div>

          {/* Filtres géographiques */}
          <div className="grid gap-4 md:grid-cols-2">
            <Select 
              value={filters.province} 
              onValueChange={(value) => setFilters({ ...filters, province: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Province" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES_GABON.map((province) => (
                  <SelectItem key={province} value={province}>
                    {province}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select 
              value={filters.ville} 
              onValueChange={(value) => setFilters({ ...filters, ville: value, page: 1 })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Ville" />
              </SelectTrigger>
              <SelectContent>
                {VILLES_PRINCIPALES.map((ville) => (
                  <SelectItem key={ville} value={ville}>
                    {ville}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtres services */}
          <div className="flex flex-wrap gap-2">
            <Badge 
              variant={filters.ouvert_24_7 ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilters({ 
                ...filters, 
                ouvert_24_7: filters.ouvert_24_7 ? undefined : true,
                page: 1 
              })}
            >
              Ouvert 24/7
            </Badge>
            <Badge 
              variant={filters.ouvert_maintenant ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilters({ 
                ...filters, 
                ouvert_maintenant: filters.ouvert_maintenant ? undefined : true,
                page: 1 
              })}
            >
              Ouvert Maintenant
            </Badge>
            <Badge 
              variant={filters.conventionnement_cnamgs ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setFilters({ 
                ...filters, 
                conventionnement_cnamgs: filters.conventionnement_cnamgs ? undefined : true,
                page: 1 
              })}
            >
              CNAMGS
            </Badge>
          </div>

          {/* Reset */}
          {(filters.search || filters.province || filters.ville || filters.ouvert_24_7 || filters.ouvert_maintenant || filters.conventionnement_cnamgs) && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setFilters({ page: 1, limit: 20 })}
            >
              Réinitialiser les filtres
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Résultats */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {isLoading || nearbyLoading ? (
              'Recherche en cours...'
            ) : (
              `${searchResults?.pagination.total || nearbyResults?.length || 0} pharmacie(s) trouvée(s)`
            )}
          </h2>
        </div>

        {isLoading || nearbyLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
        ) : displayResults.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucune pharmacie trouvée</p>
              <p className="text-sm mt-2">Essayez de modifier vos critères de recherche</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {displayResults.map((pharmacy: any) => {
              const slug = pharmacySlugFromName(pharmacy.nom_commercial || String(pharmacy.id || pharmacy.pharmacy_id));
              return (
              <Link key={pharmacy.id || pharmacy.pharmacy_id} to={`/pharmacies/${slug}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg">{pharmacy.nom_commercial}</CardTitle>
                      {pharmacy.ouvert_maintenant && (
                        <Badge variant="default" className="text-xs">Ouvert</Badge>
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {pharmacy.quartier && `${pharmacy.quartier}, `}
                        {pharmacy.ville}
                      </div>
                      {pharmacy.distance_km && (
                        <div className="flex items-center gap-1">
                          <Navigation className="h-3 w-3" />
                          {pharmacy.distance_km} km
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {pharmacy.telephone_principal}
                    </div>
                    
                    {pharmacy.note_moyenne > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{pharmacy.note_moyenne.toFixed(1)}</span>
                        <span className="text-xs text-muted-foreground">
                          ({pharmacy.nombre_avis})
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                      {pharmacy.ouvert_24_7 && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          24/7
                        </Badge>
                      )}
                      {pharmacy.conventionnement_cnamgs && (
                        <Badge variant="outline" className="text-xs">CNAMGS</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );})}
          </div>
        )}

        {/* Pagination */}
        {searchResults && searchResults.pagination.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <Button
              variant="outline"
              disabled={searchResults.pagination.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page! - 1 })}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-2 px-4">
              Page {searchResults.pagination.page} / {searchResults.pagination.total_pages}
            </div>
            <Button
              variant="outline"
              disabled={searchResults.pagination.page === searchResults.pagination.total_pages}
              onClick={() => setFilters({ ...filters, page: filters.page! + 1 })}
            >
              Suivant
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default PharmacySearch;

