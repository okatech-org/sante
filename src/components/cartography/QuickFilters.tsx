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
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Que recherchez-vous ?</h2>
        <p className="text-muted-foreground">Sélectionnez le type d'établissement</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_FILTERS.map((filter) => (
          <button
            key={filter.type}
            onClick={() => onFilterSelect(filter.type === selectedType ? null : filter.type)}
            className={cn(
              "group relative overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl",
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
            
            <div className="relative space-y-2 text-center">
              <div className="text-4xl mx-auto w-fit">{filter.icon}</div>
              <div className="font-semibold text-sm">{filter.label}</div>
              <div className="text-xs text-muted-foreground hidden md:block">
                {filter.description}
              </div>
            </div>

            {selectedType === filter.type && (
              <div className="absolute top-2 right-2">
                <Badge className="bg-primary text-xs">✓</Badge>
              </div>
            )}
          </button>
        ))}
      </div>

      {selectedType && (
        <div className="text-center animate-fade-in">
          <Button
            variant="ghost"
            onClick={() => onFilterSelect(null)}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ✕ Réinitialiser le filtre
          </Button>
        </div>
      )}
    </div>
  );
}
