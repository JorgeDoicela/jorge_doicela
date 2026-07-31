'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, translations, Translations } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('es');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const savedLang = localStorage.getItem('landing-lang') as Language | null;
        if (savedLang === 'es' || savedLang === 'en') {
            setLanguageState(savedLang);
            document.documentElement.lang = savedLang;
        } else if (typeof navigator !== 'undefined') {
            const browserLang = navigator.language.toLowerCase().startsWith('en') ? 'en' : 'es';
            setLanguageState(browserLang);
            document.documentElement.lang = browserLang;
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('landing-lang', lang);
        document.documentElement.lang = lang;
    };

    const toggleLanguage = () => {
        const nextLang: Language = language === 'es' ? 'en' : 'es';
        setLanguage(nextLang);
    };

    const t = translations[language];

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage(): LanguageContextType {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage debe ser usado dentro de un LanguageProvider');
    }
    return context;
}
