'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ParallaxBackground from './components/ParallaxBackground';
import InteractiveParticles from './components/InteractiveParticles';
import CinematicSpiralGalaxy from './components/CinematicSpiralGalaxy';
import SkipToContent from './components/SkipToContent';
import { AppleHeroIntro } from './components/AppleHeroShowcase';
import { AppleHighlightsCarousel } from './components/AppleHighlightsCarousel';
import { AppleDetailExplorer } from './components/AppleDetailExplorer';
import { useLanguage } from './context/LanguageContext';
import { Sun, Moon, ArrowUpRight, Sparkles } from 'lucide-react';

export default function LandingPage() {
    const { language, toggleLanguage, t } = useLanguage();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState('');
    const [links, setLinks] = useState({
        portfolio: 'https://portfolio.jorgedoicela.com',
        bible: 'https://bible.jorgedoicela.com',
        software: 'https://software.jorgedoicela.com',
    });

    useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem('landing-theme') as 'dark' | 'light' | null;
        const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
        setTheme(initialTheme);
        const isLight = initialTheme === 'light';
        document.documentElement.classList.toggle('light', isLight);
        if (isLight) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }

        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname;
            const port = window.location.port ? `:${window.location.port}` : '';
            const protocol = window.location.protocol;

            if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
                setLinks({
                    portfolio: `${protocol}//portfolio.localhost${port}`,
                    bible: `${protocol}//bible.localhost${port}`,
                    software: `${protocol}//software.localhost${port}`,
                });
            }
        }
    }, []);

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

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('landing-theme', nextTheme);
        const isLight = nextTheme === 'light';
        document.documentElement.classList.toggle('light', isLight);
        if (isLight) {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            document.documentElement.removeAttribute('data-theme');
        }
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center" aria-label="Cargando página">
                <div className="w-6 h-6 border border-zinc-700 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-between p-4 sm:p-8 md:p-12 overflow-x-hidden">
            <SkipToContent />

            <ParallaxBackground />
            <InteractiveParticles />
            <CinematicSpiralGalaxy />

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
                    <Image
                        src={theme === 'dark' ? '/landing/logo/logo_blanco.png' : '/landing/logo/logo_negro.png'}
                        alt="Jorge Doicela"
                        width={28}
                        height={28}
                        className="h-5 sm:h-6 w-auto object-contain"
                        priority
                    />
                </a>

                {/* Controles Utilitarios (Superior Derecha) */}
                <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">
                    <div className="hidden sm:flex flex-col items-end text-right font-mono" aria-label={`Hora local en Quito Ecuador: ${time || '--:--:--'}`}>
                        <span className="text-xs text-text-muted font-normal tracking-wider tabular-nums">{time || '--:--:--'}</span>
                        <span className="text-[8px] text-text-subtitle/70 uppercase tracking-widest">{t.location}</span>
                    </div>

                    <div className="hidden sm:block w-px h-3.5 bg-card-border/60 mx-0.5" aria-hidden="true" />

                    <button
                        onClick={toggleLanguage}
                        className="px-2 py-1 rounded-md text-text-muted hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-colors duration-200 cursor-pointer text-xs font-medium tracking-tight outline-none focus:outline-none"
                        aria-label={t.toggleLang}
                    >
                        <span>{language.toUpperCase()}</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="p-1.5 rounded-md text-text-muted hover:text-foreground hover:bg-foreground/5 active:scale-95 transition-colors duration-200 cursor-pointer flex items-center justify-center outline-none focus:outline-none"
                        aria-label={t.toggleTheme}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-3.5 h-3.5 opacity-70 hover:opacity-100 hover:text-amber-400 transition-all duration-200" aria-hidden="true" />
                        ) : (
                            <Moon className="w-3.5 h-3.5 opacity-70 hover:opacity-100 hover:text-foreground transition-all duration-200" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </header>

            <main id="main-content" className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-28 sm:gap-36 md:gap-44 justify-center outline-none focus:outline-none pt-4 sm:pt-8 pb-12" tabIndex={-1}>

                <AppleHeroIntro />

                <AppleHighlightsCarousel links={links} />

                <AppleDetailExplorer />

                <section className="w-screen relative left-1/2 -translate-x-1/2 px-4 sm:px-8 max-w-[1280px] grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
                    <div className="rounded-[2.2rem] md:rounded-[2.8rem] bg-card border border-card-border p-8 md:p-12 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 hover:border-card-hover-border">
                        <div className="flex flex-col gap-2 mb-6">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground">
                                {t.cardContactTitle}
                            </h3>
                            <p className="text-text-muted text-sm sm:text-base font-normal leading-relaxed tracking-[-0.011em]">
                                {t.cardContactDescription}
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
                                <span>{language === 'es' ? 'Enlaces Oficiales & Proyectos' : 'Official Links & Projects'}</span>
                                <span className="text-[11px] text-text-subtitle font-medium">Links</span>
                            </Link>

                            <Link
                                href="/consulta"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl hover:bg-foreground/5 text-xs sm:text-sm font-medium tracking-tight text-text-muted hover:text-foreground transition-all cursor-pointer border border-transparent hover:border-card-border"
                            >
                                <span>{language === 'es' ? 'Solicitar Consulta & Presupuesto' : 'Request Consultation & Quote'}</span>
                                <span className="text-[11px] text-text-subtitle font-medium">{language === 'es' ? 'Formulario' : 'Form'}</span>
                            </Link>
                        </div>
                    </div>

                    {/* Filosofía & Enfoque */}
                    <div className="rounded-[2.2rem] md:rounded-[2.8rem] bg-card border border-card-border p-8 md:p-12 flex flex-col justify-between backdrop-blur-2xl transition-all duration-300 hover:border-card-hover-border">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground">
                                {language === 'es' ? 'Ingeniería con Propósito' : 'Engineering with Purpose'}
                            </h3>
                            <blockquote className="text-sm md:text-base italic text-text-muted leading-relaxed font-light mt-2 border-l-2 border-card-border pl-4">
                                {t.cardApproachQuote}
                            </blockquote>
                        </div>

                        <div className="pt-6 border-t border-card-border flex items-center justify-between text-xs text-text-subtitle">
                            <span>{language === 'es' ? 'Gloria a Dios' : 'Glory to God'}</span>
                            <span className="font-semibold text-foreground">Colosenses 3:23</span>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer minimalista */}
            <footer
                className="animate-fade-in-up w-full max-w-5xl mt-16 border-t border-card-border/30 pt-8 pb-12 px-2 md:px-0 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-subtitle font-normal tracking-tight"
                style={{ animationDelay: '800ms' }}
            >
                <span>{t.footer.replace('{year}', new Date().getFullYear().toString())}</span>
                <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-text-muted">
                    <a href="https://portfolio.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Portafolio</a>
                    <span>•</span>
                    <a href="https://software.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Software</a>
                    <span>•</span>
                    <a href="https://bible.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Biblia</a>
                    <span>•</span>
                    <Link href="/links" className="hover:text-foreground transition-colors">Links</Link>
                    <span>•</span>
                    <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors font-mono">llms.txt</a>
                </div>
            </footer>

        </div>
    );
}
