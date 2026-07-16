'use client';

import { useEffect, useState } from 'react';
import {
    Sun,
    Moon,
    BookOpen,
    Code,
    Compass,
    Mail,
    MapPin,
    ArrowUpRight,
    Globe,
    Clock,
    Layers,
    Cpu,
    Monitor
} from 'lucide-react';

export default function LandingPage() {
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState('');
    const [links, setLinks] = useState({
        portfolio: 'https://portfolio.jorgedoicela.com',
        bible: 'https://bible.jorgedoicela.com',
        software: 'https://software.jorgedoicela.com',
    });

    // Evitar hydration mismatch e inicializar reloj
    useEffect(() => {
        setMounted(true);

        // Obtener preferencia de tema
        const savedTheme = localStorage.getItem('landing-theme') as 'dark' | 'light' | null;
        if (savedTheme) {
            setTheme(savedTheme);
            document.documentElement.classList.toggle('light', savedTheme === 'light');
        } else {
            document.documentElement.classList.remove('light');
        }

        // Configurar enlaces locales de desarrollo si aplica
        const host = window.location.host;
        if (host.includes('localhost') || host.includes('127.0.0.1') || host.includes('26.')) {
            const port = window.location.port ? `:${window.location.port}` : '';
            setLinks({
                portfolio: `http://portfolio.localhost${port}`,
                bible: `http://bible.localhost${port}`,
                software: `http://software.localhost${port}`,
            });
        }

        // Función para actualizar reloj local (Quito es UTC-5)
        const updateTime = () => {
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'America/Guayaquil',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false
            };
            const formatter = new Intl.DateTimeFormat([], options);
            setTime(formatter.format(new Date()));
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(nextTheme);
        localStorage.setItem('landing-theme', nextTheme);
        document.documentElement.classList.toggle('light', nextTheme === 'light');
    };

    if (!mounted) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
                <div className="w-6 h-6 border border-zinc-700 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen flex flex-col justify-between items-center py-16 md:py-24 px-6 md:px-12 selection:bg-zinc-200 selection:text-zinc-900 dark:selection:bg-zinc-800 dark:selection:text-zinc-100 transition-colors duration-300">

            {/* Fondo Decorativo Sutil */}
            <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[10%] w-[60%] h-[40%] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[130px] transition-colors duration-300"></div>
                <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[40%] rounded-full bg-violet-500/5 dark:bg-violet-500/10 blur-[130px] transition-colors duration-300"></div>
            </div>

            {/* Header Superior - Perfectamente Alineado con el Ancho del Grid */}
            <header className="w-full max-w-5xl flex justify-between items-center mb-16 border-b border-card-border/40 pb-8 px-2 md:px-0">
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-text-subtitle bg-clip-text">
                        Jorge Doicela
                    </h1>
                    <p className="text-xs md:text-sm text-text-subtitle font-mono tracking-widest uppercase mt-0.5">
                        Desarrollo de Software & Creación de Productos Digitales
                    </p>
                </div>

                {/* Botón de Alternar Tema con Efectos Hover Refinados */}
                <button
                    onClick={toggleTheme}
                    className="p-3 rounded-full border border-card-border bg-card text-foreground hover:bg-card-border/70 hover:border-card-hover-border active:scale-95 transition-all duration-300 shadow-sm cursor-pointer"
                    aria-label="Alternar tema"
                >
                    {theme === 'dark' ? (
                        <Sun className="w-4.5 h-4.5 text-zinc-400 hover:text-amber-400 transition-colors duration-300" />
                    ) : (
                        <Moon className="w-4.5 h-4.5 text-zinc-500 hover:text-indigo-600 transition-colors duration-300" />
                    )}
                </button>
            </header>

            {/* Bento Grid Principal */}
            <main className="w-full max-w-5xl z-10 flex-grow flex flex-col justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto w-full">

                    {/* Card 1: Biblia (Ancha, Cita con estilo Serif clásico y fondo cálido marfil en modo claro) */}
                    <a
                        href={links.bible}
                        className="bento-card group md:col-span-2 p-8 rounded-[2rem] border flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[250px] relative overflow-hidden"
                    >
                        <div className="flex flex-col justify-between flex-1 pr-0 md:pr-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Plataforma de Lectura</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    La Biblia
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                                    Un espacio digital minimalista y libre de distracciones concebido para la lectura y el estudio reflexivo de las Sagradas Escrituras. Permite navegar por los libros y comparar al instante diferentes traducciones clásicas.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>Comenzar lectura</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </div>
                        </div>

                        {/* Bloque Visual de Cita - Mismo gris claro / Oscuro integrado en modo oscuro */}
                        <div className="w-full md:w-56 bg-inner-card border border-inner-card-border rounded-2xl p-6 flex flex-col justify-center items-center font-serif text-text-muted text-center shadow-inner relative transition-colors duration-300">
                            <span className="absolute top-2 left-4 text-3xl font-serif text-amber-200 dark:text-zinc-800 pointer-events-none">“</span>
                            <p className="text-xs md:text-sm italic leading-relaxed text-foreground font-light">
                                Lámpara es a mis pies tu palabra, y lumbrera a mi camino.
                            </p>
                            <span className="text-[10px] font-mono tracking-wider text-text-subtitle mt-3 block not-italic uppercase">Salmos 119:105</span>
                        </div>
                    </a>

                    {/* Card 2: Software (Ancha, Visualización del Catálogo real de Proyectos con fondo pulido) */}
                    <a
                        href={links.software}
                        className="bento-card group md:col-span-2 p-8 rounded-[2rem] border flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[250px] relative overflow-hidden"
                    >
                        <div className="flex flex-col justify-between flex-1 pr-0 md:pr-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Code className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Galería de Aplicaciones</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    Proyectos & Sistemas
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                                    Un catálogo con las principales soluciones interactivas, herramientas y plataformas web que he desarrollado. Aplicaciones optimizadas enfocadas en resolver necesidades de forma fluida.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>Ver aplicaciones</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </div>
                        </div>

                        {/* Listado de proyectos destacados - Fondo sutil adaptativo */}
                        <div className="w-full md:w-56 bg-inner-card border border-inner-card-border rounded-2xl p-6 flex flex-col justify-between shadow-inner transition-colors duration-300">
                            <span className="text-[9px] font-mono text-text-subtitle uppercase tracking-widest border-b border-card-border/40 pb-2 w-full text-center">Destacados</span>
                            <div className="flex-grow flex flex-col justify-center gap-2.5 my-2 text-[10.5px] font-mono text-text-muted">
                                <div className="flex justify-between border-b border-card-border/20 pb-1.5">
                                    <span className="text-foreground font-medium">01 / Biblia App</span>
                                    <span className="text-text-subtitle text-[9px]">Lectura</span>
                                </div>
                                <div className="flex justify-between border-b border-card-border/20 pb-1.5">
                                    <span className="text-foreground font-medium">02 / DIITRA Web</span>
                                    <span className="text-text-subtitle text-[9px]">Ciencia</span>
                                </div>
                                <div className="flex justify-between pb-0.5">
                                    <span className="text-foreground font-medium">03 / Portafolio</span>
                                    <span className="text-text-subtitle text-[9px]">Consola</span>
                                </div>
                            </div>
                            <span className="text-[8px] font-mono text-text-subtitle text-center">Código Abierto & Herramientas</span>
                        </div>
                    </a>

                    {/* Card 3: Portafolio (Ancha, Composición de Secciones) */}
                    <a
                        href={links.portfolio}
                        className="bento-card group md:col-span-2 p-8 rounded-[2rem] border flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[200px] overflow-hidden"
                    >
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <h2 className="text-xl font-medium text-foreground mb-2">
                                    Portafolio Interactivo
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm font-light max-w-sm">
                                    Descubre mi trayectoria profesional, historial laboral y formación académica de una forma completamente interactiva ingresando comandos en una consola web en tiempo real.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>Explorar mi perfil</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </div>
                        </div>

                        {/* Listado de secciones */}
                        <div className="w-full md:w-56 flex flex-col justify-center gap-3 border-t md:border-t-0 md:border-l border-card-border/60 pt-4 md:pt-0 md:pl-6 font-mono text-xs text-text-muted">
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>01 / Proyectos</span>
                                <span className="text-[10px] text-text-subtitle font-bold">→</span>
                            </div>
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>02 / Trayectoria</span>
                                <span className="text-[10px] text-text-subtitle font-bold">→</span>
                            </div>
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>03 / Consola interactiva</span>
                                <span className="text-[10px] text-text-subtitle font-bold">→</span>
                            </div>
                        </div>
                    </a>

                    {/* Card 4: Reloj Dinámico (Centrado y Pulido) */}
                    <div className="bento-card p-8 rounded-[2rem] border flex flex-col justify-between shadow-sm min-h-[200px] relative overflow-hidden">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-subtitle font-mono tracking-widest uppercase">Hora Local</span>
                            <Clock className="w-4 h-4 text-zinc-400" />
                        </div>

                        <div className="my-auto flex flex-col items-center text-center justify-center py-2">
                            <div className="text-3xl md:text-4xl font-light tracking-widest text-foreground font-mono">
                                {time || '--:--:--'}
                            </div>
                            <span className="text-[9px] text-text-subtitle font-mono mt-1.5 uppercase tracking-wider">Quito, Ecuador / UTC-5</span>
                        </div>

                        <div className="pt-2 border-t border-card-border/40 text-[9px] text-text-muted font-mono tracking-wider">
                            ZONA HORARIA ACTIVA
                        </div>
                    </div>

                    {/* Card 5: Filosofía / Enfoque */}
                    <div className="bento-card p-8 rounded-[2rem] border flex flex-col justify-between shadow-sm min-h-[200px]">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-text-subtitle font-mono tracking-widest uppercase">Mi Enfoque</span>
                            <Compass className="w-4 h-4 text-zinc-400" />
                        </div>

                        <div className="my-4">
                            <p className="text-xs leading-relaxed text-text-muted font-light">
                                Crear soluciones sencillas a problemas complejos. Priorizar la claridad, el rendimiento y la facilidad de uso para que el software sea verdaderamente valioso.
                            </p>
                        </div>

                        <span className="text-[9px] text-text-subtitle font-mono tracking-wider uppercase">Metodología</span>
                    </div>

                    {/* Card 6: Conectar / Redes (Botones con fondo adaptativo suave en modo claro) */}
                    <div className="bento-card md:col-span-2 p-8 rounded-[2rem] border flex flex-col md:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[140px]">
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <span className="text-[10px] text-text-subtitle font-mono tracking-widest uppercase block mb-1">Contacto</span>
                                <h3 className="text-lg font-medium text-foreground">Conectar con Jorge</h3>
                            </div>
                            <span className="text-[9px] text-text-subtitle font-mono tracking-wider uppercase mt-4 md:mt-0">Canales directos</span>
                        </div>

                        {/* Botones de contacto con fondos e interacciones suavizadas */}
                        <div className="w-full md:w-72 flex flex-col justify-center gap-2">
                            <a
                                href="mailto:jorge@doicela.com"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-500/70" />
                                    <span>jorge@doicela.com</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </a>
                            <a
                                href="https://github.com/JorgeDoicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-zinc-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                                        <path d="M9 18c-4.51 2-5-2-7-2" />
                                    </svg>
                                    <span>github.com/JorgeDoicela</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </a>
                        </div>
                    </div>

                    {/* Card 7: Especialidades (Ancha, con cajitas de alta legibilidad e iconos de alto contraste) */}
                    <div className="bento-card md:col-span-2 p-8 rounded-[2rem] border flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm min-h-[140px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-text-subtitle">
                                    <Layers className="w-4 h-4 animate-pulse" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Áreas de Práctica</span>
                                </div>
                                <h3 className="text-lg font-medium text-foreground">Servicios Profesionales</h3>
                                <p className="text-text-muted text-xs font-light mt-1">
                                    Desarrollo de software de extremo a extremo, estructurando sistemas robustos y diseñando interfaces fluidas.
                                </p>
                            </div>
                        </div>

                        {/* Bloques de especialidad con colores de iconos y fondos altamente refinados */}
                        <div className="w-full md:w-72 flex gap-3 justify-center items-center">
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-20 py-2.5 rounded-xl bg-inner-card border border-inner-card-border flex flex-col items-center shadow-sm transition-colors duration-300">
                                    <Cpu className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
                                    <span className="text-[8.5px] font-mono text-text-muted mt-1.5 text-center font-medium">Lógica</span>
                                </div>
                                <span className="text-[8px] font-mono text-text-subtitle uppercase tracking-wider">Sistemas</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-20 py-2.5 rounded-xl bg-inner-card border border-inner-card-border flex flex-col items-center shadow-sm transition-colors duration-300">
                                    <Monitor className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                                    <span className="text-[8.5px] font-mono text-text-muted mt-1.5 text-center font-medium">Interfaces</span>
                                </div>
                                <span className="text-[8px] font-mono text-text-subtitle uppercase tracking-wider">Frontend</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <div className="w-20 py-2.5 rounded-xl bg-inner-card border border-inner-card-border flex flex-col items-center shadow-sm transition-colors duration-300">
                                    <Layers className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
                                    <span className="text-[8.5px] font-mono text-text-muted mt-1.5 text-center font-medium">Estructura</span>
                                </div>
                                <span className="text-[8px] font-mono text-text-subtitle uppercase tracking-wider">Arquitectura</span>
                            </div>
                        </div>
                    </div>

                </div>
            </main>

        </div>
    );
}
