import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioHeader } from '../../components/PortfolioHeader';
import { PortfolioFooter } from '../../components/PortfolioFooter';
import { StackDetailView, getPortfolioStack } from '../../features/stack';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Stack');
  return {
    title: `${t('pageTitle')} | Jorge Doicela`,
    description: t('pageSubtitle'),
  };
}

export default async function PortfolioStackPage() {
  const locale = await getLocale();
  const t = await getTranslations('Stack');
  const items = await getPortfolioStack(locale);

  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground pt-16 md:pt-11 pb-10 md:pb-12 px-4 sm:px-6 md:px-10 lg:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">
      <PortfolioHeader />

      <div className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto flex flex-col gap-12 animate-fade-up">
        <div className="flex flex-col gap-3 pb-2">
          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            {t('pageTitle')}
          </h1>
          <p className="text-muted text-xs md:text-sm font-light max-w-3xl leading-relaxed">
            {t('pageSubtitle')}
          </p>
        </div>

        <StackDetailView items={items} />
      </div>

      <PortfolioFooter />
    </div>
  );
}
