import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, RefreshCw } from "lucide-react";
import { CartographyProvider } from "@/types/cartography";
import { extractQuartier, parseAddress } from "@/utils/address-formatter";
import { toast } from "sonner";

interface GeographicSegmentationProps {
  providers: CartographyProvider[];
  onFilterChange: (filters: GeographicFilters) => void;
}

export interface GeographicFilters {
  province: string | null;
  commune: string | null;
  quartier: string | null;
}

export default function GeographicSegmentation({ 
  providers, 
  onFilterChange 
}: GeographicSegmentationProps) {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [selectedCommune, setSelectedCommune] = useState<string | null>(null);
  const [selectedQuartier, setSelectedQuartier] = useState<string | null>(null);

  // Extraire les provinces uniques
  const provinces = useMemo(() => {
    const provinceSet = new Set(providers.map(p => p.province).filter(Boolean));
    return Array.from(provinceSet).sort();
  }, [providers]);

  // Extraire les communes/villes pour la province sélectionnée
  const communes = useMemo(() => {
    if (!selectedProvince) return [];
    const communeSet = new Set(
      providers
        .filter(p => p.province === selectedProvince)
        .map(p => p.ville)
        .filter(Boolean)
    );
    return Array.from(communeSet).sort();
  }, [providers, selectedProvince]);

  // Extraire les quartiers pour la commune sélectionnée
  const quartiers = useMemo(() => {
    if (!selectedProvince || !selectedCommune) return [];
    const quartierSet = new Set(
      providers
        .filter(p => p.province === selectedProvince && p.ville === selectedCommune)
        .map(p => extractQuartier(p.adresse_descriptive, p.ville, p.province))
        .filter(Boolean)
    );
    return Array.from(quartierSet).sort();
  }, [providers, selectedProvince, selectedCommune]);

  // Compter les établissements filtrés
  const filteredCount = useMemo(() => {
    let filtered = providers;
    
    if (selectedProvince) {
      filtered = filtered.filter(p => p.province === selectedProvince);
    }
    if (selectedCommune) {
      filtered = filtered.filter(p => p.ville === selectedCommune);
    }
    if (selectedQuartier) {
      filtered = filtered.filter(p => {
        const quartier = extractQuartier(p.adresse_descriptive, p.ville, p.province);
        return quartier === selectedQuartier;
      });
    }
    
    return filtered.length;
  }, [providers, selectedProvince, selectedCommune, selectedQuartier]);

  // Gérer le changement de province
  const handleProvinceChange = (value: string) => {
    const newProvince = value === "all" ? null : value;
    setSelectedProvince(newProvince);
    setSelectedCommune(null);
    setSelectedQuartier(null);
    onFilterChange({
      province: newProvince,
      commune: null,
      quartier: null
    });
  };

  // Gérer le changement de commune
  const handleCommuneChange = (value: string) => {
    const newCommune = value === "all" ? null : value;
    setSelectedCommune(newCommune);
    setSelectedQuartier(null);
    onFilterChange({
      province: selectedProvince,
      commune: newCommune,
      quartier: null
    });
  };

  // Gérer le changement de quartier
  const handleQuartierChange = (value: string) => {
    const newQuartier = value === "all" ? null : value;
    setSelectedQuartier(newQuartier);
    onFilterChange({
      province: selectedProvince,
      commune: selectedCommune,
      quartier: newQuartier
    });
  };

  // Réinitialiser tous les filtres
  const handleReset = () => {
    setSelectedProvince(null);
    setSelectedCommune(null);
    setSelectedQuartier(null);
    onFilterChange({
      province: null,
      commune: null,
      quartier: null
    });
    toast.success("Filtres géographiques réinitialisés");
  };

  return (
    <Card className="bg-card/50 backdrop-blur-xl border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Segmentation Géographique
          </div>
          {(selectedProvince || selectedCommune || selectedQuartier) && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Réinitialiser
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sélection de la Province */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <span className="text-lg">🏞️</span>
            Province
          </label>
          <Select value={selectedProvince || "all"} onValueChange={handleProvinceChange}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les provinces" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les provinces ({provinces.length})</SelectItem>
              {provinces.map(province => {
                const count = providers.filter(p => p.province === province).length;
                return (
                  <SelectItem key={province} value={province}>
                    {province} ({count})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection de la Commune/Ville */}
        {selectedProvince && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="text-lg">🏙️</span>
              Commune / Ville
            </label>
            <Select value={selectedCommune || "all"} onValueChange={handleCommuneChange}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes les communes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les communes ({communes.length})</SelectItem>
                {communes.map(commune => {
                  const count = providers.filter(
                    p => p.province === selectedProvince && p.ville === commune
                  ).length;
                  return (
                    <SelectItem key={commune} value={commune}>
                      {commune} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Sélection du Quartier */}
        {selectedProvince && selectedCommune && quartiers.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <span className="text-lg">🏘️</span>
              Quartier
            </label>
            <Select value={selectedQuartier || "all"} onValueChange={handleQuartierChange}>
              <SelectTrigger>
                <SelectValue placeholder="Tous les quartiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les quartiers ({quartiers.length})</SelectItem>
                {quartiers.map(quartier => {
                  if (!quartier) return null;
                  const count = providers.filter(p => {
                    if (p.province !== selectedProvince || p.ville !== selectedCommune) return false;
                    const q = extractQuartier(p.adresse_descriptive, p.ville, p.province);
                    return q === quartier;
                  }).length;
                  return (
                    <SelectItem key={quartier} value={quartier}>
                      {quartier} ({count})
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Résumé des filtres actifs */}
        <div className="pt-4 space-y-3 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Établissements trouvés</span>
            <Badge variant="secondary" className="text-base font-bold">
              {filteredCount}
            </Badge>
          </div>

          {/* Affichage de la hiérarchie géographique */}
          {(selectedProvince || selectedCommune || selectedQuartier) && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Localisation active :</p>
              <div className="flex flex-wrap gap-2">
                {selectedProvince && (
                  <Badge variant="outline" className="gap-1">
                    <MapPin className="w-3 h-3" />
                    {selectedProvince}
                  </Badge>
                )}
                {selectedCommune && (
                  <Badge variant="outline" className="gap-1">
                    <Navigation className="w-3 h-3" />
                    {selectedCommune}
                  </Badge>
                )}
                {selectedQuartier && (
                  <Badge variant="outline" className="gap-1">
                    📍 {selectedQuartier}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Affichage des coordonnées GPS du centre */}
          {selectedProvince && filteredCount > 0 && (
            <div className="pt-2 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">Zone couverte :</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="font-mono text-primary">
                    {providers
                      .filter(p => {
                        if (!p.coordonnees) return false;
                        let match = p.province === selectedProvince;
                        if (selectedCommune) match = match && p.ville === selectedCommune;
                        if (selectedQuartier) {
                          const q = extractQuartier(p.adresse_descriptive, p.ville, p.province);
                          match = match && q === selectedQuartier;
                        }
                        return match;
                      })
                      .reduce((acc, p) => acc + (p.coordonnees?.lat || 0), 0) / filteredCount
                    }°N
                  </p>
                  <p className="text-muted-foreground">Latitude moyenne</p>
                </div>
                <div className="p-2 rounded-md bg-muted/50">
                  <p className="font-mono text-primary">
                    {providers
                      .filter(p => {
                        if (!p.coordonnees) return false;
                        let match = p.province === selectedProvince;
                        if (selectedCommune) match = match && p.ville === selectedCommune;
                        if (selectedQuartier) {
                          const q = extractQuartier(p.adresse_descriptive, p.ville, p.province);
                          match = match && q === selectedQuartier;
                        }
                        return match;
                      })
                      .reduce((acc, p) => acc + (p.coordonnees?.lng || 0), 0) / filteredCount
                    }°E
                  </p>
                  <p className="text-muted-foreground">Longitude moyenne</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
