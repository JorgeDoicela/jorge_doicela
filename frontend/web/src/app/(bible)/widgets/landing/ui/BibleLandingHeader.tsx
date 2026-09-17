'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../../../features/theme-toggle';
import { LanguageToggle } from '../../../features/language-toggle';
import { BibleLogo, BackToPortalButton } from '../../../shared/ui';

interface BibleLandingHeaderProps {
    studyUrl?: string;
}

export function BibleLandingHeader({ studyUrl = '/study' }: BibleLandingHeaderProps) {
    const tLanding = useTranslations('Landing');

    return (
        <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/90 backdrop-blur-md">
            <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 sm:gap-8">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <BackToPortalButton />
                        <div className="h-4 w-px bg-accents-2 hidden sm:block select-none" />
                        <BibleLogo size={20} />
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-xs text-accents-5 font-medium">
                        <a href="#herramientas" className="hover:text-foreground transition-colors">
                            {tLanding('studyTools')}
                        </a>
                        <a href="#proposito" className="hover:text-foreground transition-colors">
                            {tLanding('purposeTitle')}
                        </a>
                        <a href="#versiones" className="hover:text-foreground transition-colors">
                            {tLanding('corpusBadge')}
                        </a>
                        <a href="#manuscritos" className="hover:text-foreground transition-colors">
                            {tLanding('manuscriptsBadge')}
                        </a>
                        <a href="#movil" className="hover:text-foreground transition-colors">
                            {tLanding('mobileApp')}
                        </a>
                    </nav>
                </div>

                <div className="flex items-center gap-2.5 sm:gap-3">
                    <LanguageToggle />
                    <ThemeToggle />
                    <Link
                        href={studyUrl}
                        className="px-4 sm:px-5 py-2 text-xs sm:text-[13px] font-semibold rounded-full bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-md active:scale-95"
                    >
                        <span>{tLanding('openStudy')}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                </div>
            </div>
        </header>
    );
}
