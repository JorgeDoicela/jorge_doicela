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
    ArrowUpRight,
    Shield,
    Server,
    RefreshCw
} from 'lucide-react';

async function getPortfolioProjects(locale: string): Promise<PortfolioProject[]> {
    try {
        const res = await fetch(`http://127.0.0.1:3000/portfolio/projects?lang=${locale}`, {
            next: { revalidate: 60 },
        });
        if (res.ok) {
            const data = await res.json();
            const rawProjects = Array.isArray(data) ? data : data.data || [];
            if (rawProjects.length > 0) {
                return rawProjects.map((p: any) => ({
                    ...p,
                    technologies: Array.isArray(p.technologies)
                        ? p.technologies
                        : (typeof p.technologies === 'string' && p.technologies.trim().startsWith('[')
                            ? JSON.parse(p.technologies)
                            : (typeof p.technologies === 'string' ? p.technologies.split(',').map((s: string) => s.trim()) : [])),
                }));
            }
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
                featured: true,
                overview: 'Plataforma integral de exégesis bíblica orientada a la investigación académica y estudio pastoral profundo, combinando la lectura textual continua con aparatos morfológicos masoréticos y griegos en tiempo real.',
                challenge: 'Indexar y relacionar de forma determinista más de 31,000 versículos, tokens morfológicos BHS/NA28 y léxicos Strong BDB/Gesenius manteniendo tiempos de respuesta inferiores a 40 ms bajo una memoria RAM severamente restringida.',
                architectureHighlights: [
                    '9 motores de exégesis modulares (Interlineal Inverso, Quiasmos, Atlas WGS84, Cronología Sincrónica, etc.)',
                    'Persistencia ultra-ligera en bible.sqlite con better-sqlite3 en modo WAL e índices compuestos B-Tree',
                    'Integración oficial autorizada con API.Bible para versiones con derechos y fallback determinista local',
                    'Cliente móvil nativo con Expo SDK 52, FlashList a 60 fps constantes y arquitectura Offline-First'
                ],
                metrics: [
                    { label: 'Motores de Exégesis', value: '9' },
                    { label: 'Tiempo de Ingestión', value: '< 80 ms' },
                    { label: 'Consumo de RAM', value: '~45 MB' }
                ]
            },
            {
                id: 3,
                slug: 'software-platform',
                title: 'Software',
                description: 'Plataforma de contenidos tecnológicos con 7 áreas temáticas, avisos de ciberseguridad, catálogo de modelos de IA, tutoriales interactivos y foros.',
                role: 'Full Stack & DevSecOps Engineer',
                technologies: ['Next.js 16', 'NestJS 11', 'SQLite', 'Neumorphism UI', 'Glassmorphism'],
                language: 'es',
                repoUrl: 'https://github.com/jorgedoicela/jorge_doicela',
                demoUrl: 'https://software.jorgedoicela.com',
                featured: true,
                overview: 'Hub tecnológico desacoplado que centraliza divulgación de software, avisos de vulnerabilidades con matrices de remediación, fichas técnicas de agentes de IA y tutoriales interactivos con ejecución guiada.',
                challenge: 'Diseñar un monolito modular con 7 submódulos independientes sin acoplamiento, asegurando que cada dominio gestione sus propias entidades relacionales y soporte multiidioma con índices compuestos (slug, language).',
                architectureHighlights: [
                    'Arquitectura en 3 capas puras por submódulo: controladores REST, servicios de dominio y 9 entidades TypeORM',
                    'Asistente StepWizard interactivo con resaltado de sintaxis para guías de código paso a paso',
                    'Diseño Neumorphism UI + Glassmorphism con paneles táctiles cóncavos/convexos y desenfoque vítreo',
                    'Sembrado transaccional atómico CLI (seed-software.ts) que procesa 8 tablas en menos de 25 ms'
                ],
                metrics: [
                    { label: 'Áreas Verticales', value: '7' },
                    { label: 'Entidades Relacionales', value: '9' },
                    { label: 'Latencia Promedio', value: '< 20 ms' }
                ]
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
                featured: true,
                overview: 'Infraestructura de producción de alta resiliencia diseñada para ejecutar 4 plataformas web y backend simultáneamente en un servidor limitado físicamente a 1 GB de RAM.',
                challenge: 'Evitar el colapso de memoria del sistema operativo y sobrecargas por scraping de bots de IA mediante consolidación de runtimes, proxy reverso inteligente y rate limiting perimetral.',
                architectureHighlights: [
                    'Consolidación física (NestJS en 3000 y Next.js Standalone en 3001) con aislamiento lógico absoluto de Cajas Negras',
                    'Autenticación mutua TLS (mTLS) de Cloudflare bloqueando accesos directos por IP',
                    'Entrega Zero-RAM en Nginx para dossiers llms.txt, manifest.json y favicons en < 1 ms',
                    'Pipeline CI/CD en GitHub Actions con compilación offloaded y rsync seguro con zero-downtime'
                ],
                metrics: [
                    { label: 'Límite Físico de RAM', value: '1 GB' },
                    { label: 'Consumo Operativo Total', value: '~170 MB' },
                    { label: 'Uptime en Producción', value: '99.9%' }
                ]
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
                featured: true,
                overview: 'Consola interactiva de baja latencia que ofrece navegación guiada de comandos Unix y acceso a un Live Linux Sandbox en contenedores efímeros aislados.',
                challenge: 'Exponer una shell real interactiva a internet sin riesgo de fuga de datos, ataques de denegación de servicio por bifurcación (fork-bombs) ni escalada de privilegios.',
                architectureHighlights: [
                    'Hardening de 5 capas: cgroups (64 MB RAM, 0.25 CPU), pids-limit=50, CapDrop ALL y no-new-privileges',
                    'Sistema de archivos inmutable con raíz Readonly y tmpfs volátil en RAM con banderas noexec,nosuid',
                    'Aislamiento perimetral absoluto con NetworkMode: none (cero conectividad externa e interna)',
                    'Transmisión full-duplex con Socket.io, emulación xterm.js y TTL forzado con limpieza automática de contenedores'
                ],
                metrics: [
                    { label: 'Latencia WebSocket', value: '< 15 ms' },
                    { label: 'Aislamiento cgroups', value: '64 MB' },
                    { label: 'Inmunidad Fork-bomb', value: 'pids ≤ 50' }
                ]
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
                featured: true,
                overview: 'Comprehensive biblical exegesis platform tailored for academic research and deep pastoral study, combining continuous scripture reading with real-time Masoretic and Greek morphological apparatuses.',
                challenge: 'Deterministically indexing and querying over 31,000 verses, BHS/NA28 morphology tokens, and Strong lexicons while sustaining under 40 ms query latencies under tight RAM constraints.',
                architectureHighlights: [
                    '9 modular exegesis suites (Reverse Interlinear, Chiasms, WGS84 Atlas, Synchronic Chronology, etc.)',
                    'Ultra-lightweight SQLite WAL persistence with better-sqlite3 and B-Tree compound indices',
                    'Official authorized API.Bible integration with resilient local deterministic caching',
                    'Native mobile client with Expo SDK 52, FlashList 60 fps recycling, and Offline-First architecture'
                ],
                metrics: [
                    { label: 'Exegesis Suites', value: '9' },
                    { label: 'Ingestion Time', value: '< 80 ms' },
                    { label: 'RAM Footprint', value: '~45 MB' }
                ]
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
                featured: true,
                overview: 'Decoupled engineering portal uniting tech news, security advisories with remediation guides, AI reasoning models directory, and interactive code tutorials.',
                challenge: 'Architecting a pure modular monolith composed of 7 independent submodules, guaranteeing domain isolation and compound unique index localized storage.',
                architectureHighlights: [
                    'Pure 3-tier architecture per submodule: REST controllers, domain services, and 9 TypeORM entities',
                    'Interactive StepWizard code assistant featuring reproducible walkthroughs and syntax highlighting',
                    'Neumorphism UI + Glassmorphism design tokens with concave/convex surfaces and frosted blurs',
                    'Atomic transactional CLI seeder (seed-software.ts) digesting 8 relational tables in under 25 ms'
                ],
                metrics: [
                    { label: 'Vertical Domains', value: '7' },
                    { label: 'Database Entities', value: '9' },
                    { label: 'Average Latency', value: '< 20 ms' }
                ]
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
                featured: true,
                overview: 'High-resilience production cloud infrastructure engineered to execute 4 independent platforms and real-time WebSockets on a physically constrained 1 GB RAM server.',
                challenge: 'Preventing kernel out-of-memory panics and crawler resource exhaustion through runtime consolidation, smart reverse proxying, and perimeter IP rate limiting.',
                architectureHighlights: [
                    'Physical runtime consolidation (NestJS port 3000, Next.js Standalone port 3001) under Black Box isolation',
                    'Cloudflare Authenticated Origin Pulls (mTLS) completely rejecting unauthenticated IP requests',
                    'Zero-RAM static delivery on Nginx for llms.txt dossiers, manifest.json, and assets in < 1 ms',
                    'Offloaded GitHub Actions CI/CD pipeline building standalone bundles and deploying via zero-downtime rsync'
                ],
                metrics: [
                    { label: 'Physical RAM Limit', value: '1 GB' },
                    { label: 'Total Memory Footprint', value: '~170 MB' },
                    { label: 'Production Uptime', value: '99.9%' }
                ]
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
                featured: true,
                overview: 'Low-latency full-duplex interactive terminal supporting guided Unix navigation alongside an on-demand hardened Linux Sandbox executed in ephemeral Docker containers.',
                challenge: 'Safely granting web visitors raw interactive bash shell access without risk of host container escape, fork-bomb denial-of-service, or network exfiltration.',
                architectureHighlights: [
                    '5-layer hardening: cgroups (64 MB RAM, 0.25 CPU), 50 max pids, CapDrop ALL, and no-new-privileges',
                    'Immutable root filesystem with tmpfs volatile memory mounts enforcing noexec and nosuid flags',
                    'Perimeter air-gap with NetworkMode none (zero external and local networking interfaces)',
                    'Full-duplex Socket.io streaming, xterm.js terminal emulation, and automatic container reaping'
                ],
                metrics: [
                    { label: 'WebSocket Latency', value: '< 15 ms' },
                    { label: 'cgroups Boundary', value: '64 MB' },
                    { label: 'Fork-bomb Immunity', value: 'pids ≤ 50' }
                ]
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

                {/* Sección 8: Consola Interactiva Virtual SSH */}
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 px-2 md:px-0">
                        <div className="flex items-center gap-2 text-gold-300">
                            <span className="text-[10px] font-mono tracking-widest uppercase">{tTerm('eyebrow')}</span>
                        </div>
                        <h2 className="text-xl font-light text-foreground mt-1">
                            {tTerm('title')}
                        </h2>
                        <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                            {tTerm('subtitle')}
                        </p>
                    </div>
                    <TerminalConsole />
                </section>

                <hr className="luxury-divider" />

                {/* Sección 9: Centro de Contacto Interactivo */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gold-300">
                        <span className="text-[10px] font-mono tracking-widest uppercase">{tContact('eyebrow')}</span>
                    </div>
                    <ContactForm />
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

