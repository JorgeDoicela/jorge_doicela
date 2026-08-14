'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight, BookOpen, Code, Terminal, Play, Pause, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface AppleHighlightsCarouselProps {
  links: {
    portfolio: string;
    bible: string;
    software: string;
  };
}

export const AppleHighlightsCarousel: React.FC<AppleHighlightsCarouselProps> = ({ links }) => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const isEs = language === 'es';

  const slides = [
    {
      id: 'bible',
      tag: isEs ? 'ESTUDIOS & RECURSOS BÍBLICOS' : 'BIBLE STUDIES & RESOURCES',
      icon: BookOpen,
      title: isEs ? 'La Biblia' : 'The Bible',
      headline: isEs
        ? 'Un ecosistema completo concebido para el estudio teológico y la edificación espiritual.'
        : 'A complete ecosystem designed for theological study and spiritual growth.',
      description: isEs
        ? 'Lector minimalista, análisis bíblico, libros digitales y noticias cristianas, todo para la gloria de Dios.'
        : 'Minimalist reader, biblical analysis, digital books, and Christian news, all for the glory of God.',
      badgeText: isEs ? 'Salmos 119:105' : 'Psalms 119:105',
      badgeSub: isEs ? '“Lámpara es a mis pies tu palabra”' : '“Your word is a lamp to my feet”',
      linkUrl: links.bible,
      linkText: isEs ? 'Explorar recursos' : 'Explore resources',
      accentGradient: 'from-amber-500/10 via-indigo-500/10 to-transparent',
    },
    {
      id: 'software',
      tag: isEs ? 'PORTAL DE TECNOLOGÍA & IA' : 'TECH & AI PORTAL',
      icon: Code,
      title: isEs ? 'Software & Noticias' : 'Software & News',
      headline: isEs
        ? 'Tendencias de vanguardia en Inteligencia Artificial, DevSecOps y Ciberseguridad.'
        : 'Cutting-edge trends in Artificial Intelligence, DevSecOps and Cybersecurity.',
      description: isEs
        ? 'Artículos especializados, novedades de modelos de lenguaje, guías de bastionado y análisis de sistemas.'
        : 'Technical articles, LLM model updates, hardening tutorials, and systems engineering analysis.',
      badgeText: 'DevSecOps & AI',
      badgeSub: isEs ? '01 / Modelos • 02 / Hardening • 03 / CI/CD' : '01 / Models • 02 / Hardening • 03 / CI/CD',
      linkUrl: links.software,
      linkText: isEs ? 'Entrar al portal' : 'Enter portal',
      accentGradient: 'from-emerald-500/10 via-teal-500/10 to-transparent',
    },
    {
      id: 'portfolio',
      tag: isEs ? 'PORTAFOLIO & TERMINAL SSH' : 'PORTFOLIO & SSH CONSOLE',
      icon: Terminal,
      title: isEs ? 'Trayectoria & Perfil' : 'Career & Profile',
      headline: isEs
        ? 'Experiencia profesional, formación técnica y consola Unix en tiempo real.'
        : 'Professional experience, technical education, and real-time Unix console.',
      description: isEs
        ? 'Navega por mi perfil de manera visual o interactúa mediante 24 comandos con autocompletado y modo espejo.'
        : 'Explore my journey visually or interact via 24 commands with autocomplete and mirror mode.',
      badgeText: 'Terminal SSH v1.0',
      badgeSub: isEs ? 'WebSockets en vivo • 24 comandos Unix' : 'Live WebSockets • 24 Unix commands',
      linkUrl: links.portfolio,
      linkText: isEs ? 'Explorar portafolio' : 'Explore portfolio',
      accentGradient: 'from-indigo-500/10 via-purple-500/10 to-transparent',
    },
  ];

  // Autoplay con temporizador suave
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const currentSlide = slides[activeIndex];
  const IconComponent = currentSlide.icon;

  return (
    <section id="highlights" className="w-full flex flex-col gap-6 py-8">
      {/* Título de Sección Apple Style */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {isEs ? 'Mira lo más destacado.' : 'Get the highlights.'}
        </h2>
      </div>

      {/* Tarjeta Panorámica de Carrusel Apple Style */}
      <div className="w-full relative group">
        <a
          href={currentSlide.linkUrl}
          className={`block w-full min-h-[360px] md:min-h-[420px] rounded-[2.5rem] bg-card border border-card-border hover:border-card-hover-border p-8 md:p-14 shadow-lg backdrop-blur-xl transition-all duration-500 relative overflow-hidden bg-gradient-to-br ${currentSlide.accentGradient}`}
        >
          <div className="flex flex-col justify-between h-full gap-8 relative z-10">
            {/* Tag superior & Icono */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-accent-light font-mono text-xs tracking-widest uppercase">
                <IconComponent className="w-4 h-4" />
                <span>{currentSlide.tag}</span>
              </div>
              <div className="px-3 py-1 rounded-full bg-inner-card border border-inner-card-border text-[11px] font-mono text-text-subtitle">
                {currentSlide.badgeText}
              </div>
            </div>

            {/* Contenido Central con Gran Tipografía */}
            <div className="flex flex-col gap-4 max-w-3xl">
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight">
                {currentSlide.headline}
              </h3>
              <p className="text-text-muted text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                {currentSlide.description}
              </p>
            </div>

            {/* Fila Inferior con Botón de Acción y Badge */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-card-border/40">
              <div className="text-xs text-text-subtitle font-mono">
                {currentSlide.badgeSub}
              </div>

              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-foreground text-background font-medium text-xs sm:text-sm hover:opacity-90 transition-opacity">
                <span>{currentSlide.linkText}</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </a>
      </div>

      {/* Barra de Control Apple Style con Píldoras y Botón Play/Pausa */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length)}
          className="p-2 rounded-full bg-card border border-card-border text-text-subtitle hover:text-foreground hover:bg-inner-card transition-colors"
          aria-label={isEs ? 'Anterior' : 'Previous'}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Píldoras de progreso interactivo */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-card-border shadow-sm">
          {slides.map((slide, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(idx)}
                className={`transition-all duration-300 rounded-full h-2 ${
                  isActive ? 'w-8 bg-foreground' : 'w-2 bg-text-subtitle/40 hover:bg-text-subtitle'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            );
          })}

          <div className="w-px h-3 bg-card-border mx-1" />

          {/* Botón Play / Pause */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-1 text-text-subtitle hover:text-foreground transition-colors"
            aria-label={isPlaying ? 'Pausar carrusel' : 'Reanudar carrusel'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % slides.length)}
          className="p-2 rounded-full bg-card border border-card-border text-text-subtitle hover:text-foreground hover:bg-inner-card transition-colors"
          aria-label={isEs ? 'Siguiente' : 'Next'}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
