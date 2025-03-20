'use client';

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n/language-context";
import { availableLanguages } from "@/lib/i18n/translations";

export function LanguageSwitcher() {
  const { language, changeLanguage } = useLanguage();

  // Map des drapeaux par langue
  const languageFlags: Record<string, string> = {
    fr: "🇫🇷",
    en: "🇬🇧",
  };

  // Map des noms de langues pour le titre et l'attribut aria-label
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
    <button
      onClick={handleChangeLanguage}
      className="appearance-none bg-transparent border-none p-0 m-0 shadow-none outline-none w-10 h-10 flex items-center justify-center cursor-pointer transition-transform duration-300 hover:rotate-[15deg]"
      title={languageNames[language]}
      aria-label={`Changer la langue : ${languageNames[language]}`}
      style={{ backgroundColor: 'transparent' }}
    >
      <span className="text-2xl">{languageFlags[language]}</span>
    </button>
  );
}