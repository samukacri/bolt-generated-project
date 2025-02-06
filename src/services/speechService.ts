import { TextToSpeechService } from './textToSpeechService';
import { Capacitor } from '@capacitor/core';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

export interface SpeechOptions {
  text: string;
  language: string;
  pitch?: number;
  rate?: number;
}

export class SpeechService {
  static async speak(options: SpeechOptions): Promise<string> {
    // Verifica se está rodando em um dispositivo Android
    if (Capacitor.getPlatform() === 'android') {
      try {
        // Configurações para TextToSpeech do Android
        await TextToSpeech.speak({
          text: options.text,
          lang: options.language,
          rate: options.rate || 1.0,
          pitch: options.pitch || 1.0
        });
        
        // Como o TextToSpeech do Android é síncrono, retornamos uma URL vazia
        return '';
      } catch (error) {
        console.error('Erro no TextToSpeech do Android:', error);
        throw error;
      }
    } 
    
    // Para outras plataformas (web, desktop), usa o serviço do Google
    return TextToSpeechService.synthesizeSpeech(
      options.text, 
      options.language, 
      { 
        pitch: options.pitch, 
        rate: options.rate 
      }
    );
  }

  static async stop() {
    if (Capacitor.getPlatform() === 'android') {
      await TextToSpeech.stop();
    }
    // Para outras plataformas, não há necessidade de implementação específica
  }
}
