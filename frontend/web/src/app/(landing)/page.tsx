'use client';

import { useEffect, useState } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import InteractiveParticles from './components/InteractiveParticles';
import TypewriterRole from './components/TypewriterRole';
import ReactiveCursorGradient from './components/ReactiveCursorGradient';
import SkipToContent from './components/SkipToContent';
import { AppleHeroShowcase } from './components/AppleHeroShowcase';
import { AppleHighlightsCarousel } from './components/AppleHighlightsCarousel';
import { AppleDetailExplorer } from './components/AppleDetailExplorer';
import { useLanguage } from './context/LanguageContext';
import {
    Sun,
    Moon,
    Mail,
    ArrowUpRight,
    Globe,
    Compass,
} from 'lucide-react';

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

    // Evitar hydration mismatch e inicializar enlaces y tema
    useEffect(() => {
        setMounted(true);

        // Obtener preferencia de tema
        const savedTheme = localStorage.getItem('landing-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('light', savedTheme === 'light');
        } else {
            document.documentElement.classList.remove('light');
        }

        // Configurar enlaces locales de desarrollo si aplica
        const host = window.location.host;
        if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('26.')) {
            const port = window.location.port ? `:${window.location.port}` : '';
            setLinks({
                portfolio: `http://portfolio.localhost${port}`,
                bible: `http://bible.localhost${port}`,
                software: `http://software.localhost${port}`,
            });
        }
    }, []);

    // Actualizar reloj de Quito (UTC-5)
    useEffect(() => {
        if (!mounted) return;

        const updateTime = () => {
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'America/Guayaquil',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const formatter = new Intl.DateTimeFormat([], options);
            setTime(formatter.format(new Date()));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, [mounted, language]);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('landing-theme', nextTheme);
        document.documentElement.classList.toggle('light', nextTheme === 'light');
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center" aria-label="Cargando página">
                <div className="w-6 h-6 border border-zinc-700 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col justify-between items-center py-12 md:py-20 px-6 md:px-12 selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-zinc-100 transition-colors duration-300">

            {/* Atajo Accesible Saltar al Contenido para Navegación por Teclado */}
            <SkipToContent />

            {/* Fondo Parallax Decorativo Tridimensional, Gradiente Reactivo al Cursor y Partículas Interactivas */}
            <ParallaxBackground />
            <ReactiveCursorGradient />
            <InteractiveParticles />

            {/* Header Superior Apple Style */}
            <header
                className="animate-fade-in-up w-full max-w-5xl flex justify-between items-center mb-8 pb-6 px-2 md:px-0 z-20"
                style={{ animationDelay: '0ms' }}
            >
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                        Jorge Doicela
                    </h2>
                    <TypewriterRole />
                </div>

                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Widget de Hora Local Minimalista */}
                    <div className="hidden sm:flex flex-col items-end text-right font-mono" aria-label={`Hora local en Quito Ecuador: ${time || '--:--:--'}`}>
                        <span className="text-xs text-foreground tracking-widest">{time || '--:--:--'}</span>
                        <span className="text-[8px] text-text-subtitle uppercase tracking-widest mt-0.5">{t.location}</span>
                    </div>

                    {/* Selector de Idioma ES / EN */}
                    <button
                        onClick={toggleLanguage}
                        className="px-3 py-2 rounded-full border border-card-border bg-card text-foreground hover:bg-card-border/70 hover:border-card-hover-border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-300 shadow-sm cursor-pointer flex items-center gap-1.5 text-xs font-mono font-medium"
                        aria-label={t.toggleLang}
                        title={t.toggleLang}
                    >
                        <Globe className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" aria-hidden="true" />
                        <span>{language.toUpperCase()}</span>
                    </button>

                    {/* Botón de Alternar Tema */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full border border-card-border bg-card text-foreground hover:bg-card-border/70 hover:border-card-hover-border active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-300 shadow-sm cursor-pointer"
                        aria-label={t.toggleTheme}
                        title={t.toggleTheme}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-4.5 h-4.5 text-zinc-400 hover:text-amber-400 transition-colors duration-300" aria-hidden="true" />
                        ) : (
                            <Moon className="w-4.5 h-4.5 text-zinc-500 hover:text-indigo-600 transition-colors duration-300" aria-hidden="true" />
                        )}
                    </button>
                </div>
            </header>

            {/* Contenido Principal en Estructura Apple Mac Showcase */}
            <main id="main-content" className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-12 justify-center" tabIndex={-1}>

                {/* 1. Hero Principal con Escaparate MacBook */}
                <AppleHeroShowcase links={links} />

                {/* 2. Sección: "Mira lo más destacado" (Carrusel Apple Style) */}
                <AppleHighlightsCarousel links={links} />

                {/* 3. Sección: "Míralo en detalle" (Selector Vertical Interactivo de Píldoras) */}
                <AppleDetailExplorer />

                {/* 4. Sección de Conexión & Canales Directos */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full pt-4">
                    {/* Canales de Contacto Directo */}
                    <div className="rounded-[2.5rem] bg-card border border-card-border p-8 flex flex-col justify-between shadow-lg backdrop-blur-xl">
                        <div className="flex flex-col gap-2 mb-6">
                            <div className="flex items-center gap-2 text-accent-light font-mono text-xs tracking-widest uppercase">
                                <Mail className="w-4 h-4" />
                                <span>{t.cardContactTag}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {t.cardContactTitle}
                            </h3>
                            <p className="text-text-muted text-xs md:text-sm font-light leading-relaxed">
                                {t.cardContactDescription}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <a
                                href="mailto:jorge.doicela.m@gmail.com"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl border border-card-border bg-inner-card hover:bg-card-border/40 text-xs font-mono text-text-muted hover:text-foreground transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-400" />
                                    <span>jorge.doicela.m@gmail.com</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </a>

                            <a
                                href="https://github.com/JorgeDoicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl border border-card-border bg-inner-card hover:bg-card-border/40 text-xs font-mono text-text-muted hover:text-foreground transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-zinc-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                        <path d="M9 18c-4.51 2-5-2-7-2" />
                                    </svg>
                                    <span>github.com/JorgeDoicela</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </a>

                            <a
                                href="https://www.tiktok.com/@jorge.doicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-2xl border border-card-border bg-inner-card hover:bg-card-border/40 text-xs font-mono text-text-muted hover:text-foreground transition-all"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                    <span>tiktok.com/@jorge.doicela</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </a>
                        </div>
                    </div>

                    {/* Filosofía & Enfoque */}
                    <div className="rounded-[2.5rem] bg-card border border-card-border p-8 flex flex-col justify-between shadow-lg backdrop-blur-xl">
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2 text-accent-light font-mono text-xs tracking-widest uppercase">
                                <Compass className="w-4 h-4" />
                                <span>{t.cardApproachTag}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">
                                {language === 'es' ? 'Ingeniería con Propósito' : 'Engineering with Purpose'}
                            </h3>
                            <blockquote className="text-sm md:text-base font-serif italic text-text-muted leading-relaxed font-light mt-2 border-l-2 border-indigo-400/50 pl-4">
                                {t.cardApproachQuote}
                            </blockquote>
                        </div>

                        <div className="pt-6 border-t border-card-border/40 flex items-center justify-between text-xs font-mono text-text-subtitle">
                            <span>{language === 'es' ? 'Gloria a Dios' : 'Glory to God'}</span>
                            <span className="text-accent-light">Colosenses 3:23</span>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer minimalista */}
            <footer
                className="animate-fade-in-up w-full max-w-5xl mt-16 border-t border-card-border/40 pt-8 px-2 md:px-0 flex justify-center text-xs text-text-subtitle font-mono uppercase tracking-wider"
                style={{ animationDelay: '800ms' }}
            >
                <span>{t.footer.replace('{year}', new Date().getFullYear().toString())}</span>
            </footer>

        </div>
    );
}
