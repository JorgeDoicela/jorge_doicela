'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLanguage } from '../../providers/LanguageContext';

export function QuitoClockBadge() {
    const tCommon = useTranslations('Common');
    const { language } = useLanguage();
    const [time, setTime] = useState<string>('');

    useEffect(() => {
        const updateQuitoTime = () => {
            const now = new Date();
            const formatted = new Intl.DateTimeFormat(language === 'es' ? 'es-EC' : 'en-US', {
                timeZone: 'America/Guayaquil',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            }).format(now);
            setTime(formatted);
        };

        updateQuitoTime();
        const timer = setInterval(updateQuitoTime, 1000);
        return () => clearInterval(timer);
    }, [language]);

    return (
        <div
            className="hidden sm:flex flex-col items-end text-right font-mono"
            aria-label={`Hora local en Quito Ecuador: ${time || '--:--:--'}`}
        >
            <span
                className="text-xs text-text-muted font-normal tracking-wider tabular-nums"
                suppressHydrationWarning
            >
                {time || '--:--:--'}
            </span>
            <span className="text-[8px] text-text-subtitle/70 uppercase tracking-widest">
                {tCommon('location')}
            </span>
        </div>
    );
}

export default QuitoClockBadge;
