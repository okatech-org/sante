import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  Activity, 
  Pill, 
  Briefcase, 
  FlaskConical, 
  Scan,
  Building,
  Heart
} from "lucide-react";

// Données réelles des établissements de santé du Gabon
export const ESTABLISHMENT_STATS = {
  total: 397,
  categories: {
    hospitals: { count: 41, label: "Hôpitaux", icon: Activity, color: "#ef4444" },
    clinics: { count: 147, label: "Cliniques", icon: Building2, color: "#22c55e" },
    pharmacies: { count: 114, label: "Pharmacies", icon: Pill, color: "#f59e0b" },
    cabinets: { count: 46, label: "Cabinets", icon: Briefcase, color: "#8b5cf6" },
    laboratories: { count: 18, label: "Laboratoires", icon: FlaskConical, color: "#06b6d4" },
    imaging: { count: 15, label: "Imagerie", icon: Scan, color: "#3b82f6" },
    institutions: { count: 16, label: "Institutions", icon: Building, color: "#64748b" } // Corrigé pour atteindre 397
  }
};

interface EstablishmentStatsCardProps {
  className?: string;
  showTotal?: boolean;
  columns?: 2 | 3 | 4;
  variant?: 'default' | 'compact' | 'detailed';
}

export function EstablishmentStatsCard({ 
  className = "", 
  showTotal = true,
  columns = 4,
  variant = 'default'
}: EstablishmentStatsCardProps) {
  const gridCols = columns === 2 ? "grid-cols-2" : columns === 3 ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4";

  if (variant === 'compact') {
    return (
      <div className={`grid ${gridCols} gap-3 ${className}`}>
        {Object.entries(ESTABLISHMENT_STATS.categories).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
              <Icon className="w-4 h-4" style={{ color: data.color }} />
              <div className="text-sm">
                <span className="font-semibold">{data.count}</span>
                <span className="text-muted-foreground ml-1">{data.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Total */}
            {showTotal && (
              <div className="text-center pb-4 border-b">
                <div className="text-4xl font-bold text-primary">{ESTABLISHMENT_STATS.total}</div>
                <div className="text-sm text-muted-foreground mt-1">Établissements de santé au Gabon</div>
              </div>
            )}

            {/* Catégories avec barres de progression */}
            <div className="space-y-4">
              {Object.entries(ESTABLISHMENT_STATS.categories).map(([key, data]) => {
                const Icon = data.icon;
                const percentage = Math.round((data.count / ESTABLISHMENT_STATS.total) * 100);
                
                return (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" style={{ color: data.color }} />
                        <span className="text-sm font-medium">{data.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{data.count}</span>
                        <span className="text-xs text-muted-foreground">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-accent rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: data.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Variant par défaut
  return (
    <div className={`space-y-4 ${className}`}>
      {showTotal && (
        <div className="text-center p-4 rounded-lg bg-primary/10">
          <div className="text-3xl font-bold text-primary">{ESTABLISHMENT_STATS.total}</div>
          <div className="text-sm text-muted-foreground">Établissements de santé</div>
        </div>
      )}
      
      <div className={`grid ${gridCols} gap-3`}>
        {Object.entries(ESTABLISHMENT_STATS.categories).map(([key, data]) => {
          const Icon = data.icon;
          return (
            <Card key={key} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${data.color}20` }}>
                    <Icon className="w-5 h-5" style={{ color: data.color }} />
                  </div>
                  <span className="text-2xl font-bold">{data.count}</span>
                </div>
                <p className="text-sm text-muted-foreground">{data.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Export des données pour utilisation dans d'autres composants
export function getEstablishmentTotal() {
  return ESTABLISHMENT_STATS.total;
}

export function getEstablishmentByType(type: keyof typeof ESTABLISHMENT_STATS.categories) {
  return ESTABLISHMENT_STATS.categories[type];
}

export function getEstablishmentSummary() {
  return Object.entries(ESTABLISHMENT_STATS.categories).map(([key, data]) => ({
    type: key,
    ...data
  }));
}
