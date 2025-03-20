'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Language, 
  availableLanguages, 
  frTranslations, 
  enTranslations,
  getTranslationKey
} from './translations';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'fr',
  changeLanguage: () => {},
  t: (key: string) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');

  // Charger la langue à partir du localStorage lors du montage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && availableLanguages.includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, []);

  // Fonction pour changer la langue
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
  };

  // Fonction de traduction
  const t = (key: string): string => {
    const translations = language === 'fr' ? frTranslations : enTranslations;
    const value = getTranslationKey(translations, key);
    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);