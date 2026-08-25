'use client';

import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import TypewriterRole from './TypewriterRole';

export const AppleHeroIntro: React.FC = () => {
    const { language } = useLanguage();
    const isEs = language === 'es';

    return (
        <section className="w-full min-h-[84vh] sm:min-h-[88vh] flex flex-col justify-center items-center text-center px-4 animate-fade-in-up relative">
            {/* Eyebrow / Efecto Typewriter Dinámico */}
            <div className="mb-4">
                <TypewriterRole />
            </div>

            {/* Titular Gigante Impactante Estilo Apple SF Pro Display */}
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-bold tracking-[-0.04em] text-foreground max-w-4xl leading-[1.04] mb-6">
                Jorge Doicela
            </h1>

            {/* Párrafo Descriptivo Estilo Apple */}
            <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl font-normal leading-relaxed tracking-[-0.012em] mb-10">
                {isEs
                    ? 'Desarrollo Full Stack, Ciberseguridad y Tecnologías Web construidas con excelencia técnica, fe cristiana y pasión por el detalle.'
                    : 'Full Stack Development, Cybersecurity and Web Technologies built with technical excellence, Christian faith and passion for detail.'}
            </p>

            {/* Botón Píldora Apple CTA */}
            <div className="flex flex-col items-center justify-center">
                <a
                    href="#highlights"
                    onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById('highlights');
                        if (el) {
                            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            window.history.pushState(null, '', '#highlights');
                        }
                    }}
                    className="px-8 py-3.5 rounded-full bg-foreground text-background font-medium text-sm sm:text-base tracking-tight hover:opacity-90 active:scale-95 transition-all shadow-md cursor-pointer"
                >
                    {isEs ? 'Explorar lo más destacado' : 'Explore highlights'}
                </a>
            </div>
        </section>
    );
};
