import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stats, Province } from "@/types/cartography";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CartographyStatsProps {
  stats: Stats;
  provinces: Province[];
}

export default function CartographyStats({ stats, provinces }: CartographyStatsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Provinces sans ou avec peu de prestataires (déserts médicaux)
  const desertsProvinces = provinces.filter(
    p => !stats.byProvince[p.id] || stats.byProvince[p.id] < 2
  );

  // Top 3 provinces
  const topProvinces = Object.entries(stats.byProvince)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([provinceId, count]) => ({
      province: provinces.find(p => p.id === provinceId),
      count
    }));

  const TYPE_LABELS: Record<string, string> = {
    hopital: "Hôpitaux/Cliniques",
    clinique: "Cliniques",
    cabinet_medical: "Cabinets",
    pharmacie: "Pharmacies",
    laboratoire: "Laboratoires",
    imagerie: "Centres Imagerie",
    cabinet_dentaire: "Dentaires"
  };

  return (
    <Card className="w-full">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">📊 Statistiques du Réseau de Santé</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{stats.totalProviders}</div>
            <div className="text-sm text-muted-foreground">Prestataires</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{stats.services247}</div>
            <div className="text-sm text-muted-foreground">Services 24/7</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{stats.imagerieLourde}</div>
            <div className="text-sm text-muted-foreground">Imagerie lourde</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Object.keys(stats.byProvince).length}
            </div>
            <div className="text-sm text-muted-foreground">Provinces</div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-6">
            {/* Répartition géographique */}
            <div>
              <h4 className="font-semibold mb-3">📍 Répartition Géographique</h4>
              <div className="space-y-2">
                {topProvinces.map(({ province, count }) => (
                  province && (
                    <div key={province.id} className="flex items-center justify-between">
                      <span className="text-sm">{province.nom}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-accent rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ 
                              width: `${(count / stats.totalProviders) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-sm font-semibold w-12 text-right">
                          {count}
                        </span>
                      </div>
                    </div>
                  )
                ))}
              </div>
              
              {topProvinces.length > 0 && topProvinces[0].count && (
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ {Math.round((topProvinces[0].count / stats.totalProviders) * 100)}% 
                  des structures concentrées à {topProvinces[0].province?.nom}
                </p>
              )}
            </div>

            {/* Par type */}
            <div>
              <h4 className="font-semibold mb-3">🏥 Par Type de Structure</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(stats.byType).map(([type, count]) => (
                  <Badge key={type} variant="secondary">
                    {TYPE_LABELS[type] || type}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Déserts médicaux */}
            {desertsProvinces.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="space-y-2">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100">
                      ⚠️ Zones à Faible Couverture
                    </h4>
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      {desertsProvinces.length} province{desertsProvinces.length > 1 ? 's' : ''} avec 
                      moins de 2 prestataires documentés:
                    </p>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                      {desertsProvinces.map(province => (
                        <li key={province.id}>
                          • {province.nom} ({province.chef_lieu}) - 
                          {stats.byProvince[province.id] || 0} prestataire{stats.byProvince[province.id] > 1 ? 's' : ''}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-2">
                      → Dépendance aux structures publiques/confessionnelles
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Services critiques */}
            <div>
              <h4 className="font-semibold mb-3">⚡ Services Critiques</h4>
              <ul className="text-sm space-y-2">
                <li className="flex items-center justify-between">
                  <span>IRM/Scanner haute résolution</span>
                  <Badge variant={stats.imagerieLourde > 0 ? "default" : "destructive"}>
                    {stats.imagerieLourde} centre{stats.imagerieLourde > 1 ? 's' : ''}
                  </Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>Services 24/7</span>
                  <Badge className="bg-green-600">
                    {stats.services247} structure{stats.services247 > 1 ? 's' : ''}
                  </Badge>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
