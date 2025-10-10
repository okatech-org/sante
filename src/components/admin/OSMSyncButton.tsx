import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";
import { syncOSMHealthProviders } from "@/utils/osm-health-sync";
import { toast } from "sonner";

export function OSMSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    updated: number;
    added: number;
    duplicates: Array<{ existing: string; osm: string }>;
  } | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      toast.loading("Récupération des données OpenStreetMap...", { id: "osm-sync" });
      
      const syncResult = await syncOSMHealthProviders();

      if (syncResult.success) {
        setResult({
          updated: syncResult.updated,
          added: syncResult.added,
          duplicates: syncResult.duplicates
        });

        toast.success(
          `Synchronisation réussie ! ${syncResult.updated} mis à jour, ${syncResult.added} ajoutés. Fichier téléchargé.`,
          { id: "osm-sync" }
        );
      } else {
        toast.error(`Erreur: ${syncResult.error}`, { id: "osm-sync" });
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Erreur lors de la synchronisation", { id: "osm-sync" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              Synchroniser avec OpenStreetMap
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Récupérez les établissements de santé depuis OpenStreetMap et fusionnez-les avec vos données existantes.
              Les coordonnées seront mises à jour automatiquement pour les établissements correspondants.
            </p>
          </div>

          <Button
            onClick={handleSync}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Synchronisation en cours...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Synchroniser et télécharger
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="font-medium">
                  {result.updated} établissement(s) mis à jour
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {result.added} nouvel(aux) établissement(s) ajouté(s)
                </span>
              </div>

              {result.duplicates.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <span className="font-medium">
                      {result.duplicates.length} doublon(s) détecté(s)
                    </span>
                  </div>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {result.duplicates.slice(0, 10).map((dup, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground pl-6">
                        • {dup.existing} ≈ {dup.osm}
                      </div>
                    ))}
                    {result.duplicates.length > 10 && (
                      <div className="text-xs text-muted-foreground pl-6">
                        ... et {result.duplicates.length - 10} autre(s)
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg mt-4">
                <p className="text-xs text-blue-800 dark:text-blue-200">
                  <strong>Note:</strong> Le fichier fusionné a été téléchargé. 
                  Remplacez manuellement le contenu de <code>src/data/cartography-providers.json</code> 
                  avec les données du fichier téléchargé.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
