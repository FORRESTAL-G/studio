"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { translations, defaultLang, type LanguageKey, type TranslationKeys } from "@/lib/i18n";

interface I18nContextType {
  language: LanguageKey;
  setLanguage: (language: LanguageKey) => void;
  t: (key: TranslationKeys, replacements?: Record<string, string>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<LanguageKey>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem("language") as LanguageKey) || defaultLang;
    }
    return defaultLang;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("language", language);
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: TranslationKeys, replacements?: Record<string, string>): string => {
    let translation = translations[language][key] || translations[defaultLang][key] || key;
    if (replacements) {
      Object.keys(replacements).forEach(rKey => {
        translation = translation.replace(`{{${rKey}}}`, replacements[rKey]);
      });
    }
    return translation;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within an I18nProvider");
  }
  return context;
};
