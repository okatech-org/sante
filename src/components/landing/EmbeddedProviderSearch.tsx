import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import EnhancedSmartSearch from "@/components/cartography/EnhancedSmartSearch";
import HealthProvidersMap from "./HealthProvidersMap";
import { 
  MapPin, Phone, Mail, Clock, Calendar, Shield, Heart,
  ChevronRight, LogIn, UserPlus, Building2, Star,
  Map, List, AlertCircle, Info, Navigation
} from "lucide-react";
import { CartographyProvider } from "@/types/cartography";
import { REAL_ESTABLISHMENTS } from "@/data/real-establishments";
import { filterProvidersEnhanced, sortProvidersEnhanced } from "@/utils/enhanced-cartography-filters";
import { useAuth } from "@/contexts/AuthContext";

interface EmbeddedProviderSearchProps {
  showTitle?: boolean;
  className?: string;
}

export default function EmbeddedProviderSearch({ 
  showTitle = true, 
  className = "" 
}: EmbeddedProviderSearchProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [providers, setProviders] = useState<CartographyProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<CartographyProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CartographyProvider | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [showMap, setShowMap] = useState(true);
  
  const [filters, setFilters] = useState({
    types: [],
    specialties: [],
    services: [],
    equipment: [],
    amenities: [],
    distance: [50],
    rating: [0],
    priceRange: "all",
    openNow: false,
    open24h: false,
    cnamgs: false,
    cnss: false,
    privateInsurance: false,
    languages: [],
    sortBy: "distance",
    searchText: "",
    province: "all",
    urgent: false,
    cityFilter: null
  });

  // Charger les données
  useEffect(() => {
    setProviders(REAL_ESTABLISHMENTS);
  }, []);

  // Géolocalisation automatique et priorité distance
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // Prioritaire distance quand géoloc disponible
          setFilters(prev => ({ ...prev, sortBy: "distance" }));
        },
        () => {
          setUserLocation({
            lat: 0.4162,
            lng: 9.4673
          });
          // Fallback Libreville
          setFilters(prev => ({ ...prev, sortBy: "distance" }));
        }
      );
    } else {
      setUserLocation({
        lat: 0.4162,
        lng: 9.4673
      });
      // Fallback sans géoloc
      setFilters(prev => ({ ...prev, sortBy: "distance" }));
    }
  }, []);

  // Calculer les distances et passer en mode distance
  useEffect(() => {
    if (userLocation && providers.length > 0) {
      const providersWithDistance = providers.map(p => {
        if (!p.coordonnees) return p;
        
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          p.coordonnees.lat,
          p.coordonnees.lng
        );
        
        return { ...p, distance };
      });
      
      setProviders(providersWithDistance);
      
      // Activer automatiquement le tri par distance quand la géolocalisation est disponible
      if (filters.sortBy === "relevance") {
        setFilters(prev => ({ ...prev, sortBy: "distance" }));
      }
    }
  }, [userLocation]);

  // Filtrer et trier
  useEffect(() => {
    const filtered = filterProvidersEnhanced(providers, filters as any);
    const sorted = sortProvidersEnhanced(filtered, filters.sortBy);
    setFilteredProviders(sorted);
  }, [providers, filters]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleBooking = (provider: CartographyProvider) => {
    if (user) {
      navigate(`/book/${provider.id}`);
    } else {
      setSelectedProvider(provider);
      setShowAuthPrompt(true);
    }
  };

  const handleAuthAction = (action: 'login' | 'register') => {
    localStorage.setItem('selectedProviderId', selectedProvider?.id || '');
    navigate(action === 'login' ? '/login/patient' : '/register/patient');
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {showTitle && (
        <div className="space-y-2 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Trouvez votre professionnel de santé
          </h2>
          <p className="text-lg text-muted-foreground">
            {REAL_ESTABLISHMENTS.length} établissements de santé à votre service
          </p>
        </div>
      )}

      {/* Recherche */}
      <Card className="p-4 bg-card/95 backdrop-blur-xl">
        <EnhancedSmartSearch
          providers={providers}
          onSearch={(text) => setFilters({ ...filters, searchText: text })}
          onProviderSelect={(provider) => setSelectedProvider(provider)}
          onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
          searchQuery={filters.searchText}
          userLocation={userLocation}
        />
      </Card>

      {/* Contrôles */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Tabs value={showMap ? "map" : "list"} onValueChange={(v) => setShowMap(v === "map")}>
              <TabsList className="grid w-fit grid-cols-2">
                <TabsTrigger value="map" className="gap-2">
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Carte</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Liste</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {filteredProviders.length} résultat{filteredProviders.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filtres actifs */}
        {(filters.cityFilter || filters.specialties.length > 0 || filters.services.length > 0 || filters.urgent) && (
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-muted-foreground">Filtres actifs:</span>
            
            {filters.cityFilter && (
              <Badge variant="secondary" className="gap-1">
                <MapPin className="w-3 h-3" />
                {filters.cityFilter[0]}
              </Badge>
            )}
            
            {filters.specialties.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Heart className="w-3 h-3" />
                {filters.specialties.length} spécialité{filters.specialties.length > 1 ? 's' : ''}
              </Badge>
            )}
            
            {filters.services.length > 0 && (
              <Badge variant="secondary" className="gap-1">
                <Shield className="w-3 h-3" />
                {filters.services.length} service{filters.services.length > 1 ? 's' : ''}
              </Badge>
            )}
            
            {filters.urgent && (
              <Badge variant="destructive" className="gap-1">
                <AlertCircle className="w-3 h-3" />
                Urgence
              </Badge>
            )}
            
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setFilters({
                  types: [],
                  specialties: [],
                  services: [],
                  equipment: [],
                  amenities: [],
                  distance: [50],
                  rating: [0],
                  priceRange: "all",
                  openNow: false,
                  open24h: false,
                  cnamgs: false,
                  cnss: false,
                  privateInsurance: false,
                  languages: [],
                  sortBy: "distance",
                  searchText: "",
                  province: "all",
                  urgent: false,
                  cityFilter: null
                });
              }}
              className="h-6 text-xs"
            >
              <X className="w-3 h-3 mr-1" />
              Tout effacer
            </Button>
          </div>
        )}
      </div>

      {/* Affichage Carte */}
      {showMap && (
        <div className="rounded-lg overflow-hidden h-[400px] md:h-[500px] border">
          <HealthProvidersMap 
            providers={filteredProviders} 
            centerOnCity={filters.cityFilter?.[0] || null}
          />
        </div>
      )}

      {/* Affichage Liste */}
      {!showMap && (
        <div className="grid gap-3 max-h-[500px] overflow-y-auto">
          {filteredProviders.length === 0 ? (
            <Card className="p-8 text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Essayez de modifier vos critères de recherche ou de filtres
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({
                    types: [],
                    specialties: [],
                    services: [],
                    equipment: [],
                    amenities: [],
                    distance: [50],
                    rating: [0],
                    priceRange: "all",
                    openNow: false,
                    open24h: false,
                    cnamgs: false,
                    cnss: false,
                    privateInsurance: false,
                    languages: [],
                    sortBy: "distance",
                    searchText: "",
                    province: "all",
                    urgent: false
                  });
                }}
              >
                Réinitialiser les filtres
              </Button>
            </Card>
          ) : (
            <>
              {filteredProviders.slice(0, 5).map((provider, index) => (
                <Card key={provider.id} className="p-3 hover:shadow-lg transition-shadow">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      {index === 0 && filters.sortBy === "distance" && provider.distance && (
                        <Navigation className="w-6 h-6 text-primary" />
                      )}
                      {!(index === 0 && filters.sortBy === "distance" && provider.distance) && (
                        <Building2 className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{provider.nom}</h4>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            {provider.ville}
                            {provider.distance && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-primary">
                                  {provider.distance.toFixed(1)} km
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-1">
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {provider.type}
                          </Badge>
                          {provider.ouvert_24_7 && (
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              <Clock className="w-3 h-3 mr-1" />
                              24/7
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Services/Spécialités */}
                      {(provider.services || provider.specialites) && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.services?.slice(0, 2).map(service => (
                            <Badge key={service} variant="outline" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {provider.specialites?.slice(0, 1).map(spec => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => setSelectedProvider(provider)}
                        >
                          Détails
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleBooking(provider)}
                        >
                          <Calendar className="w-3 h-3 mr-1" />
                          RDV
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredProviders.length > 5 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/find-providers')}
                >
                  Voir tous les {filteredProviders.length} résultats
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal détails */}
      <Dialog open={!!selectedProvider && !showAuthPrompt} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent>
          {selectedProvider && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProvider.nom}</DialogTitle>
                <DialogDescription className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedProvider.ville}, {selectedProvider.province}
                  {selectedProvider.distance && (
                    <span className="ml-2 font-medium text-primary">
                      • {selectedProvider.distance.toFixed(1)} km
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">
                    {selectedProvider.type}
                  </Badge>
                  {selectedProvider.ouvert_24_7 && (
                    <Badge>
                      <Clock className="w-3 h-3 mr-1" />
                      24/7
                    </Badge>
                  )}
                  {selectedProvider.conventionnement?.cnamgs && (
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      CNAMGS
                    </Badge>
                  )}
                  {selectedProvider.conventionnement?.cnss && (
                    <Badge variant="secondary">
                      <Shield className="w-3 h-3 mr-1" />
                      CNSS
                    </Badge>
                  )}
                </div>

                {/* Services */}
                {selectedProvider.services && selectedProvider.services.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Services</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedProvider.services.map(service => (
                        <Badge key={service} variant="outline" className="text-xs">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spécialités */}
                {selectedProvider.specialites && selectedProvider.specialites.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Spécialités</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedProvider.specialites.map(spec => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProvider.telephones?.[0] && (
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <a href={`tel:${selectedProvider.telephones[0]}`} className="font-medium hover:underline">
                      {selectedProvider.telephones[0]}
                    </a>
                  </div>
                )}

                {selectedProvider.adresse_descriptive && (
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">{selectedProvider.adresse_descriptive}</p>
                  </div>
                )}

                <Separator />

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleBooking(selectedProvider)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Prendre RDV
                  </Button>
                  {selectedProvider.telephones?.[0] && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${selectedProvider.telephones[0]}`}>
                        <Phone className="w-4 h-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal auth */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Connexion requise
            </DialogTitle>
            <DialogDescription>
              Pour prendre rendez-vous, connectez-vous ou créez un compte.
            </DialogDescription>
          </DialogHeader>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm">Avantages :</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Gérer vos rendez-vous
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Votre dossier médical
              </li>
              <li className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                Rappels automatiques
              </li>
            </ul>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={() => handleAuthAction('register')}
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Créer un compte (gratuit)
            </Button>
            <Button
              onClick={() => handleAuthAction('login')}
              variant="outline"
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Se connecter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
