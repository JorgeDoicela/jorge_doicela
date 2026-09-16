'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useLanguage } from '../../../shared';

export function LanguageToggleButton() {
    const { language, toggleLanguage } = useLanguage();
    const tCommon = useTranslations('Common');

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className="px-2 py-1 rounded-md text-text-muted hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-colors duration-200 cursor-pointer text-xs font-medium tracking-tight outline-none focus:outline-none"
            aria-label={tCommon('toggleLang')}
        >
            <span>{language.toUpperCase()}</span>
        </button>
    );
}

export default LanguageToggleButton;
