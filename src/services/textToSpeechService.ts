import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

const LANGUAGE_VOICE_MAP: { [key: string]: { languageCode: string, voiceName: string }[] } = {
  'pt': [
    { languageCode: 'pt-BR', voiceName: 'pt-BR-Neural2-B' },
    { languageCode: 'pt-PT', voiceName: 'pt-PT-Neural2-A' }
  ],
  'en': [
    { languageCode: 'en-US', voiceName: 'en-US-Neural2-D' },
    { languageCode: 'en-GB', voiceName: 'en-GB-Neural2-A' }
  ],
  'es': [
    { languageCode: 'es-ES', voiceName: 'es-ES-Neural2-B' },
    { languageCode: 'es-MX', voiceName: 'es-MX-Neural2-A' }
  ]
};

interface AudioConfig {
  audioEncoding: string;
  pitch: number;
  speakingRate: number;
}

interface TextToSpeechRequest {
  input: { text: string };
  voice: { languageCode: string; name: string };
  audioConfig: AudioConfig;
}

export class TextToSpeechService {
  private static GOOGLE_TTS_URL = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  private static MAX_TEXT_LENGTH = 5000;

  private static getVoiceConfig(language: string) {
    const langCode = language.split('-')[0].toLowerCase();
    const voices = LANGUAGE_VOICE_MAP[langCode] || LANGUAGE_VOICE_MAP['pt'];
    return voices[0];
  }

  private static truncateText(text: string | undefined): string {
    if (!text) return '';
    const safeText = String(text);
    return safeText.length > this.MAX_TEXT_LENGTH 
      ? safeText.substring(0, this.MAX_TEXT_LENGTH) 
      : safeText;
  }

  static async synthesizeSpeech(
    text: string | undefined, 
    language: string, 
    settings?: { pitch?: number; rate?: number }
  ): Promise<string> {
    if (!text) {
      console.error('Texto não fornecido para narração');
      throw new Error('Texto não fornecido para narração');
    }

    const apiKey = import.meta.env.VITE_GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      console.error('Chave da API do Google TTS não encontrada');
      throw new Error('Chave da API do Google TTS não encontrada');
    }

    try {
      const truncatedText = this.truncateText(text);
      const voiceConfig = this.getVoiceConfig(language);

      console.log('Sintetizando voz:', {
        texto: truncatedText.substring(0, 100) + '...',
        idioma: language,
        voz: voiceConfig
      });

      const response = await axios.post(
        `${this.GOOGLE_TTS_URL}?key=${apiKey}`,
        {
          input: { text: truncatedText },
          voice: {
            languageCode: voiceConfig.languageCode,
            name: voiceConfig.voiceName
          },
          audioConfig: {
            audioEncoding: 'MP3',
            pitch: settings?.pitch || 0,
            speakingRate: settings?.rate || 1
          }
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data || !response.data.audioContent) {
        throw new Error('Nenhum conteúdo de áudio retornado pela API');
      }

      // Converter o conteúdo base64 em blob de áudio
      const audioContent = response.data.audioContent;
      const binaryAudio = atob(audioContent);
      const arrayBuffer = new ArrayBuffer(binaryAudio.length);
      const bytes = new Uint8Array(arrayBuffer);
      
      for (let i = 0; i < binaryAudio.length; i++) {
        bytes[i] = binaryAudio.charCodeAt(i);
      }

      const audioBlob = new Blob([arrayBuffer], { type: 'audio/mp3' });
      return URL.createObjectURL(audioBlob);

    } catch (error: any) {
      console.error('Erro na síntese de voz:', error);
      
      const errorMessage = error.response?.data?.error?.message || error.message;
      toast({
        title: 'Erro na Síntese de Voz',
        description: errorMessage,
        variant: 'destructive'
      });
      
      throw error;
    }
  }
}
