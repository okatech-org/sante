import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function ImportMedicamentsButton() {
  const [importing, setImporting] = useState(false);

  const handleImport = async () => {
    setImporting(true);
    
    try {
      toast.info("Connexion à l'API Médicaments FR...");
      
      const { data, error } = await supabase.functions.invoke('import-medicaments-fr', {
        method: 'POST',
      });

      if (error) throw error;

      toast.success(
        `✅ Import terminé: ${data.imported} médicaments importés${
          data.errors > 0 ? ` (${data.errors} erreurs)` : ''
        }`
      );
      
      // Recharger la page pour voir les nouveaux médicaments
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: any) {
      console.error('Erreur import:', error);
      toast.error(`Erreur: ${error.message || 'Import impossible'}`);
    } finally {
      setImporting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={importing}>
          {importing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importation en cours...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Importer Médicaments FR
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Importer depuis l'API française?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action déclenchera un import massif et peut prendre 2 à 3 minutes.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 text-sm">
          <div>Cette opération va :</div>
          <ul className="list-disc list-inside space-y-1">
            <li>Télécharger <strong>15 800+ médicaments</strong> depuis l'API Médicaments FR</li>
            <li>Convertir les prix EUR → XAF (1 EUR = 656 XAF)</li>
            <li>Adapter les données au format Gabon (CIP, DCI, etc.)</li>
            <li>Fusionner avec les médicaments existants</li>
          </ul>
          <div className="mt-2 text-amber-600 dark:text-amber-400">
            ⚠️ Les doublons seront évités automatiquement.
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={importing}>Annuler</AlertDialogCancel>
          <AlertDialogAction onClick={handleImport} disabled={importing}>
            {importing ? "Importation..." : "Confirmer l'import"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
