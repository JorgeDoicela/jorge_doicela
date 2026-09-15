'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookOpen,
    Columns2,
    Languages,
    Library,
    MapPin,
    Clock,
    Landmark,
    Sparkles,
    ArrowRight,
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BibleEnginesCarousel() {
    const tLanding = useTranslations('Landing');

    const engines = [
        {
            href: '/study/standard',
            icon: BookOpen,
            colorClass: 'bg-accents-1 border-accents-2 text-foreground',
            title: tLanding('engine1Title'),
            desc: tLanding('engine1Desc'),
        },
        {
            href: '/study/parallel',
            icon: Columns2,
            colorClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
            title: tLanding('engine2Title'),
            desc: tLanding('engine2Desc'),
        },
        {
            href: '/study/interlinear',
            icon: Languages,
            colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
            title: tLanding('engine3Title'),
            desc: tLanding('engine3Desc'),
        },
        {
            href: '/study/word-study',
            icon: Library,
            colorClass: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
            title: tLanding('engine5Title'),
            desc: tLanding('engine5Desc'),
        },
        {
            href: '/study/atlas',
            icon: MapPin,
            colorClass: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
            title: tLanding('engine7Title'),
            desc: tLanding('engine7Desc'),
        },
        {
            href: '/study/timeline',
            icon: Clock,
            colorClass: 'bg-amber-400/10 border-amber-400/20 text-amber-500',
            title: tLanding('engine8Title'),
            desc: tLanding('engine8Desc'),
        },
        {
            href: '/study/archaeology',
            icon: Landmark,
            colorClass: 'bg-teal-400/10 border-teal-400/20 text-teal-500',
            title: tLanding('engine9Title'),
            desc: tLanding('engine9Desc'),
        },
        {
            href: '/study/evangelism',
            icon: Sparkles,
            colorClass: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
            title: tLanding('engine10Title'),
            desc: tLanding('engine10Desc'),
        },
    ];

    const [currentEngineSlide, setCurrentEngineSlide] = useState(0);
    const [isEngineAutoplay, setIsEngineAutoplay] = useState(true);
    const totalEngineSlides = engines.length;
    const enginesSectionRef = useRef<HTMLElement | null>(null);
    const [isSectionInView, setIsSectionInView] = useState(false);

    useEffect(() => {
        const el = enginesSectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsSectionInView(entry.isIntersecting);
            },
            { threshold: 0.25 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const isCarouselActive = isEngineAutoplay && isSectionInView;

    const handlePrevEngine = () => {
        setIsEngineAutoplay(false);
        setCurrentEngineSlide((prev) => (prev - 1 + totalEngineSlides) % totalEngineSlides);
    };

    const handleNextEngine = () => {
        setIsEngineAutoplay(false);
        setCurrentEngineSlide((prev) => (prev + 1) % totalEngineSlides);
    };

    const getEngineTheme = (idx: number) => {
        const engineImages = [
            '/bible/images/hero_editorial_dark.jpg',
            '/bible/images/parallel_versions_study.jpg',
            '/bible/images/codex_interlinear_scroll.jpg',
            '/bible/images/strong_lexicon_study.jpg',
            '/bible/images/bible_atlas_topography.jpg',
            '/bible/images/historical_timeline_chronology.jpg',
            '/bible/images/manuscripts_heritage.jpg',
            '/bible/images/evangelism_proclamation.jpg',
        ];

        return {
            bg: 'bg-white dark:bg-[#0c0c0d] border-zinc-200/90 dark:border-zinc-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.7)]',
            image: engineImages[idx] || engineImages[0],
        };
    };

    return (
        <section
            ref={enginesSectionRef}
            id="herramientas"
            className="w-full flex flex-col gap-6 sm:gap-8 py-12 sm:py-16 md:py-20 overflow-hidden scroll-mt-16 sm:scroll-mt-24 md:scroll-mt-32 [--card-w:82vw] sm:[--card-w:84vw] md:[--card-w:min(82vw,1040px)] [--card-gap:1.5rem] sm:[--card-gap:2rem] md:[--card-gap:2.5rem] border-b border-border/40 select-none"
        >
            {/* Cabecera Equilibrada en 2 Líneas Estilo Google */}
            <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h2 className="text-3xl sm:text-5xl md:text-[52px] lg:text-[56px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-[1.12] whitespace-normal sm:whitespace-nowrap">
                    {tLanding('enginesTitle')}
                </h2>
                <p className="text-sm sm:text-base lg:text-[17px] text-[#3c4043] dark:text-zinc-400 font-normal leading-normal whitespace-normal sm:whitespace-nowrap max-w-3xl">
                    {tLanding('enginesSubtitle')}
                </p>
            </div>

            {/* Contenedor del Carrusel Multitarjeta */}
            <div className="w-full relative overflow-hidden py-4 select-none">
                <div
                    className="flex transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] items-center"
                    style={{
                        transform: `translateX(calc(50% - (var(--card-w) / 2) - ${currentEngineSlide} * (var(--card-w) + var(--card-gap))))`,
                    }}
                >
                    {engines.map((engine, idx) => {
                        const isActive = currentEngineSlide === idx;
                        const theme = getEngineTheme(idx);

                        return (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (!isActive) {
                                        setIsEngineAutoplay(false);
                                        setCurrentEngineSlide(idx);
                                    }
                                }}
                                style={{ width: 'var(--card-w)', marginRight: 'var(--card-gap)' }}
                                className={`shrink-0 rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.6rem] ${theme.bg} border p-6 sm:p-8 md:p-10 transition-all duration-700 relative overflow-hidden flex flex-col justify-between min-h-[500px] sm:min-h-[460px] md:min-h-[440px] cursor-pointer group hover:border-zinc-300 dark:hover:border-zinc-700`}
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full w-full my-auto">
                                    {/* Columna Izquierda (45%): Narrativa, badge y botón de acción */}
                                    <div className="lg:col-span-5 flex flex-col justify-between h-full text-left gap-4 sm:gap-5">
                                        <div className="space-y-3.5">
                                            <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-foreground leading-[1.2]">
                                                {engine.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm lg:text-[15px] text-accents-5 font-normal leading-relaxed">
                                                {engine.desc}
                                            </p>
                                        </div>

                                        <div className="pt-1">
                                            <Link
                                                href={engine.href}
                                                onClick={(e) => {
                                                    if (!isActive) {
                                                        e.preventDefault();
                                                        setCurrentEngineSlide(idx);
                                                    }
                                                }}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-xs sm:text-sm hover:opacity-90 active:scale-95 transition-all shadow-xs cursor-pointer select-none"
                                            >
                                                <span>Explorar herramienta</span>
                                                <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Columna Derecha (55%): Frame Relativo con Elementos HUD Sobresalidos */}
                                    <div className="lg:col-span-7 relative w-full h-[320px] sm:h-[350px] md:h-[370px]">
                                        <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] overflow-hidden border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-950 shadow-inner group/viewport">
                                            <Image
                                                src={theme.image}
                                                alt={engine.title}
                                                fill
                                                className="object-cover filter brightness-[0.78] contrast-[1.10] group-hover:scale-105 transition-transform duration-700 select-none"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 pointer-events-none" />
                                        </div>

                                        {/* 1. LECTURA CLARA Y CONTINUA */}
                                        {idx === 0 && (
                                            <div className="absolute -bottom-3 sm:-bottom-5 -left-2 sm:-left-6 w-[96%] sm:w-[88%] z-20 rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4.5 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl text-left space-y-2.5">
                                                <div className="flex items-center justify-between text-[11px] font-mono text-accents-4 border-b border-border/70 pb-1.5">
                                                    <span>Salmos 23:1-2</span>
                                                    <span className="px-2 py-0.5 rounded-full bg-foreground/10 text-foreground font-semibold text-[10px]">Modo Prosa</span>
                                                </div>
                                                <p className="font-serif italic text-xs sm:text-sm text-foreground leading-relaxed">
                                                    &ldquo;El Señor es mi pastor, nada me faltará. En lugares de verdes pastos me hace descansar; junto a aguas de reposo me conduce.&rdquo;
                                                </p>
                                                <div className="flex flex-wrap gap-2 pt-1 text-[10px] font-mono text-accents-5">
                                                    <span className="px-2 py-0.5 rounded bg-accents-1">Serif 18px</span>
                                                    <span className="px-2 py-0.5 rounded bg-accents-1">Página limpia</span>
                                                    <span className="px-2 py-0.5 rounded bg-accents-1">Cero cortes</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. COMPARADOR DE VERSIONES */}
                                        {idx === 1 && (
                                            <div className="absolute inset-0 z-10 flex items-center justify-center p-3 sm:p-5">
                                                <div className="w-full max-w-[440px] rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-left space-y-2 text-xs">
                                                    <div className="p-2 rounded-xl bg-accents-1/80 border border-border/70 space-y-0.5">
                                                        <div className="font-mono text-[10px] text-foreground font-semibold flex items-center justify-between">
                                                            <span>NBLA (Formal y Fiel)</span>
                                                            <span className="text-[9px] text-accents-4 font-normal">Texto Base</span>
                                                        </div>
                                                        <p className="font-serif text-foreground text-xs leading-snug">&ldquo;El Señor es mi pastor, <span className="bg-blue-500/15 text-blue-600 dark:text-blue-300 px-1 py-0.5 rounded font-semibold">nada me faltará</span>.&rdquo;</p>
                                                    </div>
                                                    <div className="p-2 rounded-xl bg-accents-1/80 border border-border/70 space-y-0.5">
                                                        <div className="font-mono text-[10px] text-accents-5 font-semibold flex items-center justify-between">
                                                            <span>NTV (Lenguaje Actual)</span>
                                                            <span className="text-[9px] text-accents-4 font-normal">Paralelo</span>
                                                        </div>
                                                        <p className="font-serif text-foreground text-xs leading-snug">&ldquo;El Señor es mi pastor; <span className="bg-amber-500/15 text-amber-600 dark:text-amber-300 px-1 py-0.5 rounded font-semibold">tengo todo lo que necesito</span>.&rdquo;</p>
                                                    </div>
                                                    <div className="text-[10px] font-mono text-accents-4 pt-1 flex items-center justify-between border-t border-border/60">
                                                        <span>Algoritmo LCS de variantes:</span>
                                                        <span className="text-emerald-500 font-semibold">2 matices detectados</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. TEXTO EN IDIOMAS ORIGINALES */}
                                        {idx === 2 && (
                                            <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-10 rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-left space-y-2.5">
                                                <div className="flex items-center justify-between border-b border-border pb-1.5">
                                                    <div className="text-xl sm:text-2xl font-serif text-foreground font-bold tracking-wide" dir="rtl">
                                                        יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃
                                                    </div>
                                                    <span className="text-[10px] font-mono text-foreground font-semibold uppercase px-2 py-0.5 rounded bg-accents-1 border border-border">
                                                        BHS Masorético
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                                                    <div className="p-1.5 rounded-lg bg-accents-1/80 border border-border/60">
                                                        <span className="font-bold text-foreground block">Adonay</span>
                                                        <span className="text-accents-4 text-[9.5px]">H3068 · Señor</span>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-accents-1/80 border border-border/60">
                                                        <span className="font-bold text-foreground block">Ro'í</span>
                                                        <span className="text-accents-4 text-[9.5px]">H7462 · Pastor</span>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-accents-1/80 border border-border/60">
                                                        <span className="font-bold text-foreground block">Lo Ehsar</span>
                                                        <span className="text-accents-4 text-[9.5px]">H2637 · Provisión</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. DICCIONARIOS BÍBLICOS Y STRONG */}
                                        {idx === 3 && (
                                            <div className="absolute -bottom-3 sm:-bottom-5 -left-2 sm:-left-6 w-[92%] sm:w-[370px] z-20 rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl text-left space-y-2">
                                                <div className="flex items-center justify-between border-b border-border pb-1.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-mono font-bold text-foreground bg-accents-1 px-2 py-0.5 rounded border border-border">H7462</span>
                                                        <span className="text-[10px] font-mono text-accents-4">Léxico BDB / Thayer</span>
                                                    </div>
                                                    <span className="text-[9.5px] font-mono text-accents-4 px-1.5 py-0.5 rounded bg-accents-1/80">173 usos AT</span>
                                                </div>
                                                <div>
                                                    <p className="text-base font-bold font-serif text-foreground">רָעָה (ra'ah)</p>
                                                    <p className="text-xs text-accents-5 font-sans">Apacentar, pastorear, guiar a las ovejas</p>
                                                </div>
                                                <div className="flex items-center justify-between text-[10px] font-mono text-accents-4 pt-1 border-t border-border/60">
                                                    <span>LXX Griego: <strong className="text-foreground font-serif">ποιμαίνω (G4165)</strong></span>
                                                    <span>Salmos, Isaías</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. MAPAS BÍBLICOS Y RUTAS */}
                                        {idx === 4 && (
                                            <>
                                                <div className="absolute top-3.5 left-3.5 z-10 rounded-xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3 shadow-xl backdrop-blur-xl text-left max-w-[270px] space-y-1">
                                                    <div className="flex items-center justify-between text-foreground font-semibold text-xs border-b border-border pb-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                                            <span>Atlas Geo-Referenciado</span>
                                                        </div>
                                                        <span className="text-[9.5px] font-mono text-accents-4">Siglo I</span>
                                                    </div>
                                                    <div className="text-[10.5px] font-mono text-foreground font-medium pt-0.5">
                                                        Antioquía ➔ Chipre ➔ Perge ➔ Listra
                                                    </div>
                                                </div>

                                                <div className="absolute -bottom-2.5 sm:-bottom-3.5 -right-2 sm:-right-4 z-20 rounded-xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 px-3.5 py-2 shadow-[0_15px_35px_rgba(0,0,0,0.18)] dark:shadow-[0_15px_35px_rgba(0,0,0,0.65)] backdrop-blur-xl text-left flex items-center gap-3 text-[10.5px] font-mono">
                                                    <div>
                                                        <span className="text-accents-4 block text-[9px] uppercase">Distancia</span>
                                                        <span className="text-foreground font-semibold">2,250 km</span>
                                                    </div>
                                                    <div className="h-6 w-px bg-border" />
                                                    <div>
                                                        <span className="text-accents-4 block text-[9px] uppercase">Base de Datos</span>
                                                        <span className="text-emerald-500 font-semibold">420+ Sitios WGS84</span>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* 6. LÍNEA DE TIEMPO HISTÓRICA */}
                                        {idx === 5 && (
                                            <div className="absolute bottom-3 sm:bottom-4 inset-x-3 sm:inset-x-4 z-10 rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-left space-y-2.5">
                                                <div className="flex items-center justify-between border-b border-border pb-1.5 text-xs">
                                                    <span className="font-mono font-bold text-foreground uppercase text-[10.5px] flex items-center gap-2">
                                                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                                                        Cronología Sincrónica
                                                    </span>
                                                    <span className="text-[10px] font-mono text-accents-4">2000 a.C. — 100 d.C.</span>
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center text-[10.5px] font-mono">
                                                    <div className="p-1.5 rounded-lg bg-accents-1/80 border border-border/60">
                                                        <div className="font-bold text-foreground">Monarquía Unida</div>
                                                        <div className="text-accents-4 text-[9.5px]">1000 a.C. (David)</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-accents-1/80 border border-border/60">
                                                        <div className="font-bold text-foreground">Exilio Babilonia</div>
                                                        <div className="text-accents-4 text-[9.5px]">586 a.C. (Templo)</div>
                                                    </div>
                                                    <div className="p-1.5 rounded-lg bg-accents-1/80 border border-border/60">
                                                        <div className="font-bold text-foreground">Ocupación Romana</div>
                                                        <div className="text-accents-4 text-[9.5px]">Siglo I (César)</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 7. ARQUEOLOGÍA Y MANUSCRITOS */}
                                        {idx === 6 && (
                                            <div className="absolute bottom-3.5 sm:bottom-4 right-3.5 sm:right-4 left-3.5 sm:left-auto sm:w-[350px] z-10">
                                                <div className="rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-left space-y-2">
                                                    <div className="flex items-center justify-between border-b border-border pb-1.5 text-xs">
                                                        <span className="font-mono font-bold text-foreground uppercase text-[10px] flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                                            Registro de Manuscrito
                                                        </span>
                                                        <span className="text-[9.5px] font-mono text-accents-4 px-1.5 py-0.5 rounded bg-accents-1">Qumrán Cueva 1</span>
                                                    </div>
                                                    <div className="space-y-1.5 text-[10.5px] font-mono">
                                                        <div className="flex justify-between items-center p-1.5 rounded bg-accents-1/60">
                                                            <span className="text-foreground font-semibold">Gran Rollo de Isaías (1QIsaª)</span>
                                                            <span className="text-accents-4 text-[9.5px]">125 a.C.</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-1.5 rounded bg-accents-1/60">
                                                            <span className="text-foreground font-semibold">Códice de Leningrado (BHS)</span>
                                                            <span className="text-accents-4 text-[9.5px]">1008 d.C.</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 8. EVANGELIZACIÓN Y APOLOGÉTICA */}
                                        {idx === 7 && (
                                            <div className="absolute bottom-3.5 sm:bottom-4 right-3.5 sm:right-4 left-3.5 sm:left-auto sm:w-[360px] z-10">
                                                <div className="rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-left space-y-2">
                                                    <div className="flex items-center justify-between border-b border-border pb-1.5 text-xs">
                                                        <span className="font-mono font-bold text-foreground uppercase text-[10px] flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                                            Rutas y Apologética Práctica
                                                        </span>
                                                        <span className="text-[9.5px] font-mono text-accents-4 px-1.5 py-0.5 rounded bg-accents-1">Kerygma & Missio Dei</span>
                                                    </div>
                                                    <div className="space-y-1.5 text-[10.5px] font-mono">
                                                        <div className="flex justify-between items-center p-1.5 rounded bg-accents-1/60">
                                                            <span className="text-foreground font-semibold">Camino de Romanos</span>
                                                            <span className="text-rose-500 font-bold text-[9.5px]">5 Pasos Soteriológicos</span>
                                                        </div>
                                                        <div className="flex justify-between items-center p-1.5 rounded bg-accents-1/60">
                                                            <span className="text-foreground font-semibold">Defensa & Tratados</span>
                                                            <span className="text-accents-4 text-[9.5px]">Respuestas Bíblicas</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Controles de Navegación e Indicadores de Progreso */}
            <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center gap-3 sm:gap-4 mt-2 select-none">
                {/* Flechas Anterior / Siguiente */}
                <button
                    onClick={handlePrevEngine}
                    aria-label="Herramienta anterior"
                    className="w-12 h-12 rounded-full bg-background/90 dark:bg-zinc-900/90 border border-border shadow-2xs backdrop-blur-md flex items-center justify-center text-foreground hover:bg-accents-1 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer select-none"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                    onClick={handleNextEngine}
                    aria-label="Siguiente herramienta"
                    className="w-12 h-12 rounded-full bg-background/90 dark:bg-zinc-900/90 border border-border shadow-2xs backdrop-blur-md flex items-center justify-center text-foreground hover:bg-accents-1 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer select-none"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>

                {/* Indicadores Dot con Progreso Lineal de Tiempo */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 dark:bg-zinc-900/90 border border-border backdrop-blur-md shadow-2xs">
                    {engines.map((_, dotIdx) => {
                        const isActive = currentEngineSlide === dotIdx;

                        return (
                            <button
                                key={dotIdx}
                                onClick={() => {
                                    setCurrentEngineSlide(dotIdx);
                                }}
                                className="h-9 px-1 flex items-center justify-center cursor-pointer group/dot focus:outline-none select-none"
                                aria-label={`Slide ${dotIdx + 1}`}
                            >
                                <div
                                    className={`relative h-2.5 rounded-full transition-all duration-400 overflow-hidden ${
                                        isActive
                                            ? 'w-9 sm:w-11 bg-foreground/20 dark:bg-white/20'
                                            : 'w-2.5 bg-foreground/20 dark:bg-white/20 group-hover/dot:bg-foreground/40 dark:group-hover/dot:bg-white/40'
                                    }`}
                                >
                                    {isActive && (
                                        <div
                                            key={dotIdx}
                                            className="absolute inset-y-0 left-0 bg-foreground dark:bg-white rounded-full"
                                            style={{
                                                animation: 'engineProgress 5.5s linear forwards',
                                                animationPlayState: isCarouselActive ? 'running' : 'paused',
                                            }}
                                            onAnimationEnd={() => {
                                                if (isCarouselActive) {
                                                    setCurrentEngineSlide((prev) => (prev + 1) % totalEngineSlides);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Botón Play / Pause Circular */}
                <button
                    onClick={() => setIsEngineAutoplay(!isEngineAutoplay)}
                    aria-label={isEngineAutoplay ? 'Pausar rotación automática' : 'Reanudar rotación automática'}
                    className="w-12 h-12 rounded-full bg-background/90 dark:bg-zinc-900/90 border border-border shadow-2xs backdrop-blur-md flex items-center justify-center text-foreground hover:bg-accents-1 dark:hover:bg-zinc-800 active:scale-95 transition-all cursor-pointer select-none"
                >
                    {isEngineAutoplay ? (
                        <Pause className="w-4.5 h-4.5 fill-current" />
                    ) : (
                        <Play className="w-4.5 h-4.5 fill-current ml-0.5" />
                    )}
                </button>
            </div>
        </section>
    );
}
