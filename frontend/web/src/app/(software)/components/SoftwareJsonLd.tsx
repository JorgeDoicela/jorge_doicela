interface SoftwareJsonLdProps {
  locale?: string;
}

export default function SoftwareJsonLd({ locale = 'es' }: SoftwareJsonLdProps) {
  const isEn = locale === 'en';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['WebSite', 'SoftwareApplication'],
        '@id': 'https://software.jorgedoicela.com/#software-hub',
        'url': 'https://software.jorgedoicela.com',
        'name': 'Software | Jorge Doicela',
        'applicationCategory': 'DeveloperApplication, EducationalApplication',
        'operatingSystem': 'Web, Linux, Windows, macOS',
        'description': isEn
          ? 'Technology platform and engineering hub with 8 specialized areas: Tech News, Software Architecture Blog, Technical Forums, AI & MCP Servers Directory, Cybersecurity and hardening, Interactive Tutorials, Open Source Projects, and Infrastructure, Servers & Cloud.'
          : 'Plataforma tecnológica y centro de ingeniería con 8 áreas especializadas: Noticias de tecnología, Blog de arquitectura de software, Foros comunitarios, Directorio de IA y MCP Servers, Ciberseguridad y bastionado, Tutoriales interactivos, Proyectos open source e Infraestructura, Servidores y Cloud.',
        'inLanguage': ['es', 'en'],
        'author': {
          '@type': 'Person',
          '@id': 'https://jorgedoicela.com/#person',
          'name': 'Jorge Ismael Doicela Molina',
          'url': 'https://jorgedoicela.com'
        },
        'hasPart': [
          {
            '@type': 'WebPage',
            'name': isEn ? 'Step-by-Step Tutorials' : 'Tutoriales Paso a Paso',
            'url': 'https://software.jorgedoicela.com/tutorials'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'Software & Tech News' : 'Noticias de Software & Tecnología',
            'url': 'https://software.jorgedoicela.com/news'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'AI Directory, Agents & MCP Servers' : 'Directorio de IA, Agentes y Servidores MCP',
            'url': 'https://software.jorgedoicela.com/ai'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'Cybersecurity & Remediation Guides' : 'Ciberseguridad y Guías de Remediación',
            'url': 'https://software.jorgedoicela.com/cybersecurity'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'Infrastructure, Servers & Cloud' : 'Infraestructura, Servidores & Cloud',
            'url': 'https://software.jorgedoicela.com/infrastructure'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'Projects Showcase Catalog' : 'Catálogo de Proyectos Showcase',
            'url': 'https://software.jorgedoicela.com/projects'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'Systems Architecture Blog' : 'Blog de Arquitectura de Sistemas',
            'url': 'https://software.jorgedoicela.com/blog'
          },
          {
            '@type': 'WebPage',
            'name': isEn ? 'Technical Discussion Forums' : 'Foros Técnicos de Discusión',
            'url': 'https://software.jorgedoicela.com/forum'
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
