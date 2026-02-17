import React, { createContext, useContext, useMemo, useState } from 'react';
import { translations } from './translations';

const LanguageContext = createContext(null);

const supportedLanguages = ['en', 'sn', 'nd', 'es', 'fr'];

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const stored = localStorage.getItem('language');
    return supportedLanguages.includes(stored) ? stored : 'en';
  });

  const changeLanguage = (nextLanguage) => {
    if (!supportedLanguages.includes(nextLanguage)) {
      return;
    }
    setLanguage(nextLanguage);
    localStorage.setItem('language', nextLanguage);
  };

  const value = useMemo(() => ({
    language,
    setLanguage: changeLanguage,
    t: translations[language] ?? translations.en,
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used inside LanguageProvider');
  }

  return context;
}
