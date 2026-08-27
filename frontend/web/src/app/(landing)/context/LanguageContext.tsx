'use client';

import React, { createContext, useContext, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Language, translations, Translations } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    t: Translations;
    isPending: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const locale = useLocale() as Language;
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const setLanguage = (lang: Language) => {
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('landing-lang', lang);
        }
        document.documentElement.lang = lang;
        startTransition(() => {
            router.refresh();
        });
    };

    const toggleLanguage = () => {
        const nextLang: Language = locale === 'es' ? 'en' : 'es';
        setLanguage(nextLang);
    };

    const t = translations[locale] || translations.es;

    return (
        <LanguageContext.Provider value={{ language: locale, setLanguage, toggleLanguage, t, isPending }}>
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

