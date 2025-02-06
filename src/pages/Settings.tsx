import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BottomNav } from "@/components/BottomNav";
import { BibleVersionSelect } from "@/components/bible/BibleVersionSelect";
import { getBibleVersion, setBibleVersion } from "@/services/bibleApi";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";

const LANGUAGE_VOICE_MAP = {
  'pt': [
    { languageCode: 'pt-BR', voiceName: 'pt-BR-Neural2-B', label: 'Português (Brasil) - Voz B' },
    { languageCode: 'pt-PT', voiceName: 'pt-PT-Neural2-A', label: 'Português (Portugal) - Voz A' }
  ],
  'en': [
    { languageCode: 'en-US', voiceName: 'en-US-Neural2-D', label: 'English (US) - Voice D' },
    { languageCode: 'en-GB', voiceName: 'en-GB-Neural2-A', label: 'English (UK) - Voice A' }
  ],
  'es': [
    { languageCode: 'es-ES', voiceName: 'es-ES-Neural2-B', label: 'Español (España) - Voz B' },
    { languageCode: 'es-MX', voiceName: 'es-MX-Neural2-A', label: 'Español (México) - Voz A' }
  ]
};

const Settings = () => {
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const [bibleVersion, setBibleVersionState] = useState(getBibleVersion());
  const { toast } = useToast();
  const [selectedVoice, setSelectedVoice] = useState(() => {
    const langCode = language.split('-')[0].toLowerCase();
    const savedVoice = localStorage.getItem(`selected_voice_${language}`);
    return savedVoice || LANGUAGE_VOICE_MAP[langCode]?.[0]?.voiceName || '';
  });

  const handleVoiceChange = (voiceName: string) => {
    setSelectedVoice(voiceName);
    localStorage.setItem(`selected_voice_${language}`, voiceName);
    toast({
      title: t('voiceChanged'),
      description: t('changesApplied'),
    });
  };

  const handleBibleVersionChange = (version: string) => {
    setBibleVersion(version);
    setBibleVersionState(version);
    toast({
      title: t('bibleVersionChanged'),
      description: t('changesApplied'),
    });
    navigate('/bible');
  };

  const getAvailableVoices = () => {
    const langCode = language.split('-')[0].toLowerCase();
    return LANGUAGE_VOICE_MAP[langCode] || [];
  };

  return (
    <div className="container mx-auto pb-20">
      <div className="space-y-4 p-4">
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        
        <div className="space-y-4">
          <div>
            <Label>{t('language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt-BR">Português</SelectItem>
                <SelectItem value="es">Español</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('voice')}</Label>
            <Select value={selectedVoice} onValueChange={handleVoiceChange}>
              <SelectTrigger>
                <SelectValue placeholder={t('selectVoice')} />
              </SelectTrigger>
              <SelectContent>
                {getAvailableVoices().map((voice) => (
                  <SelectItem key={voice.voiceName} value={voice.voiceName}>
                    {voice.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t('bibleVersion')}</Label>
            <BibleVersionSelect 
              value={bibleVersion}
              onValueChange={handleBibleVersionChange}
            />
          </div>
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default Settings;
