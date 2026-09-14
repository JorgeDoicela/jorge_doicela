import {
    BibleLandingHeader,
    BibleHeroSection,
    BibleEnginesCarousel,
    BiblePurposeSection,
    BibleCorpusVersionsSection,
    BibleManuscriptsSection,
    BibleStepsSection,
    BibleMobileAppSection,
    BibleFinalCtaAndFooter,
} from '../components/landing';

export default function BibleLandingPage() {
    const studyUrl = '/study';

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-foreground selection:text-background transition-colors duration-200">
            {/* Header / Navegación */}
            <BibleLandingHeader studyUrl={studyUrl} />

            <main className="flex-1 flex flex-col items-center">
                {/* Hero Editorial */}
                <BibleHeroSection studyUrl={studyUrl} />

                {/* Carrusel de Motores Exegéticos */}
                <BibleEnginesCarousel />

                {/* Secciones por Propósito de Estudio */}
                <BiblePurposeSection />

                {/* Versiones Canónicas y Lenguas Originales */}
                <BibleCorpusVersionsSection />

                {/* Manuscritos y Códices Antiguos */}
                <BibleManuscriptsSection />

                {/* Pasos de Iniciación */}
                <BibleStepsSection />

                {/* App Móvil Offline */}
                <BibleMobileAppSection />

                {/* Llamado a la Acción y Pie de Página */}
                <BibleFinalCtaAndFooter studyUrl={studyUrl} />
            </main>
        </div>
    );
}
