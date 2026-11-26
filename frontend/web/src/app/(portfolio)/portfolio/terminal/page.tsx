import type { Metadata } from 'next';
import { getLocale, getTranslations } from 'next-intl/server';
import { PortfolioPageShell } from '../../components/PortfolioPageShell';
import { TerminalConsole } from '../../features/terminal';
import { LabsBoard, getPortfolioLabs } from '../../features/labs';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('Terminal');
    return {
        title: `${t('pageTitle')} | Jorge Doicela`,
        description: t('pageSubtitle'),
    };
}

export default async function PortfolioTerminalPage() {
    const locale = await getLocale();
    const t = await getTranslations('Terminal');
    const challenges = await getPortfolioLabs(locale);

    return (
        <PortfolioPageShell title={t('pageTitle')} subtitle={t('pageSubtitle')}>
            {/* Consola Tri-Modal Interactiva (Guiada + Docker VPS + Túnel) */}
            <TerminalConsole />

            <hr aria-hidden="true" className="w-full border-0 border-t border-border/50" />

            {/* Tablero Interactivo de Retos CTF (Validación SHA-256 en Backend) */}
            <LabsBoard challenges={challenges} />
        </PortfolioPageShell>
    );
}
