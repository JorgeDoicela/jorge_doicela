import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioHeader } from '../../components/PortfolioHeader';
import { ProjectShowcase, getPortfolioProjects } from '../../features/projects';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Projects');
  return {
    title: `${t('pageTitle')} | Jorge Doicela`,
    description: t('pageSubtitle'),
  };
}

export default async function PortfolioProjectsPage() {
  const locale = await getLocale();
  const t = await getTranslations('Projects');
  const tFooter = await getTranslations('Footer');
  const projects = await getPortfolioProjects(locale);

  return (
    <div className="portfolio-shell min-h-screen bg-background text-foreground py-16 md:py-24 px-4 sm:px-6 md:px-10 lg:px-12 relative selection:bg-[rgba(197,168,122,0.18)] selection:text-gold-100 transition-colors duration-300">
      <PortfolioHeader />

      <div className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto flex flex-col gap-12 animate-fade-up">
        <div className="flex flex-col gap-4 border-b border-border/40 pb-8">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-xs font-mono text-gold-400 hover:text-gold-200 transition-colors w-fit"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>{t('backToPortfolio')}</span>
          </Link>

          <h1 className="text-3xl md:text-4xl font-light text-foreground tracking-tight">
            {t('pageTitle')}
          </h1>
          <p className="text-muted text-xs md:text-sm font-light max-w-3xl leading-relaxed">
            {t('pageSubtitle')}
          </p>
        </div>

        <ProjectShowcase projects={projects} />
      </div>

      <footer className="w-full max-w-[1420px] 2xl:max-w-[1540px] mx-auto mt-20 md:mt-28 pt-8 pb-12 flex items-center justify-center text-center text-gold-s/40 text-[10px] tracking-[0.2em] uppercase font-mono">
        <span>{tFooter('copyright', { year: new Date().getFullYear().toString() })}</span>
      </footer>
    </div>
  );
}
