'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause } from 'lucide-react';
import { useLanguage } from '../../../providers/LanguageContext';
import { useSubdomainUrl } from '../../../shared/lib';
import { BibleSlideVisual, SoftwareSlideVisual, PortfolioSlideVisual } from './slides';

interface AppleHighlightsCarouselProps {
    links?: {
        portfolio: string;
        bible: string;
        software: string;
    };
}

export const AppleHighlightsCarousel: React.FC<AppleHighlightsCarouselProps> = ({ links }) => {
    const { language } = useLanguage();
    const { urls } = useSubdomainUrl();
    const resolvedLinks = links || urls;

    const [activeIndex, setActiveIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isInView, setIsInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    const isEs = language === 'es';
    const SLIDE_DURATION = 6500;

    const slides = [
        {
            id: 'bible',
            headline: isEs ? 'La Biblia Modular' : 'The Modular Bible',
            description: isEs
                ? '9 motores de exégesis teológica, análisis morfológico Strong y lectura pura libre de distracciones.'
                : '9 theological exegesis engines, Strong morphology analysis, and distraction-free reading.',
            linkUrl: resolvedLinks.bible,
            linkText: isEs ? 'Abrir Biblia' : 'Open Bible',
            renderVisual: () => <BibleSlideVisual isEs={isEs} />,
        },
        {
            id: 'software',
            headline: isEs ? 'Software & Inteligencia Artificial' : 'Software & Artificial Intelligence',
            description: isEs
                ? 'Noticias de vanguardia, análisis de modelos de razonamiento, ciberseguridad y herramientas web.'
                : 'Cutting-edge news, reasoning model analysis, cybersecurity, and modern web tools.',
            linkUrl: resolvedLinks.software,
            linkText: isEs ? 'Entrar a Software' : 'Enter Software',
            renderVisual: () => <SoftwareSlideVisual isEs={isEs} />,
        },
        {
            id: 'portfolio',
            headline: isEs ? 'Portafolio Profesional & Servicios' : 'Professional Portfolio & Services',
            description: isEs
                ? 'Arquitectura de software de alta calidad, proyectos de producción, consultoría y soluciones de ingeniería.'
                : 'High-quality software architecture, production projects, technical consulting, and engineering solutions.',
            linkUrl: resolvedLinks.portfolio,
            linkText: isEs ? 'Ver Portafolio' : 'View Portfolio',
            renderVisual: () => <PortfolioSlideVisual isEs={isEs} />,
        },
    ];

    const totalSlides = slides.length;

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, [totalSlides]);

    const prevSlide = useCallback(() => {
        setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }, [totalSlides]);

    const goToSlide = (idx: number) => {
        setActiveIndex(idx);
    };

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsInView(entry.isIntersecting);
            },
            { threshold: 0.35 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const [dragOffset, setDragOffset] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const pointerStartX = useRef<number | null>(null);
    const pointerStartY = useRef<number | null>(null);
    const isHorizontalDrag = useRef<boolean | null>(null);
    const hasDragged = useRef<boolean>(false);

    useEffect(() => {
        if (!isPlaying || !isInView || isDragging) return;

        const timer = setTimeout(() => {
            nextSlide();
        }, SLIDE_DURATION);

        return () => clearTimeout(timer);
    }, [isPlaying, isInView, isDragging, activeIndex, nextSlide]);

    const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        pointerStartX.current = e.clientX;
        pointerStartY.current = e.clientY;
        hasDragged.current = false;
        isHorizontalDrag.current = null;
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
        if (pointerStartX.current === null) return;

        const deltaX = e.clientX - pointerStartX.current;
        const deltaY = e.clientY - (pointerStartY.current ?? e.clientY);

        if (isHorizontalDrag.current === null) {
            if (Math.abs(deltaX) > 7 || Math.abs(deltaY) > 7) {
                if (Math.abs(deltaX) >= Math.abs(deltaY)) {
                    isHorizontalDrag.current = true;
                    setIsDragging(true);
                    try {
                        e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {
                        // Safe fallback
                    }
                } else {
                    isHorizontalDrag.current = false;
                }
            }
        }

        if (isHorizontalDrag.current === true) {
            hasDragged.current = true;

            // Resistencia elástica en los extremos
            let currentOffset = deltaX;
            if (activeIndex === 0 && deltaX > 0) {
                currentOffset = deltaX * 0.35;
            } else if (activeIndex === totalSlides - 1 && deltaX < 0) {
                currentOffset = deltaX * 0.35;
            }

            setDragOffset(currentOffset);
        }
    };

    const handlePointerEnd = (e: React.PointerEvent<HTMLDivElement>) => {
        if (pointerStartX.current === null) return;

        if (isDragging) {
            const DRAG_THRESHOLD = 60;
            if (dragOffset < -DRAG_THRESHOLD) {
                nextSlide();
            } else if (dragOffset > DRAG_THRESHOLD) {
                prevSlide();
            }

            setDragOffset(0);
            setIsDragging(false);

            try {
                if (e.currentTarget.hasPointerCapture(e.pointerId)) {
                    e.currentTarget.releasePointerCapture(e.pointerId);
                }
            } catch {
                // Safe fallback
            }
        }

        pointerStartX.current = null;
        pointerStartY.current = null;
        isHorizontalDrag.current = null;

        setTimeout(() => {
            hasDragged.current = false;
        }, 60);
    };

    return (
        <section
            ref={sectionRef}
            id="highlights"
            className="w-screen relative left-1/2 -translate-x-1/2 flex flex-col gap-6 py-8 overflow-hidden scroll-mt-16 sm:scroll-mt-24 md:scroll-mt-32 [--card-w:78vw] sm:[--card-w:82vw] md:[--card-w:min(82vw,960px)] [--card-gap:1.25rem] sm:[--card-gap:1.75rem] md:[--card-gap:2.25rem]"
        >
            {/* Título de Sección Estilo Oficial Apple */}
            <div className="w-full max-w-5xl mx-auto flex flex-col items-start px-5 sm:px-8">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                    {isEs ? 'Mira lo más destacado' : 'Get the highlights'}
                </h2>
            </div>

            {/* Contenedor del Carrusel Multitarjeta con laterales asomados (Arrastrable con Mouse y Touch) */}
            <div
                className="w-full relative overflow-hidden py-4 select-none touch-pan-y"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerEnd}
                onPointerCancel={handlePointerEnd}
            >
                <div
                    className={`flex items-center ${
                        isDragging
                            ? 'transition-none cursor-grabbing'
                            : 'transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-grab'
                    }`}
                    style={{
                        transform: `translateX(calc(50vw - (var(--card-w) / 2) - ${activeIndex} * (var(--card-w) + var(--card-gap)) + ${dragOffset}px))`,
                    }}
                >
                    {slides.map((slide, idx) => {
                        const isActive = idx === activeIndex;

                        return (
                            <div
                                key={slide.id}
                                onClick={(e) => {
                                    if (hasDragged.current) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
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
                                    if (hasDragged.current) {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        return;
                                    }
                                    if ((e.target as HTMLElement).closest('a')) {
                                        return;
                                    }
                                    if (isActive && e.button === 1) {
                                        window.open(slide.linkUrl, '_blank', 'noopener,noreferrer');
                                    }
                                }}
                                style={{ width: 'var(--card-w)', marginRight: 'var(--card-gap)' }}
                                className="shrink-0 rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] bg-card border border-card-border p-6 sm:p-10 md:p-12 backdrop-blur-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-[530px] sm:h-[500px] md:h-[520px] cursor-pointer group opacity-100 hover:border-card-hover-border"
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
            <div className="flex items-center justify-center gap-3.5 pt-4">
                {/* Cápsula de Puntos y Progreso */}
                <div className="h-12 sm:h-14 px-5 sm:px-6 rounded-full bg-btn-sec border border-card-border shadow-sm backdrop-blur-xl flex items-center gap-1.5 sm:gap-2">
                    {slides.map((slide, idx) => {
                        const isActive = idx === activeIndex;

                        return (
                            <button
                                key={slide.id}
                                onClick={() => goToSlide(idx)}
                                className="h-10 px-1.5 sm:px-2 flex items-center justify-center cursor-pointer group/dot focus:outline-none select-none"
                                aria-label={`Slide ${idx + 1}`}
                            >
                                <div
                                    className={`relative h-2.5 sm:h-3 rounded-full transition-all duration-500 overflow-hidden ${isActive
                                        ? 'w-12 sm:w-14 bg-foreground/20'
                                        : 'w-2.5 sm:w-3 bg-foreground/30 group-hover/dot:bg-foreground/60 group-hover/dot:scale-110'
                                        }`}
                                >
                                    {isActive && (
                                        <div
                                            key={`slide-prog-${activeIndex}-${isPlaying}-${isInView}`}
                                            className="absolute top-0 left-0 bottom-0 bg-foreground rounded-full"
                                            style={{
                                                animation: isPlaying && isInView ? `progressFill ${SLIDE_DURATION}ms linear forwards` : 'none',
                                                width: isPlaying && isInView ? '0%' : (isInView ? '100%' : '0%'),
                                            }}
                                        />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Botón Circular Separado de Play / Pause */}
                <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-btn-sec border border-card-border shadow-sm backdrop-blur-xl flex items-center justify-center text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer select-none"
                    aria-label={isPlaying ? (isEs ? 'Pausar' : 'Pause') : (isEs ? 'Reproducir' : 'Play')}
                >
                    {isPlaying ? (
                        <Pause className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current" />
                    ) : (
                        <Play className="w-4.5 h-4.5 sm:w-5 sm:h-5 fill-current ml-0.5" />
                    )}
                </button>
            </div>
        </section>
    );
};
