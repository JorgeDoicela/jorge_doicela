import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
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
    <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
      <StackDetailView items={items} />
    </PortfolioPageShell>
  );
}
