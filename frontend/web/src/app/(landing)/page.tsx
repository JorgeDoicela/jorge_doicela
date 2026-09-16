import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { SkipToContent, BentoCard } from './shared';
import { LandingVisualEffects } from './widgets/cosmic-canvas';
import { AppleHeroIntro, AppleHighlightsCarousel } from './widgets/highlights-carousel';
import { AppleDetailExplorer } from './widgets/highlights-explorer';
import { LandingHeader } from './widgets/landing-header';
import { LandingFooter } from './widgets/landing-footer';

export default async function LandingPage() {
    const tLanding = await getTranslations('Landing');

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-x-hidden">
            <SkipToContent />

            {/* Efectos Visuales Cinematográficos Aislados en Cliente */}
            <LandingVisualEffects />

            {/* Cabecera Unificada con Logo, Reloj Quito, Selector de Idioma y Tema */}
            <LandingHeader />

            <main id="main-content" className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-28 sm:gap-36 md:gap-44 justify-center outline-none focus:outline-none pt-4 sm:pt-8 pb-12" tabIndex={-1}>

                <AppleHeroIntro />

                <AppleHighlightsCarousel />

                <AppleDetailExplorer />

                <section className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-8 max-w-[1280px] grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
                    <BentoCard className="p-8 md:p-12 flex flex-col justify-between">
                        <div className="flex flex-col gap-2 mb-6">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground">
                                {tLanding('contactTitle')}
                            </h3>
                            <p className="text-text-muted text-sm sm:text-base font-normal leading-relaxed tracking-[-0.011em]">
                                {tLanding('contactDescription')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <a
                                href="https://www.linkedin.com/in/jorgedoicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-foreground/5 text-xs sm:text-sm font-medium tracking-tight text-text-muted hover:text-foreground transition-all cursor-pointer border border-transparent hover:border-card-border"
                            >
                                <span>linkedin.com/in/jorgedoicela</span>
                                <span className="text-[11px] text-text-subtitle font-medium">LinkedIn</span>
                            </a>

                            <a
                                href="https://github.com/JorgeDoicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-foreground/5 text-xs sm:text-sm font-medium tracking-tight text-text-muted hover:text-foreground transition-all cursor-pointer border border-transparent hover:border-card-border"
                            >
                                <span>github.com/JorgeDoicela</span>
                                <span className="text-[11px] text-text-subtitle font-medium">GitHub</span>
                            </a>

                            <Link
                                href="/links"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-foreground/5 text-xs sm:text-sm font-medium tracking-tight text-text-muted hover:text-foreground transition-all cursor-pointer border border-transparent hover:border-card-border"
                            >
                                <span>{tLanding('officialLinks')}</span>
                                <span className="text-[11px] text-text-subtitle font-medium">Links</span>
                            </Link>

                            <Link
                                href="/consulta"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-foreground/5 text-xs sm:text-sm font-medium tracking-tight text-text-muted hover:text-foreground transition-all cursor-pointer border border-transparent hover:border-card-border"
                            >
                                <span>{tLanding('consultationRequest')}</span>
                                <span className="text-[11px] text-text-subtitle font-medium">{tLanding('consultationBadge')}</span>
                            </Link>
                        </div>
                    </BentoCard>

                    {/* Filosofía & Enfoque */}
                    <BentoCard className="p-8 md:p-12 flex flex-col justify-between">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground">
                                {tLanding('philosophyTitle')}
                            </h3>
                            <blockquote className="text-sm md:text-base italic text-text-muted leading-relaxed font-light mt-2 border-l-2 border-card-border pl-4">
                                {tLanding('philosophyQuote')}
                            </blockquote>
                        </div>

                        <div className="pt-6 border-t border-card-border flex items-center justify-between text-xs text-text-subtitle">
                            <span>{tLanding('philosophySub')}</span>
                            <span className="font-semibold text-foreground">{tLanding('philosophyRef')}</span>
                        </div>
                    </BentoCard>
                </section>

            </main>

            {/* Footer unificado con enlaces de subsitios */}
            <LandingFooter />

        </div>
    );
}
