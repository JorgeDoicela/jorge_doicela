'use client';

import { useEffect, useState } from 'react';
import ParallaxBackground from './components/ParallaxBackground';
import InteractiveParticles from './components/InteractiveParticles';
import TypewriterRole from './components/TypewriterRole';
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
    const [greeting, setGreeting] = useState('¡Bienvenido y bienvenida!');
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

        // Función para actualizar el saludo basado en la hora local de Quito
        const updateGreeting = () => {
            const options: Intl.DateTimeFormatOptions = {
                timeZone: 'America/Guayaquil',
                hour: 'numeric',
                hour12: false
            };
            const formatter = new Intl.DateTimeFormat([], options);
            const hour = parseInt(formatter.format(new Date()), 10);

            let salute = '¡Bienvenido y bienvenida!';
            if (hour >= 6 && hour < 12) {
                salute = '¡Bienvenido y bienvenida! Buenos días';
            } else if (hour >= 12 && hour < 19) {
                salute = '¡Bienvenido y bienvenida! Buenas tardes';
            } else {
                salute = '¡Bienvenido y bienvenida! Buenas noches';
            }
            setGreeting(salute);
        };

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

        updateGreeting();
        updateTime();
        const interval = setInterval(() => {
            updateTime();
            updateGreeting();
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';

        const applyTheme = () => {
            setTheme(nextTheme);
            localStorage.setItem('landing-theme', nextTheme);
            document.documentElement.classList.toggle('light', nextTheme === 'light');
        };

        const doc = document as Document & {
            startViewTransition?: (callback: () => void) => { ready: Promise<void> };
        };

        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!doc.startViewTransition || isReducedMotion) {
            applyTheme();
            return;
        }

        const rect = e.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        const endRadius = Math.hypot(
            Math.max(x, window.innerWidth - x),
            Math.max(y, window.innerHeight - y)
        );

        const transition = doc.startViewTransition(() => {
            applyTheme();
        });

        transition.ready.then(() => {
            const clipPath = [
                `circle(0px at ${x}px ${y}px)`,
                `circle(${endRadius}px at ${x}px ${y}px)`
            ];
            document.documentElement.animate(
                {
                    clipPath: nextTheme === 'light' ? clipPath : [...clipPath].reverse()
                },
                {
                    duration: 450,
                    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                    pseudoElement: nextTheme === 'light'
                        ? '::view-transition-new(root)'
                        : '::view-transition-old(root)'
                }
            );
        });
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

            {/* Fondo Parallax Decorativo Tridimensional y Partículas Interactivas */}
            <ParallaxBackground />
            <InteractiveParticles />
            {/* Header Superior - Perfectamente Alineado con el Ancho del Grid */}
            <header 
                className="animate-fade-in-up w-full max-w-5xl flex justify-between items-center mb-8 border-b border-card-border/40 pb-6 px-2 md:px-0"
                style={{ animationDelay: '0ms' }}
            >
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground bg-gradient-to-r from-foreground via-foreground/90 to-text-subtitle bg-clip-text">
                        Jorge Doicela
                    </h1>
                    <TypewriterRole />
                </div>

                <div className="flex items-center gap-6">
                    {/* Widget de Hora Local Minimalista */}
                    <div className="hidden sm:flex flex-col items-end text-right font-mono">
                        <span className="text-xs text-foreground tracking-widest">{time || '--:--:--'}</span>
                        <span className="text-[8px] text-text-subtitle uppercase tracking-widest mt-0.5">Quito, Ecuador</span>
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
                </div>
            </header>

            {/* Contenido Principal */}
            <main className="w-full max-w-5xl z-10 flex-grow flex flex-col gap-6 justify-center">

                {/* Tarjeta de Bienvenida & Perfil (Estática de Cristal al Inicio) */}
                <div 
                    className="animate-fade-in-up static-glass-card p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 md:gap-12 justify-between items-start md:items-center shadow-sm min-h-[160px] w-full"
                    style={{ animationDelay: '100ms' }}
                >
                    <div className="flex-1 flex flex-col gap-2">
                        <span className="text-[10px] font-mono text-indigo-500 dark:text-indigo-400 tracking-widest uppercase font-medium">
                            {greeting}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                            Página Personal
                        </h2>
                    </div>
                    <div className="flex-[2] max-w-2xl">
                        <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                            Te doy la bienvenida a mi espacio digital. Soy desarrollador de software y estudiante de Ingeniería en Inteligencia Artificial y Ciberseguridad, residiendo en Quito. <strong className="font-semibold text-foreground">Por sobre todas las cosas, soy cristiano y creyente en Dios</strong>, y mi propósito es crear tecnología de excelencia que no solo solucione problemas complejos, sino que edifique a la comunidad y sea de utilidad para las personas, todo para la gloria de Dios.
                        </p>
                    </div>
                </div>

                {/* Grid de Experiencias Digitales (Tarjetas de Cristal Esmerilado) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">

                    {/* Card 1: Biblia */}
                    <a
                        href={links.bible}
                        className="animate-fade-in-up interactive-glass-card group p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[250px] relative overflow-hidden"
                        style={{ animationDelay: '200ms' }}
                    >
                        <div className="flex flex-col justify-between flex-1 pr-0 sm:pr-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Estudios & Recursos Bíblicos</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    La Biblia
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                                    Un ecosistema completo concebido para el estudio teológico, la evangelización y el crecimiento espiritual. Explora estudios bíblicos, libros, noticias y guías de ayuda espiritual creados para la gloria de Dios.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>Explorar recursos</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </div>
                        </div>

                        {/* Bloque Visual de Cita */}
                        <div className="w-full sm:w-52 bg-inner-card border border-inner-card-border rounded-2xl p-6 flex flex-col justify-center items-center font-serif text-text-muted text-center shadow-inner relative transition-colors duration-350">
                            <span className="absolute top-2 left-4 text-3xl font-serif text-indigo-500/10 pointer-events-none">“</span>
                            <p className="text-xs md:text-sm italic leading-relaxed text-foreground font-light font-serif">
                                Lámpara es a mis pies tu palabra, y lumbrera a mi camino.
                            </p>
                            <span className="text-[9px] font-mono tracking-wider text-text-subtitle mt-3 block not-italic uppercase">Salmos 119:105</span>
                        </div>
                    </a>

                    {/* Card 2: Software */}
                    <a
                        href={links.software}
                        className="animate-fade-in-up interactive-glass-card group p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[250px] relative overflow-hidden"
                        style={{ animationDelay: '300ms' }}
                    >
                        <div className="flex flex-col justify-between flex-1 pr-0 sm:pr-4">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Code className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Portal de Tecnología</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    Software & Noticias
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm leading-relaxed font-light">
                                    Un espacio dedicado a la publicación de noticias de software, últimas tendencias en inteligencia artificial, cultura DevSecOps, ciberseguridad y análisis técnicos de ingeniería de sistemas.
                                </p>
                            </div>
                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>Entrar al portal</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </div>
                        </div>

                        {/* Listado de destacados */}
                        <div className="w-full sm:w-52 bg-inner-card border border-inner-card-border rounded-2xl p-6 flex flex-col justify-between shadow-inner transition-colors duration-350">
                            <span className="text-[9px] font-mono text-text-subtitle uppercase tracking-widest border-b border-card-border/40 pb-2 w-full text-center">Destacados</span>
                            <div className="flex-grow flex flex-col justify-center gap-2.5 my-2 text-[10.5px] font-mono text-text-muted">
                                <div className="flex justify-between border-b border-card-border/20 pb-1.5">
                                    <span className="text-foreground font-medium">01 / Modelos & IA</span>
                                    <span className="text-text-subtitle text-[9px]">Noticias</span>
                                </div>
                                <div className="flex justify-between border-b border-card-border/20 pb-1.5">
                                    <span className="text-foreground font-medium">02 / DevSecOps</span>
                                    <span className="text-text-subtitle text-[9px]">Cultura</span>
                                </div>
                                <div className="flex justify-between pb-0.5">
                                    <span className="text-foreground font-medium">03 / Ciberseguridad</span>
                                    <span className="text-text-subtitle text-[9px]">Defensa</span>
                                </div>
                            </div>
                        </div>
                    </a>

                    {/* Card 3: Portafolio */}
                    <a
                        href={links.portfolio}
                        className="animate-fade-in-up interactive-glass-card group p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[200px] overflow-hidden"
                        style={{ animationDelay: '400ms' }}
                    >
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Cpu className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Portafolio Profesional</span>
                                </div>
                                <h2 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-accent-color transition-colors duration-200">
                                    Trayectoria & Perfil
                                </h2>
                                <p className="text-text-muted text-xs md:text-sm font-light max-w-sm leading-relaxed">
                                    Un recorrido completo por mi experiencia laboral, formación académica y proyectos desarrollados. Explora mi trayectoria de forma visual o interactúa mediante la consola virtual.
                                </p>
                            </div>

                            <div className="mt-8 flex items-center text-xs text-foreground font-medium tracking-wider gap-1 group-hover:text-text-subtitle transition-colors duration-200">
                                <span>Explorar portafolio</span>
                                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                            </div>
                        </div>

                        {/* Listado de secciones */}
                        <div className="w-full sm:w-52 flex flex-col justify-center gap-3 border-t sm:border-t-0 sm:border-l border-card-border/60 pt-4 sm:pt-0 sm:pl-6 font-mono text-xs text-text-muted">
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>01 / Proyectos & Skills</span>
                                <span className="text-[10px] text-text-subtitle font-bold">→</span>
                            </div>
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>02 / Trayectoria & Exp</span>
                                <span className="text-[10px] text-text-subtitle font-bold">→</span>
                            </div>
                            <div className="flex items-center justify-between group-hover:text-foreground transition-colors duration-200">
                                <span>03 / Consola interactiva</span>
                                <span className="text-[10px] text-text-subtitle font-bold">→</span>
                            </div>
                        </div>
                    </a>

                    {/* Card 4: Contacto */}
                    <div 
                        className="animate-fade-in-up interactive-glass-card p-8 rounded-[2rem] flex flex-col sm:flex-row gap-6 justify-between items-stretch shadow-sm min-h-[200px]"
                        style={{ animationDelay: '500ms' }}
                    >
                        <div className="flex flex-col justify-between flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-4 text-text-subtitle">
                                    <Mail className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Canal de Contacto</span>
                                </div>
                                <h3 className="text-2xl font-semibold text-foreground mb-3">Conectar con Jorge</h3>
                                <p className="text-text-muted text-xs md:text-sm font-light max-w-sm">
                                    Si tienes una idea, proyecto o simplemente deseas conversar sobre desarrollo de software, no dudes en contactarme.
                                </p>
                            </div>
                            <span className="text-[9px] text-text-subtitle font-mono tracking-wider uppercase mt-4 md:mt-0">Canales directos</span>
                        </div>

                        {/* Botones de contacto */}
                        <div className="w-full sm:w-64 flex flex-col justify-center gap-2">
                            <a
                                href="mailto:jorge.doicela.m@gmail.com"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-indigo-500/70" />
                                    <span>jorge.doicela.m@gmail.com</span>
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
                            <a
                                href="https://www.tiktok.com/@jorge.doicela"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between px-4 py-3 rounded-xl border border-card-border bg-btn-sec hover:bg-btn-sec-hover text-xs font-mono text-text-muted hover:text-foreground transition-all duration-200"
                            >
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-pink-500/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                    <span>tiktok.com/@jorge.doicela</span>
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                            </a>
                        </div>
                    </div>

                    {/* Card 5: Especialidades / Áreas de Práctica (Estática de Cristal) */}
                    <div 
                        className="animate-fade-in-up static-glass-card p-8 rounded-[2rem] flex flex-col md:flex-row gap-6 justify-between items-center shadow-sm min-h-[180px] md:col-span-2"
                        style={{ animationDelay: '600ms' }}
                    >
                        <div className="flex flex-col justify-between h-full flex-1">
                            <div>
                                <div className="flex items-center gap-2 mb-2 text-text-subtitle">
                                    <Layers className="w-4 h-4" />
                                    <span className="text-[10px] font-mono tracking-widest uppercase">Áreas de Práctica</span>
                                </div>
                                <h3 className="text-xl font-semibold text-foreground">Servicios Profesionales</h3>
                                <p className="text-text-muted text-xs md:text-sm font-light mt-2 leading-relaxed">
                                    Desarrollo de software de extremo a extremo, estructurando sistemas robustos, escalables y diseñando interfaces con una experiencia de usuario sumamente refinada.
                                </p>
                            </div>
                        </div>

                        {/* Chips elegantes */}
                        <div className="w-full md:w-72 flex flex-col gap-2">
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-chip-bg border border-chip-border text-xs text-text-muted hover:text-indigo-400 hover:bg-chip-hover-bg hover:border-indigo-500/20 transition-all duration-300 shadow-sm cursor-default">
                                <Cpu className="w-4 h-4 text-indigo-500/80" />
                                <span className="font-mono text-[10px] font-medium tracking-wide">Lógica / Sistemas</span>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-chip-bg border border-chip-border text-xs text-text-muted hover:text-emerald-400 hover:bg-chip-hover-bg hover:border-emerald-500/20 transition-all duration-300 shadow-sm cursor-default">
                                <Monitor className="w-4 h-4 text-emerald-500/80" />
                                <span className="font-mono text-[10px] font-medium tracking-wide">Interfaces / Frontend</span>
                            </div>
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-chip-bg border border-chip-border text-xs text-text-muted hover:text-violet-400 hover:bg-chip-hover-bg hover:border-violet-500/20 transition-all duration-300 shadow-sm cursor-default">
                                <Layers className="w-4 h-4 text-violet-500/80" />
                                <span className="font-mono text-[10px] font-medium tracking-wide">Estructura / Arquitectura</span>
                            </div>
                        </div>
                    </div>

                    {/* Card 6: Mi Enfoque (Estática de Cristal) */}
                    <div 
                        className="animate-fade-in-up static-glass-card p-8 rounded-[2rem] flex flex-col justify-between shadow-sm min-h-[180px] md:col-span-2"
                        style={{ animationDelay: '700ms' }}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-text-subtitle mb-2">
                                <Compass className="w-4 h-4" />
                                <span className="text-[10px] font-mono tracking-widest uppercase">Mi Enfoque</span>
                            </div>
                            <p className="text-base md:text-lg font-serif italic text-text-muted leading-relaxed font-light text-center md:text-left">
                                “Crear soluciones sencillas a problemas complejos. Priorizar la claridad, el rendimiento y la facilidad de uso para que el software sea verdaderamente valioso.”
                            </p>
                        </div>
                    </div>

                </div>
            </main>

            {/* Footer minimalista */}
            <footer 
                className="animate-fade-in-up w-full max-w-5xl mt-16 border-t border-card-border/40 pt-8 px-2 md:px-0 flex justify-center text-xs text-text-subtitle font-mono uppercase tracking-wider"
                style={{ animationDelay: '800ms' }}
            >
                <span>© {new Date().getFullYear()} Jorge Doicela. Todos los derechos reservados.</span>
            </footer>

        </div>
    );
}
