import { Mic, MicOff, Loader2, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IAstedButtonProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
  audioLevel?: number;
  onClick: () => void;
  className?: string;
}

export const IAstedButton = ({ state, audioLevel = 0, onClick, className }: IAstedButtonProps) => {
  const isActive = state !== 'idle';
  
  const getIcon = () => {
    switch (state) {
      case 'listening':
        return <Mic className="w-8 h-8" />;
      case 'thinking':
        return <Loader2 className="w-8 h-8 animate-spin" />;
      case 'speaking':
        return <Volume2 className="w-8 h-8 animate-pulse" />;
      default:
        return <MicOff className="w-8 h-8" />;
    }
  };

  const getLabel = () => {
    switch (state) {
      case 'listening':
        return "Écoute...";
      case 'thinking':
        return "Analyse...";
      case 'speaking':
        return "Réponse...";
      default:
        return "Activer iAsted";
    }
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-4 p-8 rounded-2xl transition-all duration-300",
        isActive ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",
        className
      )}
    >
      {/* Audio level visualization for listening state */}
      {state === 'listening' && (
        <div className="absolute inset-0 rounded-2xl overflow-hidden opacity-30">
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-zinc-400 to-transparent transition-all duration-100"
            style={{ height: `${Math.min(audioLevel * 2, 100)}%` }}
          />
        </div>
      )}

      {/* Main icon */}
      <div className="relative z-10">
        {getIcon()}
      </div>

      {/* Label */}
      <span className="relative z-10 text-sm font-medium">
        {getLabel()}
      </span>

      {/* Pulse animation ring for listening state */}
      {state === 'listening' && (
        <div className="absolute inset-0 rounded-2xl animate-ping bg-zinc-400 opacity-20" />
      )}
    </button>
  );
};