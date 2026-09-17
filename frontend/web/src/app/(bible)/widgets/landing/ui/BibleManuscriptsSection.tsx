'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';

export function BibleManuscriptsSection() {
    const tLanding = useTranslations('Landing');

    return (
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
                            href="/study/interlinear"
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
    );
}
