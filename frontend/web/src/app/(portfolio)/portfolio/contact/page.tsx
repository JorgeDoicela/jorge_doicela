import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
import { ContactSection } from '../../features/contact';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Contact');
  return {
    title: `${t('pageTitle')} | Jorge Doicela`,
    description: t('pageSubtitle'),
  };
}

export default async function PortfolioContactPage() {
  const t = await getTranslations('Contact');

  return (
    <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
      <ContactSection showHeader={false} />
    </PortfolioPageShell>
  );
}
