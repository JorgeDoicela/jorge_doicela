'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

interface BibleFinalCtaAndFooterProps {
    studyUrl?: string;
}

export function BibleFinalCtaAndFooter({ studyUrl = '/study' }: BibleFinalCtaAndFooterProps) {
    const tLanding = useTranslations('Landing');
    const [isLocal, setIsLocal] = React.useState(false);
    const [port, setPort] = React.useState('');

    React.useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            setIsLocal(hostname.includes('localhost') || hostname.includes('127.0.0.1'));
            setPort(window.location.port ? `:${window.location.port}` : '');
        }
    }, []);

    const getSubdomainUrl = (subdomain: string) => {
        return isLocal
            ? `http://${subdomain}.localhost${port || ':3001'}`
            : `https://${subdomain}.jorgedoicela.com`;
    };

    const getLandingUrl = () => {
        return isLocal
            ? `http://localhost${port || ':3001'}`
            : 'https://jorgedoicela.com';
    };

    return (
        <>
            {/* CTA Final */}
            <section className="py-28 sm:py-36 text-center space-y-6 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#202124] dark:text-zinc-100">
                        {tLanding('ctaTitle')}
                    </h2>
                    <p className="text-base sm:text-[18px] text-[#3c4043] dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                        {tLanding('ctaSubtitle')}
                    </p>
                    <div className="pt-4">
                        <Link
                            href={studyUrl}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-semibold text-base hover:opacity-90 transition-all shadow-sm cursor-pointer hover:shadow-md"
                        >
                            <span>{tLanding('ctaButton')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-accents-2 w-full py-8 bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
                    <div>{tLanding('footerCopyright', { year: new Date().getFullYear().toString() })}</div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a href={getLandingUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerHome')}</a>
                        <span className="text-accents-2">•</span>
                        <a href={getSubdomainUrl('portfolio')} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerPortfolio')}</a>
                        <span className="text-accents-2">•</span>
                        <a href={getSubdomainUrl('software')} target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerSoftware')}</a>
                        <span className="text-accents-2">•</span>
                        <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerLlms')}</a>
                    </div>
                </div>
            </footer>
        </>
    );
}
