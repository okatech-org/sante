import { useVoiceInteraction } from '@/hooks/useVoiceInteraction';
import { IAstedButton } from './IAstedButton';
import { IAstedListeningOverlay } from './IAstedListeningOverlay';
import { IAstedVoiceControls } from './IAstedVoiceControls';

export const IAstedVoiceButton = () => {
  const {
    state,
    audioLevel,
    startListening,
    stopListening,
    stopSpeaking,
    reset,
  } = useVoiceInteraction();

  const handleClick = () => {
    if (state === 'idle') {
      startListening();
    } else if (state === 'listening') {
      stopListening();
    } else if (state === 'speaking') {
      stopSpeaking();
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-6">
        <IAstedButton 
          state={state}
          audioLevel={audioLevel}
          onClick={handleClick}
          className="w-64 h-64"
        />
        
        {state !== 'idle' && (
          <IAstedVoiceControls
            state={state}
            onStop={stopListening}
            onCancel={reset}
            onStopSpeaking={stopSpeaking}
          />
        )}
      </div>

      {state === 'listening' && (
        <IAstedListeningOverlay
          audioLevel={audioLevel}
          onStop={stopListening}
        />
      )}
    </>
  );
};