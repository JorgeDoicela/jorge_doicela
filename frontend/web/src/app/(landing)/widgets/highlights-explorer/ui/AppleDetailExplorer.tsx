'use client';

import React, { useState } from 'react';
import { Plus, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const AppleDetailExplorer: React.FC = () => {
    const t = useTranslations('Explorer');
    const [activeItem, setActiveItem] = useState<number>(0);
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const details = [
        {
            id: 'platforms',
            navTitle: t('platformsNav'),
            title: t('platformsTitle'),
            description: t('platformsDesc'),
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {t('platformsHeader')}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {t('platformsSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                Kartex
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('platformsKartex')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 px-2 sm:px-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                DoicelaDev
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('platformsDoiceladev')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                Portafolio
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('platformsPortfolio')}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {t('platformsFooter')}
                    </div>
                </div>
            ),
        },
        {
            id: 'innovation',
            navTitle: t('innovationNav'),
            title: t('innovationTitle'),
            description: t('innovationDesc'),
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {t('innovationHeader')}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {t('innovationSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-3 sm:pr-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('innovationAiColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('innovationAiColDesc')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-3 sm:pl-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('innovationSecColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('innovationSecColDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {t('innovationFooter')}
                    </div>
                </div>
            ),
        },
        {
            id: 'faith',
            navTitle: t('faithNav'),
            title: t('faithTitle'),
            description: t('faithDesc'),
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {t('faithHeader')}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {t('faithSubtitle')}
                        </p>
                    </div>

                    <div className="pt-3 md:pt-4 border-t border-card-border my-auto">
                        <p className="text-xs sm:text-sm md:text-base font-light italic text-foreground leading-relaxed">
                            &ldquo;{t('faithQuote')}&rdquo;
                        </p>
                        <p className="text-[10px] sm:text-[11px] text-text-muted mt-1.5">
                            {t('faithRef')}
                        </p>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {t('faithFooter')}
                    </div>
                </div>
            ),
        },
        {
            id: 'experience',
            navTitle: t('experienceNav'),
            title: t('experienceTitle'),
            description: t('experienceDesc'),
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {t('experienceHeader')}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {t('experienceSubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-3 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('experienceSpeedColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                                {t('experienceSpeedColDesc')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 px-2 sm:px-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('experienceLangColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                                {t('experienceLangColDesc')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-2 sm:pr-4">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('experienceRespColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed">
                                {t('experienceRespColDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {t('experienceFooter')}
                    </div>
                </div>
            ),
        },
        {
            id: 'security',
            navTitle: t('securityNav'),
            title: t('securityTitle'),
            description: t('securityDesc'),
            renderScreen: () => (
                <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 md:p-8 bg-card text-foreground font-sans select-none text-left transition-colors duration-300">
                    <div className="flex flex-col gap-1">
                        <h4 className="text-sm sm:text-base md:text-lg font-semibold tracking-tight text-foreground">
                            {t('securityHeader')}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-text-muted leading-relaxed">
                            {t('securitySubtitle')}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 divide-x divide-card-border pt-3 md:pt-4 border-t border-card-border my-auto">
                        <div className="flex flex-col gap-0.5 sm:gap-1 pr-3 sm:pr-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('securityPrivColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('securityPrivColDesc')}
                            </p>
                        </div>

                        <div className="flex flex-col gap-0.5 sm:gap-1 pl-3 sm:pl-6">
                            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-foreground">
                                {t('securityConnColTitle')}
                            </span>
                            <p className="text-[10px] sm:text-[11px] text-text-muted leading-relaxed line-clamp-3">
                                {t('securityConnColDesc')}
                            </p>
                        </div>
                    </div>

                    <div className="text-[10px] sm:text-[11px] text-text-muted pt-2 sm:pt-3 border-t border-card-border">
                        {t('securityFooter')}
                    </div>
                </div>
            ),
        },
    ];

    const renderWelcomeScreen = () => (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 sm:p-8 bg-card text-foreground font-sans select-none text-center transition-colors duration-300 relative overflow-hidden">
            {/* Halo etéreo sutil */}
            <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none opacity-60" />

            {/* Tipografía de Bienvenida Estilo Apple Hello */}
            <div className="relative z-10 flex flex-col items-center justify-center">
                <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                    {t('welcome')}
                </h3>
            </div>
        </div>
    );

    const total = details.length;

    const handleNext = () => {
        setActiveItem((prev) => (prev + 1) % total);
        setIsExpanded(true);
    };

    const handlePrev = () => {
        setActiveItem((prev) => (prev - 1 + total) % total);
        setIsExpanded(true);
    };

    const current = details[activeItem];

    return (
        <section className="w-screen relative left-1/2 -translate-x-1/2 flex flex-col gap-6 py-6 sm:py-8 overflow-hidden px-4 sm:px-8 max-w-[1280px]">
            {/* Título de Sección Estilo Apple */}
            <div className="w-full flex flex-col items-start px-2 sm:px-4">
                <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-[-0.04em] text-foreground leading-tight">
                    {t('sectionTitle')}
                </h2>
            </div>

            {/* Tarjeta Inspector Amplia Estilo Apple */}
            <div className="w-full rounded-[2rem] sm:rounded-[2.4rem] md:rounded-[2.8rem] bg-card border border-card-border p-5 sm:p-8 md:p-10 lg:p-12 backdrop-blur-2xl relative overflow-hidden flex flex-col justify-center min-h-0 sm:min-h-[500px] md:min-h-[580px]">
                {/* Botón de Cerrar / Reset en Esquina Superior Derecha (Solo visible si hay un detalle activo) */}
                {isExpanded && (
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer z-20 animate-fade-slide"
                        aria-label={t('closeDetail')}
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}

                {/* ========================================================================= */}
                {/* 1. VISTA ESCRITORIO (>= lg): Lado a lado (Píldoras a la izquierda, Laptop a la derecha) */}
                {/* ========================================================================= */}
                <div className="hidden lg:grid grid-cols-12 gap-8 md:gap-12 items-center w-full my-auto">
                    {/* COLUMNA IZQUIERDA: Píldoras de Navegación + Bocadillo Expandido estilo Apple */}
                    <div className="col-span-5 flex items-start gap-3">
                        {/* Flechas Arriba / Abajo */}
                        <div className="flex flex-col gap-1.5 shrink-0 pt-1">
                            <button
                                onClick={handlePrev}
                                className="w-7 h-7 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer"
                                aria-label={t('prevFeature')}
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleNext}
                                className="w-7 h-7 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-text-muted hover:text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all cursor-pointer"
                                aria-label={t('nextFeature')}
                            >
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Píldoras y Tarjeta Expandida */}
                        <div className="flex flex-col gap-2.5 w-full">
                            {details.map((item, idx) => {
                                const isActive = isExpanded && idx === activeItem;

                                if (isActive && isExpanded) {
                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-2xl bg-btn-sec border border-card-border p-4 sm:p-5 flex flex-col gap-2 shadow-sm animate-fade-slide"
                                        >
                                            <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                                                <span className="font-semibold">{item.title}. </span>
                                                <span className="text-text-muted font-normal">{item.description}</span>
                                            </p>
                                        </div>
                                    );
                                }

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                             setActiveItem(idx);
                                             setIsExpanded(true);
                                        }}
                                        className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium transition-all duration-300 text-left w-fit cursor-pointer ${isActive
                                            ? 'bg-foreground text-background shadow-sm'
                                            : 'bg-btn-sec text-foreground hover:bg-btn-sec-hover border border-card-border'
                                            }`}
                                    >
                                        <div className="w-4 h-4 rounded-full border border-current flex items-center justify-center shrink-0">
                                            <Plus className="w-2.5 h-2.5" />
                                        </div>
                                        <span>{item.navTitle}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA: MacBook Pro con Transición Cinemática */}
                    <div className="col-span-7 w-full flex items-center justify-center py-2">
                        <div className="w-full max-w-[530px] xl:max-w-[560px] flex flex-col items-center">
                            {/* Tapa / Bisel Superior de la Pantalla (Negro en Modo Claro, Blanco Neutro en Modo Oscuro) */}
                            <div className="w-full aspect-[16/10] rounded-t-2xl sm:rounded-t-3xl bg-[#18181b] border-[6px] sm:border-[8px] border-[#27272a] dark:bg-[#ffffff] dark:border-[#e4e4e7] relative overflow-hidden shadow-md flex flex-col transition-colors duration-300">
                                {/* Cámara Notch Sutil */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 sm:w-20 h-3 sm:h-3.5 bg-[#18181b] border-b border-x border-[#27272a] dark:bg-[#ffffff] dark:border-[#e4e4e7] rounded-b-md z-30 flex items-center justify-center transition-colors duration-300">
                                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 dark:bg-zinc-400" />
                                </div>

                                {/* Pantalla con Transición de Fundido Suave */}
                                <div className="w-full h-full flex-grow relative overflow-hidden bg-white dark:bg-[#090a0f]">
                                    <div key={isExpanded ? current.id : 'welcome'} className="w-full h-full animate-fade-slide">
                                        {isExpanded ? current.renderScreen() : renderWelcomeScreen()}
                                    </div>
                                </div>
                            </div>

                            {/* Base de la Laptop */}
                            <div className="w-[105%] h-3 sm:h-3.5 bg-[#18181b] border border-t-0 border-[#27272a] dark:bg-[#ffffff] dark:border-[#e4e4e7] rounded-b-lg relative flex items-start justify-center transition-colors duration-300">
                                <div className="w-12 sm:w-16 h-1 bg-[#27272a] dark:bg-[#e4e4e7] rounded-b" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ========================================================================= */}
                {/* 2. VISTA MÓVIL (< lg): Apple Official Mobile Layout */}
                {/* ========================================================================= */}
                <div className="flex lg:hidden flex-col items-center justify-center gap-5 sm:gap-6 flex-grow py-2">
                    {/* Laptop Centrada en la parte superior */}
                    <div className="w-full flex items-center justify-center">
                        <div className="w-full max-w-[340px] sm:max-w-[360px] flex flex-col items-center">
                            {/* Pantalla Laptop (Negra en Modo Claro, Blanca en Modo Oscuro) */}
                            <div className="w-full aspect-[16/10] rounded-t-2xl bg-[#18181b] border-[5px] border-[#27272a] dark:bg-[#ffffff] dark:border-[#e4e4e7] relative overflow-hidden shadow-sm flex flex-col transition-colors duration-300">
                                {/* Cámara Notch */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-2.5 bg-[#18181b] border-b border-x border-[#27272a] dark:bg-[#ffffff] dark:border-[#e4e4e7] rounded-b z-30 flex items-center justify-center">
                                    <div className="w-1 h-1 rounded-full bg-zinc-600 dark:bg-zinc-400" />
                                </div>

                                {/* Contenido de Pantalla con Animación */}
                                <div className="w-full h-full flex-grow relative overflow-hidden bg-white dark:bg-[#090a0f]">
                                    <div key={isExpanded ? current.id : 'welcome'} className="w-full h-full animate-fade-slide">
                                        {isExpanded ? current.renderScreen() : renderWelcomeScreen()}
                                    </div>
                                </div>
                            </div>

                            {/* Base de Laptop */}
                            <div className="w-[105%] h-2.5 bg-[#18181b] border border-t-0 border-[#27272a] dark:bg-[#ffffff] dark:border-[#e4e4e7] rounded-b-md relative flex items-start justify-center">
                                <div className="w-10 h-0.5 bg-[#27272a] dark:bg-[#e4e4e7] rounded-b" />
                            </div>
                        </div>
                    </div>

                    {/* Área Inferior con altura constante fija: Evita layout shift o cambios de tamaño entre estado cerrado y abierto */}
                    <div className="w-full h-[125px] sm:h-[135px] flex items-center justify-center px-1 sm:px-4">
                        {isExpanded ? (
                            /* Modo Detalle Abierto: Bocadillo con bordes super redondeados y flechas flotantes laterales */
                            <div className="relative w-full max-w-[390px] mx-auto animate-fade-slide px-5 sm:px-6">
                                {/* Flecha Izquierda Flotante (Touch Target 40px) */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all shadow-md z-20 cursor-pointer"
                                    aria-label={t('prevFeature')}
                                >
                                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                                </button>

                                {/* Bocadillo Descriptivo Apple Style */}
                                <div className="w-full rounded-[1.6rem] sm:rounded-[1.8rem] bg-btn-sec border border-card-border p-4 sm:p-5 text-left shadow-sm backdrop-blur-2xl">
                                    <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                                        <span className="font-semibold">{current.title}. </span>
                                        <span className="text-text-muted font-normal">{current.description}</span>
                                    </p>
                                </div>

                                {/* Flecha Derecha Flotante (Touch Target 40px) */}
                                <button
                                    onClick={handleNext}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-btn-sec border border-card-border flex items-center justify-center text-foreground hover:bg-btn-sec-hover active:scale-95 transition-all shadow-md z-20 cursor-pointer"
                                    aria-label={t('nextFeature')}
                                >
                                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                                </button>
                            </div>
                        ) : (
                            /* Modo Replegado: Barra de Píldoras Horizontales Deslizables */
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 w-full animate-fade-slide justify-start">
                                {details.map((item, idx) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveItem(idx);
                                            setIsExpanded(true);
                                        }}
                                        className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium bg-btn-sec text-foreground hover:bg-btn-sec-hover border border-card-border transition-all whitespace-nowrap cursor-pointer active:scale-95"
                                    >
                                        <div className="w-3.5 h-3.5 rounded-full border border-current flex items-center justify-center shrink-0">
                                            <Plus className="w-2 h-2" />
                                        </div>
                                        <span>{item.navTitle}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
