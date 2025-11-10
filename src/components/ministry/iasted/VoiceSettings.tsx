import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';

export const VoiceSettings = () => {
  const [focusModeEnabled, setFocusModeEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('user_preferences')
        .select('voice_focus_mode')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFocusModeEnabled(data.voice_focus_mode);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (focusMode: boolean) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          voice_focus_mode: focusMode,
        });

      if (error) throw error;

      setFocusModeEnabled(focusMode);
      toast({
        title: "Préférences mises à jour",
        description: focusMode 
          ? "Mode focus activé pour les conversations approfondies"
          : "Mode focus désactivé",
      });
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour les préférences",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-sm text-zinc-500">Chargement...</div>;
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-2">
            Paramètres vocaux
          </h3>
          <p className="text-sm text-zinc-600">
            Configurez le comportement de l'assistant iAsted
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="focus-mode" className="text-base">
              Mode Focus
            </Label>
            <p className="text-sm text-zinc-500">
              Active l'approfondissement progressif sur 7 niveaux pour explorer
              les sujets en détail
            </p>
          </div>
          <Switch
            id="focus-mode"
            checked={focusModeEnabled}
            onCheckedChange={updatePreferences}
          />
        </div>

        {focusModeEnabled && (
          <div className="bg-zinc-50 p-4 rounded-lg text-sm text-zinc-600">
            <p className="font-medium mb-2">Niveaux d'approfondissement :</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Niveau 1: Vue d'ensemble et contexte général</li>
              <li>Niveau 2: Analyse des composantes principales</li>
              <li>Niveau 3: Détails opérationnels et métriques</li>
              <li>Niveau 4: Défis et obstacles spécifiques</li>
              <li>Niveau 5: Solutions et recommandations</li>
              <li>Niveau 6: Impacts et implications</li>
              <li>Niveau 7: Synthèse et plan d'action</li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};