'use client';

import React, { useState } from 'react';
import { Plus, Shield, Layers, Compass, Terminal, Server, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AppleDetailExplorer: React.FC = () => {
  const { language } = useLanguage();
  const [activeItem, setActiveItem] = useState<number>(0);

  const isEs = language === 'es';

  const details = [
    {
      id: 'architecture',
      title: isEs ? 'Arquitectura Limpia & Monorepo' : 'Clean Architecture & Monorepo',
      icon: Layers,
      tag: 'SOLID & MODULAR',
      summary: isEs
        ? 'Desacoplamiento total entre aplicaciones. Cada portal funciona como una caja negra con persistencia y reglas independientes.'
        : 'Complete decoupling between applications. Each portal acts as a black box with independent persistence and rules.',
      points: isEs
        ? [
            'Proceso único NestJS y Next.js consolidado',
            'Bases de datos SQLite separadas por dominio',
            'Cero dependencias cruzadas entre módulos',
          ]
        : [
            'Consolidated single NestJS and Next.js process',
            'Independent SQLite databases per domain',
            'Zero cross-dependencies between modules',
          ],
      metric: '100% Decoupled',
    },
    {
      id: 'devsecops',
      title: isEs ? 'DevSecOps & Hardening' : 'DevSecOps & Hardening',
      icon: Shield,
      tag: 'SECURITY FIRST',
      summary: isEs
        ? 'Seguridad proactiva desde el diseño: políticas SSH sin contraseñas, firewall UFW, validación estricta de DTOs y escaneo de secretos.'
        : 'Proactive security by design: passwordless SSH, UFW firewall, strict DTO validation, and pre-commit secret scanning.',
      points: isEs
        ? [
            'Escaneo de secretos con scripts pre-commit',
            'Contenedores Docker aislados y seguros',
            'Mitigación activa de OWASP Top 10',
          ]
        : [
            'Pre-commit secret scanning hooks',
            'Isolated and hardened Docker containers',
            'Active OWASP Top 10 mitigation',
          ],
      metric: '0 Secret Leaks',
    },
    {
      id: 'faith',
      title: isEs ? 'Fe Cristiana & Valores' : 'Christian Faith & Values',
      icon: Compass,
      tag: 'COLOSENSES 3:23',
      summary: isEs
        ? 'Toda la ingeniería y servicio están guiados por principios cristianos de integridad, verdad y excelencia como para el Señor.'
        : 'All engineering and service are guided by Christian principles of integrity, truth, and excellence as unto the Lord.',
      points: isEs
        ? [
            'Honestidad técnica en cada propuesta',
            'Excelencia artesanal sin parches ocultos',
            'Tecnología concebida para edificar vidas',
          ]
        : [
            'Technical honesty in every proposal',
            'Craftsmanship without hidden hacks',
            'Technology built to edify lives',
          ],
      metric: 'Glory to God',
    },
    {
      id: 'terminal',
      title: isEs ? 'Terminal SSH Interactiva' : 'Interactive SSH Terminal',
      icon: Terminal,
      tag: 'WEBSOCKETS REAL-TIME',
      summary: isEs
        ? 'Consola virtual con 24 comandos Unix, sistema de archivos simulado, colores ANSI, pestañas tmux y modo espejo en vivo.'
        : 'Virtual console featuring 24 Unix commands, virtual filesystem, ANSI colors, tmux tabs, and live session mirroring.',
      points: isEs
        ? [
            'Autocompletado dinámico con tecla Tab',
            'Historial navegable con flechas arriba/abajo',
            'Salas compartidas con retransmisión de sockets',
          ]
        : [
            'Dynamic autocomplete with Tab key',
            'Navigable command history with up/down arrows',
            'Shared spectator rooms with socket streaming',
          ],
      metric: '24 Commands',
    },
    {
      id: 'performance',
      title: isEs ? 'Rendimiento en VPS 1GB RAM' : '1GB RAM VPS Performance',
      icon: Server,
      tag: 'LIGHTSAIL OPTIMIZED',
      summary: isEs
        ? 'Optimizaciones extremas de memoria y compresión para correr el monorepo completo con menos de 450MB de RAM en producción.'
        : 'Extreme memory optimizations and compression to run the entire monorepo with under 450MB RAM in production.',
      points: isEs
        ? [
            'Better-SQLite3 de alta velocidad síncrona',
            'Next.js 16 con React 19 y Server Components',
            'Soporte completo de Progressive Web App (PWA)',
          ]
        : [
            'High-speed synchronous Better-SQLite3',
            'Next.js 16 with React 19 Server Components',
            'Full Progressive Web App (PWA) support',
          ],
      metric: '< 450MB RAM',
    },
  ];

  const current = details[activeItem];
  const IconComponent = current.icon;

  return (
    <section className="w-full flex flex-col gap-6 py-12">
      {/* Encabezado Apple Style */}
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          {isEs ? 'Míralo en detalle.' : 'Take a closer look.'}
        </h2>
      </div>

      {/* Gran Tarjeta Contenedora Interactiva */}
      <div className="w-full rounded-[2.5rem] bg-card border border-card-border shadow-xl p-6 sm:p-10 md:p-12 backdrop-blur-xl relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          {/* Menú Vertical de Píldoras Interactivas a la Izquierda (5 columnas) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {details.map((item, idx) => {
              const isActive = idx === activeItem;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveItem(idx)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 text-left cursor-pointer border ${
                    isActive
                      ? 'bg-foreground text-background border-foreground shadow-md scale-[1.02]'
                      : 'bg-inner-card border-inner-card-border text-foreground/80 hover:bg-inner-card/80 hover:text-foreground hover:border-card-hover-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                        isActive
                          ? 'bg-background text-foreground rotate-45'
                          : 'bg-card-border text-foreground/70'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </span>
                    <span className="text-sm font-medium tracking-tight">
                      {item.title}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest hidden sm:inline ${
                      isActive ? 'text-background/70' : 'text-text-subtitle'
                    }`}
                  >
                    {item.tag}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Visor Dinámico de la Derecha (7 columnas) */}
          <div className="lg:col-span-7 flex flex-col justify-between min-h-[340px] rounded-3xl bg-background/70 border border-inner-card-border p-6 md:p-10 shadow-inner relative overflow-hidden transition-all duration-500 animate-fade-in-up key={current.id}">
            <div className="flex flex-col gap-5">
              {/* Tag superior & Métrica destacada */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-accent-light font-mono text-xs uppercase tracking-widest">
                  <IconComponent className="w-4 h-4" />
                  <span>{current.tag}</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent-light text-xs font-mono font-semibold">
                  {current.metric}
                </span>
              </div>

              {/* Título y Resumen */}
              <div className="flex flex-col gap-2.5">
                <h3 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {current.title}
                </h3>
                <p className="text-text-muted text-xs sm:text-sm font-light leading-relaxed">
                  {current.summary}
                </p>
              </div>

              {/* Lista de Puntos Clave */}
              <div className="flex flex-col gap-2 pt-2">
                {current.points.map((pt, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-xs text-foreground/90">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pie del visor */}
            <div className="pt-6 mt-6 border-t border-card-border/30 flex items-center justify-between text-[11px] font-mono text-text-subtitle">
              <span>{isEs ? 'Auditoría continua & DevSecOps' : 'Continuous audit & DevSecOps'}</span>
              <span className="text-accent-light">{current.id}.jorgedoicela</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
