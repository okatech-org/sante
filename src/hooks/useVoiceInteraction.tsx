import { useState, useRef, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  audioUrl?: string;
}

export const useVoiceInteraction = () => {
  const [state, setState] = useState<VoiceState>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [focusTopic, setFocusTopic] = useState<string | null>(null);
  const [focusDepth, setFocusDepth] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Voice Activity Detection
  const detectSilence = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setAudioLevel(average);

    if (average < 20) { // Silence threshold
      if (!silenceTimerRef.current) {
        silenceTimerRef.current = setTimeout(() => {
          stopListening();
        }, 1500); // 1.5 seconds of silence
      }
    } else {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    }

    if (state === 'listening') {
      requestAnimationFrame(detectSilence);
    }
  }, [state]);

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Setup audio context for VAD
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Setup media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAndSend(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setState('listening');
      detectSilence();

      toast({
        title: "Écoute activée",
        description: "Parlez maintenant...",
      });
    } catch (error) {
      console.error('Error starting listening:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone",
        variant: "destructive",
      });
    }
  }, [detectSilence]);

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setState('thinking');
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
  }, []);

  const transcribeAndSend = useCallback(async (audioBlob: Blob) => {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        if (!base64Audio) throw new Error('Failed to convert audio');

        // Transcribe audio
        const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke('transcribe-audio', {
          body: { audioData: base64Audio }
        });

        if (transcriptionError) throw transcriptionError;

        const userMessage = transcriptionData.text;
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        // Get AI response
        const { data: responseData, error: responseError } = await supabase.functions.invoke('chat-with-iasted', {
          body: { 
            message: userMessage,
            sessionId: sessionId,
          }
        });

        if (responseError) throw responseError;

        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: responseData.text,
          audioUrl: responseData.audioUrl 
        }]);

        setSessionId(responseData.sessionId);
        setFocusMode(responseData.focusMode);
        setFocusTopic(responseData.focusTopic);
        setFocusDepth(responseData.focusDepth);

        // Play audio response
        if (responseData.audioUrl) {
          setState('speaking');
          const audio = new Audio(responseData.audioUrl);
          audioRef.current = audio;
          audio.onended = () => setState('idle');
          audio.play();
        } else {
          setState('idle');
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      toast({
        title: "Erreur",
        description: "Impossible de traiter l'audio",
        variant: "destructive",
      });
      setState('idle');
    }
  }, [sessionId]);

  const sendTextMessage = useCallback(async (text: string) => {
    try {
      setState('thinking');
      setMessages(prev => [...prev, { role: 'user', content: text }]);

      const { data: responseData, error: responseError } = await supabase.functions.invoke('chat-with-iasted', {
        body: { 
          message: text,
          sessionId: sessionId,
        }
      });

      if (responseError) throw responseError;

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: responseData.text,
        audioUrl: responseData.audioUrl 
      }]);

      setSessionId(responseData.sessionId);
      setFocusMode(responseData.focusMode);
      setFocusTopic(responseData.focusTopic);
      setFocusDepth(responseData.focusDepth);

      if (responseData.audioUrl) {
        setState('speaking');
        const audio = new Audio(responseData.audioUrl);
        audioRef.current = audio;
        audio.onended = () => setState('idle');
        audio.play();
      } else {
        setState('idle');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message",
        variant: "destructive",
      });
      setState('idle');
    }
  }, [sessionId]);

  const stopSpeaking = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setState('idle');
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setFocusMode(false);
    setFocusTopic(null);
    setFocusDepth(0);
    stopSpeaking();
  }, [stopSpeaking]);

  // Load greeting on mount
  useEffect(() => {
    const loadGreeting = async () => {
      try {
        const { data } = await supabase.functions.invoke('generate-greeting-audio');
        if (data?.audioUrl && data?.text) {
          setMessages([{ role: 'assistant', content: data.text, audioUrl: data.audioUrl }]);
        }
      } catch (error) {
        console.error('Error loading greeting:', error);
      }
    };
    loadGreeting();
  }, []);

  return {
    state,
    messages,
    focusMode,
    focusTopic,
    focusDepth,
    audioLevel,
    startListening,
    stopListening,
    sendTextMessage,
    stopSpeaking,
    reset,
  };
};