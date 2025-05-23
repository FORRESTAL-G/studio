import en from "@/locales/en.json";
import it from "@/locales/it.json";

export const languages = {
  en: "English",
  it: "Italiano",
};

export const defaultLang = "en";

export const translations = {
  en,
  it,
};

export type LanguageKey = keyof typeof translations;
export type TranslationKeys = keyof typeof en; // Assuming all languages have the same keys
