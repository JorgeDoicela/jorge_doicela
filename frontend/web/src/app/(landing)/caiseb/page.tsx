import React from 'react';
import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';
import { ArrowUpRight, Sparkles, User } from 'lucide-react';

function GithubIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

import { LandingHeader } from '../widgets/landing-header';
import { LandingFooter } from '../widgets/landing-footer';
import { LandingVisualEffects } from '../widgets/cosmic-canvas';
import { SkipToContent } from '../shared';

interface ResourceLink {
  title: string;
  subtitle: string;
  url: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

interface LocaleContent {
  metaTitle: string;
  metaDescription: string;
  backLabel: string;
  title: string;
  subtitle: string;
  links: ResourceLink[];
}

const BILINGUAL_CONTENT: Record<'es' | 'en', LocaleContent> = {
  es: {
    metaTitle: 'Ateneo — Recursos de la Ponencia',
    metaDescription: 'Material complementario, código fuente y artefactos de IA de la ponencia de Jorge Doicela.',
    backLabel: 'Volver',
    title: 'Ateneo',
    subtitle: 'Material técnico complementario, repositorio de código fuente y artefactos de inteligencia artificial.',
    links: [
      {
        title: 'Ateneo',
        subtitle: 'Repositorio oficial de código fuente, arquitectura y especificaciones del proyecto en GitHub.',
        url: 'https://github.com/JorgeDoicela/ateneo',
        category: 'Código & Desarrollo',
        icon: GithubIcon,
        tag: 'GitHub',
      },
      {
        title: 'Modelos de IA en Hugging Face',
        subtitle: 'Colección de modelos de lenguaje, datasets, pipelines y artefactos de inteligencia artificial.',
        url: 'https://huggingface.co/doiceladev',
        category: 'Modelos & IA',
        icon: Sparkles,
        tag: 'Hugging Face',
      },
      {
        title: 'Jorge Doicela',
        subtitle: 'Desarrollador de software, estudiante de Ingeniería en IA y Ciberseguridad. Portafolio, proyectos y contacto.',
        url: 'https://portfolio.jorgedoicela.com',
        category: 'Autor & Ponente',
        icon: User,
        tag: 'Portafolio',
      },
    ],
  },
  en: {
    metaTitle: 'Ateneo — Presentation Resources',
    metaDescription: 'Supplementary materials, source code repository, and AI artifacts from Jorge Doicela presentation.',
    backLabel: 'Back',
    title: 'Ateneo',
    subtitle: 'Supplementary presentation materials, source code repository, and artificial intelligence artifacts.',
    links: [
      {
        title: 'Ateneo',
        subtitle: 'Official source code repository, architecture, and project specifications on GitHub.',
        url: 'https://github.com/JorgeDoicela/ateneo',
        category: 'Code & Development',
        icon: GithubIcon,
        tag: 'GitHub',
      },
      {
        title: 'AI Models on Hugging Face',
        subtitle: 'Collection of language models, datasets, pipelines, and artificial intelligence artifacts.',
        url: 'https://huggingface.co/doiceladev',
        category: 'Models & AI',
        icon: Sparkles,
        tag: 'Hugging Face',
      },
      {
        title: 'Jorge Doicela',
        subtitle: 'Software developer, AI Engineering and Cybersecurity student. Portfolio, projects, and contact.',
        url: 'https://portfolio.jorgedoicela.com',
        category: 'Author & Speaker',
        icon: User,
        tag: 'Portfolio',
      },
    ],
  },
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es';
  const t = BILINGUAL_CONTENT[locale];

  return {
    title: t.metaTitle,
    description: t.metaDescription,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function CaisebPage() {
  const locale = (await getLocale()) === 'en' ? 'en' : 'es';
  const t = BILINGUAL_CONTENT[locale];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden px-4 sm:px-6 md:px-10 py-6 sm:py-8">
      <SkipToContent />

      {/* Capas de Fondo Cósmico y Partículas Nativas */}
      <LandingVisualEffects />

      {/* Cabecera de Navegación con Retorno a Inicio */}
      <LandingHeader showBackLink backHref="/" backLabel={t.backLabel} />

      {/* Contenido Principal */}
      <main
        id="main-content"
        className="w-full max-w-6xl mx-auto z-10 flex-grow flex flex-col justify-center items-center pt-20 sm:pt-24 pb-8 outline-none focus:outline-none my-auto"
        tabIndex={-1}
      >
        {/* Encabezado de la Sección */}
        <div className="text-center mb-8 sm:mb-10 w-full animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            {t.title}
          </h1>
          <p className="mt-3 text-sm sm:text-base text-text-muted max-w-lg mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Cuadrícula de 3 Columnas Adaptativa */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 items-stretch">
          {t.links.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col justify-between w-full h-full p-6 sm:p-7 rounded-2xl bg-card border border-card-border backdrop-blur-xl transition-all duration-300 hover:border-card-hover-border hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-0.5 active:scale-[0.99] cursor-pointer"
              >
                <div>
                  {/* Fila Superior: Categoría, Tag y Flecha de Enlace */}
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono uppercase tracking-wider text-text-subtitle">
                        {link.category}
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-inner-card border border-inner-card-border text-text-muted">
                        {link.tag}
                      </span>
                    </div>

                    <div className="shrink-0 text-text-subtitle group-hover:text-foreground group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all p-1">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Cuerpo: Icono y Textos */}
                  <div className="flex items-start gap-3.5 pt-1">
                    <div className="shrink-0 pt-0.5 text-foreground group-hover:text-indigo-400 transition-colors">
                      <IconComponent className="w-6 h-6" />
                    </div>

                    <div className="space-y-1.5">
                      <h2 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                        {link.title}
                      </h2>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                        {link.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </main>

      {/* Footer Compacto anclado al fondo */}
      <LandingFooter variant="compact" className="z-10 mt-auto pt-4" />
    </div>
  );
}
