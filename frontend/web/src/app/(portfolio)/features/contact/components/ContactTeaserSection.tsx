import { getTranslations } from 'next-intl/server';
import { ArrowRight, Mail } from 'lucide-react';
import { PortfolioLink } from '../../../shared';

interface ContactTeaserSectionProps {
  href?: string;
  email: string;
  availability: string;
}

export async function ContactTeaserSection({
  href = '/contact',
  email,
  availability,
}: ContactTeaserSectionProps) {
  const tContact = await getTranslations('Contact');

  return (
    <section id="contact" className="flex flex-col gap-5 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl md:text-3xl font-light text-foreground">
          {tContact('thesisTitle')}
        </h2>
        <PortfolioLink
          href={href}
          className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
        >
          <span>{tContact('viewAll')}</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
        </PortfolioLink>
      </div>

      <PortfolioLink
        href={href}
        className="group p-6 sm:p-8 rounded-xl border border-border-gold/60 bg-surface/60 hover:bg-surface hover:border-gold-300/60 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="flex flex-col gap-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-gold-400 uppercase tracking-wider">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 luxury-pulse" />
              <span>{availability}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
            {tContact('thesisDesc')}
          </p>

          <div className="inline-flex items-center gap-2 text-xs font-mono text-foreground/80 group-hover:text-gold-300 transition-colors w-fit">
            <Mail className="w-3.5 h-3.5 text-gold-400" />
            <span>{email}</span>
          </div>
        </div>

        <div className="inline-flex items-center pb-1 border-b border-gold-400/60 group-hover:border-gold-300 text-xs font-mono text-gold-200 transition-colors shrink-0 w-fit">
          <span>{tContact('launchCta')}</span>
        </div>
      </PortfolioLink>
    </section>
  );
}
