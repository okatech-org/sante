import { OSMSyncButton } from "@/components/admin/OSMSyncButton";
import { SuperAdminLayout } from "@/components/layout/SuperAdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Map, RefreshCw, Shield, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function OSMSync() {
  return (
    <SuperAdminLayout>
      <div className="container mx-auto py-4 sm:py-8 px-4">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 sm:p-3 bg-primary/10 rounded-lg">
              <Map className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Synchronisation OpenStreetMap
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Importez automatiquement les établissements de santé du Gabon
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Super Admin uniquement
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Database className="h-3 w-3 mr-1" />
              Base de données Supabase
            </Badge>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">
          {/* Sync Action Card */}
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg sm:text-xl">Lancer la synchronisation</CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm">
                Cette action récupère les données OpenStreetMap et les sauvegarde dans votre base de données Supabase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OSMSyncButton />
            </CardContent>
          </Card>

          {/* How it works Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Zap className="h-5 w-5 text-primary" />
                Comment ça fonctionne ?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="relative p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    1
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 ml-2">
                    Récupération des données
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    L'API Overpass d'OpenStreetMap est interrogée pour récupérer tous les établissements de santé du Gabon (hôpitaux, cliniques, pharmacies, cabinets médicaux).
                  </p>
                </div>

                {/* Step 2 */}
                <div className="relative p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    2
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 ml-2">
                    Transformation des données
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Les données OSM sont transformées et normalisées pour correspondre au format de votre base de données avec toutes les informations pertinentes.
                  </p>
                </div>

                {/* Step 3 */}
                <div className="relative p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    3
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 ml-2">
                    Détection des doublons
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Le système identifie automatiquement les établissements déjà présents grâce à leur OSM ID unique pour éviter les duplications.
                  </p>
                </div>

                {/* Step 4 */}
                <div className="relative p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-lg">
                    4
                  </div>
                  <h4 className="font-semibold text-foreground mb-2 ml-2">
                    Sauvegarde en base de données
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Les données sont insérées ou mises à jour dans la table osm_health_providers de Supabase et disponibles immédiatement sur la carte.
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                      <Database className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-1">
                      Données en temps réel
                    </h4>
                    <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-200">
                      Les établissements synchronisés apparaissent instantanément sur la carte de la page d'accueil et dans la cartographie complète. Aucune action supplémentaire n'est requise.
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning Box */}
              <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="text-white font-bold">⏱</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-amber-900 dark:text-amber-100 text-sm mb-1">
                      Patience requise
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                      Cette opération peut prendre <strong>jusqu'à 60 secondes</strong> car elle interroge toute la base OpenStreetMap pour le Gabon. Ne rafraîchissez pas la page pendant le processus.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg">Informations techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Table Supabase:</span>{" "}
                    <code className="bg-muted px-2 py-0.5 rounded text-xs">osm_health_providers</code>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Source de données:</span>{" "}
                    <span className="text-muted-foreground">API Overpass OpenStreetMap</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Zone géographique:</span>{" "}
                    <span className="text-muted-foreground">Gabon (toutes les provinces)</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Méthode de mise à jour:</span>{" "}
                    <span className="text-muted-foreground">Upsert (insertion ou mise à jour automatique)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </SuperAdminLayout>
  );
}
