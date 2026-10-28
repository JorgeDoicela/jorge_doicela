'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export function AuthorSidebarCard() {
    const t = useTranslations('AuthorCard');
    const [portfolioUrl, setPortfolioUrl] = React.useState('https://portfolio.jorgedoicela.com');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            const isLocal = hostname.includes('localhost') || hostname.includes('127.0.0.1');
            const port = window.location.port ? `:${window.location.port}` : '';
            if (isLocal) {
                setPortfolioUrl(`http://portfolio.localhost${port || ':3001'}`);
            }
        }
    }, []);

    return (
        <div className="p-6 rounded-3xl glass-convex-panel border border-white/5 text-center space-y-4 shadow-xl">
            {/* Avatar circular con relieve concavo calibrado y estatico */}
            <div className="w-24 h-24 mx-auto rounded-full p-1 glass-concave-panel border border-white/10 shadow-inner flex items-center justify-center relative">
                <div className="w-full h-full rounded-full overflow-hidden relative flex items-center justify-center bg-black/40">
                    <Image
                        src="/doiceladev/logo/perfil.jpg"
                        alt="Jorge Doicela"
                        fill
                        sizes="96px"
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Nombre y Titulo */}
            <div className="space-y-1">
                <h4 className="text-base sm:text-lg font-bold text-[var(--header-title)] tracking-tight">
                    Jorge Doicela
                </h4>
                <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 font-medium">
                    {t('role')}
                </p>
            </div>

            {/* Biografia Tecnica */}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-light">
                {t('bio')}
            </p>

            {/* Enlaces y Redes Sociales */}
            <div className="pt-3 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center justify-center gap-2.5 text-zinc-500 dark:text-zinc-400">
                    {/* GitHub */}
                    <a
                        href="https://github.com/JorgeDoicela"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 p-1"
                        title={t('githubAria')}
                        aria-label={t('githubAria')}
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                        </svg>
                    </a>

                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/in/jorgedoicela/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 p-1"
                        title={t('linkedinAria')}
                        aria-label={t('linkedinAria')}
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                        </svg>
                    </a>

                    {/* YouTube */}
                    <a
                        href="https://www.youtube.com/@jorge.doicela"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 p-1"
                        title={t('youtubeAria')}
                        aria-label={t('youtubeAria')}
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </a>

                    {/* TikTok */}
                    <a
                        href="https://www.tiktok.com/@jorge.doicela"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 p-1"
                        title={t('tiktokAria')}
                        aria-label={t('tiktokAria')}
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.28 6.34 6.34 0 0 0 9.34 21.6c3.5 0 6.34-2.84 6.34-6.33V8.86c1.33.95 2.94 1.5 4.68 1.55v-3.48c-.26-.01-.52-.09-.77-.24z" />
                        </svg>
                    </a>

                    {/* Portafolio Terminal */}
                    <a
                        href={portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 p-1"
                        title={t('portfolioAria')}
                        aria-label={t('portfolioAria')}
                    >
                        <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M4 5h16a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V7a2 2 0 012-2z" />
                        </svg>
                    </a>

                    {/* Email */}
                    <a
                        href="mailto:jorge.doicela.m@gmail.com"
                        className="hover:text-zinc-950 dark:hover:text-white transition-colors duration-200 p-1"
                        title={t('emailTitle')}
                        aria-label={t('emailTitle')}
                    >
                        <svg className="w-4 h-4 fill-none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
