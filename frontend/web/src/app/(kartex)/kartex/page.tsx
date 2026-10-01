'use client';

import React, { useState, useEffect } from 'react';
import {
    KartexLandingHeader,
    KartexHeroSection,
    KartexEnginesCarousel,
    KartexPurposeSection,
    KartexCorpusVersionsSection,
    KartexManuscriptsSection,
    KartexStepsSection,
    KartexMobileAppSection,
    KartexFinalCtaAndFooter,
} from '../widgets/landing';

export default function KartexLandingPage() {
    const [studyUrl, setStudyUrl] = useState('/study');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hostname = window.location.hostname.toLowerCase();
            const isSubdomain = hostname.startsWith('kartex.');
            setStudyUrl(isSubdomain ? '/study' : '/kartex/study');
        }
    }, []);

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background transition-colors duration-200">
            {/* Header / Navegación */}
            <KartexLandingHeader studyUrl={studyUrl} />

            <main className="flex-1 flex flex-col items-center">
                {/* Hero Editorial */}
                <KartexHeroSection studyUrl={studyUrl} />

                {/* Carrusel de Herramientas de Estudio */}
                <KartexEnginesCarousel />

                {/* Secciones por Propósito de Estudio */}
                <KartexPurposeSection />

                {/* Versiones Canónicas y Lenguas Originales */}
                <KartexCorpusVersionsSection />

                {/* Manuscritos y Códices Antiguos */}
                <KartexManuscriptsSection />

                {/* Pasos de Iniciación */}
                <KartexStepsSection />

                {/* App Móvil Offline */}
                <KartexMobileAppSection />

                {/* Llamado a la Acción y Pie de Página */}
                <KartexFinalCtaAndFooter studyUrl={studyUrl} />
            </main>
        </div>
    );
}
