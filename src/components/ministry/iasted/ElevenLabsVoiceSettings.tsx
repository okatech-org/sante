import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Volume2, Save } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ELEVENLABS_VOICES = [
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria', gender: 'Female' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger', gender: 'Male' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah', gender: 'Female' },
  { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura', gender: 'Female' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie', gender: 'Male' },
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', gender: 'Male' },
  { id: 'N2lVS1w4EtoT3dr4eOWO', name: 'Callum', gender: 'Male' },
  { id: 'SAz9YHcvj6GT2YYXdXww', name: 'River', gender: 'Neutral' },
  { id: 'TX3LPaxmHKxFdv7VOQHJ', name: 'Liam', gender: 'Male' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte', gender: 'Female' },
  { id: 'Xb7hH8MSUJpSbSDYk0k2', name: 'Alice', gender: 'Female' },
  { id: 'XrExE9yKIg1WjnnlVkGX', name: 'Matilda', gender: 'Female' },
  { id: 'bIHbv24MWmeRgasZH58o', name: 'Will', gender: 'Male' },
  { id: 'cgSgspJ2msm6clMCkdW9', name: 'Jessica', gender: 'Female' },
  { id: 'cjVigY5qzO86Huf0OWal', name: 'Eric', gender: 'Male' },
  { id: 'iP95p4xoKVk53GoZ742B', name: 'Chris', gender: 'Male' },
  { id: 'nPczCjzI2devNBz1zQrb', name: 'Brian', gender: 'Male' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel', gender: 'Male' },
  { id: 'pFZP5JQG7iQjIQuC4Bku', name: 'Lily', gender: 'Female' },
  { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill', gender: 'Male' },
];

const ELEVENLABS_MODELS = [
  { id: 'eleven_multilingual_v2', name: 'Multilingual v2', description: 'Plus émotionnel, 29 langues' },
  { id: 'eleven_turbo_v2_5', name: 'Turbo v2.5', description: 'Faible latence, 32 langues' },
  { id: 'eleven_turbo_v2', name: 'Turbo v2', description: 'Anglais uniquement, rapide' },
];

export const ElevenLabsVoiceSettings = () => {
  const [selectedVoice, setSelectedVoice] = useState('9BWtsMINqrJLrRacOk9x'); // Aria par défaut
  const [selectedModel, setSelectedModel] = useState('eleven_multilingual_v2');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('user_preferences')
        .select('elevenlabs_voice_id, elevenlabs_model')
        .eq('user_id', user.id)
        .single();

      if (data) {
        if (data.elevenlabs_voice_id) setSelectedVoice(data.elevenlabs_voice_id);
        if (data.elevenlabs_model) setSelectedModel(data.elevenlabs_model);
      }
    } catch (error) {
      console.error('Error loading preferences:', error);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          elevenlabs_voice_id: selectedVoice,
          elevenlabs_model: selectedModel,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      toast({
        title: 'Paramètres enregistrés',
        description: 'Vos préférences vocales ont été mises à jour.',
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de sauvegarder les paramètres.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testVoice = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('test-elevenlabs-voice', {
        body: {
          voiceId: selectedVoice,
          model: selectedModel,
          text: 'Bonjour, je suis iAsted, votre assistant vocal intelligent.',
        },
      });

      if (error) throw error;

      if (data.audioUrl) {
        const audio = new Audio(data.audioUrl);
        audio.play();
      }

      toast({
        title: 'Test vocal',
        description: 'Écoute de la voix en cours...',
      });
    } catch (error) {
      console.error('Error testing voice:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de tester la voix.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVoiceInfo = ELEVENLABS_VOICES.find(v => v.id === selectedVoice);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 mb-1">
            Configuration ElevenLabs
          </h3>
          <p className="text-sm text-zinc-500">
            Personnalisez la voix et le modèle pour iAsted
          </p>
        </div>

        {/* Voice Selection */}
        <div className="space-y-2">
          <Label>Voix</Label>
          <Select value={selectedVoice} onValueChange={setSelectedVoice}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ELEVENLABS_VOICES.map((voice) => (
                <SelectItem key={voice.id} value={voice.id}>
                  {voice.name} ({voice.gender})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedVoiceInfo && (
            <p className="text-xs text-zinc-500">
              Voix {selectedVoiceInfo.gender.toLowerCase()} sélectionnée
            </p>
          )}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label>Modèle</Label>
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ELEVENLABS_MODELS.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  <div>
                    <div className="font-medium">{model.name}</div>
                    <div className="text-xs text-zinc-500">{model.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={testVoice}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            <Volume2 className="w-4 h-4 mr-2" />
            {isLoading ? 'Test en cours...' : 'Tester la voix'}
          </Button>
          <Button
            onClick={savePreferences}
            disabled={isSaving}
            className="flex-1 bg-zinc-900 hover:bg-zinc-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Enregistrement...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </Card>
  );
};
