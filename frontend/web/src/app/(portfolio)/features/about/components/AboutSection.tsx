import { getTranslations } from 'next-intl/server';
import { Mail, MapPin, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PortfolioLink } from '../../../shared';
import type { PortfolioProfileData } from '../types';

interface AboutSectionProps {
  profile: PortfolioProfileData;
  viewAllHref?: string;
}

export async function AboutSection({ profile, viewAllHref }: AboutSectionProps) {
  const tAbout = await getTranslations('About');
  const tContact = await getTranslations('Contact');

  return (
    <section id="about" className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start scroll-mt-24">
      <div className="md:col-span-2 flex flex-col gap-4">
        <div className="flex items-baseline justify-between gap-4 mb-2">
          <h2 className="text-2xl md:text-3xl font-light text-foreground">
            {tAbout('title')}
          </h2>
          {viewAllHref && (
            <PortfolioLink
              href={viewAllHref}
              className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
            >
              <span>{tAbout('viewMore')}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </PortfolioLink>
          )}
        </div>
        <div className="text-foreground/75 text-xs md:text-sm leading-relaxed font-light space-y-4">
          {profile.bio.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Contactos Rápidos */}
      <div className="flex flex-col gap-4 md:pl-6 md:border-l border-border/40">
        <span className="text-[10px] font-mono text-gold-300 tracking-widest uppercase mb-2">
          {tAbout('connections')}
        </span>
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
          href={`mailto:${profile.email}`}
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
        >
          <span className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gold-300" />
            <span>{profile.email}</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
        </a>
        <a
          href="https://www.google.com/maps/place/Quito,+Ecuador"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/30 hover:bg-surface-raised transition-all duration-300 text-xs text-foreground/80 hover:text-foreground font-mono"
          title={tContact('mapsTitle')}
        >
          <span className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gold-300" />
            <span>{profile.location}</span>
          </span>
          <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
        </a>
      </div>
    </section>
  );
}
