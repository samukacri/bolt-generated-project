import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

type Language = 'pt-BR' | 'es' | 'en';

interface LanguageContextType {
  language: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  'pt-BR': {
    'appName': 'Bíblia Digital',
    'searchBible': 'Pesquisar na Bíblia',
    'readAndStudy': 'Leia e estude a Bíblia',
    'findPeace': 'Encontre paz na oração',
    'accessFavorites': 'Acesse seus versículos favoritos',
    'dailyVerse': 'Versículo do Dia',
    'continueReading': 'Continuar Leitura',
    'continueReadingDescription': 'Continue sua última leitura a partir de onde parou.',
    'favorites': 'Favoritos',
    'bible': 'Bíblia',
    'settings': 'Configurações',
    'home': 'Início',
    'alerts': 'Alertas',
    'more': 'Mais',
    'prayers': 'Orações',
    'preferences': 'Preferências',
    'language': 'Idioma',
    'languageChanged': 'Idioma alterado com sucesso!',
    'changesApplied': 'As alterações serão aplicadas imediatamente.',
    'profile': 'Perfil',
    'myProfile': 'Meu Perfil',
    'oldTestament': 'Antigo Testamento',
    'newTestament': 'Novo Testamento',
    'accessOldTestament': 'Acesse os livros do Antigo Testamento',
    'accessNewTestament': 'Acesse os livros do Novo Testamento',
    'back': 'Voltar',
    'selectBibleVersion': 'Selecione a versão da Bíblia',
    'bibleVersion': 'Versão da Bíblia',
    'bibleVersionChanged': 'Versão da Bíblia alterada com sucesso!',
  },
  'es': {
    'appName': 'Biblia Digital',
    'searchBible': 'Buscar en la Biblia',
    'readAndStudy': 'Lee y estudia la Biblia',
    'findPeace': 'Encuentra paz en la oración',
    'accessFavorites': 'Accede a tus versículos favoritos',
    'dailyVerse': 'Versículo del Día',
    'continueReading': 'Continuar Leyendo',
    'continueReadingDescription': 'Continúa tu última lectura desde donde lo dejaste.',
    'favorites': 'Favoritos',
    'bible': 'Biblia',
    'settings': 'Configuración',
    'home': 'Inicio',
    'alerts': 'Alertas',
    'more': 'Más',
    'prayers': 'Oraciones',
    'preferences': 'Preferencias',
    'language': 'Idioma',
    'languageChanged': '¡Idioma cambiado con éxito!',
    'changesApplied': 'Los cambios se aplicarán inmediatamente.',
    'profile': 'Perfil',
    'myProfile': 'Mi Perfil',
    'oldTestament': 'Antiguo Testamento',
    'newTestament': 'Nuevo Testamento',
    'accessOldTestament': 'Accede a los libros del Antiguo Testamento',
    'accessNewTestament': 'Accede a los libros del Nuevo Testamento',
    'back': 'Volver',
    'selectBibleVersion': 'Seleccione la versión de la Biblia',
    'bibleVersion': 'Versión de la Biblia',
    'bibleVersionChanged': '¡Versión de la Biblia cambiada con éxito!',
  },
  'en': {
    'appName': 'Digital Bible',
    'searchBible': 'Search the Bible',
    'readAndStudy': 'Read and study the Bible',
    'findPeace': 'Find peace in prayer',
    'accessFavorites': 'Access your favorite verses',
    'dailyVerse': 'Daily Verse',
    'continueReading': 'Continue Reading',
    'continueReadingDescription': 'Continue your last reading from where you left off.',
    'favorites': 'Favorites',
    'bible': 'Bible',
    'settings': 'Settings',
    'home': 'Home',
    'alerts': 'Alerts',
    'more': 'More',
    'prayers': 'Prayers',
    'preferences': 'Preferences',
    'language': 'Language',
    'languageChanged': 'Language changed successfully!',
    'changesApplied': 'Changes will be applied immediately.',
    'profile': 'Profile',
    'myProfile': 'My Profile',
    'oldTestament': 'Old Testament',
    'newTestament': 'New Testament',
    'accessOldTestament': 'Access Old Testament books',
    'accessNewTestament': 'Access New Testament books',
    'back': 'Back',
    'selectBibleVersion': 'Select Bible Version',
    'bibleVersion': 'Bible Version',
    'bibleVersionChanged': 'Bible version changed successfully!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('pt-BR');
  const { toast } = useToast();

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    toast({
      title: translations[lang]['languageChanged'],
      description: translations[lang]['changesApplied'],
    });
  };

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['pt-BR']] || key;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      currentLanguage: language,
      setLanguage, 
      t 
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
