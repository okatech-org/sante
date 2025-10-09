import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, MapPin, Building2, Stethoscope, Filter, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartographyProvider, ProviderType } from "@/types/cartography";
import { cn } from "@/lib/utils";

interface SmartSearchProps {
  providers: CartographyProvider[];
  onSearch: (query: string) => void;
  onProviderSelect: (provider: CartographyProvider) => void;
  searchQuery: string;
}

const TYPE_LABELS: Record<ProviderType, string> = {
  hopital: "Hôpital",
  clinique: "Clinique",
  cabinet_medical: "Cabinet Médical",
  cabinet_dentaire: "Cabinet Dentaire",
  pharmacie: "Pharmacie",
  laboratoire: "Laboratoire",
  imagerie: "Imagerie",
  service_urgence: "Service d'Urgence"
};

const TYPE_ICONS: Record<ProviderType, string> = {
  hopital: "🏥",
  clinique: "🏨",
  cabinet_medical: "👨‍⚕️",
  cabinet_dentaire: "🦷",
  pharmacie: "💊",
  laboratoire: "🔬",
  imagerie: "📷",
  service_urgence: "🚑"
};

export default function CartographySmartSearch({
  providers,
  onSearch,
  onProviderSelect,
  searchQuery
}: SmartSearchProps) {
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Suggestions intelligentes basées sur la saisie
  const suggestions = useMemo(() => {
    if (!inputValue.trim() || inputValue.length < 2) return null;

    const query = inputValue.toLowerCase().trim();
    const results = {
      providers: [] as CartographyProvider[],
      cities: new Set<string>(),
      types: new Set<ProviderType>(),
      specialties: new Set<string>()
    };

    providers.forEach(provider => {
      const matchesName = provider.nom.toLowerCase().includes(query);
      const matchesCity = provider.ville.toLowerCase().includes(query);
      const matchesType = TYPE_LABELS[provider.type].toLowerCase().includes(query);
      const matchesSpecialty = provider.specialites?.some(s => 
        s.toLowerCase().includes(query)
      );

      if (matchesName) {
        results.providers.push(provider);
      }
      if (matchesCity) {
        results.cities.add(provider.ville);
      }
      if (matchesType) {
        results.types.add(provider.type);
      }
      if (matchesSpecialty && provider.specialites) {
        provider.specialites.forEach(s => {
          if (s.toLowerCase().includes(query)) {
            results.specialties.add(s);
          }
        });
      }
    });

    // Limiter le nombre de résultats
    return {
      providers: results.providers.slice(0, 5),
      cities: Array.from(results.cities).slice(0, 4),
      types: Array.from(results.types).slice(0, 3),
      specialties: Array.from(results.specialties).slice(0, 4)
    };
  }, [inputValue, providers]);

  // Recherches populaires
  const popularSearches = useMemo(() => {
    const cityCount: Record<string, number> = {};
    providers.forEach(p => {
      cityCount[p.ville] = (cityCount[p.ville] || 0) + 1;
    });
    
    return Object.entries(cityCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([city]) => city);
  }, [providers]);

  // Fermer les suggestions en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setInputValue(value);
    onSearch(value);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setInputValue("");
    onSearch("");
    inputRef.current?.focus();
  };

  const handleSuggestionClick = (value: string, type: 'provider' | 'city' | 'type' | 'specialty') => {
    if (type === 'provider') {
      const provider = suggestions?.providers.find(p => p.nom === value);
      if (provider) {
        onProviderSelect(provider);
        setInputValue(provider.nom);
      }
    } else {
      setInputValue(value);
      onSearch(value);
    }
    setShowSuggestions(false);
  };

  const hasSuggestions = suggestions && (
    suggestions.providers.length > 0 ||
    suggestions.cities.length > 0 ||
    suggestions.types.length > 0 ||
    suggestions.specialties.length > 0
  );

  return (
    <div className="relative w-full max-w-2xl">
      {/* Barre de recherche principale */}
      <div className={cn(
        "relative flex items-center gap-2 bg-card/95 backdrop-blur-xl border rounded-2xl px-4 py-3 shadow-lg transition-all duration-300",
        isFocused ? "ring-2 ring-primary/20 border-primary/30 shadow-xl" : "border-border"
      )}>
        <Search className={cn(
          "h-5 w-5 flex-shrink-0 transition-colors",
          isFocused ? "text-primary" : "text-muted-foreground"
        )} />
        
        <Input
          ref={inputRef}
          type="text"
          placeholder="Rechercher un établissement, une ville, une spécialité..."
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            setShowSuggestions(true);
          }}
          onBlur={() => setIsFocused(false)}
          className="flex-1 border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
        />

        {inputValue && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="h-8 w-8 rounded-full hover:bg-muted/80"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="h-6 w-px bg-border" />

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
          title="Filtres avancés"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Panel de suggestions */}
      {showSuggestions && (isFocused || hasSuggestions) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-card/98 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in"
        >
          {/* Suggestions basées sur la recherche */}
          {hasSuggestions ? (
            <div className="max-h-[400px] overflow-y-auto">
              {/* Établissements */}
              {suggestions.providers.length > 0 && (
                <div className="p-2 border-b border-border/50">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    Établissements
                  </div>
                  <div className="space-y-1">
                    {suggestions.providers.map((provider) => (
                      <button
                        key={provider.id}
                        onClick={() => handleSuggestionClick(provider.nom, 'provider')}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-colors text-left group"
                      >
                        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-lg">
                          {TYPE_ICONS[provider.type]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-foreground group-hover:text-primary transition-colors truncate">
                            {provider.nom}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="capitalize">{TYPE_LABELS[provider.type]}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {provider.ville}
                            </span>
                          </div>
                        </div>
                        {provider.conventionnement?.cnamgs && (
                          <Badge variant="secondary" className="text-xs">CNAMGS</Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Villes */}
              {suggestions.cities.length > 0 && (
                <div className="p-2 border-b border-border/50">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5" />
                    Villes
                  </div>
                  <div className="flex flex-wrap gap-2 px-3">
                    {suggestions.cities.map((city) => (
                      <button
                        key={city}
                        onClick={() => handleSuggestionClick(city, 'city')}
                        className="px-3 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-lg text-sm transition-all"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Types */}
              {suggestions.types.length > 0 && (
                <div className="p-2 border-b border-border/50">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    Types
                  </div>
                  <div className="flex flex-wrap gap-2 px-3">
                    {suggestions.types.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleSuggestionClick(TYPE_LABELS[type], 'type')}
                        className="px-3 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-lg text-sm flex items-center gap-1.5 transition-all"
                      >
                        <span>{TYPE_ICONS[type]}</span>
                        <span>{TYPE_LABELS[type]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Spécialités */}
              {suggestions.specialties.length > 0 && (
                <div className="p-2">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                    <Stethoscope className="h-3.5 w-3.5" />
                    Spécialités
                  </div>
                  <div className="flex flex-wrap gap-2 px-3">
                    {suggestions.specialties.map((specialty) => (
                      <button
                        key={specialty}
                        onClick={() => handleSuggestionClick(specialty, 'specialty')}
                        className="px-3 py-1.5 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-lg text-sm transition-all"
                      >
                        {specialty}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Recherches populaires */
            <div className="p-4">
              <div className="px-2 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                <TrendingUp className="h-3.5 w-3.5" />
                Recherches populaires
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {popularSearches.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleSuggestionClick(city, 'city')}
                    className="px-4 py-2 bg-muted/50 hover:bg-primary/10 hover:text-primary rounded-xl text-sm font-medium transition-all"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
