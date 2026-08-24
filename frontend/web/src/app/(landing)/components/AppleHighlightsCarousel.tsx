'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AppleHighlightsCarouselProps {
    links: {
        portfolio: string;
        bible: string;
        software: string;
    };
}

export const AppleHighlightsCarousel: React.FC<AppleHighlightsCarouselProps> = ({ links }) => {
    const { language } = useLanguage();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);

    const isEs = language === 'es';
    const SLIDE_DURATION = 6500;

    const slides = [
        {
            id: 'bible',
            headline: isEs ? 'La Biblia Modular' : 'The Modular Bible',
            description: isEs
                ? '9 motores de exégesis teológica, análisis morfológico Strong y lectura pura libre de distracciones.'
                : '9 theological exegesis engines, Strong morphology analysis, and distraction-free reading.',
            linkUrl: links.bible,
            linkText: isEs ? 'Abrir Biblia' : 'Open Bible',
            renderVisual: () => (
                <div className="w-full flex flex-col justify-center gap-5 sm:gap-6 text-left py-1">
                    {/* Cita Bíblica Principal */}
                    <div className="flex flex-col gap-1.5">
                        <p className="text-lg sm:text-2xl md:text-3xl font-light italic text-foreground leading-relaxed">
                            &ldquo;{isEs ? 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.' : 'Your word is a lamp to my feet and a light to my path.'}&rdquo;
                        </p>
                        <span className="text-xs sm:text-sm text-text-subtitle font-normal">
                            Salmos 119:105 · {isEs ? 'Texto Masorético y Septuaginta' : 'Masoretic Text and Septuagint'}
                        </span>
                    </div>

                    {/* Desglose Morfológico con Separadores Sutiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-4 border-t border-card-border">
                        <div className="flex flex-col gap-0.5 sm:pr-6 pb-2.5 sm:pb-0">
                            <span className="text-xs sm:text-sm font-semibold text-foreground">Niyr (Strong H5216)</span>
                            <span className="text-[11px] sm:text-xs text-text-muted">{isEs ? 'Lámpara y luz resplandeciente' : 'Lamp and shining light'}</span>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:px-6 py-2.5 sm:py-0">
                            <span className="text-xs sm:text-sm font-semibold text-foreground">Dabar (Strong H1697)</span>
                            <span className="text-[11px] sm:text-xs text-text-muted">{isEs ? 'Palabra y mandato divino' : 'Word and divine decree'}</span>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:pl-6 pt-2.5 sm:pt-0">
                            <span className="text-xs sm:text-sm font-semibold text-foreground">Owr (Strong H216)</span>
                            <span className="text-[11px] sm:text-xs text-text-muted">{isEs ? 'Lumbrera y claridad viva' : 'Luminance and bright light'}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'software',
            headline: isEs ? 'Software & Inteligencia Artificial' : 'Software & Artificial Intelligence',
            description: isEs
                ? 'Noticias de vanguardia, análisis de modelos de razonamiento, ciberseguridad y herramientas web.'
                : 'Cutting-edge news, reasoning model analysis, cybersecurity, and modern web tools.',
            linkUrl: links.software,
            linkText: isEs ? 'Entrar a Software Hub' : 'Enter Software Hub',
            renderVisual: () => (
                <div className="w-full flex flex-col justify-center text-left py-1">
                    {/* Columnas Separadas por Línea Sutil */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-4 border-t border-card-border">
                        <div className="flex flex-col gap-1.5 sm:pr-8 pb-4 sm:pb-0">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                {isEs ? 'IA Generativa & Modelos de Razonamiento' : 'Generative AI & Reasoning Models'}
                            </span>
                            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {isEs
                                    ? 'Arquitecturas de inferencia, evaluación de benchmarks, agentes autónomos y técnicas avanzadas de prompting y RAG.'
                                    : 'Inference architectures, benchmark evaluations, autonomous agents, and advanced prompting and RAG techniques.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5 sm:pl-8 pt-4 sm:pt-0">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                {isEs ? 'Ciberseguridad & Defensa Activa' : 'Cybersecurity & Active Defense'}
                            </span>
                            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {isEs
                                    ? 'Análisis de vulnerabilidades, auditorías de dependencias, protección de APIs y políticas de seguridad zero-trust.'
                                    : 'Vulnerability analysis, dependency audits, API protection, and zero-trust security policies.'}
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            id: 'portfolio',
            headline: isEs ? 'Portafolio Profesional & Servicios' : 'Professional Portfolio & Services',
            description: isEs
                ? 'Arquitectura de software de alta calidad, proyectos de producción, consultoría y soluciones de ingeniería.'
                : 'High-quality software architecture, production projects, technical consulting, and engineering solutions.',
            linkUrl: links.portfolio,
            linkText: isEs ? 'Ver Portafolio' : 'View Portfolio',
            renderVisual: () => (
                <div className="w-full flex flex-col justify-center text-left py-1">
                    {/* 3 Pilares Separados por Líneas Sutiles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-4 border-t border-card-border">
                        <div className="flex flex-col gap-1 sm:pr-6 pb-3 sm:pb-0">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                {isEs ? 'Arquitectura Limpia' : 'Clean Architecture'}
                            </span>
                            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {isEs
                                    ? 'Next.js 16, NestJS 11, TypeScript estricto y persistencia atómica aislada.'
                                    : 'Next.js 16, NestJS 11, strict TypeScript, and isolated persistence.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 sm:px-6 py-3 sm:py-0">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                {isEs ? 'Alto Rendimiento' : 'High Performance'}
                            </span>
                            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {isEs
                                    ? 'Optimización de recursos en 1 GB de RAM, WebSockets en tiempo real y cero latencia.'
                                    : 'Resource optimization on 1 GB RAM, real-time WebSockets, and zero latency.'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 sm:pl-6 pt-3 sm:pt-0">
                            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                {isEs ? 'Soluciones End-to-End' : 'End-to-End Delivery'}
                            </span>
                            <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                                {isEs
                                    ? 'Diseño de experiencia UX/UI, desarrollo full stack y despliegue continuo con CI/CD.'
                                    : 'UX/UI experience design, full stack development, and continuous CI/CD deployment.'}
                            </p>
                        </div>
                    </div>
                </div>
            ),
        },
    ];

    const totalSlides = slides.length;

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
        setProgress(0);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        setProgress(0);
    }, [totalSlides]);

    const goToSlide = (idx: number) => {
        setActiveIndex(idx);
        setProgress(0);
    };

    useEffect(() => {
        if (!isPlaying) return;

        const intervalTime = 50;
        const step = (intervalTime / SLIDE_DURATION) * 100;

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    nextSlide();
                    return 0;
                }
                return prev + step;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [isPlaying, nextSlide]);

    const touchStartX = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartX.current === null) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 45) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
        touchStartX.current = null;
    };

    return (
        <section
            id="highlights"
            className="w-screen relative left-1/2 -translate-x-1/2 flex flex-col gap-6 py-8 overflow-hidden [--card-w:78vw] sm:[--card-w:82vw] md:[--card-w:min(82vw,960px)] [--card-gap:1.25rem] sm:[--card-gap:1.75rem] md:[--card-gap:2.25rem]"
        >
            {/* Título de Sección Estilo Oficial Apple */}
            <div className="w-full max-w-5xl mx-auto flex flex-col items-start px-5 sm:px-8">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                    {isEs ? 'Mira lo más destacado' : 'Get the highlights'}
                </h2>
            </div>

            {/* Contenedor del Carrusel Multitarjeta con laterales asomados (Mismo tamaño y altura sin encogerse) */}
            <div
                className="w-full relative overflow-hidden py-4 select-none"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] items-center"
                    style={{
                        transform: `translateX(calc(50vw - (var(--card-w) / 2) - ${activeIndex} * (var(--card-w) + var(--card-gap))))`,
                    }}
                >
                    {slides.map((slide, idx) => {
                        const isActive = idx === activeIndex;

                        return (
                            <div
                                key={slide.id}
                                onClick={(e) => {
                                    if ((e.target as HTMLElement).closest('a')) {
                                        return;
                                    }
                                    if (!isActive) {
                                        goToSlide(idx);
                                    } else {
                                        if (e.ctrlKey || e.metaKey) {
                                            window.open(slide.linkUrl, '_blank', 'noopener,noreferrer');
                                        } else {
                                            window.location.href = slide.linkUrl;
                                        }
                                    }
                                }}
                                onAuxClick={(e) => {
                                    if ((e.target as HTMLElement).closest('a')) {
                                        return;
                                    }
                                    if (isActive && e.button === 1) {
                                        window.open(slide.linkUrl, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                style={{ width: 'var(--card-w)', marginRight: 'var(--card-gap)' }}
                                className={`shrink-0 rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] bg-card border border-card-border p-6 sm:p-10 md:p-12 backdrop-blur-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-[530px] sm:h-[500px] md:h-[520px] cursor-pointer group ${isActive
                                    ? 'opacity-100 hover:border-card-hover-border'
                                    : 'opacity-50 hover:opacity-80'
                                    }`}
                            >
                                {/* Cabecera: Limpia, directa, alineada a la izquierda */}
                                <div className="flex flex-col text-left max-w-2xl gap-1.5 mb-2">
                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-[-0.025em] text-foreground leading-snug">
                                        {slide.headline}
                                    </h3>
                                    <p className="text-xs sm:text-sm md:text-base text-text-muted font-normal leading-relaxed">
                                        {slide.description}
                                    </p>
                                </div>

                                {/* Contenido Visual con Separadores Sutiles */}
                                <div className="w-full flex-grow flex items-center justify-center my-2">
                                    {slide.renderVisual()}
                                </div>

                                {/* Botón de Enlace Directo Simple */}
                                <div className="flex items-center justify-end pt-3 border-t border-card-border">
                                    <a
                                        href={slide.linkUrl}
                                        onClick={(e) => {
                                            if (!isActive) {
                                                e.preventDefault();
                                                goToSlide(idx);
                                            }
                                        }}
                                        className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm tracking-tight group-hover:opacity-90 active:scale-95 transition-all cursor-pointer select-none"
                                    >
                                        {slide.linkText}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Barra de Control Apple Style Oficial: Cápsula de Progreso + Botón Play Circular Separado */}
            <div className="flex items-center justify-center gap-3 pt-3">
                {/* Cápsula de Puntos y Progreso */}
                <div className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-btn-sec border border-card-border shadow-sm backdrop-blur-xl flex items-center gap-3">
                    {slides.map((slide, idx) => {
                        const isActive = idx === activeIndex;

                        return (
                            <button
                                key={slide.id}
                                onClick={() => goToSlide(idx)}
                                className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${isActive ? 'w-10 sm:w-12 bg-foreground/20' : 'w-2 sm:w-2.5 bg-foreground/25 hover:bg-foreground/50'
                                    }`}
                                aria-label={`Slide ${idx + 1}`}
                            >
                                {isActive && (
                                    <div
                                        className="absolute top-0 left-0 bottom-0 bg-foreground rounded-full transition-all duration-75"
                                        style={{ width: `${progress}%` }}
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Botón Circular Separado de Play / Pause */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-btn-sec border border-card-border shadow-sm backdrop-blur-xl flex items-center justify-center text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer"
                    aria-label={isPlaying ? (isEs ? 'Pausar' : 'Pause') : (isEs ? 'Reproducir' : 'Play')}
                >
                    {isPlaying ? (
                        <Pause className="w-4 h-4 fill-current" />
                    ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                    )}
                </button>
            </div>
        </section>
    );
};
