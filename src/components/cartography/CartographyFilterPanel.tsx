import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { CartographyFilters, ProviderType } from "@/types/cartography";
import { Province } from "@/types/cartography";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CartographyFilterPanelProps {
  filters: CartographyFilters;
  onFiltersChange: (filters: CartographyFilters) => void;
  provinces: Province[];
  hasUserLocation: boolean;
}

const PROVIDER_TYPES: { value: ProviderType; label: string }[] = [
  { value: "hopital", label: "Hôpitaux" },
  { value: "clinique", label: "Cliniques" },
  { value: "cabinet_medical", label: "Cabinets Médicaux" },
  { value: "pharmacie", label: "Pharmacies" },
  { value: "laboratoire", label: "Laboratoires" },
  { value: "imagerie", label: "Centres Imagerie" },
  { value: "cabinet_dentaire", label: "Cabinets Dentaires" }
];

const SPECIALITES = [
  "Médecine générale",
  "Cardiologie",
  "Gynécologie",
  "Pédiatrie",
  "Dermatologie",
  "Néphrologie",
  "Chirurgie dentaire"
];

const EQUIPEMENTS = [
  "IRM",
  "Scanner",
  "Mammographie",
  "Échographie Doppler"
];

export default function CartographyFilterPanel({
  filters,
  onFiltersChange,
  provinces,
  hasUserLocation
}: CartographyFilterPanelProps) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const handleTypeToggle = (type: ProviderType) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    
    onFiltersChange({ ...filters, types: newTypes });
  };

  const handleReset = () => {
    onFiltersChange({
      types: [],
      province: 'all',
      ouvert24_7: false,
      cnamgs: false,
      specialite: null,
      equipement: null,
      maxDistance: null,
      searchText: ''
    });
  };

  const toggleSection = (section: string) => {
    setCollapsed(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <Card className="p-4 space-y-4 h-fit sticky top-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          <X className="h-4 w-4 mr-1" />
          Réinitialiser
        </Button>
      </div>

      {/* Types de structures */}
      <div className="space-y-2">
        <button 
          onClick={() => toggleSection('types')}
          className="w-full text-left font-medium text-sm flex items-center justify-between"
        >
          Type de structure
          <span className="text-xs">{collapsed.types ? '▼' : '▲'}</span>
        </button>
        
        {!collapsed.types && (
          <div className="space-y-2 pl-2">
            {PROVIDER_TYPES.map(type => (
              <div key={type.value} className="flex items-center space-x-2">
                <Checkbox
                  id={type.value}
                  checked={filters.types.includes(type.value)}
                  onCheckedChange={() => handleTypeToggle(type.value)}
                />
                <Label htmlFor={type.value} className="text-sm cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Province */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Province</Label>
        <Select 
          value={filters.province} 
          onValueChange={(value) => onFiltersChange({ ...filters, province: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les provinces</SelectItem>
            {provinces.map(province => (
              <SelectItem key={province.id} value={province.id}>
                {province.nom}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Services critiques */}
      <div className="space-y-3">
        <Label className="font-medium text-sm">Services critiques</Label>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="24-7" className="text-sm">Ouvert 24/7</Label>
          <Switch
            id="24-7"
            checked={filters.ouvert24_7}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, ouvert24_7: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="cnamgs" className="text-sm">Conventionné CNAMGS</Label>
          <Switch
            id="cnamgs"
            checked={filters.cnamgs}
            onCheckedChange={(checked) => onFiltersChange({ ...filters, cnamgs: checked })}
          />
        </div>
      </div>

      {/* Spécialité */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Spécialité médicale</Label>
        <Select 
          value={filters.specialite || "none"} 
          onValueChange={(value) => onFiltersChange({ ...filters, specialite: value === "none" ? null : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Toutes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Toutes</SelectItem>
            {SPECIALITES.map(spec => (
              <SelectItem key={spec} value={spec}>
                {spec}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Équipement spécialisé */}
      <div className="space-y-2">
        <Label className="font-medium text-sm">Équipement spécialisé</Label>
        <Select 
          value={filters.equipement || "none"} 
          onValueChange={(value) => onFiltersChange({ ...filters, equipement: value === "none" ? null : value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tous" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Tous</SelectItem>
            {EQUIPEMENTS.map(equip => (
              <SelectItem key={equip} value={equip}>
                {equip}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Distance (si géolocalisation active) */}
      {hasUserLocation && (
        <div className="space-y-2">
          <Label className="font-medium text-sm">
            Distance max: {filters.maxDistance || 50} km
          </Label>
          <Slider
            value={[filters.maxDistance || 50]}
            onValueChange={([value]) => onFiltersChange({ ...filters, maxDistance: value })}
            min={0}
            max={50}
            step={5}
          />
        </div>
      )}
    </Card>
  );
}
