import { getTranslations } from 'next-intl/server';
import { ArrowRight } from 'lucide-react';
import { PortfolioLink } from '../../../shared';
import { ContactForm } from './ContactForm';

interface ContactSectionProps {
  viewAllHref?: string;
  showHeader?: boolean;
}

export async function ContactSection({
  viewAllHref,
  showHeader = true,
}: ContactSectionProps) {
  const tContact = await getTranslations('Contact');

  return (
    <section id="contact" className="flex flex-col gap-8 scroll-mt-24">
      {showHeader && (
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-light text-foreground mb-1">
              {tContact('thesisTitle')}
            </h2>
            {viewAllHref && (
              <PortfolioLink
                href={viewAllHref}
                className="group inline-flex items-center gap-1.5 text-[11px] font-mono text-gold-400 hover:text-gold-200 transition-colors shrink-0"
              >
                <span>{tContact('viewAll')}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </PortfolioLink>
            )}
          </div>
          <p className="text-muted text-xs md:text-sm leading-relaxed font-light max-w-3xl">
            {tContact('thesisDesc')}
          </p>
        </div>
      )}

      {/* Cuadrícula Formulario + Fichas Alineadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 items-stretch">
        {/* Columna Principal: Formulario Amplio (2 cols) */}
        <div className="md:col-span-2">
          <ContactForm />
        </div>

        {/* Columna Lateral: Áreas de Contacto & Compromiso (1 col) */}
        <div className="md:col-span-1 flex flex-col justify-between py-2">
          <div className="flex flex-col justify-center flex-1 pb-5 border-b border-border/40 gap-2">
            <h3 className="text-xs font-mono font-semibold text-foreground tracking-wide">
              {tContact('area1Title')}
            </h3>
            <p className="text-muted text-[12px] leading-relaxed font-light">
              {tContact('area1Desc')}
            </p>
          </div>

          <div className="flex flex-col justify-center flex-1 py-5 border-b border-border/40 gap-2">
            <h3 className="text-xs font-mono font-semibold text-foreground tracking-wide">
              {tContact('area2Title')}
            </h3>
            <p className="text-muted text-[12px] leading-relaxed font-light">
              {tContact('area2Desc')}
            </p>
          </div>

          <div className="flex flex-col justify-center flex-1 pt-5 gap-2">
            <h3 className="text-xs font-mono font-semibold text-foreground tracking-wide">
              {tContact('area3Title')}
            </h3>
            <p className="text-muted text-[12px] leading-relaxed font-light">
              {tContact('area3Desc')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
