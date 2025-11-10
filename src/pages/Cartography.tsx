import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { SuperAdminLayoutSimple } from "@/components/layout/SuperAdminLayoutSimple";
import { PatientDashboardLayout } from "@/components/layout/PatientDashboardLayout";
import CartographySmartSearch from "@/components/cartography/CartographySmartSearch";
import EnhancedSmartSearch from "@/components/cartography/EnhancedSmartSearch";
import CartographyFilterPanel from "@/components/cartography/CartographyFilterPanel";
import AdvancedFilters from "@/components/cartography/AdvancedFilters";
import HealthProvidersMap from "@/components/landing/HealthProvidersMap";
import CartographyListView from "@/components/cartography/CartographyListView";
import CartographyProviderModal from "@/components/cartography/CartographyProviderModal";
import QuickFilters from "@/components/cartography/QuickFilters";
import SearchGuide from "@/components/cartography/SearchGuide";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Map, List, LayoutGrid, Filter, MapPin, Locate, ArrowDown, Info, Menu, X, Home, Stethoscope, Calendar, FileText, Phone, RefreshCw, Settings2 } from "lucide-react";
import { LanguageToggle } from "@/components/language/LanguageToggle";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import logoSante from "@/assets/logo_sante.png";
import { CartographyProvider, CartographyFilters, Coordonnees } from "@/types/cartography";
import { calculateDistance } from "@/utils/distance";
import { filterProviders, sortProviders, calculateStats } from "@/utils/cartography-filters";
import provincesData from "@/data/cartography-provinces.json";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { getOSMProvidersFromSupabase } from "@/utils/osm-supabase-sync";
import { REAL_ESTABLISHMENTS } from "@/data/real-establishments";

export default function Cartography() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [providers, setProviders] = useState<CartographyProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<CartographyProvider[]>([]);
  const [userLocation, setUserLocation] = useState<Coordonnees | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<CartographyProvider | null>(null);
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');
  const [sortBy, setSortBy] = useState('distance');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  
  const [filters, setFilters] = useState<CartographyFilters>({
    types: [],
    province: 'all',
    ouvert24_7: false,
    cnamgs: false,
    urgent: false,
    proche: false,
    specialite: null,
    equipement: null,
    maxDistance: null,
    searchText: ''
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Charger les données réelles (397 établissements)
  const loadRealData = async () => {
    setIsLoadingData(true);
    try {
      // Utiliser les vraies données au lieu de Supabase
      const allProviders = REAL_ESTABLISHMENTS;

      // Plus besoin de charger depuis Supabase
      // const osmProviders = await getOSMProvidersFromSupabase();
      // const { data: estabData } = await supabase.from('establishments').select('*');

      // Directement utiliser les données réelles
      setProviders(allProviders);
      toast.success(`${allProviders.length} établissements chargés`);
    } catch (error) {
      console.error('Erreur chargement données:', error);
      toast.error("Erreur lors du chargement des données");
    } finally {
      setIsLoadingData(false);
    }
  };

  // Charger les données au montage
  useEffect(() => {
    loadRealData();
  }, []);

  // Detect scroll for header background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const menuItems = [
    { label: "Accueil", icon: Home, path: "/" },
    { label: "Services", icon: Stethoscope, path: "/services" },
    { label: "Rendez-vous", icon: Calendar, path: "/appointments" },
    { label: "Cartographie", icon: MapPin, path: "/cartography" },
    { label: "Support", icon: Phone, path: "/support" }
  ];

  useEffect(() => {
    let filtered = filterProviders(providers, filters);
    filtered = sortProviders(filtered, sortBy);
    setFilteredProviders(filtered);
  }, [providers, filters, sortBy]);

  const content = (
    <div className="min-h-screen">
      {/* Header / Barre de menu */}
      <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled 
          ? "bg-background/95 backdrop-blur-lg shadow-md" 
          : "bg-background/80 backdrop-blur-sm"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img src={logoSante} alt="Logo" className="h-10 w-auto" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  e-Santé Gabon
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-6">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.path === "/cartography";
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Actions Desktop */}
            <div className="hidden lg:flex items-center gap-3">
              <ThemeToggle />
              <LanguageToggle />
              
              {user ? (
                <Button
                  onClick={() => navigate('/dashboard/patient')}
                  variant="default"
                  size="sm"
                  className="gap-2"
                >
                  Mon Espace
                </Button>
              ) : (
                <>
                  <Button
                    onClick={() => navigate('/login/patient')}
                    variant="ghost"
                    size="sm"
                  >
                    Connexion
                  </Button>
                  <Button
                    onClick={() => navigate('/register/patient')}
                    variant="default"
                    size="sm"
                  >
                    S'inscrire
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.path === "/cartography";
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors",
                          isActive 
                            ? "bg-primary/10 text-primary" 
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {item.label}
                      </Link>
                    );
                  })}

                  <div className="border-t pt-4 mt-4 space-y-3">
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm text-muted-foreground">Thème</span>
                      <ThemeToggle />
                    </div>
                    <div className="flex items-center justify-between px-4">
                      <span className="text-sm text-muted-foreground">Langue</span>
                      <LanguageToggle />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-4 space-y-2">
                    {user ? (
                      <Button
                        onClick={() => {
                          navigate('/dashboard/patient');
                          setMobileMenuOpen(false);
                        }}
                        variant="default"
                        className="w-full"
                      >
                        Mon Espace
                      </Button>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            navigate('/login/patient');
                            setMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          Connexion
                        </Button>
                        <Button
                          onClick={() => {
                            navigate('/register/patient');
                            setMobileMenuOpen(false);
                          }}
                          variant="default"
                          className="w-full"
                        >
                          S'inscrire
                        </Button>
                      </>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="space-y-6 p-2 sm:p-4 md:p-6">
        {/* Hero Section avec recherche guidée */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-primary/10 via-background to-accent/10 border shadow-lg md:shadow-2xl">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative p-3 md:p-6 space-y-3 md:space-y-4">
          {/* Header - Compact sur mobile */}
          <div className="text-center space-y-1 md:space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-lg md:text-2xl lg:text-3xl font-bold">
                Trouvez votre professionnel de santé
              </h1>
              <Button
                onClick={loadRealData}
                disabled={isLoadingData}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <RefreshCw className={cn("h-4 w-4", isLoadingData && "animate-spin")} />
                <span className="hidden sm:inline">Actualiser</span>
              </Button>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {providers.length} établissements disponibles
            </p>
          </div>

          {/* Barre de recherche améliorée - Priority 1 */}
          <div className="flex justify-center">
            <EnhancedSmartSearch
              providers={providers}
              onSearch={(text) => setFilters({ ...filters, searchText: text })}
              onProviderSelect={(provider) => setSelectedProvider(provider)}
              onFiltersChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
              searchQuery={filters.searchText}
              userLocation={userLocation}
            />
          </div>

          {/* Quick Filters - Compact */}
          <QuickFilters
            selectedType={filters.types[0] || null}
            onFilterSelect={(type) => setFilters({ 
              ...filters, 
              types: type ? [type] : [] 
            })}
            refinements={{
              urgent: filters.urgent,
              proche: filters.proche,
              cnamgs: filters.cnamgs,
              ouvert24_7: filters.ouvert24_7
            }}
            onRefinementChange={(refinements) => setFilters({
              ...filters,
              urgent: refinements.urgent,
              proche: refinements.proche,
              cnamgs: refinements.cnamgs,
              ouvert24_7: refinements.ouvert24_7,
              maxDistance: refinements.proche ? 10 : null
            })}
          />

          {/* Search Guide - Caché sur mobile */}
          <div className="hidden md:block">
            <SearchGuide
              onPreferenceSelect={(pref) => setFilters({
                ...filters,
                ouvert24_7: pref.ouvert247 || false,
                cnamgs: pref.cnamgs || false,
                maxDistance: pref.proche ? 10 : null
              })}
            />
          </div>

          {/* Actions rapides mobiles */}
          <div className="flex md:hidden gap-2">
            <Button
              onClick={getUserLocation}
              variant="outline"
              size="sm"
              className="flex-1 gap-2"
            >
              <Locate className="h-4 w-4" />
              Ma position
            </Button>
            <Button
              onClick={() => document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' })}
              variant="default"
              size="sm"
              className="flex-1 gap-2"
            >
              Résultats
              <ArrowDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Résultats Section */}
      <div id="results" className="flex gap-4 md:gap-6">
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
                <AdvancedFilters
                  onFiltersChange={setFilters}
                  totalResults={filteredProviders.length}
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
        <main className="flex-1 space-y-3 md:space-y-4 min-w-0">
          {/* Map View - En premier */}
          {(viewMode === 'map' || viewMode === 'both') && (
            <div className={cn(
              "rounded-lg overflow-hidden transition-all",
              viewMode === 'map' ? 'h-[70vh] md:h-[calc(100vh-400px)]' : 'h-[400px] md:h-[600px]'
            )}>
              <HealthProvidersMap />
            </div>
          )}

          {/* Results Header - En dessous de la carte */}
          <div className="backdrop-blur-xl bg-card/80 rounded-lg md:rounded-xl border p-3 md:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* View Switcher - Simplifié mobile */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)} className="flex-1 sm:flex-none">
                <TabsList className="bg-muted/50 w-full sm:w-auto grid grid-cols-2 sm:flex">
                  <TabsTrigger value="map" className="gap-2">
                    <Map className="h-4 w-4" />
                    <span>Carte</span>
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-2">
                    <List className="h-4 w-4" />
                    <span>Liste</span>
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
                  <Button variant="outline" size="sm" className="lg:hidden gap-2 flex-shrink-0">
                    <Filter className="h-4 w-4" />
                    <span className="hidden xs:inline">Filtres</span>
                    {(filters.types.length > 0 || filters.cnamgs || filters.ouvert24_7) && (
                      <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                        {filters.types.length + (filters.cnamgs ? 1 : 0) + (filters.ouvert24_7 ? 1 : 0)}
                      </span>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] sm:max-w-md overflow-y-auto max-h-[85vh] p-4">
                  <DialogHeader>
                    <DialogTitle>Filtres avancés</DialogTitle>
                  </DialogHeader>
                  <div className="pt-2">
                    <AdvancedFilters
                      onFiltersChange={setFilters}
                      totalResults={filteredProviders.length}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

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

          {/* Empty State - Compact mobile */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-12 md:py-16 px-4">
              <div className="inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full bg-muted mb-3 md:mb-4">
                <Map className="h-6 w-6 md:h-8 md:w-8 text-muted-foreground" />
              </div>
              <h3 className="text-base md:text-lg font-semibold mb-2">Aucun résultat</h3>
              <p className="text-sm text-muted-foreground mb-4 md:mb-6">
                Modifiez vos filtres
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilters({
                    types: [],
                    province: 'all',
                    ouvert24_7: false,
                    cnamgs: false,
                    urgent: false,
                    proche: false,
                    specialite: null,
                    equipement: null,
                    maxDistance: null,
                    searchText: ''
                  });
                }}
              >
                Réinitialiser
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
    </div>
  );

  // Déterminer le layout selon le rôle de l'utilisateur
  const isAdmin = hasRole('super_admin') || hasRole('admin');
  const isPatient = hasRole('patient');

  // Pour les patients, utiliser le layout patient
  if (isPatient && !isAdmin) {
    return (
      <PatientDashboardLayout>
        {content}
      </PatientDashboardLayout>
    );
  }

  // Pour les admins, utiliser le layout admin
  if (isAdmin) {
    return (
      <SuperAdminLayoutSimple>
        {content}
      </SuperAdminLayoutSimple>
    );
  }

  // Pour les autres utilisateurs (non connectés), afficher sans layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {content}
    </div>
  );
}
