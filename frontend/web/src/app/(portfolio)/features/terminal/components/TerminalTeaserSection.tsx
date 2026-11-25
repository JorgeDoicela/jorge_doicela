import { getTranslations } from 'next-intl/server';
import { ArrowRight, Flag, Terminal as TerminalIcon } from 'lucide-react';
import { PortfolioLink } from '../../../shared';

interface TerminalTeaserSectionProps {
  href?: string;
}

export async function TerminalTeaserSection({
  href = '/terminal',
}: TerminalTeaserSectionProps) {
  const tTerm = await getTranslations('Terminal');

  return (
    <section id="terminal" className="flex flex-col gap-5 scroll-mt-24">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-2xl font-light text-foreground">
          {tTerm('title')}
        </h2>
        <PortfolioLink
          href={href}
          className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
        >
          <span>{tTerm('launchCta')}</span>
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
              <TerminalIcon className="w-3.5 h-3.5" />
              <span>{tTerm('teaserBadgePrimary')}</span>
            </span>
            <span className="text-border-gold">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5" />
              <span>{tTerm('teaserBadgeSecondary')}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted font-light leading-relaxed">
            {tTerm('subtitle')}
          </p>
          <div className="font-mono text-xs text-foreground/75 w-fit">
            <span className="text-gold-300">jorge@debian:~$</span>{' '}
            <span>ls -la && cat .audit_backup</span>
          </div>
        </div>

        <div className="inline-flex items-center pb-1 border-b border-gold-400/60 group-hover:border-gold-300 text-xs font-mono text-gold-200 transition-colors shrink-0 w-fit">
          <span>{tTerm('launchCta')}</span>
        </div>
      </PortfolioLink>
    </section>
  );
}
