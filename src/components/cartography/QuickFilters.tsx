import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProviderType } from "@/types/cartography";
import { cn } from "@/lib/utils";

interface QuickFiltersProps {
  onFilterSelect: (type: ProviderType | null) => void;
  selectedType: ProviderType | null;
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

export default function QuickFilters({ onFilterSelect, selectedType }: QuickFiltersProps) {
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
      )}
    </div>
  );
}
