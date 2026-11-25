import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
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
  const projects = await getPortfolioProjects(locale);

  return (
    <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
      <ProjectShowcase projects={projects} showHeader={false} showFilters={true} />
    </PortfolioPageShell>
  );
}
