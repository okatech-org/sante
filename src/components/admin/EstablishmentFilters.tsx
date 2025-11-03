import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";
import { EstablishmentFilter, GABON_PROVINCES } from "@/types/establishment";
import { Badge } from "@/components/ui/badge";

interface EstablishmentFiltersProps {
  filter: EstablishmentFilter;
  onFilterChange: (filter: EstablishmentFilter) => void;
}

export const EstablishmentFilters = ({ filter, onFilterChange }: EstablishmentFiltersProps) => {
  const activeFiltersCount = [
    filter.category?.length || 0,
    filter.status?.length || 0,
    filter.level?.length || 0,
    filter.province?.length || 0,
    filter.hasEmergency !== undefined ? 1 : 0,
    filter.hasPharmacy !== undefined ? 1 : 0,
    filter.hasLaboratory !== undefined ? 1 : 0,
  ].reduce((sum, count) => sum + count, 0);

  const clearFilters = () => {
    onFilterChange({});
  };

  const updateFilter = (key: keyof EstablishmentFilter, value: any) => {
    onFilterChange({
      ...filter,
      [key]: value
    });
  };

  const toggleArrayFilter = (key: keyof EstablishmentFilter, value: string) => {
    const current = (filter[key] as string[]) || [];
    const newValues = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];
    
    updateFilter(key, newValues.length > 0 ? newValues : undefined);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-96" align="end">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Filtres avancés</h4>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  <X className="h-3 w-3 mr-1" />
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Catégories */}
            <div>
              <label className="text-sm font-medium mb-2 block">Catégorie</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {[
                  { value: 'gouvernemental', label: 'Gouvernemental' },
                  { value: 'universitaire', label: 'CHU' },
                  { value: 'regional', label: 'CHR' },
                  { value: 'departemental', label: 'CHD' },
                  { value: 'prive', label: 'Privé' },
                  { value: 'centre_sante', label: 'Centre de Santé' },
                  { value: 'dispensaire', label: 'Dispensaire' },
                ].map(cat => (
                  <div key={cat.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={cat.value}
                      checked={filter.category?.includes(cat.value as any) || false}
                      onCheckedChange={() => toggleArrayFilter('category', cat.value)}
                    />
                    <label
                      htmlFor={cat.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {cat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Statut */}
            <div>
              <label className="text-sm font-medium mb-2 block">Statut</label>
              <div className="space-y-2">
                {[
                  { value: 'operationnel', label: 'Opérationnel' },
                  { value: 'partiel', label: 'Partiel' },
                  { value: 'maintenance', label: 'En maintenance' },
                  { value: 'ferme', label: 'Fermé' },
                ].map(stat => (
                  <div key={stat.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={stat.value}
                      checked={filter.status?.includes(stat.value as any) || false}
                      onCheckedChange={() => toggleArrayFilter('status', stat.value)}
                    />
                    <label
                      htmlFor={stat.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {stat.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Province */}
            <div>
              <label className="text-sm font-medium mb-2 block">Province</label>
              <Select
                value={filter.province?.[0] || "all"}
                onValueChange={(value) => updateFilter('province', value === "all" ? undefined : [value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les provinces" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les provinces</SelectItem>
                  {GABON_PROVINCES.map(province => (
                    <SelectItem key={province} value={province}>
                      {province}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Services */}
            <div>
              <label className="text-sm font-medium mb-2 block">Services disponibles</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergency"
                    checked={filter.hasEmergency || false}
                    onCheckedChange={(checked) => 
                      updateFilter('hasEmergency', checked || undefined)
                    }
                  />
                  <label htmlFor="emergency" className="text-sm font-normal cursor-pointer">
                    Service d'urgence
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="pharmacy"
                    checked={filter.hasPharmacy || false}
                    onCheckedChange={(checked) => 
                      updateFilter('hasPharmacy', checked || undefined)
                    }
                  />
                  <label htmlFor="pharmacy" className="text-sm font-normal cursor-pointer">
                    Pharmacie
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="laboratory"
                    checked={filter.hasLaboratory || false}
                    onCheckedChange={(checked) => 
                      updateFilter('hasLaboratory', checked || undefined)
                    }
                  />
                  <label htmlFor="laboratory" className="text-sm font-normal cursor-pointer">
                    Laboratoire
                  </label>
                </div>
              </div>
            </div>

            {/* Assurances acceptées */}
            <div>
              <label className="text-sm font-medium mb-2 block">Assurances acceptées</label>
              <div className="space-y-2">
                {['CNAMGS', 'CNSS', 'Privé'].map(insurance => (
                  <div key={insurance} className="flex items-center space-x-2">
                    <Checkbox
                      id={insurance}
                      checked={filter.insuranceAccepted?.includes(insurance as any) || false}
                      onCheckedChange={() => toggleArrayFilter('insuranceAccepted', insurance)}
                    />
                    <label
                      htmlFor={insurance}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {insurance}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Affichage des filtres actifs */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-1">
          {filter.category?.map(cat => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('category', cat)}
              />
            </Badge>
          ))}
          {filter.status?.map(stat => (
            <Badge key={stat} variant="secondary" className="text-xs">
              {stat}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => toggleArrayFilter('status', stat)}
              />
            </Badge>
          ))}
          {filter.province?.map(prov => (
            <Badge key={prov} variant="secondary" className="text-xs">
              {prov}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilter('province', undefined)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
