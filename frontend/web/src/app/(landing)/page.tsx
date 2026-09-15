import Image from 'next/image';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import SkipToContent from './components/SkipToContent';
import LandingVisualEffects from './components/LandingVisualEffects';
import { AppleHeroIntro } from './components/AppleHeroShowcase';
import { AppleHighlightsCarousel } from './components/AppleHighlightsCarousel';
import { AppleDetailExplorer } from './components/AppleDetailExplorer';
import { ThemeToggle } from './components/ThemeToggle';
import QuitoClockBadge from './components/QuitoClockBadge';
import LanguageToggleButton from './components/LanguageToggleButton';
import LandingFooterLinks from './components/LandingFooterLinks';

export default async function LandingPage() {
    const tLanding = await getTranslations('Landing');
    const tCommon = await getTranslations('Common');

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-x-hidden">
            <SkipToContent />

            {/* Efectos Visuales Cinematográficos Aislados en Cliente */}
            <LandingVisualEffects />

            <header
                className="animate-fade-in-up fixed top-5 left-5 right-5 sm:top-6 sm:left-8 sm:right-8 md:top-7 md:left-10 md:right-10 z-50 flex items-center justify-between pointer-events-none"
                style={{ animationDelay: '0ms' }}
            >
                {/* Logo Adaptativo de Marca (Superior Izquierda) */}
                <a
                    href="#"
                    className="pointer-events-auto flex items-center gap-2 outline-none focus:outline-none hover:opacity-80 active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label="Jorge Doicela - Inicio"
                >
                    {/* Logo Blanco (Modo Oscuro) */}
                    <Image
                        src="/landing/logo/logo_blanco.png"
                        alt="Jorge Doicela"
                        width={28}
                        height={28}
                        className="h-5 sm:h-6 w-auto object-contain hidden dark:block"
                        priority
                    />
                    {/* Logo Negro (Modo Claro) */}
                    <Image
                        src="/landing/logo/logo_negro.png"
                        alt="Jorge Doicela"
                        width={28}
                        height={28}
                        className="h-5 sm:h-6 w-auto object-contain block dark:hidden"
                        priority
                    />
                </a>

                {/* Controles Utilitarios (Superior Derecha) */}
                <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
                    <QuitoClockBadge />

                    <div className="hidden sm:block w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />

                    <LanguageToggleButton />

                    <ThemeToggle />
                </div>
            </header>

            <main id="main-content" className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-28 sm:gap-36 md:gap-44 justify-center outline-none focus:outline-none pt-4 sm:pt-8 pb-12" tabIndex={-1}>

                <AppleHeroIntro />

                <AppleHighlightsCarousel />

                <AppleDetailExplorer />

                <section className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-8 max-w-[1280px] grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
                    <div className="rounded-[2.2rem] md:rounded-[2.8rem] bg-card border border-card-border p-8 md:p-12 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 hover:border-card-hover-border">
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
                    </div>

                    {/* Filosofía & Enfoque */}
                    <div className="rounded-[2.2rem] md:rounded-[2.8rem] bg-card border border-card-border p-8 md:p-12 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 hover:border-card-hover-border">
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
                    </div>
                </section>

            </main>

            {/* Footer minimalista */}
            <footer
                className="animate-fade-in-up w-full max-w-5xl mt-16 border-t border-card-border/30 pt-8 pb-12 px-2 md:px-0 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtitle font-normal tracking-tight"
                style={{ animationDelay: '800ms' }}
            >
                <span>{tCommon('footer', { year: new Date().getFullYear().toString() })}</span>
                <LandingFooterLinks />
            </footer>

        </div>
    );
}
