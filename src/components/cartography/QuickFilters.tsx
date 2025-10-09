import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProviderType } from "@/types/cartography";
import { cn } from "@/lib/utils";

interface QuickFiltersProps {
  onFilterSelect: (type: ProviderType | null) => void;
  selectedType: ProviderType | null;
  onRefinementChange?: (refinements: {
    urgent: boolean;
    proche: boolean;
    cnamgs: boolean;
    ouvert24_7: boolean;
  }) => void;
  refinements?: {
    urgent: boolean;
    proche: boolean;
    cnamgs: boolean;
    ouvert24_7: boolean;
  };
}

const QUICK_FILTERS = [
  {
    type: "hopital" as ProviderType,
    label: "Hôpital",
    icon: "🏥",
    color: "from-red-500 to-red-600",
    description: "Soins d'urgence et hospitalisation"
  },
  {
    type: "clinique" as ProviderType,
    label: "Clinique",
    icon: "🏨",
    color: "from-blue-500 to-blue-600",
    description: "Consultations et chirurgie"
  },
  {
    type: "cabinet_medical" as ProviderType,
    label: "Médecin",
    icon: "👨‍⚕️",
    color: "from-green-500 to-green-600",
    description: "Médecine générale"
  },
  {
    type: "cabinet_dentaire" as ProviderType,
    label: "Dentiste",
    icon: "🦷",
    color: "from-cyan-500 to-cyan-600",
    description: "Soins dentaires"
  },
  {
    type: "pharmacie" as ProviderType,
    label: "Pharmacie",
    icon: "💊",
    color: "from-purple-500 to-purple-600",
    description: "Médicaments et conseils"
  },
  {
    type: "laboratoire" as ProviderType,
    label: "Laboratoire",
    icon: "🔬",
    color: "from-orange-500 to-orange-600",
    description: "Analyses médicales"
  }
];

const REFINEMENT_OPTIONS = [
  {
    key: "urgent" as const,
    label: "C'est urgent",
    description: "Besoin de soins immédiats",
    icon: "🚨",
    color: "from-red-500 to-red-600"
  },
  {
    key: "proche" as const,
    label: "Proche de moi",
    description: "Établissements à proximité",
    icon: "📍",
    color: "from-blue-500 to-blue-600"
  },
  {
    key: "cnamgs" as const,
    label: "Accepte CNAMGS",
    description: "Conventionné CNAMGS",
    icon: "💳",
    color: "from-green-500 to-green-600"
  },
  {
    key: "ouvert24_7" as const,
    label: "Ouvert 24/7",
    description: "Disponible à tout moment",
    icon: "⏰",
    color: "from-purple-500 to-purple-600"
  }
];

export default function QuickFilters({ 
  onFilterSelect, 
  selectedType, 
  onRefinementChange,
  refinements = { urgent: false, proche: false, cnamgs: false, ouvert24_7: false }
}: QuickFiltersProps) {
  
  const toggleRefinement = (key: keyof typeof refinements) => {
    if (onRefinementChange) {
      onRefinementChange({
        ...refinements,
        [key]: !refinements[key]
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="text-center space-y-1.5">
        <h2 className="text-xl md:text-2xl font-bold">Que recherchez-vous ?</h2>
        <p className="text-xs md:text-sm text-muted-foreground">Sélectionnez le type d'établissement</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.type}
            onClick={() => onFilterSelect(filter.type === selectedType ? null : filter.type)}
            className={cn(
              "group relative overflow-hidden rounded-xl p-2.5 md:p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg",
              selectedType === filter.type
                ? "ring-2 ring-primary shadow-lg scale-105"
                : "bg-card border hover:border-primary/50"
            )}
          >
            <div className={cn(
              "absolute inset-0 opacity-0 transition-opacity duration-300",
              selectedType === filter.type ? "opacity-10" : "group-hover:opacity-5",
              `bg-gradient-to-br ${filter.color}`
            )} />
            
            <div className="relative space-y-1 md:space-y-1.5 text-center">
              <div className="text-2xl md:text-3xl mx-auto w-fit">{filter.icon}</div>
              <div className="font-semibold text-xs md:text-sm leading-tight">{filter.label}</div>
              <div className="text-[10px] md:text-xs text-muted-foreground hidden lg:block leading-tight">
                {filter.description}
              </div>
            </div>

            {selectedType === filter.type && (
              <div className="absolute top-1 right-1 md:top-2 md:right-2">
                <Badge className="bg-primary text-[10px] h-4 px-1.5">✓</Badge>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedType && (
        <>
          {/* Refinement Filters */}
          <div className="animate-fade-in space-y-2 pt-2">
            <div className="text-center space-y-1">
              <h3 className="text-sm md:text-base font-semibold">Affinez votre recherche (optionnel)</h3>
              <p className="text-[10px] md:text-xs text-muted-foreground">Sélectionnez vos préférences</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {REFINEMENT_OPTIONS.map((option) => (
                <button
                  key={option.key}
                  onClick={() => toggleRefinement(option.key)}
                  className={cn(
                    "group relative overflow-hidden rounded-lg p-2 md:p-2.5 transition-all duration-300 hover:scale-105 hover:shadow-md",
                    refinements[option.key]
                      ? "ring-2 ring-primary shadow-md scale-105"
                      : "bg-card border hover:border-primary/50"
                  )}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 transition-opacity duration-300",
                    refinements[option.key] ? "opacity-10" : "group-hover:opacity-5",
                    `bg-gradient-to-br ${option.color}`
                  )} />
                  
                  <div className="relative space-y-0.5 md:space-y-1 text-center">
                    <div className="text-lg md:text-xl mx-auto w-fit">{option.icon}</div>
                    <div className="font-semibold text-[10px] md:text-xs leading-tight">{option.label}</div>
                    <div className="text-[9px] md:text-[10px] text-muted-foreground hidden md:block leading-tight">
                      {option.description}
                    </div>
                  </div>

                  {refinements[option.key] && (
                    <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1">
                      <Badge className="bg-primary text-[9px] h-3.5 px-1 md:text-[10px] md:h-4 md:px-1.5">✓</Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center animate-fade-in pt-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFilterSelect(null)}
              className="text-xs md:text-sm text-muted-foreground hover:text-foreground h-8"
            >
              ✕ Réinitialiser le filtre
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
