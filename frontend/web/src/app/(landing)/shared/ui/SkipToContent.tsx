'use client';

import { useTranslations } from 'next-intl';

export default function SkipToContent() {
    const t = useTranslations('Common');

    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-indigo-600 focus:text-white focus:font-mono focus:text-xs focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
        >
            {t('skipToContent')}
        </a>
    );
}
