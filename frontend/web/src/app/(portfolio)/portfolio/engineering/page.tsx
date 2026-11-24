import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioHeader } from '../../components/PortfolioHeader';
import {
  EngineeringDetailView,
  getPortfolioEngineering,
  getServerTelemetry,
} from '../../features/engineering';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Engineering');
  return {
    title: `${t('pageTitle')} | Jorge Doicela`,
    description: t('pageSubtitle'),
  };
}

export default async function PortfolioEngineeringPage() {
  const locale = await getLocale();
  const t = await getTranslations('Engineering');
  const tFooter = await getTranslations('Footer');

  const [pillars, telemetry] = await Promise.all([
    getPortfolioEngineering(locale),
    getServerTelemetry(),
  ]);

  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">
      <PortfolioHeader />

      <div className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto flex flex-col gap-12 animate-fade-up">
        <div className="flex flex-col gap-3 border-b border-border/40 pb-8">
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            {t('pageTitle')}
          </h1>
          <p className="text-muted text-xs md:text-sm font-light max-w-3xl leading-relaxed">
            {t('pageSubtitle')}
          </p>
        </div>

        <EngineeringDetailView pillars={pillars} telemetry={telemetry} />
      </div>

      <footer className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto mt-20 md:mt-28 pt-8 pb-12 flex items-center justify-center text-center text-gold-s/40 text-[10px] tracking-[0.2em] uppercase font-mono">
        <span>{tFooter('copyright', { year: new Date().getFullYear().toString() })}</span>
      </footer>
    </div>
  );
}
