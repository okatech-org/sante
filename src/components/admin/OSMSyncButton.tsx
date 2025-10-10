import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle2 } from "lucide-react";
import { syncOSMFromSupabase } from "@/utils/osm-supabase-sync";
import { toast } from "sonner";

export function OSMSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    updated: number;
    added: number;
  } | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      toast.loading("Synchronisation des données OpenStreetMap en cours...", { id: "osm-sync" });
      
      const syncResult = await syncOSMFromSupabase();

      if (syncResult.success) {
        setResult({
          updated: syncResult.updated,
          added: syncResult.added,
        });

        toast.success(
          `Synchronisation réussie ! ${syncResult.added} établissement(s) ajouté(s) dans la base de données.`,
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
              Récupérez automatiquement les établissements de santé depuis OpenStreetMap et sauvegardez-les dans la base de données. 
              Les données seront disponibles immédiatement sur la carte.
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
                Synchronisation...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Synchroniser depuis OSM
              </>
            )}
          </Button>

          {result && (
            <div className="space-y-3 mt-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <span className="font-medium">
                  {result.added} nouvel(aux) établissement(s) ajouté(s) à la base de données
                </span>
              </div>

              <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg mt-4">
                <p className="text-xs text-green-800 dark:text-green-200">
                  <strong>Succès !</strong> Les données OpenStreetMap sont maintenant intégrées dans votre base de données
                  et s'affichent automatiquement sur la carte.
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
