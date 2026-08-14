'use client';

import React from 'react';
import { Compass } from 'lucide-react';

export const ValuesPhilosophySection: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
      {/* Filosofía & Valores (Columna izquierda y central - 2 cols) */}
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-gold-300">
          <Compass className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-widest uppercase">
            Filosofía & Ética
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-light text-foreground mb-2">
          Valores & Filosofía de Trabajo
        </h2>
        <div className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light space-y-4">
          <p>
            Concibo el desarrollo de software como una labor de servicio y excelencia técnica. Mi enfoque profesional se rige por principios innegociables: honestidad técnica en cada estimación, transparencia en la arquitectura y un trato digno a cada persona y equipo.
          </p>
          <p>
            Rechazo soluciones superficiales o parches silenciosos que introduzcan deuda técnica. Creo en la artesanía del código: estructuras tipadas, desacoplamiento modular y bases sólidas diseñadas para perdurar en el tiempo y facilitar la escalabilidad.
          </p>
          <p>
            La seguridad y privacidad no son complementos opcionales, sino una responsabilidad moral. Aplico el principio de privilegio mínimo y hardening desde el inicio del diseño para salvaguardar la confianza de los usuarios.
          </p>
        </div>
      </div>

      {/* Fundamento Espiritual & Cita (Columna derecha - 1 col) */}
      <div className="flex flex-col gap-4 md:pl-6 md:border-l border-border/40 h-full justify-between">
        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-mono text-gold-300 tracking-widest uppercase mb-1">
            Fundamento
          </span>
          <blockquote className="text-xs md:text-sm text-foreground/90 font-light italic leading-relaxed border-l-2 border-gold-400/50 pl-3">
            &ldquo;Y todo lo que hagáis, hacedlo de corazón, como para el Señor y no para los hombres.&rdquo;
          </blockquote>
          <p className="text-[10px] font-mono text-gold-400 mt-1 pl-3">
            — Colosenses 3:23
          </p>
        </div>
      </div>
    </section>
  );
};
