'use client';

import React from 'react';
import Link from 'next/link';
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
    ChevronDown,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageToggle } from '../components/LanguageToggle';
import { BibleLogo } from '../components/BibleLogo';
import { BackToPortalButton } from '../components/BackToPortalButton';

export default function BibleLandingPage() {
    const tLanding = useTranslations('Landing');
    const studyUrl = '/bible/study';

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
            {/* Header Sticky de la Landing (Alineado con el Workspace de Estudio) */}
            <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/90 backdrop-blur-md">
                <div className="w-full px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5 sm:gap-3">
                        <BackToPortalButton />
                        <div className="h-4 w-px bg-accents-2 hidden sm:block select-none" />
                        <BibleLogo size={20} />
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-xs text-accents-5 font-medium">
                        <a href="#motores" className="hover:text-foreground transition-colors">
                            {tLanding('studyEngines')}
                        </a>
                        <a href="#versiones" className="hover:text-foreground transition-colors">
                            {tLanding('versionsAndLanguages')}
                        </a>
                        <a href="#movil" className="hover:text-foreground transition-colors">
                            {tLanding('mobileApp')}
                        </a>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href={studyUrl}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                            <span>{tLanding('openStudy')}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Hero Section a Pantalla Completa */}
            <section className="relative pt-20 pb-16 sm:pt-28 sm:pb-24 overflow-hidden border-b border-accents-2 w-full">
                {/* Glow de fondo suave */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-foreground/5 blur-[140px] rounded-full pointer-events-none -z-10" />

                <div className="w-full px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] max-w-5xl mx-auto">
                        {tLanding('heroTitle')}
                    </h1>

                    <p className="text-accents-5 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
                        {tLanding('heroSubtitle')}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link
                            href={studyUrl}
                            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                            <span>{tLanding('startStudy')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <a
                            href="#motores"
                            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-accents-2 bg-background hover:border-foreground text-foreground transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                            <span>{tLanding('exploreTools')}</span>
                            <ChevronDown className="w-4 h-4 text-accents-5" />
                        </a>
                    </div>

                    {/* Tarjeta de Vista Previa Interactiva del Workspace a Ancho Completo */}
                    <div className="pt-8 w-full max-w-[1700px] mx-auto">
                        <div className="rounded-2xl border border-accents-2 bg-background p-4 sm:p-6 lg:p-8 shadow-xl text-left space-y-4 w-full">
                            <div className="flex items-center justify-between border-b border-accents-2 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                                    <span className="text-[11px] font-mono text-accents-4 ml-2">
                                        {tLanding('previewPassageTitle')}
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accents-1 text-accents-5 border border-accents-2">
                                    {tLanding('livePreviewBadge')}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 text-xs leading-relaxed w-full">
                                <div className="p-4 sm:p-6 rounded-xl border border-accents-2 bg-accents-1/30 space-y-3">
                                    <div className="flex justify-between font-mono text-[10px] text-accents-5">
                                        <span>{tLanding('previewVersion1Name')}</span>
                                        <span>{tLanding('previewVersion1Code')}</span>
                                    </div>
                                    <p className="font-serif text-sm sm:text-base text-foreground/90 leading-relaxed">
                                        <sup className="text-[10px] font-mono text-accents-4 mr-1">1</sup>
                                        {tLanding('previewVerse1')}{' '}
                                        <sup className="text-[10px] font-mono text-accents-4 mr-1">2</sup>
                                        {tLanding('previewVerse2')}
                                    </p>
                                </div>

                                <div className="p-4 sm:p-6 rounded-xl border border-accents-2 bg-accents-1/30 space-y-3" dir="rtl">
                                    <div className="flex justify-between font-mono text-[10px] text-accents-5" dir="ltr">
                                        <span>{tLanding('previewHebrewName')}</span>
                                        <span>{tLanding('previewHebrewCode')}</span>
                                    </div>
                                    <p className="font-serif text-sm sm:text-base text-foreground/90 leading-relaxed">
                                        <sup className="text-[10px] font-mono text-accents-4 mr-1">1</sup>
                                        מִזְמ֥וֹר לְדָוִ֑ד יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃{' '}
                                        <sup className="text-[10px] font-mono text-accents-4 mr-1">2</sup>
                                        בִּנְא֣וֹת דֶּ֭שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֣וֹת יְנַהֲלֵֽנִי׃
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: Los 9 Motores de Estudio Bíblico */}
            <section id="motores" className="py-20 border-b border-accents-2 bg-accents-1/20 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto space-y-12">
                    <div className="text-center space-y-2 max-w-3xl mx-auto">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-accents-5">
                            {tLanding('enginesBadge')}
                        </h2>
                        <p className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                            {tLanding('enginesTitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
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
                                    <h3 className="text-sm font-bold text-foreground">{engine.title}</h3>
                                    <p className="text-xs text-accents-5 leading-relaxed">
                                        {engine.desc}
                                    </p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Sección: Versiones y Lenguas Originales */}
            <section id="versiones" className="py-20 border-b border-accents-2 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1700px] mx-auto text-center space-y-8">
                    <div className="space-y-2 max-w-3xl mx-auto">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-accents-5">
                            {tLanding('corpusBadge')}
                        </h2>
                        <p className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                            {tLanding('corpusTitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full">
                        {versions.map((v) => (
                            <div
                                key={v.code}
                                className="px-4 py-3 rounded-xl border border-accents-2 bg-background shadow-xs text-left w-full"
                            >
                                <div className="text-[10px] font-mono text-accents-4 uppercase">{v.code}</div>
                                <div className="text-xs font-semibold text-foreground">{v.name}</div>
                                <div className="text-[11px] text-accents-5 font-mono">{v.lang}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sección: App Móvil */}
            <section id="movil" className="py-16 sm:py-20 border-b border-accents-2 bg-accents-1/20 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 lg:gap-14">
                    <div className="space-y-6 max-w-xl flex-1">
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 text-xs font-mono text-accents-5">
                                <span>{tLanding('mobileBadge')}</span>
                            </div>
                            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                                {tLanding('mobileTitle')}
                            </h2>
                            <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
                                {tLanding('mobileDesc')}
                            </p>
                        </div>

                        {/* Cuadrícula limpia de las 4 características clave (sin emojis ni iconos SVG) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-xs font-semibold text-foreground">
                                    {tLanding('mobileSpecListEngine')}
                                </div>
                                <p className="text-xs text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecListEngineVal')}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-xs font-semibold text-foreground">
                                    {tLanding('mobileSpecStorage')}
                                </div>
                                <p className="text-xs text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecStorageVal')}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-xs font-semibold text-foreground">
                                    {tLanding('mobileSpecNotifications')}
                                </div>
                                <p className="text-xs text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecNotificationsVal')}
                                </p>
                            </div>

                            <div className="p-4 rounded-xl border border-accents-2 bg-background shadow-xs space-y-1">
                                <div className="text-xs font-semibold text-foreground">
                                    {tLanding('mobileSpecGestures')}
                                </div>
                                <p className="text-xs text-accents-5 leading-relaxed">
                                    {tLanding('mobileSpecGesturesVal')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mockup de Teléfono Móvil Realista */}
                    <div className="relative mx-auto md:mx-0 shrink-0 w-full max-w-[280px] sm:max-w-[300px]">
                        {/* Chasis exterior oscuro con borde biselado y sombra de dispositivo */}
                        <div className="rounded-[44px] p-3 bg-zinc-950 border-[3px] border-zinc-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)]">
                            {/* Pantalla interior del teléfono */}
                            <div className="rounded-[34px] bg-background border border-accents-2 overflow-hidden flex flex-col justify-between h-[510px] select-none text-left">
                                
                                {/* Barra Superior con Dynamic Island y Estado */}
                                <div className="pt-2 px-4 space-y-2 border-b border-accents-2/60 pb-2.5">
                                    <div className="flex items-center justify-between text-[10px] font-mono text-accents-4">
                                        <span>9:41</span>
                                        <div className="w-16 h-3.5 bg-black rounded-full mx-auto" />
                                        <span className="uppercase text-[9px] tracking-wider">
                                            {tLanding('mobileOfflineReady')}
                                        </span>
                                    </div>

                                    {/* Cabecera de la App dentro de la pantalla */}
                                    <div className="flex items-center justify-between pt-1 text-xs">
                                        <div className="font-semibold text-foreground">Salmos 23</div>
                                        <div className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accents-1 border border-accents-2 text-accents-5">
                                            NBLA
                                        </div>
                                    </div>
                                </div>

                                {/* Vista de Lectura Editorial de la App */}
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

                                {/* Barra Inferior de Navegación de la App y Home Indicator */}
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
            <section className="py-20 text-center space-y-6 w-full">
                <div className="w-full px-4 sm:px-6 lg:px-8 space-y-4 max-w-4xl mx-auto">
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                        {tLanding('ctaTitle')}
                    </h2>
                    <p className="text-xs sm:text-sm text-accents-5 max-w-xl mx-auto">
                        {tLanding('ctaSubtitle')}
                    </p>
                    <div className="pt-2">
                        <Link
                            href={studyUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-sm cursor-pointer"
                        >
                            <span>{tLanding('ctaButton')}</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer a Pantalla Completa */}
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
