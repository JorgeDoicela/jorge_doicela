'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface BibleHeroSectionProps {
    studyUrl?: string;
}

export function BibleHeroSection({ studyUrl = '/study' }: BibleHeroSectionProps) {
    const tLanding = useTranslations('Landing');

    return (
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
                            alt="Escritorio editorial de estudio bíblico con biblia abierta y herramientas digitales"
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
    );
}
