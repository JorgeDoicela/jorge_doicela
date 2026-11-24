import Link from 'next/link';
import { TerminalConsole } from '../features/terminal';
import { ProjectShowcase, getPortfolioProjects } from '../features/projects';
import { ExperienceSection, getPortfolioExperience } from '../features/experience';
import { StackSection, getPortfolioStack } from '../features/stack';
import { EngineeringSection, getPortfolioEngineering } from '../features/engineering';
import { getPortfolioProfile } from '../features/about';
import { ContactForm } from '../features/contact';
import { PortfolioHeader } from '../components/PortfolioHeader';
import { TypewriterRole } from '../components/TypewriterRole';
import { ValuesPhilosophySection } from '../components/ValuesPhilosophySection';
import { getLocale, getTranslations } from 'next-intl/server';
import {
    Mail,
    MapPin,
    ArrowRight,
    ArrowUpRight,
} from 'lucide-react';

export default async function PortfolioPage() {
    const locale = await getLocale();
    const tHeader = await getTranslations('Header');
    const tAbout = await getTranslations('About');
    const tContact = await getTranslations('Contact');
    const tTerm = await getTranslations('Terminal');
    const tFooter = await getTranslations('Footer');

    const [profile, projects, stackItems, experienceItems, engineeringPillars] =
        await Promise.all([
            getPortfolioProfile(locale),
            getPortfolioProjects(locale, { featured: true }),
            getPortfolioStack(locale, { featured: true }),
            getPortfolioExperience(locale, { featured: true }),
            getPortfolioEngineering(locale, { featured: true }),
        ]);

    return (
        <div className="portfolio-shell min-h-screen bg-background text-foreground py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">

            {/* Cabecera Flotante con Ocultamiento Dinámico por Scroll */}
            <PortfolioHeader />

            {/* Cabecera Principal */}
            <header className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto mb-16 md:mb-20 flex flex-col gap-2 animate-fade-in">
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

            {/* Contenido Principal en Flujo Lineal y Asimétrico */}
            <main className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto flex flex-col gap-[130px] md:gap-[175px] animate-fade-up">

                {/* Sección 1: Sobre Mí & Contactos */}
                <section id="about" className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start scroll-mt-24">
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-baseline justify-between gap-4 mb-2">
                            <h2 className="text-2xl md:text-3xl font-light text-foreground">
                                {tAbout('title')}
                            </h2>
                            <Link
                                href="/about"
                                className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
                            >
                                <span>{tAbout('viewMore')}</span>
                                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                            </Link>
                        </div>
                        <div className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light space-y-4">
                            {profile.bio.map((paragraph, idx) => (
                                <p key={idx}>{paragraph}</p>
                            ))}
                        </div>
                    </div>

                    {/* Contactos Rápidos */}
                    <div className="flex flex-col gap-4 md:pl-6 md:border-l border-border/40">
                        <span className="text-[10px] font-mono text-gold-300 tracking-widest uppercase mb-2">{tAbout('connections')}</span>
                        <a
                            href="https://www.linkedin.com/in/jorgedoicela"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                                    <rect width="4" height="12" x="2" y="9" />
                                    <circle cx="4" cy="4" r="2" />
                                </svg>
                                <span>LinkedIn</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </a>
                        <a
                            href="https://github.com/JorgeDoicela"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gold-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                    <path d="M9 18c-4.51 2-5-2-7-2" />
                                </svg>
                                <span>GitHub</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </a>
                        <a
                            href={`mailto:${profile.email}`}
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
                        >
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gold-300" />
                                <span>{profile.email}</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </a>
                        <a
                            href="https://www.google.com/maps/place/Quito,+Ecuador"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
                            title={tContact('mapsTitle')}
                        >
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gold-300" />
                                <span>{profile.location}</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </a>
                    </div>
                </section>

                {/* Sección 2: Showcase de Proyectos de Ingeniería */}
                <ProjectShowcase projects={projects} viewAllHref="/projects" />

                {/* Sección 3: Tecnologías & Stack Principal (Marquee SQLite) */}
                <StackSection items={stackItems} viewAllHref="/stack" />

                {/* Sección 4: Experiencia & Educación */}
                <ExperienceSection items={experienceItems} viewAllHref="/experience" />

                {/* Sección 5: Ingeniería, Cloud & DevSecOps */}
                <EngineeringSection pillars={engineeringPillars} viewAllHref="/engineering" />

                {/* Sección 6: Filosofía & Valores Fundamentales */}
                <ValuesPhilosophySection />

                {/* Sección 7: Consola Interactiva Virtual SSH */}
                <section id="terminal" className="flex flex-col gap-4 scroll-mt-24">
                    <div className="flex flex-col gap-1.5 px-2 md:px-0">
                        <h2 className="text-xl font-light text-foreground">
                            {tTerm('title')}
                        </h2>
                        <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                            {tTerm('subtitle')}
                        </p>
                    </div>
                    <TerminalConsole />
                </section>

                {/* Sección 8: Centro de Contacto Interactivo */}
                <section id="contact" className="flex flex-col gap-8 scroll-mt-24">
                    {/* Cabecera Editorial General */}
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
                            {tContact('thesisTitle')}
                        </h2>
                        <p className="text-muted text-xs md:text-sm leading-relaxed font-light max-w-3xl">
                            {tContact('thesisDesc')}
                        </p>
                    </div>

                    {/* Cuadrícula Formulario + Fichas Alineadas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 items-stretch">
                        {/* Columna Principal: Formulario Amplio (2 cols) */}
                        <div className="md:col-span-2">
                            <ContactForm />
                        </div>

                        {/* Columna Lateral: Áreas de Contacto & Compromiso (1 col) */}
                        <div className="md:col-span-1 flex flex-col justify-between py-2">
                            <div className="flex flex-col justify-center flex-1 pb-5 border-b border-border/40 gap-2">
                                <h3 className="text-xs font-mono font-semibold text-foreground tracking-wide">{tContact('area1Title')}</h3>
                                <p className="text-muted text-[12px] leading-relaxed font-light">
                                    {tContact('area1Desc')}
                                </p>
                            </div>

                            <div className="flex flex-col justify-center flex-1 py-5 border-b border-border/40 gap-2">
                                <h3 className="text-xs font-mono font-semibold text-foreground tracking-wide">{tContact('area2Title')}</h3>
                                <p className="text-muted text-[12px] leading-relaxed font-light">
                                    {tContact('area2Desc')}
                                </p>
                            </div>

                            <div className="flex flex-col justify-center flex-1 pt-5 gap-2">
                                <h3 className="text-xs font-mono font-semibold text-foreground tracking-wide">{tContact('area3Title')}</h3>
                                <p className="text-muted text-[12px] leading-relaxed font-light">
                                    {tContact('area3Desc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* Footer */}
            <footer className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto mt-20 md:mt-28 pt-8 pb-12 flex items-center justify-center text-center text-gold-s/40 text-[10px] tracking-[0.2em] uppercase font-mono">
                <span>{tFooter('copyright', { year: new Date().getFullYear().toString() })}</span>
            </footer>

        </div>
    );
}
