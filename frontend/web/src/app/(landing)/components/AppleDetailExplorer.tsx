'use client';

import React, { useState } from 'react';
import { Plus, Check, Shield, Layers, Compass, Terminal, Server, ArrowUpRight, Cpu, Lock, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AppleDetailExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [activeItem, setActiveItem] = useState<number>(0);

  const isEs = language === 'es';

  const details = [
    {
      id: 'architecture',
      navTitle: isEs ? 'Arquitectura limpia' : 'Clean architecture',
      title: isEs ? 'Arquitectura Limpia' : 'Clean Architecture',
      subtitle: isEs ? 'Desacoplamiento total entre portales' : 'Total decoupling between portals',
      description: isEs
        ? 'Cada aplicación opera como una caja negra 100% aislada con su propia base de datos SQLite independiente, garantizando cero dependencias cruzadas y máxima mantenibilidad.'
        : 'Each application operates as a 100% isolated black box with its own independent SQLite database, ensuring zero cross-dependencies and maximum maintainability.',
      metricLabel: isEs ? 'Aislamiento' : 'Isolation',
      metricValue: '100% Decoupled',
      tag: 'SOLID & MODULAR',
      gradient: 'from-blue-600/20 via-indigo-600/10 to-transparent',
    },
    {
      id: 'devsecops',
      navTitle: isEs ? 'DevSecOps & Hardening' : 'DevSecOps & Hardening',
      title: isEs ? 'DevSecOps & Seguridad' : 'DevSecOps & Security',
      subtitle: isEs ? 'Protección proactiva desde el diseño' : 'Proactive security by design',
      description: isEs
        ? 'Bastionado integral del servidor: autenticación SSH exclusiva por llaves criptográficas Ed25519, firewall estricto UFW, escaneo automatizado de secretos y mitigación OWASP.'
        : 'Comprehensive server hardening: exclusive Ed25519 cryptographic key SSH, strict UFW firewall, automated secret scanning, and OWASP mitigation.',
      metricLabel: isEs ? 'Fugas de secretos' : 'Secret leaks',
      metricValue: '0 Leaks',
      tag: 'SECURITY FIRST',
      gradient: 'from-emerald-600/20 via-teal-600/10 to-transparent',
    },
    {
      id: 'faith',
      navTitle: isEs ? 'Fe cristiana & Valores' : 'Christian faith & Values',
      title: isEs ? 'Fe Cristiana & Excelencia' : 'Christian Faith & Excellence',
      subtitle: isEs ? 'Ingeniería con propósito eterno' : 'Engineering with eternal purpose',
      description: isEs
        ? 'Cada línea de código, arquitectura y servicio está fundamentada en principios cristianos de honestidad, integridad y excelencia artesanal como para el Señor.'
        : 'Every line of code, architecture, and service is founded on Christian principles of honesty, integrity, and craftsmanship as unto the Lord.',
      metricLabel: isEs ? 'Fundamento' : 'Foundation',
      metricValue: 'Colosenses 3:23',
      tag: 'SOLI DEO GLORIA',
      gradient: 'from-amber-600/20 via-orange-600/10 to-transparent',
    },
    {
      id: 'terminal',
      navTitle: isEs ? 'Terminal SSH en vivo' : 'Live SSH terminal',
      title: isEs ? 'Terminal SSH Interactiva' : 'Interactive SSH Terminal',
      subtitle: isEs ? 'WebSockets en tiempo real' : 'Real-time WebSockets',
      description: isEs
        ? 'Consola Unix virtual en vivo con 24 comandos, autocompletado inteligente con Tab, pestañas multiplexadas tmux y retransmisión de sesiones compartidas.'
        : 'Live virtual Unix console with 24 commands, intelligent Tab autocomplete, multiplexed tmux tabs, and spectator session streaming.',
      metricLabel: isEs ? 'Comandos Unix' : 'Unix commands',
      metricValue: '24 Commands',
      tag: 'WEBSOCKETS REAL-TIME',
      gradient: 'from-purple-600/20 via-indigo-600/10 to-transparent',
    },
    {
      id: 'performance',
      navTitle: isEs ? 'Rendimiento 1GB RAM' : '1GB RAM Performance',
      title: isEs ? 'Optimización 1GB RAM' : '1GB RAM Optimization',
      subtitle: isEs ? 'Eficiencia extrema en Lightsail' : 'Extreme Lightsail efficiency',
      description: isEs
        ? 'Monorepo completo (4 portales web + API backend) optimizado para correr continuamente en un VPS con 1GB de memoria física, consumiendo menos de 450MB en producción.'
        : 'Complete monorepo (4 web portals + backend API) optimized to run continuously on a 1GB physical RAM VPS, consuming under 450MB in production.',
      metricLabel: isEs ? 'Consumo RAM' : 'RAM usage',
      metricValue: '< 450 MB',
      tag: 'LIGHTSAIL OPTIMIZED',
      gradient: 'from-cyan-600/20 via-blue-600/10 to-transparent',
    },
  ];

  const current = details[activeItem];

  return (
    <section className="w-full flex flex-col gap-6 py-12">
      {/* Encabezado Apple Style */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm sm:text-base font-semibold tracking-[-0.01em] text-text-subtitle">
          {isEs ? 'Valores de Ingeniería & Arquitectura' : 'Engineering Values & Architecture'}
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.035em] text-foreground leading-tight">
          {isEs ? 'Míralo en detalle.' : 'Take a closer look.'}
        </h2>
      </div>

      {/* Contenedor Principal Panorámico */}
      <div className="w-full rounded-[2.5rem] bg-card border border-card-border shadow-xl p-6 sm:p-10 md:p-14 backdrop-blur-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* COLUMNA IZQUIERDA: Píldoras con selector y descripción fluida */}
          <div className="lg:col-span-4 flex flex-col gap-3">
            {details.map((item, idx) => {
              const isActive = idx === activeItem;
              return (
                <div key={item.id} className="flex flex-col transition-all duration-300">
                  <button
                    type="button"
                    onClick={() => setActiveItem(idx)}
                    className={`w-full flex items-center justify-between px-5 py-3.5 rounded-full transition-all duration-300 text-left cursor-pointer border ${
                      isActive
                        ? 'bg-foreground text-background border-foreground shadow-md'
                        : 'bg-inner-card/80 border-inner-card-border text-foreground/80 hover:bg-inner-card hover:text-foreground hover:border-card-hover-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                          isActive
                            ? 'bg-background text-foreground'
                            : 'bg-card-border text-foreground/70'
                        }`}
                      >
                        {isActive ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                      </span>
                      <span className="text-sm font-medium tracking-tight">
                        {item.navTitle}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-mono uppercase tracking-wider hidden sm:inline ${
                        isActive ? 'text-background/80' : 'text-text-subtitle'
                      }`}
                    >
                      {item.tag.split('&')[0].trim()}
                    </span>
                  </button>

                  {/* Descripción fluida visible en el ítem activo */}
                  {isActive && (
                    <div className="mt-2.5 px-4 py-3 rounded-2xl bg-inner-card/50 border border-inner-card-border/60 text-xs sm:text-sm text-text-muted leading-relaxed animate-fade-in-up">
                      <strong className="font-semibold text-foreground mr-1">{item.title}.</strong>
                      {item.description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* COLUMNA DERECHA: Chasis Grande de Laptop con Gráficos de Alto Impacto */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center w-full">
            
            {/* Chasis de Laptop Panorámica MacBook */}
            <div className="w-full max-w-2xl flex flex-col items-center group">
              
              {/* Bisel de la Pantalla 100% Reactivo al Tema */}
              <div className="w-full rounded-t-[2rem] sm:rounded-t-[2.5rem] bg-laptop-bezel border-[6px] sm:border-[8px] border-laptop-bezel-border p-1.5 shadow-2xl relative overflow-hidden transition-colors duration-500">
                
                {/* Cámara FaceTime Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30">
                  <div className="w-2 h-2 rounded-full bg-laptop-notch border border-laptop-bezel-border opacity-70" />
                </div>

                {/* Pantalla Interna de Alta Resolución (Aspect Ratio 16:10) */}
                <div className="w-full min-h-[320px] sm:min-h-[380px] md:min-h-[420px] rounded-t-xl bg-laptop-screen p-6 sm:p-10 flex flex-col justify-between relative overflow-hidden text-left border border-laptop-screen-border transition-colors duration-500 shadow-sm">
                  
                  {/* Gradiente Ambiental Suave */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${current.gradient} opacity-30 transition-opacity duration-700 pointer-events-none`} />

                  {/* Cabecera de la Pantalla */}
                  <div className="relative z-10 flex items-center justify-between border-b border-laptop-card-border pb-4">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">{current.title}</span>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-laptop-card text-foreground text-xs font-mono font-medium border border-laptop-card-border shadow-2xs">
                      {current.metricValue}
                    </span>
                  </div>

                  {/* 1. VISUAL: ARQUITECTURA LIMPIA */}
                  {current.id === 'architecture' && (
                    <div className="relative z-10 flex flex-col gap-6 my-auto py-4 animate-fade-in-up">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border flex flex-col gap-1.5 text-center backdrop-blur-md shadow-2xs">
                          <span className="text-[10px] font-mono text-text-subtitle uppercase tracking-wider">Frontend Web</span>
                          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">Next.js 16</span>
                          <span className="text-[10px] font-mono text-emerald-500 font-semibold">Puerto :3001</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border flex flex-col gap-1.5 text-center backdrop-blur-md shadow-2xs">
                          <span className="text-[10px] font-mono text-text-subtitle uppercase tracking-wider">Backend Core</span>
                          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">NestJS 11</span>
                          <span className="text-[10px] font-mono text-indigo-500 font-semibold">Puerto :3000</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border flex flex-col gap-1.5 text-center backdrop-blur-md shadow-2xs">
                          <span className="text-[10px] font-mono text-text-subtitle uppercase tracking-wider">Persistencia</span>
                          <span className="text-base sm:text-lg font-bold text-foreground tracking-tight">SQLite DBS</span>
                          <span className="text-[10px] font-mono text-amber-500 font-semibold">Aisladas x3</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1 text-xs sm:text-sm text-foreground/90">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Aislamiento estricto de dominio: cero importaciones cruzadas</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Comunicación desacoplada mediante eventos internos</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 2. VISUAL: DEVSECOPS & HARDENING */}
                  {current.id === 'devsecops' && (
                    <div className="relative z-10 flex flex-col gap-6 my-auto py-4 animate-fade-in-up">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border flex flex-col gap-1 text-center backdrop-blur-md shadow-2xs">
                          <span className="text-xs sm:text-sm font-bold text-emerald-500">UFW ON</span>
                          <span className="text-[10px] text-text-subtitle">Puertos 80/443</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border flex flex-col gap-1 text-center backdrop-blur-md shadow-2xs">
                          <span className="text-xs sm:text-sm font-bold text-emerald-500">Ed25519</span>
                          <span className="text-[10px] text-text-subtitle">SSH Sin Clave</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border flex flex-col gap-1 text-center backdrop-blur-md shadow-2xs">
                          <span className="text-xs sm:text-sm font-bold text-emerald-500">0 Leaks</span>
                          <span className="text-[10px] text-text-subtitle">Secret Scanning</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pt-1 text-xs sm:text-sm text-foreground/90">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Mitigación activa y bastionado continuo contra OWASP Top 10</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Contenedores Docker aislados sin permisos de superusuario</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. VISUAL: FE CRISTIANA & VALORES */}
                  {current.id === 'faith' && (
                    <div className="relative z-10 flex flex-col justify-center items-center gap-5 my-auto py-4 text-center animate-fade-in-up">
                      <div className="max-w-lg p-6 rounded-2xl bg-laptop-card border border-amber-500/20 backdrop-blur-md flex flex-col gap-3 shadow-2xs">
                        <blockquote className="font-serif italic text-base sm:text-lg text-foreground leading-relaxed font-light">
                          &ldquo;Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.&rdquo;
                        </blockquote>
                        <span className="text-xs font-mono text-amber-500 tracking-wider uppercase font-semibold">— Colosenses 3:23</span>
                      </div>

                      <div className="flex flex-wrap justify-center gap-2.5 text-xs font-mono text-foreground/80">
                        <span className="px-3 py-1 rounded-full bg-laptop-card border border-laptop-card-border shadow-2xs">Integridad Técnica</span>
                        <span className="px-3 py-1 rounded-full bg-laptop-card border border-laptop-card-border shadow-2xs">Cero Parches Ocultos</span>
                        <span className="px-3 py-1 rounded-full bg-laptop-card border border-laptop-card-border shadow-2xs">Edificar a las Personas</span>
                      </div>
                    </div>
                  )}

                  {/* 4. VISUAL: TERMINAL SSH */}
                  {current.id === 'terminal' && (
                    <div className="relative z-10 flex flex-col gap-4 my-auto py-2 font-mono text-xs sm:text-sm animate-fade-in-up">
                      {/* Ventana de Terminal con estilo macOS */}
                      <div className="p-4 rounded-2xl bg-laptop-card border border-laptop-card-border shadow-sm flex flex-col gap-2 leading-relaxed text-foreground">
                        <div className="flex items-center gap-1.5 pb-1 border-b border-laptop-card-border">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                          <span className="text-[10px] text-text-subtitle font-mono ml-2">bash — 80x24</span>
                        </div>
                        <div className="text-emerald-500 font-semibold flex items-center gap-2 pt-1">
                          <span className="text-text-subtitle">$</span>
                          <span>ssh jorge@portfolio.jorgedoicela.com</span>
                        </div>
                        <div className="text-text-muted text-xs">Conexión establecida mediante protocolo WebSockets en tiempo real.</div>
                        <div className="text-indigo-500 font-semibold flex items-center gap-2 pt-1">
                          <span className="text-text-subtitle">$</span>
                          <span>neofetch --summary</span>
                        </div>
                        <div className="text-text-muted text-xs">OS: Debian 13 (Trixie) • Host: Lightsail VPS 1GB • Uptime: 99.9%</div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-text-subtitle pt-1">
                        <span>Pestañas tmux: [0:main] [1:logs] [2:monitor]</span>
                        <span className="text-purple-500 font-semibold">24 Comandos Activos</span>
                      </div>
                    </div>
                  )}

                  {/* 5. VISUAL: RENDIMIENTO 1GB RAM */}
                  {current.id === 'performance' && (
                    <div className="relative z-10 flex flex-col gap-5 my-auto py-2 font-mono animate-fade-in-up">
                      <div className="flex flex-col gap-3">
                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                            <span className="text-text-subtitle font-medium">Uso de RAM (4 Apps + NestJS)</span>
                            <span className="text-cyan-500 font-bold">428 MB / 1024 MB (41.8%)</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-laptop-card border border-laptop-card-border overflow-hidden">
                            <div className="h-full w-[41.8%] bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs sm:text-sm mb-1.5">
                            <span className="text-text-subtitle font-medium">Carga de CPU (Respuesta Servidor)</span>
                            <span className="text-emerald-500 font-bold">1.4% • 0.18ms</span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-laptop-card border border-laptop-card-border overflow-hidden">
                            <div className="h-full w-[14%] bg-emerald-500 rounded-full" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-text-subtitle pt-2 border-t border-laptop-card-border">
                        <span>Motor de Base de Datos: SQLite Sync</span>
                        <span className="text-emerald-500 font-semibold">Estado: Saludable 100%</span>
                      </div>
                    </div>
                  )}

                  {/* Pie de la Pantalla */}
                  <div className="relative z-10 pt-3 border-t border-laptop-card-border flex items-center justify-between text-[11px] font-mono text-text-subtitle">
                    <span>jorgedoicela.com/architecture</span>
                    <span className="text-foreground/70">MacBook Sequoia Interface</span>
                  </div>
                </div>
              </div>

              {/* Chasis Inferior / Base con Muesca Clásica MacBook */}
              <div className="w-full h-4 sm:h-5 bg-gradient-to-b from-[var(--laptop-base-top)] to-[var(--laptop-base-bottom)] rounded-b-2xl shadow-xl relative flex items-center justify-center border-t border-laptop-bezel-border transition-colors duration-500">
                <div className="w-20 sm:w-24 h-1.5 sm:h-2 bg-laptop-notch rounded-b-lg opacity-60" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

