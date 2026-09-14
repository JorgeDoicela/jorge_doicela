'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export function BibleCorpusVersionsSection() {
    const tLanding = useTranslations('Landing');

    const versions = [
        {
            code: tLanding('corpusV1Code'),
            name: tLanding('corpusV1Name'),
            tag: tLanding('corpusV1Tag'),
            lang: tLanding('corpusV1Lang'),
            desc: tLanding('corpusV1Desc'),
            sample: tLanding('corpusV1Sample'),
            source: tLanding('corpusV1Source'),
            href: '/study/standard?trans=rv1960',
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
            href: '/study/standard?trans=nbla',
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
            href: '/study/standard?trans=nvi',
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
            href: '/study/standard?trans=ntv',
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
            href: '/study/interlinear',
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
            href: '/study/parallel',
            dir: 'ltr' as const,
        },
    ];

    return (
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
    );
}
