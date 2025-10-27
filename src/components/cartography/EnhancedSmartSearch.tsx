import { useState, useMemo, useRef, useEffect } from "react";
import { 
  Search, X, MapPin, Building2, Stethoscope, Filter, TrendingUp, 
  Clock, Heart, Brain, Baby, Shield, Pill, Activity, Calendar,
  Phone, Star, Navigation, Mic, History, ChevronDown, Sparkles,
  AlertCircle, Zap, Sun, Moon, Thermometer, Syringe, Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartographyProvider, ProviderType } from "@/types/cartography";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface EnhancedSmartSearchProps {
  providers: CartographyProvider[];
  onSearch: (query: string) => void;
  onProviderSelect: (provider: CartographyProvider) => void;
  onFiltersChange?: (filters: any) => void;
  searchQuery: string;
  userLocation?: { lat: number; lng: number } | null;
}

// Mapping symptômes -> spécialités/types
const SYMPTOM_MAPPING: Record<string, string[]> = {
  "mal de tête": ["neurologie", "médecine générale"],
  "fièvre": ["médecine générale", "urgences", "pédiatrie"],
  "douleur dentaire": ["dentisterie", "cabinet_dentaire"],
  "grossesse": ["gynécologie", "obstétrique", "maternité"],
  "accident": ["urgences", "traumatologie", "chirurgie"],
  "vaccin": ["pédiatrie", "médecine générale", "vaccination"],
  "analyse sang": ["laboratoire", "analyses médicales"],
  "radio": ["imagerie", "radiologie"],
  "médicament": ["pharmacie"],
  "enfant malade": ["pédiatrie", "urgences pédiatriques"],
  "douleur poitrine": ["cardiologie", "urgences"],
  "problème peau": ["dermatologie"],
  "mal de dos": ["rhumatologie", "kinésithérapie", "orthopédie"],
  "stress": ["psychiatrie", "psychologie"],
  "diabète": ["endocrinologie", "médecine interne"],
  "tension": ["cardiologie", "médecine générale"],
  "allergie": ["allergologie", "médecine générale"],
  "covid": ["dépistage", "laboratoire", "médecine générale"]
};

// Quartiers et zones connus du Gabon (principalement Libreville et Port-Gentil)
const KNOWN_LOCATIONS: Record<string, string[]> = {
  // Libreville et quartiers
  "libreville": ["Libreville"],
  "nzeng-ayong": ["Libreville"],
  "nzeng ayong": ["Libreville"],
  "nzemeyong": ["Libreville"],
  "akanda": ["Akanda", "Libreville"],
  "owendo": ["Owendo", "Libreville"],
  "glass": ["Libreville"],
  "montagne": ["Libreville"],
  "nombakele": ["Libreville"],
  "nombakélé": ["Libreville"],
  "louis": ["Libreville"],
  "lalala": ["Libreville"],
  "okala": ["Libreville"],
  "batterie 4": ["Libreville"],
  "batterie iv": ["Libreville"],
  "petit paris": ["Libreville"],
  "sibang": ["Libreville"],
  "atong abe": ["Libreville"],
  
  // Port-Gentil et quartiers
  "port-gentil": ["Port-Gentil"],
  "port gentil": ["Port-Gentil"],
  "cap lopez": ["Port-Gentil"],
  "mpita": ["Port-Gentil"],
  
  // Autres villes principales
  "franceville": ["Franceville"],
  "oyem": ["Oyem"],
  "moanda": ["Moanda"],
  "tchibanga": ["Tchibanga"],
  "koulamoutou": ["Koulamoutou"],
  "lambaréné": ["Lambaréné"],
  "lambarene": ["Lambaréné"],
  "mouila": ["Mouila"],
  "makokou": ["Makokou"],
  "bitam": ["Bitam"],
  "mitzic": ["Mitzic"],
  "lastoursville": ["Lastoursville"]
};

// Services médicaux courants
const MEDICAL_SERVICES = {
  urgences: { icon: AlertCircle, label: "Urgences 24/7", color: "text-red-500" },
  consultation: { icon: Stethoscope, label: "Consultation", color: "text-blue-500" },
  vaccination: { icon: Syringe, label: "Vaccination", color: "text-green-500" },
  pediatrie: { icon: Baby, label: "Pédiatrie", color: "text-pink-500" },
  maternite: { icon: Heart, label: "Maternité", color: "text-rose-500" },
  dentaire: { icon: Activity, label: "Dentaire", color: "text-purple-500" },
  analyse: { icon: Brain, label: "Analyses", color: "text-cyan-500" },
  imagerie: { icon: Eye, label: "Imagerie", color: "text-indigo-500" },
  pharmacie: { icon: Pill, label: "Pharmacie", color: "text-orange-500" }
};

export default function EnhancedSmartSearch({
  providers,
  onSearch,
  onProviderSelect,
  onFiltersChange,
  searchQuery,
  userLocation
}: EnhancedSmartSearchProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedTab, setSelectedTab] = useState("search");
  const [isListening, setIsListening] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<"all" | "open" | "24h">("all");
  
  const inputRef = useRef<HTMLInputElement>(null);

  // Charger l'historique de recherche
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved).slice(0, 5));
    }
  }, []);

  // Sauvegarder la recherche
  const saveSearch = (query: string) => {
    if (query.trim().length > 2) {
      const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }
  };

  // Recherche intelligente combinée (symptômes + localisation)
  const handleSmartSearch = (query: string) => {
    if (!query.trim()) {
      onSearch("");
      if (onFiltersChange) {
        onFiltersChange({ 
          searchText: "",
          specialties: [],
          cityFilter: null,
          urgent: false,
          open24h: false
        });
      }
      return;
    }

    const parsed = parseSmartQuery(query);
    
    // Construire le message informatif
    let message = "Recherche";
    if (parsed.symptoms.length > 0) {
      message += ` pour: ${parsed.symptoms.join(", ")}`;
    }
    if (parsed.locations.length > 0) {
      message += ` à ${parsed.locations.join(", ")}`;
    }
    
    if (parsed.symptoms.length > 0 || parsed.locations.length > 0) {
      toast.info(message);
    }

    // Sauvegarder la recherche
    saveSearch(query);
    onSearch(query);

    // Appliquer les filtres combinés
    if (onFiltersChange) {
      const filters: any = {
        searchText: query,
        specialties: [],
        cityFilter: null,
        urgent: false,
        open24h: false
      };

      // Ajouter les spécialités si symptômes détectés
      if (parsed.specialties.length > 0) {
        filters.specialties = parsed.specialties;
      }

      // Ajouter le filtre de ville/localisation
      if (parsed.locations.length > 0) {
        filters.cityFilter = parsed.locations;
      }

      // Détecter si urgence
      if (parsed.symptoms.some(s => 
        s.includes("accident") || 
        s.includes("urgence") || 
        query.toLowerCase().includes("urgent")
      )) {
        filters.urgent = true;
        filters.open24h = true;
      }

      onFiltersChange(filters);
    }
  };

  // Recherche par symptômes
  const searchBySymptom = (symptom: string) => {
    const relatedSpecialties = SYMPTOM_MAPPING[symptom.toLowerCase()] || [];
    if (relatedSpecialties.length > 0) {
      toast.info(`Recherche de professionnels pour: ${symptom}`);
      setInputValue(symptom);
      handleSmartSearch(symptom);
    }
  };

  // Recherche vocale
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error("La recherche vocale n'est pas disponible sur votre navigateur");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.lang = 'fr-FR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Parlez maintenant...");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      handleSmartSearch(transcript);
      setIsListening(false);
      toast.success(`Recherche: "${transcript}"`);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Erreur de reconnaissance vocale");
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Parser intelligent de recherche combinée (symptôme + localisation)
  function parseSmartQuery(query: string): {
    symptoms: string[];
    locations: string[];
    specialties: string[];
    rawQuery: string;
  } {
    const lowerQuery = query.toLowerCase().trim();
    const result = {
      symptoms: [] as string[],
      locations: [] as string[],
      specialties: [] as string[],
      rawQuery: query
    };

    // Détecter les symptômes
    Object.keys(SYMPTOM_MAPPING).forEach(symptom => {
      if (lowerQuery.includes(symptom)) {
        result.symptoms.push(symptom);
        result.specialties.push(...SYMPTOM_MAPPING[symptom]);
      }
    });

    // Détecter les localisations
    Object.keys(KNOWN_LOCATIONS).forEach(location => {
      if (lowerQuery.includes(location)) {
        result.locations.push(...KNOWN_LOCATIONS[location]);
      }
    });

    // Déduplication
    result.locations = [...new Set(result.locations)];
    result.specialties = [...new Set(result.specialties)];

    return result;
  }

  // Calculer la distance (défini avant utilisation pour éviter les erreurs d'initialisation)
  function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Rayon de la Terre en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Calculer le score de correspondance (défini avant utilisation)
  function calculateMatchScore(
    provider: CartographyProvider,
    query: string
  ): number {
    let score = 0;

    // Nom exact = score élevé
    if (provider.nom.toLowerCase() === query) score += 10;
    else if (provider.nom.toLowerCase().includes(query)) score += 5;

    // Type correspondant
    if ((provider as any).type?.includes?.(query)) score += 4;

    // Ville correspondante
    if ((provider as any).ville?.toLowerCase?.().includes(query)) score += 3;

    // Services correspondants
    if (provider.services?.some(s => s.toLowerCase().includes(query))) score += 3;

    // Spécialités correspondantes
    if (provider.specialites?.some(s => s.toLowerCase().includes(query))) score += 2;

    // Bonus si ouvert 24/7 et recherche urgence
    if ((provider as any).ouvert_24_7 && query.includes("urgence")) score += 5;

    // Bonus si conventionné CNAMGS (tolérant au schéma)
    if ((provider as any).cnamgs || (provider as any).conventionnement?.cnamgs) score += 1;

    return score;
  }

  // Suggestions intelligentes améliorées
  const smartSuggestions = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return null;

    const query = inputValue.toLowerCase().trim();
    const results = {
      providers: [] as CartographyProvider[],
      symptoms: [] as string[],
      services: [] as string[],
      nearbyProviders: [] as CartographyProvider[]
    };

    // Recherche dans les providers
    providers.forEach(provider => {
      const matchScore = calculateMatchScore(provider, query);
      if (matchScore > 0) {
        results.providers.push({ ...provider, matchScore });
      }
    });

    // Trier par pertinence
    results.providers.sort((a: any, b: any) => b.matchScore - a.matchScore);
    results.providers = results.providers.slice(0, 5);

    // Recherche de symptômes correspondants
    Object.keys(SYMPTOM_MAPPING).forEach(symptom => {
      if (symptom.includes(query) || query.includes(symptom)) {
        results.symptoms.push(symptom);
      }
    });

    // Si géolocalisation disponible, trouver les plus proches
    if (userLocation) {
      const nearby = providers
        .filter(p => p.coordonnees)
        .map(p => ({
          ...p,
          distance: calculateDistance(
            userLocation.lat,
            userLocation.lng,
            p.coordonnees!.lat,
            p.coordonnees!.lng
          )
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);
      
      results.nearbyProviders = nearby;
    }

    return results;
  }, [inputValue, providers, userLocation]);

  

  return (
    <Card className="p-4 bg-card/95 backdrop-blur-xl border-border/50 shadow-xl">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search" className="gap-2">
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline">Recherche</span>
          </TabsTrigger>
          <TabsTrigger value="symptoms" className="gap-2">
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">Symptômes</span>
          </TabsTrigger>
          <TabsTrigger value="services" className="gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Services</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-4">
          {/* Barre de recherche principale */}
          <div className="relative">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Ex: J'ai la fièvre et je suis à Nzeng-Ayong..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSmartSearch(inputValue);
                    }
                  }}
                  className="pl-10 pr-10 h-12 text-base"
                />
                {inputValue && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => {
                      setInputValue("");
                      onSearch("");
                      if (onFiltersChange) {
                        onFiltersChange({ searchText: "" });
                      }
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <Button
                size="icon"
                variant={isListening ? "destructive" : "outline"}
                onClick={startVoiceSearch}
                className="h-12 w-12"
              >
                <Mic className={cn("w-5 h-5", isListening && "animate-pulse")} />
              </Button>
              
              <Button
                onClick={() => handleSmartSearch(inputValue)}
                className="h-12"
              >
                <Search className="w-4 h-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          {/* Suggestions intelligentes */}
          {smartSuggestions && (
            <div className="space-y-3">
              {/* Établissements suggérés */}
              {smartSuggestions.providers.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Établissements</p>
                  <div className="space-y-1">
                    {smartSuggestions.providers.map(provider => (
                      <button
                        key={provider.id}
                        onClick={() => onProviderSelect(provider)}
                        className="w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{provider.nom}</span>
                          <Badge variant="secondary" className="text-xs">
                            {provider.type}
                          </Badge>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {provider.ville}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Symptômes suggérés */}
              {smartSuggestions.symptoms.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground">Recherche par symptôme</p>
                  <div className="flex flex-wrap gap-2">
                    {smartSuggestions.symptoms.map(symptom => (
                      <Button
                        key={symptom}
                        variant="outline"
                        size="sm"
                        onClick={() => searchBySymptom(symptom)}
                        className="gap-1"
                      >
                        <Thermometer className="w-3 h-3" />
                        {symptom}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Établissements proches */}
              {smartSuggestions.nearbyProviders.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    À proximité
                  </p>
                  <div className="space-y-1">
                    {smartSuggestions.nearbyProviders.map((provider: any) => (
                      <button
                        key={provider.id}
                        onClick={() => onProviderSelect(provider)}
                        className="w-full text-left p-2 rounded-lg hover:bg-accent/50 transition-colors flex items-center justify-between"
                      >
                        <span className="font-medium">{provider.nom}</span>
                        <span className="text-sm text-muted-foreground">
                          {provider.distance.toFixed(1)} km
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recherches récentes */}
          {!inputValue && recentSearches.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 text-muted-foreground flex items-center gap-1">
                <History className="w-3 h-3" />
                Recherches récentes
              </p>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map(search => (
                  <Button
                    key={search}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setInputValue(search);
                      onSearch(search);
                    }}
                  >
                    {search}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="symptoms" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Décrivez vos symptômes pour trouver les spécialistes adaptés
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.keys(SYMPTOM_MAPPING).map(symptom => (
              <Button
                key={symptom}
                variant="outline"
                className="justify-start gap-2 h-auto p-3"
                onClick={() => searchBySymptom(symptom)}
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm">{symptom}</span>
              </Button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Recherchez par type de service médical
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(MEDICAL_SERVICES).map(([key, service]) => {
              const Icon = service.icon;
              return (
                <Button
                  key={key}
                  variant={selectedService === key ? "default" : "outline"}
                  className="justify-start gap-2 h-auto p-4"
                  onClick={() => {
                    setSelectedService(key === selectedService ? null : key);
                    onSearch(service.label);
                    if (onFiltersChange) {
                      const normalizedKey = key === "analyse" ? "analyses" : key;
                      onFiltersChange({ services: [normalizedKey] });
                    }
                  }}
                >
                  <Icon className={cn("w-5 h-5", service.color)} />
                  <span className="text-sm font-medium">{service.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Filtres horaires */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium mb-3">Horaires d'ouverture</p>
            <div className="flex gap-2">
              <Button
                variant={timeFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeFilter("all")}
              >
                Tous
              </Button>
              <Button
                variant={timeFilter === "open" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTimeFilter("open");
                  if (onFiltersChange) {
                  onFiltersChange({ openNow: true, open24h: false });
                  }
                }}
                className="gap-1"
              >
                <Clock className="w-3 h-3" />
                Ouvert maintenant
              </Button>
              <Button
                variant={timeFilter === "24h" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTimeFilter("24h");
                  if (onFiltersChange) {
                  onFiltersChange({ open24h: true, openNow: false });
                  }
                }}
                className="gap-1"
              >
                <Moon className="w-3 h-3" />
                24h/24
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Déclarations TypeScript pour l'API Web Speech
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
