import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RefreshCw, CheckCircle2, Database, TrendingUp, AlertCircle, MapPin, Clock } from "lucide-react";
import { syncOSMFromSupabase, getOSMProvidersFromSupabase } from "@/utils/osm-supabase-sync";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function OSMSyncButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<{
    updated: number;
    added: number;
  } | null>(null);
  const [currentCount, setCurrentCount] = useState<number>(0);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  // Charger le nombre actuel d'établissements
  useEffect(() => {
    loadCurrentCount();
  }, [result]);

  const loadCurrentCount = async () => {
    try {
      const providers = await getOSMProvidersFromSupabase();
      setCurrentCount(providers.length);
    } catch (error) {
      console.error('Error loading current count:', error);
    }
  };

  const handleSync = async () => {
    setIsLoading(true);
    setResult(null);
    setProgress(0);

    try {
      toast.loading("Connexion à l'API OpenStreetMap...", { id: "osm-sync" });
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 800);

      // Update toast messages during sync
      setTimeout(() => {
        toast.loading("Récupération des établissements de santé du Gabon...", { id: "osm-sync" });
      }, 2000);

      setTimeout(() => {
        toast.loading("Transformation et validation des données...", { id: "osm-sync" });
      }, 4000);

      setTimeout(() => {
        toast.loading("Sauvegarde dans la base de données Supabase...", { id: "osm-sync" });
      }, 6000);

      const syncResult = await syncOSMFromSupabase();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (syncResult.success) {
        setResult({
          updated: syncResult.updated,
          added: syncResult.added,
        });
        setLastSync(new Date());

        toast.success(
          `Synchronisation réussie ! ${syncResult.added} établissement(s) dans la base de données.`,
          { id: "osm-sync", duration: 5000 }
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
      {/* Current Status */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Database className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-0.5">
                Établissements dans la BDD
              </p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {currentCount}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-0.5">
                Dernière synchronisation
              </p>
              <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                {lastSync ? lastSync.toLocaleString('fr-FR', { 
                  day: '2-digit', 
                  month: 'short', 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 'Jamais'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Action Button */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
        <Button
          onClick={handleSync}
          disabled={isLoading}
          size="lg"
          className="flex-1 sm:flex-initial text-base group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              Synchronisation en cours...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
              Lancer la synchronisation
            </>
          )}
        </Button>
        
        {result && !isLoading && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800 animate-fade-in">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Synchronisation terminée
            </span>
          </div>
        )}
      </div>

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4 animate-pulse" />
              Récupération depuis OpenStreetMap
            </span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-xs text-muted-foreground">
              Interrogation de l'API Overpass et enregistrement dans Supabase...
            </p>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && !isLoading && (
        <div className="space-y-3 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Added Count */}
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-shadow">
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
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20 border-green-200 dark:border-green-800 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-0.5">
                    Total en base
                  </p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {currentCount}
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
                  Les données OpenStreetMap ont été intégrées avec succès. Les établissements sont maintenant visibles en temps réel sur toutes les cartes du site.
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Page d'accueil
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Cartographie complète
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    <Database className="h-3 w-3 mr-1" />
                    Table osm_health_providers
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
                  Affichage automatique
                </p>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>Les marqueurs apparaissent instantanément sur la carte de la page d'accueil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>Les filtres et la recherche incluent automatiquement les nouveaux établissements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                    <span>Vous pouvez relancer la synchronisation à tout moment pour mettre à jour</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
