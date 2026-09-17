'use client';

import { useTranslations } from 'next-intl';

export function BibleMobileAppSection() {
    const tLanding = useTranslations('Landing');

    return (
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
    );
}
