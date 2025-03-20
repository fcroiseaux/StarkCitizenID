'use client';

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import { availableLanguages } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  // Map des noms de langues pour l'affichage
  const languageNames: Record<string, string> = {
    fr: "Français",
    en: "English",
  };

  const handleChangeLanguage = () => {
    // Basculer entre les langues
    const currentIndex = availableLanguages.indexOf(language);
    const nextIndex = (currentIndex + 1) % availableLanguages.length;
    changeLanguage(availableLanguages[nextIndex]);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleChangeLanguage}
      className="text-xs flex items-center gap-1"
    >
      <span className="font-semibold uppercase">{language}</span>
      <span className="mx-1">|</span> 
      <span>{languageNames[language]}</span>
    </Button>
  );
}