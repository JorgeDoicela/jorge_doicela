import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
import { AboutDetailView, getPortfolioProfile } from '../../features/about';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('About');
  return {
    title: `${t('pageTitle')} | Jorge Doicela`,
    description: t('pageSubtitle'),
  };
}

export default async function PortfolioAboutPage() {
  const locale = await getLocale();
  const t = await getTranslations('About');
  const profile = await getPortfolioProfile(locale);

  return (
    <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
      <AboutDetailView profile={profile} />
    </PortfolioPageShell>
  );
}
