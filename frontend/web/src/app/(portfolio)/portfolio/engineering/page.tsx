import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
import {
  EngineeringDetailView,
  getPortfolioEngineering,
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
  const pillars = await getPortfolioEngineering(locale);

  return (
    <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
      <EngineeringDetailView pillars={pillars} />
    </PortfolioPageShell>
  );
}
