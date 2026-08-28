import { TerminalConsole } from '../features/terminal/components/TerminalConsole';
import { ProjectShowcase } from '../features/projects/components/ProjectShowcase';
import { ContactForm } from '../features/contact/components/ContactForm';
import { ThemeToggle } from '../components/ThemeToggle';
import { LanguageToggle } from '../components/LanguageToggle';
import { TypewriterRole } from '../components/TypewriterRole';
import { ValuesPhilosophySection } from '../components/ValuesPhilosophySection';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioProject } from '../features/projects/types';
import {
    Mail,
    MapPin,
    Code,
    Cpu,
    Layers,
    Terminal,
    ArrowUpRight,
    GraduationCap,
    Briefcase,
    Shield,
    Server,
    RefreshCw,
    MessageSquare
} from 'lucide-react';

async function getPortfolioProjects(locale: string): Promise<PortfolioProject[]> {
    try {
        const res = await fetch(`http://127.0.0.1:3000/portfolio/projects?lang=${locale}`, {
            next: { revalidate: 60 },
        });
        if (res.ok) {
            const data = await res.json();
            const rawProjects = Array.isArray(data) ? data : data.data || [];
            return rawProjects.map((p: any) => ({
                ...p,
                technologies: Array.isArray(p.technologies)
                    ? p.technologies
                    : (typeof p.technologies === 'string' && p.technologies.trim().startsWith('[')
                        ? JSON.parse(p.technologies)
                        : (typeof p.technologies === 'string' ? p.technologies.split(',').map((s: string) => s.trim()) : [])),
            }));
        }
    } catch {
        // Fallback resiliente al corpus estático
    }

    const fallbackProjects: Record<string, PortfolioProject[]> = {
        es: [
            {
                id: 1,
                slug: 'la-biblia-modular',
                title: 'La Biblia Modular',
                description: 'Plataforma de estudio bíblico y exégesis con 9 motores teológicos, morfología Strong masorética y Septuaginta, y app móvil nativa en Expo.',
                role: 'Lead Architect & Full Stack Developer',
                technologies: ['Next.js 16', 'NestJS 11', 'SQLite', 'Expo', 'TypeScript', 'Tailwind CSS'],
                language: 'es',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://bible.jorgedoicela.com',
                featured: true
            },
            {
                id: 3,
                slug: 'software-platform',
                title: 'Software',
                description: 'Ecosistema de contenidos tecnológicos con 7 áreas temáticas, avisos de ciberseguridad, catálogo de modelos de IA, tutoriales interactivos y foros.',
                role: 'Full Stack & DevSecOps Engineer',
                technologies: ['Next.js 16', 'NestJS 11', 'SQLite', 'Neumorphism UI', 'Glassmorphism'],
                language: 'es',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://software.jorgedoicela.com',
                featured: true
            },
            {
                id: 5,
                slug: 'infraestructura-lightsail-vps',
                title: 'Arquitectura Cloud VPS (1 GB RAM)',
                description: 'Despliegue de alta disponibilidad en AWS Lightsail (Debian 13) con Nginx mTLS, Cloudflare Edge, PM2 y pipeline CI/CD optimizado para 1 GB de RAM.',
                role: 'DevSecOps & Cloud Architect',
                technologies: ['AWS Lightsail', 'Debian 13', 'Nginx', 'Cloudflare mTLS', 'PM2', 'GitHub Actions'],
                language: 'es',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://jorgedoicela.com',
                featured: true
            },
            {
                id: 7,
                slug: 'terminal-ssh-websockets',
                title: 'Terminal Virtual SSH en Tiempo Real',
                description: 'Emulador de terminal UNIX interactiva sobre WebSockets (Socket.io) con sistema de archivos virtual, coloreado ANSI y ejecución segura de comandos.',
                role: 'Backend & Frontend Engineer',
                technologies: ['NestJS WebSockets', 'Socket.io', 'TypeScript', 'ANSI Parser'],
                language: 'es',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://portfolio.jorgedoicela.com',
                featured: true
            }
        ],
        en: [
            {
                id: 2,
                slug: 'the-modular-bible',
                title: 'The Modular Bible',
                description: 'Exegesis and scripture study platform featuring 9 theological engines, Masoretic BHS / LXX morphology, Strong dictionaries, and Expo native mobile app.',
                role: 'Lead Architect & Full Stack Developer',
                technologies: ['Next.js 16', 'NestJS 11', 'SQLite', 'Expo', 'TypeScript', 'Tailwind CSS'],
                language: 'en',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://bible.jorgedoicela.com',
                featured: true
            },
            {
                id: 4,
                slug: 'software-platform-en',
                title: 'Software',
                description: 'Technology platform featuring 7 categories: cybersecurity advisories, AI models showcase, step-by-step interactive tutorials, and technical forums.',
                role: 'Full Stack & DevSecOps Engineer',
                technologies: ['Next.js 16', 'NestJS 11', 'SQLite', 'Neumorphism UI', 'Glassmorphism'],
                language: 'en',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://software.jorgedoicela.com',
                featured: true
            },
            {
                id: 6,
                slug: 'cloud-infrastructure-lightsail',
                title: 'Cloud VPS Architecture (1 GB RAM)',
                description: 'High-availability deployment on AWS Lightsail (Debian 13) featuring Nginx mTLS, Cloudflare Edge, PM2, and GitHub Actions CI/CD optimized for 1 GB RAM.',
                role: 'DevSecOps & Cloud Architect',
                technologies: ['AWS Lightsail', 'Debian 13', 'Nginx', 'Cloudflare mTLS', 'PM2', 'GitHub Actions'],
                language: 'en',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://jorgedoicela.com',
                featured: true
            },
            {
                id: 8,
                slug: 'terminal-ssh-websockets-en',
                title: 'Real-time Virtual SSH Terminal',
                description: 'Interactive UNIX terminal emulator over WebSockets (Socket.io) with virtual filesystem, ANSI color rendering, and secure command dispatching.',
                role: 'Backend & Frontend Engineer',
                technologies: ['NestJS WebSockets', 'Socket.io', 'TypeScript', 'ANSI Parser'],
                language: 'en',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://portfolio.jorgedoicela.com',
                featured: true
            }
        ]
    };

    return fallbackProjects[locale] || fallbackProjects.es;
}

export default async function PortfolioPage() {
    const locale = await getLocale();
    const tHeader = await getTranslations('Header');
    const tAbout = await getTranslations('About');
    const tStack = await getTranslations('Stack');
    const tExp = await getTranslations('Experience');
    const tCloud = await getTranslations('Cloud');
    const tTools = await getTranslations('Tools');
    const tContact = await getTranslations('Contact');
    const tTerm = await getTranslations('Terminal');
    const projects = await getPortfolioProjects(locale);

    return (
        <div className="min-h-screen bg-background text-foreground py-16 md:py-24 px-6 md:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">

            {/* Header con Controls (ThemeToggle + LanguageToggle) */}
            <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
                <LanguageToggle />
                <ThemeToggle />
            </div>

            {/* Cabecera Principal */}
            <header className="w-full max-w-7xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8 animate-fade-in">
                <div className="flex flex-col gap-2">
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

                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="luxury-badge">
                        <Shield className="w-3.5 h-3.5 text-gold-300" />
                        <span>{tHeader('aiBadge')}</span>
                    </span>
                    <span className="luxury-badge luxury-pulse">
                        <span>{tHeader('inProgress')}</span>
                    </span>
                </div>
            </header>

            {/* Contenido Principal en Flujo Lineal y Asimétrico */}
            <main className="w-full max-w-7xl mx-auto flex flex-col gap-20 animate-fade-up">

                {/* Sección 1: Sobre Mí & Contactos */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-gold-300">
                            <Cpu className="w-4 h-4" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">{tAbout('title')}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                            {tAbout('title')}
                        </h2>
                        <div className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light space-y-4">
                            <p>{tAbout('p1')}</p>
                            <p>{tAbout('p2')}</p>
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
                            href="mailto:jorge.doicela.m@gmail.com"
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
                        >
                            <span className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gold-300" />
                                <span>jorge.doicela.m@gmail.com</span>
                            </span>
                            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                        </a>
                        <div
                            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 text-xs text-foreground/80 font-mono cursor-default"
                        >
                            <span className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gold-300" />
                                <span>Quito, Ecuador</span>
                            </span>
                            <span className="text-[10px] text-muted">UTC-5</span>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 2: Showcase de Proyectos de Ingeniería */}
                <ProjectShowcase projects={projects} />

                <hr className="luxury-divider" />

                {/* Sección 3: Tecnologías & Stack Principal */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gold-300">
                        <Code className="w-4 h-4" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">{tStack('eyebrow')}</span>
                    </div>
                    <h2 className="text-2xl font-light text-foreground">
                        {tStack('title')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/60 pb-1.5">{tStack('client')}</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="luxury-badge">React</span>
                                <span className="luxury-badge">Next.js 16</span>
                                <span className="luxury-badge">TypeScript</span>
                                <span className="luxury-badge">Tailwind CSS</span>
                                <span className="luxury-badge">Expo (Mobile)</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/60 pb-1.5">{tStack('server')}</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="luxury-badge">NestJS 11</span>
                                <span className="luxury-badge">Node.js</span>
                                <span className="luxury-badge">C# / .NET</span>
                                <span className="luxury-badge">PHP / Laravel</span>
                                <span className="luxury-badge">Python</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/60 pb-1.5">{tStack('data')}</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="luxury-badge">SQLite (WAL)</span>
                                <span className="luxury-badge">PostgreSQL</span>
                                <span className="luxury-badge">AWS Lightsail</span>
                                <span className="luxury-badge">Docker</span>
                                <span className="luxury-badge">GitHub Actions</span>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 4: Experiencia & Educación */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-gold-300">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">{tExp('eyebrow')}</span>
                        </div>
                        <h2 className="text-2xl font-light text-foreground mb-2">
                            {tExp('title')}
                        </h2>

                        <div className="space-y-8">
                            <div className="border-l border-border-gold pl-4 relative">
                                <div className="absolute w-2 h-2 rounded-full bg-gold-400 -left-[5px] top-1.5 luxury-pulse"></div>
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="text-sm font-mono text-foreground font-semibold">{tExp('role1Title')}</h3>
                                    <span className="text-[10px] font-mono text-muted uppercase">{tExp('role1Sub')}</span>
                                </div>
                                <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                                    {tExp('role1Desc')}
                                </p>
                            </div>

                            <div className="border-l border-border-gold pl-4 relative">
                                <div className="absolute w-2 h-2 rounded-full bg-gold-500 -left-[5px] top-1.5"></div>
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="text-sm font-mono text-foreground font-semibold">{tExp('role2Title')}</h3>
                                    <span className="text-[10px] font-mono text-muted uppercase">{tExp('role2Sub')}</span>
                                </div>
                                <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                                    {tExp('role2Desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Educación */}
                    <div className="flex flex-col gap-6 md:pl-6 md:border-l border-border/40 h-full justify-between">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-gold-300">
                                <GraduationCap className="w-4 h-4" />
                                <span className="text-[10px] font-mono tracking-widest uppercase">{tExp('eduEyebrow')}</span>
                            </div>
                            <h2 className="text-2xl font-light text-foreground mb-2">
                                {tExp('eduTitle')}
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-xs md:text-sm font-mono text-foreground font-semibold">{tExp('edu1Title')}</h3>
                                    <p className="text-[10px] text-gold-400 font-mono mt-1">{tExp('edu1Sub')}</p>
                                </div>
                                <div className="border-t border-border/30 pt-4">
                                    <h3 className="text-xs md:text-sm font-mono text-foreground font-semibold">{tExp('edu2Title')}</h3>
                                    <p className="text-[10px] text-muted font-mono mt-1">{tExp('edu2Sub')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 5: Nube, CI/CD y Hardening */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gold-300">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">{tCloud('eyebrow')}</span>
                    </div>
                    <h2 className="text-2xl font-light text-foreground">
                        {tCloud('title')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2">
                                <Server className="w-4.5 h-4.5 text-gold-400" />
                                <h3 className="text-xs font-mono font-semibold text-foreground">{tCloud('pillar1Title')}</h3>
                            </div>
                            <p className="text-muted text-xs leading-relaxed font-light">
                                {tCloud('pillar1Desc')}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2.5 md:px-4 md:border-x border-border/40">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4.5 h-4.5 text-gold-400" />
                                <h3 className="text-xs font-mono font-semibold text-foreground">{tCloud('pillar2Title')}</h3>
                            </div>
                            <p className="text-muted text-xs leading-relaxed font-light">
                                {tCloud('pillar2Desc')}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4.5 h-4.5 text-gold-400" />
                                <h3 className="text-xs font-mono font-semibold text-foreground">{tCloud('pillar3Title')}</h3>
                            </div>
                            <p className="text-muted text-xs leading-relaxed font-light">
                                {tCloud('pillar3Desc')}
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 6: Flujo & Herramientas */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-gold-300">
                            <Layers className="w-4 h-4" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">{tTools('eyebrow')}</span>
                        </div>
                        <h2 className="text-2xl font-light text-foreground mb-2">
                            {tTools('title')}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2">
                            <div className="flex flex-col gap-2.5">
                                <span className="text-[10.5px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/40 pb-1">{tTools('systemsTitle')}</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="luxury-badge">Arch Linux</span>
                                    <span className="luxury-badge">Debian 13</span>
                                    <span className="luxury-badge">Neovim</span>
                                    <span className="luxury-badge">tmux</span>
                                    <span className="luxury-badge">Alacritty</span>
                                    <span className="luxury-badge">Hyprland</span>
                                    <span className="luxury-badge">Figma</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10.5px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/40 pb-1">{tTools('studyTitle')}</span>
                                <span className="text-xs font-mono font-semibold text-foreground mt-1">{tTools('pdfTitle')}</span>
                                <p className="text-muted text-xs leading-relaxed font-light">
                                    {tTools('pdfDesc')}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 7: Filosofía & Valores Fundamentales */}
                <ValuesPhilosophySection />

                <hr className="luxury-divider" />

                {/* Sección 8: Centro de Contacto Interactivo */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gold-300">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">{tContact('eyebrow')}</span>
                    </div>
                    <ContactForm />
                </section>

                <hr className="luxury-divider" />

                {/* Sección 9: Consola Interactiva Virtual SSH */}
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 px-2 md:px-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gold-300">
                                <Terminal className="w-4 h-4" />
                                <span className="text-[10px] font-mono tracking-widest uppercase">{tTerm('eyebrow')}</span>
                            </div>
                            <span className="luxury-badge">Terminal v1.0</span>
                        </div>
                        <h2 className="text-xl font-light text-foreground mt-1">
                            {tTerm('title')}
                        </h2>
                        <p className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light">
                            {tTerm('subtitle', { commands: 'projects, skills, help' })}
                        </p>
                    </div>
                    <TerminalConsole />
                </section>

            </main>

            {/* Footer */}
            <footer className="w-full max-w-7xl mx-auto mt-20 border-t border-border/60 pt-8 pb-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-gold-s/40 text-[10px] tracking-[0.2em] uppercase font-mono">
                <span>Jorge Ismael Doicela Molina &copy; {new Date().getFullYear()}</span>
                <div className="flex flex-wrap items-center justify-center gap-4 text-foreground/50 tracking-normal capitalize text-xs">
                    <a href="https://jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">Inicio</a>
                    <span>•</span>
                    <a href="https://software.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">Software</a>
                    <span>•</span>
                    <a href="https://bible.jorgedoicela.com" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors">Biblia</a>
                    <span>•</span>
                    <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-gold-300 transition-colors lowercase font-mono">llms.txt</a>
                </div>
            </footer>

        </div>
    );
}

