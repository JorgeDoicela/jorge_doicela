'use client';

import { useTranslations } from 'next-intl';

export function BibleStepsSection() {
    const tLanding = useTranslations('Landing');

    return (
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
    );
}
