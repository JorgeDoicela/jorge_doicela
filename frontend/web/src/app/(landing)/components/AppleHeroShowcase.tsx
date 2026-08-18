'use client';

import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Code, Terminal, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import TypewriterRole from './TypewriterRole';

interface AppleHeroShowcaseProps {
    links: {
        portfolio: string;
        bible: string;
        software: string;
    };
}

export const AppleHeroShowcase: React.FC<AppleHeroShowcaseProps> = ({ links }) => {
    const { language } = useLanguage();
    const [activeScreen, setActiveScreen] = useState<'portfolio' | 'bible' | 'software'>('portfolio');

    const isEs = language === 'es';

    return (
        <>
            {/* 1. Vista Hero Principal de Pantalla Completa (Estilo Apple Intro) */}
            <section className="w-full min-h-[84vh] sm:min-h-[88vh] flex flex-col justify-center items-center text-center px-4 animate-fade-in-up relative">
                {/* Eyebrow / Efecto Typewriter Dinámico */}
                <div className="mb-4">
                    <TypewriterRole />
                </div>

                {/* Titular Gigante Impactante Estilo Apple SF Pro Display */}
                <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-foreground max-w-4xl leading-[1.04] mb-6">
                    Jorge Doicela.
                </h1>

                {/* Párrafo Descriptivo Estilo Apple (SF Pro Text) */}
                <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl font-normal leading-relaxed tracking-[-0.012em] mb-10">
                    {isEs
                        ? 'Desarrollo Full Stack, Ciberseguridad y Tecnologías Web construidas con excelencia técnica, fe cristiana y pasión por el detalle.'
                        : 'Full Stack Development, Cybersecurity and Web Technologies built with technical excellence, Christian faith and passion for detail.'}
                </p>

                {/* Botón Píldora Apple CTA */}
                <div className="flex flex-col items-center justify-center gap-6">
                    <a
                        href="#showcase"
                        className="px-8 py-3.5 rounded-full bg-foreground text-background font-medium text-sm sm:text-base tracking-tight hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                    >
                        {isEs ? 'Explorar lo más destacado' : 'Explore highlights'}
                    </a>

                    {/* Indicador sutil de scroll hacia abajo */}
                    <a
                        href="#showcase"
                        className="text-text-subtitle hover:text-foreground transition-colors p-2 rounded-full hover:bg-inner-card animate-bounce cursor-pointer"
                        aria-label={isEs ? 'Desplazarse hacia abajo' : 'Scroll down'}
                    >
                        <ChevronDown className="w-5 h-5 opacity-70" />
                    </a>
                </div>
            </section>

            {/* 2. Escaparate Interactivo de Portales (Visible al bajar / hacer scroll) */}
            <section id="showcase" className="w-full flex flex-col items-center pt-8 pb-16 scroll-mt-10">
                <div className="w-full max-w-4xl relative group">
                {/* Resplandor ambiental de fondo */}
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent-light/10 to-accent/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700 pointer-events-none" />

                {/* Chasis de Pantalla */}
                <div className="relative rounded-[2rem] md:rounded-[2.5rem] bg-card border border-card-border shadow-2xl p-3 md:p-4 backdrop-blur-xl overflow-hidden">
                    {/* Barra superior de pestañas interactivas estilo Apple macOS */}
                    <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 border-b border-card-border/40 mb-3 text-xs">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/70" />
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500/70" />
                            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-500/70" />
                        </div>

                        {/* Píldoras selectoras de pantalla interactiva con accesibilidad WAI-ARIA */}
                        <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium tracking-tight" role="tablist" aria-label={isEs ? 'Selector de proyectos' : 'Projects selector'}>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeScreen === 'portfolio'}
                                onClick={() => setActiveScreen('portfolio')}
                                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer ${activeScreen === 'portfolio'
                                    ? 'bg-foreground text-background font-semibold shadow-sm scale-[1.02]'
                                    : 'text-text-subtitle hover:text-foreground hover:bg-inner-card'
                                    }`}
                            >
                                {isEs ? 'Portafolio' : 'Portfolio'}
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeScreen === 'bible'}
                                onClick={() => setActiveScreen('bible')}
                                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer ${activeScreen === 'bible'
                                    ? 'bg-foreground text-background font-semibold shadow-sm scale-[1.02]'
                                    : 'text-text-subtitle hover:text-foreground hover:bg-inner-card'
                                    }`}
                            >
                                {isEs ? 'Biblia' : 'Bible'}
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={activeScreen === 'software'}
                                onClick={() => setActiveScreen('software')}
                                className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full transition-all cursor-pointer ${activeScreen === 'software'
                                    ? 'bg-foreground text-background font-semibold shadow-sm scale-[1.02]'
                                    : 'text-text-subtitle hover:text-foreground hover:bg-inner-card'
                                    }`}
                            >
                                Software Hub
                            </button>
                        </div>

                        <div className="text-[11px] font-mono text-text-subtitle hidden md:block">
                            jorgedoicela.com
                        </div>
                    </div>

                    {/* Contenido de la Pantalla cliqueable al centro hacia cada portal */}
                    <a
                        href={links[activeScreen]}
                        className="group/screen block w-full min-h-[260px] md:min-h-[320px] rounded-xl bg-background/80 hover:bg-background/95 border border-inner-card-border hover:border-card-hover-border p-6 md:p-8 flex flex-col justify-between text-left transition-all duration-300 cursor-pointer shadow-inner relative overflow-hidden"
                    >
                        {activeScreen === 'portfolio' && (
                            <div className="flex flex-col justify-between h-full gap-6 animate-fade-in-up">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent-light text-xs sm:text-sm font-semibold tracking-[-0.01em]">
                                        <Terminal className="w-4 h-4" />
                                        <span>PORTFOLIO & TERMINAL SSH</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.03em] text-foreground group-hover/screen:text-accent-light transition-colors">
                                        {isEs
                                            ? 'Consola interactiva en tiempo real y arquitectura de software'
                                            : 'Real-time interactive console and software architecture'}
                                    </h3>
                                    <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-xl font-normal leading-relaxed tracking-[-0.01em]">
                                        {isEs
                                            ? 'Diseño Dark Luxury, historial de comandos, autocompletado Tab y retransmisión de sesiones en vivo mediante WebSockets.'
                                            : 'Dark Luxury design, command history, Tab autocomplete, and live session mirroring via WebSockets.'}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-card-border/30">
                                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtitle">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                        <span>portfolio.jorgedoicela.com</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent-light group-hover/screen:underline">
                                        <span>{isEs ? 'Ingresar ahora' : 'Launch now'}</span>
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/screen:translate-x-0.5 group-hover/screen:-translate-y-0.5" />
                                    </span>
                                </div>
                            </div>
                        )}

                        {activeScreen === 'bible' && (
                            <div className="flex flex-col justify-between h-full gap-6 animate-fade-in-up">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent-light text-xs sm:text-sm font-semibold tracking-[-0.01em]">
                                        <BookOpen className="w-4 h-4" />
                                        <span>BIBLIA MODULAR & DEVOCIONALES</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.03em] text-foreground group-hover/screen:text-accent-light transition-colors">
                                        {isEs
                                            ? 'Un espacio puro y minimalista para el estudio de las Sagradas Escrituras'
                                            : 'A pure, minimalist space for studying the Holy Scriptures'}
                                    </h3>
                                    <p className="text-text-muted text-xs sm:text-sm md:text-base max-w-xl font-normal italic font-serif leading-relaxed">
                                        &ldquo;{isEs ? 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.' : 'Your word is a lamp to my feet and a light to my path.'}&rdquo;
                                        <span className="block not-italic font-mono text-xs text-text-subtitle mt-1">— Salmos 119:105</span>
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-card-border/30">
                                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtitle">
                                        <span className="w-2 h-2 rounded-full bg-indigo-400" />
                                        <span>bible.jorgedoicela.com</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent-light group-hover/screen:underline">
                                        <span>{isEs ? 'Abrir Biblia' : 'Open Bible'}</span>
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/screen:translate-x-0.5 group-hover/screen:-translate-y-0.5" />
                                    </span>
                                </div>
                            </div>
                        )}

                        {activeScreen === 'software' && (
                            <div className="flex flex-col justify-between h-full gap-6 animate-fade-in-up">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-accent-light text-xs sm:text-sm font-semibold tracking-[-0.01em]">
                                        <Code className="w-4 h-4" />
                                        <span>SOFTWARE & NOTICIAS TECH</span>
                                    </div>
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.03em] text-foreground group-hover/screen:text-accent-light transition-colors">
                                        {isEs
                                            ? 'Noticias de IA, herramientas de desarrollo y artículos de DevSecOps'
                                            : 'AI News, developer tools, and DevSecOps engineering articles'}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        <span className="px-3 py-1 rounded-full bg-inner-card border border-inner-card-border text-[11px] font-mono text-text-muted">
                                            01 / Modelos & IA
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-inner-card border border-inner-card-border text-[11px] font-mono text-text-muted">
                                            02 / DevSecOps
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-inner-card border border-inner-card-border text-[11px] font-mono text-text-muted">
                                            03 / Ciberseguridad
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-card-border/30">
                                    <div className="flex items-center gap-2 text-xs font-mono text-text-subtitle">
                                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                                        <span>software.jorgedoicela.com</span>
                                    </div>
                                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-accent-light group-hover/screen:underline">
                                        <span>{isEs ? 'Entrar al portal' : 'Enter portal'}</span>
                                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover/screen:translate-x-0.5 group-hover/screen:-translate-y-0.5" />
                                    </span>
                                </div>
                            </div>
                        )}
                    </a>
                </div>
            </div>
        </section>
    </>
    );
};
