import { OSMSyncButton } from "@/components/admin/OSMSyncButton";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OSMSync() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Synchronisation OpenStreetMap</CardTitle>
              <CardDescription>
                Récupérez et fusionnez les données d'établissements de santé depuis OpenStreetMap
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OSMSyncButton />
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Comment ça fonctionne ?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">1. Récupération des données</h4>
                <p>
                  L'outil interroge l'API Overpass d'OpenStreetMap pour récupérer tous les hôpitaux, 
                  cliniques, pharmacies et cabinets médicaux au Gabon.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">2. Détection des doublons</h4>
                <p>
                  Le système compare les noms des établissements OSM avec vos données existantes 
                  pour identifier les doublons (même établissement avec des noms similaires).
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">3. Fusion intelligente</h4>
                <p>
                  Pour les doublons détectés, les coordonnées GPS sont mises à jour avec celles d'OSM. 
                  Les nouveaux établissements sont ajoutés à vos données.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">4. Téléchargement du fichier</h4>
                <p>
                  Un fichier JSON contenant toutes les données fusionnées est automatiquement téléchargé. 
                  Vous devez ensuite remplacer manuellement le contenu de{" "}
                  <code className="bg-muted px-1 py-0.5 rounded">
                    src/data/cartography-providers.json
                  </code>{" "}
                  avec ce fichier.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-amber-800 dark:text-amber-200 font-medium">
                  ⚠️ Important: Cette opération peut prendre jusqu'à 60 secondes car elle interroge 
                  toute la base OpenStreetMap pour le Gabon.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
