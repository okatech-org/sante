/**
 * Service de commande vocale pour iAsted
 * Enregistrement micro + transcription
 */

export class VoiceService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Vérifier si le navigateur supporte l'enregistrement audio
   */
  static isSupported(): boolean {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }

  /**
   * Demander permission microphone
   */
  async requestMicrophonePermission(): Promise<boolean> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }

  /**
   * Démarrer l'enregistrement
   */
  async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        } 
      });

      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm',
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start();
      console.log('🎙️ Enregistrement démarré');
    } catch (error) {
      console.error('Erreur démarrage enregistrement:', error);
      throw new Error('Impossible de démarrer l\'enregistrement. Vérifiez les permissions microphone.');
    }
  }

  /**
   * Arrêter l'enregistrement et retourner le blob audio
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('Aucun enregistrement en cours'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        console.log('🎙️ Enregistrement arrêté, taille:', audioBlob.size, 'bytes');
        
        // Nettoyer
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
          this.stream = null;
        }
        
        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (error) => {
        console.error('Erreur enregistrement:', error);
        reject(new Error('Erreur lors de l\'enregistrement'));
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Transcrire un audio via l'API backend
   */
  async transcribe(audioBlob: Blob, token: string): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-command.webm');

      const response = await fetch('/api/dashboard/iasted/transcribe', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erreur transcription');
      }

      const { text } = await response.json();
      console.log('📝 Transcription:', text);
      return text;
    } catch (error) {
      console.error('Erreur transcription:', error);
      throw new Error('Impossible de transcrire l\'audio');
    }
  }

  /**
   * Enregistrer et transcrire en une seule opération
   */
  async recordAndTranscribe(token: string): Promise<string> {
    await this.startRecording();
    
    // Attendre X secondes puis arrêter automatiquement
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    const audioBlob = await this.stopRecording();
    return await this.transcribe(audioBlob, token);
  }
}

/**
 * Service de synthèse vocale (TTS)
 */
export class TTSService {
  /**
   * Vérifier si le navigateur supporte la synthèse vocale
   */
  static isSupported(): boolean {
    return 'speechSynthesis' in window;
  }

  /**
   * Lire un texte avec la voix du navigateur
   */
  static speak(text: string, options?: {
    lang?: string;
    rate?: number;
    pitch?: number;
    volume?: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Synthèse vocale non supportée'));
        return;
      }

      // Annuler toute lecture en cours
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options?.lang || 'fr-FR';
      utterance.rate = options?.rate || 0.95;
      utterance.pitch = options?.pitch || 1.0;
      utterance.volume = options?.volume || 1.0;

      // Sélectionner voix française si disponible
      const voices = speechSynthesis.getVoices();
      const frenchVoice = voices.find(v => v.lang?.toLowerCase().startsWith('fr')) || 
                         voices.find(v => /french|français/i.test(v.name));
      
      if (frenchVoice) {
        utterance.voice = frenchVoice;
      }

      utterance.onend = () => {
        console.log('🔊 Lecture terminée');
        resolve();
      };

      utterance.onerror = (error) => {
        console.error('Erreur lecture:', error);
        reject(error);
      };

      speechSynthesis.speak(utterance);
      console.log('🔊 Lecture démarrée');
    });
  }

  /**
   * Arrêter la lecture en cours
   */
  static stop(): void {
    if (this.isSupported()) {
      speechSynthesis.cancel();
    }
  }
}

export default VoiceService;

