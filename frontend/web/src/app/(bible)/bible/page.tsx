'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookOpen,
    Columns2,
    Languages,
    ScrollText,
    Library,
    Search,
    MapPin,
    Clock,
    Landmark,
    ArrowRight,
    Check,
    Compass,
    Navigation,
    Bookmark,
    Sparkles,
    Layers,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Pause,
    Play,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageToggle } from '../components/LanguageToggle';
import { BibleLogo } from '../components/BibleLogo';
import { BackToPortalButton } from '../components/BackToPortalButton';

export default function BibleLandingPage() {
    const tLanding = useTranslations('Landing');
    const studyUrl = '/bible/study';

    // Propósito de estudio activo (Inspirado en los filtros de Google Perfil de Negocio)
    const [activePurpose, setActivePurpose] = useState<'daily' | 'compare' | 'originals' | 'history'>('daily');

    // Carrusel interactivo para los 9 Motores de Estudio (Estilo Google Carousel con autoplay y controles)
    const [currentEngineSlide, setCurrentEngineSlide] = useState(0);
    const [isEngineAutoplay, setIsEngineAutoplay] = useState(true);
    const totalEngineSlides = 9;
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

    const engines = [
        {
            href: '/bible/study/standard',
            icon: BookOpen,
            colorClass: 'bg-accents-1 border-accents-2 text-foreground',
            title: tLanding('engine1Title'),
            desc: tLanding('engine1Desc'),
        },
        {
            href: '/bible/study/parallel',
            icon: Columns2,
            colorClass: 'bg-blue-500/10 border-blue-500/20 text-blue-500',
            title: tLanding('engine2Title'),
            desc: tLanding('engine2Desc'),
        },
        {
            href: '/bible/study/interlinear',
            icon: Languages,
            colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-500',
            title: tLanding('engine3Title'),
            desc: tLanding('engine3Desc'),
        },
        {
            href: '/bible/study/literary',
            icon: ScrollText,
            colorClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
            title: tLanding('engine4Title'),
            desc: tLanding('engine4Desc'),
        },
        {
            href: '/bible/study/word-study',
            icon: Library,
            colorClass: 'bg-purple-500/10 border-purple-500/20 text-purple-500',
            title: tLanding('engine5Title'),
            desc: tLanding('engine5Desc'),
        },
        {
            href: '/bible/study/word-study',
            icon: Search,
            colorClass: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500',
            title: tLanding('engine6Title'),
            desc: tLanding('engine6Desc'),
        },
        {
            href: '/bible/study/historical-context',
            icon: MapPin,
            colorClass: 'bg-rose-500/10 border-rose-500/20 text-rose-500',
            title: tLanding('engine7Title'),
            desc: tLanding('engine7Desc'),
        },
        {
            href: '/bible/study/historical-context',
            icon: Clock,
            colorClass: 'bg-amber-400/10 border-amber-400/20 text-amber-500',
            title: tLanding('engine8Title'),
            desc: tLanding('engine8Desc'),
        },
        {
            href: '/bible/study/historical-context',
            icon: Landmark,
            colorClass: 'bg-teal-400/10 border-teal-400/20 text-teal-500',
            title: tLanding('engine9Title'),
            desc: tLanding('engine9Desc'),
        },
    ];

    const versions = [
        {
            code: tLanding('corpusV1Code'),
            name: tLanding('corpusV1Name'),
            tag: tLanding('corpusV1Tag'),
            lang: tLanding('corpusV1Lang'),
            desc: tLanding('corpusV1Desc'),
            sample: tLanding('corpusV1Sample'),
            source: tLanding('corpusV1Source'),
            href: '/bible/study/standard?trans=rv1960',
            dir: 'ltr' as const,
        },
        {
            code: tLanding('corpusV2Code'),
            name: tLanding('corpusV2Name'),
            tag: tLanding('corpusV2Tag'),
            lang: tLanding('corpusV2Lang'),
            desc: tLanding('corpusV2Desc'),
            sample: tLanding('corpusV2Sample'),
            source: tLanding('corpusV2Source'),
            href: '/bible/study/standard?trans=nbla',
            dir: 'ltr' as const,
        },
        {
            code: tLanding('corpusV3Code'),
            name: tLanding('corpusV3Name'),
            tag: tLanding('corpusV3Tag'),
            lang: tLanding('corpusV3Lang'),
            desc: tLanding('corpusV3Desc'),
            sample: tLanding('corpusV3Sample'),
            source: tLanding('corpusV3Source'),
            href: '/bible/study/standard?trans=nvi',
            dir: 'ltr' as const,
        },
        {
            code: tLanding('corpusV4Code'),
            name: tLanding('corpusV4Name'),
            tag: tLanding('corpusV4Tag'),
            lang: tLanding('corpusV4Lang'),
            desc: tLanding('corpusV4Desc'),
            sample: tLanding('corpusV4Sample'),
            source: tLanding('corpusV4Source'),
            href: '/bible/study/standard?trans=ntv',
            dir: 'ltr' as const,
        },
        {
            code: tLanding('corpusV5Code'),
            name: tLanding('corpusV5Name'),
            tag: tLanding('corpusV5Tag'),
            lang: tLanding('corpusV5Lang'),
            desc: tLanding('corpusV5Desc'),
            sample: tLanding('corpusV5Sample'),
            source: tLanding('corpusV5Source'),
            href: '/bible/study/interlinear',
            dir: 'rtl' as const,
        },
        {
            code: tLanding('corpusV6Code'),
            name: tLanding('corpusV6Name'),
            tag: tLanding('corpusV6Tag'),
            lang: tLanding('corpusV6Lang'),
            desc: tLanding('corpusV6Desc'),
            sample: tLanding('corpusV6Sample'),
            source: tLanding('corpusV6Source'),
            href: '/bible/study/parallel',
            dir: 'ltr' as const,
        },
    ];

    const getEngineTheme = (idx: number) => {
        const engineImages = [
            '/bible/images/hero_editorial_dark.jpg',
            '/bible/images/parallel_versions_study.jpg',
            '/bible/images/codex_interlinear_scroll.jpg',
            '/bible/images/chiasm_poetry_manuscript.jpg',
            '/bible/images/strong_lexicon_study.jpg',
            '/bible/images/smart_search_scriptures.jpg',
            '/bible/images/bible_atlas_topography.jpg',
            '/bible/images/historical_timeline_chronology.jpg',
            '/bible/images/manuscripts_heritage.jpg',
        ];

        return {
            bg: 'bg-white dark:bg-[#0c0c0d] border-zinc-200/90 dark:border-zinc-800/80 shadow-[0_4px_24px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_32px_rgba(0,0,0,0.7)]',
            image: engineImages[idx] || engineImages[0],
        };
    };

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background w-full overflow-x-clip">
            {/* Header Sticky */}
            <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/90 backdrop-blur-md">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6 sm:gap-8">
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            <BackToPortalButton />
                            <div className="h-4 w-px bg-accents-2 hidden sm:block select-none" />
                            <BibleLogo size={20} />
                        </div>

                        <nav className="hidden md:flex items-center gap-6 text-xs text-accents-5 font-medium">
                            <a href="#motores" className="hover:text-foreground transition-colors">
                                {tLanding('studyEngines')}
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

            {/* Hero Section con Layering Cinematográfico (Espacio amplio y sin líneas divisorias) */}
            <section className="relative pt-10 pb-20 sm:pt-14 sm:pb-28 overflow-hidden w-full">
                <div className="w-full max-w-[1456px] mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-[1.14] max-w-[1140px] mx-auto">
                        {tLanding('heroTitle')}
                    </h1>

                    <p className="text-[#3c4043] dark:text-zinc-300 text-base sm:text-[18px] max-w-[1200px] mx-auto leading-[1.6]">
                        {tLanding('heroSubtitle')}
                    </p>

                    <div className="flex items-center justify-center pt-1 pb-6">
                        <Link
                            href={studyUrl}
                            className="px-8 py-3.5 text-base font-semibold rounded-full bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer hover:shadow-md active:scale-95"
                        >
                            <span>{tLanding('startStudy')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Capa 1: Fotografía Editorial de Estudio Bíblico Oscuro Minimalista (Sin borde) */}
                    <div className="w-full max-w-[1380px] mx-auto rounded-[28px] sm:rounded-[40px] overflow-hidden relative bg-zinc-950">
                        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-h-[460px] sm:max-h-[480px]">
                            <Image
                                src="/bible/images/hero_editorial_dark.jpg"
                                alt="Escritorio editorial de estudio bíblico con biblia abierta y suite digital"
                                fill
                                priority
                                className="object-cover filter brightness-[0.92] contrast-[1.05] dark:brightness-[0.80] transition-all duration-700"
                            />
                            {/* Degradado inferior sutil para fundir armónicamente con el fondo y la tarjeta flotante */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/35 to-transparent" />
                        </div>
                    </div>

                    {/* Capa 2: Tarjeta Flotante Superpuesta (Bordes nítidos y limpios sin sombra pesada) */}
                    <div className="w-full max-w-4xl mx-auto -mt-16 sm:-mt-24 relative z-10 px-4">
                        <div className="rounded-2xl sm:rounded-3xl border border-black/10 dark:border-white/15 bg-background/95 dark:bg-zinc-950/95 backdrop-blur-xl p-6 sm:p-7 text-left space-y-4">
                            <div className="border-b border-accents-2 pb-3">
                                <span className="text-xs font-mono text-accents-5 font-medium tracking-wide">
                                    {tLanding('previewPassageTitle')}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                                <div className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-accents-1/30 space-y-3">
                                    <div className="flex justify-between font-mono text-xs text-accents-5">
                                        <span>{tLanding('previewVersion1Name')}</span>
                                        <span className="font-semibold text-foreground">{tLanding('previewVersion1Code')}</span>
                                    </div>
                                    <p className="font-serif text-[15px] sm:text-[16px] text-foreground/95 leading-[1.8]">
                                        <sup className="text-[11px] font-mono text-accents-4 mr-1.5">1</sup>
                                        {tLanding('previewVerse1')}{' '}
                                        <sup className="text-[11px] font-mono text-accents-4 mr-1.5">2</sup>
                                        {tLanding('previewVerse2')}
                                    </p>
                                </div>

                                <div className="p-5 sm:p-6 rounded-2xl border border-border/60 bg-accents-1/30 space-y-3" dir="rtl">
                                    <div className="flex justify-between font-mono text-xs text-accents-5" dir="ltr">
                                        <span>{tLanding('previewHebrewName')}</span>
                                        <span className="font-semibold text-foreground">{tLanding('previewHebrewCode')}</span>
                                    </div>
                                    <p className="font-serif text-[16px] sm:text-[17px] text-foreground/95 leading-[1.8]">
                                        <sup className="text-[11px] font-mono text-accents-4 mr-1.5">1</sup>
                                        מִזְמ֥וֹר לְדָוִ֑ד יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃{' '}
                                        <sup className="text-[11px] font-mono text-accents-4 mr-1.5">2</sup>
                                        בִּנְא֣וֹת דֶּ֭שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֣וֹת יְנַהֲלֵֽנִי׃
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: Recursos de Estudio Bíblico (Arquitectura Idéntica a AppleHighlightsCarousel) */}
            <section
                ref={enginesSectionRef}
                id="motores"
                className="w-full flex flex-col gap-6 sm:gap-8 py-12 sm:py-16 md:py-20 overflow-hidden scroll-mt-16 sm:scroll-mt-24 md:scroll-mt-32 [--card-w:82vw] sm:[--card-w:84vw] md:[--card-w:min(82vw,1040px)] [--card-gap:1.5rem] sm:[--card-gap:2rem] md:[--card-gap:2.5rem] border-b border-border/40 select-none"
            >
                {/* Cabecera Equilibrada en 2 Líneas Estilo Google (52-56px en Desktop, Nítida y Proporcionada) */}
                <div className="w-full max-w-[1440px] mx-auto flex flex-col items-center text-center px-4 sm:px-6 lg:px-8 gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h2 className="text-3xl sm:text-5xl md:text-[52px] lg:text-[56px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-[1.12] whitespace-normal sm:whitespace-nowrap">
                        {tLanding('enginesTitle')}
                    </h2>
                    <p className="text-sm sm:text-base lg:text-[17px] text-[#3c4043] dark:text-zinc-400 font-normal leading-normal whitespace-normal sm:whitespace-nowrap max-w-3xl">
                        {tLanding('enginesSubtitle')}
                    </p>
                </div>

                {/* Contenedor del Carrusel Multitarjeta con Laterales Asomados y Centrado Perfecto */}
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

                                        {/* Columna Derecha (55%): Frame Relativo con Soporte de Elementos Sobresalidos (Saliditos) */}
                                        <div className="lg:col-span-7 relative w-full h-[320px] sm:h-[350px] md:h-[370px]">
                                            {/* Viewport de la Fotografía (Con overflow-hidden para recortar bordes redondeados de la foto) */}
                                            <div className="absolute inset-0 rounded-[20px] sm:rounded-[24px] overflow-hidden border border-zinc-200/80 dark:border-zinc-800/90 bg-zinc-950 shadow-inner group/viewport">
                                                <Image
                                                    src={theme.image}
                                                    alt={engine.title}
                                                    fill
                                                    className="object-cover filter brightness-[0.78] contrast-[1.10] group-hover:scale-105 transition-transform duration-700 select-none"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/15 pointer-events-none" />
                                            </div>

                                            {/* 1. LECTURA CLARA Y CONTINUA: Tarjeta "Salidita" en Esquina Inferior Izquierda (Estilo Google) */}
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

                                            {/* 2. COMPARADOR DE VERSIONES: Ventana Flotante Centrada en el Medio */}
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

                                            {/* 3. TEXTO EN IDIOMAS ORIGINALES: Barra Superior Anclada sobre el Códice */}
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

                                            {/* 4. ESTRUCTURA Y POESÍA BÍBLICA: Cajón Lateral Derecho con Árbol Quiástico */}
                                            {idx === 3 && (
                                                <div className="absolute top-3.5 bottom-3.5 right-3.5 z-10 w-full sm:w-[320px] md:w-[335px] flex flex-col justify-center">
                                                    <div className="rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3.5 sm:p-4 shadow-2xl backdrop-blur-xl text-left space-y-1.5 font-mono text-[10px]">
                                                        <div className="flex items-center justify-between text-foreground font-semibold pb-1 border-b border-border text-[10.5px]">
                                                            <span className="flex items-center gap-1.5">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                                Quiasmo Simétrico
                                                            </span>
                                                            <span className="text-accents-4 text-[9.5px]">Salmos 23</span>
                                                        </div>
                                                        <div className="space-y-1 text-accents-5 pt-0.5">
                                                            <div className="text-accents-4">[A] Provisión integral (v.1)</div>
                                                            <div className="pl-2 border-l border-border/80">[B] Reposo y renovación (v.2-3)</div>
                                                            <div className="pl-3 font-semibold text-foreground bg-accents-1 p-1 rounded border-l-2 border-foreground">[C] Clímax: «Tú estás conmigo» (v.4)</div>
                                                            <div className="pl-2 border-l border-border/80">[B'] Banquete ante adversarios (v.5)</div>
                                                            <div className="text-accents-4">[A'] Comunión eterna con Dios (v.6)</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 5. DICCIONARIOS BÍBLICOS Y STRONG: Ficha "Salidita" en Esquina Inferior Izquierda */}
                                            {idx === 4 && (
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

                                            {/* 6. BUSCADOR BÍBLICO INTELIGENTE: Omnibar Spotlight Centrado Superior */}
                                            {idx === 5 && (
                                                <div className="absolute top-4 sm:top-6 inset-x-3 sm:inset-x-6 z-10 flex flex-col items-center">
                                                    <div className="w-full max-w-[420px] rounded-xl sm:rounded-2xl bg-background/95 dark:bg-[#0c0c0d]/95 border border-border/80 dark:border-zinc-800/80 p-3 shadow-2xl backdrop-blur-xl text-left space-y-2.5">
                                                        <div className="p-2.5 rounded-xl bg-accents-1/80 border border-border/80 flex items-center justify-between text-xs font-mono">
                                                            <div className="flex items-center gap-2">
                                                                <Search className="w-3.5 h-3.5 text-foreground" />
                                                                <span className="font-semibold text-foreground">«gracia y verdad»</span>
                                                            </div>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-foreground text-background font-bold">14 hits</span>
                                                        </div>
                                                        <div className="space-y-1.5 text-[10.5px] font-mono text-accents-4 px-1">
                                                            <div className="flex justify-between items-center py-0.5 border-b border-border/40">
                                                                <span>AT: <strong className="text-foreground">Éxodo 34:6</strong></span>
                                                                <span className="text-[9.5px]">Hebreo jésed ve'emet</span>
                                                            </div>
                                                            <div className="flex justify-between items-center py-0.5">
                                                                <span>NT: <strong className="text-foreground">Juan 1:14, 17</strong></span>
                                                                <span className="text-[9.5px]">Griego járis kai alétheia</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* 7. MAPAS BÍBLICOS Y RUTAS: Doble HUD (Ruta Superior + Telemetría Inferior "Salidita" a la Derecha) */}
                                            {idx === 6 && (
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

                                            {/* 8. LÍNEA DE TIEMPO HISTÓRICA: Cinta Cronológica Corrida a lo Ancho */}
                                            {idx === 7 && (
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

                                            {/* 9. ARQUEOLOGÍA Y MANUSCRITOS: Ficha de Registro de Museo Arqueológico a la Derecha */}
                                            {idx === 8 && (
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
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Barra de Control Geist (Vercel Style): Cápsula de Puntos Calibrada + Botón Play Circular */}
                <div className="flex items-center justify-center gap-3.5 pt-2">
                    {/* Cápsula de Puntos y Progreso */}
                    <div className="h-12 px-4.5 sm:px-5.5 rounded-full bg-background/90 dark:bg-zinc-900/90 border border-border shadow-2xs backdrop-blur-md flex items-center gap-1.5 sm:gap-2">
                        {engines.map((_, dotIdx) => {
                            const isActive = dotIdx === currentEngineSlide;

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

                    {/* Botón Play / Pause Circular Geist */}
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

            {/* Sección: Selector Interactivo por Propósito del Lector (Métricas y Proporciones Exactas de Google) */}
            <section id="proposito" className="min-h-screen flex flex-col justify-center py-16 sm:py-20 lg:py-24 bg-black text-white w-full relative">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto text-center my-auto">
                    
                    {/* Selector de pestañas tipo pill (Geist Capsule Compacta responsiva con scroll horizontal en móvil) */}
                    <div className="w-full flex justify-center mb-7 sm:mb-8">
                        <div className="h-[46px] sm:h-[50px] p-1 rounded-full bg-zinc-900/90 border border-zinc-800 gap-1 inline-flex items-center max-w-full overflow-x-auto scrollbar-none shadow-sm">
                            <button
                                onClick={() => setActivePurpose('daily')}
                                className={`h-full inline-flex items-center gap-2 px-3.5 sm:px-5.5 rounded-full text-xs sm:text-[13px] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                                    activePurpose === 'daily'
                                        ? 'bg-white text-black font-semibold shadow-sm'
                                        : 'text-zinc-400 hover:text-white font-medium'
                                }`}
                            >
                                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{tLanding('purposeDaily')}</span>
                            </button>
                            <button
                                onClick={() => setActivePurpose('compare')}
                                className={`h-full inline-flex items-center gap-2 px-3.5 sm:px-5.5 rounded-full text-xs sm:text-[13px] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                                    activePurpose === 'compare'
                                        ? 'bg-white text-black font-semibold shadow-sm'
                                        : 'text-zinc-400 hover:text-white font-medium'
                                }`}
                            >
                                <Columns2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{tLanding('purposeCompare')}</span>
                            </button>
                            <button
                                onClick={() => setActivePurpose('originals')}
                                className={`h-full inline-flex items-center gap-2 px-3.5 sm:px-5.5 rounded-full text-xs sm:text-[13px] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                                    activePurpose === 'originals'
                                        ? 'bg-white text-black font-semibold shadow-sm'
                                        : 'text-zinc-400 hover:text-white font-medium'
                                }`}
                            >
                                <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{tLanding('purposeOriginals')}</span>
                            </button>
                            <button
                                onClick={() => setActivePurpose('history')}
                                className={`h-full inline-flex items-center gap-2 px-3.5 sm:px-5.5 rounded-full text-xs sm:text-[13px] whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                                    activePurpose === 'history'
                                        ? 'bg-white text-black font-semibold shadow-sm'
                                        : 'text-zinc-400 hover:text-white font-medium'
                                }`}
                            >
                                <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                <span>{tLanding('purposeHistory')}</span>
                            </button>
                        </div>
                    </div>

                    {/* Título contextual dinámico Geist (1 sola línea en Desktop, responsivo) */}
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] xl:text-[52px] font-bold text-white tracking-tight leading-tight max-w-full mx-auto mb-5 sm:mb-6 whitespace-normal md:whitespace-nowrap">
                        {activePurpose === 'daily' && tLanding('purposeDailyHeadline')}
                        {activePurpose === 'compare' && tLanding('purposeCompareHeadline')}
                        {activePurpose === 'originals' && tLanding('purposeOriginalsHeadline')}
                        {activePurpose === 'history' && tLanding('purposeHistoryHeadline')}
                    </h2>

                    {/* Botón CTA central Vercel Style */}
                    <div className="mb-8 sm:mb-10">
                        <Link
                            href={
                                activePurpose === 'daily'
                                    ? '/bible/study/standard'
                                    : activePurpose === 'compare'
                                    ? '/bible/study/parallel'
                                    : activePurpose === 'originals'
                                    ? '/bible/study/interlinear'
                                    : '/bible/study/historical-context'
                            }
                            className="inline-flex items-center gap-2.5 px-7 py-3 rounded-full bg-white text-black hover:bg-zinc-200 text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
                        >
                            <span>
                                {activePurpose === 'daily' && tLanding('purposeDailyCta')}
                                {activePurpose === 'compare' && tLanding('purposeCompareCta')}
                                {activePurpose === 'originals' && tLanding('purposeOriginalsCta')}
                                {activePurpose === 'history' && tLanding('purposeHistoryCta')}
                            </span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    {/* Grid de 3 Tarjetas Verticales */}
                    <div className="w-full text-left">
                        {/* TAB 1: LECTURA Y DEVOCIONAL */}
                        {activePurpose === 'daily' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 animate-in fade-in duration-300">
                                {/* Tarjeta 1: Diseño Editorial (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <SlidersHorizontal className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeDailyCard1Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeDailyCard1Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeDailyCard1Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-5 shadow-inner mt-auto space-y-3">
                                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800/80 pb-2.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2.5 py-1 rounded bg-white text-black text-[11px] font-semibold">Serif</span>
                                                <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 text-[11px] font-medium">Sans</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs">
                                                <span className="text-zinc-300 font-mono text-[11px]">18px</span>
                                                <span className="text-zinc-600">·</span>
                                                <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-semibold">Prosa</span>
                                            </div>
                                        </div>

                                        <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-850 space-y-1">
                                            <div className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                                                <span>Salmos 23:2-3 · RVR1960</span>
                                                <span className="text-[9px] text-zinc-500 font-mono">Modo Lectura</span>
                                            </div>
                                            <p className="font-serif text-[12px] sm:text-[13px] text-zinc-200 leading-[1.7]">
                                                {tLanding('purposeDailyCard1Sample')}
                                            </p>
                                        </div>

                                        <div className="space-y-1.5 pt-1 text-xs text-zinc-300 border-t border-zinc-900">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                                                <span className="text-[11.5px]">{tLanding('purposeDailyCard1Feature1')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                                                <span className="text-[11.5px]">{tLanding('purposeDailyCard1Feature2')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                                                <span className="text-[11.5px]">{tLanding('purposeDailyCard1Feature3')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta 2: Notas y Reflexiones (Mockup arriba, Texto abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-5 shadow-inner mb-auto space-y-2.5">
                                        <div className="flex items-center justify-between text-[11px] font-mono border-b border-zinc-800/80 pb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                <span className="font-semibold text-zinc-200 text-xs">{tLanding('purposeDailyCard2NoteTitle')}</span>
                                            </div>
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-300 border border-zinc-800 font-mono">
                                                {tLanding('purposeDailyCard2Storage')}
                                            </span>
                                        </div>

                                        <div className="p-2.5 rounded-lg bg-zinc-950/90 border border-zinc-900 text-[11px] text-zinc-400 font-mono">
                                            <span className="text-zinc-500">Cita anclada: </span>
                                            <span className="text-zinc-300 font-serif italic">{tLanding('purposeDailyCard2VerseContext')}</span>
                                        </div>

                                        <div className="p-3 rounded-xl bg-zinc-950/70 border border-zinc-850">
                                            <p className="font-serif italic text-[12px] sm:text-[12.5px] text-zinc-200 leading-[1.7] border-l-2 border-zinc-600 pl-2.5">
                                                "{tLanding('purposeDailyCard2NoteText')}"
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 text-[10.5px] font-mono text-zinc-400 border-t border-zinc-900">
                                            <div className="flex items-center gap-1.5">
                                                <span className="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[10px]">
                                                    #{tLanding('purposeDailyCard2Tag1')}
                                                </span>
                                                <span className="px-2 py-0.5 rounded bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-[10px]">
                                                    #{tLanding('purposeDailyCard2Tag2')}
                                                </span>
                                            </div>
                                            <span className="text-[9.5px] text-zinc-500">Guardado local</span>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Bookmark className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeDailyCard2Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeDailyCard2Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeDailyCard2Desc')}
                                        </p>
                                    </div>
                                </div>

                                {/* Tarjeta 3: Devocional Diario (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeDailyCard3Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeDailyCard3Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeDailyCard3Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-5 shadow-inner mt-auto space-y-2.5">
                                        <div className="flex items-center justify-between text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 font-semibold border-b border-zinc-800/80 pb-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                                <span>{tLanding('purposeDailyCard3Tag')}</span>
                                            </div>
                                            <span className="text-[9.5px] text-zinc-500 font-normal lowercase tracking-normal font-mono">
                                                {tLanding('purposeDailyCard3Time')}
                                            </span>
                                        </div>

                                        <div className="p-3 rounded-xl bg-zinc-950/90 border border-zinc-850 space-y-1">
                                            <div className="text-[9.5px] font-mono text-amber-400/90 font-medium">
                                                Salmos 23:1 (NBLA)
                                            </div>
                                            <p className="font-serif text-xs sm:text-[13px] text-white font-medium leading-snug">
                                                {tLanding('purposeDailyCard3Verse')}
                                            </p>
                                        </div>

                                        <div className="p-2.5 rounded-xl bg-zinc-950/50 border border-zinc-900/90">
                                            <p className="text-[11.5px] sm:text-xs font-serif text-zinc-300 leading-relaxed italic">
                                                {tLanding('purposeDailyCard3Reflection')}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-zinc-400 border-t border-zinc-900">
                                            <span className="text-zinc-400">{tLanding('purposeDailyCard3Action')}</span>
                                            <span className="text-white font-semibold">✦ 08:00 AM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: COMPARAR VERSIONES */}
                        {activePurpose === 'compare' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 animate-in fade-in duration-300">
                                {/* Tarjeta 1: Vista Paralela (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Columns2 className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeCompareCard1Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeCompareCard1Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeCompareCard1Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mt-auto space-y-2.5 text-xs">
                                        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                                            <div className="font-mono text-[9px] text-zinc-400">{tLanding('purposeCompareCard1V1Name')}</div>
                                            <p className="font-serif text-xs sm:text-[13px] text-zinc-200 leading-snug">"{tLanding('purposeCompareCard1V1Text')}"</p>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                                            <div className="font-mono text-[9px] text-zinc-400">{tLanding('purposeCompareCard1V2Name')}</div>
                                            <p className="font-serif text-xs sm:text-[13px] text-zinc-200 leading-snug">"{tLanding('purposeCompareCard1V2Text')}"</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta 2: Diferencias Resaltadas (Mockup arriba, Texto abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mb-auto space-y-2.5">
                                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-300 font-semibold">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                                            <span>{tLanding('purposeCompareCard2Added')}</span>
                                        </div>
                                        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 text-xs font-serif text-zinc-200 leading-relaxed">
                                            El Señor es mi pastor, <span className="bg-zinc-800 text-white px-1.5 py-0.5 rounded font-semibold underline decoration-zinc-500">nada me faltará</span>.
                                        </div>
                                        <p className="text-[10px] font-mono text-zinc-500 pt-0.5">
                                            {tLanding('purposeCompareCard2Note')}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Layers className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeCompareCard2Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeCompareCard2Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeCompareCard2Desc')}
                                        </p>
                                    </div>
                                </div>

                                {/* Tarjeta 3: Texto Crítico y Lenguas (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Languages className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeCompareCard3Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeCompareCard3Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeCompareCard3Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mt-auto space-y-2 text-xs">
                                        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/80">
                                            <span className="font-mono text-[10px] text-zinc-200 font-medium">{tLanding('purposeCompareCard3M1')}</span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Hebreo</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-950 border border-zinc-800/80">
                                            <span className="font-mono text-[10px] text-zinc-200 font-medium">{tLanding('purposeCompareCard3M2')}</span>
                                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">Griego</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 3: IDIOMAS ORIGINALES */}
                        {activePurpose === 'originals' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 animate-in fade-in duration-300">
                                {/* Tarjeta 1: Interlineal Morfológico (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Languages className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeOriginalsCard1Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeOriginalsCard1Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeOriginalsCard1Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mt-auto space-y-2.5 text-center">
                                        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1.5">
                                            <div className="text-2xl font-serif font-bold text-white tracking-wide" dir="rtl">
                                                {tLanding('purposeOriginalsCard1WordHeb')}
                                            </div>
                                            <div className="text-xs font-mono text-zinc-400 font-medium">
                                                {tLanding('purposeOriginalsCard1Trans')}
                                            </div>
                                            <div className="text-xs sm:text-sm font-semibold text-zinc-200">
                                                {tLanding('purposeOriginalsCard1Gloss')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta 2: Diccionario Strong & BDB (Mockup arriba, Texto abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mb-auto space-y-2.5">
                                        <div className="text-xs font-mono font-semibold text-white">
                                            {tLanding('purposeOriginalsCard2Code')}
                                        </div>
                                        <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed">
                                            {tLanding('purposeOriginalsCard2Meaning')}
                                        </p>
                                        <div className="text-[10.5px] font-mono text-zinc-500 pt-1.5 border-t border-zinc-800 font-medium">
                                            {tLanding('purposeOriginalsCard2Count')}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Library className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeOriginalsCard2Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeOriginalsCard2Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeOriginalsCard2Desc')}
                                        </p>
                                    </div>
                                </div>

                                {/* Tarjeta 3: Estructura Literaria (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <ScrollText className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeOriginalsCard3Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeOriginalsCard3Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeOriginalsCard3Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mt-auto space-y-1.5 text-[10.5px] font-mono">
                                        <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-zinc-400">
                                            {tLanding('purposeOriginalsCard3SymA')}
                                        </div>
                                        <div className="p-2 rounded bg-zinc-950 border border-zinc-800/80 text-zinc-400">
                                            {tLanding('purposeOriginalsCard3SymB')}
                                        </div>
                                        <div className="p-2 rounded bg-white text-black font-semibold">
                                            {tLanding('purposeOriginalsCard3SymC')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 4: MAPAS E HISTORIA */}
                        {activePurpose === 'history' && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 animate-in fade-in duration-300">
                                {/* Tarjeta 1: Geografía y Rutas (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Navigation className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeHistoryCard1Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeHistoryCard1Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeHistoryCard1Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mt-auto space-y-2.5">
                                        <div className="space-y-1.5 text-[10.5px] font-mono text-zinc-300">
                                            <div className="flex items-center gap-2 font-semibold text-white">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                <span>{tLanding('purposeHistoryCard1Stop1')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pl-3 text-zinc-500">
                                                <span>↓</span>
                                                <span>{tLanding('purposeHistoryCard1Stop2')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 pl-3 text-zinc-500">
                                                <span>↓</span>
                                                <span>{tLanding('purposeHistoryCard1Stop3')}</span>
                                            </div>
                                            <div className="flex items-center gap-2 font-semibold text-white">
                                                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                                                <span>{tLanding('purposeHistoryCard1Stop4')}</span>
                                            </div>
                                        </div>
                                        <div className="text-[9.5px] font-mono text-zinc-500 pt-1.5 border-t border-zinc-800">
                                            {tLanding('purposeHistoryCard1Distance')}
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta 2: Cronología Sincrónica (Mockup arriba, Texto abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mb-auto space-y-2 text-[10.5px] font-mono">
                                        <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                                            <span className="text-white font-semibold">{tLanding('purposeHistoryCard2Era1')}</span>
                                            <span className="text-zinc-500 text-[9.5px]">Monarquía</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                                            <span className="text-white font-semibold">{tLanding('purposeHistoryCard2Era2')}</span>
                                            <span className="text-zinc-500 text-[9.5px]">Profecía</span>
                                        </div>
                                        <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                                            <span className="text-white font-semibold">{tLanding('purposeHistoryCard2Era3')}</span>
                                            <span className="text-zinc-500 text-[9.5px]">Imperio</span>
                                        </div>
                                        <div className="text-[9.5px] font-mono text-zinc-500 pt-1 border-t border-zinc-800">
                                            {tLanding('purposeHistoryCard2Time')}
                                        </div>
                                    </div>

                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeHistoryCard2Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeHistoryCard2Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeHistoryCard2Desc')}
                                        </p>
                                    </div>
                                </div>

                                {/* Tarjeta 3: Arqueología Bíblica (Texto arriba, Mockup abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div>
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 mb-2.5 font-semibold flex items-center gap-1.5">
                                            <Landmark className="w-3.5 h-3.5 text-zinc-400" />
                                            <span>{tLanding('purposeHistoryCard3Badge')}</span>
                                        </div>
                                        <h3 className="text-xl sm:text-[22px] font-bold text-white leading-snug mb-2">
                                            {tLanding('purposeHistoryCard3Title')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                                            {tLanding('purposeHistoryCard3Desc')}
                                        </p>
                                    </div>

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mt-auto space-y-2.5">
                                        <div className="text-xs sm:text-sm font-serif font-bold text-white">
                                            {tLanding('purposeHistoryCard3Item')}
                                        </div>
                                        <div className="text-[10.5px] font-mono text-zinc-400">
                                            {tLanding('purposeHistoryCard3Site')}
                                        </div>
                                        <div className="text-[9.5px] font-mono text-zinc-500 pt-1 border-t border-zinc-800">
                                            {tLanding('purposeHistoryCard3Date')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sección: Versiones y Lenguas Originales (Equilibrada con amplitud y aire) */}
            <section id="versiones" className="py-14 sm:py-16 lg:py-20 w-full border-t border-border/40">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto text-center space-y-8 sm:space-y-10">
                    <div className="space-y-2.5 max-w-3xl mx-auto">
                        <h2 className="text-[11px] font-mono uppercase tracking-widest text-[#3c4043] dark:text-zinc-400 font-semibold">
                            {tLanding('corpusBadge')}
                        </h2>
                        <p className="text-3xl sm:text-4xl font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                            {tLanding('corpusTitle')}
                        </p>
                        <p className="text-sm text-[#5f6368] dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed pt-0.5">
                            {tLanding('corpusDesc')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full text-left">
                        {versions.map((v) => (
                            <div
                                key={v.code}
                                className="group relative flex flex-col justify-between p-5 sm:p-6 rounded-[22px] sm:rounded-[26px] border border-border/80 bg-card hover:border-foreground/20 hover:shadow-lg transition-all duration-200 min-h-[255px] sm:min-h-[265px]"
                            >
                                <div className="space-y-3">
                                    {/* Cabecera de la versión */}
                                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-xl sm:text-[22px] font-mono font-bold tracking-tight text-foreground">
                                                {v.code}
                                            </span>
                                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-accents-1 border border-border text-accents-5 font-medium">
                                                {v.tag}
                                            </span>
                                        </div>
                                        <span className="text-[10.5px] font-mono text-accents-4">
                                            {v.lang}
                                        </span>
                                    </div>

                                    {/* Título y descripción */}
                                    <div>
                                        <h3 className="text-[15px] sm:text-base font-bold text-foreground leading-snug">
                                            {v.name}
                                        </h3>
                                        <p className="text-xs sm:text-[12.5px] text-accents-5 leading-relaxed mt-1 line-clamp-2">
                                            {v.desc}
                                        </p>
                                    </div>

                                    {/* Muestra textual representativa */}
                                    <div className="p-3 rounded-xl bg-accents-1/50 border border-border/70 space-y-1">
                                        <div className="text-[9.5px] font-mono text-accents-4 uppercase tracking-wider flex items-center justify-between">
                                            <span>Salmos 23:1</span>
                                            <span className="text-[9px] text-accents-4">Texto Fuente</span>
                                        </div>
                                        <p
                                            dir={v.dir}
                                            className={`font-serif text-xs sm:text-[12.5px] text-foreground leading-relaxed ${
                                                v.dir === 'rtl' ? 'text-right text-sm font-semibold' : ''
                                            }`}
                                        >
                                            {v.sample}
                                        </p>
                                    </div>
                                </div>

                                {/* Pie de la tarjeta con titular de derechos y enlace directo */}
                                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60 text-xs">
                                    <span className="text-[10px] font-mono text-accents-4 truncate max-w-[60%]">
                                        {v.source}
                                    </span>
                                    <Link
                                        href={v.href}
                                        className="inline-flex items-center gap-1.5 text-[11.5px] font-semibold text-foreground hover:text-foreground/70 group-hover:translate-x-0.5 transition-all cursor-pointer"
                                    >
                                        <span>{tLanding('corpusOpenStudy')}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección Oscura Teatral: Manuscritos Antiguos y Lenguas Originales */}
            <section id="manuscritos" className="py-28 sm:py-36 bg-zinc-950 text-white w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
                    <div className="space-y-6 max-w-2xl flex-1">
                        <div className="space-y-2">
                            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                                {tLanding('manuscriptsBadge')}
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-white leading-tight">
                                {tLanding('manuscriptsTitle')}
                            </h2>
                            <p className="text-base sm:text-[17px] text-zinc-300 leading-relaxed pt-1">
                                {tLanding('manuscriptsDesc')}
                            </p>
                        </div>

                        <div className="space-y-3 pt-2">
                            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                                <div className="text-sm font-semibold text-zinc-200">
                                    {tLanding('manuscriptsItem1Title')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                                    {tLanding('manuscriptsItem1Desc')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                                <div className="text-sm font-semibold text-zinc-200">
                                    {tLanding('manuscriptsItem2Title')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                                    {tLanding('manuscriptsItem2Desc')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 space-y-1">
                                <div className="text-sm font-semibold text-zinc-200">
                                    {tLanding('manuscriptsItem3Title')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                                    {tLanding('manuscriptsItem3Desc')}
                                </p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link
                                href="/bible/study/interlinear"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-zinc-950 font-semibold text-sm hover:bg-zinc-100 transition-all shadow-sm cursor-pointer"
                            >
                                <span>{tLanding('manuscriptsCta')}</span>
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    <div className="w-full max-w-md lg:max-w-xl xl:max-w-2xl shrink-0 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative aspect-[4/3]">
                        <Image
                            src="/bible/images/manuscripts_heritage.jpg"
                            alt="Facsímil de Manuscrito Bíblico Antiguo"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-transparent to-transparent" />
                    </div>
                </div>
            </section>

            {/* Sección: Comienza en 3 Pasos Sencillos */}
            <section className="py-24 sm:py-32 bg-accents-1/20 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-12 sm:space-y-16 text-center">
                    <div className="space-y-3 max-w-2xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-[#3c4043] dark:text-zinc-400">
                            {tLanding('stepsBadge')}
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                            {tLanding('stepsTitle')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 text-left">
                        <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs">
                            <div className="w-9 h-9 rounded-full bg-foreground text-background font-mono text-xs font-bold flex items-center justify-center">
                                {tLanding('step1Num')}
                            </div>
                            <h3 className="text-base font-bold text-foreground">{tLanding('step1Title')}</h3>
                            <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                {tLanding('step1Desc')}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs">
                            <div className="w-9 h-9 rounded-full bg-foreground text-background font-mono text-xs font-bold flex items-center justify-center">
                                {tLanding('step2Num')}
                            </div>
                            <h3 className="text-base font-bold text-foreground">{tLanding('step2Title')}</h3>
                            <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                {tLanding('step2Desc')}
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs">
                            <div className="w-9 h-9 rounded-full bg-foreground text-background font-mono text-xs font-bold flex items-center justify-center">
                                {tLanding('step3Num')}
                            </div>
                            <h3 className="text-base font-bold text-foreground">{tLanding('step3Title')}</h3>
                            <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                {tLanding('step3Desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: App Móvil */}
            <section id="movil" className="py-24 sm:py-32 w-full border-t border-border/40">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20">
                    <div className="space-y-6 max-w-2xl flex-1">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#3c4043] dark:text-zinc-400">
                                <span>{tLanding('mobileBadge')}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                                {tLanding('mobileTitle')}
                            </h2>
                            <p className="text-base sm:text-[17px] text-[#3c4043] dark:text-zinc-300 leading-relaxed">
                                {tLanding('mobileDesc')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-sm font-semibold text-foreground">
                                    {tLanding('mobileSpecListEngine')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecListEngineVal')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-sm font-semibold text-foreground">
                                    {tLanding('mobileSpecStorage')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecStorageVal')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-sm font-semibold text-foreground">
                                    {tLanding('mobileSpecNotifications')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecNotificationsVal')}
                                </p>
                            </div>
                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-sm font-semibold text-foreground">
                                    {tLanding('mobileSpecGestures')}
                                </div>
                                <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecGesturesVal')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative mx-auto md:mx-0 shrink-0 w-full max-w-[280px] sm:max-w-[300px]">
                        <div className="rounded-[44px] p-3 bg-zinc-950 border-[3px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
                            <div className="rounded-[34px] bg-background border border-accents-2 overflow-hidden flex flex-col justify-between h-[510px] select-none text-left">
                                <div className="pt-2 px-4 space-y-2 border-b border-accents-2/60 pb-2.5">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-accents-4">
                                        <span>9:41</span>
                                        <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                                        <span className="uppercase text-[9px] tracking-wider">
                                            {tLanding('mobileOfflineReady')}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <div className="font-semibold text-foreground">Salmos 23</div>
                                        <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accents-1 border border-accents-2 text-accents-5">
                                            NBLA
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4 py-3 space-y-2.5 font-serif text-xs leading-relaxed overflow-hidden my-auto">
                                    <div className="text-[9px] font-mono text-accents-4 uppercase tracking-widest pb-1 border-b border-accents-2/40">
                                        El Señor es mi Pastor
                                    </div>
                                    <p className="text-foreground/90">
                                        <sup className="text-[9px] font-mono text-accents-4 mr-1">1</sup>
                                        El Señor es mi pastor, nada me faltará.
                                    </p>
                                    <p className="text-foreground/90">
                                        <sup className="text-[9px] font-mono text-accents-4 mr-1">2</sup>
                                        En lugares de verdes pastos me hace descansar; junto a aguas de reposo me conduce.
                                    </p>
                                    <p className="text-foreground/90">
                                        <sup className="text-[9px] font-mono text-accents-4 mr-1">3</sup>
                                        Conforta mi alma; me guía por senderos de justicia por amor de Su nombre.
                                    </p>
                                    <p className="text-foreground/90">
                                        <sup className="text-[9px] font-mono text-accents-4 mr-1">4</sup>
                                        Aunque pase por el valle de sombra de muerte, no temeré mal alguno...
                                    </p>
                                </div>

                                <div className="pt-2 pb-1.5 border-t border-accents-2/60 bg-accents-1/20">
                                    <div className="flex justify-around text-[10px] font-medium text-accents-4 px-2 pb-2">
                                        <span className="text-foreground font-semibold">Lectura</span>
                                        <span>Paralelo</span>
                                        <span>Estudio</span>
                                        <span>Notas</span>
                                    </div>
                                    <div className="w-24 h-1 bg-foreground/30 rounded-full mx-auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-28 sm:py-36 text-center space-y-6 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 max-w-4xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-[#202124] dark:text-zinc-100">
                        {tLanding('ctaTitle')}
                    </h2>
                    <p className="text-base sm:text-[18px] text-[#3c4043] dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
                        {tLanding('ctaSubtitle')}
                    </p>
                    <div className="pt-4">
                        <Link
                            href={studyUrl}
                            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-foreground text-background font-semibold text-base hover:opacity-90 transition-all shadow-sm cursor-pointer hover:shadow-md"
                        >
                            <span>{tLanding('ctaButton')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-accents-2 w-full py-8 bg-background">
                <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
                    <div>{tLanding('footerCopyright', { year: new Date().getFullYear().toString() })}</div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a href="https://jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerHome')}</a>
                        <span className="text-accents-2">•</span>
                        <a href="https://portfolio.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerPortfolio')}</a>
                        <span className="text-accents-2">•</span>
                        <a href="https://software.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerSoftware')}</a>
                        <span className="text-accents-2">•</span>
                        <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">{tLanding('footerLlms')}</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
