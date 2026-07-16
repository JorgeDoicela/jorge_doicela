import { TerminalConsole } from '../features/terminal/components/TerminalConsole';
import { ThemeToggle } from '../components/ThemeToggle';
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
    RefreshCw
} from 'lucide-react';

export default function PortfolioPage() {
    return (
        <div className="min-h-screen bg-background text-foreground py-16 md:py-24 px-6 md:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">

            {/* Header con ThemeToggle */}
            <div className="fixed top-4 right-4 z-50">
                <ThemeToggle />
            </div>

            {/* Cabecera Principal */}
            <header className="w-full max-w-5xl mx-auto mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-border pb-8 animate-fade-in">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-extralight tracking-[0.15em] uppercase text-gold-gradient bg-gradient-to-r from-gold-100 via-gold-300 to-gold-200 bg-clip-text text-transparent">
                        Jorge Ismael Doicela Molina
                    </h1>
                    <p className="text-foreground/80 text-xs md:text-sm tracking-wider font-mono uppercase">
                        Desarrollador de Software con enfoque en DevSecOps
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="luxury-badge">
                        <Shield className="w-3.5 h-3.5 text-gold-300" />
                        <span>IA & Ciberseguridad</span>
                    </span>
                    <span className="luxury-badge luxury-pulse">
                        <span>En progreso</span>
                    </span>
                </div>
            </header>

            {/* Contenido Principal en Flujo Lineal y Asimétrico */}
            <main className="w-full max-w-5xl mx-auto flex flex-col gap-16 animate-fade-up">

                {/* Sección 1: Sobre Mí & Contactos (Asimétrico, sin cajas rígidas) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

                    {/* Biografía (Columna izquierda y central - 2 cols) */}
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-gold-300">
                            <Cpu className="w-4 h-4" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">Sobre Mí</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
                            Ingeniería & Valores
                        </h2>
                        <div className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light space-y-4">
                            <p>
                                Desarrollador de software radicado en Quito, Ecuador, y guiado por valores cristianos. Me apasiona el desarrollo de sistemas web, aplicaciones nativas y multiplataforma, así como la administración de servidores (locales y cloud), con un enfoque orientado a soluciones integrales, arquitecturas escalables, seguridad e Infraestructura como Código (IaC).
                            </p>
                            <p>
                                Mi experiencia abarca el desarrollo Full-Stack, trabajando con tecnologías frontend y backend como React, Next.js, NestJS, Laravel / Blade y .NET, lenguajes de programación como PHP, C#, Python, C y C++, además de bases de datos relacionales (PostgreSQL y MySQL) y no relacionales (MongoDB). Integro prácticas de DevSecOps y principios de diseño seguro desde el inicio del ciclo de desarrollo.
                            </p>
                            <p>
                                En paralelo, expando mis conocimientos cursando la Ingeniería en Inteligencia Artificial y Ciberseguridad, lo que me permite aplicar un enfoque de hardening a los sistemas que diseño. Con una marcada sensibilidad por la estética visual y un gran interés por el diseño limpio y minimalista, disfruto la aplicación de diferentes estilos de diseño (como el Linear Look y distribuciones Bento Grid).
                            </p>
                        </div>
                    </div>

                    {/* Contactos Rápidos (Columna derecha - 1 col) */}
                    <div className="flex flex-col gap-4 md:pl-6 md:border-l border-border/40">
                        <span className="text-[10px] font-mono text-gold-300 tracking-widest uppercase mb-2">Conexiones</span>
                        <a
                            href="https://linkedin.com/in/jorgedoicela"
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

                {/* Sección 2: Tecnologías & Stack (Grid de Etiquetas, sin cajas pesadas) */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gold-300">
                        <Code className="w-4 h-4" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">Stack Principal</span>
                    </div>
                    <h2 className="text-2xl font-light text-foreground">
                        Tecnologías & Stack Principal
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
                        {/* Grupo 1 */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/60 pb-1.5">Client & Frontend</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="luxury-badge">React</span>
                                <span className="luxury-badge">Next.js</span>
                                <span className="luxury-badge">TypeScript</span>
                                <span className="luxury-badge">Vite</span>
                            </div>
                        </div>
                        {/* Grupo 2 */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/60 pb-1.5">Server & Backend</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="luxury-badge">NestJS</span>
                                <span className="luxury-badge">Laravel</span>
                                <span className="luxury-badge">Blade</span>
                                <span className="luxury-badge">PHP</span>
                                <span className="luxury-badge">C#</span>
                                <span className="luxury-badge">C / C++</span>
                                <span className="luxury-badge">Python</span>
                            </div>
                        </div>
                        {/* Grupo 3 */}
                        <div className="flex flex-col gap-3">
                            <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/60 pb-1.5">Data & DevSecOps</span>
                            <div className="flex flex-wrap gap-2">
                                <span className="luxury-badge">PostgreSQL</span>
                                <span className="luxury-badge">MySQL</span>
                                <span className="luxury-badge">MongoDB</span>
                                <span className="luxury-badge">Docker</span>
                                <span className="luxury-badge">AWS</span>
                                <span className="luxury-badge">GitHub Actions</span>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 3: Experiencia & Educación (Disposición Lineal Asimétrica de 2 Columnas) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">

                    {/* Experiencia Laboral (2 Columnas de ancho) */}
                    <div className="md:col-span-2 flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-gold-300">
                            <Briefcase className="w-4 h-4" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">Experiencia Laboral</span>
                        </div>
                        <h2 className="text-2xl font-light text-foreground mb-2">
                            Experiencia Reciente
                        </h2>

                        <div className="space-y-8">
                            <div className="border-l border-border-gold pl-4 relative">
                                <div className="absolute w-2 h-2 rounded-full bg-gold-400 -left-[5px] top-1.5 luxury-pulse"></div>
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="text-sm font-mono text-foreground font-semibold">Emplifi</h3>
                                    <span className="text-[10px] font-mono text-muted uppercase">Full-Stack Developer</span>
                                </div>
                                <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                                    Desarrollo Full-Stack y optimización de APIs para el sistema de gestión de recursos humanos, mejorando el rendimiento general y la persistencia de datos.
                                </p>
                            </div>

                            <div className="border-l border-border-gold pl-4 relative">
                                <div className="absolute w-2 h-2 rounded-full bg-gold-500 -left-[5px] top-1.5"></div>
                                <div className="flex justify-between items-start mb-1.5">
                                    <h3 className="text-sm font-mono text-foreground font-semibold">Plataforma de Capacitaciones (CNC)</h3>
                                    <span className="text-[10px] font-mono text-muted uppercase">Desarrollador Backend</span>
                                </div>
                                <p className="text-muted text-xs md:text-sm leading-relaxed font-light">
                                    Estabilización de código, desarrollo de módulos backend y despliegue contenedorizado con Docker para el Consejo Nacional de Competencias.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Educación (1 Columna de ancho) */}
                    <div className="flex flex-col gap-6 md:pl-6 md:border-l border-border/40 h-full justify-between">
                        <div className="flex flex-col gap-6">
                            <div className="flex items-center gap-2 text-gold-300">
                                <GraduationCap className="w-4 h-4" />
                                <span className="text-[10px] font-mono tracking-widest uppercase">Educación</span>
                            </div>
                            <h2 className="text-2xl font-light text-foreground mb-2">
                                Formación
                            </h2>

                            <div className="space-y-5">
                                <div>
                                    <h3 className="text-xs md:text-sm font-mono text-foreground font-semibold">Ingeniería en Inteligencia Artificial y Ciberseguridad</h3>
                                    <p className="text-[10px] text-gold-400 font-mono mt-1">UB - En progreso</p>
                                </div>
                                <div className="border-t border-border/30 pt-4">
                                    <h3 className="text-xs md:text-sm font-mono text-foreground font-semibold">Tecnólogo Superior en Desarrollo de Software</h3>
                                    <p className="text-[10px] text-muted font-mono mt-1">Tecnológico Traversari - Egresado</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 4: Cloud, CI/CD y Hardening (Lineal de 3 Columnas) */}
                <section className="flex flex-col gap-6">
                    <div className="flex items-center gap-2 text-gold-300">
                        <Shield className="w-4 h-4" />
                        <span className="text-[10px] font-mono tracking-widest uppercase">Firma Técnica</span>
                    </div>
                    <h2 className="text-2xl font-light text-foreground">
                        Nube, DevSecOps & Ciberseguridad
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-2">
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2">
                                <Server className="w-4.5 h-4.5 text-gold-400" />
                                <h3 className="text-xs font-mono font-semibold text-foreground">Infraestructura Cloud</h3>
                            </div>
                            <p className="text-muted text-xs leading-relaxed font-light">
                                Despliegue de arquitecturas en la nube mediante servicios de Amazon Web Services (AWS) como Lightsail para mantener servidores VPS de alto rendimiento.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2.5 md:px-4 md:border-x border-border/40">
                            <div className="flex items-center gap-2">
                                <RefreshCw className="w-4.5 h-4.5 text-gold-400" />
                                <h3 className="text-xs font-mono font-semibold text-foreground">Automatización y CI/CD</h3>
                            </div>
                            <p className="text-muted text-xs leading-relaxed font-light">
                                Integración de pipelines de despliegue continuo (CI/CD) con herramientas como GitHub Actions, dirigidos de forma automatizada hacia VPS y servidores cloud.
                            </p>
                        </div>
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2">
                                <Shield className="w-4.5 h-4.5 text-gold-400" />
                                <h3 className="text-xs font-mono font-semibold text-foreground">Ciberseguridad</h3>
                            </div>
                            <p className="text-muted text-xs leading-relaxed font-light">
                                Integración de prácticas DevSecOps desde el diseño inicial, asegurando el empaquetado seguro en Docker y mitigando riesgos de seguridad a nivel de arquitectura.
                            </p>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 5: Flujo & Herramientas (Lineal Asimétrica) */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2 flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-gold-300">
                            <Layers className="w-4 h-4" />
                            <span className="text-[10px] font-mono tracking-widest uppercase">Entorno de Trabajo</span>
                        </div>
                        <h2 className="text-2xl font-light text-foreground mb-2">
                            Flujo de Trabajo & Herramientas
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-2">
                            <div className="flex flex-col gap-2.5">
                                <span className="text-[10.5px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/40 pb-1">Sistemas & Terminal</span>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    <span className="luxury-badge">Arch Linux</span>
                                    <span className="luxury-badge">Debian</span>
                                    <span className="luxury-badge">Neovim</span>
                                    <span className="luxury-badge">tmux</span>
                                    <span className="luxury-badge">Alacritty</span>
                                    <span className="luxury-badge">Hyprland</span>
                                    <span className="luxury-badge">Figma</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <span className="text-[10.5px] font-mono text-gold-400 tracking-wider uppercase border-b border-border/40 pb-1">Estudio Técnico</span>
                                <span className="text-xs font-mono font-semibold text-foreground mt-1">Sioyek Lector PDF</span>
                                <p className="text-muted text-xs leading-relaxed font-light">
                                    Lector de PDFs técnicos enfocado en navegación ágil por teclado para agilizar el estudio académico y técnico profundo.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <hr className="luxury-divider" />

                {/* Sección 6: Consola Interactiva (La Única Caja Bento / Luxury Card del Portafolio) */}
                <section className="md:col-span-3 flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5 px-2 md:px-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gold-300">
                                <Terminal className="w-4 h-4" />
                                <span className="text-[10px] font-mono tracking-widest uppercase">Módulo Interactivo</span>
                            </div>
                            <span className="luxury-badge">Terminal v1.0</span>
                        </div>
                        <h2 className="text-xl font-light text-foreground mt-1">
                            Consola Virtual
                        </h2>
                        <p className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light">
                            Si prefieres la interacción clásica por comandos, puedes explorar mi perfil y proyectos ingresando comandos de Unix (como <code className="font-mono text-gold-300 bg-background/50 px-1.5 py-0.5 rounded text-[11px]">help</code> o <code className="font-mono text-gold-300 bg-background/50 px-1.5 py-0.5 rounded text-[11px]">projects</code>) en esta terminal virtual en tiempo real:
                        </p>
                    </div>
                    <TerminalConsole />
                </section>

            </main>

            {/* Footer */}
            <footer className="w-full max-w-5xl mx-auto mt-20 border-t border-border/60 pt-8 text-center text-gold-s/40 text-[10px] tracking-[0.2em] uppercase font-mono">
                Jorge Ismael Doicela Molina &copy; {new Date().getFullYear()}
            </footer>

        </div>
    );
}
