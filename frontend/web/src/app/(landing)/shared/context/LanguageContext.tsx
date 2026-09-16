'use client';

import React, { createContext, useContext, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

export type Language = 'es' | 'en';

export interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    toggleLanguage: () => void;
    isPending: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const locale = (useLocale() || 'es') as Language;
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

    return (
        <LanguageContext.Provider value={{ language: locale, setLanguage, toggleLanguage, isPending }}>
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
