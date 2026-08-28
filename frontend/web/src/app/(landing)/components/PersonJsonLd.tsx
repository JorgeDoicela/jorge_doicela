export default function PersonJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': 'https://jorgedoicela.com/#person',
        'name': 'Jorge Ismael Doicela Molina',
        'alternateName': ['Jorge Doicela', 'Jorge Doicela M.', 'Jorge Ismael Doicela'],
        'url': 'https://jorgedoicela.com',
        'image': 'https://jorgedoicela.com/landing/logo/logo_color.png',
        'jobTitle': 'Software Developer & DevOps Specialist',
        'description': 'Desarrollador de software, administrador de sistemas Linux y especialista en DevOps, Inteligencia Artificial y Ciberseguridad en Quito, Ecuador.',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Quito',
          'addressRegion': 'Pichincha',
          'addressCountry': 'EC'
        },
        'alumniOf': {
          '@type': 'EducationalOrganization',
          'name': 'Instituto Tecnológico Superior Traversari',
          'alternateName': 'ISTPET',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Quito',
            'addressRegion': 'Pichincha',
            'addressCountry': 'EC'
          }
        },
        'knowsAbout': [
          'Software Engineering',
          'DevOps',
          'System Administration',
          'Linux Debian & Arch Linux',
          'NestJS',
          'Next.js & React',
          'Artificial Intelligence & LLMs',
          'Cybersecurity & Server Hardening',
          'SQLite & Database Architecture',
          'Cloudflare Edge & Nginx'
        ],
        'sameAs': [
          'https://www.linkedin.com/in/jorgedoicela',
          'https://github.com/JorgeDoicela',
          'https://www.tiktok.com/@jorge.doicela',
          'https://portfolio.jorgedoicela.com',
          'https://software.jorgedoicela.com',
          'https://bible.jorgedoicela.com'
        ]
      },
      {
        '@type': 'WebSite',
        '@id': 'https://jorgedoicela.com/#website',
        'url': 'https://jorgedoicela.com',
        'name': 'Jorge Doicela | Portal Oficial',
        'publisher': {
          '@id': 'https://jorgedoicela.com/#person'
        },
        'inLanguage': ['es', 'en']
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
