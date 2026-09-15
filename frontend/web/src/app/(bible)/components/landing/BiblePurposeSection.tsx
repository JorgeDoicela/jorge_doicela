'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
    BookOpen,
    Columns2,
    Languages,
    Navigation,
    SlidersHorizontal,
    Check,
    Sparkles,
    Layers,
    ScrollText,
    Library,
    Clock,
    Landmark,
    Bookmark,
    ArrowRight,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BiblePurposeSection() {
    const tLanding = useTranslations('Landing');
    const [activePurpose, setActivePurpose] = useState<'daily' | 'compare' | 'originals' | 'history'>('daily');

    return (
        <section id="proposito" className="min-h-screen flex flex-col justify-center py-16 sm:py-20 lg:py-24 bg-black text-white w-full relative">
            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto text-center my-auto">
                
                {/* Selector de pestañas tipo pill (Geist Capsule Compacta responsiva) */}
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

                {/* Título contextual dinámico */}
                <h2 className="text-3xl sm:text-4xl md:text-[42px] lg:text-[48px] xl:text-[52px] font-bold text-white tracking-tight leading-tight max-w-full mx-auto mb-5 sm:mb-6 whitespace-normal md:whitespace-nowrap">
                    {activePurpose === 'daily' && tLanding('purposeDailyHeadline')}
                    {activePurpose === 'compare' && tLanding('purposeCompareHeadline')}
                    {activePurpose === 'originals' && tLanding('purposeOriginalsHeadline')}
                    {activePurpose === 'history' && tLanding('purposeHistoryHeadline')}
                </h2>

                {/* Botón CTA central */}
                <div className="mb-8 sm:mb-10">
                    <Link
                        href={
                            activePurpose === 'daily'
                                ? '/study/standard'
                                : activePurpose === 'compare'
                                ? '/study/parallel'
                                : activePurpose === 'originals'
                                ? '/study/interlinear'
                                : '/study/atlas'
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
                            {/* Tarjeta 1: Diseño Editorial */}
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
                                            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-semibold">{tLanding('prose')}</span>
                                        </div>
                                    </div>

                                    <div className="p-3 sm:p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-850 space-y-1">
                                        <div className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-wider flex items-center justify-between">
                                            <span>Salmos 23:2-3 · RVR1960</span>
                                            <span className="text-[9px] text-zinc-500 font-mono">{tLanding('readingMode')}</span>
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

                            {/* Tarjeta 2: Notas y Reflexiones */}
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

                                    <p className="text-xs sm:text-[13px] text-zinc-300 leading-relaxed font-sans">
                                        {tLanding('purposeDailyCard2NoteText')}
                                    </p>

                                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-1">
                                        <span className="text-zinc-500">Persistencia SQLite</span>
                                        <span className="text-zinc-300">100% Offline</span>
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

                            {/* Tarjeta 3: Devocional Diario */}
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
                                            &ldquo;El Señor es mi pastor, nada me faltará.&rdquo;
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
                            {/* Tarjeta 1: Vista Paralela */}
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
                                        <p className="font-serif text-xs sm:text-[13px] text-zinc-200 leading-snug">&ldquo;{tLanding('purposeCompareCard1V1Text')}&rdquo;</p>
                                    </div>
                                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-0.5">
                                        <div className="font-mono text-[9px] text-zinc-400">{tLanding('purposeCompareCard1V2Name')}</div>
                                        <p className="font-serif text-xs sm:text-[13px] text-zinc-200 leading-snug">&ldquo;{tLanding('purposeCompareCard1V2Text')}&rdquo;</p>
                                    </div>
                                </div>
                            </div>

                            {/* Tarjeta 2: Diferencias Resaltadas */}
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

                            {/* Tarjeta 3: Texto Crítico y Lenguas */}
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
                            {/* Tarjeta 1: Interlineal Morfológico */}
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

                                <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mt-auto space-y-2" dir="rtl">
                                    <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80 space-y-1 text-right" dir="ltr">
                                        <div className="text-sm font-serif text-white font-bold" dir="rtl">
                                            יְהוָ֥ה רֹ֝עִ֗י
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

                            {/* Tarjeta 2: Diccionario Strong & BDB */}
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

                            {/* Tarjeta 3: Estructura Literaria */}
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
                            {/* Tarjeta 1: Geografía y Rutas */}
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

                            {/* Tarjeta 2: Cronología Sincrónica */}
                            <div className="bg-[#0a0a0a] border border-zinc-800/90 rounded-[24px] sm:rounded-[28px] p-6 sm:p-7 flex flex-col justify-between min-h-[515px] sm:min-h-[535px] shadow-xl hover:border-zinc-700 transition-all">
                                <div className="bg-black border border-zinc-800/80 rounded-[20px] p-4 sm:p-4.5 shadow-inner mb-auto space-y-2 text-[10.5px] font-mono">
                                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                                        <span className="text-white font-semibold">{tLanding('purposeHistoryCard2Era1')}</span>
                                        <span className="text-zinc-500 text-[9.5px]">{tLanding('eraMonarchy')}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                                        <span className="text-white font-semibold">{tLanding('purposeHistoryCard2Era2')}</span>
                                        <span className="text-zinc-500 text-[9.5px]">{tLanding('eraProphecy')}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-2 rounded bg-zinc-950 border border-zinc-800/80">
                                        <span className="text-white font-semibold">{tLanding('purposeHistoryCard2Era3')}</span>
                                        <span className="text-zinc-500 text-[9.5px]">{tLanding('eraEmpire')}</span>
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

                            {/* Tarjeta 3: Arqueología Bíblica */}
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
    );
}
