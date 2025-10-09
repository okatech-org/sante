import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Stethoscope, Clock, Shield, ChevronRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchGuideProps {
  onPreferenceSelect: (preference: SearchPreference) => void;
}

interface SearchPreference {
  urgence?: boolean;
  cnamgs?: boolean;
  ouvert247?: boolean;
  proche?: boolean;
}

const PREFERENCE_OPTIONS = [
  {
    id: "urgence",
    label: "C'est urgent",
    icon: Clock,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950/20",
    borderColor: "border-red-200 dark:border-red-800",
    description: "Besoin de soins immédiats"
  },
  {
    id: "proche",
    label: "Proche de moi",
    icon: MapPin,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
    borderColor: "border-blue-200 dark:border-blue-800",
    description: "Établissements à proximité"
  },
  {
    id: "cnamgs",
    label: "Accepte CNAMGS",
    icon: Shield,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950/20",
    borderColor: "border-green-200 dark:border-green-800",
    description: "Conventionné CNAMGS"
  },
  {
    id: "ouvert247",
    label: "Ouvert 24/7",
    icon: Stethoscope,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
    borderColor: "border-purple-200 dark:border-purple-800",
    description: "Disponible à tout moment"
  }
];

export default function SearchGuide({ onPreferenceSelect }: SearchGuideProps) {
  const [selectedPrefs, setSelectedPrefs] = useState<Set<string>>(new Set());

  const togglePreference = (id: string) => {
    const newPrefs = new Set(selectedPrefs);
    if (newPrefs.has(id)) {
      newPrefs.delete(id);
    } else {
      newPrefs.add(id);
    }
    setSelectedPrefs(newPrefs);

    const preference: SearchPreference = {
      urgence: newPrefs.has("urgence"),
      cnamgs: newPrefs.has("cnamgs"),
      ouvert247: newPrefs.has("ouvert247"),
      proche: newPrefs.has("proche")
    };
    onPreferenceSelect(preference);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-medium">Affinez votre recherche (optionnel)</span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {PREFERENCE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isSelected = selectedPrefs.has(option.id);

          return (
            <button
              key={option.id}
              onClick={() => togglePreference(option.id)}
              className={cn(
                "relative p-4 rounded-xl border-2 transition-all duration-300 text-left group hover:scale-105",
                isSelected
                  ? `${option.borderColor} ${option.bgColor} shadow-md`
                  : "border-border bg-card hover:border-primary/30"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2 rounded-lg transition-colors",
                  isSelected ? option.bgColor : "bg-muted"
                )}>
                  <Icon className={cn("h-5 w-5", isSelected ? option.color : "text-muted-foreground")} />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="font-semibold text-sm flex items-center gap-2">
                    {option.label}
                    {isSelected && (
                      <Badge variant="default" className="text-xs">✓</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {option.description}
                  </div>
                </div>
              </div>

              {isSelected && (
                <div className={cn(
                  "absolute top-2 right-2",
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  option.bgColor
                )}>
                  <ChevronRight className={cn("h-4 w-4", option.color)} />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {selectedPrefs.size > 0 && (
        <div className="text-center pt-2 animate-fade-in">
          <p className="text-sm text-muted-foreground">
            {selectedPrefs.size} filtre{selectedPrefs.size > 1 ? 's' : ''} appliqué{selectedPrefs.size > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}
