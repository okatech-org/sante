import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, Database, TrendingUp, AlertCircle } from "lucide-react";
import { syncOSMFromSupabase } from "@/utils/osm-supabase-sync";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export function OSMSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    updated: number;
    added: number;
  } | null>(null);

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);
    setProgress(0);

    try {
      toast.loading("Synchronisation des données OpenStreetMap en cours...", { id: "osm-sync" });
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const syncResult = await syncOSMFromSupabase();
      
      clearInterval(progressInterval);
      setProgress(100);

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
        setProgress(0);
      }
    } catch (error) {
      console.error('Sync error:', error);
      toast.error("Erreur lors de la synchronisation", { id: "osm-sync" });
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Main Action Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Button
          onClick={handleSync}
          disabled={isLoading}
          size="lg"
          className="flex-1 sm:flex-initial text-base"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Synchronisation en cours...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-5 w-5" />
              Lancer la synchronisation
            </>
          )}
        </Button>
        
        {result && !isLoading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Synchronisation terminée
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progression</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Interrogation de l'API OpenStreetMap et enregistrement dans la base de données...
          </p>
        </div>
      )}

      {/* Results Display */}
      {result && !isLoading && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Added Count */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Database className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                    Nouveaux établissements
                  </p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {result.added}
                  </p>
                </div>
              </div>
            </Card>

            {/* Updated Count */}
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">
                    Mis à jour
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {result.updated}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Success Message */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="font-semibold text-green-900 dark:text-green-100 text-sm">
                  Synchronisation réussie !
                </p>
                <p className="text-xs text-green-800 dark:text-green-200">
                  Les données OpenStreetMap ont été intégrées avec succès dans votre base de données Supabase. 
                  Les établissements sont maintenant visibles sur la carte de la page d'accueil et dans la cartographie.
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                  Prochaines étapes
                </p>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1 list-disc list-inside">
                  <li>Consultez la carte pour voir les nouveaux établissements</li>
                  <li>Vérifiez les données dans la table <code className="bg-blue-100 dark:bg-blue-900 px-1 py-0.5 rounded">osm_health_providers</code></li>
                  <li>Vous pouvez relancer la synchronisation à tout moment pour mettre à jour les données</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
