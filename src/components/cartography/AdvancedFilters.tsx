import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Filter, X, MapPin, Clock, Shield, Star, CreditCard, 
  Wifi, Car, Accessibility, Baby, Heart, Brain, Eye, 
  Stethoscope, Pill, Syringe, Activity, AlertCircle,
  Building2, Users, Phone, Globe, ChevronDown, ChevronUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: any) => void;
  totalResults: number;
  className?: string;
}

// Types d'établissements avec icônes et couleurs
const ESTABLISHMENT_TYPES = [
  { value: "hopital", label: "Hôpitaux", icon: Building2, color: "bg-red-500" },
  { value: "clinique", label: "Cliniques", icon: Building2, color: "bg-green-500" },
  { value: "pharmacie", label: "Pharmacies", icon: Pill, color: "bg-orange-500" },
  { value: "cabinet_medical", label: "Cabinets Médicaux", icon: Stethoscope, color: "bg-blue-500" },
  { value: "laboratoire", label: "Laboratoires", icon: Brain, color: "bg-purple-500" },
  { value: "imagerie", label: "Centres d'Imagerie", icon: Eye, color: "bg-indigo-500" },
  { value: "cabinet_dentaire", label: "Cabinets Dentaires", icon: Activity, color: "bg-pink-500" }
];

// Spécialités médicales
const MEDICAL_SPECIALTIES = [
  "Médecine générale",
  "Cardiologie",
  "Dermatologie",
  "Gynécologie",
  "Neurologie",
  "Ophtalmologie",
  "ORL",
  "Orthopédie",
  "Pédiatrie",
  "Psychiatrie",
  "Radiologie",
  "Rhumatologie",
  "Urologie"
];

// Services disponibles
const AVAILABLE_SERVICES = [
  { value: "urgences", label: "Urgences 24/7", icon: AlertCircle },
  { value: "consultation", label: "Consultation sur RDV", icon: Clock },
  { value: "teleconsultation", label: "Téléconsultation", icon: Globe },
  { value: "vaccination", label: "Vaccination", icon: Syringe },
  { value: "pediatrie", label: "Service pédiatrique", icon: Baby },
  { value: "maternite", label: "Maternité", icon: Heart },
  { value: "chirurgie", label: "Chirurgie", icon: Activity },
  { value: "analyses", label: "Analyses médicales", icon: Brain }
];

// Équipements médicaux
const MEDICAL_EQUIPMENT = [
  { value: "irm", label: "IRM" },
  { value: "scanner", label: "Scanner" },
  { value: "radio", label: "Radiologie" },
  { value: "echo", label: "Échographie" },
  { value: "mammographie", label: "Mammographie" },
  { value: "defibrillateur", label: "Défibrillateur" },
  { value: "dialyse", label: "Dialyse" },
  { value: "bloc_operatoire", label: "Bloc opératoire" }
];

// Commodités
const AMENITIES = [
  { value: "parking", label: "Parking", icon: Car },
  { value: "wifi", label: "WiFi gratuit", icon: Wifi },
  { value: "accessible", label: "Accès handicapés", icon: Accessibility },
  { value: "cafeteria", label: "Cafétéria", icon: Users },
  { value: "pharmacie_interne", label: "Pharmacie interne", icon: Pill },
  { value: "laboratoire_interne", label: "Laboratoire interne", icon: Brain }
];

export default function AdvancedFilters({ 
  onFiltersChange, 
  totalResults,
  className 
}: AdvancedFiltersProps) {
  const [filters, setFilters] = useState({
    types: [] as string[],
    specialties: [] as string[],
    services: [] as string[],
    equipment: [] as string[],
    amenities: [] as string[],
    distance: [50],
    rating: [0],
    priceRange: "all",
    openNow: false,
    open24h: false,
    cnamgs: false,
    cnss: false,
    privateInsurance: false,
    languages: [] as string[],
    sortBy: "relevance"
  });

  const [expandedSections, setExpandedSections] = useState({
    types: true,
    services: true,
    specialties: false,
    equipment: false,
    amenities: false,
    payment: false,
    advanced: false
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateFilter = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: string, value: string) => {
    const currentValues = filters[key as keyof typeof filters] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    updateFilter(key, newValues);
  };

  const resetFilters = () => {
    const defaultFilters = {
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
      sortBy: "relevance"
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const activeFiltersCount = 
    filters.types.length + 
    filters.specialties.length + 
    filters.services.length + 
    filters.equipment.length +
    filters.amenities.length +
    (filters.openNow ? 1 : 0) +
    (filters.open24h ? 1 : 0) +
    (filters.cnamgs ? 1 : 0) +
    (filters.distance[0] < 50 ? 1 : 0) +
    (filters.rating[0] > 0 ? 1 : 0);

  return (
    <Card className={cn("bg-card/95 backdrop-blur-xl border-border/50", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filtres avancés
            {activeFiltersCount > 0 && (
              <Badge variant="secondary">{activeFiltersCount}</Badge>
            )}
          </CardTitle>
          {activeFiltersCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="gap-1"
            >
              <X className="w-3 h-3" />
              Réinitialiser
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {totalResults} établissements trouvés
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          <div className="space-y-4 p-4">
            {/* Distance et localisation */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Distance maximale
                </Label>
                <span className="text-sm font-medium">
                  {filters.distance[0]} km
                </span>
              </div>
              <Slider
                value={filters.distance}
                onValueChange={(value) => updateFilter("distance", value)}
                max={100}
                min={1}
                step={1}
                className="w-full"
              />
            </div>

            <Separator />

            {/* Types d'établissements */}
            <div>
              <button
                onClick={() => toggleSection("types")}
                className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
              >
                <Label className="cursor-pointer">Types d'établissements</Label>
                {expandedSections.types ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.types && (
                <div className="mt-3 space-y-2">
                  {ESTABLISHMENT_TYPES.map(type => {
                    const Icon = type.icon;
                    return (
                      <label
                        key={type.value}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={filters.types.includes(type.value)}
                          onCheckedChange={() => toggleArrayFilter("types", type.value)}
                        />
                        <div className={cn("w-2 h-2 rounded-full", type.color)} />
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{type.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <Separator />

            {/* Services disponibles */}
            <div>
              <button
                onClick={() => toggleSection("services")}
                className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
              >
                <Label className="cursor-pointer">Services disponibles</Label>
                {expandedSections.services ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.services && (
                <div className="mt-3 space-y-2">
                  {AVAILABLE_SERVICES.map(service => {
                    const Icon = service.icon;
                    return (
                      <label
                        key={service.value}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={filters.services.includes(service.value)}
                          onCheckedChange={() => toggleArrayFilter("services", service.value)}
                        />
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{service.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <Separator />

            {/* Horaires */}
            <div className="space-y-3">
              <Label>Horaires d'ouverture</Label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                  <Switch
                    checked={filters.openNow}
                    onCheckedChange={(checked) => updateFilter("openNow", checked)}
                  />
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ouvert maintenant</span>
                </label>
                <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                  <Switch
                    checked={filters.open24h}
                    onCheckedChange={(checked) => updateFilter("open24h", checked)}
                  />
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Ouvert 24h/24</span>
                </label>
              </div>
            </div>

            <Separator />

            {/* Spécialités médicales */}
            <div>
              <button
                onClick={() => toggleSection("specialties")}
                className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
              >
                <Label className="cursor-pointer">Spécialités médicales</Label>
                {expandedSections.specialties ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.specialties && (
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                  {MEDICAL_SPECIALTIES.map(specialty => (
                    <label
                      key={specialty}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={filters.specialties.includes(specialty)}
                        onCheckedChange={() => toggleArrayFilter("specialties", specialty)}
                      />
                      <span className="text-sm font-medium">{specialty}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Équipements médicaux */}
            <div>
              <button
                onClick={() => toggleSection("equipment")}
                className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
              >
                <Label className="cursor-pointer">Équipements médicaux</Label>
                {expandedSections.equipment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.equipment && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {MEDICAL_EQUIPMENT.map(equipment => (
                    <label
                      key={equipment.value}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={filters.equipment.includes(equipment.value)}
                        onCheckedChange={() => toggleArrayFilter("equipment", equipment.value)}
                      />
                      <span className="text-xs font-medium">{equipment.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <Separator />

            {/* Moyens de paiement */}
            <div>
              <button
                onClick={() => toggleSection("payment")}
                className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
              >
                <Label className="cursor-pointer">Moyens de paiement</Label>
                {expandedSections.payment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.payment && (
                <div className="mt-3 space-y-2">
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <Switch
                      checked={filters.cnamgs}
                      onCheckedChange={(checked) => updateFilter("cnamgs", checked)}
                    />
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Conventionné CNAMGS</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <Switch
                      checked={filters.cnss}
                      onCheckedChange={(checked) => updateFilter("cnss", checked)}
                    />
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Conventionné CNSS</span>
                  </label>
                  <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                    <Switch
                      checked={filters.privateInsurance}
                      onCheckedChange={(checked) => updateFilter("privateInsurance", checked)}
                    />
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Assurances privées</span>
                  </label>
                </div>
              )}
            </div>

            <Separator />

            {/* Commodités */}
            <div>
              <button
                onClick={() => toggleSection("amenities")}
                className="w-full flex items-center justify-between py-2 hover:bg-accent/50 rounded-lg px-2 transition-colors"
              >
                <Label className="cursor-pointer">Commodités</Label>
                {expandedSections.amenities ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              {expandedSections.amenities && (
                <div className="mt-3 space-y-2">
                  {AMENITIES.map(amenity => {
                    const Icon = amenity.icon;
                    return (
                      <label
                        key={amenity.value}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                      >
                        <Checkbox
                          checked={filters.amenities.includes(amenity.value)}
                          onCheckedChange={() => toggleArrayFilter("amenities", amenity.value)}
                        />
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{amenity.label}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <Separator />

            {/* Note minimale */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  Note minimale
                </Label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star
                      key={star}
                      className={cn(
                        "w-4 h-4",
                        star <= filters.rating[0]
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground"
                      )}
                    />
                  ))}
                </div>
              </div>
              <Slider
                value={filters.rating}
                onValueChange={(value) => updateFilter("rating", value)}
                max={5}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
