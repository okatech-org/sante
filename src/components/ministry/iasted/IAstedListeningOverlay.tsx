import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IAstedListeningOverlayProps {
  audioLevel: number;
  onStop: () => void;
}

export const IAstedListeningOverlay = ({ audioLevel, onStop }: IAstedListeningOverlayProps) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="relative flex flex-col items-center gap-8">
        {/* Audio visualization */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-zinc-400 animate-ping"
              style={{
                width: `${60 + i * 40}px`,
                height: `${60 + i * 40}px`,
                animationDelay: `${i * 0.2}s`,
                opacity: Math.min(audioLevel / 100, 0.6 - i * 0.1),
              }}
            />
          ))}
          <div className="relative z-10 text-center">
            <p className="text-white text-xl font-medium">Écoute en cours...</p>
            <p className="text-zinc-400 text-sm mt-2">Parlez maintenant</p>
          </div>
        </div>

        {/* Stop button */}
        <Button
          onClick={onStop}
          variant="outline"
          size="lg"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20"
        >
          <X className="w-5 h-5 mr-2" />
          Arrêter
        </Button>
      </div>
    </div>
  );
};