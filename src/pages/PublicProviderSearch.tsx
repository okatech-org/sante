import { useState, useEffect, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSmartSearch from "@/components/cartography/EnhancedSmartSearch";
import AdvancedFilters from "@/components/cartography/AdvancedFilters";
import HealthProvidersMap from "@/components/landing/HealthProvidersMap";
import { 
  MapPin, Phone, Mail, Clock, Star, Navigation, Calendar,
  Shield, Heart, ChevronRight, LogIn, UserPlus, X,
  Building2, Stethoscope, AlertCircle, Info, Map, List
} from "lucide-react";
import { CartographyProvider, CartographyFilters } from "@/types/cartography";
import { REAL_ESTABLISHMENTS } from "@/data/real-establishments";
import { filterProvidersEnhanced, sortProvidersEnhanced } from "@/utils/enhanced-cartography-filters";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export default function PublicProviderSearch() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [providers, setProviders] = useState<CartographyProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<CartographyProvider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<CartographyProvider | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingAction, setPendingAction] = useState<'booking' | 'contact' | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [showFilters, setShowFilters] = useState(false);
  
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
    sortBy: "relevance",
    searchText: searchParams.get('search') || "",
    province: "all"
  });

  // Charger les données au montage
  useEffect(() => {
    setProviders(REAL_ESTABLISHMENTS);
    toast.success(`${REAL_ESTABLISHMENTS.length} établissements disponibles`);
  }, []);

  // Obtenir la géolocalisation automatiquement
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success("Position détectée");
        },
        (error) => {
          console.log("Géolocalisation non disponible:", error);
          // Ne pas afficher d'erreur, utiliser simplement Libreville par défaut
          setUserLocation({
            lat: 0.4162,
            lng: 9.4673
          });
        }
      );
    } else {
      // Position par défaut : Libreville
      setUserLocation({
        lat: 0.4162,
        lng: 9.4673
      });
    }
  }, []);

  // Calculer les distances si position disponible
  useEffect(() => {
    if (userLocation) {
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
    }
  }, [userLocation]);

  // Filtrer les providers
  useEffect(() => {
    const filtered = filterProvidersEnhanced(providers, filters as any);
    const sorted = sortProvidersEnhanced(filtered, filters.sortBy);
    setFilteredProviders(sorted);
  }, [providers, filters]);

  // Fonction pour calculer la distance
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

  // Gérer les actions nécessitant une authentification
  const handleAuthRequiredAction = (action: 'booking' | 'contact', provider: CartographyProvider) => {
    if (user) {
      // Si connecté, rediriger directement
      if (action === 'booking') {
        navigate(`/book/${provider.id}`);
      } else {
        setSelectedProvider(provider);
      }
    } else {
      // Sinon, afficher le prompt de connexion
      setSelectedProvider(provider);
      setPendingAction(action);
      setShowAuthPrompt(true);
    }
  };

  // Gérer la connexion depuis le prompt
  const handleAuthPromptAction = (action: 'login' | 'register') => {
    // Sauvegarder l'intention de l'utilisateur
    const returnUrl = pendingAction === 'booking' && selectedProvider
      ? `/book/${selectedProvider.id}`
      : `/providers/${selectedProvider?.id}`;
    
    localStorage.setItem('returnUrl', returnUrl);
    localStorage.setItem('selectedProviderId', selectedProvider?.id || '');
    
    navigate(action === 'login' ? '/login/patient' : '/register/patient');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header simplifié */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
            <Heart className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">SANTE.GA</span>
          </div>
          
          <div className="flex items-center gap-2">
            {user ? (
              <Button onClick={() => navigate('/dashboard/patient')} variant="default">
                Mon Espace
              </Button>
            ) : (
              <>
                <Button onClick={() => navigate('/login/patient')} variant="ghost" size="sm">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
                <Button onClick={() => navigate('/register/patient')} variant="default" size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  S'inscrire
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Bannière info pour utilisateurs non connectés */}
      {!user && (
        <div className="bg-primary/10 border-b border-primary/20 py-3">
          <div className="container px-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary flex-shrink-0" />
                <p className="text-sm">
                  <span className="font-medium">Recherchez librement.</span>
                  {" "}Connectez-vous uniquement pour prendre rendez-vous.
                </p>
              </div>
              <Button
                onClick={() => navigate('/register/patient')}
                variant="outline"
                size="sm"
                className="hidden sm:flex"
              >
                Créer un compte
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="container px-4 py-6 space-y-6">
        {/* Section recherche */}
        <Card className="p-4">
          <EnhancedSmartSearch
            providers={providers}
            onSearch={(text) => setFilters({ ...filters, searchText: text })}
            onProviderSelect={(provider) => setSelectedProvider(provider)}
            onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
            searchQuery={filters.searchText}
            userLocation={userLocation}
          />
        </Card>

        {/* Résultats */}
        <div className="flex gap-4">
          {/* Filtres latéraux (desktop) */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-20">
              <AdvancedFilters
                onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
                totalResults={filteredProviders.length}
              />
            </div>
          </aside>

          {/* Contenu principal */}
          <main className="flex-1 space-y-4">
            {/* Barre d'actions */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as any)}>
                  <TabsList>
                    <TabsTrigger value="map" className="gap-2">
                      <Map className="w-4 h-4" />
                      Carte
                    </TabsTrigger>
                    <TabsTrigger value="list" className="gap-2">
                      <List className="w-4 h-4" />
                      Liste
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setShowFilters(true)}
                >
                  Filtres
                  {filters.types.length > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {filters.types.length}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-muted-foreground">
                {filteredProviders.length} résultat{filteredProviders.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Carte */}
            {viewMode === 'map' && (
              <div className="rounded-lg overflow-hidden h-[600px]">
                <HealthProvidersMap providers={filteredProviders} />
              </div>
            )}

            {/* Liste */}
            {viewMode === 'list' && (
              <div className="grid gap-4">
                {filteredProviders.map(provider => (
                  <Card key={provider.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-8 h-8 text-primary" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{provider.nom}</h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span>{provider.ville}, {provider.province}</span>
                              {provider.distance && (
                                <>
                                  <span>•</span>
                                  <span>{provider.distance.toFixed(1)} km</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <Badge variant="secondary">
                            {provider.type}
                          </Badge>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-3">
                          {provider.ouvert_24_7 && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              24/7
                            </Badge>
                          )}
                          {provider.conventionnement?.cnamgs && (
                            <Badge variant="outline" className="text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              CNAMGS
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedProvider(provider)}
                          >
                            Voir détails
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleAuthRequiredAction('booking', provider)}
                          >
                            <Calendar className="w-4 h-4 mr-2" />
                            Prendre RDV
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Empty state */}
            {filteredProviders.length === 0 && (
              <Card className="p-12 text-center">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Aucun résultat</h3>
                <p className="text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </Card>
            )}
          </main>
        </div>
      </div>

      {/* Modal détails établissement */}
      <Dialog open={!!selectedProvider && !showAuthPrompt} onOpenChange={(open) => !open && setSelectedProvider(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          {selectedProvider && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedProvider.nom}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 text-base">
                  <MapPin className="w-4 h-4" />
                  {selectedProvider.ville}, {selectedProvider.province}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Informations principales */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <Building2 className="w-4 h-4" />
                      Type
                    </div>
                    <p className="font-semibold">{selectedProvider.type}</p>
                  </Card>
                  
                  {selectedProvider.distance && (
                    <Card className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Navigation className="w-4 h-4" />
                        Distance
                      </div>
                      <p className="font-semibold">{selectedProvider.distance.toFixed(1)} km</p>
                    </Card>
                  )}
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold mb-3">Contact</h3>
                  <div className="space-y-2">
                    {selectedProvider.telephones?.map((tel, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <a href={`tel:${tel}`} className="hover:underline">{tel}</a>
                      </div>
                    ))}
                    {selectedProvider.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <a href={`mailto:${selectedProvider.email}`} className="hover:underline">
                          {selectedProvider.email}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Services */}
                {selectedProvider.services && selectedProvider.services.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Services disponibles</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProvider.services.map((service, i) => (
                        <Badge key={i} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    className="flex-1"
                    onClick={() => handleAuthRequiredAction('booking', selectedProvider)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Prendre rendez-vous
                  </Button>
                  {selectedProvider.telephones?.[0] && (
                    <Button variant="outline" asChild>
                      <a href={`tel:${selectedProvider.telephones[0]}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Appeler
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal prompt d'authentification */}
      <Dialog open={showAuthPrompt} onOpenChange={setShowAuthPrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Connexion requise
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Pour prendre rendez-vous avec <strong>{selectedProvider?.nom}</strong>,
              vous devez d'abord vous connecter ou créer un compte.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Pourquoi se connecter ?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Gérer vos rendez-vous facilement
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Accéder à votre dossier médical
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Recevoir des rappels automatiques
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button
              onClick={() => handleAuthPromptAction('register')}
              className="w-full"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Créer un compte (gratuit)
            </Button>
            <Button
              onClick={() => handleAuthPromptAction('login')}
              variant="outline"
              className="w-full"
            >
              <LogIn className="w-4 h-4 mr-2" />
              J'ai déjà un compte
            </Button>
            <Button
              onClick={() => setShowAuthPrompt(false)}
              variant="ghost"
              className="w-full"
            >
              Continuer sans compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog filtres mobile */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Filtres de recherche</DialogTitle>
          </DialogHeader>
          <AdvancedFilters
            onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
            totalResults={filteredProviders.length}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
