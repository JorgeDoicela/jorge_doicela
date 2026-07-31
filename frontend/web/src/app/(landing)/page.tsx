'use client';

import { useEffect, useState } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import InteractiveParticles from './components/InteractiveParticles';
import TypewriterRole from './components/TypewriterRole';
import ReactiveCursorGradient from './components/ReactiveCursorGradient';
import SkipToContent from './components/SkipToContent';
import { useLanguage } from './context/LanguageContext';
import {
    Sun,
    Moon,
    BookOpen,
    Code,
    Compass,
    Mail,
    ArrowUpRight,
    Globe,
    Layers,
    Cpu,
    Monitor
} from 'lucide-react';

export default function LandingPage() {
    const { language, toggleLanguage, t } = useLanguage();
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState('');
    const [greeting, setGreeting] = useState('');
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

    // Actualizar reloj y saludo dinámico cuando cambia el idioma o el tiempo
    useEffect(() => {
        if (!mounted) return;

        const updateGreeting = () => {
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'America/Guayaquil',
                hour: 'numeric',
                hour12: false
            };
            const formatter = new Intl.DateTimeFormat([], options);
            const hour = parseInt(formatter.format(new Date()), 10);

            let salute = t.greetingPrefix;
            if (hour >= 6 && hour < 12) {
                salute = t.greetingMorning;
            } else if (hour >= 12 && hour < 19) {
                salute = t.greetingAfternoon;
            } else {
                salute = t.greetingEvening;
            }
            setGreeting(salute);
        };

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

        updateGreeting();
        updateTime();
        const interval = setInterval(() => {
            updateTime();
            updateGreeting();
        }, 1000);
        return () => clearInterval(interval);
    }, [mounted, t, language]);

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
        <div className="relative min-h-screen flex flex-col justify-between items-center py-16 md:py-24 px-6 md:px-12 selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-zinc-100 transition-colors duration-300">

            {/* Atajo Accesible Saltar al Contenido para Navegación por Teclado */}
            <SkipToContent />

            {/* Fondo Parallax Decorativo Tridimensional, Gradiente Reactivo al Cursor y Partículas Interactivas */}
            <ParallaxBackground />
            <ReactiveCursorGradient />
            <InteractiveParticles />

            {/* Header Superior - Perfectamente Alineado con el Ancho del Grid */}
            <header 
                className="animate-fade-in-up w-full max-w-5xl flex justify-between items-center mb-8 border-b border-card-border/40 pb-6 px-2 md:px-0"
                style={{ animationDelay: '0ms' }}
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-text-subtitle bg-clip-text">
                        Jorge Doicela
                    </h1>
                    <TypewriterRole />
                </div>

                <div className="flex items-center gap-4 sm:gap-6">
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

                    {/* Botón de Alternar Tema con Efectos Hover Refinados */}
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

            {/* Contenido Principal */}
            <main id="main-content" className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-6 justify-center" tabIndex={-1}>

                {/* Tarjeta de Bienvenida & Perfil (Estática de Cristal al Inicio) */}
                <section 
                    className="animate-fade-in-up static-glass-card p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start md:items-center shadow-sm min-h-[160px] w-full"
                    style={{ animationDelay: '100ms' }}
                    aria-label="Perfil y presentación"
                >
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 tracking-widest uppercase font-medium">
                            {greeting}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            {t.welcomeTitle}
                        </h2>
                    </div>
                    <div className="flex-[2] max-w-2xl">
                        <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                            {t.welcomeDescriptionParagraph1} <strong className="font-semibold text-foreground">{t.welcomeDescriptionFaith}</strong>{t.welcomeDescriptionParagraph2}
                        </p>
                    </div>
                </section>

                {/* Grid de Experiencias Digitales (Tarjetas de Cristal Esmerilado) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full" role="region" aria-label="Ecosistema de proyectos">

                    {/* Card 1: Biblia */}
                    <a
                        href={links.bible}
                        className="animate-fade-in-up interactive-glass-card group p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[250px] relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        style={{ animationDelay: '200ms' }}
                        aria-label={`${t.cardBibleTitle}: ${t.cardBibleTag}. ${t.cardBibleDescription}`}
                    >
                        <div className="flex flex-col justify-between flex-1 pr-0 sm:pr-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <BookOpen className="w-4 h-4" aria-hidden="true" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">{t.cardBibleTag}</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    {t.cardBibleTitle}
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                                    {t.cardBibleDescription}
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>{t.cardBibleAction}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden="true" />
                            </div>
                        </div>

                        {/* Bloque Visual de Cita */}
                        <div className="w-full sm:w-52 bg-inner-card border border-inner-card-border rounded-2xl p-6 flex flex-col justify-center items-center font-serif text-text-muted text-center shadow-inner relative transition-colors duration-350">
                            <span className="absolute top-2 left-4 text-3xl font-serif text-indigo-500/10 pointer-events-none" aria-hidden="true">“</span>
                            <p className="text-xs md:text-sm italic leading-relaxed text-foreground font-light font-serif">
                                {t.cardBibleQuote}
                            </p>
                            <span className="text-[9px] font-mono tracking-wider text-text-subtitle mt-3 block not-italic uppercase">{t.cardBibleVerseRef}</span>
                        </div>
                    </a>

                    {/* Card 2: Software */}
                    <a
                        href={links.software}
                        className="animate-fade-in-up interactive-glass-card group p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[250px] relative overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        style={{ animationDelay: '300ms' }}
                        aria-label={`${t.cardSoftwareTitle}: ${t.cardSoftwareTag}. ${t.cardSoftwareDescription}`}
                    >
                        <div className="flex flex-col justify-between flex-1 pr-0 sm:pr-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Code className="w-4 h-4" aria-hidden="true" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">{t.cardSoftwareTag}</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    {t.cardSoftwareTitle}
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                                    {t.cardSoftwareDescription}
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>{t.cardSoftwareAction}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden="true" />
                            </div>
                        </div>

                        {/* Listado de destacados */}
                        <div className="w-full sm:w-52 bg-inner-card border border-inner-card-border rounded-2xl p-6 flex flex-col justify-between shadow-inner transition-colors duration-350">
                            <span className="text-[9px] font-mono text-text-subtitle uppercase tracking-widest border-b border-card-border/40 pb-2 w-full text-center">{t.cardSoftwareHighlights}</span>
                            <div className="flex-grow flex flex-col justify-center gap-2.5 my-2 text-[10.5px] font-mono text-text-muted">
                                <div className="flex justify-between border-b border-card-border/20 pb-1.5">
                                    <span className="text-foreground font-medium">{t.cardSoftwareItem1}</span>
                                    <span className="text-text-subtitle text-[9px]">{t.cardSoftwareItem1Tag}</span>
                                </div>
                                <div className="flex justify-between border-b border-card-border/20 pb-1.5">
                                    <span className="text-foreground font-medium">{t.cardSoftwareItem2}</span>
                                    <span className="text-text-subtitle text-[9px]">{t.cardSoftwareItem2Tag}</span>
                                </div>
                                <div className="flex justify-between pb-0.5">
                                    <span className="text-foreground font-medium">{t.cardSoftwareItem3}</span>
                                    <span className="text-text-subtitle text-[9px]">{t.cardSoftwareItem3Tag}</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 3: Portafolio */}
                    <a
                        href={links.portfolio}
                        className="animate-fade-in-up interactive-glass-card group p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[200px] overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                        style={{ animationDelay: '400ms' }}
                        aria-label={`${t.cardPortfolioTitle}: ${t.cardPortfolioTag}. ${t.cardPortfolioDescription}`}
                    >
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Cpu className="w-4 h-4" aria-hidden="true" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">{t.cardPortfolioTag}</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    {t.cardPortfolioTitle}
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm font-light max-w-sm leading-relaxed">
                                    {t.cardPortfolioDescription}
                                </p>
                            </div>

                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>{t.cardPortfolioAction}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" aria-hidden="true" />
                            </div>
                        </div>

                        {/* Listado de secciones */}
                        <div className="w-full sm:w-52 flex flex-col justify-center gap-3 border-t sm:border-t-0 sm:border-l border-card-border/60 pt-4 sm:pt-0 sm:pl-6 font-mono text-xs text-text-muted">
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>{t.cardPortfolioItem1}</span>
                                <span className="text-[10px] text-text-subtitle font-bold" aria-hidden="true">→</span>
                            </div>
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>{t.cardPortfolioItem2}</span>
                                <span className="text-[10px] text-text-subtitle font-bold" aria-hidden="true">→</span>
                            </div>
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>{t.cardPortfolioItem3}</span>
                                <span className="text-[10px] text-text-subtitle font-bold" aria-hidden="true">→</span>
                            </div>
                        </div>
                    </a>

                    {/* Card 4: Contacto */}
                    <div 
                        className="animate-fade-in-up interactive-glass-card p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[200px]"
                        style={{ animationDelay: '500ms' }}
                        role="region"
                        aria-label={t.cardContactTitle}
                    >
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Mail className="w-4 h-4" aria-hidden="true" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">{t.cardContactTag}</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-foreground mb-3">{t.cardContactTitle}</h3>
                                <p className="text-text-muted text-xs md:text-sm font-light max-w-sm">
                                    {t.cardContactDescription}
                                </p>
                            </div>
                            <span className="text-[9px] text-text-subtitle font-mono tracking-wider uppercase mt-4 md:mt-0">{t.cardContactSub}</span>
                        </div>

                        {/* Botones de contacto */}
                        <div className="w-full sm:w-64 flex flex-col justify-center gap-2">
                            <a
                                href="mailto:jorge.doicela.m@gmail.com"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200"
                                aria-label="Enviar correo electrónico a jorge.doicela.m@gmail.com"
                            >
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-500/70" aria-hidden="true" />
                                    <span>jorge.doicela.m@gmail.com</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                            </a>
                            <a
                                href="https://github.com/JorgeDoicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200"
                                aria-label="Visitar el perfil público de GitHub de Jorge Doicela"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                        <path d="M9 18c-4.51 2-5-2-7-2" />
                                    </svg>
                                    <span>github.com/JorgeDoicela</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                            </a>
                            <a
                                href="https://www.tiktok.com/@jorge.doicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all duration-200"
                                aria-label="Visitar el perfil oficial de TikTok de Jorge Doicela"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-pink-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                    <span>tiktok.com/@jorge.doicela</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
                            </a>
                        </div>
                    </div>

                    {/* Card 5: Especialidades / Áreas de Práctica (Estática de Cristal) */}
                    <div 
                        className="animate-fade-in-up static-glass-card p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm min-h-[180px] md:col-span-2"
                        style={{ animationDelay: '600ms' }}
                        role="region"
                        aria-label={t.cardPracticeTitle}
                    >
                        <div className="flex flex-col justify-between h-full flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-text-subtitle">
                                    <Layers className="w-4 h-4" aria-hidden="true" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">{t.cardPracticeTag}</span>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">{t.cardPracticeTitle}</h3>
                                <p className="text-text-muted text-xs md:text-sm font-light mt-2 leading-relaxed">
                                    {t.cardPracticeDescription}
                                </p>
                            </div>
                        </div>

                        {/* Chips elegantes */}
                        <div className="w-full md:w-72 flex flex-col gap-2">
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-chip-bg border border-chip-border text-xs text-text-muted hover:text-indigo-400 hover:bg-chip-hover-bg hover:border-indigo-500/20 transition-all duration-300 shadow-sm cursor-default">
                                <Cpu className="w-4 h-4 text-indigo-500/80" aria-hidden="true" />
                                <span className="font-mono text-[10px] font-medium tracking-wide">{t.cardPracticeChip1}</span>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-chip-bg border border-chip-border text-xs text-text-muted hover:text-emerald-400 hover:bg-chip-hover-bg hover:border-emerald-500/20 transition-all duration-300 shadow-sm cursor-default">
                                <Monitor className="w-4 h-4 text-emerald-500/80" aria-hidden="true" />
                                <span className="font-mono text-[10px] font-medium tracking-wide">{t.cardPracticeChip2}</span>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-chip-bg border border-chip-border text-xs text-text-muted hover:text-violet-400 hover:bg-chip-hover-bg hover:border-violet-500/20 transition-all duration-300 shadow-sm cursor-default">
                                <Layers className="w-4 h-4 text-violet-500/80" aria-hidden="true" />
                                <span className="font-mono text-[10px] font-medium tracking-wide">{t.cardPracticeChip3}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Mi Enfoque (Estática de Cristal) */}
                    <div 
                        className="animate-fade-in-up static-glass-card p-8 rounded-[2rem] flex flex-col justify-between shadow-sm min-h-[180px] md:col-span-2"
                        style={{ animationDelay: '700ms' }}
                        role="region"
                        aria-label={t.cardApproachTag}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-text-subtitle mb-2">
                                <Compass className="w-4 h-4" aria-hidden="true" />
                                <span className="text-[10px] font-mono tracking-widest uppercase">{t.cardApproachTag}</span>
                            </div>
                            <p className="text-base md:text-lg font-serif italic text-text-muted leading-relaxed font-light text-center md:text-left">
                                {t.cardApproachQuote}
                            </p>
                        </div>
                    </div>

                </div>
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
