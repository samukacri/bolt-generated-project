import axios from 'axios';

export interface Voice {
  name: string;
  languageCodes: string[];
  ssmlGender: 'MALE' | 'FEMALE' | 'NEUTRAL';
  naturalSampleRateHertz: number;
}

export interface VoicesResponse {
  voices: Voice[];
}

const GOOGLE_TTS_API = 'https://texttospeech.googleapis.com/v1';

export const VoiceService = {
  async listVoices(): Promise<Voice[]> {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY;
      console.log('Fazendo requisição para listar vozes...');
      
      const response = await axios.get<VoicesResponse>(
        `${GOOGLE_TTS_API}/voices`,
        {
          params: {
            key: apiKey,
            languageCode: 'pt-BR,en-US,es-ES'
          }
        }
      );

      console.log('Resposta da API:', response.data);
      return response.data.voices;
    } catch (error) {
      console.error('Erro ao buscar vozes:', error);
      if (axios.isAxiosError(error)) {
        console.error('Detalhes do erro:', error.response?.data);
      }
      return [];
    }
  },

  getVoicesForLanguage(voices: Voice[], languageCode: string): Voice[] {
    console.log('Filtrando vozes para o idioma:', languageCode);
    const filteredVoices = voices.filter(voice => 
      voice.languageCodes.some(code => code.toLowerCase().startsWith(languageCode.toLowerCase()))
    );
    console.log('Vozes filtradas:', filteredVoices);
    return filteredVoices;
  }
};
