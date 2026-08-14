'use client';

import React, { useState } from 'react';
import { ArrowUpRight, BookOpen, Code, Terminal, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AppleHeroShowcaseProps {
  links: {
    portfolio: string;
    bible: string;
    software: string;
  };
}

export const AppleHeroShowcase: React.FC<AppleHeroShowcaseProps> = ({ links }) => {
  const { language } = useLanguage();
  const [activeScreen, setActiveScreen] = useState<'portfolio' | 'bible' | 'software'>('portfolio');

  const isEs = language === 'es';

  return (
    <section className="w-full flex flex-col items-center text-center pt-6 pb-16 animate-fade-in-up">
      {/* Eyebrow Apple Style */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-card border border-card-border shadow-sm mb-4 text-xs font-mono text-text-subtitle">
        <Sparkles className="w-3.5 h-3.5 text-accent-light" />
        <span className="tracking-widest uppercase text-[10.5px]">
          {isEs ? 'ECOSISTEMA DIGITAL • JORGE DOICELA' : 'DIGITAL ECOSYSTEM • JORGE DOICELA'}
        </span>
      </div>

      {/* Titular Gigante Impactante */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.08] mb-4">
        {isEs ? 'Hola, mundo.' : 'Hello, world.'}
      </h1>

      <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl font-light leading-relaxed mb-8">
        {isEs
          ? 'Desarrollo Full Stack, Ciberseguridad y Tecnologías Web construidas con excelencia técnica, fe cristiana y pasión por el detalle.'
          : 'Full Stack Development, Cybersecurity and Web Technologies built with technical excellence, Christian faith and passion for detail.'}
      </p>

      {/* Botones Píldora Apple CTA */}
      <div className="flex flex-wrap items-center justify-center gap-3.5 mb-14">
        <a
          href="#highlights"
          className="px-7 py-3 rounded-full bg-foreground text-background font-medium text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
        >
          {isEs ? 'Explorar lo más destacado' : 'Explore highlights'}
        </a>
        <a
          href={links.portfolio}
          className="px-7 py-3 rounded-full bg-card border border-card-border hover:border-card-hover-border hover:bg-card/80 text-foreground font-medium text-sm active:scale-95 transition-all shadow-sm inline-flex items-center gap-1.5"
        >
          <span>{isEs ? 'Ver Portafolio' : 'View Portfolio'}</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>

      {/* Showcase Visual Central (Simulación de Pantalla MacBook Apple Style) */}
      <div className="w-full max-w-4xl relative group">
        {/* Resplandor ambiental de fondo */}
        <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 via-accent-light/10 to-accent/20 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition duration-700 pointer-events-none" />

        {/* Chasis de Pantalla */}
        <div className="relative rounded-[2rem] md:rounded-[2.5rem] bg-card border border-card-border shadow-2xl p-3 md:p-4 backdrop-blur-xl overflow-hidden">
          {/* Barra superior de pestañas interactivas estilo Apple macOS */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-card-border/40 mb-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
            </div>

            {/* Píldoras selectoras de pantalla interactiva */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <button
                onClick={() => setActiveScreen('portfolio')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeScreen === 'portfolio'
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'text-text-subtitle hover:text-foreground hover:bg-inner-card'
                }`}
              >
                {isEs ? 'Portafolio' : 'Portfolio'}
              </button>
              <button
                onClick={() => setActiveScreen('bible')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeScreen === 'bible'
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'text-text-subtitle hover:text-foreground hover:bg-inner-card'
                }`}
              >
                {isEs ? 'Biblia' : 'Bible'}
              </button>
              <button
                onClick={() => setActiveScreen('software')}
                className={`px-3 py-1 rounded-full transition-all ${
                  activeScreen === 'software'
                    ? 'bg-foreground text-background font-semibold shadow-sm'
                    : 'text-text-subtitle hover:text-foreground hover:bg-inner-card'
                }`}
              >
                Software Hub
              </button>
            </div>

            <div className="text-[10px] font-mono text-text-subtitle hidden sm:block">
              jorgedoicela.com
            </div>
          </div>

          {/* Contenido de la Pantalla según pestaña activa */}
          <div className="w-full min-h-[260px] md:min-h-[320px] rounded-xl bg-background/80 border border-inner-card-border p-6 md:p-8 flex flex-col justify-between text-left transition-all duration-300">
            {activeScreen === 'portfolio' && (
              <div className="flex flex-col justify-between h-full gap-6 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-accent-light text-xs font-mono">
                    <Terminal className="w-4 h-4" />
                    <span>PORTFOLIO & TERMINAL SSH</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {isEs
                      ? 'Consola interactiva en tiempo real y arquitectura de software'
                      : 'Real-time interactive console and software architecture'}
                  </h3>
                  <p className="text-text-muted text-xs md:text-sm max-w-xl font-light">
                    {isEs
                      ? 'Diseño Dark Luxury, historial de comandos, autocompletado Tab y retransmisión de sesiones en vivo mediante WebSockets.'
                      : 'Dark Luxury design, command history, Tab autocomplete, and live session mirroring via WebSockets.'}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-card-border/30">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-text-subtitle">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>portfolio.jorgedoicela.com</span>
                  </div>
                  <a
                    href={links.portfolio}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent-light hover:underline"
                  >
                    <span>{isEs ? 'Ingresar ahora' : 'Launch now'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {activeScreen === 'bible' && (
              <div className="flex flex-col justify-between h-full gap-6 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-accent-light text-xs font-mono">
                    <BookOpen className="w-4 h-4" />
                    <span>BIBLIA MODULAR & DEVOCIONALES</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {isEs
                      ? 'Un espacio puro y minimalista para el estudio de las Sagradas Escrituras'
                      : 'A pure, minimalist space for studying the Holy Scriptures'}
                  </h3>
                  <p className="text-text-muted text-xs md:text-sm max-w-xl font-light italic font-serif">
                    &ldquo;{isEs ? 'Lámpara es a mis pies tu palabra, y lumbrera a mi camino.' : 'Your word is a lamp to my feet and a light to my path.'}&rdquo;
                    <span className="block not-italic font-mono text-[10px] text-text-subtitle mt-1">— Salmos 119:105</span>
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-card-border/30">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-text-subtitle">
                    <span className="w-2 h-2 rounded-full bg-indigo-400" />
                    <span>bible.jorgedoicela.com</span>
                  </div>
                  <a
                    href={links.bible}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent-light hover:underline"
                  >
                    <span>{isEs ? 'Abrir Biblia' : 'Open Bible'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {activeScreen === 'software' && (
              <div className="flex flex-col justify-between h-full gap-6 animate-fade-in-up">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-accent-light text-xs font-mono">
                    <Code className="w-4 h-4" />
                    <span>SOFTWARE & NOTICIAS TECH</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    {isEs
                      ? 'Noticias de IA, herramientas de desarrollo y artículos de DevSecOps'
                      : 'AI News, developer tools, and DevSecOps engineering articles'}
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="px-2.5 py-1 rounded bg-inner-card border border-inner-card-border text-[10.5px] font-mono text-text-muted">
                      01 / Modelos & IA
                    </span>
                    <span className="px-2.5 py-1 rounded bg-inner-card border border-inner-card-border text-[10.5px] font-mono text-text-muted">
                      02 / DevSecOps
                    </span>
                    <span className="px-2.5 py-1 rounded bg-inner-card border border-inner-card-border text-[10.5px] font-mono text-text-muted">
                      03 / Ciberseguridad
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-card-border/30">
                  <div className="flex items-center gap-2 text-[11px] font-mono text-text-subtitle">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span>software.jorgedoicela.com</span>
                  </div>
                  <a
                    href={links.software}
                    className="inline-flex items-center gap-1 text-xs font-medium text-accent-light hover:underline"
                  >
                    <span>{isEs ? 'Entrar al portal' : 'Enter portal'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
