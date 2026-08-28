export default function PortfolioJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfilePage',
        '@id': 'https://portfolio.jorgedoicela.com/#profile',
        'url': 'https://portfolio.jorgedoicela.com',
        'name': 'Portafolio Profesional | Jorge Ismael Doicela Molina',
        'description': 'Portafolio interactivo de ingeniería de software, terminal SSH virtual sobre WebSockets, proyectos y stack técnico de Jorge Doicela.',
        'inLanguage': ['es', 'en'],
        'mainEntity': {
          '@type': 'Person',
          '@id': 'https://jorgedoicela.com/#person',
          'name': 'Jorge Ismael Doicela Molina',
          'alternateName': ['Jorge Doicela', 'Jorge Doicela M.'],
          'jobTitle': 'Software Developer, DevOps & SysAdmin',
          'url': 'https://portfolio.jorgedoicela.com',
          'alumniOf': {
            '@type': 'EducationalOrganization',
            'name': 'Instituto Tecnológico Superior Traversari (ISTPET)',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Quito',
              'addressCountry': 'EC'
            }
          },
          'sameAs': [
            'https://www.linkedin.com/in/jorgedoicela',
            'https://github.com/JorgeDoicela',
            'https://www.tiktok.com/@jorge.doicela',
            'https://jorgedoicela.com',
            'https://software.jorgedoicela.com',
            'https://bible.jorgedoicela.com'
          ]
        }
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
