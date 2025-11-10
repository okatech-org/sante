import { StopCircle, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IAstedVoiceControlsProps {
  state: 'listening' | 'thinking' | 'speaking';
  onStop: () => void;
  onCancel: () => void;
  onStopSpeaking: () => void;
}

export const IAstedVoiceControls = ({
  state,
  onStop,
  onCancel,
  onStopSpeaking,
}: IAstedVoiceControlsProps) => {
  return (
    <div className="flex gap-4">
      {state === 'listening' && (
        <Button
          onClick={onStop}
          variant="outline"
          size="sm"
          className="bg-zinc-100 hover:bg-zinc-200"
        >
          <StopCircle className="w-4 h-4 mr-2" />
          Arrêter l'écoute
        </Button>
      )}

      {state === 'speaking' && (
        <Button
          onClick={onStopSpeaking}
          variant="outline"
          size="sm"
          className="bg-zinc-100 hover:bg-zinc-200"
        >
          <Volume2 className="w-4 h-4 mr-2" />
          Arrêter la lecture
        </Button>
      )}

      <Button
        onClick={onCancel}
        variant="ghost"
        size="sm"
        className="text-zinc-600 hover:text-zinc-900"
      >
        <X className="w-4 h-4 mr-2" />
        Annuler
      </Button>
    </div>
  );
};