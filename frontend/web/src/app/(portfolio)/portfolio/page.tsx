import { ProjectShowcase, getPortfolioProjects } from '../features/projects';
import { ExperienceSection, getPortfolioExperience } from '../features/experience';
import { StackSection, getPortfolioStack } from '../features/stack';
import { EngineeringSection, getPortfolioEngineering } from '../features/engineering';
import { AboutSection, getPortfolioProfile } from '../features/about';
import { TerminalTeaserSection } from '../features/terminal';
import { ContactTeaserSection } from '../features/contact';
import { PortfolioPageShell, PORTFOLIO_CONTAINER_CLASS } from '../components/PortfolioPageShell';
import { TypewriterRole } from '../components/TypewriterRole';
import { getLocale, getTranslations } from 'next-intl/server';

function SectionDivider() {
    return (
        <div
            aria-hidden="true"
            className="w-full max-w-[78%] mx-auto h-px bg-gradient-to-r from-transparent via-border/80 to-transparent"
        />
    );
}

export default async function PortfolioPage() {
    const locale = await getLocale();
    const tHeader = await getTranslations('Header');

    const [profile, projects, stackItems, experienceItems, engineeringPillars] =
        await Promise.all([
            getPortfolioProfile(locale),
            getPortfolioProjects(locale, { featured: true }),
            getPortfolioStack(locale, { featured: true }),
            getPortfolioExperience(locale, { featured: true }),
            getPortfolioEngineering(locale, { featured: true }),
        ]);

    return (
        <PortfolioPageShell>
            {/* Cabecera Principal */}
            <header className={`${PORTFOLIO_CONTAINER_CLASS} mb-12 md:mb-16 flex flex-col gap-2 animate-fade-in`}>
                <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.15em] uppercase text-gold-gradient bg-gradient-to-r from-gold-100 via-gold-300 to-gold-200 bg-clip-text text-transparent">
                    {tHeader('title')}
                </h1>
                <TypewriterRole
                    roles={[
                        tHeader('role1'),
                        tHeader('role2'),
                        tHeader('role3'),
                        tHeader('role4')
                    ]}
                />
            </header>

            {/* Resumen Ejecutivo (7 secciones espejo 1:1 con los 7 módulos dedicados) */}
            <main className={`${PORTFOLIO_CONTAINER_CLASS} flex flex-col gap-12 md:gap-16 animate-fade-up`}>

                {/* 1. Sobre Mí & Conexiones (-> /about) */}
                <AboutSection profile={profile} viewAllHref="/about" />

                <SectionDivider />

                {/* 2. Proyectos Destacados (-> /projects) */}
                <ProjectShowcase
                    projects={projects}
                    viewAllHref="/projects"
                    showFilters={false}
                />

                <SectionDivider />

                {/* 3. Stack Tecnológico Principal (-> /stack) */}
                <StackSection items={stackItems} viewAllHref="/stack" />

                <SectionDivider />

                {/* 4. Experiencia Reciente & Formación (-> /experience) */}
                <ExperienceSection items={experienceItems} viewAllHref="/experience" />

                <SectionDivider />

                {/* 5. Ingeniería, Cloud & DevSecOps (-> /engineering) */}
                <EngineeringSection pillars={engineeringPillars} viewAllHref="/engineering" />

                <SectionDivider />

                {/* 6. Acceso a Terminal SSH & Laboratorio CTF (Zero-WebSocket en Home -> /terminal) */}
                <TerminalTeaserSection href="/terminal" />

                <SectionDivider />

                {/* 7. Acceso Directo al Centro de Contacto (-> /contact) */}
                <ContactTeaserSection
                    href="/contact"
                    email={profile.email}
                    availability={profile.availability}
                />

            </main>
        </PortfolioPageShell>
    );
}
