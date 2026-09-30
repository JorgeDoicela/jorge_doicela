'use client';

import { useTranslations } from 'next-intl';

export default function SkipToContent() {
    const t = useTranslations('Common');

    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:inline-flex focus:items-center focus:justify-center focus:px-5 focus:py-2.5 focus:rounded-full focus:bg-foreground focus:text-background focus:font-medium focus:text-xs focus:tracking-tight focus:shadow-2xl focus:border focus:border-card-border focus:outline-none focus:ring-2 focus:ring-foreground/20 active:scale-95 transition-all duration-200 cursor-pointer select-none"
        >
            {t('skipToContent')}
        </a>
    );
}
