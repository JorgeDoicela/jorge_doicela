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
        { code: 'NBLA', name: 'Nueva Biblia de las Américas', lang: tLanding('corpusV1Lang') },
        { code: 'NTV', name: 'Nueva Traducción Viviente', lang: tLanding('corpusV2Lang') },
        { code: 'NIV', name: 'New International Version', lang: tLanding('corpusV3Lang') },
        { code: 'BHS', name: 'Biblia Hebraica Stuttgartensia', lang: tLanding('corpusV4Lang') },
        { code: 'LXX', name: 'Septuaginta Griega', lang: tLanding('corpusV5Lang') },
    ];

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
                                    className="shrink-0 rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 p-6 sm:p-10 md:p-12 backdrop-blur-2xl transition-all duration-700 relative overflow-hidden flex flex-col justify-between h-[520px] sm:h-[490px] md:h-[510px] cursor-pointer group opacity-100"
                                >
                                    {/* Cabecera Interna: Limpia, directa, alineada a la izquierda sin iconos */}
                                    <div className="flex flex-col text-left max-w-2xl gap-1.5 mb-2">
                                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-foreground leading-snug">
                                            {engine.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm md:text-base text-accents-5 font-normal leading-relaxed">
                                            {engine.desc}
                                        </p>
                                    </div>

                                    {/* Contenido Visual con Separadores Sutiles y Espaciado Amplio Alineado Naturalmente */}
                                    <div className="w-full flex-grow flex flex-col justify-center my-2">
                                        {/* 1. LECTURA CLARA Y CONTINUA */}
                                        {idx === 0 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="flex flex-col gap-1 border-b border-card-border pb-3">
                                                    <p className="text-base sm:text-xl md:text-2xl font-serif italic text-foreground leading-relaxed">
                                                        &ldquo;El Señor es mi pastor, nada me faltará. En lugares de verdes pastos me hace descansar; junto a aguas de reposo me conduce.&rdquo;
                                                    </p>
                                                    <span className="text-xs sm:text-sm text-accents-5 font-normal">
                                                        Salmos 23:1-2 · Modo Lectura Continua en Prosa
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-0.5 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Tipografía Editorial</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Fuentes Serif & Sans adaptativas</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:px-6 py-2 sm:py-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Ajuste Visual</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Tamaño de 14px a 28px sin cortes</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Cero Distracciones</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Modo inmersivo de página limpia</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 2. COMPARADOR DE VERSIONES */}
                                        {idx === 1 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-2">
                                                    <div className="flex flex-col gap-1.5 sm:pr-8 pb-3 sm:pb-0">
                                                        <span className="text-xs font-semibold text-blue-500 uppercase tracking-wider">
                                                            NBLA (Nueva Biblia de las Américas)
                                                        </span>
                                                        <p className="text-xs sm:text-sm md:text-base font-serif text-foreground leading-relaxed">
                                                            &ldquo;El Señor es mi pastor, nada me faltará.&rdquo;
                                                        </p>
                                                        <span className="text-[11px] text-accents-4">Traducción formal y equivalencia estricta</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 sm:pl-8 pt-3 sm:pt-0">
                                                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                            NTV (Nueva Traducción Viviente)
                                                        </span>
                                                        <p className="text-xs sm:text-sm md:text-base font-serif text-foreground leading-relaxed">
                                                            &ldquo;El Señor es mi pastor; tengo todo lo que necesito.&rdquo;
                                                        </p>
                                                        <span className="text-[11px] text-accents-4">Claridad dinámica contemporánea</span>
                                                    </div>
                                                </div>
                                                <div className="p-3 rounded-xl bg-accents-1 border border-border/60 text-xs font-mono text-accents-5 flex items-center justify-between">
                                                    <span>Algoritmo LCS de Diferencia Textual:</span>
                                                    <span className="font-semibold text-blue-500">«nada me faltará» vs «tengo todo lo que necesito»</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* 3. TEXTO EN IDIOMAS ORIGINALES (INTERLINEAL) */}
                                        {idx === 2 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="flex items-center justify-between border-b border-card-border pb-3">
                                                    <div className="text-2xl sm:text-3xl font-serif text-foreground font-bold" dir="rtl">
                                                        יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃
                                                    </div>
                                                    <span className="text-xs font-mono text-amber-500 font-semibold uppercase px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20">
                                                        BHS Masorético
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-0.5 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Adonay (Strong H3068)</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Nombre propio divino · El Señor</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:px-6 py-2 sm:py-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Ro'í (Strong H7462)</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Verbo qal participio · Mi pastor</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Lo Ehsar (Strong H2637)</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Qal imperfecto · No careceré</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 4. ESTRUCTURA Y POESÍA BÍBLICA */}
                                        {idx === 3 && (
                                            <div className="w-full flex flex-col justify-center gap-3 text-left py-1">
                                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-1.5 sm:pr-6 pb-3 sm:pb-0 font-mono text-xs">
                                                        <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wider">
                                                            Estructura Quiástica Simétrica (A-B-C-B'-A')
                                                        </span>
                                                        <div className="space-y-1 text-accents-5 text-[11px]">
                                                            <div>[A] Provisión divina integral (Sal 23:1)</div>
                                                            <div className="pl-3">[B] Reposo y renovación del alma (v.2-3)</div>
                                                            <div className="pl-6 font-semibold text-foreground bg-emerald-500/10 p-1 rounded border-l-2 border-emerald-500">[C] Clímax: «Tú estás conmigo» (v.4)</div>
                                                            <div className="pl-3">[B'] Provisión de banquete ante adversarios (v.5)</div>
                                                            <div>[A'] Comunión eterna en la casa del Señor (v.6)</div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col gap-1.5 sm:pl-6 pt-3 sm:pt-0">
                                                        <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                                                            Paralelismo Poético Hebreo
                                                        </span>
                                                        <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
                                                            Identificación automática de paralelismo sinónimo, antitético y sintético para entender la cadencia y énfasis teológico del texto sagrado.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 5. DICCIONARIOS BÍBLICOS Y NÚMEROS STRONG */}
                                        {idx === 4 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="flex items-center justify-between border-b border-card-border pb-3">
                                                    <div>
                                                        <span className="text-xs font-mono font-bold text-purple-500">Strong H7462 · Léxico BDB / Gesenius</span>
                                                        <p className="text-lg sm:text-2xl font-bold font-serif text-foreground mt-0.5">רָעָה (ra'ah) — Apacentar, pastorear</p>
                                                    </div>
                                                    <span className="text-xs font-mono text-accents-4 px-2.5 py-1 rounded bg-accents-1">
                                                        173 apariciones en AT
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-0.5 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Significado Primario</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Cuidar rebaño, alimentar, guiar</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:px-6 py-2 sm:py-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Frecuencia Canónica</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Salmos (21), Isaías (24), Jeremías (25)</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Equivalente LXX Griego</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">ποιμαίνω (poimaino - G4165)</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 6. BUSCADOR BÍBLICO INTELIGENTE */}
                                        {idx === 5 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="p-3 rounded-xl bg-accents-1 border border-border/80 flex items-center justify-between text-xs font-mono">
                                                    <div className="flex items-center gap-2">
                                                        <Search className="w-4 h-4 text-cyan-500" />
                                                        <span className="font-semibold text-foreground">«gracia y verdad» (Juan 1:14, 1:17)</span>
                                                    </div>
                                                    <span className="text-cyan-500 font-bold">14 resultados en 66 libros</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-1 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs font-mono font-semibold text-cyan-500">Antiguo Testamento (Hebreo jésed ve'emet)</span>
                                                        <p className="text-xs sm:text-sm text-accents-5">Éxodo 34:6, Salmos 85:10 · Pacto eterno de misericordia y fidelidad</p>
                                                    </div>
                                                    <div className="flex flex-col gap-1 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs font-mono font-semibold text-cyan-500">Nuevo Testamento (Griego járis kai alétheia)</span>
                                                        <p className="text-xs sm:text-sm text-accents-5">Evangelio de Juan 1 · Plenitud manifestada en la persona de Jesucristo</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 7. MAPAS BÍBLICOS Y LUGARES SAGRADOS */}
                                        {idx === 6 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="flex items-center justify-between border-b border-card-border pb-3">
                                                    <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>Atlas Bíblico Geo-Referenciado · Rutas Apostólicas Siglo I</span>
                                                    </div>
                                                    <span className="text-xs font-mono text-accents-4">420+ Sitios Correlacionados</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-0.5 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">1er Viaje Paulino</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Antioquía, Chipre, Perge, Listra (2,250 km)</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:px-6 py-2 sm:py-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Topografía Bíblica</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Relieve montañoso, cuenca del Jordán y Galilea</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Ciudades Históricas</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Jerusalén, Éfeso, Corinto, Atenas y Roma</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 8. LÍNEA DE TIEMPO HISTÓRICA */}
                                        {idx === 7 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="flex items-center justify-between border-b border-card-border pb-3">
                                                    <span className="text-xs font-mono font-bold text-amber-500 uppercase">
                                                        Cronología Sincrónica Bíblica & Arqueológica
                                                    </span>
                                                    <span className="text-xs font-mono text-accents-4">c. 2000 a.C. - 100 d.C.</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-0.5 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Monarquía & Templo</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Reyes David y Salomón (c. 1000 - 930 a.C.)</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:px-6 py-2 sm:py-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Profetas & Exilio</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Imperios Asirio y Babilónico (c. 722 - 586 a.C.)</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Periodo Greco-Romano</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Segundo Templo e Iglesia Apostólica</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* 9. ARQUEOLOGÍA Y MANUSCRITOS ANTIGUOS */}
                                        {idx === 8 && (
                                            <div className="w-full flex flex-col justify-center gap-4 text-left py-1">
                                                <div className="flex items-center justify-between border-b border-card-border pb-3">
                                                    <span className="text-xs font-mono font-bold text-teal-500 uppercase">
                                                        Testimonio Textual e Historiografía
                                                    </span>
                                                    <span className="text-xs font-mono text-accents-4">Manuscritos del Mar Muerto</span>
                                                </div>
                                                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-card-border pt-1">
                                                    <div className="flex flex-col gap-0.5 sm:pr-6 pb-2 sm:pb-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Gran Rollo de Isaías</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">1QIsaª (c. 125 a.C.) · 54 columnas íntegras</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:px-6 py-2 sm:py-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Códice de Leningrado</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">Año 1008 d.C. · Base masorética universal</span>
                                                    </div>
                                                    <div className="flex flex-col gap-0.5 sm:pl-6 pt-2 sm:pt-0">
                                                        <span className="text-xs sm:text-sm font-semibold text-foreground">Papiros del NT</span>
                                                        <span className="text-[11px] sm:text-xs text-accents-5">P52, Chester Beatty y Códice Sinaítico</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </div>

                                    {/* Botón de Enlace Directo Simple Anclado Abajo a la Derecha */}
                                    <div className="flex items-center justify-end pt-3 border-t border-card-border">
                                        <Link
                                            href={engine.href}
                                            onClick={(e) => {
                                                if (!isActive) {
                                                    e.preventDefault();
                                                    setCurrentEngineSlide(idx);
                                                }
                                            }}
                                            className="inline-flex items-center px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm tracking-tight group-hover:opacity-90 active:scale-95 transition-all cursor-pointer select-none shadow-xs"
                                        >
                                            <span>Explorar herramienta</span>
                                        </Link>
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
                    
                    {/* Selector de pestañas tipo pill (Geist Capsule Compacta: h-[48px] sm:h-[50px], p-1) */}
                    <div className="h-[48px] sm:h-[50px] p-1 rounded-full bg-zinc-900/90 border border-zinc-800 gap-1 inline-flex items-center justify-center max-w-full shadow-sm mb-6 sm:mb-7">
                        <button
                            onClick={() => setActivePurpose('daily')}
                            className={`h-full inline-flex items-center gap-2 px-4 sm:px-5.5 rounded-full text-xs sm:text-[13px] transition-all cursor-pointer ${
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
                            className={`h-full inline-flex items-center gap-2 px-4 sm:px-5.5 rounded-full text-xs sm:text-[13px] transition-all cursor-pointer ${
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
                            className={`h-full inline-flex items-center gap-2 px-4 sm:px-5.5 rounded-full text-xs sm:text-[13px] transition-all cursor-pointer ${
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
                            className={`h-full inline-flex items-center gap-2 px-4 sm:px-5.5 rounded-full text-xs sm:text-[13px] transition-all cursor-pointer ${
                                activePurpose === 'history'
                                    ? 'bg-white text-black font-semibold shadow-sm'
                                    : 'text-zinc-400 hover:text-white font-medium'
                            }`}
                        >
                            <Navigation className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            <span>{tLanding('purposeHistory')}</span>
                        </button>
                    </div>

                    {/* Título contextual dinámico Geist (1 sola línea en Desktop, responsivo) */}
                    <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] xl:text-[52px] font-bold text-white tracking-tight leading-tight max-w-full mx-auto mb-4 whitespace-normal md:whitespace-nowrap">
                        {activePurpose === 'daily' && tLanding('purposeDailyHeadline')}
                        {activePurpose === 'compare' && tLanding('purposeCompareHeadline')}
                        {activePurpose === 'originals' && tLanding('purposeOriginalsHeadline')}
                        {activePurpose === 'history' && tLanding('purposeHistoryHeadline')}
                    </h2>

                    {/* Botón CTA central Vercel Style */}
                    <div className="mb-7 sm:mb-9">
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

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mt-auto space-y-3.5">
                                        <div className="flex items-center justify-between text-xs font-mono text-zinc-400 border-b border-zinc-800 pb-2.5">
                                            <span className="px-2.5 py-1 rounded bg-white text-black text-[11px] font-semibold">Serif</span>
                                            <span className="text-xs text-zinc-300">18px</span>
                                            <span className="px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-semibold">Prosa</span>
                                        </div>
                                        <div className="space-y-2 text-xs text-zinc-300">
                                            <div className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                                                <span>{tLanding('purposeDailyCard1Feature1')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Check className="w-3.5 h-3.5 text-white shrink-0" />
                                                <span>{tLanding('purposeDailyCard1Feature2')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarjeta 2: Notas y Reflexiones (Mockup arriba, Texto abajo) */}
                                <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mb-auto space-y-2.5">
                                        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                                            <span className="font-semibold text-zinc-200 text-xs">{tLanding('purposeDailyCard2NoteTitle')}</span>
                                            <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 text-zinc-400 border border-zinc-800">Privado</span>
                                        </div>
                                        <p className="font-serif italic text-xs sm:text-[13.5px] text-zinc-300 leading-relaxed border-l-2 border-zinc-700 pl-3">
                                            "{tLanding('purposeDailyCard2NoteText')}"
                                        </p>
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

                                    <div className="bg-black border border-zinc-800/80 rounded-[20px] p-5 shadow-inner mt-auto space-y-2.5">
                                        <div className="text-[10.5px] font-mono tracking-wider uppercase text-zinc-400 font-semibold flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                            <span>{tLanding('purposeDailyCard3Tag')}</span>
                                        </div>
                                        <p className="font-serif text-xs sm:text-sm text-white font-medium leading-snug">
                                            {tLanding('purposeDailyCard3Verse')}
                                        </p>
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

            {/* Sección: Versiones y Lenguas Originales */}
            <section id="versiones" className="py-24 sm:py-32 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
                    <div className="space-y-3 max-w-2xl mx-auto">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-[#3c4043] dark:text-zinc-400">
                            {tLanding('corpusBadge')}
                        </h2>
                        <p className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                            {tLanding('corpusTitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 w-full">
                        {versions.map((v) => (
                            <div
                                key={v.code}
                                className="px-4 py-3 rounded-xl border border-accents-2 bg-background shadow-xs text-left w-full"
                            >
                                <div className="text-xs font-mono text-accents-4 uppercase">{v.code}</div>
                                <div className="text-xs sm:text-sm font-semibold text-foreground">{v.name}</div>
                                <div className="text-xs text-accents-5 font-mono">{v.lang}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección Oscura Teatral: Manuscritos Antiguos y Lenguas Originales */}
            <section id="manuscritos" className="py-28 sm:py-36 bg-zinc-950 text-white w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="space-y-6 max-w-xl">
                        <div className="space-y-2">
                            <span className="text-xs font-mono uppercase tracking-widest text-amber-400">
                                {tLanding('manuscriptsBadge')}
                            </span>
                            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-tight">
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

                    <div className="w-full max-w-sm lg:max-w-md shrink-0 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl relative aspect-[4/3]">
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
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12 text-center">
                    <div className="space-y-3 max-w-2xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-[#3c4043] dark:text-zinc-400">
                            {tLanding('stepsBadge')}
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                            {tLanding('stepsTitle')}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
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
            <section id="movil" className="py-24 sm:py-32 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-14">
                    <div className="space-y-6 max-w-xl flex-1">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#3c4043] dark:text-zinc-400">
                                <span>{tLanding('mobileBadge')}</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
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
