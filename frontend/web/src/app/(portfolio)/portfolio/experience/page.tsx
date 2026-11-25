import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
import { ExperienceDetailView, getPortfolioExperience } from '../../features/experience';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Experience');
  return {
    title: `${t('pageTitle')} | Jorge Doicela`,
    description: t('pageSubtitle'),
  };
}

export default async function PortfolioExperiencePage() {
  const locale = await getLocale();
  const t = await getTranslations('Experience');
  const items = await getPortfolioExperience(locale);

  return (
    <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
      <ExperienceDetailView items={items} />
    </PortfolioPageShell>
  );
}
