'use client';

import React from 'react';
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
    ChevronDown,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BibleLogo } from '../components/BibleLogo';

export default function BibleLandingPage() {
    const studyUrl = '/bible/study';

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-foreground selection:text-background">
            {/* Header Sticky de la Landing */}
            <header className="sticky top-0 z-50 w-full border-b border-accents-2 bg-background/90 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <BibleLogo size={20} />
                        <span className="text-accents-2 font-mono select-none">/</span>
                        <span className="text-xs font-bold tracking-wider uppercase text-foreground">
                            Bible
                        </span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-xs text-accents-5 font-medium">
                        <a href="#motores" className="hover:text-foreground transition-colors">
                            Motores de Estudio
                        </a>
                        <a href="#versiones" className="hover:text-foreground transition-colors">
                            Versiones & Lenguas
                        </a>
                        <a href="#movil" className="hover:text-foreground transition-colors">
                            App Móvil
                        </a>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link
                            href={studyUrl}
                            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                        >
                            <span>Abrir Estudio</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                        <ThemeToggle />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 sm:pt-32 md:pt-36 sm:pb-28 overflow-hidden border-b border-accents-2">
                {/* Glow de fondo suave */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-foreground/5 blur-[120px] rounded-full pointer-events-none -z-10" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
                    <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                        Una Plataforma de Estudio Bíblico
                    </h1>

                    <p className="text-accents-5 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
                        Lectura editorial fluida, exégesis morfológica en Hebreo, Arameo y Griego, análisis de quiasmos semíticos, atlas georreferenciado y sincronismo histórico en un entorno unificado.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <Link
                            href={studyUrl}
                            className="px-5 py-2.5 text-sm font-semibold rounded-xl bg-foreground text-background hover:opacity-90 transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                        >
                            <span>Comenzar Lectura y Estudio</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>

                        <a
                            href="#motores"
                            className="px-5 py-2.5 text-sm font-medium rounded-xl border border-accents-2 bg-background hover:border-foreground text-foreground transition-all flex items-center gap-2 cursor-pointer shadow-xs"
                        >
                            <span>Explorar Herramientas</span>
                            <ChevronDown className="w-4 h-4 text-accents-5" />
                        </a>
                    </div>

                    {/* Tarjeta de Vista Previa Interactiva del Workspace */}
                    <div className="pt-8 max-w-4xl mx-auto">
                        <div className="rounded-2xl border border-accents-2 bg-background p-4 sm:p-6 shadow-xl text-left space-y-4">
                            <div className="flex items-center justify-between border-b border-accents-2 pb-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/40" />
                                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/40" />
                                    <span className="text-[11px] font-mono text-accents-4 ml-2">
                                        Salmos 23:1-4 • Comparación Multi-Versión & Original
                                    </span>
                                </div>
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accents-1 text-accents-5 border border-accents-2">
                                    Live Preview
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                                <div className="p-4 rounded-xl border border-accents-2 bg-accents-1/30 space-y-2">
                                    <div className="flex justify-between font-mono text-[10px] text-accents-5">
                                        <span>Nueva Biblia de las Américas</span>
                                        <span>NBLA</span>
                                    </div>
                                    <p className="font-serif text-sm text-foreground/90 leading-relaxed">
                                        <sup className="text-[10px] font-mono text-accents-4 mr-1">1</sup>
                                        El Señor es mi pastor, nada me faltará.{' '}
                                        <sup className="text-[10px] font-mono text-accents-4 mr-1">2</sup>
                                        En lugares de verdes pastos me hace descansar; junto a aguas de reposo me conduce.
                                    </p>
                                </div>

                                <div className="p-4 rounded-xl border border-accents-2 bg-accents-1/30 space-y-2" dir="rtl">
                                    <div className="flex justify-between font-mono text-[10px] text-accents-5" dir="ltr">
                                        <span>Biblia Hebraica Stuttgartensia</span>
                                        <span>BHS (WLC)</span>
                                    </div>
                                    <p className="font-serif text-sm text-foreground/90 leading-relaxed">
                                        <sup className="text-[10px] font-mono text-accents-4 ml-1">1</sup>
                                        מִזְמ֥וֹר לְדָוִ֑ד יְהוָ֥ה רֹ֝עִ֗י לֹ֣א אֶחְסָֽר׃{' '}
                                        <sup className="text-[10px] font-mono text-accents-4 ml-1">2</sup>
                                        בִּנְא֣וֹת דֶּ֭שֶׁא יַרְבִּיצֵ֑נִי עַל־מֵ֖י מְנֻח֣וֹת יְנַהֲלֵֽנִי׃
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección: Los 9 Motores de Estudio Bíblico */}
            <section id="motores" className="py-20 border-b border-accents-2 bg-accents-1/20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
                    <div className="text-center space-y-2 max-w-2xl mx-auto">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-accents-5">
                            Capacidades Exegéticas
                        </h2>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            9 Módulos Especializados en una Sola Plataforma
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {/* 1. Lectura Editorial */}
                        <Link
                            href="/bible/study/standard"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-accents-1 border border-accents-2 flex items-center justify-center text-foreground font-mono text-sm group-hover:scale-105 transition-transform">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Lectura Editorial Continua</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Lectura en prosa natural con superíndices, alternancia de versículo a versículo, ajuste de tamaño tipográfico y soporte para fuentes Serif y Sans.
                            </p>
                        </Link>

                        {/* 2. Vista Paralela */}
                        <Link
                            href="/bible/study/parallel"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <Columns2 className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Vista Paralela & Diff Textual</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Comparación simultánea de hasta 4 traducciones bíblicas alineadas versículo por versículo, con detección visual de variantes léxicas.
                            </p>
                        </Link>

                        {/* 3. Interlineal Inverso */}
                        <Link
                            href="/bible/study/interlinear"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <Languages className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Interlineal Morfológico Inverso</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Desglose palabra por palabra en Hebreo, Arameo y Griego Koiné con lemas, códigos Strong, análisis morfológico y pronunciación fonética.
                            </p>
                        </Link>

                        {/* 4. Quiasmos */}
                        <Link
                            href="/bible/study/literary"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <ScrollText className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Quiasmos y Análisis Literario</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Visualización de simetrías poéticas concéntricas semíticas (A-B-C-B&apos;-A&apos;) y mapas lógicos de argumentación en las epístolas paulinas.
                            </p>
                        </Link>

                        {/* 5. Léxicos */}
                        <Link
                            href="/bible/study/word-study"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <Library className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Diccionarios Léxicos Strong</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Consulta directa de referencias clásicas: Brown-Driver-Briggs (BDB), Gesenius, Thayer, DTAT, Liddell-Scott-Jones (LSJ) y Robertson.
                            </p>
                        </Link>

                        {/* 6. Búsqueda Morfológica */}
                        <Link
                            href="/bible/study/word-study"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <Search className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Búsqueda Gramatical & FTS5</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Motor de búsqueda de texto completo con operadores booleanos sobre SQLite FTS5 y gráfico canónico de densidad léxica en los 66 libros.
                            </p>
                        </Link>

                        {/* 7. Atlas 3D */}
                        <Link
                            href="/bible/study/historical-context"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <MapPin className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Atlas Bíblico & Rutas Históricas</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Cartografía georreferenciada con coordenadas WGS84, viajes misioneros del apóstol Pablo, ruta del Éxodo y visualización tridimensional.
                            </p>
                        </Link>

                        {/* 8. Línea de Tiempo */}
                        <Link
                            href="/bible/study/historical-context"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <Clock className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Cronología Sincrónica</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Línea de tiempo interactiva que sincroniza los reinos de Judá e Israel con los profetas bíblicos y los imperios contemporáneos.
                            </p>
                        </Link>

                        {/* 9. Arqueología */}
                        <Link
                            href="/bible/study/historical-context"
                            className="p-6 rounded-2xl border border-accents-2 bg-background space-y-3 shadow-xs hover:border-foreground/40 hover:-translate-y-0.5 transition-all block cursor-pointer group"
                        >
                            <div className="w-9 h-9 rounded-xl bg-teal-400/10 border border-teal-400/20 flex items-center justify-center text-teal-500 font-mono text-sm group-hover:scale-105 transition-transform">
                                <Landmark className="w-4 h-4" />
                            </div>
                            <h3 className="text-sm font-bold text-foreground">Actualidad Arqueológica</h3>
                            <p className="text-xs text-accents-5 leading-relaxed">
                                Artículos, hallazgos epigráficos en Tierra Santa, manuscritos de Qumrán y evidencias materiales con filtro apologético e histórico.
                            </p>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Sección: Versiones y Lenguas Originales */}
            <section id="versiones" className="py-20 border-b border-accents-2">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8">
                    <div className="space-y-2">
                        <h2 className="text-xs font-mono uppercase tracking-widest text-accents-5">
                            Corpus Textual
                        </h2>
                        <p className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Lenguas Originales y Traducciones Canónicas
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3">
                        {[
                            { code: 'NBLA', name: 'Nueva Biblia de las Américas', lang: 'Español (Formal)' },
                            { code: 'NTV', name: 'Nueva Traducción Viviente', lang: 'Español (Dinámica)' },
                            { code: 'NIV', name: 'New International Version', lang: 'Inglés (Internacional)' },
                            { code: 'BHS', name: 'Biblia Hebraica Stuttgartensia', lang: 'Hebreo / Arameo' },
                            { code: 'LXX', name: 'Septuaginta Griega', lang: 'Griego Koiné' },
                        ].map((v) => (
                            <div
                                key={v.code}
                                className="px-4 py-3 rounded-xl border border-accents-2 bg-background shadow-xs text-left min-w-[200px]"
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
            <section id="movil" className="py-20 border-b border-accents-2 bg-accents-1/20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="space-y-4 max-w-lg">
                        <div className="inline-flex items-center gap-2 text-xs font-mono text-accents-5">
                            <span>Expo Router • React Native</span>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                            Lectura 100% Offline en la App Móvil
                            (Dios mediante en un futuro)
                        </h2>
                        <p className="text-xs sm:text-sm text-accents-5 leading-relaxed">
                            Desarrollada en <code className="font-mono text-foreground">frontend/mobile</code> para brindar rendimiento fluido a 60 fps con <code className="font-mono text-foreground">FlashList</code>, almacenamiento local cifrado de notas y notificaciones del versículo del día sin depender de conexión a internet.
                        </p>
                    </div>

                    <div className="w-full max-w-sm p-6 rounded-2xl border border-accents-2 bg-background space-y-4 shadow-lg font-mono text-xs">
                        <div className="flex justify-between items-center text-[10px] text-accents-4 border-b border-accents-2 pb-2">
                            <span>MOBILE SPECS</span>
                            <span className="text-emerald-500">OFFLINE READY</span>
                        </div>
                        <div className="space-y-2 text-accents-6">
                            <div className="flex justify-between">
                                <span>Motor de Listas:</span>
                                <span className="text-foreground">Shopify FlashList</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Almacenamiento:</span>
                                <span className="text-foreground">expo-file-system</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Notificaciones:</span>
                                <span className="text-foreground">expo-notifications</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Gestos:</span>
                                <span className="text-foreground">Swipe entre capítulos</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-20 text-center space-y-6">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
                    <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
                        Comienza tu Estudio Bíblico
                    </h2>
                    <p className="text-xs sm:text-sm text-accents-5 max-w-lg mx-auto">
                        Accede de forma inmediata a la plataforma sin necesidad de registro ni configuraciones complejas.
                    </p>
                    <div className="pt-2">
                        <Link
                            href={studyUrl}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-all shadow-sm cursor-pointer"
                        >
                            <span>Abrir Estudio Bíblico Ahora</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-accents-2 w-full py-8 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] font-mono text-accents-4">
                    <div>Jorge Doicela &copy; {new Date().getFullYear()} • Estudio de la biblia</div>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <a href="https://jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Inicio</a>
                        <span className="text-accents-2">•</span>
                        <a href="https://portfolio.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Portafolio</a>
                        <span className="text-accents-2">•</span>
                        <a href="https://software.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Software</a>
                        <span className="text-accents-2">•</span>
                        <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">llms.txt</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
