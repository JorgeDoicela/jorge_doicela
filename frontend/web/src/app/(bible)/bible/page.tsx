'use client';

import React, { useState } from 'react';
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
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background w-full">
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
                            <a href="#proposito" className="hover:text-foreground transition-colors">
                                {tLanding('purposeTitle')}
                            </a>
                            <a href="#motores" className="hover:text-foreground transition-colors">
                                {tLanding('studyEngines')}
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

            {/* Sección: Selector Interactivo por Propósito del Lector */}
            <section id="proposito" className="py-24 sm:py-32 bg-accents-1/20 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10 text-center">
                    <div className="space-y-3 max-w-2xl mx-auto">
                        <div className="text-xs font-mono uppercase tracking-widest text-[#3c4043] dark:text-zinc-400">
                            {tLanding('purposeBadge')}
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                            {tLanding('purposeTitle')}
                        </h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto">
                        <button
                            onClick={() => setActivePurpose('daily')}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activePurpose === 'daily'
                                    ? 'bg-foreground text-background shadow-sm'
                                    : 'bg-background text-accents-5 border border-accents-2 hover:text-foreground'
                                }`}
                        >
                            {tLanding('purposeDaily')}
                        </button>
                        <button
                            onClick={() => setActivePurpose('compare')}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activePurpose === 'compare'
                                    ? 'bg-foreground text-background shadow-sm'
                                    : 'bg-background text-accents-5 border border-accents-2 hover:text-foreground'
                                }`}
                        >
                            {tLanding('purposeCompare')}
                        </button>
                        <button
                            onClick={() => setActivePurpose('originals')}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activePurpose === 'originals'
                                    ? 'bg-foreground text-background shadow-sm'
                                    : 'bg-background text-accents-5 border border-accents-2 hover:text-foreground'
                                }`}
                        >
                            {tLanding('purposeOriginals')}
                        </button>
                        <button
                            onClick={() => setActivePurpose('history')}
                            className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all cursor-pointer ${activePurpose === 'history'
                                    ? 'bg-foreground text-background shadow-sm'
                                    : 'bg-background text-accents-5 border border-accents-2 hover:text-foreground'
                                }`}
                        >
                            {tLanding('purposeHistory')}
                        </button>
                    </div>

                    <div className="w-full text-left">
                        {activePurpose === 'daily' && (
                            <div className="p-6 sm:p-8 rounded-3xl border border-accents-2 bg-background shadow-xl space-y-6 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accents-2 pb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                            {tLanding('purposeDailyCardTitle')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-accents-5">
                                            {tLanding('purposeDailyCardDesc')}
                                        </p>
                                    </div>
                                    <Link
                                        href="/bible/study/standard"
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
                                    >
                                        <span>{tLanding('openStudy')}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="p-5 sm:p-6 rounded-2xl bg-accents-1/30 border border-accents-2 font-serif text-sm sm:text-base leading-relaxed space-y-3">
                                    <p className="text-foreground/90">
                                        <sup className="text-xs font-mono text-accents-4 mr-1.5">1</sup>
                                        {tLanding('purposeDailyVerse1')}
                                    </p>
                                    <p className="text-foreground/90">
                                        <sup className="text-xs font-mono text-accents-4 mr-1.5">2</sup>
                                        {tLanding('purposeDailyVerse2')}
                                    </p>
                                </div>
                            </div>
                        )}

                        {activePurpose === 'compare' && (
                            <div className="p-6 sm:p-8 rounded-3xl border border-accents-2 bg-background shadow-xl space-y-6 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accents-2 pb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                            {tLanding('purposeCompareCardTitle')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-accents-5">
                                            {tLanding('purposeCompareCardDesc')}
                                        </p>
                                    </div>
                                    <Link
                                        href="/bible/study/parallel"
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
                                    >
                                        <span>{tLanding('openStudy')}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl bg-accents-1/30 border border-accents-2 space-y-2">
                                        <div className="text-xs font-mono text-accents-4 uppercase">
                                            {tLanding('purposeCompareV1Title')}
                                        </div>
                                        <p className="font-serif text-sm sm:text-[15px] text-foreground/95 leading-relaxed">
                                            "{tLanding('purposeCompareV1Text')}"
                                        </p>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-accents-1/30 border border-accents-2 space-y-2">
                                        <div className="text-xs font-mono text-accents-4 uppercase">
                                            {tLanding('purposeCompareV2Title')}
                                        </div>
                                        <p className="font-serif text-sm sm:text-[15px] text-foreground/95 leading-relaxed">
                                            "{tLanding('purposeCompareV2Text')}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePurpose === 'originals' && (
                            <div className="p-6 sm:p-8 rounded-3xl border border-accents-2 bg-background shadow-xl space-y-6 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accents-2 pb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                            {tLanding('purposeOriginalsCardTitle')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-accents-5">
                                            {tLanding('purposeOriginalsCardDesc')}
                                        </p>
                                    </div>
                                    <Link
                                        href="/bible/study/interlinear"
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
                                    >
                                        <span>{tLanding('openStudy')}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="p-5 sm:p-6 rounded-2xl bg-accents-1/30 border border-accents-2 flex flex-wrap items-center gap-3">
                                    <div className="px-4 py-3 rounded-xl bg-background border border-accents-2 text-center space-y-1">
                                        <div className="text-xs font-mono text-accents-4">H7462</div>
                                        <div className="text-base font-serif font-bold text-foreground" dir="rtl">רֹעִ֥י</div>
                                        <div className="text-xs text-accents-5">ro'í (Mi pastor)</div>
                                    </div>
                                    <div className="px-4 py-3 rounded-xl bg-background border border-accents-2 text-center space-y-1">
                                        <div className="text-xs font-mono text-accents-4">H3068</div>
                                        <div className="text-base font-serif font-bold text-foreground" dir="rtl">יְהוָ֥ה</div>
                                        <div className="text-xs text-accents-5">Yahweh (El Señor)</div>
                                    </div>
                                    <div className="px-4 py-3 rounded-xl bg-background border border-accents-2 text-center space-y-1">
                                        <div className="text-xs font-mono text-accents-4">H3808</div>
                                        <div className="text-base font-serif font-bold text-foreground" dir="rtl">לֹ֣א</div>
                                        <div className="text-xs text-accents-5">lo (No)</div>
                                    </div>
                                    <div className="px-4 py-3 rounded-xl bg-background border border-accents-2 text-center space-y-1">
                                        <div className="text-xs font-mono text-accents-4">H2637</div>
                                        <div className="text-base font-serif font-bold text-foreground" dir="rtl">אֶחְסָֽר</div>
                                        <div className="text-xs text-accents-5">echsar (Careceré)</div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activePurpose === 'history' && (
                            <div className="p-6 sm:p-8 rounded-3xl border border-accents-2 bg-background shadow-xl space-y-6 animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-accents-2 pb-4">
                                    <div className="space-y-1">
                                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                                            {tLanding('purposeHistoryCardTitle')}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-accents-5">
                                            {tLanding('purposeHistoryCardDesc')}
                                        </p>
                                    </div>
                                    <Link
                                        href="/bible/study/historical-context"
                                        className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background text-xs sm:text-sm font-semibold hover:opacity-90 transition-all self-start sm:self-auto cursor-pointer shadow-xs"
                                    >
                                        <span>{tLanding('openStudy')}</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                                <div className="p-5 sm:p-6 rounded-2xl bg-accents-1/30 border border-accents-2 space-y-2">
                                    <div className="text-xs font-mono text-accents-4 uppercase">
                                        Mediterráneo Oriental • Siglo I
                                    </div>
                                    <div className="font-mono text-xs sm:text-sm text-foreground font-medium">
                                        {tLanding('purposeHistoryRoute')}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Sección: Los 9 Motores de Estudio Bíblico */}
            <section id="motores" className="py-24 sm:py-32 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
                    <div className="text-center space-y-3 max-w-3xl mx-auto">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-[#3c4043] dark:text-zinc-400">
                            {tLanding('enginesBadge')}
                        </h2>
                        <p className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-[#202124] dark:text-zinc-100 leading-tight">
                            {tLanding('enginesTitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
                        {engines.map((engine, idx) => {
                            const Icon = engine.icon;
                            return (
                                <Link
                                    key={idx}
                                    href={engine.href}
                                    className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                                >
                                    <div className={`w-9 h-9 rounded-xl border flex items-center justify-center font-mono text-sm group-hover:scale-105 transition-transform ${engine.colorClass}`}>
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <h3 className="text-base font-bold text-foreground">{engine.title}</h3>
                                    <p className="text-xs sm:text-[13px] text-accents-5 leading-relaxed">
                                        {engine.desc}
                                    </p>
                                </Link>
                            );
                        })}
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
