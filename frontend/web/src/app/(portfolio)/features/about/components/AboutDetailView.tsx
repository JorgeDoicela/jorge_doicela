'use client';

import React from 'react';
import { ArrowUpRight, Compass, FileDown, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { getPortfolioCvFilename, getPortfolioCvPath } from '../../../shared';
import type { PortfolioProfileData } from '../types';

interface AboutDetailViewProps {
  profile: PortfolioProfileData;
}

export function AboutDetailView({ profile }: AboutDetailViewProps) {
  const locale = useLocale();
  const tAbout = useTranslations('About');
  const tPhil = useTranslations('Philosophy');
  const tContact = useTranslations('Contact');
  const cvPath = getPortfolioCvPath(locale);
  const cvFilename = getPortfolioCvFilename(locale);

  return (
    <div className="flex flex-col gap-12">
      {/* Bloque 1: Biografía Completa + Tarjeta de Perfil & Conexiones */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 flex flex-col gap-5">
          <span className="text-[11px] font-mono text-gold-400 tracking-widest uppercase">
            {profile.headline}
          </span>
          <div className="space-y-4 text-foreground/80 text-xs sm:text-sm leading-relaxed font-light">
            {profile.bio.map((paragraph, idx) => (
              <p key={`bio-${idx}`}>{paragraph}</p>
            ))}
            {profile.extendedBio.map((paragraph, idx) => (
              <p key={`ext-${idx}`} className="text-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Panel Lateral de Conexiones */}
        <aside className="flex flex-col gap-4 lg:pl-6 lg:border-l border-border/40">
          <span className="text-[10px] font-mono text-gold-300 tracking-widest uppercase">
            {tAbout('connections')}
          </span>

          <a
            href="https://www.linkedin.com/in/jorgedoicela"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
          >
            <span>LinkedIn</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>

          <a
            href="https://github.com/JorgeDoicela"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
          >
            <span>GitHub</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
          </a>

          <a
            href={`mailto:${profile.email}`}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
          >
            <span className="flex items-center gap-2 truncate">
              <Mail className="w-4 h-4 text-gold-300 shrink-0" />
              <span className="truncate">{profile.email}</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </a>

          <a
            href="https://www.google.com/maps/place/Quito,+Ecuador"
            target="_blank"
            rel="noopener noreferrer"
            title={tContact('mapsTitle')}
            className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
          >
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gold-300 shrink-0" />
              <span>{profile.location}</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </a>

          <a
            href={cvPath}
            download={cvFilename}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-3 rounded-lg border border-border-gold/60 bg-background/30 hover:bg-surface-raised hover:border-gold-300/60 transition-all duration-300 text-xs text-foreground/85 hover:text-foreground font-mono"
          >
            <span className="flex items-center gap-2">
              <FileDown className="w-4 h-4 text-gold-300 shrink-0" />
              <span>{tAbout('cvLabel')}</span>
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 shrink-0" />
          </a>
        </aside>
      </section>

      <hr aria-hidden="true" className="w-full border-0 border-t border-border/50" />

      {/* Bloque 2: Filosofía y Principios de Ingeniería */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2.5">
          <Compass className="w-4 h-4 text-gold-400" />
          <h2 className="text-xl md:text-2xl font-light text-foreground">
            {tPhil('title')}
          </h2>
        </div>

        <blockquote className="p-6 md:p-8 rounded-xl border border-border-gold/40 bg-surface/40 flex flex-col items-center text-center gap-2.5">
          <p className="max-w-2xl text-sm md:text-base text-foreground/90 font-light italic leading-relaxed">
            {profile.philosophyQuote}
          </p>
          <span className="text-[11px] font-mono text-gold-400 tracking-wider uppercase">
            — {profile.philosophyVerse}
          </span>
        </blockquote>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.pillars.map((pillar, idx) => (
            <article
              key={idx}
              className="p-6 rounded-xl border border-border/60 bg-surface/40 flex flex-col gap-2.5"
            >
              <span className="text-[10px] font-mono text-gold-400/80">
                0{idx + 1}
              </span>
              <h3 className="text-sm font-mono text-gold-200 font-medium">
                {pillar.title}
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed">
                {pillar.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <hr aria-hidden="true" className="w-full border-0 border-t border-border/50" />

      {/* Bloque 3: Líneas de Enfoque Técnico y Crecimiento */}
      <section className="flex flex-col gap-8">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-gold-400" />
          <h2 className="text-xl md:text-2xl font-light text-foreground">
            {tAbout('focusTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {profile.focusAreas.map((area, idx) => (
            <article
              key={idx}
              className="p-6 rounded-xl border border-border/60 bg-surface/40 flex flex-col gap-2.5"
            >
              <h3 className="text-sm font-mono text-foreground font-semibold">
                {area.title}
              </h3>
              <p className="text-xs text-muted font-light leading-relaxed">
                {area.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
